# BiAS²³ Pro - Behavioral Intelligence Audit System

## Overview
BiAS²³ Pro is a bilingual (English-Indonesian) AI-powered web application for analyzing behavioral communication patterns using an 8-layer framework. It evaluates communicators and professionals across dimensions like visual behavior, emotional processing, and ethical compliance. The system operates in four modes: Social Media Pro (account analytics for TikTok/Instagram/YouTube), Communication, Academic, and Hybrid (for analyzing speaking and presentation patterns). Its primary goal is to deliver premium, detailed, and actionable behavioral assessments.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

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
Currently, data is stored in-memory. A migration to PostgreSQL using Drizzle ORM is planned, with schemas for `sessions`, `analyses`, and `chats` tables.

### Authentication and Authorization
The current system uses session-based tracking with client-generated IDs and token-based rate limiting. Firebase Authentication with Google OAuth is planned for future implementation to manage user sessions and persistent data via Firestore.

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

## External Dependencies

### Third-Party Services
-   **Database (Planned)**: Neon PostgreSQL (serverless) with Drizzle ORM.
-   **Authentication (Planned)**: Firebase Authentication (Google login), Firebase Firestore (user data).
-   **File Storage (Planned)**: Cloudinary or Firebase Storage.
-   **AI Services**: OpenAI GPT-4o-mini (primary), Google Gemini 1.5 Flash (fallback), BIAS Library (rule-based, offline). Features automatic cascading through tiers and strict guardrails.
-   **ChatGPT**: Custom GPT integration for free-form user conversations.

### Key NPM Packages
-   **UI/Frontend**: `@radix-ui/*`, `@tanstack/react-query`, `tailwindcss`, `clsx`, `tailwind-merge`, `react-hook-form`, `date-fns`, `embla-carousel-react`.
-   **Backend**: `express`, `drizzle-orm`, `drizzle-zod`, `zod`, `connect-pg-simple`.
-   **Development**: `vite`, `tsx`, `esbuild`, `@replit/vite-plugin-*`.

### Platform Integrations
-   **Social Media APIs (Referenced)**: TikTok API, Instagram API, YouTube API.
-   **Behavioral Framework Files**: Knowledge base in `attached_assets/` for 8-layer analysis documentation, community guidelines, and specialized modules.