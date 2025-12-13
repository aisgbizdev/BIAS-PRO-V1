import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/languageContext';
import { Sparkles, ArrowRight, Mic, BookOpen, CheckCircle } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const ONBOARDING_KEY = 'bias_onboarding_complete';

export function OnboardingModal() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
      if (!hasCompletedOnboarding) {
        const timer = setTimeout(() => setOpen(true), 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }, []);

  const completeOnboarding = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
    setOpen(false);
  };

  const steps = [
    {
      title: t('Welcome to BiAS Pro!', 'Selamat Datang di BiAS Pro!'),
      description: t(
        'Your personal Ai mentor for TikTok creators and marketing professionals.',
        'Ai mentor pribadimu untuk kreator TikTok dan profesional marketing.'
      ),
      content: (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-pink-500/20 to-cyan-500/20 text-pink-300 border-pink-500/50">
            {t('First in Indonesia', 'Pertama di Indonesia')}
          </Badge>
          <p className="text-center text-sm text-muted-foreground max-w-sm">
            {t(
              'Get science-backed behavioral analysis and personalized coaching to level up your content and communication skills.',
              'Dapatkan analisis behavioral berbasis sains dan coaching personal untuk meningkatkan konten dan skill komunikasimu.'
            )}
          </p>
        </div>
      ),
    },
    {
      title: t('Choose Your Mode', 'Pilih Mode Kamu'),
      description: t(
        'BiAS Pro has two specialized Ai mentors for different needs.',
        'BiAS Pro punya dua Ai mentor khusus untuk kebutuhan berbeda.'
      ),
      content: (
        <div className="grid grid-cols-1 gap-3 py-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-500/5 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-pink-500/20">
                <SiTiktok className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="font-semibold text-white">TikTok Pro</p>
                <p className="text-xs text-gray-400">{t('For Creators', 'Untuk Creator')}</p>
              </div>
            </div>
            <ul className="text-xs text-gray-300 space-y-1 ml-12">
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-pink-400" /> {t('FYP algorithm secrets', 'Rahasia algoritma FYP')}</li>
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-pink-400" /> {t('Viral hook templates', 'Template hook viral')}</li>
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-pink-400" /> {t('Live streaming tips', 'Tips live streaming')}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Marketing Pro</p>
                <p className="text-xs text-gray-400">{t('For Professionals', 'Untuk Profesional')}</p>
              </div>
            </div>
            <ul className="text-xs text-gray-300 space-y-1 ml-12">
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-purple-400" /> {t('Sales pitch analysis', 'Analisis pitch sales')}</li>
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-purple-400" /> {t('Objection handling', 'Handling keberatan')}</li>
              <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-purple-400" /> {t('Leadership coaching', 'Coaching leadership')}</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: t('Quick Tips', 'Tips Cepat'),
      description: t(
        'Get the most out of BiAS Pro with these tips.',
        'Maksimalkan BiAS Pro dengan tips ini.'
      ),
      content: (
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-pink-400 font-bold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t('Ask your Ai Mentor', 'Tanya Ai Mentormu')}</p>
              <p className="text-xs text-gray-400">{t('Chat about anything - scripts, strategies, analysis', 'Chat tentang apa saja - script, strategi, analisis')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t('Use Voice Input', 'Pakai Input Suara')}</p>
              <p className="text-xs text-gray-400">{t('Click the mic icon for hands-free input', 'Klik ikon mic untuk input tanpa ketik')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400 font-bold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t('Explore the Library', 'Jelajahi Perpustakaan')}</p>
              <p className="text-xs text-gray-400">{t('Find glossary terms, tips, and contribute your knowledge', 'Temukan istilah, tips, dan bagikan pengetahuanmu')}</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        {currentStep.content}

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-pink-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                {t('Back', 'Kembali')}
              </Button>
            )}
            {isLastStep ? (
              <Button size="sm" onClick={completeOnboarding} className="gap-1">
                {t("Let's Go!", 'Mulai!')}
                <Sparkles className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setStep(step + 1)} className="gap-1">
                {t('Next', 'Lanjut')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={completeOnboarding}
          className="text-xs text-gray-500 hover:text-gray-400 text-center"
        >
          {t('Skip onboarding', 'Lewati onboarding')}
        </button>
      </DialogContent>
    </Dialog>
  );
}
