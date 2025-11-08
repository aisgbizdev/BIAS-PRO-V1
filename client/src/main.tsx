import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeExternalLinkHandler, isCordovaApp } from "./lib/external-link-handler";

// Initialize external link handler for Cordova WebView
if (isCordovaApp()) {
  // Wait for Cordova deviceready event
  document.addEventListener('deviceready', () => {
    console.log('[Cordova] Device ready - initializing external link handler');
    initializeExternalLinkHandler();
  }, false);
} else {
  // Not in Cordova - initialize immediately (no-op, but safe)
  console.log('[Browser] Initializing external link handler');
  initializeExternalLinkHandler();
}

createRoot(document.getElementById("root")!).render(<App />);
