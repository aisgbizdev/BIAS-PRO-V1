import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Send, Sparkles, Bot, User, Trash2, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BiasAnalysisResult } from '@shared/schema';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AnalysisDiscussionProps {
  analysisResult?: BiasAnalysisResult | null;
  mode?: 'tiktok' | 'marketing';
  analysisType?: 'video' | 'text' | 'account';
}

export function AnalysisDiscussion({ analysisResult, mode = 'tiktok', analysisType = 'video' }: AnalysisDiscussionProps) {
  const { language } = useLanguage();
  const t = (en: string, id: string) => language === 'en' ? en : id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    setIsMinimized(false);
  };

  // Build context from analysis result
  const getAnalysisContext = () => {
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

Narrative: ${analysisAny.narrativeDiagnosis || analysisResult.narrative || ''}
Recommendations: ${analysisResult.recommendations?.join(', ') || ''}
`;
  };

  // Quick suggestions based on mode and analysis
  const getQuickSuggestions = () => {
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

    try {
      const sessionId = localStorage.getItem('biasSessionId') || 'anonymous';
      const analysisContext = getAnalysisContext();
      
      // Include analysis context in the message
      const messageWithContext = analysisContext 
        ? `${userInput}\n\n[CONTEXT: User is asking about their analysis result]\n${analysisContext}`
        : userInput;

      const res = await fetch('/api/chat/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageWithContext, 
          sessionId, 
          mode: mode === 'marketing' ? 'marketing' : 'expert' 
        }),
      });
      
      const data = await res.json();
      let finalResponse = data.response || 'Maaf bro, ada gangguan. Coba lagi ya!';
      
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
        content: '⚠️ Gagal connect ke AI. Coba refresh dan tanya lagi ya!',
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
              AI Chat
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-1">
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
            'Ask BIAS AI about your analysis — get tips to improve!',
            'Tanya BIAS AI tentang hasil analisismu — dapatkan tips untuk improve!'
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
                        <div className="text-sm whitespace-pre-wrap">
                          <FormattedMessage content={message.content} />
                        </div>
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

          {/* Input Area */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'tiktok' 
                  ? t('Ask about your TikTok analysis...', 'Tanya tentang hasil analisis TikTok...')
                  : t('Ask about your analysis...', 'Tanya tentang hasil analisismu...')
                }
                className={`w-full bg-[#1E1E1E] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 resize-none min-h-[44px] max-h-[120px] ${
                  mode === 'tiktok' 
                    ? 'focus:ring-pink-500/50 focus:border-pink-500'
                    : 'focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="sm"
              className={`rounded-xl h-11 w-11 p-0 ${
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

// Helper component to format messages with markdown-like syntax
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h4 key={index} className="font-semibold text-white mt-2">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={index} className="font-bold text-white mt-3">{line.replace('## ', '')}</h3>;
        }
        
        // Bold and italic
        let formattedLine = line
          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="text-gray-400">$1</em>');
        
        // Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
          return <p key={index} className="pl-3" dangerouslySetInnerHTML={{ __html: '• ' + formattedLine.replace(/^[-•]\s*/, '') }} />;
        }
        
        // Dividers
        if (line.trim() === '---') {
          return <hr key={index} className="border-gray-700 my-2" />;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      })}
    </div>
  );
}
