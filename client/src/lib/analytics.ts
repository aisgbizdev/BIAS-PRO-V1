// Analytics tracking helpers for BiAS²³ Pro
// Privacy-first: Only tracks anonymous session data

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const trackPageView = async (page: string) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        page,
        language,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track page view:', error);
  }
};

export const trackFeatureUsage = async (
  featureType: 'analysis' | 'chat' | 'comparison' | 'library-search' | 'rules-hub' | 'script-generator' | 'script-review' | 'video-upload' | 'expert-panel' | 'ai-coach',
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'professional' | 'marketing',
  metadata?: Record<string, any>
) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        featureType,
        platform,
        mode: metadata?.mode,
        featureDetails: metadata ? JSON.stringify(metadata) : null,
        language,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track feature usage:', error);
  }
};

// Track navigation menu clicks
export const trackNavigation = async (menuItem: string, destination: string) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        featureType: 'navigation',
        platform: null,
        mode: null,
        featureDetails: JSON.stringify({ menuItem, destination }),
        language,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track navigation:', error);
  }
};

// Track tab selections within pages
export const trackTabSelection = async (
  page: 'tiktok-pro' | 'marketing-pro' | 'library',
  tabName: string,
  tabIndex?: number
) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        featureType: 'tab-selection',
        platform: page === 'tiktok-pro' ? 'tiktok' : page === 'marketing-pro' ? 'marketing' : null,
        mode: tabName,
        featureDetails: JSON.stringify({ page, tabName, tabIndex }),
        language,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track tab selection:', error);
  }
};

// Track button clicks for important actions
export const trackButtonClick = async (
  buttonName: string,
  context: string,
  metadata?: Record<string, any>
) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        featureType: 'button-click',
        platform: null,
        mode: context,
        featureDetails: JSON.stringify({ buttonName, context, ...metadata }),
        language,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track button click:', error);
  }
};
