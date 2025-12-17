import { useState, useRef } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye,
  Clock,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';
import { canUseVideoAnalysis, incrementVideoUsage, getDailyLimit } from '@/lib/usageLimit';

interface AnalysisResult {
  overallScore: number;
  hookStrength: number;
  visualQuality: number;
  audioClarity: number;
  engagement: number;
  retention: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const analysisCategories = [
  { key: 'hookStrength', icon: Zap, labelEn: 'Hook Strength', labelId: 'Kekuatan Hook', color: 'from-yellow-500 to-orange-500' },
  { key: 'visualQuality', icon: Eye, labelEn: 'Visual Quality', labelId: 'Kualitas Visual', color: 'from-blue-500 to-cyan-500' },
  { key: 'audioClarity', icon: MessageSquare, labelEn: 'Audio/Text Clarity', labelId: 'Kejelasan Audio/Teks', color: 'from-green-500 to-emerald-500' },
  { key: 'engagement', icon: Heart, labelEn: 'Engagement Potential', labelId: 'Potensi Engagement', color: 'from-pink-500 to-rose-500' },
  { key: 'retention', icon: Clock, labelEn: 'Retention Score', labelId: 'Skor Retensi', color: 'from-purple-500 to-violet-500' },
];

export function VideoAnalyzerPanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  };

  const analyzeContent = async () => {
    if (!uploadedFile) return;
    
    if (!canUseVideoAnalysis()) {
      toast({
        title: t('Daily limit reached', 'Limit harian tercapai'),
        description: t(
          `You've used all ${getDailyLimit()} video analyses for today. Upgrade to Premium for more!`,
          `Kamu sudah menggunakan ${getDailyLimit()} analisis video hari ini. Upgrade ke Premium untuk lebih banyak!`
        ),
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('description', description || 'TikTok video content');
      formData.append('mode', 'tiktok');
      
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(t('Analysis failed', 'Analisis gagal'));
      }
      
      const data = await response.json();
      
      // Handle both new format (analysis with 8-layer) and legacy format (result)
      const analysisData = data.analysis || data.result;
      
      if (analysisData && analysisData.overallScore !== undefined) {
        // Extract scores from 8-layer format if available
        const layers = analysisData.layers || [];
        const getLayerScore = (keyword: string) => {
          const layer = layers.find((l: any) => l.layer?.toLowerCase().includes(keyword.toLowerCase()));
          return layer ? layer.score * 10 : 70; // Convert 1-10 to percentage, default 70
        };
        
        // Safely extract recommendations (can be array or object)
        let recommendations: string[] = [];
        if (Array.isArray(analysisData.recommendations)) {
          recommendations = analysisData.recommendations;
        } else if (typeof analysisData.recommendations === 'object' && analysisData.recommendations) {
          // Extract from nested object (e.g., {fyp: [], engagement: []})
          recommendations = Object.values(analysisData.recommendations).flat().filter((r): r is string => typeof r === 'string').slice(0, 5);
        }
        
        // Extract strengths from layers if not directly available
        const strengths = analysisData.strengths || layers
          .filter((l: any) => l.score >= 7)
          .slice(0, 3)
          .map((l: any) => l.feedback?.substring(0, 150) || `${l.layer}: Good performance`);
        
        // Extract improvements from layers with low scores
        const improvements = analysisData.improvements || layers
          .filter((l: any) => l.score < 7)
          .slice(0, 3)
          .map((l: any) => l.feedback?.substring(0, 150) || `${l.layer}: Needs improvement`);
        
        setAnalysisResult({
          overallScore: analysisData.overallScore,
          hookStrength: analysisData.hookStrength || getLayerScore('vbm') || 70,
          visualQuality: analysisData.visualQuality || getLayerScore('visual') || 70,
          audioClarity: analysisData.audioClarity || getLayerScore('nlp') || 70,
          engagement: analysisData.engagement || getLayerScore('soc') || 70,
          retention: analysisData.retention || getLayerScore('cog') || 70,
          strengths,
          improvements,
          recommendations,
        });
        incrementVideoUsage();
      } else {
        throw new Error(t('Analysis incomplete - please try again', 'Analisis tidak lengkap - silakan coba lagi'));
      }
    } catch (error: any) {
      toast({
        title: t('Analysis Failed', 'Analisis Gagal'),
        description: error.message || t('Could not analyze content', 'Tidak bisa menganalisis konten'),
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('Excellent', 'Excellent');
    if (score >= 70) return t('Good', 'Bagus');
    if (score >= 60) return t('Average', 'Rata-rata');
    return t('Needs Work', 'Perlu Perbaikan');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="w-5 h-5 text-cyan-400" />
            {t('Upload Content for Analysis', 'Upload Konten untuk Analisis')}
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">
            {t(
              'Get AI-powered breakdown: Hook strength, visual quality, engagement potential & personalized tips to boost your content.',
              'Dapatkan analisis AI: Kekuatan hook, kualitas visual, potensi engagement & tips personal untuk boost kontenmu.'
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {previewUrl ? (
              <div className="space-y-4">
                {uploadedFile?.type.startsWith('video/') ? (
                  <video src={previewUrl} className="max-h-64 mx-auto rounded-lg" controls />
                ) : (
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                )}
                <p className="text-sm text-gray-400">{uploadedFile?.name}</p>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setPreviewUrl(null); setAnalysisResult(null); }}>
                  {t('Remove', 'Hapus')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center gap-4">
                  <div className="p-4 bg-gray-800 rounded-full">
                    <Image className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="p-4 bg-gray-800 rounded-full">
                    <Video className="w-8 h-8 text-pink-400" />
                  </div>
                </div>
                <p className="text-gray-400">
                  {t('Drag & drop screenshot or video, or click to browse', 'Drag & drop screenshot atau video, atau klik untuk browse')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('Supports: JPG, PNG, MP4, MOV (max 50MB)', 'Format: JPG, PNG, MP4, MOV (maks 50MB)')}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              {t('Additional Context (optional)', 'Konteks Tambahan (opsional)')}
            </label>
            <Textarea
              placeholder={t('Describe your content, target audience, or specific questions...', 'Jelaskan konten, target audiens, atau pertanyaan spesifik...')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800/50 border-gray-700 min-h-[80px]"
            />
          </div>

          <Button
            onClick={analyzeContent}
            disabled={!uploadedFile || isAnalyzing}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                {t('Analyzing...', 'Menganalisis...')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('Analyze Content', 'Analisis Konten')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  {t('Overall Score', 'Skor Keseluruhan')}
                </span>
                <div className="text-right">
                  <span className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                    {analysisResult.overallScore}
                  </span>
                  <span className="text-gray-400 text-lg">/100</span>
                  <Badge className="ml-2" variant="outline">
                    {getScoreLabel(analysisResult.overallScore)}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisCategories.map((cat) => {
                  const score = analysisResult[cat.key as keyof AnalysisResult] as number || 0;
                  const Icon = cat.icon;
                  return (
                    <div key={cat.key} className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{t(cat.labelEn, cat.labelId)}</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  {t('Strengths', 'Kekuatan')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-400">
                  <AlertTriangle className="w-5 h-5" />
                  {t('Areas to Improve', 'Area untuk Diperbaiki')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.improvements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-cyan-400">
                <Lightbulb className="w-5 h-5" />
                {t('Recommendations', 'Rekomendasi')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                    <div className="p-1.5 bg-cyan-500/20 rounded-full">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <p className="font-medium text-purple-200">
                {t('Pro Tip: First Frame Matters Most', 'Pro Tip: Frame Pertama Paling Penting')}
              </p>
              <p className="text-sm text-purple-300/70 mt-1">
                {t(
                  'TikTok users decide to scroll or stay within 0.3-0.5 seconds. Your thumbnail and opening hook are critical for retention.',
                  'Pengguna TikTok memutuskan untuk scroll atau stay dalam 0.3-0.5 detik. Thumbnail dan opening hook sangat krusial untuk retensi.'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
