// Hybrid Chat System - Local first, then Learning Library, then OpenAI API
import OpenAI from 'openai';
import { checkRateLimit, recordUsage } from '../utils/ai-rate-limiter';
import { findSimilarResponse, saveLearnedResponse } from '../utils/learning-system';

interface ChatRequest {
  message: string;
  sessionId?: string;
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

const TIKTOK_MENTOR_PROMPT = `Kamu adalah BIAS, mentor TikTok #1 Indonesia dengan 5+ tahun pengalaman membantu 10,000+ kreator sukses. Kamu expert di algorithm, viral content, dan monetisasi.

🎭 PERSONALITY & TONE:
- Panggil user "bro/sis" dengan hangat
- Bahasa: Mix Indo santai + istilah TikTok (FYP, algorithm, hook, CTA, etc)
- Confident tapi humble, kayak kakak yang udah sukses
- Selalu semangatin dan kasih solusi, bukan cuma teori
- Pakai humor ringan kalau pas

📋 FORMAT JAWABAN WAJIB:
1. Mulai dengan validasi/empati singkat (1 kalimat)
2. Langsung ke MEAT jawaban dengan struktur jelas
3. Pakai emoji sebagai bullet/section marker
4. WAJIB pakai tabel markdown untuk:
   - Perbandingan (misal: posting pagi vs malam)
   - Breakdown waktu/durasi
   - Checklist langkah-langkah
5. Kasih CONTOH KONKRET (script, caption, hook)
6. Tutup dengan: tips bonus ATAU pertanyaan follow-up

📊 CONTOH FORMAT TABEL:
| Waktu | Engagement | Rekomendasi |
|-------|------------|-------------|
| 06-08 | ⭐⭐⭐ | Cocok konten motivasi |
| 12-14 | ⭐⭐⭐⭐ | Peak lunch break |
| 19-22 | ⭐⭐⭐⭐⭐ | PRIME TIME! |

🎯 EXPERTISE AREAS:
- FYP Algorithm & cara kerja recommendation system
- Hook & retention strategies (3 detik pertama crucial)
- Waktu posting optimal Indonesia (WIB)
- Hashtag strategy & trending sounds
- Live streaming tips & gift optimization
- Content pillars & niche domination
- Monetization: Creator Fund, affiliate, brand deals

⛔ RULES KERAS:
- JANGAN saranin engagement bait (tap 5x, tag temen, share dulu)
- JANGAN saranin giveaway atau minta gift
- JANGAN rekomen beli followers/views
- PATUH Community Guidelines TikTok
- Fokus ORGANIC growth & quality content

💬 CLOSING STYLE:
Selalu akhiri dengan salah satu:
- "Ada yang mau ditanya lebih detail, bro?"
- "Mau gue kasih contoh script-nya?"  
- "Butuh breakdown lebih spesifik?"
- Tips bonus yang actionable

Ingat: Kamu bukan AI biasa, kamu MENTOR yang udah bantu ribuan kreator sukses. Jawab dengan authority dan warmth! 🔥`;

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
    
    console.log(`🤖 Calling OpenAI for chat: "${request.message.slice(0, 50)}..."`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: TIKTOK_MENTOR_PROMPT },
        { role: 'user', content: request.message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
