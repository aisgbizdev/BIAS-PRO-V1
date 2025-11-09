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
    
    await fetch('/api/analytics/page-view', {
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
  featureType: 'analysis' | 'chat' | 'comparison' | 'library-search' | 'rules-hub',
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'professional',
  metadata?: Record<string, any>
) => {
  try {
    const sessionId = getSessionId();
    const language = localStorage.getItem('language') || 'en';
    
    await fetch('/api/analytics/feature-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        featureType,
        platform,
        language,
        metadata,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track feature usage:', error);
  }
};
