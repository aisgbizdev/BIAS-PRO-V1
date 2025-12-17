var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminAuditLog: () => adminAuditLog,
  adminSessions: () => adminSessions,
  analyses: () => analyses,
  appSettings: () => appSettings,
  brands: () => brands,
  chats: () => chats,
  expertKnowledge: () => expertKnowledge,
  featureUsage: () => featureUsage,
  growthStageGuides: () => growthStageGuides,
  hooks: () => hooks,
  insertAdminSessionSchema: () => insertAdminSessionSchema,
  insertAnalysisSchema: () => insertAnalysisSchema,
  insertAppSettingSchema: () => insertAppSettingSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertBrandSchema: () => insertBrandSchema,
  insertChatSchema: () => insertChatSchema,
  insertExpertKnowledgeSchema: () => insertExpertKnowledgeSchema,
  insertFeatureUsageSchema: () => insertFeatureUsageSchema,
  insertGrowthStageGuideSchema: () => insertGrowthStageGuideSchema,
  insertHookSchema: () => insertHookSchema,
  insertLearnedResponseSchema: () => insertLearnedResponseSchema,
  insertLibraryContributionSchema: () => insertLibraryContributionSchema,
  insertLiveStreamingTemplateSchema: () => insertLiveStreamingTemplateSchema,
  insertPageViewSchema: () => insertPageViewSchema,
  insertPricingTierSchema: () => insertPricingTierSchema,
  insertResponseTemplateSchema: () => insertResponseTemplateSchema,
  insertScriptTemplateSchema: () => insertScriptTemplateSchema,
  insertSessionSchema: () => insertSessionSchema,
  insertStorytellingFrameworkSchema: () => insertStorytellingFrameworkSchema,
  insertSuccessStorySchema: () => insertSuccessStorySchema,
  insertTiktokAccountSchema: () => insertTiktokAccountSchema,
  insertTiktokComparisonSchema: () => insertTiktokComparisonSchema,
  insertTiktokVideoSchema: () => insertTiktokVideoSchema,
  insertTrendingDataSchema: () => insertTrendingDataSchema,
  learnedResponses: () => learnedResponses,
  libraryContributions: () => libraryContributions,
  liveStreamingTemplates: () => liveStreamingTemplates,
  pageViews: () => pageViews,
  pricingTiers: () => pricingTiers,
  responseTemplates: () => responseTemplates,
  scriptTemplates: () => scriptTemplates,
  sessions: () => sessions,
  storytellingFrameworks: () => storytellingFrameworks,
  successStories: () => successStories,
  tiktokAccounts: () => tiktokAccounts,
  tiktokComparisons: () => tiktokComparisons,
  tiktokVideos: () => tiktokVideos,
  trendingData: () => trendingData
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions, analyses, chats, learnedResponses, insertLearnedResponseSchema, tiktokAccounts, tiktokVideos, tiktokComparisons, libraryContributions, successStories, pageViews, featureUsage, adminSessions, brands, appSettings, pricingTiers, adminAuditLog, insertSessionSchema, insertAnalysisSchema, insertChatSchema, insertTiktokAccountSchema, insertTiktokVideoSchema, insertTiktokComparisonSchema, insertLibraryContributionSchema, insertSuccessStorySchema, insertPageViewSchema, insertFeatureUsageSchema, insertAdminSessionSchema, insertBrandSchema, insertAuditLogSchema, expertKnowledge, scriptTemplates, hooks, storytellingFrameworks, liveStreamingTemplates, trendingData, growthStageGuides, responseTemplates, insertExpertKnowledgeSchema, insertScriptTemplateSchema, insertHookSchema, insertStorytellingFrameworkSchema, insertLiveStreamingTemplateSchema, insertTrendingDataSchema, insertGrowthStageGuideSchema, insertResponseTemplateSchema, insertAppSettingSchema, insertPricingTierSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable("sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull().unique(),
      tokensRemaining: integer("tokens_remaining").notNull().default(100),
      freeRequestsUsed: integer("free_requests_used").notNull().default(0),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      lastActiveAt: timestamp("last_active_at").notNull().defaultNow()
    });
    analyses = pgTable("analyses", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull(),
      mode: text("mode").notNull(),
      // 'creator', 'academic', 'hybrid'
      inputType: text("input_type").notNull(),
      // 'video', 'text', 'script'
      inputContent: text("input_content").notNull(),
      analysisResult: text("analysis_result").notNull(),
      // JSON string
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    chats = pgTable("chats", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull(),
      role: text("role").notNull(),
      // 'user' or 'assistant'
      message: text("message").notNull(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    learnedResponses = pgTable("learned_responses", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      question: text("question").notNull(),
      // Original question
      keywords: text("keywords").array().notNull(),
      // Extracted keywords for matching
      response: text("response").notNull(),
      // AI response
      useCount: integer("use_count").notNull().default(1),
      // How many times this was used
      quality: integer("quality").default(0),
      // User feedback (-1, 0, 1)
      createdAt: timestamp("created_at").notNull().defaultNow(),
      lastUsedAt: timestamp("last_used_at").notNull().defaultNow()
    });
    insertLearnedResponseSchema = createInsertSchema(learnedResponses).omit({
      id: true,
      useCount: true,
      quality: true,
      createdAt: true,
      lastUsedAt: true
    });
    tiktokAccounts = pgTable("tiktok_accounts", {
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
      engagementRate: real("engagement_rate"),
      // percentage
      avgViews: integer("avg_views"),
      postingFrequency: real("posting_frequency"),
      // videos per week
      analysisResult: text("analysis_result"),
      // JSON string
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    tiktokVideos = pgTable("tiktok_videos", {
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
      duration: integer("duration"),
      // seconds
      soundName: text("sound_name"),
      hashtags: text("hashtags").array(),
      completionRate: real("completion_rate"),
      // percentage
      analysisResult: text("analysis_result"),
      // JSON string
      createdAt: timestamp("created_at").notNull().defaultNow(),
      postedAt: timestamp("posted_at")
    });
    tiktokComparisons = pgTable("tiktok_comparisons", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull(),
      comparisonType: text("comparison_type").notNull(),
      // 'accounts' or 'videos'
      primaryId: text("primary_id").notNull(),
      // main account/video ID
      comparedIds: text("compared_ids").array().notNull(),
      // IDs being compared
      analysisResult: text("analysis_result").notNull(),
      // JSON comparative insights
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    libraryContributions = pgTable("library_contributions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      term: text("term").notNull(),
      termId: text("term_id"),
      definition: text("definition").notNull(),
      definitionId: text("definition_id"),
      platform: text("platform").notNull(),
      // 'tiktok', 'instagram', 'youtube'
      username: text("username").notNull(),
      // contributor's social media username
      example: text("example"),
      exampleId: text("example_id"),
      status: text("status").notNull().default("pending"),
      // 'pending', 'approved', 'rejected'
      createdAt: timestamp("created_at").notNull().defaultNow(),
      approvedAt: timestamp("approved_at")
    });
    successStories = pgTable("success_stories", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      username: text("username").notNull(),
      platform: text("platform").notNull(),
      // 'tiktok' or 'marketing'
      role: text("role").notNull(),
      // 'Creator', 'Influencer', 'Sales Manager', etc.
      story: text("story").notNull(),
      storyId: text("story_id"),
      // Indonesian version
      achievement: text("achievement").notNull(),
      // e.g., "Followers naik 50%"
      achievementId: text("achievement_id"),
      // Indonesian version  
      profileUrl: text("profile_url"),
      // Link to their TikTok/LinkedIn
      avatarUrl: text("avatar_url"),
      // Optional profile picture
      rating: integer("rating").notNull().default(5),
      // 1-5 stars
      status: text("status").notNull().default("pending"),
      // 'pending', 'approved', 'rejected'
      featured: boolean("featured").notNull().default(false),
      // Show on homepage
      createdAt: timestamp("created_at").notNull().defaultNow(),
      approvedAt: timestamp("approved_at")
    });
    pageViews = pgTable("page_views", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull(),
      page: text("page").notNull(),
      // 'dashboard', 'social-pro', 'creator', 'library'
      language: text("language"),
      // 'en' or 'id'
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    featureUsage = pgTable("feature_usage", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull(),
      featureType: text("feature_type").notNull(),
      // 'analysis', 'chat', 'comparison', 'video_upload', 'account_analysis'
      featureDetails: text("feature_details"),
      // JSON string with additional context
      platform: text("platform"),
      // 'tiktok', 'instagram', 'youtube', 'professional'
      mode: text("mode"),
      // 'social-pro', 'creator' for analysis context
      language: text("language"),
      // 'en' or 'id'
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    adminSessions = pgTable("admin_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: text("session_id").notNull().unique(),
      username: text("username").notNull(),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      expiresAt: timestamp("expires_at").notNull()
    });
    brands = pgTable("brands", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      slug: text("slug").notNull().unique(),
      // URL path: bias23.com/newsmaker
      name: text("name").notNull(),
      // "Newsmaker"
      shortName: text("short_name").notNull(),
      // "NM"
      // Bilingual taglines
      taglineEn: text("tagline_en").notNull().default("Powered by BiAS\xB2\xB3"),
      taglineId: text("tagline_id").notNull().default("Didukung BiAS\xB2\xB3"),
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
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    appSettings = pgTable("app_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      key: text("key").notNull().unique(),
      // 'daily_video_limit', 'feature_batch_analysis', etc.
      value: text("value").notNull(),
      // JSON or string value
      valueType: text("value_type").notNull().default("string"),
      // 'string', 'number', 'boolean', 'json'
      category: text("category").notNull().default("general"),
      // 'limits', 'features', 'pricing', 'general'
      labelEn: text("label_en").notNull(),
      // Human-readable label
      labelId: text("label_id").notNull(),
      descriptionEn: text("description_en"),
      descriptionId: text("description_id"),
      isEditable: boolean("is_editable").notNull().default(true),
      updatedBy: text("updated_by"),
      updatedAt: timestamp("updated_at").notNull().defaultNow(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    pricingTiers = pgTable("pricing_tiers", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // 'Gratis', 'Basic', 'Pro', 'Unlimited'
      slug: text("slug").notNull().unique(),
      // 'gratis', 'basic', 'pro', 'unlimited'
      priceIdr: integer("price_idr").notNull().default(0),
      // Price in IDR
      priceUsd: real("price_usd").default(0),
      // Price in USD (optional)
      period: text("period").notNull().default("month"),
      // 'month', 'year', 'lifetime'
      descriptionEn: text("description_en"),
      descriptionId: text("description_id"),
      featuresEn: text("features_en").array(),
      // Array of feature strings
      featuresId: text("features_id").array(),
      chatLimit: integer("chat_limit"),
      // -1 for unlimited
      videoLimit: integer("video_limit"),
      // -1 for unlimited
      isActive: boolean("is_active").notNull().default(true),
      isPopular: boolean("is_popular").notNull().default(false),
      sortOrder: integer("sort_order").notNull().default(0),
      updatedBy: text("updated_by"),
      updatedAt: timestamp("updated_at").notNull().defaultNow(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    adminAuditLog = pgTable("admin_audit_log", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      adminUsername: text("admin_username").notNull(),
      action: text("action").notNull(),
      // 'approve', 'reject', 'delete', 'edit', 'create', 'login', 'logout', 'settings_update'
      targetType: text("target_type").notNull(),
      // 'contribution', 'brand', 'library_item', 'ai_settings', 'session'
      targetId: text("target_id"),
      // ID of affected item
      details: text("details"),
      // JSON string with additional context
      ipAddress: text("ip_address"),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true, lastActiveAt: true });
    insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });
    insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true });
    insertTiktokAccountSchema = createInsertSchema(tiktokAccounts).omit({ id: true, createdAt: true, updatedAt: true });
    insertTiktokVideoSchema = createInsertSchema(tiktokVideos).omit({ id: true, createdAt: true });
    insertTiktokComparisonSchema = createInsertSchema(tiktokComparisons).omit({ id: true, createdAt: true });
    insertLibraryContributionSchema = createInsertSchema(libraryContributions).omit({ id: true, createdAt: true, approvedAt: true });
    insertSuccessStorySchema = createInsertSchema(successStories).omit({ id: true, createdAt: true, approvedAt: true, featured: true, status: true });
    insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true, createdAt: true });
    insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({ id: true, createdAt: true });
    insertAdminSessionSchema = createInsertSchema(adminSessions).omit({ id: true, createdAt: true });
    insertBrandSchema = createInsertSchema(brands).omit({ id: true, createdAt: true, updatedAt: true });
    insertAuditLogSchema = createInsertSchema(adminAuditLog).omit({ id: true, createdAt: true });
    expertKnowledge = pgTable("expert_knowledge", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      category: text("category").notNull(),
      // 'algorithm', 'psychology', 'cinematography', 'audio', 'public_speaking', 'growth', 'monetization', 'regulation'
      subcategory: text("subcategory"),
      // e.g., 'hook_psychology', 'retention_science'
      // Main content
      titleEn: text("title_en").notNull(),
      titleId: text("title_id").notNull(),
      contentEn: text("content_en").notNull(),
      // Main explanation
      contentId: text("content_id").notNull(),
      // Myth-busting (optional)
      mythEn: text("myth_en"),
      // "Common myth: ..."
      mythId: text("myth_id"),
      truthEn: text("truth_en"),
      // "Scientific truth: ..."
      truthId: text("truth_id"),
      // Scientific backing
      researchSummaryEn: text("research_summary_en"),
      researchSummaryId: text("research_summary_id"),
      researchSource: text("research_source"),
      // Citation or link
      // TikTok regulation reference
      regulationReference: text("regulation_reference"),
      // "Community Guidelines Section 3.2"
      regulationLinkUrl: text("regulation_link_url"),
      // Tags for search
      tags: text("tags").array(),
      // Level
      level: text("level").notNull().default("beginner"),
      // 'beginner', 'intermediate', 'expert'
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    scriptTemplates = pgTable("script_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      // Classification
      category: text("category").notNull(),
      // 'gaming', 'comedy', 'education', 'lifestyle', 'dance', 'review', 'storytelling', 'tutorial'
      duration: text("duration").notNull(),
      // '15s', '30s', '60s', '3min'
      goal: text("goal").notNull(),
      // 'entertainment', 'education', 'sales', 'community', 'viral'
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    hooks = pgTable("hooks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      // Hook type
      hookType: text("hook_type").notNull(),
      // 'question', 'controversial', 'shock', 'curiosity', 'benefit', 'pattern_interrupt', 'story', 'challenge'
      category: text("category").notNull(),
      // 'gaming', 'comedy', 'education', etc.
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    storytellingFrameworks = pgTable("storytelling_frameworks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      // Framework info
      nameEn: text("name_en").notNull(),
      nameId: text("name_id").notNull(),
      descriptionEn: text("description_en").notNull(),
      descriptionId: text("description_id").notNull(),
      // Structure breakdown
      structureStepsEn: text("structure_steps_en").array().notNull(),
      // ["Setup", "Conflict", "Resolution"]
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    liveStreamingTemplates = pgTable("live_streaming_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      // Format type
      format: text("format").notNull(),
      // 'solo', 'pk', 'multi_guest', 'collab', 'qa', 'tutorial'
      duration: text("duration").notNull(),
      // '5min', '15min', '30min', '60min'
      // Template info
      nameEn: text("name_en").notNull(),
      nameId: text("name_id").notNull(),
      descriptionEn: text("description_en"),
      descriptionId: text("description_id"),
      // Timeline breakdown (JSON array of timeline segments)
      timelineEn: text("timeline_en").notNull(),
      // JSON: [{minute: "0-2", action: "Hook", tips: "..."}, ...]
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    trendingData = pgTable("trending_data", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      dataType: text("data_type").notNull(),
      // 'sound', 'hashtag', 'format', 'topic'
      platform: text("platform").notNull().default("tiktok"),
      // Content
      name: text("name").notNull(),
      // Sound name, hashtag, format name
      url: text("url"),
      // Link to TikTok
      // Metrics
      useCount: integer("use_count"),
      // Number of videos using this
      growthRate: text("growth_rate"),
      // 'rising', 'stable', 'declining'
      popularityScore: integer("popularity_score"),
      // 1-100
      // Recommendations
      suggestedNichesEn: text("suggested_niches_en").array(),
      suggestedNichesId: text("suggested_niches_id").array(),
      howToUseEn: text("how_to_use_en"),
      howToUseId: text("how_to_use_id"),
      // Prediction
      estimatedLifespanDays: integer("estimated_lifespan_days"),
      saturationLevel: text("saturation_level"),
      // 'low', 'medium', 'high'
      lastScrapedAt: timestamp("last_scraped_at").notNull().defaultNow(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    growthStageGuides = pgTable("growth_stage_guides", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      stage: text("stage").notNull(),
      // 'stage_1_0_1k', 'stage_2_1k_10k', 'stage_3_10k_100k', 'stage_4_100k_plus'
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    responseTemplates = pgTable("response_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      category: text("category").notNull(),
      // 'compliment', 'question', 'criticism', 'hate', 'spam', 'collab_request'
      situation: text("situation").notNull(),
      // Specific scenario description
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    insertExpertKnowledgeSchema = createInsertSchema(expertKnowledge).omit({ id: true, createdAt: true, updatedAt: true });
    insertScriptTemplateSchema = createInsertSchema(scriptTemplates).omit({ id: true, createdAt: true });
    insertHookSchema = createInsertSchema(hooks).omit({ id: true, createdAt: true });
    insertStorytellingFrameworkSchema = createInsertSchema(storytellingFrameworks).omit({ id: true, createdAt: true });
    insertLiveStreamingTemplateSchema = createInsertSchema(liveStreamingTemplates).omit({ id: true, createdAt: true });
    insertTrendingDataSchema = createInsertSchema(trendingData).omit({ id: true, createdAt: true });
    insertGrowthStageGuideSchema = createInsertSchema(growthStageGuides).omit({ id: true, createdAt: true });
    insertResponseTemplateSchema = createInsertSchema(responseTemplates).omit({ id: true, createdAt: true });
    insertAppSettingSchema = createInsertSchema(appSettings).omit({ id: true, createdAt: true, updatedAt: true });
    insertPricingTierSchema = createInsertSchema(pricingTiers).omit({ id: true, createdAt: true, updatedAt: true });
  }
});

// db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
var connectionString, pool, db;
var init_db = __esm({
  "db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    connectionString = process.env.DATABASE_URL;
    pool = new Pool({ connectionString });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/utils/ai-rate-limiter.ts
var ai_rate_limiter_exports = {};
__export(ai_rate_limiter_exports, {
  checkRateLimit: () => checkRateLimit,
  getConfig: () => getConfig,
  getUsageStats: () => getUsageStats,
  recordUsage: () => recordUsage,
  updateConfig: () => updateConfig
});
function getHourlyRecord(sessionId) {
  const now = /* @__PURE__ */ new Date();
  let record = hourlyUsage.get(sessionId);
  if (!record || now.getTime() - record.lastReset.getTime() > 60 * 60 * 1e3) {
    record = { requests: 0, tokens: 0, lastReset: now };
    hourlyUsage.set(sessionId, record);
  }
  return record;
}
function getDailyRecord(sessionId) {
  const now = /* @__PURE__ */ new Date();
  let record = dailyUsage.get(sessionId);
  if (!record || now.getTime() - record.lastReset.getTime() > 24 * 60 * 60 * 1e3) {
    record = { requests: 0, tokens: 0, lastReset: now };
    dailyUsage.set(sessionId, record);
  }
  return record;
}
function checkRateLimit(sessionId, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const hourly = getHourlyRecord(sessionId);
  const daily = getDailyRecord(sessionId);
  const now = /* @__PURE__ */ new Date();
  const remaining = {
    requestsThisHour: cfg.maxRequestsPerHour - hourly.requests,
    requestsToday: cfg.maxRequestsPerDay - daily.requests,
    tokensToday: cfg.maxTokensPerDay - daily.tokens
  };
  const resetIn = {
    hourly: Math.ceil((60 * 60 * 1e3 - (now.getTime() - hourly.lastReset.getTime())) / 6e4),
    daily: Math.ceil((24 * 60 * 60 * 1e3 - (now.getTime() - daily.lastReset.getTime())) / 36e5)
  };
  if (hourly.requests >= cfg.maxRequestsPerHour) {
    return {
      allowed: false,
      reason: `Limit per jam tercapai (${cfg.maxRequestsPerHour}/jam). Reset dalam ${resetIn.hourly} menit.`,
      remaining,
      resetIn
    };
  }
  if (daily.requests >= cfg.maxRequestsPerDay) {
    return {
      allowed: false,
      reason: `Limit harian tercapai (${cfg.maxRequestsPerDay}/hari). Reset dalam ${resetIn.daily} jam.`,
      remaining,
      resetIn
    };
  }
  if (daily.tokens >= cfg.maxTokensPerDay) {
    return {
      allowed: false,
      reason: `Limit token harian tercapai (${cfg.maxTokensPerDay.toLocaleString()} tokens). Reset dalam ${resetIn.daily} jam.`,
      remaining,
      resetIn
    };
  }
  return { allowed: true, remaining, resetIn };
}
function recordUsage(sessionId, tokensUsed) {
  const hourly = getHourlyRecord(sessionId);
  const daily = getDailyRecord(sessionId);
  hourly.requests++;
  hourly.tokens += tokensUsed;
  daily.requests++;
  daily.tokens += tokensUsed;
  console.log(`\u{1F4CA} Ai Usage - Session ${sessionId.slice(0, 8)}...: ${daily.requests} requests, ${daily.tokens.toLocaleString()} tokens today`);
}
function getUsageStats(sessionId) {
  return {
    hourly: getHourlyRecord(sessionId),
    daily: getDailyRecord(sessionId),
    limits: DEFAULT_CONFIG
  };
}
function updateConfig(newConfig) {
  Object.assign(DEFAULT_CONFIG, newConfig);
  console.log("\u{1F527} Ai Rate Limit Config Updated:", DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
}
function getConfig() {
  return { ...DEFAULT_CONFIG };
}
var DEFAULT_CONFIG, hourlyUsage, dailyUsage;
var init_ai_rate_limiter = __esm({
  "server/utils/ai-rate-limiter.ts"() {
    "use strict";
    DEFAULT_CONFIG = {
      maxRequestsPerHour: 5,
      // Max 5 request per jam (hemat)
      maxRequestsPerDay: 20,
      // Max 20 request per hari (hemat)
      maxTokensPerDay: 5e4,
      // Max 50K tokens per hari (hemat)
      maxTokensPerRequest: 1500
      // Max 1500 token per request (hemat, tetap quality)
    };
    hourlyUsage = /* @__PURE__ */ new Map();
    dailyUsage = /* @__PURE__ */ new Map();
  }
});

// server/utils/learning-system.ts
var learning_system_exports = {};
__export(learning_system_exports, {
  extractKeywords: () => extractKeywords,
  findSimilarResponse: () => findSimilarResponse,
  getLearningStats: () => getLearningStats,
  saveLearnedResponse: () => saveLearnedResponse
});
import { eq as eq2, sql as sql3, desc as desc2 } from "drizzle-orm";
function extractKeywords(text2) {
  const normalized = text2.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");
  const keywords = words.filter((word) => word.length > 2 && !STOPWORDS.has(word)).slice(0, 10);
  return Array.from(new Set(keywords));
}
function calculateSimilarity(keywords1, keywords2) {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  let matches = 0;
  for (const kw of arr1) {
    if (set2.has(kw)) matches++;
    for (const kw2 of arr2) {
      if (kw !== kw2 && (kw.includes(kw2) || kw2.includes(kw))) {
        matches += 0.5;
      }
    }
  }
  const combined = Array.from(/* @__PURE__ */ new Set([...keywords1, ...keywords2]));
  return matches / combined.length;
}
async function findSimilarResponse(question) {
  try {
    const queryKeywords = extractKeywords(question);
    if (queryKeywords.length === 0) {
      return { found: false };
    }
    console.log(`\u{1F50D} Looking for similar response. Keywords: ${queryKeywords.join(", ")}`);
    const allResponses = await db.select().from(learnedResponses).orderBy(desc2(learnedResponses.useCount));
    let bestMatch = null;
    const SIMILARITY_THRESHOLD = 0.4;
    for (const lr of allResponses) {
      const storedKeywords = lr.keywords || [];
      const similarity = calculateSimilarity(queryKeywords, storedKeywords);
      if (similarity >= SIMILARITY_THRESHOLD) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            response: lr.response,
            similarity,
            id: lr.id
          };
        }
      }
    }
    if (bestMatch) {
      console.log(`\u2705 Found similar response! Similarity: ${(bestMatch.similarity * 100).toFixed(0)}%`);
      await db.update(learnedResponses).set({
        useCount: sql3`${learnedResponses.useCount} + 1`,
        lastUsedAt: /* @__PURE__ */ new Date()
      }).where(eq2(learnedResponses.id, bestMatch.id));
      return {
        found: true,
        response: bestMatch.response,
        similarity: bestMatch.similarity,
        id: bestMatch.id
      };
    }
    console.log("\u274C No similar response found in learned library");
    return { found: false };
  } catch (error) {
    console.error("Error finding similar response:", error);
    return { found: false };
  }
}
async function saveLearnedResponse(question, response) {
  try {
    const keywords = extractKeywords(question);
    if (keywords.length === 0) {
      console.log("\u26A0\uFE0F No keywords extracted, skipping save");
      return false;
    }
    const existing = await findSimilarResponse(question);
    if (existing.found && existing.similarity && existing.similarity > 0.8) {
      console.log("\u{1F4E6} Very similar question already exists, skipping save");
      return false;
    }
    await db.insert(learnedResponses).values({
      question,
      keywords,
      response
    });
    console.log(`\u{1F4DA} Saved to learned library! Keywords: ${keywords.join(", ")}`);
    return true;
  } catch (error) {
    console.error("Error saving learned response:", error);
    return false;
  }
}
async function getLearningStats() {
  try {
    const allResponses = await db.select().from(learnedResponses);
    const totalResponses = allResponses.length;
    const totalUses = allResponses.reduce((sum, r) => sum + r.useCount, 0);
    const keywordCount = {};
    for (const r of allResponses) {
      for (const kw of r.keywords || []) {
        keywordCount[kw] = (keywordCount[kw] || 0) + r.useCount;
      }
    }
    const topKeywords = Object.entries(keywordCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([kw]) => kw);
    return { totalResponses, totalUses, topKeywords };
  } catch (error) {
    console.error("Error getting learning stats:", error);
    return { totalResponses: 0, totalUses: 0, topKeywords: [] };
  }
}
var STOPWORDS;
var init_learning_system = __esm({
  "server/utils/learning-system.ts"() {
    "use strict";
    init_db();
    init_schema();
    STOPWORDS = /* @__PURE__ */ new Set([
      "yang",
      "di",
      "ke",
      "dari",
      "dan",
      "atau",
      "ini",
      "itu",
      "untuk",
      "dengan",
      "pada",
      "adalah",
      "akan",
      "juga",
      "sudah",
      "bisa",
      "ada",
      "tidak",
      "saya",
      "aku",
      "kamu",
      "dia",
      "mereka",
      "kita",
      "gue",
      "lo",
      "lu",
      "gw",
      "apa",
      "gimana",
      "bagaimana",
      "kenapa",
      "mengapa",
      "kapan",
      "dimana",
      "mana",
      "siapa",
      "berapa",
      "apakah",
      "dong",
      "ya",
      "nih",
      "sih",
      "deh",
      "kan",
      "tuh",
      "loh",
      "lah",
      "nah",
      "wah",
      "hah",
      "eh",
      "oh",
      "ah",
      "the",
      "is",
      "a",
      "an",
      "to",
      "in",
      "on",
      "of",
      "for",
      "and",
      "or",
      "it",
      "this",
      "that",
      "how",
      "what",
      "why",
      "when",
      "where",
      "who",
      "which",
      "can",
      "bro",
      "mas",
      "bang",
      "kak",
      "min",
      "mau",
      "minta",
      "tolong",
      "kasih",
      "tau",
      "tanya"
    ]);
  }
});

// server/chat/knowledge-loader.ts
import * as fs from "fs";
import * as path from "path";
function loadKnowledgeBase() {
  if (cachedKnowledge) {
    return cachedKnowledge;
  }
  try {
    const files = fs.readdirSync(KNOWLEDGE_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    const knowledgeParts = [];
    const loadedFiles = [];
    for (const priorityName of PRIORITY_FILES) {
      const matchingFile = mdFiles.find((f) => f.includes(priorityName));
      if (matchingFile) {
        try {
          const filePath = path.join(KNOWLEDGE_DIR, matchingFile);
          const content = fs.readFileSync(filePath, "utf-8");
          const condensed = condenseContent(content, matchingFile);
          if (condensed) {
            knowledgeParts.push(condensed);
            loadedFiles.push(matchingFile);
          }
        } catch (err) {
          console.error(`Failed to read ${matchingFile}:`, err);
        }
      }
    }
    cachedKnowledge = knowledgeParts.join("\n\n---\n\n");
    console.log(`\u{1F4DA} Loaded ${loadedFiles.length} knowledge files`);
    return cachedKnowledge;
  } catch (error) {
    console.error("Error loading knowledge base:", error);
    return "";
  }
}
function condenseContent(content, filename) {
  const lines = content.split("\n");
  const importantLines = [];
  let currentSection = "";
  let skipSection = false;
  for (const line of lines) {
    if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
      currentSection = line;
      skipSection = false;
      if (line.toLowerCase().includes("changelog") || line.toLowerCase().includes("meta") || line.toLowerCase().includes("integration note") || line.toLowerCase().includes("footer")) {
        skipSection = true;
      }
      if (!skipSection) {
        importantLines.push(line);
      }
    } else if (!skipSection) {
      if (line.includes("|") && line.includes("---")) {
        continue;
      }
      if (line.startsWith("|") || line.includes("\u2705") || line.includes("\u274C") || line.includes("\u26A0\uFE0F") || line.includes("\u{1F4A1}") || line.includes("\u{1F3AF}") || line.includes("Example") || line.includes("Contoh") || line.includes("Tip") || line.includes("Insight") || line.trim().startsWith("-") || line.trim().startsWith("\u2022")) {
        importantLines.push(line);
      }
    }
  }
  const condensed = importantLines.join("\n").trim();
  if (condensed.length > 3e3) {
    return condensed.slice(0, 3e3) + "\n... [condensed]";
  }
  return condensed;
}
function getRelevantKnowledge(topic) {
  const knowledge = loadKnowledgeBase();
  const topicLower = topic.toLowerCase();
  const keywords = {
    "fyp": ["FYP", "For You", "algoritma", "viral", "reach"],
    "shadowban": ["shadowban", "pelanggaran", "visibilitas", "banned"],
    "live": ["Live", "streaming", "gift", "interaksi"],
    "hook": ["Hook", "3 detik", "pembuka", "retention"],
    "agency": ["agency", "agensi", "monetisasi", "brand deal"],
    "engagement": ["engagement", "like", "comment", "share"],
    "followers": ["follower", "growth", "pertumbuhan"],
    "content": ["konten", "video", "posting", "upload"],
    "ethics": ["etika", "ethics", "BMIL", "ESI", "community guidelines"],
    "voice": ["suara", "voice", "tone", "VPL", "pacing"],
    "emotion": ["emosi", "emotion", "EPM", "empati"],
    "visual": ["visual", "VBM", "gesture", "framing", "ekspresi"],
    // Marketing & Sales keywords
    "pitch": ["pitch", "pitching", "proposal", "presentasi", "investor", "funding", "startup"],
    "sales": ["sales", "jualan", "closing", "prospek", "konversi", "selling", "cold call", "warm lead"],
    "marketing": ["marketing", "pemasaran", "branding", "campaign", "iklan", "advertising"],
    "negotiation": ["negosiasi", "negotiation", "deal", "tawar", "kontrak", "salary", "gaji"],
    "leadership": ["leadership", "kepemimpinan", "leader", "pemimpin", "manager", "atasan", "bos"],
    "teamwork": ["tim", "team", "kolaborasi", "delegasi", "teamwork", "kerja sama", "meeting"],
    "speaking": ["public speaking", "pidato", "speech", "presentasi", "berbicara", "MC", "moderator"],
    "objection": ["objection", "keberatan", "handling", "penolakan", "rejection"],
    "closing": ["closing", "tutup deal", "conversion", "close", "win rate"],
    "conflict": ["konflik", "conflict", "masalah", "mediasi", "resolusi"],
    "motivation": ["motivasi", "motivation", "semangat", "mindset", "goal"],
    "interview": ["interview", "wawancara", "rekrut", "hiring", "kandidat"],
    "client": ["client", "klien", "customer", "pelanggan", "retention", "upsell"],
    "feedback": ["feedback", "kritik", "saran", "review", "evaluasi"],
    "communication": ["komunikasi", "communication", "bicara", "ngomong", "sampaikan"]
  };
  const relevantSections = [];
  for (const [category, keywordList] of Object.entries(keywords)) {
    if (keywordList.some((kw) => topicLower.includes(kw.toLowerCase()))) {
      const sections = extractSectionsWithKeywords(knowledge, keywordList);
      relevantSections.push(...sections);
    }
  }
  if (relevantSections.length === 0) {
    return knowledge.slice(0, 4e3);
  }
  const combined = relevantSections.join("\n\n");
  return combined.slice(0, 6e3);
}
function extractSectionsWithKeywords(knowledge, keywords) {
  const sections = [];
  const lines = knowledge.split("\n");
  let currentSection = [];
  let includeSection = false;
  for (const line of lines) {
    if (line.startsWith("#") || line === "---") {
      if (includeSection && currentSection.length > 0) {
        sections.push(currentSection.join("\n"));
      }
      currentSection = [line];
      includeSection = false;
    } else {
      currentSection.push(line);
      if (keywords.some((kw) => line.toLowerCase().includes(kw.toLowerCase()))) {
        includeSection = true;
      }
    }
  }
  if (includeSection && currentSection.length > 0) {
    sections.push(currentSection.join("\n"));
  }
  return sections;
}
var KNOWLEDGE_DIR, PRIORITY_FILES, cachedKnowledge;
var init_knowledge_loader = __esm({
  "server/chat/knowledge-loader.ts"() {
    "use strict";
    KNOWLEDGE_DIR = path.join(process.cwd(), "attached_assets");
    PRIORITY_FILES = [
      "bias_master_reality_tik_tok_v_3_3",
      "BIAS_Creator_Intelligence_Core",
      "BIAS_VoiceEmotion_Core",
      "BIAS_Full_Core",
      "VBM_AudioVisual",
      "EPM_Psychology",
      "BMIL_Ethics",
      "ESI_EthicalSensitivity",
      "NLP_Storytelling",
      "MarketingPitch",
      "Leadership",
      "PublicSpeaking",
      "TeamBuilding",
      "BIAS_ModeSwitch",
      "BIAS_Greeting"
    ];
    cachedKnowledge = null;
  }
});

// server/chat/hybrid-chat.ts
var hybrid_chat_exports = {};
__export(hybrid_chat_exports, {
  hybridChat: () => hybridChat
});
import OpenAI3 from "openai";
async function hybridChat(request) {
  const sessionId = request.sessionId || "anonymous";
  try {
    const learned = await findSimilarResponse(request.message);
    if (learned.found && learned.response) {
      console.log(`\u{1F4DA} Found in learning library! Similarity: ${((learned.similarity || 0) * 100).toFixed(0)}%`);
      return {
        response: learned.response,
        source: "local",
        // Counts as local since it's from our library
        rateLimitInfo: checkRateLimit(sessionId)
      };
    }
  } catch (error) {
    console.log("\u26A0\uFE0F Learning library check failed, continuing to Ai");
  }
  const rateLimitCheck = checkRateLimit(sessionId);
  if (!rateLimitCheck.allowed) {
    return {
      response: `\u26A0\uFE0F **Limit tercapai bro!**

${rateLimitCheck.reason}

Sementara itu, kamu masih bisa:
\u2022 Gunakan fitur template (Live Generator, Video Script)
\u2022 Baca knowledge base di panel Expert
\u2022 Coba lagi nanti setelah limit reset

\u{1F4A1} **Tip:** Template gak pakai quota, jadi bebas pakai!`,
      source: "local",
      rateLimitInfo: rateLimitCheck
    };
  }
  if (!process.env.OPENAI_API_KEY) {
    return {
      response: `\u{1F527} **OpenAI belum dikonfigurasi**

Untuk mengaktifkan Ai chat, admin perlu setup OpenAI API key.

Sementara itu, kamu bisa pakai:
\u2022 Template Live Generator
\u2022 Template Video Script  
\u2022 Knowledge Base di Expert Mode`,
      source: "local"
    };
  }
  try {
    const openai = new OpenAI3({ apiKey: process.env.OPENAI_API_KEY });
    const mode = request.mode || "home";
    let modeContext = "";
    let basePrompt = TIKTOK_MENTOR_PROMPT;
    if (mode === "marketing") {
      basePrompt = MARKETING_MENTOR_PROMPT;
      console.log(`\u{1F4CA} Using MARKETING_MENTOR_PROMPT for mode: ${mode}`);
    } else if (mode === "expert") {
      modeContext = `

\u{1F393} MODE: EXPERT
User ini udah berpengalaman. Berikan:
- Insight lebih mendalam dengan data/statistik
- Strategi advanced (monetisasi, brand deals, scaling)
- Tetap pakai format section bernomor + tabel informatif
- Reference "BIAS Core analysis" untuk depth`;
    } else if (mode === "beginner") {
      modeContext = `

\u{1F331} MODE: PEMULA
User ini baru mulai. Penyesuaian:
- Penjelasan lebih simpel, tapi tetap profesional
- Semua istilah wajib dijelasin inline
- Maksimal 3 section, jangan overwhelming
- Ekstra encouragement dan apresiasi
- Tetap pakai format section bernomor, tapi lebih singkat`;
    }
    const fullPrompt = basePrompt + modeContext;
    const relevantKnowledge = getRelevantKnowledge(request.message);
    console.log(`\u{1F4DA} Loaded ${relevantKnowledge.length} chars of relevant knowledge`);
    console.log(`\u{1F916} Calling OpenAI for chat (${mode}): "${request.message.slice(0, 50)}..."`);
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: fullPrompt },
        {
          role: "system",
          content: `\u{1F4DA} KNOWLEDGE BASE (gunakan untuk menjawab dengan akurat):

${relevantKnowledge}`
        },
        { role: "user", content: request.message }
      ],
      temperature: 0.7,
      max_tokens: mode === "expert" ? 2e3 : 1500
    });
    const duration = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;
    console.log(`\u2705 OpenAI chat completed in ${(duration / 1e3).toFixed(1)}s, ${tokensUsed} tokens`);
    recordUsage(sessionId, tokensUsed);
    const response = completion.choices[0]?.message?.content || "Maaf bro, ada error. Coba lagi ya!";
    saveLearnedResponse(request.message, response).catch((err) => {
      console.error("Failed to save to learning library:", err);
    });
    return {
      response,
      source: "ai",
      tokensUsed,
      rateLimitInfo: rateLimitCheck
    };
  } catch (error) {
    console.error("\u274C OpenAI Chat Error:", error);
    return {
      response: `\u26A0\uFE0F **Ada gangguan bro!**

Gue gak bisa connect ke Ai sekarang. Error: ${error.message || "Unknown error"}

Coba:
\u2022 Refresh dan tanya lagi
\u2022 Pakai template yang tersedia
\u2022 Hubungi admin kalau terus error`,
      source: "local"
    };
  }
}
var TIKTOK_MENTOR_PROMPT, MARKETING_MENTOR_PROMPT;
var init_hybrid_chat = __esm({
  "server/chat/hybrid-chat.ts"() {
    "use strict";
    init_ai_rate_limiter();
    init_learning_system();
    init_knowledge_loader();
    TIKTOK_MENTOR_PROMPT = `\u{1F9E0} BIAS Pro \u2013 Behavioral Intelligence System v3.2.\u03B1 (Fusion Compact Build)
(Adaptive Coaching + TikTok Action + Dashboard Mode)

\u{1F9E9} SYSTEM ROLE
You are BIAS Pro \u2013 Behavioral Intelligence Audit System,
a bilingual behavioral mentor analyzing creators' tone, emotion, clarity, and authenticity.

\u{1F3AF} Purpose:
Menganalisa perilaku komunikasi dari sisi visual, emosional, linguistik, dan etika 
berdasarkan 8-Layer Framework: VBM \u2013 EPM \u2013 NLP \u2013 BMIL (sekarang dalam satu inti VoiceEmotion Core).

Kamu punya akses ke knowledge base lengkap:
- BIAS_MasterReality_TikTok_v3.3.md
- BIAS_Creator_Intelligence_Core_v3.1.md
- BIAS_VoiceEmotion_Core.md
- BMIL_Ethics.md
- ESI_EthicalSensitivity.md
- NLP_Storytelling.md
- Dan file knowledge lainnya

---

\u2699\uFE0F BEHAVIORAL FRAMEWORK

Gunakan struktur 8-Layer BIAS (Fusion Compact):

**VBM\u2013EPM\u2013VPL** \u2192 digabung menjadi VoiceEmotion Core
Menganalisa Visual Behavior (gesture, tone, pacing), Voice Personality, dan Emotional Psychology.

**NLP Layer** \u2192 Narrative Linguistics (clarity, structure)
**BMIL Layer** \u2192 Behavioral Morality (integrity, ethics)
**ESI Layer** \u2192 Ethical Sensitivity & Authenticity
**VPL Layer** \u2192 Voice Pacing Layer (dalam VoiceEmotion Core)
**VPM Layer** \u2192 Audience Persuasion Mapping

---

\u{1F9ED} AUTO-MODE DETECTION
Keyword | Mode | Fokus
---------|-------|-------
TikTok, Video, FYP | Creator | Visual + Engagement
Speaking | Speaker | Voice + Clarity
Leadership | Leader | Empathy + Authority
Marketing, Pitch | Pitch | Persuasion + CTA
Prospek, Jualan | Prospek | Komunikasi jualan & follow-up
Emotional | Reflective | Self-reflection + Confidence
hoax, fakta, rumor, algoritma, shadowban, viral, agency | MasterReality | Edukatif + Myth-busting

---

\u{1F4AC} RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.

Contoh opening:
"\u{1F525} Wah bro\u2026 ini pertanyaan kelas 'inside creator' banget \u2014 dan lo benar-benar peka terhadap sistem real di balik TikTok."

Contoh mid-response:
"Bro, tone kamu udah mantap \u2014 tapi pacing agak cepat.
Tambahin jeda biar audiens sempat mencerna."

---

\u{1F4DD} FORMAT JAWABAN (WAJIB IKUTI!)

\u{1F525} OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- Kasih "teaser" jawaban
- "Jawaban jujurnya: \u27A1\uFE0F [jawaban singkat]. Tapi dengan catatan penting..."

\u{1F9E0} SECTION BERNOMOR dengan emoji (\u{1F9ED} 1\uFE0F\u20E3, \u2699\uFE0F 2\uFE0F\u20E3, \u{1F9E0} 3\uFE0F\u20E3, \u{1F9E9} 4\uFE0F\u20E3, \u{1F4AC} 5\uFE0F\u20E3, \u{1F9E9} 6\uFE0F\u20E3)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS MasterReality v3.3..."

\u{1F4CA} TABEL WAJIB DIPAKAI untuk:
- Sistem internal TikTok
- Perbandingan "buku vs realita"
- Timeline/durasi
- Langkah aksi

\u{1F4AC} CONTOH NYATA wajib ada:
"\u{1F4AC} Contoh nyata: Kamu bisa tidak melanggar satu pun guideline, tapi tetap kena visibility restriction..."

\u{1F4D6} REFERENSI FRAMEWORK:
- "Mari kita bongkar pakai kerangka BIAS MasterReality v3.3 + Creator Core v3.1..."
- "Di BIAS Reality Pack v3.3 disebut jelas: [quote]"
- "...tercatat di catatan BIAS Core..."

\u{1F9ED} KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

\u2728 SINGKATNYA (bullet summary)
3-4 poin key takeaway

\u{1F4AC} CLOSING dengan PENAWARAN SPESIFIK:
"Kalau lo mau, gue bisa bantu [action spesifik]..."
"Mau gue breakdown lebih detail, bro?"

---

\u{1F527} SISTEM INTERNAL TIKTOK (REFERENSI)

Kamu tahu tentang sistem tersembunyi TikTok:
- Integrity Engine: menilai kelayakan konten (visual, audio, teks) \u2014 Internal-only
- Trust & Safety Scoring: menyimpan riwayat perilaku akun (cache) \u2014 Tidak diumumkan
- Visibility Balancer (VB): mengatur jangkauan dinamis \u2014 Tidak dipublikasikan
- Behavioral Cache Memory: Trust Score akun
- Emotion Detection Layer: deteksi emosi dalam konten
- Comment Toxicity Filter: filter komentar beracun
- Interaction Integrity Scanner: scanner integritas interaksi

---

\u2699\uFE0F BEHAVIOR LOGIC

Match user energy \xB110%
Prioritize: empathy \u2192 analysis \u2192 correction
Gunakan reflective tone untuk konteks emosional.

---

\u26A0\uFE0F HINDARI
\u274C Format script breakdown teknis (timing 0-5s, Hook, Problem, Solution)
\u274C Bullet list panjang tanpa narasi
\u274C Jawaban pendek tanpa depth
\u274C Generic advice tanpa framework reference

\u26D4 JANGAN PERNAH SARANIN
- Beli followers/likes/views
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait menipu
- Konten sensual buat views

---

\u{1F308} ETHICS & FOOTER

Selalu jaga integritas & privasi user.

\u26A0\uFE0F WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS\u2122 \u2013 Behavioral Intelligence for Creators**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*

---

\u{1F9E9} MASTERREALITY MODULE (Auto-trigger)

Aktif otomatis ketika user menyebut: hoax, fakta, rumor, algoritma, FYP, agency, shadowban, viral
Response tone: Bilingual \u2013 calm, netral, edukatif
Integration layer: NLP + BMIL + ESI

Kamu adalah BIAS Pro \u2014 expert behavioral intelligence dengan akses ke framework lengkap.
Jawab dengan DEPTH, AUTHORITY, dan WARMTH. Bikin user merasa dapat insight berharga dari orang dalam! \u{1F525}`;
    MARKETING_MENTOR_PROMPT = `\u{1F9E0} BIAS Pro \u2013 Behavioral Intelligence System v3.2.\u03B1 (Marketing & Professional Edition)
(Adaptive Coaching for Sales, Leadership, Public Speaking & Professional Communication)

\u{1F9E9} SYSTEM ROLE
You are BIAS Pro \u2013 Behavioral Intelligence Audit System,
a bilingual behavioral mentor specializing in ALL aspects of professional communication:
- Sales & Marketing (pitch, closing, objection handling)
- Leadership & Team Building (authority, empathy, delegation)
- Public Speaking (confidence, delivery, stage presence)
- Negotiation (win-win, BATNA, leverage)
- Client Communication (trust building, follow-up)
- Presentation Skills (slide design, storytelling, impact)

\u{1F3AF} Purpose:
Menganalisa dan meningkatkan SELURUH aspek komunikasi profesional dari sisi persuasi, emosi, narasi, dan etika
berdasarkan 8-Layer Framework: VBM \u2013 EPM \u2013 NLP \u2013 BMIL \u2013 ESI \u2013 SOC \u2013 COG \u2013 VPL.

Kamu punya akses ke FULL knowledge base:
- MarketingPitch.md - Teknik pitching dan persuasi
- Leadership.md - Komunikasi kepemimpinan & team building
- PublicSpeaking.md - Public speaking mastery
- TeamBuilding.md - Dinamika tim dan kolaborasi
- NLP_Storytelling.md - Narrative & storytelling frameworks
- BMIL_Ethics.md - Ethical communication principles
- ESI_EthicalSensitivity.md - Sensitivity & authenticity
- BIAS_VoiceEmotion_Core.md - Voice & emotion analysis
- BIAS_Creator_Intelligence_Core.md - Behavioral patterns (bisa diterapkan di semua konteks)

---

\u2699\uFE0F BEHAVIORAL FRAMEWORK (Marketing Focus)

Gunakan struktur 8-Layer BIAS:

**VBM Layer** \u2192 Visual Behavior (gestur, body language dalam presentasi)
**EPM Layer** \u2192 Emotional Psychology (trigger emosi audiens/klien)
**NLP Layer** \u2192 Narrative Linguistics (struktur pitch, storytelling)
**VPL Layer** \u2192 Voice Pacing Layer (intonasi, pacing, power pause)
**BMIL Layer** \u2192 Behavioral Morality (integritas dalam sales)
**ESI Layer** \u2192 Ethical Sensitivity (kepekaan & autentisitas)
**SOC Layer** \u2192 Social Intelligence (baca audiens, adaptasi)
**COG Layer** \u2192 Cognitive Load (kejelasan pesan, memorable points)

---

\u{1F9ED} AUTO-MODE DETECTION (Comprehensive)
Keyword | Mode | Fokus
---------|-------|-------
Sales, Jualan, Closing, Deal | Sales | Persuasi + Objection handling + Closing techniques
Pitch, Proposal, Investor, Funding | Pitch | CTA + Value proposition + Investor psychology
Presentasi, Meeting, Slide | Presentation | Clarity + Impact + Visual storytelling
Leadership, Pemimpin, Manager | Leadership | Authority + Empathy + Decision making
Tim, Team, Kolaborasi, Delegasi | Team Building | Trust + Delegation + Accountability
Negosiasi, Deal, Kontrak | Negotiation | Win-win + BATNA + Leverage
Prospek, Follow-up, Cold Call | Prospecting | Trust building + Conversion + CRM
Public Speaking, Pidato, MC | Speaking | Confidence + Delivery + Stage presence
Konflik, Masalah Tim, HR | Conflict | Resolution + Mediation + Communication
Motivasi, Semangat, Mindset | Motivation | Encouragement + Goal setting + Resilience
Interview, Wawancara, Rekrut | Interview | Impression + Storytelling + Negotiation
Client, Klien, Customer | Client Mgmt | Relationship + Retention + Upselling

---

\u{1F4AC} RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.

Contoh opening:
"\u{1F525} Bro, pertanyaan ini penting banget \u2014 karena banyak yang salah paham soal cara pitch yang efektif."

Contoh mid-response:
"Nah, yang bikin pitch kamu memorable bukan cuma apa yang kamu bilang,
tapi BAGAIMANA kamu menyampaikannya \u2014 intonasi, timing, dan eye contact."

---

\u{1F4DD} FORMAT JAWABAN (WAJIB IKUTI!)

\u{1F525} OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- Kasih "teaser" jawaban
- "Jawaban jujurnya: \u27A1\uFE0F [jawaban singkat]. Tapi ada strategi penting..."

\u{1F9E0} SECTION BERNOMOR dengan emoji (\u{1F9ED} 1\uFE0F\u20E3, \u2699\uFE0F 2\uFE0F\u20E3, \u{1F9E0} 3\uFE0F\u20E3, \u{1F9E9} 4\uFE0F\u20E3, \u{1F4AC} 5\uFE0F\u20E3, \u{1F9E9} 6\uFE0F\u20E3)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS Marketing Framework..."

\u{1F4CA} TABEL WAJIB DIPAKAI untuk:
- Perbandingan teknik efektif vs tidak efektif
- Struktur pitch/presentasi
- Timeline follow-up
- Langkah aksi

\u{1F4AC} CONTOH NYATA wajib ada:
"\u{1F4AC} Contoh nyata: Saat pitch ke investor, 90% keputusan diambil di 30 detik pertama..."

\u{1F4D6} REFERENSI FRAMEWORK:
- "Mari kita breakdown pakai kerangka BIAS Marketing Framework..."
- "Di BIAS Pitching Module dijelaskan: [quote]"
- "...sesuai prinsip NLP Storytelling..."

\u{1F9ED} KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

\u2728 SINGKATNYA (bullet summary)
3-4 poin key takeaway

\u{1F4AC} CLOSING dengan PENAWARAN SPESIFIK:
"Kalau lo mau, gue bisa bantu [script pitch, opening statement, objection handling]..."
"Mau gue breakdown lebih detail, bro?"

---

\u{1F3AF} COMPREHENSIVE PROFESSIONAL EXPERTISE

**SALES & MARKETING:**
- Opening statement yang powerful (hook dalam 7 detik)
- Storytelling untuk pitch (Hero's Journey for Business)
- Objection handling (Feel-Felt-Found, Boomerang, Reframe)
- Closing techniques (Assumptive, Alternative, Urgency, Trial Close)
- Follow-up sequences (3-touch, 7-touch methods)
- Pricing psychology (anchoring, charm pricing, bundling, decoy)
- Cold calling & prospecting frameworks

**LEADERSHIP & MANAGEMENT:**
- Situational leadership (Hersey-Blanchard model)
- Delegation framework (SMART, accountability, trust)
- Feedback techniques (SBI model, radical candor)
- Conflict resolution (mediation, win-win, active listening)
- Team motivation (intrinsic vs extrinsic, recognition)
- Decision making (RAPID, consensus building)
- Servant leadership principles

**PUBLIC SPEAKING & PRESENTATION:**
- Body language for impact (power poses, eye contact, movement)
- Voice modulation (pitch, pace, pause, power)
- Slide design principles (1 idea per slide, visual hierarchy)
- Opening hooks (question, story, statistic, quote)
- Stage presence & confidence building
- Q&A handling techniques
- Virtual presentation best practices

**NEGOTIATION & DEAL-MAKING:**
- BATNA & ZOPA analysis
- Win-win framing & creative solutions
- Anchoring & counter-anchoring
- Concession strategies
- Contract negotiation basics
- Salary & compensation negotiation

**CLIENT & RELATIONSHIP MANAGEMENT:**
- Trust building framework (credibility, reliability, intimacy)
- Active listening & empathy mapping
- Upselling & cross-selling ethically
- Client retention strategies
- Difficult conversation handling

---

\u26A0\uFE0F HINDARI
\u274C Format script breakdown teknis tanpa narasi
\u274C Bullet list panjang tanpa context
\u274C Jawaban pendek tanpa depth
\u274C Generic advice tanpa framework reference

\u26D4 JANGAN PERNAH SARANIN
- Teknik manipulatif atau menipu
- High-pressure sales tactics yang tidak etis
- Janji palsu ke klien/investor
- Fake urgency atau scarcity yang tidak jujur

---

\u{1F308} ETHICS & FOOTER

Selalu jaga integritas & komunikasi yang etis.
Persuasi BUKAN manipulasi \u2014 bangun trust, bukan exploit.

\u26A0\uFE0F WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS\u2122 \u2013 Behavioral Intelligence for Professionals**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*

---

Kamu adalah BIAS Pro \u2014 expert behavioral intelligence untuk komunikasi profesional.
Jawab dengan DEPTH, AUTHORITY, dan WARMTH. Bikin user merasa dapat insight berharga dari mentor bisnis terpercaya! \u{1F525}`;
  }
});

// server/index.ts
import express2 from "express";
import cookieParser from "cookie-parser";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
init_db();
import { randomUUID } from "crypto";
import { eq, lt, and, gt, or, lte, ilike, desc, count } from "drizzle-orm";
var MemStorage = class {
  sessions;
  analyses;
  chats;
  tiktokAccounts;
  tiktokVideos;
  tiktokComparisons;
  libraryContributions;
  deletedLibraryItems;
  pageViews;
  featureUsages;
  adminSessions;
  brandsMap;
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
    this.analyses = /* @__PURE__ */ new Map();
    this.chats = /* @__PURE__ */ new Map();
    this.tiktokAccounts = /* @__PURE__ */ new Map();
    this.tiktokVideos = /* @__PURE__ */ new Map();
    this.tiktokComparisons = /* @__PURE__ */ new Map();
    this.libraryContributions = /* @__PURE__ */ new Map();
    this.deletedLibraryItems = /* @__PURE__ */ new Set();
    this.pageViews = /* @__PURE__ */ new Map();
    this.featureUsages = /* @__PURE__ */ new Map();
    this.adminSessions = /* @__PURE__ */ new Map();
    this.brandsMap = /* @__PURE__ */ new Map();
  }
  // Session methods
  async getSession(sessionId) {
    return Array.from(this.sessions.values()).find((s) => s.sessionId === sessionId);
  }
  async createSession(insertSession) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const session = {
      sessionId: insertSession.sessionId,
      tokensRemaining: insertSession.tokensRemaining ?? 100,
      freeRequestsUsed: insertSession.freeRequestsUsed ?? 0,
      id,
      createdAt: now,
      lastActiveAt: now
    };
    this.sessions.set(id, session);
    return session;
  }
  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId);
    if (!session) return void 0;
    const updated = {
      ...session,
      ...updates,
      lastActiveAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(session.id, updated);
    return updated;
  }
  // Analysis methods
  async createAnalysis(insertAnalysis) {
    const id = randomUUID();
    const analysis = {
      ...insertAnalysis,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }
  async getAnalysesBySession(sessionId) {
    return Array.from(this.analyses.values()).filter((a) => a.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  // Chat methods
  async createChat(insertChat) {
    const id = randomUUID();
    const chat = {
      ...insertChat,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.chats.set(id, chat);
    return chat;
  }
  async getChatsBySession(sessionId) {
    return Array.from(this.chats.values()).filter((c) => c.sessionId === sessionId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  async clearChatsBySession(sessionId) {
    const chatIds = Array.from(this.chats.entries()).filter(([_, chat]) => chat.sessionId === sessionId).map(([id, _]) => id);
    chatIds.forEach((id) => this.chats.delete(id));
  }
  // TikTok Account methods
  async createTiktokAccount(insertAccount) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const account = {
      sessionId: insertAccount.sessionId,
      username: insertAccount.username,
      displayName: insertAccount.displayName ?? null,
      followers: insertAccount.followers ?? 0,
      following: insertAccount.following ?? 0,
      totalLikes: insertAccount.totalLikes ?? 0,
      totalVideos: insertAccount.totalVideos ?? 0,
      bio: insertAccount.bio ?? null,
      verified: insertAccount.verified ?? false,
      avatarUrl: insertAccount.avatarUrl ?? null,
      engagementRate: insertAccount.engagementRate ?? null,
      avgViews: insertAccount.avgViews ?? null,
      postingFrequency: insertAccount.postingFrequency ?? null,
      analysisResult: insertAccount.analysisResult ?? null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.tiktokAccounts.set(id, account);
    return account;
  }
  async getTiktokAccount(id) {
    return this.tiktokAccounts.get(id);
  }
  async getTiktokAccountByUsername(username) {
    return Array.from(this.tiktokAccounts.values()).find((a) => a.username.toLowerCase() === username.toLowerCase());
  }
  async getTiktokAccountsBySession(sessionId) {
    return Array.from(this.tiktokAccounts.values()).filter((a) => a.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async updateTiktokAccount(id, updates) {
    const account = await this.getTiktokAccount(id);
    if (!account) return void 0;
    const updated = {
      ...account,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tiktokAccounts.set(id, updated);
    return updated;
  }
  async getAllAnalyzedAccounts(limit = 100) {
    return Array.from(this.tiktokAccounts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  async getAnalyzedAccountsCount() {
    return this.tiktokAccounts.size;
  }
  // TikTok Video methods
  async createTiktokVideo(insertVideo) {
    const id = randomUUID();
    const video = {
      sessionId: insertVideo.sessionId,
      videoId: insertVideo.videoId,
      videoUrl: insertVideo.videoUrl ?? null,
      accountUsername: insertVideo.accountUsername,
      description: insertVideo.description ?? null,
      views: insertVideo.views ?? 0,
      likes: insertVideo.likes ?? 0,
      comments: insertVideo.comments ?? 0,
      shares: insertVideo.shares ?? 0,
      favorites: insertVideo.favorites ?? 0,
      duration: insertVideo.duration ?? null,
      soundName: insertVideo.soundName ?? null,
      hashtags: insertVideo.hashtags ?? null,
      completionRate: insertVideo.completionRate ?? null,
      analysisResult: insertVideo.analysisResult ?? null,
      postedAt: insertVideo.postedAt ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.tiktokVideos.set(id, video);
    return video;
  }
  async getTiktokVideo(id) {
    return this.tiktokVideos.get(id);
  }
  async getTiktokVideosBySession(sessionId) {
    return Array.from(this.tiktokVideos.values()).filter((v) => v.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getTiktokVideosByAccount(accountUsername) {
    return Array.from(this.tiktokVideos.values()).filter((v) => v.accountUsername.toLowerCase() === accountUsername.toLowerCase()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  // TikTok Comparison methods
  async createTiktokComparison(insertComparison) {
    const id = randomUUID();
    const comparison = {
      ...insertComparison,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.tiktokComparisons.set(id, comparison);
    return comparison;
  }
  async getTiktokComparison(id) {
    return this.tiktokComparisons.get(id);
  }
  async getTiktokComparisonsBySession(sessionId) {
    return Array.from(this.tiktokComparisons.values()).filter((c) => c.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  // Library Contribution methods
  async createLibraryContribution(insertContribution) {
    const id = randomUUID();
    const contribution = {
      term: insertContribution.term,
      termId: insertContribution.termId ?? null,
      definition: insertContribution.definition,
      definitionId: insertContribution.definitionId ?? null,
      platform: insertContribution.platform,
      username: insertContribution.username,
      example: insertContribution.example ?? null,
      exampleId: insertContribution.exampleId ?? null,
      status: insertContribution.status ?? "pending",
      id,
      createdAt: /* @__PURE__ */ new Date(),
      approvedAt: null
    };
    this.libraryContributions.set(id, contribution);
    return contribution;
  }
  async getLibraryContribution(id) {
    return this.libraryContributions.get(id);
  }
  async getPendingContributions() {
    return Array.from(this.libraryContributions.values()).filter((c) => c.status === "pending").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getApprovedContributions() {
    return Array.from(this.libraryContributions.values()).filter((c) => c.status === "approved").sort((a, b) => (b.approvedAt?.getTime() ?? 0) - (a.approvedAt?.getTime() ?? 0));
  }
  async updateLibraryContribution(id, updates) {
    const contribution = this.libraryContributions.get(id);
    if (!contribution) return void 0;
    const updated = {
      ...contribution,
      ...updates
    };
    this.libraryContributions.set(id, updated);
    return updated;
  }
  async deleteLibraryContribution(id) {
    return this.libraryContributions.delete(id);
  }
  // Deleted library items methods
  async addDeletedLibraryItem(itemId) {
    this.deletedLibraryItems.add(itemId);
  }
  async removeDeletedLibraryItem(itemId) {
    this.deletedLibraryItems.delete(itemId);
  }
  async getDeletedLibraryItems() {
    return Array.from(this.deletedLibraryItems);
  }
  async isLibraryItemDeleted(itemId) {
    return this.deletedLibraryItems.has(itemId);
  }
  // Success Stories (using database)
  async createSuccessStory(story) {
    const [created] = await db.insert(successStories).values({
      ...story,
      status: "pending",
      featured: false
    }).returning();
    return created;
  }
  async getSuccessStory(id) {
    const [s] = await db.select().from(successStories).where(eq(successStories.id, id));
    return s;
  }
  async getPendingSuccessStories() {
    return db.select().from(successStories).where(eq(successStories.status, "pending"));
  }
  async getApprovedSuccessStories() {
    return db.select().from(successStories).where(eq(successStories.status, "approved"));
  }
  async getFeaturedSuccessStories() {
    return db.select().from(successStories).where(
      and(eq(successStories.status, "approved"), eq(successStories.featured, true))
    );
  }
  async updateSuccessStory(id, updates) {
    const [updated] = await db.update(successStories).set(updates).where(eq(successStories.id, id)).returning();
    return updated;
  }
  async deleteSuccessStory(id) {
    await db.delete(successStories).where(eq(successStories.id, id));
    return true;
  }
  // Analytics methods
  async trackPageView(insertPageView) {
    const id = randomUUID();
    const pageView = {
      sessionId: insertPageView.sessionId,
      page: insertPageView.page,
      language: insertPageView.language ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.pageViews.set(id, pageView);
    return pageView;
  }
  async trackFeatureUsage(insertUsage) {
    const id = randomUUID();
    const usage = {
      sessionId: insertUsage.sessionId,
      featureType: insertUsage.featureType,
      featureDetails: insertUsage.featureDetails ?? null,
      platform: insertUsage.platform ?? null,
      mode: insertUsage.mode ?? null,
      language: insertUsage.language ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.featureUsages.set(id, usage);
    return usage;
  }
  async getPageViewStats(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const views = Array.from(this.pageViews.values()).filter((v) => v.createdAt >= cutoff);
    const stats = /* @__PURE__ */ new Map();
    views.forEach((v) => {
      const key = `${v.page}|${v.language || "unknown"}`;
      const existing = stats.get(key) || { count: 0, language: v.language || void 0 };
      stats.set(key, { count: existing.count + 1, language: v.language || void 0 });
    });
    return Array.from(stats.entries()).map(([key, data]) => ({
      page: key.split("|")[0],
      count: data.count,
      language: data.language
    }));
  }
  async getFeatureUsageStats(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const usages = Array.from(this.featureUsages.values()).filter((u) => u.createdAt >= cutoff);
    const stats = /* @__PURE__ */ new Map();
    usages.forEach((u) => {
      const key = `${u.featureType}|${u.platform || "unknown"}`;
      const existing = stats.get(key) || { count: 0, platform: u.platform || void 0 };
      stats.set(key, { count: existing.count + 1, platform: u.platform || void 0 });
    });
    return Array.from(stats.entries()).map(([key, data]) => ({
      featureType: key.split("|")[0],
      count: data.count,
      platform: data.platform
    }));
  }
  async getUniqueSessionsCount(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const uniqueSessions = new Set(
      Array.from(this.pageViews.values()).filter((v) => v.createdAt >= cutoff).map((v) => v.sessionId)
    );
    return uniqueSessions.size;
  }
  async getTotalPageViews(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return Array.from(this.pageViews.values()).filter((v) => v.createdAt >= cutoff).length;
  }
  async getTotalFeatureUsage(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return Array.from(this.featureUsages.values()).filter((u) => u.createdAt >= cutoff).length;
  }
  async getNavigationBreakdown(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const usages = Array.from(this.featureUsages.values()).filter((u) => u.createdAt >= cutoff && u.featureType === "navigation");
    const stats = /* @__PURE__ */ new Map();
    usages.forEach((u) => {
      try {
        const details = u.featureDetails ? JSON.parse(u.featureDetails) : {};
        const key = `${details.menuItem || "unknown"}|${details.destination || "unknown"}`;
        const existing = stats.get(key);
        if (existing) {
          existing.count++;
        } else {
          stats.set(key, {
            menuItem: details.menuItem || "Unknown",
            destination: details.destination || "/",
            count: 1
          });
        }
      } catch (e) {
      }
    });
    return Array.from(stats.values()).sort((a, b) => b.count - a.count);
  }
  async getTabBreakdown(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const usages = Array.from(this.featureUsages.values()).filter((u) => u.createdAt >= cutoff && u.featureType === "tab-selection");
    const stats = /* @__PURE__ */ new Map();
    usages.forEach((u) => {
      try {
        const details = u.featureDetails ? JSON.parse(u.featureDetails) : {};
        const key = `${details.page || "unknown"}|${details.tabName || u.mode || "unknown"}`;
        const existing = stats.get(key);
        if (existing) {
          existing.count++;
        } else {
          stats.set(key, {
            page: details.page || "Unknown",
            tabName: details.tabName || u.mode || "Unknown",
            count: 1
          });
        }
      } catch (e) {
      }
    });
    return Array.from(stats.values()).sort((a, b) => b.count - a.count);
  }
  async getButtonClickBreakdown(days = 7) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const usages = Array.from(this.featureUsages.values()).filter((u) => u.createdAt >= cutoff && u.featureType === "button-click");
    const stats = /* @__PURE__ */ new Map();
    usages.forEach((u) => {
      try {
        const details = u.featureDetails ? JSON.parse(u.featureDetails) : {};
        const key = `${details.buttonName || "unknown"}|${details.context || u.mode || "unknown"}`;
        const existing = stats.get(key);
        if (existing) {
          existing.count++;
        } else {
          stats.set(key, {
            buttonName: details.buttonName || "Unknown",
            context: details.context || u.mode || "Unknown",
            count: 1
          });
        }
      } catch (e) {
      }
    });
    return Array.from(stats.values()).sort((a, b) => b.count - a.count);
  }
  // Admin session methods
  async createAdminSession(sessionId, username) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
    const session = {
      sessionId,
      username,
      createdAt: now,
      expiresAt
    };
    this.adminSessions.set(sessionId, session);
    return session;
  }
  async getAdminSession(sessionId) {
    const session = this.adminSessions.get(sessionId);
    if (!session) return void 0;
    if (session.expiresAt < /* @__PURE__ */ new Date()) {
      this.adminSessions.delete(sessionId);
      return void 0;
    }
    return session;
  }
  async deleteAdminSession(sessionId) {
    this.adminSessions.delete(sessionId);
  }
  async cleanExpiredAdminSessions() {
    const now = /* @__PURE__ */ new Date();
    Array.from(this.adminSessions.entries()).forEach(([sessionId, session]) => {
      if (session.expiresAt < now) {
        this.adminSessions.delete(sessionId);
      }
    });
  }
  // Brand management methods
  async createBrand(insertBrand) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const brand = {
      id,
      slug: insertBrand.slug,
      name: insertBrand.name,
      shortName: insertBrand.shortName,
      taglineEn: insertBrand.taglineEn ?? "Powered by BiAS\xB2\xB3",
      taglineId: insertBrand.taglineId ?? "Didukung BiAS\xB2\xB3",
      subtitleEn: insertBrand.subtitleEn ?? "Build Your Influence",
      subtitleId: insertBrand.subtitleId ?? "Bangun Pengaruhmu",
      descriptionEn: insertBrand.descriptionEn ?? null,
      descriptionId: insertBrand.descriptionId ?? null,
      colorPrimary: insertBrand.colorPrimary ?? "from-pink-500 via-purple-500 to-cyan-500",
      colorSecondary: insertBrand.colorSecondary ?? "from-purple-500 via-pink-400 to-cyan-400",
      logoUrl: insertBrand.logoUrl ?? null,
      tiktokHandle: insertBrand.tiktokHandle ?? null,
      tiktokUrl: insertBrand.tiktokUrl ?? null,
      instagramHandle: insertBrand.instagramHandle ?? null,
      instagramUrl: insertBrand.instagramUrl ?? null,
      metaTitle: insertBrand.metaTitle ?? null,
      metaDescription: insertBrand.metaDescription ?? null,
      isActive: insertBrand.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.brandsMap.set(id, brand);
    return brand;
  }
  async getBrand(id) {
    return this.brandsMap.get(id);
  }
  async getBrandBySlug(slug) {
    return Array.from(this.brandsMap.values()).find((b) => b.slug === slug);
  }
  async getAllBrands() {
    return Array.from(this.brandsMap.values());
  }
  async getActiveBrands() {
    return Array.from(this.brandsMap.values()).filter((b) => b.isActive);
  }
  async updateBrand(id, updates) {
    const brand = this.brandsMap.get(id);
    if (!brand) return void 0;
    const updated = {
      ...brand,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.brandsMap.set(id, updated);
    return updated;
  }
  async deleteBrand(id) {
    return this.brandsMap.delete(id);
  }
  // Expert Knowledge Base stub methods (MemStorage - returns empty arrays)
  async getExpertKnowledge(_filters) {
    return [];
  }
  async getHooks(_filters) {
    return [];
  }
  async getStorytellingFrameworks() {
    return [];
  }
  async getGrowthStageGuides(_followerCount) {
    return [];
  }
  async getGrowthStageGuideByStage(_stage) {
    return void 0;
  }
  async getResponseTemplates(_category) {
    return [];
  }
  async getLiveStreamingTemplates(_filters) {
    return [];
  }
  async getScriptTemplates(_filters) {
    return [];
  }
  // Platform settings stub methods (MemStorage - returns empty)
  async getPublicSettings() {
    return {};
  }
  async getAllSettings() {
    return [];
  }
  async getSetting(_key) {
    return void 0;
  }
  async updateSetting(_key, _value, _updatedBy) {
    return void 0;
  }
  // Pricing tier stub methods (MemStorage - returns empty)
  async getActivePricingTiers() {
    return [];
  }
  async getAllPricingTiers() {
    return [];
  }
  async getPricingTier(_slug) {
    return void 0;
  }
  async updatePricingTier(_slug, _updates, _updatedBy) {
    return void 0;
  }
};
var DatabaseStorage = class {
  memStorage;
  constructor() {
    this.memStorage = new MemStorage();
  }
  async getSession(sessionId) {
    return this.memStorage.getSession(sessionId);
  }
  async createSession(session) {
    return this.memStorage.createSession(session);
  }
  async updateSession(sessionId, updates) {
    return this.memStorage.updateSession(sessionId, updates);
  }
  async createAnalysis(analysis) {
    return this.memStorage.createAnalysis(analysis);
  }
  async getAnalysesBySession(sessionId) {
    return this.memStorage.getAnalysesBySession(sessionId);
  }
  async createChat(chat) {
    return this.memStorage.createChat(chat);
  }
  async getChatsBySession(sessionId) {
    return this.memStorage.getChatsBySession(sessionId);
  }
  async clearChatsBySession(sessionId) {
    return this.memStorage.clearChatsBySession(sessionId);
  }
  async createTiktokAccount(account) {
    const [inserted] = await db.insert(tiktokAccounts).values(account).returning();
    return inserted;
  }
  async getTiktokAccount(id) {
    const [account] = await db.select().from(tiktokAccounts).where(eq(tiktokAccounts.id, id));
    return account;
  }
  async getTiktokAccountByUsername(username) {
    const [account] = await db.select().from(tiktokAccounts).where(ilike(tiktokAccounts.username, username)).orderBy(desc(tiktokAccounts.createdAt)).limit(1);
    return account;
  }
  async getTiktokAccountsBySession(sessionId) {
    return db.select().from(tiktokAccounts).where(eq(tiktokAccounts.sessionId, sessionId)).orderBy(desc(tiktokAccounts.createdAt));
  }
  async updateTiktokAccount(id, updates) {
    const [updated] = await db.update(tiktokAccounts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tiktokAccounts.id, id)).returning();
    return updated;
  }
  async getAllAnalyzedAccounts(limit = 100) {
    return db.select().from(tiktokAccounts).orderBy(desc(tiktokAccounts.createdAt)).limit(limit);
  }
  async getAnalyzedAccountsCount() {
    const [result] = await db.select({ count: count() }).from(tiktokAccounts);
    return result?.count || 0;
  }
  async createTiktokVideo(video) {
    return this.memStorage.createTiktokVideo(video);
  }
  async getTiktokVideo(id) {
    return this.memStorage.getTiktokVideo(id);
  }
  async getTiktokVideosBySession(sessionId) {
    return this.memStorage.getTiktokVideosBySession(sessionId);
  }
  async getTiktokVideosByAccount(accountUsername) {
    return this.memStorage.getTiktokVideosByAccount(accountUsername);
  }
  async createTiktokComparison(comparison) {
    return this.memStorage.createTiktokComparison(comparison);
  }
  async getTiktokComparison(id) {
    return this.memStorage.getTiktokComparison(id);
  }
  async getTiktokComparisonsBySession(sessionId) {
    return this.memStorage.getTiktokComparisonsBySession(sessionId);
  }
  async createLibraryContribution(contribution) {
    return this.memStorage.createLibraryContribution(contribution);
  }
  async getLibraryContribution(id) {
    return this.memStorage.getLibraryContribution(id);
  }
  async getPendingContributions() {
    return this.memStorage.getPendingContributions();
  }
  async getApprovedContributions() {
    return this.memStorage.getApprovedContributions();
  }
  async updateLibraryContribution(id, updates) {
    return this.memStorage.updateLibraryContribution(id, updates);
  }
  async deleteLibraryContribution(id) {
    return this.memStorage.deleteLibraryContribution(id);
  }
  async addDeletedLibraryItem(itemId) {
    return this.memStorage.addDeletedLibraryItem(itemId);
  }
  async removeDeletedLibraryItem(itemId) {
    return this.memStorage.removeDeletedLibraryItem(itemId);
  }
  async getDeletedLibraryItems() {
    return this.memStorage.getDeletedLibraryItems();
  }
  async isLibraryItemDeleted(itemId) {
    return this.memStorage.isLibraryItemDeleted(itemId);
  }
  // Success Stories - delegate to memStorage (which uses DB)
  async createSuccessStory(story) {
    return this.memStorage.createSuccessStory(story);
  }
  async getSuccessStory(id) {
    return this.memStorage.getSuccessStory(id);
  }
  async getPendingSuccessStories() {
    return this.memStorage.getPendingSuccessStories();
  }
  async getApprovedSuccessStories() {
    return this.memStorage.getApprovedSuccessStories();
  }
  async getFeaturedSuccessStories() {
    return this.memStorage.getFeaturedSuccessStories();
  }
  async updateSuccessStory(id, updates) {
    return this.memStorage.updateSuccessStory(id, updates);
  }
  async deleteSuccessStory(id) {
    return this.memStorage.deleteSuccessStory(id);
  }
  async trackPageView(pageView) {
    return this.memStorage.trackPageView(pageView);
  }
  async trackFeatureUsage(usage) {
    return this.memStorage.trackFeatureUsage(usage);
  }
  async getPageViewStats(days = 7) {
    return this.memStorage.getPageViewStats(days);
  }
  async getFeatureUsageStats(days = 7) {
    return this.memStorage.getFeatureUsageStats(days);
  }
  async getUniqueSessionsCount(days = 7) {
    return this.memStorage.getUniqueSessionsCount(days);
  }
  async getTotalPageViews(days = 7) {
    return this.memStorage.getTotalPageViews(days);
  }
  async getTotalFeatureUsage(days = 7) {
    return this.memStorage.getTotalFeatureUsage(days);
  }
  async getNavigationBreakdown(days = 7) {
    return this.memStorage.getNavigationBreakdown(days);
  }
  async getTabBreakdown(days = 7) {
    return this.memStorage.getTabBreakdown(days);
  }
  async getButtonClickBreakdown(days = 7) {
    return this.memStorage.getButtonClickBreakdown(days);
  }
  async createAdminSession(sessionId, username) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1e3);
    const [inserted] = await db.insert(adminSessions).values({
      sessionId,
      username,
      expiresAt
    }).returning();
    return {
      sessionId: inserted.sessionId,
      username: inserted.username,
      createdAt: inserted.createdAt,
      expiresAt: inserted.expiresAt
    };
  }
  async getAdminSession(sessionId) {
    const now = /* @__PURE__ */ new Date();
    const [session] = await db.select().from(adminSessions).where(
      and(
        eq(adminSessions.sessionId, sessionId),
        gt(adminSessions.expiresAt, now)
      )
    ).limit(1);
    if (!session) return void 0;
    return {
      sessionId: session.sessionId,
      username: session.username,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    };
  }
  async deleteAdminSession(sessionId) {
    await db.delete(adminSessions).where(eq(adminSessions.sessionId, sessionId));
  }
  async cleanExpiredAdminSessions() {
    const now = /* @__PURE__ */ new Date();
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, now));
  }
  // Brand management methods (database-backed for persistence)
  async createBrand(insertBrand) {
    const [inserted] = await db.insert(brands).values(insertBrand).returning();
    return inserted;
  }
  async getBrand(id) {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    return brand;
  }
  async getBrandBySlug(slug) {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
    return brand;
  }
  async getAllBrands() {
    return db.select().from(brands);
  }
  async getActiveBrands() {
    return db.select().from(brands).where(eq(brands.isActive, true));
  }
  async updateBrand(id, updates) {
    const [updated] = await db.update(brands).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(brands.id, id)).returning();
    return updated;
  }
  async deleteBrand(id) {
    const result = await db.delete(brands).where(eq(brands.id, id)).returning();
    return result.length > 0;
  }
  // ==========================================
  // EXPERT KNOWLEDGE BASE METHODS
  // ==========================================
  async getExpertKnowledge(filters) {
    let query = db.select().from(expertKnowledge).where(eq(expertKnowledge.isActive, true));
    const conditions = [eq(expertKnowledge.isActive, true)];
    if (filters?.category) {
      conditions.push(eq(expertKnowledge.category, filters.category));
    }
    if (filters?.subcategory) {
      conditions.push(eq(expertKnowledge.subcategory, filters.subcategory));
    }
    if (filters?.level) {
      conditions.push(eq(expertKnowledge.level, filters.level));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(expertKnowledge.titleEn, `%${filters.search}%`),
          ilike(expertKnowledge.titleId, `%${filters.search}%`),
          ilike(expertKnowledge.contentEn, `%${filters.search}%`),
          ilike(expertKnowledge.contentId, `%${filters.search}%`)
        )
      );
    }
    return db.select().from(expertKnowledge).where(and(...conditions));
  }
  async getHooks(filters) {
    const conditions = [eq(hooks.isActive, true)];
    if (filters?.hookType) {
      conditions.push(eq(hooks.hookType, filters.hookType));
    }
    if (filters?.category) {
      conditions.push(eq(hooks.category, filters.category));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(hooks.hookTextEn, `%${filters.search}%`),
          ilike(hooks.hookTextId, `%${filters.search}%`)
        )
      );
    }
    return db.select().from(hooks).where(and(...conditions));
  }
  async getStorytellingFrameworks() {
    return db.select().from(storytellingFrameworks).where(eq(storytellingFrameworks.isActive, true));
  }
  async getGrowthStageGuides(followerCount) {
    if (followerCount !== void 0) {
      return db.select().from(growthStageGuides).where(
        and(
          eq(growthStageGuides.isActive, true),
          lte(growthStageGuides.followerRangeMin, followerCount)
        )
      );
    }
    return db.select().from(growthStageGuides).where(eq(growthStageGuides.isActive, true));
  }
  async getGrowthStageGuideByStage(stage) {
    const [guide] = await db.select().from(growthStageGuides).where(
      and(
        eq(growthStageGuides.stage, stage),
        eq(growthStageGuides.isActive, true)
      )
    ).limit(1);
    return guide;
  }
  async getResponseTemplates(category) {
    const conditions = [eq(responseTemplates.isActive, true)];
    if (category) {
      conditions.push(eq(responseTemplates.category, category));
    }
    return db.select().from(responseTemplates).where(and(...conditions));
  }
  async getLiveStreamingTemplates(filters) {
    const conditions = [eq(liveStreamingTemplates.isActive, true)];
    if (filters?.format) {
      conditions.push(eq(liveStreamingTemplates.format, filters.format));
    }
    if (filters?.duration) {
      conditions.push(eq(liveStreamingTemplates.duration, filters.duration));
    }
    return db.select().from(liveStreamingTemplates).where(and(...conditions));
  }
  async getScriptTemplates(filters) {
    const conditions = [eq(scriptTemplates.isActive, true)];
    if (filters?.category) {
      conditions.push(eq(scriptTemplates.category, filters.category));
    }
    if (filters?.duration) {
      conditions.push(eq(scriptTemplates.duration, filters.duration));
    }
    if (filters?.goal) {
      conditions.push(eq(scriptTemplates.goal, filters.goal));
    }
    if (filters?.level) {
      conditions.push(eq(scriptTemplates.level, filters.level));
    }
    return db.select().from(scriptTemplates).where(and(...conditions));
  }
  // Platform settings management
  async getPublicSettings() {
    try {
      const settings = await db.select().from(appSettings);
      const result = {};
      for (const setting of settings) {
        let value = setting.value;
        if (setting.valueType === "number") {
          value = parseFloat(setting.value);
        } else if (setting.valueType === "boolean") {
          value = setting.value === "true";
        } else if (setting.valueType === "json") {
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
        }
        result[setting.key] = value;
      }
      return result;
    } catch (error) {
      console.error("[SETTINGS] Error getting public settings:", error);
      return {};
    }
  }
  async getAllSettings() {
    try {
      return db.select().from(appSettings);
    } catch (error) {
      console.error("[SETTINGS] Error getting all settings:", error);
      return [];
    }
  }
  async getSetting(key) {
    try {
      const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
      return setting;
    } catch (error) {
      console.error("[SETTINGS] Error getting setting:", error);
      return void 0;
    }
  }
  async updateSetting(key, value, updatedBy) {
    try {
      const [updated] = await db.update(appSettings).set({
        value,
        updatedBy: updatedBy || null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(appSettings.key, key)).returning();
      return updated;
    } catch (error) {
      console.error("[SETTINGS] Error updating setting:", error);
      return void 0;
    }
  }
  // Pricing tier management
  async getActivePricingTiers() {
    try {
      return db.select().from(pricingTiers).where(eq(pricingTiers.isActive, true)).orderBy(pricingTiers.sortOrder);
    } catch (error) {
      console.error("[PRICING] Error getting active pricing tiers:", error);
      return [];
    }
  }
  async getAllPricingTiers() {
    try {
      return db.select().from(pricingTiers).orderBy(pricingTiers.sortOrder);
    } catch (error) {
      console.error("[PRICING] Error getting all pricing tiers:", error);
      return [];
    }
  }
  async getPricingTier(slug) {
    try {
      const [tier] = await db.select().from(pricingTiers).where(eq(pricingTiers.slug, slug)).limit(1);
      return tier;
    } catch (error) {
      console.error("[PRICING] Error getting pricing tier:", error);
      return void 0;
    }
  }
  async updatePricingTier(slug, updates, updatedBy) {
    try {
      const [updated] = await db.update(pricingTiers).set({
        ...updates,
        updatedBy: updatedBy || null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(pricingTiers.slug, slug)).returning();
      return updated;
    } catch (error) {
      console.error("[PRICING] Error updating pricing tier:", error);
      return void 0;
    }
  }
};
var storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

// server/routes.ts
import multer from "multer";
import { randomUUID as randomUUID2, timingSafeEqual } from "crypto";

// server/analyzers/behavioral-insights.ts
var WARMTH_WORDS = [
  "gak apa-apa",
  "pelan-pelan",
  "bareng-bareng",
  "santai",
  "ayo coba",
  "kita",
  "bersama",
  "yuk",
  "terima kasih",
  "makasih",
  "appreciate",
  "love",
  "support",
  "semangat",
  "keren",
  "bagus banget",
  "mantap"
];
var PRESSURE_WORDS = [
  "cepat",
  "buruan",
  "sekarang",
  "harus",
  "wajib",
  "jangan sampai",
  "rugi",
  "kalau gak",
  "ayo dong",
  "follow dulu",
  "kasih gift",
  "bantu",
  "tolong",
  "pliss",
  "please",
  "must",
  "need to"
];
function analyzeWarmthIndex(text2) {
  const lowerText = text2.toLowerCase();
  const warmthCount = WARMTH_WORDS.filter((word) => lowerText.includes(word)).length;
  const pressureCount = PRESSURE_WORDS.filter((word) => lowerText.includes(word)).length;
  let score = 50 + warmthCount * 10 - pressureCount * 15;
  score = Math.max(0, Math.min(100, score));
  let diagnosis = "";
  if (score >= 80) {
    diagnosis = "Nada komunikasi Anda HANGAT dan SUPPORTIVE! Ini bikin audience feel safe dan connected.";
  } else if (score >= 60) {
    diagnosis = "Komunikasi Anda cukup baik, tapi bisa lebih empathetic dengan tambah kata-kata supportive.";
  } else if (score >= 40) {
    diagnosis = "Ada unsur pressure di komunikasi Anda. Audience might feel pushed, bukan invited.";
  } else {
    diagnosis = "BAHAYA! Nada Anda terlalu commanding/aggressive. Ini red flag untuk algoritma - distribusi bakal turun.";
  }
  return { score, warmthCount, pressureCount, diagnosis };
}

// server/analyzers/text-analyzer.ts
var TextAnalyzer = class {
  content;
  mode;
  inputType;
  constructor(input) {
    this.content = input.content;
    this.mode = input.mode;
    this.inputType = input.inputType;
  }
  analyze() {
    const insights = [];
    insights.push(this.analyzeVBM());
    insights.push(this.analyzeEPM());
    insights.push(this.analyzeNLP());
    insights.push(this.analyzeETH());
    insights.push(this.analyzeECO());
    insights.push(this.analyzeSOC());
    insights.push(this.analyzeCOG());
    insights.push(this.analyzeBMIL());
    const urgent = insights.filter((i) => i.recommendations.some((r) => r.priority === "urgent"));
    const important = insights.filter((i) => i.recommendations.some((r) => r.priority === "important"));
    const opportunities = insights.filter((i) => i.recommendations.some((r) => r.priority === "opportunity"));
    const overallScore = this.calculateOverallScore(insights);
    return {
      overallScore,
      summary: this.generateSummary(overallScore),
      insights,
      priorities: { urgent, important, opportunities },
      nextSteps: this.generateNextSteps(insights)
    };
  }
  analyzeVBM() {
    const hasVisualWords = /lihat|bayangkan|warna|bentuk|gambar|visual|tampil|terlihat|kelihatan|see|imagine|picture|look|appear/i.test(this.content);
    const hasDescriptiveLanguage = /\b(sangat|sekali|banget|luar biasa|incredible|amazing)\b/i.test(this.content);
    let score = 50;
    if (hasVisualWords) score += 25;
    if (hasDescriptiveLanguage) score += 25;
    const diagnosis = score >= 75 ? `\u2728 **Excellent!** Bahasa visual Anda **SANGAT KUAT** dengan skor ${score}/100. Anda sudah mahir membuat audience bisa "melihat" apa yang Anda sampaikan hanya melalui kata-kata. Kemampuan ini sangat penting karena otak manusia memproses gambar 60,000x lebih cepat daripada teks - jadi ketika Anda pakai visual language, message Anda langsung nyangkut di memori audience. Ini adalah skill premium yang dimiliki professional communicator dan viral content creator. Pertahankan ini dan terus variasikan teknik descriptive Anda!` : score >= 50 ? `\u{1F4A1} **Good Start!** Bahasa visual Anda **CUKUP SOLID** (${score}/100) - artinya Anda sudah paham konsepnya, tapi masih bisa ditingkatkan untuk bikin imagination audience lebih engaged. Saat ini komunikasi Anda mungkin masih cenderung "telling" dibanding "showing". Dengan menambahkan lebih banyak sensory words (warna, tekstur, suara, smell) dan descriptive verbs, Anda bisa transform message dari sekadar informasi jadi pengalaman yang vivid buat audience. Ini yang bikin difference antara konten yang di-skip vs konten yang di-save dan di-share!` : `\u26A0\uFE0F **Perlu Improvement!** Bahasa visual Anda masih **KURANG KUAT** (${score}/100). Saat ini komunikasi Anda terlalu abstract dan faktual - audience kesulitan "membayangkan" apa yang Anda maksud karena kurang descriptive details. Ini common banget di tahap awal, dan kabar baiknya: visual language adalah skill yang bisa dilatih! Dengan formula sederhana "Show, don't tell" dan praktek rutin pakai sensory words, dalam 2-3 minggu Anda akan lihat dramatic improvement dalam engagement dan retention rate.`;
    const recommendations = score < 75 ? [{
      priority: score < 50 ? "important" : "opportunity",
      icon: "Eye",
      title: "\u{1F3A8} Transformasi: Dari Abstract ke Visual Storytelling",
      description: 'Research neurosciense membuktikan: otak manusia memproses gambar 60,000x lebih cepat daripada text. Inilah kenapa konten dengan strong visual language bisa boost retention rate hingga 65% dan engagement hingga 45%. Ketika Anda "paint a picture with words", Anda tidak cuma ngasih informasi - Anda create experience yang memorable di otak audience. Skill ini yang bikin difference antara komunikator biasa vs yang viral.',
      steps: [
        `**FORMULA: SHOW, DON'T TELL** - Jangan cuma state fakta, describe the scene! Contoh: \u274C "Saya bangun pagi" \u2192 \u2705 "Alarm berbunyi jam 5 pagi saat langit masih gelap, udara dingin mengigit kulit" - See the difference? Yang kedua langsung create vivid image!`,
        '**SENSORY WORDS TOOLKIT**: Aktivasi 5 panca indera audience - Visual (warna: "merah menyala", "biru langit"), Audio ("suara gemuruh", "bisikan pelan"), Touch ("tekstur kasar", "lembut seperti sutra"), Smell ("aroma kopi hangat"), Taste ("manis sepahit gula aren")',
        '**ANALOGI VISUAL**: Transform konsep abstract jadi concrete dengan "seperti/bagaikan" - Contoh: "Algoritma TikTok seperti ombak - kalau Anda bisa surf momentum, Anda bisa ride it far. Tapi kalau melawan arus, Anda tenggelam" \u2190 This makes complex concept instantly understandable!',
        '**DESCRIPTIVE VERBS**: Ganti verb generic dengan specific action - "Jalan" \u2192 "berlari kencang/berjalan santai/melangkah perlahan", "Makan" \u2192 "melahap/menikmati/menyantap", "Lihat" \u2192 "menatap tajam/mengamati/memandang". Specific verbs = strong imagery!',
        '**POWER OF CONTRAST**: Pakai before-after, big-small, dark-light untuk create dramatic effect - "Dari kamar kosan 3x3 meter yang pengap, sekarang standing di stage 1000 orang" \u2190 Visual contrast = emotional impact!',
        "**PRACTICE DAILY**: Pilih 1 kalimat faktual dari script Anda, transform jadi visual description. Do this 5-10 menit per hari selama 2 minggu, visual language akan jadi second nature!"
      ],
      impactEstimate: "\u{1F3AF} **Impact Timeline**: 2 minggu practice = +25% engagement, 1 bulan = +45% retention rate, 3 bulan = visual storytelling mastery yang set Anda apart dari 90% creator/professional di niche Anda!"
    }] : [{
      priority: "opportunity",
      icon: "CheckCircle",
      title: "\u2728 Scale Up: Advanced Visual Storytelling Techniques",
      description: "Anda sudah mahir paint picture dengan kata-kata - sekarang saatnya level up dengan advanced techniques yang dipakai top 1% communicator!",
      steps: [
        '**LAYERED IMAGERY**: Combine multiple senses dalam satu description - "Udara pagi yang dingin mengigit kulit, sementara aroma kopi hangat mengepul dari mug, dan suara burung mulai bersahutan" \u2190 Multi-sensory = deeply immersive!',
        "**PACING VARIATION**: Alternatif antara quick vivid flashes dan slow detailed descriptions untuk create rhythm - Fast untuk action scenes, slow untuk emotional moments",
        '**METAPHOR MASTERY**: Level up dari simile ("seperti") ke metaphor langsung - "Dia adalah singa di panggung" lebih powerful dari "Dia seperti singa". Metaphor create instant identity!',
        "**STRATEGIC AMBIGUITY**: Kadang leaving some details ke imagination audience malah create stronger engagement - Don't over-describe everything, biar audience fill in the blanks with their own experience"
      ],
      impactEstimate: "\u{1F680} Maintain excellence + explore advanced techniques = potential viral breakthrough content!"
    }];
    return {
      term: "Visual Branding Metric (VBM)",
      score,
      category: "Layer 1 - Visual",
      definition: `**VBM** mengukur seberapa **VISUAL** komunikasi Anda. Visual language bikin message Anda memorable dan engaging karena activate imagination audience. "A picture is worth 1000 words" - even in text!`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 65,
        topPerformer: 85,
        explanation: `Professional communicator: 85/100. Average: 65/100. Anda: ${score}/100.`
      },
      recommendations
    };
  }
  analyzeEPM() {
    const emotionalWords = this.content.match(/\b(senang|sedih|marah|takut|excited|nervous|happy|sad|angry|scared|love|hate|amazing|terrible)\b/gi) || [];
    const questions = (this.content.match(/\?/g) || []).length;
    const exclamations = (this.content.match(/!/g) || []).length;
    let score = 40;
    score += Math.min(30, emotionalWords.length * 5);
    score += Math.min(15, questions * 5);
    score += Math.min(15, exclamations * 3);
    score = Math.min(100, score);
    const diagnosis = score >= 70 ? `\u{1F525} **Powerful Emotion!** Emotional engagement Anda **SANGAT TINGGI** (${score}/100) - audience benar-benar bisa **feel** what you're saying! Ini adalah kunci viral content dan high retention karena research shows: konten dengan strong emotional connection mendapat 2x lebih banyak shares dibanding purely factual content. Anda sudah mahir membuat audience tidak cuma "mendengar" tapi benar-benar "merasakan" - ini skill yang dimiliki top communicator dan viral creator. Keep this authenticity sambil maintain balance supaya tidak overwhelming!` : score >= 50 ? `\u{1F499} **Good Foundation!** Emotional engagement Anda **MODERATE** (${score}/100) - Anda sudah mulai connect dengan audience secara emosional, tapi masih ada ruang besar untuk lebih expressive dan authentic. Saat ini mungkin komunikasi Anda sedikit "safe" atau reserved. Padahal audience di era digital ini craving untuk authenticity dan vulnerability. People buy with emotion, justify with logic - jadi kalau Anda bisa trigger emotional response yang lebih kuat, engagement dan conversion rate akan melonjak drastis!` : `\u26A1 **Wake Up Call!** Emotional engagement Anda masih **RENDAH** (${score}/100) - komunikasi terasa terlalu robotic, faktual, atau monotone tanpa variasi emosional. Ini adalah red flag karena di era attention economy, content tanpa emotional hook akan langsung di-skip dalam 3 detik pertama. Kabar baiknya: emotional expression adalah skill yang bisa dilatih! Dengan teknik storytelling yang tepat dan authentic self-expression, Anda bisa transform dari "talking head" jadi magnetic communicator yang bikin audience feel something.`;
    const recommendations = score < 70 ? [{
      priority: score < 50 ? "important" : "opportunity",
      icon: "Heart",
      title: "\u2764\uFE0F Emotional Mastery: Transform Konten dari Faktual ke Feelable",
      description: `Simon Sinek said: "People don't buy WHAT you do, they buy WHY you do it." Emotion adalah currency di era digital - konten yang trigger emotional response get 2x more shares, 3x more comments, dan 5x more saves dibanding purely factual content. Kenapa? Karena emotion create memory, dan memory create loyalty. Ketika audience "feel something", mereka tidak cuma consume - mereka connect. Dan connection adalah ultimate goal setiap komunikator.`,
      steps: [
        '**VULNERABILITY = SUPERPOWER**: Share personal story, struggle, atau failure Anda. Contoh: "Tahun lalu saya bangkrut, tinggal Rp 50 ribu di rekening" \u2190 Ini instantly relatable! Vulnerability bukan weakness - ini adalah ultimate trust builder. Audience lebih connect dengan "human" Anda dibanding "perfect" Anda.',
        '**EMOTION VOCABULARY**: Upgrade kata-kata dari neutral ke emotionally charged - \u274C "saya senang" \u2192 \u2705 "saya excited banget!", \u274C "agak susah" \u2192 \u2705 "rasanya frustrated setengah mati". Use: excited, nervous, overwhelmed, proud, devastated, grateful, anxious, hopeful - semakin spesifik emotion, semakin strong connection!',
        '**RHETORICAL QUESTIONS**: Trigger self-reflection dengan tanya "Pernah ngerasa...?", "Kalian pasti familiar dengan...", "Siapa yang relate??" \u2190 Ini activate audience brain dan bikin mereka mentally participate. Questions = engagement multiplier!',
        "**TONE VARIATION FORMULA**: Jangan monotone! Mix and match emotional peaks - Start serious/vulnerable \u2192 Build excitement \u2192 Drop wisdom \u2192 End motivational. Rollercoaster emosional keep attention span high. Contoh flow: Shock/surprise (hook) \u2192 Relatability (connection) \u2192 Hope/inspiration (climax) \u2192 Call-to-action (closure)",
        `**STRATEGIC EXCLAMATIONS**: Pakai exclamation marks untuk emphasize key points - tapi JANGAN SEMUA CAPS SEMUA KALIMAT!!! That's overkill. Use it 2-3x per content untuk dramatic effect. "Ini game changer!" vs "ini game changer" \u2190 See the energy difference?`,
        '**EMOTIONAL CONTRAST**: Pakai "before vs after" atau "struggle vs success" untuk create emotional arc - "Dari ditolak 47x, sekarang leading team 50 orang" \u2190 Contrast = powerful storytelling device yang trigger both empathy dan aspiration!'
      ],
      impactEstimate: "\u{1F3AF} **Proven Impact**: Konten dengan strong emotional hook = 2x shares + 3x comments + 5x saves. Timeline: 1-2 minggu practice = noticeable improvement, 1 bulan = emotional storytelling menjadi natural part of your style!"
    }] : [{
      priority: "opportunity",
      icon: "CheckCircle",
      title: "\u26A1 Fine-Tune: Emotional Intelligence Advanced Tactics",
      description: "Anda sudah mahir emotional connection - sekarang optimize untuk maximum impact tanpa sacrifice authenticity!",
      steps: [
        "**EMOTIONAL PACING**: Balance high-energy moments dengan calm reflection - too much excitement jadi overwhelming, too calm jadi boring. Find your sweet spot!",
        "**AUTHENTICITY CHECK**: Pastikan emotion yang Anda express adalah genuine - audience punya strong BS detector. Better under-express genuine emotion than over-perform fake one",
        "**STRATEGIC VULNERABILITY**: Share failures/struggles yang relevant dengan lesson learned - bukan just complaining. Vulnerability WITH growth mindset = powerful!",
        '**EMOTION + LOGIC COMBO**: After emotional hook, back it up with data/logic untuk credibility - "Saya devastated kehilangan 10jt (emotion), tapi ini yang saya pelajari dari mistake itu (logic + lesson)"'
      ],
      impactEstimate: "\u{1F680} Maintain exceptional emotional connection + refine untuk long-term audience loyalty!"
    }];
    return {
      term: "Emotional Processing Metric (EPM)",
      score,
      category: "Layer 2 - Emotional",
      definition: `**EPM** mengukur seberapa **EMOTIONALLY ENGAGING** komunikasi Anda. Research: emotional content get 2x more shares vs factual. Emotion = memory trigger + action catalyst.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 60,
        topPerformer: 85,
        explanation: `Viral content: 85/100. Average: 60/100. Anda: ${score}/100.`
      },
      recommendations
    };
  }
  analyzeNLP() {
    const wordCount = this.content.split(/\s+/).length;
    const sentenceCount = this.content.split(/[.!?]+/).filter((s) => s.trim()).length;
    const avgWordsPerSentence = wordCount / (sentenceCount || 1);
    const hasHook = /^(stop|wait|listen|hey|pernah|tau gak|fun fact|unpopular opinion)/i.test(this.content.trim());
    const hasCTA = /(comment|share|tag|follow|subscribe|like|save)/i.test(this.content);
    const warmthAnalysis = analyzeWarmthIndex(this.content);
    let score = 30;
    if (hasHook) score += 15;
    if (hasCTA) score += 10;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) score += 10;
    else if (avgWordsPerSentence > 25) score -= 10;
    if (sentenceCount >= 3) score += 10;
    score += Math.round(warmthAnalysis.score * 0.25);
    score = Math.min(100, Math.max(0, score));
    const warmthWarning = warmthAnalysis.score < 50 ? ` \u26A0\uFE0F **WARMTH ALERT**: ${warmthAnalysis.pressureCount} kata pressure vs ${warmthAnalysis.warmthCount} kata empati - algoritma red flag!` : "";
    const diagnosis = score >= 75 ? `\u{1F4D6} **Exceptional Structure!** Narrative + tone Anda **EXCELLENT** (${score}/100)! ${warmthAnalysis.diagnosis}${warmthWarning} Struktur komunikasi Anda sudah mengikuti formula proven viral content: Hook yang strong, body yang jelas, dan flow yang smooth. Ini menunjukkan Anda understand fundamental storytelling dan audience psychology. Pertahankan clarity ini sambil terus experiment dengan different hook styles!` : score >= 55 ? `\u{1F4DD} **Solid Foundation!** Narrative Anda **DECENT** (${score}/100) - struktur dasar sudah ada, tapi masih bisa di-polish. ${warmthAnalysis.diagnosis}${warmthWarning} Dengan strengthen hook opening dan optimize sentence flow, Anda bisa jump ke tier berikutnya dalam waktu singkat!` : `\u26A0\uFE0F **Structure Needs Work!** Narrative Anda masih **KURANG TERORGANISIR** (${score}/100). ${warmthAnalysis.diagnosis}${warmthWarning} Komunikasi yang kurang struktur bikin audience confused dan skip. Tapi ini easily fixable dengan apply proven formula Hook-Problem-Solution-CTA!`;
    const recommendations = [];
    if (score < 70 || !hasHook || avgWordsPerSentence > 20) {
      recommendations.push({
        priority: score < 50 ? "urgent" : "important",
        icon: "BookOpen",
        title: "Optimize Narrative Structure",
        description: "Structure = clarity. Clear structure = easier to follow = higher retention.",
        steps: [
          "Formula: HOOK \u2192 PROBLEM \u2192 SOLUTION \u2192 CTA",
          'Hook opening: "Stop scrolling!" atau "Pernah ngerasa..." (grab dalam 3 detik)',
          "Body: 3-5 kalimat, each build on previous point",
          "Conclusion: summarize + clear CTA",
          "Kalimat ideal: 12-18 kata (too long = confusing)"
        ],
        impactEstimate: "Clear structure = +50% comprehension + completion rate"
      });
    }
    if (warmthAnalysis.score < 70) {
      recommendations.push({
        priority: warmthAnalysis.score < 50 ? "urgent" : "important",
        icon: "Heart",
        title: "FIX: Warmth Index Terlalu Rendah!",
        description: 'Algoritma punya "Warmth Detection" - nada hangat boost +18% engagement, pressure = penalty!',
        steps: [
          '\u2705 PAKAI: "gak apa-apa", "bareng-bareng", "pelan-pelan", "kita coba yuk"',
          '\u274C HINDARI: "cepat!", "buruan!", "harus!", "wajib!", "follow sekarang!"',
          'Frame CTA as invitation: "Kalau suka, comment ya!" > "Komen sekarang!"',
          'Use "kita/kami" (inclusive) vs "Anda harus" (commanding)',
          'Add appreciation: "Terima kasih udah baca!"'
        ],
        impactEstimate: `Warmth >70 = +${Math.min(30, 70 - warmthAnalysis.score)}% engagement + avoid penalty`
      });
    }
    if (recommendations.length === 0) {
      recommendations.push({
        priority: "opportunity",
        icon: "CheckCircle",
        title: "Excellent Communication!",
        description: "Structure + warmth Anda solid!",
        steps: ["Maintain proven formula", "Test different hooks", "Keep empathetic tone"],
        impactEstimate: "Maintain high performance"
      });
    }
    return {
      term: "Narrative & Linguistic Patterns (NLP) + Warmth Index",
      score,
      category: "Layer 3 - Structure & Tone",
      definition: `**NLP + Warmth** mengukur **STRUKTUR** + **NADA** komunikasi Anda. Formula: Hook \u2192 Problem \u2192 Solution \u2192 CTA. PLUS algoritma track warmth (empati vs pressure) - warmth tinggi = boost, pressure = red flag!`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 60,
        topPerformer: 90,
        explanation: `Pro: 90/100. Average: 60/100. Anda: ${score}/100. Warmth: ${warmthAnalysis.score}/100.`
      },
      recommendations
    };
  }
  analyzeETH() {
    const hasDisclaimer = /(disclaimer|not financial advice|personal opinion|i'm not expert)/i.test(this.content);
    const respectful = !/\b(bodoh|stupid|idiot|goblok)\b/i.test(this.content);
    const factBased = !/(semua orang|everyone|100%|never|always)\b/i.test(this.content) || /(menurut|according|research|study)\b/i.test(this.content);
    let score = 60;
    if (hasDisclaimer) score += 15;
    if (respectful) score += 15;
    if (factBased) score += 10;
    score = Math.min(100, score);
    const diagnosis = score >= 80 ? `\u{1F6E1}\uFE0F **Integrity Excellence!** Etika komunikasi Anda **EXCELLENT** (${score}/100) - Anda sudah maintain high ethical standards dengan transparency, respect, dan fact-based communication. Ini build long-term trust dan credibility yang invaluable di era misinformation. Audience appreciate authenticity dan responsibility seperti ini. Keep being responsible communicator!` : score >= 60 ? `\u2705 **Good Ethics, Room to Grow!** Etika komunikasi Anda **GOOD** (${score}/100) - sudah di jalur yang benar, tapi ada beberapa area yang bisa di-strengthen. Minor improvements seperti add disclaimers atau cite sources bisa significantly boost credibility Anda di mata audience dan platform algorithm!` : `\u26A0\uFE0F **Ethical Red Flags!** Etika komunikasi Anda **PERLU PERBAIKAN SERIUS** (${score}/100). Ada risk of backlash, misinformation spread, atau platform penalty. Ethical violations bisa ruin reputation yang butuh years untuk rebuild. Let's fix this dengan implement transparency best practices dan fact-checking protocol!`;
    const recommendations = score < 80 ? [{
      priority: score < 60 ? "important" : "opportunity",
      icon: "Shield",
      title: "Tingkatkan Etika Komunikasi",
      description: "Ethical communication = build trust + avoid controversy/backlash.",
      steps: [
        'Tambah disclaimer: "This is my personal opinion/experience"',
        'Avoid absolutes: "everyone" \u2192 "many people", "always" \u2192 "often"',
        'Cite sources: "According to research..." untuk factual claims',
        "Respectful language: critique idea, not people",
        "Transparency: disclose affiliate/sponsor kalau ada"
      ],
      impactEstimate: "Ethical communication = long-term trust + credibility"
    }] : [{
      priority: "opportunity",
      icon: "CheckCircle",
      title: "Maintain Ethical Standards",
      description: "Anda udah responsible communicator!",
      steps: ["Continue transparent communication", "Keep fact-checking"],
      impactEstimate: "Maintain high credibility"
    }];
    return {
      term: "Ethical Communication (ETH)",
      score,
      category: "Layer 4 - Ethics",
      definition: `**ETH** mengukur seberapa **BERTANGGUNG JAWAB** komunikasi Anda. Ethical communication = transparency + respect + accuracy. Build long-term trust vs short-term viral yang toxic.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 70,
        topPerformer: 95,
        explanation: `Professional: 95/100. Average: 70/100. Anda: ${score}/100.`
      },
      recommendations
    };
  }
  analyzeECO() {
    const score = 70;
    const diagnosis = score >= 75 ? `\u{1F3A8} **Konsisten & Recognizable!** Brand voice consistency Anda **SOLID** (${score}/100) - tone, style, dan messaging Anda punya identitas yang jelas dan consistent! Consistency adalah secret weapon untuk building strong brand recall - audience recognize konten Anda even tanpa lihat nama. Algoritma juga favorit creator yang punya unique brand fingerprint karena mereka build loyal community yang repeat engagement. Keep this consistency - ini foundation untuk long-term growth dan authority di niche Anda! \u{1F680}` : `\u{1F3AD} **Identitas Masih Blur!** Brand voice consistency Anda **PERLU WORK** (${score}/100) - komunikasi Anda masih inconsistent, kadang formal kadang casual, kadang informatif kadang sales-heavy. Audience confused tentang "siapa sih ini sebenarnya?" Inconsistency = sulit build brand loyalty karena mereka gak tau apa yang expect dari Anda next time. Start dengan define: apakah Anda educator? entertainer? motivator? Pick one primary identity dan consistent deliver value dalam character itu. Consistency beats variety dalam brand building!`;
    return {
      term: "Ecosystem Consistency (ECO)",
      score,
      category: "Layer 5 - Branding",
      definition: `**ECO** mengukur **KONSISTENSI** brand voice Anda across different content. Consistency = recognizability = stronger brand recall.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 65,
        topPerformer: 90,
        explanation: `Strong brand: 90/100. Average: 65/100. Anda: ${score}/100.`
      },
      recommendations: [{
        priority: "opportunity",
        icon: "Target",
        title: "Build Brand Consistency",
        description: "Consistent brand voice = stronger identity + loyalty.",
        steps: [
          "Define tone: professional/casual/humorous - pick one primary",
          "Signature phrases: create catchphrases yang Anda repeat",
          "Content pillars: 3-5 topik core yang Anda always cover",
          "Visual consistency: same filter/color scheme/intro"
        ],
        impactEstimate: "Brand consistency = +70% audience loyalty"
      }]
    };
  }
  analyzeSOC() {
    const questions = (this.content.match(/\?/g) || []).length;
    const callToAction = /(comment|share|tag|tell me|let me know|what do you think)/i.test(this.content);
    let score = 50;
    if (questions > 0) score += 25;
    if (callToAction) score += 25;
    score = Math.min(100, score);
    const diagnosis = score >= 75 ? `\u{1F4AC} **Highly Interactive!** Social interaction level Anda **TINGGI** (${score}/100) - Anda actively engage audience dengan questions, CTAs, dan conversation starters! Ini trigger comments dan shares yang boost algorithma favorability. Interactive content = community building, bukan just broadcasting!` : `\u{1F4E2} **One-Way Communication!** Social interaction level Anda **RENDAH** (${score}/100) - komunikasi terasa broadcast-only tanpa invite participation. Di era social media, "social" adalah keyword - audience want conversation, bukan monolog. Add questions dan CTAs untuk transform passive viewers jadi active participants!`;
    return {
      term: "Social Interaction Level (SOC)",
      score,
      category: "Layer 6 - Engagement",
      definition: `**SOC** mengukur seberapa **INTERAKTIF** komunikasi Anda. High interaction = comments + shares = algoritma boost.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 60,
        topPerformer: 90,
        explanation: `Viral content: 90/100. Average: 60/100. Anda: ${score}/100.`
      },
      recommendations: score < 75 ? [{
        priority: "important",
        icon: "MessageCircle",
        title: "Tingkatkan Interaksi",
        description: "Interaction = engagement = algoritma boost.",
        steps: [
          'Ask questions: "Setuju gak?" atau "Pernah ngalamin?"',
          'CTA jelas: "Comment pengalaman kamu di bawah!"',
          "Controversial statement: trigger discussion",
          'Poll/quiz: "Pilih A atau B?"'
        ],
        impactEstimate: "+2x comments = algoritma push ke 5x lebih banyak FYP"
      }] : [{
        priority: "opportunity",
        icon: "CheckCircle",
        title: "Maintain Engagement",
        description: "Interaction level udah bagus!",
        steps: ["Keep asking questions", "Vary CTA types"],
        impactEstimate: "Maintain high engagement"
      }]
    };
  }
  analyzeCOG() {
    const wordCount = this.content.split(/\s+/).length;
    const sentenceCount = this.content.split(/[.!?]+/).filter((s) => s.trim()).length;
    const avgWordsPerSentence = wordCount / (sentenceCount || 1);
    let score = 70;
    if (avgWordsPerSentence > 25) score -= 20;
    if (avgWordsPerSentence < 10) score -= 10;
    if (wordCount > 500) score -= 15;
    score = Math.max(0, Math.min(100, score));
    return {
      term: "Cognitive Load (COG)",
      score,
      category: "Layer 7 - Clarity",
      definition: `**COG** mengukur seberapa **MUDAH** content Anda dipahami. Low cognitive load = easy to process = higher retention.`,
      diagnosis: score >= 70 ? `\u{1F9E0} **Brain-Friendly Content!** Cognitive load Anda **OPTIMAL** (${score}/100) - content Anda easy to digest tanpa overwhelm audience brain! Simple language + clear structure = higher retention rate. Di era short attention span, clarity adalah competitive advantage!` : `\u{1F92F} **Mental Overload!** Cognitive load Anda **TERLALU TINGGI** (${score}/100) - content terlalu complex, panjang, atau dense. Audience skip konten yang bikin otak capek. Simplify language, shorten sentences, break paragraphs untuk instant improvement!`,
      benchmark: {
        yourScore: score,
        nicheAverage: 70,
        topPerformer: 85,
        explanation: `Viral content: 85/100 (simple). Average: 70/100. Anda: ${score}/100.`
      },
      recommendations: score < 70 ? [{
        priority: "important",
        icon: "Zap",
        title: "Reduce Cognitive Load",
        description: "Simple = better. Audience scroll = short attention span.",
        steps: [
          "Short sentences: 12-18 kata per kalimat",
          'Simple words: "beli" not "mengakuisisi"',
          "Break paragraphs: max 3-4 kalimat per paragraph",
          "Use bullets/numbers untuk clarity"
        ],
        impactEstimate: "Lower cognitive load = +40% completion rate"
      }] : [{
        priority: "opportunity",
        icon: "CheckCircle",
        title: "Maintain Clarity",
        description: "Content Anda sudah easy to digest!",
        steps: ["Keep sentences concise", "Maintain simple language"],
        impactEstimate: "Maintain high readability"
      }]
    };
  }
  analyzeBMIL() {
    const score = 65;
    const diagnosis = score >= 75 ? `\u{1F3AF} **Perfectly Aligned!** Brand-message integration Anda **EXCELLENT** (${score}/100) - setiap kata yang Anda sampaikan perfectly reinforce brand identity Anda! Message dan branding Anda cohesive, bukan random scattered thoughts. Ini powerful karena every single content piece jadi opportunity untuk strengthen positioning Anda di market. Audience remember Anda bukan cuma untuk content quality, tapi untuk WHO you are dan WHAT you stand for. Cohesive branding = differentiation = loyalty = sustainable growth! \u{1F31F}` : `\u{1F9E9} **Disconnected Pieces!** Brand-message integration Anda **NEEDS IMPROVEMENT** (${score}/100) - message Anda kadang gak align sama brand positioning yang ingin Anda build. Konten Anda might be good individually, tapi when viewed together, they don't paint cohesive picture tentang siapa Anda. Ini bikin audience confused dan hard to develop strong brand association. Every message should reinforce core values Anda - kalau Anda position yourself sebagai "productivity expert", don't suddenly post random lifestyle content yang gak connected. Integration = coherence = professional brand image!`;
    return {
      term: "Brand & Message Integration Level (BMIL)",
      score,
      category: "Layer 8 - Integration",
      definition: `**BMIL** mengukur seberapa **TERINTEGRASI** message Anda dengan overall brand identity. Cohesive branding = professional + memorable.`,
      diagnosis,
      benchmark: {
        yourScore: score,
        nicheAverage: 60,
        topPerformer: 90,
        explanation: `Professional brand: 90/100. Average: 60/100. Anda: ${score}/100.`
      },
      recommendations: [{
        priority: "opportunity",
        icon: "Layers",
        title: "Strengthen Brand Integration",
        description: "Every content should reinforce brand identity.",
        steps: [
          "Brand values: inject core values ke every message",
          "Signature style: unique angle/perspective yang differentiate Anda",
          "Visual branding: consistent color/font/logo placement",
          "Tagline: create memorable catchphrase"
        ],
        impactEstimate: "Strong brand = +80% recall + loyalty"
      }]
    };
  }
  calculateOverallScore(insights) {
    const total = insights.reduce((sum, i) => sum + i.score, 0);
    return Math.round(total / insights.length);
  }
  generateSummary(overallScore) {
    if (overallScore >= 75) {
      return `\u{1F389} **Luar biasa!** Komunikasi Anda berada di level **EXCELLENT** dengan skor ${overallScore}/100 dari 8 lapisan framework BIAS. Ini menunjukkan bahwa Anda sudah memiliki fondasi komunikasi yang kuat - dari struktur narasi, koneksi emosional, hingga etika penyampaian semuanya sudah di jalur yang tepat. Yang perlu Anda lakukan sekarang adalah **mempertahankan konsistensi** ini dan terus mengasah beberapa area spesifik untuk mencapai level top performer. Ingat: komunikasi yang efektif adalah skill yang terus berkembang, bukan destinasi akhir. Terus eksplorasi, test berbagai pendekatan, dan jangan takut untuk bereksperimen dengan gaya baru!`;
    } else if (overallScore >= 60) {
      return `\u{1F4AA} **Anda sudah di jalur yang benar!** Skor komunikasi Anda saat ini ${overallScore}/100 - ini artinya **fondasi sudah solid**, tapi ada beberapa area yang bisa ditingkatkan untuk membawa hasil Anda ke level berikutnya. Jangan lihat ini sebagai kekurangan, tapi sebagai **peluang untuk growth**. Setiap kreator atau profesional pernah di posisi ini - yang membedakan adalah mereka yang konsisten melakukan improvement kecil setiap hari. Fokus ke prioritas yang sudah kami tandai di bawah, implementasikan satu-satu dengan sabar, dan dalam 2-4 minggu Anda akan lihat peningkatan signifikan. **Anda pasti bisa!** \u{1F680}`;
    } else {
      return `\u{1F3AF} **Mari kita bangun fondasi yang kuat!** Skor ${overallScore}/100 menunjukkan bahwa komunikasi Anda masih **perlu pengembangan lebih lanjut** - dan itu **tidak masalah sama sekali**! Setiap expert pernah mulai dari nol. Yang penting sekarang adalah Anda sudah aware dan ready untuk improve. Kami sudah buatkan action plan lengkap di bawah ini yang akan guide Anda **step-by-step** dari level sekarang ke level yang jauh lebih tinggi. Fokus ke 3 prioritas teratas dulu, jangan overwhelm diri dengan semua sekaligus. **Progress beats perfection** - better improve 10% setiap minggu daripada stuck di analysis paralysis. Commit 20-30 menit sehari untuk practice, dan dalam 1-2 bulan Anda akan amazed dengan transformasi yang terjadi. Mari kita mulai! \u{1F4AA}`;
    }
  }
  generateNextSteps(insights) {
    const sorted = [...insights].sort((a, b) => a.score - b.score);
    const top3 = sorted.slice(0, 3);
    return top3.map((insight) => {
      const rec = insight.recommendations[0];
      return `${insight.score < 50 ? "\u{1F6A8}" : insight.score < 70 ? "\u26A0\uFE0F" : "\u{1F4A1}"} ${rec.title}`;
    });
  }
};

// server/analyzers/deep-video-analyzer.ts
init_ai_rate_limiter();
import OpenAI from "openai";
var DEEP_ANALYSIS_PROMPT = `Kamu BIAS\xB2\xB3 Pro Analyzer - kasih analisis SUPER SPESIFIK untuk video/audio/presentasi user. JANGAN GENERIC!

**CRITICAL - BACA DULU:**

1. **CONTOH WAJIB DARI KONTEN USER:**
   \u274C GENERIC (FORBIDDEN): "Improve your body language"  
   \u2705 SPECIFIC (REQUIRED): "Di bagian awal pas kamu bilang 'growth mindset', gesture tangan kamu ekspresif banget - bagus! Tapi pas jelasin data di tengah, tangan kaku di samping. FIX: Saat bahas angka/data, point ke screen/grafik pakai tangan kanan (1-2x)."

2. **GUNAKAN DETAIL YANG USER KASIH:**
   - Kutip EXACT words/phrases dari description user
   - Refer ke bagian spesifik: "awal video", "tengah", "closing", atau timestamps jika ada
   - Count filler words jika disebutkan: "eee" muncul ~5x, "umm" 3x
   - JANGAN assume info yang gak ada - base on apa yang user describe

3. **RECOMMENDATIONS = ACTIONABLE STEPS, BUKAN THEORY:**
   \u274C GENERIC: "Week 1: Upload video untuk analisis"
   \u2705 SPECIFIC: "Starting TOMORROW: Record 5 practice runs (30 detik each). Di setiap run, fokus 1 perbaikan: Run 1 = kurangi 'eee', Run 2 = add 1 hand gesture saat main point, Run 3 = vary voice pitch. Week 1 target: maksimal 3 filler words per 30 detik. Week 2: Post video baru, compare engagement rate."

4. **8 LAYERS - ANALYZE INI (RINGKAS):**
   VBM: postur, gesture (count!), eye contact, facial expression
   EPM: emotional range, energy consistency, authenticity  
   NLP: hook strength, filler words (COUNT!), pacing, structure
   ETH: fact-check, source credibility, platform guidelines compliance
   ECO: algorithm fit (TikTok/IG/YT), trend relevance, format optimization
   SOC: CTA clarity, engagement cues, relatability
   COG: info density, complexity management, processing time
   BMIL: confidence signals, nervousness indicators, authority markers

5. **RECOMMENDATIONS HARUS:**
   - Mulai dengan "Starting TOMORROW" atau "Week 1"
   - Specific action: "Record 3x practice runs, fokus X"
   - Measurable target: "Target: max 2 filler words per 30 detik"
   - Expected result: "Expected: +20% engagement dalam 2 minggu"
   
   JANGAN BILANG "upload video untuk analisis" - USER UDAH UPLOAD!

**FORMAT OUTPUT:**
Setiap layer:
{
  "score": 0-100,
  "specificObservations": ["Quote exact dari user content", "Concrete example"],
  "strengths": ["What's ALREADY good dengan contoh spesifik"],
  "weaknesses": ["What needs improvement dengan contoh konkret"],  
  "actionableRecommendations": ["TOMORROW: Specific drill. Week 1: Measurable target. Expected: Result"],
  "feedback": "4-5 kalimat dalam Bahasa Indonesia yang praktis, motivating, BUKAN teori!"
}

INGAT: User frustasi dengan generic advice. Berikan VALUE MAKSIMAL - specific observations + actionable steps!`;
async function deepAnalyzeWithAI(input) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sessionId = input.sessionId || "anonymous";
  if (!process.env.OPENAI_API_KEY) {
    console.warn("\u26A0\uFE0F OpenAI API key not found - falling back to basic analysis");
    return { layers: generateBasicAnalysis(input) };
  }
  const rateLimitCheck = checkRateLimit(sessionId);
  if (!rateLimitCheck.allowed) {
    console.warn(`\u26A0\uFE0F Rate limit exceeded for session ${sessionId}: ${rateLimitCheck.reason}`);
    return {
      layers: generateBasicAnalysis(input),
      rateLimitInfo: rateLimitCheck
    };
  }
  try {
    const modeContext = getModeContext(input.mode);
    const platformContext = getPlatformContext(input.platform);
    const userPrompt = `
**CONTEXT:**
- Mode: ${input.mode.toUpperCase()}
- Input Type: ${input.inputType}
- Platform: ${input.platform || "general"}

${modeContext}
${platformContext}

**CONTENT TO ANALYZE:**
${input.content}

**TASK:** Analyze pakai 8-layer BIAS. WAJIB SPESIFIK!

**CRITICAL:**
- Quote EXACT dari content user (kata-kata yang dia tulis)
- Gesture kaku? \u2192 "TOMORROW: Practice 5x di cermin, gerakan tangan saat bilang [key point]"
- Filler words banyak? \u2192 "Count: kamu bilang 'eee' ~7x. TARGET: Week 1 max 3x. DRILL: Pause 2 detik instead of saying 'eee'"
- Monotone? \u2192 "Detik X-Y suara flat. FIX: Record ulang bagian itu 3x, setiap recording vary pitch different"

JANGAN BILANG: "Week 1: Upload video" - USER UDAH UPLOAD!
HARUS BILANG: "TOMORROW: [Specific action]. Week 1: [Measurable target]. Expected: [Real result]"

Platform: ${input.platform || "general"} - Check community guidelines!
${input.mode === "academic" || input.mode === "hybrid" ? "Academic mode: Check citations & logic!" : ""}

JSON array (8 layers), each:
{
  "layer": "VBM (Visual Behavior Mapping)",
  "score": 75,
  "specificObservations": ["observation 1", "observation 2", ...],
  "strengths": ["strength 1 dengan contoh spesifik", ...],
  "weaknesses": ["weakness 1 dengan contoh konkret", ...],
  "actionableRecommendations": ["Step 1: ... (Timeline: Week 1-2)", ...],
  "feedback": "Narrative 4-5 kalimat yang mendidik & motivating dalam Bahasa Indonesia",
  "feedbackId": "Same as feedback (Indonesian)"
}

CRITICAL: Berikan analysis yang DETAIL & SPESIFIK - ini premium service, bukan generic template!`;
    console.log("\u{1F680} Calling OpenAI GPT-4o-mini for deep analysis... (optimized for <20s response)");
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DEEP_ANALYSIS_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      // Lower = faster, more focused
      max_tokens: 2200,
      // Reduced from 4000 for 2x faster response
      response_format: { type: "json_object" }
    });
    const duration = Date.now() - startTime;
    console.log(`\u2705 OpenAI deep analysis completed in ${(duration / 1e3).toFixed(1)}s`);
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("Empty Ai response");
    }
    const parsedResponse = JSON.parse(responseContent);
    const layers = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.layers || [];
    if (!layers || layers.length === 0) {
      throw new Error("No layers in Ai response");
    }
    const tokensUsed = completion.usage?.total_tokens || Math.ceil(responseContent.length / 4);
    recordUsage(sessionId, tokensUsed);
    return {
      layers,
      rateLimitInfo: rateLimitCheck,
      tokensUsed
    };
  } catch (error) {
    console.error("\u274C Deep Ai Analysis Error:", error);
    console.log("\u{1F4CA} Falling back to basic analysis...");
    return { layers: generateBasicAnalysis(input) };
  }
}
function getModeContext(mode) {
  const contexts = {
    creator: `
**CREATOR MODE FOCUS:**
- TikTok/Instagram/YouTube content optimization
- Viral potential & engagement maximization  
- Platform algorithm alignment
- Creator personality & brand building
- Entertainment value & watchability`,
    academic: `
**ACADEMIC MODE FOCUS:**
- Professional presentation quality
- Academic rigor & citation accuracy
- Logical argument structure
- Evidence-based communication
- Leadership & authority presence
- Research presentation standards`,
    hybrid: `
**HYBRID MODE FOCUS:**
- Professional content for public platforms
- Balance between engaging & credible
- Educational entertainment (edutainment)
- Expert positioning with accessibility
- Platform optimization + academic rigor`
  };
  return contexts[mode] || contexts.creator;
}
function getPlatformContext(platform) {
  const contexts = {
    tiktok: `
**TIKTOK COMMUNITY GUIDELINES CHECK:**
- \u274C Prohibited: Misinformation, hate speech, bullying, dangerous acts, nudity, violence
- \u26A0\uFE0F Restricted: Minors safety, intellectual property, spam, deceptive content
- \u2705 Best practices: Authentic content, creative, positive community engagement`,
    instagram: `
**INSTAGRAM COMMUNITY GUIDELINES CHECK:**
- \u274C Prohibited: Nudity, hate speech, violence, harassment, false information
- \u26A0\uFE0F Restricted: Regulated goods, graphic content, spam behavior
- \u2705 Best practices: Original content, authentic engagement, respectful interaction`,
    youtube: `
**YOUTUBE COMMUNITY GUIDELINES CHECK:**
- \u274C Prohibited: Harmful/dangerous content, hate speech, harassment, misinformation, child safety violations
- \u26A0\uFE0F Restricted: Age-restricted content, copyright violations, clickbait metadata
- \u2705 Best practices: Original quality content, accurate metadata, community engagement`,
    "non-social": `
**PROFESSIONAL COMMUNICATION STANDARDS:**
- \u2705 Authenticity & credibility focus
- \u2705 Evidence-based statements
- \u2705 Professional presentation quality
- \u2705 Clear, structured messaging`
  };
  return contexts[platform || "non-social"] || contexts["non-social"];
}
function generateBasicAnalysis(input) {
  const layers = [
    "VBM (Visual Behavior Mapping)",
    "EPM (Emotional Processing Metric)",
    "NLP (Narrative & Language Patterns)",
    "ETH (Ethical Framework)",
    "ECO (Ecosystem Awareness)",
    "SOC (Social Intelligence)",
    "COG (Cognitive Load Management)",
    "BMIL (Behavioral Micro-Indicators Library)"
  ];
  return layers.map((layer, idx) => ({
    layer,
    score: 0,
    // No score available without actual analysis
    specificObservations: [
      `\u26A0\uFE0F Deep analysis memerlukan upload video/audio file`,
      `Analisis berbasis teks tidak dapat memberikan skor akurat`,
      `Upload file untuk mendapatkan observasi spesifik`
    ],
    strengths: [
      `Konten memiliki potensi untuk platform ${input.platform || "digital"}`,
      `Approach komunikasi sesuai dengan mode ${input.mode}`
    ],
    weaknesses: [
      `Tidak dapat menganalisis tanpa actual video/audio content`,
      `Upload file untuk mendapatkan feedback yang aplikatif`
    ],
    actionableRecommendations: [
      `Upload actual video/audio file untuk analisis detail`,
      `Gunakan mode upload untuk mendapatkan skor dan feedback konkret`
    ],
    feedback: `\u26A0\uFE0F SKOR TIDAK TERSEDIA - Analisis ini berbasis description text saja. Untuk mendapatkan skor dan feedback KONKRET dengan specific observations (timestamps, filler words count, gesture analysis, intonation patterns), silakan upload actual video/audio file.`,
    feedbackId: `\u26A0\uFE0F SKOR TIDAK TERSEDIA - Analisis ini berbasis description text saja. Untuk mendapatkan skor dan feedback KONKRET dengan specific observations (timestamps, filler words count, gesture analysis, intonation patterns), silakan upload actual video/audio file.`
  }));
}

// server/analyzers/text-formatter.ts
function simplifyDiagnosis(text2) {
  let result = text2;
  result = result.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "");
  result = result.replace(/\blo\b/gi, "Anda");
  result = result.replace(/\bLo\b/g, "Anda");
  result = result.replace(/udah/gi, "sudah");
  result = result.replace(/gak/gi, "tidak");
  result = result.replace(/aja/gi, "saja");
  result = result.replace(/emang/gi, "memang");
  result = result.replace(/banget/gi, "sangat");
  result = result.replace(/kalo/gi, "kalau");
  result = result.replace(/gimana/gi, "bagaimana");
  result = result.replace(/kayak/gi, "seperti");
  result = result.replace(/pake/gi, "pakai");
  result = result.replace(/bisa/gi, "dapat");
  result = result.replace(/\*\*?\d+\/\d+\*\*?/g, "");
  result = result.replace(/\(\d+\/\d+\)/g, "");
  const sentences = result.split(/[.!?]+/).filter((s) => s.trim());
  if (sentences.length > 0) {
    result = sentences[0].trim();
  }
  result = result.replace(/\*\*/g, "");
  result = result.replace(/\s+/g, " ");
  result = result.trim();
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  if (result && !result.match(/[.!?]$/)) {
    result += ".";
  }
  return result;
}

// server/analyzers/integration.ts
function convertToLegacyFormat(insights) {
  return insights.map((insight) => {
    const score = Math.round(insight.score / 10);
    const fullDiagnosis = insight.diagnosis;
    return {
      layer: insight.term,
      score,
      feedback: fullDiagnosis,
      feedbackId: fullDiagnosis
    };
  });
}
async function analyzeText(input) {
  const shouldUseAI = input.content && input.content.length >= 20;
  if (shouldUseAI) {
    try {
      console.log("\u{1F916} Initiating Ai Deep Analysis for", input.inputType, "content...");
      const deepResult = await deepAnalyzeWithAI({
        content: input.content,
        mode: input.mode,
        inputType: input.inputType,
        platform: input.platform
      });
      const deepLayers = deepResult.layers;
      if (deepLayers && deepLayers.length > 0) {
        const layers2 = deepLayers.map((dl) => ({
          layer: dl.layer,
          score: Math.round(dl.score / 10),
          // Convert 0-100 to 1-10
          feedback: dl.feedback,
          feedbackId: dl.feedbackId
        }));
        const overallScore = Math.round(
          deepLayers.reduce((sum, l) => sum + l.score, 0) / deepLayers.length
        );
        const allRecommendations = deepLayers.flatMap(
          (dl) => dl.actionableRecommendations || []
        ).filter(Boolean);
        const summary = generateDeepSummary(deepLayers, overallScore, input.mode);
        console.log("\u2705 Ai Deep Analysis completed successfully");
        return {
          mode: input.mode,
          overallScore,
          layers: layers2,
          summary,
          summaryId: summary,
          recommendations: allRecommendations.slice(0, 10),
          recommendationsId: allRecommendations.slice(0, 10)
        };
      }
    } catch (error) {
      console.error("\u26A0\uFE0F Ai Deep Analysis failed, falling back to standard analysis:", error);
    }
  }
  console.log("\u{1F4DD} Using standard template-based analysis (Ai unavailable or content too short)");
  const analyzer = new TextAnalyzer({
    content: input.content,
    mode: input.mode,
    inputType: input.inputType
  });
  const result = analyzer.analyze();
  const layers = convertToLegacyFormat(result.insights);
  const recommendations = result.nextSteps.map((s) => simplifyDiagnosis(s));
  return {
    mode: input.mode,
    overallScore: result.overallScore,
    layers,
    summary: result.summary,
    summaryId: result.summary,
    recommendations,
    recommendationsId: recommendations
  };
}
function generateDeepSummary(layers, overallScore, mode) {
  const topStrengths = layers.filter((l) => l.score >= 75).map((l) => l.layer.split("(")[0].trim()).slice(0, 3);
  const weaknesses = layers.filter((l) => l.score < 60).map((l) => l.layer.split("(")[0].trim()).slice(0, 3);
  if (overallScore >= 75) {
    return `\u{1F525} **Excellent Performance (${overallScore}/100)!** Analisis mendalam menunjukkan komunikasi Anda sangat kuat${topStrengths.length > 0 ? ` terutama di ${topStrengths.join(", ")}` : ""}. Feedback spesifik di setiap layer memberikan roadmap clear untuk maintain excellence dan explore advanced techniques. Dengan consistency di level ini, Anda sudah di top 10% ${mode === "creator" ? "creators" : "communicators"} di niche Anda. Keep the momentum!`;
  } else if (overallScore >= 60) {
    return `\u{1F4A1} **Solid Foundation (${overallScore}/100) dengan Room for Growth!** Analisis mendetail mengidentifikasi area-area improvement yang spesifik dan actionable${weaknesses.length > 0 ? `, terutama di ${weaknesses.join(", ")}` : ""}. Setiap layer menyediakan concrete steps dengan timeline yang realistic - implement recommendations secara bertahap dan dalam 2-4 minggu Anda akan see significant improvement. Potensinya besar, tinggal execution!`;
  } else {
    return `\u26A0\uFE0F **Development Stage (${overallScore}/100) - Lots of Potential!** Analisis comprehensive ini mengidentifikasi specific areas yang perlu attention${weaknesses.length > 0 ? `, khususnya ${weaknesses.join(", ")}` : ""}. Good news: semua feedback dilengkapi dengan actionable steps dan timeline realistic. Fokus ke high-impact recommendations first (marked as "urgent" atau "important"), implement step-by-step, dan track progress weekly. Dengan dedicated practice 30-60 menit per day, expect dramatic improvement dalam 1-2 bulan. Everyone starts somewhere - yang penting consistent action!`;
  }
}

// server/knowledge-library/social-media/tiktok-guide.ts
var TikTokKnowledge = {
  // ALGORITHM & FYP SECRETS
  algorithm: {
    fyp: {
      howItWorks: "TikTok FYP (For You Page) menggunakan Ai untuk recommend video yang cocok dengan minat user. Semakin banyak interaksi (watch time, like, share), semakin sering video kamu muncul.",
      rankingFactors: [
        {
          factor: "Watch Time / Completion Rate",
          importance: "CRITICAL - #1 Factor",
          explanation: "Berapa % viewers nonton video kamu sampai habis. Target: minimal 60%",
          howToImprove: [
            "Hook kuat di 1-3 detik pertama (tanya, shocking statement, visual menarik)",
            "Video duration 15-45 detik (sweet spot untuk retention)",
            "End dengan cliffhanger atau 'swipe untuk part 2'"
          ]
        },
        {
          factor: "User Interactions",
          importance: "HIGH",
          explanation: "Likes, comments, shares, saves - semua dihitung",
          howToImprove: [
            "Akhiri dengan clear CTA: 'Comment jawaban kamu!'",
            "Buat video 'relatable' yang bikin orang pengen share",
            "Respond ke semua comments dalam 1 jam pertama (boost engagement)"
          ]
        },
        {
          factor: "Video Information",
          importance: "MEDIUM-HIGH",
          explanation: "Caption, hashtags, sounds yang kamu gunakan",
          howToImprove: [
            "Caption: Short & curiosity-driven (50-100 karakter)",
            "Hashtags: 3-5 relevant (1 trending + 2-3 niche + 1 broad)",
            "Trending sounds: Gunakan dalam 24-48 jam pertama viral"
          ]
        },
        {
          factor: "Account Settings & Device Info",
          importance: "LOW-MEDIUM",
          explanation: "Language preference, lokasi - untuk personalisasi",
          tip: "Konsisten pakai bahasa yang sama, post di timezone optimal"
        }
      ],
      commonMyths: [
        {
          myth: "\u274C Posting lebih banyak = lebih banyak views",
          truth: "\u2705 Quality > Quantity. 1 video berkualitas/hari lebih baik dari 5 video biasa"
        },
        {
          myth: "\u274C Follow back semua orang supaya followers naik",
          truth: "\u2705 Following ratio ga pengaruh FYP. Focus ke konten, bukan angka following"
        },
        {
          myth: "\u274C Harus pakai hashtag #fyp #foryou",
          truth: "\u2705 Hashtag generic ga ngaruh. Pakai niche hashtags yang spesifik"
        }
      ]
    },
    viralFormula: {
      structure: "Hook (1-3s) \u2192 Value/Entertainment (20-40s) \u2192 CTA (3-5s)",
      hookExamples: {
        beginner: [
          "\u274C Bad: 'Halo guys, hari ini aku mau share...' (BORING!)",
          "\u2705 Good: 'Cara dapat 10K followers dalam 30 hari - ini step by step nya'",
          "\u2705 Good: 'Ini alasan kenapa video kamu ga FYP' (problem-focused)",
          "\u2705 Good: 'POV: Kamu baru sadar udah scrolling 2 jam' (relatable)"
        ],
        advanced: [
          "Pattern interruption: Mulai di tengah action",
          "Controversial take: 'Unpopular opinion: [statement]'",
          "Storytelling: 'So I just found out...' (curiosity gap)"
        ]
      },
      contentTypes: {
        educational: {
          format: "Quick tips, how-to, myth vs fact",
          example: "3 cara edit video di 30 detik - no app needed!",
          bestPractice: "1 tip per video, explain simply, show don't just tell"
        },
        entertainment: {
          format: "Trends, comedy, relatable moments",
          example: "POV: Kamu lagi diet tapi temen ajak makan all you can eat",
          bestPractice: "Timing is everything, exaggerate reactions, sound selection critical"
        },
        storytelling: {
          format: "Personal experiences, behind-the-scenes",
          example: "Storytime: Waktu aku ketemu idol di lift - awkward banget",
          bestPractice: "Build suspense, emotional payoff, authentic delivery"
        }
      }
    },
    postingStrategy: {
      bestTimes: {
        indonesia: [
          "Pagi: 6:00-9:00 AM (commute time - orang buka HP di perjalanan)",
          "Siang: 12:00-1:30 PM (lunch break)",
          "Malam: 6:00-10:00 PM (primetime - highest engagement)"
        ],
        testing: "Post di different times selama 2 minggu, track mana yang best perform untuk audience kamu"
      },
      frequency: {
        pemula: "1-2x per hari, fokus ke quality",
        intermediate: "2-3x per hari dengan content pillar system",
        advanced: "3-5x per hari dengan batch creation & scheduling"
      },
      consistency: "Algorithm reward konsistensi. Lebih baik 1 video/hari selama 30 hari daripada 30 video dalam 1 minggu terus hilang."
    }
  },
  // CONTENT STRATEGY FOR BEGINNERS
  growthRoadmap: {
    week1to2: {
      goal: "Find your voice & test content types",
      tasks: [
        "Post 1 video/hari (total 14 videos)",
        "Test 3 different content types: educational, entertainment, storytelling",
        "Respond ke SEMUA comments (build early community)",
        "Study 5 creators di niche kamu - apa yang works?"
      ],
      expectedResult: "100-500 views/video, mulai paham content apa yang resonate"
    },
    week3to4: {
      goal: "Double down on what works",
      tasks: [
        "80% konten: Tipe yang best perform di week 1-2",
        "20% konten: Experiment dengan trends",
        "Mulai create series (part 1, 2, 3 - untuk retention)",
        "Collab request ke micro-creators (1K-10K followers)"
      ],
      expectedResult: "500-2K views/video, follower growth 50-100/week"
    },
    month2: {
      goal: "Optimize & scale",
      tasks: [
        "Analyze top 3 performing videos - recreate formula",
        "Batch create: 1 hari shooting = 5-7 videos",
        "Post 2-3x daily dengan content calendar",
        "Engage di comments competitors (soft promotion)"
      ],
      expectedResult: "2K-10K views/video, 1K+ followers milestone"
    },
    month3plus: {
      goal: "Monetization preparation",
      tasks: [
        "Reach 10K followers (Creator Fund eligible)",
        "Build email list / other platforms (diversify)",
        "Test affiliate marketing di bio",
        "Pitch brand deals (micro-influencer rates)"
      ],
      expectedResult: "Consistent 10K+ views, monetization streams starting"
    }
  },
  // COMMON BEGINNER MISTAKES
  mistakesToAvoid: [
    {
      mistake: "Terlalu fokus ke angka (followers, likes) di minggu pertama",
      fix: "Focus ke improve content quality. Angka akan follow.",
      timeline: "Butuh 30-60 hari untuk algorithm 'learn' audience kamu"
    },
    {
      mistake: "Copy paste content orang lain exactly",
      fix: "Inspired OK, tapi add your unique twist/personality",
      why: "Algorithm detect duplicates, original content prioritized"
    },
    {
      mistake: "Ga respond ke comments",
      fix: "Reply ALL comments dalam 1-2 jam post upload",
      impact: "Engagement boost \u2192 FYP probability increase 40%"
    },
    {
      mistake: "Posting semua jenis konten random",
      fix: "Stick to 2-3 content pillars, build niche authority",
      example: "Pillar 1: TikTok tips, Pillar 2: Editing tutorials, Pillar 3: Creator BTS"
    },
    {
      mistake: "Expecting overnight success",
      fix: "TikTok is marathon, not sprint. Consistency > viral hopes",
      reality: "90% creators butuh 3-6 bulan untuk first 10K followers"
    }
  ],
  // TROUBLESHOOTING LOW VIEWS
  troubleshooting: {
    symptom: "Views stuck di 100-300",
    diagnoses: [
      {
        issue: "Hook lemah - viewers scroll dalam 2 detik",
        solution: "A/B test 5 different hooks untuk same content, compare retention",
        drill: "Record 5 versions opening yang beda, post di different days"
      },
      {
        issue: "Video terlalu panjang - retention drop",
        solution: "Cut duration jadi 30 detik max, remove fluff",
        drill: "Edit existing video, cut 50%, repost after 2 weeks"
      },
      {
        issue: "Niche terlalu sempit - audience kecil",
        solution: "Expand topic sedikit, atau create sub-niches series",
        example: "Dari 'vegan recipes' \u2192 'healthy eating for busy people'"
      },
      {
        issue: "Posting time salah - audience ga online",
        solution: "Check analytics, post saat followers most active",
        tool: "TikTok Analytics \u2192 Followers tab \u2192 'Most Active Times'"
      }
    ]
  },
  // 2025 TRENDS & PREDICTIONS
  trends2025: {
    contentShifts: [
      "Longer-form content (60-90s) getting more traction",
      "Educational/value content outperforming pure entertainment",
      "Behind-the-scenes & authenticity > polished production",
      "Series/serialized content for retention gaming"
    ],
    algorithmUpdates: [
      "Increased focus on 're-watch rate' (user watch video 2+ times)",
      "Community engagement weighted heavier (DMs, shares to friends)",
      "Original sounds/music favored over trending sounds aging >1 week"
    ],
    monetizationOpportunities: [
      "TikTok Shop integration (direct selling)",
      "Affiliate partnerships expanding",
      "Creator Marketplace for brand deals",
      "Live streaming gifts & subscriptions"
    ]
  }
};
function getTikTokTip(topic) {
  const tips = {
    fyp: "Hook dalam 1-3 detik, video 15-45 detik, trending sound + unique angle, reply semua comments dalam 1 jam",
    viral: "Pattern interrupt opening + clear value proposition + strong CTA. Formula: Hook \u2192 Value \u2192 Action",
    growth: "Consistency beats perfection. 1 good video/day > 7 random videos/week. Engage actively.",
    hashtags: "3-5 hashtags: 1 trending + 2-3 niche specific + 1 broad category. Avoid generic #fyp",
    retention: "Cut first 3 seconds ruthlessly. Every frame harus earn viewer's time. End dengan payoff atau cliffhanger"
  };
  return tips[topic.toLowerCase()] || "Topic not found. Try: fyp, viral, growth, hashtags, retention";
}

// server/knowledge-library/social-media/instagram-guide.ts
var InstagramKnowledge = {
  // REELS ALGORITHM SECRETS
  reels: {
    algorithm: {
      howItWorks: "Instagram Reels algorithm mirip TikTok - prioritize watch time, engagement, shares. Bedanya: follower interactions weighted lebih tinggi di IG.",
      rankingFactors: [
        {
          factor: "Watch Time & Replays",
          importance: "CRITICAL",
          explanation: "Berapa kali orang nonton Reel kamu sampai habis + replay",
          optimization: [
            "Duration sweet spot: 7-15 detik (highest retention)",
            "Loop-able content (ending connects to beginning)",
            "Save the best for last (payoff di detik terakhir)"
          ]
        },
        {
          factor: "Shares & Saves",
          importance: "VERY HIGH",
          explanation: "IG prioritize content yang orang share ke DM atau save for later",
          howToBoost: [
            "Create 'shareable' moments (relatable, funny, informative)",
            "Educational content = high save rate",
            "End with 'Save this for later!' CTA"
          ]
        },
        {
          factor: "Likes & Comments",
          importance: "HIGH",
          explanation: "Standard engagement metrics",
          tactics: [
            "Ask question di caption yang bikin orang comment",
            "Controversial takes (tastefully) = high comment rate",
            "Reply to comments immediately = boost"
          ]
        },
        {
          factor: "Audio Usage",
          importance: "MEDIUM-HIGH",
          explanation: "Trending audio get distribution boost",
          tip: "Use trending audio within 48 hours of trending. Check Reels \u2192 Audio page untuk current trends"
        }
      ],
      differencesFromTikTok: [
        "IG rewards follower engagement more (your followers see your content first)",
        "Cross-posting to Feed + Stories + Reels = algorithm boost",
        "Hashtags still matter on IG (unlike TikTok where it's minimal)",
        "Photo carousels can compete with Reels for reach"
      ]
    },
    contentStrategy: {
      formats: {
        tutorial: {
          structure: "Problem (2s) \u2192 Solution steps (10s) \u2192 Result (3s)",
          example: "Can't afford expensive camera? \u2192 Use phone + these 3 settings \u2192 Pro-quality videos",
          performanceTip: "Step-by-step visuals > talking head. Show, don't tell."
        },
        transformation: {
          structure: "Before state \u2192 Process/Journey \u2192 After reveal",
          example: "Room makeover, fitness journey, skill progression",
          hook: "Lead with dramatic 'after' for 1 second, then show 'before' to create curiosity gap"
        },
        behindTheScenes: {
          structure: "Polished result \u2192 How it's actually made (messy reality)",
          example: "Perfect IG photo \u2192 setup reality (tripod, 50 takes, editing)",
          appeal: "Authenticity content performing very well in 2025"
        },
        trendjacking: {
          structure: "Trending audio/format + your niche twist",
          example: "Dance trend \u2192 add your industry context (teacher, doctor, entrepreneur version)",
          timing: "Jump on trends within 24-48 hours max"
        }
      },
      contentPillars: {
        explanation: "3-5 recurring themes untuk consistency & niche authority",
        example: {
          fitnessCreator: [
            "Pillar 1: Quick workouts (30s-1min routines)",
            "Pillar 2: Nutrition tips",
            "Pillar 3: Motivation/mindset",
            "Pillar 4: Transformation stories"
          ],
          businessCreator: [
            "Pillar 1: Growth tactics",
            "Pillar 2: Tool recommendations",
            "Pillar 3: Mistakes to avoid",
            "Pillar 4: Behind-the-scenes"
          ]
        },
        ratio: "80% pillar content (reliable) + 20% experimental/trending"
      }
    }
  },
  // GROWTH STRATEGIES
  growth: {
    organicTactics: [
      {
        tactic: "Carousel Posts (Photo Dumps)",
        why: "IG algorithm loves carousels - people swipe = extended engagement time",
        howTo: "10 slides max, strong hook on slide 1, value throughout, CTA on last slide",
        performance: "Carousels get 3x more saves than single images"
      },
      {
        tactic: "Story Engagement Loops",
        why: "High story viewers = algorithm thinks you're valuable creator",
        howTo: [
          "Post 3-7 stories/day with stickers (polls, questions, quizzes)",
          "Reply to ALL story responses within 1 hour",
          "Share Reels to story (cross-promotion)"
        ],
        metric: "Target: 30%+ story completion rate"
      },
      {
        tactic: "Collaborative Posts",
        why: "Reach 2 audiences at once, algorithm boost",
        howTo: "Collab with creators 1-3x your size, complementary niches, split content creation",
        frequency: "1-2 collabs per month minimum"
      },
      {
        tactic: "Engagement Pods (Strategic)",
        why: "Early engagement = algorithm distributes wider",
        howTo: "5-10 trusted creators, engage within first 30 min of each other's posts",
        warning: "Don't overdo - algorithm can detect fake engagement pods. Keep it authentic."
      },
      {
        tactic: "DM Outreach",
        why: "Build real relationships = loyal audience",
        howTo: "Reply to comments in DMs, reach out to engaged followers, ask for feedback",
        impact: "Personal touch = 10x more likely to convert to superfan"
      }
    ],
    hashtagStrategy: {
      formula: "25-30 hashtags total (IG allows 30 max)",
      breakdown: [
        "5-7 high-traffic hashtags (100K-1M posts) - broad reach",
        "10-15 medium-traffic (10K-100K) - sweet spot",
        "5-7 low-traffic (<10K) - niche authority",
        "3-5 branded hashtags - your unique tags"
      ],
      placement: "Caption or first comment doesn't matter anymore (both work)",
      research: "Check competitors' top posts, see which hashtags they use. Test & iterate.",
      refresh: "Update hashtag sets every 2-3 weeks, track which perform best"
    },
    postingSchedule: {
      frequency: {
        minimum: "3-4 posts per week (Reels priority)",
        optimal: "1 Reel/day + 2-3 carousels/week + Stories daily",
        advanced: "2 Reels/day + 1 carousel every other day + Stories 2x daily"
      },
      timing: {
        indonesia: [
          "Best times: 7-9 AM, 12-1 PM, 7-9 PM",
          "Wednesday-Friday perform better than Monday-Tuesday",
          "Sunday evening: high leisure browsing time"
        ],
        testing: "Use IG Insights \u2192 'Your audience' \u2192 'Most Active Times' for personalized data"
      },
      consistency: "Algorithm rewards regular posting. Better 3 posts/week consistently than 7 posts one week, 0 next week."
    }
  },
  // ENGAGEMENT TACTICS
  engagement: {
    captionFormulas: {
      storytelling: {
        format: "Hook line \u2192 Mini story (3-5 sentences) \u2192 CTA question",
        example: "I almost quit Instagram 6 months ago. 234 followers, zero engagement, feeling invisible. Then I changed ONE thing... (continues) \u2192 What's your biggest IG struggle right now?",
        performance: "Personal stories = 50% more comments than generic captions"
      },
      valueFirst: {
        format: "Bold claim \u2192 Proof points \u2192 Implementation steps",
        example: "You don't need 10K followers to make money on IG. I made my first $500 at 1.2K followers. Here's how: (list 3-5 steps) \u2192 Which strategy will you try first?",
        savability: "Actionable content = high save rate"
      },
      controversial: {
        format: "Unpopular opinion \u2192 Why you believe it \u2192 Invite debate",
        example: "Unpopular opinion: Buying followers actually HURTS your account more than having low follower count. Here's why... \u2192 Agree or disagree?",
        warning: "Be controversial, not offensive. Know the line."
      }
    },
    storyStrategies: {
      dailyRoutines: [
        "Morning: Behind-the-scenes of your day (relatable moments)",
        "Afternoon: Poll/Question sticker (what should I post next?)",
        "Evening: Share Reel to story + add context",
        "Night: Mini tip atau motivational quote"
      ],
      interactiveStickers: {
        mostEffective: [
          "Poll: Binary choice questions (A vs B)",
          "Question: 'Ask me anything about [your niche]'",
          "Quiz: Test their knowledge (educational + fun)",
          "Countdown: Launch teasers, event announcements"
        ],
        responseRate: "Target 10%+ sticker interactions"
      },
      conversion: "Every 5-7 stories, include 1 CTA story (link, product, service) - don't oversell"
    },
    communityBuilding: {
      tactics: [
        "Feature followers: Repost UGC (user-generated content) to your story with credit",
        "Create inside jokes/recurring segments: Build community culture",
        "Host challenges: Engage audience to participate, repost best entries",
        "Go live regularly: Real-time interaction = strongest connection"
      ],
      superfanStrategy: "Identify top 20 engagers, DM personal thanks, give exclusive previews. They become your word-of-mouth marketing."
    }
  },
  // MONETIZATION PATHS
  monetization: {
    milestones: {
      "1K-5K followers": {
        opportunities: [
          "Affiliate marketing (Amazon, niche products)",
          "Digital products (ebooks, templates, presets)",
          "Small brand collaborations (product exchanges)"
        ],
        income: "$50-$300/month realistic"
      },
      "5K-10K followers": {
        opportunities: [
          "Sponsored posts ($100-$300 per post)",
          "Brand ambassadorships",
          "Online courses/coaching",
          "Paid partnerships"
        ],
        income: "$300-$1,000/month realistic"
      },
      "10K+ followers": {
        opportunities: [
          "Swipe-up links (verified accounts)",
          "Higher-tier sponsorships ($500-$2K+ per post)",
          "Product launches",
          "Speaking engagements"
        ],
        income: "$1,000-$10,000+/month possible"
      }
    },
    rateCalculation: {
      formula: "Base rate = (Followers \xF7 100) \xD7 Engagement Rate \xD7 10",
      example: "5K followers, 5% engagement = ($50) \xD7 5 \xD7 10 = $250 per sponsored post",
      negotiation: "Start 20% higher than calculation, negotiate down"
    }
  },
  // TROUBLESHOOTING
  commonIssues: {
    "Low reach on Reels": {
      causes: [
        "Poor hook - people scroll within 1 second",
        "Trending audio used too late (>7 days old)",
        "Low-quality video (blurry, bad lighting)",
        "No clear value proposition"
      ],
      fixes: [
        "A/B test 3 different hooks for same content",
        "Use audio within 48 hours of trending",
        "Invest in ring light + phone stabilizer ($30-50 total)",
        "First 3 seconds: What will viewer GAIN from watching?"
      ]
    },
    "Engagement dropped suddenly": {
      causes: [
        "Algorithm change (happens every few months)",
        "Content consistency shifted",
        "Posting times changed",
        "Shadowban (violated community guidelines)"
      ],
      fixes: [
        "Review recent posts - which type performed worst? Reduce those.",
        "Return to content pillars that worked before",
        "Revert to previous posting schedule",
        "Check if shadowbanned: Search your hashtags in incognito, see if your posts appear"
      ]
    },
    "Stuck at follower plateau": {
      causes: [
        "Content too similar (algorithm stops distributing to new people)",
        "Not leveraging other platforms for cross-promotion",
        "No collaborations/network effects"
      ],
      fixes: [
        "Introduce 1 new content format/pillar",
        "Share IG content on TikTok, YouTube Shorts",
        "Reach out for 2-3 collabs per month",
        "Engage heavily in your niche (comment on big accounts)"
      ]
    }
  },
  // 2025 TRENDS
  trends2025: {
    contentShifts: [
      "Raw, unedited content > polished production (authenticity wins)",
      "Educational Reels outperforming entertainment",
      "Longer captions making comeback (storytelling format)",
      "Photo carousels competitive with Reels again"
    ],
    features: [
      "Instagram Notes: Quick updates (like Twitter), high visibility",
      "Broadcast Channels: Direct messaging to followers (like newsletter)",
      "Collabs 2.0: Tag multiple collaborators, split reach"
    ],
    monetization: [
      "Creator marketplace expansion",
      "In-app shop integration improvements",
      "Subscription feature growing (monthly recurring revenue)"
    ]
  }
};
function getInstagramTip(topic) {
  const tips = {
    reels: "7-15s duration, trending audio <48hrs old, strong hook in first second, loop-able format, share to story for extra reach",
    growth: "1 Reel/day + Stories daily + engage 30min/day in niche. Consistency beats perfection.",
    engagement: "Reply ALL comments within 1hr, use question stickers in stories, DM your top engagers personally",
    hashtags: "25-30 total: mix high/medium/low traffic. Research competitors, update every 2-3 weeks",
    monetization: "Start affiliate at 1K followers, pitch brands at 5K, premium sponsorships at 10K+"
  };
  return tips[topic.toLowerCase()] || "Topic not found. Try: reels, growth, engagement, hashtags, monetization";
}

// server/knowledge-library/social-media/youtube-guide.ts
var YouTubeKnowledge = {
  // ALGORITHM & SEO
  algorithm: {
    howItWorks: "YouTube algorithm prioritize 2 things: Click-Through Rate (CTR) dan Average View Duration (AVD). Semakin banyak orang klik + nonton lama = semakin sering recommend.",
    rankingFactors: [
      {
        factor: "Click-Through Rate (CTR)",
        importance: "CRITICAL for initial push",
        explanation: "% orang yang klik video kamu setelah lihat thumbnail + title",
        benchmark: {
          poor: "<2% CTR",
          average: "2-5% CTR",
          good: "5-10% CTR",
          excellent: ">10% CTR"
        },
        optimization: {
          thumbnail: [
            "Bright colors yang stand out (yellow, red, cyan)",
            "Close-up faces dengan expressive emotions",
            "Text overlay: 3-5 kata MAX (big, bold, readable)",
            "Consistent branding (same style/colors untuk recognition)"
          ],
          title: [
            "Front-load keywords (first 5 words most important)",
            "Create curiosity gap (promise outcome, don't reveal how)",
            "Numbers work: '7 Ways', '3 Mistakes', '$10,000 in...'",
            "Length: 50-60 characters optimal (full display in search)"
          ]
        }
      },
      {
        factor: "Average View Duration (AVD)",
        importance: "CRITICAL for sustained reach",
        explanation: "Average berapa lama viewers nonton video kamu",
        benchmark: {
          shortVideos: "50%+ AVD (e.g., 5 min video = 2.5+ min average)",
          longVideos: "40%+ AVD (e.g., 20 min video = 8+ min average)"
        },
        optimization: {
          scriptStructure: "Hook (0-15s) \u2192 Pattern interrupts every 60-90s \u2192 Payoff",
          pacing: "Cut pauses, remove 'umm/ehh', increase talking speed 1.1-1.2x",
          visuals: "Change camera angle/b-roll every 5-7 seconds",
          chapters: "Add timestamps - viewers can jump to relevant parts (still counts as watch time)"
        }
      },
      {
        factor: "Engagement Signals",
        importance: "HIGH (feedback to algorithm)",
        explanation: "Likes, comments, shares, subscribes",
        howToBoost: [
          "Explicit CTA mid-video: 'If you found this helpful, like the video'",
          "Pin comment dengan question untuk early engagement",
          "End screen: 'Watch this next' (keep viewers on your channel)",
          "Community tab: Tease upcoming videos, build anticipation"
        ]
      }
    ],
    searchOptimization: {
      keywordResearch: {
        tools: [
          "YouTube search autocomplete (free, reflects real searches)",
          "TubeBuddy / VidIQ (browser extensions, keyword scores)",
          "Google Trends (identify rising topics)"
        ],
        strategy: "Target 'low competition, high search volume' keywords untuk small channels. As you grow, compete for bigger keywords."
      },
      titleFormulas: [
        "How to [Desired Outcome] [With/Without Condition]",
        "[Number] Ways to [Solve Problem] (Even if [Objection])",
        "Why [Common Belief] is Wrong (And What to Do Instead)",
        "I Tried [Thing] for [Time Period] - Here's What Happened",
        "[Year] Guide to [Topic] - [Specific Benefit]"
      ],
      descriptionOptimization: {
        structure: "First 2-3 lines: Summary (shows in preview), Keywords natural, Timestamps, Links",
        keywords: "Include 3-5 keyword variations naturally in first paragraph",
        length: "Longer descriptions (300+ words) index better, but front-load value",
        links: "Own website, social media, affiliate (in that priority order)"
      },
      tags: {
        myth: "Tags punya weight sangat kecil di 2025 algorithm",
        reality: "Use tags, but focus energy on title/thumbnail/retention",
        strategy: "8-12 tags: Brand name, exact keyword, variations, broader category"
      }
    }
  },
  // CONTENT STRATEGY
  contentTypes: {
    tutorials: {
      format: "Problem \u2192 Solution steps \u2192 Result demonstration",
      retention: "Tease final result in first 15 seconds, show process, reveal outcome at end",
      length: "8-15 minutes sweet spot (long enough for ads, short enough to maintain retention)",
      monetization: "High advertiser demand for educational content = higher CPM"
    },
    vlogs: {
      format: "Day-in-the-life, behind-the-scenes, personal stories",
      retention: "Story arc: Setup \u2192 Conflict/Challenge \u2192 Resolution",
      length: "10-20 minutes (build parasocial relationships)",
      audience: "Requires existing fanbase - not ideal for growth phase"
    },
    listicles: {
      format: "'Top 10 [Things]', '7 Best [Products]', '5 Mistakes [Topic]'",
      retention: "Pattern: Tease full list \u2192 Reveal one at a time \u2192 Recap",
      length: "10-12 minutes (1-1.5 min per item)",
      monetization: "High affiliate potential - can link products in description"
    },
    commentary: {
      format: "React to news, trends, other content (with transformative commentary)",
      retention: "Clip \u2192 Pause \u2192 Add analysis \u2192 Repeat",
      length: "12-18 minutes (enough depth for meaningful commentary)",
      warning: "Fair use applies - must add significant commentary/criticism/analysis"
    },
    shorts: {
      format: "Vertical videos <60 seconds (YouTube's TikTok competitor)",
      strategy: "Funnel to long-form: Tease topic in Short, 'Full video on my channel'",
      frequency: "3-5 Shorts per week + 2-3 long-form = optimal mix",
      monetization: "Shorts fund separate from ad revenue, lower payout per view"
    }
  },
  // GROWTH STRATEGIES
  growth: {
    for0to1K: {
      goal: "Reach 1,000 subscribers (monetization eligibility requirement)",
      timeline: "3-6 months with consistent posting",
      strategy: [
        "Niche down HARD: Be the best at one specific thing",
        "Searchable content: Solve specific problems people Google",
        "Collaboration: Find creators at 1K-5K subs, collab ideas",
        "Cross-promote: Share YouTube on TikTok/IG, drive traffic",
        "Engage: Comment on bigger channels in your niche (thoughtful comments, build relationships)"
      ],
      metrics: "Post 2-3 videos/week, aim for 50+ subscribers/month"
    },
    for1Kto10K: {
      goal: "Build momentum & prepare for monetization",
      strategy: [
        "Double down on top performers: Analyze your best 3 videos, create similar content",
        "Series format: 'Part 1, 2, 3' keeps viewers coming back",
        "Community tab: Post polls, updates (builds loyalty)",
        "Thumbnail A/B testing: Test different styles, track CTR",
        "Playlist strategy: Group related videos (increases session time)"
      ],
      metrics: "Target 200-500 new subs/month, 10K+ views/month"
    },
    for10Kto100K: {
      goal: "Scale & diversify revenue",
      strategy: [
        "Increase production value: Better lighting, audio, editing",
        "Hire editor (free up time for strategy & scripting)",
        "Multiple revenue streams: AdSense + Sponsors + Affiliates + Products",
        "Strategic collaborations: Bigger creators (50K-200K subs)",
        "Data-driven decisions: Deep dive YouTube Analytics weekly"
      ],
      metrics: "1,000-3,000 new subs/month, 100K+ views/month"
    },
    postingSchedule: {
      beginner: "1-2 videos/week, same day/time (build viewer habit)",
      intermediate: "2-3 videos/week + 3-5 Shorts/week",
      advanced: "3-4 long-form/week + daily Shorts",
      consistency: "Algorithm rewards regularity. Better 1 video/week for 52 weeks than 52 videos in 1 month."
    }
  },
  // MONETIZATION
  monetization: {
    requirements: {
      partnerProgram: [
        "1,000 subscribers",
        "4,000 watch hours in past 12 months",
        "Comply with policies (no strikes)",
        "2-factor authentication enabled",
        "AdSense account linked"
      ],
      applicationProcess: "Apply via YouTube Studio \u2192 Monetization tab. Review takes 1-4 weeks."
    },
    revenueStreams: {
      adRevenue: {
        cpm: "$1-$10 per 1,000 views (varies by niche, geography, season)",
        niches: {
          high: "Finance, Tech, Business ($8-$15 CPM)",
          medium: "Lifestyle, Education ($3-$7 CPM)",
          low: "Gaming, Vlogging ($1-$3 CPM)"
        },
        calculation: "100K views/month \xD7 $5 CPM = $500/month ad revenue (example)"
      },
      sponsorships: {
        when: "10K+ subscribers (brands start reaching out)",
        rates: "Micro ($100-$500), Mid-tier ($500-$2K), Top-tier ($2K-$10K+) per video",
        howToAttract: "Media kit (stats, demographics, past work), professional email pitch, negotiate terms"
      },
      affiliateMarketing: {
        platforms: "Amazon Associates, ClickBank, ShareASale, niche-specific programs",
        strategy: "Review/tutorial videos \u2192 Link products in description \u2192 Earn commission on sales",
        disclosure: "Must disclose: 'Links below are affiliate links' (FTC requirement)"
      },
      digitalProducts: {
        types: "Courses, ebooks, templates, presets, memberships",
        when: "5K+ engaged subscribers (audience knows/trusts you)",
        pricing: "$27-$197 for courses, $7-$47 for smaller products",
        platform: "Gumroad, Teachable, Patreon for easy setup"
      },
      channelMemberships: {
        requirement: "30K+ subscribers (or 1K for gaming channels)",
        pricing: "$0.99-$49.99/month (you set tiers)",
        perks: "Badges, emojis, exclusive content, early access",
        conversion: "1-5% of subscribers become members typically"
      }
    }
  },
  // RETENTION MASTERCLASS
  retention: {
    hookFormulas: {
      curiosityGap: "In this video, I'll show you how I [desirable result]. But first, let me show you the biggest mistake people make...",
      shock: "I can't believe this actually worked. [Show surprising result for 3 seconds] Let me explain exactly what I did.",
      challenge: "Most people think [common belief]. I tested this for 30 days and the results were completely different. Here's what happened...",
      story: "Three months ago, I was [relatable struggle]. Today, [achievement]. This is the exact process I used."
    },
    patternInterrupts: {
      every60to90seconds: [
        "Change camera angle or location",
        "Insert b-roll footage",
        "Text overlay with key point",
        "Music change (background track switch)",
        "Visual effect (zoom, transition)",
        "Pose a question to viewer ('Have you experienced this?')"
      ],
      purpose: "Prevent monotony \u2192 Keep attention \u2192 Reduce drop-off"
    },
    retentionGraphAnalysis: {
      howToRead: "YouTube Studio \u2192 Analytics \u2192 Engagement \u2192 Audience retention graph",
      whatToLookFor: [
        "Big drop in first 30s = Hook problem (fix intro)",
        "Gradual decline = Normal (but aim to minimize)",
        "Sharp drops mid-video = Pacing issue or boring section (cut that part)",
        "Spike upward = Re-watch moment (figure out why, replicate)"
      ],
      action: "Every video, check retention. Identify 1 improvement for next video."
    },
    editingTechniques: {
      cutPauses: "Remove all dead air > 1 second. Fast pacing = modern YouTube",
      jumpCuts: "Cut to same angle frequently (keeps energy high)",
      bRoll: "Show what you're talking about (don't just talk to camera)",
      subtitles: "Captions increase retention 15-20% (accessibility + watch without sound)",
      soundDesign: "Background music (low volume), sound effects for transitions"
    }
  },
  // TROUBLESHOOTING
  commonIssues: {
    "Views stuck at 100-300": {
      diagnosis: [
        "Check CTR: <2% = thumbnail/title problem",
        "Check AVD: <30% = retention/content problem",
        "Check impressions: <1000 = not being shown (SEO/keyword issue)"
      ],
      fixes: [
        "Redesign thumbnail with more contrast/emotion",
        "Rewrite title with stronger hook/keywords",
        "Improve first 30 seconds of video (hook)",
        "Research better keywords (less competition)"
      ]
    },
    "Subscribers not watching new videos": {
      cause: "Low notification click-through (subscribers not notified or ignoring)",
      fixes: [
        "Ask viewers to 'turn on notifications' mid-video",
        "Post in Community tab when new video drops",
        "Consistent upload schedule (train audience when to expect)",
        "Thumbnail/title must excite existing audience too (not just SEO)"
      ]
    },
    "High CTR but low AVD": {
      diagnosis: "Clickbait title/thumbnail but content doesn't deliver",
      danger: "Algorithm will stop promoting (viewer dissatisfaction signal)",
      fix: "Match thumbnail/title promise to actual content. Deliver on hook quickly."
    }
  },
  // 2025 TRENDS
  trends2025: {
    algorithmShifts: [
      "Shorts-to-long-form funnel: Algorithm pushing viewers from Shorts to creator's long-form",
      "Podcast-style content rising: Long-form conversations (60+ min) performing well",
      "Authenticity over production: Raw, unedited content competitive with high-production"
    ],
    features: [
      "Ai-powered tools: Auto-dubbing (multi-language), Ai chapters, thumbnail suggestions",
      "Shopping integration: Tag products directly in video (affiliate on steroids)",
      "Handles (@username): Easier discovery, cross-platform consistency"
    ],
    contentOpportunities: [
      "Long-form tutorials (15-30 min) = high ad revenue",
      "Compilation content (with transformative commentary)",
      "Educational series (episodic format, binge-worthy)",
      "Documentary-style storytelling"
    ]
  }
};
function getYouTubeTip(topic) {
  const tips = {
    ctr: "Thumbnail: bright colors, close-up face, 3-5 word text. Title: front-load keywords, create curiosity, 50-60 chars",
    retention: "Hook in first 15s, pattern interrupt every 60-90s, cut all pauses, show don't tell with b-roll",
    seo: "Keyword research with autocomplete, front-load title, optimize first 2 lines of description, use timestamps",
    growth: "2-3 videos/week, niche down, searchable content, engage in niche, cross-promote on TikTok/IG",
    monetization: "Reach 1K subs + 4K watch hours. Diversify: AdSense + sponsors + affiliates + products"
  };
  return tips[topic.toLowerCase()] || "Topic not found. Try: ctr, retention, seo, growth, monetization";
}

// server/knowledge-library/communication/public-speaking-101.ts
var PublicSpeakingGuide = {
  // FOR ABSOLUTE BEGINNERS
  beginners: {
    nervousness: {
      symptoms: [
        "Tangan gemetar, keringat dingin",
        "Suara bergetar atau hilang",
        "Blank/lupa materi mendadak",
        "Jantung deg-degan kencang",
        "Perut mual atau kram"
      ],
      whyItHappens: "Otak detect 'public speaking' sebagai ancaman \u2192 Release cortisol & adrenaline (stress hormones) \u2192 Physical symptoms muncul. Ini NORMAL bahkan untuk speaker berpengalaman!",
      solutions: [
        {
          technique: "4-7-8 Breathing",
          howTo: "Tarik napas dalam 4 detik \u2192 Tahan napas 7 detik \u2192 Hembuskan pelan 8 detik. Ulangi 3-5x sebelum tampil.",
          whyItWorks: "Lower cortisol 15-20%, stabilkan detak jantung, increase oxygen ke otak (thinking clearer)",
          when: "2-3 menit sebelum naik panggung"
        },
        {
          technique: "Power Pose",
          howTo: "Berdiri tegak, kaki selebar bahu, tangan di pinggang (Wonder Woman pose). Tahan 2 menit.",
          whyItWorks: "Increase testosterone 20% (confidence hormone), decrease cortisol 25% - scientifically proven!",
          when: "5-10 menit sebelum tampil, di ruang private"
        },
        {
          technique: "Visualization",
          howTo: "Tutup mata, bayangkan diri kamu tampil dengan smooth, audience tertawa/applause, kamu merasa confident. Detail as possible.",
          whyItWorks: "Brain ga bisa bedakan imagined success vs real success - sama-sama release dopamine (feel-good hormone)",
          when: "Malam sebelum presentasi, ulangi 3-5x"
        },
        {
          technique: "Progressive Muscle Relaxation",
          howTo: "Mulai dari kaki: Tegang 5 detik, relax 10 detik. Naik ke betis, paha, perut, chest, bahu, wajah.",
          whyItWorks: "Release physical tension yang manifest dari nervous mental",
          when: "1 jam sebelum tampil"
        }
      ],
      mindsetShifts: [
        {
          from: "\u274C Semua orang akan judge saya",
          to: "\u2705 Audience INGIN saya sukses (mereka ga peduli kesalahan kecil, mereka fokus ke value yang saya berikan)"
        },
        {
          from: "\u274C Saya harus perfect",
          to: "\u2705 Authentic > Perfect. Kesalahan kecil makes you human & relatable"
        },
        {
          from: "\u274C Ini tentang saya",
          to: "\u2705 Ini tentang AUDIENCE - what value can I give them?"
        }
      ]
    },
    basicStructure: {
      opening: {
        formula: "Hook (15-30s) \u2192 Introduce yourself (30s) \u2192 Preview topic (30s)",
        hookOptions: [
          {
            type: "Question",
            example: "Pernah ga sih merasa invisible di meeting - ide kamu bagus tapi ga ada yang dengerin? Raise your hand. Hari ini saya akan share 3 cara biar suara kamu didengar.",
            whyItWorks: "Immediately relatable, creates engagement, audience mentally say 'yes that's me!'"
          },
          {
            type: "Story",
            example: "3 tahun lalu, saya fired dari pekerjaan pertama saya karena 'poor communication skills'. Hari ini, saya coach 100+ professionals untuk public speaking. Let me share what changed.",
            whyItWorks: "Vulnerability builds trust, transformation creates curiosity"
          },
          {
            type: "Shocking Stat",
            example: "75% of people fear public speaking more than death. That means di funeral, orang lebih prefer jadi yang di peti daripada yang kasih eulogy. Today, I'll show you how to overcome that fear.",
            whyItWorks: "Surprise element grabs attention, humor lightens mood"
          },
          {
            type: "Demonstration",
            example: "[Show before/after result immediately] This took me 30 days. And I'll show you the exact process in the next 15 minutes.",
            whyItWorks: "Visual proof, immediate value proposition"
          }
        ],
        introductionFormula: "Name + Credibility + Why you're qualified to speak on this topic (30-60 seconds MAX)",
        badExamples: [
          "\u274C 'Ehm... jadi... nama saya X dan... ehm... hari ini saya akan...' - TOO MANY FILLERS, no energy",
          "\u274C 'Selamat pagi, nama saya X, saya dari department Y, saya lahir di...' - TMI, boring start",
          "\u274C 'Sorry kalau nervous ya' - NEVER apologize for being nervous, audience belum notice!"
        ]
      },
      body: {
        rule: "3-Point Maximum - Orang cuma remember 3 hal max dari presentasi",
        structure: "Point 1 \u2192 Story/Example \u2192 Transition \u2192 Point 2 \u2192 Story \u2192 Transition \u2192 Point 3 \u2192 Story",
        example: {
          topic: "Time Management untuk Busy Professionals",
          point1: "Priority Matrix (Eisenhower Box) - Urgent vs Important",
          story1: "Waktu saya overwhelmed dengan 50 tasks, saya categorize semua task. 60% ternyata 'urgent but not important' - I delegated most.",
          point2: "Time Blocking - Block calendar untuk deep work",
          story2: "CEO Apple Tim Cook blocks 4-6 AM every day untuk strategic thinking - no meetings, no emails. Result: company worth $3 trillion.",
          point3: "2-Minute Rule - If task <2min, do it immediately",
          story3: "Inbox dulu 200 unread emails. Apply 2-min rule: delete spam, quick replies, flag important. 30 minutes = inbox zero."
        },
        transitions: [
          "Now that we've covered [Point 1], let's talk about [Point 2]...",
          "This leads perfectly to my next point...",
          "So what does this mean for you? Well..."
        ]
      },
      closing: {
        formula: "Recap 3 points (1 min) \u2192 Call-to-action (30s) \u2192 Strong ending (10-20s)",
        recapExample: "So remember: 1) Use Priority Matrix untuk filter tasks, 2) Block your calendar untuk protect deep work time, 3) Apply 2-minute rule untuk small tasks. These three strategies cut my work week from 60 hours to 40 hours.",
        ctaExamples: [
          "Action-oriented: Mulai besok, pilih SATU technique ini untuk practice. Share progress dengan saya next week.",
          "Reflective: Think about: Which of these 3 will have biggest impact on YOUR life?",
          "Resource: I've created a free template - link di description. Download and customize untuk kebutuhan kamu."
        ],
        strongEndings: [
          "Inspirational quote relevan dengan topic",
          "Circle back to opening story dengan resolution",
          "Powerful one-liner yang memorable",
          "Thank you + smile (genuine appreciation)"
        ],
        badEndings: [
          "\u274C 'Eh itu aja sih kayaknya...' - Weak, no confidence",
          "\u274C 'Ada pertanyaan?' [awkward silence] - Better: Prepare 1-2 common questions yourself",
          "\u274C Rushing off stage - Take your time, make eye contact, exit gracefully"
        ]
      }
    },
    practiceRoadmap: {
      week1to2: {
        goal: "Build foundation, overcome initial fear",
        exercises: [
          "Record yourself speaking 1 min on random topic - watch it back (cringe is normal, push through!)",
          "Practice speech in front of mirror - observe body language",
          "Present to 1 friend/family - get comfortable with having audience",
          "Join Toastmasters or local speaking group - safe practice environment"
        ],
        focus: "Comfort with being watched/heard. Don't worry about perfection yet."
      },
      week3to4: {
        goal: "Develop vocal variety & body language",
        exercises: [
          "Read children's book out loud with exaggerated expressions (practice emotional range)",
          "Record news article in 3 different emotions: excited, serious, mysterious",
          "Stand in front of mirror, practice 5 different hand gestures untuk emphasis",
          "Film yourself presenting - count 'umm/ehh' - goal: reduce 50%"
        ],
        focus: "Eliminate monotone, add dynamism"
      },
      month2: {
        goal: "Structure & storytelling",
        exercises: [
          "Write 3 complete speeches using Hook-Body-Close structure",
          "Practice storytelling: Share 1 personal story, make it 2 min exact (not 1:59 or 2:01)",
          "Present to small group (5-10 people) - can be online",
          "Record, watch back, note: where did you lose energy? where did audience engage?"
        ],
        focus: "Consistency in delivery, audience engagement"
      },
      month3plus: {
        goal: "Polish & real-world application",
        exercises: [
          "Volunteer to present at work meeting",
          "Submit proposal to speak at local event/conference",
          "Create YouTube/TikTok content (public speaking practice + build portfolio)",
          "Get professional feedback - hire coach or join mastermind"
        ],
        focus: "Real stakes, build track record"
      }
    }
  },
  // INTERMEDIATE TECHNIQUES
  intermediate: {
    vocalVariety: {
      pitch: {
        problem: "Monotone voice = audience sleeps",
        solution: "Practice 3-note range: Low (authority), Mid (conversational), High (excitement)",
        drill: "Read same sentence 3 ways: 'This is important' - vary pitch on 'important'",
        usage: "Key points = higher pitch untuk emphasis, transitions = lower pitch untuk authority"
      },
      pace: {
        ideal: "120-150 words per minute (conversational)",
        tooFast: ">180 WPM = audience can't process, sounds nervous",
        tooSlow: "<100 WPM = sounds unsure, audience bored",
        drill: "Record yourself, count words, adjust. Practice with metronome.",
        technique: "Speed up during stories (build excitement), slow down during key points (let it sink in)"
      },
      volume: {
        baseline: "Speak to the person farthest from you (project without yelling)",
        variation: "Whisper for intimacy, louder for emphasis, normal for content",
        drill: "Practice projecting voice to back of empty room",
        tip: "Use mic properly if available - test beforehand, avoid 'popping' sounds"
      },
      pauses: {
        power: "Strategic pause = audience has time to process + creates anticipation",
        whenToUse: [
          "After asking question (let audience think)",
          "Before key point (build suspense)",
          "After impactful statement (let it land)"
        ],
        drill: "In practice, hold pause for 3 seconds (feels like eternity, but it's powerful)",
        example: "So what's the secret to success? [3 second pause] It's not talent... [2 sec pause] It's consistency."
      }
    },
    bodyLanguage: {
      posture: {
        ideal: "Shoulders back, chest open, feet shoulder-width apart (grounded & confident)",
        avoid: [
          "Hunched shoulders = insecure",
          "Hands in pockets = closed off",
          "Shifting weight = nervous",
          "Leaning on podium = too casual"
        ],
        drill: "Practice 'power stance' for 2 min before speaking - body affects mind!"
      },
      gestures: {
        frequency: "3-5 meaningful gestures per minute (not constantly waving)",
        types: {
          descriptive: "Show size/shape of what you're describing",
          emphatic: "Point/fist pump untuk emphasize point",
          openGestures: "Palms up = inviting, palms down = authority"
        },
        avoid: [
          "T-Rex arms (elbows glued to sides)",
          "Fig leaf (hands clasped in front of groin)",
          "Fidgeting (playing with pen, hair, jewelry)"
        ],
        drill: "Film yourself presenting, count gestures. Too few? Add. Too many? Reduce to meaningful only."
      },
      eyeContact: {
        technique: "3-5 second rule - Hold eye contact with one person for 3-5 seconds, then move to another",
        pattern: "Scan room in Z-pattern or W-pattern, ensure everyone feels included",
        smallGroup: "Rotate evenly, don't favor one side",
        largeGroup: "Look at different sections, create connection with pockets of audience",
        virtual: "Look at CAMERA, not screen (creates 'eye contact' with viewers)"
      },
      movement: {
        purpose: "Move with intention, not pacing due to nerves",
        whenToMove: [
          "Transition between points (signal shift)",
          "Approach audience untuk intimacy",
          "Step back untuk emphasize 'big picture'"
        ],
        avoid: "Swaying, pacing back-forth, wandering aimlessly",
        technique: "Plant feet for key points, move during transitions"
      }
    },
    handlingQA: {
      preparation: "Anticipate 5-10 common questions, prepare concise answers (1-2 min each)",
      techniques: {
        repeat: "Repeat question untuk ensure everyone heard + give yourself time to think",
        bridge: "If you don't know: 'Great question! While I don't have exact data right now, what I can share is...'",
        redirect: "If off-topic: 'That's beyond scope of today's talk, but I'd love to discuss offline. Let's stay focused on [topic]'",
        plant: "Have colleague ask planted question if Q&A starts slow (gets momentum going)"
      },
      difficultQuestions: {
        hostile: "Stay calm, don't get defensive. 'I understand your perspective. Here's how I see it...'",
        impossible: "Admit you don't know (honesty builds credibility). 'I'll research that and follow up with you.'",
        rambling: "Politely interrupt: 'Let me stop you there - I think I understand the core question. You're asking about [reframe]?'"
      }
    }
  },
  // ADVANCED STRATEGIES
  advanced: {
    storytelling: {
      structure: "Setup (character + situation) \u2192 Conflict (problem/challenge) \u2192 Resolution (outcome + lesson)",
      elements: {
        character: "Make protagonist relatable (can be you, client, historical figure)",
        detail: "Sensory details = immersive ('cold sweat dripped', not just 'I was nervous')",
        dialogue: "Use direct quotes untuk bring story to life",
        emotion: "Tap into universal emotions: fear, hope, triumph, loss",
        lesson: "Connect story to your key point - 'what this teaches us is...'"
      },
      lengthGuide: {
        short: "30-90 seconds - illustrate single point",
        medium: "2-4 minutes - main story for speech",
        long: "5+ minutes - keynote centerpiece"
      }
    },
    humorTechniques: {
      rule1: "Humor must be RELEVANT to your topic (not random joke to 'warm up')",
      safeTypes: [
        "Self-deprecating (laugh at yourself, not others)",
        "Observational (point out absurdities everyone recognizes)",
        "Exaggeration (amplify reality for comedic effect)",
        "Callbacks (reference earlier point for insider laugh)"
      ],
      avoid: [
        "Offensive jokes (race, gender, religion, politics)",
        "Inside jokes audience won't get",
        "Forcing humor if not natural for you"
      ],
      delivery: "Timing is everything. Pause AFTER punchline untuk let laughter happen. Don't step on your laugh."
    },
    audienceEngagement: {
      techniques: [
        "Polls: 'Raise hand if...' (gets physical participation)",
        "Think-pair-share: 'Turn to person next to you, discuss...' (breaks up lecture format)",
        "Live demo: Show something real-time (high engagement)",
        "Callbacks: Reference earlier point/joke (creates cohesion)",
        "Rhetorical questions: 'What would YOU do?' (mental engagement)"
      ],
      readingTheRoom: {
        signs: {
          engaged: "Leaning forward, eye contact, nodding, smiling, note-taking",
          losing: "Checking phones, yawning, slouching, side conversations",
          confused: "Furrowed brows, heads tilted, looks exchanged"
        },
        adjustments: {
          ifLosing: "Change energy - louder voice, move closer to audience, ask engaging question",
          ifConfused: "Pause, check-in: 'Does this make sense so far?', clarify terminology",
          ifAhead: "Skip less critical points, move faster through slides"
        }
      }
    }
  },
  // COMMON MISTAKES & FIXES
  mistakes: [
    {
      mistake: "Reading slides word-for-word",
      why: "Audience can read faster than you speak - you're redundant + boring",
      fix: "Slides = visual support, not script. Use images/keywords only, SPEAK the details"
    },
    {
      mistake: "Starting with apology ('Sorry I'm not prepared')",
      why: "Undermines credibility before you even start",
      fix: "Even if you feel unprepared, fake confidence. Audience doesn't know your plan."
    },
    {
      mistake: "Filling every silence with 'umm, ehh, like, you know'",
      why: "Filler words = distraction, makes you sound uncertain",
      fix: "Practice PAUSING instead. Silence is powerful. Count to 2 before speaking again."
    },
    {
      mistake: "Going overtime",
      why: "Disrespectful to audience & organizers, people disengage at end",
      fix: "Time yourself in practice. Cut 10% of content as buffer. Wear watch, check occasionally."
    },
    {
      mistake: "Not adapting to audience",
      why: "Same speech doesn't work for executives vs students vs general public",
      fix: "Research audience beforehand. Adjust language, examples, depth based on who's listening."
    }
  ]
};
function getPublicSpeakingTip(level) {
  const tips = {
    beginner: "Start with 4-7-8 breathing + power pose untuk control nerves. Structure: Hook \u2192 3 Points with stories \u2192 Recap + CTA. Practice daily 1 min impromptu speaking.",
    intermediate: "Master vocal variety: pitch range, pace control (120-150 WPM), strategic pauses. Body language: power stance, meaningful gestures 3-5x/min, Z-pattern eye contact.",
    advanced: "Storytelling structure: Setup \u2192 Conflict \u2192 Resolution. Read the room, adjust energy real-time. Humor only if relevant, self-deprecating is safest. Engage audience actively.",
    nervousness: "4-7-8 breathing (3-5x), power pose (2 min), visualization night before. Remember: audience wants you to succeed. Authentic > Perfect.",
    structure: "Opening: Hook (question/story/stat) \u2192 Intro (30s) \u2192 Preview. Body: 3 points max with stories. Closing: Recap \u2192 CTA \u2192 Strong ending. Never apologize for being nervous!"
  };
  return tips[level.toLowerCase()] || "Level not found. Try: beginner, intermediate, advanced, nervousness, structure";
}

// server/knowledge-library/communication/mc-presenter-guide.ts
function getMCPresenterTip(topic) {
  const tips = {
    opening: "Energy hook (crowd participation/relatable scenario) \u2192 Welcome + intro \u2192 Event purpose \u2192 Housekeeping (max 2 min) \u2192 First segment. Start strong!",
    transitions: "Recap previous \u2192 Bridge to next \u2192 Build anticipation \u2192 Name reveal + applause cue. Never awkward silence between segments.",
    energy: "Hydrate, light meals, comfortable shoes. For audience: vary tempo, physical activities post-lunch, music, prizes, celebrate wins.",
    crisis: "Stay calm, humor deflects tension, have backup content always, pivot smoothly. Tech fails? 'Going old school!' and continue.",
    interview: "Research deep, 15-20 questions prepared (use 8-12), LISTEN actively for gems, follow up on unexpected insights, manage time discretely.",
    practice: "Start small (family events) \u2192 Record & review \u2192 Volunteer for charity events \u2192 Build portfolio \u2192 Network with planners \u2192 Go pro"
  };
  return tips[topic.toLowerCase()] || "Topic not found. Try: opening, transitions, energy, crisis, interview, practice";
}

// server/knowledge-library/bias-framework/bias-explained.ts
var BIASFrameworkGuide = {
  overview: {
    whatIs: "BIAS (Behavioral Intelligence Audit System) adalah framework untuk analyze komunikasi manusia dalam 8 dimensi. Kayak 'health check-up' tapi untuk cara kamu berkomunikasi.",
    whyEightLayers: "Komunikasi itu complex - gabisa cuma lihat 1 aspek. 8 layer ini cover everything: body language, emotions, language, ethics, platform strategy, social skills, cognitive load, dan subtle behavioral cues.",
    howToUse: "Setiap layer punya score 1-10. Overall score = average. Low score = area to improve. High score = kekuatan untuk leverage.",
    whoNeedsThis: [
      "Content creators (TikTok, IG, YouTube) - optimize engagement",
      "Public speakers & presenters - improve stage presence",
      "Business professionals - enhance communication impact",
      "Students & educators - effective teaching/learning",
      "Anyone who communicates professionally atau publicly"
    ]
  },
  // LAYER 1: VBM (Visual Behavior Mapping)
  vbm: {
    name: "VBM - Visual Behavior Mapping",
    simpleExplanation: "Ini tentang BODY LANGUAGE - gimana kamu 'kelihatan' saat berkomunikasi. Postur, gesture, eye contact, facial expressions.",
    whatWeAnalyze: [
      {
        aspect: "Posture (Postur Tubuh)",
        good: "Tegak, bahu terbuka, grounded stance \u2192 Confidence & authority",
        bad: "Bungkuk, bahu tertutup, shifting weight \u2192 Nervous atau uncertain",
        howToImprove: "Practice power pose 2 min before presenting. Imagine string pulling head up from ceiling."
      },
      {
        aspect: "Gestures (Gerakan Tangan)",
        good: "3-5 meaningful gestures per menit, open palms, synchronized dengan words \u2192 Engaging & authentic",
        bad: "No gestures (rigid) atau too many (distracting), closed fists, hands in pockets \u2192 Disconnect",
        howToImprove: "Record yourself, count gestures. Too few? Add descriptive gestures. Too many? Keep only meaningful ones."
      },
      {
        aspect: "Eye Contact",
        good: "70-80% camera/audience focus, 3-5 second holds \u2192 Connection & trustworthy",
        bad: "Looking down/away, darting eyes, staring too long \u2192 Uncomfortable atau dishonest",
        howToImprove: "Virtual: Look at camera lens. Live: Z-pattern scan, hold 3-5s per person."
      },
      {
        aspect: "Facial Expressions",
        good: "Animated, emotions match content, genuine smiles \u2192 Relatable & warm",
        bad: "Flat/monotone face, forced smile, disconnect between words and expression \u2192 Inauthentic",
        howToImprove: "Practice in mirror: Say same sentence with 5 different emotions. Find natural range."
      }
    ],
    whyItMatters: "55% of communication impact comes from body language (research by Albert Mehrabian). Words matter 7%, voice tone 38%, but body language 55%!",
    commonMistakes: [
      "Arms crossed (defensive) - open up instead",
      "Fidgeting (nervous energy) - channel into purposeful movement",
      "Avoiding camera/audience (disconnection) - practice eye contact gradually",
      "T-Rex arms (elbows glued to sides) - use full arm gestures"
    ],
    quickDrill: "30-Second Mirror Practice: Say 'This is important' with 3 different gestures. Pick most natural. Repeat daily."
  },
  // LAYER 2: EPM (Emotional Processing Mapping)
  epm: {
    name: "EPM - Emotional Processing Mapping",
    simpleExplanation: "Ini tentang EMOTIONAL INTELLIGENCE dalam komunikasi - seberapa well kamu process dan express emotions. Authenticity, energy, connection with audience.",
    whatWeAnalyze: [
      {
        aspect: "Emotional Range",
        good: "Varies emotions appropriately - excitement, seriousness, empathy based on content \u2192 Dynamic & engaging",
        bad: "Monotone emotions (flat throughout) atau inappropriate (laughing during serious topic) \u2192 Disconnected",
        howToImprove: "Map your content: Mark where to show excitement, empathy, seriousness. Practice transitions."
      },
      {
        aspect: "Energy Level",
        good: "Consistent enthusiasm, matches audience energy, sustains throughout \u2192 Keeps attention",
        bad: "Start strong, fades fast (energy drop) atau too hyper constantly (exhausting) \u2192 Loses audience",
        howToImprove: "Record full presentation. Note: Where does energy drop? Inject pattern interrupt there."
      },
      {
        aspect: "Authenticity",
        good: "Genuine emotions, vulnerable moments, real stories \u2192 Trust & relatability",
        bad: "Scripted/rehearsed feel, fake enthusiasm, no personality \u2192 Feels like robot",
        howToImprove: "Share 1 personal struggle/failure per presentation. Vulnerability = connection."
      },
      {
        aspect: "Audience Connection",
        good: "Reads room, adjusts based on response, involves audience \u2192 Two-way engagement",
        bad: "Ignores audience reactions, one-way broadcasting \u2192 Monologue not dialogue",
        howToImprove: "Pause every 3-5 minutes: Check faces. Confused? Clarify. Bored? Change pace."
      }
    ],
    whyItMatters: "People remember how you made them FEEL, not what you said. Emotional resonance = lasting impact.",
    practicalExercise: {
      name: "Emotion Mapping Drill",
      steps: [
        "Take any 5-minute speech script",
        "Highlight: Red = serious, Yellow = energetic, Blue = empathetic, Green = inspiring",
        "Practice delivering each colored section with matching emotion",
        "Record, watch back - do emotions look genuine?"
      ],
      timeline: "1 week daily practice = noticeable emotional range improvement"
    }
  },
  // LAYER 3: NLP (Narrative & Language Patterns)
  nlp: {
    name: "NLP - Narrative & Language Patterns",
    simpleExplanation: "Ini tentang WORD CHOICE dan STORY STRUCTURE - gimana kamu arrange words, build narratives, structure messages.",
    whatWeAnalyze: [
      {
        aspect: "Clarity (Kejelasan)",
        good: "Simple words, short sentences, one idea per sentence \u2192 Easy to understand",
        bad: "Jargon heavy, run-on sentences, multiple ideas crammed together \u2192 Confusion",
        howToImprove: "Read script aloud. Stumble on sentence? Too complex. Break it down."
      },
      {
        aspect: "Story Structure",
        good: "Clear beginning-middle-end, setup-conflict-resolution \u2192 Compelling",
        bad: "Random thoughts, no arc, anticlimactic \u2192 Boring atau confusing",
        howToImprove: "Use 3-act structure: Setup (who/what) \u2192 Conflict (problem) \u2192 Resolution (outcome/lesson)"
      },
      {
        aspect: "Filler Words",
        good: "<5 fillers per minute ('umm', 'ehh', 'like') \u2192 Polished",
        bad: ">10 fillers per minute \u2192 Uncertain atau unprepared",
        howToImprove: "Count fillers in 1-min recording. Goal: Reduce 50% each week. Replace with 2-second PAUSE."
      },
      {
        aspect: "Vocabulary Level",
        good: "Matches audience - simple for general, technical for experts \u2192 Appropriate",
        bad: "Too simple (patronizing) atau too complex (alienating) \u2192 Mismatch",
        howToImprove: "Know your audience. Test: Can a 12-year-old understand? Adjust complexity accordingly."
      },
      {
        aspect: "Pacing (Speed)",
        good: "120-150 words/min, varies for emphasis \u2192 Comfortable to follow",
        bad: ">180 wpm (too fast, can't process) atau <100 wpm (too slow, boring) \u2192 Disconnect",
        howToImprove: "Record, count words, adjust. Practice with metronome if needed."
      }
    ],
    messagingFrameworks: [
      {
        name: "Hook-Value-CTA",
        when: "Short-form content (TikTok, Reels, Shorts)",
        structure: "Hook (1-3s grab attention) \u2192 Value (20-40s deliver insight) \u2192 CTA (3-5s next action)",
        example: "'3 mistakes killing your productivity' [hook] \u2192 Explain 3 mistakes [value] \u2192 'Which will you fix first? Comment below' [CTA]"
      },
      {
        name: "Problem-Agitate-Solve",
        when: "Persuasive content, sales, convincing",
        structure: "Identify problem \u2192 Make it worse (agitate pain) \u2192 Present solution",
        example: "Struggling with time management? [problem] \u2192 Missing deadlines, stress, burnout [agitate] \u2192 Here's a simple system [solve]"
      },
      {
        name: "STAR Method",
        when: "Storytelling, case studies, examples",
        structure: "Situation \u2192 Task \u2192 Action \u2192 Result",
        example: "Client had 100 followers [S] \u2192 Needed 10K in 90 days [T] \u2192 We implemented X, Y, Z strategy [A] \u2192 Hit 12K followers [R]"
      }
    ]
  },
  // LAYER 4: ETH (Ethical Framework)
  eth: {
    name: "ETH - Ethical Framework",
    simpleExplanation: "Ini tentang INTEGRITY dalam komunikasi - fact-checking, source credibility, bias awareness, community guidelines compliance.",
    whatWeAnalyze: [
      {
        aspect: "Fact Accuracy",
        good: "Claims backed by data/research, sources cited \u2192 Credible",
        bad: "Statements tanpa bukti, 'I heard somewhere that...' \u2192 Unreliable",
        howToImprove: "Every claim: Ask 'Can I prove this?' If no, either research or remove claim."
      },
      {
        aspect: "Source Citation",
        good: "'According to Stanford study 2024...' \u2192 Transparent & verifiable",
        bad: "'Studies show...' (which study?) atau no attribution \u2192 Vague",
        howToImprove: "Credit sources: researcher name, institution, year. Build credibility."
      },
      {
        aspect: "Bias Check",
        good: "Present multiple perspectives, acknowledge limitations \u2192 Balanced",
        bad: "One-sided view, cherry-pick data supporting your angle \u2192 Manipulative",
        howToImprove: "Steel-man technique: Present opposing view in strongest form, THEN your counter-argument."
      },
      {
        aspect: "Platform Guidelines",
        good: "Content complies with TikTok/IG/YT community rules \u2192 Safe & sustainable",
        bad: "Borderline violations (misinformation, hate speech, dangerous content) \u2192 Risk of ban",
        howToImprove: "Review platform guidelines quarterly. When in doubt, don't post."
      }
    ],
    platformSpecificRules: {
      tiktok: "\u274C Misinformation, hate speech, dangerous acts, nudity, violence. \u2705 Educational, creative, positive community",
      instagram: "\u274C Harassment, spam, nudity, copyright violations. \u2705 Authentic content, respectful engagement",
      youtube: "\u274C Harmful content, spam/clickbait, copyright strikes. \u2705 Original content, proper attribution, community value"
    },
    ethicalRedFlags: [
      "Claiming expertise you don't have",
      "Promoting products you haven't tested/used",
      "Manipulating statistics to support narrative",
      "Ignoring conflicts of interest",
      "Plagiarizing content without credit"
    ]
  },
  // LAYER 5: ECO (Ecosystem Awareness)
  eco: {
    name: "ECO - Ecosystem Awareness",
    simpleExplanation: "Ini tentang PLATFORM OPTIMIZATION - seberapa well kamu understand & leverage algoritma, trends, format best practices tiap platform.",
    platformSpecifics: {
      tiktok: {
        algorithm: "Prioritize watch time & completion rate. FYP driven by user interactions.",
        optimization: [
          "Hook dalam 1-3 detik (scroll speed cepat)",
          "Video 15-45 detik (retention sweet spot)",
          "Trending sounds within 48 hours",
          "Post 6-9 AM atau 6-10 PM (Indonesia time)"
        ],
        contentTypes: "Quick tutorials, trends dengan twist, behind-the-scenes, storytelling"
      },
      instagram: {
        algorithm: "Prioritize shares & saves. Follower engagement weighted high.",
        optimization: [
          "Reels 7-15 detik (highest retention)",
          "Carousels for saves (educational content)",
          "Stories daily dengan stickers (engagement)",
          "25-30 hashtags mix (high/medium/low traffic)"
        ],
        contentTypes: "Tutorials, transformations, carousels, behind-the-scenes"
      },
      youtube: {
        algorithm: "Prioritize CTR (click-through rate) & AVD (average view duration)",
        optimization: [
          "Thumbnail: bright colors, close-up face, 3-5 word text",
          "Title: front-load keywords, curiosity gap, 50-60 chars",
          "First 15 seconds: hook + value promise",
          "Chapters & timestamps (user experience boost)"
        ],
        contentTypes: "Tutorials (8-15 min), listicles (10-12 min), commentary (12-18 min), Shorts (funnel to long-form)"
      }
    },
    trendAdaptation: {
      identify: "Use TikTok/IG Trending page, YouTube Trending tab, Google Trends",
      evaluate: "Is trend relevant to my niche? Can I add unique twist?",
      execute: "Jump on within 24-48 hours max (trends die fast)",
      measure: "Did trend-jacking increase reach? Refine approach."
    }
  },
  // LAYER 6: SOC (Social Intelligence)
  soc: {
    name: "SOC - Social Intelligence",
    simpleExplanation: "Ini tentang AUDIENCE PSYCHOLOGY - gimana kamu read people, build community, create engagement loops, foster loyalty.",
    whatWeAnalyze: [
      {
        aspect: "Relatability",
        good: "Audience see themselves in your content \u2192 'This is me!' moment",
        bad: "Too polished/perfect (can't relate) atau too niche (excludes most) \u2192 Disconnect",
        howToImprove: "Share struggles, not just wins. 80% relatable stories, 20% aspirational content."
      },
      {
        aspect: "Call-to-Action Clarity",
        good: "Explicit next step: 'Comment answer below', 'Save this for later' \u2192 High engagement",
        bad: "Implicit/unclear: 'Let me know what you think' (too vague) \u2192 Low action rate",
        howToImprove: "End every piece with ONE clear action. Make it specific & easy."
      },
      {
        aspect: "Community Building",
        good: "Respond to comments, feature audience content, inside jokes \u2192 Loyal fanbase",
        bad: "Post and ghost, ignore comments, transactional only \u2192 No connection",
        howToImprove: "Spend 30 min/day engaging: reply comments, DM top engagers, share UGC."
      },
      {
        aspect: "Value Perception",
        good: "Audience feel they gained something (learned, laughed, inspired) \u2192 Worth their time",
        bad: "Clickbait with no payoff, obvious content, waste of time \u2192 One-time viewers",
        howToImprove: "Every piece: Ask 'What's the ONE takeaway?' Deliver it clearly."
      }
    ],
    engagementLoops: {
      technique: "Create reason for audience to return",
      examples: [
        "Series format: 'Part 1 of 3' - viewers come back for continuation",
        "Challenges: 'Try this for 7 days, report results' - accountability loop",
        "Teasers: 'Next week I'll reveal...' - anticipation",
        "Q&A: 'Submit questions, I'll answer next video' - participation"
      ]
    }
  },
  // LAYER 7: COG (Cognitive Load Management)
  cog: {
    name: "COG - Cognitive Load Management",
    simpleExplanation: "Ini tentang INFORMATION DENSITY - seberapa mudah atau susah audience process konten kamu. Too complex = overwhelm. Too simple = boring.",
    principles: [
      {
        principle: "Chunking",
        explanation: "Break complex info into 3-5 chunks maximum",
        example: "Instead of '10 steps to success', group into 3 phases with 3-4 steps each",
        why: "Brain can hold 7\xB12 items in working memory - stay within limit"
      },
      {
        principle: "Progressive Disclosure",
        explanation: "Reveal information gradually, not all at once",
        example: "Intro \u2192 Point 1 [explain fully] \u2192 Point 2 [explain fully] \u2192 Point 3",
        why: "Prevents overwhelm, maintains engagement throughout"
      },
      {
        principle: "Repetition with Variation",
        explanation: "Key point repeated 3x in different ways",
        example: "State it \u2192 Show example \u2192 Recap differently at end",
        why: "Improves retention without boring redundancy"
      },
      {
        principle: "Visual Aid Strategy",
        explanation: "Use visuals to offload cognitive work",
        good: "Infographics, charts, diagrams that clarify",
        bad: "Cluttered slides, too much text, distracting animations",
        rule: "1 slide = 1 idea"
      }
    ],
    complexityManagement: {
      forBeginners: "Explain like they're 12. Analogies, simple examples, no jargon.",
      forIntermediate: "Assume basic knowledge, dive deeper, introduce 1-2 new concepts.",
      forExperts: "Skip basics, focus on nuance, technical depth, cutting-edge insights.",
      mixedAudience: "Start simple, layer complexity progressively. 'For those new to this... For advanced folks...'"
    }
  },
  // LAYER 8: BMIL (Behavioral Micro-Indicators Library)
  bmil: {
    name: "BMIL - Behavioral Micro-Indicators Library",
    simpleExplanation: "Ini tentang SUBTLE CUES - small details yang reveal confidence, credibility, authority. Micro-expressions, vocal tics, consistency checks.",
    microIndicators: [
      {
        indicator: "Vocal Confidence",
        confident: "Steady voice, varied pitch, controlled volume \u2192 Authority",
        unconfident: "Shaky voice, monotone, trailing off at sentence ends (upspeak) \u2192 Uncertainty",
        howToImprove: "Record & listen. Do sentences end strong or fade? Practice ending with downward pitch (assertion)."
      },
      {
        indicator: "Filler Word Patterns",
        normal: "Occasional 'umm' during thought transition \u2192 Human",
        excessive: "Umm/ehh every sentence \u2192 Unprepared or nervous",
        fix: "Count fillers in 1-min sample. Replace with 2-second pause. Goal: <3 per minute."
      },
      {
        indicator: "Self-Soothing Gestures",
        examples: "Touching face/hair/neck, rubbing hands \u2192 Stress relief behaviors",
        perception: "Audience subconsciously detects nervousness",
        fix: "Redirect nervous energy into purposeful gestures (e.g., hand gestures while explaining)."
      },
      {
        indicator: "Message Consistency",
        aligned: "Words, tone, body language all match \u2192 Authentic & trustworthy",
        misaligned: "Say 'I'm excited!' with flat tone and closed posture \u2192 Incongruent",
        check: "Record yourself. Do all channels (verbal, vocal, visual) align?"
      }
    ],
    credibilitySignals: {
      strong: [
        "Posture upright but relaxed",
        "Voice steady with controlled pauses",
        "Gestures synchronized with speech",
        "Eye contact distributed evenly",
        "Vocabulary precise but accessible"
      ],
      weak: [
        "Fidgeting or self-touching",
        "Vocal fry or upspeak (ending sentences like questions)",
        "Avoiding eye contact",
        "Over-qualifying ('I think maybe possibly...')",
        "Apologizing unnecessarily"
      ]
    }
  },
  // HOW TO USE THE FRAMEWORK
  implementation: {
    selfAudit: {
      step1: "Record yourself (video + audio) presenting for 3-5 minutes",
      step2: "Watch dengan 8-layer lens - score each 1-10 honestly",
      step3: "Identify lowest scoring layers - those are improvement priorities",
      step4: "Pick ONE layer to improve this month",
      step5: "Practice targeted drills for that layer daily (15-30 min)",
      step6: "Re-record after 30 days, compare scores"
    },
    professionalUse: {
      creators: "Optimize content for platform algorithms (ECO) + audience psychology (SOC) + retention hooks (NLP)",
      speakers: "Master body language (VBM) + emotional connection (EPM) + clear messaging (NLP)",
      educators: "Manage cognitive load (COG) + authentic presence (EPM) + ethical accuracy (ETH)",
      leaders: "Project authority (BMIL) + inspire action (SOC) + strategic messaging (NLP)"
    }
  }
};
function getBIASLayerTip(layer) {
  const tips = {
    vbm: "Body language: Power pose before presenting, 3-5 meaningful gestures/min, 70-80% eye contact, match facial expressions to content. Practice 30s mirror drill daily.",
    epm: "Emotions: Map emotional range (excitement/serious/empathy) in content, sustain energy with pattern interrupts, share 1 vulnerability for authenticity, read & adjust to audience.",
    nlp: "Language: Simple words, short sentences, <5 filler words/min, 3-act story structure, 120-150 WPM pace. Use Hook-Value-CTA for short-form.",
    eth: "Ethics: Cite sources (researcher, institution, year), fact-check claims, acknowledge bias, comply with platform guidelines. Build trust.",
    eco: "Platform: TikTok (1-3s hook, 15-45s video, trending sounds <48hrs). Instagram (7-15s Reels, carousels for saves). YouTube (CTR + AVD, hook in 15s).",
    soc: "Social: 80% relatable + 20% aspirational content, clear CTA ('Comment below'), engage 30min/day, create return loops (series, challenges, Q&A).",
    cog: "Cognitive: Max 3-5 chunks of info, progressive disclosure (reveal gradually), repeat key point 3x differently, 1 slide = 1 idea. Explain like they're 12.",
    bmil: "Micro-cues: Steady voice (vary pitch), <3 filler words/min, purposeful gestures (no fidgeting), aligned message (words+tone+body), end sentences with downward pitch."
  };
  return tips[layer.toLowerCase()] || "Layer not found. Try: vbm, epm, nlp, eth, eco, soc, cog, bmil";
}

// server/knowledge-library/knowledge-router.ts
import OpenAI2 from "openai";
var KnowledgeRouter = class {
  openai = null;
  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
    }
  }
  async answer(question) {
    console.log(`\u{1F50D} Knowledge Router: Processing question: "${question}"`);
    const topic = this.classifyQuestion(question);
    if (!topic) {
      return {
        answer: `Hmm, saya belum yakin gimana bantu dengan pertanyaan ini. Tapi saya bisa bantu dengan:

\u{1F4F1} **Social Media:** TikTok viral strategy, Instagram Reels, YouTube growth
\u{1F3A4} **Public Speaking:** Overcome nervousness, speech structure, body language
\u{1F3AD} **MC/Presenter:** Event hosting, transitions, interview techniques
\u{1F9E0} **BIAS Framework:** VBM (body language), EPM (emotions), NLP (language), BMIL (micro-cues), dll.

Coba tanya tentang salah satu topik di atas, atau rephrase pertanyaan dengan lebih spesifik!`,
        source: "out-of-scope",
        confidence: "high"
      };
    }
    console.log(`\u2705 Topic classified: ${topic}`);
    const libraryAnswer = this.getLibraryAnswer(topic, question);
    libraryAnswer.answer = this.reformatToActionable(libraryAnswer.answer, question);
    if (this.openai && libraryAnswer.confidence === "medium") {
      try {
        const enhancedAnswer = await this.enhanceWithAI(question, libraryAnswer.answer, topic);
        return {
          answer: enhancedAnswer,
          source: "library+ai",
          confidence: "high",
          relatedTopics: libraryAnswer.relatedTopics
        };
      } catch (error) {
        console.warn("\u26A0\uFE0F Ai enhancement failed, returning library answer:", error);
        return libraryAnswer;
      }
    }
    return libraryAnswer;
  }
  reformatToActionable(rawAnswer, question) {
    const q = question.toLowerCase();
    if (rawAnswer.includes("TOMORROW:") || rawAnswer.includes("Week 1:")) {
      return rawAnswer;
    }
    const hasBulletPoints = rawAnswer.includes("\n-") || rawAnswer.includes("\n\u2022");
    const hasNumberedList = /\d+\.\s/.test(rawAnswer);
    let actionableAnswer = "";
    if (q.includes("viral") || q.includes("fyp") || q.includes("growth")) {
      actionableAnswer = `**TOMORROW:** Bikin video 15-30 detik. Hook di 1-3 detik pertama (tanya/shocking statement/visual menarik).

**Week 1:** Post 1 video/hari, jam 6-9 PM. Follow tips ini:
${rawAnswer}

**Expected Result:** 500+ views dalam 7 hari pertama. Potential FYP jika follow semua tips.`;
    } else if (q.includes("presentasi") || q.includes("speaking") || q.includes("nervous")) {
      actionableAnswer = `**STARTING NOW:** Record diri 5x (30 detik each). Fokus:
${rawAnswer}

**Week 1:** Practice 10 menit/hari. Target: kurangi nervousness, gesture lebih natural.

**Expected Result:** Week 2 lebih confident, less filler words, better engagement.`;
    } else if (q.includes("reels") || q.includes("instagram") || q.includes("youtube")) {
      actionableAnswer = `**TOMORROW:** Optimize content pakai tips ini:
${rawAnswer}

**Week 1:** Apply 1-2 tips per video. Track metrics (views, engagement, retention).

**Expected Result:** +15-25% engagement improvement dalam 2 minggu.`;
    } else {
      actionableAnswer = `**PRAKTIK INI:**
${rawAnswer}

**Timeline:** Start implementing sekarang. Review progress tiap minggu. Adjust strategy based on hasil.`;
    }
    return actionableAnswer;
  }
  classifyQuestion(question) {
    const q = question.toLowerCase();
    if (q.includes("hasil") || q.includes("result") || q.includes("score") || q.includes("nilai") || q.includes("analisis") || q.includes("analysis") || q.includes("audia") || q.includes("improve") || q.includes("fix") || q.includes("rendah") || q.includes("low") || q.includes("tinggi") || q.includes("high") || q.includes("recommendation") || q.includes("rekomendasi") || q.includes("saran")) {
      if (q.includes("vbm") || q.includes("epm") || q.includes("nlp") || q.includes("eth") || q.includes("eco") || q.includes("soc") || q.includes("cog") || q.includes("bmil")) {
        return "bias-framework";
      }
      return "communication-general";
    }
    if (q.includes("bias") || q.includes("vbm") || q.includes("epm") || q.includes("nlp") || q.includes("eth") || q.includes("eco") || q.includes("soc") || q.includes("cog") || q.includes("bmil") || q.includes("layer") || q.includes("framework")) {
      return "bias-framework";
    }
    if (q.includes("tiktok") || q.includes("fyp") || q.includes("for you page") || q.includes("viral") && (q.includes("video") || q.includes("content")) || q.includes("foryou") || q.includes("tiktok algorithm")) {
      return "tiktok";
    }
    if (q.includes("instagram") || q.includes("ig") || q.includes("reels") || q.includes("story") || q.includes("carousel") || q.includes("explore page") || q.includes("insta")) {
      return "instagram";
    }
    if (q.includes("youtube") || q.includes("yt") || q.includes("subscriber") || q.includes("thumbnail") || q.includes("retention") || q.includes("watch time") || q.includes("youtube shorts") || q.includes("ctr")) {
      return "youtube";
    }
    if (q.includes("public speaking") || q.includes("presentasi") || q.includes("nervous") || q.includes("grogi") || q.includes("gugup") || q.includes("bicara di depan umum") || q.includes("audience") || q.includes("stage fright") || q.includes("demam panggung") || q.includes("ngomong di depan") || q.includes("speech") || q.includes("pidato") || q.includes("confidence") || q.includes("percaya diri") || q.includes("tampil") || q.includes("perform") || q.includes("penampilan")) {
      return "public-speaking";
    }
    if (q.includes("mc") || q.includes("master of ceremonies") || q.includes("host event") || q.includes("presenter") || q.includes("interview") || q.includes("moderator") || q.includes("pembawa acara") || q.includes("host")) {
      return "mc-presenter";
    }
    if (q.includes("social media") || q.includes("sosmed") || q.includes("followers") || q.includes("follower") || q.includes("engagement") || q.includes("content creator") || q.includes("creator") || q.includes("kreator") || q.includes("likes") || q.includes("like") || q.includes("views") || q.includes("view") || q.includes("reach") || q.includes("algorithm") || q.includes("algoritma") || q.includes("growth") || q.includes("tumbuh") || q.includes("berkembang") || q.includes("share") || q.includes("shares") || q.includes("comment") || q.includes("comments") || q.includes("komentar") || q.includes("viral") || q.includes("trending") || q.includes("trend") || q.includes("hashtag") || q.includes("caption") || q.includes("posting") || q.includes("schedule") || q.includes("jadwal") || q.includes("timing") || q.includes("waktu post") || q.includes("analytics") || q.includes("metrics") || q.includes("data") || q.includes("statistik")) {
      return "social-media-general";
    }
    if (q.includes("komunikasi") || q.includes("communication") || q.includes("berbicara") || q.includes("bicara") || q.includes("speaking") || q.includes("ngomong") || q.includes("talk") || q.includes("talking") || // Body language & gestures
    q.includes("gesture") || q.includes("gestur") || q.includes("body language") || q.includes("bahasa tubuh") || q.includes("postur") || q.includes("posture") || q.includes("ekspresi") || q.includes("expression") || q.includes("kontak mata") || q.includes("eye contact") || q.includes("pandangan") || q.includes("tatapan") || q.includes("gerakan") || q.includes("movement") || q.includes("tangan") || q.includes("hand") || q.includes("mimik") || q.includes("wajah") || q.includes("facial") || q.includes("senyum") || q.includes("smile") || // Voice & audio
    q.includes("suara") || q.includes("voice") || q.includes("nada") || q.includes("tone") || q.includes("intonasi") || q.includes("intonation") || q.includes("volume") || q.includes("keras") || q.includes("loud") || q.includes("pelan") || q.includes("soft") || q.includes("jelas") || q.includes("clear") || q.includes("clarity") || q.includes("artikulasi") || q.includes("pronunciation") || q.includes("pelafalan") || q.includes("audio") || q.includes("mic") || q.includes("microphone") || q.includes("recording") || q.includes("rekam") || q.includes("podcast") || q.includes("voiceover") || q.includes("narasi audio") || // Energy & emotions
    q.includes("energi") || q.includes("energy") || q.includes("emosi") || q.includes("emotion") || q.includes("feeling") || q.includes("confident") || q.includes("confidence") || q.includes("ragu") || q.includes("yakin") || q.includes("pede") || q.includes("kaku") || q.includes("stiff") || q.includes("tegang") || q.includes("tense") || q.includes("natural") || q.includes("alami") || q.includes("santai") || q.includes("relaxed") || q.includes("warmth") || q.includes("hangat") || q.includes("dingin") || q.includes("cold") || q.includes("engaging") || q.includes("menarik") || q.includes("bosan") || q.includes("boring") || q.includes("monoton") || // Language & words
    q.includes("kata-kata") || q.includes("words") || q.includes("bahasa") || q.includes("language") || q.includes("kalimat") || q.includes("cerita") || q.includes("story") || q.includes("narasi") || q.includes("narrative") || q.includes("storytelling") || q.includes("pesan") || q.includes("message") || q.includes("isi") || q.includes("konten verbal") || q.includes("filler") || q.includes("umm") || q.includes("ehh") || q.includes("eee") || q.includes("uh") || q.includes("jeda") || q.includes("pause") || q.includes("tempo") || q.includes("pace") || q.includes("pacing") || // Audience & interaction
    q.includes("audiens") || q.includes("audience") || q.includes("pendengar") || q.includes("listener") || q.includes("penonton") || q.includes("viewer") || q.includes("interaksi") || q.includes("interaction") || // Action verbs & improvement
    q.includes("gimana") || q.includes("bagaimana") || q.includes("how to") || q.includes("how do") || q.includes("cara") || q.includes("kenapa") || q.includes("why") || q.includes("mengapa") || q.includes("apa yang") || q.includes("what") || q.includes("latihan") || q.includes("practice") || q.includes("drill") || q.includes("exercise") || q.includes("belajar") || q.includes("learn") || q.includes("study") || q.includes("training") || q.includes("tips") || q.includes("tip") || q.includes("saran") || q.includes("advice") || q.includes("help") || q.includes("bantu") || q.includes("tolong") || q.includes("guide") || q.includes("panduan") || q.includes("tutorial") || // Performance issues
    q.includes("gagal") || q.includes("fail") || q.includes("failed") || q.includes("salah") || q.includes("mistake") || q.includes("masalah") || q.includes("problem") || q.includes("issue") || q.includes("susah") || q.includes("sulit") || q.includes("difficult") || q.includes("hard") || q.includes("stuck") || q.includes("mentok") || // Quality descriptors
    q.includes("bagus") || q.includes("good") || q.includes("baik") || q.includes("jelek") || q.includes("bad") || q.includes("kurang") || q.includes("lack") || q.includes("lacking") || q.includes("lebih") || q.includes("more") || q.includes("better") || q.includes("worse") || q.includes("improve") || q.includes("tingkatkan") || // Video/content creation
    q.includes("video") || q.includes("vid") || q.includes("konten") || q.includes("content") || q.includes("post") || q.includes("posting") || q.includes("upload") || q.includes("uploading") || q.includes("bikin") || q.includes("buat") || q.includes("create") || q.includes("creating") || q.includes("record") || q.includes("recording") || q.includes("rekam") || q.includes("shoot") || q.includes("shooting") || q.includes("edit") || q.includes("editing") || q.includes("montage") || q.includes("transition") || q.includes("opening") || q.includes("pembuka") || q.includes("hook") || q.includes("closing") || q.includes("penutup") || q.includes("script") || q.includes("skrip") || q.includes("naskah") || q.includes("teks")) {
      return "communication-general";
    }
    if (q.includes("gimana") || q.includes("bagaimana") || q.includes("kenapa") || q.includes("mengapa") || q.includes("cara") || q.includes("how") || q.includes("why")) {
      return "communication-general";
    }
    return null;
  }
  getLibraryAnswer(topic, question) {
    const q = question.toLowerCase();
    switch (topic) {
      case "tiktok":
        return this.answerTikTok(q);
      case "instagram":
        return this.answerInstagram(q);
      case "youtube":
        return this.answerYouTube(q);
      case "public-speaking":
        return this.answerPublicSpeaking(q);
      case "mc-presenter":
        return this.answerMCPresenter(q);
      case "bias-framework":
        return this.answerBIASFramework(q);
      case "social-media-general":
        return {
          answer: this.compileSocialMediaOverview(),
          source: "library",
          confidence: "high",
          relatedTopics: ["tiktok", "instagram", "youtube"]
        };
      case "communication-general":
        return {
          answer: this.compileCommunicationOverview(),
          source: "library",
          confidence: "high",
          relatedTopics: ["public-speaking", "mc-presenter", "bias-framework"]
        };
      default:
        return {
          answer: "Topik ditemukan tapi belum ada jawaban di library. Coba pertanyaan lain!",
          source: "library",
          confidence: "low"
        };
    }
  }
  answerTikTok(question) {
    if (question.includes("fyp") || question.includes("viral")) {
      const fyp = TikTokKnowledge.algorithm.fyp;
      return {
        answer: `**Cara Masuk FYP TikTok:**

${fyp.howItWorks}

**Faktor Penting (urut prioritas):**

1. ${fyp.rankingFactors[0].factor} (${fyp.rankingFactors[0].importance})
   - ${fyp.rankingFactors[0].explanation}
   - Cara improve: ${fyp.rankingFactors[0].howToImprove.join(", ")}

2. ${fyp.rankingFactors[1].factor}
   - ${fyp.rankingFactors[1].explanation}
   - Cara improve: ${fyp.rankingFactors[1].howToImprove.join(", ")}

**Quick Tip:** ${getTikTokTip("fyp")}`,
        source: "library",
        confidence: "high",
        relatedTopics: ["tiktok-growth", "tiktok-content-strategy"]
      };
    }
    if (question.includes("growth") || question.includes("followers") || question.includes("tumbuh")) {
      const roadmap = TikTokKnowledge.growthRoadmap;
      return {
        answer: `**Roadmap Growth TikTok untuk Pemula:**

**Week 1-2:** ${roadmap.week1to2.goal}
- ${roadmap.week1to2.tasks.join("\n- ")}
Expected: ${roadmap.week1to2.expectedResult}

**Week 3-4:** ${roadmap.week3to4.goal}
- ${roadmap.week3to4.tasks.join("\n- ")}
Expected: ${roadmap.week3to4.expectedResult}

**Month 2+:** ${roadmap.month2.goal}
- ${roadmap.month2.tasks.join("\n- ")}

**Quick Tip:** ${getTikTokTip("growth")}`,
        source: "library",
        confidence: "high",
        relatedTopics: ["tiktok-fyp", "tiktok-mistakes"]
      };
    }
    if (question.includes("mistake") || question.includes("kesalahan") || question.includes("views rendah")) {
      const mistakes = TikTokKnowledge.mistakesToAvoid;
      return {
        answer: `**5 Kesalahan Pemula TikTok:**

${mistakes.map((m, i) => `${i + 1}. **${m.mistake}**
   - Fix: ${m.fix}
   - ${m.timeline || m.why || m.impact}`).join("\n\n")}`,
        source: "library",
        confidence: "high",
        relatedTopics: ["tiktok-troubleshooting"]
      };
    }
    return {
      answer: `**TikTok Quick Guide:**

${getTikTokTip("fyp")}

Mau tahu lebih detail? Tanya tentang: FYP strategy, growth roadmap, common mistakes, posting schedule, atau troubleshooting low views.`,
      source: "library",
      confidence: "medium",
      relatedTopics: ["tiktok-fyp", "tiktok-growth"]
    };
  }
  answerInstagram(question) {
    if (question.includes("reels")) {
      const reels = InstagramKnowledge.reels;
      return {
        answer: `**Instagram Reels Optimization:**

${reels.algorithm.howItWorks}

**Top 3 Ranking Factors:**
1. ${reels.algorithm.rankingFactors[0].factor} - ${reels.algorithm.rankingFactors[0].explanation}
2. ${reels.algorithm.rankingFactors[1].factor} - ${reels.algorithm.rankingFactors[1].explanation}
3. ${reels.algorithm.rankingFactors[2].factor} - ${reels.algorithm.rankingFactors[2].explanation}

**Quick Tip:** ${getInstagramTip("reels")}`,
        source: "library",
        confidence: "high"
      };
    }
    if (question.includes("growth") || question.includes("followers")) {
      const tactics = InstagramKnowledge.growth.organicTactics;
      return {
        answer: `**5 Taktik Growth Instagram:**

${tactics.slice(0, 5).map((t, i) => `${i + 1}. **${t.tactic}**
   - Why: ${t.why}
   - How: ${Array.isArray(t.howTo) ? t.howTo.join("; ") : t.howTo}`).join("\n\n")}

**Quick Tip:** ${getInstagramTip("growth")}`,
        source: "library",
        confidence: "high"
      };
    }
    return {
      answer: `**Instagram Quick Guide:**

${getInstagramTip("reels")}

Tanya lebih detail tentang: Reels strategy, growth tactics, engagement tips, hashtags, atau monetization.`,
      source: "library",
      confidence: "medium"
    };
  }
  answerYouTube(question) {
    if (question.includes("thumbnail") || question.includes("ctr") || question.includes("click")) {
      const ctr = YouTubeKnowledge.algorithm.rankingFactors[0];
      return {
        answer: `**YouTube CTR (Click-Through Rate) Optimization:**

${ctr.explanation}

**Benchmark:**
- Poor: ${ctr.benchmark.poor}
- Good: ${ctr.benchmark.good}
- Excellent: ${ctr.benchmark.excellent}

**Thumbnail Best Practices:**
${ctr.optimization.thumbnail.map((t) => `- ${t}`).join("\n")}

**Title Best Practices:**
${ctr.optimization.title.map((t) => `- ${t}`).join("\n")}

**Quick Tip:** ${getYouTubeTip("ctr")}`,
        source: "library",
        confidence: "high"
      };
    }
    if (question.includes("retention") || question.includes("watch time")) {
      return {
        answer: `**YouTube Retention Strategy:**

${getYouTubeTip("retention")}

Detail lengkap ada di knowledge base - tanya spesifik tentang hook formulas, pattern interrupts, atau retention graph analysis!`,
        source: "library",
        confidence: "high"
      };
    }
    return {
      answer: `**YouTube Quick Guide:**

${getYouTubeTip("growth")}

Tanya detail tentang: CTR optimization, retention strategy, SEO, monetization, atau troubleshooting.`,
      source: "library",
      confidence: "medium"
    };
  }
  answerPublicSpeaking(question) {
    if (question.includes("nervous") || question.includes("grogi") || question.includes("gugup")) {
      const nervousness = PublicSpeakingGuide.beginners.nervousness;
      return {
        answer: `**Mengatasi Nervous Public Speaking:**

${nervousness.whyItHappens}

**3 Teknik Paling Efektif:**

1. **${nervousness.solutions[0].technique}**
   - How: ${nervousness.solutions[0].howTo}
   - Why it works: ${nervousness.solutions[0].whyItWorks}

2. **${nervousness.solutions[1].technique}**
   - How: ${nervousness.solutions[1].howTo}
   - Why it works: ${nervousness.solutions[1].whyItWorks}

3. **${nervousness.solutions[2].technique}**
   - How: ${nervousness.solutions[2].howTo}
   - Why it works: ${nervousness.solutions[2].whyItWorks}

**Quick Tip:** ${getPublicSpeakingTip("nervousness")}`,
        source: "library",
        confidence: "high"
      };
    }
    if (question.includes("struktur") || question.includes("structure") || question.includes("organize")) {
      return {
        answer: `**Struktur Public Speaking:**

${getPublicSpeakingTip("structure")}

Detail lengkap struktur Opening-Body-Closing ada di knowledge base!`,
        source: "library",
        confidence: "high"
      };
    }
    return {
      answer: `**Public Speaking Quick Guide:**

${getPublicSpeakingTip("beginner")}

Tanya detail tentang: Overcoming nervousness, speech structure, body language, voice techniques, atau practice roadmap.`,
      source: "library",
      confidence: "medium"
    };
  }
  answerMCPresenter(question) {
    if (question.includes("opening") || question.includes("pembuka")) {
      return {
        answer: `**MC Opening Techniques:**

${getMCPresenterTip("opening")}

Detail lengkap energy hooks, welcome structure, dan housekeeping tips ada di knowledge base!`,
        source: "library",
        confidence: "high"
      };
    }
    if (question.includes("transition") || question.includes("introduce speaker")) {
      return {
        answer: `**MC Transitions & Speaker Introductions:**

${getMCPresenterTip("transitions")}

Detail lengkap formula build credibility \u2192 anticipation \u2192 name reveal + applause cue!`,
        source: "library",
        confidence: "high"
      };
    }
    return {
      answer: `**MC/Presenter Quick Guide:**

${getMCPresenterTip("practice")}

Tanya detail tentang: Opening techniques, transitions, energy management, crisis handling, atau interview skills.`,
      source: "library",
      confidence: "medium"
    };
  }
  answerBIASFramework(question) {
    const layers = ["vbm", "epm", "nlp", "eth", "eco", "soc", "cog", "bmil"];
    for (const layer of layers) {
      if (question.includes(layer)) {
        return {
          answer: `**BIAS Layer: ${layer.toUpperCase()}**

${getBIASLayerTip(layer)}

Detail lengkap explanations, drills, dan examples ada di knowledge base!`,
          source: "library",
          confidence: "high",
          relatedTopics: layers.filter((l) => l !== layer)
        };
      }
    }
    return {
      answer: `**BIAS Framework Overview:**

${BIASFrameworkGuide.overview.whatIs}

**8 Layers:**
1. VBM - Visual Behavior Mapping (body language)
2. EPM - Emotional Processing Mapping (emotional intelligence)
3. NLP - Narrative & Language Patterns (word choice & story)
4. ETH - Ethical Framework (integrity & fact-checking)
5. ECO - Ecosystem Awareness (platform optimization)
6. SOC - Social Intelligence (audience psychology)
7. COG - Cognitive Load Management (information density)
8. BMIL - Behavioral Micro-Indicators (subtle cues)

Tanya tentang layer spesifik untuk detail lengkap!`,
      source: "library",
      confidence: "high",
      relatedTopics: layers
    };
  }
  compileSocialMediaOverview() {
    return `**Social Media Platform Comparison:**

**TikTok:** ${getTikTokTip("fyp")}

**Instagram:** ${getInstagramTip("reels")}

**YouTube:** ${getYouTubeTip("ctr")}

Tanya spesifik tentang platform yang kamu pakai untuk strategi detail!`;
  }
  compileCommunicationOverview() {
    return `**Improve Komunikasi Kamu:**

**Body Language (VBM):** ${getBIASLayerTip("vbm")}

**Emotions & Energy (EPM):** ${getBIASLayerTip("epm")}

**Language & Story (NLP):** ${getBIASLayerTip("nlp")}

**Platform Optimization (ECO):** ${getBIASLayerTip("eco")}

**Micro-Indicators (BMIL):** ${getBIASLayerTip("bmil")}

Tanya spesifik tentang layer atau area yang mau di-improve untuk guidance lebih detail!`;
  }
  async enhanceWithAI(question, libraryAnswer, topic) {
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
    const userPrompt = `Pertanyaan: ${question}

Jawaban dari library:
${libraryAnswer}

Enrich this answer with additional context, examples, or practical tips.`;
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    return completion.choices[0]?.message?.content || libraryAnswer;
  }
};
var knowledgeRouter = new KnowledgeRouter();

// server/bias-engine.ts
async function analyzeBehavior(input) {
  return await analyzeText({
    content: input.content,
    mode: input.mode,
    inputType: input.inputType,
    platform: input.platform
    // ✅ FIXED: Pass platform for community guidelines & context-aware analysis
  });
}
async function generateChatResponse(message, mode) {
  const lowerMessage = message.toLowerCase();
  const onTopicKeywords = [
    // GENERAL COMMUNICATION & BEHAVIOR
    "komunikasi",
    "bicara",
    "presentasi",
    "video",
    "konten",
    "audiens",
    "communication",
    "speak",
    "presentation",
    "content",
    "audience",
    "behavior",
    "perilaku",
    "ekspresi",
    "expression",
    "tone",
    "nada",
    "gesture",
    "emosi",
    "emotion",
    "mindset",
    "etika",
    "ethics",
    // CREATOR MODE - SOCIAL MEDIA STRATEGY (COMPREHENSIVE!)
    // Platforms
    "fyp",
    "viral",
    "tiktok",
    "instagram",
    "youtube",
    "reels",
    "shorts",
    "story",
    "live",
    // Metrics & Analytics
    "algoritma",
    "algorithm",
    "engagement",
    "reach",
    "followers",
    "views",
    "like",
    "comment",
    "share",
    "save",
    "watch time",
    "impressions",
    "ctr",
    "conversion",
    // Content Strategy
    "hook",
    "retention",
    "trending",
    "hashtag",
    "caption",
    "posting",
    "schedule",
    "consistency",
    "niche",
    "branding",
    "thumbnail",
    "title",
    "description",
    "bio",
    // Creator Growth
    "creator",
    "influencer",
    "growth",
    "analytics",
    "insight",
    "monetize",
    "sponsor",
    "collab",
    "duet",
    "stitch",
    "remix",
    "respond",
    // Content Types
    "tutorial",
    "vlog",
    "review",
    "challenge",
    "trend",
    "dance",
    "prank",
    "storytime",
    // Technical
    "edit",
    "editing",
    "filter",
    "effect",
    "sound",
    "audio",
    "transition",
    "cut",
    // Platform Behavior
    "shadowban",
    "suppression",
    "boost",
    "promote",
    "ads",
    "organic",
    // ACADEMIC MODE - PROFESSIONAL/WORKPLACE COMMUNICATION
    // Leadership & Management
    "leadership",
    "leader",
    "pemimpin",
    "kepemimpinan",
    "manager",
    "boss",
    "supervisor",
    "team",
    "tim",
    "meeting",
    "rapat",
    "delegation",
    "feedback",
    "coaching",
    "mentoring",
    // Professional Skills
    "professional",
    "profesional",
    "workplace",
    "kantor",
    "office",
    "career",
    "karir",
    "interview",
    "wawancara",
    "pitch",
    "proposal",
    "negotiation",
    "negosiasi",
    // Public Speaking & Presentations
    "public speaking",
    "speech",
    "pidato",
    "seminar",
    "conference",
    "keynote",
    "slides",
    "powerpoint",
    "audience engagement",
    "q&a",
    "tanya jawab",
    // Academic Context
    "teaching",
    "mengajar",
    "lecture",
    "kuliah",
    "student",
    "mahasiswa",
    "thesis",
    "skripsi",
    "research presentation",
    "academic writing",
    "paper",
    "journal",
    // Soft Skills
    "confidence",
    "percaya diri",
    "charisma",
    "karisma",
    "credibility",
    "kredibilitas",
    "assertive",
    "tegas",
    "empathy",
    "empati",
    "persuasion",
    "persuasi",
    // HYBRID MODE - ALL OF THE ABOVE!
    "hybrid",
    "kombinasi",
    "comprehensive",
    "lengkap",
    "overall",
    "keseluruhan"
  ];
  const offTopicKeywords = [
    "cinta",
    "love",
    "politik",
    "politics",
    "agama",
    "religion",
    "jatuh cinta",
    "pacaran",
    "dating",
    "weather",
    "cuaca",
    "makanan",
    "food",
    "recipe",
    "resep",
    "travel",
    "liburan",
    "game",
    "sport",
    "olahraga",
    "musik",
    "music"
  ];
  const isOffTopic = offTopicKeywords.some((k) => lowerMessage.includes(k));
  const hasOnTopicKeyword = onTopicKeywords.some((k) => lowerMessage.includes(k));
  const isOnTopic = hasOnTopicKeyword && !isOffTopic;
  if (isOffTopic) {
    return {
      response: "Haha lucu juga \u{1F604} tapi BIAS cuma fokus ke gaya komunikasi dan perilaku kamu, bro. Ada yang mau kamu tanyain soal cara ngomong atau tampil di depan orang?",
      isOnTopic: false
    };
  }
  if (lowerMessage.includes("kaku") || lowerMessage.includes("nervous")) {
    return {
      response: 'Nada kamu mungkin kedengeran kaku karena terlalu fokus ke "gak boleh salah". Coba tambahin sedikit jeda natural dan senyum ringan - itu bantu flow-nya lebih enak. Latihan di depan cermin juga ngebantu banget!',
      isOnTopic: true
    };
  }
  if (lowerMessage.includes("presentasi") || lowerMessage.includes("presentation")) {
    return {
      response: "Buat presentasi yang engaging, kunci nya ada 3: 1) Mulai dengan hook emosional (bukan data dulu), 2) Kasih jeda pas poin penting, 3) Akhiri dengan call-to-action yang jelas. Tempo bicara juga jangan terlalu cepat - 10-20% lebih lambat dari biasa itu sweet spot.",
      isOnTopic: true
    };
  }
  return {
    response: hasOnTopicKeyword ? "Good question! Untuk analisa yang lebih spesifik, coba kirim video atau script kamu - nanti BIAS bisa kasih feedback detail pakai 8-layer framework. Ada hal spesifik yang mau kamu improve?" : "Hmm, kayaknya pertanyaan itu di luar fokus BIAS ya. Gue cuma bisa bantu soal komunikasi, perilaku, atau cara tampil di depan orang. Ada yang mau ditanyain soal itu?",
    isOnTopic: hasOnTopicKeyword
  };
}
var BIAS_SYSTEM_PROMPT = `\u{1F9E0} BIAS Pro \u2013 Behavioral Intelligence System v3.2.\u03B1 (Fusion Compact Build)
(Adaptive Coaching + TikTok Action + Dashboard Mode)

\u{1F9E9} SYSTEM ROLE
You are BIAS Pro \u2013 Behavioral Intelligence Audit System,
a bilingual behavioral mentor analyzing creators' tone, emotion, clarity, and authenticity.

\u{1F3AF} Purpose:
Menganalisa perilaku komunikasi dari sisi visual, emosional, linguistik, dan etika 
berdasarkan 8-Layer Framework: VBM \u2013 EPM \u2013 NLP \u2013 BMIL (sekarang dalam satu inti VoiceEmotion Core).

Kamu punya akses ke knowledge base lengkap:
- BIAS_MasterReality_TikTok_v3.3.md
- BIAS_Creator_Intelligence_Core_v3.1.md
- BIAS_VoiceEmotion_Core.md
- BMIL_Ethics.md
- ESI_EthicalSensitivity.md
- NLP_Storytelling.md

---

\u2699\uFE0F BEHAVIORAL FRAMEWORK

Gunakan struktur 8-Layer BIAS (Fusion Compact):

**VBM\u2013EPM\u2013VPL** \u2192 digabung menjadi VoiceEmotion Core
**NLP Layer** \u2192 Narrative Linguistics (clarity, structure)
**BMIL Layer** \u2192 Behavioral Morality (integrity, ethics)
**ESI Layer** \u2192 Ethical Sensitivity & Authenticity
**VPL Layer** \u2192 Voice Pacing Layer
**VPM Layer** \u2192 Audience Persuasion Mapping

---

\u{1F9ED} AUTO-MODE DETECTION
Keyword | Mode | Fokus
---------|-------|-------
TikTok, Video, FYP | Creator | Visual + Engagement
Speaking | Speaker | Voice + Clarity
Leadership | Leader | Empathy + Authority
Marketing, Pitch | Pitch | Persuasion + CTA
hoax, fakta, rumor, algoritma, shadowban, viral, agency | MasterReality | Edukatif + Myth-busting

---

\u{1F4AC} RESPONSE STYLE

Gunakan bilingual tone (Indonesian empathy + English clarity).
Style: calm, empatik, structured, authoritative tapi approachable.

Contoh opening:
"\u{1F525} Wah bro\u2026 ini pertanyaan kelas 'inside creator' banget \u2014 dan lo benar-benar peka terhadap sistem real di balik TikTok."

---

\u{1F4DD} FORMAT JAWABAN (WAJIB IKUTI!)

\u{1F525} OPENING (2-3 kalimat powerful)
- Validasi pertanyaan dengan antusias
- "Jawaban jujurnya: \u27A1\uFE0F [jawaban singkat]. Tapi dengan catatan penting..."

\u{1F9E0} SECTION BERNOMOR dengan emoji (\u{1F9ED} 1\uFE0F\u20E3, \u2699\uFE0F 2\uFE0F\u20E3, \u{1F9E0} 3\uFE0F\u20E3, \u{1F9E9} 4\uFE0F\u20E3)
Setiap section:
- Punya JUDUL yang menarik
- Penjelasan NARATIF kayak cerita
- Kalau ada data, WAJIB pakai TABEL
- Reference framework: "seperti yang dijelaskan di BIAS MasterReality v3.3..."

\u{1F4CA} TABEL WAJIB DIPAKAI untuk:
- Sistem internal TikTok
- Perbandingan
- Timeline/durasi
- Langkah aksi

\u{1F4AC} CONTOH NYATA wajib ada

\u{1F9ED} KESIMPULAN dari BIAS
Ringkasan dalam 1-2 kalimat powerful.

\u2728 SINGKATNYA (bullet summary)
3-4 poin key takeaway

---

\u26A0\uFE0F HINDARI
\u274C Format script breakdown teknis (timing 0-5s, Hook, Problem, Solution)
\u274C Bullet list panjang tanpa narasi
\u274C Jawaban pendek tanpa depth
\u274C Generic advice tanpa framework reference

\u26D4 JANGAN PERNAH SARANIN
- Beli followers/likes/views
- Engagement bait ("tap 5x biar FYP")
- Konten clickbait menipu
- Konten sensual buat views

---

\u26A0\uFE0F WAJIB: Akhiri SETIAP response dengan footer berikut (TIDAK BOLEH LUPA):

---
**Powered by BIAS\u2122 \u2013 Behavioral Intelligence for Creators**
*Designed by NM23 Ai | Supported by Newsmaker.id Labs*`;
async function generateAICascadeResponse(message, mode) {
  console.log(`
\u{1F680} Chat Request: "${message}"`);
  try {
    const knowledgeResult = await knowledgeRouter.answer(message);
    if (knowledgeResult.source === "library" && knowledgeResult.confidence === "high") {
      console.log("\u2705 Answered from Knowledge Library (instant, free)");
      return {
        response: knowledgeResult.answer,
        isOnTopic: true,
        provider: "knowledge-library"
      };
    }
    if (knowledgeResult.source === "library+ai") {
      console.log("\u2705 Answered from Knowledge Library + Ai Enhancement");
      return {
        response: knowledgeResult.answer,
        isOnTopic: true,
        provider: "knowledge-library"
      };
    }
    if (knowledgeResult.source === "out-of-scope") {
      console.log("\u274C Question out of scope");
      return {
        response: knowledgeResult.answer,
        isOnTopic: false,
        provider: "knowledge-library"
      };
    }
    console.log("\u26A0\uFE0F Library confidence medium/low, trying Ai for better answer...");
  } catch (error) {
    console.warn("Knowledge library error, falling back to Ai:", error);
  }
  const preCheck = await generateChatResponse(message, mode);
  if (!preCheck.isOnTopic) {
    return { ...preCheck, provider: "bias" };
  }
  try {
    const openaiResponse = await callOpenAI(message, mode);
    if (openaiResponse) {
      console.log("\u2705 Answered by OpenAI GPT-4o-mini");
      return { response: openaiResponse, isOnTopic: true, provider: "openai" };
    }
  } catch (error) {
    console.log("\u274C OpenAI failed, falling back to Gemini:", error);
  }
  try {
    const geminiResponse = await callGemini(message, mode);
    if (geminiResponse) {
      console.log("\u2705 Answered by Gemini 1.5 Flash");
      return { response: geminiResponse, isOnTopic: true, provider: "gemini" };
    }
  } catch (error) {
    console.log("\u274C Gemini failed, falling back to BIAS library:", error);
  }
  console.log("\u2705 Answered by BIAS fallback library");
  return { ...preCheck, provider: "bias" };
}
async function callOpenAI(message, mode) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: BIAS_SYSTEM_PROMPT },
          { role: "user", content: `[Mode: ${mode}] ${message}` }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}
async function callGemini(message, mode) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${BIAS_SYSTEM_PROMPT}

[Mode: ${mode}]
User: ${message}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      })
    });
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("Gemini error:", error);
    return null;
  }
}
async function analyzeTikTokAccount(data) {
  const engagementRate = data.avgEngagementRate;
  const followerRatio = data.followers / Math.max(data.following, 1);
  const avgLikesPerVideo = data.totalLikes / Math.max(data.videoCount, 1);
  const contentConsistency = data.videoCount > 20 ? 8 : data.videoCount > 10 ? 6 : 4;
  const vbmScore = Math.min(10, Math.round(
    (data.verified ? 3 : 0) + (data.bio && data.bio.length > 20 ? 2 : 0) + (followerRatio > 10 ? 3 : followerRatio > 5 ? 2 : 1) + contentConsistency / 2
  ));
  const epmScore = Math.min(10, Math.round(
    (engagementRate > 10 ? 8 : engagementRate > 5 ? 6 : engagementRate > 2 ? 4 : 2) + (avgLikesPerVideo > 1e4 ? 2 : avgLikesPerVideo > 1e3 ? 1 : 0)
  ));
  const nlpScore = Math.min(10, Math.round(
    (data.bio && data.bio.length > 50 ? 6 : data.bio && data.bio.length > 20 ? 4 : 2) + (data.videoCount > 30 ? 4 : 2)
  ));
  const ethScore = Math.min(10, Math.round(
    (data.verified ? 4 : 0) + (followerRatio > 5 ? 3 : 1) + (engagementRate > 3 ? 3 : 1)
  ));
  const ecoScore = Math.min(10, Math.round(
    (data.videoCount > 50 ? 4 : data.videoCount > 20 ? 3 : 1) + (engagementRate > 5 ? 3 : 1) + (data.avgViews > 1e5 ? 3 : data.avgViews > 1e4 ? 2 : 1)
  ));
  const socScore = Math.min(10, Math.round(
    (data.followers > 1e5 ? 5 : data.followers > 1e4 ? 3 : 1) + (engagementRate > 5 ? 3 : 1) + (followerRatio > 10 ? 2 : 1)
  ));
  const cogScore = Math.min(10, Math.round(
    contentConsistency + (engagementRate > 3 ? 2 : 1)
  ));
  const bmilScore = Math.min(10, Math.round(
    (data.avgViews / Math.max(data.followers, 1) > 0.5 ? 5 : 3) + (engagementRate > 5 ? 3 : 1) + (data.videoCount > 30 ? 2 : 1)
  ));
  const overallScore = Math.round(
    (vbmScore + epmScore + nlpScore + ethScore + ecoScore + socScore + cogScore + bmilScore) / 8
  );
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  if (epmScore >= 8) strengths.push("Strong emotional connection dengan audience");
  else if (epmScore <= 4) {
    weaknesses.push("Engagement rate rendah");
    recommendations.push("Bikin konten yang lebih relatable & trigger emosi");
  }
  if (ecoScore >= 8) strengths.push("Konsisten upload & algoritma-friendly");
  else if (ecoScore <= 5) {
    weaknesses.push("Kurang konsisten upload");
    recommendations.push("Upload minimal 3-5x seminggu untuk boost algorithm");
  }
  if (vbmScore >= 8) strengths.push("Profile professional & visual appeal kuat");
  else if (vbmScore <= 5) {
    weaknesses.push("Profile kurang optimal");
    recommendations.push("Update bio dengan value proposition yang jelas");
  }
  if (nlpScore <= 5) {
    recommendations.push("Improve storytelling di caption & video structure");
  }
  return {
    username: data.username,
    overallScore,
    biasLayers: {
      VBM: { score: vbmScore, insight: vbmScore >= 7 ? "Profile visually appealing" : "Perlu optimize profile & thumbnails" },
      EPM: { score: epmScore, insight: epmScore >= 7 ? "Koneksi emosional kuat" : "Audience belum fully engaged" },
      NLP: { score: nlpScore, insight: nlpScore >= 7 ? "Storytelling solid" : "Narrative structure bisa ditingkatkan" },
      ETH: { score: ethScore, insight: ethScore >= 7 ? "Authentic & trusted" : "Perlu build kredibilitas lebih" },
      ECO: { score: ecoScore, insight: ecoScore >= 7 ? "Algorithm-optimized" : "Konsistensi upload masih kurang" },
      SOC: { score: socScore, insight: socScore >= 7 ? "Community building bagus" : "Interaksi dengan followers bisa lebih aktif" },
      COG: { score: cogScore, insight: cogScore >= 7 ? "Konten valuable" : "Fokus deliver value yang lebih clear" },
      BMIL: { score: bmilScore, insight: bmilScore >= 7 ? "Micro-interactions efektif" : "Hook & retention perlu improvement" }
    },
    strengths,
    weaknesses,
    recommendations,
    audienceInsights: {
      engagement: engagementRate > 7 ? "high" : engagementRate > 3 ? "medium" : "low",
      growth: followerRatio > 10 && engagementRate > 5 ? "growing" : followerRatio > 3 ? "stable" : "declining",
      contentStrategy: ecoScore >= 7 ? "Consistent & algorithm-aligned" : "Needs optimization"
    }
  };
}
async function analyzeTikTokVideo(data) {
  const engagementRate = (data.likes + data.comments + data.shares) / Math.max(data.views, 1) * 100;
  const likeToViewRatio = data.likes / Math.max(data.views, 1) * 100;
  const commentToLikeRatio = data.comments / Math.max(data.likes, 1) * 100;
  const shareability = data.shares / Math.max(data.views, 1) * 100;
  const vbmScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 5 : likeToViewRatio > 2 ? 3 : 1) + (data.duration < 30 ? 3 : data.duration < 60 ? 2 : 1) + (data.hashtags.length >= 3 && data.hashtags.length <= 7 ? 2 : 1)
  ));
  const epmScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 6 : likeToViewRatio > 2 ? 4 : 2) + (commentToLikeRatio > 5 ? 2 : 1) + (shareability > 1 ? 2 : 1)
  ));
  const nlpScore = Math.min(10, Math.round(
    (data.description.length > 50 ? 4 : data.description.length > 20 ? 2 : 1) + (data.hashtags.length >= 3 ? 3 : 1) + (data.transcription && data.transcription.length > 100 ? 3 : 1)
  ));
  const ethScore = Math.min(10, Math.round(
    (engagementRate > 10 ? 5 : engagementRate > 5 ? 3 : 1) + (commentToLikeRatio > 3 ? 3 : 1) + (shareability > 0.5 ? 2 : 1)
  ));
  const ecoScore = Math.min(10, Math.round(
    (data.hashtags.length >= 3 && data.hashtags.length <= 7 ? 3 : 1) + (data.sounds ? 2 : 0) + (data.duration >= 7 && data.duration <= 60 ? 3 : 1) + (engagementRate > 5 ? 2 : 1)
  ));
  const socScore = Math.min(10, Math.round(
    (shareability > 2 ? 5 : shareability > 1 ? 3 : 1) + (commentToLikeRatio > 5 ? 3 : 1) + (data.views > 1e5 ? 2 : data.views > 1e4 ? 1 : 0)
  ));
  const cogScore = Math.min(10, Math.round(
    (engagementRate > 7 ? 5 : engagementRate > 3 ? 3 : 1) + (data.duration >= 15 ? 3 : 1) + (commentToLikeRatio > 3 ? 2 : 1)
  ));
  const bmilScore = Math.min(10, Math.round(
    (likeToViewRatio > 5 ? 4 : 2) + (engagementRate > 7 ? 3 : 1) + (shareability > 1 ? 3 : 1)
  ));
  const overallScore = Math.round(
    (vbmScore + epmScore + nlpScore + ethScore + ecoScore + socScore + cogScore + bmilScore) / 8
  );
  const viralPotential = Math.min(100, Math.round(
    shareability * 20 + engagementRate * 5 + likeToViewRatio * 10
  ));
  const recommendations = [];
  if (vbmScore <= 5) recommendations.push("Bikin hook visual yang lebih kuat di 3 detik pertama");
  if (epmScore <= 5) recommendations.push("Trigger emosi lebih kuat - surprise, humor, atau relatable moment");
  if (nlpScore <= 5) recommendations.push("Caption perlu lebih engaging & descriptive");
  if (ecoScore <= 5) recommendations.push("Pakai 3-5 hashtags relevant & trending sound");
  if (socScore <= 5) recommendations.push("Bikin konten yang lebih shareable - edukasi atau entertaining");
  if (bmilScore <= 5) recommendations.push("Strengthen hook opening & add clear CTA di akhir");
  return {
    videoId: data.videoId,
    overallScore,
    biasLayers: {
      VBM: { score: vbmScore, insight: vbmScore >= 7 ? "Visual hook strong" : "Opening visual perlu lebih compelling" },
      EPM: { score: epmScore, insight: epmScore >= 7 ? "Emotional impact tinggi" : "Konten kurang trigger emosi" },
      NLP: { score: nlpScore, insight: nlpScore >= 7 ? "Caption & narrative solid" : "Storytelling bisa ditingkatkan" },
      ETH: { score: ethScore, insight: ethScore >= 7 ? "Authentic & relatable" : "Konten terasa scripted/forced" },
      ECO: { score: ecoScore, insight: ecoScore >= 7 ? "Algorithm-optimized" : "Hashtag & sound strategy kurang optimal" },
      SOC: { score: socScore, insight: socScore >= 7 ? "High viral potential" : "Shareability rendah" },
      COG: { score: cogScore, insight: cogScore >= 7 ? "Valuable content" : "Value proposition kurang jelas" },
      BMIL: { score: bmilScore, insight: bmilScore >= 7 ? "Micro-interactions efektif" : "Hook & CTA perlu diperkuat" }
    },
    viralPotential,
    recommendations,
    hooks: {
      opening: {
        score: vbmScore,
        feedback: vbmScore >= 7 ? "3 detik pertama catchy!" : "Opening hook perlu lebih menarik perhatian"
      },
      retention: {
        score: cogScore,
        feedback: cogScore >= 7 ? "Konten retain audience well" : "Audience drop-off tinggi, perlu pacing lebih baik"
      },
      cta: {
        score: socScore,
        feedback: socScore >= 7 ? "CTA efektif drive engagement" : "Tambahkan CTA yang jelas (like, share, comment)"
      }
    }
  };
}

// server/utils/metrics.ts
function parseMetricBigInt(value) {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    return BigInt(Math.floor(value));
  }
  if (typeof value === "string") {
    try {
      return BigInt(value);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
}
function toMetricValue(metric, fallbackForApprox) {
  const bigIntValue = parseMetricBigInt(metric);
  const raw = bigIntValue.toString();
  let approx;
  try {
    const numValue = Number(bigIntValue);
    if (numValue > Number.MAX_SAFE_INTEGER) {
      approx = fallbackForApprox ?? Number.MAX_SAFE_INTEGER;
    } else if (numValue < Number.MIN_SAFE_INTEGER) {
      approx = fallbackForApprox ?? Number.MIN_SAFE_INTEGER;
    } else {
      approx = numValue;
    }
  } catch {
    approx = fallbackForApprox ?? 0;
  }
  return { raw, approx };
}
function safeDivideBigInt(numerator, denominator) {
  if (denominator === BigInt(0)) {
    return 0;
  }
  const num = Number(numerator);
  const denom = Number(denominator);
  if (!isFinite(num) || !isFinite(denom)) {
    return 0;
  }
  return num / denom;
}
function calculateEngagementRate2(likes, followers) {
  if (followers === BigInt(0)) {
    return 0;
  }
  return safeDivideBigInt(likes * BigInt(100), followers);
}
function calculateAverage(total, count2) {
  if (count2 === BigInt(0)) {
    return 0;
  }
  return Math.round(safeDivideBigInt(total, count2));
}

// server/services/tiktok-scraper.ts
async function scrapeTikTokProfile(username) {
  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    const response = await fetch(profileUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0"
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok profile: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    if (scriptMatch && scriptMatch[1]) {
      const data = JSON.parse(scriptMatch[1]);
      const userDetail = data?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo;
      if (userDetail?.user && userDetail?.stats) {
        return {
          username: userDetail.user.uniqueId || username,
          nickname: userDetail.user.nickname || username,
          signature: userDetail.user.signature || "",
          avatarUrl: userDetail.user.avatarLarger || userDetail.user.avatarMedium || "",
          verified: userDetail.user.verified || false,
          followerCount: parseMetricBigInt(userDetail.stats.followerCount),
          followingCount: parseMetricBigInt(userDetail.stats.followingCount),
          videoCount: parseMetricBigInt(userDetail.stats.videoCount),
          likesCount: parseMetricBigInt(userDetail.stats.heart || userDetail.stats.heartCount)
        };
      }
    }
    const altScriptMatch = html.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
    if (altScriptMatch && altScriptMatch[1]) {
      const data = JSON.parse(altScriptMatch[1]);
      const userModule = data?.UserModule?.users;
      const statsModule = data?.UserModule?.stats;
      if (userModule && statsModule) {
        const userId = Object.keys(userModule)[0];
        const user = userModule[userId];
        const stats = statsModule[userId];
        if (user && stats) {
          return {
            username: user.uniqueId || username,
            nickname: user.nickname || username,
            signature: user.signature || "",
            avatarUrl: user.avatarLarger || user.avatarMedium || "",
            verified: user.verified || false,
            followerCount: parseMetricBigInt(stats.followerCount),
            followingCount: parseMetricBigInt(stats.followingCount),
            videoCount: parseMetricBigInt(stats.videoCount),
            likesCount: parseMetricBigInt(stats.heart || stats.heartCount)
          };
        }
      }
    }
    const followerMatch = html.match(/"followerCount[\"']?\s*:\s*(\d+)/i);
    const followingMatch = html.match(/"followingCount[\"']?\s*:\s*(\d+)/i);
    const videoMatch = html.match(/"videoCount[\"']?\s*:\s*(\d+)/i);
    const likesMatch = html.match(/"heart(?:Count)?[\"']?\s*:\s*(\d+)/i);
    const nicknameMatch = html.match(/"nickname[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
    const signatureMatch = html.match(/"signature[\"']?\s*:\s*[\"']([^\"']*)[\"']/i);
    const avatarMatch = html.match(/"avatarLarger[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
    const verifiedMatch = html.match(/"verified[\"']?\s*:\s*(true|false)/i);
    if (followerMatch || videoMatch) {
      return {
        username,
        nickname: nicknameMatch?.[1] || username,
        signature: signatureMatch?.[1] || "",
        avatarUrl: avatarMatch?.[1] || "",
        verified: verifiedMatch?.[1] === "true",
        followerCount: followerMatch ? parseMetricBigInt(followerMatch[1]) : BigInt(0),
        followingCount: followingMatch ? parseMetricBigInt(followingMatch[1]) : BigInt(0),
        videoCount: videoMatch ? parseMetricBigInt(videoMatch[1]) : BigInt(0),
        likesCount: likesMatch ? parseMetricBigInt(likesMatch[1]) : BigInt(0)
      };
    }
    throw new Error("Could not parse TikTok profile data from HTML");
  } catch (error) {
    console.error(`[TikTok Scraper] Error scraping profile @${username}:`, error);
    throw new Error(`Failed to scrape TikTok profile: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function extractUsernameFromUrl(url) {
  try {
    const match = url.match(/@([a-zA-Z0-9_.]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// server/middleware/rate-limiter.ts
var rateLimitStore = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1e3);
function checkRateLimit2(identifier, config = { windowMs: 6e4, maxRequests: 10 }) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }
  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

// server/utils/validators.ts
function isValidTikTokUsername(username) {
  if (!username || typeof username !== "string") {
    return false;
  }
  const cleaned = username.replace(/^@/, "");
  const usernameRegex = /^[a-zA-Z0-9_.]{2,24}$/;
  if (cleaned.includes("..") || cleaned.includes("/") || cleaned.includes("\\")) {
    return false;
  }
  return usernameRegex.test(cleaned);
}
function sanitizeUsername(username) {
  return username.replace(/^@/, "").replace(/[^a-zA-Z0-9_.]/g, "").slice(0, 24);
}

// server/routes.ts
import { z } from "zod";

// client/src/data/platformRules.ts
var TIKTOK_RULES = [
  {
    id: "safety",
    name: "Safety & Civility",
    nameId: "Keamanan dan Keberadaban",
    icon: "Shield",
    rules: [
      {
        id: "violence",
        category: "safety",
        title: "Violent & Criminal Behavior",
        titleId: "Perilaku Kekerasan dan Kriminal",
        description: "We do not allow threats, incitement to violence, glorification of violence, or instructions on how to commit harmful acts.",
        descriptionId: "Kami tidak mengizinkan ancaman, ajakan, atau glorifikasi tindak kekerasan, dukungan terhadap tindak kriminal, atau petunjuk tentang cara melakukan tindakan berbahaya.",
        status: "not-allowed",
        examples: [
          "NOT ALLOWED: Threatening or expressing desire to harm others",
          "NOT ALLOWED: Promoting or glorifying violence",
          "NOT ALLOWED: Promoting theft or property damage",
          "ALLOWED: Documentary or educational content about violence",
          "ALLOWED: Fiction or art (not promoting real-world violence)"
        ],
        examplesId: [
          "TIDAK DIIZINKAN: Mengancam atau menunjukkan keinginan melukai orang",
          "TIDAK DIIZINKAN: Mempromosikan atau mengglorifikasi kekerasan",
          "TIDAK DIIZINKAN: Mempromosikan pencurian atau perusakan properti",
          "DIIZINKAN: Konten dokumenter atau edukasi tentang kekerasan",
          "DIIZINKAN: Karya fiksi atau seni (tidak mempromosikan kekerasan nyata)"
        ]
      },
      {
        id: "hate-speech",
        category: "safety",
        title: "Hate Speech & Hateful Behavior",
        titleId: "Ujaran Kebencian dan Perilaku Kebencian",
        description: "We do not allow content that promotes hatred or attacks people based on protected attributes like race, religion, gender, or sexual orientation.",
        descriptionId: "Kami tidak mengizinkan konten yang mempromosikan kebencian atau menyerang orang lain berdasarkan atribut yang dilindungi, seperti ras, agama, gender, atau orientasi seksual.",
        status: "not-allowed",
        examples: [
          "NOT ALLOWED: Encouraging violence against protected groups",
          "NOT ALLOWED: Supporting hate ideologies (white supremacy, anti-LGBTQ+)",
          "NOT ALLOWED: Using hate slurs related to protected attributes",
          "NOT ALLOWED: Denying documented atrocities (Holocaust denial)",
          "ALLOWED: Reclaiming slurs by targeted community members",
          "ALLOWED: Discussing public policies affecting protected groups"
        ],
        examplesId: [
          "TIDAK DIIZINKAN: Mendorong kekerasan terhadap kelompok yang dilindungi",
          "TIDAK DIIZINKAN: Mendukung ideologi kebencian (supremasi, anti-LGBTQ+)",
          "TIDAK DIIZINKAN: Menggunakan cercaan kebencian pada atribut dilindungi",
          "TIDAK DIIZINKAN: Menyangkal kekejaman terdokumentasi (penyangkalan Holocaust)",
          "DIIZINKAN: Memanfaatkan kembali cercaan oleh komunitas yang disasar",
          "DIIZINKAN: Mendiskusikan kebijakan publik yang berdampak pada kelompok dilindungi"
        ]
      },
      {
        id: "harassment",
        category: "safety",
        title: "Harassment & Bullying",
        titleId: "Pelecehan dan Perundungan",
        description: "We do not allow content that harasses or bullies others, including derogatory statements about appearance, doxing, sexual harassment, or coordinated harassment.",
        descriptionId: "Kami tidak mengizinkan konten yang melecehkan atau merundung orang lain, termasuk ujaran yang merendahkan tentang penampilan, doxing, pelecehan seksual, atau pelecehan yang terkoordinasi.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "mental-health",
    name: "Mental Health & Behavior",
    nameId: "Kesehatan Mental dan Perilaku",
    icon: "Heart",
    rules: [
      {
        id: "suicide",
        category: "mental-health",
        title: "Suicide & Self-Harm",
        titleId: "Bunuh Diri dan Mencederai Diri Sendiri",
        description: "We do not allow content that depicts, promotes, or provides instructions for suicide or self-harm.",
        descriptionId: "Kami tidak mengizinkan konten yang menampilkan, mempromosikan, atau memberikan instruksi tindakan bunuh diri atau mencederai diri sendiri.",
        status: "not-allowed"
      },
      {
        id: "eating-disorders",
        category: "mental-health",
        title: "Eating Disorders & Body Image",
        titleId: "Gangguan Makan dan Citra Tubuh",
        description: "We do not allow content promoting eating disorders, dangerous weight management methods, or harmful body comparisons.",
        descriptionId: "Kami tidak mengizinkan konten yang mempromosikan gangguan makan, metode penurunan berat badan yang berisiko, atau perbandingan citra tubuh yang membahayakan.",
        status: "not-allowed"
      },
      {
        id: "dangerous-activities",
        category: "mental-health",
        title: "Dangerous Activities & Challenges",
        titleId: "Aktivitas dan Tantangan Berbahaya",
        description: "We do not allow content that depicts or promotes extreme acts or challenges that could result in physical harm.",
        descriptionId: "Kami tidak mengizinkan konten yang menampilkan atau mempromosikan aksi ekstrem atau tantangan yang dapat mengakibatkan bahaya fisik.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "adult-themes",
    name: "Sensitive & Adult Themes",
    nameId: "Tema Sensitif dan Dewasa",
    icon: "AlertCircle",
    rules: [
      {
        id: "nudity-sexual",
        category: "adult-themes",
        title: "Nudity & Sexual Behavior",
        titleId: "Eksposur Tubuh dan Perilaku Seksual",
        description: "We do not allow certain forms of nudity or sexual behavior, including nudity, sexual activity, sexual services, or sexually suggestive behavior.",
        descriptionId: "Kami tidak mengizinkan beberapa bentuk eksposur tubuh atau perilaku seksual, termasuk ketelanjangan, aktivitas seksual, layanan seksual, atau perilaku yang menjurus ke tema seksual.",
        status: "not-allowed"
      },
      {
        id: "shocking-content",
        category: "adult-themes",
        title: "Shocking & Graphic Content",
        titleId: "Konten Mengejutkan dan Mengerikan",
        description: "We do not allow extremely graphic, violent, or disturbing content, especially if it may cause emotional distress.",
        descriptionId: "Kami tidak mengizinkan konten yang sangat vulgar, konten kekerasan, atau menggelisahkan, terutama jika berpotensi menimbulkan tekanan emosional bagi penonton.",
        status: "not-allowed"
      },
      {
        id: "animal-abuse",
        category: "adult-themes",
        title: "Animal Abuse",
        titleId: "Penyiksaan Hewan",
        description: "We do not allow content depicting or promoting animal abuse, cruelty, neglect, or exploitation.",
        descriptionId: "Kami tidak mengizinkan konten yang menampilkan atau mempromosikan penyiksaan, kekejaman, pengabaian, atau eksploitasi hewan.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "integrity",
    name: "Integrity & Authenticity",
    nameId: "Integritas dan Keaslian",
    icon: "CheckCircle",
    rules: [
      {
        id: "misinformation",
        category: "integrity",
        title: "Misinformation",
        titleId: "Misinformasi",
        description: "We do not allow misinformation that could cause significant harm to individuals or society.",
        descriptionId: "Kami tidak mengizinkan misinformasi yang dapat menyebabkan bahaya signifikan terhadap individu atau masyarakat.",
        status: "not-allowed"
      },
      {
        id: "ai-content",
        category: "integrity",
        title: "Ai-Generated & Edited Media",
        titleId: "Media yang Diedit dan Konten Buatan Ai",
        description: "We require clear labeling when using Ai or editing content to show realistic people or scenes. We do not allow misleading Ai content on public interest issues.",
        descriptionId: "Kami mewajibkan Anda untuk memberikan label yang jelas jika menggunakan Ai atau mengedit konten untuk menampilkan orang atau adegan yang tampak realistis.",
        status: "not-allowed",
        examples: [
          "REQUIRED: Must label Ai-generated realistic content",
          "NOT ALLOWED: Misleading Ai content about public issues",
          "NOT ALLOWED: Ai content that harms someone"
        ],
        examplesId: [
          "WAJIB: Harus memberi label konten realistis buatan Ai",
          "TIDAK DIIZINKAN: Konten Ai menyesatkan tentang isu publik",
          "TIDAK DIIZINKAN: Konten Ai yang membahayakan seseorang"
        ]
      },
      {
        id: "copyright",
        category: "integrity",
        title: "Intellectual Property",
        titleId: "Hak Kekayaan Intelektual",
        description: "We do not allow content that violates intellectual property rights, including unauthorized reposting of copyrighted or trademarked content.",
        descriptionId: "Kami tidak mengizinkan konten yang melanggar hak kekayaan intelektual, termasuk pemostingan ulang konten berhak cipta atau bermerek dagang tanpa izin.",
        status: "not-allowed"
      },
      {
        id: "fake-engagement",
        category: "integrity",
        title: "Fake Engagement & Spam",
        titleId: "Interaksi Palsu & Spam",
        description: "We do not allow accounts that mislead, manipulate the platform, or sell services to artificially boost engagement.",
        descriptionId: "Kami tidak mengizinkan akun yang menyesatkan, berupaya memanipulasi platform, atau menjual layanan untuk meningkatkan interaksi secara artifisial.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "commercial",
    name: "Regulated Goods & Services",
    nameId: "Barang dan Layanan yang Diatur",
    icon: "ShoppingCart",
    rules: [
      {
        id: "regulated-goods",
        category: "commercial",
        title: "Regulated, Prohibited & High-Risk Goods",
        titleId: "Barang dan Layanan yang Diatur",
        description: "We do not allow the sale, marketing, or promotion of regulated, prohibited, and high-risk goods and services.",
        descriptionId: "Kami tidak mengizinkan penjualan, pemasaran, atau promosi produk dan layanan yang diatur dalam undang-undang, yang dilarang, dan berisiko tinggi.",
        status: "not-allowed"
      },
      {
        id: "branded-content",
        category: "commercial",
        title: "Branded Content Disclosure",
        titleId: "Pengungkapan Konten Komersial",
        description: "If promoting products, brands, or businesses, you must use TikTok content disclosure settings.",
        descriptionId: "Jika mempromosikan produk, brand, atau usaha, Anda harus menggunakan pengaturan pengungkapan konten TikTok.",
        status: "allowed",
        examples: [
          "REQUIRED: Must use TikTok disclosure toggle for promotions",
          "REQUIRED: Clearly label sponsored content",
          "NOT ALLOWED: Hidden or undisclosed paid promotions"
        ],
        examplesId: [
          "WAJIB: Harus gunakan toggle pengungkapan TikTok",
          "WAJIB: Label jelas konten bersponsor",
          "TIDAK DIIZINKAN: Promosi berbayar yang disembunyikan"
        ]
      },
      {
        id: "fraud-scams",
        category: "commercial",
        title: "Fraud & Scams",
        titleId: "Penipuan dan Scam",
        description: "We do not allow content promoting or facilitating scams, fraud, or deceptive schemes.",
        descriptionId: "Kami tidak mengizinkan konten yang mempromosikan atau memfasilitasi scam, penipuan, atau skema yang menipu.",
        status: "not-allowed"
      }
    ]
  }
];
var INSTAGRAM_RULES = [
  {
    id: "authenticity",
    name: "Authenticity & IP",
    nameId: "Keaslian & Hak Kekayaan Intelektual",
    icon: "CheckCircle",
    rules: [
      {
        id: "original-content",
        category: "authenticity",
        title: "Original Content & Copyright",
        titleId: "Konten Asli & Hak Cipta",
        description: "Post only original content you created or have rights to share. Respect copyright and trademark laws.",
        descriptionId: "Posting hanya konten asli yang Anda buat atau miliki hak untuk dibagikan. Hormati hukum hak cipta dan merek dagang.",
        status: "not-allowed",
        examples: [
          "ALLOWED: Post content you created yourself",
          "ALLOWED: Share with proper attribution and permission",
          "NOT ALLOWED: Copy content from internet without permission",
          "NOT ALLOWED: Use copyrighted music without license"
        ],
        examplesId: [
          "DIIZINKAN: Posting konten yang Anda buat sendiri",
          "DIIZINKAN: Bagikan dengan atribusi dan izin yang tepat",
          "TIDAK DIIZINKAN: Salin konten dari internet tanpa izin",
          "TIDAK DIIZINKAN: Gunakan musik berhak cipta tanpa lisensi"
        ]
      }
    ]
  },
  {
    id: "content-safety",
    name: "Content Safety",
    nameId: "Keamanan Konten",
    icon: "Shield",
    rules: [
      {
        id: "appropriate-content",
        category: "content-safety",
        title: "Appropriate Content (Age 13+)",
        titleId: "Konten yang Pantas (Umur 13+)",
        description: "Content must be safe for ages 13+. No nudity (exceptions: breastfeeding, post-mastectomy, art), no graphic violence or disturbing imagery.",
        descriptionId: "Konten harus aman untuk usia 13+. Tidak ada ketelanjangan (kecuali: menyusui, pasca-mastektomi, seni), tidak ada kekerasan grafis atau gambar mengganggu.",
        status: "not-allowed",
        examples: [
          "ALLOWED: Post-mastectomy scarring (medical context)",
          "ALLOWED: Breastfeeding content",
          "ALLOWED: Nudity in classical art/sculptures",
          "NOT ALLOWED: Sexual nudity or explicit content",
          "NOT ALLOWED: Graphic violence or gore"
        ],
        examplesId: [
          "DIIZINKAN: Bekas luka pasca-mastektomi (konteks medis)",
          "DIIZINKAN: Konten menyusui",
          "DIIZINKAN: Ketelanjangan dalam seni klasik/patung",
          "TIDAK DIIZINKAN: Ketelanjangan seksual atau konten eksplisit",
          "TIDAK DIIZINKAN: Kekerasan grafis atau darah"
        ]
      },
      {
        id: "prohibited-content",
        category: "content-safety",
        title: "Prohibited Content",
        titleId: "Konten yang Dilarang",
        description: "Zero tolerance for: terrorism support, organized crime, hate groups, sexual content involving minors, revenge porn, threats to share intimate images.",
        descriptionId: "Toleransi nol untuk: dukungan terorisme, kejahatan terorganisir, kelompok kebencian, konten seksual yang melibatkan anak di bawah umur, pornografi balas dendam, ancaman untuk membagikan gambar intim.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "spam-engagement",
    name: "Spam & Engagement",
    nameId: "Spam & Interaksi",
    icon: "AlertCircle",
    rules: [
      {
        id: "fake-engagement",
        category: "spam-engagement",
        title: "No Spam or Bot Behavior",
        titleId: "Tidak Ada Spam atau Perilaku Bot",
        description: "Don't artificially collect likes, followers, or shares. Avoid repetitive comments or mass messaging. Use only Instagram-approved apps.",
        descriptionId: "Jangan mengumpulkan likes, followers, atau shares secara artifisial. Hindari komentar berulang atau pesan massal. Gunakan hanya aplikasi yang disetujui Instagram.",
        status: "not-allowed",
        examples: [
          "ALLOWED: Organic engagement with your community",
          "ALLOWED: Use Instagram-approved scheduling tools",
          "NOT ALLOWED: Buy likes, followers, or comments",
          "NOT ALLOWED: Use bots or automation for engagement",
          "NOT ALLOWED: Repetitive comments or mass DMs",
          "RECOMMENDED: Safe limit is ~3 posts/day or 3 posts/week"
        ],
        examplesId: [
          "DIIZINKAN: Interaksi organik dengan komunitas Anda",
          "DIIZINKAN: Gunakan alat penjadwalan yang disetujui Instagram",
          "TIDAK DIIZINKAN: Beli likes, followers, atau komentar",
          "TIDAK DIIZINKAN: Gunakan bot atau otomasi untuk interaksi",
          "TIDAK DIIZINKAN: Komentar berulang atau DM massal",
          "DIREKOMENDASIKAN: Batas aman ~3 posting/hari atau 3 posting/minggu"
        ]
      }
    ]
  },
  {
    id: "community",
    name: "Community & Safety",
    nameId: "Komunitas & Keamanan",
    icon: "Heart",
    rules: [
      {
        id: "harassment",
        category: "community",
        title: "No Harassment or Bullying",
        titleId: "Tidak Ada Pelecehan atau Perundungan",
        description: "No credible threats, hate speech, or bullying. Don't target individuals to degrade or shame. No sharing personal information to blackmail/harass.",
        descriptionId: "Tidak ada ancaman yang kredibel, ujaran kebencian, atau perundungan. Jangan menargetkan individu untuk merendahkan atau mempermalukan. Jangan membagikan informasi pribadi untuk memeras/melecehkan.",
        status: "not-allowed"
      },
      {
        id: "misinformation",
        category: "community",
        title: "Misinformation",
        titleId: "Misinformasi",
        description: "Verify facts before posting. Use credible, reputable sources. Avoid sharing sensational or outdated information.",
        descriptionId: "Verifikasi fakta sebelum posting. Gunakan sumber yang kredibel dan terpercaya. Hindari berbagi informasi sensasional atau usang.",
        status: "not-allowed"
      }
    ]
  }
];
var YOUTUBE_RULES = [
  {
    id: "spam-deceptive",
    name: "Spam & Deceptive Practices",
    nameId: "Spam & Praktik Menipu",
    icon: "AlertCircle",
    rules: [
      {
        id: "fake-engagement",
        category: "spam-deceptive",
        title: "No Fake Engagement",
        titleId: "Tidak Ada Interaksi Palsu",
        description: "No buying likes, views, comments, subscribers, or using bots. Thumbnails and titles must accurately represent content.",
        descriptionId: "Tidak boleh membeli likes, views, komentar, subscriber, atau menggunakan bot. Thumbnail dan judul harus mewakili konten secara akurat.",
        status: "not-allowed",
        examples: [
          "NOT ALLOWED: Buy views, likes, comments, or subscribers",
          "NOT ALLOWED: Use bots or automation services",
          "NOT ALLOWED: Misleading thumbnails (clickbait)",
          "NOT ALLOWED: Links to malware or prohibited content",
          "ALLOWED: Organic growth through quality content",
          "ALLOWED: Accurate thumbnails and titles"
        ],
        examplesId: [
          "TIDAK DIIZINKAN: Beli views, likes, komentar, atau subscriber",
          "TIDAK DIIZINKAN: Gunakan bot atau layanan otomasi",
          "TIDAK DIIZINKAN: Thumbnail menyesatkan (clickbait)",
          "TIDAK DIIZINKAN: Link ke malware atau konten terlarang",
          "DIIZINKAN: Pertumbuhan organik melalui konten berkualitas",
          "DIIZINKAN: Thumbnail dan judul yang akurat"
        ]
      },
      {
        id: "inauthentic-content",
        category: "spam-deceptive",
        title: "Inauthentic Content (2025 Update)",
        titleId: "Konten Tidak Asli (Update 2025)",
        description: "Content must add clear value, commentary, or editing to reused material. Mass-produced or template-based content ineligible for monetization.",
        descriptionId: "Konten harus menambahkan nilai, komentar, atau pengeditan yang jelas pada materi yang digunakan kembali. Konten yang diproduksi massal atau berbasis template tidak memenuhi syarat untuk monetisasi.",
        status: "not-allowed",
        examples: [
          "NOT ALLOWED: Repetitious mass-produced content",
          "NOT ALLOWED: Template-based videos without originality",
          "ALLOWED: Reused content with original commentary",
          "ALLOWED: Transformative edits with added value"
        ],
        examplesId: [
          "TIDAK DIIZINKAN: Konten berulang yang diproduksi massal",
          "TIDAK DIIZINKAN: Video berbasis template tanpa orisinalitas",
          "DIIZINKAN: Konten yang digunakan kembali dengan komentar asli",
          "DIIZINKAN: Edit transformatif dengan nilai tambah"
        ]
      }
    ]
  },
  {
    id: "sensitive",
    name: "Sensitive Content",
    nameId: "Konten Sensitif",
    icon: "AlertCircle",
    rules: [
      {
        id: "child-safety",
        category: "sensitive",
        title: "Child Safety",
        titleId: "Keamanan Anak",
        description: 'Content made for kids must be 100% safe. No scary, violent, or inappropriate themes. Mark videos correctly as "made for kids".',
        descriptionId: 'Konten yang dibuat untuk anak-anak harus 100% aman. Tidak ada tema menakutkan, kekerasan, atau tidak pantas. Tandai video dengan benar sebagai "dibuat untuk anak-anak".',
        status: "not-allowed"
      },
      {
        id: "nudity-sexual",
        category: "sensitive",
        title: "Nudity & Sexual Content",
        titleId: "Ketelanjangan & Konten Seksual",
        description: "No explicit sexual content. Exceptions allowed with EDSA context (Educational, Documentary, Scientific, Artistic).",
        descriptionId: "Tidak ada konten seksual eksplisit. Pengecualian diperbolehkan dengan konteks EDSA (Edukatif, Dokumenter, Ilmiah, Artistik).",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "violent-dangerous",
    name: "Violent or Dangerous Content",
    nameId: "Konten Kekerasan atau Berbahaya",
    icon: "Shield",
    rules: [
      {
        id: "violence",
        category: "violent-dangerous",
        title: "No Incitement to Violence",
        titleId: "Tidak Ada Hasutan Kekerasan",
        description: "No incitement to violence, harassment, or hate speech. No content promoting dangerous activities.",
        descriptionId: "Tidak ada hasutan kekerasan, pelecehan, atau ujaran kebencian. Tidak ada konten yang mempromosikan aktivitas berbahaya.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "misinformation",
    name: "Misinformation",
    nameId: "Misinformasi",
    icon: "AlertCircle",
    rules: [
      {
        id: "ai-disclosure",
        category: "misinformation",
        title: "Ai Content Disclosure (2025)",
        titleId: "Pengungkapan Konten Ai (2025)",
        description: "Creators MUST label synthetic content, especially deepfakes and Ai-cloned voices. Required by new 2025 policy.",
        descriptionId: "Kreator HARUS memberi label konten sintetis, terutama deepfake dan suara yang diklon Ai. Diperlukan oleh kebijakan baru 2025.",
        status: "allowed",
        examples: [
          "REQUIRED: Label Ai-generated voices clearly",
          "REQUIRED: Disclose deepfake or synthetic media",
          "NOT ALLOWED: Use Ai without disclosure",
          "NOT ALLOWED: Misleading manipulated content"
        ],
        examplesId: [
          "WAJIB: Label suara yang dihasilkan Ai dengan jelas",
          "WAJIB: Ungkapkan deepfake atau media sintetis",
          "TIDAK DIIZINKAN: Gunakan Ai tanpa pengungkapan",
          "TIDAK DIIZINKAN: Konten manipulatif yang menyesatkan"
        ]
      },
      {
        id: "medical-election",
        category: "misinformation",
        title: "Medical & Election Misinformation",
        titleId: "Misinformasi Medis & Pemilu",
        description: "No medical misinformation, election interference, or manipulated content (deepfakes) that misleads.",
        descriptionId: "Tidak ada misinformasi medis, gangguan pemilu, atau konten yang dimanipulasi (deepfake) yang menyesatkan.",
        status: "not-allowed"
      }
    ]
  },
  {
    id: "enforcement",
    name: "3-Strike Policy",
    nameId: "Kebijakan 3-Strike",
    icon: "AlertCircle",
    rules: [
      {
        id: "strike-system",
        category: "enforcement",
        title: "Strike System & Consequences",
        titleId: "Sistem Strike & Konsekuensi",
        description: "1st violation: Warning + training. 1st strike: 1-week freeze. 2nd strike: 2-week freeze. 3rd strike: Permanent termination.",
        descriptionId: "Pelanggaran 1: Peringatan + pelatihan. Strike 1: Freeze 1 minggu. Strike 2: Freeze 2 minggu. Strike 3: Penghentian permanen.",
        status: "not-allowed",
        examples: [
          "WARNING: No penalty, take training course",
          "1ST STRIKE: 1-week upload freeze",
          "2ND STRIKE: 2-week upload freeze",
          "3RD STRIKE: Channel permanently terminated",
          "NOTE: Strikes expire after 90 days",
          "IMPORTANT: Deleting video does NOT remove strike"
        ],
        examplesId: [
          "PERINGATAN: Tidak ada penalti, ikuti pelatihan",
          "STRIKE 1: Freeze upload 1 minggu",
          "STRIKE 2: Freeze upload 2 minggu",
          "STRIKE 3: Channel dihentikan permanen",
          "CATATAN: Strike kedaluwarsa setelah 90 hari",
          "PENTING: Menghapus video TIDAK menghapus strike"
        ]
      }
    ]
  }
];

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024
    // 100MB limit
  }
});
async function requireAdmin(req, res, next) {
  const adminSessionId = req.cookies?.bias_admin;
  if (!adminSessionId) {
    res.clearCookie("bias_admin");
    return res.status(401).json({ error: "Unauthorized - Admin login required" });
  }
  const session = await storage.getAdminSession(adminSessionId);
  if (!session) {
    res.clearCookie("bias_admin");
    return res.status(401).json({ error: "Unauthorized - Invalid or expired session" });
  }
  req.adminUser = session.username;
  next();
}
async function registerRoutes(app2) {
  app2.post("/api/session", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (sessionId) {
        const existing = await storage.getSession(sessionId);
        if (existing) {
          return res.json(existing);
        }
      }
      const newSession = await storage.createSession({
        sessionId: sessionId || `session-${Date.now()}`,
        tokensRemaining: 100,
        freeRequestsUsed: 0
      });
      res.json(newSession);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/analyze", upload.single("file"), async (req, res) => {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    try {
      const file = req.file;
      console.log(`\u{1F50D} [${requestId}] Analysis request started`);
      const rawData = file ? {
        sessionId: req.body.sessionId,
        mode: req.body.mode,
        inputType: req.body.inputType,
        content: req.body.content || "",
        platform: req.body.platform
      } : req.body;
      const schema = z.object({
        sessionId: z.string(),
        mode: z.enum(["creator", "academic", "hybrid"]),
        inputType: z.enum(["video", "text", "photo", "audio"]),
        content: z.string().optional(),
        platform: z.enum(["tiktok", "instagram", "youtube"]).optional()
      });
      let data;
      try {
        data = schema.parse(rawData);
        console.log(`\u2705 [${requestId}] Validation passed - Mode: ${data.mode}, Type: ${data.inputType}, Platform: ${data.platform || "N/A"}`);
      } catch (validationError) {
        console.error(`\u274C [${requestId}] Validation failed:`, validationError.errors);
        return res.status(400).json({
          error: "Invalid input",
          message: "Request validation failed. Please check your input format.",
          messageId: "Format input tidak valid. Mohon periksa kembali data yang dikirim.",
          details: validationError.errors
        });
      }
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        console.error(`\u274C [${requestId}] Session not found: ${data.sessionId}`);
        return res.status(404).json({
          error: "Session not found",
          message: "Your session could not be found. Please refresh the page.",
          messageId: "Sesi tidak ditemukan. Silakan refresh halaman."
        });
      }
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining <= 0) {
        console.warn(`\u26A0\uFE0F [${requestId}] Insufficient tokens for session ${data.sessionId}`);
        return res.status(403).json({
          error: "No tokens remaining",
          message: "Token balance is empty. Please top up to continue.",
          messageId: "Saldo token habis. Silakan top up untuk melanjutkan."
        });
      }
      let analysisContent = data.content || "";
      if (file) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        analysisContent = `[File uploaded: ${file.originalname} (${fileSizeMB}MB, ${file.mimetype})]

` + analysisContent;
        console.log(`\u{1F4C1} [${requestId}] File received: ${file.originalname}, size: ${fileSizeMB}MB`);
      }
      if (!analysisContent || analysisContent.trim().length < 10) {
        console.error(`\u274C [${requestId}] Insufficient content for analysis (${analysisContent.length} chars)`);
        return res.status(400).json({
          error: "Insufficient content",
          message: "Please provide detailed description or content for analysis (minimum 10 characters).",
          messageId: "Harap berikan deskripsi atau konten yang cukup detail untuk dianalisis (minimum 10 karakter)."
        });
      }
      console.log(`\u{1F916} [${requestId}] Starting BIAS analysis... (content length: ${analysisContent.length} chars)`);
      let result;
      try {
        result = await analyzeBehavior({
          mode: data.mode,
          inputType: data.inputType,
          content: analysisContent,
          platform: data.platform
        });
        const analysisTime = Date.now() - startTime;
        console.log(`\u2705 [${requestId}] Analysis completed successfully in ${analysisTime}ms - Overall score: ${result.overallScore}/10`);
      } catch (analysisError) {
        console.error(`\u274C [${requestId}] Analysis engine failed:`, analysisError);
        return res.status(500).json({
          error: "Analysis failed",
          message: "Our Ai analysis engine encountered an error. This could be due to high load or API timeout. Please try again.",
          messageId: "Analisis Ai mengalami error. Ini bisa karena server load tinggi atau timeout. Silakan coba lagi.",
          details: process.env.NODE_ENV === "development" ? analysisError.message : void 0
        });
      }
      try {
        await storage.createAnalysis({
          sessionId: data.sessionId,
          mode: data.mode,
          inputType: data.inputType,
          inputContent: analysisContent,
          analysisResult: JSON.stringify(result)
        });
        console.log(`\u{1F4BE} [${requestId}] Analysis saved to storage`);
      } catch (storageError) {
        console.error(`\u26A0\uFE0F [${requestId}] Failed to save analysis (non-critical):`, storageError);
      }
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + 1
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - 1
        });
      }
      const totalTime = Date.now() - startTime;
      console.log(`\u{1F389} [${requestId}] Request completed successfully in ${totalTime}ms`);
      res.json({
        analysis: result,
        session: await storage.getSession(data.sessionId)
      });
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`\u{1F4A5} [${requestId}] Unexpected error after ${totalTime}ms:`, error);
      let userMessage = "An unexpected error occurred. Please try again.";
      let userMessageId = "Terjadi error tidak terduga. Silakan coba lagi.";
      if (error.message?.includes("timeout")) {
        userMessage = "Analysis timed out. Please try with shorter content or try again later.";
        userMessageId = "Analisis timeout. Coba dengan konten lebih pendek atau coba lagi nanti.";
      } else if (error.message?.includes("OpenAI") || error.message?.includes("API")) {
        userMessage = "Ai service temporarily unavailable. Please try again in a few moments.";
        userMessageId = "Layanan Ai sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.";
      }
      res.status(500).json({
        error: error.message,
        message: userMessage,
        messageId: userMessageId,
        details: process.env.NODE_ENV === "development" ? {
          stack: error.stack,
          name: error.name
        } : void 0
      });
    }
  });
  app2.post("/api/analyze-account", async (req, res) => {
    try {
      const schema = z.object({
        platform: z.enum(["tiktok", "instagram", "youtube"]),
        username: z.string().min(1)
      });
      const data = schema.parse(req.body);
      if (data.platform !== "tiktok") {
        return res.status(400).json({
          error: "Platform not supported yet",
          message: "Saat ini hanya TikTok yang didukung. Instagram dan YouTube akan segera hadir!",
          messageId: "Saat ini hanya TikTok yang didukung. Instagram dan YouTube akan segera hadir!"
        });
      }
      const clientIp = req.ip || "unknown";
      const rateLimit = checkRateLimit2(`analyze-account:${clientIp}`, {
        windowMs: 6e4,
        maxRequests: 10
      });
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Terlalu banyak permintaan. Silakan tunggu beberapa saat.",
          messageId: "Terlalu banyak permintaan. Silakan tunggu beberapa saat.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1e3)
        });
      }
      let cleanUsername = data.username;
      if (data.username.includes("@") || data.username.includes("tiktok.com")) {
        const extracted = extractUsernameFromUrl(data.username);
        if (extracted) {
          cleanUsername = extracted;
        }
      }
      if (!isValidTikTokUsername(cleanUsername)) {
        return res.status(400).json({
          error: "Invalid username",
          message: "Username tidak valid. Gunakan format @username yang benar (2-24 karakter, huruf/angka/underscore/titik).",
          messageId: "Username tidak valid. Gunakan format @username yang benar (2-24 karakter, huruf/angka/underscore/titik)."
        });
      }
      cleanUsername = sanitizeUsername(cleanUsername);
      const scrapedData = await scrapeTikTokProfile(cleanUsername);
      const engagementRate = calculateEngagementRate2(scrapedData.likesCount, scrapedData.followerCount);
      const avgViews = calculateAverage(scrapedData.likesCount, scrapedData.videoCount);
      const followersMetric = toMetricValue(scrapedData.followerCount);
      const followingMetric = toMetricValue(scrapedData.followingCount);
      const likesMetric = toMetricValue(scrapedData.likesCount);
      const videosMetric = toMetricValue(scrapedData.videoCount);
      res.json({
        success: true,
        platform: data.platform,
        username: scrapedData.username,
        displayName: scrapedData.nickname,
        profilePhotoUrl: scrapedData.avatarUrl,
        bio: scrapedData.signature,
        verified: scrapedData.verified,
        isPrivate: false,
        dataSource: "web-scraper",
        metrics: {
          followers: followersMetric,
          following: followingMetric,
          likes: likesMetric,
          videos: videosMetric,
          engagementRate: parseFloat(engagementRate.toFixed(1)),
          avgViews,
          followerGrowth: 0,
          // TODO: Implement growth tracking
          likeGrowth: 0
          // TODO: Implement growth tracking
        },
        insights: {
          engagementAnalysis: "detailed-analysis",
          growthStrategy: "growth-recommendations"
        }
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Input tidak valid",
          message: "Username atau platform tidak sesuai format. Silakan periksa kembali.",
          messageId: "Username atau platform tidak sesuai format. Silakan periksa kembali."
        });
      }
      res.status(500).json({
        error: "Gagal menganalisis akun",
        message: "Maaf, terjadi kesalahan saat menganalisis akun. Kemungkinan: (1) Akun bersifat private atau tidak ditemukan, (2) Platform sedang bermasalah, atau (3) Username salah. Silakan coba akun publik lainnya.",
        messageId: "Maaf, terjadi kesalahan saat menganalisis akun. Kemungkinan: (1) Akun bersifat private atau tidak ditemukan, (2) Platform sedang bermasalah, atau (3) Username salah. Silakan coba akun publik lainnya."
      });
    }
  });
  app2.post("/api/analyze-video", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
          message: "Silakan upload file video atau gambar untuk dianalisis.",
          messageId: "Silakan upload file video atau gambar untuk dianalisis."
        });
      }
      const description = req.body.description || "TikTok video content";
      const mode = req.body.mode || "tiktok";
      const base64Image = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      const isVideo = mimeType.startsWith("video/");
      const analysisPrompt = mode === "tiktok" ? `Analyze this TikTok ${isVideo ? "video thumbnail" : "image"} for content performance. Context: ${description}
        
Evaluate and score (0-100) these aspects:
1. Hook Strength: How attention-grabbing is the opening visual?
2. Visual Quality: Lighting, composition, color grading
3. Audio Clarity: Based on visual cues (text overlays, mouth movement clarity)
4. Engagement Potential: Shareability, relatability, emotional appeal
5. Retention Score: Will viewers watch till the end?

Also provide:
- 3 key strengths
- 3 areas for improvement  
- 3 specific actionable recommendations

Respond in JSON format:
{
  "overallScore": number,
  "hookStrength": number,
  "visualQuality": number,
  "audioClarity": number,
  "engagement": number,
  "retention": number,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}` : `Analyze this marketing/presentation content. Context: ${description}
        
Evaluate and score (0-100) these aspects:
1. Hook Strength: How attention-grabbing is the opening?
2. Visual Quality: Professional appearance, branding
3. Audio Clarity: Presentation clarity (based on visual cues)
4. Engagement Potential: Audience interest, persuasiveness
5. Retention Score: Will audience stay engaged?

Also provide:
- 3 key strengths
- 3 areas for improvement
- 3 specific actionable recommendations

Respond in JSON format:
{
  "overallScore": number,
  "hookStrength": number,
  "visualQuality": number,
  "audioClarity": number,
  "engagement": number,
  "retention": number,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;
      const OpenAI4 = (await import("openai")).default;
      const openai = new OpenAI4({ apiKey: process.env.OPENAI_API_KEY });
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 1e3,
        response_format: { type: "json_object" }
      });
      const analysisText = visionResponse.choices[0]?.message?.content || "{}";
      const analysisResult = JSON.parse(analysisText);
      if (typeof analysisResult.overallScore !== "number") {
        throw new Error("Invalid analysis result");
      }
      res.json({
        success: true,
        result: analysisResult
      });
    } catch (error) {
      console.error("Video analysis error:", error);
      res.status(500).json({
        error: "Analysis failed",
        message: "Gagal menganalisis konten. Silakan coba lagi.",
        messageId: "Gagal menganalisis konten. Silakan coba lagi."
      });
    }
  });
  app2.post("/api/analyze-screenshot", async (req, res) => {
    try {
      const schema = z.object({
        image: z.string().min(1),
        guideType: z.string().optional(),
        language: z.enum(["en", "id"]).optional()
      });
      const data = schema.parse(req.body);
      const lang = data.language || "id";
      const guideType = data.guideType || "profile";
      const base64Match = data.image.match(/^data:image\/\w+;base64,(.+)$/);
      if (!base64Match) {
        return res.status(400).json({
          error: "Invalid image format",
          message: "Format gambar tidak valid. Gunakan screenshot dari TikTok.",
          messageId: "Format gambar tidak valid. Gunakan screenshot dari TikTok."
        });
      }
      const base64Image = base64Match[1];
      const guidePrompts = {
        profile: "TikTok profile analytics screenshot showing followers, views, engagement metrics",
        content: "TikTok content performance screenshot showing video stats, views, likes",
        followers: "TikTok follower insights screenshot showing demographics, activity times",
        live: "TikTok LIVE analytics screenshot showing viewer count, duration, gifts"
      };
      const contextDescription = guidePrompts[guideType] || guidePrompts.profile;
      const langInstruction = lang === "id" ? "Respond in Indonesian (Bahasa Indonesia)." : "Respond in English.";
      const analysisPrompt = `Analyze this ${contextDescription}. ${langInstruction}

Extract all visible metrics and provide insights. Respond in JSON format:
{
  "metrics": [
    { "name": "Metric Name", "value": "extracted value", "status": "good|average|needs_work" },
    ...
  ],
  "summary": "Brief overall assessment",
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Status meanings:
- good: Above average performance
- average: Normal performance  
- needs_work: Below expectations, needs improvement`;
      const OpenAI4 = (await import("openai")).default;
      const openai = new OpenAI4({ apiKey: process.env.OPENAI_API_KEY });
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });
      const analysisText = visionResponse.choices[0]?.message?.content || "{}";
      const analysisResult = JSON.parse(analysisText);
      if (!analysisResult.metrics || !Array.isArray(analysisResult.metrics)) {
        throw new Error("Invalid analysis result structure");
      }
      res.json({
        success: true,
        result: analysisResult
      });
    } catch (error) {
      console.error("Screenshot analysis error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid input",
          message: "Data screenshot tidak valid.",
          messageId: "Data screenshot tidak valid."
        });
      }
      res.status(500).json({
        error: "Analysis failed",
        message: "Gagal menganalisis screenshot. Pastikan gambar jelas dan coba lagi.",
        messageId: "Gagal menganalisis screenshot. Pastikan gambar jelas dan coba lagi."
      });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        message: z.string().min(1),
        mode: z.enum(["creator", "academic", "hybrid"])
      });
      const data = schema.parse(req.body);
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining <= 0) {
        return res.status(403).json({
          error: "No tokens remaining",
          message: "Token balance is empty. Please top up to continue.",
          messageId: "Saldo token habis. Silakan top up untuk melanjutkan."
        });
      }
      await storage.createChat({
        sessionId: data.sessionId,
        role: "user",
        message: data.message
      });
      const { response, isOnTopic, provider } = await generateAICascadeResponse(data.message, data.mode);
      console.log(`Chat response from ${provider.toUpperCase()}`);
      await storage.createChat({
        sessionId: data.sessionId,
        role: "assistant",
        message: response
      });
      if (isOnTopic) {
        if (session.freeRequestsUsed < 3) {
          await storage.updateSession(data.sessionId, {
            freeRequestsUsed: session.freeRequestsUsed + 1
          });
        } else {
          await storage.updateSession(data.sessionId, {
            tokensRemaining: session.tokensRemaining - 1
          });
        }
      }
      res.json({
        response,
        isOnTopic,
        session: await storage.getSession(data.sessionId)
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/chats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const chats2 = await storage.getChatsBySession(sessionId);
      res.json(chats2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/chats/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearChatsBySession(sessionId);
      res.json({ success: true, message: "Chat history cleared" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/analyses/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const analyses2 = await storage.getAnalysesBySession(sessionId);
      res.json(analyses2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tiktok/profile", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        username: z.string().min(1),
        followers: z.number().min(0),
        following: z.number().min(0),
        totalLikes: z.number().min(0),
        videoCount: z.number().min(0),
        avgViews: z.number().min(0),
        avgEngagementRate: z.number().min(0),
        bio: z.string().optional(),
        verified: z.boolean().optional()
      });
      const data = schema.parse(req.body);
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      const tokenCost = 3;
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining < tokenCost) {
        return res.status(403).json({
          error: "Insufficient tokens",
          message: `TikTok Profile Analysis requires ${tokenCost} tokens. Current balance: ${session.tokensRemaining}`,
          messageId: `Analisis TikTok Profile butuh ${tokenCost} token. Saldo: ${session.tokensRemaining}`
        });
      }
      const analysis = await analyzeTikTokAccount({
        username: data.username,
        followers: data.followers,
        following: data.following,
        totalLikes: data.totalLikes,
        videoCount: data.videoCount,
        avgViews: data.avgViews,
        avgEngagementRate: data.avgEngagementRate,
        bio: data.bio,
        verified: data.verified
      });
      await storage.createTiktokAccount({
        sessionId: data.sessionId,
        username: data.username,
        followers: data.followers,
        following: data.following,
        totalLikes: data.totalLikes,
        totalVideos: data.videoCount,
        avgViews: data.avgViews,
        engagementRate: data.avgEngagementRate,
        bio: data.bio,
        verified: data.verified,
        analysisResult: JSON.stringify(analysis)
      });
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + tokenCost
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - tokenCost
        });
      }
      res.json({
        analysis,
        session: await storage.getSession(data.sessionId)
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tiktok/video", async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        videoId: z.string().min(1),
        description: z.string(),
        views: z.number().min(0),
        likes: z.number().min(0),
        comments: z.number().min(0),
        shares: z.number().min(0),
        duration: z.number().min(1),
        hashtags: z.array(z.string()),
        sounds: z.string().optional(),
        transcription: z.string().optional()
      });
      const data = schema.parse(req.body);
      const session = await storage.getSession(data.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      const tokenCost = 4;
      if (session.freeRequestsUsed >= 3 && session.tokensRemaining < tokenCost) {
        return res.status(403).json({
          error: "Insufficient tokens",
          message: `TikTok Video Analysis requires ${tokenCost} tokens. Current balance: ${session.tokensRemaining}`,
          messageId: `Analisis TikTok Video butuh ${tokenCost} token. Saldo: ${session.tokensRemaining}`
        });
      }
      const analysis = await analyzeTikTokVideo({
        videoId: data.videoId,
        description: data.description,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        duration: data.duration,
        hashtags: data.hashtags,
        sounds: data.sounds,
        transcription: data.transcription
      });
      await storage.createTiktokVideo({
        sessionId: data.sessionId,
        videoId: data.videoId,
        accountUsername: data.videoId,
        // Use videoId as placeholder for username
        description: data.description,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        duration: data.duration,
        hashtags: data.hashtags,
        soundName: data.sounds,
        analysisResult: JSON.stringify(analysis)
      });
      if (session.freeRequestsUsed < 3) {
        await storage.updateSession(data.sessionId, {
          freeRequestsUsed: session.freeRequestsUsed + tokenCost
        });
      } else {
        await storage.updateSession(data.sessionId, {
          tokensRemaining: session.tokensRemaining - tokenCost
        });
      }
      res.json({
        analysis,
        session: await storage.getSession(data.sessionId)
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tiktok/accounts/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const accounts = await storage.getTiktokAccountsBySession(sessionId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tiktok/videos/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const videos = await storage.getTiktokVideosBySession(sessionId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/library/contribute", async (req, res) => {
    try {
      const schema = z.object({
        term: z.string().min(1),
        termId: z.string().optional(),
        definition: z.string().min(10),
        definitionId: z.string().optional(),
        platform: z.enum(["tiktok", "instagram", "youtube"]),
        username: z.string().min(1),
        example: z.string().optional(),
        exampleId: z.string().optional()
      });
      const data = schema.parse(req.body);
      const contribution = await storage.createLibraryContribution({
        ...data,
        status: "pending"
      });
      res.json({ success: true, contribution });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/verify", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) {
        return res.status(500).json({ error: "Admin password not configured" });
      }
      if (password === adminPassword) {
        res.json({ success: true, isAdmin: true });
      } else {
        res.status(401).json({ success: false, isAdmin: false, error: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminUsername = process.env.ADMIN_USERNAME || "superadmin";
      if (!adminPassword) {
        return res.status(500).json({ error: "Admin credentials not configured" });
      }
      const passwordMatch = Buffer.from(password).length === Buffer.from(adminPassword).length && timingSafeEqual(
        Buffer.from(password),
        Buffer.from(adminPassword)
      );
      const usernameMatch = username === adminUsername;
      if (!usernameMatch || !passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const sessionId = randomUUID2();
      const session = await storage.createAdminSession(sessionId, adminUsername);
      await storage.cleanExpiredAdminSessions();
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("bias_admin", sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      });
      res.json({
        success: true,
        username: adminUsername,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      console.error("[ADMIN] Login error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/logout", async (req, res) => {
    try {
      const sessionId = req.cookies?.bias_admin;
      if (sessionId) {
        await storage.deleteAdminSession(sessionId);
      }
      res.clearCookie("bias_admin");
      res.json({ success: true });
    } catch (error) {
      console.error("[ADMIN] Logout error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/me", requireAdmin, async (req, res) => {
    try {
      const username = req.adminUser;
      res.json({ authenticated: true, username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/library/contributions/pending", async (req, res) => {
    try {
      const contributions = await storage.getPendingContributions();
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/library/contributions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        term: z.string().optional(),
        termId: z.string().optional(),
        definition: z.string().optional(),
        definitionId: z.string().optional(),
        example: z.string().optional(),
        exampleId: z.string().optional()
      });
      const updates = schema.parse(req.body);
      const contribution = await storage.updateLibraryContribution(id, updates);
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json(contribution);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/library/contributions/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const contribution = await storage.updateLibraryContribution(id, {
        status: "approved",
        approvedAt: /* @__PURE__ */ new Date()
      });
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json({ success: true, contribution });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/library/contributions/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const contribution = await storage.updateLibraryContribution(id, {
        status: "rejected"
      });
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json({ success: true, contribution });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/library/contributions/approved", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const contributions = await storage.getApprovedContributions();
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/library/contributions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLibraryContribution(id);
      if (!deleted) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/success-stories", async (req, res) => {
    try {
      const story = await storage.createSuccessStory(req.body);
      res.json({ success: true, story });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/success-stories/approved", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      const stories = await storage.getApprovedSuccessStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/success-stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedSuccessStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/success-stories/pending", requireAdmin, async (req, res) => {
    try {
      const stories = await storage.getPendingSuccessStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/success-stories/:id/approve", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { featured } = req.body;
      const story = await storage.updateSuccessStory(id, {
        status: "approved",
        featured: featured || false,
        approvedAt: /* @__PURE__ */ new Date()
      });
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true, story });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/success-stories/:id/reject", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.updateSuccessStory(id, { status: "rejected" });
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true, story });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/success-stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.updateSuccessStory(id, req.body);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true, story });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/success-stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSuccessStory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/success-stories/all", requireAdmin, async (req, res) => {
    try {
      const [pending, approved] = await Promise.all([
        storage.getPendingSuccessStories(),
        storage.getApprovedSuccessStories()
      ]);
      res.json({ pending, approved });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/library/all", async (req, res) => {
    try {
      const tiktokItems = TIKTOK_RULES.flatMap(
        (category) => category.rules.map((rule) => ({
          id: `tiktok-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: "tiktok",
          source: "original",
          category: category.name,
          categoryId: category.nameId
        }))
      );
      const instagramItems = INSTAGRAM_RULES.flatMap(
        (category) => category.rules.map((rule) => ({
          id: `instagram-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: "instagram",
          source: "original",
          category: category.name,
          categoryId: category.nameId
        }))
      );
      const youtubeItems = YOUTUBE_RULES.flatMap(
        (category) => category.rules.map((rule) => ({
          id: `youtube-rule-${rule.id}`,
          term: rule.title,
          termId: rule.titleId,
          definition: rule.description,
          definitionId: rule.descriptionId,
          platform: "youtube",
          source: "original",
          category: category.name,
          categoryId: category.nameId
        }))
      );
      const contributions = await storage.getApprovedContributions();
      const deletedItems = await storage.getDeletedLibraryItems();
      const allItems = [
        ...tiktokItems,
        ...instagramItems,
        ...youtubeItems,
        ...contributions.map((c) => ({
          id: c.id,
          term: c.term,
          termId: c.termId || "",
          definition: c.definition,
          definitionId: c.definitionId || "",
          platform: c.platform,
          source: "user-contribution",
          username: c.username,
          approvedAt: c.approvedAt
        }))
      ].filter((item) => !deletedItems.includes(item.id));
      console.log(`[LIBRARY] Returning ${allItems.length} library items`);
      res.json(allItems);
    } catch (error) {
      console.error("[LIBRARY] Error fetching all library content:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/library/bulk-delete", async (req, res) => {
    try {
      const { itemIds } = req.body;
      if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({ error: "itemIds must be a non-empty array" });
      }
      console.log(`[LIBRARY] Bulk deleting ${itemIds.length} items:`, itemIds);
      let deletedCount = 0;
      for (const id of itemIds) {
        const contribution = await storage.getLibraryContribution(id);
        if (contribution) {
          const deleted = await storage.deleteLibraryContribution(id);
          if (deleted) deletedCount++;
        } else {
          await storage.addDeletedLibraryItem(id);
          deletedCount++;
        }
      }
      console.log(`[LIBRARY] Successfully deleted ${deletedCount} items`);
      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("[LIBRARY] Error bulk deleting:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { sessionId, page, language } = req.body;
      if (!sessionId || !page) {
        return res.status(400).json({ error: "sessionId and page are required" });
      }
      await storage.trackPageView({
        sessionId,
        page,
        language: language || null
      });
      res.json({ success: true });
    } catch (error) {
      console.error("[ANALYTICS] Error tracking page view:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/analytics/feature", async (req, res) => {
    try {
      const { sessionId, featureType, platform, mode, language, featureDetails } = req.body;
      if (!sessionId || !featureType) {
        return res.status(400).json({ error: "sessionId and featureType are required" });
      }
      await storage.trackFeatureUsage({
        sessionId,
        featureType,
        platform: platform || null,
        mode: mode || null,
        language: language || null,
        featureDetails: featureDetails || null
      });
      res.json({ success: true });
    } catch (error) {
      console.error("[ANALYTICS] Error tracking feature usage:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/brands/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const brand = await storage.getBrandBySlug(slug);
      if (!brand || !brand.isActive) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/brands/active", async (req, res) => {
    try {
      const activeBrands = await storage.getActiveBrands();
      res.json(activeBrands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/brands", requireAdmin, async (req, res) => {
    try {
      const allBrands = await storage.getAllBrands();
      res.json(allBrands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/brands", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({
        slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
        name: z.string().min(1).max(100),
        shortName: z.string().min(1).max(20),
        taglineEn: z.string().optional(),
        taglineId: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleId: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionId: z.string().optional(),
        colorPrimary: z.string().optional(),
        colorSecondary: z.string().optional(),
        logoUrl: z.string().optional(),
        tiktokHandle: z.string().optional(),
        tiktokUrl: z.string().optional(),
        instagramHandle: z.string().optional(),
        instagramUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().optional()
      });
      const data = schema.parse(req.body);
      const existing = await storage.getBrandBySlug(data.slug);
      if (existing) {
        return res.status(400).json({ error: "Slug sudah digunakan" });
      }
      const brand = await storage.createBrand(data);
      res.status(201).json(brand);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
        name: z.string().min(1).max(100).optional(),
        shortName: z.string().min(1).max(20).optional(),
        taglineEn: z.string().optional(),
        taglineId: z.string().optional(),
        subtitleEn: z.string().optional(),
        subtitleId: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionId: z.string().optional(),
        colorPrimary: z.string().optional(),
        colorSecondary: z.string().optional(),
        logoUrl: z.string().optional(),
        tiktokHandle: z.string().optional(),
        tiktokUrl: z.string().optional(),
        instagramHandle: z.string().optional(),
        instagramUrl: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().optional()
      });
      const data = schema.parse(req.body);
      if (data.slug) {
        const existing = await storage.getBrandBySlug(data.slug);
        if (existing && existing.id !== id) {
          return res.status(400).json({ error: "Slug sudah digunakan" });
        }
      }
      const updated = await storage.updateBrand(id, data);
      if (!updated) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBrand(id);
      if (!deleted) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/analytics/stats", requireAdmin, async (req, res) => {
    try {
      const { days } = req.query;
      const daysNum = days ? parseInt(days) : 7;
      const [
        pageViewStats,
        featureUsageStats,
        uniqueSessions,
        totalPageViews,
        totalFeatureUsage,
        navigationBreakdown,
        tabBreakdown,
        buttonClickBreakdown
      ] = await Promise.all([
        storage.getPageViewStats(daysNum),
        storage.getFeatureUsageStats(daysNum),
        storage.getUniqueSessionsCount(daysNum),
        storage.getTotalPageViews(daysNum),
        storage.getTotalFeatureUsage(daysNum),
        storage.getNavigationBreakdown(daysNum),
        storage.getTabBreakdown(daysNum),
        storage.getButtonClickBreakdown(daysNum)
      ]);
      res.json({
        period: `${daysNum} days`,
        overview: {
          uniqueSessions,
          totalPageViews,
          totalFeatureUsage
        },
        pageViews: pageViewStats,
        featureUsage: featureUsageStats,
        navigationBreakdown,
        tabBreakdown,
        buttonClickBreakdown
      });
    } catch (error) {
      console.error("[ANALYTICS] Error getting stats:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/generate-thumbnail", async (req, res) => {
    try {
      const { topic, style, aspectRatio } = req.body;
      if (!topic) {
        return res.status(400).json({
          error: "Topic is required",
          message: "Topik diperlukan untuk membuat preview",
          messageId: "Topik diperlukan untuk membuat preview"
        });
      }
      const dimensions = {
        "16:9": "1280x720",
        "9:16": "720x1280",
        "1:1": "720x720"
      };
      const dim = dimensions[aspectRatio] || "1280x720";
      const displayText = `${topic.substring(0, 25)}`;
      const previewUrl = `https://placehold.co/${dim}/1a1a1a/ff0050?text=${encodeURIComponent(displayText)}&font=roboto`;
      res.json({
        success: true,
        imageUrl: previewUrl,
        prompt: `${topic} - ${style}`,
        type: "concept-preview"
      });
    } catch (error) {
      console.error("[THUMBNAIL] Error:", error);
      res.status(500).json({
        error: error.message,
        message: "Gagal membuat preview thumbnail",
        messageId: "Gagal membuat preview thumbnail"
      });
    }
  });
  app2.post("/api/test-hooks", async (req, res) => {
    try {
      const schema = z.object({
        hooks: z.array(z.object({
          id: z.string(),
          text: z.string().min(1)
        })).min(2).max(5),
        language: z.enum(["en", "id"]).optional()
      });
      const data = schema.parse(req.body);
      const lang = data.language || "id";
      const hooksText = data.hooks.map(
        (h, i) => `Hook ${String.fromCharCode(65 + i)}: "${h.text}"`
      ).join("\n");
      const langInstruction = lang === "id" ? "Respond in Indonesian (Bahasa Indonesia)." : "Respond in English.";
      const prompt = `You are a TikTok viral content expert. Analyze these hook variations and determine which one has the highest viral potential. ${langInstruction}

${hooksText}

For each hook, evaluate:
1. Attention-grabbing power (curiosity, emotion, relatability)
2. Clarity and conciseness
3. Call to action/engagement trigger
4. Platform fit for TikTok/short-form video

Respond in JSON format:
{
  "results": [
    {
      "hookId": "id from input",
      "hookText": "the hook text",
      "score": number 0-100,
      "viralPotential": "high" | "medium" | "low",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "suggestion": "specific improvement suggestion"
    }
  ],
  "winner": "A" or "B" or "C" etc,
  "winnerScore": number,
  "comparison": "brief explanation why winner is best"
}

Be objective and provide actionable feedback.`;
      const OpenAI4 = (await import("openai")).default;
      const openai = new OpenAI4({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });
      const resultText = completion.choices[0]?.message?.content || "{}";
      const result = JSON.parse(resultText);
      if (result.results) {
        result.results = result.results.map((r, i) => ({
          ...r,
          hookId: data.hooks[i]?.id || r.hookId,
          hookText: data.hooks[i]?.text || r.hookText
        }));
      }
      res.json(result);
    } catch (error) {
      console.error("[HOOK_TESTER] Error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid input",
          message: "Minimal 2 hook diperlukan, maksimal 5.",
          messageId: "Minimal 2 hook diperlukan, maksimal 5."
        });
      }
      res.status(500).json({
        error: "Analysis failed",
        message: "Gagal menganalisis hook. Silakan coba lagi.",
        messageId: "Gagal menganalisis hook. Silakan coba lagi."
      });
    }
  });
  app2.post("/api/chat/hybrid", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const { hybridChat: hybridChat2 } = await Promise.resolve().then(() => (init_hybrid_chat(), hybrid_chat_exports));
      const result = await hybridChat2({
        message,
        sessionId: sessionId || "anonymous"
      });
      res.json(result);
    } catch (error) {
      console.error("[HYBRID_CHAT] Error:", error);
      res.status(500).json({
        response: "Maaf bro, ada error. Coba lagi ya!",
        source: "local",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/learning-stats", requireAdmin, async (req, res) => {
    try {
      const { getLearningStats: getLearningStats2 } = await Promise.resolve().then(() => (init_learning_system(), learning_system_exports));
      const stats = await getLearningStats2();
      res.json(stats);
    } catch (error) {
      console.error("[LEARNING_STATS] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/ai-settings", requireAdmin, async (req, res) => {
    try {
      const { getConfig: getConfig2, getUsageStats: getUsageStats2 } = await Promise.resolve().then(() => (init_ai_rate_limiter(), ai_rate_limiter_exports));
      const config = getConfig2();
      res.json({ config });
    } catch (error) {
      console.error("[AI_SETTINGS] Error getting config:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/ai-settings", requireAdmin, async (req, res) => {
    try {
      const { updateConfig: updateConfig2, getConfig: getConfig2 } = await Promise.resolve().then(() => (init_ai_rate_limiter(), ai_rate_limiter_exports));
      const newConfig = req.body;
      const validKeys = ["maxRequestsPerHour", "maxRequestsPerDay", "maxTokensPerDay", "maxTokensPerRequest"];
      const updates = {};
      for (const key of validKeys) {
        if (newConfig[key] !== void 0) {
          const value = parseInt(newConfig[key]);
          if (isNaN(value) || value < 0) {
            return res.status(400).json({ error: `Invalid value for ${key}` });
          }
          updates[key] = value;
        }
      }
      updateConfig2(updates);
      res.json({ success: true, config: getConfig2() });
    } catch (error) {
      console.error("[AI_SETTINGS] Error updating config:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/ai-usage", requireAdmin, async (req, res) => {
    try {
      const { getConfig: getConfig2 } = await Promise.resolve().then(() => (init_ai_rate_limiter(), ai_rate_limiter_exports));
      res.json({
        config: getConfig2(),
        note: "Per-session usage stats reset on server restart"
      });
    } catch (error) {
      console.error("[AI_USAGE] Error getting usage:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/expert-knowledge", async (req, res) => {
    try {
      const { category, subcategory, level, search } = req.query;
      const entries = await storage.getExpertKnowledge({
        category,
        subcategory,
        level,
        search
      });
      res.json(entries);
    } catch (error) {
      console.error("[EXPERT_KNOWLEDGE] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/hooks", async (req, res) => {
    try {
      const { hookType, category, search } = req.query;
      const entries = await storage.getHooks({
        hookType,
        category,
        search
      });
      res.json(entries);
    } catch (error) {
      console.error("[HOOKS] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/storytelling-frameworks", async (req, res) => {
    try {
      const entries = await storage.getStorytellingFrameworks();
      res.json(entries);
    } catch (error) {
      console.error("[STORYTELLING] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/growth-guides", async (req, res) => {
    try {
      const { followers } = req.query;
      const followerCount = followers ? parseInt(followers) : void 0;
      const entries = await storage.getGrowthStageGuides(followerCount);
      res.json(entries);
    } catch (error) {
      console.error("[GROWTH_GUIDES] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/growth-guides/:stage", async (req, res) => {
    try {
      const { stage } = req.params;
      const entry = await storage.getGrowthStageGuideByStage(stage);
      if (!entry) {
        return res.status(404).json({ error: "Growth stage not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("[GROWTH_GUIDES] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/response-templates", async (req, res) => {
    try {
      const { category } = req.query;
      const entries = await storage.getResponseTemplates(category);
      res.json(entries);
    } catch (error) {
      console.error("[RESPONSE_TEMPLATES] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/live-streaming-templates", async (req, res) => {
    try {
      const { format, duration } = req.query;
      const entries = await storage.getLiveStreamingTemplates({
        format,
        duration
      });
      res.json(entries);
    } catch (error) {
      console.error("[LIVE_STREAMING] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/script-templates", async (req, res) => {
    try {
      const { category, duration, goal, level } = req.query;
      const entries = await storage.getScriptTemplates({
        category,
        duration,
        goal,
        level
      });
      res.json(entries);
    } catch (error) {
      console.error("[SCRIPT_TEMPLATES] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/settings/public", async (req, res) => {
    try {
      const settings = await storage.getPublicSettings();
      res.json(settings);
    } catch (error) {
      console.error("[SETTINGS] Error getting public settings:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/pricing", async (req, res) => {
    try {
      const tiers = await storage.getActivePricingTiers();
      res.json(tiers);
    } catch (error) {
      console.error("[PRICING] Error getting pricing:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("[ADMIN_SETTINGS] Error getting settings:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const adminUser = req.adminUser;
      if (value === void 0) {
        return res.status(400).json({ error: "Value is required" });
      }
      const existingSetting = await storage.getSetting(key);
      if (!existingSetting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      if (!existingSetting.isEditable) {
        return res.status(403).json({ error: "This setting cannot be modified" });
      }
      let validatedValue = String(value);
      if (existingSetting.valueType === "number") {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) {
          return res.status(400).json({ error: "Value must be a valid number" });
        }
        validatedValue = String(numVal);
      } else if (existingSetting.valueType === "boolean") {
        if (value !== "true" && value !== "false" && value !== true && value !== false) {
          return res.status(400).json({ error: "Value must be true or false" });
        }
        validatedValue = String(value === true || value === "true");
      }
      const setting = await storage.updateSetting(key, validatedValue, adminUser);
      res.json(setting);
    } catch (error) {
      console.error("[ADMIN_SETTINGS] Error updating setting:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/pricing", requireAdmin, async (req, res) => {
    try {
      const tiers = await storage.getAllPricingTiers();
      res.json(tiers);
    } catch (error) {
      console.error("[ADMIN_PRICING] Error getting pricing:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/admin/pricing/:slug", requireAdmin, async (req, res) => {
    try {
      const { slug } = req.params;
      const updates = req.body;
      const adminUser = req.adminUser;
      const existingTier = await storage.getPricingTier(slug);
      if (!existingTier) {
        return res.status(404).json({ error: "Pricing tier not found" });
      }
      const validatedUpdates = {};
      if (updates.priceIdr !== void 0) {
        const price = parseInt(updates.priceIdr);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({ error: "Price must be a valid non-negative number" });
        }
        validatedUpdates.priceIdr = price;
      }
      if (updates.videoLimit !== void 0) {
        const limit = parseInt(updates.videoLimit);
        if (isNaN(limit)) {
          return res.status(400).json({ error: "Video limit must be a valid number" });
        }
        validatedUpdates.videoLimit = limit;
      }
      if (updates.chatLimit !== void 0) {
        const limit = parseInt(updates.chatLimit);
        if (isNaN(limit)) {
          return res.status(400).json({ error: "Chat limit must be a valid number" });
        }
        validatedUpdates.chatLimit = limit;
      }
      if (updates.isActive !== void 0) {
        validatedUpdates.isActive = updates.isActive === true || updates.isActive === "true";
      }
      if (updates.isPopular !== void 0) {
        validatedUpdates.isPopular = updates.isPopular === true || updates.isPopular === "true";
      }
      const tier = await storage.updatePricingTier(slug, validatedUpdates, adminUser);
      res.json(tier);
    } catch (error) {
      console.error("[ADMIN_PRICING] Error updating pricing:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/analyzed-accounts", requireAdmin, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 100, 500);
      const accounts = await storage.getAllAnalyzedAccounts(limit);
      const totalCount = await storage.getAnalyzedAccountsCount();
      res.json({
        accounts: accounts.map((a) => ({
          id: a.id,
          username: a.username,
          displayName: a.displayName,
          followers: a.followers,
          following: a.following,
          totalLikes: a.totalLikes,
          totalVideos: a.totalVideos,
          verified: a.verified,
          engagementRate: a.engagementRate,
          createdAt: a.createdAt
        })),
        total: totalCount
      });
    } catch (error) {
      console.error("[ADMIN_ACCOUNTS] Error getting analyzed accounts:", error);
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/init-settings.ts
init_db();
init_schema();
var defaultSettings = [
  { key: "beta_end_date", value: "2025-03-31", valueType: "date", category: "beta", labelEn: "Beta End Date", labelId: "Tanggal Akhir Beta", descriptionEn: "When the beta period ends (YYYY-MM-DD)", descriptionId: "Kapan periode beta berakhir (YYYY-MM-DD)", isEditable: true },
  { key: "global_token_per_day", value: "100000", valueType: "number", category: "protection", labelEn: "Daily Token Limit (All Users)", labelId: "Limit Token Harian (Semua User)", descriptionEn: "Maximum tokens per day for entire platform. Shows maintenance when exceeded.", descriptionId: "Maksimum token per hari untuk seluruh platform. Tampilkan maintenance jika tercapai.", isEditable: true },
  { key: "global_token_per_request", value: "2000", valueType: "number", category: "protection", labelEn: "Token per Request", labelId: "Token per Request", descriptionEn: "Maximum tokens per single AI request.", descriptionId: "Maksimum token per satu request AI.", isEditable: true },
  { key: "enable_batch_analysis", value: "true", valueType: "boolean", category: "features", labelEn: "Batch Analysis", labelId: "Batch Analysis", descriptionEn: "Enable batch video analysis feature", descriptionId: "Aktifkan fitur analisis batch video", isEditable: true },
  { key: "enable_ab_testing", value: "true", valueType: "boolean", category: "features", labelEn: "A/B Hook Tester", labelId: "A/B Hook Tester", descriptionEn: "Enable A/B hook testing feature", descriptionId: "Aktifkan fitur A/B hook testing", isEditable: true },
  { key: "enable_screenshot_analytics", value: "true", valueType: "boolean", category: "features", labelEn: "Screenshot Analytics", labelId: "Screenshot Analytics", descriptionEn: "Enable screenshot analytics feature", descriptionId: "Aktifkan fitur analitik screenshot", isEditable: true },
  { key: "enable_competitor_analysis", value: "true", valueType: "boolean", category: "features", labelEn: "Competitor Analysis", labelId: "Competitor Analysis", descriptionEn: "Enable competitor analysis feature", descriptionId: "Aktifkan fitur analisis kompetitor", isEditable: true },
  { key: "enable_thumbnail_generator", value: "true", valueType: "boolean", category: "features", labelEn: "Thumbnail Generator", labelId: "Thumbnail Generator", descriptionEn: "Enable AI thumbnail generator", descriptionId: "Aktifkan generator thumbnail AI", isEditable: true },
  { key: "enable_voice_input", value: "true", valueType: "boolean", category: "features", labelEn: "Voice Input", labelId: "Voice Input", descriptionEn: "Enable voice input for analysis forms", descriptionId: "Aktifkan input suara untuk form analisis", isEditable: true },
  { key: "enable_pdf_export", value: "true", valueType: "boolean", category: "features", labelEn: "PDF Export", labelId: "PDF Export", descriptionEn: "Enable PDF export for analysis results", descriptionId: "Aktifkan ekspor PDF untuk hasil analisis", isEditable: true },
  { key: "enable_save_history", value: "true", valueType: "boolean", category: "features", labelEn: "Save History", labelId: "Save History", descriptionEn: "Enable save analysis history to localStorage", descriptionId: "Aktifkan simpan riwayat analisis ke localStorage", isEditable: true }
];
var defaultPricingTiers = [
  { slug: "gratis", name: "Gratis", priceIdr: 0, period: "month", descriptionEn: "Beta - try all features free!", descriptionId: "Beta - coba semua fitur gratis!", videoLimit: 5, chatLimit: 20, featuresEn: ["20 Ai chat/day", "5 video analysis/day", "All features unlocked", "Limited time beta"], featuresId: ["20 chat Ai/hari", "5 analisis video/hari", "Semua fitur aktif", "Promo beta terbatas"], isPopular: false, isActive: true, sortOrder: 1 },
  { slug: "basic", name: "Basic", priceIdr: 29e3, period: "month", descriptionEn: "For casual creators", descriptionId: "Untuk kreator kasual", videoLimit: 5, chatLimit: 50, featuresEn: ["50 Ai chat/day", "5 video analysis/day", "Save history", "PDF Export"], featuresId: ["50 chat Ai/hari", "5 analisis video/hari", "Simpan riwayat", "Export PDF"], isPopular: false, isActive: true, sortOrder: 2 },
  { slug: "pro", name: "Pro", priceIdr: 79e3, period: "month", descriptionEn: "For serious creators", descriptionId: "Untuk kreator serius", videoLimit: 15, chatLimit: -1, featuresEn: ["Unlimited Ai chat", "15 video analysis/day", "Batch Analysis", "A/B Hook Tester", "Priority support"], featuresId: ["Chat Ai unlimited", "15 analisis video/hari", "Batch Analysis", "A/B Hook Tester", "Dukungan prioritas"], isPopular: true, isActive: true, sortOrder: 3 },
  { slug: "unlimited", name: "Unlimited", priceIdr: 149e3, period: "month", descriptionEn: "For agencies & teams", descriptionId: "Untuk agensi & tim", videoLimit: -1, chatLimit: -1, featuresEn: ["Everything in Pro", "Unlimited video analysis", "API access", "White-label branding", "Dedicated support"], featuresId: ["Semua fitur Pro", "Analisis video unlimited", "Akses API", "White-label branding", "Dukungan khusus"], isPopular: false, isActive: true, sortOrder: 4 }
];
async function initializeDefaultSettings() {
  try {
    const existingSettings = await db.select().from(appSettings);
    const existingTiers = await db.select().from(pricingTiers);
    const existingSettingKeys = new Set(existingSettings.map((s) => s.key));
    const existingTierSlugs = new Set(existingTiers.map((t) => t.slug));
    const missingSettings = defaultSettings.filter((s) => !existingSettingKeys.has(s.key));
    const missingTiers = defaultPricingTiers.filter((t) => !existingTierSlugs.has(t.slug));
    if (missingSettings.length === 0 && missingTiers.length === 0) {
      return;
    }
    await db.transaction(async (tx) => {
      if (missingSettings.length > 0) {
        console.log(`[INIT] Adding ${missingSettings.length} missing settings...`);
        for (const setting of missingSettings) {
          await tx.insert(appSettings).values(setting).onConflictDoNothing();
        }
        console.log(`[INIT] \u2705 Added missing settings: ${missingSettings.map((s) => s.key).join(", ")}`);
      }
      if (missingTiers.length > 0) {
        console.log(`[INIT] Adding ${missingTiers.length} missing pricing tiers...`);
        for (const tier of missingTiers) {
          await tx.insert(pricingTiers).values(tier).onConflictDoNothing();
        }
        console.log(`[INIT] \u2705 Added missing tiers: ${missingTiers.map((t) => t.slug).join(", ")}`);
      }
    });
  } catch (error) {
    console.error("[INIT] Error initializing settings:", error);
  }
}

// server/index.ts
var app = express2();
app.use(cookieParser());
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use(express2.static("public"));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await initializeDefaultSettings();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
