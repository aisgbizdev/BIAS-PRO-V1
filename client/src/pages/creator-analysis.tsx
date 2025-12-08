import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUploadAnalyzer } from '@/components/VideoUploadAnalyzer';
import { AnalysisInput } from '@/components/AnalysisInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisDiscussion } from '@/components/AnalysisDiscussion';
import { SalesScriptGenerator } from '@/components/expert/SalesScriptGenerator';
import { InteractiveCreatorHub, MotivationalQuote } from '@/components/expert';
import { Video, FileText, Zap, Briefcase, ScrollText, MessageCircle } from 'lucide-react';
import type { BiasAnalysisResult } from '@shared/schema';

export default function CreatorAnalysis() {
  const { language, t } = useLanguage();
  const [inputMode, setInputMode] = useState<'upload' | 'form' | 'scripts' | 'coach'>('coach');
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-purple-500 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {t('Marketing Pro', 'Marketing Pro')}
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            {t(
              'Ai Coach for sales, pitch, leadership & professional communication. Analyze or create scripts, then discuss with Ai to level up your skills!',
              'Ai Coach untuk sales, pitch, leadership & komunikasi profesional. Analisis atau buat script, lalu diskusi dengan Ai untuk tingkatkan skill-mu!'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Input Mode Selector */}
        <Card className="bg-[#141414] border-gray-800">
          <CardContent className="pt-6">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as typeof inputMode)}>
              <TabsList className="grid w-full grid-cols-4 bg-[#1E1E1E] border border-gray-700 gap-1">
                <TabsTrigger 
                  value="coach"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-[10px] sm:text-sm px-2"
                  data-testid="tab-input-coach"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('Ai Coach', 'Ai Coach')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="upload"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-[10px] sm:text-sm px-2"
                  data-testid="tab-input-upload"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('Analyze', 'Analisis')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="form"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-[10px] sm:text-sm px-2"
                  data-testid="tab-input-form"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('Review', 'Review')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="scripts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-[10px] sm:text-sm px-2"
                  data-testid="tab-input-scripts"
                >
                  <ScrollText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('Templates', 'Template')}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Ai Coach - Chat Mode */}
        {inputMode === 'coach' && (
          <div className="space-y-4">
            <InteractiveCreatorHub />
            <MotivationalQuote variant="purple" />
          </div>
        )}

        {/* Analysis Input - Form Mode */}
        {inputMode === 'form' && (
          <AnalysisInput onAnalysisComplete={setCurrentAnalysis} />
        )}

        {/* Analysis Input - Upload Mode */}
        {inputMode === 'upload' && (
          <VideoUploadAnalyzer onAnalysisComplete={setCurrentAnalysis} mode="academic" />
        )}

        {/* Sales Script Templates */}
        {inputMode === 'scripts' && (
          <SalesScriptGenerator />
        )}

        {/* Analysis Results */}
        {currentAnalysis && inputMode !== 'scripts' && (
          <div data-results-container>
            <AnalysisResults result={currentAnalysis} />
            
            {/* Discussion Chat Box */}
            <AnalysisDiscussion 
              analysisResult={currentAnalysis} 
              mode="marketing" 
              analysisType={inputMode === 'upload' ? 'video' : 'text'} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
