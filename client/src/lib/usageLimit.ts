const DAILY_VIDEO_LIMIT = 5;
const STORAGE_KEY = 'bias_video_usage';

interface UsageData {
  date: string;
  count: number;
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

export function getVideoUsageToday(): number {
  return getUsageData().count;
}

export function getRemainingVideoAnalysis(): number {
  return Math.max(0, DAILY_VIDEO_LIMIT - getUsageData().count);
}

export function canUseVideoAnalysis(): boolean {
  return getUsageData().count < DAILY_VIDEO_LIMIT;
}

export function incrementVideoUsage(): void {
  const data = getUsageData();
  data.count += 1;
  setUsageData(data);
}

export function getDailyLimit(): number {
  return DAILY_VIDEO_LIMIT;
}
