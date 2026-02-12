# BiAS²³ Pro - Behavioral Intelligence Audit System

## Overview
BiAS²³ Pro is an AI-powered, bilingual (English-Indonesian) web application that analyzes behavioral communication patterns using an 8-layer framework. It provides detailed, actionable insights for communicators and professionals to improve communication and influence. The system operates in TikTok Pro (TikTok account analytics with an Expert Knowledge Base) and Marketing Pro (analysis of sales presentations, pitches, and marketing videos) modes. Its core purpose is to deliver premium behavioral assessments and science-backed guidance, aiming to counter misinformation.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend is built with React and TypeScript (Vite), utilizing a component-based architecture with functional components and hooks. Routing is managed by Wouter, and server state by TanStack React Query. UI components are developed with Shadcn/ui on Radix UI, styled with Tailwind CSS, adhering to a Material Design-inspired aesthetic. Key features include premium dark theme (`#0A0A0A`) with pink/cyan gradients and glass-morphism effects, language context switching, responsive design, and PWA capabilities.

### Backend
The backend is an Express.js and TypeScript RESTful API. It incorporates a rule-based behavioral analysis engine (`bias-engine.ts`) that implements an 8-layer evaluation framework (VBM, EPM, NLP, ETH, ECO, SOC, COG, BMIL) with mode-specific logic. Core API endpoints handle session and analysis requests. The system features an adaptive analysis mechanism that tailors recommendations based on user skill levels and a warmth detection system to analyze communication tone.

### Data Storage & Privacy
BiAS²³ Pro employs a privacy-first, disposable data model. Chat history and analysis results are temporary, stored in-memory and cleared on server restart. A PostgreSQL database is used solely for persistent public/shared data (e.g., Library contributions, rate limiting, admin data, session metadata). No persistent user analysis data is stored. User sessions are isolated with unique UUIDs.

### Authentication and Authorization
The application uses cookieless session tracking with client-generated session IDs for anonymous users. Admin authentication uses secure session-based authentication with HttpOnly cookies.

### White-Label Branding System
The application supports dynamic white-label branding through a path-based routing system, where brands are managed in a PostgreSQL database and loaded based on the URL.

### Key Features
- **Dual AI Mentor System**: TikTok Pro and Marketing Pro for specialized guidance.
- **Comprehensive Analyzer**: Provides narrative diagnoses, context, impact, motivational framing, and actionable recommendations.
- **Video & Script Analysis**: Supports multi-file video uploads, TikTok URL pasting, and text-based script review. Uses FFmpeg for video processing, OpenAI Whisper for transcription, and GPT-4o-mini Vision for multi-frame analysis.
- **Sales Script Generator**: Offers ready-to-use, bilingual templates for various sales scenarios.
- **Expert Knowledge Base**: A science-backed knowledge system with 8 panels, offering research-backed tips, hook templates, storytelling frameworks, and more.
- **Interactive Creator Hub**: A conversational AI interface acting as a mentor, with mode-specific content.
- **Hybrid Chat System**: Prioritizes responses from local templates, then a self-learning library, and finally falls back to OpenAI API. Includes image upload analysis via OpenAI Vision API.
- **Adaptive Analysis**: Tailors recommendations based on user skill levels.
- **Warmth Detection System**: Analyzes communication tone and calculates a Warmth Index.
- **Platform Rules Hub**: A searchable, bilingual database of official TikTok community guidelines.
- **Admin-Configurable Settings System**: Dynamic platform configuration via `app_settings` and `pricing_tiers` database tables for managing usage limits, feature toggles, and pricing.
- **AI-Personalized Account Analysis**: Generates unique, personalized narratives for account analysis via GPT-4o-mini.
- **Contextual Chat Discussion**: Chat detects personal questions and routes them to AI, prioritizing conversation history for efficiency.
- **Knowledge Base System**: Extracts and saves knowledge (topic, narrative summary, keywords) from conversations, which then becomes available for future queries.
- **Topic Boundary System**: Auto-detects out-of-scope questions (trading/finance → nm23ai.replit.app, news → newsmaker.id, graphic design → Canva, data search → Google) with communication-intent exemptions so finance-related communication coaching is still answered. Located in `server/chat/hybrid-chat.ts` `detectOutOfScopeTopic()` function.

## External Dependencies

### Third-Party Services
- **Database**: Neon PostgreSQL (serverless).
- **AI Services**: OpenAI GPT-4o-mini (primary), Google Gemini 1.5 Flash (fallback).
- **ChatGPT**: Custom GPT integration.

### Key NPM Packages
- **UI/Frontend**: `@radix-ui/*`, `@tanstack/react-query`, `tailwindcss`, `react-hook-form`, `wouter`.
- **Backend**: `express`, `drizzle-orm`, `drizzle-zod`, `zod`.
- **Development**: `vite`, `tsx`, `esbuild`.

### Platform Integrations
- **Social Media APIs**: TikTok API.
- **Behavioral Framework Files**: Knowledge base in `attached_assets/` for 8-layer analysis.