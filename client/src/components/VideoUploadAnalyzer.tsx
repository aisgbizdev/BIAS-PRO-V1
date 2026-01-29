import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useSession, type BiasMode } from '@/lib/sessionContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Video, FileVideo, Zap, AlertCircle, CheckCircle2, Presentation, Briefcase, Loader2 } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { apiRequest } from '@/lib/queryClient';
import type { BiasAnalysisResult } from '@shared/schema';
import { AnalysisResults } from '@/components/AnalysisResults';
import { trackFeatureUsage } from '@/lib/analytics';
import { saveAnalysisToHistory } from '@/lib/analysisHistory';

type Platform = 'tiktok' | 'non-social';

interface VideoFile {
  file: File;
  preview: string;
  description: string;
  platform: Platform;
  id: string;
}

interface VideoUploadAnalyzerProps {
  onAnalysisComplete?: (result: BiasAnalysisResult) => void;
  mode?: BiasMode;
}

export function VideoUploadAnalyzer({ onAnalysisComplete, mode = 'creator' }: VideoUploadAnalyzerProps) {
  const { language, t } = useLanguage();
  const { session } = useSession();
  const { toast } = useToast();
  
  // Default platform berdasarkan mode
  const defaultPlatform: Platform = mode === 'creator' ? 'tiktok' : 'non-social';
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(defaultPlatform);
  const [uploadedFiles, setUploadedFiles] = useState<VideoFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<BiasAnalysisResult[]>([]);

  const platformConfig = {
    tiktok: {
      icon: SiTiktok,
      color: '#FF0050',
      name: 'TikTok',
      accept: 'video/mp4,video/quicktime',
      maxSize: 200, // MB - allows 2-3 min HD TikTok videos
    },
    'non-social': {
      icon: Presentation,
      color: '#8B5CF6',
      name: language === 'id' ? 'Profesional' : 'Professional',
      accept: 'video/mp4,video/quicktime,video/avi,video/webm',
      maxSize: 300, // MB - allows 5-7 min presentations/pitches
    },
  };

  const config = platformConfig[selectedPlatform];
  const PlatformIcon = config.icon;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > config.maxSize) {
        toast({
          title: t('File too large', 'File terlalu besar'),
          description: t(`Maximum size is ${config.maxSize}MB`, `Ukuran maksimal ${config.maxSize}MB`),
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        toast({
          title: t('Invalid file type', 'Tipe file tidak valid'),
          description: t('Please upload a video file', 'Silakan upload file video'),
          variant: 'destructive',
        });
        return;
      }

      const newFile: VideoFile = {
        file,
        preview: URL.createObjectURL(file),
        description: '',
        platform: selectedPlatform,
        id: `${Date.now()}-${Math.random()}`,
      };

      setUploadedFiles(prev => [...prev, newFile]);
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const updateFileDescription = (id: string, description: string) => {
    setUploadedFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, description } : f))
    );
  };

  const analyzeVideos = async () => {
    if (!session) {
      toast({
        title: t('Session required', 'Sesi diperlukan'),
        description: t('Please refresh the page', 'Silakan refresh halaman'),
        variant: 'destructive',
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: t('No files selected', 'Tidak ada file'),
        description: t('Please upload at least one video', 'Silakan upload minimal 1 video'),
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);
    const results: BiasAnalysisResult[] = [];

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const videoFile = uploadedFiles[i];
        const baseProgress = (i / uploadedFiles.length) * 100;
        const progressPerVideo = 100 / uploadedFiles.length;
        
        // Start at base progress for this video
        setUploadProgress(baseProgress);

        // Simulate incremental progress during analysis (scaled to per-video allocation)
        const progressSteps = [0.1, 0.25, 0.4, 0.6, 0.8]; // Percentage of this video's progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const relativeProgress = (prev - baseProgress) / progressPerVideo;
            const nextStep = progressSteps.find(step => step > relativeProgress);
            if (nextStep) {
              return Math.min(baseProgress + (nextStep * progressPerVideo), 100);
            }
            return Math.min(prev, 100);
          });
        }, 3000); // Update every 3 seconds

        const formData = new FormData();
        formData.append('file', videoFile.file);
        formData.append('sessionId', session.sessionId);
        formData.append('mode', mode);
        formData.append('inputType', 'video');
        if (videoFile.platform !== 'non-social') {
          formData.append('platform', videoFile.platform);
        }
        formData.append('content', videoFile.description || `Video file: ${videoFile.file.name}`);

        const response = await fetch('/api/analyze-video', {
          method: 'POST',
          body: formData,
        });
        
        // Stop progress simulation
        clearInterval(progressInterval);

        if (!response.ok) {
          const error = await response.json();
          // Use backend's bilingual error messages
          const errorMessage = t(
            error.message || 'Analysis failed',
            error.messageId || 'Analisis gagal'
          );
          console.error('❌ Analysis API error:', error);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Server returns 'result', not 'analysis'
        const analysisData = data.analysis || data.result;
        if (!analysisData) {
          console.error('❌ Missing analysis in response:', data);
          throw new Error(t(
            'Invalid response from server. Please try again.',
            'Response server tidak valid. Silakan coba lagi.'
          ));
        }
        
        results.push(analysisData);
        console.log(`✅ Video ${i + 1} analyzed successfully`);
        
        // Update progress AFTER successful analysis (capped at 100%)
        const completionProgress = Math.min(((i + 1) / uploadedFiles.length) * 100, 100);
        setUploadProgress(completionProgress);
      }

      setAnalysisResults(results);
      
      // Save each result to history
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const videoFile = uploadedFiles[i];
        const historyMode = selectedPlatform === 'tiktok' ? 'tiktok' : 'marketing';
        const preview = videoFile?.description || videoFile?.file.name || 'Video Analysis';
        saveAnalysisToHistory(result, historyMode, 'video', preview);
      }
      
      if (onAnalysisComplete && results.length > 0) {
        onAnalysisComplete(results[0]);
      }

      console.log(`🎉 All ${results.length} videos analyzed successfully!`);
      
      // Track analytics for each video
      for (const videoFile of uploadedFiles) {
        const platform = videoFile.platform !== 'non-social' ? videoFile.platform : 'professional';
        trackFeatureUsage('analysis', platform as any, { type: 'video' });
      }
      
      toast({
        title: t('Analysis complete!', 'Analisis selesai!'),
        description: t(
          `${results.length} video(s) analyzed successfully`,
          `${results.length} video berhasil dianalisis`
        ),
      });
    } catch (error: any) {
      console.error('💥 Video analysis error:', error);
      
      toast({
        title: t('Analysis failed', 'Analisis gagal'),
        description: error.message || t(
          'An unexpected error occurred. Please check console for details.',
          'Terjadi error tidak terduga. Lihat console untuk detail.'
        ),
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      <Card className="bg-[#141414] border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-pink-500" />
            {mode === 'academic' 
              ? t('Upload Your Sales & Prospecting Videos', 'Upload Video Jualan & Prospek Anda')
              : t('Upload & Analyze Videos', 'Upload & Analisis Video')
            }
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === 'academic' 
              ? t(
                  'Upload your sales presentations, prospecting calls, or client pitches. Get Ai-powered feedback on what to improve for better conversions.',
                  'Upload presentasi jualan, prospek, atau pitch klien Anda. Dapatkan feedback Ai tentang apa yang harus diperbaiki untuk konversi lebih baik.'
                )
              : t(
                  'Upload one or more videos to analyze or compare performance',
                  'Upload satu atau lebih video untuk analisis atau bandingkan performa'
                )
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform indicator - Professional option hidden for now */}
          {mode === 'creator' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <SiTiktok className="w-4 h-4 text-pink-500" />
              <span>{t('Analyzing for TikTok', 'Analisis untuk TikTok')}</span>
            </div>
          )}

          {/* File Upload */}
          <div>
            <Label className="text-white mb-2 block">{t('Upload Videos', 'Upload Video')}</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-pink-500 transition-colors">
              <input
                type="file"
                id="video-upload"
                accept={config.accept}
                multiple
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-video"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-400/20 cursor-pointer hover:from-pink-500/40 hover:to-cyan-400/40 hover:scale-110 transition-all duration-200">
                    <Upload className="w-8 h-8 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {t('Click to upload or drag and drop', 'Klik untuk upload atau drag & drop')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {t(
                        `${config.name} videos (Max ${config.maxSize}MB per file)`,
                        `Video ${config.name} (Maks ${config.maxSize}MB per file)`
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
                  >
                    <PlatformIcon className="w-4 h-4 mr-2" />
                    {t('Select Videos', 'Pilih Video')}
                  </Button>
                </div>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <Label className="text-white">
                {t('Uploaded Videos', 'Video Terupload')} ({uploadedFiles.length})
              </Label>
              {uploadedFiles.map((videoFile) => (
                <Card key={videoFile.id} className="bg-[#1E1E1E] border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Video Preview */}
                      <div className="relative w-32 h-24 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                        <video
                          src={videoFile.preview}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <FileVideo className="w-8 h-8 text-white" />
                        </div>
                        <Badge
                          className="absolute top-2 right-2 text-xs"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.name}
                        </Badge>
                      </div>

                      {/* File Info & Description */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {videoFile.file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(videoFile.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(videoFile.id)}
                            className="h-8 w-8 flex-shrink-0"
                            data-testid={`button-remove-${videoFile.id}`}
                          >
                            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400 font-medium">
                            {t('Additional Context (Optional)', 'Konteks Tambahan (Opsional)')}
                          </Label>
                          <Textarea
                            placeholder={t(
                              'Optional: Add extra context about the video if you want more specific feedback...',
                              'Opsional: Tambahkan konteks tambahan tentang video jika ingin feedback lebih spesifik...'
                            )}
                            value={videoFile.description}
                            onChange={(e) => updateFileDescription(videoFile.id, e.target.value)}
                            className="bg-[#0A0A0A] border-gray-700 text-white text-sm min-h-[60px]"
                            data-testid={`textarea-description-${videoFile.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {isAnalyzing && (
            <Alert className="border-cyan-400/30 bg-cyan-400/10">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <AlertDescription className="text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {t('Deep Ai Analysis in Progress...', 'Analisis Ai Mendalam Sedang Berlangsung...')}
                  </span>
                  <span className="text-sm text-cyan-300">{Math.min(Math.round(uploadProgress), 100)}%</span>
                </div>
                <Progress value={Math.min(uploadProgress, 100)} className="h-2" />
                <p className="text-xs text-gray-300 mt-1">
                  {t(
                    'Ai is analyzing your content in detail. This may take 15-30 seconds to give specific and actionable feedback.',
                    'Ai sedang menganalisis konten Anda secara detail. Ini mungkin memakan waktu 15-30 detik untuk memberikan feedback spesifik dan aplikatif.'
                  )}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeVideos}
            disabled={uploadedFiles.length === 0 || isAnalyzing}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
            data-testid="button-analyze-videos"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('Analyzing...', 'Menganalisis...')}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {uploadedFiles.length > 1
                  ? t(`Analyze & Compare ${uploadedFiles.length} Videos`, `Analisis & Bandingkan ${uploadedFiles.length} Video`)
                  : t('Analyze Video', 'Analisis Video')}
              </>
            )}
          </Button>

          {/* Info Alert */}
          <Alert className="border-cyan-500/30 bg-cyan-500/10">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <AlertDescription className="text-cyan-300 text-sm">
              {t(
                'Ai analyzes your video comprehensively: Audio transcription (Whisper) + Visual frames (Vision) for detailed feedback on speech, visuals, and content quality.',
                'Ai menganalisis video secara komprehensif: Transkripsi audio (Whisper) + Frame visual (Vision) untuk feedback detail tentang cara bicara, visual, dan kualitas konten.'
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Full Analysis Results - Comprehensive View */}
      {analysisResults.length >= 1 && (
        <div className="space-y-8">
          {analysisResults.map((result, idx) => (
            <div key={idx} className="space-y-4">
              {/* Video Label Badge */}
              {analysisResults.length > 1 && (
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-4 py-2 text-base" data-testid={`badge-video-${idx + 1}`}>
                    <Video className="w-4 h-4 mr-2" />
                    {t('Video', 'Video')} {idx + 1}
                  </Badge>
                  <div className="h-px flex-1 bg-gradient-to-r from-pink-500/20 to-cyan-400/20" />
                </div>
              )}
              
              {/* Full Comprehensive Analysis Results */}
              <AnalysisResults result={result} />
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
}
