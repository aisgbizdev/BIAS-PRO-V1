import { useState, useRef, useEffect } from 'react';
import { useSession } from '@/lib/sessionContext';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, X, Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Chat } from '@shared/schema';

interface ChatBubbleProps {
  hasAnalysis?: boolean;
}

export function ChatBubble({ hasAnalysis = false }: ChatBubbleProps) {
  const { session, mode, updateSession } = useSession();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && session) {
      loadChatHistory();
    }
  }, [isOpen, session]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, isSending]);

  // Listen for custom event to open chat with pre-filled message
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      const { message } = event.detail;
      setIsOpen(true);
      setInput(message);
    };

    window.addEventListener('bias:openChat', handleOpenChat);
    return () => window.removeEventListener('bias:openChat', handleOpenChat);
  }, []);

  // Auto-clear chat on page unload (when user leaves app)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.sessionId) {
        // Clear chat history via API
        fetch(`/api/chats/${session.sessionId}`, {
          method: 'DELETE',
          keepalive: true, // Ensures request completes even as page unloads
        }).catch(() => {
          // Silently fail - user is leaving anyway
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close chat
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const loadChatHistory = async () => {
    if (!session) return;
    
    try {
      const response = await fetch(`/api/chats/${session.sessionId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!session || !input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsSending(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        sessionId: session.sessionId,
        message: userMessage,
        mode,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.messageId || 'Chat failed');
      }

      const data = await response.json();
      
      // Update session if returned
      if (data.session) {
        updateSession(data.session);
      }
      
      // Reload chat history
      await loadChatHistory();
      
      // Show off-topic warning if applicable
      if (data.isOnTopic === false) {
        toast({
          title: t('Off-topic', 'Di luar topik'),
          description: t(
            'BIAS focuses on communication and behavior analysis',
            'BIAS fokus ke analisis komunikasi dan perilaku'
          ),
        });
      }
    } catch (error: any) {
      toast({
        title: t('Chat Error', 'Error Chat'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/chats/${session.sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages([]);
        toast({
          title: t('Chat Cleared', 'Chat Dihapus'),
          description: t('All messages have been cleared', 'Semua pesan telah dihapus'),
        });
      }
    } catch (error) {
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to clear chat', 'Gagal menghapus chat'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Floating Button - FIXED CENTER BOTTOM (Doesn't Scroll) */}
      {!isOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 h-10 sm:h-11 rounded-full shadow-lg gap-1.5 px-3.5 sm:px-4 z-50 max-w-fit"
              onClick={() => setIsOpen(true)}
              data-testid="button-chat-open"
            >
              <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                {t('Chat BIAS', 'Chat BIAS')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs mb-2">
            <p className="text-sm">
              {t(
                'Ask questions about communication, behavioral analysis, and social media strategy. AI-powered with strict BIAS focus.',
                'Tanya tentang komunikasi, analisis perilaku, dan strategi media sosial. Didukung AI dengan fokus ketat pada BIAS.'
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Chat Panel - Fixed Position (Doesn't Scroll) */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 sm:bottom-6 sm:right-6 h-[70vh] sm:h-[600px] max-h-[calc(100vh-2rem)] shadow-xl flex flex-col z-50">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">
                {t('BIAS Assistant', 'Asisten BIAS')}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('Press ESC to close', 'Tekan ESC untuk tutup')}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    disabled={messages.length === 0}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t('Clear all messages', 'Hapus semua pesan')}</p>
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-chat-close"
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 px-3 sm:px-4 overflow-auto">
              <div className="space-y-4 py-4 pr-2">
                {messages.length === 0 && (
                  <div className="space-y-3 py-4">
                    {hasAnalysis ? (
                      <Alert className="bg-primary/5 border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-sm">
                          {t(
                            'Your analysis is ready! Discuss your results here - ask about scores, get improvement tips, or dive deeper into specific layers.',
                            'Hasil analisis kamu sudah siap! Diskusikan hasilnya di sini - tanya tentang skor, minta tips perbaikan, atau bahas layer tertentu lebih dalam.'
                          )}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">
                        {t(
                          'Ask me anything about communication and behavioral analysis!',
                          'Tanya apa aja tentang komunikasi dan analisis perilaku!'
                        )}
                      </div>
                    )}
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-1`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      data-testid={`chat-message-${msg.role}`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                {/* Invisible scroll anchor - always at bottom */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('Type your message...', 'Ketik pesan...')}
                  disabled={isSending}
                  data-testid="input-chat"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                  data-testid="button-chat-send"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
