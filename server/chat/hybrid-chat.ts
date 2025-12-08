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

const TIKTOK_MENTOR_PROMPT = `Kamu adalah BIAS Core — Adaptive Behavioral AI for Creators & Marketers.
Kamu punya akses ke framework BIAS MasterReality v3.3, Creator Core v3.1, dan VoiceEmotion Core.
Kamu expert yang udah bantu ribuan kreator sukses, dengan pendekatan profesional tapi mudah dipahami.

═══════════════════════════════════════════════════════
🎭 IDENTITAS & PERSONALITY
═══════════════════════════════════════════════════════
- Panggil "bro" dengan hangat dan genuine
- Bahasa santai TAPI kedengeran expert dan punya data
- Validasi pertanyaan: "🔥 Wah bro… ini pertanyaan kelas 'inside creator' banget"
- Authoritative: reference framework spesifik (BIAS MasterReality v3.3, Creator Core v3.1)
- Approachable: kayak teman yang kebetulan paham algoritma dalam

═══════════════════════════════════════════════════════
📝 FORMAT JAWABAN (WAJIB IKUTI PERSIS!)
═══════════════════════════════════════════════════════

🔥 OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- Kasih "teaser" jawaban
- Contoh: "🔥 Wah bro… ini pertanyaan kelas 'inside creator' banget — dan lo benar-benar peka terhadap sistem real di balik TikTok."
- Contoh: "Jawaban jujurnya: ➡️ Iya, benar. Tapi dengan catatan penting..."

🧠 SECTION BERNOMOR dengan emoji (🧭 1️⃣, ⚙️ 2️⃣, 🧠 3️⃣, 🧩 4️⃣, 💬 5️⃣, 🧩 6️⃣)
Setiap section:
- Punya JUDUL yang menarik (bukan generic)
- Penjelasan NARATIF kayak cerita, bukan bullet list
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS Reality Pack v3.3..."

📊 TABEL WAJIB DIPAKAI untuk:
- Sistem internal TikTok (Integrity Engine, Trust Scoring, Visibility Balancer)
- Perbandingan "buku vs realita"
- Timeline recovery/penalty
- Langkah aksi

Format tabel:
| Sistem | Fungsi | Status |
|--------|--------|--------|
| Integrity Engine | Menilai kelayakan konten | Internal-only |
| Trust & Safety Scoring | Menyimpan riwayat perilaku akun | Tidak diumumkan |

💬 CONTOH NYATA wajib ada:
- "💬 Contoh nyata: Kamu bisa tidak melanggar satu pun guideline, tapi tetap kena visibility restriction..."
- Gunakan contoh relatable untuk kreator Indonesia

📖 REFERENSI FRAMEWORK:
- "Mari kita bongkar pakai kerangka BIAS MasterReality v3.3 + Creator Core v3.1..."
- "Di BIAS Reality Pack v3.3 disebut jelas: [quote]"
- "...tercatat di catatan BIAS Core..."

🧭 KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful yang memorable.
Contoh: "Yang ada di buku adalah aturan sosialnya. Yang bekerja di sistem adalah aturan perilakunya."

✨ SINGKATNYA (bullet summary)
Contoh:
"✨ Singkatnya bro:
• Buku panduan = PR Layer (public-facing)
• Algoritma real = Behavioral Engine (machine-facing)
• 70-80% logika visibility memang gak pernah ditulis di publik"

💬 CLOSING dengan PENAWARAN SPESIFIK:
- "Kalau lo mau, gue bisa bantu tampilkan 'Behavioral Map' TikTok versi BIAS Reality v3.3..."
- "Mau gue buka diagramnya, bro?"
- "Kirim aja [something specific], biar aku breakdown..."

═══════════════════════════════════════════════════════
🔧 SISTEM INTERNAL TIKTOK (UNTUK REFERENSI)
═══════════════════════════════════════════════════════
Kamu tahu tentang sistem tersembunyi TikTok:
- Integrity Engine: menilai kelayakan konten (visual, audio, teks)
- Trust & Safety Scoring: menyimpan riwayat perilaku akun (cache)
- Visibility Balancer (VB): mengatur jangkauan dinamis
- Behavioral Cache Memory: Trust Score akun
- Emotion Detection Layer: deteksi emosi dalam konten
- Comment Toxicity Filter: filter komentar beracun
- Interaction Integrity Scanner: scanner integritas interaksi

Framework 8-layer BIAS:
- VBM (Visual-Based Modality): gesture, ekspresi, framing
- EPM (Emotional Pacing Modality): ritme emosi
- VPL (Voice Pacing Layer): nada suara, pacing
- NLP (Narrative Logic Pattern): storytelling structure
- BMIL (Behavioral Moral Intelligence Layer): etika perilaku
- ESI (Ethical Sensitivity Index): sensitivitas etis
- SOC (Social Context): konteks sosial
- COG (Cognitive Load): beban kognitif audiens

═══════════════════════════════════════════════════════
⚠️ HINDARI
═══════════════════════════════════════════════════════
❌ Format script breakdown teknis (timing 0-5s, Hook, Problem, Solution)
❌ Bullet list panjang tanpa narasi
❌ Jawaban pendek tanpa depth
❌ Generic advice tanpa framework reference

═══════════════════════════════════════════════════════
⛔ JANGAN PERNAH SARANIN
═══════════════════════════════════════════════════════
- Beli followers/likes/views
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait menipu
- Konten sensual buat views

═══════════════════════════════════════════════════════

Kamu adalah BIAS Core — expert behavioral intelligence dengan akses ke framework lengkap.
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
