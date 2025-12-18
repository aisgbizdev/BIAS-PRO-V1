import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSession } from '@/lib/sessionContext';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Video, User, AlertCircle, MessageSquare } from 'lucide-react';
import { AnalysisDiscussion } from './AnalysisDiscussion';
import { SiTiktok, SiInstagram, SiYoutube } from 'react-icons/si';
import type { TikTokAccountAnalysis, TikTokVideoAnalysis, Session } from '@shared/schema';

type Platform = 'tiktok' | 'instagram' | 'youtube';

export function SocialMediaPro() {
  const { session, updateSession, setHasAnalysis } = useSession();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok');
  const [urlInput, setUrlInput] = useState('');
  const [platformWarning, setPlatformWarning] = useState('');
  const [accountAnalysis, setAccountAnalysis] = useState<TikTokAccountAnalysis | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<TikTokVideoAnalysis | null>(null);

  // Account form state
  const [accountData, setAccountData] = useState({
    username: '',
    followers: 0,
    following: 0,
    totalLikes: 0,
    videoCount: 0,
    avgViews: 0,
    avgEngagementRate: 0,
    bio: '',
    verified: false,
  });

  // Video form state
  const [videoData, setVideoData] = useState({
    videoId: '',
    description: '',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    duration: 0,
    hashtags: [] as string[],
    sounds: '',
  });

  // Auto-detect platform from URL
  const detectPlatform = (url: string): Platform | null => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('tiktok.com')) return 'tiktok';
    if (lowerUrl.includes('instagram.com')) return 'instagram';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
    return null;
  };

  // Handle URL input change
  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    const detected = detectPlatform(value);
    
    if (detected && detected !== selectedPlatform) {
      const platformNames = {
        tiktok: 'TikTok',
        instagram: 'Instagram',
        youtube: 'YouTube',
      };
      setPlatformWarning(
        t(
          `${platformNames[detected]} URL detected. Switch to ${platformNames[detected]} tab?`,
          `URL ${platformNames[detected]} terdeteksi. Pindah ke tab ${platformNames[detected]}?`
        )
      );
    } else {
      setPlatformWarning('');
    }
  };

  // Platform config
  const platforms = {
    tiktok: {
      name: 'TikTok',
      icon: SiTiktok,
      color: 'text-[#FE2C55]',
      bgColor: 'bg-[#FE2C55]/10',
      placeholder: '@username atau https://www.tiktok.com/@username',
    },
    instagram: {
      name: 'Instagram',
      icon: SiInstagram,
      color: 'text-[#E4405F]',
      bgColor: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      placeholder: '@username atau https://instagram.com/username',
    },
    youtube: {
      name: 'YouTube',
      icon: SiYoutube,
      color: 'text-[#FF0000]',
      bgColor: 'bg-[#FF0000]/10',
      placeholder: '@channel atau https://youtube.com/@channel',
    },
  };

  const handleAccountAnalysis = async () => {
    if (!session) return;
    
    // Cek apakah ada username di URL input ATAU di manual input
    const finalUsername = urlInput.trim() || accountData.username.trim();
    
    if (!finalUsername) {
      toast({
        title: t('Missing username', 'Username kosong'),
        description: t('Please enter a username', 'Silakan masukkan username'),
        variant: 'destructive',
      });
      return;
    }
    
    // Auto-populate accountData.username dari urlInput kalau kosong
    const dataToSend = {
      ...accountData,
      username: finalUsername,
    };

    setLoading(true);
    try {
      const res = await apiRequest('POST', '/api/tiktok/profile', {
        sessionId: session.sessionId,
        ...dataToSend,
      });
      const response: { analysis: TikTokAccountAnalysis; session: Session } = await res.json();

      setAccountAnalysis(response.analysis);
      updateSession(response.session);
      setHasAnalysis(true);
      
      toast({
        title: t('Analysis Complete!', 'Analisis Selesai!'),
        description: t(
          `Account analyzed successfully. Overall Score: ${response.analysis.overallScore}/10`,
          `Akun berhasil dianalisis. Skor Total: ${response.analysis.overallScore}/10`
        ),
      });
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoAnalysis = async () => {
    if (!session) return;
    if (!videoData.videoId) {
      toast({
        title: t('Missing video ID', 'Video ID kosong'),
        description: t('Please enter a video ID', 'Silakan masukkan video ID'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('POST', '/api/tiktok/video', {
        sessionId: session.sessionId,
        ...videoData,
      });
      const response: { analysis: TikTokVideoAnalysis; session: Session } = await res.json();

      setVideoAnalysis(response.analysis);
      updateSession(response.session);
      setHasAnalysis(true);
      
      toast({
        title: t('Analysis Complete!', 'Analisis Selesai!'),
        description: t(
          `Video analyzed successfully. Viral Potential: ${response.analysis.viralPotential}%`,
          `Video berhasil dianalisis. Potensi Viral: ${response.analysis.viralPotential}%`
        ),
      });
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze video',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const PlatformIcon = platforms[selectedPlatform].icon;

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <PlatformIcon className={`w-10 h-10 ${platforms[selectedPlatform].color}`} />
          <h1 className="text-4xl font-bold tracking-tight">
            {t('Social Media Pro', 'Social Media Pro')}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t(
            'Deep dive analytics for social media creators and influencers',
            'Analitik mendalam untuk kreator dan influencer media sosial'
          )}
        </p>

        {/* Function Card */}
        <Card className="max-w-4xl mx-auto border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('What is Social Media Pro?', 'Apa itu Social Media Pro?')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              {t(
                'Social Media Pro analyzes your TikTok, Instagram, and YouTube accounts using the BIAS 8-layer behavioral intelligence framework.',
                'Social Media Pro menganalisis akun TikTok, Instagram, dan YouTube kamu menggunakan framework BIAS 8-layer behavioral intelligence.'
              )}
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-lg bg-[#FE2C55]/10">
                <SiTiktok className="w-8 h-8 mx-auto mb-2 text-[#FE2C55]" />
                <p className="text-xs font-medium">
                  {t('TikTok Analysis', 'Analisis TikTok')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('Viral potential & engagement', 'Potensi viral & engagement')}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[#E4405F]/10">
                <SiInstagram className="w-8 h-8 mx-auto mb-2 text-[#E4405F]" />
                <p className="text-xs font-medium">
                  {t('Instagram Analysis', 'Analisis Instagram')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('Reels & story performance', 'Performa reels & story')}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[#FF0000]/10">
                <SiYoutube className="w-8 h-8 mx-auto mb-2 text-[#FF0000]" />
                <p className="text-xs font-medium">
                  {t('YouTube Analysis', 'Analisis YouTube')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('Shorts & retention metrics', 'Metrik shorts & retention')}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-center text-muted-foreground">
                {t(
                  '✓ Account behavioral scoring  ✓ Content strategy insights  ✓ Growth recommendations',
                  '✓ Skor perilaku akun  ✓ Wawasan strategi konten  ✓ Rekomendasi pertumbuhan'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Tabs - BIG & CLEAR! */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {(Object.keys(platforms) as Platform[]).map((platform) => {
          const config = platforms[platform];
          const Icon = config.icon;
          return (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? 'default' : 'outline'}
              size="lg"
              onClick={() => {
                setSelectedPlatform(platform);
                setPlatformWarning('');
              }}
              className="gap-2 min-w-[140px]"
              data-testid={`button-platform-${platform}`}
            >
              <Icon className="w-5 h-5" />
              {config.name}
            </Button>
          );
        })}
      </div>

      {/* Platform Warning */}
      {platformWarning && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{platformWarning}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Type Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="account" className="gap-2" data-testid="tab-account">
            <User className="w-4 h-4" />
            {t('Account Analysis', 'Analisis Akun')}
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2" data-testid="tab-video">
            <Video className="w-4 h-4" />
            {t('Video Analysis', 'Analisis Video')}
          </TabsTrigger>
        </TabsList>

        {/* Account Analyzer */}
        <TabsContent value="account" className="space-y-6">
          <Card className={selectedPlatform === 'instagram' ? 'border-2 border-[#E4405F]' : selectedPlatform === 'youtube' ? 'border-2 border-[#FF0000]' : 'border-2 border-[#FE2C55]'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlatformIcon className={`w-5 h-5 ${platforms[selectedPlatform].color}`} />
                {t(`${platforms[selectedPlatform].name} Account Analyzer`, `Analisis Akun ${platforms[selectedPlatform].name}`)}
              </CardTitle>
              <CardDescription>
                {t(
                  `Paste ${platforms[selectedPlatform].name} URL or enter metrics manually`,
                  `Paste URL ${platforms[selectedPlatform].name} atau masukkan data manual`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAccountAnalysis(); }}>
              {/* URL Quick Input */}
              <div className="space-y-2">
                <Label htmlFor="url-input" className="flex items-center gap-2">
                  <PlatformIcon className="w-4 h-4" />
                  {t('Paste URL or Username', 'Paste URL atau Username')}
                </Label>
                <Input
                  id="url-input"
                  placeholder={platforms[selectedPlatform].placeholder}
                  value={urlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="text-lg"
                  data-testid="input-url"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('Or enter manually', 'Atau masukkan manual')}
                  </span>
                </div>
              </div>

              {/* Manual Input Form - Same as before */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="@username"
                    value={accountData.username}
                    onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                    data-testid="input-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followers">{t('Followers', 'Followers')}</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={accountData.followers}
                    onChange={(e) => setAccountData({ ...accountData, followers: parseInt(e.target.value) || 0 })}
                    data-testid="input-followers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="following">{t('Following', 'Following')}</Label>
                  <Input
                    id="following"
                    type="number"
                    value={accountData.following}
                    onChange={(e) => setAccountData({ ...accountData, following: parseInt(e.target.value) || 0 })}
                    data-testid="input-following"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalLikes">{t('Total Likes', 'Total Likes')}</Label>
                  <Input
                    id="totalLikes"
                    type="number"
                    value={accountData.totalLikes}
                    onChange={(e) => setAccountData({ ...accountData, totalLikes: parseInt(e.target.value) || 0 })}
                    data-testid="input-total-likes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoCount">{t('Video/Post Count', 'Jumlah Video/Post')}</Label>
                  <Input
                    id="videoCount"
                    type="number"
                    value={accountData.videoCount}
                    onChange={(e) => setAccountData({ ...accountData, videoCount: parseInt(e.target.value) || 0 })}
                    data-testid="input-video-count"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avgViews">{t('Avg Views', 'Rata-rata Views')}</Label>
                  <Input
                    id="avgViews"
                    type="number"
                    value={accountData.avgViews}
                    onChange={(e) => setAccountData({ ...accountData, avgViews: parseInt(e.target.value) || 0 })}
                    data-testid="input-avg-views"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="avgEngagement">{t('Avg Engagement Rate (%)', 'Engagement Rate Rata-rata (%)')}</Label>
                  <Input
                    id="avgEngagement"
                    type="number"
                    step="0.01"
                    value={accountData.avgEngagementRate}
                    onChange={(e) => setAccountData({ ...accountData, avgEngagementRate: parseFloat(e.target.value) || 0 })}
                    data-testid="input-avg-engagement"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Input
                    id="bio"
                    placeholder="Account bio..."
                    value={accountData.bio}
                    onChange={(e) => setAccountData({ ...accountData, bio: e.target.value })}
                    data-testid="input-bio"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading || !session}
                className="w-full"
                size="lg"
                data-testid="button-analyze-account"
              >
                {loading ? t('Analyzing...', 'Menganalisis...') : t('Analyze Account (FREE)', 'Analisis Akun (GRATIS)')}
              </Button>
              </form>

              {/* Results - Same as TikTokPro */}
              {accountAnalysis && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {t('Analysis Results', 'Hasil Analisis')}
                    </h3>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {accountAnalysis.overallScore}/10
                    </Badge>
                  </div>

                  {/* BIAS Layers */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(accountAnalysis.biasLayers).map(([layer, data]) => (
                      <Card key={layer}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{layer}</CardTitle>
                            <Badge variant={data.score >= 7 ? 'default' : data.score >= 4 ? 'secondary' : 'destructive'}>
                              {data.score}/10
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground">{data.insight}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-4">
                    {accountAnalysis.strengths.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-green-600 dark:text-green-400">
                            {t('Strengths', 'Kekuatan')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            {accountAnalysis.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400">✓</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    
                    {accountAnalysis.weaknesses.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-orange-600 dark:text-orange-400">
                            {t('Weaknesses', 'Kelemahan')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            {accountAnalysis.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-orange-600 dark:text-orange-400">!</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Recommendations */}
                  {accountAnalysis.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {t('Recommendations', 'Rekomendasi')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          {accountAnalysis.recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">→</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Discussion Chat */}
                  <Card className="border-pink-500/20 mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="w-5 h-5 text-pink-500" />
                        {t('Discuss Your Results', 'Diskusikan Hasilmu')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnalysisDiscussion
                        analysisType="account"
                        analysisContext={`TikTok Account Analysis for @${accountData.username || 'user'}:
- Overall Score: ${accountAnalysis.overallScore}/10
- Followers: ${accountData.followers?.toLocaleString() || 'N/A'}
- Total Likes: ${accountData.totalLikes?.toLocaleString() || 'N/A'}
- Videos: ${accountData.videoCount || 'N/A'}
- Engagement Rate: ${accountData.avgEngagementRate || 'N/A'}%

BIAS Layers:
${Object.entries(accountAnalysis.biasLayers).map(([layer, data]) => `- ${layer}: ${data.score}/10 - ${data.insight}`).join('\n')}

Strengths: ${accountAnalysis.strengths.join(', ')}
Weaknesses: ${accountAnalysis.weaknesses.join(', ')}
Recommendations: ${accountAnalysis.recommendations.join(', ')}`}
                        mode="tiktok"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Analyzer - Similar structure */}
        <TabsContent value="video" className="space-y-6">
          <Card className={selectedPlatform === 'instagram' ? 'border-2 border-[#E4405F]' : selectedPlatform === 'youtube' ? 'border-2 border-[#FF0000]' : 'border-2 border-[#FE2C55]'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlatformIcon className={`w-5 h-5 ${platforms[selectedPlatform].color}`} />
                {t(`${platforms[selectedPlatform].name} Video Analyzer`, `Analisis Video ${platforms[selectedPlatform].name}`)}
              </CardTitle>
              <CardDescription>
                {t(
                  'Analyze video performance and viral potential (FREE)',
                  'Analisis performa video dan potensi viral (GRATIS)'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                {t(
                  'Video analyzer coming soon for all platforms!',
                  'Video analyzer segera hadir untuk semua platform!'
                )}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
