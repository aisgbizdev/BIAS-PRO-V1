import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Send, Sparkles, Bot, User, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationContext {
  lastTopic?: string;
  lastIntent?: 'live' | 'video' | 'question' | 'general';
  mentionedNiche?: string;
  mentionedDuration?: number;
}

interface GenerateResult {
  response: string;
  newContext: ConversationContext;
  isGeneric: boolean;
}

export function InteractiveCreatorHub() {
  const { language } = useLanguage();
  const t = (en: string, id: string) => language === 'en' ? en : id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    setContext({});
    setIsMinimized(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const quickSuggestions = [
    { text: t('Create 60s video script', 'Bikin script VT 60 detik'), icon: '🎬' },
    { text: t('Live 90 min education guide', 'Panduan live 90 menit edukasi'), icon: '📺' },
    { text: t('How does FYP algorithm work?', 'Gimana cara kerja algoritma FYP?'), icon: '📈' },
    { text: t('Is tap-tap screen allowed?', 'Emang tap tap layar boleh gak?'), icon: '❓' },
  ];

  const generateResponse = (userInput: string, ctx: ConversationContext): GenerateResult => {
    const input = userInput.toLowerCase();
    let newContext = { ...ctx };
    
    // Only match specific template requests (Live/Video scripts with duration)
    const isLiveRequest = /live|siaran|streaming|siaran langsung/i.test(input);
    const isVideoRequest = /video|vt|script|konten|reels|shorts/i.test(input) && !isLiveRequest;
    
    // Duration detection
    const durationMatch = input.match(/(\d+)\s*(menit|detik|min|sec|s|m|jam|hour|mnt)/i);
    let duration = 0;
    let durationType = 'minutes';
    if (durationMatch) {
      duration = parseInt(durationMatch[1]);
      if (/detik|sec|s(?!i)/i.test(durationMatch[2])) {
        durationType = 'seconds';
      } else if (/jam|hour/i.test(durationMatch[2])) {
        duration = duration * 60;
      }
      newContext.mentionedDuration = duration;
    }

    // Topic extraction
    let topic = '';
    const topicPatterns = [
      /tentang\s+(.+?)(?:\s+bisa|\s+dong|\s+ya|\s+nih|\s+gak|\?|,|$)/i,
      /topik\s+(.+?)(?:\s+bisa|\s+dong|\s+ya|\?|$)/i,
      /niche\s+(.+?)(?:\s+bisa|\s+dong|\?|$)/i,
    ];
    for (const pattern of topicPatterns) {
      const match = input.match(pattern);
      if (match) {
        topic = match[1].trim();
        newContext.lastTopic = topic;
        break;
      }
    }
    if (!topic && ctx.lastTopic) {
      topic = ctx.lastTopic;
    }

    // ONLY TEMPLATES: Live Streaming Generator (with duration)
    if (isLiveRequest && duration > 0) {
      newContext.lastIntent = 'live';
      return { response: generateLiveBreakdown(duration, topic), newContext, isGeneric: false };
    }

    // ONLY TEMPLATES: Video Script Generator (with duration)
    if (isVideoRequest && duration > 0) {
      newContext.lastIntent = 'video';
      return { response: generateVideoScript(duration, topic, durationType), newContext, isGeneric: false };
    }

    // EVERYTHING ELSE → Ai (no more hardcoded knowledge responses)
    // This includes: FYP questions, shadowban, hashtags, posting time, hooks, etc.
    // Ai will answer with proper 8-layer framework, tables, and BIAS Tips
    newContext.lastIntent = 'general';
    return { response: '', newContext, isGeneric: true };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    // Short delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 300));

    // Try local response first
    const localResult = generateResponse(userInput, context);
    setContext(localResult.newContext);
    
    let finalResponse = localResult.response;

    // If local didn't match (isGeneric), call Ai API with expert mode
    if (localResult.isGeneric) {
      try {
        const sessionId = localStorage.getItem('biasSessionId') || 'anonymous';
        const res = await fetch('/api/chat/hybrid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userInput, sessionId, mode: 'expert' }),
        });
        
        const data = await res.json();
        finalResponse = data.response || 'Maaf bro, ada gangguan. Coba lagi ya!';
        
        // Add source indicator
        if (data.source === 'ai') {
          finalResponse = finalResponse + '\n\n---\n*✨ Fresh from BIAS Brain · Saved to Library*';
        } else if (data.source === 'local' && !finalResponse.includes('⚠️')) {
          // From learning library
          finalResponse = finalResponse + '\n\n---\n*📚 Dari Learning Library*';
        }
      } catch (err) {
        console.error('Hybrid chat error:', err);
        finalResponse = `⚠️ **Gak bisa connect ke Ai bro**

Sementara itu, coba:
• Pakai template: "Live 60 menit" atau "VT 30 detik"
• Tanya topik spesifik: "shadowban", "fyp", "hashtag"

Atau refresh dan coba lagi! 🔄`;
      }
    }
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: finalResponse,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px] max-h-[600px] bg-[#141414] rounded-lg border border-gray-800">
      {/* Header - Minimal */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white flex items-center gap-2">
              BIAS TikTok Mentor
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-gray-800 text-gray-400">
                Ai
              </span>
            </h2>
            <p className="text-[10px] text-gray-400">
              {t('Your TikTok assistant', 'Asisten TikTok pribadimu')}
            </p>
          </div>
        </div>
        
        {/* Chat Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            title={isMinimized ? t('Expand', 'Perbesar') : t('Minimize', 'Perkecil')}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            title={t('Clear chat', 'Hapus chat')}
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Messages Area (collapsible) */}
      {!isMinimized && (
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-3">
              <Bot className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">
              {t('What can I help with?', 'Mau dibantu apa?')}
            </h3>
            <p className="text-xs text-gray-400 mb-4 max-w-xs">
              {t(
                'Scripts, live guides, algorithm tips, growth strategies.',
                'Script, panduan live, tips algoritma, strategi growth.'
              )}
            </p>
            
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
              {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="text-xs whitespace-pre-wrap">
                      <FormattedMessage content={message.content} />
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-gray-400" />
                </div>
                <div className="bg-gray-800 rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      )}

      {/* Input Area - Minimal */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('Type message...', 'Ketik pesan...')}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-gray-600 text-white placeholder-gray-500 resize-none text-xs transition-colors"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-10 w-10 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-base font-semibold text-white mt-3 mb-1">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-sm font-medium text-pink-400 mt-2">{line.slice(4)}</h3>;
        }
        
        if (line.includes('|') && line.trim().startsWith('|')) {
          const cells = line.split('|').filter(cell => cell.trim());
          if (line.includes('---')) {
            return <div key={index} className="border-b border-white/10 my-1" />;
          }
          const colCount = cells.length;
          return (
            <div key={index} className="flex gap-2 text-xs py-1 bg-white/5 px-2 rounded overflow-x-auto">
              {cells.map((cell, i) => (
                <span 
                  key={i} 
                  className={`${i === 0 ? 'text-pink-400 font-medium min-w-[80px]' : 'text-gray-400 min-w-[60px]'} flex-shrink-0`}
                  style={{ flex: i === 0 ? '0 0 auto' : '1 1 0' }}
                >
                  {cell.trim()}
                </span>
              ))}
            </div>
          );
        }
        
        let formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span className="text-pink-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }} />
            </div>
          );
        }
        
        const numberedMatch = line.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span className="text-cyan-400 font-medium">{numberedMatch[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s*/, '') }} />
            </div>
          );
        }
        
        if (line.startsWith('>')) {
          return (
            <div key={index} className="border-l-2 border-pink-500 pl-3 py-1 bg-pink-500/5 rounded-r text-gray-300 italic">
              {line.slice(1).trim()}
            </div>
          );
        }
        
        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }
        
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      })}
    </div>
  );
}

// ============================================
// LIVE STREAMING GENERATOR
// ============================================
function generateLiveBreakdown(duration: number, topic: string): string {
  if (duration > 180) {
    return `⚠️ **Bro, 180 menit itu udah maksimal!**

Live lebih dari 3 jam bikin:
• Penonton capek & drop
• Engagement menurun drastis
• Suara & energi kamu juga habis

💡 **Rekomendasi:** Bagi jadi 2 sesi terpisah, kasih jeda 1-2 jam.

Mau aku buatin breakdown untuk 180 menit aja?`;
  }

  const topicDisplay = topic || 'content creation';
  const segments = generateLiveSegments(duration);
  
  return `🔥 **Mantap banget bro — ini breakdown Live ${duration} menit${topic ? ` tentang ${topic}` : ''}!**

Kamu bakal jadi "edukator yang engaging", bukan dosen yang ngebosenin 🎯

---

## 🎥 BIAS Live Framework v3.2α

🕒 **Durasi:** ${duration} menit
🎯 **Tujuan:** Penonton betah >50%, engagement stabil
🎤 **Gaya:** Santai, empatik, interaktif
💡 **Target:** Komen aktif, tap konsisten, follow naik

---

## 🧩 STRUKTUR BREAKDOWN

| Segment | Durasi | Tema | Tujuan |
|---------|--------|------|--------|
${segments.map((seg, i) => `| ${i + 1}. ${seg.name} | ${seg.start}-${seg.end}m | ${seg.theme} | ${seg.goal} |`).join('\n')}

---

${segments.map((seg, i) => `
### ${seg.emoji} ${i + 1}. ${seg.name} (${seg.start}-${seg.end} menit)

🎯 **Tujuan:** ${seg.goal}

💬 **Script Contoh:**
> "${seg.script}"

🎥 **Tips:**
${seg.tips.map(tip => `• ${tip}`).join('\n')}

📢 **CTA:** "${seg.cta}"
`).join('\n---\n')}

---

## 🧾 TIPS TEKNIS

| Komponen | Rekomendasi |
|----------|-------------|
| 🎵 Music | Lo-fi beat rendah, jangan overpower suara |
| 💡 Lighting | Medium warm, wajah ekspresif terlihat |
| 📱 Setup | Eye-level, stabil, portrait mode |
| 🔄 CTA | 1x per 15-20 menit, jangan spam |
| 🕐 Waiting Room | 3-5 menit sapa viewer baru |

---

## 🎯 CTA NATURAL (COPY-PASTE)

• "Kalau ada pertanyaan, langsung ketik di komen ya."
• "Mau lanjut ke topik berikutnya? Tulis di komen."
• "Save live ini buat reference nanti."
• "Makasih udah nonton, see you next live!"

---

💡 **Bro, mau aku buatin script kata-per-kata untuk segment tertentu?**
Atau mau breakdown lebih detail untuk bagian mana? 🎤`;
}

function generateLiveSegments(duration: number) {
  if (duration <= 30) {
    return [
      { emoji: '1️⃣', name: 'OPENING HOOK', start: 0, end: Math.round(duration * 0.2), theme: 'Bangun vibe', goal: 'Tarik audiens awal', script: 'Halo semuanya! Sebelum mulai, gue mau tanya — siapa di sini yang pernah ngerasa stuck di TikTok? Tulis pengalaman kalian di komen.', tips: ['Tatap kamera 60-70% waktu', 'Senyum natural', 'Sapa viewer by name'], cta: 'Tulis niche kalian di komen!' },
      { emoji: '2️⃣', name: 'MAIN CONTENT', start: Math.round(duration * 0.2), end: Math.round(duration * 0.8), theme: 'Deliver value', goal: 'Edukasi inti', script: 'Oke langsung ke intinya ya. Ada 3 hal penting yang harus kamu tau...', tips: ['Struktur 1-2-3', 'Contoh konkret', 'Pause baca komentar'], cta: 'Ada pertanyaan? Langsung tulis!' },
      { emoji: '3️⃣', name: 'CLOSING', start: Math.round(duration * 0.8), end: duration, theme: 'Wrap up', goal: 'CTA & memorable', script: 'Itu tadi 3 tips utama dari gue. Inget, konsistensi > viral. Semoga bermanfaat!', tips: ['Recap poin utama', 'Motivasi singkat', 'Ucapan terima kasih'], cta: 'Makasih udah nonton sampai akhir!' }
    ];
  } else if (duration <= 60) {
    return [
      { emoji: '1️⃣', name: 'WARM OPENING', start: 0, end: Math.round(duration * 0.15), theme: 'Build trust', goal: 'Bangun vibe & koneksi', script: 'Yo what\'s up semuanya! Gue excited banget malam ini karena kita bakal bahas sesuatu yang banyak orang salah paham...', tips: ['Energi tinggi tapi natural', 'Teaser menarik', 'Interaksi awal'], cta: 'Tulis niche kalian di komen!' },
      { emoji: '2️⃣', name: 'MYTH BUSTER', start: Math.round(duration * 0.15), end: Math.round(duration * 0.4), theme: 'Hancurkan hoax', goal: 'Bangun kredibilitas', script: 'Banyak yang bilang shadowban itu nyata. Tapi faktanya, TikTok sendiri bilang mereka gak punya fitur itu...', tips: ['Data & fakta', 'Personal story', 'Validasi viewer'], cta: 'Siapa yang pernah denger ini? Tulis di komen!' },
      { emoji: '3️⃣', name: 'DEEP DIVE', start: Math.round(duration * 0.4), end: Math.round(duration * 0.75), theme: 'Edukasi', goal: 'Value mendalam', script: 'Sekarang kita masuk ke cara kerja algoritma yang sebenarnya. Ada 4 faktor utama...', tips: ['Step by step', 'Visual aids', 'Check understanding'], cta: 'Ada yang mau ditanya? Tulis di komen!' },
      { emoji: '4️⃣', name: 'Q&A + CLOSING', start: Math.round(duration * 0.75), end: duration, theme: 'Interaksi', goal: 'Engagement & memorable', script: 'Oke sekarang gue buka Q&A. Tulis pertanyaan kalian!', tips: ['Jawab 3-5 pertanyaan', 'Sebut nama penanya', 'End with motivation'], cta: 'Makasih udah nonton! See you next time!' }
    ];
  } else {
    const segLen = Math.round(duration / 6);
    return [
      { emoji: '1️⃣', name: 'OPENING WARM HOOK', start: 0, end: segLen, theme: 'Build trust', goal: 'Tarik audiens awal', script: 'Bro, banyak yang mikir TikTok itu soal hoki — padahal ini soal behavior. Malam ini gue bakal bongkar kenapa konten kamu belum nempel di algoritma.', tips: ['Tatap kamera 60-70%', 'Tone hangat + senyum', 'Interaksi natural'], cta: 'Tulis niche konten kamu di komen!' },
      { emoji: '2️⃣', name: 'MYTH BUSTER SESSION', start: segLen, end: segLen * 2, theme: 'Hancurkan hoax', goal: 'Bangun kredibilitas', script: 'Sekarang kita masuk MYTH BUSTER. Ada 4 mitos yang harus kita hancurin...', tips: ['Shadowban = salah kaprah', 'Jam posting = parsial', 'Engagement bait = risky', 'Hashtag viral ≠ jaminan'], cta: 'Tulis mitos mana yang pernah kamu percaya!' },
      { emoji: '3️⃣', name: 'ALGORITHM UNLOCKED', start: segLen * 2, end: segLen * 3, theme: 'Cara kerja FYP', goal: 'Edukasi algoritma', script: 'FYP bukan soal nasib, tapi soal siapa yang nonton sampai habis. Ada 4 faktor: Watch Time, Replay, Comment Velocity, Consistency.', tips: ['Breakdown tiap faktor', 'Contoh real', 'Retention = Emosi + Durasi'], cta: 'Faktor mana yang paling susah buat kamu?' },
      { emoji: '4️⃣', name: 'EMOTIONAL BRANDING', start: segLen * 3, end: segLen * 4, theme: 'Storytelling', goal: 'Koneksi emosional', script: 'Gue mau cerita sesuatu personal. Dulu gue juga stuck di 200 views... dan ini yang gue lakuin.', tips: ['Cerita pribadi relatable', 'Emosi naik-turun', 'Empati: "Kamu gak salah"'], cta: 'Tulis pengalaman serupa di komen!' },
      { emoji: '5️⃣', name: 'Q&A SESSION', start: segLen * 4, end: segLen * 5, theme: 'Interaksi', goal: 'Engagement aktif', script: 'Sekarang giliran kalian! Tulis niche konten kamu, gue kasih insight cepat.', tips: ['Balas 5-10 komen', 'Sebut nama viewer', 'Feedback per niche'], cta: 'Save live ini buat reference!' },
      { emoji: '6️⃣', name: 'REFLECTIVE CLOSING', start: segLen * 5, end: duration, theme: 'Motivasi', goal: 'Memorable ending', script: 'Kalau dari ' + duration + ' menit ini kamu cuma inget satu hal: TikTok bukan tempat cari validasi, tapi tempat nunjukin value diri kamu.', tips: ['Tenang & reflektif', 'Jeda 2 detik antar kalimat', 'Senyum ringan'], cta: 'Makasih banget udah nonton sampai akhir!' }
    ];
  }
}

// ============================================
// VIDEO SCRIPT GENERATOR
// ============================================
function generateVideoScript(duration: number, topic: string, durationType: string): string {
  const isSeconds = durationType === 'seconds';
  const durationInSeconds = isSeconds ? duration : duration * 60;
  const topicDisplay = topic || 'tips TikTok';
  
  if (durationInSeconds > 180) {
    return `⚠️ **Bro, video lebih dari 3 menit kurang optimal untuk TikTok!**

• Watch time drop drastis setelah 60 detik
• Algoritma prefer video pendek + retention tinggi
• Penonton TikTok = attention span pendek

💡 **Rekomendasi:**
• Tips/tutorial: 30-60 detik
• Storytelling: 60-90 detik
• Edukasi mendalam: Max 90 detik atau bagi jadi series

Mau aku buatin script 60 atau 90 detik?`;
  }
  
  const segments = generateVideoSegments(durationInSeconds, topicDisplay);
  
  return `🎬 **Mantap bro! Ini script ${durationInSeconds} detik${topic ? ` tentang ${topic}` : ''}**

---

## 📋 BIAS Script Framework v2.1

⏱️ **Durasi:** ${durationInSeconds} detik
🎯 **Target Watch Time:** ${durationInSeconds <= 30 ? '90%+' : durationInSeconds <= 60 ? '70%+' : '50%+'}
📈 **Struktur:** Hook → Content → CTA

---

## ⏱️ TIMING BREAKDOWN

${segments.map(seg => `
### ${seg.emoji} ${seg.name} (${seg.start}-${seg.end}s)

🎯 **Tujuan:** ${seg.goal}

📝 **Script:**
> "${seg.script}"

🎥 **Visual:**
${seg.visual}

💡 **Tips Delivery:**
${seg.tips.map(tip => `• ${tip}`).join('\n')}
`).join('\n---\n')}

---

## 🎣 VARIASI HOOK (COPY-PASTE)

1. **Pattern Interrupt:** "STOP scroll! Ini yang bikin kamu stuck di TikTok..."
2. **Curiosity Gap:** "Ternyata 90% creator salah soal ini..."
3. **Direct Challenge:** "Kamu pasti pernah lakuin ini, dan itu SALAH."
4. **Relatable Pain:** "Capek views stuck di 200? Ini solusinya."
5. **Bold Claim:** "1 trik ini naikin engagement gue 300%."

---

## 📱 TIPS TEKNIS

| Aspek | Rekomendasi |
|-------|-------------|
| 📹 Framing | Close-up wajah, eye level |
| 💡 Lighting | Ring light / natural |
| 🎤 Audio | Jelas, tanpa noise |
| ✂️ Editing | Cut dead air, pacing cepat |
| 📝 Caption | Teks on-screen untuk hook |

---

🔥 **Mau versi script yang beda atau hook alternatif lainnya bro?**`;
}

function generateVideoSegments(durationInSeconds: number, topic: string) {
  if (durationInSeconds <= 15) {
    return [{ emoji: '🎯', name: 'ALL-IN-ONE', start: 0, end: durationInSeconds, goal: 'Instant value 15 detik', script: `STOP! Ini rahasia ${topic} yang jarang dibahas. [pause 1s] Faktanya... [value]. Coba sekarang!`, visual: '• Close-up wajah kaget\n• Text overlay hook\n• Gesture tangan', tips: ['Langsung hook, no intro', 'Satu poin aja', 'CTA singkat'] }];
  } else if (durationInSeconds <= 30) {
    return [
      { emoji: '🎣', name: 'HOOK', start: 0, end: 3, goal: 'Stop the scroll', script: `Kamu pasti salah soal ${topic}. Ini faktanya.`, visual: '• Close-up wajah\n• Text: "FAKTA"', tips: ['Ekspresi serius', 'Volume lebih keras', 'No senyum dulu'] },
      { emoji: '📚', name: 'CONTENT', start: 3, end: 25, goal: 'Deliver value', script: 'Jadi begini... [poin 1]. Dan lebih penting... [poin 2]. Ini yang bikin beda.', visual: '• Medium shot\n• Hand gestures\n• B-roll optional', tips: ['Pacing konsisten', 'Pause di poin penting', 'Eye contact'] },
      { emoji: '📢', name: 'CTA', start: 25, end: 30, goal: 'Drive action', script: 'Follow buat tips lainnya. Save video ini!', visual: '• Zoom in\n• Point ke follow', tips: ['Senyum', 'Energi naik', 'Clear instruction'] }
    ];
  } else if (durationInSeconds <= 60) {
    return [
      { emoji: '🎣', name: 'HOOK', start: 0, end: 5, goal: 'Grab attention', script: `Ini yang SALAH tentang ${topic}. Gue buktiin sekarang.`, visual: '• Super close-up\n• Dramatic light\n• Bold text', tips: ['Pattern interrupt', 'Curiosity gap', 'Promise value'] },
      { emoji: '🔥', name: 'PROBLEM', start: 5, end: 15, goal: 'Relate to pain', script: 'Banyak yang mikir... [mitos]. Padahal ini bikin stuck. Gue juga dulu sama.', visual: '• Show frustration\n• Before scenario', tips: ['Empati', 'Personal story singkat', 'Validate struggle'] },
      { emoji: '💡', name: 'SOLUTION', start: 15, end: 45, goal: 'Deliver transformation', script: 'Tapi pas gue coba cara ini... [solusi]. Hasilnya? [hasil konkret].', visual: '• Step by step\n• Screen recording\n• After scenario', tips: ['Actionable steps', 'Specific examples', 'Show proof'] },
      { emoji: '📢', name: 'CTA + LOOP', start: 45, end: 60, goal: 'Engagement + replay', script: 'Coba sekarang, komen hasilnya. Oh iya, balik ke detik 15 buat step-nya!', visual: '• Energetic close\n• Point gestures\n• Loop transition', tips: ['Encourage replay', 'Spark comments', 'Smooth loop'] }
    ];
  } else {
    return [
      { emoji: '🎣', name: 'HOOK', start: 0, end: 5, goal: 'Pattern interrupt', script: `WAIT. Sebelum scroll, ${topic} yang kamu tau itu SALAH.`, visual: '• Hand up gesture\n• Urgent expression', tips: ['Stop energy', 'Direct address', 'Create tension'] },
      { emoji: '🤔', name: 'SETUP', start: 5, end: 20, goal: 'Build context', script: 'Jadi 3 bulan lalu gue stuck banget. Views drop, engagement anjlok. Sampe gue research...', visual: '• Storytelling mode\n• Personal footage', tips: ['Vulnerability', 'Specific timeline', 'Relatable'] },
      { emoji: '💡', name: 'REVELATION', start: 20, end: 40, goal: 'Aha moment', script: `Ternyata rahasia ${topic} bukan soal [mitos], tapi [fakta]. Ini breakdown-nya...`, visual: '• Reveal moment\n• Before/after', tips: ['Surprising insight', 'Counter-intuitive', 'Evidence'] },
      { emoji: '📋', name: 'HOW-TO', start: 40, end: 70, goal: 'Actionable steps', script: 'Step 1: [action]. Step 2: [action]. Step 3: [action]. Ini yang bikin beda.', visual: '• Numbered steps\n• Demo each\n• Text per step', tips: ['Clear numbering', 'Pause between', 'Repeat key'] },
      { emoji: '📢', name: 'CTA + OUTRO', start: 70, end: durationInSeconds, goal: 'Drive action', script: 'Sekarang giliran kamu. Coba dan komen hasilnya. Save buat reminder. Part 2 coming!', visual: '• High energy\n• Series teaser', tips: ['Multiple CTAs', 'Create anticipation', 'Community'] }
    ];
  }
}

// ============================================
// KNOWLEDGE RESPONSES
// ============================================
function generateTapTapResponse(): string {
  return `❌ **MITOS: Tap-tap layar bikin video viral**

📌 **FAKTA:**
Tap layar dihitung sebagai engagement, TAPI bobotnya **paling kecil** di algoritma.

📊 **Ranking Bobot Algoritma:**

| Sinyal | Bobot | Penjelasan |
|--------|-------|------------|
| Watch Time | 🔥🔥🔥🔥🔥 | Paling penting! |
| Replay | 🔥🔥🔥🔥 | Video diulang = menarik |
| Share | 🔥🔥🔥 | Value tinggi |
| Comment | 🔥🔥🔥 | Engagement aktif |
| Like/Tap | 🔥 | Engagement PASIF |

📖 **PENJELASAN:**
TikTok lebih peduli **seberapa lama** orang nonton, bukan seberapa banyak tap. Video 15 detik yang ditonton habis 3x lebih powerful dari 1000 like tapi cuma ditonton 3 detik.

✅ **TIPS:**
• Fokus hook kuat di 3 detik pertama
• Buat orang nonton sampai akhir
• Comment yang trigger diskusi > 1000 tap pasif

🎯 **KESIMPULAN:**
Jangan minta "tap tap ya guys". Mending minta "tonton sampai habis" atau "komen pendapat kamu".

💡 **Mau aku buatin script yang optimize watch time bro?**`;
}

function generateShadowbanResponse(): string {
  return `❌ **MITOS: Shadowban itu nyata di TikTok**

📌 **FAKTA:**
TikTok secara resmi bilang mereka **TIDAK** punya fitur shadowban.

📖 **PENJELASAN:**
"Shadowban" itu istilah creator, bukan fitur resmi. Yang sebenarnya:

| Yang Kamu Rasakan | Yang Sebenarnya |
|-------------------|-----------------|
| Views drop | Konten kurang resonate |
| Gak masuk FYP | Watch time rendah |
| Akun "dibatasi" | Algoritma adjust performa |

🔍 **Kenapa views drop:**
• Hook lemah → skip di 2 detik
• Posting gak konsisten
• Niche gak jelas
• Konten repetitif

✅ **TIPS:**
• Cek analytics: watch time turun = masalah konten
• Variasikan format
• Konsisten 1-3x sehari
• Engage komentar dalam 1 jam pertama

🎯 **KESIMPULAN:**
Gak ada shadowban. Yang ada: konten yang perlu improve.

💡 **Mau aku review niche kamu dan kasih saran?**`;
}

function generateFYPResponse(): string {
  return `📈 **Cara Kerja Algoritma FYP TikTok (2024)**

📌 **FAKTA:**
FYP bukan soal "luck" — tapi soal **behavioral signals** dari viewer.

📊 **4 Pilar Algoritma:**

| Faktor | Bobot | Cara Optimize |
|--------|-------|---------------|
| Watch Time | 40% | Hook kuat, no dead air |
| Completion | 25% | Video pendek, value padat |
| Engagement | 20% | Trigger komen cepat |
| Shares | 15% | Konten "harus dishare" |

📖 **BREAKDOWN:**

**1. Watch Time (Retention)**
• >80% retention = push ke FYP luas
• <50% retention = "mati" di batch pertama

**2. Completion Rate**
• Video 15s: target 90%+
• Video 60s: target 50%+

**3. Engagement Velocity**
• 100 komen dalam 30 menit > 1000 komen dalam 24 jam
• Early engagement = sinyal kuat

**4. Shares**
• 1 share = 10 likes dalam bobot algoritma

✅ **ACTIONABLE TIPS:**
• Post saat audience online (cek analytics)
• Reply komen dalam 1 jam pertama
• Hook yang HARUS ditonton sampai akhir
• End screen trigger replay

💡 **Mau aku analisis niche kamu untuk strategi FYP?**`;
}

function generateFollowerResponse(): string {
  return `🚀 **Strategi Nambah Follower (Proven)**

📊 **Growth Framework:**

| Stage | Target | Fokus |
|-------|--------|-------|
| 0-1K | Foundation | Niche + konsistensi |
| 1K-10K | Momentum | Hook mastery + community |
| 10K-100K | Scaling | Series + kolaborasi |
| 100K+ | Authority | Diversifikasi |

📖 **STRATEGI PER STAGE:**

**0-1K (Fondasi)**
• Posting 2-3x sehari
• 1 niche SPESIFIK
• Pelajari 5 creator sukses
• Reply SEMUA komentar

**1K-10K (Momentum)**
• Content series (Part 1, 2, 3)
• Kumpulkan 20 hook yang work
• Kolaborasi creator setara
• Trending sounds + twist

**10K-100K (Scaling)**
• Signature content format
• Live rutin, build community
• Cross-promote platform lain

✅ **QUICK WINS:**
• Bio jelas + CTA
• Pin video terbaik
• Consistent schedule
• Engage akun se-niche

🎯 **Formula:**
Growth = Consistency × Value × Time

💡 **Kamu sekarang di stage mana? Aku kasih strategi spesifik!**`;
}

function generateMonetizationResponse(): string {
  return `💰 **4 Cara Monetisasi TikTok (HALAL & AMAN)**

📊 **Revenue Streams:**

| Stream | Min Requirement | Potensi |
|--------|-----------------|---------|
| Creator Fund | 10K followers | 50K-500K/bln |
| Brand Deals | 5K+ followers | 500K-50jt/post |
| Affiliate | 1K followers | 100K-5jt/bln |
| Own Product | No min | Unlimited |

📖 **BREAKDOWN:**

**1. Creator Fund**
• 10K followers + 100K views/30 hari
• ~Rp 20-50 per 1000 views
• Tambahan, bukan main income

**2. Brand Deals**
• Rate: Rp 100-500/follower
• Bangun media kit profesional
• Disclosure wajib (#ad atau "Paid partnership")

**3. Affiliate Marketing**
• TikTok Shop, Shopee Affiliate
• Review JUJUR > hard sell
• Disclose affiliate link (wajib)

**4. Own Product/Service**
• Course, merch, jasa konsultasi
• Potensi paling besar & sustainable
• Build expertise dulu

⚠️ **YANG GAK BOLEH:**
• Minta gift/donasi (melanggar guidelines)
• Giveaway engagement bait
• Fake urgency atau scarcity

✅ **REKOMENDASI:**
• <10K: Fokus growth & skill dulu
• 10K-50K: Affiliate + brand kecil
• 50K+: Diversifikasi semua

💡 **Mau aku kasih tips brand deal untuk niche kamu?**`;
}

function generateHashtagResponse(): string {
  return `🏷️ **MITOS vs FAKTA: Hashtag**

❌ **MITOS:** #fyp wajib pakai biar viral

📌 **FAKTA:**
Hashtag bantu kategorisasi, TAPI konten kuat menang tanpa hashtag viral.

| Mitos | Fakta |
|-------|-------|
| #fyp wajib | TikTok bilang gak pengaruh |
| Makin banyak bagus | 3-5 optimal |
| Copy hashtag viral | Niche hashtag lebih targeted |

📖 **STRATEGI BENAR:**

**Formula 3-5 Hashtag:**
• 1-2 niche spesifik
• 1 medium reach
• 1 trending (kalau relevan)

**Contoh creator edukasi:**
> #tiktokguru #edukasitiktok #creatortips

✅ **TIPS:**
• Hashtag = kategorisasi, bukan magic
• Konten bagus tanpa hashtag > konten jelek 30 hashtag
• Research kompetitor
• Buat branded hashtag

🎯 **KESIMPULAN:**
Hook & watch time = 95%. Hashtag = 5%.

💡 **Mau list hashtag untuk niche kamu?**`;
}

function generatePostingTimeResponse(): string {
  return `⏰ **MITOS vs FAKTA: Waktu Posting**

❌ **MITOS:** Jam 7 malam pasti FYP

📌 **FAKTA:**
Waktu posting bantu EXPOSURE, bukan jaminan FYP.

| Faktor | Pengaruh |
|--------|----------|
| Waktu posting | 10-15% |
| Hook strength | 35% |
| Watch time | 40% |
| Early engagement | 15% |

📖 **CARA CARI WAKTU OPTIMAL:**

**Step 1:** Cek Analytics → Follower Activity
**Step 2:** Test 3 waktu selama 2 minggu
**Step 3:** Double down yang perform

**General Guideline (Indonesia):**

| Slot | Waktu | Cocok Untuk |
|------|-------|-------------|
| Pagi | 06-08 | Motivasi, tips |
| Siang | 12-13 | Entertainment |
| Sore | 17-19 | Tutorial |
| Malam | 20-22 | Storytelling |

✅ **TIPS:**
• Konsistensi > waktu "perfect"
• Upload 10-15 menit sebelum peak
• Algoritma learn pola posting kamu

🎯 **KESIMPULAN:**
Waktu = optimization, bukan game changer.

💡 **Mau analisis slot waktu untuk niche kamu?**`;
}

function generateHookResponse(): string {
  return `🎣 **Panduan HOOK yang Bikin Stop Scroll**

📌 **FAKTA:**
3 detik pertama = hidup matinya video kamu.

📊 **5 Tipe Hook Powerful:**

| Tipe | Contoh | Kapan Pakai |
|------|--------|-------------|
| Pattern Interrupt | "STOP!" | Edukasi, tips |
| Curiosity Gap | "Ternyata 90% salah..." | Myth-busting |
| Direct Challenge | "Kamu pasti lakuin ini" | Relatable content |
| Pain Point | "Capek views stuck?" | Problem-solution |
| Bold Claim | "1 trik ini naikin 300%" | Tutorial |

📖 **HOOK TEMPLATES (COPY-PASTE):**

**Edukasi:**
> "STOP scroll! Ini yang bikin kamu stuck di TikTok..."

**Myth-busting:**
> "Ternyata yang kamu tau tentang FYP itu SALAH..."

**Tutorial:**
> "Dalam 30 detik, gue tunjukin cara naikin engagement 200%..."

**Storytelling:**
> "3 bulan lalu gue hampir nyerah di TikTok. Ini yang terjadi..."

**Challenge:**
> "Kamu pasti pernah lakuin ini. Dan itu SALAH."

✅ **TIPS:**
• Jangan intro panjang
• Langsung ke value/tension
• Volume sedikit lebih keras
• Ekspresi engaged

💡 **Mau aku buatin 10 variasi hook untuk niche kamu?**`;
}

function generateEngagementResponse(): string {
  return `💬 **Strategi Boost Engagement (AMAN & ORGANIC)**

📌 **FAKTA:**
Engagement rate yang sehat: 5-10%. Di bawah itu perlu improve.

📊 **Breakdown Engagement:**

| Metrik | Target | Cara Boost |
|--------|--------|------------|
| Like Rate | 4-8% | Hook kuat |
| Comment Rate | 0.5-2% | Trigger diskusi |
| Share Rate | 0.1-0.5% | Shareable value |
| Save Rate | 0.5-1% | Reference content |

📖 **TAKTIK BOOST (ORGANIC):**

**1. Trigger Komentar:**
• Tanya pendapat: "Menurut kamu gimana?"
• Open-ended question
• Ajak diskusi genuine

**2. Trigger Save:**
• Tips/tutorial yang worth revisit
• Checklist/resources
• Konten yang perlu diulang

**3. Trigger Share:**
• Konten relatable & valuable
• Informasi bermanfaat
• Content yang orang mau share sendiri

⚠️ **HINDARI (Engagement Bait):**
• "Tap 5x biar viral"
• "Tag 3 temen wajib"
• "Like kalo setuju"

✅ **CTA AMAN:**

• "Menurut kamu gimana? Komen!"
• "Mana yang cocok buat kamu?"
• "Pengalaman kamu gimana?"

🎯 **FORMULA:**
High Engagement = Value + Diskusi Natural + Timing

💡 **Mau aku review engagement rate akun kamu?**`;
}

function generateNicheResponse(): string {
  return `🎯 **Panduan Pilih Niche TikTok**

📌 **FAKTA:**
Niche yang jelas = algoritma mudah rekomendasikan = growth lebih cepat.

📊 **10 Niche Populer Indonesia:**

| Niche | Potensi | Kompetisi |
|-------|---------|-----------|
| Edukasi | 🔥🔥🔥🔥 | Medium |
| Comedy | 🔥🔥🔥🔥🔥 | Tinggi |
| Lifestyle | 🔥🔥🔥🔥 | Tinggi |
| Food | 🔥🔥🔥🔥 | Medium |
| Beauty | 🔥🔥🔥🔥 | Tinggi |
| Fitness | 🔥🔥🔥 | Medium |
| Gaming | 🔥🔥🔥🔥 | Medium |
| Parenting | 🔥🔥🔥 | Rendah |
| Finance | 🔥🔥🔥🔥 | Medium |
| Motivation | 🔥🔥🔥 | Tinggi |

📖 **CARA PILIH NICHE:**

**1. Passion + Knowledge**
• Apa yang kamu suka bahas berjam-jam?
• Apa skill yang kamu punya?

**2. Audience Demand**
• Search trending di TikTok
• Lihat kompetitor — ada audience gak?

**3. Sustainability**
• Bisa konsisten konten selama 1 tahun?
• Ada 100+ ide konten?

✅ **TIPS:**
• Mulai dengan sub-niche spesifik
• Contoh: Bukan "food" tapi "street food Jakarta"
• Lebih spesifik = lebih mudah dikenal

🎯 **FORMULA:**
Good Niche = Passion × Knowledge × Audience

💡 **Mau aku bantu analisis niche yang cocok buat kamu?**`;
}

function generateConsistencyResponse(): string {
  return `📅 **Panduan Konsistensi Posting**

📌 **FAKTA:**
Konsistensi > viral sesekali. Algoritma reward akun yang rutin.

📊 **Rekomendasi Frekuensi:**

| Stage | Frekuensi | Alasan |
|-------|-----------|--------|
| 0-1K | 2-3x/hari | Maximize testing |
| 1K-10K | 1-2x/hari | Quality + quantity |
| 10K+ | 1x/hari | Maintain momentum |

📖 **BREAKDOWN:**

**Kenapa Konsistensi Penting:**
• Algoritma "belajar" audience kamu
• Followers tau kapan expect konten
• Skill kamu improve cepat
• Data analytics lebih akurat

**Kalau Gak Bisa Tiap Hari:**
• Minimum 4x seminggu
• Batch recording di weekend
• Schedule posting

**Konten Batching Strategy:**
• 1 hari shoot = 5-7 video
• Edit dalam batch
• Schedule untuk 1 minggu

✅ **TIPS:**
• Lebih baik 1x/hari konsisten daripada 5x sehari terus burnout
• Buat content calendar
• Siapkan konten cadangan

🎯 **FORMULA:**
Growth = Consistency × Time × Quality

💡 **Mau aku buatin schedule posting untuk seminggu?**`;
}

function generateEditingResponse(): string {
  return `✂️ **Panduan Editing TikTok**

📌 **FAKTA:**
Editing yang bagus = watch time tinggi = FYP lebih gampang.

📊 **Rekomendasi Apps:**

| App | Level | Fitur Unggulan |
|-----|-------|----------------|
| CapCut | Beginner-Pro | Free, template banyak |
| VN | Intermediate | Smooth, ringan |
| InShot | Beginner | Simple, cepat |
| Adobe Rush | Pro | Professional tools |
| DaVinci | Expert | Color grading |

📖 **EDITING ESSENTIALS:**

**1. Cut Dead Air**
• Hapus jeda, "umm", "ehh"
• Pacing cepat = retention tinggi

**2. Text On-Screen**
• Hook di 3 detik pertama
• Highlight key points
• Subtitle (optional tapi bagus)

**3. Sound Design**
• Trending audio boost reach
• SFX untuk emphasis
• Volume balance

**4. Transitions**
• Simple lebih baik
• Jump cut paling efektif
• Jangan overuse effect

✅ **QUICK TIPS:**

• Export 1080p untuk quality
• Aspect ratio 9:16 always
• First frame harus eye-catching
• Loop ending ke hook

🎯 **FORMULA:**
Good Edit = Fast Pacing + Clear Audio + Visual Interest

💡 **Mau tips editing spesifik untuk niche kamu?**`;
}
