import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, Clock, FileText, Sparkles, ChevronRight, ChevronLeft, 
  Check, Copy, Lightbulb, MessageSquare, Target, Zap, Film,
  Music, Camera, Mic, Play, RotateCcw, Wand2, PenTool
} from 'lucide-react';

interface FormatSuggestion {
  id: string;
  titleEn: string;
  titleId: string;
  descriptionEn: string;
  descriptionId: string;
  exampleEn: string;
  exampleId: string;
  icon: string;
  color: string;
  hookTemplateEn: string;
  hookTemplateId: string;
  structureEn: string[];
  structureId: string[];
  durationRecommendation: number;
}

interface DurationOption {
  seconds: number;
  labelEn: string;
  labelId: string;
  description: string;
  bestFor: string;
}

const durations: DurationOption[] = [
  { seconds: 15, labelEn: '15 seconds', labelId: '15 detik', description: 'Quick hook, one point only', bestFor: 'Trends, quick tips, reactions' },
  { seconds: 30, labelEn: '30 seconds', labelId: '30 detik', description: 'Hook + 1-2 points + CTA', bestFor: 'Tips, mini tutorials, comedy' },
  { seconds: 60, labelEn: '60 seconds', labelId: '60 detik', description: 'Full story structure', bestFor: 'Storytelling, tutorials, reviews' },
  { seconds: 90, labelEn: '90 seconds', labelId: '90 detik', description: 'Detailed content', bestFor: 'Deep tutorials, vlogs, recipes' },
];

const formatSuggestions: FormatSuggestion[] = [
  {
    id: 'tutorial',
    titleEn: 'Tutorial / How-To',
    titleId: 'Tutorial / Cara',
    descriptionEn: 'Teach your audience something step-by-step',
    descriptionId: 'Ajarkan audiens sesuatu secara step-by-step',
    exampleEn: '"3 steps to [your topic]..." or "How I [achieved X]..."',
    exampleId: '"3 langkah untuk [topik kamu]..." atau "Cara aku [capai X]..."',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
    hookTemplateEn: '"Nobody taught me this about [YOUR TOPIC], but here\'s how I figured it out..."',
    hookTemplateId: '"Gak ada yang ajarin aku tentang [TOPIK KAMU], tapi ini cara aku tau..."',
    structureEn: ['Hook: Share a surprising discovery', 'Problem: What wasn\'t working', 'Solution: Step-by-step how-to', 'Result: Show the outcome', 'CTA: Ask for follow or questions'],
    structureId: ['Hook: Share penemuan mengejutkan', 'Masalah: Apa yang gak work', 'Solusi: Step-by-step caranya', 'Hasil: Tunjukkan hasilnya', 'CTA: Minta follow atau pertanyaan'],
    durationRecommendation: 60,
  },
  {
    id: 'storytelling',
    titleEn: 'Story / Experience',
    titleId: 'Cerita / Pengalaman',
    descriptionEn: 'Share a personal story that connects emotionally',
    descriptionId: 'Share cerita personal yang connect secara emosional',
    exampleEn: '"This one thing changed everything for me..." or "Let me tell you what happened..."',
    exampleId: '"Satu hal ini mengubah segalanya untuk aku..." atau "Aku ceritain apa yang terjadi..."',
    icon: '📖',
    color: 'from-purple-500 to-pink-500',
    hookTemplateEn: '"I never told anyone this, but [YOUR EXPERIENCE]..."',
    hookTemplateId: '"Aku belum pernah cerita ini, tapi [PENGALAMAN KAMU]..."',
    structureEn: ['Hook: Tease the emotional moment', 'Context: Set the scene', 'Build-up: Create tension', 'Climax: The main moment', 'Resolution: What happened after', 'Lesson: What you learned'],
    structureId: ['Hook: Tease momen emosional', 'Konteks: Set the scene', 'Build-up: Bangun tensi', 'Klimaks: Momen utama', 'Resolusi: Apa yang terjadi setelah', 'Pelajaran: Apa yang kamu pelajari'],
    durationRecommendation: 60,
  },
  {
    id: 'comedy',
    titleEn: 'Comedy / Entertainment',
    titleId: 'Komedi / Hiburan',
    descriptionEn: 'Make people laugh with relatable content',
    descriptionId: 'Buat orang tertawa dengan konten relatable',
    exampleEn: '"POV: When [relatable situation]..." or "The stages of [experience]..."',
    exampleId: '"POV: Ketika [situasi relatable]..." atau "Tahap-tahap [pengalaman]..."',
    icon: '😂',
    color: 'from-yellow-500 to-orange-500',
    hookTemplateEn: '"POV: [YOUR RELATABLE SITUATION]..."',
    hookTemplateId: '"POV: [SITUASI RELATABLE KAMU]..."',
    structureEn: ['Hook: Relatable setup', 'Buildup: Normal expectation', 'Twist: Unexpected reaction', 'Payoff: Funny conclusion'],
    structureId: ['Hook: Setup relatable', 'Buildup: Ekspektasi normal', 'Twist: Reaksi tak terduga', 'Payoff: Kesimpulan lucu'],
    durationRecommendation: 30,
  },
  {
    id: 'review',
    titleEn: 'Review / Opinion',
    titleId: 'Review / Opini',
    descriptionEn: 'Share your honest take on something',
    descriptionId: 'Share pendapat jujur tentang sesuatu',
    exampleEn: '"Is [product/trend] actually worth it?" or "My honest review after [time]..."',
    exampleId: '"Apakah [produk/trend] beneran worth it?" atau "Review jujur aku setelah [waktu]..."',
    icon: '⭐',
    color: 'from-teal-500 to-cyan-500',
    hookTemplateEn: '"I tried [WHAT YOU REVIEWED] so you don\'t have to - here\'s the truth..."',
    hookTemplateId: '"Aku coba [YANG KAMU REVIEW] supaya kamu gak perlu - ini kebenarannya..."',
    structureEn: ['Hook: Grab attention with verdict tease', 'What it is: Brief intro', 'Pros: What\'s good', 'Cons: What\'s bad', 'Verdict: Your recommendation', 'CTA: Ask for their opinion'],
    structureId: ['Hook: Grab attention dengan tease verdict', 'Apa ini: Intro singkat', 'Pro: Apa yang bagus', 'Kontra: Apa yang buruk', 'Verdict: Rekomendasi kamu', 'CTA: Tanya opini mereka'],
    durationRecommendation: 60,
  },
  {
    id: 'transformation',
    titleEn: 'Transformation / Before-After',
    titleId: 'Transformasi / Sebelum-Sesudah',
    descriptionEn: 'Show a dramatic change or improvement',
    descriptionId: 'Tunjukkan perubahan atau peningkatan dramatis',
    exampleEn: '"How I went from [before] to [after]..." or "My [X] week transformation..."',
    exampleId: '"Cara aku dari [sebelum] ke [sesudah]..." atau "Transformasi [X] minggu aku..."',
    icon: '✨',
    color: 'from-green-500 to-emerald-500',
    hookTemplateEn: '"This is what [TIME PERIOD] of [YOUR ACTIVITY] looks like..."',
    hookTemplateId: '"Ini hasil [PERIODE WAKTU] dari [AKTIVITAS KAMU]..."',
    structureEn: ['Hook: Tease the transformation', 'Before: Show the starting point', 'The journey: What you did', 'Challenges: What was hard', 'After: The result', 'Advice: Tips for others'],
    structureId: ['Hook: Tease transformasi', 'Sebelum: Tunjukkan titik awal', 'Perjalanan: Apa yang kamu lakukan', 'Tantangan: Apa yang sulit', 'Sesudah: Hasilnya', 'Saran: Tips untuk orang lain'],
    durationRecommendation: 60,
  },
  {
    id: 'listicle',
    titleEn: 'List / Tips',
    titleId: 'List / Tips',
    descriptionEn: 'Share multiple tips or ideas in quick format',
    descriptionId: 'Share beberapa tips atau ide dalam format cepat',
    exampleEn: '"5 things I wish I knew about [topic]..." or "3 mistakes you\'re probably making..."',
    exampleId: '"5 hal yang aku harap tau tentang [topik]..." atau "3 kesalahan yang mungkin kamu buat..."',
    icon: '📝',
    color: 'from-indigo-500 to-violet-500',
    hookTemplateEn: '"[NUMBER] things about [YOUR TOPIC] that nobody tells you..."',
    hookTemplateId: '"[ANGKA] hal tentang [TOPIK KAMU] yang gak ada yang kasih tau..."',
    structureEn: ['Hook: Promise valuable list', 'Point 1: First tip with quick explanation', 'Point 2: Second tip', 'Point 3: Third tip (save best for last)', 'CTA: Ask which was most helpful'],
    structureId: ['Hook: Janji list berharga', 'Poin 1: Tips pertama dengan penjelasan cepat', 'Poin 2: Tips kedua', 'Poin 3: Tips ketiga (simpan terbaik terakhir)', 'CTA: Tanya mana yang paling membantu'],
    durationRecommendation: 30,
  },
];

const equipmentChecklist = {
  basic: [
    { itemEn: 'Smartphone with good camera', itemId: 'Smartphone dengan kamera bagus', icon: '📱' },
    { itemEn: 'Natural lighting (window)', itemId: 'Pencahayaan natural (jendela)', icon: '☀️' },
    { itemEn: 'Clean background', itemId: 'Background bersih', icon: '🖼️' },
    { itemEn: 'Quiet environment', itemId: 'Lingkungan tenang', icon: '🔇' },
  ],
  recommended: [
    { itemEn: 'Ring light or softbox', itemId: 'Ring light atau softbox', icon: '💡' },
    { itemEn: 'Phone tripod/stand', itemId: 'Tripod/stand HP', icon: '📷' },
    { itemEn: 'Wireless microphone', itemId: 'Microphone wireless', icon: '🎤' },
    { itemEn: 'Editing app (CapCut)', itemId: 'Aplikasi editing (CapCut)', icon: '✂️' },
  ],
};

export function VideoCreatorWizard() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [userIdea, setUserIdea] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<FormatSuggestion | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const analyzeIdea = () => {
    if (userIdea.trim().length > 10) {
      setShowRecommendations(true);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateFinalScript = () => {
    if (!selectedFormat) return null;
    
    const hookEn = selectedFormat.hookTemplateEn.replace(/\[.*?\]/g, (match) => {
      const hint = match.slice(1, -1);
      return `[${hint} dari ide: "${userIdea.substring(0, 50)}${userIdea.length > 50 ? '...' : ''}"]`;
    });
    const hookId = selectedFormat.hookTemplateId.replace(/\[.*?\]/g, (match) => {
      const hint = match.slice(1, -1);
      return `[${hint} dari ide: "${userIdea.substring(0, 50)}${userIdea.length > 50 ? '...' : ''}"]`;
    });

    return {
      hookEn,
      hookId,
      structureEn: selectedFormat.structureEn,
      structureId: selectedFormat.structureId,
    };
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center">
          <PenTool className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {t('Tell me what you want to create', 'Ceritakan apa yang ingin kamu buat')}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {t(
            'Describe your video idea in your own words. What topic? What message? Who is it for?',
            'Jelaskan ide video kamu dengan kata-kata sendiri. Tentang apa? Pesan apa? Untuk siapa?'
          )}
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={userIdea}
          onChange={(e) => {
            setUserIdea(e.target.value);
            setShowRecommendations(false);
          }}
          placeholder={t(
            'Example: I want to share my experience learning to cook for the first time. I failed many times but finally succeeded making rendang. I want to inspire others who are afraid to try...',
            'Contoh: Aku mau share pengalaman belajar masak pertama kali. Aku gagal berkali-kali tapi akhirnya berhasil bikin rendang. Aku mau inspire orang lain yang takut mencoba...'
          )}
          className="min-h-[150px] bg-[#1E1E1E] border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500 rounded-xl"
        />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {userIdea.length} {t('characters', 'karakter')}
          </span>
          <span className={userIdea.length < 20 ? 'text-yellow-400' : 'text-green-400'}>
            {userIdea.length < 20 
              ? t('Keep writing...', 'Tulis lebih banyak...') 
              : t('Good! Ready for analysis', 'Bagus! Siap dianalisis')}
          </span>
        </div>

        {!showRecommendations && userIdea.length >= 20 && (
          <Button
            onClick={analyzeIdea}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white py-3"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {t('Analyze My Idea', 'Analisis Ide Ku')}
          </Button>
        )}

        {showRecommendations && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h4 className="text-white font-semibold">
                {t('Recommended Formats for Your Idea:', 'Format Rekomendasi untuk Ide Kamu:')}
              </h4>
            </div>
            <p className="text-gray-400 text-sm">
              {t(
                'Based on your idea, here are some video formats that could work well. You choose what feels right!',
                'Berdasarkan ide kamu, berikut beberapa format video yang bisa cocok. Kamu pilih yang terasa pas!'
              )}
            </p>
            <div className="grid gap-3">
              {formatSuggestions.map((format) => (
                <div
                  key={format.id}
                  onClick={() => {
                    setSelectedFormat(format);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedFormat?.id === format.id
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-700 bg-[#1E1E1E] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-white font-medium">
                          {t(format.titleEn, format.titleId)}
                        </h5>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          ~{format.durationRecommendation}s
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {t(format.descriptionEn, format.descriptionId)}
                      </p>
                      <p className="text-gray-500 text-xs italic">
                        {t('Example:', 'Contoh:')} {t(format.exampleEn, format.exampleId)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {t('Choose Your Duration', 'Pilih Durasi')}
        </h3>
        <p className="text-gray-400 text-sm">
          {t('How long should your video be?', 'Berapa lama video kamu seharusnya?')}
        </p>
      </div>

      {selectedFormat && (
        <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{selectedFormat.icon}</span>
            <span className="text-pink-400 font-medium">
              {t(selectedFormat.titleEn, selectedFormat.titleId)}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            {t('Recommended duration:', 'Durasi rekomendasi:')} <span className="text-white font-medium">{selectedFormat.durationRecommendation} {t('seconds', 'detik')}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {durations.map((duration) => (
          <div
            key={duration.seconds}
            onClick={() => {
              setSelectedDuration(duration);
              setStep(3);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
              selectedDuration?.seconds === duration.seconds
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 bg-[#1E1E1E] hover:border-gray-600'
            } ${selectedFormat?.durationRecommendation === duration.seconds ? 'ring-2 ring-pink-500/30' : ''}`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{duration.seconds}s</div>
              <p className="text-gray-400 text-sm">{t(duration.labelEn, duration.labelId)}</p>
              <p className="text-gray-500 text-xs mt-2">{duration.bestFor}</p>
              {selectedFormat?.durationRecommendation === duration.seconds && (
                <Badge className="mt-2 bg-pink-500/20 text-pink-400 text-xs">
                  {t('Recommended', 'Rekomendasi')}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const script = generateFinalScript();
    if (!script || !selectedFormat) return null;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {t('Your Script Blueprint', 'Blueprint Script Kamu')}
          </h3>
          <p className="text-gray-400 text-sm">
            {t('Here\'s a structure based on your idea. Adapt it to make it yours!', 'Ini struktur berdasarkan ide kamu. Sesuaikan supaya jadi milik kamu!')}
          </p>
        </div>

        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">
                {t('Your Idea:', 'Ide Kamu:')}
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm italic">"{userIdea}"</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" />
                <span className="text-pink-400 font-semibold">HOOK</span>
                <Badge variant="outline" className="text-xs border-pink-500/50 text-pink-400">
                  {t('First 3 seconds', '3 detik pertama')}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(t(script.hookEn, script.hookId), 'hook')}
                className="text-gray-400 hover:text-white"
              >
                {copiedSection === 'hook' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-white">{t(script.hookEn, script.hookId)}</p>
          </div>

          <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">{t('STRUCTURE', 'STRUKTUR')}</span>
              </div>
            </div>
            <div className="space-y-3">
              {(language === 'en' ? script.structureEn : script.structureId).map((point: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">{t('PRO TIPS', 'TIPS PRO')}</span>
            </div>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="flex items-center gap-2">
                <span>✓</span>
                {t('Make the hook match YOUR voice - don\'t sound scripted', 'Buat hook sesuai suara KAMU - jangan terdengar scripted')}
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                {t('Add your personal experience to make it unique', 'Tambah pengalaman personal supaya unik')}
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                {t('Test different hooks - if one doesn\'t work, try another!', 'Test hook berbeda - kalau satu gak work, coba yang lain!')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {t('Production Checklist', 'Checklist Produksi')}
        </h3>
        <p className="text-gray-400 text-sm">
          {t('Make sure you have these ready before recording', 'Pastikan kamu punya ini sebelum rekam')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="text-green-400">✓</span>
            {t('Basic Equipment', 'Peralatan Dasar')}
          </h4>
          <div className="space-y-3">
            {equipmentChecklist.basic.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-300 text-sm">{t(item.itemEn, item.itemId)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            {t('Recommended (Optional)', 'Rekomendasi (Opsional)')}
          </h4>
          <div className="space-y-3">
            {equipmentChecklist.recommended.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-300 text-sm">{t(item.itemEn, item.itemId)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border border-pink-500/30 rounded-xl">
        <h4 className="text-white font-medium mb-3">🎬 {t('Quick Recording Tips:', 'Tips Rekam Cepat:')}</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• {t('Record multiple takes - your 3rd or 4th is usually the best', 'Rekam beberapa take - biasanya yang ke-3 atau ke-4 terbaik')}</li>
          <li>• {t('Talk to one person, not "everyone"', 'Bicara ke satu orang, bukan ke "semuanya"')}</li>
          <li>• {t('Energy matters more than perfection', 'Energi lebih penting dari kesempurnaan')}</li>
          <li>• {t('Watch your video on mute - does it still make sense?', 'Tonton video kamu tanpa suara - masih masuk akal?')}</li>
        </ul>
      </div>

      <div className="p-4 bg-[#141414] border border-green-500/30 rounded-xl text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h4 className="text-white font-bold text-lg mb-2">
          {t('You\'re Ready to Create!', 'Kamu Siap Bikin!')}
        </h4>
        <p className="text-gray-400 text-sm mb-4">
          {t('Remember: The first video is rarely perfect. Just post it and learn!', 'Ingat: Video pertama jarang sempurna. Post aja dan belajar!')}
        </p>
        <Button
          onClick={() => {
            setStep(1);
            setUserIdea('');
            setSelectedFormat(null);
            setSelectedDuration(null);
            setShowRecommendations(false);
          }}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('Start New Video', 'Mulai Video Baru')}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="bg-[#141414] border-gray-800 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-pink-500" />
            {t('Video Creator Wizard', 'Wizard Bikin Video')}
          </CardTitle>
          <Badge variant="outline" className="border-pink-500/50 text-pink-400">
            {t('Step', 'Langkah')} {step} / {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-3 bg-gray-800" />
      </CardHeader>

      <CardContent className="p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {step > 1 && (
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('Back', 'Kembali')}
            </Button>
            
            {step < totalSteps && (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white"
              >
                {t('Next', 'Lanjut')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
