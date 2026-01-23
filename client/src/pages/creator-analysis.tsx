import { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUploadAnalyzer } from '@/components/VideoUploadAnalyzer';
import { AnalysisInput } from '@/components/AnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { InteractiveCreatorHub, MotivationalQuote } from '@/components/expert';
import { FileText, Zap, Briefcase, MessageCircle } from 'lucide-react';
import type { BiasAnalysisResult } from '@shared/schema';
import { trackTabSelection } from '@/lib/analytics';
import { saveAnalysisToHistory } from '@/lib/analysisHistory';

export default function CreatorAnalysis() {
  const { language, t } = useLanguage();
  const [inputMode, setInputMode] = useState<'upload' | 'form' | 'coach'>('upload');
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysisResult | null>(null);

  const handleAnalysisComplete = useCallback((result: BiasAnalysisResult, inputType: 'text' | 'video' = 'text', preview: string = '') => {
    setCurrentAnalysis(result);
    saveAnalysisToHistory(result, 'marketing', inputType, preview || 'Marketing Pro Analysis');
  }, []);

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
          <TabsList className="grid w-full grid-cols-3 bg-[#141414] border border-gray-800 p-0.5 rounded-lg">
            <TabsTrigger 
              value="upload"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-[10px] sm:text-xs px-1 py-1.5 rounded-md"
              data-testid="tab-input-upload"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">{t('Analyze', 'Analisis')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coach"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-[10px] sm:text-xs px-1 py-1.5 rounded-md"
              data-testid="tab-input-coach"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">{t('Ai Coach', 'Ai Coach')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="form"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-[10px] sm:text-xs px-1 py-1.5 rounded-md"
              data-testid="tab-input-form"
            >
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">{t('Review', 'Review')}</span>
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
          <AnalysisHistory onSelectAnalysis={setCurrentAnalysis} />
        )}
      </div>
    </div>
  );
}
