import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUploadAnalyzer } from '@/components/VideoUploadAnalyzer';
import { AnalysisInput } from '@/components/AnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { InteractiveCreatorHub, MotivationalQuote } from '@/components/expert';
import { FileText, Zap, Briefcase, MessageCircle, MessageSquare } from 'lucide-react';
import type { BiasAnalysisResult } from '@shared/schema';
import { trackTabSelection, trackButtonClick } from '@/lib/analytics';
import { saveAnalysisToHistory } from '@/lib/analysisHistory';
import { useToast } from '@/hooks/use-toast';

const CHATGPTS_URL =
  'https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-adaptive-behavioral-ai-for-creators-marketers';

export default function CreatorAnalysis() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [inputMode, setInputMode] = useState<'upload' | 'form' | 'coach'>('upload');
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysisResult | null>(null);

  const handleAnalysisComplete = useCallback((result: BiasAnalysisResult, inputType: 'text' | 'video' = 'text', preview: string = '') => {
    setCurrentAnalysis(result);
    saveAnalysisToHistory(result, 'marketing', inputType, preview || 'Marketing Pro Analysis');
  }, []);

  const handleSelectHistory = useCallback((result: BiasAnalysisResult) => {
    setCurrentAnalysis(result);
    toast({
      title: t('History Loaded', 'Riwayat Dimuat'),
      description: t('Showing previous analysis', 'Menampilkan analisis sebelumnya'),
    });
    // Scroll to results
    setTimeout(() => {
      document.querySelector('[data-results-container]')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [toast, t]);

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      {/* Hero Section - Minimal */}
      <div className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              {t('Marketing Pro', 'Marketing Pro')}
            </h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl">
            {t(
              'Ai Coach for sales, pitch, leadership & professional communication.',
              'Ai Coach untuk sales, pitch, leadership & komunikasi profesional.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Input Mode Selector - Minimal */}
        <Tabs value={inputMode} onValueChange={(v) => {
          const newMode = v as typeof inputMode;
          setInputMode(newMode);
          trackTabSelection('marketing-pro', newMode);
        }}>
        <TabsList className="flex w-full gap-1 overflow-x-auto bg-[#141414] border border-gray-800 p-1 rounded-xl">
            <TabsTrigger 
              value="upload"
              className="data-[state=active]:bg-gray-700/80 data-[state=active]:text-white text-gray-300 text-[11px] sm:text-xs md:text-sm px-2 py-2 rounded-lg flex items-center justify-center gap-1 min-h-9 sm:min-h-10 shrink-0"
              data-testid="tab-input-upload"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="ml-1 whitespace-nowrap">{t('Analyze', 'Analisis')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coach"
              className="data-[state=active]:bg-gray-700/80 data-[state=active]:text-white text-gray-300 text-[11px] sm:text-xs md:text-sm px-2 py-2 rounded-lg flex items-center justify-center gap-1 min-h-9 sm:min-h-10 shrink-0"
              data-testid="tab-input-coach"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="ml-1 whitespace-nowrap">{t('Ai Coach', 'Ai Coach')}</span>
            </TabsTrigger>
            <button
              type="button"
              onClick={() => {
                trackButtonClick('Ai ChatGPTs', 'marketing-pro');
                window.open(CHATGPTS_URL, '_blank', 'noopener,noreferrer');
              }}
              className="text-gray-300 hover:text-white text-[11px] sm:text-xs md:text-sm px-2 py-2 rounded-lg flex items-center justify-center gap-1 min-h-9 sm:min-h-10 hover:bg-gray-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/60 shrink-0"
              aria-label={t('Ai ChatGPTs', 'Ai ChatGPTs')}
            >
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="ml-1 whitespace-nowrap">{t('Ai ChatGPTs', 'Ai ChatGPTs')}</span>
            </button>
            <TabsTrigger 
              value="form"
              className="data-[state=active]:bg-gray-700/80 data-[state=active]:text-white text-gray-300 text-[11px] sm:text-xs md:text-sm px-2 py-2 rounded-lg flex items-center justify-center gap-1 min-h-9 sm:min-h-10 shrink-0"
              data-testid="tab-input-form"
            >
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="ml-1 whitespace-nowrap">{t('Review', 'Review')}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Ai Coach - Chat Mode */}
        {inputMode === 'coach' && (
          <div className="space-y-4">
            <InteractiveCreatorHub mode="marketing" />
            <MotivationalQuote variant="purple" />
          </div>
        )}

        {/* Analysis Input - Form Mode */}
        {inputMode === 'form' && (
          <AnalysisInput onAnalysisComplete={(result) => handleAnalysisComplete(result, 'text', 'Script Review')} />
        )}

        {/* Analysis Input - Upload Mode */}
        {inputMode === 'upload' && (
          <VideoUploadAnalyzer onAnalysisComplete={(result) => handleAnalysisComplete(result, 'video', 'Video Analysis')} mode="academic" />
        )}

        {/* Analysis Results - AnalysisResults already includes AnalysisDiscussion */}
        {currentAnalysis && (
          <div data-results-container>
            <AnalysisResults result={currentAnalysis} mode="marketing" />
          </div>
        )}

        {/* Analysis History */}
        {(inputMode === 'form' || inputMode === 'upload') && (
          <AnalysisHistory onSelectAnalysis={handleSelectHistory} />
        )}
      </div>
    </div>
  );
}
