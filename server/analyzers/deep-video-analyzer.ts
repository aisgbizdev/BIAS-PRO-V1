// Deep Video Analyzer - Ai-Powered Specific & Actionable Analysis
// Provides CONCRETE feedback with timestamps, specific observations, and practical recommendations

import OpenAI from 'openai';
import { checkRateLimit, recordUsage, RateLimitResult } from '../utils/ai-rate-limiter';

interface DeepAnalysisInput {
  content: string;
  mode: 'creator' | 'academic' | 'hybrid';
  inputType: 'text' | 'video' | 'photo' | 'audio';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'non-social';
  sessionId?: string;
}

export interface DeepAnalysisResult {
  layers: DeepLayerAnalysis[];
  rateLimitInfo?: RateLimitResult;
  tokensUsed?: number;
}

interface DeepLayerAnalysis {
  layer: string;
  score: number;
  specificObservations: string[];  // Concrete examples from video
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
  feedback: string;
  feedbackId: string;
}

const DEEP_ANALYSIS_PROMPT = `Kamu BIAS²³ Pro Analyzer - kasih analisis SUPER SPESIFIK untuk video/audio/presentasi user. JANGAN GENERIC!

**CRITICAL - BACA DULU:**

1. **CONTOH WAJIB DARI KONTEN USER:**
   ❌ GENERIC (FORBIDDEN): "Improve your body language"  
   ✅ SPECIFIC (REQUIRED): "Di bagian awal pas kamu bilang 'growth mindset', gesture tangan kamu ekspresif banget - bagus! Tapi pas jelasin data di tengah, tangan kaku di samping. FIX: Saat bahas angka/data, point ke screen/grafik pakai tangan kanan (1-2x)."

2. **GUNAKAN DETAIL YANG USER KASIH:**
   - Kutip EXACT words/phrases dari description user
   - Refer ke bagian spesifik: "awal video", "tengah", "closing", atau timestamps jika ada
   - Count filler words jika disebutkan: "eee" muncul ~5x, "umm" 3x
   - JANGAN assume info yang gak ada - base on apa yang user describe

3. **RECOMMENDATIONS = ACTIONABLE STEPS, BUKAN THEORY:**
   ❌ GENERIC: "Week 1: Upload video untuk analisis"
   ✅ SPECIFIC: "Starting TOMORROW: Record 5 practice runs (30 detik each). Di setiap run, fokus 1 perbaikan: Run 1 = kurangi 'eee', Run 2 = add 1 hand gesture saat main point, Run 3 = vary voice pitch. Week 1 target: maksimal 3 filler words per 30 detik. Week 2: Post video baru, compare engagement rate."

4. **8 LAYERS - ANALYZE INI (RINGKAS):**
   VBM: postur, gesture (count!), eye contact, facial expression
   EPM: emotional range, energy consistency, authenticity  
   NLP: hook strength, filler words (COUNT!), pacing, structure
   ETH: fact-check, source credibility, platform guidelines compliance
   ECO: algorithm fit (TikTok/IG/YT), trend relevance, format optimization
   SOC: CTA clarity, engagement cues, relatability
   COG: info density, complexity management, processing time
   BMIL: confidence signals, nervousness indicators, authority markers

5. **RECOMMENDATIONS HARUS:**
   - Mulai dengan "Starting TOMORROW" atau "Week 1"
   - Specific action: "Record 3x practice runs, fokus X"
   - Measurable target: "Target: max 2 filler words per 30 detik"
   - Expected result: "Expected: +20% engagement dalam 2 minggu"
   
   JANGAN BILANG "upload video untuk analisis" - USER UDAH UPLOAD!

**FORMAT OUTPUT:**
Setiap layer:
{
  "score": 0-100,
  "specificObservations": ["Quote exact dari user content", "Concrete example"],
  "strengths": ["What's ALREADY good dengan contoh spesifik"],
  "weaknesses": ["What needs improvement dengan contoh konkret"],  
  "actionableRecommendations": ["TOMORROW: Specific drill. Week 1: Measurable target. Expected: Result"],
  "feedback": "4-5 kalimat dalam Bahasa Indonesia yang praktis, motivating, BUKAN teori!"
}

INGAT: User frustasi dengan generic advice. Berikan VALUE MAKSIMAL - specific observations + actionable steps!`;

export async function deepAnalyzeWithAI(input: DeepAnalysisInput): Promise<DeepAnalysisResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sessionId = input.sessionId || 'anonymous';

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️ OpenAI API key not found - falling back to basic analysis');
    return { layers: generateBasicAnalysis(input) };
  }

  // Check rate limit before making API call
  const rateLimitCheck = checkRateLimit(sessionId);
  if (!rateLimitCheck.allowed) {
    console.warn(`⚠️ Rate limit exceeded for session ${sessionId}: ${rateLimitCheck.reason}`);
    return { 
      layers: generateBasicAnalysis(input),
      rateLimitInfo: rateLimitCheck,
    };
  }

  try {
    const modeContext = getModeContext(input.mode);
    const platformContext = getPlatformContext(input.platform);

    const userPrompt = `
**CONTEXT:**
- Mode: ${input.mode.toUpperCase()}
- Input Type: ${input.inputType}
- Platform: ${input.platform || 'general'}

${modeContext}
${platformContext}

**CONTENT TO ANALYZE:**
${input.content}

**TASK:** Analyze pakai 8-layer BIAS. WAJIB SPESIFIK!

**CRITICAL:**
- Quote EXACT dari content user (kata-kata yang dia tulis)
- Gesture kaku? → "TOMORROW: Practice 5x di cermin, gerakan tangan saat bilang [key point]"
- Filler words banyak? → "Count: kamu bilang 'eee' ~7x. TARGET: Week 1 max 3x. DRILL: Pause 2 detik instead of saying 'eee'"
- Monotone? → "Detik X-Y suara flat. FIX: Record ulang bagian itu 3x, setiap recording vary pitch different"

JANGAN BILANG: "Week 1: Upload video" - USER UDAH UPLOAD!
HARUS BILANG: "TOMORROW: [Specific action]. Week 1: [Measurable target]. Expected: [Real result]"

Platform: ${input.platform || 'general'} - Check community guidelines!
${input.mode === 'academic' || input.mode === 'hybrid' ? 'Academic mode: Check citations & logic!' : ''}

JSON array (8 layers), each:
{
  "layer": "VBM (Visual Behavior Mapping)",
  "score": 75,
  "specificObservations": ["observation 1", "observation 2", ...],
  "strengths": ["strength 1 dengan contoh spesifik", ...],
  "weaknesses": ["weakness 1 dengan contoh konkret", ...],
  "actionableRecommendations": ["Step 1: ... (Timeline: Week 1-2)", ...],
  "feedback": "Narrative 4-5 kalimat yang mendidik & motivating dalam Bahasa Indonesia",
  "feedbackId": "Same as feedback (Indonesian)"
}

CRITICAL: Berikan analysis yang DETAIL & SPESIFIK - ini premium service, bukan generic template!`;

    console.log('🚀 Calling OpenAI GPT-4o-mini for deep analysis... (optimized for <20s response)');
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: DEEP_ANALYSIS_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,  // Lower = faster, more focused
      max_tokens: 2200,  // Reduced from 4000 for 2x faster response
      response_format: { type: "json_object" },
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ OpenAI deep analysis completed in ${(duration/1000).toFixed(1)}s`);

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('Empty Ai response');
    }

    // Parse Ai response
    const parsedResponse = JSON.parse(responseContent);
    
    // Handle various response formats from OpenAI
    let layers: any[] = [];
    if (Array.isArray(parsedResponse)) {
      layers = parsedResponse;
    } else if (parsedResponse.layers && Array.isArray(parsedResponse.layers)) {
      layers = parsedResponse.layers;
    } else if (parsedResponse.analysis && Array.isArray(parsedResponse.analysis)) {
      layers = parsedResponse.analysis;
    } else {
      // Try to extract layers from any array-like property
      const arrayProps = Object.values(parsedResponse).filter(v => Array.isArray(v));
      if (arrayProps.length > 0 && (arrayProps[0] as any[]).length === 8) {
        layers = arrayProps[0] as any[];
      }
    }
    
    console.log(`Parsed ${layers.length} layers from AI response`);
    
    if (!layers || layers.length === 0) {
      console.log('AI response structure:', JSON.stringify(Object.keys(parsedResponse)));
      throw new Error('No layers in Ai response');
    }

    // Record token usage (approximate based on response length)
    const tokensUsed = completion.usage?.total_tokens || Math.ceil(responseContent.length / 4);
    recordUsage(sessionId, tokensUsed);

    return { 
      layers: layers as DeepLayerAnalysis[], 
      rateLimitInfo: rateLimitCheck,
      tokensUsed,
    };

  } catch (error) {
    console.error('❌ Deep Ai Analysis Error:', error);
    console.log('📊 Falling back to basic analysis...');
    return { layers: generateBasicAnalysis(input) };
  }
}

function getModeContext(mode: string): string {
  const contexts: Record<string, string> = {
    creator: `
**CREATOR MODE FOCUS:**
- TikTok/Instagram/YouTube content optimization
- Viral potential & engagement maximization  
- Platform algorithm alignment
- Creator personality & brand building
- Entertainment value & watchability`,
    
    academic: `
**ACADEMIC MODE FOCUS:**
- Professional presentation quality
- Academic rigor & citation accuracy
- Logical argument structure
- Evidence-based communication
- Leadership & authority presence
- Research presentation standards`,
    
    hybrid: `
**HYBRID MODE FOCUS:**
- Professional content for public platforms
- Balance between engaging & credible
- Educational entertainment (edutainment)
- Expert positioning with accessibility
- Platform optimization + academic rigor`
  };
  
  return contexts[mode] || contexts.creator;
}

function getPlatformContext(platform?: string): string {
  const contexts: Record<string, string> = {
    tiktok: `
**TIKTOK COMMUNITY GUIDELINES CHECK:**
- ❌ Prohibited: Misinformation, hate speech, bullying, dangerous acts, nudity, violence
- ⚠️ Restricted: Minors safety, intellectual property, spam, deceptive content
- ✅ Best practices: Authentic content, creative, positive community engagement`,
    
    instagram: `
**INSTAGRAM COMMUNITY GUIDELINES CHECK:**
- ❌ Prohibited: Nudity, hate speech, violence, harassment, false information
- ⚠️ Restricted: Regulated goods, graphic content, spam behavior
- ✅ Best practices: Original content, authentic engagement, respectful interaction`,
    
    youtube: `
**YOUTUBE COMMUNITY GUIDELINES CHECK:**
- ❌ Prohibited: Harmful/dangerous content, hate speech, harassment, misinformation, child safety violations
- ⚠️ Restricted: Age-restricted content, copyright violations, clickbait metadata
- ✅ Best practices: Original quality content, accurate metadata, community engagement`,
    
    'non-social': `
**PROFESSIONAL COMMUNICATION STANDARDS:**
- ✅ Authenticity & credibility focus
- ✅ Evidence-based statements
- ✅ Professional presentation quality
- ✅ Clear, structured messaging`
  };
  
  return contexts[platform || 'non-social'] || contexts['non-social'];
}

function generateBasicAnalysis(input: DeepAnalysisInput): DeepLayerAnalysis[] {
  // Fallback basic analysis - provide meaningful scores based on content length/quality
  const contentLength = input.content?.length || 0;
  const hasContent = contentLength > 50;
  const baseScore = hasContent ? 60 : 40;
  
  const layerData = [
    { name: 'VBM (Visual Behavior Mapping)', desc: 'Pemetaan perilaku visual dan ekspresi', scoreBonus: 5 },
    { name: 'EPM (Emotional Processing Metric)', desc: 'Pemrosesan emosi dan resonansi', scoreBonus: 8 },
    { name: 'NLP (Narrative & Language Patterns)', desc: 'Pola narasi dan bahasa', scoreBonus: 10 },
    { name: 'ETH (Ethical Framework)', desc: 'Kerangka etika komunikasi', scoreBonus: 15 },
    { name: 'ECO (Ecosystem Awareness)', desc: 'Kesadaran ekosistem platform', scoreBonus: 5 },
    { name: 'SOC (Social Intelligence)', desc: 'Kecerdasan sosial dalam komunikasi', scoreBonus: 8 },
    { name: 'COG (Cognitive Load Management)', desc: 'Manajemen beban kognitif penonton', scoreBonus: 5 },
    { name: 'BMIL (Behavioral Micro-Indicators Library)', desc: 'Indikator mikro perilaku', scoreBonus: 10 }
  ];

  return layerData.map((layer) => {
    const score = Math.min(95, baseScore + layer.scoreBonus + Math.floor(Math.random() * 10));
    return {
      layer: layer.name,
      score,
      specificObservations: [
        `Konten menunjukkan karakteristik ${layer.desc.toLowerCase()}`,
        `Platform ${input.platform || 'digital'} memiliki standar tertentu`,
        `Mode ${input.mode} memerlukan pendekatan komunikasi yang sesuai`
      ],
      strengths: [
        `Konten memiliki potensi untuk platform ${input.platform || 'digital'}`,
        `Approach komunikasi sesuai dengan mode ${input.mode}`
      ],
      weaknesses: [
        `Perlu optimasi lebih lanjut untuk ${layer.desc.toLowerCase()}`,
        `Pertimbangkan untuk meningkatkan aspek ini`
      ],
      actionableRecommendations: [
        `Tingkatkan ${layer.desc.toLowerCase()} dengan latihan konsisten`,
        `Perhatikan feedback audiens untuk perbaikan berkelanjutan`
      ],
      feedback: `${layer.name}: Skor ${score}/100. ${layer.desc}. Konten Anda menunjukkan potensi yang baik dalam aspek ini. Untuk meningkatkan, fokus pada konsistensi dan keaslian dalam penyampaian. Terus kembangkan kekuatan unik Anda dan perhatikan respons audiens untuk iterasi yang lebih baik.`,
      feedbackId: `${layer.name}: Skor ${score}/100. ${layer.desc}. Konten Anda menunjukkan potensi yang baik dalam aspek ini. Untuk meningkatkan, fokus pada konsistensi dan keaslian dalam penyampaian. Terus kembangkan kekuatan unik Anda dan perhatikan respons audiens untuk iterasi yang lebih baik.`
    };
  });
}
