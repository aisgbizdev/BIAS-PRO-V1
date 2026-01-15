import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDefaultSettings } from "./init-settings";
import { loadSettingsFromDatabase } from "./utils/ai-rate-limiter";
import { cleanupOldUnapprovedResponses } from "./utils/learning-system";

async function prewarmBiasApi() {
  try {
    console.log('[Prewarm] Waking up BIAS TikTok API...');
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    await fetch('https://bias-tiktok-analyzer.onrender.com/health', {
      signal: controller.signal,
      headers: { 'User-Agent': 'BiAS-Pro-Replit/1.0' }
    }).catch(() => {});
    console.log('[Prewarm] BIAS API ping sent');
  } catch (e) {
    console.log('[Prewarm] BIAS API prewarm skipped');
  }
}

const app = express();

// Parse cookies
app.use(cookieParser());

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '20mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

// Serve static files from public folder (for service-worker.js, manifest.json, icons, etc.)
app.use(express.static("public"));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize default settings if database is empty
  await initializeDefaultSettings();
  
  // Load AI rate limiter settings from database
  await loadSettingsFromDatabase();
  
  // Cleanup old unapproved AI responses (>30 days)
  await cleanupOldUnapprovedResponses();
  
  // Prewarm external APIs (non-blocking)
  prewarmBiasApi();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
