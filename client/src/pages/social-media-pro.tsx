import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/MetricCard';
import { RadarChart8Layer } from '@/components/RadarChart8Layer';
import { VideoUploadAnalyzer } from '@/components/VideoUploadAnalyzer';
import { CompetitorAnalysis } from '@/components/CompetitorAnalysis';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { AnalysisDiscussion } from '@/components/AnalysisDiscussion';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { incrementVideoUsage, canUseVideoAnalysis } from '@/lib/usageLimit';
import { MessageSquare } from 'lucide-react';
import { Users, Heart, Video, TrendingUp, Eye, Zap, Target, Award, Upload, Loader2, AlertCircle, CheckCircle2, GraduationCap, BookOpen, Lightbulb, Sparkles, Radio, FileText, DollarSign, Image, Camera, PlayCircle, Rocket, Bot, BarChart2, BarChart3, Wand2 } from 'lucide-react';
import { IntegrityNotice } from '@/components/ui/IntegrityNotice';
import { SiTiktok } from 'react-icons/si';
import type { BiasAnalysisResult } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { trackFeatureUsage, trackTabSelection, trackButtonClick } from '@/lib/analytics';
import { saveAnalysisToHistory } from '@/lib/analysisHistory';
import { ExpertKnowledgePanel, HookMasterPanel, GrowthRoadmapPanel, ScriptGeneratorPanel, LiveCoachPanel, StorytellingPanel, VideoAnalyzerPanel, MonetizationGuidePanel, VideoCreatorWizard, LiveStreamingWizard, ScreenshotAnalyticsPanel, InteractiveCreatorHub, MotivationalQuote } from '@/components/expert';
import { BatchAnalysis } from '@/components/expert/BatchAnalysis';
import { ABHookTester } from '@/components/expert/ABHookTester';

// Import cartoon illustrations
import illustrationEngagement from '@assets/stock_images/cartoon_person_shout_fb92982f.jpg';
import illustrationGrowth from '@assets/stock_images/cartoon_rocket_launc_f4842487.jpg';
import illustrationContent from '@assets/stock_images/cartoon_video_camera_c0259bfd.jpg';
import illustrationMoney from '@assets/stock_images/cartoon_money_bag_co_6c354926.jpg';
import illustrationAudience from '@assets/stock_images/cartoon_group_people_b64a8e7c.jpg';
import illustrationSchedule from '@assets/stock_images/cartoon_clock_calend_b3f6ced4.jpg';

const CHATGPTS_URL =
  'https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-adaptive-behavioral-ai-for-creators-marketers';

// Utility: Extract metric value (supports both old number format and new {raw, approx} format)
function getMetricValue(metric: any): number {
  if (typeof metric === 'number') return metric;
  if (metric && typeof metric === 'object' && 'approx' in metric) return metric.approx;
  return 0;
}

// Utility: Format large numbers (2.5B, 161M, 1.2K)
function formatMetric(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function SocialMediaPro() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [platform, setPlatform] = useState<'tiktok'>('tiktok');
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'account' | 'video'>('account');
  const [accountData, setAccountData] = useState<any>(null);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const [mainMode, setMainMode] = useState<'mentor' | 'analytics'>('analytics');
  const [analyticsTab, setAnalyticsTab] = useState<'account' | 'video' | 'screenshot' | 'compare' | 'batch' | 'hooks'>('account');
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysisResult | null>(null);

  const handleTikTokAnalysisComplete = useCallback((result: BiasAnalysisResult) => {
    setCurrentAnalysis(result);
    saveAnalysisToHistory(result, 'tiktok', 'video', 'TikTok Video Analysis');
  }, []);

  const platformConfig = {
    tiktok: {
      icon: SiTiktok,
      color: '#FF0050',
      name: 'TikTok',
      placeholder: '@username',
    },
  };

  const config = platformConfig[platform];
  const PlatformIcon = config.icon;

  const handleAnalyzeAccount = async () => {
    if (!username.trim()) return;
    
    if (!canUseVideoAnalysis()) {
      toast({
        variant: 'destructive',
        title: t('Daily Limit Reached', 'Batas Harian Tercapai'),
        description: t('Upgrade to Pro for unlimited analysis', 'Upgrade ke Pro untuk analisis unlimited'),
      });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform, 
          username: username.trim().replace('@', '')
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Use error message from backend (already in user-friendly language)
        const errorMessage = data.messageId || data.message || 
          t(
            `Sorry, we couldn't analyze this account. Possible reasons: (1) Account is private or not found, (2) Platform is having issues, or (3) Incorrect username. Please try a different public account.`,
            `Maaf, tidak bisa menganalisis akun ini. Kemungkinan: (1) Akun private atau tidak ditemukan, (2) Platform sedang bermasalah, atau (3) Username salah. Silakan coba akun publik lain.`
          );
        throw new Error(errorMessage);
      }
      
      // Store account data for display
      setAccountData(data);
      setPhotoLoadError(false); // Reset photo error state on new analysis
      
      // Save to history with 'account' category
      const engagementScore = data.metrics?.engagementRate >= 8 ? 9 : data.metrics?.engagementRate >= 4 ? 7 : data.metrics?.engagementRate >= 2 ? 5 : 3;
      const accountResult = {
        overallScore: engagementScore,
        summary: `@${username}: ${formatMetric(getMetricValue(data.metrics?.followers))} followers, ${formatMetric(getMetricValue(data.metrics?.videos))} videos, ${data.metrics?.engagementRate?.toFixed(1) || '0'}% engagement`,
        summaryId: `account_${username}_${Date.now()}`,
        mode: 'creator' as const,
        layers: [],
        biasBreakdown: [],
        strengths: [`${formatMetric(getMetricValue(data.metrics?.followers))} followers`, `${formatMetric(getMetricValue(data.metrics?.videos))} videos`],
        improvements: [],
        recommendations: [],
        recommendationsId: [],
        actionPlan: [],
      };
      saveAnalysisToHistory(accountResult, 'tiktok', 'url', `@${username} - ${formatMetric(getMetricValue(data.metrics?.followers))} followers`, 'account', data);
      
      // Track usage and analytics
      incrementVideoUsage();
      trackFeatureUsage('analysis', platform, { type: 'account', username });
      
      toast({
        title: t('Analysis Complete!', 'Analisis Selesai!'),
        description: t(`Account @${username} analyzed successfully`, `Akun @${username} berhasil dianalisis`),
      });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('account-profile')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      // Network error or JSON parse error - provide simple explanation
      let errorMsg = err.message;
      
      if (err.message?.includes('JSON') || err.message?.includes('DOCTYPE')) {
        errorMsg = t(
          'Connection error. Please check your internet and try again.',
          'Koneksi error. Silakan cek internet Anda dan coba lagi.'
        );
      } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
        errorMsg = t(
          'Network error. Please try again in a moment.',
          'Gangguan jaringan. Silakan coba lagi sebentar.'
        );
      } else if (!errorMsg) {
        errorMsg = t(
          'Unable to analyze account. The account may be private, not found, or having platform issues. Please try a different public account.',
          'Tidak dapat menganalisis akun. Akun mungkin private, tidak ditemukan, atau ada masalah platform. Silakan coba akun publik lain.'
        );
      }
      
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: t('Analysis Failed', 'Analisis Gagal'),
        description: errorMsg,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      {/* Hero Section - Minimal & Clean */}
      <div className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              {t('TikTok Pro', 'TikTok Pro')}
            </h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl">
            {t(
              'Behavioral analysis for TikTok creators with science-backed insights.',
              'Analisis behavioral untuk kreator TikTok dengan insight berbasis sains.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <IntegrityNotice />
        
                {/* Main Mode Selector - Minimal */}
                <div className="flex justify-center">
                  <div className="inline-flex bg-[#141414] rounded-lg p-0.5 border border-gray-800 w-full max-w-md">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMainMode('analytics');
                        trackTabSelection('tiktok-pro', 'analytics');
              }}
              className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${mainMode === 'analytics' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <TrendingUp className="w-4 h-4 mr-1.5" />
              {t('Analytics', 'Analitik')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMainMode('mentor');
                trackTabSelection('tiktok-pro', 'mentor');
              }}
              className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${mainMode === 'mentor' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                      <Bot className="w-4 h-4 mr-1.5" />
                      {t('Ai Coach', 'Ai Coach')}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        trackButtonClick('Ai ChatGPTs', 'tiktok-pro');
                        window.open(CHATGPTS_URL, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 px-4 py-2 text-sm rounded-md transition-colors text-gray-400 hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      {t('Ai ChatGPTs', 'Ai ChatGPTs')}
                    </Button>
                  </div>
                </div>

        {/* MENTOR HUB - Ai Chat */}
        {mainMode === 'mentor' && (
          <InteractiveCreatorHub mode="tiktok" />
        )}

        {/* ANALYTICS LAB - Consolidated analytics */}
        {mainMode === 'analytics' && (
          <div className="space-y-4">
        {/* Analytics Tab Selector - Clean & Minimal */}
        <Tabs value={analyticsTab} onValueChange={(v) => {
          const newTab = v as typeof analyticsTab;
          setAnalyticsTab(newTab);
          trackTabSelection('tiktok-pro', newTab);
        }}>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
            <TabsList className="inline-flex sm:grid sm:w-full sm:grid-cols-6 bg-[#141414] border border-gray-800 p-0.5 rounded-lg gap-1 min-w-max sm:min-w-0">
              <TabsTrigger 
                value="account"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('Akun', 'Akun')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="video"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('Video', 'Video')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="batch"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <BarChart3 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('Batch', 'Batch')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="hooks"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('A/B', 'A/B')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="screenshot"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <Camera className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('SS', 'SS')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="compare"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs px-3 py-1.5 rounded-md gap-1.5 whitespace-nowrap"
              >
                <BarChart2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t('VS', 'VS')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Account Analysis Mode */}
        {analyticsTab === 'account' && (
          <Card className="bg-[#141414] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="w-5 h-5 text-pink-500 flex-shrink-0" />
                {t('Account Analytics', 'Analytics Akun')}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {t('Enter username to get deep metrics insights, growth strategies, and actionable recommendations', 'Masukkan username untuk insight metrik mendalam, strategi growth, dan rekomendasi actionable')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {/* Username Input */}
            <div className="space-y-3">
              <Label htmlFor="username" className="text-white">
                TikTok {t('Username', 'Username')} <span className="text-pink-500">*</span>
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <SiTiktok 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500"
                  />
                  <Input
                    id="username"
                    placeholder="@username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && username.trim() && !isAnalyzing) {
                        handleAnalyzeAccount();
                      }
                    }}
                    className="pl-12 bg-[#1E1E1E] border-gray-700 focus:border-pink-500 text-white"
                    data-testid="input-username"
                  />
                </div>
                <Button
                  onClick={handleAnalyzeAccount}
                  disabled={!username || isAnalyzing}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 px-8 w-full sm:w-auto"
                  data-testid="button-analyze-account"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('Analyzing...', 'Menganalisis...')}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {t('Analyze', 'Analisis')}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <AnalysisProgress 
              isAnalyzing={isAnalyzing} 
              duration={8000}
              steps={[
                t('Fetching account data...', 'Mengambil data akun...'),
                t('Analyzing profile metrics...', 'Menganalisis metrik profil...'),
                t('Applying BIAS framework...', 'Menerapkan framework BIAS...'),
                t('Calculating engagement rate...', 'Menghitung engagement rate...'),
                t('Generating recommendations...', 'Membuat rekomendasi...'),
                t('Finalizing results...', 'Finalisasi hasil...'),
              ]}
            />
              
            {/* Error Message */}
            {error && (
              <div className="p-5 bg-red-500/10 border-2 border-red-500/50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-500 font-bold text-lg">{t('Cannot Analyze This Account', 'Tidak Dapat Menganalisis Akun Ini')}</p>
                    <p className="text-red-300 text-sm mt-2 leading-relaxed">{error}</p>
                    <div className="mt-4 p-3 bg-red-500/5 rounded border border-red-500/20">
                      <p className="text-red-200 text-sm font-medium">
                        💡 {t('Suggestion:', 'Saran:')} {t('Try analyzing a different public account or check if the username is correct', 'Coba analisis akun publik lain atau periksa apakah username benar')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Video Upload & Compare Mode */}
        {analyticsTab === 'video' && (
          <VideoUploadAnalyzer mode="creator" />
        )}

        {/* Screenshot Analytics Mode */}
        {analyticsTab === 'screenshot' && (
          <ScreenshotAnalyticsPanel />
        )}

        {/* Competitor Comparison Mode */}
        {analyticsTab === 'compare' && (
          <CompetitorAnalysis />
        )}

        {/* Batch Analysis Mode */}
        {analyticsTab === 'batch' && (
          <BatchAnalysis />
        )}

        {/* A/B Hook Tester Mode */}
        {analyticsTab === 'hooks' && (
          <ABHookTester />
        )}

        {/* Account Profile Card - Show after analysis */}
        {analyticsTab === 'account' && accountData && (accountData.dataUnavailable || (getMetricValue(accountData.metrics?.followers) === 0 && getMetricValue(accountData.metrics?.videos) === 0 && getMetricValue(accountData.metrics?.likes) === 0)) && (
          <Card className="bg-[#141414] border-red-500/50" id="account-data-warning">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-red-400">
                    {t('Data Could Not Be Retrieved', 'Data Tidak Berhasil Diambil')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {t(
                      `We couldn't retrieve data for @${accountData.username}. This may happen because: (1) The account is private, (2) The account doesn't exist, (3) TikTok is temporarily blocking data access, or (4) The account is brand new with no activity yet.`,
                      `Data untuk @${accountData.username} tidak berhasil diambil. Ini bisa terjadi karena: (1) Akun di-private, (2) Akun tidak ditemukan, (3) TikTok sedang memblokir akses data sementara, atau (4) Akun masih baru dan belum ada aktivitas.`
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {t('Try again later', 'Coba lagi nanti')}
                    </Badge>
                    <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                      {t('Check username spelling', 'Cek ejaan username')}
                    </Badge>
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                      {t('Must be public account', 'Harus akun publik')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsTab === 'account' && accountData && (
          <Card className="bg-[#141414] border-gray-800" id="account-profile">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture & Basic Info */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 p-1">
                      {accountData.profilePhotoUrl && !photoLoadError ? (
                        <img 
                          src={accountData.profilePhotoUrl} 
                          alt={`@${accountData.username}`}
                          className="w-full h-full rounded-full object-cover bg-[#1E1E1E]"
                          onError={() => setPhotoLoadError(true)}
                          data-testid="img-profile-photo"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#1E1E1E] flex items-center justify-center text-4xl font-bold text-white" data-testid="text-profile-initial">
                          {accountData.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-cyan-400 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-[#0A0A0A]" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-white" data-testid="text-username">@{accountData.username}</h3>
                    <p className="text-gray-400 text-sm capitalize" data-testid="text-platform">{accountData.platform}</p>
                  </div>
                </div>

                {/* Account Stats & Bio */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-400" data-testid="text-followers">{formatMetric(getMetricValue(accountData.metrics?.followers))}</p>
                      <p className="text-gray-400 text-sm">{t('Followers', 'Followers')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400" data-testid="text-videos">{formatMetric(getMetricValue(accountData.metrics?.videos))}</p>
                      <p className="text-gray-400 text-sm">{t('Videos', 'Video')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400" data-testid="text-likes">{formatMetric(getMetricValue(accountData.metrics?.likes))}</p>
                      <p className="text-gray-400 text-sm">{t('Likes', 'Likes')}</p>
                    </div>
                  </div>
                  
                  {accountData.bio && (
                    <div className="p-4 bg-[#1E1E1E] rounded-2xl border border-gray-700">
                      <p className="text-gray-300 text-sm leading-relaxed" data-testid="text-bio">
                        {accountData.bio}
                      </p>
                    </div>
                  )}
                  
                  {!accountData.bio && (
                    <div className="p-4 bg-[#1E1E1E] rounded-2xl border border-gray-700">
                      <p className="text-gray-400 text-sm leading-relaxed italic">
                        {t(
                          'No bio provided. Add bio in the form above for better analysis.',
                          'Tidak ada bio. Tambahkan bio di form atas untuk analisis lebih baik.'
                        )}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const f = getMetricValue(accountData.metrics?.followers);
                      const v = getMetricValue(accountData.metrics?.videos);
                      const l = getMetricValue(accountData.metrics?.likes);
                      if (f === 0 && v === 0 && l === 0) return null;
                      return (
                        <>
                          {v >= 10 && (
                            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                              {t('Active Creator', 'Kreator Aktif')}
                            </Badge>
                          )}
                          {accountData.verified && (
                            <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                              {t('Verified', 'Terverifikasi')}
                            </Badge>
                          )}
                          {f >= 10000 && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {t('Sponsor Ready', 'Siap Sponsor')}
                            </Badge>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Metrics Grid & Analytics - Only show when analysis is complete */}
        {analyticsTab === 'account' && accountData && (() => {
          // Extract real metrics from API response
          const followers = getMetricValue(accountData.metrics?.followers);
          const likes = getMetricValue(accountData.metrics?.likes);
          const videos = getMetricValue(accountData.metrics?.videos);
          
          // Use engagement rate from backend (correctly calculated as avg likes per video / followers * 100)
          // Backend formula: (totalLikes / videoCount / followers) * 100
          const engagementRate = accountData.metrics?.engagementRate?.toFixed(1) || 
            (followers > 0 && videos > 0 ? ((likes / videos / followers) * 100).toFixed(1) : '0.0');
          const engagementRateNum = parseFloat(engagementRate);
          
          // Dynamic status based on TikTok benchmarks (avg 4-8%, top 10%+)
          // Note: MetricCard only supports colors: pink, cyan, purple, yellow
          const getEngagementStatus = (rate: number) => {
            if (rate >= 8) return { label: t('Excellent', 'Sangat Baik'), color: 'cyan', badgeClass: 'border-green-500/50 text-green-400' };
            if (rate >= 4) return { label: t('Above Average', 'Di Atas Rata-Rata'), color: 'cyan', badgeClass: 'border-cyan-500/50 text-cyan-400' };
            if (rate >= 2) return { label: t('Average', 'Rata-Rata'), color: 'yellow', badgeClass: 'border-yellow-500/50 text-yellow-400' };
            return { label: t('Below Average', 'Di Bawah Rata-Rata'), color: 'pink', badgeClass: 'border-red-500/50 text-red-400' };
          };
          const engagementStatus = getEngagementStatus(engagementRateNum);
          
          // Calculate engagement progress (0-100 scale, where 10% engagement = 100)
          const engagementProgress = Math.min(100, Math.round(engagementRateNum * 10));
          
          // Calculate likes per video
          const likesPerVideo = videos > 0 ? Math.round(likes / videos) : 0;
          
          // Format values for display
          const followersDisplay = formatMetric(followers);
          const likesDisplay = formatMetric(likes);
          const videosDisplay = videos.toString();
          
          const followerProgress = followers >= 1000000 ? 100 : followers >= 100000 ? 85 : followers >= 10000 ? 65 : followers >= 1000 ? 40 : followers >= 100 ? 20 : followers > 0 ? 10 : 0;
          const likesProgress = likes >= 10000000 ? 100 : likes >= 1000000 ? 80 : likes >= 100000 ? 60 : likes >= 10000 ? 40 : likes > 0 ? 15 : 0;
          const videoProgress = videos >= 500 ? 100 : videos >= 200 ? 80 : videos >= 100 ? 65 : videos >= 50 ? 50 : videos >= 20 ? 35 : videos > 0 ? 15 : 0;

          const getFollowerSubtitle = () => {
            if (followers >= 100000) return t('Influencer level', 'Level influencer');
            if (followers >= 10000) return t('Growing fast', 'Bertumbuh pesat');
            if (followers >= 1000) return t('Building audience', 'Membangun audiens');
            if (followers > 0) return t('Getting started', 'Baru mulai');
            return t('No data', 'Tidak ada data');
          };
          const getLikesSubtitle = () => {
            if (engagementRateNum >= 8) return t('Excellent engagement', 'Engagement luar biasa');
            if (engagementRateNum >= 4) return t('Good engagement', 'Engagement bagus');
            if (engagementRateNum >= 2) return t('Average engagement', 'Engagement rata-rata');
            if (likes > 0) return t('Needs improvement', 'Perlu ditingkatkan');
            return t('No data', 'Tidak ada data');
          };
          const getVideoSubtitle = () => {
            if (videos >= 200) return t('Consistent creator', 'Kreator konsisten');
            if (videos >= 50) return t('Active creator', 'Kreator aktif');
            if (videos > 0) return t('Building library', 'Membangun konten');
            return t('No data', 'Tidak ada data');
          };

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title={t('Total Followers', 'Total Followers')}
              value={followersDisplay}
              subtitle={getFollowerSubtitle()}
              illustrationUrl={illustrationAudience}
              progress={followerProgress}
              color="pink"
            />
            <MetricCard
              title={t('Total Likes', 'Total Likes')}
              value={likesDisplay}
              subtitle={getLikesSubtitle()}
              illustrationUrl={illustrationEngagement}
              progress={likesProgress}
              color="cyan"
            />
            <MetricCard
              title={t('Total Videos', 'Total Video')}
              value={videosDisplay}
              subtitle={getVideoSubtitle()}
              illustrationUrl={illustrationContent}
              progress={videoProgress}
              color="purple"
            />
            <MetricCard
              title={t('Engagement Rate', 'Engagement Rate')}
              value={`${engagementRate}%`}
              subtitle={engagementStatus.label}
              illustrationUrl={illustrationGrowth}
              progress={engagementProgress}
              color={engagementStatus.color as 'pink' | 'cyan' | 'purple' | 'yellow'}
            />
          </div>

          {/* Account Analytics Insights - Narasi Mendalam Berdasarkan Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Rate Deep Analysis */}
          <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-engagement">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-yellow-400">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('Engagement Rate Analysis', 'Analisis Engagement Rate')}
                </div>
                <img src={illustrationEngagement} alt="Engagement" className="w-12 h-12 rounded-xl object-cover" />
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-3xl font-bold ${engagementRateNum >= 4 ? 'text-green-400' : engagementRateNum >= 2 ? 'text-yellow-400' : 'text-red-400'}`} data-testid="text-engagement-rate">{engagementRate}%</span>
                <Badge variant="outline" className={engagementStatus.badgeClass} data-testid="badge-engagement-status">
                  {engagementStatus.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed" data-testid="text-engagement-narrative">
                {engagementRateNum >= 8 ? t(
                  `Excellent! Your engagement rate of ${engagementRate}% is significantly above the TikTok average of 4-8%. Your ${followersDisplay} followers are highly engaged with your content. With ${videosDisplay} videos generating ${likesDisplay} total likes (${likesPerVideo.toLocaleString()} likes/video average), your audience strongly resonates with your content. Keep up the great work!`,
                  `Luar biasa! Engagement rate Anda ${engagementRate}% jauh di atas rata-rata TikTok 4-8%. ${followersDisplay} follower Anda sangat engaged dengan konten Anda. Dengan ${videosDisplay} video menghasilkan ${likesDisplay} total likes (rata-rata ${likesPerVideo.toLocaleString()} likes/video), audiens Anda sangat resonan dengan konten Anda. Pertahankan!`
                ) : engagementRateNum >= 4 ? t(
                  `Good job! Your engagement rate of ${engagementRate}% is above the TikTok average of 4-8%. Your ${followersDisplay} followers are interacting well with your content. With ${videosDisplay} videos and ${likesDisplay} total likes (${likesPerVideo.toLocaleString()} likes/video average), you're building a solid engaged community.`,
                  `Bagus! Engagement rate Anda ${engagementRate}% di atas rata-rata TikTok 4-8%. ${followersDisplay} follower Anda berinteraksi dengan baik dengan konten Anda. Dengan ${videosDisplay} video dan ${likesDisplay} total likes (rata-rata ${likesPerVideo.toLocaleString()} likes/video), Anda sedang membangun komunitas yang solid.`
                ) : engagementRateNum >= 2 ? t(
                  `Your engagement rate of ${engagementRate}% is around average for TikTok (4-8% is typical). With ${followersDisplay} followers and ${videosDisplay} videos generating ${likesDisplay} total likes (${likesPerVideo.toLocaleString()} likes/video average), there's room to boost interaction through better hooks and timing.`,
                  `Engagement rate Anda ${engagementRate}% sekitar rata-rata TikTok (4-8% adalah tipikal). Dengan ${followersDisplay} follower dan ${videosDisplay} video menghasilkan ${likesDisplay} total likes (rata-rata ${likesPerVideo.toLocaleString()} likes/video), masih ada ruang untuk meningkatkan interaksi melalui hook dan timing yang lebih baik.`
                ) : t(
                  `Your engagement rate of ${engagementRate}% is below the TikTok average of 4-8%. With ${followersDisplay} followers, ${videosDisplay} videos, and ${likesDisplay} total likes (${likesPerVideo.toLocaleString()} likes/video average), your audience may need more compelling hooks and calls-to-action to boost interaction.`,
                  `Engagement rate Anda ${engagementRate}% di bawah rata-rata TikTok 4-8%. Dengan ${followersDisplay} follower, ${videosDisplay} video, dan ${likesDisplay} total likes (rata-rata ${likesPerVideo.toLocaleString()} likes/video), audiens Anda mungkin membutuhkan hook dan call-to-action yang lebih menarik untuk meningkatkan interaksi.`
                )}
              </p>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                <p className="text-yellow-200 font-semibold mb-2">💡 {t('Actionable Recommendations:', 'Rekomendasi Actionable:')}</p>
                <ul className="text-yellow-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-engagement-recommendations">
                  {/* Dynamic recommendations based on actual metrics */}
                  {engagementRateNum < 2 && (
                    <>
                      <li>{t(
                        `With ${engagementRate}% engagement, focus on stronger hooks in first 3 seconds to stop the scroll`,
                        `Dengan engagement ${engagementRate}%, fokus pada hook kuat di 3 detik pertama untuk menghentikan scroll`
                      )}</li>
                      <li>{t(
                        `Your ${likesPerVideo.toLocaleString()} likes/video average needs boosting - add clear CTAs like "Double tap if you agree"`,
                        `Rata-rata ${likesPerVideo.toLocaleString()} likes/video perlu ditingkatkan - tambahkan CTA jelas seperti "Double tap kalau setuju"`
                      )}</li>
                    </>
                  )}
                  {engagementRateNum >= 2 && engagementRateNum < 4 && (
                    <>
                      <li>{t(
                        `Your ${engagementRate}% is close to average - increase posting frequency to 2-3x daily for more visibility`,
                        `Engagement ${engagementRate}% mendekati rata-rata - tingkatkan frekuensi posting 2-3x sehari untuk lebih banyak visibility`
                      )}</li>
                      <li>{t(
                        `With ${followersDisplay} followers, experiment with duets and stitches to tap into larger audiences`,
                        `Dengan ${followersDisplay} followers, coba duet dan stitch untuk menjangkau audiens lebih besar`
                      )}</li>
                    </>
                  )}
                  {engagementRateNum >= 4 && engagementRateNum < 8 && (
                    <>
                      <li>{t(
                        `Great ${engagementRate}% engagement! Leverage your ${followersDisplay} followers with more collab content`,
                        `Bagus! Engagement ${engagementRate}%! Manfaatkan ${followersDisplay} followers dengan lebih banyak konten kolaborasi`
                      )}</li>
                      <li>{t(
                        `Your ${likesPerVideo.toLocaleString()} likes/video is strong - consider going live to monetize this engaged audience`,
                        `Rata-rata ${likesPerVideo.toLocaleString()} likes/video kuat - pertimbangkan live untuk monetisasi audiens engaged ini`
                      )}</li>
                    </>
                  )}
                  {engagementRateNum >= 8 && (
                    <>
                      <li>{t(
                        `Excellent ${engagementRate}%! Your ${followersDisplay} followers are highly engaged - explore brand partnerships`,
                        `Luar biasa ${engagementRate}%! ${followersDisplay} followers Anda sangat engaged - jajaki kerjasama brand`
                      )}</li>
                      <li>{t(
                        `With ${likesPerVideo.toLocaleString()} likes/video, you're ready for TikTok Creator Fund or affiliate marketing`,
                        `Dengan ${likesPerVideo.toLocaleString()} likes/video, Anda siap untuk TikTok Creator Fund atau affiliate marketing`
                      )}</li>
                    </>
                  )}
                  {/* Always show these contextual tips */}
                  <li>{t(
                    `Based on ${videosDisplay} videos, ${videos < 50 ? 'increase content volume' : videos < 200 ? 'maintain consistency' : 'focus on quality over quantity'}`,
                    `Berdasarkan ${videosDisplay} video, ${videos < 50 ? 'tingkatkan volume konten' : videos < 200 ? 'pertahankan konsistensi' : 'fokus kualitas daripada kuantitas'}`
                  )}</li>
                  <li>{t(
                    followers < 10000 ? 'Reply to every comment to build community loyalty' : 
                    followers < 100000 ? 'Pin top comments and create response videos' : 
                    'Delegate engagement or use scheduled responses',
                    followers < 10000 ? 'Balas setiap komentar untuk membangun loyalitas komunitas' : 
                    followers < 100000 ? 'Pin komentar terbaik dan buat video respons' : 
                    'Delegasikan engagement atau gunakan respons terjadwal'
                  )}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Growth Strategy Insights - DYNAMIC based on follower count */}
          {(() => {
            // Calculate growth tier based on follower count
            const growthTier = followers < 1000 ? 'starter' : followers < 10000 ? 'growing' : followers < 100000 ? 'established' : 'influencer';
            const growthBadge = growthTier === 'starter' ? t('Building Foundation', 'Membangun Fondasi') 
              : growthTier === 'growing' ? t('Growth Phase', 'Fase Pertumbuhan')
              : growthTier === 'established' ? t('Established Creator', 'Kreator Mapan')
              : t('Influencer Status', 'Status Influencer');
            const growthBadgeClass = growthTier === 'starter' ? 'border-yellow-500/50 text-yellow-400'
              : growthTier === 'growing' ? 'border-cyan-500/50 text-cyan-400'
              : growthTier === 'established' ? 'border-green-500/50 text-green-400'
              : 'border-purple-500/50 text-purple-400';
            
            return (
              <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-growth">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-pink-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('Follower Growth Strategy', 'Strategi Pertumbuhan Follower')}
                    </div>
                    <img src={illustrationGrowth} alt="Growth" className="w-12 h-12 rounded-xl object-cover" />
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-pink-400" data-testid="text-growth-rate">{followersDisplay}</span>
                    <Badge variant="outline" className={growthBadgeClass} data-testid="badge-growth-status">
                      {growthBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed" data-testid="text-growth-narrative">
                    {growthTier === 'starter' ? t(
                      `With ${followersDisplay} followers, you're in the early growth phase. Focus on consistency and finding your niche. Your ${videosDisplay} videos show commitment - now optimize for discoverability with trending sounds and hashtags. Current engagement rate of ${engagementRate}% is ${engagementRateNum >= 8 ? 'excellent for building momentum' : 'an area to improve through better hooks'}.`,
                      `Dengan ${followersDisplay} follower, Anda dalam fase pertumbuhan awal. Fokus pada konsistensi dan temukan niche Anda. ${videosDisplay} video menunjukkan komitmen - sekarang optimalkan discoverability dengan sound dan hashtag trending. Engagement rate ${engagementRate}% ${engagementRateNum >= 8 ? 'sangat baik untuk membangun momentum' : 'area yang perlu ditingkatkan melalui hook yang lebih baik'}.`
                    ) : growthTier === 'growing' ? t(
                      `At ${followersDisplay} followers, you're in active growth mode! Your ${videosDisplay} videos have attracted a solid audience. With ${engagementRate}% engagement, ${engagementRateNum >= 4 ? "you're connecting well with viewers" : "focus on increasing interaction through CTAs and questions"}. This is the critical phase to establish your content identity.`,
                      `Pada ${followersDisplay} follower, Anda dalam mode pertumbuhan aktif! ${videosDisplay} video telah menarik audiens yang solid. Dengan engagement ${engagementRate}%, ${engagementRateNum >= 4 ? "Anda terhubung baik dengan penonton" : "fokus meningkatkan interaksi melalui CTA dan pertanyaan"}. Ini fase kritis untuk membangun identitas konten.`
                    ) : growthTier === 'established' ? t(
                      `With ${followersDisplay} followers, you're an established creator! Your library of ${videosDisplay} videos shows expertise. ${engagementRate}% engagement ${engagementRateNum >= 4 ? 'demonstrates loyal audience connection' : 'could be improved with more community-focused content'}. Consider monetization and brand partnerships.`,
                      `Dengan ${followersDisplay} follower, Anda kreator mapan! Library ${videosDisplay} video menunjukkan keahlian. Engagement ${engagementRate}% ${engagementRateNum >= 4 ? 'menunjukkan koneksi audiens yang loyal' : 'bisa ditingkatkan dengan konten lebih fokus komunitas'}. Pertimbangkan monetisasi dan kerjasama brand.`
                    ) : t(
                      `Impressive! With ${followersDisplay} followers, you've achieved influencer status. Your ${videosDisplay} videos command significant reach. At ${engagementRate}% engagement, ${engagementRateNum >= 4 ? "your audience is highly engaged" : "focus on re-engaging your large follower base"}. Focus on premium partnerships and content scaling.`,
                      `Luar biasa! Dengan ${followersDisplay} follower, Anda sudah mencapai status influencer. ${videosDisplay} video Anda memiliki jangkauan signifikan. Pada engagement ${engagementRate}%, ${engagementRateNum >= 4 ? "audiens Anda sangat engaged" : "fokus pada re-engage basis follower yang besar"}. Fokus pada partnership premium dan scaling konten.`
                    )}
                  </p>
                  <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-2xl">
                    <p className="text-pink-200 font-semibold mb-2">🎯 {t('Growth Acceleration Tactics:', 'Taktik Akselerasi Pertumbuhan:')}</p>
                    <ul className="text-pink-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-growth-recommendations">
                      {growthTier === 'starter' && (
                        <>
                          <li>{t('Post 1-2 videos daily to build content library and test what works', 'Posting 1-2 video per hari untuk membangun library konten dan test apa yang berhasil')}</li>
                          <li>{t('Engage with creators in your niche - comment on 20+ videos daily', 'Engage dengan kreator di niche Anda - komentar di 20+ video per hari')}</li>
                          <li>{t('Use 3-5 trending hashtags + 2-3 niche hashtags per video', 'Gunakan 3-5 hashtag trending + 2-3 hashtag niche per video')}</li>
                          <li>{t('Study viral videos in your niche and adapt their hook formula', 'Pelajari video viral di niche Anda dan adaptasi formula hook mereka')}</li>
                        </>
                      )}
                      {growthTier === 'growing' && (
                        <>
                          <li>{t(`With ${videosDisplay} videos, analyze your top 5 performers and double down on that style`, `Dengan ${videosDisplay} video, analisis 5 video terbaik dan fokus ganda pada gaya itu`)}</li>
                          <li>{t('Collaborate with creators at similar follower count (5-20K) for mutual growth', 'Kolaborasi dengan kreator di jumlah follower serupa (5-20K) untuk pertumbuhan mutual')}</li>
                          <li>{t('Create a signature content series that fans can anticipate', 'Buat series konten signature yang bisa dinantikan fans')}</li>
                          <li>{t('Go live 2-3x weekly to boost algorithm favor and real-time engagement', 'Live 2-3x seminggu untuk boost favor algoritma dan engagement real-time')}</li>
                        </>
                      )}
                      {growthTier === 'established' && (
                        <>
                          <li>{t(`Leverage your ${followersDisplay} followers for duets with smaller creators`, `Manfaatkan ${followersDisplay} follower untuk duet dengan kreator lebih kecil`)}</li>
                          <li>{t('Create educational content teaching your expertise to establish authority', 'Buat konten edukasi mengajarkan keahlian Anda untuk membangun otoritas')}</li>
                          <li>{t('Test longer-form content (2-3 min) for deeper audience connection', 'Test konten format panjang (2-3 menit) untuk koneksi audiens lebih dalam')}</li>
                          <li>{t('Build email list or Discord for audience ownership beyond TikTok', 'Bangun email list atau Discord untuk kepemilikan audiens di luar TikTok')}</li>
                        </>
                      )}
                      {growthTier === 'influencer' && (
                        <>
                          <li>{t('Delegate content creation to maintain volume while focusing on strategy', 'Delegasikan pembuatan konten untuk maintain volume sambil fokus strategi')}</li>
                          <li>{t('Launch exclusive content or membership for your most engaged fans', 'Luncurkan konten eksklusif atau membership untuk fans paling engaged')}</li>
                          <li>{t('Cross-platform expansion to YouTube Shorts and Instagram Reels', 'Ekspansi cross-platform ke YouTube Shorts dan Instagram Reels')}</li>
                          <li>{t('Consider launching your own product line or brand collaboration', 'Pertimbangkan meluncurkan lini produk sendiri atau kolaborasi brand')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Content Strategy Analysis - DYNAMIC based on video count and performance */}
          {(() => {
            const contentTier = videos < 20 ? 'beginner' : videos < 100 ? 'active' : videos < 500 ? 'prolific' : 'veteran';
            const contentBadge = contentTier === 'beginner' ? t('Just Starting', 'Baru Mulai')
              : contentTier === 'active' ? t('Active Creator', 'Kreator Aktif')
              : contentTier === 'prolific' ? t('Prolific Creator', 'Kreator Produktif')
              : t('Content Veteran', 'Veteran Konten');
            const contentBadgeClass = contentTier === 'beginner' ? 'border-yellow-500/50 text-yellow-400'
              : contentTier === 'active' ? 'border-cyan-500/50 text-cyan-400'
              : contentTier === 'prolific' ? 'border-green-500/50 text-green-400'
              : 'border-purple-500/50 text-purple-400';
            
            return (
              <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-content">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-cyan-400">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      {t('Content Strategy Analysis', 'Analisis Strategi Konten')}
                    </div>
                    <img src={illustrationContent} alt="Content" className="w-12 h-12 rounded-xl object-cover" />
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-cyan-400" data-testid="text-content-volume">{videosDisplay} {t('Videos', 'Video')}</span>
                    <Badge variant="outline" className={contentBadgeClass} data-testid="badge-content-status">
                      {contentBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed" data-testid="text-content-narrative">
                    {contentTier === 'beginner' ? t(
                      `With ${videosDisplay} videos, you're just getting started! Focus on experimenting with different formats to find what works. Your ${likesPerVideo.toLocaleString()} likes/video average ${likesPerVideo > 100 ? 'shows promise' : 'will grow as you find your style'}. At ${followersDisplay} followers, every new video is an opportunity to attract more audience.`,
                      `Dengan ${videosDisplay} video, Anda baru memulai! Fokus bereksperimen dengan format berbeda untuk menemukan yang berhasil. Rata-rata ${likesPerVideo.toLocaleString()} likes/video ${likesPerVideo > 100 ? 'menunjukkan potensi' : 'akan tumbuh seiring Anda menemukan gaya'}. Pada ${followersDisplay} follower, setiap video baru adalah kesempatan menarik lebih banyak audiens.`
                    ) : contentTier === 'active' ? t(
                      `Your library of ${videosDisplay} videos shows active content creation. With ${likesPerVideo.toLocaleString()} likes/video average, ${likesPerVideo > 500 ? "you've found content that resonates" : "focus on improving hook quality"}. Your ${followersDisplay} followers expect consistent value - analyze which of your ${videosDisplay} videos performed best.`,
                      `Library ${videosDisplay} video menunjukkan kreasi konten aktif. Dengan rata-rata ${likesPerVideo.toLocaleString()} likes/video, ${likesPerVideo > 500 ? "Anda sudah menemukan konten yang resonan" : "fokus tingkatkan kualitas hook"}. ${followersDisplay} follower Anda mengharapkan nilai konsisten - analisis mana dari ${videosDisplay} video yang performa terbaik.`
                    ) : contentTier === 'prolific' ? t(
                      `Impressive ${videosDisplay} videos! This volume shows serious commitment. With ${likesPerVideo.toLocaleString()} likes/video and ${followersDisplay} followers, ${engagementRateNum >= 4 ? "your content strategy is working well" : "consider quality over quantity"}. Your extensive library gives you data to identify winning patterns.`,
                      `Mengesankan ${videosDisplay} video! Volume ini menunjukkan komitmen serius. Dengan ${likesPerVideo.toLocaleString()} likes/video dan ${followersDisplay} follower, ${engagementRateNum >= 4 ? "strategi konten Anda berjalan baik" : "pertimbangkan kualitas daripada kuantitas"}. Library ekstensif memberi data untuk identifikasi pola pemenang.`
                    ) : t(
                      `With ${videosDisplay} videos, you're a content veteran! Your ${likesPerVideo.toLocaleString()} likes/video shows ${likesPerVideo > 1000 ? 'strong audience loyalty' : 'room to optimize quality'}. At ${followersDisplay} followers, focus on curating your best content and archiving underperformers to strengthen your profile.`,
                      `Dengan ${videosDisplay} video, Anda veteran konten! ${likesPerVideo.toLocaleString()} likes/video menunjukkan ${likesPerVideo > 1000 ? 'loyalitas audiens kuat' : 'ruang untuk optimalkan kualitas'}. Pada ${followersDisplay} follower, fokus kurasi konten terbaik dan arsipkan yang underperform untuk memperkuat profil.`
                    )}
                  </p>
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                    <p className="text-cyan-200 font-semibold mb-2">🎬 {t('Content Optimization Strategy:', 'Strategi Optimasi Konten:')}</p>
                    <ul className="text-cyan-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-content-recommendations">
                      {contentTier === 'beginner' && (
                        <>
                          <li>{t('Aim for 1 video daily until you reach 50+ videos to build momentum', 'Target 1 video per hari sampai mencapai 50+ video untuk bangun momentum')}</li>
                          <li>{t('Test 5 different content formats and track which gets most engagement', 'Test 5 format konten berbeda dan lacak mana yang dapat engagement terbanyak')}</li>
                          <li>{t('Study the top 10 creators in your niche - note their hooks, pacing, CTAs', 'Pelajari 10 kreator teratas di niche Anda - catat hook, pacing, CTA mereka')}</li>
                          <li>{t('Keep videos 15-30 seconds until you understand what holds attention', 'Pertahankan video 15-30 detik sampai Anda paham apa yang menarik perhatian')}</li>
                        </>
                      )}
                      {contentTier === 'active' && (
                        <>
                          <li>{t(`Review your ${videosDisplay} videos - find top 10% and analyze their patterns`, `Review ${videosDisplay} video Anda - temukan 10% teratas dan analisis polanya`)}</li>
                          <li>{t('Create 3-5 content "pillars" - recurring themes your audience expects', 'Buat 3-5 "pilar" konten - tema berulang yang audiens harapkan')}</li>
                          <li>{t('Start a signature series that fans can anticipate weekly', 'Mulai series signature yang fans bisa nantikan mingguan')}</li>
                          <li>{t('Experiment with different video lengths - some topics need more time', 'Eksperimen dengan durasi video berbeda - beberapa topik butuh waktu lebih')}</li>
                        </>
                      )}
                      {contentTier === 'prolific' && (
                        <>
                          <li>{t(`With ${videosDisplay} videos, archive bottom 20% performers to improve profile quality`, `Dengan ${videosDisplay} video, arsipkan 20% performer terendah untuk tingkatkan kualitas profil`)}</li>
                          <li>{t('Create playlists organizing your best content by theme', 'Buat playlist yang mengorganisir konten terbaik berdasarkan tema')}</li>
                          <li>{t('Repurpose top performers into new formats (carousels, stories, compilations)', 'Repurpose performer terbaik ke format baru (carousel, story, kompilasi)')}</li>
                          <li>{t('Consider reducing posting frequency for higher production quality', 'Pertimbangkan kurangi frekuensi posting untuk kualitas produksi lebih tinggi')}</li>
                        </>
                      )}
                      {contentTier === 'veteran' && (
                        <>
                          <li>{t('Curate a "best of" highlight reel showcasing your top 20 videos', 'Kurasi highlight reel "terbaik dari" yang showcase 20 video teratas')}</li>
                          <li>{t('Archive or private underperforming content to strengthen profile impression', 'Arsipkan atau private konten underperform untuk perkuat kesan profil')}</li>
                          <li>{t('Focus on evergreen content that performs well long-term', 'Fokus pada konten evergreen yang performa baik jangka panjang')}</li>
                          <li>{t('Consider hiring editor to repurpose your library for other platforms', 'Pertimbangkan menyewa editor untuk repurpose library Anda ke platform lain')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Monetization Potential - DYNAMIC based on followers and engagement */}
          {(() => {
            // Calculate monetization score based on followers and engagement
            const baseScore = followers < 1000 ? 2 : followers < 10000 ? 4 : followers < 50000 ? 6 : followers < 100000 ? 7.5 : 9;
            const engagementBonus = engagementRateNum >= 8 ? 1 : engagementRateNum >= 4 ? 0.5 : engagementRateNum >= 2 ? 0 : -1;
            const moneyScore = Math.min(10, Math.max(1, baseScore + engagementBonus)).toFixed(1);
            
            const moneyTier = followers < 1000 ? 'pre-monetization' : followers < 10000 ? 'affiliate-ready' : followers < 50000 ? 'brand-eligible' : 'sponsor-ready';
            const moneyBadge = moneyTier === 'pre-monetization' ? t('Build First', 'Bangun Dulu')
              : moneyTier === 'affiliate-ready' ? t('Affiliate Ready', 'Siap Affiliate')
              : moneyTier === 'brand-eligible' ? t('Brand Eligible', 'Eligible Brand')
              : t('Sponsor Ready', 'Siap Sponsor');
            const moneyBadgeClass = moneyTier === 'pre-monetization' ? 'border-yellow-500/50 text-yellow-400'
              : moneyTier === 'affiliate-ready' ? 'border-cyan-500/50 text-cyan-400'
              : moneyTier === 'brand-eligible' ? 'border-green-500/50 text-green-400'
              : 'border-purple-500/50 text-purple-400';
            
            return (
              <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-monetization">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-purple-400">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t('Monetization Potential', 'Potensi Monetisasi')}
                    </div>
                    <img src={illustrationMoney} alt="Monetization" className="w-12 h-12 rounded-xl object-cover" />
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-purple-400" data-testid="text-sponsor-score">{moneyScore}/10</span>
                    <Badge variant="outline" className={moneyBadgeClass} data-testid="badge-monetization-status">
                      {moneyBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed" data-testid="text-monetization-narrative">
                    {moneyTier === 'pre-monetization' ? t(
                      `With ${followersDisplay} followers, focus on growing your audience before monetization. Your ${engagementRate}% engagement and ${videosDisplay} videos show ${engagementRateNum >= 4 ? 'good engagement foundation' : 'room to improve'}. Most monetization requires 1,000+ followers minimum. Keep creating consistent content!`,
                      `Dengan ${followersDisplay} follower, fokus kembangkan audiens sebelum monetisasi. Engagement ${engagementRate}% dan ${videosDisplay} video menunjukkan ${engagementRateNum >= 4 ? 'fondasi engagement bagus' : 'ruang untuk perbaikan'}. Kebanyakan monetisasi butuh minimal 1.000+ follower. Terus buat konten konsisten!`
                    ) : moneyTier === 'affiliate-ready' ? t(
                      `At ${followersDisplay} followers with ${engagementRate}% engagement, you're ready for affiliate marketing! Your ${likesPerVideo.toLocaleString()} likes/video shows real audience interest. Start with product recommendations in your niche. TikTok Creator Fund requires 10K followers - you're ${(10000 - followers).toLocaleString()} away.`,
                      `Pada ${followersDisplay} follower dengan engagement ${engagementRate}%, Anda siap untuk affiliate marketing! ${likesPerVideo.toLocaleString()} likes/video menunjukkan minat audiens nyata. Mulai dengan rekomendasi produk di niche Anda. TikTok Creator Fund butuh 10K follower - Anda ${(10000 - followers).toLocaleString()} lagi.`
                    ) : moneyTier === 'brand-eligible' ? t(
                      `With ${followersDisplay} followers and ${engagementRate}% engagement, you qualify for brand partnerships! Your ${videosDisplay} videos demonstrate content experience. ${engagementRateNum >= 3 ? 'Your engagement meets the 3% minimum brands look for' : 'Improve engagement to 3%+ to attract better deals'}. Expected rate: $100-500/post.`,
                      `Dengan ${followersDisplay} follower dan engagement ${engagementRate}%, Anda eligible untuk partnership brand! ${videosDisplay} video menunjukkan pengalaman konten. ${engagementRateNum >= 3 ? 'Engagement Anda memenuhi minimum 3% yang dicari brand' : 'Tingkatkan engagement ke 3%+ untuk menarik deal lebih baik'}. Perkiraan rate: $100-500/post.`
                    ) : t(
                      `Excellent! With ${followersDisplay} followers, you're in sponsor-ready territory. Your ${engagementRate}% engagement across ${videosDisplay} videos makes you attractive to brands. ${engagementRateNum >= 4 ? 'Strong engagement boosts your negotiating power' : 'Focus on engagement to command premium rates'}. Expected rate: $500-2000+/post.`,
                      `Luar biasa! Dengan ${followersDisplay} follower, Anda sudah siap sponsor. Engagement ${engagementRate}% di ${videosDisplay} video membuat Anda menarik bagi brand. ${engagementRateNum >= 4 ? 'Engagement kuat meningkatkan daya negosiasi Anda' : 'Fokus pada engagement untuk rate premium'}. Perkiraan rate: $500-2000+/post.`
                    )}
                  </p>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                    <p className="text-purple-200 font-semibold mb-2">💰 {t('Monetization Roadmap:', 'Roadmap Monetisasi:')}</p>
                    <ul className="text-purple-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-monetization-recommendations">
                      {moneyTier === 'pre-monetization' && (
                        <>
                          <li>{t(`Focus on reaching 1,000 followers first (${(1000 - followers).toLocaleString()} to go)`, `Fokus capai 1.000 follower dulu (${(1000 - followers).toLocaleString()} lagi)`)}</li>
                          <li>{t('Build your content library to at least 50 videos', 'Bangun library konten minimal 50 video')}</li>
                          <li>{t('Define your niche clearly - brands want focused creators', 'Definisikan niche dengan jelas - brand ingin kreator fokus')}</li>
                          <li>{t('Start tracking analytics to understand your audience demographics', 'Mulai track analytics untuk pahami demografi audiens')}</li>
                        </>
                      )}
                      {moneyTier === 'affiliate-ready' && (
                        <>
                          <li>{t('Sign up for affiliate programs in your niche (Amazon, Shopee, Tokopedia)', 'Daftar program affiliate di niche Anda (Amazon, Shopee, Tokopedia)')}</li>
                          <li>{t(`Push to 10K followers for TikTok Creator Fund (${(10000 - followers).toLocaleString()} more)`, `Push ke 10K follower untuk TikTok Creator Fund (${(10000 - followers).toLocaleString()} lagi)`)}</li>
                          <li>{t('Create authentic product reviews that provide real value', 'Buat review produk autentik yang memberikan nilai nyata')}</li>
                          <li>{t('Track which affiliate content performs best and double down', 'Track konten affiliate mana yang performa terbaik dan fokus ganda')}</li>
                        </>
                      )}
                      {moneyTier === 'brand-eligible' && (
                        <>
                          <li>{t('Create a media kit with your demographics and top content', 'Buat media kit dengan demografi dan konten terbaik')}</li>
                          <li>{t('Join TikTok Creator Marketplace for verified brand opportunities', 'Gabung TikTok Creator Marketplace untuk peluang brand terverifikasi')}</li>
                          <li>{t(`Boost engagement to ${engagementRateNum < 3 ? '3%+' : '5%+'} for better partnership rates`, `Tingkatkan engagement ke ${engagementRateNum < 3 ? '3%+' : '5%+'} untuk rate partnership lebih baik`)}</li>
                          <li>{t('Pitch to local brands in your niche with specific collaboration ideas', 'Pitch ke brand lokal di niche Anda dengan ide kolaborasi spesifik')}</li>
                        </>
                      )}
                      {moneyTier === 'sponsor-ready' && (
                        <>
                          <li>{t('Diversify income: sponsorships, Creator Fund, affiliate, merch', 'Diversifikasi pendapatan: sponsorship, Creator Fund, affiliate, merch')}</li>
                          <li>{t('Negotiate long-term brand ambassador deals for stable income', 'Negosiasi deal brand ambassador jangka panjang untuk pendapatan stabil')}</li>
                          <li>{t('Consider launching your own product/service to your audience', 'Pertimbangkan luncurkan produk/layanan sendiri ke audiens')}</li>
                          <li>{t('Hire management or join MCN for premium brand connections', 'Sewa management atau gabung MCN untuk koneksi brand premium')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Audience Quality Analysis - DYNAMIC based on engagement and likes ratio */}
          {(() => {
            // Calculate audience quality score based on engagement and like-to-follower ratio
            const likeRatio = followers > 0 ? likes / followers : 0;
            const audienceBaseScore = engagementRateNum >= 8 ? 9 : engagementRateNum >= 4 ? 7 : engagementRateNum >= 2 ? 5 : 3;
            const ratioBonus = likeRatio >= 1 ? 1 : likeRatio >= 0.5 ? 0.5 : 0;
            const audienceScore = Math.min(10, audienceBaseScore + ratioBonus).toFixed(1);
            
            const audienceTier = engagementRateNum >= 8 ? 'highly-engaged' : engagementRateNum >= 4 ? 'engaged' : engagementRateNum >= 2 ? 'passive' : 'dormant';
            const audienceBadge = audienceTier === 'highly-engaged' ? t('Highly Engaged', 'Sangat Engaged')
              : audienceTier === 'engaged' ? t('Good Quality', 'Kualitas Baik')
              : audienceTier === 'passive' ? t('Passive Audience', 'Audiens Pasif')
              : t('Needs Attention', 'Butuh Perhatian');
            const audienceBadgeClass = audienceTier === 'highly-engaged' ? 'border-green-500/50 text-green-400'
              : audienceTier === 'engaged' ? 'border-cyan-500/50 text-cyan-400'
              : audienceTier === 'passive' ? 'border-yellow-500/50 text-yellow-400'
              : 'border-red-500/50 text-red-400';
            
            return (
              <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-audience">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-green-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('Audience Quality Analysis', 'Analisis Kualitas Audiens')}
                    </div>
                    <img src={illustrationAudience} alt="Audience" className="w-12 h-12 rounded-xl object-cover" />
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-green-400" data-testid="text-audience-score">{audienceScore}/10</span>
                    <Badge variant="outline" className={audienceBadgeClass} data-testid="badge-audience-status">
                      {audienceBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed" data-testid="text-audience-narrative">
                    {audienceTier === 'highly-engaged' ? t(
                      `Excellent! Your ${engagementRate}% engagement shows a highly engaged audience. With ${likesDisplay} total likes from ${followersDisplay} followers (${likeRatio.toFixed(2)} ratio), your audience genuinely connects with your content. Your ${videosDisplay} videos consistently attract interaction - this is the foundation for monetization and community building.`,
                      `Luar biasa! Engagement ${engagementRate}% menunjukkan audiens sangat engaged. Dengan ${likesDisplay} total likes dari ${followersDisplay} follower (rasio ${likeRatio.toFixed(2)}), audiens Anda benar-benar terhubung dengan konten. ${videosDisplay} video Anda secara konsisten menarik interaksi - ini fondasi untuk monetisasi dan membangun komunitas.`
                    ) : audienceTier === 'engaged' ? t(
                      `Good audience quality! Your ${engagementRate}% engagement indicates real followers who interact with your ${videosDisplay} videos. The ${likeRatio.toFixed(2)} like-to-follower ratio (${likesDisplay} likes / ${followersDisplay} followers) shows authentic engagement over time. Keep nurturing this community with consistent value.`,
                      `Kualitas audiens bagus! Engagement ${engagementRate}% mengindikasikan follower nyata yang berinteraksi dengan ${videosDisplay} video Anda. Rasio like-to-follower ${likeRatio.toFixed(2)} (${likesDisplay} likes / ${followersDisplay} follower) menunjukkan engagement autentik dari waktu ke waktu. Terus nurture komunitas ini dengan nilai konsisten.`
                    ) : audienceTier === 'passive' ? t(
                      `Your ${followersDisplay} followers show passive engagement at ${engagementRate}%. With ${likesDisplay} total likes across ${videosDisplay} videos, your audience exists but isn't actively interacting. This could mean content-audience mismatch or algorithm not showing your content. Focus on re-engagement strategies.`,
                      `${followersDisplay} follower Anda menunjukkan engagement pasif di ${engagementRate}%. Dengan ${likesDisplay} total likes di ${videosDisplay} video, audiens ada tapi tidak aktif berinteraksi. Ini bisa berarti ketidakcocokan konten-audiens atau algoritma tidak menampilkan konten Anda. Fokus pada strategi re-engagement.`
                    ) : t(
                      `Attention needed! Your ${engagementRate}% engagement from ${followersDisplay} followers is low. With only ${likesPerVideo.toLocaleString()} average likes per video, your audience may be dormant, bot accounts, or simply not seeing your content. Consider whether followers are real or purchased, and focus on building genuine connection.`,
                      `Perlu perhatian! Engagement ${engagementRate}% dari ${followersDisplay} follower rendah. Dengan hanya rata-rata ${likesPerVideo.toLocaleString()} likes per video, audiens mungkin dormant, akun bot, atau tidak melihat konten Anda. Pertimbangkan apakah follower nyata atau dibeli, dan fokus membangun koneksi genuine.`
                    )}
                  </p>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                    <p className="text-green-200 font-semibold mb-2">👥 {t('Audience Nurturing Tactics:', 'Taktik Nurturing Audiens:')}</p>
                    <ul className="text-green-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-audience-recommendations">
                      {audienceTier === 'highly-engaged' && (
                        <>
                          <li>{t('Reward your loyal audience with exclusive content or early access', 'Reward audiens loyal dengan konten eksklusif atau akses awal')}</li>
                          <li>{t('Create community content featuring your most active commenters', 'Buat konten komunitas yang menampilkan komentator paling aktif')}</li>
                          <li>{t('Build deeper connection through live streams and Q&As', 'Bangun koneksi lebih dalam melalui live streaming dan Q&A')}</li>
                          <li>{t('Start a private community (Discord/Telegram) for superfans', 'Mulai komunitas privat (Discord/Telegram) untuk superfans')}</li>
                        </>
                      )}
                      {audienceTier === 'engaged' && (
                        <>
                          <li>{t('Ask questions in captions to encourage comment engagement', 'Ajukan pertanyaan di caption untuk dorong engagement komentar')}</li>
                          <li>{t('Reply to every comment in first hour to boost algorithm favor', 'Balas setiap komentar di jam pertama untuk boost favor algoritma')}</li>
                          <li>{t('Create "insider" content that makes followers feel special', 'Buat konten "insider" yang membuat follower merasa spesial')}</li>
                          <li>{t('Go live weekly to connect with audience in real-time', 'Live mingguan untuk terhubung dengan audiens secara real-time')}</li>
                        </>
                      )}
                      {audienceTier === 'passive' && (
                        <>
                          <li>{t('Post polls and "which do you prefer" content to spark interaction', 'Posting poll dan konten "mana yang kamu pilih" untuk picu interaksi')}</li>
                          <li>{t('Create curiosity gaps - don\'t reveal everything, make them comment', 'Buat curiosity gaps - jangan reveal semua, buat mereka komentar')}</li>
                          <li>{t('Ask for opinions: "What should I make next?" gets responses', 'Minta opini: "Apa yang harus saya buat selanjutnya?" dapat respons')}</li>
                          <li>{t('Use strong CTAs: "Comment YES if you agree" or "Save this for later"', 'Gunakan CTA kuat: "Komentar YA kalau setuju" atau "Save ini untuk nanti"')}</li>
                        </>
                      )}
                      {audienceTier === 'dormant' && (
                        <>
                          <li>{t('Clean your audience - are followers real or purchased? Be honest', 'Bersihkan audiens - apakah follower nyata atau dibeli? Jujur saja')}</li>
                          <li>{t('Start fresh with highly engaging content to re-attract algorithm', 'Mulai fresh dengan konten sangat engaging untuk re-attract algoritma')}</li>
                          <li>{t('Go live and ask who\'s really following - real fans will show up', 'Live dan tanya siapa yang benar-benar follow - fans nyata akan muncul')}</li>
                          <li>{t('Focus on quality over quantity - better 100 real fans than 10K ghosts', 'Fokus kualitas daripada kuantitas - lebih baik 100 fans nyata dari 10K hantu')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Posting Optimization - DYNAMIC based on video count and activity */}
          {(() => {
            // Estimate posting frequency based on video count (rough estimate assuming account age)
            const estimatedWeeklyPosts = videos < 10 ? videos / 2 : videos < 50 ? 2 : videos < 200 ? 3 : videos < 500 ? 4 : 5;
            const postingTier = estimatedWeeklyPosts < 2 ? 'low' : estimatedWeeklyPosts < 4 ? 'moderate' : estimatedWeeklyPosts < 6 ? 'optimal' : 'high';
            const postingBadge = postingTier === 'low' ? t('Increase Frequency', 'Tingkatkan Frekuensi')
              : postingTier === 'moderate' ? t('Good Pace', 'Tempo Baik')
              : postingTier === 'optimal' ? t('Optimal Range', 'Range Optimal')
              : t('High Volume', 'Volume Tinggi');
            const postingBadgeClass = postingTier === 'low' ? 'border-yellow-500/50 text-yellow-400'
              : postingTier === 'moderate' ? 'border-cyan-500/50 text-cyan-400'
              : postingTier === 'optimal' ? 'border-green-500/50 text-green-400'
              : 'border-purple-500/50 text-purple-400';
            
            return (
              <Card className="bg-[#141414] border-gray-800 rounded-3xl overflow-hidden" data-testid="card-analytics-posting">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-orange-400">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t('Posting Optimization', 'Optimasi Posting')}
                    </div>
                    <img src={illustrationSchedule} alt="Schedule" className="w-12 h-12 rounded-xl object-cover" />
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-orange-400" data-testid="text-posting-frequency">{videosDisplay} {t('videos', 'video')}</span>
                    <Badge variant="outline" className={postingBadgeClass} data-testid="badge-posting-status">
                      {postingBadge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed" data-testid="text-posting-narrative">
                    {postingTier === 'low' ? t(
                      `With ${videosDisplay} videos, you need to increase posting frequency. ${followers < 1000 ? 'Early accounts should post 1-2x daily to find what works' : 'More content means more chances for algorithm discovery'}. Your ${likesPerVideo.toLocaleString()} likes/video shows ${likesPerVideo > 100 ? 'people engage when you post - so post more!' : 'potential to grow with more consistent content'}.`,
                      `Dengan ${videosDisplay} video, Anda perlu tingkatkan frekuensi posting. ${followers < 1000 ? 'Akun baru harus posting 1-2x sehari untuk temukan yang berhasil' : 'Lebih banyak konten berarti lebih banyak kesempatan ditemukan algoritma'}. ${likesPerVideo.toLocaleString()} likes/video menunjukkan ${likesPerVideo > 100 ? 'orang engage saat Anda posting - jadi posting lebih banyak!' : 'potensi untuk tumbuh dengan konten lebih konsisten'}.`
                    ) : postingTier === 'moderate' ? t(
                      `Your ${videosDisplay} videos show decent activity. With ${followersDisplay} followers and ${engagementRate}% engagement, ${engagementRateNum >= 4 ? 'your pace is working' : 'consider increasing to 4-5x weekly'}. Consistency matters more than volume - pick days/times your audience expects content.`,
                      `${videosDisplay} video Anda menunjukkan aktivitas cukup. Dengan ${followersDisplay} follower dan engagement ${engagementRate}%, ${engagementRateNum >= 4 ? 'tempo Anda sudah berjalan' : 'pertimbangkan tingkatkan ke 4-5x seminggu'}. Konsistensi lebih penting dari volume - pilih hari/waktu yang audiens harapkan konten.`
                    ) : postingTier === 'optimal' ? t(
                      `Great posting consistency with ${videosDisplay} videos! Your ${followersDisplay} followers have come to expect regular content. At ${engagementRate}% engagement, ${engagementRateNum >= 4 ? 'maintain this rhythm' : 'focus on quality timing - post when your audience is most active'}. Consider testing different posting times to optimize reach.`,
                      `Konsistensi posting bagus dengan ${videosDisplay} video! ${followersDisplay} follower Anda sudah mengharapkan konten regular. Pada engagement ${engagementRate}%, ${engagementRateNum >= 4 ? 'pertahankan ritme ini' : 'fokus pada timing berkualitas - posting saat audiens paling aktif'}. Pertimbangkan test waktu posting berbeda untuk optimalkan reach.`
                    ) : t(
                      `High volume creator with ${videosDisplay} videos! With ${followersDisplay} followers, you've built significant content library. ${engagementRateNum >= 4 ? 'Your engagement stays strong despite high volume' : 'Consider reducing frequency to improve per-video quality'}. At this level, focus on strategic posting times over pure volume.`,
                      `Kreator volume tinggi dengan ${videosDisplay} video! Dengan ${followersDisplay} follower, Anda sudah membangun library konten signifikan. ${engagementRateNum >= 4 ? 'Engagement Anda tetap kuat meski volume tinggi' : 'Pertimbangkan kurangi frekuensi untuk tingkatkan kualitas per-video'}. Di level ini, fokus pada waktu posting strategis daripada volume murni.`
                    )}
                  </p>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                    <p className="text-orange-200 font-semibold mb-2">⚡ {t('Strategic Posting Plan:', 'Rencana Posting Strategis:')}</p>
                    <ul className="text-orange-100 text-sm space-y-1.5 list-disc list-inside" data-testid="list-posting-recommendations">
                      {postingTier === 'low' && (
                        <>
                          <li>{t(`Aim for ${videos < 50 ? '1 video daily' : '5+ videos weekly'} to build momentum`, `Target ${videos < 50 ? '1 video per hari' : '5+ video per minggu'} untuk bangun momentum`)}</li>
                          <li>{t('Batch record 5-10 videos in one session, schedule throughout week', 'Batch record 5-10 video dalam satu sesi, jadwalkan sepanjang minggu')}</li>
                          <li>{t('Start with 7-9 PM posting time - highest TikTok traffic', 'Mulai dengan waktu posting 19:00-21:00 - traffic TikTok tertinggi')}</li>
                          <li>{t('Prioritize quantity now, refine quality as you learn what works', 'Prioritaskan kuantitas dulu, perbaiki kualitas seiring Anda belajar apa yang berhasil')}</li>
                        </>
                      )}
                      {postingTier === 'moderate' && (
                        <>
                          <li>{t('Increase to 4-5 posts weekly for algorithm consistency', 'Tingkatkan ke 4-5 post mingguan untuk konsistensi algoritma')}</li>
                          <li>{t('Post at same times each day to train your audience', 'Posting di waktu sama setiap hari untuk latih audiens Anda')}</li>
                          <li>{t('Best times: 7-9 PM weekdays, 10 AM-12 PM weekends', 'Waktu terbaik: 19:00-21:00 hari kerja, 10:00-12:00 akhir pekan')}</li>
                          <li>{t('Schedule posts in advance to maintain consistency', 'Jadwalkan post di muka untuk jaga konsistensi')}</li>
                        </>
                      )}
                      {postingTier === 'optimal' && (
                        <>
                          <li>{t('Maintain current frequency - consistency beats volume', 'Pertahankan frekuensi saat ini - konsistensi lebih baik dari volume')}</li>
                          <li>{t('Check TikTok Analytics for YOUR audience peak times', 'Cek TikTok Analytics untuk waktu puncak audiens ANDA')}</li>
                          <li>{t('Experiment: post same content at different times, compare results', 'Eksperimen: posting konten sama di waktu berbeda, bandingkan hasil')}</li>
                          <li>{t('Consider reducing if engagement drops - quality over quantity', 'Pertimbangkan kurangi jika engagement turun - kualitas daripada kuantitas')}</li>
                        </>
                      )}
                      {postingTier === 'high' && (
                        <>
                          <li>{t('With high volume, focus on peak times only: 7-9 PM', 'Dengan volume tinggi, fokus waktu puncak saja: 19:00-21:00')}</li>
                          <li>{t('Reduce frequency if engagement per video is dropping', 'Kurangi frekuensi jika engagement per video menurun')}</li>
                          <li>{t('Use scheduling tools to maintain consistency without burnout', 'Gunakan tools scheduling untuk jaga konsistensi tanpa burnout')}</li>
                          <li>{t('Consider evergreen content that performs well over time', 'Pertimbangkan konten evergreen yang performa baik dari waktu ke waktu')}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
              </div>
              
              {/* Discussion Chat Box for Account Analysis */}
              <AnalysisDiscussion
                analysisType="account"
                analysisContext={`TikTok Account Analysis for @${username}:
- Followers: ${followersDisplay}
- Total Likes: ${likesDisplay}
- Videos: ${videosDisplay}
- Engagement Rate: ${engagementRate}%
- Likes per Video: ${formatMetric(likesPerVideo)}`}
                mode="tiktok"
              />
            </>
          );
        })()}
        
        {/* Analysis History - Filtered by current tab */}
        {/* Note: Video tab history is integrated directly in VideoUploadAnalyzer component */}
        {analyticsTab === 'account' && (
          <AnalysisHistory 
            onSelectAnalysis={(result, accountData) => {
              setCurrentAnalysis(result);
              if (accountData) {
                setAccountData(accountData);
                setPhotoLoadError(false);
                // Extract username from summary and set it
                const match = result.summary?.match(/@(\w+)/);
                if (match) setUsername(match[1]);
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('account-profile')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
                toast({
                  title: t('History Loaded', 'Riwayat Dimuat'),
                  description: t('Showing previous analysis', 'Menampilkan analisis sebelumnya'),
                });
              }
            }} 
            filterCategory="account" 
          />
        )}
        </div>
      )}
      </div>
    </div>
  );
}
