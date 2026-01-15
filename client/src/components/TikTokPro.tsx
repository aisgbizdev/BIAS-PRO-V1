import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { useSession } from '@/lib/sessionContext';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Video, User, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import type { TikTokAccountAnalysis, TikTokVideoAnalysis, Session } from '@shared/schema';

export function TikTokPro() {
  const { session, updateSession } = useSession();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    transcription: '',
  });

  const handleAccountAnalysis = async () => {
    if (!session) return;
    if (!accountData.username) {
      toast({
        title: 'Missing username',
        description: 'Please enter a TikTok username',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('POST', '/api/tiktok/profile', {
        sessionId: session.sessionId,
        ...accountData,
      });
      const response: { analysis: TikTokAccountAnalysis; session: Session } = await res.json();

      setAccountAnalysis(response.analysis);
      updateSession(response.session);
      
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
        title: 'Missing video ID',
        description: 'Please enter a video ID',
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

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <div className="flex items-center justify-center gap-3">
          <SiTiktok className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            {t('TikTok Pro Analysis', 'Analisis TikTok Pro')}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t(
            'Analyze TikTok accounts and videos using the 8-layer BIAS framework. Get actionable insights to boost your content strategy.',
            'Analisis akun dan video TikTok menggunakan framework BIAS 8-layer. Dapatkan insight actionable untuk boost strategi konten kamu.'
          )}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="account" className="gap-2" data-testid="tab-account">
            <User className="w-4 h-4" />
            {t('Account', 'Akun')}
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2" data-testid="tab-video">
            <Video className="w-4 h-4" />
            {t('Video', 'Video')}
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2" data-testid="tab-compare">
            <BarChart3 className="w-4 h-4" />
            {t('Compare', 'Bandingkan')}
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2" data-testid="tab-trends">
            <TrendingUp className="w-4 h-4" />
            {t('Insights', 'Insight')}
          </TabsTrigger>
        </TabsList>

        {/* Account Analyzer */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('TikTok Account Analyzer', 'Analisis Akun TikTok')}
              </CardTitle>
              <CardDescription>
                {t(
                  'Enter account metrics to get behavioral intelligence analysis. Cost: 3 tokens',
                  'Masukkan data akun untuk analisis behavioral intelligence. Biaya: 3 token'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAccountAnalysis(); }}>
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
                  <Label htmlFor="videoCount">{t('Video Count', 'Jumlah Video')}</Label>
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
                data-testid="button-analyze-account"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('Analyzing...', 'Menganalisis...')}
                  </span>
                ) : t('Analyze Account (3 tokens)', 'Analisis Akun (3 token)')}
              </Button>
              </form>

              <AnalysisProgress 
                isAnalyzing={loading} 
                duration={6000}
                steps={[
                  t('Fetching profile data...', 'Mengambil data profil...'),
                  t('Analyzing engagement patterns...', 'Menganalisis pola engagement...'),
                  t('Applying BIAS framework...', 'Menerapkan framework BIAS...'),
                  t('Generating recommendations...', 'Membuat rekomendasi...'),
                  t('Finalizing results...', 'Finalisasi hasil...'),
                ]}
              />

              {/* Account Results */}
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Analyzer */}
        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                {t('TikTok Video Analyzer', 'Analisis Video TikTok')}
              </CardTitle>
              <CardDescription>
                {t(
                  'Analyze video performance and viral potential. Cost: 4 tokens',
                  'Analisis performa video dan potensi viral. Biaya: 4 token'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleVideoAnalysis(); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="videoId">Video ID / URL</Label>
                  <Input
                    id="videoId"
                    placeholder="video123..."
                    value={videoData.videoId}
                    onChange={(e) => setVideoData({ ...videoData, videoId: e.target.value })}
                    data-testid="input-video-id"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">{t('Description/Caption', 'Deskripsi/Caption')}</Label>
                  <Input
                    id="description"
                    placeholder="Video caption..."
                    value={videoData.description}
                    onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                    data-testid="input-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="views">Views</Label>
                  <Input
                    id="views"
                    type="number"
                    value={videoData.views}
                    onChange={(e) => setVideoData({ ...videoData, views: parseInt(e.target.value) || 0 })}
                    data-testid="input-views"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="likes">Likes</Label>
                  <Input
                    id="likes"
                    type="number"
                    value={videoData.likes}
                    onChange={(e) => setVideoData({ ...videoData, likes: parseInt(e.target.value) || 0 })}
                    data-testid="input-likes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Input
                    id="comments"
                    type="number"
                    value={videoData.comments}
                    onChange={(e) => setVideoData({ ...videoData, comments: parseInt(e.target.value) || 0 })}
                    data-testid="input-comments"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shares">Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    value={videoData.shares}
                    onChange={(e) => setVideoData({ ...videoData, shares: parseInt(e.target.value) || 0 })}
                    data-testid="input-shares"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">{t('Duration (seconds)', 'Durasi (detik)')}</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={videoData.duration}
                    onChange={(e) => setVideoData({ ...videoData, duration: parseInt(e.target.value) || 0 })}
                    data-testid="input-duration"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hashtags">{t('Hashtags (comma-separated)', 'Hashtags (pisah dengan koma)')}</Label>
                  <Input
                    id="hashtags"
                    placeholder="#fyp, #viral, #trending"
                    onChange={(e) => setVideoData({ ...videoData, hashtags: e.target.value.split(',').map(h => h.trim()) })}
                    data-testid="input-hashtags"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading || !session}
                className="w-full"
                data-testid="button-analyze-video"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('Analyzing...', 'Menganalisis...')}
                  </span>
                ) : t('Analyze Video (4 tokens)', 'Analisis Video (4 token)')}
              </Button>
              </form>

              <AnalysisProgress 
                isAnalyzing={loading} 
                duration={8000}
                steps={[
                  t('Processing video data...', 'Memproses data video...'),
                  t('Analyzing engagement metrics...', 'Menganalisis metrik engagement...'),
                  t('Evaluating content quality...', 'Mengevaluasi kualitas konten...'),
                  t('Checking viral potential...', 'Memeriksa potensi viral...'),
                  t('Generating recommendations...', 'Membuat rekomendasi...'),
                  t('Finalizing results...', 'Finalisasi hasil...'),
                ]}
              />

              {/* Video Results */}
              {videoAnalysis && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {t('Analysis Results', 'Hasil Analisis')}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {videoAnalysis.overallScore}/10
                      </Badge>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {t(`${videoAnalysis.viralPotential}% Viral`, `${videoAnalysis.viralPotential}% Viral`)}
                      </Badge>
                    </div>
                  </div>

                  {/* BIAS Layers */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(videoAnalysis.biasLayers).map(([layer, data]) => (
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

                  {/* Hooks Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t('Hook Analysis', 'Analisis Hook')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(videoAnalysis.hooks).map(([hookType, data]) => (
                        <div key={hookType} className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize">{hookType}</p>
                            <p className="text-xs text-muted-foreground">{data.feedback}</p>
                          </div>
                          <Badge variant={data.score >= 7 ? 'default' : 'secondary'}>
                            {data.score}/10
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  {videoAnalysis.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {t('Recommendations', 'Rekomendasi')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          {videoAnalysis.recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">→</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compare (placeholder) */}
        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>{t('Compare Accounts & Videos', 'Bandingkan Akun & Video')}</CardTitle>
              <CardDescription>
                {t('Coming soon: Compare multiple accounts or videos side-by-side', 'Segera hadir: Bandingkan beberapa akun atau video')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('This feature is under development', 'Fitur ini sedang dikembangkan')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends (placeholder) */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t('TikTok Insights & Trends', 'Insight & Tren TikTok')}</CardTitle>
              <CardDescription>
                {t('Historical analysis and trend insights', 'Analisis historis dan insight tren')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('This feature is under development', 'Fitur ini sedang dikembangkan')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
