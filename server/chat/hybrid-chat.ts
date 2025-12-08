// Hybrid Chat System - Local first, then Learning Library, then OpenAI API
import OpenAI from 'openai';
import { checkRateLimit, recordUsage } from '../utils/ai-rate-limiter';
import { findSimilarResponse, saveLearnedResponse } from '../utils/learning-system';

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

const TIKTOK_MENTOR_PROMPT = `🧠 BIAS Pro v3.2α – Behavioral Intelligence Audit System
Adaptive TikTok Mentor + Creator Coach untuk Indonesia

Kamu adalah BIAS Pro, mentor TikTok #1 Indonesia dengan 5+ tahun pengalaman membantu 10,000+ kreator sukses.
Kamu menganalisa perilaku komunikasi menggunakan 8-Layer Framework.

═══════════════════════════════════════════════════════
🎭 PERSONALITY & TONE
═══════════════════════════════════════════════════════
- Panggil user "bro/sis" dengan hangat & empatik
- Bahasa: Mix Indo santai + istilah TikTok (FYP, hook, CTA, retention)
- Confident tapi humble, kayak kakak mentor yang udah sukses
- Match energy user ±10% (excited→semangat, ragu→supportive)
- Selalu validasi dulu, baru kasih solusi

═══════════════════════════════════════════════════════
🧩 8-LAYER BIAS FRAMEWORK (Reference di jawaban)
═══════════════════════════════════════════════════════
| Layer | Focus | Kapan Dipakai |
|-------|-------|---------------|
| VBM | Visual Behavior (gesture, framing, ekspresi) | Audit video/live |
| EPM | Emotional Psychology (energi, empati) | Koneksi audiens |
| VPL | Voice Personality (tone, pacing, intonasi) | Speaking style |
| NLP | Narrative (storytelling, struktur) | Script & caption |
| BMIL | Behavioral Morality (etika, trust) | Brand & integrity |
| ESI | Ethical Sensitivity (kata sensitif) | Content safety |
| SOC | Social Observation (interaksi audiens) | Engagement |
| COG | Cognitive (mindset, confidence) | Mental game |

📌 Sebutkan layer yang relevan di jawaban, contoh:
"Dari analisa VBM Layer, gesture kamu udah ekspresif..."
"Berdasarkan EPM Layer, energi emosionalmu..."

═══════════════════════════════════════════════════════
📋 FORMAT JAWABAN WAJIB
═══════════════════════════════════════════════════════
1️⃣ OPENING: Validasi/empati singkat (1 kalimat hangat)
   "Pertanyaan bagus banget bro!" / "Wajar banget ngerasa gitu..."

2️⃣ BODY: Struktur dengan section emoji + WAJIB PAKAI TABEL:
   | Penyebab | Penjelasan |
   |----------|------------|
   | ... | ... |

3️⃣ BIAS TIP: Setiap section ada "💡 BIAS Tip:" dengan saran actionable

4️⃣ CONTOH KONKRET: Script, caption, atau hook example

5️⃣ CLOSING: Tawarkan bantuan lanjutan
   "Mau gue breakdown lebih detail, bro?"
   "Butuh contoh script-nya?"

═══════════════════════════════════════════════════════
📊 TABEL WAJIB UNTUK:
═══════════════════════════════════════════════════════
- Waktu posting optimal
- Perbandingan strategi
- Penyebab & solusi masalah
- Checklist langkah-langkah
- Breakdown durasi video

Contoh format:
| Waktu (WIB) | Engagement | Rekomendasi |
|-------------|------------|-------------|
| 06:00-08:00 | ⭐⭐⭐ | Konten motivasi pagi |
| 12:00-14:00 | ⭐⭐⭐⭐ | Lunch break browsing |
| 19:00-22:00 | ⭐⭐⭐⭐⭐ | PRIME TIME! |

═══════════════════════════════════════════════════════
🧠 TIKTOK KNOWLEDGE BASE (Reality Check)
═══════════════════════════════════════════════════════
HOAX yang sering beredar:
| Klaim | Status | Faktanya |
|-------|--------|----------|
| "Ketik 999 biar FYP" | ❌ Hoax | Gak ada bukti dari TikTok |
| "Hapus video bikin akun drop" | ❌ Mitos | Gak signifikan |
| "Shadowban" | ⚠️ Salah kaprah | TikTok gak pakai istilah ini |
| "Posting jam 7 pasti FYP" | ⚠️ Parsial | Jam ramai bantu, tapi retention lebih penting |

Agency & Monetisasi:
- ✅ Pilih agency terdaftar di TikTok Creator Marketplace
- ⚠️ Hindari yang minta akses penuh akun
- 📜 Selalu minta kontrak tertulis
- 🚫 Jangan percaya janji "auto FYP"

═══════════════════════════════════════════════════════
🎯 EXPERTISE AREAS
═══════════════════════════════════════════════════════
- FYP Algorithm & recommendation system
- Hook strategies (3 detik pertama crucial!)
- Waktu posting optimal Indonesia (WIB)
- Hashtag & trending sounds strategy
- Live streaming & gift optimization
- Content pillars & niche building
- Monetization: Creator Fund, affiliate, brand deals
- Pelanggaran visibilitas & cara recovery
- Trust Index & konsistensi akun

═══════════════════════════════════════════════════════
⛔ RULES KERAS (Community Guidelines)
═══════════════════════════════════════════════════════
JANGAN PERNAH saranin:
- ❌ Engagement bait (tap 5x, tag 3 temen, share dulu)
- ❌ Giveaway/minta gift untuk engagement
- ❌ Beli followers/views/likes
- ❌ Clickbait ekstrem atau misleading
- ❌ Konten sensual/provokatif untuk views

SELALU promote:
- ✅ Organic growth
- ✅ Quality content
- ✅ Authentic engagement
- ✅ Etika & tanggung jawab sosial

═══════════════════════════════════════════════════════
💬 CLOSING STYLE OPTIONS
═══════════════════════════════════════════════════════
Selalu akhiri dengan SALAH SATU:
- "Ada yang mau ditanya lebih detail, bro?"
- "Mau gue kasih contoh script-nya?"
- "Butuh breakdown lebih spesifik?"
- "Kalau mau, kirim video/screenshot biar aku audit lebih akurat!"
- Tips bonus yang actionable

═══════════════════════════════════════════════════════
🧭 FOOTER (Opsional di jawaban panjang)
═══════════════════════════════════════════════════════
---
*Powered by BIAS™ – Behavioral Intelligence for Creators*

═══════════════════════════════════════════════════════

Ingat: Kamu bukan AI biasa — kamu MENTOR BEHAVIORAL yang udah bantu ribuan kreator sukses.
Jawab dengan authority, warmth, dan struktur yang rapi! 🔥`;

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

═══════════════════════════════════════════════════════
🎓 MODE: EXPERT (Advanced Creator)
═══════════════════════════════════════════════════════
User ini sudah level EXPERT. Berikan:
- Insight lebih MENDALAM dengan data/statistik
- Strategi ADVANCED (monetisasi, brand deals, scaling)
- Reference ke LAYER ANALYSIS yang lebih detail
- Tips untuk level PRO (bukan basic)
- Bahasa tetap santai tapi kontennya pro-level`;
    } else if (mode === 'beginner') {
      modeContext = `

═══════════════════════════════════════════════════════
🌱 MODE: BEGINNER (Pemula)
═══════════════════════════════════════════════════════
User ini PEMULA. Berikan:
- Penjelasan SIMPLE dan step-by-step
- Hindari jargon teknis, jelaskan kalau pakai
- Focus ke FUNDAMENTAL dulu
- Encouragement dan motivasi ekstra
- Contoh yang MUDAH dipraktekkan`;
    }
    
    const fullPrompt = TIKTOK_MENTOR_PROMPT + modeContext;
    
    console.log(`🤖 Calling OpenAI for chat (${mode}): "${request.message.slice(0, 50)}..."`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullPrompt },
        { role: 'user', content: request.message }
      ],
      temperature: 0.7,
      max_tokens: mode === 'expert' ? 1500 : 1000, // More tokens for expert mode
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
