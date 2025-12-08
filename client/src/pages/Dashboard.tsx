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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 lg:py-12">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${brand.colors.secondary} bg-clip-text text-transparent`}>
              {brand.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {getTagline()}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl font-semibold">
              {getSubtitle()}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
              {getDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Types Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            {t('Choose Your Analysis Type', 'Pilih Tipe Analisis Anda')}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            {t(
              'Select the analysis mode that best fits your needs',
              'Pilih mode analisis yang paling sesuai dengan kebutuhan Anda'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {analysisTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.href}
                className="bg-[#141414] border-gray-800 hover-elevate group relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${type.color} bg-opacity-10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className={`${type.badgeColor} border`}>
                      {type.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {type.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                        <span>{t(feature.en, feature.id)}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={type.href}>
                    <Button
                      className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 transition-opacity gap-2`}
                      data-testid={`button-start-${type.href.slice(1)}`}
                    >
                      {t('Start Analysis', 'Mulai Analisis')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Library Link */}
        <Card className="bg-[#141414] border-gray-800 hover-elevate mb-32">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 bg-opacity-10 flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 leading-tight">
                    {t('Platform Terms & Free Promotion', 'Istilah Platform & Promosi Gratis')}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                    {t(
                      'TikTok & Marketing terms you can add yourself. Include your account for FREE promotion!',
                      'Istilah TikTok & Marketing yang bisa kamu tambahkan sendiri. Cantumkan akun kamu untuk promosi GRATIS!'
                    )}
                  </p>
                </div>
              </div>
              <Link href="/library" className="w-full sm:w-auto flex-shrink-0">
                <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-go-library">
                  {t('Browse Library', 'Buka Library')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Bottom Chat Bar */}
      <div className="fixed bottom-8 left-0 right-0 z-50">
        {/* Response Panel (slides up when there's response) */}
        {showResponse && (
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="bg-[#141414] border border-gray-700 rounded-lg overflow-hidden">
              {/* Chat Header with controls */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-gray-300">BIAS Response</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title={isMinimized ? 'Expand' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    title={t('Clear chat', 'Hapus chat')}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
              
              {/* Chat Content (collapsible) */}
              {!isMinimized && (
                <div className="p-3 max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{t('Thinking...', 'Mikir dulu...')}</span>
                    </div>
                  ) : (
                    <div className="text-gray-200 text-sm leading-relaxed">
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
              )}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="max-w-3xl mx-auto px-4 py-3 bg-[#0A0A0A]/95 backdrop-blur-lg border border-gray-800 rounded-2xl mx-4 sm:mx-auto">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setChatMode('tiktok')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chatMode === 'tiktok'
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <SiTiktok className="w-3 h-3" />
              TikTok Pro
            </button>
            <button
              onClick={() => setChatMode('marketing')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chatMode === 'marketing'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              Marketing Pro
            </button>
          </div>

          <div className="flex items-center gap-2">
            {chatMode === 'tiktok' ? (
              <SiTiktok className="w-5 h-5 text-pink-400 flex-shrink-0" />
            ) : (
              <Briefcase className="w-5 h-5 text-purple-400 flex-shrink-0" />
            )}
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickChat()}
              placeholder={chatMode === 'tiktok' 
                ? t('Ask about TikTok, FYP, viral, live...', 'Tanya soal TikTok, FYP, viral, live...')
                : t('Ask about sales, pitch, leadership, negotiation...', 'Tanya soal sales, pitch, leadership, negosiasi...')
              }
              className={`flex-1 bg-[#141414] border border-gray-700 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                chatMode === 'tiktok' 
                  ? 'focus:ring-pink-500/50 focus:border-pink-500' 
                  : 'focus:ring-purple-500/50 focus:border-purple-500'
              }`}
            />
            <Button
              onClick={handleQuickChat}
              disabled={isLoading || !chatInput.trim()}
              size="sm"
              className={`rounded-full w-10 h-10 p-0 ${
                chatMode === 'tiktok'
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick chips - based on mode */}
          {!showResponse && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {(chatMode === 'tiktok' ? [
                { en: 'FYP algorithm?', id: 'Algoritma FYP?' },
                { en: 'Best posting time?', id: 'Jam posting terbaik?' },
                { en: 'Live tips?', id: 'Tips Live rame?' },
                { en: 'What is shadowban?', id: 'Shadowban itu apa?' },
                { en: '3-sec hook tips', id: 'Tips hook 3 detik' },
              ] : [
                { en: 'How to close deals?', id: 'Cara closing deal?' },
                { en: 'Pitch to investors?', id: 'Pitch ke investor?' },
                { en: 'Handle objections?', id: 'Handle keberatan klien?' },
                { en: 'Leadership tips?', id: 'Tips leadership?' },
                { en: 'Negotiation tactics?', id: 'Taktik negosiasi?' },
              ]).map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(t(chip.en, chip.id))}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                    chatMode === 'tiktok'
                      ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20'
                      : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20'
                  }`}
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
