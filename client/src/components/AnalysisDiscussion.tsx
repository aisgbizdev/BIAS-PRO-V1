import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Send, Sparkles, Bot, User, Trash2, ChevronDown, ChevronUp, MessageCircle, Camera, Image, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormattedChatMessage } from '@/components/ui/FormattedChatMessage';
import type { BiasAnalysisResult } from '@shared/schema';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
}

interface AnalysisDiscussionProps {
  analysisResult?: BiasAnalysisResult | null;
  analysisContext?: string;
  mode?: 'tiktok' | 'marketing';
  analysisType?: 'video' | 'text' | 'account' | 'comparison' | 'batch' | 'hook' | 'screenshot';
}

export function AnalysisDiscussion({ analysisResult, analysisContext, mode = 'tiktok', analysisType = 'video' }: AnalysisDiscussionProps) {
  const { language } = useLanguage();
  const t = (en: string, id: string) => language === 'en' ? en : id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastImageContext, setLastImageContext] = useState<string>(''); // Store last image analysis for follow-up
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    setImagePreview(null);
    setIsMinimized(false);
  };

  // Handle image from file input or camera
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle Ctrl+V paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  // Build context from analysis result or custom context
  const getAnalysisContext = () => {
    // Use custom context if provided
    if (analysisContext) {
      return `
KONTEKS ANALISIS SEBELUMNYA:
- Mode: ${mode === 'tiktok' ? 'TikTok Pro' : 'Marketing Pro'}
- Tipe: ${analysisType}

${analysisContext}
`;
    }
    
    if (!analysisResult) return '';
    
    const layers = analysisResult.layers?.map(l => `${l.layer}: ${l.score}/10 - ${l.feedback}`).join('\n') || '';
    const analysisAny = analysisResult as any;
    return `
KONTEKS ANALISIS SEBELUMNYA:
- Overall Score: ${analysisResult.overallScore}/10
- Warmth Index: ${analysisAny.warmthIndex || 'N/A'}
- Mode: ${mode === 'tiktok' ? 'TikTok Pro' : 'Marketing Pro'}
- Tipe: ${analysisType}

Layer Scores:
${layers}

Narrative: ${analysisAny.narrativeDiagnosis || analysisAny.narrative || ''}
Recommendations: ${analysisResult.recommendations?.join(', ') || ''}
`;
  };

  // Quick suggestions based on mode and analysis type
  const getQuickSuggestions = () => {
    // Account-specific suggestions
    if (analysisType === 'account') {
      return [
        { text: t('How to grow my followers?', 'Gimana cara naikin followers?'), icon: '📈' },
        { text: t('Why is my engagement low?', 'Kenapa engagement rendah?'), icon: '🎯' },
        { text: t('Tips to improve my profile?', 'Tips improve profil?'), icon: '✨' },
        { text: t('Best posting strategy?', 'Strategi posting terbaik?'), icon: '📅' },
      ];
    }
    
    // Comparison-specific suggestions (mutual learning focus)
    if (analysisType === 'comparison') {
      return [
        { text: t('What can I learn from each account?', 'Apa yang bisa dipelajari dari setiap akun?'), icon: '📚' },
        { text: t('What makes their engagement high?', 'Apa yang bikin engagement mereka tinggi?'), icon: '📈' },
        { text: t('How to combine their strengths?', 'Gimana gabungin kelebihan mereka?'), icon: '✨' },
        { text: t('Unique opportunity for me?', 'Peluang unik buat saya?'), icon: '🎯' },
      ];
    }
    
    // Hook test specific suggestions (learning focus)
    if (analysisType === 'hook') {
      return [
        { text: t('What makes this hook effective?', 'Apa yang bikin hook ini efektif?'), icon: '✨' },
        { text: t('How to make my hook more viral?', 'Gimana buat hook lebih viral?'), icon: '🔥' },
        { text: t('What makes a great opening?', 'Apa yang bikin opening bagus?'), icon: '🎣' },
        { text: t('Combine strengths of all hooks?', 'Gabungin kekuatan semua hook?'), icon: '💡' },
      ];
    }
    
    // Batch video analysis suggestions (learning focus)
    if (analysisType === 'batch') {
      return [
        { text: t('What can I learn from this video?', 'Apa yang bisa dipelajari dari video ini?'), icon: '📚' },
        { text: t('Common pattern in my best videos?', 'Pola umum di video terbaik?'), icon: '📊' },
        { text: t('How to improve consistency?', 'Gimana improve konsistensi?'), icon: '🎯' },
        { text: t('What to avoid in future?', 'Apa yang harus dihindari?'), icon: '⚠️' },
      ];
    }
    
    // Screenshot analysis suggestions
    if (analysisType === 'screenshot') {
      return [
        { text: t('How to improve these metrics?', 'Gimana improve metrik ini?'), icon: '📈' },
        { text: t('What does this data mean?', 'Apa artinya data ini?'), icon: '🤔' },
        { text: t('Best time to post?', 'Waktu terbaik posting?'), icon: '⏰' },
        { text: t('How to get more views?', 'Gimana dapet lebih banyak views?'), icon: '👁️' },
      ];
    }
    
    if (mode === 'tiktok') {
      return [
        { text: t('How to improve my score?', 'Gimana cara improve skor ini?'), icon: '📈' },
        { text: t('What is my weakest layer?', 'Layer mana yang paling lemah?'), icon: '🎯' },
        { text: t('Tips for better hooks?', 'Tips buat hook lebih baik?'), icon: '🎣' },
        { text: t('How to go viral?', 'Gimana caranya viral?'), icon: '🔥' },
      ];
    } else {
      return [
        { text: t('How to improve this pitch?', 'Gimana cara improve pitch ini?'), icon: '📊' },
        { text: t('What is my biggest weakness?', 'Apa kelemahan terbesar saya?'), icon: '🎯' },
        { text: t('Tips for better closing?', 'Tips untuk closing lebih baik?'), icon: '💼' },
        { text: t('How to handle objections?', 'Cara handle keberatan klien?'), icon: '🛡️' },
      ];
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim() || (imagePreview ? t('(Sent an image)', '(Mengirim gambar)') : ''),
      timestamp: new Date(),
      image: imagePreview || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    const currentImage = imagePreview;
    setInput('');
    setImagePreview(null);
    setIsTyping(true);

    try {
      const sessionId = localStorage.getItem('biasSessionId') || 'anonymous';
      const analysisContextStr = getAnalysisContext();
      
      // Include analysis context in the first message only, or when messages are empty
      const isFirstMessage = messages.length === 0;
      const messageWithContext = isFirstMessage && analysisContextStr 
        ? `${userInput}\n\n[CONTEXT: User is asking about their analysis result]\n${analysisContextStr}`
        : userInput || t('Please analyze this image', 'Tolong analisis gambar ini');

      // Build conversation history from existing messages (for context continuity)
      const conversationHistory = messages.map(msg => ({
        role: msg.type as 'user' | 'assistant',
        content: msg.content
      }));

      const res = await fetch('/api/chat/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageWithContext, 
          sessionId, 
          mode: mode === 'marketing' ? 'marketing' : 'expert',
          image: currentImage || undefined,
          outputLanguage: language === 'en' ? 'en' : 'id', // Bilingual toggle based on current language
          previousImageContext: lastImageContext || undefined, // Pass previous image context for follow-up
          conversationHistory, // Send full conversation history for context
          analysisType: analysisType, // Pass tab type for focused discussion
        }),
      });
      
      const data = await res.json();
      let finalResponse = data.response || 'Maaf, ada gangguan. Coba lagi ya!';
      
      // Store image analysis context for follow-up questions
      if (currentImage && finalResponse && !finalResponse.includes('⚠️')) {
        // Extract key insights from response for follow-up context (first 500 chars)
        setLastImageContext(finalResponse.slice(0, 500));
      }
      
      // Add source indicator
      if (data.source === 'ai') {
        finalResponse += '\n\n---\n*✨ Fresh from BIAS Brain*';
      } else if (data.source === 'local' && !finalResponse.includes('⚠️')) {
        finalResponse += '\n\n---\n*📚 Dari Learning Library*';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: finalResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '⚠️ Gagal connect ke Ai. Coba refresh dan tanya lagi ya!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = getQuickSuggestions();
  const themeColor = mode === 'tiktok' ? 'pink' : 'purple';

  // Export chat to PDF (simple text export)
  const handleExportPDF = async () => {
    if (messages.length === 0) return;
    
    try {
      // Create simple text content for export
      const exportContent = messages.map(m => {
        const role = m.type === 'user' ? 'USER' : 'BIAS AI';
        const time = m.timestamp.toLocaleString('id-ID');
        return `[${time}] ${role}:\n${m.content}\n`;
      }).join('\n---\n\n');
      
      const header = `BIAS Pro - ${mode === 'tiktok' ? 'TikTok' : 'Marketing'} Analysis Chat Export\n`;
      const date = `Exported: ${new Date().toLocaleString('id-ID')}\n`;
      const divider = '='.repeat(50) + '\n\n';
      
      const fullContent = header + date + divider + exportContent;
      
      // Create blob and download
      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bias-chat-export-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <Card className="bg-[#141414] border-gray-800 mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${mode === 'tiktok' ? 'from-pink-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}>
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span>
              {t('Discuss Your Results', 'Diskusikan Hasilmu')}
            </span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full ${mode === 'tiktok' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              Ai Chat
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title={t('Export Chat', 'Export Chat')}
              >
                <Download className="w-4 h-4 text-gray-400 hover:text-green-400" />
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleClearChat}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t(
            'Ask BIAS Ai about your analysis — get tips to improve!',
            'Tanya BIAS Ai tentang hasil analisismu — dapatkan tips untuk improve!'
          )}
        </p>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="pt-0">
          {/* Messages Area */}
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode === 'tiktok' ? 'from-pink-500/20 to-cyan-500/20' : 'from-purple-500/20 to-pink-500/20'} flex items-center justify-center mb-3`}>
                  <Bot className={`w-6 h-6 ${mode === 'tiktok' ? 'text-pink-400' : 'text-purple-400'}`} />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {t(
                    'Got questions about your analysis? Ask me!',
                    'Punya pertanyaan tentang hasil analisis? Tanya aku!'
                  )}
                </p>
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion.text)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        mode === 'tiktok'
                          ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border-pink-500/20'
                          : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20'
                      }`}
                    >
                      <span className="mr-1">{suggestion.icon}</span>
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mode === 'tiktok' ? 'from-pink-500 to-cyan-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center flex-shrink-0`}>
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 ${
                          message.type === 'user'
                            ? mode === 'tiktok' 
                              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                              : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                            : 'bg-white/5 border border-white/10 text-gray-200'
                        }`}
                      >
                        {message.image && (
                          <img 
                            src={message.image} 
                            alt="Sent image" 
                            className="max-h-32 rounded-lg mb-2" 
                          />
                        )}
                        <FormattedChatMessage content={message.content} mode={mode} />
                      </div>
                      {message.type === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-white" />
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
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mode === 'tiktok' ? 'from-pink-500 to-cyan-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <div className="flex gap-1">
                        <span className={`w-2 h-2 ${mode === 'tiktok' ? 'bg-pink-400' : 'bg-purple-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                        <span className={`w-2 h-2 ${mode === 'tiktok' ? 'bg-pink-400' : 'bg-purple-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                        <span className={`w-2 h-2 ${mode === 'tiktok' ? 'bg-pink-400' : 'bg-purple-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-24 rounded-lg border border-gray-700" 
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {/* Quick Template Questions - Show when image is present */}
          {imagePreview && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {mode === 'tiktok' ? (
                <>
                  <button
                    onClick={() => setInput(t('Full profile analysis', 'Analisis profil lengkap'))}
                    className="px-2.5 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-full hover:bg-pink-500/30 transition-colors border border-pink-500/30"
                  >
                    📊 {t('Full Analysis', 'Analisis Lengkap')}
                  </button>
                  <button
                    onClick={() => setInput(t('How to get more views?', 'Cara naikkan views?'))}
                    className="px-2.5 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                  >
                    👁️ Views
                  </button>
                  <button
                    onClick={() => setInput(t('Check thumbnail quality', 'Cek kualitas thumbnail'))}
                    className="px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                  >
                    🎨 Thumbnail
                  </button>
                  <button
                    onClick={() => setInput(t('Pinned video strategy?', 'Strategi video pinned?'))}
                    className="px-2.5 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                  >
                    📌 Pinned
                  </button>
                  <button
                    onClick={() => setInput(t('Blue checkmark chance?', 'Peluang centang biru?'))}
                    className="px-2.5 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                  >
                    ✅ Verified
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setInput(t('Full marketing analysis', 'Analisis marketing lengkap'))}
                    className="px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                  >
                    📊 {t('Full Analysis', 'Analisis Lengkap')}
                  </button>
                  <button
                    onClick={() => setInput(t('How to improve CTA?', 'Cara improve CTA?'))}
                    className="px-2.5 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-full hover:bg-pink-500/30 transition-colors border border-pink-500/30"
                  >
                    🎯 CTA
                  </button>
                  <button
                    onClick={() => setInput(t('Check headline effectiveness', 'Cek efektivitas headline'))}
                    className="px-2.5 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                  >
                    📝 Headline
                  </button>
                  <button
                    onClick={() => setInput(t('Rate visual design', 'Nilai desain visual'))}
                    className="px-2.5 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                  >
                    🎨 Design
                  </button>
                </>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-1.5 sm:gap-2 items-end">
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Single image button with dropdown */}
            <div className="relative group flex-shrink-0">
              <button
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-gray-700 flex items-center justify-center transition-colors"
                title={t('Add image', 'Tambah gambar')}
              >
                <Image className="w-4 h-4 text-gray-400" />
              </button>
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-[#1E1E1E] border border-gray-700 rounded-lg overflow-hidden shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('Take photo', 'Ambil foto')}</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span>{t('Upload', 'Unggah')}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={t('Ask...', 'Tanya...')}
                className={`w-full bg-[#1E1E1E] border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 resize-none min-h-[36px] sm:min-h-[44px] max-h-[150px] ${
                  mode === 'tiktok' 
                    ? 'focus:ring-pink-500/50 focus:border-pink-500'
                    : 'focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && !imagePreview) || isTyping}
              size="sm"
              className={`rounded-lg sm:rounded-xl h-9 w-9 sm:h-11 sm:w-11 p-0 flex-shrink-0 ${
                mode === 'tiktok'
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              } disabled:opacity-50`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
