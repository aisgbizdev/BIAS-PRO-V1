import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Lightbulb, Eye, Star, Copy, Check } from 'lucide-react';

interface Hook {
  id: string;
  hookType: string;
  category: string;
  hookTextEn: string;
  hookTextId: string;
  psychologyPrincipleEn: string;
  psychologyPrincipleId: string;
  whyItWorksEn: string;
  whyItWorksId: string;
  visualHookSuggestionEn: string | null;
  visualHookSuggestionId: string | null;
  bestForEn: string | null;
  bestForId: string | null;
  effectivenessScore: number;
}

const hookTypeColors: Record<string, string> = {
  question: 'from-blue-500 to-cyan-500',
  controversial: 'from-red-500 to-orange-500',
  shock: 'from-purple-500 to-pink-500',
  curiosity: 'from-yellow-500 to-amber-500',
  benefit: 'from-green-500 to-emerald-500',
  pattern_interrupt: 'from-pink-500 to-violet-500',
  story: 'from-cyan-500 to-teal-500',
  challenge: 'from-orange-500 to-red-500',
};

const hookTypeIcons: Record<string, string> = {
  question: '❓',
  controversial: '🔥',
  shock: '😱',
  curiosity: '🤔',
  benefit: '✨',
  pattern_interrupt: '⚡',
  story: '📖',
  challenge: '🎯',
};

export function HookMasterPanel() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: hooks = [], isLoading } = useQuery<Hook[]>({
    queryKey: ['hooks', searchTerm, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('hookType', selectedType);
      const res = await fetch(`/api/hooks?${params}`);
      return res.json();
    },
  });

  const hookTypes = ['question', 'controversial', 'shock', 'curiosity', 'benefit', 'pattern_interrupt', 'story', 'challenge'];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          {t('Hook Master', 'Master Hook')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('Psychology-backed hooks that stop the scroll', 'Hook berbasis psikologi yang menghentikan scroll')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t('Search hooks...', 'Cari hooks...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType(null)}
        >
          {t('All Types', 'Semua Tipe')}
        </Button>
        {hookTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type === selectedType ? null : type)}
            className="text-xs"
          >
            {hookTypeIcons[type]} {type.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
      ) : hooks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t('No hooks found', 'Tidak ada hooks ditemukan')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {hooks.map((hook) => (
            <Card
              key={hook.id}
              className="bg-gray-800/30 border-gray-700/50 overflow-hidden hover:border-pink-500/50 transition-colors"
            >
              <div className={`h-1 bg-gradient-to-r ${hookTypeColors[hook.hookType] || 'from-gray-500 to-gray-600'}`} />
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{hookTypeIcons[hook.hookType] || '💬'}</span>
                    <Badge variant="outline" className="text-xs">
                      {hook.hookType.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {hook.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(hook.effectivenessScore / 2)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-white font-medium">
                    "{language === 'id' ? hook.hookTextId : hook.hookTextEn}"
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 text-xs"
                    onClick={() =>
                      copyToClipboard(
                        language === 'id' ? hook.hookTextId : hook.hookTextEn,
                        hook.id
                      )
                    }
                  >
                    {copiedId === hook.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1" /> {t('Copied!', 'Tersalin!')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> {t('Copy', 'Salin')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-yellow-400 font-medium">
                        {t('Psychology Principle', 'Prinsip Psikologi')}
                      </p>
                      <p className="text-sm text-gray-300">
                        {language === 'id' ? hook.psychologyPrincipleId : hook.psychologyPrincipleEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm">🧠</span>
                    <div>
                      <p className="text-xs text-purple-400 font-medium">
                        {t('Why It Works', 'Mengapa Ini Bekerja')}
                      </p>
                      <p className="text-sm text-gray-300">
                        {language === 'id' ? hook.whyItWorksId : hook.whyItWorksEn}
                      </p>
                    </div>
                  </div>

                  {(hook.visualHookSuggestionEn || hook.visualHookSuggestionId) && (
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-cyan-400 font-medium">
                          {t('Visual Hook', 'Hook Visual')}
                        </p>
                        <p className="text-sm text-gray-300">
                          {language === 'id'
                            ? hook.visualHookSuggestionId
                            : hook.visualHookSuggestionEn}
                        </p>
                      </div>
                    </div>
                  )}

                  {(hook.bestForEn || hook.bestForId) && (
                    <div className="pt-2 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400">
                        <span className="font-medium">{t('Best for:', 'Terbaik untuk:')}</span>{' '}
                        {language === 'id' ? hook.bestForId : hook.bestForEn}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
