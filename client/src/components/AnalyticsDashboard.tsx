import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/languageContext';
import { TrendingUp, Users, Eye, Activity, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  period: string;
  overview: {
    uniqueSessions: number;
    totalPageViews: number;
    totalFeatureUsage: number;
  };
  pageViews: { page: string; count: number; language?: string }[];
  featureUsage: { featureType: string; count: number; platform?: string }[];
}

interface AnalyticsDashboardProps {
  adminPassword: string;
}

export function AnalyticsDashboard({ adminPassword }: AnalyticsDashboardProps) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('7');

  useEffect(() => {
    fetchAnalytics();
  }, [period, adminPassword]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?password=${encodeURIComponent(adminPassword)}&days=${period}`);
      if (res.ok) {
        const analytics = await res.json();
        setData(analytics);
      }
    } catch (error) {
      console.error('[ANALYTICS] Failed to fetch:', error);
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

  const topPages = pageViewsByPage.sort((a, b) => b.count - a.count).slice(0, 5);
  const topFeatures = featuresByType.sort((a, b) => b.count - a.count).slice(0, 5);

  const formatPageName = (page: string) => {
    const names: Record<string, string> = {
      'dashboard': t('Dashboard', 'Dashboard'),
      'social-pro': t('Social Pro', 'Social Pro'),
      'creator': t('Communication', 'Komunikasi'),
      'library': t('Library', 'Perpustakaan'),
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
      'account_analysis': t('Account Analysis', 'Analisis Akun'),
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
                topPages.map((item, index) => (
                  <div key={item.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{formatPageName(item.page)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count} views</span>
                    </div>
                  </div>
                ))
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
                topFeatures.map((item, index) => (
                  <div key={item.featureType} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{formatFeatureName(item.featureType)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count} uses</span>
                    </div>
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
