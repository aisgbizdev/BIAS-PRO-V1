const DEFAULT_DAILY_VIDEO_LIMIT = 10; // Match database Starter tier default
const STORAGE_KEY = 'bias_video_usage';
const SETTINGS_CACHE_KEY = 'bias_settings_cache';
const SETTINGS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache to reduce API calls

interface UsageData {
  date: string;
  count: number;
}

interface CachedSettings {
  daily_video_limit: number;
  timestamp: number;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getUsageData(): UsageData {
  const today = getTodayKey();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as UsageData;
      if (data.date === today) {
        return data;
      }
    }
  } catch (e) {
    console.error('Error reading usage data:', e);
  }
  const freshData = { date: today, count: 0 };
  setUsageData(freshData);
  return freshData;
}

function setUsageData(data: UsageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving usage data:', e);
  }
}

function getCachedLimit(): number {
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached) as CachedSettings;
      if (Date.now() - data.timestamp < SETTINGS_CACHE_TTL) {
        return data.daily_video_limit;
      }
    }
  } catch (e) {
    console.error('Error reading cached settings:', e);
  }
  return DEFAULT_DAILY_VIDEO_LIMIT;
}

export function updateCachedLimit(limit: number): void {
  try {
    const data: CachedSettings = {
      daily_video_limit: limit,
      timestamp: Date.now(),
    };
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error caching settings:', e);
  }
}

export function getVideoUsageToday(): number {
  return getUsageData().count;
}

export function getRemainingVideoAnalysis(serverLimit?: number): number {
  const limit = serverLimit ?? getCachedLimit();
  return Math.max(0, limit - getUsageData().count);
}

export function canUseVideoAnalysis(serverLimit?: number): boolean {
  const limit = serverLimit ?? getCachedLimit();
  return getUsageData().count < limit;
}

export function incrementVideoUsage(): void {
  const data = getUsageData();
  data.count += 1;
  setUsageData(data);
  
  // Dispatch custom event so header can update in real-time
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bias-usage-updated'));
  }
}

export function getDailyLimit(serverLimit?: number): number {
  return serverLimit ?? getCachedLimit();
}
