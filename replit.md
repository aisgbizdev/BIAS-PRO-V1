# BiAS²³ Pro - Behavioral Intelligence Audit System

## Overview
BiAS²³ Pro is a bilingual (English-Indonesian) AI-powered web application for analyzing behavioral communication patterns using an 8-layer framework. It evaluates communicators and professionals across dimensions like visual behavior, emotional processing, and ethical compliance. The system operates in four modes: Social Media Pro (account analytics for TikTok/Instagram/YouTube), Communication, Academic, and Hybrid (for analyzing speaking and presentation patterns). Its primary goal is to deliver premium, detailed, and actionable behavioral assessments.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

### November 6, 2025 - SIMPLIFIED NAVIGATION TO 2 MODES ✅
- **Navigation Simplification**: Reduced from 4 modes to 2 modes for cleaner UX
  - **Social Pro** (`/social-pro`): Account analytics for TikTok/Instagram/YouTube with platform tabs
  - **Communication** (`/creator`): Sales & marketing video analysis - NO platform tabs, direct upload
  - **Removed**: Academic Analysis and Hybrid Analysis modes (consolidated into Communication)
- **Communication Mode Repositioning**: Sales/marketing focus with updated copywriting
  - **New Description**: "Analyze sales presentations, prospecting calls, client pitches & marketing videos"
  - **Features**: Sales pitch analysis, client presentation feedback, conversion optimization tips
  - **Tab Order**: Video Upload first (left), Text/Link Input second (right) - default to Video Upload
  - **Platform Tabs**: Hidden in Communication mode (Professional mode only, no social media options)
  - **Social Pro**: Platform tabs still visible (TikTok/Instagram/YouTube/Professional)
- **Route Cleanup**: Removed `/academic`, `/hybrid`, `/video-analyzer` routes from App.tsx
- **File Cleanup**: Deleted unused page components (academic-analysis.tsx, hybrid-analysis.tsx, video-analyzer.tsx)
- **Dashboard Update**: Homepage now shows only 2 mode cards with sales-focused copywriting for Communication

### November 4, 2025 - MOBILE RESPONSIVE HEADER + PWA SETUP ✅
- **Mobile-First Header Redesign**: Fully responsive header with hamburger menu for mobile devices
  - **Logo**: Clickable BiAS²³ Pro logo redirects to home page
  - **Hamburger Menu**: Slide-out navigation menu with all pages + ChatGPT + TikTok + Language toggle
  - **TikTok Follow Button**: Added @bias23_ai button in header (desktop shows username, mobile icon-only) + in mobile menu
  - **Responsive Layout**: Desktop horizontal menu, mobile compact with icon-only buttons
  - **Brand Display**: "BiAS²³ Pro" with gradient + "Bilingual • Free" subtitle (hidden on small mobile)
- **PWA (Progressive Web App) Setup**: Installable app for Android/iOS with custom branding
  - **Icons**: BiAS logo (192x192 & 512x512) generated from brand logo
  - **Manifest**: Custom app manifest with BiAS branding, pink theme color (#EC4899)
  - **Add to Home Screen**: Users can install BiAS²³ Pro as standalone app with BiAS logo (not Replit logo)
  - **Theme Color**: Pink gradient matching BiAS brand identity
- **Social Media Integration**: TikTok follow link (https://www.tiktok.com/@bias23_ai) prominently displayed

### November 3, 2025 - PROJECT SETUP & ADMIN PANEL ✅
- **Replit Environment Setup**: GitHub import successfully configured for Replit environment
  - PostgreSQL database provisioned and schema migrated
  - Development workflow configured on port 5000 with webview
  - Production deployment configured with VM target
  - All dependencies installed and running smoothly
- **Library Admin Panel**: Password-protected admin system for managing Library contributions
  - **Access URL**: `/library?admin=true`
  - **Authentication**: Environment variable `ADMIN_PASSWORD` (set in deployment secrets)
  - **Features**: Review pending contributions, edit terms, approve/reject submissions, bulk delete
  - **Security**: Password verification endpoint with proper error handling
- **Database Migration**: All tables created successfully (sessions, analyses, chats, tiktokAccounts, tiktokVideos, tiktokComparisons, libraryContributions)

### November 3, 2025 - CHATGPT CUSTOM GPT INTEGRATION ✅
- **Header ChatGPT Button**: Added prominent ChatGPT button in header for direct access to BiAS custom GPT
  - **Position**: Header between navigation menu and language toggle - highly visible, can't be missed
  - **Design**: Gradient button (pink→purple→cyan) with Sparkles ✨ icon + "Chat GPT" text + ExternalLink icon
  - **Styling**: Matches BiAS brand gradient, shadow on hover, clear visual distinction from internal chat
  - **Text**: "Chat GPT" displayed on desktop, icon-only on mobile for space efficiency
  - **Link**: https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-bias-pro-behavioral-intelligence-audit-system
  - **Purpose**: Allows users to have free-form conversations with BiAS custom GPT beyond the structured internal chat system
  - **UX**: Always visible in header, opens in new tab, clearly labeled to prevent confusion with internal chat

## System Architecture

### Frontend Architecture
The frontend utilizes React with TypeScript (Vite), employing a component-based architecture with functional components and hooks. Routing is managed by Wouter, and server state by TanStack React Query. UI components are built with Shadcn/ui on Radix UI, styled with Tailwind CSS, following a Material Design-inspired aesthetic. Key patterns include language context switching, session management, responsive design, and Inter/JetBrains Mono typography.

### Backend Architecture
The backend is built with Express.js and TypeScript, designed as a RESTful API. It features a rule-based behavioral analysis engine (`bias-engine.ts`) implementing an 8-layer evaluation framework (VBM, EPM, NLP, ETH, ECO, SOC, COG, BMIL) with mode-specific logic. Core API endpoints handle sessions, analysis requests, and chat interactions. It currently uses in-memory storage, with planned migration to Drizzle ORM and PostgreSQL. Authentication is session-based, with a future plan for Firebase Authentication. An adaptive analysis system detects user skill levels, and a warmth detection system analyzes communication tone.

### Data Storage Solutions
**Privacy-First Architecture**: BiAS²³ Pro uses a **disposable data model** for maximum user privacy:
- **In-Memory Storage**: Chat history and analysis results are temporary (RAM-based), automatically cleared on server restart
- **PostgreSQL Database**: Used ONLY for public/shared data:
  - Library contributions (public knowledge base)
  - Rate limiting & abuse prevention
  - Admin panel data
  - Session tracking (basic metadata only, no personal data)
- **No Persistent User Data**: Analysis results and chat conversations are NOT saved to database
- **User Control**: Planned PDF export feature allows users to download their results locally (server does not save files)
- **Session Isolation**: Each user session (identified by unique sessionId in localStorage) maintains completely isolated data - no cross-user data leakage

**Rationale**: This approach maximizes privacy, minimizes server storage costs, and gives users full control over their data. Analysis is one-time use; users can export results if needed but data is not stored server-side.

### Authentication and Authorization
The current system uses **cookieless session tracking** with client-generated session IDs stored in browser localStorage. Each session is isolated with unique UUID-based identifiers. No user authentication system is implemented - the app is fully anonymous and privacy-focused. Firebase Authentication is NOT planned as it contradicts the privacy-first architecture.

### UI/UX Decisions
The application features a premium design system with a dark theme (#0A0A0A), pink/cyan gradients, and glass-morphism effects. It includes metric cards with gradient text, progress bars, trend indicators, and circular progress components. Dashboards are designed for comprehensive analytics, including radar chart visualizations.

### Feature Specifications

#### Mode Order & Differentiation
1.  **Social Media Pro**: Account analytics & metrics for social media platforms.
2.  **Communication Analysis**: Behavioral analysis for public speaking, presentations, and professional meetings.
3.  **Academic Analysis**: Professional communication for leadership, academic contexts, and research presentations.
4.  **Hybrid Analysis**: Combines communication and academic analysis.

-   **Comprehensive Analyzer**: Provides 4-5 sentence narrative diagnoses with context, impact, and motivational framing, alongside detailed, actionable recommendations with examples and timelines.
-   **Account Analyzer (Social Media Pro Mode)**: Displays account profile cards with quick stats, bios, and status badges. Offers six comprehensive analytics cards with deep narrative insights and actionable recommendations: Engagement Rate Analysis, Follower Growth Strategy, Content Strategy Analysis, Monetization Potential, Audience Quality Analysis, and Posting Optimization. All analytics use formal Indonesian language and adhere to platform-specific guidelines.
-   **Video Upload & Comparison**: Supports multi-file video uploads and URL pasting for TikTok, Instagram, and YouTube, with validation, description fields, and comparison results.
-   **Platform Rules Hub**: A centralized, searchable database of official community guidelines for TikTok, Instagram, and YouTube, with bilingual support.
-   **Adaptive Analysis**: Detects user skill levels (beginner, intermediate, professional) based on platform-specific metrics, providing tailored recommendations.
-   **Warmth Detection System**: Analyzes communication for warmth vs. pressure, calculating a Warmth Index.
-   **File-Based Analysis Support**: Supports both link-based and description-based analysis for text, video, photo, and audio content.
-   **Intelligent Keyword Detection**: Expanded keyword coverage (200+ keywords) for audio/voice, video/content, body language, energy/emotion, language/story, and social media topics.
-   **Chat System**: Upgraded to provide actionable, awam-friendly practical guidance with timelines, using a knowledge library-first approach for faster and more cost-effective responses. Includes a floating ChatGPT button for external, free-form conversations.
-   **PDF Export (Planned)**: Users will be able to download analysis results as PDF for offline storage. Server generates PDF on-demand but does NOT save files - direct download to user only.

## External Dependencies

### Third-Party Services
-   **Database**: Neon PostgreSQL (serverless) with Drizzle ORM - used for Library contributions and rate limiting only, NOT for user analysis data.
-   **Authentication**: None - privacy-first approach with anonymous sessions.
-   **File Storage**: None - no persistent file storage. PDF export (planned) generates files on-demand for direct download only.
-   **AI Services**: OpenAI GPT-4o-mini (primary), Google Gemini 1.5 Flash (fallback), BIAS Library (rule-based, offline). Features automatic cascading through tiers and strict guardrails.
-   **ChatGPT**: Custom GPT integration for free-form user conversations.

### Key NPM Packages
-   **UI/Frontend**: `@radix-ui/*`, `@tanstack/react-query`, `tailwindcss`, `clsx`, `tailwind-merge`, `react-hook-form`, `date-fns`, `embla-carousel-react`.
-   **Backend**: `express`, `drizzle-orm`, `drizzle-zod`, `zod`, `connect-pg-simple`.
-   **Development**: `vite`, `tsx`, `esbuild`, `@replit/vite-plugin-*`.

### Platform Integrations
-   **Social Media APIs (Referenced)**: TikTok API, Instagram API, YouTube API.
-   **Behavioral Framework Files**: Knowledge base in `attached_assets/` for 8-layer analysis documentation, community guidelines, and specialized modules.