import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "../db";
import { appSettings } from "@shared/schema";
import multer from "multer";
import { randomUUID, timingSafeEqual } from "crypto";
import OpenAI from "openai";
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
      
      // Save analyzed account to database for admin tracking
      try {
        await storage.createTiktokAccount({
          sessionId: req.ip || 'anonymous',
          username: scrapedData.username,
          displayName: scrapedData.nickname,
          followers: followersMetric.approx,
          following: followingMetric.approx,
          totalLikes: likesMetric.approx,
          totalVideos: videosMetric.approx,
          bio: scrapedData.signature,
          verified: scrapedData.verified,
          avatarUrl: scrapedData.avatarUrl,
          engagementRate: parseFloat(engagementRate.toFixed(2)),
          avgViews: avgViews,
        });
        console.log(`[TRACKING] Saved analyzed account @${scrapedData.username} to database`);
      } catch (saveError) {
        console.error('[TRACKING] Failed to save account to database:', saveError);
        // Don't fail the request if tracking fails
      }

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

  // Analyze Video Content with AI Vision + Whisper Audio Transcription + 8-Layer BIAS
  app.post("/api/analyze-video", upload.single('file'), async (req, res) => {
    let tempDir: string | null = null;
    
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Silakan upload file video atau gambar untuk dianalisis.',
          messageId: 'Silakan upload file video atau gambar untuk dianalisis.',
        });
      }

      const description = req.body.description || '';
      const mode = req.body.mode || 'tiktok';
      const platform = req.body.platform || 'tiktok';
      const mimeType = req.file.mimetype;
      const isVideo = mimeType.startsWith('video/');

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const fs = await import('fs');
      const { analyzeBehavior } = await import('./bias-engine');

      let transcription = '';
      let visualDescription = '';
      let frameBase64List: string[] = [];
      let videoDuration = 0;

      // Step 1: Extract audio and frames from video
      if (isVideo) {
        console.log('Processing video with ffmpeg...');
        const { processVideo, cleanupTempDir, frameToBase64 } = await import('./video-processor');
        
        try {
          const result = await processVideo(req.file.buffer, req.file.originalname || 'video.mp4');
          tempDir = result.tempDir;
          videoDuration = result.duration;
          
          // Transcribe audio with Whisper
          if (result.audioPath) {
            console.log('Transcribing audio with Whisper...');
            try {
              const audioFile = fs.createReadStream(result.audioPath);
              const whisperResponse = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'id',
                response_format: 'text',
              });
              transcription = whisperResponse || '';
              console.log(`Transcription: ${transcription.substring(0, 100)}...`);
            } catch (whisperError: any) {
              console.log('Whisper transcription failed:', whisperError.message);
            }
          }
          
          // Extract frames for visual analysis
          for (const framePath of result.frames) {
            frameBase64List.push(frameToBase64(framePath));
          }
          console.log(`Extracted ${frameBase64List.length} frames for vision analysis`);
          
        } catch (ffmpegError: any) {
          console.log('FFmpeg processing failed, falling back to direct upload:', ffmpegError.message);
          frameBase64List = [req.file.buffer.toString('base64')];
        }
      } else {
        // Image file - just use as is
        frameBase64List = [req.file.buffer.toString('base64')];
      }

      // Step 2: Get visual description from Vision API
      if (frameBase64List.length > 0) {
        console.log('Getting visual description from Vision API...');
        const imageContent = frameBase64List.slice(0, 3).map(base64 => ({
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${base64}`, detail: 'low' },
        }));

        try {
          const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{
                role: 'user',
                content: [
                  { type: 'text', text: `Describe this ${isVideo ? 'video content' : 'image'} in detail for behavioral analysis. Focus on: presenter appearance, body language, facial expressions, background setting, visual quality, text overlays, and overall presentation style. Be specific and descriptive. Response in Indonesian.` },
                  ...imageContent,
                ],
              }],
              max_tokens: 500,
            }),
          });

          if (visionResponse.ok) {
            const visionData = await visionResponse.json();
            visualDescription = visionData.choices?.[0]?.message?.content || '';
            console.log(`Visual description: ${visualDescription.substring(0, 100)}...`);
          }
        } catch (visionError: any) {
          console.log('Vision API failed:', visionError.message);
        }
      }

      // Step 3: Combine all context for 8-layer BIAS analysis
      const hasTranscription = transcription.length > 10;
      const hasVisual = visualDescription.length > 10;
      
      let combinedContent = '';
      
      if (hasTranscription && hasVisual) {
        combinedContent = `[ANALISIS VIDEO KOMPREHENSIF]

TRANSKRIPSI AUDIO (apa yang dikatakan):
"${transcription}"

DESKRIPSI VISUAL (apa yang terlihat):
${visualDescription}

${description ? `KONTEKS DARI USER: ${description}` : ''}

Durasi video: ${videoDuration.toFixed(1)} detik

Analisis konten video ini secara menyeluruh dari segi komunikasi behavioral, termasuk cara bicara, ekspresi, dan penyampaian pesan.`;
      } else if (hasTranscription) {
        combinedContent = `[ANALISIS AUDIO VIDEO]

TRANSKRIPSI (apa yang dikatakan):
"${transcription}"

${description ? `KONTEKS: ${description}` : ''}

Durasi: ${videoDuration.toFixed(1)} detik

Analisis cara bicara dan penyampaian pesan dalam rekaman ini.`;
      } else if (hasVisual) {
        combinedContent = `[ANALISIS VISUAL VIDEO]

DESKRIPSI VISUAL:
${visualDescription}

${description ? `KONTEKS: ${description}` : ''}

Analisis elemen visual dan presentasi dalam konten ini.`;
      } else {
        combinedContent = description || 'Video content untuk dianalisis';
      }

      console.log('Running 8-layer BIAS analysis...');
      
      // Step 4: Use existing BIAS engine for 8-layer analysis
      const biasMode = mode === 'marketing' ? 'academic' : 'creator';
      const biasResult = await analyzeBehavior({
        mode: biasMode,
        inputType: 'video',
        content: combinedContent,
        platform: platform as any,
      });

      // Cleanup temp files
      if (tempDir) {
        const { cleanupTempDir } = await import('./video-processor');
        cleanupTempDir(tempDir);
      }

      // Add video-specific metadata
      const enrichedResult = {
        ...biasResult,
        hasAudioAnalysis: hasTranscription,
        hasVisualAnalysis: hasVisual,
        videoDuration,
        transcriptionPreview: hasTranscription 
          ? transcription.substring(0, 200) + (transcription.length > 200 ? '...' : '')
          : undefined,
      };

      console.log('8-layer BIAS analysis completed successfully');

      res.json({
        success: true,
        analysis: enrichedResult,
      });
    } catch (error: any) {
      console.error('Video analysis error:', error);
      if (tempDir) {
        try {
          const { cleanupTempDir } = await import('./video-processor');
          cleanupTempDir(tempDir);
        } catch (cleanupError) {
          console.log('Cleanup error:', cleanupError);
        }
      }
      res.status(500).json({
        error: 'Analysis failed',
        message: 'Gagal menganalisis konten. Silakan coba lagi.',
        messageId: 'Gagal menganalisis konten. Silakan coba lagi.',
      });
    }
  });

  // Compare Videos - Competitive batch comparison
  app.post("/api/compare-videos", async (req, res) => {
    try {
      const schema = z.object({
        videos: z.array(z.object({
          name: z.string(),
          overallScore: z.number(),
          layers: z.array(z.object({
            layer: z.string(),
            score: z.number(),
            strengths: z.array(z.string()).optional(),
            weaknesses: z.array(z.string()).optional(),
            feedback: z.string().optional(),
          })).optional(),
          transcriptionPreview: z.string().optional(),
        })).min(2).max(5),
        language: z.enum(['en', 'id']).default('id'),
      });

      const data = schema.parse(req.body);
      const { videos, language } = data;
      const isId = language === 'id';

      console.log(`🔄 Comparing ${videos.length} videos competitively...`);

      // Build comparison summary for each video
      const videoSummaries = videos.map((v, i) => {
        const layerScores = v.layers?.map(l => `${l.layer.split(' ')[0]}: ${l.score}`).join(', ') || 'N/A';
        const topStrengths = v.layers?.flatMap(l => l.strengths || []).slice(0, 2).join('; ') || 'N/A';
        const topWeaknesses = v.layers?.flatMap(l => l.weaknesses || []).slice(0, 2).join('; ') || 'N/A';
        return `VIDEO ${i + 1} "${v.name}":
- Overall Score: ${v.overallScore}
- Layer Scores: ${layerScores}
- Strengths: ${topStrengths}
- Weaknesses: ${topWeaknesses}
- Content Preview: ${v.transcriptionPreview?.substring(0, 150) || 'No transcription'}`;
      }).join('\n\n');

      const comparisonPrompt = `Kamu expert content analyst. Bandingkan ${videos.length} video TikTok/Marketing ini secara KOMPETITIF.

${videoSummaries}

TUGAS: Buat perbandingan kompetitif yang ACTIONABLE. 

Respond in JSON format:
{
  "overallWinner": {
    "videoName": "nama video pemenang",
    "reason": "Alasan spesifik kenapa video ini menang (2-3 kalimat dengan reference ke konten)"
  },
  "dimensionWinners": [
    { "dimension": "Hook", "winner": "Video 1", "reason": "Hook 'Halo traders' lebih menarik karena langsung menyapa audiens vs Video 2 yang mulai dengan intro generik" },
    { "dimension": "Storytelling", "winner": "Video 2", "reason": "Struktur Problem→Solution→CTA lebih jelas" },
    { "dimension": "Credibility", "winner": "Video 1", "reason": "Menyertakan data dan statistik" },
    { "dimension": "Engagement", "winner": "Video 3", "reason": "Ada pertanyaan ke audiens di tengah video" },
    { "dimension": "CTA", "winner": "Video 2", "reason": "CTA lebih jelas dan actionable" }
  ],
  "pairwiseComparisons": [
    { "pair": "Video 1 vs Video 2", "verdict": "Video 1 unggul di hook (+12 poin) tapi kalah di struktur (-8 poin)" },
    { "pair": "Video 1 vs Video 3", "verdict": "Video 1 lebih kredibel, Video 3 lebih engaging" }
  ],
  "sharedWeaknesses": [
    "Semua video kurang CTA yang jelas di akhir",
    "Background audio bisa lebih konsisten"
  ],
  "winningCombo": {
    "recommendation": "Gabungan ideal: Ambil hook dari Video 1, storytelling dari Video 2, dan engagement style dari Video 3",
    "nextAction": "BESOK: Rekam video baru dengan: (1) Hook langsung seperti Video 1, (2) Struktur 3-bagian seperti Video 2, (3) Tambah 1 pertanyaan ke audiens seperti Video 3"
  }
}

PENTING:
- Reference SPESIFIK ke konten video (quote kalau ada transcription)
- Banding ANGKA (skor) antar video
- JANGAN generic - harus ada alasan konkret dari analisis
- ${isId ? 'Respond in Bahasa Indonesia' : 'Respond in English'}`;

      const openai = await import('openai');
      const client = new openai.default({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: comparisonPrompt }],
        max_tokens: 2000,
        temperature: 0.6,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        console.warn('⚠️ Empty AI response for comparison');
        return res.json({ success: true, comparison: null });
      }

      let comparison;
      try {
        // Clean potential markdown code fences
        const cleanedContent = responseContent.replace(/```json\n?|\n?```/g, '').trim();
        comparison = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.warn('⚠️ Failed to parse comparison JSON:', parseError);
        console.warn('Raw response:', responseContent.substring(0, 500));
        return res.json({ success: true, comparison: null });
      }

      console.log(`✅ Competitive comparison completed for ${videos.length} videos`);

      res.json({
        success: true,
        comparison,
      });
    } catch (error: any) {
      console.error('Video comparison error:', error);
      res.status(500).json({
        error: 'Comparison failed',
        message: 'Gagal membandingkan video. Pastikan semua video sudah dianalisis.',
        messageId: 'Gagal membandingkan video. Pastikan semua video sudah dianalisis.',
      });
    }
  });

  // Analyze Screenshot with AI Vision
  app.post("/api/analyze-screenshot", async (req, res) => {
    try {
      const schema = z.object({
        image: z.string().min(1),
        guideType: z.string().optional(),
        language: z.enum(['en', 'id']).optional(),
      });

      const data = schema.parse(req.body);
      const lang = data.language || 'id';
      const guideType = data.guideType || 'profile';

      // Extract base64 data from data URL
      const base64Match = data.image.match(/^data:image\/\w+;base64,(.+)$/);
      if (!base64Match) {
        return res.status(400).json({
          error: 'Invalid image format',
          message: 'Format gambar tidak valid. Gunakan screenshot dari TikTok.',
          messageId: 'Format gambar tidak valid. Gunakan screenshot dari TikTok.',
        });
      }

      const base64Image = base64Match[1];

      const guidePrompts: Record<string, string> = {
        profile: 'TikTok profile analytics screenshot showing followers, views, engagement metrics',
        content: 'TikTok content performance screenshot showing video stats, views, likes',
        followers: 'TikTok follower insights screenshot showing demographics, activity times',
        live: 'TikTok LIVE analytics screenshot showing viewer count, duration, gifts',
      };

      const contextDescription = guidePrompts[guideType] || guidePrompts.profile;
      const langInstruction = lang === 'id' 
        ? 'Respond in Indonesian (Bahasa Indonesia).'
        : 'Respond in English.';

      const analysisPrompt = `Kamu expert TikTok analytics. Analisis screenshot ${contextDescription}. ${langInstruction}

PENTING - BACA ANGKA YANG TERLIHAT:
1. Extract SEMUA metrics yang terlihat (followers, views, likes, engagement rate, dll)
2. Bandingkan dengan benchmark TikTok industry
3. Berikan REKOMENDASI SPESIFIK berdasarkan data yang terlihat

CONTOH REKOMENDASI YANG BAGUS:
❌ GENERIC: "Tingkatkan engagement"
✅ SPESIFIK: "Engagement rate kamu 2.3% - di bawah rata-rata 4.5%. BESOK: Post jam 19:00-21:00 (peak hour). Week 1: Tambah 3 CTA per video. Target: naik ke 3.5%"

Respond in JSON:
{
  "metrics": [
    { "name": "Followers", "value": "12.5K", "status": "good", "insight": "Di atas rata-rata micro-influencer (10K)" },
    { "name": "Engagement Rate", "value": "2.3%", "status": "needs_work", "insight": "Di bawah benchmark 4.5% untuk niche ini" }
  ],
  "summary": "Ringkasan 2-3 kalimat tentang kondisi akun",
  "insights": [
    "Insight spesifik berdasarkan angka yang terlihat",
    "Perbandingan dengan benchmark industry",
    "Pola atau trend yang terdeteksi"
  ],
  "recommendations": [
    "BESOK: Action konkret pertama. Target: hasil yang diharapkan",
    "Week 1: Action kedua dengan timeline. Expected: peningkatan X%",
    "Week 2-4: Action jangka menengah dengan milestone"
  ],
  "overallScore": 75
}

Status: good (di atas rata-rata), average (normal), needs_work (perlu perbaikan)`;

      // Use OpenAI Vision API
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const analysisText = visionResponse.choices[0]?.message?.content || '{}';
      const analysisResult = JSON.parse(analysisText);

      // Validate result has required fields
      if (!analysisResult.metrics || !Array.isArray(analysisResult.metrics)) {
        throw new Error('Invalid analysis result structure');
      }

      res.json({
        success: true,
        result: analysisResult,
      });
    } catch (error: any) {
      console.error('Screenshot analysis error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Data screenshot tidak valid.',
          messageId: 'Data screenshot tidak valid.',
        });
      }

      res.status(500).json({
        error: 'Analysis failed',
        message: 'Gagal menganalisis screenshot. Pastikan gambar jelas dan coba lagi.',
        messageId: 'Gagal menganalisis screenshot. Pastikan gambar jelas dan coba lagi.',
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

  // ============= SUCCESS STORIES =============
  
  // Public - Submit Success Story
  app.post("/api/success-stories", async (req, res) => {
    try {
      const story = await storage.createSuccessStory(req.body);
      res.json({ success: true, story });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public - Get Approved Success Stories
  app.get("/api/success-stories/approved", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      const stories = await storage.getApprovedSuccessStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public - Get Featured Success Stories (for homepage)
  app.get("/api/success-stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedSuccessStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Get Pending Success Stories
  app.get("/api/success-stories/pending", requireAdmin, async (req, res) => {
    try {
      const stories = await storage.getPendingSuccessStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Approve Success Story
  app.post("/api/success-stories/:id/approve", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { featured } = req.body;
      const story = await storage.updateSuccessStory(id, {
        status: 'approved',
        featured: featured || false,
        approvedAt: new Date(),
      });
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.json({ success: true, story });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Reject Success Story
  app.post("/api/success-stories/:id/reject", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.updateSuccessStory(id, { status: 'rejected' });
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.json({ success: true, story });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Update Success Story (toggle featured, edit, etc.)
  app.put("/api/success-stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.updateSuccessStory(id, req.body);
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.json({ success: true, story });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Delete Success Story
  app.delete("/api/success-stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSuccessStory(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin - Get ALL Success Stories (for admin panel)
  app.get("/api/success-stories/all", requireAdmin, async (req, res) => {
    try {
      const [pending, approved] = await Promise.all([
        storage.getPendingSuccessStories(),
        storage.getApprovedSuccessStories(),
      ]);
      res.json({ pending, approved });
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

  // ========================================
  // LEARNED RESPONSES (AI Learning) ENDPOINTS
  // ========================================
  
  // Get unapproved learned responses (admin only) - approved ones are in library
  app.get("/api/learned-responses", requireAdmin, async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses } = await import('@shared/schema');
      const { desc, eq } = await import('drizzle-orm');
      
      // Only show unapproved responses - approved ones are already in library
      const responses = await db.select().from(learnedResponses)
        .where(eq(learnedResponses.isApproved, false))
        .orderBy(desc(learnedResponses.createdAt));
      res.json(responses);
    } catch (error: any) {
      console.error('[AI-LEARNING] Error fetching learned responses:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete learned response (admin only)
  app.delete("/api/learned-responses/:id", requireAdmin, async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      await db.delete(learnedResponses).where(eq(learnedResponses.id, req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[AI-LEARNING] Error deleting learned response:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update learned response (admin only)
  app.put("/api/learned-responses/:id", requireAdmin, async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      const { extractKeywords } = await import('./utils/learning-system');
      
      const { question, response } = req.body;
      
      if (!question?.trim() || !response?.trim()) {
        return res.status(400).json({ error: 'Question and response are required' });
      }
      
      const keywords = extractKeywords(question);
      
      await db.update(learnedResponses)
        .set({ 
          question: question.trim(), 
          response: response.trim(),
          keywords,
        })
        .where(eq(learnedResponses.id, req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[AI-LEARNING] Error updating learned response:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Approve learned response to library (admin only)
  app.post("/api/learned-responses/:id/approve", requireAdmin, async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      await db.update(learnedResponses)
        .set({ 
          isApproved: true,
          approvedAt: new Date(),
        })
        .where(eq(learnedResponses.id, req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[AI-LEARNING] Error approving learned response:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get approved learned responses for library (public)
  app.get("/api/library/ai-learned", async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses } = await import('@shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      const approved = await db.select()
        .from(learnedResponses)
        .where(eq(learnedResponses.isApproved, true))
        .orderBy(desc(learnedResponses.approvedAt));
      res.json(approved);
    } catch (error: any) {
      console.error('[LIBRARY] Error fetching AI-learned knowledge:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Export all learned data for backup (admin only)
  app.get("/api/admin/export-learned", requireAdmin, async (req, res) => {
    try {
      const { db } = await import('../db');
      const { learnedResponses, libraryContributions } = await import('@shared/schema');
      const { desc } = await import('drizzle-orm');
      
      const learned = await db.select().from(learnedResponses).orderBy(desc(learnedResponses.createdAt));
      const contributions = await db.select().from(libraryContributions).orderBy(desc(libraryContributions.createdAt));
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        note: 'Data yang di-generate oleh AI Learning dan User Contributions (bukan data built-in original)',
        learned_responses: learned,
        library_contributions: contributions,
        stats: {
          total_learned: learned.length,
          approved_learned: learned.filter(r => r.isApproved).length,
          pending_learned: learned.filter(r => !r.isApproved).length,
          total_contributions: contributions.length,
          approved_contributions: contributions.filter(c => c.status === 'approved').length,
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=bias_learned_data_${new Date().toISOString().split('T')[0]}.json`);
      res.json(exportData);
    } catch (error: any) {
      console.error('[EXPORT] Error exporting learned data:', error);
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
        totalFeatureUsage,
        navigationBreakdown,
        tabBreakdown,
        buttonClickBreakdown
      ] = await Promise.all([
        storage.getPageViewStats(daysNum),
        storage.getFeatureUsageStats(daysNum),
        storage.getUniqueSessionsCount(daysNum),
        storage.getTotalPageViews(daysNum),
        storage.getTotalFeatureUsage(daysNum),
        storage.getNavigationBreakdown(daysNum),
        storage.getTabBreakdown(daysNum),
        storage.getButtonClickBreakdown(daysNum),
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
        navigationBreakdown,
        tabBreakdown,
        buttonClickBreakdown,
      });
    } catch (error: any) {
      console.error('[ANALYTICS] Error getting stats:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // THUMBNAIL GENERATOR (Concept Preview)
  // Returns a reference image for thumbnail design ideas
  // ==========================================
  
  app.post("/api/generate-thumbnail", async (req, res) => {
    try {
      const { topic, style, aspectRatio } = req.body;
      
      if (!topic) {
        return res.status(400).json({ 
          error: 'Topic is required',
          message: 'Topik diperlukan untuk membuat preview',
          messageId: 'Topik diperlukan untuk membuat preview',
        });
      }

      const dimensions = {
        '16:9': '1280x720',
        '9:16': '720x1280',
        '1:1': '720x720',
      };

      const dim = dimensions[aspectRatio as keyof typeof dimensions] || '1280x720';
      
      // Generate concept preview with topic and style
      const displayText = `${topic.substring(0, 25)}`;
      const previewUrl = `https://placehold.co/${dim}/1a1a1a/ff0050?text=${encodeURIComponent(displayText)}&font=roboto`;

      res.json({
        success: true,
        imageUrl: previewUrl,
        prompt: `${topic} - ${style}`,
        type: 'concept-preview',
      });
    } catch (error: any) {
      console.error('[THUMBNAIL] Error:', error);
      res.status(500).json({ 
        error: error.message,
        message: 'Gagal membuat preview thumbnail',
        messageId: 'Gagal membuat preview thumbnail',
      });
    }
  });

  // ==========================================
  // A/B HOOK TESTER
  // ==========================================
  
  app.post("/api/test-hooks", async (req, res) => {
    try {
      const schema = z.object({
        hooks: z.array(z.object({
          id: z.string(),
          text: z.string().min(1),
        })).min(2).max(5),
        language: z.enum(['en', 'id']).optional(),
      });

      const data = schema.parse(req.body);
      const lang = data.language || 'id';

      const hooksText = data.hooks.map((h, i) => 
        `Hook ${String.fromCharCode(65 + i)}: "${h.text}"`
      ).join('\n');

      const langInstruction = lang === 'id' 
        ? 'Respond in Indonesian (Bahasa Indonesia).'
        : 'Respond in English.';

      const prompt = `Kamu TikTok viral expert. Analisis hook variations ini dan tentukan mana yang paling viral. ${langInstruction}

${hooksText}

ANALISIS WAJIB SPESIFIK:
1. Quote EXACT kata-kata dari hook yang bikin kuat/lemah
2. Bandingkan dengan hook viral yang sukses di TikTok
3. Kasih suggestion yang KONKRET (bukan "tambah emosi" tapi "ganti 'cara' jadi 'rahasia'")

CONTOH FEEDBACK YANG BAGUS:
❌ GENERIC: "Kurang engaging"
✅ SPESIFIK: "Kata 'tips' terlalu umum - ganti jadi 'RAHASIA yang gak banyak orang tau'. Hook A mulai dengan 'Gue' - bagus karena personal, tapi tambah angka: 'Gue nemuin 3 cara...'"

Untuk setiap hook, evaluasi:
1. Curiosity gap - apakah bikin penasaran?
2. Emosi trigger - fear, desire, curiosity, shock?
3. Relatability - apakah target audience connect?
4. First 2 seconds - apakah stop-scrolling?

Respond in JSON:
{
  "results": [
    {
      "hookId": "id from input",
      "hookText": "the hook text",
      "score": 0-100,
      "viralPotential": "high" | "medium" | "low",
      "strengths": ["Quote exact: 'kata X' efektif karena...", "Pattern 'Y' proven viral di TikTok"],
      "weaknesses": ["Kata 'Z' terlalu generic", "Kurang angka spesifik - '3 cara' lebih kuat dari 'beberapa cara'"],
      "suggestion": "GANTI: '[hook asli]' → '[versi improved]'. Alasan: lebih triggering curiosity"
    }
  ],
  "winner": "A",
  "winnerScore": 85,
  "comparison": "Hook A menang karena: 1) Mulai dengan angka '3', 2) Kata 'rahasia' trigger curiosity, 3) Personal 'gue/aku' bikin relatable. Hook B kalah karena opening 'Tips untuk...' terlalu formal."
}

WAJIB: suggestion harus berisi VERSI IMPROVED dari hook, bukan cuma saran abstrak!`;

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const resultText = completion.choices[0]?.message?.content || '{}';
      const result = JSON.parse(resultText);

      // Map hook IDs back
      if (result.results) {
        result.results = result.results.map((r: any, i: number) => ({
          ...r,
          hookId: data.hooks[i]?.id || r.hookId,
          hookText: data.hooks[i]?.text || r.hookText,
        }));
      }

      res.json(result);
    } catch (error: any) {
      console.error('[HOOK_TESTER] Error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Minimal 2 hook diperlukan, maksimal 5.',
          messageId: 'Minimal 2 hook diperlukan, maksimal 5.',
        });
      }

      res.status(500).json({
        error: 'Analysis failed',
        message: 'Gagal menganalisis hook. Silakan coba lagi.',
        messageId: 'Gagal menganalisis hook. Silakan coba lagi.',
      });
    }
  });

  // ==========================================
  // HYBRID CHAT (Local + Ai Fallback)
  // ==========================================
  
  app.post("/api/chat/hybrid", async (req, res) => {
    try {
      const { message, sessionId, mode, image, images, outputLanguage, previousImageContext } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const { hybridChat } = await import('./chat/hybrid-chat');
      const result = await hybridChat({ 
        message, 
        sessionId: sessionId || 'anonymous',
        mode: mode || 'home',
        image: image || undefined,
        images: images || undefined,
        outputLanguage: outputLanguage || 'id',
        previousImageContext: previousImageContext || undefined,
      });
      
      res.json(result);
    } catch (error: any) {
      console.error('[HYBRID_CHAT] Error:', error);
      res.status(500).json({ 
        response: 'Maaf, ada error. Coba lagi ya!',
        source: 'local',
        error: error.message 
      });
    }
  });

  // Multi-image comparison endpoint
  app.post("/api/compare-images", async (req, res) => {
    try {
      const { images, question, mode, sessionId, outputLanguage } = req.body;
      
      if (!images || !Array.isArray(images) || images.length < 2) {
        return res.status(400).json({ error: 'Minimal 2 gambar diperlukan untuk perbandingan' });
      }
      
      if (images.length > 4) {
        return res.status(400).json({ error: 'Maksimal 4 gambar untuk perbandingan' });
      }
      
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const langInstruction = outputLanguage === 'en' 
        ? 'RESPOND IN ENGLISH ONLY.' 
        : 'JAWAB DALAM BAHASA INDONESIA.';
      
      const comparePrompt = mode === 'marketing' 
        ? `🔍 PERBANDINGAN MATERI MARKETING

${langInstruction}

Analisis dan bandingkan ${images.length} gambar marketing berikut secara detail.

📊 FORMAT ANALISIS:
1. **Ringkasan tiap gambar** - Identifikasi elemen utama
2. **Tabel perbandingan** - Bandingkan: Headline, CTA, Visual, Trust Signal
3. **Pemenang & Alasan** - Mana yang paling efektif dan kenapa
4. **Rekomendasi** - Saran konkret untuk improvement

User's question: ${question || 'Bandingkan semua gambar ini'}`
        : `🔍 PERBANDINGAN PROFIL/KONTEN TIKTOK

${langInstruction}

Analisis dan bandingkan ${images.length} screenshot TikTok berikut secara detail.

📊 FORMAT ANALISIS:

**1️⃣ EKSTRAKSI DATA TIAP GAMBAR:**
| Gambar | Username | Followers | Likes | Views | Highlight |
|--------|----------|-----------|-------|-------|-----------|
| 1 | ... | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... | ... |

**2️⃣ PERBANDINGAN METRIK:**
| Metrik | Gambar 1 | Gambar 2 | Pemenang |
|--------|----------|----------|----------|
| Engagement | ... | ... | ... |
| Thumbnail | ... | ... | ... |
| Hook | ... | ... | ... |

**3️⃣ PEMENANG & ALASAN:**
- Siapa yang menang secara keseluruhan?
- Mengapa mereka lebih baik?

**4️⃣ REKOMENDASI:**
- Apa yang bisa dipelajari dari pemenang?
- Saran konkret untuk improvement

User's question: ${question || 'Bandingkan semua profil/konten ini'}`;

      // Build message content with all images
      const messageContent: any[] = [{ type: 'text', text: comparePrompt }];
      for (const img of images) {
        if (img.startsWith('data:image/')) {
          messageContent.push({
            type: 'image_url',
            image_url: { url: img, detail: 'high' }
          });
        }
      }
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: messageContent }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });
      
      const response = completion.choices[0]?.message?.content || 'Gagal membandingkan gambar.';
      
      res.json({
        response,
        source: 'ai',
        imagesCompared: images.length,
      });
    } catch (error: any) {
      console.error('[COMPARE_IMAGES] Error:', error);
      res.status(500).json({ 
        error: 'Comparison failed',
        message: 'Gagal membandingkan gambar. Coba lagi.',
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

  // ==========================================
  // PLATFORM SETTINGS API ROUTES
  // ==========================================

  // Public: Get all active settings (for frontend consumption)
  app.get("/api/settings/public", async (req, res) => {
    try {
      const settings = await storage.getPublicSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('[SETTINGS] Error getting public settings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Public: Get active pricing tiers (no auth required)
  app.get("/api/pricing", async (req, res) => {
    try {
      const tiers = await storage.getActivePricingTiers();
      res.json(tiers);
    } catch (error: any) {
      console.error('[PRICING] Error getting pricing:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('[ADMIN_SETTINGS] Error getting settings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Update a setting with validation
  app.put("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const adminUser = (req as any).adminUser;
      
      if (value === undefined) {
        return res.status(400).json({ error: 'Value is required' });
      }
      
      const existingSetting = await storage.getSetting(key);
      if (!existingSetting) {
        return res.status(404).json({ error: 'Setting not found' });
      }
      
      if (!existingSetting.isEditable) {
        return res.status(403).json({ error: 'This setting cannot be modified' });
      }
      
      let validatedValue = String(value);
      if (existingSetting.valueType === 'number') {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) {
          return res.status(400).json({ error: 'Value must be a valid number' });
        }
        validatedValue = String(numVal);
      } else if (existingSetting.valueType === 'boolean') {
        if (value !== 'true' && value !== 'false' && value !== true && value !== false) {
          return res.status(400).json({ error: 'Value must be true or false' });
        }
        validatedValue = String(value === true || value === 'true');
      }
      
      const setting = await storage.updateSetting(key, validatedValue, adminUser);
      // Keep in-memory AI rate limiter config in sync with DB-backed settings
      if (setting && (key === 'global_token_per_day' || key === 'global_token_per_request')) {
        try {
          const { reloadSettings } = await import('./utils/ai-rate-limiter');
          await reloadSettings();
        } catch (e) {
          console.error('[ADMIN_SETTINGS] Failed to reload AI rate limiter settings:', e);
        }
      }
      res.json(setting);
    } catch (error: any) {
      console.error('[ADMIN_SETTINGS] Error updating setting:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all pricing tiers
  app.get("/api/admin/pricing", requireAdmin, async (req, res) => {
    try {
      const tiers = await storage.getAllPricingTiers();
      res.json(tiers);
    } catch (error: any) {
      console.error('[ADMIN_PRICING] Error getting pricing:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Update a pricing tier with validation
  app.put("/api/admin/pricing/:slug", requireAdmin, async (req, res) => {
    try {
      const { slug } = req.params;
      const updates = req.body;
      const adminUser = (req as any).adminUser;
      
      const existingTier = await storage.getPricingTier(slug);
      if (!existingTier) {
        return res.status(404).json({ error: 'Pricing tier not found' });
      }
      
      const validatedUpdates: any = {};
      
      if (updates.priceIdr !== undefined) {
        const price = parseInt(updates.priceIdr);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({ error: 'Price must be a valid non-negative number' });
        }
        validatedUpdates.priceIdr = price;
      }
      
      if (updates.videoLimit !== undefined) {
        const limit = parseInt(updates.videoLimit);
        if (isNaN(limit)) {
          return res.status(400).json({ error: 'Video limit must be a valid number' });
        }
        validatedUpdates.videoLimit = limit;
      }
      
      if (updates.chatLimit !== undefined) {
        const limit = parseInt(updates.chatLimit);
        if (isNaN(limit)) {
          return res.status(400).json({ error: 'Chat limit must be a valid number' });
        }
        validatedUpdates.chatLimit = limit;
      }
      
      if (updates.isActive !== undefined) {
        validatedUpdates.isActive = updates.isActive === true || updates.isActive === 'true';
      }
      
      if (updates.isPopular !== undefined) {
        validatedUpdates.isPopular = updates.isPopular === true || updates.isPopular === 'true';
      }
      
      const tier = await storage.updatePricingTier(slug, validatedUpdates, adminUser);
      res.json(tier);
    } catch (error: any) {
      console.error('[ADMIN_PRICING] Error updating pricing:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all analyzed TikTok accounts (for user tracking/promo)
  app.get("/api/admin/analyzed-accounts", requireAdmin, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const accounts = await storage.getAllAnalyzedAccounts(limit);
      const totalCount = await storage.getAnalyzedAccountsCount();
      
      res.json({
        accounts: accounts.map(a => ({
          id: a.id,
          username: a.username,
          displayName: a.displayName,
          followers: a.followers,
          following: a.following,
          totalLikes: a.totalLikes,
          totalVideos: a.totalVideos,
          verified: a.verified,
          engagementRate: a.engagementRate,
          createdAt: a.createdAt,
        })),
        total: totalCount,
      });
    } catch (error: any) {
      console.error('[ADMIN_ACCOUNTS] Error getting analyzed accounts:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get TikTok guidelines reminder status
  app.get("/api/admin/tiktok-reminder", requireAdmin, async (req, res) => {
    try {
      const lastCheck = await storage.getSetting('last_tiktok_guidelines_check');
      const lastCheckDate = lastCheck?.value ? new Date(lastCheck.value) : null;
      const now = new Date();
      
      let daysAgo: number | null = null;
      let needsCheck = true; // Default: needs check if never checked
      
      if (lastCheckDate) {
        daysAgo = Math.floor((now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
        needsCheck = daysAgo >= 30; // Only needs check if 30+ days since last check
      }
      
      res.json({
        lastCheckDate: lastCheckDate?.toISOString() || null,
        daysAgo,
        needsCheck,
        checkUrl: 'https://www.tiktok.com/community-guidelines/en/',
        newsroomUrl: 'https://newsroom.tiktok.com/',
      });
    } catch (error: any) {
      console.error('[ADMIN_REMINDER] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Mark TikTok guidelines as checked
  app.post("/api/admin/tiktok-reminder/mark-checked", requireAdmin, async (req, res) => {
    try {
      const adminUser = (req as any).adminUser;
      const now = new Date().toISOString();
      
      // Create or update the setting
      const existing = await storage.getSetting('last_tiktok_guidelines_check');
      if (existing) {
        await storage.updateSetting('last_tiktok_guidelines_check', now, adminUser);
      } else {
        await db.insert(appSettings).values({
          key: 'last_tiktok_guidelines_check',
          value: now,
          valueType: 'string',
          category: 'admin',
          labelEn: 'Last TikTok Guidelines Check',
          labelId: 'Terakhir Cek Panduan TikTok',
          descriptionEn: 'When admin last verified TikTok guidelines are up to date',
          descriptionId: 'Kapan terakhir admin verifikasi panduan TikTok masih terbaru',
          isEditable: true,
        });
      }
      
      res.json({ success: true, checkedAt: now });
    } catch (error: any) {
      console.error('[ADMIN_REMINDER] Error marking checked:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
