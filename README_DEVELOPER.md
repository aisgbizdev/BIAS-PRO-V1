# BiAS²³ Pro - Developer Documentation

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon serverless recommended)
- OpenAI API key

### Environment Variables
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### Installation
```bash
npm install
npm run db:push    # Setup database schema
npm run dev        # Start development server
```

Server runs on `http://localhost:5000`

---

## Project Structure

```
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities, contexts, hooks
│   │   └── App.tsx         # Main app with routing
│   └── index.html
├── server/                 # Express Backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # All API endpoints
│   ├── storage.ts          # Database operations
│   └── bias-engine.ts      # 8-layer analysis engine
├── shared/                 # Shared code
│   └── schema.ts           # Drizzle ORM schema
└── attached_assets/        # Knowledge base files
```

---

## API Reference

### Public Endpoints (No Auth)

#### Session
- `POST /api/session` - Create/get session
- `GET /api/session/:id` - Get session data

#### Analysis
- `POST /api/analyze` - Text/script analysis
- `POST /api/analyze-video` - Video/image analysis (OpenAI Vision)
- `POST /api/analyze-screenshot` - Screenshot analysis
- `POST /api/test-hooks` - A/B hook comparison

#### Chat
- `POST /api/chat` - Chat with AI mentor
- `GET /api/chat/:sessionId` - Get chat history

#### Settings & Pricing
- `GET /api/settings/public` - Get platform settings (limits, features)
- `GET /api/pricing` - Get active pricing tiers

#### Library
- `GET /api/library` - Get approved library entries
- `POST /api/library` - Submit new entry (pending approval)

### Admin Endpoints (Require Auth)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check` - Check auth status

#### Settings Management
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings/:key` - Update setting

#### Pricing Management
- `GET /api/admin/pricing` - Get all pricing tiers
- `PUT /api/admin/pricing/:slug` - Update pricing tier

#### Library Management
- `GET /api/admin/library` - Get all entries (including pending)
- `PUT /api/admin/library/:id` - Approve/reject entry
- `DELETE /api/admin/library/:id` - Delete entry

#### Analytics
- `GET /api/admin/analytics` - Get usage analytics

---

## Database Schema

### Core Tables

#### `app_settings`
Platform-wide configuration (limits, features, toggles)
```typescript
{
  key: string,           // e.g., "daily_video_limit"
  value: string,         // Stored as string, parsed by type
  valueType: "string" | "number" | "boolean",
  category: "limits" | "features" | "pricing" | "general",
  isEditable: boolean,
  updatedBy: string | null
}
```

#### `pricing_tiers`
Subscription plans
```typescript
{
  slug: string,          // "gratis", "basic", "pro", "unlimited"
  name: string,
  priceIdr: number,
  priceUsd: number,
  period: string,
  descriptionEn: string,
  descriptionId: string,
  featuresEn: string[],
  featuresId: string[],
  videoLimit: number,
  chatLimit: number,
  isActive: boolean,
  isPopular: boolean
}
```

#### `library_entries`
Community knowledge base
```typescript
{
  category: string,
  questionEn: string,
  questionId: string,
  answerEn: string,
  answerId: string,
  status: "pending" | "approved" | "rejected",
  source: string
}
```

---

## Frontend Architecture

### Key Contexts
- `LanguageContext` - Bilingual switching (EN/ID)
- `SettingsContext` - Platform settings cache
- `ThemeContext` - Dark mode (default)

### State Management
- TanStack Query for server state
- localStorage for user preferences & history

### Routing (Wouter)
```
/                   # Home
/analyzer           # Main analysis page
/tiktok-pro         # TikTok Pro mode
/marketing-pro      # Marketing Pro mode
/premium            # Pricing page
/library            # Knowledge base + Admin panel
/help               # User guide
```

---

## Admin Panel Access

1. Navigate to `/library`
2. Click admin icon (top right)
3. Login with admin credentials
4. Tabs: Library, Analytics, Settings

### Default Admin Setup
Set admin credentials via environment or database.

---

## Development Notes

### Adding New Settings
1. Insert into `app_settings` table with appropriate category
2. Add to `getPublicSettings()` in storage.ts if public
3. Update SettingsContext type if needed

### Adding New Pricing Tier
1. Insert into `pricing_tiers` table
2. Set `isActive: true` to display on Premium page

### Analysis Engine
The 8-layer BIAS framework in `bias-engine.ts`:
- VBM: Voice & Body Modulation
- EPM: Emotional Persuasion Mapping
- NLP: Neuro-Linguistic Programming
- ETH: Ethical Communication
- ECO: Economic Value Proposition
- SOC: Social Proof & Authority
- COG: Cognitive Load Management
- BMIL: Behavioral Motivation & Influence

---

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment
- `NODE_ENV=production`
- Ensure all secrets are set
- Database migrations: `npm run db:push`

### Recommended Stack
- Hosting: Render, Railway, or Replit
- Database: Neon PostgreSQL (serverless)
- CDN: Cloudflare (optional)

---

## Troubleshooting

### Common Issues

**Database connection failed**
- Check DATABASE_URL format
- Ensure IP is whitelisted in Neon

**OpenAI API errors**
- Verify OPENAI_API_KEY is valid
- Check rate limits and billing

**Frontend not updating**
- Clear browser cache
- Restart dev server
- Check for build errors in console

---

## License

Proprietary - All rights reserved.
