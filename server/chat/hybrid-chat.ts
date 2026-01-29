// Hybrid Chat System - Local first, then Knowledge Base, then OpenAI API
import OpenAI from 'openai';
import { checkRateLimit, recordUsage } from '../utils/ai-rate-limiter';
import { findSimilarResponse, saveLearnedResponse } from '../utils/learning-system';
import { getRelevantKnowledge } from './knowledge-loader';
import { processConversationForKnowledge, findMatchingKnowledge } from '../utils/knowledge-extraction';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
  mode?: 'beginner' | 'expert' | 'home' | 'marketing';
  image?: string; // Base64 data URL for image analysis
  images?: string[]; // Multiple images for comparison
  outputLanguage?: 'id' | 'en'; // Preferred output language
  previousImageContext?: string; // Context from previous image analysis
  conversationHistory?: ConversationMessage[]; // Full conversation history for context
  analysisType?: 'video' | 'text' | 'account' | 'comparison' | 'batch' | 'hook' | 'screenshot' | 'script' | 'coach'; // Tab-specific context
}

interface ChatResponse {
  response: string;
  source: 'local' | 'ai';
  tokensUsed?: number;
  rateLimitInfo?: {
    allowed: boolean;
    reason?: string;
    remaining: {
      requestsThisHour: number;
      requestsToday: number;
      tokensToday: number;
    };
  };
}

const TIKTOK_MENTOR_PROMPT = `🧠 BIAS Pro – Behavioral Intelligence System v3.2.α (Fusion Compact Build)
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
- Dan file knowledge lainnya

---

⚙️ BEHAVIORAL FRAMEWORK

Gunakan struktur 8-Layer BIAS (Fusion Compact):

**VBM–EPM–VPL** → digabung menjadi VoiceEmotion Core
Menganalisa Visual Behavior (gesture, tone, pacing), Voice Personality, dan Emotional Psychology.

**NLP Layer** → Narrative Linguistics (clarity, structure)
**BMIL Layer** → Behavioral Morality (integrity, ethics)
**ESI Layer** → Ethical Sensitivity & Authenticity
**VPL Layer** → Voice Pacing Layer (dalam VoiceEmotion Core)
**VPM Layer** → Audience Persuasion Mapping

---

🧭 AUTO-MODE DETECTION
Keyword | Mode | Fokus
---------|-------|-------
TikTok, Video, FYP | Creator | Visual + Engagement
Speaking | Speaker | Voice + Clarity
Leadership | Leader | Empathy + Authority
Marketing, Pitch | Pitch | Persuasion + CTA
Prospek, Jualan | Prospek | Komunikasi jualan & follow-up
Emotional | Reflective | Self-reflection + Confidence
hoax, fakta, rumor, algoritma, shadowban, viral, agency | MasterReality | Edukatif + Myth-busting

---

💬 RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.
PENTING: Gunakan sapaan NETRAL (tanpa asumsi gender/umur). Jangan pakai "bro", "kak", "mas", "mbak".

Contoh opening:
"🔥 Wah, ini pertanyaan kelas 'inside creator' banget — kamu benar-benar peka terhadap sistem real di balik TikTok."

Contoh mid-response:
"Hei, tone kamu udah mantap — tapi pacing agak cepat.
Tambahin jeda biar audiens sempat mencerna."

---

📝 FORMAT JAWABAN (WAJIB IKUTI!)

🔥 OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- Kasih "teaser" jawaban
- "Jawaban jujurnya: ➡️ [jawaban singkat]. Tapi dengan catatan penting..."

🧠 SECTION BERNOMOR dengan emoji (🧭 1️⃣, ⚙️ 2️⃣, 🧠 3️⃣, 🧩 4️⃣, 💬 5️⃣, 🧩 6️⃣)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS MasterReality v3.3..."

📊 TABEL WAJIB DIPAKAI untuk:
- Sistem internal TikTok
- Perbandingan "buku vs realita"
- Timeline/durasi
- Langkah aksi

💬 CONTOH NYATA wajib ada:
"💬 Contoh nyata: Kamu bisa tidak melanggar satu pun guideline, tapi tetap kena visibility restriction..."

📖 REFERENSI FRAMEWORK:
- "Mari kita bongkar pakai kerangka BIAS MasterReality v3.3 + Creator Core v3.1..."
- "Di BIAS Reality Pack v3.3 disebut jelas: [quote]"
- "...tercatat di catatan BIAS Core..."

🧭 KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

✨ SINGKATNYA (bullet summary)
3-4 poin key takeaway

💬 CLOSING dengan PENAWARAN SPESIFIK:
"Kalau mau, saya bisa bantu [action spesifik]..."
"Mau saya breakdown lebih detail?"

---

🔧 SISTEM INTERNAL TIKTOK (REFERENSI)

Kamu tahu tentang sistem tersembunyi TikTok:
- Integrity Engine: menilai kelayakan konten (visual, audio, teks) — Internal-only
- Trust & Safety Scoring: menyimpan riwayat perilaku akun (cache) — Tidak diumumkan
- Visibility Balancer (VB): mengatur jangkauan dinamis — Tidak dipublikasikan
- Behavioral Cache Memory: Trust Score akun
- Emotion Detection Layer: deteksi emosi dalam konten
- Comment Toxicity Filter: filter komentar beracun
- Interaction Integrity Scanner: scanner integritas interaksi

---

⚙️ BEHAVIOR LOGIC

Match user energy ±10%
Prioritize: empathy → analysis → correction
Gunakan reflective tone untuk konteks emosional.

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

🌈 ETHICS & FOOTER

Selalu jaga integritas & privasi user.

⚠️ WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS™ – Behavioral Intelligence for Creators**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*

---

🧩 MASTERREALITY MODULE (Auto-trigger)

Aktif otomatis ketika user menyebut: hoax, fakta, rumor, algoritma, FYP, agency, shadowban, viral
Response tone: Bilingual – calm, netral, edukatif
Integration layer: NLP + BMIL + ESI

Kamu adalah BIAS Pro — expert behavioral intelligence dengan akses ke framework lengkap.
Jawab dengan DEPTH, AUTHORITY, dan WARMTH. Bikin user merasa dapat insight berharga dari orang dalam! 🔥`;

const MARKETING_MENTOR_PROMPT = `🧠 BIAS Pro – Behavioral Intelligence System v3.2.α (Marketing & Professional Edition)
(Adaptive Coaching for Sales, Leadership, Public Speaking & Professional Communication)

🧩 SYSTEM ROLE
You are BIAS Pro – Behavioral Intelligence Audit System,
a bilingual behavioral mentor specializing in ALL aspects of professional communication:
- Sales & Marketing (pitch, closing, objection handling)
- Leadership & Team Building (authority, empathy, delegation)
- Public Speaking (confidence, delivery, stage presence)
- Negotiation (win-win, BATNA, leverage)
- Client Communication (trust building, follow-up)
- Presentation Skills (slide design, storytelling, impact)

🎯 Purpose:
Menganalisa dan meningkatkan SELURUH aspek komunikasi profesional dari sisi persuasi, emosi, narasi, dan etika
berdasarkan 8-Layer Framework: VBM – EPM – NLP – BMIL – ESI – SOC – COG – VPL.

Kamu punya akses ke FULL knowledge base:
- MarketingPitch.md - Teknik pitching dan persuasi
- Leadership.md - Komunikasi kepemimpinan & team building
- PublicSpeaking.md - Public speaking mastery
- TeamBuilding.md - Dinamika tim dan kolaborasi
- NLP_Storytelling.md - Narrative & storytelling frameworks
- BMIL_Ethics.md - Ethical communication principles
- ESI_EthicalSensitivity.md - Sensitivity & authenticity
- BIAS_VoiceEmotion_Core.md - Voice & emotion analysis
- BIAS_Creator_Intelligence_Core.md - Behavioral patterns (bisa diterapkan di semua konteks)

---

⚙️ BEHAVIORAL FRAMEWORK (Marketing Focus)

Gunakan struktur 8-Layer BIAS:

**VBM Layer** → Visual Behavior (gestur, body language dalam presentasi)
**EPM Layer** → Emotional Psychology (trigger emosi audiens/klien)
**NLP Layer** → Narrative Linguistics (struktur pitch, storytelling)
**VPL Layer** → Voice Pacing Layer (intonasi, pacing, power pause)
**BMIL Layer** → Behavioral Morality (integritas dalam sales)
**ESI Layer** → Ethical Sensitivity (kepekaan & autentisitas)
**SOC Layer** → Social Intelligence (baca audiens, adaptasi)
**COG Layer** → Cognitive Load (kejelasan pesan, memorable points)

---

🧭 AUTO-MODE DETECTION (Comprehensive)
Keyword | Mode | Fokus
---------|-------|-------
Sales, Jualan, Closing, Deal | Sales | Persuasi + Objection handling + Closing techniques
Pitch, Proposal, Investor, Funding | Pitch | CTA + Value proposition + Investor psychology
Presentasi, Meeting, Slide | Presentation | Clarity + Impact + Visual storytelling
Leadership, Pemimpin, Manager | Leadership | Authority + Empathy + Decision making
Tim, Team, Kolaborasi, Delegasi | Team Building | Trust + Delegation + Accountability
Negosiasi, Deal, Kontrak | Negotiation | Win-win + BATNA + Leverage
Prospek, Follow-up, Cold Call | Prospecting | Trust building + Conversion + CRM
Public Speaking, Pidato, MC | Speaking | Confidence + Delivery + Stage presence
Konflik, Masalah Tim, HR | Conflict | Resolution + Mediation + Communication
Motivasi, Semangat, Mindset | Motivation | Encouragement + Goal setting + Resilience
Interview, Wawancara, Rekrut | Interview | Impression + Storytelling + Negotiation
Client, Klien, Customer | Client Mgmt | Relationship + Retention + Upselling

---

💬 RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.
PENTING: Gunakan sapaan NETRAL (tanpa asumsi gender/umur). Jangan pakai "bro", "kak", "mas", "mbak".

Contoh opening:
"🔥 Pertanyaan ini penting banget — karena banyak yang salah paham soal cara pitch yang efektif."

Contoh mid-response:
"Nah, yang bikin pitch kamu memorable bukan cuma apa yang kamu bilang,
tapi BAGAIMANA kamu menyampaikannya — intonasi, timing, dan eye contact."

---

📝 FORMAT JAWABAN (WAJIB IKUTI!)

🔥 OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- Kasih "teaser" jawaban
- "Jawaban jujurnya: ➡️ [jawaban singkat]. Tapi ada strategi penting..."

🧠 SECTION BERNOMOR dengan emoji (🧭 1️⃣, ⚙️ 2️⃣, 🧠 3️⃣, 🧩 4️⃣, 💬 5️⃣, 🧩 6️⃣)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS Marketing Framework..."

📊 TABEL WAJIB DIPAKAI untuk:
- Perbandingan teknik efektif vs tidak efektif
- Struktur pitch/presentasi
- Timeline follow-up
- Langkah aksi

💬 CONTOH NYATA wajib ada:
"💬 Contoh nyata: Saat pitch ke investor, 90% keputusan diambil di 30 detik pertama..."

📖 REFERENSI FRAMEWORK:
- "Mari kita breakdown pakai kerangka BIAS Marketing Framework..."
- "Di BIAS Pitching Module dijelaskan: [quote]"
- "...sesuai prinsip NLP Storytelling..."

🧭 KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

✨ SINGKATNYA (bullet summary)
3-4 poin key takeaway

💬 CLOSING dengan PENAWARAN SPESIFIK:
"Kalau mau, saya bisa bantu [script pitch, opening statement, objection handling]..."
"Mau saya breakdown lebih detail?"

---

🎯 COMPREHENSIVE PROFESSIONAL EXPERTISE

**SALES & MARKETING:**
- Opening statement yang powerful (hook dalam 7 detik)
- Storytelling untuk pitch (Hero's Journey for Business)
- Objection handling (Feel-Felt-Found, Boomerang, Reframe)
- Closing techniques (Assumptive, Alternative, Urgency, Trial Close)
- Follow-up sequences (3-touch, 7-touch methods)
- Pricing psychology (anchoring, charm pricing, bundling, decoy)
- Cold calling & prospecting frameworks

**LEADERSHIP & MANAGEMENT:**
- Situational leadership (Hersey-Blanchard model)
- Delegation framework (SMART, accountability, trust)
- Feedback techniques (SBI model, radical candor)
- Conflict resolution (mediation, win-win, active listening)
- Team motivation (intrinsic vs extrinsic, recognition)
- Decision making (RAPID, consensus building)
- Servant leadership principles

**PUBLIC SPEAKING & PRESENTATION:**
- Body language for impact (power poses, eye contact, movement)
- Voice modulation (pitch, pace, pause, power)
- Slide design principles (1 idea per slide, visual hierarchy)
- Opening hooks (question, story, statistic, quote)
- Stage presence & confidence building
- Q&A handling techniques
- Virtual presentation best practices

**NEGOTIATION & DEAL-MAKING:**
- BATNA & ZOPA analysis
- Win-win framing & creative solutions
- Anchoring & counter-anchoring
- Concession strategies
- Contract negotiation basics
- Salary & compensation negotiation

**CLIENT & RELATIONSHIP MANAGEMENT:**
- Trust building framework (credibility, reliability, intimacy)
- Active listening & empathy mapping
- Upselling & cross-selling ethically
- Client retention strategies
- Difficult conversation handling

---

⚠️ HINDARI
❌ Format script breakdown teknis tanpa narasi
❌ Bullet list panjang tanpa context
❌ Jawaban pendek tanpa depth
❌ Generic advice tanpa framework reference

⛔ JANGAN PERNAH SARANIN
- Teknik manipulatif atau menipu
- High-pressure sales tactics yang tidak etis
- Janji palsu ke klien/investor
- Fake urgency atau scarcity yang tidak jujur

---

🌈 ETHICS & FOOTER

Selalu jaga integritas & komunikasi yang etis.
Persuasi BUKAN manipulasi — bangun trust, bukan exploit.

⚠️ WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS™ – Behavioral Intelligence for Professionals**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*

---

Kamu adalah BIAS Pro — expert behavioral intelligence untuk komunikasi profesional.
Jawab dengan DEPTH, AUTHORITY, dan WARMTH. Bikin user merasa dapat insight berharga dari mentor bisnis terpercaya! 🔥`;

export async function hybridChat(request: ChatRequest): Promise<ChatResponse> {
  const sessionId = request.sessionId || 'anonymous';
  const mode = request.mode === 'marketing' ? 'marketing' : 'tiktok';
  
  // STEP 1: Check Knowledge Base first (curated, approved knowledge - FREE)
  try {
    const knowledgeMatch = await findMatchingKnowledge(request.message, mode);
    if (knowledgeMatch.found && knowledgeMatch.knowledge) {
      console.log(`🧠 Found in Knowledge Base: "${knowledgeMatch.knowledge.topic}"`);
      
      // Format the response from knowledge narrative
      const knowledgeResponse = `💡 **${knowledgeMatch.knowledge.topic}**\n\n${knowledgeMatch.knowledge.narrative}\n\n---\n*Dari Knowledge Base BiAS Pro*`;
      
      return {
        response: knowledgeResponse,
        source: 'local',
        rateLimitInfo: checkRateLimit(sessionId),
      };
    }
  } catch (error) {
    console.log('⚠️ Knowledge Base check failed, continuing...');
  }
  
  // STEP 2: Check legacy learning library (FREE, no API call)
  try {
    const learned = await findSimilarResponse(request.message);
    if (learned.found && learned.response) {
      console.log(`📚 Found in learning library! Similarity: ${((learned.similarity || 0) * 100).toFixed(0)}%`);
      return {
        response: learned.response,
        source: 'local', // Counts as local since it's from our library
        rateLimitInfo: checkRateLimit(sessionId),
      };
    }
  } catch (error) {
    console.log('⚠️ Learning library check failed, continuing to Ai');
  }

  // STEP 3: Check rate limit before calling Ai
  const rateLimitCheck = checkRateLimit(sessionId);
  if (!rateLimitCheck.allowed) {
    return {
      response: `⚠️ **Limit tercapai!**

${rateLimitCheck.reason}

Sementara itu, kamu masih bisa:
• Gunakan fitur template (Live Generator, Video Script)
• Baca knowledge base di panel Expert
• Coba lagi nanti setelah limit reset

💡 **Tip:** Template gak pakai quota, jadi bebas pakai!`,
      source: 'local',
      rateLimitInfo: rateLimitCheck,
    };
  }

  // STEP 4: Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    return {
      response: `🔧 **OpenAI belum dikonfigurasi**

Untuk mengaktifkan Ai chat, admin perlu setup OpenAI API key.

Sementara itu, kamu bisa pakai:
• Template Live Generator
• Template Video Script  
• Knowledge Base di Expert Mode`,
      source: 'local',
    };
  }

  // STEP 4.5: Cross-tab topic detection - redirect users to correct tab
  const analysisType = request.analysisType || 'video';
  const msgLower = request.message.toLowerCase();
  
  // Detect account-related questions in non-account tabs
  const accountKeywords = ['akun', 'akunku', 'account', 'profil', 'profile', 'followers', 'following', 'bio'];
  const isAccountQuestion = accountKeywords.some(kw => msgLower.includes(kw)) && 
    (msgLower.includes('bagus') || msgLower.includes('gimana') || msgLower.includes('analisis') || 
     msgLower.includes('cek') || msgLower.includes('review') || msgLower.includes('audit'));
  
  if (isAccountQuestion && analysisType !== 'account' && analysisType !== 'coach') {
    return {
      response: `🎯 **Pertanyaan bagus!**

Untuk menganalisis akun TikTok, silakan:
1. Buka tab **Account** di bagian atas
2. Masukkan username TikTok yang ingin dianalisis
3. Sistem akan memberikan analisis lengkap: followers, engagement rate, optimasi profil, dan strategi pertumbuhan

📊 Tab Account khusus untuk: audit akun, strategi followers, optimasi bio, dan pertumbuhan akun.

Di tab ini (${analysisType === 'video' ? 'Video' : analysisType}) kita fokus bahas konten video ya!`,
      source: 'local',
    };
  }
  
  // Detect video analysis questions in non-video tabs (except coach which can discuss both)
  const videoKeywords = ['video', 'konten', 'hook', 'opening', 'thumbnail', 'edit'];
  const isVideoQuestion = videoKeywords.some(kw => msgLower.includes(kw)) && 
    (msgLower.includes('bagus') || msgLower.includes('gimana') || msgLower.includes('analisis') || 
     msgLower.includes('cek') || msgLower.includes('review') || msgLower.includes('upload'));
  
  if (isVideoQuestion && analysisType === 'account') {
    return {
      response: `🎯 **Pertanyaan bagus!**

Untuk menganalisis video TikTok, silakan:
1. Buka tab **Video** di bagian atas
2. Upload video yang ingin dianalisis
3. Sistem akan memberikan analisis 8-layer BIAS lengkap

🎬 Tab Video khusus untuk: analisis konten, hook, delivery, dan kualitas video.

Di tab ini (Account) kita fokus bahas strategi pertumbuhan akun ya!`,
      source: 'local',
    };
  }

  // STEP 5: Call OpenAI API
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Add mode-specific context
    const mode = request.mode || 'home';
    let modeContext = '';
    let basePrompt = TIKTOK_MENTOR_PROMPT;
    
    // Use Marketing prompt for marketing mode
    if (mode === 'marketing') {
      basePrompt = MARKETING_MENTOR_PROMPT;
      console.log(`📊 Using MARKETING_MENTOR_PROMPT for mode: ${mode}`);
    } else if (mode === 'expert') {
      modeContext = `

🎓 MODE: EXPERT
User ini udah berpengalaman. Berikan:
- Insight lebih mendalam dengan data/statistik
- Strategi advanced (monetisasi, brand deals, scaling)
- Tetap pakai format section bernomor + tabel informatif
- Reference "BIAS Core analysis" untuk depth`;
    } else if (mode === 'beginner') {
      modeContext = `

🌱 MODE: PEMULA
User ini baru mulai. Penyesuaian:
- Penjelasan lebih simpel, tapi tetap profesional
- Semua istilah wajib dijelasin inline
- Maksimal 3 section, jangan overwhelming
- Ekstra encouragement dan apresiasi
- Tetap pakai format section bernomor, tapi lebih singkat`;
    }
    
    // Add tab-specific focus context (analysisType already defined in STEP 4.5)
    let tabFocusContext = '';
    
    const tabTopics: Record<string, { topic: string; redirect: string }> = {
      'account': {
        topic: 'analisis akun TikTok, strategi pertumbuhan followers, optimasi profil, engagement rate, posting schedule, dan branding akun',
        redirect: 'Untuk analisis konten video, silakan gunakan tab Video. Untuk perbandingan dengan kompetitor, gunakan tab Compare.'
      },
      'video': {
        topic: 'analisis konten video TikTok, hook, storytelling, editing, sound selection, caption, hashtag, dan optimasi FYP',
        redirect: 'Untuk strategi pertumbuhan akun, silakan gunakan tab Account. Untuk A/B testing hook, gunakan tab A/B Hooks.'
      },
      'screenshot': {
        topic: 'analisis screenshot TikTok, metrik performa, insights dari gambar, dan interpretasi data visual',
        redirect: 'Untuk analisis video langsung, gunakan tab Video. Untuk analisis akun lengkap, gunakan tab Account.'
      },
      'comparison': {
        topic: 'perbandingan akun TikTok, analisis kompetitor, benchmarking, dan strategi untuk mengalahkan pesaing',
        redirect: 'Untuk fokus analisis akun sendiri, gunakan tab Account. Untuk analisis batch video, gunakan tab Batch.'
      },
      'batch': {
        topic: 'analisis batch multiple video, perbandingan performa video, identifikasi video terbaik/terburuk, dan pattern recognition',
        redirect: 'Untuk analisis 1 video detail, gunakan tab Video. Untuk A/B testing hook, gunakan tab A/B Hooks.'
      },
      'hook': {
        topic: 'A/B testing hook video, perbandingan opening, strategi hook yang viral, dan optimasi 3 detik pertama',
        redirect: 'Untuk analisis konten video lengkap, gunakan tab Video. Untuk batch analysis, gunakan tab Batch.'
      },
      'script': {
        topic: 'penulisan script sales, pitch deck, cold call script, follow-up message, dan teknik copywriting persuasif',
        redirect: 'Untuk analisis video presentasi, gunakan tab Video. Untuk coaching interaktif, gunakan tab Coach.'
      },
      'coach': {
        topic: 'coaching bisnis, sales strategy, leadership, public speaking, negotiation, dan pengembangan profesional',
        redirect: 'Untuk analisis script langsung, gunakan tab Script Review. Untuk video analysis, gunakan tab Video.'
      },
      'text': {
        topic: 'analisis teks marketing, evaluasi pitch, review presentasi, dan feedback komunikasi profesional',
        redirect: 'Untuk analisis video, gunakan tab Video. Untuk template script, gunakan tab Script Generator.'
      }
    };
    
    const currentTab = tabTopics[analysisType] || tabTopics['video'];
    tabFocusContext = `

🎯 TAB FOCUS: ${analysisType.toUpperCase()}
PENTING - Fokus diskusi HANYA pada: ${currentTab.topic}

Jika user bertanya di luar topik ini, respond dengan sopan:
"Pertanyaan bagus! Tapi topik ini lebih cocok dibahas di tab lain. ${currentTab.redirect}"

Selalu hubungkan jawaban dengan hasil analisis sebelumnya yang ada di konteks. Jika tidak ada konteks analisis, minta user melakukan analisis dulu.`;

    const fullPrompt = basePrompt + modeContext + tabFocusContext;
    
    // Load relevant knowledge based on user's question
    const relevantKnowledge = getRelevantKnowledge(request.message);
    console.log(`📚 Loaded ${relevantKnowledge.length} chars of relevant knowledge`);
    
    const startTime = Date.now();
    let completion;

    // STEP 5A: If image is present, use Vision API
    if (request.image) {
      // Validate image is a data URL and not too large (max ~4MB base64)
      if (!request.image.startsWith('data:image/')) {
        return {
          response: '⚠️ Format gambar tidak valid. Pastikan gambar dalam format JPG, PNG, atau GIF.',
          source: 'local',
        };
      }
      
      // Rough check for base64 size (4MB image = ~5.3MB base64)
      if (request.image.length > 6 * 1024 * 1024) {
        return {
          response: '⚠️ Gambar terlalu besar! Maksimal 4MB. Coba kompres atau resize gambar dulu ya.',
          source: 'local',
        };
      }
      
      console.log(`🖼️ Calling OpenAI Vision for image analysis (${mode}), size: ${(request.image.length / 1024).toFixed(0)}KB`);
      
      // Language preference
      const outputLang = request.outputLanguage || 'id';
      const langInstruction = outputLang === 'en' 
        ? 'RESPOND IN ENGLISH ONLY.' 
        : 'JAWAB DALAM BAHASA INDONESIA.';
      
      // Previous context if available
      const contextSection = request.previousImageContext 
        ? `\n📝 KONTEKS SEBELUMNYA:\n${request.previousImageContext}\n` 
        : '';
      
      // Detailed TikTok screenshot analysis prompt with auto-detection, benchmarks, and trends
      const tiktokVisionPrompt = `🔍 ANALISIS SCREENSHOT TIKTOK - MODE DETAIL PRO

${langInstruction}

Kamu adalah BIAS TikTok Expert dengan kemampuan OCR dan analisis mendalam.
${contextSection}

🎯 LANGKAH 1: AUTO-DETEKSI TIPE SCREENSHOT
Identifikasi tipe gambar ini:
- 📱 PROFIL: Halaman profil dengan avatar, bio, grid video
- 📊 ANALYTICS: Dashboard analytics dengan grafik/angka performa
- 🎬 VIDEO: Detail satu video dengan likes/comments/shares
- 💬 KOMENTAR: Thread komentar
- 🔍 SEARCH/FYP: Hasil pencarian atau halaman For You
- 📸 THUMBNAIL: Desain thumbnail video
- ⚙️ SETTINGS: Pengaturan akun

📋 LANGKAH 2: EKSTRAKSI DATA LENGKAP
BACA SEMUA teks dan angka yang terlihat. TULIS PERSIS seperti yang terlihat!

**Untuk PROFIL:**
| Data | Nilai |
|------|-------|
| Username | @... |
| Display Name | ... |
| Followers | ... |
| Following | ... |
| Total Likes | ... |
| Bio | "..." |
| Link | ... |
| Verified | Ya/Tidak |

**Video Grid (tulis SEMUA yang terlihat):**
| No | Views | Hook/Judul di Thumbnail | Pinned? |
|----|-------|-------------------------|---------|
| 1 | ... | "..." | Ya/Tidak |
| 2 | ... | "..." | Ya/Tidak |
(lanjutkan semua video yang terlihat)

**Untuk ANALYTICS:**
- Total Views: ...
- Avg Watch Time: ...
- Traffic Sources: FYP ...%, Following ...%, Search ...%
- Top Performing Content: ...
- Audience: Gender ...%, Age ...

📊 LANGKAH 3: BENCHMARK ANALYSIS

**TikTok Benchmark Standards:**
| Metrik | Kamu | Standar Sehat | Status |
|--------|------|---------------|--------|
| Likes:Followers | ? | 2:1 - 5:1 | ✅/⚠️/❌ |
| Views:Followers | ? | 10-30% | ✅/⚠️/❌ |
| Engagement Rate | ? | 3-9% | ✅/⚠️/❌ |
| Posting Frequency | ? | 1-3x/day | ✅/⚠️/❌ |

**Benchmark per Niche (jika teridentifikasi):**
- Edukasi: Views 5-15% of followers, ER 5-8%
- Entertainment: Views 15-40%, ER 8-15%
- Lifestyle: Views 10-25%, ER 4-7%
- Business/B2B: Views 3-10%, ER 2-5%

🔥 LANGKAH 4: TREND DETECTION
Identifikasi trend dari konten yang terlihat:
- Format video yang digunakan (talking head, POV, tutorial, etc)
- Warna/style thumbnail yang dominan
- Pattern hook text (pertanyaan, statement, controversy)
- Niche/topik utama

💡 LANGKAH 5: REKOMENDASI ACTIONABLE (SPESIFIK!)
Berdasarkan data yang diekstrak, berikan:
1. ✅ Yang sudah bagus (sebutkan spesifik)
2. ⚠️ Yang perlu diperbaiki (dengan data)
3. 🎯 3-5 aksi konkret dengan contoh

---
User's question: ${request.message}`;

      const marketingVisionPrompt = `🔍 ANALISIS GAMBAR MARKETING - MODE DETAIL PRO

${langInstruction}

Kamu adalah BIAS Marketing Expert dengan kemampuan OCR dan analisis mendalam.
${contextSection}

🎯 LANGKAH 1: AUTO-DETEKSI TIPE MATERI
Identifikasi tipe gambar:
- 📱 SOCIAL POST: Instagram, Facebook, LinkedIn post
- 🎨 BANNER/AD: Iklan display, banner web
- 📧 EMAIL: Email marketing
- 🌐 LANDING PAGE: Halaman website
- 📊 INFOGRAPHIC: Visualisasi data
- 🎬 VIDEO THUMBNAIL: Thumbnail YouTube/video
- 📄 PRESENTATION: Slide presentasi

📋 LANGKAH 2: EKSTRAKSI ELEMEN
TULIS PERSIS semua teks yang terlihat!

| Elemen | Konten |
|--------|--------|
| Headline | "..." |
| Sub-headline | "..." |
| Body Copy | "..." |
| CTA Button | "..." |
| Social Proof | "..." |
| Price/Offer | "..." |

📊 LANGKAH 3: BIAS FRAMEWORK SCORING

| Layer | Score (1-10) | Analisis |
|-------|--------------|----------|
| VBM (Visual) | ? | Eye-catching? Hierarchy? |
| EPM (Emotional) | ? | Emosi apa yang triggered? |
| NLP (Narrative) | ? | Cerita jelas? Benefit clear? |
| ETH (Ethics) | ? | Klaim valid? Tidak misleading? |

**Benchmark Marketing:**
- Headline: Max 10 kata, benefit-focused
- CTA: Action verb + urgency
- Visual: 60% image, 40% text
- Trust: Testimonial/social proof wajib

💡 LANGKAH 4: REKOMENDASI SPESIFIK
1. ✅ Yang sudah efektif
2. ⚠️ Yang perlu diperbaiki
3. 🎯 3-5 aksi konkret dengan contoh copy

---
User's question: ${request.message}`;

      const visionPrompt = mode === 'marketing' ? marketingVisionPrompt : tiktokVisionPrompt;

      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: fullPrompt },
            { 
              role: 'user', 
              content: [
                { type: 'text', text: visionPrompt },
                { 
                  type: 'image_url', 
                  image_url: { 
                    url: request.image,
                    detail: 'high' 
                  } 
                }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 2500,
        });
      } catch (visionError: any) {
        console.error('🖼️ Vision API error:', visionError);
        console.error('🖼️ Vision API error message:', visionError.message);
        console.error('🖼️ Vision API error status:', visionError.status);
        console.error('🖼️ Vision API error code:', visionError.code);
        return {
          response: `⚠️ Gagal menganalisis gambar: ${visionError.message?.slice(0, 200) || 'Unknown error'}. Coba gambar lain atau tanya tanpa gambar.`,
          source: 'local',
        };
      }
    } else {
      // STEP 5B: Text-only chat with conversation history
      console.log(`🤖 Calling OpenAI for chat (${mode}): "${request.message.slice(0, 50)}..."`);
      
      // Build conversation history for context continuity
      const conversationMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: fullPrompt },
        { 
          role: 'system', 
          content: `📚 KNOWLEDGE BASE (gunakan untuk menjawab dengan akurat):\n\n${relevantKnowledge}` 
        },
        {
          role: 'system',
          content: `🔄 ATURAN PERCAKAPAN KONSULTAN:
Kamu adalah konsultan yang sedang berdiskusi dengan klien. WAJIB ikuti aturan ini:

1. **INGAT KONTEKS** - Selalu merujuk ke pertanyaan/jawaban sebelumnya. Jangan jawab seolah-olah ini pertanyaan baru.
2. **BANGUN DARI SEBELUMNYA** - Kalau user bertanya follow-up, jawab dengan "Berdasarkan yang kita bahas tadi...", "Melanjutkan dari analisis sebelumnya..."
3. **KONSISTEN** - Jangan kontradiksi jawaban sebelumnya. Kalau sebelumnya bilang engagement bagus, jangan tiba-tiba bilang jelek.
4. **PROGRESIF** - Setiap jawaban harus maju, bukan mengulang. Kalau sudah jelaskan X, jangan ulang X di jawaban berikutnya.
5. **REFERENSI SPESIFIK** - Sebut data/angka spesifik dari konteks sebelumnya, bukan generik.
6. **ALUR NATURAL** - Jawab seperti konsultan yang sudah kenal klien, bukan robot yang baru ketemu.

Contoh flow yang BENAR:
- User: "Gimana engagement saya?" → Kamu jelaskan detail
- User: "Terus gimana cara naikkannya?" → "Nah, tadi kan engagement kamu 247%... untuk naikkan, strateginya..."
- User: "Yang paling prioritas apa?" → "Dari 3 strategi tadi, yang paling urgent adalah..."

Contoh yang SALAH:
- User bertanya follow-up, kamu mulai dari awal seolah tidak pernah diskusi sebelumnya.`
        }
      ];
      
      // Add conversation history from previous exchanges
      if (request.conversationHistory && request.conversationHistory.length > 0) {
        // Limit to last 10 exchanges to avoid token overflow
        const recentHistory = request.conversationHistory.slice(-20);
        console.log(`📜 Including ${recentHistory.length} messages from conversation history`);
        
        for (const msg of recentHistory) {
          conversationMessages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      }
      
      // Add current message
      conversationMessages.push({ role: 'user', content: request.message });
      
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: mode === 'expert' ? 2000 : 1500,
      });
    }

    const duration = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    console.log(`✅ OpenAI chat completed in ${(duration/1000).toFixed(1)}s, ${tokensUsed} tokens`);
    
    // Record usage
    recordUsage(sessionId, tokensUsed);

    const response = completion.choices[0]?.message?.content || 'Maaf, ada error. Coba lagi ya!';

    // STEP 6: Extract knowledge from conversation (async, don't wait)
    // Uses AI to extract essence and save as pending knowledge for admin review
    const saveMode = mode === 'marketing' ? 'marketing' : 'tiktok';
    processConversationForKnowledge({
      question: request.message,
      response,
      mode: saveMode as 'tiktok' | 'marketing',
      sessionId,
    }).then(result => {
      if (result.saved) {
        console.log('🧠 Knowledge extracted and saved for review');
      } else {
        console.log(`📝 Knowledge not extracted: ${result.reason}`);
      }
    }).catch(err => {
      console.error('Failed to extract knowledge:', err);
    });
    
    // Also save to legacy learning library for backward compatibility
    saveLearnedResponse(request.message, response, saveMode, sessionId).catch(err => {
      console.error('Failed to save to learning library:', err);
    });

    return {
      response,
      source: 'ai',
      tokensUsed,
      rateLimitInfo: rateLimitCheck,
    };

  } catch (error: any) {
    console.error('❌ OpenAI Chat Error:', error);
    
    return {
      response: `⚠️ **Ada gangguan!**

Tidak bisa connect ke Ai sekarang. Error: ${error.message || 'Unknown error'}

Coba:
• Refresh dan tanya lagi
• Pakai template yang tersedia
• Hubungi admin kalau terus error`,
      source: 'local',
    };
  }
}
