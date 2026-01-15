// Learning System - Ai answers become local knowledge
import { db } from '../../db';
import { learnedResponses } from '@shared/schema';
import { eq, sql, desc, and, lt } from 'drizzle-orm';

// Rate limiting for learning (per session)
const sessionSaveCount = new Map<string, { count: number; resetAt: number }>();
const MAX_SAVES_PER_SESSION = 5;
const SESSION_RESET_MS = 60 * 60 * 1000; // 1 hour

// Indonesian stopwords to filter out
const STOPWORDS = new Set([
  'yang', 'di', 'ke', 'dari', 'dan', 'atau', 'ini', 'itu', 'untuk', 'dengan',
  'pada', 'adalah', 'akan', 'juga', 'sudah', 'bisa', 'ada', 'tidak', 'saya',
  'aku', 'kamu', 'dia', 'mereka', 'kita', 'gue', 'lo', 'lu', 'gw', 'apa',
  'gimana', 'bagaimana', 'kenapa', 'mengapa', 'kapan', 'dimana', 'mana',
  'siapa', 'berapa', 'apakah', 'dong', 'ya', 'nih', 'sih', 'deh', 'kan',
  'tuh', 'loh', 'lah', 'nah', 'wah', 'hah', 'eh', 'oh', 'ah', 'the', 'is',
  'a', 'an', 'to', 'in', 'on', 'of', 'for', 'and', 'or', 'it', 'this', 'that',
  'how', 'what', 'why', 'when', 'where', 'who', 'which', 'can', 'bro', 'mas',
  'bang', 'kak', 'min', 'mau', 'minta', 'tolong', 'kasih', 'tau', 'tanya',
]);

// Patterns that indicate analysis requests (NOT knowledge questions)
const ANALYSIS_REQUEST_PATTERNS = [
  /@\w+/i, // @username
  /analisa\s+(akun|video|account)/i,
  /analyze\s+(account|video|my)/i,
  /cek\s+(akun|video)/i,
  /check\s+(account|video)/i,
  /review\s+(my|akun|video)/i,
  /hasil\s+(analisis|analysis)/i,
  /my\s+(analysis|result)/i,
  /skor\s+saya/i,
  /score\s+saya/i,
  /kelemahan\s+saya/i,
  /my\s+weakness/i,
  /kelebihan\s+saya/i,
  /my\s+strength/i,
  /apa\s+yang\s+harus\s+diperbaiki/i,
  /what\s+should\s+i\s+improve/i,
];

// Spam/gibberish patterns
const SPAM_PATTERNS = [
  /^[a-z]{1,3}$/i, // Single letters or very short
  /^test+$/i,
  /^aaa+$/i,
  /^asdf+/i,
  /^qwer+/i,
  /^[0-9]+$/,
  /(.)\1{4,}/, // Repeated characters (5+ times)
];

// Personal data patterns
const PERSONAL_DATA_PATTERNS = [
  /\b\d{10,13}\b/, // Phone numbers (10-13 digits)
  /\+62\d{9,12}/, // Indonesian phone with country code
  /08\d{8,11}/, // Indonesian mobile number
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
];

// Extract meaningful keywords from a question
export function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = normalized.split(' ');
  const keywords = words
    .filter(word => word.length > 2 && !STOPWORDS.has(word))
    .slice(0, 10); // Max 10 keywords
  
  return Array.from(new Set(keywords)); // Remove duplicates
}

// Calculate similarity score between two keyword arrays
function calculateSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  
  let matches = 0;
  for (const kw of arr1) {
    if (set2.has(kw)) matches++;
    // Also check partial matches
    for (const kw2 of arr2) {
      if (kw !== kw2 && (kw.includes(kw2) || kw2.includes(kw))) {
        matches += 0.5;
      }
    }
  }
  
  // Jaccard-like similarity
  const combined = Array.from(new Set([...keywords1, ...keywords2]));
  return matches / combined.length;
}

// Check if question should be saved (all filters)
export function shouldSaveQuestion(question: string, sessionId?: string): {
  shouldSave: boolean;
  reason?: string;
} {
  const q = question.trim();
  
  // 1. Minimum length check
  if (q.length < 10) {
    return { shouldSave: false, reason: 'Question too short (<10 chars)' };
  }
  
  // 2. Spam/gibberish check
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(q)) {
      return { shouldSave: false, reason: 'Detected as spam/gibberish' };
    }
  }
  
  // 3. Analysis request check (not knowledge questions)
  for (const pattern of ANALYSIS_REQUEST_PATTERNS) {
    if (pattern.test(q)) {
      return { shouldSave: false, reason: 'Analysis request, not knowledge question' };
    }
  }
  
  // 4. Personal data check
  for (const pattern of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(q)) {
      return { shouldSave: false, reason: 'Contains personal data (phone/email)' };
    }
  }
  
  // 5. Rate limit check per session
  if (sessionId) {
    const now = Date.now();
    const sessionData = sessionSaveCount.get(sessionId);
    
    if (sessionData) {
      if (now > sessionData.resetAt) {
        // Reset counter
        sessionSaveCount.set(sessionId, { count: 0, resetAt: now + SESSION_RESET_MS });
      } else if (sessionData.count >= MAX_SAVES_PER_SESSION) {
        return { shouldSave: false, reason: `Rate limit exceeded (>${MAX_SAVES_PER_SESSION}/session)` };
      }
    }
  }
  
  return { shouldSave: true };
}

// Increment session save counter
function incrementSessionSaveCount(sessionId: string): void {
  const now = Date.now();
  const sessionData = sessionSaveCount.get(sessionId);
  
  if (sessionData && now <= sessionData.resetAt) {
    sessionData.count++;
  } else {
    sessionSaveCount.set(sessionId, { count: 1, resetAt: now + SESSION_RESET_MS });
  }
}

// Find similar learned response (with mode context)
export async function findSimilarResponse(question: string, mode?: string): Promise<{
  found: boolean;
  response?: string;
  similarity?: number;
  id?: string;
}> {
  try {
    const queryKeywords = extractKeywords(question);
    if (queryKeywords.length === 0) {
      return { found: false };
    }

    console.log(`🔍 Looking for similar response. Keywords: ${queryKeywords.join(', ')}, Mode: ${mode || 'any'}`);

    // Get only APPROVED learned responses (admin must verify before use)
    let query = db.select().from(learnedResponses)
      .where(eq(learnedResponses.isApproved, true))
      .orderBy(desc(learnedResponses.useCount));

    const allResponses = await query;

    let bestMatch: { response: string; similarity: number; id: string } | null = null;
    const SIMILARITY_THRESHOLD = 0.4; // 40% keyword overlap = match

    for (const lr of allResponses) {
      // If mode is specified, prefer same-mode responses
      const storedMode = lr.mode || 'tiktok';
      const modeMatch = !mode || storedMode === mode;
      
      const storedKeywords = lr.keywords || [];
      let similarity = calculateSimilarity(queryKeywords, storedKeywords);
      
      // Boost similarity if mode matches
      if (modeMatch) {
        similarity *= 1.2; // 20% boost for same mode
      } else {
        similarity *= 0.8; // 20% penalty for different mode
      }
      
      if (similarity >= SIMILARITY_THRESHOLD) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            response: lr.response,
            similarity,
            id: lr.id,
          };
        }
      }
    }

    if (bestMatch) {
      console.log(`✅ Found similar response! Similarity: ${(bestMatch.similarity * 100).toFixed(0)}%`);
      
      // Increment use count
      await db.update(learnedResponses)
        .set({ 
          useCount: sql`${learnedResponses.useCount} + 1`,
          lastUsedAt: new Date(),
        })
        .where(eq(learnedResponses.id, bestMatch.id));

      return {
        found: true,
        response: bestMatch.response,
        similarity: bestMatch.similarity,
        id: bestMatch.id,
      };
    }

    console.log('❌ No similar response found in learned library');
    return { found: false };

  } catch (error) {
    console.error('Error finding similar response:', error);
    return { found: false };
  }
}

// Save Ai response to learned library (with all filters)
export async function saveLearnedResponse(
  question: string, 
  response: string, 
  mode?: string,
  sessionId?: string
): Promise<boolean> {
  try {
    // Apply all filters first
    const filterResult = shouldSaveQuestion(question, sessionId);
    if (!filterResult.shouldSave) {
      console.log(`⚠️ Skipping save: ${filterResult.reason}`);
      return false;
    }

    const keywords = extractKeywords(question);
    if (keywords.length === 0) {
      console.log('⚠️ No keywords extracted, skipping save');
      return false;
    }

    // Check if very similar question already exists (80%+ similarity)
    const existing = await findSimilarResponse(question, mode);
    if (existing.found && existing.similarity && existing.similarity > 0.8) {
      console.log('📦 Very similar question already exists (80%+), skipping save');
      return false;
    }

    // Check max entries limit (500)
    const allResponses = await db.select({ id: learnedResponses.id }).from(learnedResponses);
    if (allResponses.length >= 500) {
      console.log('⚠️ Max entries limit reached (500), skipping save');
      return false;
    }

    await db.insert(learnedResponses).values({
      question,
      keywords,
      response,
      mode: mode || 'tiktok',
    });

    // Increment session counter
    if (sessionId) {
      incrementSessionSaveCount(sessionId);
    }

    console.log(`📚 Saved to learned library! Keywords: ${keywords.join(', ')}, Mode: ${mode || 'tiktok'}`);
    return true;

  } catch (error) {
    console.error('Error saving learned response:', error);
    return false;
  }
}

// Auto-cleanup: Delete unapproved responses older than 30 days
export async function cleanupOldUnapprovedResponses(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db.delete(learnedResponses)
      .where(and(
        eq(learnedResponses.isApproved, false),
        lt(learnedResponses.createdAt, thirtyDaysAgo)
      ))
      .returning({ id: learnedResponses.id });

    const deletedCount = result.length;
    if (deletedCount > 0) {
      console.log(`🧹 Auto-cleanup: Deleted ${deletedCount} unapproved responses older than 30 days`);
    }
    return deletedCount;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return 0;
  }
}

// Cleanup unused responses (not used in 3 months)
export async function cleanupUnusedResponses(): Promise<number> {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const result = await db.delete(learnedResponses)
      .where(and(
        eq(learnedResponses.isApproved, false),
        lt(learnedResponses.lastUsedAt, threeMonthsAgo)
      ))
      .returning({ id: learnedResponses.id });

    const deletedCount = result.length;
    if (deletedCount > 0) {
      console.log(`🧹 Cleanup: Deleted ${deletedCount} unused responses (>3 months)`);
    }
    return deletedCount;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return 0;
  }
}

// Get learning stats
export async function getLearningStats(): Promise<{
  totalResponses: number;
  pendingCount: number;
  approvedCount: number;
  totalUses: number;
  topKeywords: string[];
}> {
  try {
    const allResponses = await db.select().from(learnedResponses);
    
    const totalResponses = allResponses.length;
    const pendingCount = allResponses.filter(r => !r.isApproved).length;
    const approvedCount = allResponses.filter(r => r.isApproved).length;
    const totalUses = allResponses.reduce((sum: number, r: typeof allResponses[0]) => sum + r.useCount, 0);
    
    // Count keyword frequency
    const keywordCount: Record<string, number> = {};
    for (const r of allResponses) {
      for (const kw of (r.keywords || [])) {
        keywordCount[kw] = (keywordCount[kw] || 0) + r.useCount;
      }
    }
    
    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kw]) => kw);

    return { totalResponses, pendingCount, approvedCount, totalUses, topKeywords };
  } catch (error) {
    console.error('Error getting learning stats:', error);
    return { totalResponses: 0, pendingCount: 0, approvedCount: 0, totalUses: 0, topKeywords: [] };
  }
}
