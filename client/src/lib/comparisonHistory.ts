const COMPARISON_HISTORY_KEY = 'bias_comparison_history';
const MAX_COMPARISON_ITEMS = 3;

export interface ComparisonAccountData {
  username: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  engagementRate: number;
  avgViews: number;
  nickname?: string;
  photoUrl?: string;
  verified?: boolean;
}

export interface ComparisonResult {
  accounts: ComparisonAccountData[];
  winner: string;
  insights: string[];
}

export interface ComparisonHistoryItem {
  id: string;
  result: ComparisonResult;
  usernames: string[];
  timestamp: Date;
}

interface StoredComparisonItem {
  id: string;
  result: ComparisonResult;
  usernames: string[];
  timestamp: string;
}

export function saveComparisonToHistory(
  result: ComparisonResult,
  usernames: string[]
): ComparisonHistoryItem {
  const newItem: StoredComparisonItem = {
    id: `comparison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    result,
    usernames,
    timestamp: new Date().toISOString(),
  };

  const history = getStoredHistory();
  history.unshift(newItem);
  
  const trimmedHistory = history.slice(0, MAX_COMPARISON_ITEMS);
  
  try {
    localStorage.setItem(COMPARISON_HISTORY_KEY, JSON.stringify(trimmedHistory));
    window.dispatchEvent(new CustomEvent('bias-comparison-updated'));
  } catch (error) {
    console.error('Failed to save comparison history:', error);
  }

  return {
    ...newItem,
    timestamp: new Date(newItem.timestamp),
  };
}

function getStoredHistory(): StoredComparisonItem[] {
  try {
    const stored = localStorage.getItem(COMPARISON_HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredComparisonItem[];
  } catch (error) {
    console.error('Failed to load comparison history:', error);
    return [];
  }
}

export function getComparisonHistory(): ComparisonHistoryItem[] {
  const stored = getStoredHistory();
  return stored.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
}

export function getComparisonById(id: string): ComparisonHistoryItem | null {
  const history = getComparisonHistory();
  return history.find(item => item.id === id) || null;
}

export function deleteComparisonFromHistory(id: string): boolean {
  const stored = getStoredHistory();
  const filtered = stored.filter(item => item.id !== id);
  
  if (filtered.length === stored.length) return false;
  
  try {
    localStorage.setItem(COMPARISON_HISTORY_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('bias-comparison-updated'));
    return true;
  } catch (error) {
    console.error('Failed to delete from comparison history:', error);
    return false;
  }
}

export function clearComparisonHistory(): void {
  try {
    localStorage.removeItem(COMPARISON_HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('bias-comparison-updated'));
  } catch (error) {
    console.error('Failed to clear comparison history:', error);
  }
}
