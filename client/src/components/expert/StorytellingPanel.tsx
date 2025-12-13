import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Lightbulb, Target } from 'lucide-react';

interface StorytellingFramework {
  id: string;
  nameEn: string;
  nameId: string;
  descriptionEn: string;
  descriptionId: string;
  structureStepsEn: string[];
  structureStepsId: string[];
  structureExplanationsEn: string[] | null;
  structureExplanationsId: string[] | null;
  whenToUseEn: string;
  whenToUseId: string;
  examplesEn: string[] | null;
  examplesId: string[] | null;
  bestForContentTypes: string[] | null;
  psychologyEn: string | null;
  psychologyId: string | null;
}

const frameworkColors = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-violet-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-amber-500',
  'from-red-500 to-orange-500',
];

export function StorytellingPanel() {
  const { language, t } = useLanguage();

  const { data: frameworks = [], isLoading } = useQuery<StorytellingFramework[]>({
    queryKey: ['storytelling-frameworks'],
    queryFn: async () => {
      const res = await fetch('/api/storytelling-frameworks');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">
          {t('Storytelling Frameworks', 'Framework Storytelling')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('Proven narrative structures that captivate audiences', 'Struktur narasi terbukti yang memikat audiens')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : frameworks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t('No frameworks found', 'Tidak ada framework ditemukan')}
        </div>
      ) : (
        <div className="grid gap-6">
          {frameworks.map((framework, index) => (
            <Card
              key={framework.id}
              className="bg-gray-800/30 border-gray-700/50 overflow-hidden"
            >
              <div
                className={`h-1 bg-gradient-to-r ${frameworkColors[index % frameworkColors.length]}`}
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${frameworkColors[index % frameworkColors.length]} flex items-center justify-center`}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">
                        {language === 'id' ? framework.nameId : framework.nameEn}
                      </CardTitle>
                      {framework.bestForContentTypes && framework.bestForContentTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {framework.bestForContentTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {language === 'id' ? framework.descriptionId : framework.descriptionEn}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    📋 {t('Structure', 'Struktur')}
                  </h4>
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                    <div className="space-y-3 ml-6">
                      {(language === 'id'
                        ? framework.structureStepsId
                        : framework.structureStepsEn
                      ).map((step, i) => {
                        const explanation =
                          language === 'id'
                            ? framework.structureExplanationsId?.[i]
                            : framework.structureExplanationsEn?.[i];
                        return (
                          <div key={i} className="relative">
                            <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-purple-500 border-2 border-gray-900 flex items-center justify-center text-[8px] font-bold text-white">
                              {i + 1}
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <span className="font-medium text-white">{step}</span>
                              {explanation && (
                                <p className="text-sm text-gray-400 mt-1">{explanation}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Accordion type="multiple" className="space-y-2">
                  <AccordionItem value="when" className="border-gray-700">
                    <AccordionTrigger className="text-sm text-cyan-400 hover:no-underline">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {t('When to Use', 'Kapan Digunakan')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-300">
                        {language === 'id' ? framework.whenToUseId : framework.whenToUseEn}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  {(framework.examplesEn || framework.examplesId) &&
                    (framework.examplesEn?.length || framework.examplesId?.length) && (
                      <AccordionItem value="examples" className="border-gray-700">
                        <AccordionTrigger className="text-sm text-green-400 hover:no-underline">
                          <span className="flex items-center gap-2">
                            💡 {t('Examples', 'Contoh')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {(language === 'id'
                              ? framework.examplesId
                              : framework.examplesEn
                            )?.map((example, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-300"
                              >
                                <span className="text-green-400">→</span>
                                "{example}"
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  {(framework.psychologyEn || framework.psychologyId) && (
                    <AccordionItem value="psychology" className="border-gray-700">
                      <AccordionTrigger className="text-sm text-purple-400 hover:no-underline">
                        <span className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          {t('Psychology Behind It', 'Psikologi di Baliknya')}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-purple-300">
                          {language === 'id' ? framework.psychologyId : framework.psychologyEn}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
