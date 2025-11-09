# 🚀 BiAS²³ Pro - Cordova/Android WebView Setup Guide

## ✅ COMPLETED FIXES

### 1. Chat BIAS Button Position
**Problem**: Button was too low and being cut off in mobile WebView
**Solution**: Raised button from `bottom-4` (16px) to `bottom-12` (48px) - approximately **1cm higher**

### 2. External Links Not Opening in Cordova
**Problem**: TikTok and ChatGPT links don't open when clicked inside Android WebView
**Solution**: Implemented smart link handler that detects Cordova environment and routes external links properly

---

## 🔧 WHAT WAS IMPLEMENTED

### 📁 File: `client/src/lib/external-link-handler.ts`
A comprehensive external link handler that:
- ✅ Detects if app is running in Cordova WebView
- ✅ Intercepts ALL external links (TikTok, ChatGPT, etc.)
- ✅ Opens external links via InAppBrowser or system browser
- ✅ Keeps internal navigation working normally
- ✅ Works with both click events and `window.open()` calls

### 📁 File: `client/src/main.tsx`
Initializes the external link handler on app startup:
- ✅ Listens for Cordova `deviceready` event
- ✅ Sets up global click interception
- ✅ Overrides `window.open()` for external URLs

### 📁 Files: `client/src/components/BiasHeader.tsx`
Updated all external link buttons to use the new handler:
- ✅ TikTok follow button (desktop & mobile menu)
- ✅ ChatGPT button (desktop & mobile menu)

---

## 🛠️ HOW IT WORKS

### Normal Browser Behavior (Development)
```javascript
// Regular browser - opens in new tab
openExternalLink('https://www.tiktok.com/@bias23_ai');
// → window.open(url, '_blank', 'noopener,noreferrer')
```

### Cordova WebView Behavior (Android APK)
```javascript
// Cordova detected - uses InAppBrowser or _system
openExternalLink('https://www.tiktok.com/@bias23_ai');
// → cordova.InAppBrowser.open(url, '_system', 'location=yes')
// → OR window.open(url, '_system') if InAppBrowser not available
```

---

## 📋 CORDOVA CONFIG.XML REQUIREMENTS

**⚠️ CRITICAL FIX FOR CORDOVA 12**: Do **NOT** use `<allow-navigation href="*" />` - this CAPTURES all intents and BLOCKS external links!

Your `config.xml` should include these plugins and permissions:

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.bias23.pro" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>BiAS²³ Pro</name>
    <description>Behavioral Intelligence Audit System</description>
    
    <!-- Network access for resources (images, API calls) -->
    <access origin="*" />
    
    <!-- ❌ DO NOT USE THIS - Blocks external links! -->
    <!-- <allow-navigation href="*" /> -->
    
    <!-- ✅ ONLY whitelist YOUR DOMAIN for internal navigation -->
    <allow-navigation href="https://bias23.replit.app/*" />
    <allow-navigation href="file://*" />
    <allow-navigation href="http://localhost:*" />
    
    <!-- ✅ Allow external intents (opens in system browser) -->
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    
    <!-- REQUIRED: InAppBrowser Plugin for external links -->
    <plugin name="cordova-plugin-inappbrowser" source="npm" />
    
    <!-- Whitelist Plugin (if needed) -->
    <plugin name="cordova-plugin-whitelist" source="npm" />
    
    <!-- Your iframe content source -->
    <content src="index.html" />
    
    <!-- Platform-specific settings -->
    <platform name="android">
        <!-- Android 12+ support -->
        <preference name="AndroidXEnabled" value="true" />
        
        <!-- WebView settings -->
        <preference name="AndroidLaunchMode" value="singleTop" />
        <preference name="DisallowOverscroll" value="true" />
        
        <!-- Allow all intents -->
        <allow-intent href="http://*/*" />
        <allow-intent href="https://*/*" />
        <allow-intent href="tel:*" />
        <allow-intent href="sms:*" />
        <allow-intent href="mailto:*" />
        <allow-intent href="geo:*" />
    </platform>
</widget>
```

---

## 🌐 VOLT BUILDER INDEX.HTML SETUP

Your Cordova wrapper `index.html` should look like this:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>BiAS²³ Pro</title>
    
    <!-- CSP Policy - Allow everything needed -->
    <meta http-equiv="Content-Security-Policy" 
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob: gap:; 
                   script-src * 'unsafe-inline' 'unsafe-eval'; 
                   style-src * 'unsafe-inline';">
    
    <!-- Cordova.js - MUST be loaded first -->
    <script type="text/javascript" src="cordova.js"></script>
    
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #app-frame {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <!-- Main WebView Frame -->
    <iframe id="app-frame" 
            src="https://bias23.replit.app"
            allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; geolocation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox">
    </iframe>
</body>
</html>
```

**Key Points:**
- ✅ `sandbox` includes `allow-popups-to-escape-sandbox` - CRITICAL for external links!
- ✅ `cordova.js` loaded in `<head>` - ensures Cordova APIs are available
- ✅ CSP policy allows inline scripts and eval (needed for framework)

---

## 🧪 TESTING EXTERNAL LINKS

### In Development (Browser)
1. Click TikTok button → Opens in new browser tab ✅
2. Click ChatGPT button → Opens in new browser tab ✅
3. Console logs: `[Browser] Opening with window.open: <url>`

### In Cordova APK (Android)
1. Click TikTok button → Opens in system browser or TikTok app ✅
2. Click ChatGPT button → Opens in system browser ✅
3. Console logs: `[Cordova] Opening with InAppBrowser: <url>`

### Debug Console Commands
```javascript
// Check if Cordova is detected
console.log(window.cordova); // Should be object in APK, undefined in browser

// Test external link handler
openExternalLink('https://www.tiktok.com/@bias23_ai');
```

---

## 🔍 TROUBLESHOOTING

### Issue: Links Still Don't Open in APK
**Solutions:**
1. **Verify InAppBrowser plugin is installed**
   ```bash
   cordova plugin list
   # Should show: cordova-plugin-inappbrowser
   ```

2. **Check Cordova deviceready event**
   - Open Chrome DevTools → Remote Devices
   - Connect Android device via USB
   - Inspect WebView console for: `[Cordova] Device ready - initializing external link handler`

3. **Verify iframe sandbox permissions**
   - Make sure `allow-popups-to-escape-sandbox` is in the sandbox attribute

4. **Test with explicit system browser**
   ```javascript
   // Force system browser
   window.open('https://www.tiktok.com/@bias23_ai', '_system');
   ```

### Issue: InAppBrowser Not Found
**Fallback behavior:**
- The handler will automatically fall back to `window.open(url, '_system')`
- This should still work on Android even without the plugin

### Issue: CSP Blocking Navigation
**Fix:**
- Update `config.xml` to include `<access origin="*" />`
- Ensure `meta` CSP policy allows all sources

---

## 📱 ADDITIONAL CORDOVA PLUGINS NEEDED

```bash
# InAppBrowser - REQUIRED for external links
cordova plugin add cordova-plugin-inappbrowser

# Whitelist - For access control
cordova plugin add cordova-plugin-whitelist

# SplashScreen - For Android 12+ (optional)
cordova plugin add cordova-plugin-splashscreen

# StatusBar - For UI polish (optional)
cordova plugin add cordova-plugin-statusbar
```

---

## ✅ VERIFICATION CHECKLIST

Before building APK:
- [ ] `cordova-plugin-inappbrowser` installed
- [ ] `config.xml` has `<access origin="*" />`
- [ ] `config.xml` has `<allow-navigation href="*" />`
- [ ] `index.html` iframe has `allow-popups-to-escape-sandbox`
- [ ] `cordova.js` loaded before app initialization
- [ ] Chat BIAS button raised to `bottom-12` (visible in mobile)
- [ ] Console shows external link handler initialization

---

## 🎯 EXPECTED BEHAVIOR

### ✅ WORKING:
- Internal navigation (/, /social-pro, /creator, /library) → Opens in iframe
- TikTok button → Opens in system browser or TikTok app
- ChatGPT button → Opens in system browser or ChatGPT app (if installed)
- Chat BIAS button → Visible and clickable in mobile WebView

### ❌ NOT EXPECTED:
- External links opening inside iframe (blocked by X-Frame-Options)
- Links being silently ignored (fixed by our handler)
- Chat button cut off at bottom (fixed by raising position)

---

## 📞 NEXT STEPS

1. **Build APK with Volt Builder** using updated config
2. **Install on Android device** (Android 12+ recommended)
3. **Test all external links** (TikTok, ChatGPT)
4. **Verify Chat BIAS button** is visible at bottom-right
5. **Check Chrome DevTools** console for any errors

---

## 💡 TIPS

- **Remote debugging**: Use Chrome's `chrome://inspect` to debug Android WebView
- **Console logging**: All link clicks are logged with `[ExternalLink]` prefix
- **Cordova detection**: Check `window.cordova` existence in console
- **Button position**: `bottom-12` = 48px from bottom (safe for most devices)

---

**Built with ❤️ for BiAS²³ Pro**  
*Behavioral Intelligence Audit System - Privacy-First, AI-Powered*
