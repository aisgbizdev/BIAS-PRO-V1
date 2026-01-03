import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, TrendingUp, MessageCircle, HelpCircle, Share2, Link2, Check, FileDown, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadarChart8Layer } from '@/components/RadarChart8Layer';
import { exportAnalysisToPDF } from '@/lib/pdfExport';
import { AnalysisDiscussion } from './AnalysisDiscussion';
import type { BiasAnalysisResult } from '@shared/schema';

const LAYER_TOOLTIPS: Record<string, { en: string; id: string }> = {
  'VBM': {
    en: 'Visual Behavior Mapping: Analyzes body language, gestures, facial expressions, and visual presence',
    id: 'Visual Behavior Mapping: Menganalisis bahasa tubuh, gestur, ekspresi wajah, dan kehadiran visual'
  },
  'EPM': {
    en: 'Emotional Processing Mapping: Evaluates emotional intelligence, empathy, and audience connection',
    id: 'Emotional Processing Mapping: Mengevaluasi kecerdasan emosional, empati, dan koneksi dengan audiens'
  },
  'NLP': {
    en: 'Narrative & Language Patterns: Examines storytelling structure, word choice, and message clarity',
    id: 'Narrative & Language Patterns: Memeriksa struktur cerita, pilihan kata, dan kejelasan pesan'
  },
  'ETH': {
    en: 'Ethical Framework: Assesses authenticity, transparency, and alignment with community guidelines',
    id: 'Ethical Framework: Menilai keaslian, transparansi, dan kepatuhan terhadap pedoman komunitas'
  },
  'ECO': {
    en: 'Ecosystem Awareness: Measures platform understanding, trend awareness, and algorithm optimization',
    id: 'Ecosystem Awareness: Mengukur pemahaman platform, kesadaran tren, dan optimasi algoritma'
  },
  'SOC': {
    en: 'Social Intelligence: Evaluates community engagement, interaction quality, and audience building',
    id: 'Social Intelligence: Mengevaluasi keterlibatan komunitas, kualitas interaksi, dan membangun audiens'
  },
  'COG': {
    en: 'Cognitive Load Management: Analyzes information pacing, complexity, and viewer comprehension',
    id: 'Cognitive Load Management: Menganalisis kecepatan informasi, kompleksitas, dan pemahaman penonton'
  },
  'BMIL': {
    en: 'Behavioral Micro-Indicators Library: Detects subtle behavioral patterns and communication signals',
    id: 'Behavioral Micro-Indicators Library: Mendeteksi pola perilaku halus dan sinyal komunikasi'
  }
};

interface AnalysisResultsProps {
  result: BiasAnalysisResult | null;
  onDiscussLayer?: (layerName: string) => void;
  mode?: 'tiktok' | 'marketing';
}

export function AnalysisResults({ result, onDiscussLayer, mode = 'tiktok' }: AnalysisResultsProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedLayers, setAnimatedLayers] = useState<Record<number, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Animate overall score on result change
  useEffect(() => {
    if (result) {
      setIsAnimating(true);
      setAnimatedScore(0);
      setAnimatedLayers({});

      // Animate overall score
      const targetScore = result.overallScore;
      const duration = 1500; // 1.5 seconds
      const steps = 30;
      const increment = targetScore / steps;
      let currentStep = 0;

      const scoreInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedScore(targetScore);
          clearInterval(scoreInterval);
          setIsAnimating(false);
        } else {
          setAnimatedScore(Math.floor(increment * currentStep));
        }
      }, duration / steps);

      // Animate layer scores with stagger (only if layers exist)
      if (result.layers && result.layers.length > 0) {
        result.layers.forEach((layer, idx) => {
          setTimeout(() => {
            const layerTargetScore = layer.score;
            const layerSteps = 20;
            const layerIncrement = layerTargetScore / layerSteps;
            let layerStep = 0;

            const layerInterval = setInterval(() => {
              layerStep++;
              if (layerStep >= layerSteps) {
                setAnimatedLayers(prev => ({ ...prev, [idx]: layerTargetScore }));
                clearInterval(layerInterval);
              } else {
                setAnimatedLayers(prev => ({ ...prev, [idx]: Math.floor(layerIncrement * layerStep) }));
              }
            }, 800 / layerSteps);
          }, idx * 100); // Stagger by 100ms
        });
      }

      return () => {
        clearInterval(scoreInterval);
      };
    }
  }, [result]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      toast({
        title: t('Link Copied!', 'Link Tersalin!'),
        description: t('Share this link with others', 'Bagikan link ini ke orang lain'),
      });
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const message = language === 'id'
      ? `Lihat hasil analisis BIAS saya! Skor: ${result.overallScore}/10\n\n${window.location.href}`
      : `Check out my BIAS analysis results! Score: ${result.overallScore}/10\n\n${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportPDF = async () => {
    if (!result) return;
    setIsExportingPDF(true);
    try {
      await exportAnalysisToPDF(result, { language: language as 'en' | 'id', mode });
      toast({
        title: t('PDF Downloaded!', 'PDF Terunduh!'),
        description: t('Your analysis has been saved as PDF', 'Analisis kamu sudah tersimpan sebagai PDF'),
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t('Export Failed', 'Export Gagal'),
        description: t('Please try again', 'Silakan coba lagi'),
        variant: 'destructive',
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (!result) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <TrendingUp className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-semibold text-lg">
              {t('Ready to Get Analyzed?', 'Siap Untuk Dianalisis?')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'Submit your content above to receive detailed behavioral intelligence insights across 8 layers of the BIAS framework.',
                'Submit konten kamu di atas untuk menerima wawasan behavioral intelligence detail dari 8 layer framework BIAS.'
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {t('Free unlimited access', 'Akses gratis unlimited')}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {t('Ai-powered analysis', 'Analisis bertenaga Ai')}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {t('Instant results', 'Hasil instan')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{t('Overall Score', 'Skor Keseluruhan')}</CardTitle>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">
                  AI-Generated Insight
                </Badge>
              </div>
              <CardDescription className="text-base mt-2">
                {language === 'en' ? result.summary : result.summaryId}
              </CardDescription>
            </div>
            <div 
              className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500 flex-shrink-0 font-mono"
              style={{
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {animatedScore}
            </div>
          </div>
          
          {/* Share Buttons */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground mr-2">
              {t('Share:', 'Bagikan:')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
              data-testid="button-copy-link"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-xs">{t('Copied!', 'Tersalin!')}</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span className="text-xs">{t('Copy Link', 'Salin Link')}</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWhatsApp}
              className="gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30"
              data-testid="button-share-whatsapp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="gap-2 bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30"
              data-testid="button-export-pdf"
            >
              {isExportingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span className="text-xs">{t('PDF', 'PDF')}</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Radar Chart Visualization - only show if layers exist */}
      {result.layers && result.layers.length > 0 && (
        <RadarChart8Layer 
          layers={result.layers}
          title={t('Behavioral Intelligence Radar', 'Radar Behavioral Intelligence')}
          description={t('Visual representation of your 8-layer analysis', 'Representasi visual dari analisis 8-layer Anda')}
        />
      )}

      {/* Layer Scores - only show if layers exist */}
      {result.layers && result.layers.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>{t('Layer Details', 'Detail Layer')}</CardTitle>
          <CardDescription>
            {t(
              'Detailed breakdown across BIAS framework',
              'Rincian detail dari framework BIAS'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.layers.map((layer, idx) => {
            const layerKey = layer.layer.split(' ')[0];
            const tooltip = LAYER_TOOLTIPS[layerKey];
            
            const currentAnimatedScore = animatedLayers[idx] ?? 0;
            
            return (
              <div 
                key={idx} 
                className="space-y-2 transition-all duration-500 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/5"
                style={{
                  opacity: currentAnimatedScore > 0 ? 1 : 0,
                  transform: currentAnimatedScore > 0 ? 'translateY(0)' : 'translateY(10px)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${layer.score >= 7 ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    <span className="font-medium text-sm truncate">{layer.layer}</span>
                    {tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{language === 'id' ? tooltip.id : tooltip.en}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={layer.score >= 7 ? 'default' : 'secondary'} className="font-mono">
                      {currentAnimatedScore}/10
                    </Badge>
                    {onDiscussLayer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDiscussLayer(layer.layer)}
                        className="gap-1.5 h-7"
                        data-testid={`button-discuss-${layer.layer}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-xs">
                          {t('Ask', 'Tanya')}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={currentAnimatedScore * 10} className="h-2 transition-all duration-300" />
                <p className="text-sm text-muted-foreground pl-6">
                  {language === 'id' && layer.feedbackId ? layer.feedbackId : layer.feedback}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      )}

      {/* Recommendations */}
      {(result.recommendations || result.recommendationsId) && (
      <Card>
        <CardHeader>
          <CardTitle>{t('Recommendations', 'Rekomendasi')}</CardTitle>
          <CardDescription>
            {t('Action items to improve your performance', 'Langkah untuk tingkatkan performa kamu')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(language === 'en' ? (result.recommendations || []) : (result.recommendationsId || result.recommendations || [])).map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      )}

      {/* Discussion Chat */}
      <AnalysisDiscussion
        analysisResult={result}
        analysisType="video"
        mode={mode}
      />
    </div>
  );
}
