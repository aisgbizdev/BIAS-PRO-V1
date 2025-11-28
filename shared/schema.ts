import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User sessions and token tracking
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  tokensRemaining: integer("tokens_remaining").notNull().default(100),
  freeRequestsUsed: integer("free_requests_used").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at").notNull().defaultNow(),
});

// Analysis history
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  mode: text("mode").notNull(), // 'creator', 'academic', 'hybrid'
  inputType: text("input_type").notNull(), // 'video', 'text', 'script'
  inputContent: text("input_content").notNull(),
  analysisResult: text("analysis_result").notNull(), // JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat history
export const chats = pgTable("chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TikTok account data
export const tiktokAccounts = pgTable("tiktok_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  followers: integer("followers").notNull().default(0),
  following: integer("following").notNull().default(0),
  totalLikes: integer("total_likes").notNull().default(0),
  totalVideos: integer("total_videos").notNull().default(0),
  bio: text("bio"),
  verified: boolean("verified").notNull().default(false),
  avatarUrl: text("avatar_url"),
  engagementRate: real("engagement_rate"), // percentage
  avgViews: integer("avg_views"),
  postingFrequency: real("posting_frequency"), // videos per week
  analysisResult: text("analysis_result"), // JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// TikTok video data
export const tiktokVideos = pgTable("tiktok_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  videoId: text("video_id").notNull(),
  videoUrl: text("video_url"),
  accountUsername: text("account_username").notNull(),
  description: text("description"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  favorites: integer("favorites").notNull().default(0),
  duration: integer("duration"), // seconds
  soundName: text("sound_name"),
  hashtags: text("hashtags").array(),
  completionRate: real("completion_rate"), // percentage
  analysisResult: text("analysis_result"), // JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
  postedAt: timestamp("posted_at"),
});

// TikTok comparisons
export const tiktokComparisons = pgTable("tiktok_comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  comparisonType: text("comparison_type").notNull(), // 'accounts' or 'videos'
  primaryId: text("primary_id").notNull(), // main account/video ID
  comparedIds: text("compared_ids").array().notNull(), // IDs being compared
  analysisResult: text("analysis_result").notNull(), // JSON comparative insights
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Library contributions
export const libraryContributions = pgTable("library_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: text("term").notNull(),
  termId: text("term_id"),
  definition: text("definition").notNull(),
  definitionId: text("definition_id"),
  platform: text("platform").notNull(), // 'tiktok', 'instagram', 'youtube'
  username: text("username").notNull(), // contributor's social media username
  example: text("example"),
  exampleId: text("example_id"),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
});

// Analytics: Page views tracking
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  page: text("page").notNull(), // 'dashboard', 'social-pro', 'creator', 'library'
  language: text("language"), // 'en' or 'id'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Analytics: Feature usage tracking
export const featureUsage = pgTable("feature_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  featureType: text("feature_type").notNull(), // 'analysis', 'chat', 'comparison', 'video_upload', 'account_analysis'
  featureDetails: text("feature_details"), // JSON string with additional context
  platform: text("platform"), // 'tiktok', 'instagram', 'youtube', 'professional'
  mode: text("mode"), // 'social-pro', 'creator' for analysis context
  language: text("language"), // 'en' or 'id'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin sessions for authentication
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// White-label brands for partners/resellers
export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // URL path: bias23.com/newsmaker
  name: text("name").notNull(), // "Newsmaker"
  shortName: text("short_name").notNull(), // "NM"
  
  // Bilingual taglines
  taglineEn: text("tagline_en").notNull().default("Powered by BiAS²³"),
  taglineId: text("tagline_id").notNull().default("Didukung BiAS²³"),
  subtitleEn: text("subtitle_en").notNull().default("Build Your Influence"),
  subtitleId: text("subtitle_id").notNull().default("Bangun Pengaruhmu"),
  descriptionEn: text("description_en"),
  descriptionId: text("description_id"),
  
  // Colors (Tailwind gradient classes)
  colorPrimary: text("color_primary").notNull().default("from-pink-500 via-purple-500 to-cyan-500"),
  colorSecondary: text("color_secondary").notNull().default("from-purple-500 via-pink-400 to-cyan-400"),
  
  // Logo (base64 or URL)
  logoUrl: text("logo_url"),
  
  // Social media - Partner's accounts
  tiktokHandle: text("tiktok_handle"),
  tiktokUrl: text("tiktok_url"),
  instagramHandle: text("instagram_handle"),
  instagramUrl: text("instagram_url"),
  
  // Meta/SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true, lastActiveAt: true });
export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });
export const insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true });
export const insertTiktokAccountSchema = createInsertSchema(tiktokAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTiktokVideoSchema = createInsertSchema(tiktokVideos).omit({ id: true, createdAt: true });
export const insertTiktokComparisonSchema = createInsertSchema(tiktokComparisons).omit({ id: true, createdAt: true });
export const insertLibraryContributionSchema = createInsertSchema(libraryContributions).omit({ id: true, createdAt: true, approvedAt: true });
export const insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true, createdAt: true });
export const insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({ id: true, createdAt: true });
export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({ id: true, createdAt: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;
export type InsertTiktokAccount = z.infer<typeof insertTiktokAccountSchema>;
export type TiktokAccount = typeof tiktokAccounts.$inferSelect;
export type InsertTiktokVideo = z.infer<typeof insertTiktokVideoSchema>;
export type TiktokVideo = typeof tiktokVideos.$inferSelect;
export type InsertTiktokComparison = z.infer<typeof insertTiktokComparisonSchema>;
export type TiktokComparison = typeof tiktokComparisons.$inferSelect;
export type InsertLibraryContribution = z.infer<typeof insertLibraryContributionSchema>;
export type LibraryContribution = typeof libraryContributions.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertFeatureUsage = z.infer<typeof insertFeatureUsageSchema>;
export type FeatureUsage = typeof featureUsage.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// BIAS Analysis Result Types
export interface BiasLayerResult {
  layer: string;
  score: number; // 1-10
  feedback: string;
  feedbackId?: string; // Indonesian version
}

export interface BiasAnalysisResult {
  mode: 'creator' | 'academic' | 'hybrid';
  overallScore: number;
  layers: BiasLayerResult[];
  summary: string;
  summaryId: string;
  recommendations: string[];
  recommendationsId: string[];
}

// TikTok-specific Analysis Result Types
export interface TikTokAccountAnalysisResult {
  overallScore: number;
  layers: BiasLayerResult[];
  summary: string;
  summaryId: string;
  strengths: string[];
  strengthsId: string[];
  weaknesses: string[];
  weaknessesId: string[];
  recommendations: {
    fyp: string[];
    fypId: string[];
    followerGrowth: string[];
    followerGrowthId: string[];
    engagement: string[];
    engagementId: string[];
    contentStrategy: string[];
    contentStrategyId: string[];
  };
  metrics: {
    engagementRate: number;
    avgViewsPerVideo: number;
    postingConsistency: number;
    viralPotential: number;
  };
}

export interface TikTokVideoAnalysisResult {
  overallScore: number;
  layers: BiasLayerResult[];
  summary: string;
  summaryId: string;
  strengths: string[];
  strengthsId: string[];
  improvements: string[];
  improvementsId: string[];
  recommendations: {
    hook: string[];
    hookId: string[];
    pacing: string[];
    pacingId: string[];
    engagement: string[];
    engagementId: string[];
    hashtags: string[];
    hashtagsId: string[];
  };
  metrics: {
    hookQuality: number;
    retentionScore: number;
    viralPotential: number;
    engagementPrediction: number;
  };
}

export interface TikTokComparisonResult {
  comparisonType: 'accounts' | 'videos';
  primaryId: string;
  competitors: {
    id: string;
    username?: string; // for accounts
    videoId?: string; // for videos
    overallScore: number;
    relativePerformance: 'better' | 'similar' | 'worse';
    keyDifferences: string[];
    keyDifferencesId: string[];
  }[];
  insights: string[];
  insightsId: string[];
  recommendations: string[];
  recommendationsId: string[];
  benchmarkMetrics: {
    [key: string]: {
      primary: number;
      average: number;
      best: number;
    };
  };
}

// TikTok Analysis Types (matching bias-engine.ts output)
export interface TikTokAccountAnalysis {
  username: string;
  overallScore: number;
  biasLayers: {
    VBM: { score: number; insight: string };
    EPM: { score: number; insight: string };
    NLP: { score: number; insight: string };
    ETH: { score: number; insight: string };
    ECO: { score: number; insight: string };
    SOC: { score: number; insight: string };
    COG: { score: number; insight: string };
    BMIL: { score: number; insight: string };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  audienceInsights: {
    engagement: 'low' | 'medium' | 'high';
    growth: 'declining' | 'stable' | 'growing';
    contentStrategy: string;
  };
}

export interface TikTokVideoAnalysis {
  videoId: string;
  overallScore: number;
  biasLayers: {
    VBM: { score: number; insight: string };
    EPM: { score: number; insight: string };
    NLP: { score: number; insight: string };
    ETH: { score: number; insight: string };
    ECO: { score: number; insight: string };
    SOC: { score: number; insight: string };
    COG: { score: number; insight: string };
    BMIL: { score: number; insight: string };
  };
  viralPotential: number;
  recommendations: string[];
  hooks: {
    opening: { score: number; feedback: string };
    retention: { score: number; feedback: string };
    cta: { score: number; feedback: string };
  };
}
