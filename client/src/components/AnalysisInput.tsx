import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/lib/sessionContext';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import type { BiasAnalysisResult } from '@shared/schema';
import { trackFeatureUsage } from '@/lib/analytics';

interface AnalysisInputProps {
  onAnalysisComplete: (result: BiasAnalysisResult) => void;
}

const BIAS_LAYERS = ['VBM', 'EPM', 'NLP', 'ETH', 'ECO', 'SOC', 'COG', 'BMIL'];

type InputType = 'text' | 'video-link' | 'video-file' | 'photo-link' | 'photo-file' | 'audio-link' | 'audio-file';

function getPlaceholderExample(mode: string, inputType: InputType): string {
  if (inputType === 'text') {
    if (mode === 'creator') {
      return "Contoh: Halo guys! Hari ini saya mau share tips produktivitas buat kalian yang kuliah sambil kerja. Jadi ceritanya saya dulu sering telat deadline...";
    } else if (mode === 'academic') {
      return "Contoh: Selamat pagi Bapak/Ibu. Saya akan memaparkan strategi digital marketing untuk meningkatkan penjualan produk kita sebesar 30% di kuartal depan...";
    } else {
      return "Contoh: Paste teks percakapan, skrip, atau pidato yang mau dianalisis. Bisa juga deskripsikan gaya komunikasi Anda...";
    }
  } else if (inputType === 'video-link') {
    return "Paste link video YouTube/TikTok/Instagram - sistem akan menganalisis performa dan pola komunikasi dari link tersebut.";
  } else if (inputType === 'video-file') {
    return "Deskripsikan isi video Anda secara detail: topik, gaya bicara, gestur, ekspresi wajah, body language, presentation style, dll.";
  } else if (inputType === 'photo-link') {
    return "Paste link foto atau Instagram post - sistem akan menganalisis visual behavior dan body language.";
  } else if (inputType === 'photo-file') {
    return "Deskripsikan isi foto Anda: ekspresi wajah, body language, postur, gesture, kontak mata, background, dll.";
  } else if (inputType === 'audio-link') {
    return "Paste link audio/podcast atau Spotify URL - sistem akan menganalisis vocal delivery dan tone.";
  } else if (inputType === 'audio-file') {
    return "Deskripsikan audio Anda: nada suara, intonasi, tempo bicara, jeda, artikulasi, emosi, warmth, dll.";
  }
  return "";
}

export function AnalysisInput({ onAnalysisComplete }: AnalysisInputProps) {
  const { session, mode, updateSession } = useSession();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const inputType: InputType = 'text'; // Fixed to text-only mode
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState<number>(0);

  // Simulate progressive layer analysis
  useEffect(() => {
    if (isAnalyzing) {
      setAnalyzingProgress(0);
      const interval = setInterval(() => {
        setAnalyzingProgress((prev) => {
          if (prev >= 7) {
            clearInterval(interval);
            return 7;
          }
          return prev + 1;
        });
      }, 400); // Progress every 400ms

      return () => clearInterval(interval);
    } else {
      setAnalyzingProgress(0);
    }
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!session) {
      toast({
        title: t('Error', 'Error'),
        description: t('Session not ready', 'Sesi belum siap'),
        variant: 'destructive',
      });
      return;
    }

    // Validate: either content or file must be provided
    if (!selectedFile && content.length < 10) {
      toast({
        title: t('Input required', 'Input diperlukan'),
        description: t('Please upload a file or provide at least 10 characters', 'Upload file atau tulis minimal 10 karakter'),
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let response;

      // If file is uploaded, use FormData
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('sessionId', session.sessionId);
        formData.append('mode', mode);
        formData.append('inputType', 'text');
        formData.append('content', content || '');

        response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });
      } else {
        // No file - send JSON
        response = await apiRequest('POST', '/api/analyze', {
          sessionId: session.sessionId,
          mode,
          inputType: 'text',
          content,
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.messageId || 'Analysis failed');
      }

      const data = await response.json();
      updateSession(data.session);
      onAnalysisComplete(data.analysis);
      
      // Track analytics
      trackFeatureUsage('analysis', 'professional', { type: 'text', mode });
      
      toast({
        title: t('Analysis Complete!', 'Analisis Selesai!'),
        description: t(
          `Your BIAS score: ${data.analysis.overallScore}/10 - Check results below!`,
          `Skor BIAS Anda: ${data.analysis.overallScore}/10 - Lihat hasil di bawah!`
        ),
      });
      
      // Scroll to results smoothly
      setTimeout(() => {
        const resultsElement = document.querySelector('[data-results-container]');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
      setContent('');
      setSelectedFile(null);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {t('Script Analysis & Review', 'Analisis & Review Script')}
        </CardTitle>
        <CardDescription>
          {t(
            'Paste your script (sales pitch, meeting opening, cold call, presentation) and get Ai feedback to improve it!',
            'Paste script kamu (sales pitch, pembuka meeting, cold call, presentasi) dan dapatkan feedback Ai untuk improve!'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Script Type Selector */}
        <div className="space-y-2">
          <Label>{t('What kind of script?', 'Jenis script apa?')}</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { en: '💼 Sales Pitch', id: '💼 Sales Pitch' },
              { en: '📞 Cold Call', id: '📞 Cold Call' },
              { en: '🤝 Meeting Opening', id: '🤝 Pembuka Meeting' },
              { en: '📊 Presentation', id: '📊 Presentasi' },
              { en: '💬 Follow-up WA', id: '💬 Follow-up WA' },
              { en: '🎤 Public Speaking', id: '🎤 Public Speaking' },
            ].map((type, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setContent(prev => prev ? prev : `[${t(type.en, type.id)}]\n\n`)}
                className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors"
              >
                {t(type.en, type.id)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content Input Label */}
        <div className="space-y-2">
          <Label htmlFor="content-input">
            {t('Your Script / Text', 'Script / Teks Kamu')}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t(
              'Paste your script below — Ai will analyze and give specific improvement tips',
              'Paste script kamu di bawah — Ai akan analisis dan kasih tips perbaikan spesifik'
            )}
          </p>
        </div>


        {/* Document Upload (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">
            {t('Upload Document (Optional)', 'Upload Dokumen (Opsional)')}
          </Label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            accept=".doc,.docx,.pdf,.txt"
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            data-testid="input-file-upload"
          />
          {selectedFile && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t('File selected:', 'File dipilih:')} {selectedFile.name}
            </p>
          )}
        </div>

        {/* Text Description Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">
              {t('Script Content', 'Konten Script')}
            </Label>
            <VoiceInputButton 
              onTranscript={(text, append) => {
                if (append) {
                  setContent(prev => prev ? `${prev} ${text}` : text);
                } else {
                  setContent(text);
                }
              }}
            />
          </div>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t(
              'Example: "Hi [Prospect Name], I noticed your company just expanded to..."',
              'Contoh: "Halo [Nama Prospek], saya lihat perusahaan Bapak baru saja expand ke..."'
            )}
            className="min-h-40 resize-none font-mono text-sm"
            data-testid="textarea-content"
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('Tip: More detailed text = Better analysis', 'Tips: Teks lebih detail = Analisis lebih akurat')}
            </span>
            <span className="text-muted-foreground">
              {content.length} {t('chars', 'karakter')}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        {/* Smart Loading Progress */}
        {isAnalyzing && (
          <div className="w-full space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">
                {t('Analyzing with BIAS framework...', 'Menganalisis dengan framework BIAS...')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BIAS_LAYERS.map((layer, idx) => {
                const isComplete = idx < analyzingProgress;
                const isCurrent = idx === analyzingProgress;
                const isPending = idx > analyzingProgress;
                
                return (
                  <div
                    key={layer}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded ${
                      isComplete ? 'bg-primary/10 text-primary' :
                      isCurrent ? 'bg-primary/5 text-primary animate-pulse' :
                      'text-muted-foreground'
                    }`}
                  >
                    {isComplete && <CheckCircle2 className="w-3 h-3" />}
                    {isCurrent && <Loader2 className="w-3 h-3 animate-spin" />}
                    {isPending && <Clock className="w-3 h-3" />}
                    <span className="font-medium">{layer}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!selectedFile && content.length < 10)}
          className="w-full"
          size="lg"
          data-testid="button-analyze"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('Analyzing...', 'Menganalisis...')}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {t('Review My Script', 'Review Script Saya')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
