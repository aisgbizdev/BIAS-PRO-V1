import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/lib/languageContext';
import { TrendingUp, Users, Eye, Activity, BarChart3, Navigation, Layers, MousePointer } from 'lucide-react';

interface AnalyticsData {
  period: string;
  overview: {
    uniqueSessions: number;
    totalPageViews: number;
    totalFeatureUsage: number;
  };
  pageViews: { page: string; count: number; language?: string }[];
  featureUsage: { featureType: string; count: number; platform?: string }[];
  navigationBreakdown: { menuItem: string; destination: string; count: number }[];
  tabBreakdown: { page: string; tabName: string; count: number }[];
  buttonClickBreakdown: { buttonName: string; context: string; count: number }[];
}

export function AnalyticsDashboard() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('7');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/stats?days=${period}`, {
        credentials: 'include',
      });
      
      if (res.status === 401) {
        setError('Session expired. Please log in again.');
        return;
      }
      
      if (res.ok) {
        const analytics = await res.json();
        setData(analytics);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (error) {
      console.error('[ANALYTICS] Failed to fetch:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {t('Loading analytics...', 'Memuat analitik...')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('Please refresh the page or log in again', 'Silakan refresh halaman atau login kembali')}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('No analytics data available', 'Data analitik tidak tersedia')}
      </div>
    );
  }

  const pageViewsByPage = data.pageViews.reduce((acc, item) => {
    const existing = acc.find(x => x.page === item.page);
    if (existing) {
      existing.count += item.count;
    } else {
      acc.push({ page: item.page, count: item.count });
    }
    return acc;
  }, [] as { page: string; count: number }[]);

  const featuresByType = data.featureUsage.reduce((acc, item) => {
    const existing = acc.find(x => x.featureType === item.featureType);
    if (existing) {
      existing.count += item.count;
    } else {
      acc.push({ featureType: item.featureType, count: item.count });
    }
    return acc;
  }, [] as { featureType: string; count: number }[]);

  const topPages = pageViewsByPage.sort((a, b) => b.count - a.count).slice(0, 10);
  const topFeatures = featuresByType.sort((a, b) => b.count - a.count).slice(0, 10);

  const formatPageName = (page: string) => {
    const names: Record<string, string> = {
      '/': t('Home', 'Beranda'),
      'dashboard': t('Dashboard', 'Dashboard'),
      'social-pro': t('TikTok Pro', 'TikTok Pro'),
      'creator': t('Marketing Pro', 'Marketing Pro'),
      'library': t('Library', 'Library'),
      'admin': t('Admin', 'Admin'),
    };
    return names[page] || page;
  };

  const formatFeatureName = (feature: string) => {
    const names: Record<string, string> = {
      'analysis': t('Analysis', 'Analisis'),
      'chat': t('Chat', 'Chat'),
      'comparison': t('Comparison', 'Perbandingan'),
      'video_upload': t('Video Upload', 'Upload Video'),
      'video-upload': t('Video Upload', 'Upload Video'),
      'account_analysis': t('Account Analysis', 'Analisis Akun'),
      'navigation': t('Navigation Click', 'Klik Navigasi'),
      'tab-selection': t('Tab Selection', 'Pilih Tab'),
      'button-click': t('Button Click', 'Klik Tombol'),
      'library-search': t('Library Search', 'Pencarian Library'),
      'rules-hub': t('Rules Hub', 'Rules Hub'),
      'script-generator': t('Script Generator', 'Generator Script'),
      'script-review': t('Script Review', 'Review Script'),
      'expert-panel': t('Expert Panel', 'Panel Expert'),
      'ai-coach': t('Ai Coach', 'Ai Coach'),
    };
    return names[feature] || feature;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            {t('Analytics Dashboard', 'Dashboard Analitik')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t('Track user activity and app usage', 'Pantau aktivitas pengguna dan penggunaan aplikasi')}
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t('Last 24 hours', '24 jam terakhir')}</SelectItem>
            <SelectItem value="7">{t('Last 7 days', '7 hari terakhir')}</SelectItem>
            <SelectItem value="30">{t('Last 30 days', '30 hari terakhir')}</SelectItem>
            <SelectItem value="90">{t('Last 90 days', '90 hari terakhir')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('Unique Visitors', 'Pengunjung Unik')}
              </CardTitle>
              <Users className="h-4 w-4 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.overview.uniqueSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('unique sessions', 'sesi unik')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('Page Views', 'Tampilan Halaman')}
              </CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.overview.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('total views', 'total tampilan')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('Feature Usage', 'Penggunaan Fitur')}
              </CardTitle>
              <Activity className="h-4 w-4 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.overview.totalFeatureUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('actions performed', 'aksi dilakukan')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-pink-500" />
              <CardTitle>{t('Top Pages', 'Halaman Teratas')}</CardTitle>
            </div>
            <CardDescription>
              {t('Most visited pages', 'Halaman paling banyak dikunjungi')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('No page views yet', 'Belum ada tampilan halaman')}
                </p>
              ) : (
                topPages.map((item, index) => {
                  const maxCount = topPages[0]?.count || 1;
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <div key={item.page} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium text-sm">{formatPageName(item.page)}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-500" />
              <CardTitle>{t('Popular Features', 'Fitur Populer')}</CardTitle>
            </div>
            <CardDescription>
              {t('Most used features', 'Fitur paling banyak digunakan')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topFeatures.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('No feature usage yet', 'Belum ada penggunaan fitur')}
                </p>
              ) : (
                topFeatures.map((item, index) => {
                  const maxCount = topFeatures[0]?.count || 1;
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <div key={item.featureType} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium text-sm">{formatFeatureName(item.featureType)}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Breakdown */}
        <Card className="border-2 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">{t('Menu Clicks', 'Klik Menu')}</CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t('Which menus are clicked most', 'Menu mana yang paling sering diklik')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!data.navigationBreakdown || data.navigationBreakdown.length === 0) ? (
                <p className="text-sm text-muted-foreground">
                  {t('No data yet', 'Belum ada data')}
                </p>
              ) : (
                data.navigationBreakdown.slice(0, 5).map((item, index) => (
                  <div key={`${item.menuItem}-${index}`} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                    <span className="text-sm truncate max-w-[120px]">{item.menuItem}</span>
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      {item.count}x
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tab Breakdown */}
        <Card className="border-2 border-yellow-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-base">{t('Tab Selection', 'Pilihan Tab')}</CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t('Which tabs are used most', 'Tab mana yang paling sering dipilih')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!data.tabBreakdown || data.tabBreakdown.length === 0) ? (
                <p className="text-sm text-muted-foreground">
                  {t('No data yet', 'Belum ada data')}
                </p>
              ) : (
                data.tabBreakdown.slice(0, 5).map((item, index) => (
                  <div key={`${item.page}-${item.tabName}-${index}`} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.tabName}</span>
                      <span className="text-xs text-muted-foreground">{item.page}</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                      {item.count}x
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Button Click Breakdown */}
        <Card className="border-2 border-blue-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">{t('Button Clicks', 'Klik Tombol')}</CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t('Which buttons are clicked most', 'Tombol mana yang paling sering diklik')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!data.buttonClickBreakdown || data.buttonClickBreakdown.length === 0) ? (
                <p className="text-sm text-muted-foreground">
                  {t('No data yet', 'Belum ada data')}
                </p>
              ) : (
                data.buttonClickBreakdown.slice(0, 5).map((item, index) => (
                  <div key={`${item.buttonName}-${index}`} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.buttonName}</span>
                      <span className="text-xs text-muted-foreground">{item.context}</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      {item.count}x
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
