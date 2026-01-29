import { useState, useRef } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { 
  Upload, 
  X, 
  Play, 
  TrendingUp, 
  TrendingDown,
  Minus,
  FileVideo,
  BarChart3,
  AlertCircle,
  MessageSquare,
  Brain,
  Sparkles
} from 'lucide-react';
import { getRemainingVideoAnalysis, incrementVideoUsage } from '@/lib/usageLimit';
import { AnalysisDiscussion } from '../AnalysisDiscussion';

interface VideoFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface VideoAnalysisResult {
  videoId: string;
  videoName: string;
  overallScore: number;
  hookStrength: number;
  visualQuality: number;
  engagement: number;
  retention: number;
  strengths: string[];
  improvements: string[];
  layers?: any[];
  transcriptionPreview?: string;
}

interface CompetitiveComparison {
  overallWinner: {
    videoName: string;
    reason: string;
  };
  dimensionWinners: Array<{
    dimension: string;
    winner: string;
    reason: string;
  }>;
  pairwiseComparisons: Array<{
    pair: string;
    verdict: string;
  }>;
  sharedWeaknesses: string[];
  winningCombo: {
    recommendation: string;
    nextAction: string;
  };
}

interface BatchResult {
  results: VideoAnalysisResult[];
  bestPerformer: string;
  worstPerformer: string;
  averageScore: number;
  insights: string[];
  comparison?: CompetitiveComparison;
}

export function BatchAnalysis() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => 
      f.type.startsWith('video/')
    ).slice(0, 3); // Max 3 video files only

    const newVideos: VideoFile[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, '').substring(0, 30),
    }));

    setVideos(prev => [...prev, ...newVideos].slice(0, 3));
    setBatchResult(null);
  };

  const removeVideo = (id: string) => {
    setVideos(prev => {
      const video = prev.find(v => v.id === id);
      if (video) URL.revokeObjectURL(video.preview);
      return prev.filter(v => v.id !== id);
    });
    setBatchResult(null);
  };

  const clearAll = () => {
    videos.forEach(v => URL.revokeObjectURL(v.preview));
    setVideos([]);
    setBatchResult(null);
  };

  const analyzeBatch = async () => {
    if (videos.length < 2) {
      toast({
        title: t('Minimum 2 videos required', 'Minimal 2 video diperlukan'),
        description: t('Upload at least 2 videos to compare', 'Upload minimal 2 video untuk dibandingkan'),
        variant: 'destructive',
      });
      return;
    }

    const remaining = getRemainingVideoAnalysis();
    if (remaining < videos.length) {
      toast({
        title: t('Insufficient daily limit', 'Limit harian tidak cukup'),
        description: t(
          `You have ${remaining} analysis left today, but selected ${videos.length} videos. Upgrade to Premium for more!`,
          `Kamu punya ${remaining} analisis tersisa hari ini, tapi memilih ${videos.length} video. Upgrade ke Premium untuk lebih banyak!`
        ),
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setBatchResult(null);

    try {
      const results: VideoAnalysisResult[] = [];

      for (let i = 0; i < videos.length; i++) {
        setCurrentVideoIndex(i);
        setProgress(Math.round(((i + 0.5) / videos.length) * 100));

        const formData = new FormData();
        formData.append('file', videos[i].file);
        formData.append('description', videos[i].name);
        formData.append('mode', 'tiktok');

        const response = await fetch('/api/analyze-video', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to analyze ${videos[i].name}`);
        }

        const data = await response.json();
        const analysisData = data.analysis || data.result;
        
        if (analysisData) {
          const overallScore = analysisData.overallScore ?? analysisData.score ?? 
            (analysisData.layers ? Math.round(analysisData.layers.reduce((sum: number, l: any) => sum + (l.score || 0), 0) / analysisData.layers.length) : 70);
          
          const strengths: string[] = [];
          const improvements: string[] = [];
          
          if (analysisData.layers && Array.isArray(analysisData.layers)) {
            analysisData.layers.forEach((layer: any) => {
              if (layer.strengths) strengths.push(...(Array.isArray(layer.strengths) ? layer.strengths : [layer.strengths]));
              if (layer.weaknesses) improvements.push(...(Array.isArray(layer.weaknesses) ? layer.weaknesses : [layer.weaknesses]));
            });
          }
          
          results.push({
            videoId: videos[i].id,
            videoName: videos[i].name,
            overallScore,
            hookStrength: analysisData.hookStrength || analysisData.layers?.find((l: any) => l.layer?.includes('VBM'))?.score || 70,
            visualQuality: analysisData.visualQuality || analysisData.layers?.find((l: any) => l.layer?.includes('NLP'))?.score || 70,
            engagement: analysisData.engagement || analysisData.layers?.find((l: any) => l.layer?.includes('EPM'))?.score || 70,
            retention: analysisData.retention || analysisData.layers?.find((l: any) => l.layer?.includes('COG'))?.score || 70,
            strengths: strengths.slice(0, 3),
            improvements: improvements.slice(0, 3),
            layers: analysisData.layers || [],
            transcriptionPreview: analysisData.transcriptionPreview || '',
          });
          incrementVideoUsage();
        }

        setProgress(Math.round(((i + 1) / videos.length) * 80)); // 80% for individual analyses
      }

      if (results.length === 0) {
        throw new Error(t('No videos could be analyzed', 'Tidak ada video yang bisa dianalisis'));
      }

      // Step 2: Call competitive comparison API
      console.log('🔄 Starting competitive comparison for', results.length, 'videos');
      setProgress(85);
      let comparison: CompetitiveComparison | undefined;
      
      try {
        const comparePayload = {
          videos: results.map(r => ({
            name: r.videoName,
            overallScore: r.overallScore,
            layers: r.layers,
            transcriptionPreview: r.transcriptionPreview,
          })),
          language: language === 'id' ? 'id' : 'en',
        };
        
        console.log('📤 Sending comparison payload:', JSON.stringify(comparePayload).substring(0, 500));

        const compareResponse = await fetch('/api/compare-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comparePayload),
        });

        console.log('📥 Compare response status:', compareResponse.status);

        if (compareResponse.ok) {
          const compareData = await compareResponse.json();
          console.log('✅ Comparison data received:', compareData.comparison ? 'YES' : 'NO');
          comparison = compareData.comparison;
        } else {
          console.log('❌ Compare response not OK:', await compareResponse.text());
        }
      } catch (compareError) {
        console.log('❌ Competitive comparison failed:', compareError);
      }

      setProgress(100);

      // Calculate batch insights
      const sortedByScore = [...results].sort((a, b) => b.overallScore - a.overallScore);
      const avgScore = Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length);

      const insights = generateInsights(results, language);

      setBatchResult({
        results: sortedByScore,
        bestPerformer: sortedByScore[0].videoName,
        worstPerformer: sortedByScore[sortedByScore.length - 1].videoName,
        averageScore: avgScore,
        insights,
        comparison,
      });

      toast({
        title: t('Batch Analysis Complete!', 'Analisis Batch Selesai!'),
        description: comparison 
          ? t(`${results.length} videos analyzed & compared`, `${results.length} video dianalisis & dibandingkan`)
          : t(`${results.length} videos analyzed`, `${results.length} video dianalisis`),
      });

    } catch (error: any) {
      toast({
        title: t('Analysis Failed', 'Analisis Gagal'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const getTrendIcon = (score: number, avg: number) => {
    if (score > avg + 5) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (score < avg - 5) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {t('Batch Analysis', 'Analisis Batch')}
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          {t('Upload multiple videos to compare performance', 'Upload beberapa video untuk bandingkan performa')}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {t(
            'Find your best performer, spot patterns, get insights to replicate success.',
            'Temukan konten terbaik, kenali pola, dapat insight untuk duplikasi kesuksesan.'
          )}
        </p>
      </div>

      {/* Upload Area - Matching Video tab design */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500/50 transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:brightness-125 transition-all duration-300">
              <Upload className="w-7 h-7 text-pink-400" />
            </div>
            <p className="text-gray-300 mb-1">
              {t('Click to upload or drag & drop', 'Klik untuk upload atau drag & drop')}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {t('Video TikTok (Max 200MB per file, max 3 videos)', 'Video TikTok (Maks 200MB per file, maks 3 video)')}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <FileVideo className="w-4 h-4" />
              {t('Select Videos', 'Pilih Video')}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Video Grid */}
      {videos.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">
              {t('Selected Videos', 'Video Dipilih')} ({videos.length}/3)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-400">
              {t('Clear All', 'Hapus Semua')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videos.map((video, index) => (
                <div key={video.id} className="relative group">
                  <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-800">
                    {video.file.type.startsWith('video/') ? (
                      <video
                        src={video.preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={video.preview}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileVideo className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <p className="text-xs text-gray-400 mt-1 truncate">{video.name}</p>
                  <Badge className="absolute top-2 left-2 bg-black/60 text-white text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Analyze Button */}
            <div className="mt-6">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-[2px] animate-spin" style={{ animationDuration: '3s' }}>
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                          <Brain className="w-8 h-8 text-pink-500" />
                        </div>
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                        {progress}%
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {t('Analyzing video', 'Menganalisis video')} {currentVideoIndex + 1}/{videos.length}
                      </p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ) : (
                <Button
                  onClick={analyzeBatch}
                  disabled={videos.length < 2}
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('Analyze All Videos', 'Analisis Semua Video')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {batchResult && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                {t('Learning Summary', 'Ringkasan Pembelajaran')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-1">{t('Average Score', 'Skor Rata-rata')}</p>
                  <p className="text-2xl font-bold text-white">{batchResult.averageScore}</p>
                </div>
                <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-xs text-gray-400 mb-1">{t('Videos Analyzed', 'Video Dianalisis')}</p>
                  <p className="text-2xl font-bold text-cyan-400">{batchResult.results.length}</p>
                </div>
              </div>

              {/* Learning Insights */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  {t('What You Can Learn', 'Yang Bisa Dipelajari')}
                </p>
                {batchResult.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-cyan-400">💡</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Results - Learn from Each Video */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-pink-400" />
                {t('Learn From Each Video', 'Belajar dari Setiap Video')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batchResult.results.map((result, index) => {
                  // Find best scores across all videos
                  const bestHook = Math.max(...batchResult.results.map(r => r.hookStrength));
                  const bestVisual = Math.max(...batchResult.results.map(r => r.visualQuality));
                  const bestEngage = Math.max(...batchResult.results.map(r => r.engagement));
                  const bestRetain = Math.max(...batchResult.results.map(r => r.retention));
                  
                  return (
                    <div
                      key={result.videoId}
                      className="p-4 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-500/20 text-purple-300">
                            Video {index + 1}
                          </Badge>
                          <span className="font-medium text-white">{result.videoName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
                            {result.overallScore}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div className={`text-center p-2 rounded ${result.hookStrength === bestHook ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/50'}`}>
                          <p className="text-gray-500">Hook</p>
                          <p className={getScoreColor(result.hookStrength)}>
                            {result.hookStrength} {result.hookStrength === bestHook && '★'}
                          </p>
                        </div>
                        <div className={`text-center p-2 rounded ${result.visualQuality === bestVisual ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/50'}`}>
                          <p className="text-gray-500">Visual</p>
                          <p className={getScoreColor(result.visualQuality)}>
                            {result.visualQuality} {result.visualQuality === bestVisual && '★'}
                          </p>
                        </div>
                        <div className={`text-center p-2 rounded ${result.engagement === bestEngage ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/50'}`}>
                          <p className="text-gray-500">Engage</p>
                          <p className={getScoreColor(result.engagement)}>
                            {result.engagement} {result.engagement === bestEngage && '★'}
                          </p>
                        </div>
                        <div className={`text-center p-2 rounded ${result.retention === bestRetain ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/50'}`}>
                          <p className="text-gray-500">Retain</p>
                          <p className={getScoreColor(result.retention)}>
                            {result.retention} {result.retention === bestRetain && '★'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Strengths & Improvements for this video */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                          <p className="text-green-400 font-medium mb-1">✓ {t('Strengths', 'Kekuatan')}</p>
                          <ul className="text-gray-300 space-y-0.5">
                            {result.strengths.slice(0, 2).map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
                          <p className="text-cyan-400 font-medium mb-1">↑ {t('Can Improve', 'Bisa Ditingkatkan')}</p>
                          <ul className="text-gray-300 space-y-0.5">
                            {result.improvements.slice(0, 2).map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mutual Learning Analysis - AI Analysis */}
          {batchResult.comparison && (
            <Card className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  {t('Mutual Learning Analysis', 'Analisis Saling Belajar')}
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs ml-2">AI</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Learning */}
                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-cyan-400">
                      {t('Key Learning', 'Pembelajaran Utama')}: {batchResult.comparison.overallWinner.videoName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{batchResult.comparison.overallWinner.reason}</p>
                </div>

                {/* Best Elements to Learn */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    {t('Best Elements to Learn', 'Elemen Terbaik untuk Dipelajari')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {batchResult.comparison.dimensionWinners.map((dim, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-cyan-400">{dim.dimension}</span>
                          <Badge className="bg-purple-500/20 text-purple-300 text-xs">{t('Learn from', 'Pelajari dari')} {dim.winner}</Badge>
                        </div>
                        <p className="text-xs text-gray-400">{dim.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cross-Learning Insights */}
                {batchResult.comparison.pairwiseComparisons.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      🔄 {t('Cross-Learning Insights', 'Insight Saling Belajar')}
                    </p>
                    <div className="space-y-2">
                      {batchResult.comparison.pairwiseComparisons.map((pair, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-purple-400">💡</span>
                          <div>
                            <span className="font-medium text-white">{pair.pair}</span>
                            <p className="text-gray-400">{pair.verdict}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared Areas to Improve */}
                {batchResult.comparison.sharedWeaknesses.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      📈 {t('Shared Growth Areas', 'Area Pertumbuhan Bersama')}
                    </p>
                    <div className="space-y-2">
                      {batchResult.comparison.sharedWeaknesses.map((weakness, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-cyan-400">→</span>
                          <span>{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combined Best Formula */}
                {batchResult.comparison.winningCombo && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-bold text-white mb-2">
                      🎯 {t('Combined Best Formula', 'Formula Gabungan Terbaik')}
                    </p>
                    <p className="text-sm text-gray-300 mb-3">{batchResult.comparison.winningCombo.recommendation}</p>
                    <div className="p-3 bg-black/30 rounded border border-cyan-500/20">
                      <p className="text-xs font-medium text-cyan-400 mb-1">
                        {t('Next Action', 'Langkah Selanjutnya')}:
                      </p>
                      <p className="text-sm text-white">{batchResult.comparison.winningCombo.nextAction}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Discussion Chat */}
          <AnalysisDiscussion
            analysisType="batch"
            analysisContext={`Batch Video Analysis Results (Saling Belajar):
- Videos Analyzed: ${batchResult.results.length}
- Key Learning: ${batchResult.comparison?.overallWinner?.videoName || 'N/A'} - ${batchResult.comparison?.overallWinner?.reason || ''}
- Average Score: ${Math.round(batchResult.results.reduce((sum, r) => sum + r.overallScore, 0) / batchResult.results.length)}

Learn from Each Video:
${batchResult.results.map(r => `- ${r.videoName}: ${r.overallScore}/100`).join('\n')}

Key Insights:
${batchResult.insights.join('\n')}`}
            mode="tiktok"
          />
        </div>
      )}
    </div>
  );
}

function generateInsights(results: VideoAnalysisResult[], language: string): string[] {
  const insights: string[] = [];
  const isId = language === 'id';

  // Find patterns
  const avgHook = results.reduce((sum, r) => sum + r.hookStrength, 0) / results.length;
  const avgVisual = results.reduce((sum, r) => sum + r.visualQuality, 0) / results.length;
  const avgEngage = results.reduce((sum, r) => sum + r.engagement, 0) / results.length;
  const avgRetain = results.reduce((sum, r) => sum + r.retention, 0) / results.length;

  // Weakest area
  const areas = [
    { name: isId ? 'Hook' : 'Hook', score: avgHook },
    { name: isId ? 'Visual' : 'Visual', score: avgVisual },
    { name: isId ? 'Engagement' : 'Engagement', score: avgEngage },
    { name: isId ? 'Retention' : 'Retention', score: avgRetain },
  ].sort((a, b) => a.score - b.score);

  insights.push(
    isId 
      ? `Area terlemah: ${areas[0].name} (${Math.round(areas[0].score)}). Fokus perbaikan di sini.`
      : `Weakest area: ${areas[0].name} (${Math.round(areas[0].score)}). Focus improvement here.`
  );

  insights.push(
    isId
      ? `Area terkuat: ${areas[3].name} (${Math.round(areas[3].score)}). Pertahankan kualitas ini.`
      : `Strongest area: ${areas[3].name} (${Math.round(areas[3].score)}). Maintain this quality.`
  );

  // Score spread
  const scores = results.map(r => r.overallScore);
  const spread = Math.max(...scores) - Math.min(...scores);
  if (spread > 20) {
    insights.push(
      isId
        ? `Performa tidak konsisten (spread ${spread} poin). Coba standarisasi format konten.`
        : `Inconsistent performance (${spread} point spread). Try standardizing content format.`
    );
  } else {
    insights.push(
      isId
        ? `Performa konsisten (spread ${spread} poin). Kualitas konten stabil.`
        : `Consistent performance (${spread} point spread). Content quality is stable.`
    );
  }

  return insights;
}
