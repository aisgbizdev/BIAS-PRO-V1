import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Calendar, MessageSquare, DollarSign, AlertTriangle, BarChart2 } from 'lucide-react';

interface GrowthStageGuide {
  id: string;
  stage: string;
  followerRangeMin: number;
  followerRangeMax: number | null;
  nameEn: string;
  nameId: string;
  descriptionEn: string;
  descriptionId: string;
  postingFrequencyEn: string;
  postingFrequencyId: string;
  contentStrategyEn: string;
  contentStrategyId: string;
  engagementStrategyEn: string;
  engagementStrategyId: string;
  collabStrategyEn: string | null;
  collabStrategyId: string | null;
  monetizationTipsEn: string | null;
  monetizationTipsId: string | null;
  mistakesToAvoidEn: string[] | null;
  mistakesToAvoidId: string[] | null;
  metricsToTrackEn: string[] | null;
  metricsToTrackId: string[] | null;
}

const stageColors: Record<string, string> = {
  stage_1_0_1k: 'from-green-500 to-emerald-500',
  stage_2_1k_10k: 'from-blue-500 to-cyan-500',
  stage_3_10k_100k: 'from-purple-500 to-pink-500',
  stage_4_100k_plus: 'from-yellow-500 to-amber-500',
};

const stageIcons: Record<string, string> = {
  stage_1_0_1k: '🌱',
  stage_2_1k_10k: '🌿',
  stage_3_10k_100k: '🌳',
  stage_4_100k_plus: '🏆',
};

export function GrowthRoadmapPanel() {
  const { language, t } = useLanguage();
  const [followerCount, setFollowerCount] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('stage_1_0_1k');

  const { data: guides = [], isLoading } = useQuery<GrowthStageGuide[]>({
    queryKey: ['growth-guides'],
    queryFn: async () => {
      const res = await fetch('/api/growth-guides');
      return res.json();
    },
  });

  const findMyStage = () => {
    const count = parseInt(followerCount);
    if (isNaN(count)) return;
    
    let foundStage = 'stage_1_0_1k';
    for (const guide of guides) {
      if (count >= guide.followerRangeMin) {
        foundStage = guide.stage;
      }
    }
    setSelectedStage(foundStage);
  };

  const currentGuide = guides.find((g) => g.stage === selectedStage);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-cyan-400 bg-clip-text text-transparent">
          {t('Growth Roadmap', 'Peta Pertumbuhan')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('Stage-specific strategies for your TikTok journey', 'Strategi spesifik per tahap untuk perjalanan TikTok Anda')}
        </p>
      </div>

      <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">
                {t('Enter your follower count to find your stage:', 'Masukkan jumlah follower Anda:')}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={t('e.g., 5000', 'mis., 5000')}
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  className="bg-gray-800/50 border-gray-700"
                />
                <Button onClick={findMyStage}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('Find My Stage', 'Temukan Tahap Saya')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedStage} onValueChange={setSelectedStage}>
        <TabsList className="grid grid-cols-4 bg-gray-800/50">
          {guides.map((guide) => (
            <TabsTrigger
              key={guide.stage}
              value={guide.stage}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-cyan-500/20"
            >
              <span className="hidden md:inline">{stageIcons[guide.stage]}</span>
              <span className="text-xs md:text-sm ml-1">
                {guide.followerRangeMax
                  ? `${guide.followerRangeMin >= 1000 ? `${guide.followerRangeMin / 1000}K` : guide.followerRangeMin}-${guide.followerRangeMax >= 1000 ? `${guide.followerRangeMax / 1000}K` : guide.followerRangeMax}`
                  : `${guide.followerRangeMin >= 1000 ? `${guide.followerRangeMin / 1000}K` : guide.followerRangeMin}+`}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {guides.map((guide) => (
          <TabsContent key={guide.stage} value={guide.stage} className="mt-6">
            <div className="space-y-6">
              <div className={`bg-gradient-to-r ${stageColors[guide.stage] || 'from-gray-500 to-gray-600'} p-[1px] rounded-xl`}>
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{stageIcons[guide.stage]}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {language === 'id' ? guide.nameId : guide.nameEn}
                      </h3>
                      <p className="text-gray-400">
                        {language === 'id' ? guide.descriptionId : guide.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                      <Calendar className="w-4 h-4" />
                      {t('Posting Frequency', 'Frekuensi Posting')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {language === 'id' ? guide.postingFrequencyId : guide.postingFrequencyEn}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-400">
                      <TrendingUp className="w-4 h-4" />
                      {t('Content Strategy', 'Strategi Konten')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {language === 'id' ? guide.contentStrategyId : guide.contentStrategyEn}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-green-400">
                      <MessageSquare className="w-4 h-4" />
                      {t('Engagement Strategy', 'Strategi Engagement')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {language === 'id' ? guide.engagementStrategyId : guide.engagementStrategyEn}
                    </p>
                  </CardContent>
                </Card>

                {(guide.collabStrategyEn || guide.collabStrategyId) && (
                  <Card className="bg-gray-800/30 border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-cyan-400">
                        <Users className="w-4 h-4" />
                        {t('Collaboration Strategy', 'Strategi Kolaborasi')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        {language === 'id' ? guide.collabStrategyId : guide.collabStrategyEn}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {(guide.monetizationTipsEn || guide.monetizationTipsId) && (
                  <Card className="bg-gray-800/30 border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                        <DollarSign className="w-4 h-4" />
                        {t('Monetization Tips', 'Tips Monetisasi')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        {language === 'id' ? guide.monetizationTipsId : guide.monetizationTipsEn}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {guide.mistakesToAvoidEn && guide.mistakesToAvoidEn.length > 0 && (
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        {t('Mistakes to Avoid', 'Kesalahan yang Harus Dihindari')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(language === 'id' ? guide.mistakesToAvoidId : guide.mistakesToAvoidEn)?.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                            <span className="text-red-400">✕</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {guide.metricsToTrackEn && guide.metricsToTrackEn.length > 0 && (
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                        <BarChart2 className="w-4 h-4" />
                        {t('Metrics to Track', 'Metrik yang Harus Dilacak')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(language === 'id' ? guide.metricsToTrackId : guide.metricsToTrackEn)?.map((metric, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-blue-300">
                            <span className="text-blue-400">📊</span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
