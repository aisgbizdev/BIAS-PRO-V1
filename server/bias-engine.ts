import { 
  BiasAnalysisResult, 
  BiasLayerResult,
  TikTokAccountAnalysisResult,
  TikTokVideoAnalysisResult,
  TikTokComparisonResult,
  type TiktokAccount,
  type TiktokVideo
} from "@shared/schema";

// Import new educational analyzers
import { analyzeText, analyzeAccount, analyzeVideo } from './analyzers/integration';

// Import knowledge router for smart chat responses
import { knowledgeRouter } from './knowledge-library/knowledge-router';

/**
 * BiAS²³ Pro Analysis Engine
 * 8-Layer Behavioral Intelligence Framework with Educational Insights
 * 
 * Uses professional educational analyzer modules for:
 * - Account Analysis (TikTok, Instagram, YouTube)
 * - Video Analysis (all platforms)
 * - Text/Speech Analysis (8-layer BIAS)
 */

export type BiasMode = 'creator' | 'academic' | 'hybrid';

interface AnalysisInput {
  mode: BiasMode;
  inputType: 'text' | 'video' | 'photo' | 'audio';
  content: string;
  platform?: 'tiktok' | 'instagram' | 'youtube';
}

/**
 * Main analysis function - Now using educational analyzer
 */
export async function analyzeBehavior(input: AnalysisInput): Promise<BiasAnalysisResult> {
  // Use new educational text analyzer with platform context for deep Ai analysis
  return await analyzeText({
    content: input.content,
    mode: input.mode,
    inputType: input.inputType,
    platform: input.platform,  // ✅ FIXED: Pass platform for community guidelines & context-aware analysis
  });
}

// Export new analyzers for direct use
export { analyzeAccount, analyzeVideo };

// LEGACY FUNCTIONS BELOW - Kept for backward compatibility
// These are no longer used but kept to avoid breaking existing code

async function analyzeAllLayers(input: AnalysisInput): Promise<BiasLayerResult[]> {
  const layers: BiasLayerResult[] = [];

  // VBM - Visual Behavior Mapping
  layers.push(analyzeVBM(input));

  // EPM - Emotional Processing Model
  layers.push(analyzeEPM(input));

  // NLP - Neuro-Linguistic Processing
  layers.push(analyzeNLP(input));

  // BMIL - Behavioral Morality & Integrity Layer
  layers.push(analyzeBMIL(input));

  // ECO - Engagement & Context Optimization
  layers.push(analyzeECO(input));

  // SOC - Social Observation Channel
  layers.push(analyzeSOC(input));

  // ETH - Ethical Threshold Harmony
  layers.push(analyzeETH(input));

  // COG - Cognitive Alignment Grid
  layers.push(analyzeCOG(input));

  return layers;
}

function analyzeVBM(input: AnalysisInput): BiasLayerResult {
  // Visual & Audio analysis
  const keywords = ['gesture', 'framing', 'camera', 'visual', 'lighting', 'video'];
  const hasVisualContent = keywords.some(k => input.content.toLowerCase().includes(k));
  
  const feedback = hasVisualContent 
    ? 'Your visual presentation shows confidence. Consider adjusting camera angle slightly for more professional framing.'
    : 'Good start! For visual content, focus on body language and camera positioning.';
  
  const feedbackId = hasVisualContent
    ? 'Tampilan visual kamu udah oke. Coba sesuaikan angle kamera dikit biar lebih profesional.'
    : 'Mulai bagus! Untuk konten visual, fokus ke bahasa tubuh dan posisi kamera.';
  
  return {
    layer: 'VBM (Visual Behavior Mapping)',
    score: hasVisualContent ? 8 : 6,
    feedback,
    feedbackId,
  };
}

function analyzeEPM(input: AnalysisInput): BiasLayerResult {
  // Emotional & Flow analysis
  return {
    layer: 'EPM (Emotional Processing Model)',
    score: 7,
    feedback: 'Energy rhythm is consistent, but adding emotional peaks would increase engagement.',
    feedbackId: 'Energi kamu konsisten, tapi tambahin variasi emosi biar lebih engaging.',
  };
}

function analyzeNLP(input: AnalysisInput): BiasLayerResult {
  // Language & Storytelling analysis
  const wordCount = input.content.split(' ').length;
  const score = wordCount > 50 ? 8 : 6;
  
  return {
    layer: 'NLP (Neuro-Linguistic Processing)',
    score,
    feedback: 'Story structure is clear. Add a stronger hook in the first 3 seconds.',
    feedbackId: 'Struktur cerita udah jelas. Tambahin hook yang lebih kuat di 3 detik pertama.',
  };
}

function analyzeBMIL(input: AnalysisInput): BiasLayerResult {
  // Ethics & Integrity analysis
  return {
    layer: 'BMIL (Behavioral Morality & Integrity)',
    score: 9,
    feedback: 'Content maintains ethical standards and shows social responsibility.',
    feedbackId: 'Konten kamu udah sesuai etika dan menunjukkan tanggung jawab sosial.',
  };
}

function analyzeECO(input: AnalysisInput): BiasLayerResult {
  // Engagement & Context analysis
  return {
    layer: 'ECO (Engagement & Context Optimization)',
    score: 7,
    feedback: 'Pacing is good but could be 10% slower for better retention.',
    feedbackId: 'Tempo udah bagus, tapi bisa diperlambat 10% biar retensi naik.',
  };
}

function analyzeSOC(input: AnalysisInput): BiasLayerResult {
  // Social Observation analysis
  return {
    layer: 'SOC (Social Observation Channel)',
    score: 8,
    feedback: 'Audience connection is strong. Maintain eye contact with camera for trust.',
    feedbackId: 'Koneksi dengan audiens kuat. Pertahankan kontak mata ke kamera.',
  };
}

function analyzeETH(input: AnalysisInput): BiasLayerResult {
  // Ethical Threshold analysis
  return {
    layer: 'ETH (Ethical Threshold Harmony)',
    score: 9,
    feedback: 'Content complies with platform guidelines and shows cultural sensitivity.',
    feedbackId: 'Konten sesuai guideline platform dan sensitif terhadap budaya.',
  };
}

function analyzeCOG(input: AnalysisInput): BiasLayerResult {
  // Cognitive Alignment analysis
  return {
    layer: 'COG (Cognitive Alignment Grid)',
    score: 8,
    feedback: 'Mindset shows growth orientation. Balance confidence with authenticity.',
    feedbackId: 'Mindset kamu growth-oriented. Seimbangkan percaya diri dengan autentik.',
  };
}

function calculateOverallScore(layers: BiasLayerResult[]): number {
  const total = layers.reduce((sum, layer) => sum + layer.score, 0);
  return Math.round((total / layers.length) * 10) / 10;
}

function generateSummary(layers: BiasLayerResult[], mode: BiasMode): { summary: string; summaryId: string } {
  const avgScore = calculateOverallScore(layers);
  
  if (mode === 'creator') {
    return {
      summary: `Your content shows strong creative potential with an ${avgScore}/10 score. Focus on pacing and emotional variation to maximize engagement.`,
      summaryId: `Konten kamu punya potensi kreatif yang kuat dengan skor ${avgScore}/10. Fokus ke tempo dan variasi emosi biar engagement maksimal.`,
    };
  } else if (mode === 'academic') {
    return {
      summary: `Communication analysis reveals ${avgScore}/10 effectiveness. Your structured approach is solid, consider adding more empathetic elements.`,
      summaryId: `Analisis komunikasi menunjukkan efektivitas ${avgScore}/10. Pendekatan terstruktur kamu solid, pertimbangkan elemen empatik lebih banyak.`,
    };
  } else {
    return {
      summary: `Balanced behavioral assessment: ${avgScore}/10. You demonstrate both creative expression and professional clarity.`,
      summaryId: `Penilaian perilaku seimbang: ${avgScore}/10. Kamu menunjukkan ekspresi kreatif dan kejelasan profesional.`,
    };
  }
}

function generateRecommendations(layers: BiasLayerResult[], mode: BiasMode): { recommendations: string[]; recommendationsId: string[] } {
  const lowScoreLayers = layers.filter(l => l.score < 7);
  
  const recommendations: string[] = [
    'Add 0.5 second pauses at key moments for emphasis',
    'Increase emotional variation throughout delivery',
    'Maintain consistent eye contact with camera',
  ];
  
  const recommendationsId: string[] = [
    'Tambahin jeda 0,5 detik di momen penting buat penekanan',
    'Tingkatkan variasi emosi sepanjang penyampaian',
    'Pertahankan kontak mata konsisten ke kamera',
  ];
  
  if (lowScoreLayers.length > 0) {
    recommendations.push(`Focus improvement on: ${lowScoreLayers.map(l => l.layer).join(', ')}`);
    recommendationsId.push(`Fokus perbaikan di: ${lowScoreLayers.map(l => l.layer).join(', ')}`);
  }
  
  return { recommendations, recommendationsId };
}

/**
 * Chat response generator
 * TODO: Replace with OpenAI when API key is available
 */
export async function generateChatResponse(message: string, mode: BiasMode): Promise<{ response: string; isOnTopic: boolean }> {
  const lowerMessage = message.toLowerCase();
  
  // Check if message is about behavior/communication/social media strategy
  const onTopicKeywords = [
    // GENERAL COMMUNICATION & BEHAVIOR
    'komunikasi', 'bicara', 'presentasi', 'video', 'konten', 'audiens',
    'communication', 'speak', 'presentation', 'content', 'audience',
    'behavior', 'perilaku', 'ekspresi', 'expression', 'tone', 'nada',
    'gesture', 'emosi', 'emotion', 'mindset', 'etika', 'ethics',
    
    // CREATOR MODE - SOCIAL MEDIA STRATEGY (COMPREHENSIVE!)
    // Platforms
    'fyp', 'viral', 'tiktok', 'instagram', 'youtube', 'reels', 'shorts', 'story', 'live',
    // Metrics & Analytics
    'algoritma', 'algorithm', 'engagement', 'reach', 'followers', 'views', 'like', 'comment', 
    'share', 'save', 'watch time', 'impressions', 'ctr', 'conversion',
    // Content Strategy
    'hook', 'retention', 'trending', 'hashtag', 'caption', 'posting', 'schedule', 'consistency',
    'niche', 'branding', 'thumbnail', 'title', 'description', 'bio',
    // Creator Growth
    'creator', 'influencer', 'growth', 'analytics', 'insight', 'monetize', 'sponsor',
    'collab', 'duet', 'stitch', 'remix', 'respond',
    // Content Types
    'tutorial', 'vlog', 'review', 'challenge', 'trend', 'dance', 'prank', 'storytime',
    // Technical
    'edit', 'editing', 'filter', 'effect', 'sound', 'audio', 'transition', 'cut',
    // Platform Behavior
    'shadowban', 'suppression', 'boost', 'promote', 'ads', 'organic',
    
    // ACADEMIC MODE - PROFESSIONAL/WORKPLACE COMMUNICATION
    // Leadership & Management
    'leadership', 'leader', 'pemimpin', 'kepemimpinan', 'manager', 'boss', 'supervisor',
    'team', 'tim', 'meeting', 'rapat', 'delegation', 'feedback', 'coaching', 'mentoring',
    // Professional Skills
    'professional', 'profesional', 'workplace', 'kantor', 'office', 'career', 'karir',
    'interview', 'wawancara', 'pitch', 'proposal', 'negotiation', 'negosiasi',
    // Public Speaking & Presentations
    'public speaking', 'speech', 'pidato', 'seminar', 'conference', 'keynote',
    'slides', 'powerpoint', 'audience engagement', 'q&a', 'tanya jawab',
    // Academic Context
    'teaching', 'mengajar', 'lecture', 'kuliah', 'student', 'mahasiswa', 'thesis', 'skripsi',
    'research presentation', 'academic writing', 'paper', 'journal',
    // Soft Skills
    'confidence', 'percaya diri', 'charisma', 'karisma', 'credibility', 'kredibilitas',
    'assertive', 'tegas', 'empathy', 'empati', 'persuasion', 'persuasi',
    
    // HYBRID MODE - ALL OF THE ABOVE!
    'hybrid', 'kombinasi', 'comprehensive', 'lengkap', 'overall', 'keseluruhan'
  ];
  
  const offTopicKeywords = [
    'cinta', 'love', 'politik', 'politics', 'agama', 'religion',
    'jatuh cinta', 'pacaran', 'dating', 'weather', 'cuaca',
    'makanan', 'food', 'recipe', 'resep', 'travel', 'liburan',
    'game', 'sport', 'olahraga', 'musik', 'music'
  ];
  
  const isOffTopic = offTopicKeywords.some(k => lowerMessage.includes(k));
  const hasOnTopicKeyword = onTopicKeywords.some(k => lowerMessage.includes(k));
  const isOnTopic = hasOnTopicKeyword && !isOffTopic;
  
  if (isOffTopic) {
    return {
      response: 'Haha lucu juga 😄 tapi BIAS cuma fokus ke gaya komunikasi dan perilaku kamu, bro. Ada yang mau kamu tanyain soal cara ngomong atau tampil di depan orang?',
      isOnTopic: false,
    };
  }
  
  // Generate contextual response based on keywords
  if (lowerMessage.includes('kaku') || lowerMessage.includes('nervous')) {
    return {
      response: 'Nada kamu mungkin kedengeran kaku karena terlalu fokus ke "gak boleh salah". Coba tambahin sedikit jeda natural dan senyum ringan - itu bantu flow-nya lebih enak. Latihan di depan cermin juga ngebantu banget!',
      isOnTopic: true,
    };
  }
  
  if (lowerMessage.includes('presentasi') || lowerMessage.includes('presentation')) {
    return {
      response: 'Buat presentasi yang engaging, kunci nya ada 3: 1) Mulai dengan hook emosional (bukan data dulu), 2) Kasih jeda pas poin penting, 3) Akhiri dengan call-to-action yang jelas. Tempo bicara juga jangan terlalu cepat - 10-20% lebih lambat dari biasa itu sweet spot.',
      isOnTopic: true,
    };
  }
  
  // Default response - treat as on-topic only if has relevant keywords
  return {
    response: hasOnTopicKeyword 
      ? 'Good question! Untuk analisa yang lebih spesifik, coba kirim video atau script kamu - nanti BIAS bisa kasih feedback detail pakai 8-layer framework. Ada hal spesifik yang mau kamu improve?'
      : 'Hmm, kayaknya pertanyaan itu di luar fokus BIAS ya. Gue cuma bisa bantu soal komunikasi, perilaku, atau cara tampil di depan orang. Ada yang mau ditanyain soal itu?',
    isOnTopic: hasOnTopicKeyword,
  };
}

/**
 * Cascade Ai System: OpenAI → Gemini → BIAS Library
 * Strict guardrails: Only answers BIAS-related topics
 */

const BIAS_SYSTEM_PROMPT = `🧠 BIAS Pro – Behavioral Intelligence System v3.2.α (Fusion Compact Build)
(Adaptive Coaching + TikTok Action + Dashboard Mode)

🧩 SYSTEM ROLE
You are BIAS Pro – Behavioral Intelligence Audit System,
a bilingual behavioral mentor analyzing creators' tone, emotion, clarity, and authenticity.

🎯 Purpose:
Menganalisa perilaku komunikasi dari sisi visual, emosional, linguistik, dan etika 
berdasarkan 8-Layer Framework: VBM – EPM – NLP – BMIL (sekarang dalam satu inti VoiceEmotion Core).

Kamu punya akses ke knowledge base lengkap:
- BIAS_MasterReality_TikTok_v3.3.md
- BIAS_Creator_Intelligence_Core_v3.1.md
- BIAS_VoiceEmotion_Core.md
- BMIL_Ethics.md
- ESI_EthicalSensitivity.md
- NLP_Storytelling.md

---

⚙️ BEHAVIORAL FRAMEWORK

Gunakan struktur 8-Layer BIAS (Fusion Compact):

**VBM–EPM–VPL** → digabung menjadi VoiceEmotion Core
**NLP Layer** → Narrative Linguistics (clarity, structure)
**BMIL Layer** → Behavioral Morality (integrity, ethics)
**ESI Layer** → Ethical Sensitivity & Authenticity
**VPL Layer** → Voice Pacing Layer
**VPM Layer** → Audience Persuasion Mapping

---

🧭 AUTO-MODE DETECTION
Keyword | Mode | Fokus
---------|-------|-------
TikTok, Video, FYP | Creator | Visual + Engagement
Speaking | Speaker | Voice + Clarity
Leadership | Leader | Empathy + Authority
Marketing, Pitch | Pitch | Persuasion + CTA
hoax, fakta, rumor, algoritma, shadowban, viral, agency | MasterReality | Edukatif + Myth-busting

---

💬 RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.

Contoh opening:
"🔥 Wah bro… ini pertanyaan kelas 'inside creator' banget — dan lo benar-benar peka terhadap sistem real di balik TikTok."

---

📝 FORMAT JAWABAN (WAJIB IKUTI!)

🔥 OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- "Jawaban jujurnya: ➡️ [jawaban singkat]. Tapi dengan catatan penting..."

🧠 SECTION BERNOMOR dengan emoji (🧭 1️⃣, ⚙️ 2️⃣, 🧠 3️⃣, 🧩 4️⃣)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS MasterReality v3.3..."

📊 TABEL WAJIB DIPAKAI untuk:
- Sistem internal TikTok
- Perbandingan
- Timeline/durasi
- Langkah aksi

💬 CONTOH NYATA wajib ada

🧭 KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

✨ SINGKATNYA (bullet summary)
3-4 poin key takeaway

---

⚠️ HINDARI
❌ Format script breakdown teknis (timing 0-5s, Hook, Problem, Solution)
❌ Bullet list panjang tanpa narasi
❌ Jawaban pendek tanpa depth
❌ Generic advice tanpa framework reference

⛔ JANGAN PERNAH SARANIN
- Beli followers/likes/views
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait menipu
- Konten sensual buat views

---

⚠️ WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS™ – Behavioral Intelligence for Creators**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*`;

export async function generateAICascadeResponse(
  message: string, 
  mode: BiasMode
): Promise<{ response: string; isOnTopic: boolean; provider: 'openai' | 'gemini' | 'bias' | 'knowledge-library' }> {
  
  console.log(`\n🚀 Chat Request: "${message}"`);
  
  // ⚡ NEW TIER 0: Knowledge Library (INSTANT, FREE, 90% of questions!)
  try {
    const knowledgeResult = await knowledgeRouter.answer(message);
    
    if (knowledgeResult.source === 'library' && knowledgeResult.confidence === 'high') {
      console.log('✅ Answered from Knowledge Library (instant, free)');
      return { 
        response: knowledgeResult.answer, 
        isOnTopic: true, 
        provider: 'knowledge-library' 
      };
    }
    
    if (knowledgeResult.source === 'library+ai') {
      console.log('✅ Answered from Knowledge Library + Ai Enhancement');
      return { 
        response: knowledgeResult.answer, 
        isOnTopic: true, 
        provider: 'knowledge-library' 
      };
    }
    
    if (knowledgeResult.source === 'out-of-scope') {
      console.log('❌ Question out of scope');
      return { 
        response: knowledgeResult.answer, 
        isOnTopic: false, 
        provider: 'knowledge-library' 
      };
    }
    
    // If library confidence is medium/low, proceed to Ai for enhancement
    console.log('⚠️ Library confidence medium/low, trying Ai for better answer...');
    
  } catch (error) {
    console.warn('Knowledge library error, falling back to Ai:', error);
  }

  // Pre-filter: Block obvious off-topic before hitting Ai (save API cost!)
  const preCheck = await generateChatResponse(message, mode);
  if (!preCheck.isOnTopic) {
    return { ...preCheck, provider: 'bias' };
  }

  // Tier 1: Try OpenAI
  try {
    const openaiResponse = await callOpenAI(message, mode);
    if (openaiResponse) {
      console.log('✅ Answered by OpenAI GPT-4o-mini');
      return { response: openaiResponse, isOnTopic: true, provider: 'openai' };
    }
  } catch (error) {
    console.log('❌ OpenAI failed, falling back to Gemini:', error);
  }

  // Tier 2: Try Gemini
  try {
    const geminiResponse = await callGemini(message, mode);
    if (geminiResponse) {
      console.log('✅ Answered by Gemini 1.5 Flash');
      return { response: geminiResponse, isOnTopic: true, provider: 'gemini' };
    }
  } catch (error) {
    console.log('❌ Gemini failed, falling back to BIAS library:', error);
  }

  // Tier 3: BIAS Library (always works)
  console.log('✅ Answered by BIAS fallback library');
  return { ...preCheck, provider: 'bias' };
}

async function callOpenAI(message: string, mode: BiasMode): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: BIAS_SYSTEM_PROMPT },
          { role: 'user', content: `[Mode: ${mode}] ${message}` }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI error:', error);
    return null;
  }
}

async function callGemini(message: string, mode: BiasMode): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${BIAS_SYSTEM_PROMPT}\n\n[Mode: ${mode}]\nUser: ${message}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
}

/**
 * ========================================
 * TIKTOK ANALYSIS MODULE
 * ========================================
 * Maps TikTok metrics to 8-layer BIAS framework
 */

interface TikTokAccountData {
  username: string;
  followers: number;
  following: number;
  totalLikes: number;
  videoCount: number;
  avgViews: number;
  avgEngagementRate: number;
  bio?: string;
  verified?: boolean;
}

interface TikTokVideoData {
  videoId: string;
  description: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  hashtags: string[];
  sounds?: string;
  transcription?: string;
}

export interface TikTokAccountAnalysis {
  username: string;
  overallScore: number;
  biasLayers: {
    VBM: { score: number; insight: string };
    EPM: { score: number; insight: string };
    NLP: { score: number; insight: string };
    ETH: { score: number; insight: string };
    ECO: { score: number; insight: string };
    SOC: { score: number; insight: string };
    COG: { score: number; insight: string };
    BMIL: { score: number; insight: string };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  audienceInsights: {
    engagement: 'low' | 'medium' | 'high';
    growth: 'declining' | 'stable' | 'growing';
    contentStrategy: string;
  };
}

export interface TikTokVideoAnalysis {
  videoId: string;
  overallScore: number;
  biasLayers: {
    VBM: { score: number; insight: string };
    EPM: { score: number; insight: string };
    NLP: { score: number; insight: string };
    ETH: { score: number; insight: string };
    ECO: { score: number; insight: string };
    SOC: { score: number; insight: string };
    COG: { score: number; insight: string };
    BMIL: { score: number; insight: string };
  };
  viralPotential: number;
  recommendations: string[];
  hooks: {
    opening: { score: number; feedback: string };
    retention: { score: number; feedback: string };
    cta: { score: number; feedback: string };
  };
}

export async function analyzeTikTokAccount(data: TikTokAccountData): Promise<TikTokAccountAnalysis> {
  const engagementRate = data.avgEngagementRate;
  const followerRatio = data.followers / Math.max(data.following, 1);
  const avgLikesPerVideo = data.totalLikes / Math.max(data.videoCount, 1);
  const contentConsistency = data.videoCount > 20 ? 8 : data.videoCount > 10 ? 6 : 4;

  // VBM - Visual Behavior Metrics (profile appeal, thumbnail consistency)
  const vbmScore = Math.min(10, Math.round(
    (data.verified ? 3 : 0) + 
    (data.bio && data.bio.length > 20 ? 2 : 0) +
    (followerRatio > 10 ? 3 : followerRatio > 5 ? 2 : 1) +
    (contentConsistency / 2)
  ));

  // EPM - Emotional Processing (audience connection via likes/shares)
  const epmScore = Math.min(10, Math.round(
    (engagementRate > 10 ? 8 : engagementRate > 5 ? 6 : engagementRate > 2 ? 4 : 2) +
    (avgLikesPerVideo > 10000 ? 2 : avgLikesPerVideo > 1000 ? 1 : 0)
  ));

  // NLP - Narrative & Language (bio quality, storytelling)
  const nlpScore = Math.min(10, Math.round(
    (data.bio && data.bio.length > 50 ? 6 : data.bio && data.bio.length > 20 ? 4 : 2) +
    (data.videoCount > 30 ? 4 : 2)
  ));

  // ETH - Ethics & Authenticity
  const ethScore = Math.min(10, Math.round(
    (data.verified ? 4 : 0) +
    (followerRatio > 5 ? 3 : 1) +
    (engagementRate > 3 ? 3 : 1)
  ));

  // ECO - Ecosystem Optimization (platform algorithm alignment)
  const ecoScore = Math.min(10, Math.round(
    (data.videoCount > 50 ? 4 : data.videoCount > 20 ? 3 : 1) +
    (engagementRate > 5 ? 3 : 1) +
    (data.avgViews > 100000 ? 3 : data.avgViews > 10000 ? 2 : 1)
  ));

  // SOC - Social Dynamics (community building)
  const socScore = Math.min(10, Math.round(
    (data.followers > 100000 ? 5 : data.followers > 10000 ? 3 : 1) +
    (engagementRate > 5 ? 3 : 1) +
    (followerRatio > 10 ? 2 : 1)
  ));

  // COG - Cognitive Impact (value delivery)
  const cogScore = Math.min(10, Math.round(
    (contentConsistency) +
    (engagementRate > 3 ? 2 : 1)
  ));

  // BMIL - Behavioral Micro-Interactions Layer
  const bmilScore = Math.min(10, Math.round(
    (data.avgViews / Math.max(data.followers, 1) > 0.5 ? 5 : 3) +
    (engagementRate > 5 ? 3 : 1) +
    (data.videoCount > 30 ? 2 : 1)
  ));

  const overallScore = Math.round(
    (vbmScore + epmScore + nlpScore + ethScore + ecoScore + socScore + cogScore + bmilScore) / 8
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (epmScore >= 8) strengths.push('Strong emotional connection dengan audience');
  else if (epmScore <= 4) {
    weaknesses.push('Engagement rate rendah');
    recommendations.push('Bikin konten yang lebih relatable & trigger emosi');
  }

  if (ecoScore >= 8) strengths.push('Konsisten upload & algoritma-friendly');
  else if (ecoScore <= 5) {
    weaknesses.push('Kurang konsisten upload');
    recommendations.push('Upload minimal 3-5x seminggu untuk boost algorithm');
  }

  if (vbmScore >= 8) strengths.push('Profile professional & visual appeal kuat');
  else if (vbmScore <= 5) {
    weaknesses.push('Profile kurang optimal');
    recommendations.push('Update bio dengan value proposition yang jelas');
  }

  if (nlpScore <= 5) {
    recommendations.push('Improve storytelling di caption & video structure');
  }

  return {
    username: data.username,
    overallScore,
    biasLayers: {
      VBM: { score: vbmScore, insight: vbmScore >= 7 ? 'Profile visually appealing' : 'Perlu optimize profile & thumbnails' },
      EPM: { score: epmScore, insight: epmScore >= 7 ? 'Koneksi emosional kuat' : 'Audience belum fully engaged' },
      NLP: { score: nlpScore, insight: nlpScore >= 7 ? 'Storytelling solid' : 'Narrative structure bisa ditingkatkan' },
      ETH: { score: ethScore, insight: ethScore >= 7 ? 'Authentic & trusted' : 'Perlu build kredibilitas lebih' },
      ECO: { score: ecoScore, insight: ecoScore >= 7 ? 'Algorithm-optimized' : 'Konsistensi upload masih kurang' },
      SOC: { score: socScore, insight: socScore >= 7 ? 'Community building bagus' : 'Interaksi dengan followers bisa lebih aktif' },
      COG: { score: cogScore, insight: cogScore >= 7 ? 'Konten valuable' : 'Fokus deliver value yang lebih clear' },
      BMIL: { score: bmilScore, insight: bmilScore >= 7 ? 'Micro-interactions efektif' : 'Hook & retention perlu improvement' },
    },
    strengths,
    weaknesses,
    recommendations,
    audienceInsights: {
      engagement: engagementRate > 7 ? 'high' : engagementRate > 3 ? 'medium' : 'low',
      growth: followerRatio > 10 && engagementRate > 5 ? 'growing' : followerRatio > 3 ? 'stable' : 'declining',
      contentStrategy: ecoScore >= 7 ? 'Consistent & algorithm-aligned' : 'Needs optimization',
    },
  };
}

export async function analyzeTikTokVideo(data: TikTokVideoData): Promise<TikTokVideoAnalysis> {
  const engagementRate = ((data.likes + data.comments + data.shares) / Math.max(data.views, 1)) * 100;
  const likeToViewRatio = (data.likes / Math.max(data.views, 1)) * 100;
  const commentToLikeRatio = (data.comments / Math.max(data.likes, 1)) * 100;
  const shareability = (data.shares / Math.max(data.views, 1)) * 100;

  // VBM - Visual hook & thumbnail appeal
  const vbmScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 5 : likeToViewRatio > 2 ? 3 : 1) +
    (data.duration < 30 ? 3 : data.duration < 60 ? 2 : 1) +
    (data.hashtags.length >= 3 && data.hashtags.length <= 7 ? 2 : 1)
  ));

  // EPM - Emotional resonance
  const epmScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 6 : likeToViewRatio > 2 ? 4 : 2) +
    (commentToLikeRatio > 5 ? 2 : 1) +
    (shareability > 1 ? 2 : 1)
  ));

  // NLP - Narrative & caption quality
  const nlpScore = Math.min(10, Math.round(
    (data.description.length > 50 ? 4 : data.description.length > 20 ? 2 : 1) +
    (data.hashtags.length >= 3 ? 3 : 1) +
    (data.transcription && data.transcription.length > 100 ? 3 : 1)
  ));

  // ETH - Authenticity
  const ethScore = Math.min(10, Math.round(
    (engagementRate > 10 ? 5 : engagementRate > 5 ? 3 : 1) +
    (commentToLikeRatio > 3 ? 3 : 1) +
    (shareability > 0.5 ? 2 : 1)
  ));

  // ECO - Algorithm optimization
  const ecoScore = Math.min(10, Math.round(
    (data.hashtags.length >= 3 && data.hashtags.length <= 7 ? 3 : 1) +
    (data.sounds ? 2 : 0) +
    (data.duration >= 7 && data.duration <= 60 ? 3 : 1) +
    (engagementRate > 5 ? 2 : 1)
  ));

  // SOC - Social virality
  const socScore = Math.min(10, Math.round(
    (shareability > 2 ? 5 : shareability > 1 ? 3 : 1) +
    (commentToLikeRatio > 5 ? 3 : 1) +
    (data.views > 100000 ? 2 : data.views > 10000 ? 1 : 0)
  ));

  // COG - Value delivery
  const cogScore = Math.min(10, Math.round(
    (engagementRate > 7 ? 5 : engagementRate > 3 ? 3 : 1) +
    (data.duration >= 15 ? 3 : 1) +
    (commentToLikeRatio > 3 ? 2 : 1)
  ));

  // BMIL - Micro-interactions (hook, retention, CTA)
  const bmilScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 4 : 2) +
    (engagementRate > 7 ? 3 : 1) +
    (shareability > 1 ? 3 : 1)
  ));

  const overallScore = Math.round(
    (vbmScore + epmScore + nlpScore + ethScore + ecoScore + socScore + cogScore + bmilScore) / 8
  );

  const viralPotential = Math.min(100, Math.round(
    (shareability * 20) + (engagementRate * 5) + (likeToViewRatio * 10)
  ));

  const recommendations: string[] = [];
  if (vbmScore <= 5) recommendations.push('Bikin hook visual yang lebih kuat di 3 detik pertama');
  if (epmScore <= 5) recommendations.push('Trigger emosi lebih kuat - surprise, humor, atau relatable moment');
  if (nlpScore <= 5) recommendations.push('Caption perlu lebih engaging & descriptive');
  if (ecoScore <= 5) recommendations.push('Pakai 3-5 hashtags relevant & trending sound');
  if (socScore <= 5) recommendations.push('Bikin konten yang lebih shareable - edukasi atau entertaining');
  if (bmilScore <= 5) recommendations.push('Strengthen hook opening & add clear CTA di akhir');

  return {
    videoId: data.videoId,
    overallScore,
    biasLayers: {
      VBM: { score: vbmScore, insight: vbmScore >= 7 ? 'Visual hook strong' : 'Opening visual perlu lebih compelling' },
      EPM: { score: epmScore, insight: epmScore >= 7 ? 'Emotional impact tinggi' : 'Konten kurang trigger emosi' },
      NLP: { score: nlpScore, insight: nlpScore >= 7 ? 'Caption & narrative solid' : 'Storytelling bisa ditingkatkan' },
      ETH: { score: ethScore, insight: ethScore >= 7 ? 'Authentic & relatable' : 'Konten terasa scripted/forced' },
      ECO: { score: ecoScore, insight: ecoScore >= 7 ? 'Algorithm-optimized' : 'Hashtag & sound strategy kurang optimal' },
      SOC: { score: socScore, insight: socScore >= 7 ? 'High viral potential' : 'Shareability rendah' },
      COG: { score: cogScore, insight: cogScore >= 7 ? 'Valuable content' : 'Value proposition kurang jelas' },
      BMIL: { score: bmilScore, insight: bmilScore >= 7 ? 'Micro-interactions efektif' : 'Hook & CTA perlu diperkuat' },
    },
    viralPotential,
    recommendations,
    hooks: {
      opening: {
        score: vbmScore,
        feedback: vbmScore >= 7 ? '3 detik pertama catchy!' : 'Opening hook perlu lebih menarik perhatian',
      },
      retention: {
        score: cogScore,
        feedback: cogScore >= 7 ? 'Konten retain audience well' : 'Audience drop-off tinggi, perlu pacing lebih baik',
      },
      cta: {
        score: socScore,
        feedback: socScore >= 7 ? 'CTA efektif drive engagement' : 'Tambahkan CTA yang jelas (like, share, comment)',
      },
    },
  };
}
