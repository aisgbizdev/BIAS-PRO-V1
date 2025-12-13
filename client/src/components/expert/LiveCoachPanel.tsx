import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Radio, Clock, Users, Gift, AlertTriangle, Lightbulb } from 'lucide-react';

interface LiveStreamingTemplate {
  id: string;
  format: string;
  duration: string;
  nameEn: string;
  nameId: string;
  descriptionEn: string | null;
  descriptionId: string | null;
  timelineEn: string;
  timelineId: string;
  tipsEn: string[] | null;
  tipsId: string[] | null;
  mistakesToAvoidEn: string[] | null;
  mistakesToAvoidId: string[] | null;
  giftStrategyEn: string | null;
  giftStrategyId: string | null;
  contingencyPlansEn: string[] | null;
  contingencyPlansId: string[] | null;
}

interface TimelineSegment {
  minute: string;
  action: string;
  tips: string;
}

const formatIcons: Record<string, string> = {
  solo: '👤',
  pk: '⚔️',
  multi_guest: '👥',
  collab: '🤝',
  qa: '❓',
  tutorial: '📚',
};

const formatColors: Record<string, string> = {
  solo: 'from-blue-500 to-cyan-500',
  pk: 'from-red-500 to-orange-500',
  multi_guest: 'from-purple-500 to-pink-500',
  collab: 'from-green-500 to-emerald-500',
  qa: 'from-yellow-500 to-amber-500',
  tutorial: 'from-cyan-500 to-teal-500',
};

export function LiveCoachPanel() {
  const { language, t } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const { data: templates = [], isLoading } = useQuery<LiveStreamingTemplate[]>({
    queryKey: ['live-streaming-templates', selectedFormat, selectedDuration],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedFormat !== 'all') params.append('format', selectedFormat);
      if (selectedDuration !== 'all') params.append('duration', selectedDuration);
      const res = await fetch(`/api/live-streaming-templates?${params}`);
      return res.json();
    },
  });

  const parseTimeline = (timelineJson: string): TimelineSegment[] => {
    try {
      return JSON.parse(timelineJson);
    } catch {
      return [];
    }
  };

  const formats = ['solo', 'pk', 'multi_guest', 'collab', 'qa', 'tutorial'];
  const durations = ['5min', '15min', '30min', '60min'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-400 bg-clip-text text-transparent">
          {t('Live Streaming Coach', 'Coach Live Streaming')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('Master the art of engaging live streams', 'Kuasai seni live streaming yang engaging')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">{t('Format', 'Format')}</label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder={t('All Formats', 'Semua Format')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Formats', 'Semua Format')}</SelectItem>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {formatIcons[format]} {format.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">{t('Duration', 'Durasi')}</label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder={t('All Durations', 'Semua Durasi')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Durations', 'Semua Durasi')}</SelectItem>
              {durations.map((dur) => (
                <SelectItem key={dur} value={dur}>
                  ⏱️ {dur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t('No templates found', 'Tidak ada template ditemukan')}
        </div>
      ) : (
        <div className="space-y-6">
          {templates.map((template) => {
            const timeline = parseTimeline(
              language === 'id' ? template.timelineId : template.timelineEn
            );

            return (
              <Card
                key={template.id}
                className="bg-gray-800/30 border-gray-700/50 overflow-hidden"
              >
                <div
                  className={`h-1 bg-gradient-to-r ${formatColors[template.format] || 'from-gray-500 to-gray-600'}`}
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${formatColors[template.format] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-2xl`}
                      >
                        {formatIcons[template.format] || '📺'}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">
                          {language === 'id' ? template.nameId : template.nameEn}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Radio className="w-3 h-3 mr-1" />
                            {template.format.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {template.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(template.descriptionEn || template.descriptionId) && (
                    <p className="text-gray-400 text-sm mt-2">
                      {language === 'id' ? template.descriptionId : template.descriptionEn}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-400" />
                      {t('Timeline', 'Timeline')}
                    </h4>
                    <div className="relative">
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-cyan-500" />
                      <div className="space-y-4 ml-6">
                        {timeline.map((segment, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-pink-500 border-2 border-gray-900" />
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {segment.minute}
                                </Badge>
                                <span className="font-medium text-white">{segment.action}</span>
                              </div>
                              <p className="text-sm text-gray-400">{segment.tips}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Accordion type="multiple" className="space-y-2">
                    {template.tipsEn && template.tipsEn.length > 0 && (
                      <AccordionItem value="tips" className="border-gray-700">
                        <AccordionTrigger className="text-sm text-green-400 hover:no-underline">
                          <span className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            {t('Pro Tips', 'Tips Pro')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {(language === 'id' ? template.tipsId : template.tipsEn)?.map(
                              (tip, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-gray-300"
                                >
                                  <span className="text-green-400">✓</span>
                                  {tip}
                                </li>
                              )
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {template.mistakesToAvoidEn && template.mistakesToAvoidEn.length > 0 && (
                      <AccordionItem value="mistakes" className="border-gray-700">
                        <AccordionTrigger className="text-sm text-red-400 hover:no-underline">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {t('Mistakes to Avoid', 'Kesalahan yang Dihindari')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {(language === 'id'
                              ? template.mistakesToAvoidId
                              : template.mistakesToAvoidEn
                            )?.map((mistake, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-red-300"
                              >
                                <span className="text-red-400">✕</span>
                                {mistake}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {(template.giftStrategyEn || template.giftStrategyId) && (
                      <AccordionItem value="gifts" className="border-gray-700">
                        <AccordionTrigger className="text-sm text-yellow-400 hover:no-underline">
                          <span className="flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            {t('Gift Strategy', 'Strategi Gift')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-yellow-300">
                            {language === 'id'
                              ? template.giftStrategyId
                              : template.giftStrategyEn}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {template.contingencyPlansEn && template.contingencyPlansEn.length > 0 && (
                      <AccordionItem value="contingency" className="border-gray-700">
                        <AccordionTrigger className="text-sm text-blue-400 hover:no-underline">
                          <span className="flex items-center gap-2">
                            🛡️ {t('Contingency Plans', 'Rencana Darurat')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {(language === 'id'
                              ? template.contingencyPlansId
                              : template.contingencyPlansEn
                            )?.map((plan, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-blue-300"
                              >
                                <span className="text-blue-400">→</span>
                                {plan}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
