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
BiAS²³ Pro supports dynamic white-label branding for partners and resellers using a path-based routing system with database-backed brand management.

**Architecture:**
- **Path-based Routing**: Partners access branded versions via URL paths (e.g., `/newsmaker`, `/thi`)
- **Database-backed**: Brands stored in PostgreSQL `brands` table with full CRUD operations
- **Dynamic Loading**: BrandContext fetches brand data on route changes via `/api/brands/slug/:slug`
- **Fallback**: Defaults to BiAS²³ Pro branding when no brand slug detected or brand not found

**Key Files:**
- `shared/schema.ts` - `brands` table schema with Drizzle ORM
- `server/routes.ts` - Brand CRUD API endpoints (admin-protected)
- `client/src/lib/brandContext.tsx` - Dynamic brand loading with route change detection
- `client/src/pages/Library.tsx` - Admin UI for brand management (Brands tab)

**Adding New Partners (Admin UI):**
1. Navigate to `/admin` and login (superadmin / ADMIN_PASSWORD env)
2. Go to "Brands" tab
3. Click "Add Brand" and fill in required fields
4. Set slug (e.g., `newsmaker`) - this becomes the URL path
5. Configure bilingual taglines, colors, social links
6. Activate the brand when ready

**Brand API Endpoints:**
- `GET /api/brands/slug/:slug` - Get brand by slug (public)
- `GET /api/brands/active` - List active brands (public)
- `GET /api/brands` - List all brands (admin)
- `POST /api/brands` - Create brand (admin)
- `PUT /api/brands/:id` - Update brand (admin)
- `DELETE /api/brands/:id` - Delete brand (admin)

**Brand Config Fields:**
- `slug` - URL path identifier (lowercase, no spaces)
- `name`, `shortName` - Brand names
- `taglineEn/Id`, `subtitleEn/Id`, `descriptionEn/Id` - Bilingual text
- `colorPrimary`, `colorSecondary` - Tailwind gradient classes
- `logoUrl` - External logo image URL
- `tiktokHandle/Url`, `instagramHandle/Url` - Social media links
- `isActive` - Toggle brand visibility

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

### Expert Knowledge Base (Expert Mode PRO)
A comprehensive, science-backed knowledge system to counter misinformation from fake TikTok experts.

**Database Tables (8 tables):**
- `expert_knowledge` - Research-backed tips with myth-busting, psychology, and regulation references
- `hooks` - Psychology-backed hook templates with effectiveness scores
- `storytelling_frameworks` - Proven narrative structures for content creation
- `script_templates` - Ready-to-use script templates by category, duration, and goal
- `live_streaming_templates` - Live streaming formats with timeline and contingency plans
- `trending_data` - Trending sounds, hashtags, and challenges tracking
- `growth_stage_guides` - Stage-specific strategies (0-1K, 1K-10K, 10K-100K, 100K+)
- `response_templates` - Templates for handling comments and engagement

**Expert Mode UI Components (6 panels):**
- `ExpertKnowledgePanel` - Browse research, myths, guidelines with category/level filtering
- `HookMasterPanel` - Psychology-backed hooks with copy functionality
- `GrowthRoadmapPanel` - Follower stage finder with tailored strategies
- `ScriptGeneratorPanel` - Script templates filterable by category/duration/goal
- `StorytellingPanel` - Storytelling frameworks with step-by-step structures
- `LiveCoachPanel` - Live streaming templates with timeline visualization

**API Endpoints:**
- `GET /api/expert-knowledge` - Query expert knowledge with filters
- `GET /api/hooks` - Get psychology-backed hooks
- `GET /api/storytelling-frameworks` - Get storytelling frameworks
- `GET /api/script-templates` - Get script templates
- `GET /api/live-streaming-templates` - Get live streaming templates
- `GET /api/growth-guides` - Get growth stage guides
- `GET /api/response-templates` - Get response templates

**Key Files:**
- `shared/schema.ts` - Database schema for all 8 tables
- `server/storage.ts` - Storage methods for Expert Knowledge
- `server/routes.ts` - API endpoints
- `server/data/expert-knowledge-seed.ts` - Seed data
- `client/src/components/expert/` - UI components
- `client/src/pages/social-media-pro.tsx` - Main page with Analytics/Expert mode toggle

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