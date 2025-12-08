// Ai Rate Limiter - Batasi penggunaan OpenAI untuk hemat token
// Configurable limits per session dan per hari

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

// Default config HEMAT - bisa diubah di admin panel
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequestsPerHour: 5,       // Max 5 request per jam (hemat)
  maxRequestsPerDay: 20,       // Max 20 request per hari (hemat)
  maxTokensPerDay: 50000,      // Max 50K tokens per hari (hemat)
  maxTokensPerRequest: 1500,   // Max 1500 token per request (hemat, tetap quality)
};

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
  const cfg = { ...DEFAULT_CONFIG, ...config };
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
    limits: DEFAULT_CONFIG,
  };
}

// Export config untuk bisa dimodifikasi
export function updateConfig(newConfig: Partial<RateLimitConfig>): RateLimitConfig {
  Object.assign(DEFAULT_CONFIG, newConfig);
  console.log('🔧 Ai Rate Limit Config Updated:', DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
}

export function getConfig(): RateLimitConfig {
  return { ...DEFAULT_CONFIG };
}
