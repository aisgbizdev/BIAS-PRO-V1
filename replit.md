# BiAS²³ Pro - Behavioral Intelligence Audit System

## Overview
BiAS²³ Pro is an AI-powered, bilingual (English-Indonesian) web application designed to analyze behavioral communication patterns using an 8-layer framework. It assesses communicators and professionals, providing detailed and actionable behavioral insights to improve communication and influence. The system operates in two main modes: TikTok Pro (for TikTok account analytics with an Expert Knowledge Base) and Marketing Pro (for analyzing sales presentations, pitches, and marketing videos). The project aims to deliver premium behavioral assessments, leveraging AI to counter misinformation and provide science-backed guidance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React and TypeScript (Vite), featuring a component-based architecture with functional components and hooks. Wouter handles routing, and TanStack React Query manages server state. UI components are built with Shadcn/ui on Radix UI, styled with Tailwind CSS, following a Material Design-inspired aesthetic. It supports language context switching, responsive design, and integrates PWA capabilities. The application features a premium dark theme (`#0A0A0A`) with pink/cyan gradients and glass-morphism effects.

### Backend
The backend is an Express.js and TypeScript RESTful API. It includes a rule-based behavioral analysis engine (`bias-engine.ts`) implementing an 8-layer evaluation framework (VBM, EPM, NLP, ETH, ECO, SOC, COG, BMIL) with mode-specific logic. Core API endpoints manage sessions and analysis requests. The system currently uses in-memory storage for transient data and PostgreSQL for persistent public/shared data. An adaptive analysis system tailors recommendations based on user skill levels, and a warmth detection system analyzes communication tone.

### Data Storage & Privacy
BiAS²³ Pro employs a privacy-first, disposable data model. Chat history and analysis results are temporary (RAM-based, cleared on server restart). A PostgreSQL database is used only for public/shared data (e.g., Library contributions, rate limiting, admin panel data, session metadata). No persistent user analysis data is stored. User sessions are isolated with unique UUIDs. A planned PDF export feature will generate reports on-demand without server-side storage.

### Authentication and Authorization
The application uses cookieless session tracking with client-generated session IDs for anonymous user sessions. There is no user authentication system. Admin authentication uses secure session-based authentication with HttpOnly cookies for managing the analytics dashboard and library.

### White-Label Branding System
The application supports dynamic white-label branding for partners via a path-based routing system with database-backed brand management. Brands are stored in a PostgreSQL `brands` table and dynamically loaded based on the URL path.

### Key Features
- **Dual AI Mentor System**: TikTok Pro (FYP secrets, viral hooks, live streaming) and Marketing Pro (sales, pitch, leadership, negotiation).
- **Analysis Discussion**: Post-analysis chat box for discussing results with AI mentor (mode-specific context).
- **Comprehensive Analyzer**: Provides narrative diagnoses, context, impact, motivational framing, and actionable recommendations.
- **Video & Script Analysis**: Supports multi-file video uploads, URL pasting (TikTok), and text-based script review.
- **Script Review Tool**: Quick script type selection (Sales Pitch, Cold Call, Meeting Opening, Presentation, Follow-up, Public Speaking).
- **Sales Script Generator**: Ready-to-use templates for Cold Calls, Sales Pitches, Objection Handling, Follow-up Messages, and Elevator Pitches with bilingual content and quick personalization.
- **Expert Knowledge Base**: Science-backed knowledge system with 8 panels, including research-backed tips, hook templates, storytelling frameworks, script templates, live streaming templates, trending data, growth stage guides, and response templates.
- **Interactive Creator Hub**: A conversational AI interface (ChatGPT-like) acting as a TikTok mentor, replacing traditional wizards.
- **Hybrid Chat System**: Prioritizes responses from local templates, then a self-learning library, and finally falls back to OpenAI API for new unique questions.
- **Cross-Domain Knowledge**: Marketing Pro can access relevant TikTok knowledge (voice, emotion, ethics) when applicable.
- **Adaptive Analysis**: Tailors recommendations based on user skill levels.
- **Warmth Detection System**: Analyzes communication tone and calculates a Warmth Index.
- **Platform Rules Hub**: A searchable, bilingual database of official TikTok community guidelines.
- **Library Glossary**: Categorized glossary for TikTok, Marketing, BIAS terms.
- **Admin Analytics Dashboard**: Real-time, privacy-first analytics for administrators.
- **PDF Export**: Download analysis results as styled PDF reports using jspdf and html2canvas.
- **Save History**: LocalStorage-based privacy-first analysis history with auto-refresh on save via custom events.
- **Voice Input**: Web Speech API integration for hands-free text input in analysis forms.
- **Competitor Analysis**: Compare up to 3 TikTok accounts side-by-side with visual metrics comparison.
- **Thumbnail Generator**: AI-powered video thumbnail generation integrated into TikTok Pro analytics.
- **Batch Analysis**: Upload 2-10 videos for AI comparison with best/worst performer detection, average scores, and insights.
- **A/B Hook Tester**: Compare 2-5 hook variations with AI scoring, showing winner, strengths, weaknesses, and improvement suggestions.

## Recent Changes (Dec 2024)
- Added 7 new features: PDF Export, Save History, Voice Input, Competitor Analysis, Thumbnail Generator, Batch Analysis, A/B Hook Tester
- Integrated new analytics tabs (Account, Video, Batch, A/B, Screenshot, Compare, Thumbnail) into TikTok Pro
- Fixed Save History auto-refresh using custom event dispatching ('bias-history-updated')
- **CRITICAL**: Removed all fake/mock/random data generation - platform now shows real data only or clear error messages
- Added `/api/analyze-video` endpoint using OpenAI Vision for image/video thumbnail analysis
- Added `/api/analyze-screenshot` endpoint using OpenAI Vision for TikTok screenshot analysis
- Added `/api/test-hooks` endpoint for A/B Hook testing with GPT-4o-mini
- Fixed VideoAnalyzerPanel, ScreenshotAnalyticsPanel, CompetitorAnalysis to use real API calls
- Added daily video analysis limit (5/day) with localStorage tracking for monetization prep
- Added Premium Coming Soon page (`/premium`) with pricing tiers: Gratis, Basic (Rp 10K), Pro (Rp 25K), Unlimited (Rp 99K)
- **Admin-Configurable Settings System**: Added `app_settings` and `pricing_tiers` database tables for dynamic platform configuration. Admin can now manage usage limits, feature toggles, and pricing tiers from the Settings tab without code changes. Frontend uses SettingsProvider context to fetch and cache settings.
- **Documentation**: Added README_DEVELOPER.md (technical docs) and PANDUAN_PENGGUNA.md (user guide in Indonesian)
- **Help Page**: Added /help route with interactive guide, feature overview, 8-layer BIAS explanation, FAQ, and privacy info. Help menu accessible from main navigation.
- **Mode-Aware InteractiveCreatorHub**: Component now accepts `mode` prop ('tiktok' | 'marketing') to display context-appropriate content. TikTok Pro shows TikTok-specific suggestions (FYP, live streaming, viral hooks), Marketing Pro shows sales-focused suggestions (pitch scripts, cold calls, objection handling).
- **Auto-Seed Production Database**: Server startup automatically seeds default settings and pricing tiers if database is empty (`server/init-settings.ts`). Uses transaction for atomicity.

## External Dependencies

### Third-Party Services
- **Database**: Neon PostgreSQL (serverless) for public/shared data.
- **AI Services**: OpenAI GPT-4o-mini (primary), Google Gemini 1.5 Flash (fallback).
- **ChatGPT**: Custom GPT integration for external free-form user conversations.

### Key NPM Packages
- **UI/Frontend**: `@radix-ui/*`, `@tanstack/react-query`, `tailwindcss`, `clsx`, `tailwind-merge`, `react-hook-form`, `date-fns`, `embla-carousel-react`, `wouter`.
- **Backend**: `express`, `drizzle-orm`, `drizzle-zod`, `zod`, `connect-pg-simple`.
- **Development**: `vite`, `tsx`, `esbuild`, `@replit/vite-plugin-*`.

### Platform Integrations
- **Social Media APIs**: TikTok API (primary focus).
- **Behavioral Framework Files**: Knowledge base in `attached_assets/` for 8-layer analysis, community guidelines, and specialized modules.