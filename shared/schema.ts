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

// Learned responses - AI answers that become local knowledge
export const learnedResponses = pgTable("learned_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(), // Original question
  keywords: text("keywords").array().notNull(), // Extracted keywords for matching
  response: text("response").notNull(), // AI response
  useCount: integer("use_count").notNull().default(1), // How many times this was used
  quality: integer("quality").default(0), // User feedback (-1, 0, 1)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at").notNull().defaultNow(),
});

export const insertLearnedResponseSchema = createInsertSchema(learnedResponses).omit({
  id: true,
  useCount: true,
  quality: true,
  createdAt: true,
  lastUsedAt: true,
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

// Success Stories - User testimonials with admin approval
export const successStories = pgTable("success_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: text("username").notNull(),
  platform: text("platform").notNull(), // 'tiktok' or 'marketing'
  role: text("role").notNull(), // 'Creator', 'Influencer', 'Sales Manager', etc.
  story: text("story").notNull(),
  storyId: text("story_id"), // Indonesian version
  achievement: text("achievement").notNull(), // e.g., "Followers naik 50%"
  achievementId: text("achievement_id"), // Indonesian version  
  profileUrl: text("profile_url"), // Link to their TikTok/LinkedIn
  avatarUrl: text("avatar_url"), // Optional profile picture
  rating: integer("rating").notNull().default(5), // 1-5 stars
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  featured: boolean("featured").notNull().default(false), // Show on homepage
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

// Platform settings for admin control
export const appSettings = pgTable("app_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // 'daily_video_limit', 'feature_batch_analysis', etc.
  value: text("value").notNull(), // JSON or string value
  valueType: text("value_type").notNull().default("string"), // 'string', 'number', 'boolean', 'json'
  category: text("category").notNull().default("general"), // 'limits', 'features', 'pricing', 'general'
  labelEn: text("label_en").notNull(), // Human-readable label
  labelId: text("label_id").notNull(),
  descriptionEn: text("description_en"),
  descriptionId: text("description_id"),
  isEditable: boolean("is_editable").notNull().default(true),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Pricing tiers for subscription plans
export const pricingTiers = pgTable("pricing_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 'Gratis', 'Basic', 'Pro', 'Unlimited'
  slug: text("slug").notNull().unique(), // 'gratis', 'basic', 'pro', 'unlimited'
  priceIdr: integer("price_idr").notNull().default(0), // Price in IDR
  priceUsd: real("price_usd").default(0), // Price in USD (optional)
  period: text("period").notNull().default("month"), // 'month', 'year', 'lifetime'
  descriptionEn: text("description_en"),
  descriptionId: text("description_id"),
  featuresEn: text("features_en").array(), // Array of feature strings
  featuresId: text("features_id").array(),
  chatLimit: integer("chat_limit"), // -1 for unlimited
  videoLimit: integer("video_limit"), // -1 for unlimited
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin audit log for tracking admin actions
export const adminAuditLog = pgTable("admin_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminUsername: text("admin_username").notNull(),
  action: text("action").notNull(), // 'approve', 'reject', 'delete', 'edit', 'create', 'login', 'logout', 'settings_update'
  targetType: text("target_type").notNull(), // 'contribution', 'brand', 'library_item', 'ai_settings', 'session'
  targetId: text("target_id"), // ID of affected item
  details: text("details"), // JSON string with additional context
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true, lastActiveAt: true });
export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });
export const insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true });
export const insertTiktokAccountSchema = createInsertSchema(tiktokAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTiktokVideoSchema = createInsertSchema(tiktokVideos).omit({ id: true, createdAt: true });
export const insertTiktokComparisonSchema = createInsertSchema(tiktokComparisons).omit({ id: true, createdAt: true });
export const insertLibraryContributionSchema = createInsertSchema(libraryContributions).omit({ id: true, createdAt: true, approvedAt: true });
export const insertSuccessStorySchema = createInsertSchema(successStories).omit({ id: true, createdAt: true, approvedAt: true, featured: true, status: true });
export const insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true, createdAt: true });
export const insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({ id: true, createdAt: true });
export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({ id: true, createdAt: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(adminAuditLog).omit({ id: true, createdAt: true });

// ==========================================
// EXPERT KNOWLEDGE BASE - Social Pro TikTok
// ==========================================

// Expert Knowledge: Scientific research, myths, guidelines, best practices
export const expertKnowledge = pgTable("expert_knowledge", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // 'algorithm', 'psychology', 'cinematography', 'audio', 'public_speaking', 'growth', 'monetization', 'regulation'
  subcategory: text("subcategory"), // e.g., 'hook_psychology', 'retention_science'
  
  // Main content
  titleEn: text("title_en").notNull(),
  titleId: text("title_id").notNull(),
  contentEn: text("content_en").notNull(), // Main explanation
  contentId: text("content_id").notNull(),
  
  // Myth-busting (optional)
  mythEn: text("myth_en"), // "Common myth: ..."
  mythId: text("myth_id"),
  truthEn: text("truth_en"), // "Scientific truth: ..."
  truthId: text("truth_id"),
  
  // Scientific backing
  researchSummaryEn: text("research_summary_en"),
  researchSummaryId: text("research_summary_id"),
  researchSource: text("research_source"), // Citation or link
  
  // TikTok regulation reference
  regulationReference: text("regulation_reference"), // "Community Guidelines Section 3.2"
  regulationLinkUrl: text("regulation_link_url"),
  
  // Tags for search
  tags: text("tags").array(),
  
  // Level
  level: text("level").notNull().default("beginner"), // 'beginner', 'intermediate', 'expert'
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Script Templates for content creation
export const scriptTemplates = pgTable("script_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Classification
  category: text("category").notNull(), // 'gaming', 'comedy', 'education', 'lifestyle', 'dance', 'review', 'storytelling', 'tutorial'
  duration: text("duration").notNull(), // '15s', '30s', '60s', '3min'
  goal: text("goal").notNull(), // 'entertainment', 'education', 'sales', 'community', 'viral'
  
  // Template content
  nameEn: text("name_en").notNull(),
  nameId: text("name_id").notNull(),
  descriptionEn: text("description_en"),
  descriptionId: text("description_id"),
  
  // Structure
  hookTemplateEn: text("hook_template_en").notNull(),
  hookTemplateId: text("hook_template_id").notNull(),
  mainContentTemplateEn: text("main_content_template_en").notNull(),
  mainContentTemplateId: text("main_content_template_id").notNull(),
  ctaTemplateEn: text("cta_template_en").notNull(),
  ctaTemplateId: text("cta_template_id").notNull(),
  
  // Why it works
  psychologyExplanationEn: text("psychology_explanation_en"),
  psychologyExplanationId: text("psychology_explanation_id"),
  
  // Examples
  examplesEn: text("examples_en").array(),
  examplesId: text("examples_id").array(),
  
  // Sound recommendations
  soundRecommendations: text("sound_recommendations").array(),
  
  level: text("level").notNull().default("beginner"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Hook examples with psychology breakdown
export const hooks = pgTable("hooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Hook type
  hookType: text("hook_type").notNull(), // 'question', 'controversial', 'shock', 'curiosity', 'benefit', 'pattern_interrupt', 'story', 'challenge'
  category: text("category").notNull(), // 'gaming', 'comedy', 'education', etc.
  
  // Content
  hookTextEn: text("hook_text_en").notNull(),
  hookTextId: text("hook_text_id").notNull(),
  
  // Psychology breakdown
  psychologyPrincipleEn: text("psychology_principle_en").notNull(),
  psychologyPrincipleId: text("psychology_principle_id").notNull(),
  whyItWorksEn: text("why_it_works_en").notNull(),
  whyItWorksId: text("why_it_works_id").notNull(),
  
  // Visual & verbal breakdown
  visualHookSuggestionEn: text("visual_hook_suggestion_en"),
  visualHookSuggestionId: text("visual_hook_suggestion_id"),
  
  // When to use
  bestForEn: text("best_for_en"),
  bestForId: text("best_for_id"),
  
  // Effectiveness score (1-10)
  effectivenessScore: integer("effectiveness_score").notNull().default(7),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Storytelling frameworks
export const storytellingFrameworks = pgTable("storytelling_frameworks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Framework info
  nameEn: text("name_en").notNull(),
  nameId: text("name_id").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionId: text("description_id").notNull(),
  
  // Structure breakdown
  structureStepsEn: text("structure_steps_en").array().notNull(), // ["Setup", "Conflict", "Resolution"]
  structureStepsId: text("structure_steps_id").array().notNull(),
  structureExplanationsEn: text("structure_explanations_en").array(),
  structureExplanationsId: text("structure_explanations_id").array(),
  
  // When to use
  whenToUseEn: text("when_to_use_en").notNull(),
  whenToUseId: text("when_to_use_id").notNull(),
  
  // Examples
  examplesEn: text("examples_en").array(),
  examplesId: text("examples_id").array(),
  
  // Best for content types
  bestForContentTypes: text("best_for_content_types").array(),
  
  // Psychology behind it
  psychologyEn: text("psychology_en"),
  psychologyId: text("psychology_id"),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Live streaming templates & strategies
export const liveStreamingTemplates = pgTable("live_streaming_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Format type
  format: text("format").notNull(), // 'solo', 'pk', 'multi_guest', 'collab', 'qa', 'tutorial'
  duration: text("duration").notNull(), // '5min', '15min', '30min', '60min'
  
  // Template info
  nameEn: text("name_en").notNull(),
  nameId: text("name_id").notNull(),
  descriptionEn: text("description_en"),
  descriptionId: text("description_id"),
  
  // Timeline breakdown (JSON array of timeline segments)
  timelineEn: text("timeline_en").notNull(), // JSON: [{minute: "0-2", action: "Hook", tips: "..."}, ...]
  timelineId: text("timeline_id").notNull(),
  
  // Tips & strategies
  tipsEn: text("tips_en").array(),
  tipsId: text("tips_id").array(),
  
  // Common mistakes to avoid
  mistakesToAvoidEn: text("mistakes_to_avoid_en").array(),
  mistakesToAvoidId: text("mistakes_to_avoid_id").array(),
  
  // Gift strategy (for monetization)
  giftStrategyEn: text("gift_strategy_en"),
  giftStrategyId: text("gift_strategy_id"),
  
  // Contingency plans
  contingencyPlansEn: text("contingency_plans_en").array(),
  contingencyPlansId: text("contingency_plans_id").array(),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Trending data (populated by scraper)
export const trendingData = pgTable("trending_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  dataType: text("data_type").notNull(), // 'sound', 'hashtag', 'format', 'topic'
  platform: text("platform").notNull().default("tiktok"),
  
  // Content
  name: text("name").notNull(), // Sound name, hashtag, format name
  url: text("url"), // Link to TikTok
  
  // Metrics
  useCount: integer("use_count"), // Number of videos using this
  growthRate: text("growth_rate"), // 'rising', 'stable', 'declining'
  popularityScore: integer("popularity_score"), // 1-100
  
  // Recommendations
  suggestedNichesEn: text("suggested_niches_en").array(),
  suggestedNichesId: text("suggested_niches_id").array(),
  howToUseEn: text("how_to_use_en"),
  howToUseId: text("how_to_use_id"),
  
  // Prediction
  estimatedLifespanDays: integer("estimated_lifespan_days"),
  saturationLevel: text("saturation_level"), // 'low', 'medium', 'high'
  
  lastScrapedAt: timestamp("last_scraped_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Growth stage recommendations
export const growthStageGuides = pgTable("growth_stage_guides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  stage: text("stage").notNull(), // 'stage_1_0_1k', 'stage_2_1k_10k', 'stage_3_10k_100k', 'stage_4_100k_plus'
  followerRangeMin: integer("follower_range_min").notNull(),
  followerRangeMax: integer("follower_range_max"),
  
  // Stage info
  nameEn: text("name_en").notNull(),
  nameId: text("name_id").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionId: text("description_id").notNull(),
  
  // Recommendations
  postingFrequencyEn: text("posting_frequency_en").notNull(),
  postingFrequencyId: text("posting_frequency_id").notNull(),
  contentStrategyEn: text("content_strategy_en").notNull(),
  contentStrategyId: text("content_strategy_id").notNull(),
  engagementStrategyEn: text("engagement_strategy_en").notNull(),
  engagementStrategyId: text("engagement_strategy_id").notNull(),
  collabStrategyEn: text("collab_strategy_en"),
  collabStrategyId: text("collab_strategy_id"),
  monetizationTipsEn: text("monetization_tips_en"),
  monetizationTipsId: text("monetization_tips_id"),
  
  // What NOT to do
  mistakesToAvoidEn: text("mistakes_to_avoid_en").array(),
  mistakesToAvoidId: text("mistakes_to_avoid_id").array(),
  
  // Metrics to track
  metricsToTrackEn: text("metrics_to_track_en").array(),
  metricsToTrackId: text("metrics_to_track_id").array(),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Response templates for community management
export const responseTemplates = pgTable("response_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  category: text("category").notNull(), // 'compliment', 'question', 'criticism', 'hate', 'spam', 'collab_request'
  situation: text("situation").notNull(), // Specific scenario description
  
  // Template content
  templateEn: text("template_en").notNull(),
  templateId: text("template_id").notNull(),
  
  // Variations
  variationsEn: text("variations_en").array(),
  variationsId: text("variations_id").array(),
  
  // When to use
  whenToUseEn: text("when_to_use_en"),
  whenToUseId: text("when_to_use_id"),
  
  // Psychology
  psychologyEn: text("psychology_en"),
  psychologyId: text("psychology_id"),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas for new tables
export const insertExpertKnowledgeSchema = createInsertSchema(expertKnowledge).omit({ id: true, createdAt: true, updatedAt: true });
export const insertScriptTemplateSchema = createInsertSchema(scriptTemplates).omit({ id: true, createdAt: true });
export const insertHookSchema = createInsertSchema(hooks).omit({ id: true, createdAt: true });
export const insertStorytellingFrameworkSchema = createInsertSchema(storytellingFrameworks).omit({ id: true, createdAt: true });
export const insertLiveStreamingTemplateSchema = createInsertSchema(liveStreamingTemplates).omit({ id: true, createdAt: true });
export const insertTrendingDataSchema = createInsertSchema(trendingData).omit({ id: true, createdAt: true });
export const insertGrowthStageGuideSchema = createInsertSchema(growthStageGuides).omit({ id: true, createdAt: true });
export const insertResponseTemplateSchema = createInsertSchema(responseTemplates).omit({ id: true, createdAt: true });
export const insertAppSettingSchema = createInsertSchema(appSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPricingTierSchema = createInsertSchema(pricingTiers).omit({ id: true, createdAt: true, updatedAt: true });

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
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStories.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertFeatureUsage = z.infer<typeof insertFeatureUsageSchema>;
export type FeatureUsage = typeof featureUsage.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Expert Knowledge Base Types
export type InsertExpertKnowledge = z.infer<typeof insertExpertKnowledgeSchema>;
export type ExpertKnowledge = typeof expertKnowledge.$inferSelect;
export type InsertScriptTemplate = z.infer<typeof insertScriptTemplateSchema>;
export type ScriptTemplate = typeof scriptTemplates.$inferSelect;
export type InsertHook = z.infer<typeof insertHookSchema>;
export type Hook = typeof hooks.$inferSelect;
export type InsertStorytellingFramework = z.infer<typeof insertStorytellingFrameworkSchema>;
export type StorytellingFramework = typeof storytellingFrameworks.$inferSelect;
export type InsertLiveStreamingTemplate = z.infer<typeof insertLiveStreamingTemplateSchema>;
export type LiveStreamingTemplate = typeof liveStreamingTemplates.$inferSelect;
export type InsertTrendingData = z.infer<typeof insertTrendingDataSchema>;
export type TrendingData = typeof trendingData.$inferSelect;
export type InsertGrowthStageGuide = z.infer<typeof insertGrowthStageGuideSchema>;
export type GrowthStageGuide = typeof growthStageGuides.$inferSelect;
export type InsertResponseTemplate = z.infer<typeof insertResponseTemplateSchema>;
export type ResponseTemplate = typeof responseTemplates.$inferSelect;
export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
export type AppSetting = typeof appSettings.$inferSelect;
export type InsertPricingTier = z.infer<typeof insertPricingTierSchema>;
export type PricingTier = typeof pricingTiers.$inferSelect;

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
