import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { randomUUID, timingSafeEqual } from "crypto";
import { 
  analyzeBehavior, 
  generateChatResponse, 
  generateAICascadeResponse, 
  analyzeTikTokAccount,
  analyzeTikTokVideo,
  type BiasMode 
} from "./bias-engine";
import { scrapeTikTokProfile, extractUsernameFromUrl } from "./services/tiktok-scraper";
import { toMetricValue, calculateEngagementRate, calculateAverage } from "./utils/metrics";
import { checkRateLimit } from "./middleware/rate-limiter";
import { isValidTikTokUsername, sanitizeUsername } from "./utils/validators";
import { z } from "zod";
import { TIKTOK_RULES, INSTAGRAM_RULES, YOUTUBE_RULES } from "../client/src/data/platformRules";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Admin authentication middleware
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminSessionId = req.cookies?.bias_admin;
  
  if (!adminSessionId) {
    res.clearCookie('bias_admin');
    return res.status(401).json({ error: 'Unauthorized - Admin login required' });
  }
  
  const session = await storage.getAdminSession(adminSessionId);
  if (!session) {
    res.clearCookie('bias_admin');
    return res.status(401).json({ error: 'Unauthorized - Invalid or expired session' });
  }
  
  // Session valid - attach to request
  (req as any).adminUser = session.username;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or get session
  app.post("/api/session", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (sessionId) {
        const existing = await storage.getSession(sessionId);
        if (existing) {
          return res.json(existing);
        }
      }
      
      // Create new session
      const newSession = await storage.createSession({
        sessionId: sessionId || `session-${Date.now()}`,
        tokensRemaining: 100,
        freeRequestsUsed: 0,
      });
      
      res.json(newSession);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analyze behavior (with file upload support)
  app.post("/api/analyze", upload.single('file'), async (req, res) => {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    try {
      const file = req.file;
      
      console.log(`🔍 [${requestId}] Analysis request started`);
      
      // Parse data from form-data or JSON
      const rawData = file ? {
        sessionId: req.body.sessionId,
        mode: req.body.mode,
        inputType: req.body.inputType,
        content: req.body.content || '',
        platform: req.body.platform,
      } : req.body;
      
      const schema = z.object({
        sessionId: z.string(),
        mode: z.enum(['creator', 'academic', 'hybrid']),
        inputType: z.enum(['video', 'text', 'photo', 'audio']),
        content: z.string().optional(),
        platform: z.enum(['tiktok', 'instagram', 'youtube']).optional(),
      });
      
      let data;
      try {
        data = schema.parse(rawData);
        console.log(`✅ [${requestId}] Validation passed - Mode: ${data.mode}, Type: ${data.inputType}, Platform: ${data.platform || 'N/A'}`);
      } catch (validationError: any) {
        console.error(`❌ [${requestId}] Validation failed:`, validationError.errors);
        return res.status(400).json({ 
          error: 'Invalid input',
          message: 'Request validation failed. Please check your input format.',
          messageId: 'Format input tidak valid. Mohon periksa kembali data yang dikirim.',
          details: validationError.errors 
        });
      }
      
      // Get session
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        console.error(`❌ [${requestId}] Session not found: ${data.sessionId}`);
        return res.status(404).json({ 
          error: 'Session not found',
          message: 'Your session could not be found. Please refresh the page.',
          messageId: 'Sesi tidak ditemukan. Silakan refresh halaman.',
        });
      }
      
      // Check if user has free requests or tokens
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining <= 0) {
        console.warn(`⚠️ [${requestId}] Insufficient tokens for session ${data.sessionId}`);
        return res.status(403).json({ 
          error: 'No tokens remaining',
          message: 'Token balance is empty. Please top up to continue.',
          messageId: 'Saldo token habis. Silakan top up untuk melanjutkan.',
        });
      }
      
      // Prepare content for analysis
      let analysisContent = data.content || '';
      
      // If file uploaded, add file metadata to content
      if (file) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        analysisContent = `[File uploaded: ${file.originalname} (${fileSizeMB}MB, ${file.mimetype})]\n\n` + analysisContent;
        console.log(`📁 [${requestId}] File received: ${file.originalname}, size: ${fileSizeMB}MB`);
      }
      
      if (!analysisContent || analysisContent.trim().length < 10) {
        console.error(`❌ [${requestId}] Insufficient content for analysis (${analysisContent.length} chars)`);
        return res.status(400).json({
          error: 'Insufficient content',
          message: 'Please provide detailed description or content for analysis (minimum 10 characters).',
          messageId: 'Harap berikan deskripsi atau konten yang cukup detail untuk dianalisis (minimum 10 karakter).',
        });
      }
      
      // Perform analysis using BIAS engine
      console.log(`🤖 [${requestId}] Starting BIAS analysis... (content length: ${analysisContent.length} chars)`);
      let result;
      try {
        result = await analyzeBehavior({
          mode: data.mode,
          inputType: data.inputType,
          content: analysisContent,
          platform: data.platform,
        });
        const analysisTime = Date.now() - startTime;
        console.log(`✅ [${requestId}] Analysis completed successfully in ${analysisTime}ms - Overall score: ${result.overallScore}/10`);
      } catch (analysisError: any) {
        console.error(`❌ [${requestId}] Analysis engine failed:`, analysisError);
        return res.status(500).json({
          error: 'Analysis failed',
          message: 'Our Ai analysis engine encountered an error. This could be due to high load or API timeout. Please try again.',
          messageId: 'Analisis Ai mengalami error. Ini bisa karena server load tinggi atau timeout. Silakan coba lagi.',
          details: process.env.NODE_ENV === 'development' ? analysisError.message : undefined,
        });
      }
      
      // Save analysis
      try {
        await storage.createAnalysis({
          sessionId: data.sessionId,
          mode: data.mode,
          inputType: data.inputType,
          inputContent: analysisContent,
          analysisResult: JSON.stringify(result),
        });
        console.log(`💾 [${requestId}] Analysis saved to storage`);
      } catch (storageError: any) {
        console.error(`⚠️ [${requestId}] Failed to save analysis (non-critical):`, storageError);
        // Don't fail the request if storage fails - analysis was successful
      }
      
      // Update session (deduct token or increment free request)
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + 1,
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - 1,
        });
      }
      
      const totalTime = Date.now() - startTime;
      console.log(`🎉 [${requestId}] Request completed successfully in ${totalTime}ms`);
      
      res.json({
        analysis: result,
        session: await storage.getSession(data.sessionId),
      });
    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      console.error(`💥 [${requestId}] Unexpected error after ${totalTime}ms:`, error);
      
      // Determine user-friendly error message
      let userMessage = 'An unexpected error occurred. Please try again.';
      let userMessageId = 'Terjadi error tidak terduga. Silakan coba lagi.';
      
      if (error.message?.includes('timeout')) {
        userMessage = 'Analysis timed out. Please try with shorter content or try again later.';
        userMessageId = 'Analisis timeout. Coba dengan konten lebih pendek atau coba lagi nanti.';
      } else if (error.message?.includes('OpenAI') || error.message?.includes('API')) {
        userMessage = 'Ai service temporarily unavailable. Please try again in a few moments.';
        userMessageId = 'Layanan Ai sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.';
      }
      
      res.status(500).json({ 
        error: error.message,
        message: userMessage,
        messageId: userMessageId,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          name: error.name,
        } : undefined,
      });
    }
  });

  // Analyze Social Media Account with WEB SCRAPING
  app.post("/api/analyze-account", async (req, res) => {
    try {
      const schema = z.object({
        platform: z.enum(['tiktok', 'instagram', 'youtube']),
        username: z.string().min(1),
      });
      
      const data = schema.parse(req.body);
      
      // Only TikTok is supported with web scraping for now
      if (data.platform !== 'tiktok') {
        return res.status(400).json({
          error: 'Platform not supported yet',
          message: 'Saat ini hanya TikTok yang didukung. Instagram dan YouTube akan segera hadir!',
          messageId: 'Saat ini hanya TikTok yang didukung. Instagram dan YouTube akan segera hadir!',
        });
      }
      
      // Rate limiting (10 requests per minute per IP)
      const clientIp = req.ip || 'unknown';
      const rateLimit = checkRateLimit(`analyze-account:${clientIp}`, {
        windowMs: 60000,
        maxRequests: 10
      });
      
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
          messageId: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        });
      }
      
      // Extract username if URL provided
      let cleanUsername = data.username;
      if (data.username.includes('@') || data.username.includes('tiktok.com')) {
        const extracted = extractUsernameFromUrl(data.username);
        if (extracted) {
          cleanUsername = extracted;
        }
      }
      
      // Validate username to prevent SSRF/path traversal
      if (!isValidTikTokUsername(cleanUsername)) {
        return res.status(400).json({
          error: 'Invalid username',
          message: 'Username tidak valid. Gunakan format @username yang benar (2-24 karakter, huruf/angka/underscore/titik).',
          messageId: 'Username tidak valid. Gunakan format @username yang benar (2-24 karakter, huruf/angka/underscore/titik).'
        });
      }
      
      // Sanitize username for safety
      cleanUsername = sanitizeUsername(cleanUsername);
      
      // Use WEB SCRAPING to get real TikTok data
      const scrapedData = await scrapeTikTokProfile(cleanUsername);
      
      // Calculate derived metrics using BigInt-safe methods
      const engagementRate = calculateEngagementRate(scrapedData.likesCount, scrapedData.followerCount);
      const avgViews = calculateAverage(scrapedData.likesCount, scrapedData.videoCount);
      
      // Convert BigInt metrics to MetricValue format (raw string + safe approx)
      const followersMetric = toMetricValue(scrapedData.followerCount);
      const followingMetric = toMetricValue(scrapedData.followingCount);
      const likesMetric = toMetricValue(scrapedData.likesCount);
      const videosMetric = toMetricValue(scrapedData.videoCount);
      
      // Return real data with BigInt-safe metrics
      res.json({
        success: true,
        platform: data.platform,
        username: scrapedData.username,
        displayName: scrapedData.nickname,
        profilePhotoUrl: scrapedData.avatarUrl,
        bio: scrapedData.signature,
        verified: scrapedData.verified,
        isPrivate: false,
        dataSource: 'web-scraper',
        metrics: {
          followers: followersMetric,
          following: followingMetric,
          likes: likesMetric,
          videos: videosMetric,
          engagementRate: parseFloat(engagementRate.toFixed(1)),
          avgViews: avgViews,
          followerGrowth: 0, // TODO: Implement growth tracking
          likeGrowth: 0, // TODO: Implement growth tracking
        },
        insights: {
          engagementAnalysis: 'detailed-analysis',
          growthStrategy: 'growth-recommendations',
        }
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: 'Input tidak valid',
          message: 'Username atau platform tidak sesuai format. Silakan periksa kembali.',
          messageId: 'Username atau platform tidak sesuai format. Silakan periksa kembali.',
        });
      }
      
      // Generic error in user-friendly language
      res.status(500).json({ 
        error: 'Gagal menganalisis akun',
        message: 'Maaf, terjadi kesalahan saat menganalisis akun. Kemungkinan: (1) Akun bersifat private atau tidak ditemukan, (2) Platform sedang bermasalah, atau (3) Username salah. Silakan coba akun publik lainnya.',
        messageId: 'Maaf, terjadi kesalahan saat menganalisis akun. Kemungkinan: (1) Akun bersifat private atau tidak ditemukan, (2) Platform sedang bermasalah, atau (3) Username salah. Silakan coba akun publik lainnya.',
      });
    }
  });

  // Chat with BIAS
  app.post("/api/chat", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        message: z.string().min(1),
        mode: z.enum(['creator', 'academic', 'hybrid']),
      });
      
      const data = schema.parse(req.body);
      
      // Get session
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      // Check tokens
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining <= 0) {
        return res.status(403).json({ 
          error: 'No tokens remaining',
          message: 'Token balance is empty. Please top up to continue.',
          messageId: 'Saldo token habis. Silakan top up untuk melanjutkan.',
        });
      }
      
      // Save user message
      await storage.createChat({
        sessionId: data.sessionId,
        role: 'user',
        message: data.message,
      });
      
      // Generate response using CASCADE Ai: OpenAI → Gemini → BIAS
      const { response, isOnTopic, provider } = await generateAICascadeResponse(data.message, data.mode);
      console.log(`Chat response from ${provider.toUpperCase()}`);
      
      // Save assistant response
      await storage.createChat({
        sessionId: data.sessionId,
        role: 'assistant',
        message: response,
      });
      
      // Deduct token only if on-topic
      if (isOnTopic) {
        if (session.freeRequestsUsed < 3) {
          await storage.updateSession(data.sessionId, {
            freeRequestsUsed: session.freeRequestsUsed + 1,
          });
        } else {
          await storage.updateSession(data.sessionId, {
            tokensRemaining: session.tokensRemaining - 1,
          });
        }
      }
      
      res.json({
        response,
        isOnTopic,
        session: await storage.getSession(data.sessionId),
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get chat history
  app.get("/api/chats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const chats = await storage.getChatsBySession(sessionId);
      res.json(chats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete chat history (Clear all messages)
  app.delete("/api/chats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearChatsBySession(sessionId);
      res.json({ success: true, message: 'Chat history cleared' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get analysis history
  app.get("/api/analyses/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const analyses = await storage.getAnalysesBySession(sessionId);
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // TIKTOK PRO ENDPOINTS
  // ========================================

  // Analyze TikTok Account
  app.post("/api/tiktok/profile", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        username: z.string().min(1),
        followers: z.number().min(0),
        following: z.number().min(0),
        totalLikes: z.number().min(0),
        videoCount: z.number().min(0),
        avgViews: z.number().min(0),
        avgEngagementRate: z.number().min(0),
        bio: z.string().optional(),
        verified: z.boolean().optional(),
      });

      const data = schema.parse(req.body);

      // Get session
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Check tokens (TikTok profile = 3 tokens)
      const tokenCost = 3;
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining < tokenCost) {
        return res.status(403).json({
          error: 'Insufficient tokens',
          message: `TikTok Profile Analysis requires ${tokenCost} tokens. Current balance: ${session.tokensRemaining}`,
          messageId: `Analisis TikTok Profile butuh ${tokenCost} token. Saldo: ${session.tokensRemaining}`,
        });
      }

      // Perform TikTok account analysis
      const analysis = await analyzeTikTokAccount({
        username: data.username,
        followers: data.followers,
        following: data.following,
        totalLikes: data.totalLikes,
        videoCount: data.videoCount,
        avgViews: data.avgViews,
        avgEngagementRate: data.avgEngagementRate,
        bio: data.bio,
        verified: data.verified,
      });

      // Save to database
      await storage.createTiktokAccount({
        sessionId: data.sessionId,
        username: data.username,
        followers: data.followers,
        following: data.following,
        totalLikes: data.totalLikes,
        totalVideos: data.videoCount,
        avgViews: data.avgViews,
        engagementRate: data.avgEngagementRate,
        bio: data.bio,
        verified: data.verified,
        analysisResult: JSON.stringify(analysis),
      });

      // Deduct tokens
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + tokenCost,
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - tokenCost,
        });
      }

      res.json({
        analysis,
        session: await storage.getSession(data.sessionId),
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Analyze TikTok Video
  app.post("/api/tiktok/video", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        videoId: z.string().min(1),
        description: z.string(),
        views: z.number().min(0),
        likes: z.number().min(0),
        comments: z.number().min(0),
        shares: z.number().min(0),
        duration: z.number().min(1),
        hashtags: z.array(z.string()),
        sounds: z.string().optional(),
        transcription: z.string().optional(),
      });

      const data = schema.parse(req.body);

      // Get session
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Check tokens (TikTok video = 4 tokens)
      const tokenCost = 4;
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining < tokenCost) {
        return res.status(403).json({
          error: 'Insufficient tokens',
          message: `TikTok Video Analysis requires ${tokenCost} tokens. Current balance: ${session.tokensRemaining}`,
          messageId: `Analisis TikTok Video butuh ${tokenCost} token. Saldo: ${session.tokensRemaining}`,
        });
      }

      // Perform TikTok video analysis
      const analysis = await analyzeTikTokVideo({
        videoId: data.videoId,
        description: data.description,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        duration: data.duration,
        hashtags: data.hashtags,
        sounds: data.sounds,
        transcription: data.transcription,
      });

      // Save to database
      await storage.createTiktokVideo({
        sessionId: data.sessionId,
        videoId: data.videoId,
        accountUsername: data.videoId, // Use videoId as placeholder for username
        description: data.description,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        duration: data.duration,
        hashtags: data.hashtags,
        soundName: data.sounds,
        analysisResult: JSON.stringify(analysis),
      });

      // Deduct tokens
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + tokenCost,
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - tokenCost,
        });
      }

      res.json({
        analysis,
        session: await storage.getSession(data.sessionId),
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get TikTok Account History
  app.get("/api/tiktok/accounts/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const accounts = await storage.getTiktokAccountsBySession(sessionId);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get TikTok Video History
  app.get("/api/tiktok/videos/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const videos = await storage.getTiktokVideosBySession(sessionId);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Library Contributions - Submit
  app.post("/api/library/contribute", async (req, res) => {
    try {
      const schema = z.object({
        term: z.string().min(1),
        termId: z.string().optional(),
        definition: z.string().min(10),
        definitionId: z.string().optional(),
        platform: z.enum(['tiktok', 'instagram', 'youtube']),
        username: z.string().min(1),
        example: z.string().optional(),
        exampleId: z.string().optional(),
      });
      
      const data = schema.parse(req.body);
      
      const contribution = await storage.createLibraryContribution({
        ...data,
        status: 'pending',
      });
      
      res.json({ success: true, contribution });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Verify Password (deprecated, use /api/admin/login instead)
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        return res.status(500).json({ error: 'Admin password not configured' });
      }
      
      if (password === adminPassword) {
        res.json({ success: true, isAdmin: true });
      } else {
        res.status(401).json({ success: false, isAdmin: false, error: 'Invalid password' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Secure Login (session-based)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }
      
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminUsername = process.env.ADMIN_USERNAME || 'superadmin';
      
      if (!adminPassword) {
        return res.status(500).json({ error: 'Admin credentials not configured' });
      }
      
      // Timing-safe comparison for password
      const passwordMatch = Buffer.from(password).length === Buffer.from(adminPassword).length && 
                           timingSafeEqual(
                             Buffer.from(password), 
                             Buffer.from(adminPassword)
                           );
      
      const usernameMatch = username === adminUsername;
      
      if (!usernameMatch || !passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Create admin session
      const sessionId = randomUUID();
      const session = await storage.createAdminSession(sessionId, adminUsername);
      
      // Clean expired sessions
      await storage.cleanExpiredAdminSessions();
      
      // Set secure HttpOnly cookie
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('bias_admin', sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
      
      res.json({ 
        success: true, 
        username: adminUsername,
        expiresAt: session.expiresAt,
      });
    } catch (error: any) {
      console.error('[ADMIN] Login error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Logout
  app.post("/api/admin/logout", async (req, res) => {
    try {
      const sessionId = req.cookies?.bias_admin;
      
      if (sessionId) {
        await storage.deleteAdminSession(sessionId);
      }
      
      res.clearCookie('bias_admin');
      res.json({ success: true });
    } catch (error: any) {
      console.error('[ADMIN] Logout error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Check Session
  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    try {
      const username = (req as any).adminUser;
      res.json({ authenticated: true, username });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Get Pending Contributions
  app.get("/api/library/contributions/pending", async (req, res) => {
    try {
      const contributions = await storage.getPendingContributions();
      res.json(contributions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Update Contribution
  app.put("/api/library/contributions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        term: z.string().optional(),
        termId: z.string().optional(),
        definition: z.string().optional(),
        definitionId: z.string().optional(),
        example: z.string().optional(),
        exampleId: z.string().optional(),
      });
      
      const updates = schema.parse(req.body);
      const contribution = await storage.updateLibraryContribution(id, updates);
      
      if (!contribution) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
      
      res.json(contribution);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Approve Contribution
  app.post("/api/library/contributions/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const contribution = await storage.updateLibraryContribution(id, {
        status: 'approved',
        approvedAt: new Date(),
      });
      
      if (!contribution) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
      
      res.json({ success: true, contribution });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Reject Contribution
  app.post("/api/library/contributions/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const contribution = await storage.updateLibraryContribution(id, {
        status: 'rejected',
      });
      
      if (!contribution) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
      
      res.json({ success: true, contribution });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public - Get Approved Contributions
  app.get("/api/library/contributions/approved", async (req, res) => {
    try {
      // Disable caching to always get fresh data
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const contributions = await storage.getApprovedContributions();
      res.json(contributions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Delete Contribution (for approved or rejected items)
  app.delete("/api/library/contributions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLibraryContribution(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Get ALL Library Content (original + contributions)
  app.get("/api/library/all", async (req, res) => {
    try {
      // Convert platform rules to flat items
      const tiktokItems = TIKTOK_RULES.flatMap(category =>
        category.rules.map(rule => ({
          id: `tiktok-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: 'tiktok' as const,
          source: 'original' as const,
          category: category.name,
          categoryId: category.nameId,
        }))
      );

      const instagramItems = INSTAGRAM_RULES.flatMap(category =>
        category.rules.map(rule => ({
          id: `instagram-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: 'instagram' as const,
          source: 'original' as const,
          category: category.name,
          categoryId: category.nameId,
        }))
      );

      const youtubeItems = YOUTUBE_RULES.flatMap(category =>
        category.rules.map(rule => ({
          id: `youtube-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: 'youtube' as const,
          source: 'original' as const,
          category: category.name,
          categoryId: category.nameId,
        }))
      );
      
      // Get approved contributions
      const contributions = await storage.getApprovedContributions();
      
      // Get deleted items
      const deletedItems = await storage.getDeletedLibraryItems();
      
      // Combine all items and filter out deleted ones
      const allItems = [
        ...tiktokItems,
        ...instagramItems,
        ...youtubeItems,
        ...contributions.map(c => ({
          id: c.id,
          term: c.term,
          termId: c.termId || '',
          definition: c.definition,
          definitionId: c.definitionId || '',
          platform: c.platform,
          source: 'user-contribution' as const,
          username: c.username,
          approvedAt: c.approvedAt,
        }))
      ].filter(item => !deletedItems.includes(item.id));
      
      console.log(`[LIBRARY] Returning ${allItems.length} library items`);
      res.json(allItems);
    } catch (error: any) {
      console.error('[LIBRARY] Error fetching all library content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Bulk Delete Library Items
  app.post("/api/library/bulk-delete", async (req, res) => {
    try {
      const { itemIds } = req.body;
      
      if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({ error: 'itemIds must be a non-empty array' });
      }
      
      console.log(`[LIBRARY] Bulk deleting ${itemIds.length} items:`, itemIds);
      
      let deletedCount = 0;
      
      for (const id of itemIds) {
        // Check if it's a user contribution
        const contribution = await storage.getLibraryContribution(id);
        
        if (contribution) {
          // Delete user contribution
          const deleted = await storage.deleteLibraryContribution(id);
          if (deleted) deletedCount++;
        } else {
          // Add to deleted items list (for original library content)
          await storage.addDeletedLibraryItem(id);
          deletedCount++;
        }
      }
      
      console.log(`[LIBRARY] Successfully deleted ${deletedCount} items`);
      res.json({ success: true, deletedCount });
    } catch (error: any) {
      console.error('[LIBRARY] Error bulk deleting:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics - Track page view
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { sessionId, page, language } = req.body;
      
      if (!sessionId || !page) {
        return res.status(400).json({ error: 'sessionId and page are required' });
      }
      
      await storage.trackPageView({
        sessionId,
        page,
        language: language || null,
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('[ANALYTICS] Error tracking page view:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics - Track feature usage
  app.post("/api/analytics/feature", async (req, res) => {
    try {
      const { sessionId, featureType, platform, mode, language, featureDetails } = req.body;
      
      if (!sessionId || !featureType) {
        return res.status(400).json({ error: 'sessionId and featureType are required' });
      }
      
      await storage.trackFeatureUsage({
        sessionId,
        featureType,
        platform: platform || null,
        mode: mode || null,
        language: language || null,
        featureDetails: featureDetails || null,
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('[ANALYTICS] Error tracking feature usage:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // BRAND MANAGEMENT ENDPOINTS (White-Label)
  // ========================================

  // Get brand by slug (public - for path-based routing)
  app.get("/api/brands/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const brand = await storage.getBrandBySlug(slug);
      
      if (!brand || !brand.isActive) {
        return res.status(404).json({ error: 'Brand not found' });
      }
      
      res.json(brand);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all active brands (public)
  app.get("/api/brands/active", async (req, res) => {
    try {
      const activeBrands = await storage.getActiveBrands();
      res.json(activeBrands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all brands (admin only)
  app.get("/api/brands", requireAdmin, async (req, res) => {
    try {
      const allBrands = await storage.getAllBrands();
      res.json(allBrands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create brand (admin only)
  app.post("/api/brands", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
        name: z.string().min(1).max(100),
        shortName: z.string().min(1).max(20),
        taglineEn: z.string().optional(),
        taglineId: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleId: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionId: z.string().optional(),
        colorPrimary: z.string().optional(),
        colorSecondary: z.string().optional(),
        logoUrl: z.string().optional(),
        tiktokHandle: z.string().optional(),
        tiktokUrl: z.string().optional(),
        instagramHandle: z.string().optional(),
        instagramUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().optional(),
      });
      
      const data = schema.parse(req.body);
      
      // Check if slug already exists
      const existing = await storage.getBrandBySlug(data.slug);
      if (existing) {
        return res.status(400).json({ error: 'Slug sudah digunakan' });
      }
      
      const brand = await storage.createBrand(data);
      res.status(201).json(brand);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update brand (admin only)
  app.put("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
        name: z.string().min(1).max(100).optional(),
        shortName: z.string().min(1).max(20).optional(),
        taglineEn: z.string().optional(),
        taglineId: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleId: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionId: z.string().optional(),
        colorPrimary: z.string().optional(),
        colorSecondary: z.string().optional(),
        logoUrl: z.string().optional(),
        tiktokHandle: z.string().optional(),
        tiktokUrl: z.string().optional(),
        instagramHandle: z.string().optional(),
        instagramUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().optional(),
      });
      
      const data = schema.parse(req.body);
      
      // If updating slug, check if new slug already exists
      if (data.slug) {
        const existing = await storage.getBrandBySlug(data.slug);
        if (existing && existing.id !== id) {
          return res.status(400).json({ error: 'Slug sudah digunakan' });
        }
      }
      
      const updated = await storage.updateBrand(id, data);
      if (!updated) {
        return res.status(404).json({ error: 'Brand not found' });
      }
      
      res.json(updated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Delete brand (admin only)
  app.delete("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBrand(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Brand not found' });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics - Get stats (admin only - requires session auth)
  app.get("/api/analytics/stats", requireAdmin, async (req, res) => {
    try {
      const { days } = req.query;
      const daysNum = days ? parseInt(days as string) : 7;
      
      const [
        pageViewStats,
        featureUsageStats,
        uniqueSessions,
        totalPageViews,
        totalFeatureUsage
      ] = await Promise.all([
        storage.getPageViewStats(daysNum),
        storage.getFeatureUsageStats(daysNum),
        storage.getUniqueSessionsCount(daysNum),
        storage.getTotalPageViews(daysNum),
        storage.getTotalFeatureUsage(daysNum),
      ]);
      
      res.json({
        period: `${daysNum} days`,
        overview: {
          uniqueSessions,
          totalPageViews,
          totalFeatureUsage,
        },
        pageViews: pageViewStats,
        featureUsage: featureUsageStats,
      });
    } catch (error: any) {
      console.error('[ANALYTICS] Error getting stats:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // HYBRID CHAT (Local + Ai Fallback)
  // ==========================================
  
  app.post("/api/chat/hybrid", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const { hybridChat } = await import('./chat/hybrid-chat');
      const result = await hybridChat({ 
        message, 
        sessionId: sessionId || 'anonymous' 
      });
      
      res.json(result);
    } catch (error: any) {
      console.error('[HYBRID_CHAT] Error:', error);
      res.status(500).json({ 
        response: 'Maaf bro, ada error. Coba lagi ya!',
        source: 'local',
        error: error.message 
      });
    }
  });

  // Learning Library Stats (Admin)
  app.get("/api/admin/learning-stats", requireAdmin, async (req, res) => {
    try {
      const { getLearningStats } = await import('./utils/learning-system');
      const stats = await getLearningStats();
      res.json(stats);
    } catch (error: any) {
      console.error('[LEARNING_STATS] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // Ai TOKEN LIMIT SETTINGS (Admin Only)
  // ==========================================
  
  app.get("/api/admin/ai-settings", requireAdmin, async (req, res) => {
    try {
      const { getConfig, getUsageStats } = await import('./utils/ai-rate-limiter');
      const config = getConfig();
      res.json({ config });
    } catch (error: any) {
      console.error('[AI_SETTINGS] Error getting config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/ai-settings", requireAdmin, async (req, res) => {
    try {
      const { updateConfig, getConfig } = await import('./utils/ai-rate-limiter');
      const newConfig = req.body;
      
      // Validate input
      const validKeys = ['maxRequestsPerHour', 'maxRequestsPerDay', 'maxTokensPerDay', 'maxTokensPerRequest'];
      const updates: any = {};
      
      for (const key of validKeys) {
        if (newConfig[key] !== undefined) {
          const value = parseInt(newConfig[key]);
          if (isNaN(value) || value < 0) {
            return res.status(400).json({ error: `Invalid value for ${key}` });
          }
          updates[key] = value;
        }
      }
      
      updateConfig(updates);
      res.json({ success: true, config: getConfig() });
    } catch (error: any) {
      console.error('[AI_SETTINGS] Error updating config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/ai-usage", requireAdmin, async (req, res) => {
    try {
      const { getConfig } = await import('./utils/ai-rate-limiter');
      res.json({ 
        config: getConfig(),
        note: 'Per-session usage stats reset on server restart',
      });
    } catch (error: any) {
      console.error('[AI_USAGE] Error getting usage:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // EXPERT KNOWLEDGE BASE API ROUTES
  // ==========================================

  // Get all expert knowledge entries (with optional filtering)
  app.get("/api/expert-knowledge", async (req, res) => {
    try {
      const { category, subcategory, level, search } = req.query;
      const entries = await storage.getExpertKnowledge({
        category: category as string,
        subcategory: subcategory as string,
        level: level as string,
        search: search as string,
      });
      res.json(entries);
    } catch (error: any) {
      console.error('[EXPERT_KNOWLEDGE] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all hooks (with optional filtering)
  app.get("/api/hooks", async (req, res) => {
    try {
      const { hookType, category, search } = req.query;
      const entries = await storage.getHooks({
        hookType: hookType as string,
        category: category as string,
        search: search as string,
      });
      res.json(entries);
    } catch (error: any) {
      console.error('[HOOKS] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all storytelling frameworks
  app.get("/api/storytelling-frameworks", async (req, res) => {
    try {
      const entries = await storage.getStorytellingFrameworks();
      res.json(entries);
    } catch (error: any) {
      console.error('[STORYTELLING] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get growth stage guide by follower count
  app.get("/api/growth-guides", async (req, res) => {
    try {
      const { followers } = req.query;
      const followerCount = followers ? parseInt(followers as string) : undefined;
      const entries = await storage.getGrowthStageGuides(followerCount);
      res.json(entries);
    } catch (error: any) {
      console.error('[GROWTH_GUIDES] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific growth stage guide
  app.get("/api/growth-guides/:stage", async (req, res) => {
    try {
      const { stage } = req.params;
      const entry = await storage.getGrowthStageGuideByStage(stage);
      if (!entry) {
        return res.status(404).json({ error: 'Growth stage not found' });
      }
      res.json(entry);
    } catch (error: any) {
      console.error('[GROWTH_GUIDES] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get response templates
  app.get("/api/response-templates", async (req, res) => {
    try {
      const { category } = req.query;
      const entries = await storage.getResponseTemplates(category as string);
      res.json(entries);
    } catch (error: any) {
      console.error('[RESPONSE_TEMPLATES] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get live streaming templates
  app.get("/api/live-streaming-templates", async (req, res) => {
    try {
      const { format, duration } = req.query;
      const entries = await storage.getLiveStreamingTemplates({
        format: format as string,
        duration: duration as string,
      });
      res.json(entries);
    } catch (error: any) {
      console.error('[LIVE_STREAMING] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get script templates
  app.get("/api/script-templates", async (req, res) => {
    try {
      const { category, duration, goal, level } = req.query;
      const entries = await storage.getScriptTemplates({
        category: category as string,
        duration: duration as string,
        goal: goal as string,
        level: level as string,
      });
      res.json(entries);
    } catch (error: any) {
      console.error('[SCRIPT_TEMPLATES] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
