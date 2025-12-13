import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, FileText, Clock, Target, Sparkles } from 'lucide-react';

interface ScriptTemplate {
  id: string;
  category: string;
  duration: string;
  goal: string;
  nameEn: string;
  nameId: string;
  descriptionEn: string | null;
  descriptionId: string | null;
  hookTemplateEn: string;
  hookTemplateId: string;
  mainContentTemplateEn: string;
  mainContentTemplateId: string;
  ctaTemplateEn: string;
  ctaTemplateId: string;
  psychologyExplanationEn: string | null;
  psychologyExplanationId: string | null;
  examplesEn: string[] | null;
  examplesId: string[] | null;
  soundRecommendations: string[] | null;
  level: string;
}

const categoryIcons: Record<string, string> = {
  education: '📚',
  storytelling: '📖',
  comedy: '😂',
  lifestyle: '🌟',
  gaming: '🎮',
  review: '⭐',
  tutorial: '🔧',
  dance: '💃',
};

export function ScriptGeneratorPanel() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useQuery<ScriptTemplate[]>({
    queryKey: ['script-templates', selectedCategory, selectedDuration, selectedGoal],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDuration !== 'all') params.append('duration', selectedDuration);
      if (selectedGoal !== 'all') params.append('goal', selectedGoal);
      const res = await fetch(`/api/script-templates?${params}`);
      return res.json();
    },
  });

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const categories = ['education', 'storytelling', 'comedy', 'lifestyle', 'gaming', 'review', 'tutorial'];
  const durations = ['15s', '30s', '60s', '3min'];
  const goals = ['entertainment', 'education', 'sales', 'community', 'viral'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          {t('Script Generator', 'Generator Script')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('Ready-to-use script templates for any content type', 'Template script siap pakai untuk semua jenis konten')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">{t('Category', 'Kategori')}</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder={t('All Categories', 'Semua Kategori')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Categories', 'Semua Kategori')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryIcons[cat]} {cat}
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

        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">{t('Goal', 'Tujuan')}</label>
          <Select value={selectedGoal} onValueChange={setSelectedGoal}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder={t('All Goals', 'Semua Tujuan')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Goals', 'Semua Tujuan')}</SelectItem>
              {goals.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t('No templates found', 'Tidak ada template ditemukan')}
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`bg-gray-800/30 border-gray-700/50 transition-all ${
                expandedTemplate === template.id ? 'border-orange-500/50' : ''
              }`}
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcons[template.category] || '📝'}</span>
                    <div>
                      <CardTitle className="text-lg text-white">
                        {language === 'id' ? template.nameId : template.nameEn}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {template.goal}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.level}
                  </Badge>
                </div>
              </CardHeader>

              {expandedTemplate === template.id && (
                <CardContent className="space-y-4">
                  {(template.descriptionEn || template.descriptionId) && (
                    <p className="text-gray-400 text-sm">
                      {language === 'id' ? template.descriptionId : template.descriptionEn}
                    </p>
                  )}

                  <Tabs defaultValue="hook" className="w-full">
                    <TabsList className="grid grid-cols-3 bg-gray-800/50">
                      <TabsTrigger value="hook">🎣 Hook</TabsTrigger>
                      <TabsTrigger value="main">📝 {t('Main', 'Utama')}</TabsTrigger>
                      <TabsTrigger value="cta">🎯 CTA</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hook" className="mt-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-white">
                            {language === 'id' ? template.hookTemplateId : template.hookTemplateEn}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                language === 'id' ? template.hookTemplateId : template.hookTemplateEn,
                                `${template.id}-hook`
                              )
                            }
                          >
                            {copiedSection === `${template.id}-hook` ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="main" className="mt-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-white whitespace-pre-wrap">
                            {language === 'id'
                              ? template.mainContentTemplateId
                              : template.mainContentTemplateEn}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                language === 'id'
                                  ? template.mainContentTemplateId
                                  : template.mainContentTemplateEn,
                                `${template.id}-main`
                              )
                            }
                          >
                            {copiedSection === `${template.id}-main` ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cta" className="mt-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-white">
                            {language === 'id' ? template.ctaTemplateId : template.ctaTemplateEn}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                language === 'id' ? template.ctaTemplateId : template.ctaTemplateEn,
                                `${template.id}-cta`
                              )
                            }
                          >
                            {copiedSection === `${template.id}-cta` ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {(template.psychologyExplanationEn || template.psychologyExplanationId) && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-purple-400">
                          {t('Why This Works', 'Mengapa Ini Bekerja')}
                        </span>
                      </div>
                      <p className="text-purple-300 text-sm">
                        {language === 'id'
                          ? template.psychologyExplanationId
                          : template.psychologyExplanationEn}
                      </p>
                    </div>
                  )}

                  {template.soundRecommendations && template.soundRecommendations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-400">🎵 {t('Sound ideas:', 'Ide sound:')}</span>
                      {template.soundRecommendations.map((sound, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sound}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
