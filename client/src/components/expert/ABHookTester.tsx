import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { 
  Zap, 
  Plus, 
  X, 
  Trophy,
  Target,
  TrendingUp,
  Lightbulb,
  Loader2,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { AnalysisDiscussion } from '../AnalysisDiscussion';

interface HookInput {
  id: string;
  text: string;
}

interface HookResult {
  hookId: string;
  hookText: string;
  score: number;
  viralPotential: 'high' | 'medium' | 'low';
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

interface ABTestResult {
  results: HookResult[];
  winner: string;
  winnerScore: number;
  comparison: string;
}

export function ABHookTester() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [hooks, setHooks] = useState<HookInput[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ABTestResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addHook = () => {
    if (hooks.length >= 5) {
      toast({
        title: t('Maximum 5 hooks', 'Maksimal 5 hook'),
        variant: 'destructive',
      });
      return;
    }
    setHooks([...hooks, { id: Date.now().toString(), text: '' }]);
  };

  const removeHook = (id: string) => {
    if (hooks.length <= 2) {
      toast({
        title: t('Minimum 2 hooks required', 'Minimal 2 hook diperlukan'),
        variant: 'destructive',
      });
      return;
    }
    setHooks(hooks.filter(h => h.id !== id));
    setResult(null);
  };

  const updateHook = (id: string, text: string) => {
    setHooks(hooks.map(h => h.id === id ? { ...h, text } : h));
    setResult(null);
  };

  const copyHook = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: t('Copied!', 'Disalin!'),
    });
  };

  const testHooks = async () => {
    const validHooks = hooks.filter(h => h.text.trim().length > 0);
    
    if (validHooks.length < 2) {
      toast({
        title: t('Enter at least 2 hooks', 'Masukkan minimal 2 hook'),
        description: t('Write your hook variations to compare', 'Tulis variasi hook untuk dibandingkan'),
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hooks: validHooks.map(h => ({ id: h.id, text: h.text })),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(t('Failed to analyze hooks', 'Gagal menganalisis hook'));
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(t('No analysis results', 'Tidak ada hasil analisis'));
      }

      setResult(data);

      toast({
        title: t('Analysis Complete!', 'Analisis Selesai!'),
        description: t('See which hook performs best', 'Lihat hook mana yang terbaik'),
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

  const getViralColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getViralLabel = (potential: string) => {
    switch (potential) {
      case 'high': return t('High Viral Potential', 'Potensi Viral Tinggi');
      case 'medium': return t('Medium Potential', 'Potensi Sedang');
      case 'low': return t('Low Potential', 'Potensi Rendah');
      default: return potential;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {t('A/B Hook Tester', 'A/B Hook Tester')}
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          {t('Compare hook variations - Ai picks the winner', 'Bandingkan variasi hook - Ai pilih yang terbaik')}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {t(
            'Know which hook will grab attention before you publish. Stop guessing, start winning.',
            'Tau hook mana yang akan menarik perhatian sebelum publish. Berhenti nebak, mulai menang.'
          )}
        </p>
      </div>

      {/* Hook Inputs */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center justify-between">
            <span>{t('Enter Your Hook Variations', 'Masukkan Variasi Hook')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={addHook}
              disabled={hooks.length >= 5}
              className="text-pink-400 hover:text-pink-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('Add Hook', 'Tambah Hook')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hooks.map((hook, index) => (
            <div key={hook.id} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={index === 0 ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-700 text-gray-400'}>
                  {t('Hook', 'Hook')} {String.fromCharCode(65 + index)}
                </Badge>
                {hooks.length > 2 && (
                  <button
                    onClick={() => removeHook(hook.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Textarea
                value={hook.text}
                onChange={(e) => updateHook(hook.id, e.target.value)}
                placeholder={
                  language === 'id'
                    ? `Contoh: "POV: Kamu baru tau cara ini bisa bikin FYP..."`
                    : `Example: "POV: You just discovered this FYP hack..."`
                }
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
              />
            </div>
          ))}

          <Button
            onClick={testHooks}
            disabled={isAnalyzing || hooks.filter(h => h.text.trim()).length < 2}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('Analyzing...', 'Menganalisis...')}
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                {t('Test Hooks', 'Test Hook')}
              </>
            )}
          </Button>

          <AnalysisProgress 
            isAnalyzing={isAnalyzing} 
            duration={6000}
            steps={[
              t('Evaluating hook structures...', 'Mengevaluasi struktur hook...'),
              t('Analyzing viral potential...', 'Menganalisis potensi viral...'),
              t('Comparing effectiveness...', 'Membandingkan efektivitas...'),
              t('Determining winner...', 'Menentukan pemenang...'),
              t('Generating suggestions...', 'Membuat saran...'),
            ]}
          />
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Winner Banner */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-400 font-medium mb-1">
                    {t('Winner: Hook', 'Pemenang: Hook')} {result.winner}
                  </p>
                  <p className="text-white text-lg font-semibold">
                    {t('Score', 'Skor')}: <span className="text-yellow-400">{result.winnerScore}/100</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{result.comparison}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Results */}
          <div className="grid gap-4">
            {result.results.map((hookResult, index) => {
              const isWinner = hookResult.hookId === result.results.sort((a, b) => b.score - a.score)[0].hookId;
              
              return (
                <Card
                  key={hookResult.hookId}
                  className={`bg-gray-900/50 ${
                    isWinner ? 'border-yellow-500/30' : 'border-gray-800'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={isWinner ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}>
                          {t('Hook', 'Hook')} {String.fromCharCode(65 + index)}
                        </Badge>
                        {isWinner && <Trophy className="w-4 h-4 text-yellow-400" />}
                        <Badge className={getViralColor(hookResult.viralPotential)}>
                          {getViralLabel(hookResult.viralPotential)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyHook(hookResult.hookText, hookResult.hookId)}
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          {copiedId === hookResult.hookId ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <span className={`text-2xl font-bold ${getScoreColor(hookResult.score)}`}>
                          {hookResult.score}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 p-3 bg-gray-800/50 rounded-lg">
                      "{hookResult.hookText}"
                    </p>

                    <div className="mb-3">
                      <Progress 
                        value={hookResult.score} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-400 font-medium mb-2 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {t('Strengths', 'Kekuatan')}
                        </p>
                        <ul className="space-y-1">
                          {hookResult.strengths.map((s, i) => (
                            <li key={i} className="text-gray-400 flex items-start gap-1">
                              <span className="text-green-400">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-medium mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          {t('To Improve', 'Perbaikan')}
                        </p>
                        <ul className="space-y-1">
                          {hookResult.weaknesses.map((w, i) => (
                            <li key={i} className="text-gray-400 flex items-start gap-1">
                              <span className="text-yellow-400">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                      <p className="text-pink-400 text-sm font-medium mb-1">
                        {t('Ai Suggestion', 'Saran Ai')}
                      </p>
                      <p className="text-gray-300 text-sm">{hookResult.suggestion}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Discussion Chat */}
          <AnalysisDiscussion
            analysisType="hook"
            analysisContext={`A/B Hook Test Results:
- Winner: Hook ${result.winner} (Score: ${result.winnerScore}/100)
- Comparison: ${result.comparison}

Hook Scores:
${result.results.map(r => `- Hook ${r.hookId}: "${r.hookText.substring(0, 50)}..." - Score: ${r.score}/100, Viral: ${r.viralPotential}`).join('\n')}

Strengths & Weaknesses:
${result.results.map(r => `Hook ${r.hookId}: Strengths: ${r.strengths.join(', ')}. Weaknesses: ${r.weaknesses.join(', ')}`).join('\n')}`}
            mode="tiktok"
          />
        </div>
      )}
    </div>
  );
}
