// Account Analyzer - Educational insights for TikTok, Instagram, YouTube accounts

import { 
  detectNiche, 
  getBenchmark, 
  calculateEngagementRate, 
  calculateFollowerLikeRatio,
  detectBotPatterns 
} from './benchmarks';
import { detectSocialMediaLevel, type SkillLevel } from './skill-level-detector';
import { EducationalInsight, AccountMetrics, AnalysisResult, PriorityLevel } from './types';

interface AccountAnalyzerInput {
  platform: 'tiktok' | 'instagram' | 'youtube';
  username: string;
  bio?: string;
  metrics: AccountMetrics;
  hashtags?: string[];
}

export class AccountAnalyzer {
  private platform: 'tiktok' | 'instagram' | 'youtube';
  private niche: string;
  private benchmark: any;
  private metrics: AccountMetrics;
  private skillLevel: SkillLevel;
  private skillConfidence: number;

  constructor(input: AccountAnalyzerInput) {
    this.platform = input.platform;
    this.metrics = input.metrics;
    this.niche = detectNiche(input.bio || '', input.hashtags || [], input.platform);
    this.benchmark = getBenchmark(input.platform, this.niche);
    
    // Detect skill level for adaptive recommendations
    const skillDetection = detectSocialMediaLevel({
      platform: input.platform,
      followers: input.metrics.followers,
      subscribers: input.metrics.subscribers,
      engagementRate: input.metrics.engagementRate,
      postsPerWeek: input.metrics.videoCount / 4, // rough estimate
      contentQuality: 70, // default, can be enhanced later
    });
    
    this.skillLevel = skillDetection.level;
    this.skillConfidence = skillDetection.confidence;
  }

  analyze(): AnalysisResult {
    const insights: EducationalInsight[] = [];

    // 1. Engagement Rate Analysis
    insights.push(this.analyzeEngagementRate());

    // 2. Follower Quality Analysis
    insights.push(this.analyzeFollowerQuality());

    // 3. Content Consistency Analysis
    insights.push(this.analyzeContentConsistency());

    // 4. Growth Potential Analysis
    insights.push(this.analyzeGrowthPotential());

    // 5. Posting Frequency Analysis
    insights.push(this.analyzePostingFrequency());

    // Categorize by priority
    const urgent = insights.filter(i => i.recommendations.some(r => r.priority === 'urgent'));
    const important = insights.filter(i => i.recommendations.some(r => r.priority === 'important'));
    const opportunities = insights.filter(i => i.recommendations.some(r => r.priority === 'opportunity'));

    const overallScore = this.calculateOverallScore(insights);

    return {
      overallScore,
      summary: this.generateSummary(overallScore, urgent.length, important.length),
      insights,
      priorities: { urgent, important, opportunities },
      nextSteps: this.generateNextSteps(urgent, important, opportunities),
    };
  }

  private analyzeEngagementRate(): EducationalInsight {
    const engagementRate = this.metrics.engagementRate;
    const benchmark = this.benchmark.avgEngagementRate;
    const topPerformer = this.benchmark.topPerformerEngagement;

    let score = 0;
    if (engagementRate >= topPerformer) score = 100;
    else if (engagementRate >= benchmark) score = 60 + ((engagementRate - benchmark) / (topPerformer - benchmark)) * 40;
    else score = (engagementRate / benchmark) * 60;

    score = Math.round(Math.max(0, Math.min(100, score)));

    let diagnosis = '';
    let priority: PriorityLevel = 'opportunity';
    
    if (engagementRate < benchmark * 0.5) {
      diagnosis = `🚨 **Critical Alert!** Engagement rate Anda **${engagementRate.toFixed(2)}%** jauh di bawah rata-rata niche ${this.niche} (${benchmark}%) - ini gap yang significant! Ini bisa jadi tanda bahwa audience Anda kurang engaged dengan konten, atau ada banyak follower fake/bot yang menurunkan metric. Engagement rate adalah #1 metric yang diliat algoritma ${this.platform.toUpperCase()} untuk decide apakah push konten ke FYP/Explore atau tidak. Skor rendah = konten Anda stuck di bubble kecil tanpa viral potential. TAPI kabar baiknya: engagement adalah metric yang paling bisa di-improve dengan strategic content optimization! Fix this first sebelum fokus ke growth metrics lain.`;
      priority = 'urgent';
    } else if (engagementRate < benchmark) {
      diagnosis = `⚠️ **Room for Improvement!** Engagement rate Anda **${engagementRate.toFixed(2)}%** sedikit di bawah rata-rata niche ${this.niche} (${benchmark}%) - Anda almost there! Ini menunjukkan audience Anda cukup engaged, tapi masih ada ruang untuk optimization. Gap ini biasanya bisa diclose dengan improve content hook (3 detik pertama), optimize posting timing, atau strengthen call-to-action. Small tweaks bisa create big impact - dari ${engagementRate.toFixed(1)}% ke ${benchmark}% itu achievable dalam 2-4 minggu dengan consistent optimization!`;
      priority = 'important';
    } else if (engagementRate >= topPerformer) {
      diagnosis = `🔥 **EXCEPTIONAL!** Engagement rate Anda **${engagementRate.toFixed(2)}%** sudah di level **TOP PERFORMER** - ini artinya Anda masuk kategori elite tier di ${this.platform.toUpperCase()}! Content Anda tidak cuma dilihat, tapi benar-benar di-interact oleh audience (like, comment, share, save). Algoritma sangat prioritize akun dengan ER setinggi ini. Challenge sekarang adalah **maintain consistency** - banyak creator yang drop setelah hit peak. Keep analyzing what works, double down on proven formats, dan jangan takut experiment 20-30% dengan content baru. You're in the winning zone! 🚀`;
      priority = 'opportunity';
    } else {
      diagnosis = `💪 **Above Average - Good Job!** Engagement rate Anda **${engagementRate.toFixed(2)}%** sudah di atas rata-rata niche ${this.niche} (${benchmark}%) - ini menunjukkan Anda doing something right! Audience Anda lebih engaged dibanding majority creator di niche yang sama. Sekarang tinggal push ke tier berikutnya (top performer ${topPerformer}%) dengan optimize hook quality, consistency, dan strategic call-to-action. Anda already in the right direction, just need that extra 10-20% boost!`;
      priority = 'opportunity';
    }

    const recommendations: EducationalInsight['recommendations'] = [];

    if (engagementRate < benchmark) {
      // ADAPTIVE: Different advice based on skill level
      if (this.skillLevel === 'beginner') {
        recommendations.push({
          priority,
          icon: 'AlertCircle',
          title: '📚 Foundation: Build Engagement dari Nol',
          description: 'Engagement adalah metric paling penting - ini yang diliat algoritma untuk push konten Anda ke FYP/Explore',
          steps: [
            '🎣 HOOK 3-DETIK: 70% viewer decide skip/watch dalam 3 detik pertama - mulai dengan "Stop scrolling!" atau shocking statement',
            `⏰ TIMING: Post di jam ${this.platform === 'tiktok' ? '7-9 malam (peak TikTok time)' : this.platform === 'instagram' ? '6-8 malam (peak IG time)' : '2-4 sore (peak YouTube time)'}`,
            '💬 CTA JELAS: Akhiri dengan "Comment kalau setuju!" atau "Tag teman Anda yang begini!"',
            '⚡ BALAS CEPAT: Balas semua comment dalam 1 jam pertama - algoritma boost konten yang engaging',
            `📈 TREND: Pakai ${this.platform === 'tiktok' ? 'trending sound' : this.platform === 'instagram' ? 'viral Reel format' : 'trending Shorts topic'} - instant visibility boost`,
          ],
          impactEstimate: `Target engagement ${benchmark}% = +${((benchmark - engagementRate) * 1.5).toFixed(1)}% boost dalam 2-3 minggu`,
        });
      } else if (this.skillLevel === 'intermediate') {
        recommendations.push({
          priority,
          icon: 'AlertCircle',
          title: '⚡ Optimization: Boost Engagement Rate',
          description: 'Anda sudah punya foundation - sekarang optimize ke benchmark niche Anda',
          steps: [
            `🔍 ANALYZE: Review 10 video terakhir Anda - mana yang ER > ${benchmark}%? Cari pattern topic/format/hook`,
            `⏰ A/B TEST TIMING: Test posting ${this.platform === 'tiktok' ? '7-9 pagi vs 7-9 malam' : this.platform === 'instagram' ? 'weekday vs weekend' : 'different days/times'} untuk find sweet spot audience Anda`,
            '🎯 NICHE DOWN: Narrow fokus ke 1-2 sub-topics specific - broad content = low engagement',
            '💬 COMMENT ENGAGEMENT: Pin comment dengan question untuk trigger discussion thread',
            `📊 ANALYTICS: Track which ${this.platform === 'tiktok' ? 'sounds/effects' : this.platform === 'instagram' ? 'Reel formats' : 'video lengths'} get highest ER - double down on winners`,
          ],
          impactEstimate: `Optimization target: ${benchmark}% = +${((benchmark - engagementRate)).toFixed(1)}% boost`,
        });
      } else { // professional
        recommendations.push({
          priority,
          icon: 'AlertCircle',
          title: '🧠 Strategic Issue: Engagement Drop Analysis',
          description: 'Unusual untuk level Anda - perlu root cause analysis strategis',
          steps: [
            `📉 RETENTION CURVE ANALYSIS: Check audience retention - where do viewers drop off? Optimize pacing/content structure`,
            `🎯 AUDIENCE SEGMENTATION: Apakah Anda expanding ke new niche? Bisa temporarily lower ER while building new segment`,
            `📊 PLATFORM ALGORITHM SHIFT: ${this.platform.toUpperCase()} algorithm recently changed? Adjust content strategy accordingly`,
            '🔄 CONTENT MIX REVIEW: Apakah Anda too focused di satu format? Test 70% proven + 30% experimental',
            `💡 PSYCHOLOGICAL TRIGGERS: Test loss aversion messaging ("Don't make this mistake...") vs gain framing ("How to achieve...")`,
          ],
          impactEstimate: `Strategic fix target: ${benchmark}% benchmark recovery + ${topPerformer}% stretch goal`,
        });
      }
    } else {
      // Above benchmark - scale up advice
      if (this.skillLevel === 'professional') {
        recommendations.push({
          priority: 'opportunity',
          icon: 'TrendingUp',
          title: '💎 Advanced Strategy: Dominate Top Performer Tier',
          description: 'Anda sudah di elite tier - sekarang optimize untuk market leadership',
          steps: [
            '📈 CONTENT ANALYTICS DEEP DIVE: Analyze save rate vs share rate vs comment rate - each indicates different value type',
            '🔬 PSYCHOLOGICAL FRAMING: Test different narrative frameworks - hero\'s journey vs problem-solution vs curiosity gap',
            '🤝 STRATEGIC PARTNERSHIPS: Kolaborasi dengan peers di same tier untuk audience cross-pollination',
            `⚡ PLATFORM-SPECIFIC OPTIMIZATION: ${this.platform === 'tiktok' ? 'Multi-hook strategy (hook setiap 7 detik)' : this.platform === 'instagram' ? 'Carousel engagement optimization' : 'Watch time optimization (target >50%)'}`,
            '💰 MONETIZATION INTEGRATION: Test sponsored content integration tanpa sacrifice authenticity/ER',
          ],
          impactEstimate: `Elite optimization: maintain ${engagementRate.toFixed(1)}% + explore ${topPerformer}% tier`,
        });
      } else {
        recommendations.push({
          priority: 'opportunity',
          icon: 'TrendingUp',
          title: `${this.skillLevel === 'beginner' ? '📈 Next Level' : '⚡ Scale Up'}: Push ke Top Performer`,
          description: 'Anda sudah bagus - sekarang push ke top ${topPerformer}%',
          steps: [
            '🔍 PATTERN RECOGNITION: Analisa 5 video Anda yang paling viral - cari commonalities di hook/topic/delivery',
            '📊 DOUBLE DOWN: 70% content = proven format yang works, 30% experimental',
            `🎯 ${this.skillLevel === 'beginner' ? 'CONSISTENCY: Target minimal ' + (this.platform === 'tiktok' ? '5x/week' : this.platform === 'instagram' ? '4x/week' : '3x/week') : 'QUALITY OVER QUANTITY: Better 3 viral-potential videos than 7 average ones'}`,
            `🤝 ${this.skillLevel === 'beginner' ? 'ENGAGE: Balas SETIAP comment untuk build community' : 'COLLABORATION: Partner dengan creators di niche Anda'}`,
          ],
          impactEstimate: `Target ${topPerformer}% = +${Math.round((topPerformer - engagementRate) / engagementRate * 100)}% growth potential`,
        });
      }
    }

    return {
      term: 'Engagement Rate (ER)',
      score,
      category: 'Performance',
      definition: `**Engagement Rate** adalah persentase berapa banyak audience Anda yang benar-benar **berinteraksi** (like, comment, share, save) dibanding total follower. Ini metric paling penting karena algoritma ${this.platform.toUpperCase()} prioritas konten dengan ER tinggi ke FYP/Explore.`,
      diagnosis,
      benchmark: {
        yourScore: parseFloat(engagementRate.toFixed(2)),
        nicheAverage: benchmark,
        topPerformer: topPerformer,
        explanation: `Niche "${this.niche}" di ${this.platform.toUpperCase()}: rata-rata ${benchmark}%, top performer ${topPerformer}%. Anda di ${engagementRate >= benchmark ? 'ATAS' : 'BAWAH'} rata-rata.`,
      },
      recommendations,
    };
  }

  private analyzeFollowerQuality(): EducationalInsight {
    const botDetection = detectBotPatterns({
      followers: this.metrics.followers,
      following: this.metrics.following,
      totalLikes: this.metrics.totalLikes,
      videoCount: this.metrics.videoCount,
      engagementRate: this.metrics.engagementRate,
    });

    const score = Math.round(100 - botDetection.botScore);
    
    let diagnosis = '';
    let priority: PriorityLevel = 'opportunity';

    if (botDetection.botScore > 60) {
      diagnosis = `🚨 **DANGER ZONE - RED FLAG ALERT!** Sistem detect **${botDetection.botScore.toFixed(0)}% kemungkinan** follower Anda adalah fake/bot - ini **SANGAT BERBAHAYA** karena algoritma ${this.platform.toUpperCase()} bisa shadow-ban akun Anda! Shadow-ban artinya konten Anda akan stuck, reach drop drastis, dan hampir impossible untuk viral. Platform punya Ai detection system yang semakin canggih identify fake engagement patterns. Bot followers tidak cuma zero value - mereka actively HARM akun Anda karena destroy engagement rate dan trigger algorithm penalty. This is URGENT - clean up ASAP atau risk losing semua organic reach yang sudah Anda build!`;
      priority = 'urgent';
    } else if (botDetection.botScore > 30) {
      diagnosis = `⚠️ **WARNING - Moderate Bot Risk!** Terdeteksi **${botDetection.botScore.toFixed(0)}% kemungkinan** ada follower fake/bot di akun Anda. Belum critical, tapi perlu action sebelum algoritma start penalize. Bot followers bikin engagement rate drop (karena mereka gak interact) dan bisa trigger platform's spam detection system. Semakin lama dibiarkan, semakin susah di-clean. Better fix now saat masih moderate level daripada wait sampai jadi crisis. Organic growth might slower, tapi jauh lebih sustainable dan safer untuk long-term!`;
      priority = 'important';
    } else {
      diagnosis = `✅ **Healthy Organic Growth!** Follower Quality Score Anda **${score}/100** - ini menunjukkan mayoritas follower Anda adalah **REAL people** yang genuinely interested dengan content Anda. Ini adalah foundation yang solid untuk sustainable growth! Organic followers = higher engagement rate + loyal community + algorithm favorability. Keep this clean growth strategy - better 1000 real engaged followers than 10,000 ghost/bot accounts. Quality always beats quantity di era new algorithm!`;
      priority = 'opportunity';
    }

    const recommendations: EducationalInsight['recommendations'] = [];

    if (botDetection.botScore > 30) {
      recommendations.push({
        priority,
        icon: 'Shield',
        title: 'Bersihkan Follower Fake/Bot',
        description: 'Follower fake menurunkan engagement rate dan bisa bikin akun Anda di-shadow-ban',
        steps: [
          `${this.platform === 'instagram' ? 'Gunakan fitur "Remove Follower" di Instagram' : 'Blokir akun yang mencurigakan'}`,
          'STOP pakai jasa beli follower atau auto-follow tools',
          'Focus ke organic growth: konten berkualitas + konsisten posting',
          'Aktifkan verifikasi 2-faktor untuk cegah spam bot',
          ...botDetection.reasons.map(r => `⚠️ ${r}`),
        ],
        impactEstimate: 'Clean follower bisa restore engagement rate dalam 1-2 bulan + hindari shadow-ban',
      });
    }

    const followRatio = this.metrics.following / (this.metrics.followers || 1);
    if (followRatio > 1.5) {
      recommendations.push({
        priority: 'important',
        icon: 'Users',
        title: 'Perbaiki Following:Follower Ratio',
        description: `Anda follow ${this.metrics.following} orang tapi cuma punya ${this.metrics.followers} follower. Ini terlihat desperate dan kurang authority.`,
        steps: [
          'Unfollow akun yang gak follow back (gunakan tools seperti Cleaner for IG)',
          'Target ratio ideal: 1:2 atau lebih baik (follower 2x lipat dari following)',
          'Stop strategi follow-for-follow - ini gak sustainable',
          'Build authority: buat konten yang bikin orang CARI Anda, bukan Anda yang cari mereka',
        ],
        impactEstimate: 'Ratio 1:2 = +35% perceived authority & kredibilitas',
      });
    }

    return {
      term: 'Follower Quality Score',
      score,
      category: 'Authenticity',
      definition: `**Follower Quality** mengukur seberapa **REAL** follower Anda. Bot/fake follower bikin engagement rate anjlok dan bisa bikin algoritma shadow-ban akun Anda. ${this.platform.toUpperCase()} detection system semakin canggih mendeteksi fake engagement.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 85,
        topPerformer: 95,
        explanation: `Target ideal: 85%+ real followers. Top creator: 95%+. Skor Anda: ${score}%.`,
      },
      recommendations,
    };
  }

  private analyzeContentConsistency(): EducationalInsight {
    const videoCount = this.metrics.videoCount;
    const expectedVideos = this.benchmark.idealPostFrequency * 12; // 3 months worth
    
    let score = 0;
    if (videoCount >= expectedVideos) score = 100;
    else score = (videoCount / expectedVideos) * 100;
    score = Math.round(Math.max(0, Math.min(100, score)));

    const actualFrequency = this.metrics.postingFrequency || (videoCount / 12); // assume 12 weeks
    const idealFrequency = this.benchmark.idealPostFrequency;

    let diagnosis = '';
    let priority: PriorityLevel = 'opportunity';

    if (actualFrequency < idealFrequency * 0.5) {
      diagnosis = `⚠️ **Posting Terlalu Jarang!** Anda posting **${actualFrequency.toFixed(1)}x/minggu**, jauh di bawah ideal ${idealFrequency}x/minggu untuk niche ${this.niche}. Algoritma ${this.platform.toUpperCase()} **prioritas creator yang konsisten** - low frequency = low reach! Konsistensi adalah kunci untuk build algorithm favorability. Even konten bagus akan struggle viral kalau posting frequency terlalu rendah karena algoritma butuh consistent signal untuk trust dan push akun Anda!`;
      priority = 'urgent';
    } else if (actualFrequency < idealFrequency) {
      diagnosis = `📊 **Almost There!** Anda posting **${actualFrequency.toFixed(1)}x/minggu**, sedikit di bawah ideal ${idealFrequency}x/minggu. Anda hampir hit sweet spot! Tingkatkan consistency sedikit lagi untuk maximize reach dan algorithm boost. Remember: regular posting schedule = reliable signal ke algoritma = more FYP/Explore push!`;
      priority = 'important';
    } else {
      diagnosis = `✅ **Konsistensi Excellent!** Anda posting **${actualFrequency.toFixed(1)}x/minggu**, sudah KONSISTEN dan memenuhi ideal frequency! Ini menunjukkan commitment Anda ke content creation. Pertahankan momentum ini - consistency adalah foundation dari sustainable growth. Algoritma already trust akun Anda untuk consistently deliver value ke audience!`;
      priority = 'opportunity';
    }

    const recommendations = [];

    if (actualFrequency < idealFrequency) {
      recommendations.push({
        priority: priority as PriorityLevel,
        icon: 'Calendar',
        title: 'Tingkatkan Posting Consistency',
        description: 'Algoritma reward creator yang posting teratur. Consistency > Quality pada tahap growth awal.',
        steps: [
          `Target: ${idealFrequency}x posting per minggu (${Math.ceil(idealFrequency / 7)} hari sekali)`,
          'Buat content calendar: planning 2 minggu ke depan',
          'Batch recording: rekam 3-5 video sekaligus dalam 1 hari',
          'Gunakan scheduling tools (Later, Buffer) untuk auto-post di jam prime',
          'Repurpose konten: 1 video panjang → pecah jadi 3-4 short clips',
        ],
        impactEstimate: `Konsisten posting = ${this.platform === 'tiktok' ? '+120% FYP' : this.platform === 'instagram' ? '+80% Explore' : '+90% Homepage'} reach dalam 30 hari`,
      });
    }

    return {
      term: 'Content Consistency Score (Frekuensi Upload)',
      score,
      category: 'Growth',
      definition: `**Content Consistency** adalah seberapa **teratur** Anda posting konten. ${this.platform.toUpperCase()} algorithm track ini dan boost creator yang konsisten ke lebih banyak audience. Konsistensi = Trust dari algoritma.`,
      diagnosis,
      benchmark: {
        yourScore: parseFloat(actualFrequency.toFixed(1)),
        nicheAverage: idealFrequency,
        topPerformer: idealFrequency * 1.5,
        explanation: `Ideal ${this.niche}: ${idealFrequency}x/minggu. Top performer: ${(idealFrequency * 1.5).toFixed(1)}x/minggu. Anda: ${actualFrequency.toFixed(1)}x/minggu.`,
      },
      recommendations,
    };
  }

  private analyzeGrowthPotential(): EducationalInsight {
    const followerLikeRatio = calculateFollowerLikeRatio(this.metrics.followers, this.metrics.totalLikes);
    const idealRatio = this.benchmark.avgFollowerLikeRatio;

    let score = 0;
    if (followerLikeRatio >= idealRatio * 1.5) score = 100;
    else if (followerLikeRatio >= idealRatio) score = 60 + ((followerLikeRatio - idealRatio) / (idealRatio * 0.5)) * 40;
    else score = (followerLikeRatio / idealRatio) * 60;
    score = Math.round(Math.max(0, Math.min(100, score)));

    let diagnosis = '';
    if (followerLikeRatio < idealRatio * 0.5) {
      diagnosis = `⚠️ **Viral Potential Rendah!** Ratio Follower:Like Anda **1:${followerLikeRatio.toFixed(1)}**, sangat rendah dibanding target minimal 1:${idealRatio.toFixed(1)}. Ini strong indicator bahwa konten Anda kurang viral atau targeting audience yang salah. Low ratio = konten hanya di-consume follower existing tanpa expand ke new audience via FYP/Explore. Need strategic pivot untuk create more shareable, viral-worthy content!`;
    } else if (followerLikeRatio < idealRatio) {
      diagnosis = `📈 **Close to Target!** Ratio Follower:Like Anda **1:${followerLikeRatio.toFixed(1)}**, mendekati target 1:${idealRatio.toFixed(1)}. Konten Anda already getting some viral traction! Dengan sedikit optimization di content quality dan hook strategy, Anda bisa push ratio ini ke ideal level. Almost there!`;
    } else {
      diagnosis = `🔥 **High Viral Content!** Ratio Follower:Like Anda **1:${followerLikeRatio.toFixed(1)}**, EXCELLENT! Anda punya konten yang strongly resonate dengan audience dan consistently viral beyond follower base. Ini menunjukkan content strategy Anda working - keep doing what you're doing!`;
    }

    const recommendations = [{
      priority: (followerLikeRatio < idealRatio * 0.5 ? 'urgent' : 'opportunity') as PriorityLevel,
      icon: 'Zap',
      title: 'Maximize Viral Potential',
      description: 'Likes yang tinggi = signal ke algoritma bahwa konten Anda berkualitas',
      steps: [
        'Hook 3 detik pertama HARUS bikin penasaran (pattern interrupt)',
        'Pakai formula proven viral: Problem → Agitate → Solution',
        'CTA di akhir: "Double tap kalau setuju!" (direct instruction)',
        `Test ${this.platform === 'tiktok' ? 'trending sounds' : this.platform === 'instagram' ? 'trending audio' : 'viral topics'} di niche Anda`,
        'Analisa top 10 viral video Anda - replikasi formula yang sama',
      ],
      impactEstimate: `Target ratio 1:${(idealRatio * 1.5).toFixed(1)} = ${Math.round(((idealRatio * 1.5 - followerLikeRatio) / followerLikeRatio) * 100)}% more viral content`,
    }];

    return {
      term: 'Viral Content Ratio (Follower:Like)',
      score,
      category: 'Content Quality',
      definition: `**Viral Content Ratio** adalah perbandingan total likes vs follower. Ratio tinggi = konten Anda sering viral ke non-follower via ${this.platform === 'tiktok' ? 'FYP' : this.platform === 'instagram' ? 'Explore' : 'Homepage'}. Ideal: 1 follower = minimal ${idealRatio.toFixed(1)} likes total.`,
      diagnosis,
      benchmark: {
        yourScore: parseFloat(followerLikeRatio.toFixed(2)),
        nicheAverage: idealRatio,
        topPerformer: idealRatio * 1.5,
        explanation: `Niche ${this.niche}: rata-rata 1:${idealRatio.toFixed(1)}, top 1:${(idealRatio * 1.5).toFixed(1)}. Anda: 1:${followerLikeRatio.toFixed(1)}.`,
      },
      recommendations,
    };
  }

  private analyzePostingFrequency(): EducationalInsight {
    const actualFreq = this.metrics.postingFrequency || 0;
    const idealFreq = this.benchmark.idealPostFrequency;

    let score = 0;
    if (actualFreq >= idealFreq) score = 100;
    else score = (actualFreq / idealFreq) * 100;
    score = Math.round(Math.max(0, Math.min(100, score)));

    const diagnosis = actualFreq >= idealFreq
      ? `✅ **Perfect Posting Cadence!** Posting frequency Anda **${actualFreq.toFixed(1)}x/minggu** sudah IDEAL untuk ${this.platform.toUpperCase()}! Ini menunjukkan Anda maintain healthy balance antara quantity dan quality. Algoritma recognize consistency ini dan reward dengan better reach distribution. Keep this sustainable pace!`
      : `⚠️ **Boost Your Activity!** Posting frequency Anda **${actualFreq.toFixed(1)}x/minggu** masih di bawah ideal ${idealFreq}x/minggu. ${this.platform.toUpperCase()} algorithm favor active creator karena they keep users engaged longer on platform. More consistent posting = more algorithm love = better organic reach!`;

    return {
      term: 'Posting Frequency Optimization',
      score,
      category: 'Growth',
      definition: `**Posting Frequency** adalah seberapa sering Anda upload konten baru. ${this.platform.toUpperCase()} algorithm prioritas creator yang aktif karena keep user engaged di platform lebih lama.`,
      diagnosis,
      benchmark: {
        yourScore: parseFloat(actualFreq.toFixed(1)),
        nicheAverage: idealFreq,
        topPerformer: idealFreq * 1.5,
        explanation: `Niche ${this.niche}: ideal ${idealFreq}x/minggu. Top creator: ${(idealFreq * 1.5).toFixed(1)}x/minggu.`,
      },
      recommendations: [{
        priority: actualFreq < idealFreq * 0.5 ? 'urgent' : 'opportunity' as PriorityLevel,
        icon: 'Clock',
        title: 'Optimize Posting Schedule',
        description: 'Algoritma track consistency dan aktifitas creator',
        steps: [
          `Post minimal ${idealFreq}x per minggu`,
          'Posting time: 7-9 PM weekdays (after work), 1-3 PM weekend (lunch break)',
          'Gunakan ${this.platform} Analytics untuk track jam audience Anda paling aktif',
          'Consistency > Quantity: lebih baik ${idealFreq}x/minggu konsisten dari pada 15x lalu hilang 2 minggu',
        ],
        impactEstimate: 'Posting teratur = +65% algorithm favorability',
      }],
    };
  }

  private calculateOverallScore(insights: EducationalInsight[]): number {
    const total = insights.reduce((sum, i) => sum + i.score, 0);
    return Math.round(total / insights.length);
  }

  private generateSummary(overallScore: number, urgentCount: number, importantCount: number): string {
    if (overallScore >= 80) {
      return `🎉 **Outstanding Performance!** Akun Anda dalam kondisi **EXCELLENT** dengan skor ${overallScore}/100 - ini menempatkan Anda di **top 10% creator/brand** di platform ini! Semua metric utama (engagement rate, follower quality, content consistency) sudah berada di level yang sangat baik. Yang perlu Anda lakukan sekarang adalah **maintain momentum** ini sambil strategically scaling up reach dan potentially monetizing influence Anda. Terus konsisten dengan proven formula sambil test new formats untuk avoid content fatigue. Remember: maintaining excellence adalah marathon, bukan sprint - stay humble, stay hungry! 🚀`;
    } else if (overallScore >= 60) {
      return `💪 **Solid Foundation dengan Room for Growth!** Skor akun Anda saat ini ${overallScore}/100 - ini menunjukkan **fondasi sudah kuat**, tapi ada ${urgentCount + importantCount} area spesifik yang bisa ditingkatkan untuk membawa akun Anda ke level berikutnya. Jangan lihat ini sebagai failure - setiap successful creator pernah di tahap ini! Yang penting sekarang adalah **fokus ke prioritas** (yang sudah kami tandai merah/kuning di bawah) dan implement improvement secara sistematis. Dengan konsistensi dan smart strategy, dalam 1-2 bulan Anda bisa jump ke tier berikutnya. Let's level up! 📈`;
    } else if (overallScore >= 40) {
      return `⚠️ **Wake Up Call - Action Required!** Skor ${overallScore}/100 menunjukkan akun Anda **perlu serious work**, dengan ${urgentCount} critical issue yang **harus segera diperbaiki** untuk avoid shadow-ban atau algorithm penalty. Jangan panic - ini adalah checkpoint penting yang menandakan Anda perlu pivot strategy. Many successful creator pernah di position ini dan berhasil bangkit. Kami sudah buatkan detailed action plan yang akan guide Anda step-by-step untuk fix fundamental issues dan rebuild strong foundation. Focus ke urgent priorities dulu (marked merah), baru important ones. **Progress over perfection** - better improve 15-20% per minggu dibanding stuck di analysis paralysis!`;
    } else {
      return `🚨 **Complete Transformation Needed!** Dengan skor ${overallScore}/100 dan ${urgentCount} masalah kritis, akun Anda butuh **complete strategic overhaul**. TAPI JANGAN GIVE UP! Ini adalah starting point baru untuk rebuild dengan foundation yang benar. Kami sudah identifikasi exact problems dan prepare comprehensive step-by-step recovery plan. Treat this sebagai **reset opportunity** - clear semua bad practices, implement proven strategies dari nol, dan dalam 2-3 bulan Anda akan punya akun yang completely transformed. Many viral creator started from worse position. What matters now adalah **commitment to execute** action plan ini dengan konsisten. You got this! 💪`;
    }
  }

  private generateNextSteps(
    urgent: EducationalInsight[],
    important: EducationalInsight[],
    opportunities: EducationalInsight[]
  ): string[] {
    const steps: string[] = [];

    if (urgent.length > 0) {
      steps.push('🚨 PRIORITAS 1 (URGENT): ' + urgent[0].recommendations[0]?.title);
      if (urgent[0].recommendations[0]?.steps[0]) {
        steps.push('   → ' + urgent[0].recommendations[0].steps[0]);
      }
    }

    if (important.length > 0) {
      steps.push('⚠️ PRIORITAS 2 (IMPORTANT): ' + important[0].recommendations[0]?.title);
      if (important[0].recommendations[0]?.steps[0]) {
        steps.push('   → ' + important[0].recommendations[0].steps[0]);
      }
    }

    if (opportunities.length > 0 && urgent.length === 0 && important.length === 0) {
      steps.push('💡 OPPORTUNITY: ' + opportunities[0].recommendations[0]?.title);
    }

    return steps;
  }
}
