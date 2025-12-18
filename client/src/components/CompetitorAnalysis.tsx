import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Users, TrendingUp, Trophy, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { trackFeatureUsage } from '@/lib/analytics';

interface AccountData {
  username: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  engagementRate: number;
  avgViews: number;
  nickname?: string;
  photoUrl?: string;
  verified?: boolean;
}

interface ComparisonResult {
  accounts: AccountData[];
  winner: string;
  insights: string[];
}

export function CompetitorAnalysis() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [usernames, setUsernames] = useState<string[]>(['', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);

  const addUsername = () => {
    if (usernames.length < 5) {
      setUsernames([...usernames, '']);
    }
  };

  const removeUsername = (index: number) => {
    if (usernames.length > 2) {
      setUsernames(usernames.filter((_, i) => i !== index));
    }
  };

  const updateUsername = (index: number, value: string) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value.replace('@', '');
    setUsernames(newUsernames);
  };

  const handleAnalyze = async () => {
    const validUsernames = usernames.filter(u => u.trim().length > 0);
    
    if (validUsernames.length < 2) {
      toast({
        title: t('Need at least 2 accounts', 'Butuh minimal 2 akun'),
        description: t('Enter at least 2 TikTok usernames to compare', 'Masukkan minimal 2 username TikTok untuk dibandingkan'),
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const accountsData: AccountData[] = [];
      
      for (const username of validUsernames) {
        try {
          const response = await fetch('/api/analyze-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform: 'tiktok', username: username.trim() })
          });

          if (response.ok) {
            const data = await response.json();
            // Handle both old (stats) and new (metrics) API response formats
            const followers = data.metrics?.followers?.approx || data.metrics?.followers || data.stats?.followers || 0;
            const following = data.metrics?.following?.approx || data.metrics?.following || data.stats?.following || 0;
            const likes = data.metrics?.likes?.approx || data.metrics?.likes || data.stats?.likes || 0;
            const videos = data.metrics?.videos?.approx || data.metrics?.videos || data.stats?.videos || 0;
            
            if (followers > 0) {
              accountsData.push({
                username: data.username || username.trim(),
                followers,
                following,
                likes,
                videos,
                engagementRate: data.metrics?.engagementRate || data.stats?.engagementRate || 0,
                avgViews: data.metrics?.avgViews || data.stats?.avgViews || 0,
                nickname: data.displayName || data.accountInfo?.nickname,
                photoUrl: data.profilePhotoUrl || data.accountInfo?.photoUrl,
                verified: data.verified || data.accountInfo?.verified,
              });
            } else {
              toast({
                title: t('Account not found', 'Akun tidak ditemukan'),
                description: t(`@${username.trim()} - Could not retrieve data`, `@${username.trim()} - Tidak bisa mengambil data`),
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: t('Failed to analyze', 'Gagal menganalisis'),
              description: t(`@${username.trim()} - Account may be private or not found`, `@${username.trim()} - Akun mungkin private atau tidak ditemukan`),
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: t('Error', 'Error'),
            description: t(`@${username.trim()} - Network error`, `@${username.trim()} - Error jaringan`),
            variant: 'destructive',
          });
        }
      }

      if (accountsData.length < 2) {
        toast({
          title: t('Not enough data', 'Data tidak cukup'),
          description: t('Need at least 2 valid accounts to compare. Please try different usernames.', 'Butuh minimal 2 akun valid untuk dibandingkan. Silakan coba username lain.'),
          variant: 'destructive',
        });
        return;
      }

      const winner = accountsData.reduce((prev, curr) => 
        curr.followers > prev.followers ? curr : prev
      );

      const insights = generateInsights(accountsData, language);

      setResults({
        accounts: accountsData,
        winner: winner.username,
        insights,
      });

      trackFeatureUsage('comparison', 'tiktok', { count: accountsData.length });

      toast({
        title: t('Comparison Complete!', 'Perbandingan Selesai!'),
        description: t(`Analyzed ${accountsData.length} accounts`, `Menganalisis ${accountsData.length} akun`),
      });

    } catch (error: any) {
      toast({
        title: t('Analysis Failed', 'Analisis Gagal'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = (accounts: AccountData[], lang: string): string[] => {
    const insights: string[] = [];
    const isId = lang === 'id';
    
    const sorted = [...accounts].sort((a, b) => b.followers - a.followers);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    insights.push(
      isId 
        ? `@${top.username} punya followers terbanyak (${formatNumber(top.followers)}) - ${Math.round((top.followers / bottom.followers) * 100 - 100)}% lebih banyak dari @${bottom.username}`
        : `@${top.username} has the most followers (${formatNumber(top.followers)}) - ${Math.round((top.followers / bottom.followers) * 100 - 100)}% more than @${bottom.username}`
    );

    const bestEngagement = accounts.reduce((prev, curr) => 
      curr.engagementRate > prev.engagementRate ? curr : prev
    );
    insights.push(
      isId
        ? `@${bestEngagement.username} punya engagement rate terbaik (${bestEngagement.engagementRate.toFixed(1)}%)`
        : `@${bestEngagement.username} has the best engagement rate (${bestEngagement.engagementRate.toFixed(1)}%)`
    );

    const mostActive = accounts.reduce((prev, curr) => 
      curr.videos > prev.videos ? curr : prev
    );
    insights.push(
      isId
        ? `@${mostActive.username} paling aktif dengan ${mostActive.videos} video`
        : `@${mostActive.username} is the most active with ${mostActive.videos} videos`
    );

    const avgFollowers = accounts.reduce((sum, a) => sum + a.followers, 0) / accounts.length;
    insights.push(
      isId
        ? `Rata-rata followers: ${formatNumber(avgFollowers)}`
        : `Average followers: ${formatNumber(avgFollowers)}`
    );

    return insights;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const getComparisonIcon = (value: number, max: number, min: number) => {
    if (value === max) return <ArrowUp className="w-3 h-3 text-green-400" />;
    if (value === min) return <ArrowDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/20">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t('Competitor Analysis', 'Analisis Kompetitor')}
              </CardTitle>
              <CardDescription>
                {t('Compare up to 5 TikTok accounts side by side', 'Bandingkan hingga 5 akun TikTok')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {usernames.map((username, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <SiTiktok className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                  <Input
                    value={username}
                    onChange={(e) => updateUsername(index, e.target.value)}
                    placeholder={`@username${index + 1}`}
                    className="pl-10 bg-gray-900/50"
                  />
                </div>
                {usernames.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUsername(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {usernames.length < 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addUsername}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('Add Account', 'Tambah Akun')}
              </Button>
            )}
            <span className="text-xs text-muted-foreground">
              {usernames.length}/5 {t('accounts', 'akun')}
            </span>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || usernames.filter(u => u.trim()).length < 2}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('Comparing...', 'Membandingkan...')}
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('Compare Accounts', 'Bandingkan Akun')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-cyan-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                {t('Comparison Results', 'Hasil Perbandingan')}
              </CardTitle>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                {t('Winner:', 'Pemenang:')} @{results.winner}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 px-3">{t('Account', 'Akun')}</th>
                    <th className="text-right py-2 px-3">{t('Followers', 'Followers')}</th>
                    <th className="text-right py-2 px-3">{t('Likes', 'Likes')}</th>
                    <th className="text-right py-2 px-3">{t('Videos', 'Video')}</th>
                    <th className="text-right py-2 px-3">{t('Engagement', 'Engagement')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.accounts.map((account, idx) => {
                    const maxFollowers = Math.max(...results.accounts.map(a => a.followers));
                    const minFollowers = Math.min(...results.accounts.map(a => a.followers));
                    const isWinner = account.username === results.winner;
                    
                    return (
                      <tr 
                        key={account.username} 
                        className={`border-b border-gray-800/50 ${isWinner ? 'bg-yellow-500/5' : ''}`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                            <span className="font-medium">@{account.username}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            {formatNumber(account.followers)}
                            {getComparisonIcon(account.followers, maxFollowers, minFollowers)}
                          </div>
                        </td>
                        <td className="text-right py-3 px-3">{formatNumber(account.likes)}</td>
                        <td className="text-right py-3 px-3">{account.videos}</td>
                        <td className="text-right py-3 px-3">
                          <Badge variant={account.engagementRate > 2 ? 'default' : 'secondary'}>
                            {account.engagementRate.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                {t('Key Insights', 'Insight Utama')}
              </h4>
              <ul className="space-y-2">
                {results.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
