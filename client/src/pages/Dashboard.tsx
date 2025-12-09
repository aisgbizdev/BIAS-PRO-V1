import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section - Minimal */}
      <div className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {brand.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              {getTagline()}
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
          <p className="text-gray-400 text-xs sm:text-sm">
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
                  <CardDescription className="text-gray-400 text-xs sm:text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    {type.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
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

        {/* Library Link - With Description */}
        <Card className="bg-[#141414] border-gray-800 mb-8">
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
      </div>

    </div>
  );
}
