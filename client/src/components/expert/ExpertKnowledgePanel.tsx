import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Lightbulb, AlertTriangle, ExternalLink, Search, Filter } from 'lucide-react';

interface ExpertKnowledge {
  id: string;
  category: string;
  subcategory: string | null;
  titleEn: string;
  titleId: string;
  contentEn: string;
  contentId: string;
  mythEn: string | null;
  mythId: string | null;
  truthEn: string | null;
  truthId: string | null;
  researchSummaryEn: string | null;
  researchSummaryId: string | null;
  researchSource: string | null;
  regulationReference: string | null;
  regulationLinkUrl: string | null;
  tags: string[] | null;
  level: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  algorithm: <span className="text-2xl">🤖</span>,
  psychology: <span className="text-2xl">🧠</span>,
  cinematography: <span className="text-2xl">🎬</span>,
  audio: <span className="text-2xl">🎧</span>,
  public_speaking: <span className="text-2xl">🎤</span>,
  regulation: <span className="text-2xl">📋</span>,
  monetization: <span className="text-2xl">💰</span>,
  growth: <span className="text-2xl">📈</span>,
};

const categoryColors: Record<string, string> = {
  algorithm: 'from-blue-500 to-cyan-500',
  psychology: 'from-purple-500 to-pink-500',
  cinematography: 'from-orange-500 to-yellow-500',
  audio: 'from-green-500 to-emerald-500',
  public_speaking: 'from-red-500 to-orange-500',
  regulation: 'from-gray-500 to-slate-500',
  monetization: 'from-yellow-500 to-amber-500',
  growth: 'from-cyan-500 to-blue-500',
};

export function ExpertKnowledgePanel() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const { data: entries = [], isLoading } = useQuery<ExpertKnowledge[]>({
    queryKey: ['expert-knowledge', searchTerm, selectedCategory, selectedLevel],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);
      const res = await fetch(`/api/expert-knowledge?${params}`);
      return res.json();
    },
  });

  const categories = ['algorithm', 'psychology', 'cinematography', 'audio', 'public_speaking', 'regulation', 'monetization'];
  const levels = ['beginner', 'intermediate', 'expert'];

  const filteredEntries = entries;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t('Search expert knowledge...', 'Cari pengetahuan expert...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            {t('All Categories', 'Semua Kategori')}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className="text-xs"
            >
              {categoryIcons[cat]} {cat.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {levels.map((level) => (
          <Badge
            key={level}
            variant={selectedLevel === level ? 'default' : 'outline'}
            className={`cursor-pointer ${selectedLevel === level ? 'bg-pink-500' : ''}`}
            onClick={() => setSelectedLevel(level === selectedLevel ? null : level)}
          >
            {level === 'beginner' ? '🌱' : level === 'intermediate' ? '🌿' : '🌳'} {level}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t('No knowledge entries found', 'Tidak ada entri pengetahuan ditemukan')}
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredEntries.map((entry) => (
            <AccordionItem
              key={entry.id}
              value={entry.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-800/50">
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[entry.category] || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                    {categoryIcons[entry.category] || <BookOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {language === 'id' ? entry.titleId : entry.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {entry.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  <p className="text-gray-300 leading-relaxed">
                    {language === 'id' ? entry.contentId : entry.contentEn}
                  </p>

                  {(entry.mythEn || entry.mythId) && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="font-semibold text-red-400">
                          {t('Common Myth', 'Mitos Umum')}
                        </span>
                      </div>
                      <p className="text-red-300 italic">
                        "{language === 'id' ? entry.mythId : entry.mythEn}"
                      </p>
                    </div>
                  )}

                  {(entry.truthEn || entry.truthId) && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-green-400">
                          {t('Scientific Truth', 'Kebenaran Ilmiah')}
                        </span>
                      </div>
                      <p className="text-green-300">
                        {language === 'id' ? entry.truthId : entry.truthEn}
                      </p>
                    </div>
                  )}

                  {(entry.researchSummaryEn || entry.researchSummaryId) && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-blue-400">
                          {t('Research Backing', 'Dasar Riset')}
                        </span>
                      </div>
                      <p className="text-blue-300 text-sm">
                        {language === 'id' ? entry.researchSummaryId : entry.researchSummaryEn}
                      </p>
                      {entry.researchSource && (
                        <p className="text-blue-400/70 text-xs mt-2 italic">
                          {t('Source:', 'Sumber:')} {entry.researchSource}
                        </p>
                      )}
                    </div>
                  )}

                  {entry.regulationReference && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">📋</span>
                          <span className="text-purple-300 text-sm">
                            {entry.regulationReference}
                          </span>
                        </div>
                        {entry.regulationLinkUrl && (
                          <a
                            href={entry.regulationLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
