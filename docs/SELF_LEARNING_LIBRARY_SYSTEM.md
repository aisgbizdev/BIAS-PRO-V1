# Self-Learning Library System
## Dokumentasi Teknis untuk Developer

---

## 1. Overview

Self-Learning Library adalah sistem hybrid yang menggabungkan:
- **Local Templates** (hardcoded knowledge)
- **Database Contributions** (user-generated, admin-approved)
- **AI Fallback** (OpenAI/Gemini untuk pertanyaan baru)

### Keuntungan:
- Hemat biaya API (prioritas local → database → AI)
- Knowledge bertambah dari waktu ke waktu
- Quality control via admin review
- Scalable dan maintainable

---

## 2. Database Schema

```sql
-- PostgreSQL
CREATE TABLE library_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Konten (bilingual support)
  term TEXT NOT NULL,              -- Istilah dalam English
  term_id TEXT,                    -- Istilah dalam Indonesian
  definition TEXT NOT NULL,        -- Definisi English
  definition_id TEXT,              -- Definisi Indonesian
  example TEXT,                    -- Contoh English
  example_id TEXT,                 -- Contoh Indonesian
  
  -- Metadata
  category TEXT,                   -- 'marketing', 'tiktok', 'general'
  platform TEXT NOT NULL,          -- 'tiktok', 'instagram', 'youtube'
  username TEXT NOT NULL,          -- Kontributor
  
  -- Review System
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  rejection_reason TEXT,           -- Alasan jika ditolak
  reviewed_by TEXT,                -- Admin yang review
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- Index untuk performa
CREATE INDEX idx_library_status ON library_contributions(status);
CREATE INDEX idx_library_term ON library_contributions(term);
CREATE INDEX idx_library_platform ON library_contributions(platform);
```

### Drizzle ORM (TypeScript)

```typescript
import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const libraryContributions = pgTable("library_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: text("term").notNull(),
  termId: text("term_id"),
  definition: text("definition").notNull(),
  definitionId: text("definition_id"),
  example: text("example"),
  exampleId: text("example_id"),
  category: text("category"),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: text("reviewed_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
});
```

---

## 3. Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BERTANYA                            │
│                   "Apa itu shadowban?"                       │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: LOCAL TEMPLATES                                    │
│  ════════════════════════                                    │
│  - File JSON/Array berisi FAQ umum                          │
│  - Matching: exact keyword atau regex                        │
│  - Contoh: shadowban, FYP, engagement rate                  │
│                                                              │
│  if (localMatch) return localMatch.answer;                   │
│  └── SELESAI (0 API cost)                                   │
└─────────────────────────┬───────────────────────────────────┘
                          ▼ (tidak match)
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: DATABASE (User Contributions)                      │
│  ══════════════════════════════════════                      │
│  - Query: WHERE status = 'approved'                         │
│  - Matching: fuzzy search / ILIKE                           │
│  - Prioritas: exact match > partial match                   │
│                                                              │
│  if (dbMatch) return dbMatch.definition;                     │
│  └── SELESAI (0 API cost)                                   │
└─────────────────────────┬───────────────────────────────────┘
                          ▼ (tidak match)
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: AI API (OpenAI / Gemini)                          │
│  ══════════════════════════════════                          │
│  - Kirim pertanyaan ke AI                                   │
│  - Terima jawaban                                           │
│  - Tampilkan ke user                                        │
│  - Tampilkan tombol [Simpan ke Library]                     │
│                                                              │
│  return { answer: aiResponse, canSave: true };               │
└─────────────────────────┬───────────────────────────────────┘
                          ▼ (user klik simpan)
┌─────────────────────────────────────────────────────────────┐
│  SAVE TO DATABASE                                            │
│  ════════════════                                            │
│  - INSERT dengan status = 'pending'                         │
│  - Feedback: "Kontribusi menunggu review admin"             │
│  - Tidak langsung muncul di Library public                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Admin Review Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  PENDING CONTRIBUTIONS (3)                           │    │
│  │                                                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ Term: "Ghosting Followers"                   │    │    │
│  │  │ Definition: "When followers unfollow..."     │    │    │
│  │  │ By: @user123 | Platform: TikTok             │    │    │
│  │  │                                              │    │    │
│  │  │ [✓ APPROVE]  [✗ REJECT]  [✎ EDIT]          │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ Term: "Algorithm Hack"                       │    │    │
│  │  │ Definition: "Trick to manipulate..."         │    │    │
│  │  │ By: @spammer | Platform: TikTok             │    │    │
│  │  │                                              │    │    │
│  │  │ [✓ APPROVE]  [✗ REJECT]  [✎ EDIT]          │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

APPROVE → UPDATE status = 'approved', approved_at = NOW()
REJECT  → UPDATE status = 'rejected', rejection_reason = '...'
EDIT    → Admin perbaiki konten, lalu approve
```

---

## 5. API Endpoints

### 5.1 Public Endpoints

```
GET /api/library/contributions/approved
────────────────────────────────────────
Response: Array of approved contributions
Used by: Public Library page

GET /api/library/search?q=shadowban
────────────────────────────────────
Response: Matching approved contributions
Used by: Chat hybrid search
```

### 5.2 User Endpoints

```
POST /api/library/contribute
────────────────────────────
Body: {
  term: "Istilah baru",
  definition: "Penjelasan...",
  platform: "tiktok",
  username: "@user123",
  example: "Contoh penggunaan..."
}
Response: { success: true, id: "uuid", status: "pending" }
```

### 5.3 Admin Endpoints

```
GET /api/library/contributions/pending
──────────────────────────────────────
Response: Array of pending contributions
Auth: Admin only

POST /api/library/contributions/:id/approve
───────────────────────────────────────────
Response: { success: true }
Effect: status → 'approved', approved_at → NOW()

POST /api/library/contributions/:id/reject
──────────────────────────────────────────
Body: { reason: "Tidak akurat" }
Response: { success: true }
Effect: status → 'rejected', rejection_reason → reason

PUT /api/library/contributions/:id
──────────────────────────────────
Body: { term, definition, example }
Response: Updated contribution
Used for: Edit before approve

DELETE /api/library/contributions/:id
─────────────────────────────────────
Response: { success: true }
Effect: Hard delete from database
```

---

## 6. Backend Implementation

### 6.1 Chat Handler (Hybrid Logic)

```typescript
// services/chatHandler.ts

import { localTemplates } from './templates';
import { db } from './database';
import { openai } from './openai';

interface ChatResponse {
  answer: string;
  source: 'local' | 'database' | 'ai';
  canSave: boolean;
  matchedTerm?: string;
}

export async function handleChatQuestion(question: string): Promise<ChatResponse> {
  const normalizedQ = question.toLowerCase().trim();
  
  // ═══════════════════════════════════════════════════════
  // LAYER 1: Check Local Templates
  // ═══════════════════════════════════════════════════════
  const localMatch = localTemplates.find(template => {
    // Exact keyword match
    if (template.keywords.some(kw => normalizedQ.includes(kw.toLowerCase()))) {
      return true;
    }
    // Regex match (optional)
    if (template.regex && template.regex.test(normalizedQ)) {
      return true;
    }
    return false;
  });
  
  if (localMatch) {
    return {
      answer: localMatch.answer,
      source: 'local',
      canSave: false,
      matchedTerm: localMatch.term
    };
  }
  
  // ═══════════════════════════════════════════════════════
  // LAYER 2: Check Database (Approved Contributions)
  // ═══════════════════════════════════════════════════════
  const dbMatch = await db.query(`
    SELECT * FROM library_contributions 
    WHERE status = 'approved' 
    AND (
      LOWER(term) LIKE $1 
      OR LOWER(definition) LIKE $1
      OR LOWER(term_id) LIKE $1
    )
    ORDER BY 
      CASE WHEN LOWER(term) = $2 THEN 1 ELSE 2 END,
      created_at DESC
    LIMIT 1
  `, [`%${normalizedQ}%`, normalizedQ]);
  
  if (dbMatch.rows.length > 0) {
    const match = dbMatch.rows[0];
    return {
      answer: match.definition,
      source: 'database',
      canSave: false,
      matchedTerm: match.term
    };
  }
  
  // ═══════════════════════════════════════════════════════
  // LAYER 3: Call AI API
  // ═══════════════════════════════════════════════════════
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant...' },
      { role: 'user', content: question }
    ],
    max_tokens: 500
  });
  
  const answer = aiResponse.choices[0].message.content || '';
  
  return {
    answer,
    source: 'ai',
    canSave: true  // User bisa simpan ke library
  };
}
```

### 6.2 Local Templates Format

```typescript
// data/localTemplates.ts

export interface LocalTemplate {
  id: string;
  term: string;
  keywords: string[];
  regex?: RegExp;
  answer: string;
  answerId?: string;  // Indonesian version
  category: string;
}

export const localTemplates: LocalTemplate[] = [
  {
    id: 'shadowban',
    term: 'Shadowban',
    keywords: ['shadowban', 'shadow ban', 'dibanned', 'video hilang'],
    regex: /shadow\s?ban/i,
    answer: 'Shadowban is when TikTok limits your content reach without notification...',
    answerId: 'Shadowban adalah ketika TikTok membatasi jangkauan konten tanpa pemberitahuan...',
    category: 'Platform Issue'
  },
  {
    id: 'fyp',
    term: 'FYP (For You Page)',
    keywords: ['fyp', 'for you page', 'for you', 'beranda'],
    answer: 'FYP is the main feed on TikTok powered by algorithm...',
    answerId: 'FYP adalah feed utama TikTok yang didukung algoritma...',
    category: 'Platform Feature'
  },
  // ... more templates
];
```

### 6.3 Save to Library Endpoint

```typescript
// routes/library.ts

app.post('/api/library/contribute', async (req, res) => {
  const { term, termId, definition, definitionId, platform, username, example } = req.body;
  
  // Validation
  if (!term || !definition || !username) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }
  
  // Check duplicate
  const existing = await db.query(
    'SELECT id FROM library_contributions WHERE LOWER(term) = $1',
    [term.toLowerCase()]
  );
  
  if (existing.rows.length > 0) {
    return res.status(409).json({ 
      success: false, 
      error: 'Term already exists' 
    });
  }
  
  // Insert with pending status
  const result = await db.query(`
    INSERT INTO library_contributions 
    (term, term_id, definition, definition_id, platform, username, example, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
    RETURNING id
  `, [term, termId, definition, definitionId, platform, username, example]);
  
  res.json({ 
    success: true, 
    id: result.rows[0].id,
    status: 'pending',
    message: 'Contribution submitted for review'
  });
});
```

### 6.4 Admin Approve/Reject

```typescript
// routes/admin.ts

// Approve
app.post('/api/library/contributions/:id/approve', adminAuth, async (req, res) => {
  const { id } = req.params;
  const adminUser = req.user.username;
  
  await db.query(`
    UPDATE library_contributions 
    SET status = 'approved', 
        approved_at = NOW(),
        reviewed_by = $2
    WHERE id = $1
  `, [id, adminUser]);
  
  res.json({ success: true });
});

// Reject
app.post('/api/library/contributions/:id/reject', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const adminUser = req.user.username;
  
  await db.query(`
    UPDATE library_contributions 
    SET status = 'rejected', 
        rejection_reason = $2,
        reviewed_by = $3
    WHERE id = $1
  `, [id, reason, adminUser]);
  
  res.json({ success: true });
});
```

---

## 7. Frontend Implementation

### 7.1 Chat Component with Save Button

```tsx
// components/ChatBox.tsx

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ question: input })
    });
    const data = await response.json();
    
    const assistantMessage = {
      role: 'assistant',
      content: data.answer,
      source: data.source,
      canSave: data.canSave
    };
    setMessages(prev => [...prev, assistantMessage]);
  };
  
  const handleSaveToLibrary = async (message: Message) => {
    // Open modal to fill term/definition
    // Submit to /api/library/contribute
    // Show success toast
  };
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <p>{msg.content}</p>
          {msg.canSave && (
            <Button onClick={() => handleSaveToLibrary(msg)}>
              💾 Simpan ke Library
            </Button>
          )}
          {msg.source === 'database' && (
            <Badge>📚 From Library</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 7.2 Admin Review Panel

```tsx
// components/AdminLibraryReview.tsx

function AdminLibraryReview() {
  const [pending, setPending] = useState([]);
  
  useEffect(() => {
    fetch('/api/library/contributions/pending')
      .then(res => res.json())
      .then(setPending);
  }, []);
  
  const handleApprove = async (id: string) => {
    await fetch(`/api/library/contributions/${id}/approve`, { method: 'POST' });
    setPending(prev => prev.filter(p => p.id !== id));
    toast.success('Approved!');
  };
  
  const handleReject = async (id: string, reason: string) => {
    await fetch(`/api/library/contributions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    setPending(prev => prev.filter(p => p.id !== id));
    toast.success('Rejected');
  };
  
  return (
    <div>
      <h2>Pending Contributions ({pending.length})</h2>
      {pending.map(item => (
        <Card key={item.id}>
          <h3>{item.term}</h3>
          <p>{item.definition}</p>
          <p>By: {item.username}</p>
          <Button onClick={() => handleApprove(item.id)}>✓ Approve</Button>
          <Button onClick={() => handleReject(item.id, 'Reason')}>✗ Reject</Button>
        </Card>
      ))}
    </div>
  );
}
```

---

## 8. Security Considerations

### 8.1 Input Validation
```typescript
// Sanitize user input
const sanitizedTerm = term.trim().substring(0, 100);
const sanitizedDef = definition.trim().substring(0, 1000);

// Prevent XSS
import DOMPurify from 'dompurify';
const cleanDef = DOMPurify.sanitize(definition);
```

### 8.2 Rate Limiting
```typescript
// Limit submissions per user
const rateLimit = require('express-rate-limit');

const contributionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour
  message: 'Too many submissions, try again later'
});

app.post('/api/library/contribute', contributionLimiter, handler);
```

### 8.3 Admin Authentication
```typescript
// Simple session-based admin auth
function adminAuth(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

---

## 9. Optimization Tips

### 9.1 Caching
```typescript
// Cache approved contributions in Redis
const redis = require('redis');
const client = redis.createClient();

async function getApprovedContributions() {
  const cached = await client.get('library:approved');
  if (cached) return JSON.parse(cached);
  
  const data = await db.query('SELECT * FROM library_contributions WHERE status = $1', ['approved']);
  await client.setEx('library:approved', 3600, JSON.stringify(data.rows)); // 1 hour cache
  return data.rows;
}

// Invalidate cache on approve/reject
async function invalidateLibraryCache() {
  await client.del('library:approved');
}
```

### 9.2 Search Optimization
```typescript
// Use PostgreSQL full-text search for better matching
CREATE INDEX idx_library_search ON library_contributions 
USING GIN(to_tsvector('english', term || ' ' || definition));

// Query with full-text search
SELECT * FROM library_contributions 
WHERE status = 'approved'
AND to_tsvector('english', term || ' ' || definition) @@ plainto_tsquery('english', $1);
```

---

## 10. Summary Checklist

### Database
- [ ] Create `library_contributions` table
- [ ] Add indexes for performance
- [ ] Set up status enum (pending/approved/rejected)

### Backend API
- [ ] GET /api/library/contributions/approved
- [ ] GET /api/library/contributions/pending (admin)
- [ ] POST /api/library/contribute
- [ ] POST /api/library/contributions/:id/approve
- [ ] POST /api/library/contributions/:id/reject
- [ ] PUT /api/library/contributions/:id
- [ ] DELETE /api/library/contributions/:id

### Frontend
- [ ] Library page showing approved only
- [ ] Contribution form
- [ ] Save to Library button in chat
- [ ] Admin review panel
- [ ] Status indicators

### Security
- [ ] Input validation
- [ ] Rate limiting
- [ ] Admin authentication
- [ ] XSS prevention

---

**Created for BiAS Pro**  
**Version: 1.0**  
**Last Updated: December 2024**
