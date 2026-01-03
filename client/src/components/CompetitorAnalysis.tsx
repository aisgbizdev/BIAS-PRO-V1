import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Users, TrendingUp, Trophy, Loader2, ArrowUp, ArrowDown, Minus, History, Eye, Trash2, ChevronDown, ChevronUp, MessageCircle, Send, Bot, Sparkles } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { trackFeatureUsage } from '@/lib/analytics';
import { 
  saveComparisonToHistory, 
  getComparisonHistory, 
  deleteComparisonFromHistory,
  type ComparisonHistoryItem,
  type ComparisonResult 
} from '@/lib/comparisonHistory';

// Helper to safely extract numeric value from MetricValue objects or primitives
function getMetricValue(metric: any): number {
  if (metric === null || metric === undefined) return 0;
  if (typeof metric === 'number') return metric;
  if (typeof metric === 'object' && 'approx' in metric) {
    return typeof metric.approx === 'number' ? metric.approx : 0;
  }
  return 0;
}

// Format large numbers (e.g., 1.5M, 2.3K)
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

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


export function CompetitorAnalysis() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [usernames, setUsernames] = useState<string[]>(['', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [discussionMessages, setDiscussionMessages] = useState<{id: string, type: 'user' | 'assistant', content: string}[]>([]);
  const [discussionInput, setDiscussionInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const loadHistory = useCallback(() => {
    const items = getComparisonHistory();
    setHistory(items);
  }, []);

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener('bias-comparison-updated', handleUpdate);
    return () => window.removeEventListener('bias-comparison-updated', handleUpdate);
  }, [loadHistory]);

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
            // Handle both old (stats) and new (metrics with MetricValue objects) API response formats
            const followers = getMetricValue(data.metrics?.followers) || getMetricValue(data.stats?.followers);
            const following = getMetricValue(data.metrics?.following) || getMetricValue(data.stats?.following);
            const likes = getMetricValue(data.metrics?.likes) || getMetricValue(data.stats?.likes);
            const videos = getMetricValue(data.metrics?.videos) || getMetricValue(data.stats?.videos);
            const engagementRate = getMetricValue(data.metrics?.engagementRate) || getMetricValue(data.stats?.engagementRate);
            const avgViews = getMetricValue(data.metrics?.avgViews) || getMetricValue(data.stats?.avgViews);
            
            if (followers > 0) {
              accountsData.push({
                username: data.username || username.trim(),
                followers,
                following,
                likes,
                videos,
                engagementRate,
                avgViews,
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

      const comparisonResult: ComparisonResult = {
        accounts: accountsData,
        winner: winner.username,
        insights,
      };

      setResults(comparisonResult);
      setShowDiscussion(true);
      setDiscussionMessages([]);

      saveComparisonToHistory(comparisonResult, validUsernames);

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

  const handleDeleteHistory = (id: string) => {
    const success = deleteComparisonFromHistory(id);
    if (success) {
      toast({
        title: t('Deleted', 'Terhapus'),
        description: t('Comparison removed from history', 'Perbandingan dihapus dari riwayat'),
      });
    }
  };

  const handleViewHistoryItem = (item: ComparisonHistoryItem) => {
    setResults(item.result);
    setExpandedHistoryId(null);
    setShowDiscussion(true);
    setDiscussionMessages([]);
    document.getElementById('comparison-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscussionSend = async () => {
    if (!discussionInput.trim() || !results) return;
    
    const userMessage = { id: Date.now().toString(), type: 'user' as const, content: discussionInput };
    setDiscussionMessages(prev => [...prev, userMessage]);
    const userInput = discussionInput;
    setDiscussionInput('');
    setIsTyping(true);

    try {
      // Build context for first message only
      const isFirstMessage = discussionMessages.length === 0;
      const context = isFirstMessage ? `
Hasil Perbandingan Akun TikTok:
- Pemenang: @${results.winner}
- Akun: ${results.accounts.map(a => `@${a.username} (${formatNumber(a.followers)} followers, ${a.engagementRate.toFixed(1)}% engagement)`).join(', ')}
- Insights: ${results.insights.join('; ')}
      ` : '';

      // Build conversation history for context continuity
      const conversationHistory = discussionMessages.map(msg => ({
        role: msg.type as 'user' | 'assistant',
        content: msg.content
      }));

      const sessionId = localStorage.getItem('biasSessionId') || 'anonymous';
      const response = await fetch('/api/chat/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: isFirstMessage ? `${userInput}\n\n[CONTEXT: Competitor Analysis]\n${context}` : userInput,
          sessionId,
          mode: 'expert',
          conversationHistory, // Send full conversation history for context
        })
      });

      const data = await response.json();
      let finalResponse = data.response || t('Sorry, could not get a response.', 'Maaf, tidak bisa mendapatkan respon.');
      
      // Add source indicator
      if (data.source === 'ai') {
        finalResponse += '\n\n---\n*✨ Fresh from BIAS Brain*';
      } else if (data.source === 'local' && !finalResponse.includes('⚠️')) {
        finalResponse += '\n\n---\n*📚 Dari Learning Library*';
      }
      
      const assistantMessage = { 
        id: (Date.now() + 1).toString(), 
        type: 'assistant' as const, 
        content: finalResponse
      };
      setDiscussionMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setDiscussionMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'assistant' as const, 
        content: t('Network error. Please try again.', 'Error jaringan. Silakan coba lagi.')
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickSuggestions = [
    { text: t('Why is this account winning?', 'Kenapa akun ini menang?'), icon: '🏆' },
    { text: t('How to beat the competition?', 'Gimana cara menang dari kompetitor?'), icon: '🎯' },
    { text: t('What makes their engagement high?', 'Apa yang bikin engagement mereka tinggi?'), icon: '📈' },
  ];

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

          <AnalysisProgress 
            isAnalyzing={isAnalyzing} 
            duration={10000}
            steps={[
              t('Fetching account data...', 'Mengambil data akun...'),
              t('Analyzing followers...', 'Menganalisis followers...'),
              t('Comparing engagement...', 'Membandingkan engagement...'),
              t('Calculating rankings...', 'Menghitung peringkat...'),
              t('Generating insights...', 'Membuat insights...'),
              t('Finalizing comparison...', 'Finalisasi perbandingan...'),
            ]}
          />
        </CardContent>
      </Card>

      {results && (
        <Card id="comparison-results" className="border-cyan-500/20">
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

      {/* Discussion Section - After Results */}
      {results && showDiscussion && (
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {t('Discuss Your Results', 'Diskusikan Hasilmu')}
                    <Badge variant="secondary" className="text-[10px] bg-purple-500/20 text-purple-300">AI Chat</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Ask BiAS AI about the comparison — get tips to improve!', 'Tanya BIAS Ai tentang perbandingan — dapatkan tips untuk improve!')}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDiscussion(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="min-h-[120px] max-h-[300px] overflow-y-auto space-y-3 p-3 rounded-lg bg-gray-900/50">
              {discussionMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Bot className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    {t('Have questions about the results? Ask me!', 'Punya pertanyaan tentang hasil? Tanya aku!')}
                  </p>
                </div>
              ) : (
                discussionMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'assistant' && <Bot className="w-5 h-5 text-purple-400 mt-1 shrink-0" />}
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.type === 'user' 
                        ? 'bg-pink-500/20 text-white' 
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex gap-2 items-center">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-gray-900/50 border-gray-700 hover:bg-purple-500/10 hover:border-purple-500/50"
                  onClick={() => setDiscussionInput(suggestion.text)}
                >
                  <span className="mr-1">{suggestion.icon}</span>
                  {suggestion.text}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                placeholder={t('Ask about the comparison...', 'Tanya tentang perbandingan...')}
                className="flex-1 bg-gray-900/50"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleDiscussionSend()}
              />
              <Button 
                onClick={handleDiscussionSend} 
                disabled={!discussionInput.trim() || isTyping}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <Card className="border-gray-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-gray-400" />
              <div>
                <CardTitle className="text-base">
                  {t('Comparison History', 'Riwayat Perbandingan')}
                  <Badge variant="secondary" className="ml-2 text-[10px]">{history.length}</Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Click to view full results (max 3 saved)', 'Klik untuk lihat hasil lengkap (max 3 tersimpan)')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => setExpandedHistoryId(expandedHistoryId === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-3">
                    <SiTiktok className="w-4 h-4 text-pink-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {item.usernames.map(u => `@${u}`).join(' vs ')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.timestamp.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        <span className="ml-2 text-yellow-500">🏆 @{item.result.winner}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleViewHistoryItem(item); }}>
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                    {expandedHistoryId === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded View */}
                {expandedHistoryId === item.id && (
                  <div className="border-t border-gray-800 p-3 bg-gray-900/30 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {item.result.accounts.map((acc) => (
                        <div key={acc.username} className={`p-2 rounded-lg ${acc.username === item.result.winner ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-800/50'}`}>
                          <p className="font-medium flex items-center gap-1">
                            {acc.username === item.result.winner && <Trophy className="w-3 h-3 text-yellow-500" />}
                            @{acc.username}
                          </p>
                          <p className="text-gray-400">{formatNumber(acc.followers)} followers</p>
                          <p className="text-gray-400">{acc.engagementRate.toFixed(1)}% eng</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-cyan-400">{t('Insights:', 'Insight:')}</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {item.result.insights.slice(0, 2).map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-pink-400">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
