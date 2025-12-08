// Hybrid Chat System - Local first, then Learning Library, then OpenAI API
import OpenAI from 'openai';
import { checkRateLimit, recordUsage } from '../utils/ai-rate-limiter';
import { findSimilarResponse, saveLearnedResponse } from '../utils/learning-system';
import { getRelevantKnowledge } from './knowledge-loader';

interface ChatRequest {
  message: string;
  sessionId?: string;
  mode?: 'beginner' | 'expert' | 'home';
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

Contoh opening:
"🔥 Wah bro… ini pertanyaan kelas 'inside creator' banget — dan lo benar-benar peka terhadap sistem real di balik TikTok."

Contoh mid-response:
"Bro, tone kamu udah mantap — tapi pacing agak cepat.
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
"Kalau lo mau, gue bisa bantu [action spesifik]..."
"Mau gue breakdown lebih detail, bro?"

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

export async function hybridChat(request: ChatRequest): Promise<ChatResponse> {
  const sessionId = request.sessionId || 'anonymous';
  
  // STEP 1: Check learning library first (FREE, no API call)
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
    console.log('⚠️ Learning library check failed, continuing to AI');
  }

  // STEP 2: Check rate limit before calling AI
  const rateLimitCheck = checkRateLimit(sessionId);
  if (!rateLimitCheck.allowed) {
    return {
      response: `⚠️ **Limit tercapai bro!**

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

  // STEP 3: Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    return {
      response: `🔧 **OpenAI belum dikonfigurasi**

Untuk mengaktifkan AI chat, admin perlu setup OpenAI API key.

Sementara itu, kamu bisa pakai:
• Template Live Generator
• Template Video Script  
• Knowledge Base di Expert Mode`,
      source: 'local',
    };
  }

  // STEP 4: Call OpenAI API
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Add mode-specific context
    const mode = request.mode || 'home';
    let modeContext = '';
    
    if (mode === 'expert') {
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
    
    const fullPrompt = TIKTOK_MENTOR_PROMPT + modeContext;
    
    // Load relevant knowledge based on user's question
    const relevantKnowledge = getRelevantKnowledge(request.message);
    console.log(`📚 Loaded ${relevantKnowledge.length} chars of relevant knowledge`);
    
    console.log(`🤖 Calling OpenAI for chat (${mode}): "${request.message.slice(0, 50)}..."`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullPrompt },
        { 
          role: 'system', 
          content: `📚 KNOWLEDGE BASE (gunakan untuk menjawab dengan akurat):\n\n${relevantKnowledge}` 
        },
        { role: 'user', content: request.message }
      ],
      temperature: 0.7,
      max_tokens: mode === 'expert' ? 2000 : 1500,
    });

    const duration = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    console.log(`✅ OpenAI chat completed in ${(duration/1000).toFixed(1)}s, ${tokensUsed} tokens`);
    
    // Record usage
    recordUsage(sessionId, tokensUsed);

    const response = completion.choices[0]?.message?.content || 'Maaf bro, ada error. Coba lagi ya!';

    // STEP 5: Save to learning library (async, don't wait)
    saveLearnedResponse(request.message, response).catch(err => {
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
      response: `⚠️ **Ada gangguan bro!**

Gue gak bisa connect ke AI sekarang. Error: ${error.message || 'Unknown error'}

Coba:
• Refresh dan tanya lagi
• Pakai template yang tersedia
• Hubungi admin kalau terus error`,
      source: 'local',
    };
  }
}
