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
- **Modes**: TikTok Pro (Analytics, Beginner, Expert) and Marketing Pro.
- **Comprehensive Analyzer**: Provides narrative diagnoses, context, impact, motivational framing, and actionable recommendations.
- **Account Analyzer**: For social media accounts, offering engagement, growth, content, monetization, audience quality, and posting optimization analysis.
- **Video Analysis**: Supports multi-file video uploads and URL pasting (TikTok) for analysis and comparison.
- **Expert Knowledge Base**: A science-backed knowledge system with 8 panels, including research-backed tips, hook templates, storytelling frameworks, script templates, live streaming templates, trending data, growth stage guides, and response templates.
- **Interactive Creator Hub**: A conversational AI interface (ChatGPT-like) acting as a TikTok mentor, replacing traditional wizards. It offers live streaming and video script generators, and knowledge responses for 13+ TikTok topics, with conversation memory and a hybrid 3-tier response system (local templates → learning library → OpenAI fallback).
- **Hybrid Chat System**: Prioritizes responses from local templates, then a self-learning library of previously answered AI questions, and finally falls back to OpenAI API for new unique questions.
- **Adaptive Analysis**: Tailors recommendations based on user skill levels.
- **Warmth Detection System**: Analyzes communication tone and calculates a Warmth Index.
- **Platform Rules Hub**: A searchable, bilingual database of official TikTok community guidelines.
- **Library Glossary**: Categorized glossary for TikTok, Marketing, BIAS terms.
- **Admin Analytics Dashboard**: Real-time, privacy-first analytics for administrators.

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