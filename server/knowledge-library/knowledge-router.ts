// Smart Knowledge Router - Library-First Approach
// Answers from knowledge base, optional Ai enhancement

import { TikTokKnowledge, getTikTokTip } from './social-media/tiktok-guide';
import { InstagramKnowledge, getInstagramTip } from './social-media/instagram-guide';
import { YouTubeKnowledge, getYouTubeTip } from './social-media/youtube-guide';
import { PublicSpeakingGuide, getPublicSpeakingTip } from './communication/public-speaking-101';
import { MCPresenterGuide, getMCPresenterTip } from './communication/mc-presenter-guide';
import { BIASFrameworkGuide, getBIASLayerTip } from './bias-framework/bias-explained';
import OpenAI from 'openai';

interface KnowledgeResponse {
  answer: string;
  source: 'library' | 'library+ai' | 'out-of-scope';
  confidence: 'high' | 'medium' | 'low';
  relatedTopics?: string[];
}

export class KnowledgeRouter {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async answer(question: string): Promise<KnowledgeResponse> {
    console.log(`🔍 Knowledge Router: Processing question: "${question}"`);

    // STEP 1: Classify question topic
    const topic = this.classifyQuestion(question);
    
    if (!topic) {
      return {
        answer: `Hmm, saya belum yakin gimana bantu dengan pertanyaan ini. Tapi saya bisa bantu dengan:

📱 **Social Media:** TikTok viral strategy, Instagram Reels, YouTube growth
🎤 **Public Speaking:** Overcome nervousness, speech structure, body language
🎭 **MC/Presenter:** Event hosting, transitions, interview techniques
🧠 **BIAS Framework:** VBM (body language), EPM (emotions), NLP (language), BMIL (micro-cues), dll.

Coba tanya tentang salah satu topik di atas, atau rephrase pertanyaan dengan lebih spesifik!`,
        source: 'out-of-scope',
        confidence: 'high'
      };
    }

    console.log(`✅ Topic classified: ${topic}`);

    // STEP 2: Get library answer
    const libraryAnswer = this.getLibraryAnswer(topic, question);

    // STEP 2.5: Reformat to actionable format (TOMORROW/Week 1/Expected)
    libraryAnswer.answer = this.reformatToActionable(libraryAnswer.answer, question);

    // STEP 3: Optionally enhance with Ai
    if (this.openai && libraryAnswer.confidence === 'medium') {
      try {
        const enhancedAnswer = await this.enhanceWithAI(question, libraryAnswer.answer, topic);
        return {
          answer: enhancedAnswer,
          source: 'library+ai',
          confidence: 'high',
          relatedTopics: libraryAnswer.relatedTopics
        };
      } catch (error) {
        console.warn('⚠️ Ai enhancement failed, returning library answer:', error);
        return libraryAnswer;
      }
    }

    return libraryAnswer;
  }

  private reformatToActionable(rawAnswer: string, question: string): string {
    // Extract key actionable info from raw library answer
    // Reformat to: TOMORROW: ... Week 1: ... Expected: ...
    
    const q = question.toLowerCase();
    
    // If answer already has timeline format, return as-is
    if (rawAnswer.includes('TOMORROW:') || rawAnswer.includes('Week 1:')) {
      return rawAnswer;
    }
    
    // Extract tips/tactics from raw answer
    const hasBulletPoints = rawAnswer.includes('\n-') || rawAnswer.includes('\n•');
    const hasNumberedList = /\d+\.\s/.test(rawAnswer);
    
    // Create actionable wrapper
    let actionableAnswer = '';
    
    // Determine action based on question type
    if (q.includes('viral') || q.includes('fyp') || q.includes('growth')) {
      actionableAnswer = `**TOMORROW:** Bikin video 15-30 detik. Hook di 1-3 detik pertama (tanya/shocking statement/visual menarik).\n\n**Week 1:** Post 1 video/hari, jam 6-9 PM. Follow tips ini:\n${rawAnswer}\n\n**Expected Result:** 500+ views dalam 7 hari pertama. Potential FYP jika follow semua tips.`;
    } else if (q.includes('presentasi') || q.includes('speaking') || q.includes('nervous')) {
      actionableAnswer = `**STARTING NOW:** Record diri 5x (30 detik each). Fokus:\n${rawAnswer}\n\n**Week 1:** Practice 10 menit/hari. Target: kurangi nervousness, gesture lebih natural.\n\n**Expected Result:** Week 2 lebih confident, less filler words, better engagement.`;
    } else if (q.includes('reels') || q.includes('instagram') || q.includes('youtube')) {
      actionableAnswer = `**TOMORROW:** Optimize content pakai tips ini:\n${rawAnswer}\n\n**Week 1:** Apply 1-2 tips per video. Track metrics (views, engagement, retention).\n\n**Expected Result:** +15-25% engagement improvement dalam 2 minggu.`;
    } else {
      // Generic actionable format
      actionableAnswer = `**PRAKTIK INI:**\n${rawAnswer}\n\n**Timeline:** Start implementing sekarang. Review progress tiap minggu. Adjust strategy based on hasil.`;
    }
    
    return actionableAnswer;
  }

  private classifyQuestion(question: string): string | null {
    const q = question.toLowerCase();

    // 🔥 PRIORITY 1: Questions about analysis results / scores (MOST COMMON!)
    if (q.includes('hasil') || q.includes('result') || q.includes('score') || q.includes('nilai') ||
        q.includes('analisis') || q.includes('analysis') || q.includes('audia') || q.includes('improve') ||
        q.includes('fix') || q.includes('rendah') || q.includes('low') || q.includes('tinggi') || q.includes('high') ||
        q.includes('recommendation') || q.includes('rekomendasi') || q.includes('saran')) {
      // If asking about specific layer, classify as bias-framework
      if (q.includes('vbm') || q.includes('epm') || q.includes('nlp') || q.includes('eth') ||
          q.includes('eco') || q.includes('soc') || q.includes('cog') || q.includes('bmil')) {
        return 'bias-framework';
      }
      // Generic result/improvement questions → general communication advice
      return 'communication-general';
    }

    // BIAS Framework keywords (framework explanation)
    if (q.includes('bias') || q.includes('vbm') || q.includes('epm') || q.includes('nlp') ||
        q.includes('eth') || q.includes('eco') || q.includes('soc') || q.includes('cog') ||
        q.includes('bmil') || q.includes('layer') || q.includes('framework')) {
      return 'bias-framework';
    }

    // TikTok keywords (expanded)
    if (q.includes('tiktok') || q.includes('fyp') || q.includes('for you page') || 
        q.includes('viral') && (q.includes('video') || q.includes('content')) ||
        q.includes('foryou') || q.includes('tiktok algorithm')) {
      return 'tiktok';
    }

    // Instagram keywords (expanded)
    if (q.includes('instagram') || q.includes('ig') || q.includes('reels') || 
        q.includes('story') || q.includes('carousel') || q.includes('explore page') ||
        q.includes('insta')) {
      return 'instagram';
    }

    // YouTube keywords (expanded)
    if (q.includes('youtube') || q.includes('yt') || q.includes('subscriber') || 
        q.includes('thumbnail') || q.includes('retention') || q.includes('watch time') ||
        q.includes('youtube shorts') || q.includes('ctr')) {
      return 'youtube';
    }

    // Public Speaking keywords (MASSIVELY EXPANDED)
    if (q.includes('public speaking') || q.includes('presentasi') || q.includes('nervous') || 
        q.includes('grogi') || q.includes('gugup') || q.includes('bicara di depan umum') || 
        q.includes('audience') || q.includes('stage fright') || q.includes('demam panggung') ||
        q.includes('ngomong di depan') || q.includes('speech') || q.includes('pidato') ||
        q.includes('confidence') || q.includes('percaya diri') || q.includes('tampil') ||
        q.includes('perform') || q.includes('penampilan')) {
      return 'public-speaking';
    }

    // MC/Presenter keywords (expanded)
    if (q.includes('mc') || q.includes('master of ceremonies') || q.includes('host event') || 
        q.includes('presenter') || q.includes('interview') || q.includes('moderator') ||
        q.includes('pembawa acara') || q.includes('host')) {
      return 'mc-presenter';
    }

    // Generic social media (SUPER EXPANDED)
    if (q.includes('social media') || q.includes('sosmed') || q.includes('followers') || q.includes('follower') ||
        q.includes('engagement') || q.includes('content creator') || q.includes('creator') || q.includes('kreator') ||
        q.includes('likes') || q.includes('like') || q.includes('views') || q.includes('view') || q.includes('reach') ||
        q.includes('algorithm') || q.includes('algoritma') || q.includes('growth') || q.includes('tumbuh') || 
        q.includes('berkembang') || q.includes('share') || q.includes('shares') || q.includes('comment') || 
        q.includes('comments') || q.includes('komentar') || q.includes('viral') || q.includes('trending') ||
        q.includes('trend') || q.includes('hashtag') || q.includes('caption') || q.includes('posting') ||
        q.includes('schedule') || q.includes('jadwal') || q.includes('timing') || q.includes('waktu post') ||
        q.includes('analytics') || q.includes('metrics') || q.includes('data') || q.includes('statistik')) {
      return 'social-media-general';
    }

    // Generic communication (ULTRA COMPREHENSIVE - catch-all for communication topics)
    if (q.includes('komunikasi') || q.includes('communication') || q.includes('berbicara') || q.includes('bicara') ||
        q.includes('speaking') || q.includes('ngomong') || q.includes('talk') || q.includes('talking') ||
        // Body language & gestures
        q.includes('gesture') || q.includes('gestur') || q.includes('body language') || q.includes('bahasa tubuh') ||
        q.includes('postur') || q.includes('posture') || q.includes('ekspresi') || q.includes('expression') ||
        q.includes('kontak mata') || q.includes('eye contact') || q.includes('pandangan') || q.includes('tatapan') ||
        q.includes('gerakan') || q.includes('movement') || q.includes('tangan') || q.includes('hand') ||
        q.includes('mimik') || q.includes('wajah') || q.includes('facial') || q.includes('senyum') || q.includes('smile') ||
        // Voice & audio
        q.includes('suara') || q.includes('voice') || q.includes('nada') || q.includes('tone') || 
        q.includes('intonasi') || q.includes('intonation') || q.includes('volume') || q.includes('keras') || q.includes('loud') ||
        q.includes('pelan') || q.includes('soft') || q.includes('jelas') || q.includes('clear') || q.includes('clarity') ||
        q.includes('artikulasi') || q.includes('pronunciation') || q.includes('pelafalan') ||
        q.includes('audio') || q.includes('mic') || q.includes('microphone') || q.includes('recording') || q.includes('rekam') ||
        q.includes('podcast') || q.includes('voiceover') || q.includes('narasi audio') ||
        // Energy & emotions
        q.includes('energi') || q.includes('energy') || q.includes('emosi') || q.includes('emotion') || q.includes('feeling') ||
        q.includes('confident') || q.includes('confidence') || q.includes('ragu') || q.includes('yakin') || q.includes('pede') ||
        q.includes('kaku') || q.includes('stiff') || q.includes('tegang') || q.includes('tense') ||
        q.includes('natural') || q.includes('alami') || q.includes('santai') || q.includes('relaxed') ||
        q.includes('warmth') || q.includes('hangat') || q.includes('dingin') || q.includes('cold') ||
        q.includes('engaging') || q.includes('menarik') || q.includes('bosan') || q.includes('boring') || q.includes('monoton') ||
        // Language & words
        q.includes('kata-kata') || q.includes('words') || q.includes('bahasa') || q.includes('language') || q.includes('kalimat') ||
        q.includes('cerita') || q.includes('story') || q.includes('narasi') || q.includes('narrative') || q.includes('storytelling') ||
        q.includes('pesan') || q.includes('message') || q.includes('isi') || q.includes('konten verbal') ||
        q.includes('filler') || q.includes('umm') || q.includes('ehh') || q.includes('eee') || q.includes('uh') ||
        q.includes('jeda') || q.includes('pause') || q.includes('tempo') || q.includes('pace') || q.includes('pacing') ||
        // Audience & interaction
        q.includes('audiens') || q.includes('audience') || q.includes('pendengar') || q.includes('listener') ||
        q.includes('penonton') || q.includes('viewer') || q.includes('interaksi') || q.includes('interaction') ||
        // Action verbs & improvement
        q.includes('gimana') || q.includes('bagaimana') || q.includes('how to') || q.includes('how do') || q.includes('cara') ||
        q.includes('kenapa') || q.includes('why') || q.includes('mengapa') || q.includes('apa yang') || q.includes('what') ||
        q.includes('latihan') || q.includes('practice') || q.includes('drill') || q.includes('exercise') ||
        q.includes('belajar') || q.includes('learn') || q.includes('study') || q.includes('training') ||
        q.includes('tips') || q.includes('tip') || q.includes('saran') || q.includes('advice') || q.includes('help') ||
        q.includes('bantu') || q.includes('tolong') || q.includes('guide') || q.includes('panduan') || q.includes('tutorial') ||
        // Performance issues
        q.includes('gagal') || q.includes('fail') || q.includes('failed') || q.includes('salah') || q.includes('mistake') ||
        q.includes('masalah') || q.includes('problem') || q.includes('issue') || q.includes('susah') || q.includes('sulit') ||
        q.includes('difficult') || q.includes('hard') || q.includes('stuck') || q.includes('mentok') ||
        // Quality descriptors
        q.includes('bagus') || q.includes('good') || q.includes('baik') || q.includes('jelek') || q.includes('bad') ||
        q.includes('kurang') || q.includes('lack') || q.includes('lacking') || q.includes('lebih') || q.includes('more') ||
        q.includes('better') || q.includes('worse') || q.includes('improve') || q.includes('tingkatkan') ||
        // Video/content creation
        q.includes('video') || q.includes('vid') || q.includes('konten') || q.includes('content') || 
        q.includes('post') || q.includes('posting') || q.includes('upload') || q.includes('uploading') ||
        q.includes('bikin') || q.includes('buat') || q.includes('create') || q.includes('creating') ||
        q.includes('record') || q.includes('recording') || q.includes('rekam') || q.includes('shoot') || q.includes('shooting') ||
        q.includes('edit') || q.includes('editing') || q.includes('montage') || q.includes('transition') ||
        q.includes('opening') || q.includes('pembuka') || q.includes('hook') || q.includes('closing') || q.includes('penutup') ||
        q.includes('script') || q.includes('skrip') || q.includes('naskah') || q.includes('teks')) {
      return 'communication-general';
    }

    // SUPER LENIENT: If question contains "gimana" or "kenapa" or "cara" - likely asking for help
    if (q.includes('gimana') || q.includes('bagaimana') || q.includes('kenapa') || 
        q.includes('mengapa') || q.includes('cara') || q.includes('how') || q.includes('why')) {
      return 'communication-general'; // Default to communication help
    }

    return null; // Out of scope
  }

  private getLibraryAnswer(topic: string, question: string): KnowledgeResponse {
    const q = question.toLowerCase();

    switch (topic) {
      case 'tiktok':
        return this.answerTikTok(q);
      
      case 'instagram':
        return this.answerInstagram(q);
      
      case 'youtube':
        return this.answerYouTube(q);
      
      case 'public-speaking':
        return this.answerPublicSpeaking(q);
      
      case 'mc-presenter':
        return this.answerMCPresenter(q);
      
      case 'bias-framework':
        return this.answerBIASFramework(q);
      
      case 'social-media-general':
        return {
          answer: this.compileSocialMediaOverview(),
          source: 'library',
          confidence: 'high',
          relatedTopics: ['tiktok', 'instagram', 'youtube']
        };
      
      case 'communication-general':
        return {
          answer: this.compileCommunicationOverview(),
          source: 'library',
          confidence: 'high',
          relatedTopics: ['public-speaking', 'mc-presenter', 'bias-framework']
        };
      
      default:
        return {
          answer: "Topik ditemukan tapi belum ada jawaban di library. Coba pertanyaan lain!",
          source: 'library',
          confidence: 'low'
        };
    }
  }

  private answerTikTok(question: string): KnowledgeResponse {
    // Check for specific subtopics
    if (question.includes('fyp') || question.includes('viral')) {
      const fyp = TikTokKnowledge.algorithm.fyp;
      const factor1 = fyp.rankingFactors?.[0];
      const factor2 = fyp.rankingFactors?.[1];
      return {
        answer: `**Cara Masuk FYP TikTok:**\n\n${fyp.howItWorks}\n\n**Faktor Penting (urut prioritas):**\n\n1. ${factor1?.factor || 'Watch Time'} (${factor1?.importance || 'Critical'})\n   - ${factor1?.explanation || 'Berapa lama viewer menonton'}\n   - Cara improve: ${(factor1?.howToImprove || ['Hook kuat']).join(', ')}\n\n2. ${factor2?.factor || 'Engagement'}\n   - ${factor2?.explanation || 'Like, comment, share'}\n   - Cara improve: ${(factor2?.howToImprove || ['CTA jelas']).join(', ')}\n\n**Quick Tip:** ${getTikTokTip('fyp')}`,
        source: 'library',
        confidence: 'high',
        relatedTopics: ['tiktok-growth', 'tiktok-content-strategy']
      };
    }

    if (question.includes('growth') || question.includes('followers') || question.includes('tumbuh')) {
      const roadmap = TikTokKnowledge.growthRoadmap;
      return {
        answer: `**Roadmap Growth TikTok untuk Pemula:**\n\n**Week 1-2:** ${roadmap.week1to2.goal}\n- ${roadmap.week1to2.tasks.join('\n- ')}\nExpected: ${roadmap.week1to2.expectedResult}\n\n**Week 3-4:** ${roadmap.week3to4.goal}\n- ${roadmap.week3to4.tasks.join('\n- ')}\nExpected: ${roadmap.week3to4.expectedResult}\n\n**Month 2+:** ${roadmap.month2.goal}\n- ${roadmap.month2.tasks.join('\n- ')}\n\n**Quick Tip:** ${getTikTokTip('growth')}`,
        source: 'library',
        confidence: 'high',
        relatedTopics: ['tiktok-fyp', 'tiktok-mistakes']
      };
    }

    if (question.includes('mistake') || question.includes('kesalahan') || question.includes('views rendah')) {
      const mistakes = TikTokKnowledge.mistakesToAvoid;
      return {
        answer: `**5 Kesalahan Pemula TikTok:**\n\n${mistakes.map((m, i) => `${i+1}. **${m.mistake}**\n   - Fix: ${m.fix}\n   - ${m.timeline || m.why || m.impact}`).join('\n\n')}`,
        source: 'library',
        confidence: 'high',
        relatedTopics: ['tiktok-troubleshooting']
      };
    }

    // Default TikTok answer
    return {
      answer: `**TikTok Quick Guide:**\n\n${getTikTokTip('fyp')}\n\nMau tahu lebih detail? Tanya tentang: FYP strategy, growth roadmap, common mistakes, posting schedule, atau troubleshooting low views.`,
      source: 'library',
      confidence: 'medium',
      relatedTopics: ['tiktok-fyp', 'tiktok-growth']
    };
  }

  private answerInstagram(question: string): KnowledgeResponse {
    if (question.includes('reels')) {
      const reels = InstagramKnowledge.reels;
      return {
        answer: `**Instagram Reels Optimization:**\n\n${reels.algorithm.howItWorks}\n\n**Top 3 Ranking Factors:**\n1. ${reels.algorithm.rankingFactors[0].factor} - ${reels.algorithm.rankingFactors[0].explanation}\n2. ${reels.algorithm.rankingFactors[1].factor} - ${reels.algorithm.rankingFactors[1].explanation}\n3. ${reels.algorithm.rankingFactors[2].factor} - ${reels.algorithm.rankingFactors[2].explanation}\n\n**Quick Tip:** ${getInstagramTip('reels')}`,
        source: 'library',
        confidence: 'high'
      };
    }

    if (question.includes('growth') || question.includes('followers')) {
      const tactics = InstagramKnowledge.growth.organicTactics;
      return {
        answer: `**5 Taktik Growth Instagram:**\n\n${tactics.slice(0, 5).map((t, i) => `${i+1}. **${t.tactic}**\n   - Why: ${t.why}\n   - How: ${Array.isArray(t.howTo) ? t.howTo.join('; ') : t.howTo}`).join('\n\n')}\n\n**Quick Tip:** ${getInstagramTip('growth')}`,
        source: 'library',
        confidence: 'high'
      };
    }

    return {
      answer: `**Instagram Quick Guide:**\n\n${getInstagramTip('reels')}\n\nTanya lebih detail tentang: Reels strategy, growth tactics, engagement tips, hashtags, atau monetization.`,
      source: 'library',
      confidence: 'medium'
    };
  }

  private answerYouTube(question: string): KnowledgeResponse {
    if (question.includes('thumbnail') || question.includes('ctr') || question.includes('click')) {
      const ctr = YouTubeKnowledge.algorithm.rankingFactors[0];
      const benchmark = ctr?.benchmark || { poor: '<2%', good: '4-6%', excellent: '>8%' };
      const optimization = ctr?.optimization || { thumbnail: [], title: [] };
      return {
        answer: `**YouTube CTR (Click-Through Rate) Optimization:**\n\n${ctr?.explanation || 'CTR adalah rasio klik terhadap impressi thumbnail.'}\n\n**Benchmark:**\n- Poor: ${benchmark.poor}\n- Good: ${benchmark.good}\n- Excellent: ${benchmark.excellent}\n\n**Thumbnail Best Practices:**\n${(optimization.thumbnail || []).map(t => `- ${t}`).join('\n')}\n\n**Title Best Practices:**\n${(optimization.title || []).map(t => `- ${t}`).join('\n')}\n\n**Quick Tip:** ${getYouTubeTip('ctr')}`,
        source: 'library',
        confidence: 'high'
      };
    }

    if (question.includes('retention') || question.includes('watch time')) {
      return {
        answer: `**YouTube Retention Strategy:**\n\n${getYouTubeTip('retention')}\n\nDetail lengkap ada di knowledge base - tanya spesifik tentang hook formulas, pattern interrupts, atau retention graph analysis!`,
        source: 'library',
        confidence: 'high'
      };
    }

    return {
      answer: `**YouTube Quick Guide:**\n\n${getYouTubeTip('growth')}\n\nTanya detail tentang: CTR optimization, retention strategy, SEO, monetization, atau troubleshooting.`,
      source: 'library',
      confidence: 'medium'
    };
  }

  private answerPublicSpeaking(question: string): KnowledgeResponse {
    if (question.includes('nervous') || question.includes('grogi') || question.includes('gugup')) {
      const nervousness = PublicSpeakingGuide.beginners.nervousness;
      return {
        answer: `**Mengatasi Nervous Public Speaking:**\n\n${nervousness.whyItHappens}\n\n**3 Teknik Paling Efektif:**\n\n1. **${nervousness.solutions[0].technique}**\n   - How: ${nervousness.solutions[0].howTo}\n   - Why it works: ${nervousness.solutions[0].whyItWorks}\n\n2. **${nervousness.solutions[1].technique}**\n   - How: ${nervousness.solutions[1].howTo}\n   - Why it works: ${nervousness.solutions[1].whyItWorks}\n\n3. **${nervousness.solutions[2].technique}**\n   - How: ${nervousness.solutions[2].howTo}\n   - Why it works: ${nervousness.solutions[2].whyItWorks}\n\n**Quick Tip:** ${getPublicSpeakingTip('nervousness')}`,
        source: 'library',
        confidence: 'high'
      };
    }

    if (question.includes('struktur') || question.includes('structure') || question.includes('organize')) {
      return {
        answer: `**Struktur Public Speaking:**\n\n${getPublicSpeakingTip('structure')}\n\nDetail lengkap struktur Opening-Body-Closing ada di knowledge base!`,
        source: 'library',
        confidence: 'high'
      };
    }

    return {
      answer: `**Public Speaking Quick Guide:**\n\n${getPublicSpeakingTip('beginner')}\n\nTanya detail tentang: Overcoming nervousness, speech structure, body language, voice techniques, atau practice roadmap.`,
      source: 'library',
      confidence: 'medium'
    };
  }

  private answerMCPresenter(question: string): KnowledgeResponse {
    if (question.includes('opening') || question.includes('pembuka')) {
      return {
        answer: `**MC Opening Techniques:**\n\n${getMCPresenterTip('opening')}\n\nDetail lengkap energy hooks, welcome structure, dan housekeeping tips ada di knowledge base!`,
        source: 'library',
        confidence: 'high'
      };
    }

    if (question.includes('transition') || question.includes('introduce speaker')) {
      return {
        answer: `**MC Transitions & Speaker Introductions:**\n\n${getMCPresenterTip('transitions')}\n\nDetail lengkap formula build credibility → anticipation → name reveal + applause cue!`,
        source: 'library',
        confidence: 'high'
      };
    }

    return {
      answer: `**MC/Presenter Quick Guide:**\n\n${getMCPresenterTip('practice')}\n\nTanya detail tentang: Opening techniques, transitions, energy management, crisis handling, atau interview skills.`,
      source: 'library',
      confidence: 'medium'
    };
  }

  private answerBIASFramework(question: string): KnowledgeResponse {
    const layers = ['vbm', 'epm', 'nlp', 'eth', 'eco', 'soc', 'cog', 'bmil'];
    
    for (const layer of layers) {
      if (question.includes(layer)) {
        return {
          answer: `**BIAS Layer: ${layer.toUpperCase()}**\n\n${getBIASLayerTip(layer)}\n\nDetail lengkap explanations, drills, dan examples ada di knowledge base!`,
          source: 'library',
          confidence: 'high',
          relatedTopics: layers.filter(l => l !== layer)
        };
      }
    }

    // General BIAS framework question
    return {
      answer: `**BIAS Framework Overview:**\n\n${BIASFrameworkGuide.overview.whatIs}\n\n**8 Layers:**\n1. VBM - Visual Behavior Mapping (body language)\n2. EPM - Emotional Processing Mapping (emotional intelligence)\n3. NLP - Narrative & Language Patterns (word choice & story)\n4. ETH - Ethical Framework (integrity & fact-checking)\n5. ECO - Ecosystem Awareness (platform optimization)\n6. SOC - Social Intelligence (audience psychology)\n7. COG - Cognitive Load Management (information density)\n8. BMIL - Behavioral Micro-Indicators (subtle cues)\n\nTanya tentang layer spesifik untuk detail lengkap!`,
      source: 'library',
      confidence: 'high',
      relatedTopics: layers
    };
  }

  private compileSocialMediaOverview(): string {
    return `**Social Media Platform Comparison:**\n\n**TikTok:** ${getTikTokTip('fyp')}\n\n**Instagram:** ${getInstagramTip('reels')}\n\n**YouTube:** ${getYouTubeTip('ctr')}\n\nTanya spesifik tentang platform yang kamu pakai untuk strategi detail!`;
  }

  private compileCommunicationOverview(): string {
    return `**Improve Komunikasi Kamu:**\n\n**Body Language (VBM):** ${getBIASLayerTip('vbm')}\n\n**Emotions & Energy (EPM):** ${getBIASLayerTip('epm')}\n\n**Language & Story (NLP):** ${getBIASLayerTip('nlp')}\n\n**Platform Optimization (ECO):** ${getBIASLayerTip('eco')}\n\n**Micro-Indicators (BMIL):** ${getBIASLayerTip('bmil')}\n\nTanya spesifik tentang layer atau area yang mau di-improve untuk guidance lebih detail!`;
  }

  private async enhanceWithAI(question: string, libraryAnswer: string, topic: string): Promise<string> {
    if (!this.openai) {
      return libraryAnswer;
    }

    const systemPrompt = `Kamu adalah BIAS Assistant - expert dalam komunikasi, public speaking, dan social media strategy.

User bertanya tentang topik: ${topic}

Kamu sudah punya jawaban dari knowledge base library. Tugasmu:
1. Perkaya jawaban library dengan context tambahan
2. Tambahkan contoh konkret atau analogi
3. Jawab dengan bahasa awam-friendly, praktis, actionable
4. Jangan bertentangan dengan library answer - ENRICH it, don't replace

Keep answer concise (max 300 words) dan conversational.`;

    const userPrompt = `Pertanyaan: ${question}\n\nJawaban dari library:\n${libraryAnswer}\n\nEnrich this answer with additional context, examples, or practical tips.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content || libraryAnswer;
  }
}

// Export singleton instance
export const knowledgeRouter = new KnowledgeRouter();
