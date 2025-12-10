import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, ArrowRight, BookOpen, Sparkles, Zap, Brain, Target, TrendingUp, Trophy, ChevronLeft, ChevronRight, Quote, Shield, Gauge, MessageCircle, Layers } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';

interface SuccessStory {
  id: string;
  name: string;
  username: string;
  platform: string;
  role: string;
  achievement: string;
  story: string;
  featured: boolean;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { brand, getTagline } = useBrand();
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    fetch('/api/success-stories')
      .then(res => res.json())
      .then(data => {
        const featured = (data || []).filter((s: SuccessStory) => s.featured).slice(0, 5);
        setSuccessStories(featured.length > 0 ? featured : (data || []).slice(0, 3));
      })
      .catch(() => setSuccessStories([]));
  }, []);

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
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
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all text-white font-medium px-6 py-2"
                        data-testid={`button-start-${type.href.slice(1)}`}
                      >
                        {type.href === '/social-pro' 
                          ? t('Start TikTok Audit', 'Mulai Audit TikTok')
                          : t('Start Script Review', 'Mulai Review Script')
                        }
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* BIAS Signature Features - What Makes Us Different */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-900/50 via-pink-500/5 to-gray-900/50 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-pink-500/20">
              <Layers className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-sm font-semibold text-white">{t('BIAS Signature Features', 'Fitur Khas BIAS')}</span>
            <Badge className="text-[10px] bg-pink-500/20 text-pink-300 border-0">
              {t('AI-Powered', 'Bertenaga AI')}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
              <Layers className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{t('8-Layer Analysis', 'Analisis 8 Layer')}</p>
                <p className="text-[10px] text-gray-500">{t('Deep behavioral scan', 'Scan perilaku mendalam')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
              <Gauge className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{t('Hook Power Score', 'Skor Kekuatan Hook')}</p>
                <p className="text-[10px] text-gray-500">{t('Viral potential meter', 'Ukur potensi viral')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
              <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{t('Risk Scanner', 'Scanner Risiko')}</p>
                <p className="text-[10px] text-gray-500">{t('Shadowban prevention', 'Cegah shadowban')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
              <MessageCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{t('Tone & Delivery', 'Nada & Penyampaian')}</p>
                <p className="text-[10px] text-gray-500">{t('Emotional impact map', 'Peta dampak emosi')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
              <Brain className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white">{t('Smart Strategy', 'Strategi Cerdas')}</p>
                <p className="text-[10px] text-gray-500">{t('Personalized advice', 'Saran personal')}</p>
              </div>
            </div>
          </div>
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

        {/* Promotional Section - Benefit-focused for TikTokers & Marketers */}
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
                  'Stop Guessing. Start Growing.',
                  'Berhenti Tebak-tebakan. Mulai Berkembang.'
                )}
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                {t(
                  'Know exactly WHY your content works or fails — and get personalized Ai coaching to fix it instantly.',
                  'Tahu persis KENAPA kontenmu berhasil atau gagal — dan dapatkan Ai coaching personal untuk memperbaikinya seketika.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* TikToker Benefits */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-pink-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-pink-500/20">
                    <SiTiktok className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="font-semibold text-white text-sm">{t('For TikTokers', 'Untuk TikTokers')}</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-pink-400 flex-shrink-0" />
                    <span>{t('Crack the FYP algorithm — know what hooks work', 'Tembus algoritma FYP — tahu hook mana yang berhasil')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-pink-400 flex-shrink-0" />
                    <span>{t('Avoid shadowban with content compliance tips', 'Hindari shadowban dengan tips kepatuhan konten')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-pink-400 flex-shrink-0" />
                    <span>{t('Go viral with proven storytelling frameworks', 'Jadi viral dengan framework storytelling terbukti')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-pink-400 flex-shrink-0" />
                    <span>{t('Live streaming scripts that boost gifts & engagement', 'Script live streaming yang boost gift & engagement')}</span>
                  </li>
                </ul>
              </div>

              {/* Marketer Benefits */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-semibold text-white text-sm">{t('For Sales & Marketing', 'Untuk Sales & Marketing')}</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-purple-400 flex-shrink-0" />
                    <span>{t('Close more deals with persuasive scripts', 'Closing lebih banyak dengan script persuasif')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-purple-400 flex-shrink-0" />
                    <span>{t('Handle objections like a pro negotiator', 'Tangani keberatan seperti negosiator pro')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-purple-400 flex-shrink-0" />
                    <span>{t('Pitch with confidence — Ai reviews your delivery', 'Pitch percaya diri — Ai review cara penyampaianmu')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-purple-400 flex-shrink-0" />
                    <span>{t('Lead meetings & presentations that convert', 'Pimpin meeting & presentasi yang menghasilkan')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800">
              <div className="text-center">
                <p className="text-lg font-bold text-pink-400">8</p>
                <p className="text-[10px] text-gray-500">{t('Behavioral Layers', 'Layer Perilaku')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">2</p>
                <p className="text-[10px] text-gray-500">{t('Ai Mentors', 'Ai Mentor')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">∞</p>
                <p className="text-[10px] text-gray-500">{t('Growth Potential', 'Potensi Pertumbuhan')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Carousel - Compact for Mobile */}
        {successStories.length > 0 && successStories[currentStoryIndex] && (
          <div className="mt-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 border border-yellow-500/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-white">{t('Success Stories', 'Cerita Sukses')}</span>
                <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-400">
                  {successStories.length} {t('stories', 'cerita')}
                </Badge>
              </div>
              {successStories.length > 1 && (
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={prevStory}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-gray-500">{currentStoryIndex + 1}/{successStories.length}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={nextStory}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="relative">
              <Quote className="absolute top-0 left-0 w-6 h-6 text-yellow-500/20" />
              <div className="pl-8">
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                  "{successStories[currentStoryIndex].story}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white">{successStories[currentStoryIndex].name}</p>
                    <p className="text-[10px] text-gray-500">{successStories[currentStoryIndex].username}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={successStories[currentStoryIndex].platform === 'tiktok' ? 'bg-pink-500/20 text-pink-300 text-[10px]' : 'bg-purple-500/20 text-purple-300 text-[10px]'}>
                      {successStories[currentStoryIndex].platform === 'tiktok' ? 'TikTok' : 'Marketing'}
                    </Badge>
                    <p className="text-[10px] text-green-400 mt-0.5">{successStories[currentStoryIndex].achievement}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between">
              <p className="text-[10px] text-gray-500">
                {t('Have a success story?', 'Punya cerita sukses?')}
              </p>
              <Link href="/library">
                <span className="text-[10px] text-yellow-400 hover:text-yellow-300 cursor-pointer">
                  {t('Share yours & get featured!', 'Bagikan & tampil di sini!')} →
                </span>
              </Link>
            </div>
          </div>
        )}

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
