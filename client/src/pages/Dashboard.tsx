import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Briefcase, Zap, CheckCircle, ArrowRight, BookOpen, Send, MessageCircle, Loader2 } from 'lucide-react';
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
        body: JSON.stringify({ message: chatInput.trim(), sessionId }),
      });
      
      const data = await res.json();
      let response = data.response || 'Maaf, ada gangguan. Coba lagi ya!';
      
      // Add source indicator
      if (data.source === 'ai') {
        response += '\n\n---\n*🤖 Dijawab oleh AI*';
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
    // FIRST: Social Media Pro (Account Analytics)
    {
      href: '/social-pro',
      icon: SiTiktok,
      title: t('Social Media Pro', 'Social Media Pro'),
      description: t(
        'Deep analytics dashboard for TikTok, Instagram & YouTube accounts with premium visualizations & metrics',
        'Dashboard analitik mendalam untuk akun TikTok, Instagram & YouTube dengan visualisasi & metrik premium'
      ),
      color: 'from-pink-500 to-cyan-500',
      features: [
        { en: 'Account performance metrics', id: 'Metrik performa akun' },
        { en: 'Video comparison analysis', id: 'Analisis perbandingan video' },
        { en: '6 comprehensive analytics cards', id: '6 kartu analitik komprehensif' },
      ],
      badge: t('Premium', 'Premium'),
      badgeColor: 'bg-gradient-to-r from-pink-500/30 to-cyan-500/30 text-pink-300 border-pink-500/50',
    },
    // SECOND: Communication Analysis (Sales & Marketing Focus)
    {
      href: '/creator',
      icon: Mic,
      title: t('Communication Analysis', 'Analisis Komunikasi'),
      description: t(
        'Analyze sales presentations, prospecting calls, client pitches & marketing videos. Get AI-powered feedback to boost conversions.',
        'Analisis presentasi jualan, prospek, pitch klien & video marketing. Dapatkan feedback AI untuk tingkatkan konversi.'
      ),
      color: 'from-purple-500 to-pink-500',
      features: [
        { en: 'Sales pitch analysis', id: 'Analisis sales pitch' },
        { en: 'Client presentation feedback', id: 'Feedback presentasi klien' },
        { en: 'Conversion optimization tips', id: 'Tips optimasi konversi' },
      ],
      badge: t('General', 'Umum'),
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24">
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
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
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
                      'TikTok, Instagram & YouTube terms you can add yourself. Include your account for FREE promotion!',
                      'Istilah TikTok, Instagram & YouTube yang bisa kamu tambahkan sendiri. Cantumkan akun kamu untuk promosi GRATIS!'
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-gray-800">
        {/* Response Panel (slides up when there's response) */}
        {showResponse && (
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="bg-[#141414] border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
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
              <button 
                onClick={() => { setShowResponse(false); setChatInput(''); setChatResponse(''); }}
                className="mt-2 text-xs text-gray-500 hover:text-gray-300"
              >
                {t('Close', 'Tutup')} ✕
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickChat()}
              placeholder={t('Ask BIAS anything about TikTok...', 'Tanya BIAS apa aja soal TikTok...')}
              className="flex-1 bg-[#141414] border border-gray-700 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
            <Button
              onClick={handleQuickChat}
              disabled={isLoading || !chatInput.trim()}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 rounded-full w-10 h-10 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick chips - only show when no response */}
          {!showResponse && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { en: 'FYP algorithm?', id: 'Algoritma FYP?' },
                { en: 'Best time to post?', id: 'Jam post terbaik?' },
                { en: 'How to viral?', id: 'Cara viral?' },
                { en: 'Grow followers?', id: 'Nambah follower?' },
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(t(chip.en, chip.id))}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
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
