import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Gift, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Star,
  Zap,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Coins,
  Video,
  Heart
} from 'lucide-react';

interface MonetizationMethod {
  id: string;
  titleEn: string;
  titleId: string;
  descriptionEn: string;
  descriptionId: string;
  icon: React.ElementType;
  color: string;
  requirementsEn: string[];
  requirementsId: string[];
  potentialEarningEn: string;
  potentialEarningId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToSetup: string;
  stepsEn: string[];
  stepsId: string[];
  tipsEn: string[];
  tipsId: string[];
}

const monetizationMethods: MonetizationMethod[] = [
  {
    id: 'creator-fund',
    titleEn: 'TikTok Creator Fund',
    titleId: 'TikTok Creator Fund',
    descriptionEn: 'Earn money based on video views and engagement directly from TikTok',
    descriptionId: 'Hasilkan uang berdasarkan views dan engagement langsung dari TikTok',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    requirementsEn: [
      '10,000+ followers',
      '100,000+ video views in last 30 days',
      'Age 18+ years',
      'Account in good standing',
      'Original content only'
    ],
    requirementsId: [
      '10,000+ followers',
      '100,000+ video views dalam 30 hari terakhir',
      'Usia 18+ tahun',
      'Akun dalam kondisi baik',
      'Hanya konten original'
    ],
    potentialEarningEn: '$0.02 - $0.04 per 1000 views',
    potentialEarningId: 'Rp 300 - Rp 600 per 1000 views',
    difficulty: 'medium',
    timeToSetup: '2-4 weeks',
    stepsEn: [
      'Check eligibility in Creator Tools',
      'Apply for Creator Fund in app',
      'Wait for approval (3-5 days)',
      'Link payment method',
      'Start earning from views'
    ],
    stepsId: [
      'Cek eligibility di Creator Tools',
      'Apply Creator Fund di app',
      'Tunggu approval (3-5 hari)',
      'Hubungkan metode pembayaran',
      'Mulai hasilkan dari views'
    ],
    tipsEn: [
      'Focus on watch time, not just views',
      'Post consistently to maintain eligibility',
      'Diversify - do not rely solely on Creator Fund'
    ],
    tipsId: [
      'Fokus pada watch time, bukan hanya views',
      'Post konsisten untuk maintain eligibility',
      'Diversifikasi - jangan hanya bergantung pada Creator Fund'
    ]
  },
  {
    id: 'live-gifts',
    titleEn: 'LIVE Gifts & Diamonds',
    titleId: 'LIVE Gifts & Diamonds',
    descriptionEn: 'Receive virtual gifts from viewers during live streams, convert to real money',
    descriptionId: 'Terima virtual gifts dari penonton selama live stream, konversi ke uang asli',
    icon: Gift,
    color: 'from-pink-500 to-rose-500',
    requirementsEn: [
      '1,000+ followers',
      'Age 18+ years',
      'Account age 30+ days',
      'LIVE access enabled'
    ],
    requirementsId: [
      '1,000+ followers',
      'Usia 18+ tahun',
      'Usia akun 30+ hari',
      'Akses LIVE diaktifkan'
    ],
    potentialEarningEn: '$100 - $10,000+ per month (varies greatly)',
    potentialEarningId: 'Rp 1.5jt - Rp 150jt+ per bulan (sangat bervariasi)',
    difficulty: 'medium',
    timeToSetup: '1 week',
    stepsEn: [
      'Enable LIVE feature in settings',
      'Build rapport with audience first',
      'Schedule regular LIVE sessions',
      'Engage viewers to encourage gifts',
      'Withdraw diamonds to bank account'
    ],
    stepsId: [
      'Aktifkan fitur LIVE di settings',
      'Bangun rapport dengan audiens dulu',
      'Jadwalkan sesi LIVE regular',
      'Engage penonton untuk encourage gifts',
      'Withdraw diamonds ke rekening bank'
    ],
    tipsEn: [
      'Go LIVE at consistent times',
      'Acknowledge every gift publicly',
      'Create interactive LIVE content (Q&A, games)',
      'Use PK battles for engagement boost'
    ],
    tipsId: [
      'Go LIVE di waktu yang konsisten',
      'Acknowledge setiap gift secara publik',
      'Buat konten LIVE interaktif (Q&A, games)',
      'Gunakan PK battles untuk boost engagement'
    ]
  },
  {
    id: 'tiktok-shop',
    titleEn: 'TikTok Shop',
    titleId: 'TikTok Shop',
    descriptionEn: 'Sell products directly through TikTok or earn affiliate commissions',
    descriptionId: 'Jual produk langsung melalui TikTok atau hasilkan komisi afiliasi',
    icon: ShoppingBag,
    color: 'from-orange-500 to-amber-500',
    requirementsEn: [
      '1,000+ followers (for affiliate)',
      'Business account or verified seller',
      'Age 18+ years',
      'Region with TikTok Shop available'
    ],
    requirementsId: [
      '1,000+ followers (untuk afiliasi)',
      'Akun bisnis atau seller terverifikasi',
      'Usia 18+ tahun',
      'Region dengan TikTok Shop tersedia'
    ],
    potentialEarningEn: '5-20% commission per sale',
    potentialEarningId: 'Komisi 5-20% per penjualan',
    difficulty: 'easy',
    timeToSetup: '3-7 days',
    stepsEn: [
      'Apply for TikTok Shop Affiliate',
      'Browse and select products to promote',
      'Create engaging product showcase videos',
      'Add product links to videos',
      'Earn commission on every sale'
    ],
    stepsId: [
      'Apply untuk TikTok Shop Affiliate',
      'Browse dan pilih produk untuk dipromosikan',
      'Buat video showcase produk yang engaging',
      'Tambahkan link produk ke video',
      'Hasilkan komisi setiap penjualan'
    ],
    tipsEn: [
      'Choose products matching your niche',
      'Show authentic product reviews',
      'Use LIVE shopping for higher conversion',
      'Leverage trending products for reach'
    ],
    tipsId: [
      'Pilih produk yang sesuai niche kamu',
      'Tunjukkan review produk yang authentic',
      'Gunakan LIVE shopping untuk konversi lebih tinggi',
      'Leverage produk trending untuk reach'
    ]
  },
  {
    id: 'brand-deals',
    titleEn: 'Brand Partnerships & Sponsorships',
    titleId: 'Brand Partnerships & Sponsorships',
    descriptionEn: 'Get paid by brands to create sponsored content or become ambassador',
    descriptionId: 'Dibayar oleh brand untuk membuat konten sponsored atau jadi ambassador',
    icon: BadgeCheck,
    color: 'from-blue-500 to-cyan-500',
    requirementsEn: [
      '10,000+ followers (recommended)',
      'Consistent posting history',
      'Good engagement rate (3%+)',
      'Clear niche/audience demographic'
    ],
    requirementsId: [
      '10,000+ followers (direkomendasikan)',
      'Riwayat posting yang konsisten',
      'Engagement rate bagus (3%+)',
      'Niche/demografi audiens yang jelas'
    ],
    potentialEarningEn: '$100 - $10,000+ per post',
    potentialEarningId: 'Rp 1.5jt - Rp 150jt+ per post',
    difficulty: 'hard',
    timeToSetup: '1-3 months',
    stepsEn: [
      'Build media kit with stats and demographics',
      'Join TikTok Creator Marketplace',
      'Reach out to brands in your niche',
      'Negotiate rates based on engagement',
      'Create authentic sponsored content'
    ],
    stepsId: [
      'Buat media kit dengan stats dan demografi',
      'Join TikTok Creator Marketplace',
      'Reach out ke brand di niche kamu',
      'Negosiasi rate berdasarkan engagement',
      'Buat konten sponsored yang authentic'
    ],
    tipsEn: [
      'Quality > quantity for brand deals',
      'Keep sponsored content authentic',
      'Always disclose partnerships (#ad)',
      'Build long-term brand relationships'
    ],
    tipsId: [
      'Kualitas > kuantitas untuk brand deals',
      'Jaga konten sponsored tetap authentic',
      'Selalu disclose partnerships (#ad)',
      'Bangun hubungan jangka panjang dengan brand'
    ]
  },
  {
    id: 'own-products',
    titleEn: 'Sell Your Own Products/Services',
    titleId: 'Jual Produk/Jasa Sendiri',
    descriptionEn: 'Use TikTok to drive traffic to your own business, courses, or services',
    descriptionId: 'Gunakan TikTok untuk drive traffic ke bisnis, kursus, atau jasa sendiri',
    icon: Star,
    color: 'from-purple-500 to-violet-500',
    requirementsEn: [
      'No minimum followers',
      'Business account recommended',
      'Product/service ready to sell',
      'Link in bio setup'
    ],
    requirementsId: [
      'Tidak ada minimum followers',
      'Akun bisnis direkomendasikan',
      'Produk/jasa siap dijual',
      'Setup link di bio'
    ],
    potentialEarningEn: 'Unlimited - depends on your product',
    potentialEarningId: 'Unlimited - tergantung produk kamu',
    difficulty: 'medium',
    timeToSetup: '1-2 weeks',
    stepsEn: [
      'Define your product/service offering',
      'Set up payment & delivery system',
      'Create content showcasing value',
      'Use bio link for conversions',
      'Build email list for retargeting'
    ],
    stepsId: [
      'Tentukan penawaran produk/jasa kamu',
      'Setup sistem pembayaran & pengiriman',
      'Buat konten yang showcase value',
      'Gunakan bio link untuk konversi',
      'Bangun email list untuk retargeting'
    ],
    tipsEn: [
      'Give value first, sell second',
      'Use testimonials and social proof',
      'Create urgency with limited offers',
      'Retarget viewers with email marketing'
    ],
    tipsId: [
      'Beri value dulu, jual kemudian',
      'Gunakan testimoni dan social proof',
      'Buat urgency dengan penawaran terbatas',
      'Retarget viewers dengan email marketing'
    ]
  }
];

const incomeCalculatorStages = [
  { followers: '1K', creatorFund: '-', liveGifts: '$50-200/mo', affiliate: '$100-500/mo', brandDeals: '-' },
  { followers: '10K', creatorFund: '$20-50/mo', liveGifts: '$200-1K/mo', affiliate: '$500-2K/mo', brandDeals: '$100-500/post' },
  { followers: '50K', creatorFund: '$100-300/mo', liveGifts: '$500-5K/mo', affiliate: '$2K-10K/mo', brandDeals: '$500-2K/post' },
  { followers: '100K', creatorFund: '$300-800/mo', liveGifts: '$1K-10K/mo', affiliate: '$5K-20K/mo', brandDeals: '$1K-5K/post' },
  { followers: '500K+', creatorFund: '$1K-3K/mo', liveGifts: '$5K-50K/mo', affiliate: '$10K-50K/mo', brandDeals: '$5K-20K/post' },
];

export function MonetizationGuidePanel() {
  const { t, language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<MonetizationMethod | null>(null);

  const getDifficultyBadge = (difficulty: string) => {
    const config = {
      easy: { label: t('Easy', 'Mudah'), color: 'bg-green-500/20 text-green-400' },
      medium: { label: t('Medium', 'Sedang'), color: 'bg-yellow-500/20 text-yellow-400' },
      hard: { label: t('Hard', 'Sulit'), color: 'bg-red-500/20 text-red-400' },
    };
    return config[difficulty as keyof typeof config] || config.medium;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
          <TabsTrigger value="methods" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600">
            <DollarSign className="w-4 h-4 mr-2" />
            {t('Monetization Methods', 'Metode Monetisasi')}
          </TabsTrigger>
          <TabsTrigger value="calculator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
            <Coins className="w-4 h-4 mr-2" />
            {t('Income Potential', 'Potensi Penghasilan')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="mt-6 space-y-4">
          {selectedMethod ? (
            <div className="space-y-6">
              <Button variant="outline" onClick={() => setSelectedMethod(null)} className="mb-4">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                {t('Back to All Methods', 'Kembali ke Semua Metode')}
              </Button>

              <Card className={`bg-gradient-to-r ${selectedMethod.color} bg-opacity-20 border-none`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <selectedMethod.icon className="w-8 h-8" />
                    {language === 'en' ? selectedMethod.titleEn : selectedMethod.titleId}
                  </CardTitle>
                  <p className="text-gray-300">
                    {language === 'en' ? selectedMethod.descriptionEn : selectedMethod.descriptionId}
                  </p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Target className="w-4 h-4" />
                      {t('Difficulty', 'Tingkat Kesulitan')}
                    </div>
                    <Badge className={getDifficultyBadge(selectedMethod.difficulty).color}>
                      {getDifficultyBadge(selectedMethod.difficulty).label}
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Clock className="w-4 h-4" />
                      {t('Time to Setup', 'Waktu Setup')}
                    </div>
                    <span className="font-medium">{selectedMethod.timeToSetup}</span>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <DollarSign className="w-4 h-4" />
                      {t('Earning Potential', 'Potensi Penghasilan')}
                    </div>
                    <span className="font-medium text-green-400">
                      {language === 'en' ? selectedMethod.potentialEarningEn : selectedMethod.potentialEarningId}
                    </span>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    {t('Requirements', 'Persyaratan')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(language === 'en' ? selectedMethod.requirementsEn : selectedMethod.requirementsId).map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    {t('Step-by-Step Guide', 'Panduan Langkah demi Langkah')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {(language === 'en' ? selectedMethod.stepsEn : selectedMethod.stepsId).map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-400">
                    <Sparkles className="w-5 h-5" />
                    {t('Pro Tips', 'Tips Pro')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(language === 'en' ? selectedMethod.tipsEn : selectedMethod.tipsId).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span className="text-yellow-100/80">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monetizationMethods.map((method) => {
                const Icon = method.icon;
                const diffBadge = getDifficultyBadge(method.difficulty);
                return (
                  <Card 
                    key={method.id}
                    className="bg-gray-900/50 border-gray-800 hover:border-gray-600 cursor-pointer transition-all"
                    onClick={() => setSelectedMethod(method)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${method.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {language === 'en' ? method.titleEn : method.titleId}
                            </h3>
                            <Badge className={diffBadge.color}>{diffBadge.label}</Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {language === 'en' ? method.descriptionEn : method.descriptionId}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-green-400">
                            <DollarSign className="w-3 h-3" />
                            {language === 'en' ? method.potentialEarningEn : method.potentialEarningId}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="mt-6 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                {t('Income Potential by Follower Count', 'Potensi Penghasilan per Jumlah Follower')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2">{t('Followers', 'Followers')}</th>
                      <th className="text-left py-3 px-2">{t('Creator Fund', 'Creator Fund')}</th>
                      <th className="text-left py-3 px-2">{t('LIVE Gifts', 'LIVE Gifts')}</th>
                      <th className="text-left py-3 px-2">{t('Affiliate', 'Afiliasi')}</th>
                      <th className="text-left py-3 px-2">{t('Brand Deals', 'Brand Deals')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeCalculatorStages.map((stage, i) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-2 font-medium text-cyan-400">{stage.followers}</td>
                        <td className="py-3 px-2 text-gray-400">{stage.creatorFund}</td>
                        <td className="py-3 px-2 text-pink-400">{stage.liveGifts}</td>
                        <td className="py-3 px-2 text-orange-400">{stage.affiliate}</td>
                        <td className="py-3 px-2 text-blue-400">{stage.brandDeals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {t('* Estimates based on average creator earnings. Actual income varies by niche, engagement, and content quality.',
                   '* Estimasi berdasarkan rata-rata penghasilan creator. Penghasilan aktual bervariasi per niche, engagement, dan kualitas konten.')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-200">
                    {t('Diversification is Key', 'Diversifikasi adalah Kunci')}
                  </p>
                  <p className="text-sm text-green-300/70 mt-1">
                    {t(
                      'Top creators never rely on single income source. Combine 2-3 monetization methods for stable and growing income.',
                      'Creator top tidak pernah bergantung pada satu sumber pendapatan. Kombinasikan 2-3 metode monetisasi untuk pendapatan yang stabil dan berkembang.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
