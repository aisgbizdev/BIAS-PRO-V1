import { useState, useRef } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, Upload, Loader2, CheckCircle2, AlertCircle, 
  TrendingUp, Users, Eye, Heart, MessageSquare, Share2,
  Clock, Target, Lightbulb, ChevronRight, Image, X
} from 'lucide-react';

interface ScreenshotGuide {
  id: string;
  titleEn: string;
  titleId: string;
  descriptionEn: string;
  descriptionId: string;
  stepsEn: string[];
  stepsId: string[];
  icon: any;
}

interface AnalysisResult {
  metrics: {
    name: string;
    value: string;
    status: 'good' | 'average' | 'needs_work';
    insight: string;
  }[];
  overallScore: number;
  recommendations: string[];
}

const screenshotGuides: ScreenshotGuide[] = [
  {
    id: 'profile',
    titleEn: 'Profile Analytics',
    titleId: 'Analitik Profil',
    descriptionEn: 'Capture your profile overview with followers, views, and engagement',
    descriptionId: 'Capture overview profil dengan followers, views, dan engagement',
    stepsEn: [
      'Open TikTok app and go to your profile',
      'Tap the 3-line menu (☰) in top right',
      'Select "Creator tools" or "Analytics"',
      'Go to "Overview" tab',
      'Take a screenshot showing followers, profile views, video views',
    ],
    stepsId: [
      'Buka aplikasi TikTok dan pergi ke profil',
      'Ketuk menu 3 garis (☰) di kanan atas',
      'Pilih "Creator tools" atau "Analitik"',
      'Pergi ke tab "Overview"',
      'Ambil screenshot yang menunjukkan followers, profile views, video views',
    ],
    icon: Users,
  },
  {
    id: 'content',
    titleEn: 'Content Performance',
    titleId: 'Performa Konten',
    descriptionEn: 'Capture your best and recent video performance',
    descriptionId: 'Capture performa video terbaik dan terbaru',
    stepsEn: [
      'Go to Creator tools > Analytics',
      'Select "Content" tab',
      'Screenshot showing your recent videos with views',
      'Tap on a specific video for detailed stats',
      'Screenshot the detailed view (watch time, traffic source)',
    ],
    stepsId: [
      'Pergi ke Creator tools > Analitik',
      'Pilih tab "Konten"',
      'Screenshot yang menunjukkan video terbaru dengan views',
      'Ketuk video spesifik untuk statistik detail',
      'Screenshot tampilan detail (watch time, sumber traffic)',
    ],
    icon: Eye,
  },
  {
    id: 'followers',
    titleEn: 'Follower Insights',
    titleId: 'Insight Followers',
    descriptionEn: 'Understand who your audience is',
    descriptionId: 'Pahami siapa audiens kamu',
    stepsEn: [
      'Go to Creator tools > Analytics',
      'Select "Followers" tab',
      'Screenshot the demographics (gender, top territories)',
      'Screenshot the "Follower activity" times',
      'These help optimize posting schedule',
    ],
    stepsId: [
      'Pergi ke Creator tools > Analitik',
      'Pilih tab "Followers"',
      'Screenshot demografi (gender, lokasi teratas)',
      'Screenshot waktu "Aktivitas follower"',
      'Ini membantu optimasi jadwal posting',
    ],
    icon: Heart,
  },
  {
    id: 'live',
    titleEn: 'LIVE Analytics',
    titleId: 'Analitik LIVE',
    descriptionEn: 'Track your live streaming performance',
    descriptionId: 'Track performa live streaming',
    stepsEn: [
      'After finishing a LIVE, wait for analytics',
      'Go to LIVE Center in your profile',
      'View "LIVE replay" analytics',
      'Screenshot showing viewers, duration, gifts',
      'Note peak viewer time and engagement moments',
    ],
    stepsId: [
      'Setelah selesai LIVE, tunggu analitik',
      'Pergi ke LIVE Center di profil',
      'Lihat analitik "Replay LIVE"',
      'Screenshot yang menunjukkan viewers, durasi, gifts',
      'Catat waktu viewer puncak dan momen engagement',
    ],
    icon: TrendingUp,
  },
];

export function ScreenshotAnalyticsPanel() {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedGuide, setSelectedGuide] = useState<string>('profile');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const analyzeScreenshot = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: Record<string, AnalysisResult> = {
      profile: {
        metrics: [
          { name: language === 'id' ? 'Followers' : 'Followers', value: 'Detected', status: 'good', insight: language === 'id' ? 'Pertumbuhan stabil' : 'Stable growth' },
          { name: language === 'id' ? 'Engagement Rate' : 'Engagement Rate', value: '~4.2%', status: 'average', insight: language === 'id' ? 'Di atas rata-rata, bisa ditingkatkan' : 'Above average, can improve' },
          { name: language === 'id' ? 'Profile Views' : 'Profile Views', value: 'Growing', status: 'good', insight: language === 'id' ? 'Konten menarik traffic' : 'Content attracting traffic' },
          { name: language === 'id' ? 'Video Views Trend' : 'Video Views Trend', value: 'Upward', status: 'good', insight: language === 'id' ? 'Momentum positif' : 'Positive momentum' },
        ],
        overallScore: 72,
        recommendations: language === 'id' ? [
          'Tingkatkan frekuensi posting ke 1-2x per hari',
          'Fokus pada video yang sudah perform bagus',
          'Buat series content untuk boost retention',
          'Gunakan trending sounds lebih sering',
          'Respond semua komentar dalam 1 jam pertama',
        ] : [
          'Increase posting frequency to 1-2x daily',
          'Focus on video types that already perform well',
          'Create content series to boost retention',
          'Use trending sounds more frequently',
          'Respond to all comments within the first hour',
        ],
      },
      content: {
        metrics: [
          { name: language === 'id' ? 'Avg Watch Time' : 'Avg Watch Time', value: '~65%', status: 'average', insight: language === 'id' ? 'Perlu hook lebih kuat' : 'Need stronger hook' },
          { name: language === 'id' ? 'Top Video' : 'Top Video', value: 'Identified', status: 'good', insight: language === 'id' ? 'Pelajari pola suksesnya' : 'Study its success pattern' },
          { name: language === 'id' ? 'Content Consistency' : 'Content Consistency', value: 'Moderate', status: 'needs_work', insight: language === 'id' ? 'Posting lebih teratur' : 'Post more regularly' },
          { name: language === 'id' ? 'Engagement Pattern' : 'Engagement Pattern', value: 'Varies', status: 'average', insight: language === 'id' ? 'Beberapa video outperform' : 'Some videos outperform' },
        ],
        overallScore: 65,
        recommendations: language === 'id' ? [
          'Buat lebih banyak video seperti top performer-mu',
          'Hook dalam 1 detik pertama sangat penting',
          'Eksperimen dengan durasi video berbeda',
          'Posting di jam audience paling aktif',
          'Gunakan teks overlay untuk accessibility',
        ] : [
          'Create more videos like your top performer',
          'Hook within first 1 second is crucial',
          'Experiment with different video durations',
          'Post during peak audience activity times',
          'Use text overlay for accessibility',
        ],
      },
      followers: {
        metrics: [
          { name: language === 'id' ? 'Demografi Gender' : 'Gender Demographics', value: 'Analyzed', status: 'good', insight: language === 'id' ? 'Pahami audience-mu' : 'Understand your audience' },
          { name: language === 'id' ? 'Lokasi Teratas' : 'Top Locations', value: 'Indonesia', status: 'good', insight: language === 'id' ? 'Cocok untuk konten lokal' : 'Great for local content' },
          { name: language === 'id' ? 'Waktu Aktif' : 'Active Hours', value: 'Identified', status: 'good', insight: language === 'id' ? 'Posting di jam ini' : 'Post during these hours' },
          { name: language === 'id' ? 'Pertumbuhan' : 'Growth Rate', value: 'Steady', status: 'average', insight: language === 'id' ? 'Bisa dipercepat' : 'Can be accelerated' },
        ],
        overallScore: 70,
        recommendations: language === 'id' ? [
          'Sesuaikan konten dengan demografi audience',
          'Posting saat followers paling aktif',
          'Buat konten dalam bahasa audience mayoritas',
          'Engage dengan kreator yang punya audience serupa',
          'Gunakan hashtag lokal yang relevan',
        ] : [
          'Tailor content to your audience demographics',
          'Post when your followers are most active',
          'Create content in your majority audience language',
          'Engage with creators who have similar audiences',
          'Use relevant local hashtags',
        ],
      },
      live: {
        metrics: [
          { name: language === 'id' ? 'Peak Viewers' : 'Peak Viewers', value: 'Tracked', status: 'average', insight: language === 'id' ? 'Bisa ditingkatkan' : 'Can be improved' },
          { name: language === 'id' ? 'Durasi' : 'Duration', value: 'Analyzed', status: 'good', insight: language === 'id' ? 'Durasi optimal' : 'Optimal duration' },
          { name: language === 'id' ? 'Gifts Received' : 'Gifts Received', value: 'Recorded', status: 'average', insight: language === 'id' ? 'Strategi gift bisa lebih baik' : 'Gift strategy can improve' },
          { name: language === 'id' ? 'Engagement' : 'Engagement', value: 'Active', status: 'good', insight: language === 'id' ? 'Interaksi bagus' : 'Good interaction' },
        ],
        overallScore: 68,
        recommendations: language === 'id' ? [
          'Umumkan jadwal live sebelumnya',
          'Buat hook menarik di awal live',
          'Set gift goals untuk encourage participation',
          'Live di waktu followers paling aktif',
          'Siapkan konten backup kalau kehabisan topik',
        ] : [
          'Announce live schedule in advance',
          'Create engaging hook at the start of live',
          'Set gift goals to encourage participation',
          'Go live when followers are most active',
          'Prepare backup content if you run out of topics',
        ],
      },
    };
    
    setAnalysisResult(mockResults[selectedGuide] || mockResults.profile);
    setIsAnalyzing(false);
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'average': return 'text-yellow-400';
      case 'needs_work': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return <Badge className="bg-green-500/20 text-green-400">{t('Good', 'Bagus')}</Badge>;
      case 'average': return <Badge className="bg-yellow-500/20 text-yellow-400">{t('Average', 'Rata-rata')}</Badge>;
      case 'needs_work': return <Badge className="bg-red-500/20 text-red-400">{t('Needs Work', 'Perlu Perbaikan')}</Badge>;
      default: return null;
    }
  };

  const currentGuide = screenshotGuides.find(g => g.id === selectedGuide);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Camera className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {t('Screenshot Analytics', 'Analitik Screenshot')}
          </h2>
        </div>
        <p className="text-gray-400">
          {t('Capture your TikTok analytics and get AI-powered insights', 'Capture analitik TikTok kamu dan dapatkan insight AI')}
        </p>
      </div>

      <Tabs value={selectedGuide} onValueChange={setSelectedGuide}>
        <TabsList className="grid grid-cols-4 bg-gray-800/50">
          {screenshotGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <TabsTrigger
                key={guide.id}
                value={guide.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-cyan-500/20"
              >
                <Icon className="w-4 h-4 mr-1" />
                <span className="hidden md:inline text-xs">
                  {language === 'id' ? guide.titleId : guide.titleEn}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {screenshotGuides.map((guide) => (
          <TabsContent key={guide.id} value={guide.id} className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  {t('How to Capture', 'Cara Capture')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {language === 'id' ? guide.descriptionId : guide.descriptionEn}
                </p>
                <ol className="space-y-2">
                  {(language === 'id' ? guide.stepsId : guide.stepsEn).map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging 
            ? 'border-pink-500 bg-pink-500/10' 
            : uploadedImage 
              ? 'border-green-500/50 bg-green-500/5' 
              : 'border-gray-700 hover:border-gray-600'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img 
                src={uploadedImage} 
                alt="Uploaded screenshot" 
                className="max-h-64 rounded-lg mx-auto"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full"
                onClick={clearUpload}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {!analysisResult && (
              <Button
                onClick={analyzeScreenshot}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('Analyzing...', 'Menganalisis...')}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('Analyze Screenshot', 'Analisis Screenshot')}
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              {t('Drag and drop your screenshot here', 'Drag dan drop screenshot kamu di sini')}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {t('or', 'atau')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="w-4 h-4 mr-2" />
              {t('Select Image', 'Pilih Gambar')}
            </Button>
          </>
        )}
      </div>

      {analysisResult && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  {t('Analysis Complete', 'Analisis Selesai')}
                </CardTitle>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {analysisResult.overallScore}/100
                  </div>
                  <div className="text-xs text-gray-400">{t('Overall Score', 'Skor Keseluruhan')}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {analysisResult.metrics.map((metric, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{metric.name}</span>
                      {getStatusBadge(metric.status)}
                    </div>
                    <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{metric.insight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-cyan-400" />
                {t('Recommendations', 'Rekomendasi')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" onClick={clearUpload}>
              <Camera className="w-4 h-4 mr-2" />
              {t('Analyze Another Screenshot', 'Analisis Screenshot Lain')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
