// Integration layer - converts new educational analyzers to existing schema format

import { AccountAnalyzer } from './account-analyzer';
import { VideoAnalyzer } from './video-analyzer';
import { TextAnalyzer } from './text-analyzer';
import { deepAnalyzeWithAI } from './deep-video-analyzer';
import { ultraConciseFeedback, simplifyDiagnosis } from './text-formatter';
import OpenAI from 'openai';
import type { 
  BiasAnalysisResult, 
  TikTokAccountAnalysisResult, 
  TikTokVideoAnalysisResult,
  BiasLayerResult 
} from '@shared/schema';
import type { AnalysisResult, EducationalInsight } from './types';

// Convert educational insights to BiasLayerResult format
function convertToLegacyFormat(insights: EducationalInsight[]): BiasLayerResult[] {
  return insights.map(insight => {
    const score = Math.round(insight.score / 10); // Convert 0-100 to 1-10
    // Preserve full narrative diagnosis (no truncation)
    const fullDiagnosis = insight.diagnosis;
    
    return {
      layer: insight.term,
      score,
      feedback: fullDiagnosis,
      feedbackId: fullDiagnosis,
    };
  });
}

async function enhanceAccountWithAI(input: {
  username: string;
  bio?: string;
  platform: string;
  followers: number;
  following: number;
  totalLikes: number;
  videoCount: number;
  engagementRate?: number;
}, ruleBasedResult: AnalysisResult): Promise<{
  summary: string;
  layerNarratives: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  personalizedTips: string[];
} | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const scoresSummary = ruleBasedResult.insights.map(i => 
      `${i.term}: ${i.score}/100 (${i.category})`
    ).join('\n');
    
    const prompt = `Kamu adalah BIAS Pro Behavioral Intelligence Analyst. Buat analisis UNIK dan PERSONAL untuk akun TikTok ini.

DATA AKUN:
- Username: @${input.username}
- Bio: "${input.bio || 'tidak ada bio'}"
- Followers: ${input.followers.toLocaleString()}
- Following: ${input.following.toLocaleString()}
- Total Likes: ${input.totalLikes.toLocaleString()}
- Total Videos: ${input.videoCount}
- Engagement Rate: ${(input.engagementRate || 0).toFixed(2)}%
- Follower:Like Ratio: 1:${input.totalLikes > 0 && input.followers > 0 ? (input.totalLikes / input.followers).toFixed(1) : '0'}
- Following:Follower Ratio: ${input.followers > 0 ? (input.following / input.followers).toFixed(2) : 'N/A'}

SKOR ANALISIS:
${scoresSummary}

Overall Score: ${ruleBasedResult.overallScore}/100

INSTRUKSI:
Berikan analisis yang SPESIFIK untuk @${input.username}. JANGAN generik. Sebutkan username, angka real, dan observasi berdasarkan bio/niche mereka.

Format JSON (WAJIB valid JSON):
{
  "summary": "2-3 paragraf narrative diagnosis UNIK untuk @${input.username}. Sebutkan data spesifik mereka. Bahas strength & weakness. Kasih motivasi personal.",
  "layerNarratives": {
    "Engagement Rate (ER)": "1 paragraf analisis ER spesifik untuk akun ini",
    "Follower Quality Score": "1 paragraf tentang kualitas follower akun ini",
    "Content Consistency Score (Frekuensi Upload)": "1 paragraf tentang konsistensi posting",
    "Viral Content Ratio (Follower:Like)": "1 paragraf tentang viral potential",
    "Posting Frequency Optimization": "1 paragraf tentang frekuensi posting"
  },
  "strengths": ["3 kekuatan SPESIFIK akun ini (sebut angka)"],
  "weaknesses": ["2-3 area improvement SPESIFIK (sebut angka)"],
  "personalizedTips": ["3-4 tips ACTIONABLE yang relevan dengan niche/bio @${input.username}"]
}

PENTING: Gunakan bahasa Indonesia casual tapi profesional. Sebut @${input.username} langsung. Response HARUS valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    
    const validated = {
      summary: typeof parsed.summary === 'string' ? parsed.summary : null,
      layerNarratives: typeof parsed.layerNarratives === 'object' && parsed.layerNarratives ? parsed.layerNarratives : {},
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter((s: any) => typeof s === 'string') : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.filter((s: any) => typeof s === 'string') : [],
      personalizedTips: Array.isArray(parsed.personalizedTips) ? parsed.personalizedTips.filter((s: any) => typeof s === 'string') : [],
    };
    
    if (!validated.summary) return null;
    
    console.log(`🤖 AI enhanced account analysis for @${input.username} (${completion.usage?.total_tokens || 0} tokens)`);
    return validated;
  } catch (error: any) {
    console.error(`⚠️ AI account enhancement failed: ${error.message}`);
    return null;
  }
}

// Analyze account (TikTok, Instagram, YouTube)
export async function analyzeAccount(input: {
  platform: 'tiktok' | 'instagram' | 'youtube';
  username: string;
  bio?: string;
  followers: number;
  following: number;
  totalLikes: number;
  videoCount: number;
  avgViews?: number;
  engagementRate?: number;
  growthRate?: number;
  postingFrequency?: number;
  hashtags?: string[];
}): Promise<TikTokAccountAnalysisResult> {
  
  const analyzer = new AccountAnalyzer({
    platform: input.platform,
    username: input.username,
    bio: input.bio,
    metrics: {
      followers: input.followers,
      following: input.following,
      totalLikes: input.totalLikes,
      videoCount: input.videoCount,
      avgViews: input.avgViews || 0,
      engagementRate: input.engagementRate || 0,
      growthRate: input.growthRate,
      postingFrequency: input.postingFrequency,
    },
    hashtags: input.hashtags,
  });

  const result = analyzer.analyze();

  // Try AI enhancement for personalized insights (non-blocking)
  const aiEnhancement = await enhanceAccountWithAI({
    username: input.username,
    bio: input.bio,
    platform: input.platform,
    followers: input.followers,
    following: input.following,
    totalLikes: input.totalLikes,
    videoCount: input.videoCount,
    engagementRate: input.engagementRate,
  }, result);

  // Convert to legacy format - enhance layer feedback with AI narratives
  const layers = result.insights.map(insight => {
    const score = Math.round(insight.score / 10);
    const aiNarrative = aiEnhancement?.layerNarratives?.[insight.term];
    const diagnosis = aiNarrative || insight.diagnosis;
    
    return {
      layer: insight.term,
      score,
      feedback: diagnosis,
      feedbackId: diagnosis,
    };
  });

  // Extract recommendations by priority
  const urgentRecs = result.priorities.urgent.flatMap(i => 
    i.recommendations.map(r => r.title)
  );
  const importantRecs = result.priorities.important.flatMap(i => 
    i.recommendations.map(r => r.title)
  );
  const opportunityRecs = result.priorities.opportunities.flatMap(i => 
    i.recommendations.map(r => r.title)
  );

  // Use AI-enhanced strengths/weaknesses if available, fallback to rule-based
  const strengths = aiEnhancement?.strengths || result.insights
    .filter(i => i.score >= 70)
    .map(i => simplifyDiagnosis(`${i.term}: ${i.benchmark.explanation}`));
  
  const weaknesses = aiEnhancement?.weaknesses || result.insights
    .filter(i => i.score < 60)
    .map(i => simplifyDiagnosis(`${i.term}: ${i.diagnosis}`));

  // Use AI summary if available
  const summary = aiEnhancement?.summary || result.summary;

  // Merge personalized tips into recommendations
  const personalizedTips = aiEnhancement?.personalizedTips || [];

  return {
    overallScore: result.overallScore,
    layers,
    summary,
    summaryId: summary,
    strengths,
    strengthsId: strengths,
    weaknesses,
    weaknessesId: weaknesses,
    recommendations: {
      fyp: urgentRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      fypId: urgentRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      followerGrowth: importantRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      followerGrowthId: importantRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      engagement: personalizedTips.length > 0 ? personalizedTips : opportunityRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      engagementId: personalizedTips.length > 0 ? personalizedTips : opportunityRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      contentStrategy: result.nextSteps.map(s => simplifyDiagnosis(s)),
      contentStrategyId: result.nextSteps.map(s => simplifyDiagnosis(s)),
    },
    metrics: {
      engagementRate: input.engagementRate || 0,
      avgViewsPerVideo: input.avgViews || 0,
      postingConsistency: (input.postingFrequency || 0) * 10,
      viralPotential: result.insights.find(i => i.category === 'Content Quality')?.score || 50,
    },
  };
}

// Analyze video
export async function analyzeVideo(input: {
  platform: 'tiktok' | 'instagram' | 'youtube';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  completionRate?: number;
  hookRetention?: number;
  description?: string;
  hashtags?: string[];
}): Promise<TikTokVideoAnalysisResult> {
  
  const analyzer = new VideoAnalyzer({
    platform: input.platform,
    metrics: {
      views: input.views,
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      duration: input.duration,
      completionRate: input.completionRate,
      hookRetention: input.hookRetention,
    },
    description: input.description,
    hashtags: input.hashtags,
  });

  const result = analyzer.analyze();
  const layers = convertToLegacyFormat(result.insights);

  const strengths = result.insights
    .filter(i => i.score >= 70)
    .map(i => simplifyDiagnosis(`${i.term}: ${i.diagnosis}`));
  
  const improvements = result.insights
    .filter(i => i.score < 70)
    .map(i => simplifyDiagnosis(i.recommendations[0]?.title || `Improve ${i.term}`))
    .filter(Boolean);

  const urgentRecs = result.priorities.urgent.flatMap(i => 
    i.recommendations[0]?.steps.slice(0, 2) || []
  );
  const importantRecs = result.priorities.important.flatMap(i => 
    i.recommendations[0]?.steps.slice(0, 2) || []
  );

  return {
    overallScore: result.overallScore,
    layers,
    summary: result.summary,
    summaryId: result.summary,
    strengths,
    strengthsId: strengths,
    improvements,
    improvementsId: improvements,
    recommendations: {
      hook: urgentRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      hookId: urgentRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      pacing: importantRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      pacingId: importantRecs.slice(0, 3).map(r => simplifyDiagnosis(r)),
      engagement: result.nextSteps.slice(0, 3).map(s => simplifyDiagnosis(s)),
      engagementId: result.nextSteps.slice(0, 3).map(s => simplifyDiagnosis(s)),
      hashtags: ['#fyp', `#${input.platform}`, '#viral'],
      hashtagsId: ['#fyp', `#${input.platform}`, '#viral'],
    },
    metrics: {
      hookQuality: result.insights.find(i => i.term.includes('Hook'))?.score || 50,
      retentionScore: input.completionRate || 50,
      viralPotential: result.insights.find(i => i.term.includes('Viral'))?.score || 50,
      engagementPrediction: ((input.likes + input.comments * 2) / (input.views || 1)) * 100,
    },
  };
}

// Analyze text/speech/script with Ai Deep Analysis
export async function analyzeText(input: {
  content: string;
  mode: 'creator' | 'academic' | 'hybrid';
  inputType: 'text' | 'video' | 'photo' | 'audio';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'non-social';
}): Promise<BiasAnalysisResult> {
  
  // 🚀 Use Ai Deep Analysis for ALL content types (video, audio, AND text)
  // This provides SPECIFIC, ACTIONABLE feedback with concrete examples
  // Only skip Ai if content is too short (less than 20 chars)
  const shouldUseAI = input.content && input.content.length >= 20;
  
  if (shouldUseAI) {
    try {
      console.log('🤖 Initiating Ai Deep Analysis for', input.inputType, 'content...');
      
      const deepResult = await deepAnalyzeWithAI({
        content: input.content,
        mode: input.mode,
        inputType: input.inputType,
        platform: input.platform,
      });

      // FIX: deepAnalyzeWithAI returns { layers: [], rateLimitInfo?, tokensUsed? }
      const deepLayers = deepResult.layers;
      
      // Check if we got valid Ai analysis (not rate limited fallback)
      if (deepLayers && deepLayers.length > 0) {
        // Convert deep analysis to BiasLayerResult format - PRESERVE strengths/weaknesses for batch comparison
        const layers: BiasLayerResult[] = deepLayers.map(dl => ({
          layer: dl.layer,
          score: Math.round(dl.score / 10), // Convert 0-100 to 1-10
          feedback: dl.feedback,
          feedbackId: dl.feedbackId,
          strengths: dl.strengths || [],
          weaknesses: dl.weaknesses || [],
          actionableRecommendations: dl.actionableRecommendations || [],
          specificObservations: dl.specificObservations || [],
        }));

        const overallScore = Math.round(
          deepLayers.reduce((sum, l) => sum + l.score, 0) / deepLayers.length
        );

        // Extract all actionable recommendations
        const allRecommendations = deepLayers.flatMap(dl => 
          dl.actionableRecommendations || []
        ).filter(Boolean);

        // Generate comprehensive summary
        const summary = generateDeepSummary(deepLayers, overallScore, input.mode);

        console.log('✅ Ai Deep Analysis completed successfully');
        
        return {
          mode: input.mode,
          overallScore,
          layers,
          summary,
          summaryId: summary,
          recommendations: allRecommendations.slice(0, 10),
          recommendationsId: allRecommendations.slice(0, 10),
        };
      }
    } catch (error) {
      console.error('⚠️ Ai Deep Analysis failed, falling back to standard analysis:', error);
    }
  }
  
  // Fallback: Standard template-based analysis (only when Ai fails or content too short)
  console.log('📝 Using standard template-based analysis (Ai unavailable or content too short)');
  
  const analyzer = new TextAnalyzer({
    content: input.content,
    mode: input.mode,
    inputType: input.inputType,
  });

  const result = analyzer.analyze();
  const layers = convertToLegacyFormat(result.insights);

  const recommendations = result.nextSteps.map(s => simplifyDiagnosis(s));
  
  return {
    mode: input.mode,
    overallScore: result.overallScore,
    layers,
    summary: result.summary,
    summaryId: result.summary,
    recommendations,
    recommendationsId: recommendations,
  };
}

function generateDeepSummary(layers: any[], overallScore: number, mode: string): string {
  const topStrengths = layers
    .filter(l => l.score >= 75)
    .map(l => l.layer.split('(')[0].trim())
    .slice(0, 3);
  
  const weaknesses = layers
    .filter(l => l.score < 60)
    .map(l => l.layer.split('(')[0].trim())
    .slice(0, 3);

  if (overallScore >= 75) {
    return `🔥 **Excellent Performance (${overallScore}/100)!** Analisis mendalam menunjukkan komunikasi Anda sangat kuat${topStrengths.length > 0 ? ` terutama di ${topStrengths.join(', ')}` : ''}. Feedback spesifik di setiap layer memberikan roadmap clear untuk maintain excellence dan explore advanced techniques. Dengan consistency di level ini, Anda sudah di top 10% ${mode === 'creator' ? 'creators' : 'communicators'} di niche Anda. Keep the momentum!`;
  } else if (overallScore >= 60) {
    return `💡 **Solid Foundation (${overallScore}/100) dengan Room for Growth!** Analisis mendetail mengidentifikasi area-area improvement yang spesifik dan actionable${weaknesses.length > 0 ? `, terutama di ${weaknesses.join(', ')}` : ''}. Setiap layer menyediakan concrete steps dengan timeline yang realistic - implement recommendations secara bertahap dan dalam 2-4 minggu Anda akan see significant improvement. Potensinya besar, tinggal execution!`;
  } else {
    return `⚠️ **Development Stage (${overallScore}/100) - Lots of Potential!** Analisis comprehensive ini mengidentifikasi specific areas yang perlu attention${weaknesses.length > 0 ? `, khususnya ${weaknesses.join(', ')}` : ''}. Good news: semua feedback dilengkapi dengan actionable steps dan timeline realistic. Fokus ke high-impact recommendations first (marked as "urgent" atau "important"), implement step-by-step, dan track progress weekly. Dengan dedicated practice 30-60 menit per day, expect dramatic improvement dalam 1-2 bulan. Everyone starts somewhere - yang penting consistent action!`;
  }
}

// Export full educational results for new UI components
export { AccountAnalyzer, VideoAnalyzer, TextAnalyzer };
export type { AnalysisResult, EducationalInsight };
