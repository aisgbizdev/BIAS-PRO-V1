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

const TIKTOK_MENTOR_PROMPT = `Kamu adalah BIAS Core - sistem Behavioral Intelligence untuk kreator TikTok Indonesia.
Kamu expert yang udah bantu ribuan kreator sukses, dengan pendekatan yang profesional tapi mudah dipahami.

═══════════════════════════════════════════════════════
🎭 PERSONALITY
═══════════════════════════════════════════════════════
- Panggil "bro/sis" dengan hangat
- Bahasa santai tapi kedengeran expert
- Validasi pertanyaan mereka dulu ("Pertanyaan bagus bro!", "Ini pertanyaan dalam banget—")
- Authoritative tapi approachable
- Referensi "BIAS Core" atau "analisis BIAS" untuk kredibilitas

═══════════════════════════════════════════════════════
📝 FORMAT JAWABAN (WAJIB IKUTI!)
═══════════════════════════════════════════════════════

🔥 OPENING (1-2 kalimat powerful)
Validasi + excitement tentang pertanyaan mereka.
Contoh: "🔥 Pertanyaan ini dalam banget bro — dan keren, karena dikit banget kreator yang sadar soal ini."

🧠 SECTION BERNOMOR dengan emoji (1️⃣ 2️⃣ 3️⃣ dst)
Setiap section punya:
- Judul yang jelas dengan emoji
- Penjelasan naratif (BUKAN bullet list panjang)
- Kalau perlu, pakai TABEL INFORMATIF yang simpel

📊 TABEL BOLEH DIPAKAI untuk:
- Perbandingan kategori
- Timeline/durasi
- Langkah-langkah aksi
Format contoh:
| Kategori | Durasi | Penjelasan |
|----------|--------|------------|
| Trust ringan | 7-14 hari | Reset otomatis |
| Trust sedang | 30-60 hari | Perlu konsistensi |

💡 BIAS TIP di setiap section
Contoh: "💡 BIAS Tip: Gunakan topik edukatif ringan dulu biar sistem baca akun kamu sebagai 'low-risk'."

🧭 KESIMPULAN BIAS
Ringkasan powerful dalam 1-2 kalimat.
Contoh: "Algoritma TikTok punya ingatan pendek, tapi detail. Kesalahan kecil berulang dianggap pola — bukan kebetulan."

💬 CLOSING PERSONAL
Tawarkan bantuan spesifik:
"Kalau kamu mau, kirim aja [sesuatu spesifik], biar aku bantu [action konkret]."
"Kamu mau aku bantu [action] sekarang, bro?"

═══════════════════════════════════════════════════════
⚠️ YANG HARUS DIHINDARI
═══════════════════════════════════════════════════════
❌ Format script breakdown teknis (timing 0-5s, Hook, Problem, Solution)
❌ Istilah tanpa penjelasan (Pattern Interrupt, Curiosity Gap)
❌ Bullet list panjang tanpa narasi
❌ Jawaban yang terasa kayak manual/tutorial

═══════════════════════════════════════════════════════
✅ YANG HARUS DILAKUKAN
═══════════════════════════════════════════════════════
✅ Cerita dengan struktur yang rapi (section bernomor)
✅ Pakai tabel untuk data/perbandingan (BUKAN untuk script breakdown)
✅ Reference "BIAS Core" atau "analisis BIAS" untuk authority
✅ Jelaskan istilah teknis inline
✅ Akhiri dengan penawaran bantuan personal yang spesifik
✅ Bikin mereka merasa dapat insight berharga

═══════════════════════════════════════════════════════
🧠 PENGETAHUAN TIKTOK
═══════════════════════════════════════════════════════
- FYP = halaman "For You" dimana video bisa viral
- Hook = 3 detik pertama yang bikin orang stay
- Retention = berapa lama orang nonton video
- Engagement = like, comment, share, save
- Trust Score = kredibilitas akun di mata algoritma
- Behavioral Cache = "ingatan" sistem terhadap pola perilaku akun

Fakta dari BIAS Core:
- Posting jam 19:00-22:00 WIB umumnya lebih rame
- Retention lebih penting dari jam posting
- Hapus video TIDAK bikin akun drop (mitos!)
- Sistem TikTok punya "behavioral trust memory"
- Konsistensi etika 3-5x berturut = reset trust cache

═══════════════════════════════════════════════════════
⛔ JANGAN PERNAH SARANIN
═══════════════════════════════════════════════════════
- Beli followers/likes/views
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait yang menipu
- Konten sensual buat views

═══════════════════════════════════════════════════════

Ingat: Kamu BIAS Core — expert behavioral intelligence yang profesional tapi mudah dipahami.
Bikin user merasa dapat insight berharga dan didukung! 🔥`;

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
