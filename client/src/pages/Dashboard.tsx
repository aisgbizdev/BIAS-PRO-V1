import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Briefcase, Zap, CheckCircle, ArrowRight, BookOpen, Send, MessageCircle, Loader2, Minimize2, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';
import biasLogo from '@assets/bias logo_1762016709581.jpg';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { brand, getTagline, getSubtitle, getDescription } = useBrand();
  
  // Quick Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState<'tiktok' | 'marketing'>('tiktok');

  const handleClearChat = () => {
    setChatInput('');
    setChatResponse('');
    setShowResponse(false);
    setIsMinimized(false);
  };

  const handleQuickChat = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    setIsLoading(true);
    setShowResponse(true);
    setChatResponse('');
    
    try {
      const sessionId = localStorage.getItem('biasSessionId') || 'anonymous';
      const res = await fetch('/api/chat/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: chatInput.trim(), 
          sessionId,
          mode: chatMode === 'marketing' ? 'marketing' : 'home'
        }),
      });
      
      const data = await res.json();
      let response = data.response || 'Maaf, ada gangguan. Coba lagi ya!';
      
      // Add source indicator
      if (data.source === 'ai') {
        response += '\n\n---\n*✨ Fresh from BIAS Brain*';
      } else if (data.source === 'local' && !response.includes('⚠️')) {
        response += '\n\n---\n*📚 Dari Learning Library*';
      }
      
      setChatResponse(response);
    } catch (err) {
      setChatResponse('⚠️ Gagal connect. Coba refresh dan tanya lagi ya!');
    } finally {
      setIsLoading(false);
    }
  };

  const analysisTypes = [
    // FIRST: TikTok Pro
    {
      href: '/social-pro',
      icon: SiTiktok,
      title: t('TikTok Pro', 'TikTok Pro'),
      description: t(
        'Master TikTok with Ai mentor! FYP secrets, viral hooks, live streaming tips & account analytics all in one place.',
        'Kuasai TikTok dengan Ai mentor! Rahasia FYP, hook viral, tips live streaming & analitik akun dalam satu tempat.'
      ),
      color: 'from-pink-500 to-cyan-500',
      features: [
        { en: 'Ai TikTok Mentor (ask anything!)', id: 'Ai Mentor TikTok (tanya apa aja!)' },
        { en: 'FYP algorithm & viral secrets', id: 'Algoritma FYP & rahasia viral' },
        { en: 'Live & script generator', id: 'Generator live & script' },
      ],
      badge: t('Creator', 'Creator'),
      badgeColor: 'bg-gradient-to-r from-pink-500/30 to-cyan-500/30 text-pink-300 border-pink-500/50',
    },
    // SECOND: Marketing Pro
    {
      href: '/creator',
      icon: Briefcase,
      title: t('Marketing Pro', 'Marketing Pro'),
      description: t(
        'Level up your professional skills! Sales closing, pitch mastery, leadership, public speaking & negotiation — all with Ai coaching.',
        'Tingkatkan skill profesionalmu! Closing sales, pitch mastery, leadership, public speaking & negosiasi — semua dengan Ai coaching.'
      ),
      color: 'from-purple-500 to-pink-500',
      features: [
        { en: 'Ai Sales & Leadership Coach', id: 'Ai Coach Sales & Leadership' },
        { en: 'Pitch & presentation analysis', id: 'Analisis pitch & presentasi' },
        { en: 'Negotiation & closing tips', id: 'Tips negosiasi & closing' },
      ],
      badge: t('Professional', 'Profesional'),
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section - Minimal */}
      <div className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {brand.name}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600">
              {getTagline()}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-lg">
              {getSubtitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Types Grid - Clean */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 text-white">
            {t('Choose Analysis Type', 'Pilih Tipe Analisis')}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            {t('Select the mode that fits your needs', 'Pilih mode sesuai kebutuhan Anda')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {analysisTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.href}
                className="bg-[#141414] border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <Icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <Badge variant="outline" className="bg-gray-800/50 text-gray-400 border-gray-700 text-[10px]">
                      {type.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg text-white">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500 text-xs sm:text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    {type.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-500" />
                        <span>{t(feature.en, feature.id)}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={type.href}>
                    <Button
                      className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-sm"
                      data-testid={`button-start-${type.href.slice(1)}`}
                    >
                      {t('Start', 'Mulai')}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Library Link - Compact */}
        <Card className="bg-[#141414] border-gray-800 mb-24">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-gray-800 flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">
                    {t('Library', 'Library')}
                  </h3>
                  <p className="text-gray-500 text-[10px] sm:text-xs truncate">
                    {t('Terms & free promotion', 'Istilah & promosi gratis')}
                  </p>
                </div>
              </div>
              <Link href="/library" className="flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-go-library">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Bottom Chat Bar - Minimal */}
      <div className="fixed bottom-4 left-0 right-0 z-50">
        {/* Response Panel */}
        {showResponse && (
          <div className="max-w-2xl mx-auto px-4 mb-2">
            <div className="bg-[#141414] border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                <span className="text-xs text-gray-500">Response</span>
                <button
                  onClick={handleClearChat}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                </button>
              </div>
              <div className="p-3 max-h-32 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">{t('Thinking...', 'Mikir...')}</span>
                  </div>
                ) : (
                  <div className="text-gray-300 text-xs leading-relaxed">
                    {chatResponse.split('\n').map((line, i) => {
                      const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                      const italicParsed = boldParsed.replace(/\*(.+?)\*/g, '<em class="text-gray-400">$1</em>');
                      return (
                        <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: italicParsed }} />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input Bar - Clean */}
        <div className="max-w-2xl mx-auto mx-4 sm:mx-auto px-3 py-2 bg-[#141414] border border-gray-800 rounded-lg">
          {/* Mode Toggle - Compact */}
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={() => setChatMode('tiktok')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
                chatMode === 'tiktok' ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-500'
              }`}
            >
              <SiTiktok className="w-2.5 h-2.5" />
              TikTok
            </button>
            <button
              onClick={() => setChatMode('marketing')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
                chatMode === 'marketing' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500'
              }`}
            >
              <Briefcase className="w-2.5 h-2.5" />
              Marketing
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickChat()}
              placeholder={chatMode === 'tiktok' 
                ? t('Ask about TikTok...', 'Tanya tentang TikTok...')
                : t('Ask about sales...', 'Tanya tentang sales...')
              }
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-gray-600"
            />
            <button
              onClick={handleQuickChat}
              disabled={isLoading || !chatInput.trim()}
              className="p-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          
          {/* Quick chips - minimal */}
          {!showResponse && (
            <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
              {(chatMode === 'tiktok' ? [
                { en: 'FYP?', id: 'FYP?' },
                { en: 'Posting time?', id: 'Jam posting?' },
                { en: 'Live tips?', id: 'Tips Live?' },
              ] : [
                { en: 'Close deals?', id: 'Closing?' },
                { en: 'Pitch tips?', id: 'Tips pitch?' },
                { en: 'Objections?', id: 'Keberatan?' },
              ]).map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(t(chip.en, chip.id))}
                  className="px-2 py-0.5 text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-400 rounded whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {t(chip.en, chip.id)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
