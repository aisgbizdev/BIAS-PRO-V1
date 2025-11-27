# BiAS²³ Pro - Behavioral Intelligence Audit System

## Overview
BiAS²³ Pro is a bilingual (English-Indonesian) AI-powered web application designed to analyze behavioral communication patterns using an 8-layer framework. It evaluates communicators and professionals across dimensions like visual behavior, emotional processing, and ethical compliance. The system offers two primary modes: Social Media Pro (for TikTok/Instagram/YouTube account analytics) and Communication (for analyzing speaking and presentation patterns). Its core purpose is to deliver premium, detailed, and actionable behavioral assessments to help users build influence through improved communication.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript (Vite), utilizing a component-based structure with functional components and hooks. Wouter manages routing, and TanStack React Query handles server state. UI components are crafted with Shadcn/ui on Radix UI, styled using Tailwind CSS, adhering to a Material Design-inspired aesthetic. Key features include language context switching, responsive design, and Inter/JetBrains Mono typography.

### Backend Architecture
The backend is an Express.js and TypeScript RESTful API. It incorporates a rule-based behavioral analysis engine (`bias-engine.ts`) that implements an 8-layer evaluation framework (VBM, EPM, NLP, ETH, ECO, SOC, COG, BMIL) with mode-specific logic. Core API endpoints manage sessions and analysis requests. The system currently uses in-memory storage, with a planned migration to Drizzle ORM and PostgreSQL. Authentication is session-based. An adaptive analysis system tailors recommendations based on user skill levels, and a warmth detection system analyzes communication tone.

### Data Storage Solutions
BiAS²³ Pro employs a privacy-first, disposable data model. Chat history and analysis results are temporary (RAM-based, cleared on server restart). A PostgreSQL database is used only for public/shared data such as Library contributions, rate limiting, and admin panel data, along with basic session metadata. No persistent user analysis data is stored. User sessions are isolated with unique UUIDs. A planned PDF export feature will allow users to download results locally, with the server generating PDFs on-demand without saving files.

### Authentication and Authorization
The application uses cookieless session tracking with client-generated session IDs stored in browser localStorage. Each session is isolated, ensuring anonymity and privacy. There is no user authentication system, as the app is designed to be fully anonymous. Admin authentication uses secure session-based authentication with HttpOnly cookies for managing the analytics dashboard and library.

### UI/UX Decisions
The application features a premium dark theme (#0A0A0A) with pink/cyan gradients and glass-morphism effects. It includes metric cards with gradient text, progress bars, trend indicators, and circular progress components. Dashboards offer comprehensive analytics, including radar chart visualizations. The header is mobile-responsive with a hamburger menu and PWA capabilities are integrated for an installable app experience with custom branding.

### White-Label Branding System
BiAS²³ Pro supports white-label branding for partners and resellers. The system allows switching branding via environment variables without modifying core files.

**Brand Configuration Files:**
- Location: `client/src/config/brands/`
- `bias.json` - Default BiAS²³ Pro branding
- `thi.json` - THI partner branding (example)
- `index.ts` - Brand loader and type definitions

**Switching Brands:**
Set the `VITE_BRAND` environment variable:
- `VITE_BRAND=bias` (default) - BiAS²³ Pro branding
- `VITE_BRAND=thi` - THI partner branding

**Adding New Partners:**
1. Create new config file: `client/src/config/brands/partner.json`
2. Add logo to logoMap in `index.ts`
3. Add brand to brands object in `index.ts`
4. Set `VITE_BRAND=partner` when deploying

**Brand Config Fields:**
- `name`, `shortName` - Brand names
- `logo` - Logo identifier (mapped in logoMap)
- `tagline`, `subtitle`, `description` - Bilingual text (en/id)
- `colors.primary`, `colors.secondary` - Gradient classes
- `social.tiktok`, `social.tiktokUrl` - Social media links
- `meta.title`, `meta.description` - SEO metadata

### Feature Specifications
- **Modes**: Two primary modes: Social Media Pro (TikTok, Instagram, YouTube account analytics) and Communication (sales pitches, presentations, marketing videos).
- **Comprehensive Analyzer**: Provides narrative diagnoses with context, impact, motivational framing, and actionable recommendations.
- **Account Analyzer (Social Media Pro)**: Displays profile cards and six comprehensive analytics cards: Engagement Rate Analysis, Follower Growth Strategy, Content Strategy Analysis, Monetization Potential, Audience Quality Analysis, and Posting Optimization.
- **Video Upload & Comparison**: Supports multi-file video uploads and URL pasting (TikTok, Instagram, YouTube) for analysis and comparison.
- **Platform Rules Hub**: A searchable, bilingual database of official community guidelines for social media platforms.
- **Adaptive Analysis**: Detects user skill levels to provide tailored recommendations.
- **Warmth Detection System**: Analyzes communication tone, calculating a Warmth Index.
- **File-Based Analysis**: Supports link-based and description-based analysis for various content types.
- **Intelligent Keyword Detection**: Expanded keyword coverage for comprehensive analysis across various communication aspects.
- **Chat System**: Features a floating button for direct access to a custom ChatGPT for free-form conversations, replacing a less accurate internal chat.
- **Analytics Dashboard**: Real-time, privacy-first analytics dashboard for administrators to track page views, feature usage, platform distribution, and language statistics.
- **Admin Authentication System**: Secure session-based authentication for administrative access to the analytics dashboard and library management.

## External Dependencies

### Third-Party Services
- **Database**: Neon PostgreSQL (serverless) for Library contributions, rate limiting, and admin data.
- **AI Services**: OpenAI GPT-4o-mini (primary), Google Gemini 1.5 Flash (fallback), BIAS Library (rule-based). Features cascading through tiers and strict guardrails.
- **ChatGPT**: Custom GPT integration for external free-form user conversations.

### Key NPM Packages
- **UI/Frontend**: `@radix-ui/*`, `@tanstack/react-query`, `tailwindcss`, `clsx`, `tailwind-merge`, `react-hook-form`, `date-fns`, `embla-carousel-react`, `wouter`.
- **Backend**: `express`, `drizzle-orm`, `drizzle-zod`, `zod`, `connect-pg-simple`.
- **Development**: `vite`, `tsx`, `esbuild`, `@replit/vite-plugin-*`.

### Platform Integrations
- **Social Media APIs (Referenced)**: TikTok API, Instagram API, YouTube API.
- **Behavioral Framework Files**: Knowledge base in `attached_assets/` for 8-layer analysis, community guidelines, and specialized modules.