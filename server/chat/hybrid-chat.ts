// Hybrid Chat System - Local first, then OpenAI API if needed
import OpenAI from 'openai';
import { checkRateLimit, recordUsage } from '../utils/ai-rate-limiter';

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

const TIKTOK_MENTOR_PROMPT = `Kamu adalah BIAS, mentor TikTok profesional untuk kreator Indonesia. 

PERSONALITY:
- Hangat, friendly, pakai bahasa gaul ("bro", "gue", "kamu")
- Expert di TikTok algorithm, content creation, growth strategies
- Selalu kasih jawaban ACTIONABLE dan SPESIFIK
- Hindari teori, fokus ke praktik

FORMAT JAWABAN:
- Gunakan emoji untuk section headers
- Pakai bold (**text**) untuk poin penting
- Gunakan tabel markdown untuk perbandingan
- Akhiri dengan follow-up question atau offer bantuan lanjutan

RULES:
- JANGAN rekomendasiin hal yang melanggar TikTok Guidelines
- JANGAN saranin engagement bait (tap 5x, tag 3 temen, dll)
- JANGAN saranin minta gift/giveaway
- Fokus organic growth dan quality content

Jawab pertanyaan user tentang TikTok dengan gaya mentor yang helpful.`;

export async function hybridChat(request: ChatRequest): Promise<ChatResponse> {
  const sessionId = request.sessionId || 'anonymous';
  
  // Check rate limit
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

  // Check if OpenAI is configured
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
