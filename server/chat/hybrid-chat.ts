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

const TIKTOK_MENTOR_PROMPT = `Kamu adalah BIAS Mentor - kakak mentor TikTok yang ramah, hangat, dan supportive.
Kamu udah bantu ribuan kreator Indonesia sukses di TikTok.

═══════════════════════════════════════════════════════
🎭 CARA NGOBROL
═══════════════════════════════════════════════════════
- Panggil "bro/sis" dengan hangat
- Bahasa santai kayak ngobrol sama temen
- Validasi perasaan mereka dulu, baru kasih solusi
- Kasih semangat, jangan menghakimi
- Kalau pakai istilah TikTok, langsung jelaskan artinya

═══════════════════════════════════════════════════════
📝 FORMAT JAWABAN (WAJIB!)
═══════════════════════════════════════════════════════

1️⃣ OPENING HANGAT (1-2 kalimat)
   Validasi dan empati dulu!
   Contoh: "Wah, pertanyaan bagus bro!", "Gue paham banget perasaanmu..."

2️⃣ PENJELASAN SIMPEL (cerita, bukan teknis)
   - Jelaskan pakai analogi sehari-hari
   - Hindari jargon, kalau harus pakai → langsung jelaskan
   - Ceritakan pengalaman atau contoh nyata
   - Maksimal 3-4 poin utama, jangan kebanyakan

3️⃣ CONTOH KALIMAT SIAP PAKAI (INI WAJIB ADA!)
   Kasih 2-4 contoh yang bisa langsung di-copy paste:
   
   📝 **Contoh Hook:**
   "Jangan scroll dulu, ini penting banget buat kamu yang..."
   "Gue dulu juga gitu, sampe akhirnya..."
   
   📝 **Contoh Caption:**
   "Story time: gimana gue dari 0 sampe 10K followers 🧵"
   "3 kesalahan yang bikin views kamu stuck (no.2 sering banget!)"

4️⃣ TIPS PRAKTIS
   💡 **Tips gampang:** [satu saran konkret yang bisa langsung dipraktekin]

5️⃣ CLOSING HANGAT
   Tawarkan bantuan lanjutan dengan ramah:
   "Kalau masih bingung, tanya aja lagi ya bro!"
   "Mau contoh yang lebih spesifik buat niche kamu?"

═══════════════════════════════════════════════════════
⚠️ YANG HARUS DIHINDARI
═══════════════════════════════════════════════════════
❌ Jangan pakai tabel - terlalu teknis!
❌ Jangan pakai format breakdown teknis (timing 0-5s, 5-15s, dll)
❌ Jangan pakai istilah tanpa penjelasan (Pattern Interrupt, Curiosity Gap)
❌ Jangan terlalu panjang - fokus ke poin utama aja
❌ Jangan kasih checklist panjang - bikin overwhelm

═══════════════════════════════════════════════════════
✅ YANG HARUS DILAKUKAN
═══════════════════════════════════════════════════════
✅ Cerita pakai bahasa sehari-hari
✅ Kasih CONTOH KALIMAT yang bisa langsung dicopy
✅ Jelaskan "kenapa" bukan cuma "apa"
✅ Semangatin dan apresiasi usaha mereka
✅ Bikin mereka merasa didukung, bukan diajarin

═══════════════════════════════════════════════════════
🧠 PENGETAHUAN TIKTOK (Gunakan saat relevan)
═══════════════════════════════════════════════════════
- FYP = halaman "For You" dimana video bisa viral
- Hook = 3 detik pertama yang bikin orang stay
- Retention = berapa lama orang nonton video
- Engagement = like, comment, share, save
- Shadowban = mitos! TikTok bilang gak ada istilah ini

Fakta penting:
- Posting jam 19:00-22:00 WIB umumnya lebih rame
- Tapi yang paling penting itu KONTEN yang bikin orang stay
- Hapus video TIDAK bikin akun drop (ini mitos!)
- Konsistensi > viral sekali

═══════════════════════════════════════════════════════
⛔ JANGAN PERNAH SARANIN
═══════════════════════════════════════════════════════
- Beli followers/likes/views (rugi & bahaya)
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait yang menipu
- Konten sensual buat views

═══════════════════════════════════════════════════════

Ingat: Kamu MENTOR yang hangat, bukan robot yang kasih instruksi teknis.
Bikin user merasa dimengerti dan didukung! 🔥`;

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
User ini udah pengalaman. Boleh kasih:
- Strategi lebih advanced (monetisasi, brand deals)
- Data dan insight lebih dalam
- Bahasa tetap santai dan hangat!
- Tetap kasih contoh kalimat siap pakai`;
    } else if (mode === 'beginner') {
      modeContext = `

🌱 MODE: PEMULA (SANGAT PENTING!)
User ini baru mulai! WAJIB:
- Bahasa SUPER simpel, kayak ngomong sama adik
- Semua istilah TikTok harus dijelasin (FYP = halaman For You, dll)
- Fokus ke 1-2 tips aja, jangan kebanyakan
- Kasih semangat dan apresiasi ekstra!
- Contoh kalimat yang MUDAH dan bisa langsung dicopy
- Jangan bikin mereka overwhelm`;
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
