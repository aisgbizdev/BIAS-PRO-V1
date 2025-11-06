import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUploadAnalyzer } from '@/components/VideoUploadAnalyzer';
import { AnalysisInput } from '@/components/AnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Video, FileText, Zap } from 'lucide-react';
import type { BiasAnalysisResult } from '@shared/schema';

export default function CreatorAnalysis() {
  const { language, t } = useLanguage();
  const [inputMode, setInputMode] = useState<'form' | 'upload'>('upload');
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Video className="w-6 h-6 md:w-8 md:h-8 text-purple-500 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {t('Communication Analysis', 'Analisis Komunikasi')}
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            {t(
              'Analyze sales presentations, client pitches, prospecting calls, and marketing videos. Get AI-powered feedback to improve your communication and boost conversions.',
              'Analisis presentasi penjualan, pitch klien, prospek, dan video marketing. Dapatkan feedback AI untuk meningkatkan komunikasi dan konversi Anda.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Input Mode Selector */}
        <Card className="bg-[#141414] border-gray-800">
          <CardContent className="pt-6">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as typeof inputMode)}>
              <TabsList className="grid w-full grid-cols-2 bg-[#1E1E1E] border border-gray-700">
                <TabsTrigger 
                  value="upload"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-xs sm:text-sm"
                  data-testid="tab-input-upload"
                >
                  <Zap className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('Video Upload', 'Upload Video')}</span>
                  <span className="sm:hidden">{t('Video', 'Video')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="form"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-xs sm:text-sm"
                  data-testid="tab-input-form"
                >
                  <FileText className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('Text/Link Input', 'Input Teks/Link')}</span>
                  <span className="sm:hidden">{t('Text', 'Teks')}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analysis Input - Form Mode */}
        {inputMode === 'form' && (
          <AnalysisInput onAnalysisComplete={setCurrentAnalysis} />
        )}

        {/* Analysis Input - Upload Mode */}
        {inputMode === 'upload' && (
          <VideoUploadAnalyzer onAnalysisComplete={setCurrentAnalysis} mode="academic" />
        )}

        {/* Analysis Results */}
        {currentAnalysis && (
          <div data-results-container>
            <AnalysisResults result={currentAnalysis} />
          </div>
        )}
      </div>
    </div>
  );
}
