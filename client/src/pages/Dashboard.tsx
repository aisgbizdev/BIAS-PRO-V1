import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, ArrowRight, BookOpen, Sparkles, Zap, Brain, Target, TrendingUp } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';

export default function Dashboard() {
  const { t } = useLanguage();
  const { brand, getTagline } = useBrand();

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
    <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col">
      {/* Combined Hero + Section Header */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4 flex-1">
        <div className="text-center mb-6">
          <p className="text-xs text-pink-400 mb-1">
            {t('Behavioral Intelligence Audit System', 'Behavioral Intelligence Audit System')}
          </p>
          <h1 className="text-lg sm:text-xl font-medium text-white mb-1">
            {getTagline()}
          </h1>
          <p className="text-gray-500 text-xs">
            {t('Select mode below', 'Pilih mode di bawah')}
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
                  <CardDescription className="text-gray-400 text-xs sm:text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      {type.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span>{t(feature.en, feature.id)}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={type.href} className="flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600 transition-colors"
                        data-testid={`button-start-${type.href.slice(1)}`}
                      >
                        {t('Start', 'Mulai')}
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Library Link - With Description */}
        <Card className="bg-[#141414] border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-gray-800 flex-shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">
                    {t('Knowledge Library', 'Knowledge Library')}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {t(
                      'Access glossary of TikTok, Marketing & BIAS terms. Browse community tips, contribute your knowledge, and get free promotion for your content.',
                      'Akses glosarium istilah TikTok, Marketing & BIAS. Jelajahi tips komunitas, kontribusi pengetahuanmu, dan dapatkan promosi gratis untuk kontenmu.'
                    )}
                  </p>
                </div>
              </div>
              <Link href="/library" className="flex-shrink-0">
                <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-gray-300" data-testid="button-go-library">
                  {t('Browse', 'Jelajahi')}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Promotional Section - Elegant & Impactful */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 border border-pink-500/20 p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <Badge className="bg-gradient-to-r from-pink-500/30 to-cyan-500/30 text-white border-pink-500/50 mb-3">
                <Zap className="w-3 h-3 mr-1" />
                {t('First in Indonesia', 'Pertama di Indonesia')}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {t(
                  'The Only Ai Mentor That Understands Behavior',
                  'Satu-satunya Ai Mentor yang Memahami Perilaku'
                )}
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                {t(
                  'Not just analytics. Not just Ai chat. BiAS Pro analyzes HOW you communicate and WHY it works — using science-backed behavioral intelligence.',
                  'Bukan sekadar analitik. Bukan sekadar chat Ai. BiAS Pro menganalisis BAGAIMANA Anda berkomunikasi dan MENGAPA itu berhasil — menggunakan behavioral intelligence berbasis sains.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <Brain className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                <p className="text-xs font-medium text-white">{t('8-Layer Analysis', 'Analisis 8 Layer')}</p>
                <p className="text-[10px] text-gray-500">{t('Deep behavioral insights', 'Insight perilaku mendalam')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <Target className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xs font-medium text-white">{t('Actionable Tips', 'Tips Praktis')}</p>
                <p className="text-[10px] text-gray-500">{t('Not just data, real guidance', 'Bukan cuma data, panduan nyata')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-xs font-medium text-white">{t('Dual Mode', 'Mode Ganda')}</p>
                <p className="text-[10px] text-gray-500">{t('TikTok + Marketing Pro', 'TikTok + Marketing Pro')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-xs font-medium text-white">{t('Bilingual Ai', 'Ai Bilingual')}</p>
                <p className="text-[10px] text-gray-500">{t('Indonesia + English', 'Indonesia + English')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Premium CTA */}
        <div className="mt-6 text-center py-4 border-t border-gray-800/50">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mb-2">
            <Sparkles className="w-3 h-3" />
            <span>{t('Free daily limit resets every 24 hours', 'Limit gratis harian reset setiap 24 jam')}</span>
          </div>
          <Link href="/premium">
            <span className="text-xs text-gray-400 hover:text-pink-400 transition-colors cursor-pointer">
              {t('Need more? View Premium plans', 'Butuh lebih? Lihat paket Premium')} →
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
