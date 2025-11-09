/**
 * External Link Handler for Cordova WebView
 * 
 * Handles external links (TikTok, ChatGPT, etc.) in Cordova/Android WebView
 * Opens external links in system browser or InAppBrowser
 */

declare global {
  interface Window {
    cordova?: {
      InAppBrowser?: {
        open: (url: string, target: string, options: string) => void;
      };
    };
  }
}

/**
 * Check if running inside Cordova WebView
 */
export function isCordovaApp(): boolean {
  return typeof window.cordova !== 'undefined';
}

/**
 * Check if URL is external (not same domain)
 */
export function isExternalLink(url: string): boolean {
  try {
    const currentDomain = window.location.hostname;
    const urlObj = new URL(url, window.location.href);
    return urlObj.hostname !== currentDomain;
  } catch {
    return false;
  }
}

/**
 * Open external link in system browser (Cordova-aware)
 * 
 * If running in Cordova: Uses InAppBrowser or system intent
 * If running in browser: Uses standard window.open
 * 
 * @param url - The URL to open
 * @param openInSystemBrowser - Force opening in external browser (default: true for external links)
 */
export function openExternalLink(
  url: string,
  openInSystemBrowser: boolean = true
): void {
  console.log('[ExternalLink] Opening URL:', url);
  console.log('[ExternalLink] Cordova detected:', isCordovaApp());
  console.log('[ExternalLink] InAppBrowser available:', !!window.cordova?.InAppBrowser);

  if (isCordovaApp()) {
    // Running in Cordova WebView
    
    // PRIORITY 1: Try InAppBrowser plugin (most reliable)
    if (window.cordova?.InAppBrowser) {
      try {
        const target = '_system'; // Always use _system for external browser
        const options = 'location=yes';
        
        console.log('[Cordova] ✅ Opening with InAppBrowser._system');
        window.cordova.InAppBrowser.open(url, target, options);
        return;
      } catch (error) {
        console.error('[Cordova] ❌ InAppBrowser.open failed:', error);
      }
    }
    
    // PRIORITY 2: Fallback to window.open with _system
    try {
      console.log('[Cordova] ⚠️ Fallback: Using window.open(_system)');
      const openedWindow = window.open(url, '_system');
      if (!openedWindow) {
        console.error('[Cordova] ❌ window.open returned null');
      }
      return;
    } catch (error) {
      console.error('[Cordova] ❌ window.open(_system) failed:', error);
    }
    
    // PRIORITY 3: Last resort - try location.href (will navigate away from app)
    console.error('[Cordova] ⚠️ ALL METHODS FAILED - This should not happen!');
    console.log('[Cordova] Check: 1) InAppBrowser plugin installed? 2) config.xml correct? 3) allow-intent set?');
    
  } else {
    // Running in regular browser - use standard window.open
    console.log('[Browser] Opening with window.open(_blank)');
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Initialize global click handler for external links
 * Intercepts all <a> tag clicks and routes external links properly
 */
export function initializeExternalLinkHandler(): void {
  // Only initialize in Cordova environment
  if (!isCordovaApp()) {
    console.log('[ExternalLink] Not in Cordova, skipping global handler');
    return;
  }

  console.log('[ExternalLink] Initializing global click handler for Cordova');

  // Listen for all clicks on the document
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Find closest <a> tag (in case user clicked child element)
    const link = target.closest('a[href]') as HTMLAnchorElement | null;
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;

    // Check if it's an external link
    if (isExternalLink(href)) {
      event.preventDefault(); // Stop default navigation
      event.stopPropagation();
      
      console.log('[ExternalLink] Intercepted external link click:', href);
      openExternalLink(href, true);
    }
  }, true); // Use capture phase to catch early

  // Also intercept window.open for safety
  const originalWindowOpen = window.open;
  window.open = function(url?: string | URL, target?: string, features?: string) {
    if (!url) return originalWindowOpen.call(window, url, target, features);
    
    const urlString = url.toString();
    
    if (isExternalLink(urlString)) {
      console.log('[ExternalLink] Intercepted window.open for external URL:', urlString);
      openExternalLink(urlString, target === '_blank' || target === '_system');
      return null; // Return null to prevent default behavior
    }
    
    // Internal link - use original behavior
    return originalWindowOpen.call(window, url, target, features);
  };

  console.log('[ExternalLink] Global handler initialized successfully');
}
