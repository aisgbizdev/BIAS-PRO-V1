// Ai Rate Limiter - Batasi penggunaan OpenAI untuk hemat token
// Configurable limits per session dan per hari
// Now fetches limits from database (pricingTiers and appSettings)

import { db } from '../../db';
import { pricingTiers, appSettings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

interface UsageRecord {
  requests: number;
  tokens: number;
  lastReset: Date;
}

interface RateLimitConfig {
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  maxTokensPerDay: number;
  maxTokensPerRequest: number;
}

// Default config - will be overwritten by database settings on loadSettingsFromDatabase()
let CURRENT_CONFIG: RateLimitConfig = {
  maxRequestsPerHour: 100,     // Default high - database will override
  maxRequestsPerDay: 1000,     // Default high - database will override  
  maxTokensPerDay: 1000000,    // Default high - database will override
  maxTokensPerRequest: 100000, // Default high - database will override
};

// Track if settings have been loaded from database
let settingsLoaded = false;

// Load settings from database (call on server startup)
export async function loadSettingsFromDatabase(): Promise<void> {
  try {
    // Get the 'gratis' tier (default tier for anonymous users)
    const [gratisTier] = await db.select().from(pricingTiers).where(eq(pricingTiers.slug, 'gratis'));
    
    // Get global settings
    const allSettings = await db.select().from(appSettings);
    const globalTokenPerDay = allSettings.find(s => s.key === 'global_token_per_day');
    const globalTokenPerRequest = allSettings.find(s => s.key === 'global_token_per_request');
    
    if (gratisTier) {
      // chatLimit from tier = max requests per day (or unlimited if -1)
      const chatLimit = gratisTier.chatLimit ?? 100;
      
      CURRENT_CONFIG = {
        maxRequestsPerHour: chatLimit === -1 ? 999999 : Math.max(10, Math.ceil(chatLimit / 24)), // Divide daily by 24 for hourly, min 10
        maxRequestsPerDay: chatLimit === -1 ? 999999 : chatLimit,
        maxTokensPerDay: globalTokenPerDay ? parseInt(globalTokenPerDay.value || '1000000') : 1000000,
        maxTokensPerRequest: globalTokenPerRequest ? parseInt(globalTokenPerRequest.value || '100000') : 100000,
      };
      
      console.log('🔧 AI Rate Limiter loaded from database:', CURRENT_CONFIG);
    }
    
    settingsLoaded = true;
  } catch (error) {
    console.error('❌ Failed to load AI rate limiter settings from database:', error);
    // Keep defaults on error
  }
}

// Reload settings (can be called after admin updates)
export async function reloadSettings(): Promise<RateLimitConfig> {
  await loadSettingsFromDatabase();
  return CURRENT_CONFIG;
}

// In-memory storage untuk tracking usage (reset saat server restart)
const hourlyUsage: Map<string, UsageRecord> = new Map();
const dailyUsage: Map<string, UsageRecord> = new Map();

// Get or create usage record
function getHourlyRecord(sessionId: string): UsageRecord {
  const now = new Date();
  let record = hourlyUsage.get(sessionId);
  
  if (!record || (now.getTime() - record.lastReset.getTime()) > 60 * 60 * 1000) {
    record = { requests: 0, tokens: 0, lastReset: now };
    hourlyUsage.set(sessionId, record);
  }
  
  return record;
}

function getDailyRecord(sessionId: string): UsageRecord {
  const now = new Date();
  let record = dailyUsage.get(sessionId);
  
  if (!record || (now.getTime() - record.lastReset.getTime()) > 24 * 60 * 60 * 1000) {
    record = { requests: 0, tokens: 0, lastReset: now };
    dailyUsage.set(sessionId, record);
  }
  
  return record;
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  remaining: {
    requestsThisHour: number;
    requestsToday: number;
    tokensToday: number;
  };
  resetIn?: {
    hourly: number; // minutes
    daily: number;  // hours
  };
}

export function checkRateLimit(sessionId: string, config: Partial<RateLimitConfig> = {}): RateLimitResult {
  const cfg = { ...CURRENT_CONFIG, ...config };
  const hourly = getHourlyRecord(sessionId);
  const daily = getDailyRecord(sessionId);
  const now = new Date();
  
  const remaining = {
    requestsThisHour: cfg.maxRequestsPerHour - hourly.requests,
    requestsToday: cfg.maxRequestsPerDay - daily.requests,
    tokensToday: cfg.maxTokensPerDay - daily.tokens,
  };
  
  const resetIn = {
    hourly: Math.ceil((60 * 60 * 1000 - (now.getTime() - hourly.lastReset.getTime())) / 60000),
    daily: Math.ceil((24 * 60 * 60 * 1000 - (now.getTime() - daily.lastReset.getTime())) / 3600000),
  };
  
  // Check hourly limit
  if (hourly.requests >= cfg.maxRequestsPerHour) {
    return {
      allowed: false,
      reason: `Limit per jam tercapai (${cfg.maxRequestsPerHour}/jam). Reset dalam ${resetIn.hourly} menit.`,
      remaining,
      resetIn,
    };
  }
  
  // Check daily request limit
  if (daily.requests >= cfg.maxRequestsPerDay) {
    return {
      allowed: false,
      reason: `Limit harian tercapai (${cfg.maxRequestsPerDay}/hari). Reset dalam ${resetIn.daily} jam.`,
      remaining,
      resetIn,
    };
  }
  
  // Check daily token limit
  if (daily.tokens >= cfg.maxTokensPerDay) {
    return {
      allowed: false,
      reason: `Limit token harian tercapai (${cfg.maxTokensPerDay.toLocaleString()} tokens). Reset dalam ${resetIn.daily} jam.`,
      remaining,
      resetIn,
    };
  }
  
  return { allowed: true, remaining, resetIn };
}

export function recordUsage(sessionId: string, tokensUsed: number): void {
  const hourly = getHourlyRecord(sessionId);
  const daily = getDailyRecord(sessionId);
  
  hourly.requests++;
  hourly.tokens += tokensUsed;
  
  daily.requests++;
  daily.tokens += tokensUsed;
  
  console.log(`📊 Ai Usage - Session ${sessionId.slice(0, 8)}...: ${daily.requests} requests, ${daily.tokens.toLocaleString()} tokens today`);
}

export function getUsageStats(sessionId: string): {
  hourly: UsageRecord;
  daily: UsageRecord;
  limits: RateLimitConfig;
} {
  return {
    hourly: getHourlyRecord(sessionId),
    daily: getDailyRecord(sessionId),
    limits: CURRENT_CONFIG,
  };
}

// Export config untuk bisa dimodifikasi
export function updateConfig(newConfig: Partial<RateLimitConfig>): RateLimitConfig {
  Object.assign(CURRENT_CONFIG, newConfig);
  console.log('🔧 Ai Rate Limit Config Updated:', CURRENT_CONFIG);
  return CURRENT_CONFIG;
}

export function getConfig(): RateLimitConfig {
  return { ...CURRENT_CONFIG };
}
