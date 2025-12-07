import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, Sparkles, Video, Radio, BookOpen, TrendingUp, 
  MessageSquare, Zap, Clock, Target, Copy, Check,
  RotateCcw, DollarSign, Users, Hash, Ghost, Lightbulb
} from 'lucide-react';
import { 
  tiktokKnowledge, scriptTemplates, liveTemplates,
  findKnowledge, findScriptTemplate, findLiveTemplate, detectIntent,
  KnowledgeItem, ScriptTemplate, LiveTemplate
} from '@/data/tiktok-knowledge';

type ResponseType = 'idle' | 'knowledge' | 'script' | 'live' | 'menu';

interface ResponseData {
  type: ResponseType;
  knowledge?: KnowledgeItem;
  script?: ScriptTemplate;
  live?: LiveTemplate;
}

const menuOptions = [
  { id: '1', labelEn: 'Create Video Script', labelId: 'Bikin Script Video', icon: '🎬', color: 'pink' },
  { id: '2', labelEn: 'Live Streaming Guide', labelId: 'Panduan Live Streaming', icon: '📺', color: 'red' },
  { id: '3', labelEn: 'FYP & Algorithm Tips', labelId: 'Tips FYP & Algoritma', icon: '📈', color: 'cyan' },
  { id: '4', labelEn: 'Grow Followers', labelId: 'Nambah Follower', icon: '👥', color: 'green' },
  { id: '5', labelEn: 'Boost Engagement', labelId: 'Tingkatkan Engagement', icon: '💬', color: 'purple' },
  { id: '6', labelEn: 'Monetization Guide', labelId: 'Panduan Monetisasi', icon: '💰', color: 'yellow' },
];

export function InteractiveCreatorHub() {
  const { t, language } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState<ResponseData>({ type: 'idle' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const processInput = () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const intent = detectIntent(userInput);
      
      if (intent.type === 'question') {
        const knowledge = findKnowledge(userInput);
        if (knowledge) {
          setResponse({ type: 'knowledge', knowledge });
        } else {
          const defaultKnowledge = tiktokKnowledge.find(k => k.id === 'fyp-algorithm');
          setResponse({ type: 'knowledge', knowledge: defaultKnowledge });
        }
      } else if (intent.type === 'script_request') {
        const script = findScriptTemplate(userInput, intent.duration);
        if (script) {
          setResponse({ type: 'script', script });
        } else {
          setResponse({ type: 'script', script: scriptTemplates[0] });
        }
      } else if (intent.type === 'live_request') {
        const live = findLiveTemplate(userInput, intent.duration);
        setResponse({ type: 'live', live: live || liveTemplates[0] });
      } else {
        const knowledge = findKnowledge(userInput);
        if (knowledge) {
          setResponse({ type: 'knowledge', knowledge });
        } else {
          setResponse({ type: 'menu' });
        }
      }
      
      setIsProcessing(false);
    }, 800);
  };

  const handleMenuClick = (menuId: string) => {
    switch (menuId) {
      case '1':
        setResponse({ type: 'script', script: scriptTemplates[0] });
        break;
      case '2':
        setResponse({ type: 'live', live: liveTemplates[0] });
        break;
      case '3':
        setResponse({ type: 'knowledge', knowledge: tiktokKnowledge.find(k => k.id === 'fyp-algorithm') });
        break;
      case '4':
        setResponse({ type: 'knowledge', knowledge: tiktokKnowledge.find(k => k.id === 'follower-growth') });
        break;
      case '5':
        setResponse({ type: 'knowledge', knowledge: tiktokKnowledge.find(k => k.id === 'engagement-rate') });
        break;
      case '6':
        setResponse({ type: 'knowledge', knowledge: tiktokKnowledge.find(k => k.id === 'monetization') });
        break;
    }
  };

  const resetConversation = () => {
    setUserInput('');
    setResponse({ type: 'idle' });
  };

  const renderSystemStatus = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm font-mono">BIAS System Boot Complete – v3.2α</span>
      </div>
      
      <div className="text-white">
        <span className="text-gray-400">{t('Hello', 'Halo')} </span>
        <span className="text-pink-400">bro</span>
        <span> 👋, </span>
        <span>{t('BIAS Pro system is now fully active.', 'sistem BIAS Pro sekarang aktif penuh.')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="py-2 pr-4">Layer</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Function</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-gray-800/50">
              <td className="py-2 pr-4">🧠 Core Engine</td>
              <td className="py-2 pr-4"><Badge className="bg-green-500/20 text-green-400 text-xs">✅ Active</Badge></td>
              <td className="py-2 text-xs text-gray-500">{t('Expression & ethics analysis', 'Analisa ekspresi & etika')}</td>
            </tr>
            <tr className="border-b border-gray-800/50">
              <td className="py-2 pr-4">🎥 VoiceEmotion</td>
              <td className="py-2 pr-4"><Badge className="bg-green-500/20 text-green-400 text-xs">✅ Active</Badge></td>
              <td className="py-2 text-xs text-gray-500">{t('Gesture, voice & emotion', 'Gesture, suara & emosi')}</td>
            </tr>
            <tr className="border-b border-gray-800/50">
              <td className="py-2 pr-4">📖 NLP Story</td>
              <td className="py-2 pr-4"><Badge className="bg-green-500/20 text-green-400 text-xs">✅ Loaded</Badge></td>
              <td className="py-2 text-xs text-gray-500">{t('Narrative structure', 'Struktur narasi')}</td>
            </tr>
            <tr className="border-b border-gray-800/50">
              <td className="py-2 pr-4">🎯 TikTok Master</td>
              <td className="py-2 pr-4"><Badge className="bg-green-500/20 text-green-400 text-xs">✅ Ready</Badge></td>
              <td className="py-2 text-xs text-gray-500">{t('Algorithm & growth education', 'Edukasi algoritma & growth')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQuickMenu = () => (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        {t('Choose a mode or tell me what you want to create:', 'Pilih mode atau ceritakan apa yang mau kamu buat:')}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {menuOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleMenuClick(option.id)}
            className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-left group"
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className="text-white text-sm font-medium group-hover:text-pink-400 transition-colors">
              {t(option.labelEn, option.labelId)}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {t('Press', 'Tekan')} {option.id}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#1A1A1A] border border-gray-800 rounded-xl mt-4">
        <p className="text-gray-400 text-sm mb-3">
          {t('Or type directly like:', 'Atau ketik langsung seperti:')}
        </p>
        <div className="space-y-2 text-sm">
          <div className="text-cyan-400">"Mau bikin VT 30 detik tentang cara nambah follower"</div>
          <div className="text-pink-400">"Emang tap tap layar itu boleh gak sih?"</div>
          <div className="text-green-400">"Gimana cara FYP di TikTok?"</div>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeResponse = () => {
    if (!response.knowledge) return null;
    const k = response.knowledge;

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'myth': return <Ghost className="w-5 h-5" />;
        case 'algorithm': return <TrendingUp className="w-5 h-5" />;
        case 'growth': return <Users className="w-5 h-5" />;
        case 'monetization': return <DollarSign className="w-5 h-5" />;
        case 'live': return <Radio className="w-5 h-5" />;
        case 'engagement': return <MessageSquare className="w-5 h-5" />;
        default: return <Lightbulb className="w-5 h-5" />;
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
            {getCategoryIcon(k.category)}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {k.icon} {language === 'en' ? k.titleEn : k.titleId}
            </h3>
            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs capitalize">{k.category}</Badge>
          </div>
        </div>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">{t('FACT', 'FAKTA')}</span>
          </div>
          <p className="text-white">{language === 'en' ? k.factEn : k.factId}</p>
        </div>

        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">{t('EXPLANATION', 'PENJELASAN')}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {language === 'en' ? k.explanationEn : k.explanationId}
          </p>
        </div>

        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">{t('TIPS', 'TIPS')}</span>
          </div>
          <ul className="space-y-2">
            {(language === 'en' ? k.tipsEn : k.tipsId).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-green-100 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm">{t('CONCLUSION', 'KESIMPULAN')}</span>
          </div>
          <p className="text-purple-100">{language === 'en' ? k.conclusionEn : k.conclusionId}</p>
        </div>

        <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
          <p className="text-pink-300 text-sm">
            💡 {language === 'en' ? k.followUpEn : k.followUpId}
          </p>
        </div>
      </div>
    );
  };

  const renderScriptResponse = () => {
    if (!response.script) return null;
    const s = response.script;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">
                🎬 {language === 'en' ? s.titleEn : s.titleId}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-pink-500/20 text-pink-400 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {s.duration}s
                </Badge>
                <Badge className="bg-gray-700 text-gray-300 text-xs capitalize">{s.category}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 font-semibold text-sm">HOOK (0-5s)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(language === 'en' ? s.hookEn : s.hookId, 'hook')}
              className="text-gray-400 hover:text-white h-8"
            >
              {copiedSection === 'hook' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-white italic">{language === 'en' ? s.hookEn : s.hookId}</p>
        </div>

        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm">MIDDLE (6-20s)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy((language === 'en' ? s.middleEn : s.middleId).join('\n'), 'middle')}
              className="text-gray-400 hover:text-white h-8"
            >
              {copiedSection === 'middle' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="space-y-2">
            {(language === 'en' ? s.middleEn : s.middleId).map((point, idx) => (
              <p key={idx} className="text-gray-300 text-sm">{point}</p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">CLOSING (21-30s)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(language === 'en' ? s.closingEn : s.closingId, 'closing')}
              className="text-gray-400 hover:text-white h-8"
            >
              {copiedSection === 'closing' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-white italic">{language === 'en' ? s.closingEn : s.closingId}</p>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm">{t('PRODUCTION TIPS', 'TIPS PRODUKSI')}</span>
          </div>
          <ul className="space-y-2">
            {(language === 'en' ? s.tipsEn : s.tipsId).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-purple-100 text-sm">
                <span className="text-purple-400 mt-0.5">🎬</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
          <p className="text-pink-300 text-sm">
            💡 {t('Want a more personal version or viral punchline style?', 'Mau versi lebih personal atau style viral punchline?')}
          </p>
        </div>
      </div>
    );
  };

  const renderLiveResponse = () => {
    if (!response.live) return null;
    const l = response.live;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              📺 {language === 'en' ? l.titleEn : l.titleId}
            </h3>
            <Badge className="bg-red-500/20 text-red-400 text-xs mt-1">
              <Clock className="w-3 h-3 mr-1" />
              {l.duration} {t('minutes', 'menit')}
            </Badge>
          </div>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-semibold text-sm">OPENING</span>
          </div>
          <p className="text-white italic">{language === 'en' ? l.openingEn : l.openingId}</p>
        </div>

        <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">TIMELINE</span>
          </div>
          <div className="space-y-3">
            {(language === 'en' ? l.timelineEn : l.timelineId).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs shrink-0">
                  {item.minute}m
                </Badge>
                <p className="text-gray-300 text-sm">{item.activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">{t('GIFT STRATEGY', 'STRATEGI GIFT')}</span>
          </div>
          <ul className="space-y-2">
            {(language === 'en' ? l.giftStrategyEn : l.giftStrategyId).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-yellow-100 text-sm">
                <span className="text-yellow-400 mt-0.5">🎁</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">CLOSING</span>
          </div>
          <p className="text-white italic">{language === 'en' ? l.closingEn : l.closingId}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#141414] border-gray-800 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        {response.type === 'idle' && (
          <>
            {renderSystemStatus()}
            {renderQuickMenu()}
          </>
        )}

        {response.type === 'menu' && renderQuickMenu()}
        {response.type === 'knowledge' && renderKnowledgeResponse()}
        {response.type === 'script' && renderScriptResponse()}
        {response.type === 'live' && renderLiveResponse()}

        {response.type !== 'idle' && (
          <div className="mt-6 pt-4 border-t border-gray-800">
            <Button
              onClick={resetConversation}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('New Question', 'Pertanyaan Baru')}
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  processInput();
                }
              }}
              placeholder={t(
                'Type your question or describe what you want to create...',
                'Ketik pertanyaan atau jelaskan apa yang mau kamu buat...'
              )}
              className="min-h-[60px] bg-[#1E1E1E] border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500 rounded-xl resize-none"
            />
            <Button
              onClick={processInput}
              disabled={!userInput.trim() || isProcessing}
              className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white px-6 h-auto"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {t('Press Enter to send, Shift+Enter for new line', 'Tekan Enter untuk kirim, Shift+Enter untuk baris baru')}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-600 text-xs text-center">
            Powered by BIAS™ – Behavioral Intelligence for Creators
            <br />
            <span className="text-gray-700">Designed by NM23 Ai | Supported by Newsmaker.id Labs</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
