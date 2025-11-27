import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Briefcase, Zap, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';
import biasLogo from '@assets/bias logo_1762016709581.jpg';

export default function Dashboard() {
  const { t, language } = useLanguage();

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              BiAS²³ Pro
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-2">
              {t('Exclusive by', 'Eksklusif oleh')} <span className="font-bold text-cyan-400">THI</span>
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl font-semibold">
              {t(
                'Build Your Influence with AI-Powered Communication',
                'Bangun Pengaruhmu dengan AI Komunikasi'
              )}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
              {t(
                'BiAS²³ Pro delivers instant feedback for TikTok videos, sales pitches, and presentations so your engagement and conversions soar.',
                'BiAS²³ Pro memberi umpan balik instan untuk video TikTok, pitch penjualan, dan presentasi agar engagement & closing melonjak.'
              )}
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
        <Card className="bg-[#141414] border-gray-800 hover-elevate">
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
    </div>
  );
}
