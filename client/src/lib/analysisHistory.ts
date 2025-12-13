import type { BiasAnalysisResult } from '@shared/schema';

const HISTORY_STORAGE_KEY = 'bias_analysis_history';
const MAX_HISTORY_ITEMS = 20;

export interface AnalysisHistoryItem {
  id: string;
  result: BiasAnalysisResult;
  mode: 'tiktok' | 'marketing';
  inputType: 'text' | 'video' | 'url';
  inputPreview: string;
  timestamp: Date;
}

export interface StoredHistoryItem {
  id: string;
  result: BiasAnalysisResult;
  mode: 'tiktok' | 'marketing';
  inputType: 'text' | 'video' | 'url';
  inputPreview: string;
  timestamp: string;
}

export function saveAnalysisToHistory(
  result: BiasAnalysisResult,
  mode: 'tiktok' | 'marketing',
  inputType: 'text' | 'video' | 'url',
  inputPreview: string
): AnalysisHistoryItem {
  const newItem: StoredHistoryItem = {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    result,
    mode,
    inputType,
    inputPreview: inputPreview.substring(0, 100) + (inputPreview.length > 100 ? '...' : ''),
    timestamp: new Date().toISOString(),
  };

  const history = getStoredHistory();
  history.unshift(newItem);
  
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
    window.dispatchEvent(new CustomEvent('bias-history-updated'));
  } catch (error) {
    console.error('Failed to save analysis history:', error);
  }

  return {
    ...newItem,
    timestamp: new Date(newItem.timestamp),
  };
}

function getStoredHistory(): StoredHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredHistoryItem[];
  } catch (error) {
    console.error('Failed to load analysis history:', error);
    return [];
  }
}

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  const stored = getStoredHistory();
  return stored.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
}

export function getAnalysisById(id: string): AnalysisHistoryItem | null {
  const history = getAnalysisHistory();
  return history.find(item => item.id === id) || null;
}

export function deleteAnalysisFromHistory(id: string): boolean {
  const stored = getStoredHistory();
  const filtered = stored.filter(item => item.id !== id);
  
  if (filtered.length === stored.length) return false;
  
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete from history:', error);
    return false;
  }
}

export function clearAnalysisHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function getHistoryStats(): { total: number; tiktok: number; marketing: number } {
  const history = getAnalysisHistory();
  return {
    total: history.length,
    tiktok: history.filter(h => h.mode === 'tiktok').length,
    marketing: history.filter(h => h.mode === 'marketing').length,
  };
}
