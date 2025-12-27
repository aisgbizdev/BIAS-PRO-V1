// Learning System - Ai answers become local knowledge
import { db } from '../../db';
import { learnedResponses } from '@shared/schema';
import { eq, sql, desc, and, lt } from 'drizzle-orm';

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

// Find similar learned response
export async function findSimilarResponse(question: string): Promise<{
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

    console.log(`🔍 Looking for similar response. Keywords: ${queryKeywords.join(', ')}`);

    // Get only APPROVED learned responses (admin must verify before use)
    const allResponses = await db.select().from(learnedResponses)
      .where(eq(learnedResponses.isApproved, true))
      .orderBy(desc(learnedResponses.useCount));

    let bestMatch: { response: string; similarity: number; id: string } | null = null;
    const SIMILARITY_THRESHOLD = 0.4; // 40% keyword overlap = match

    for (const lr of allResponses) {
      const storedKeywords = lr.keywords || [];
      const similarity = calculateSimilarity(queryKeywords, storedKeywords);
      
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

// Save Ai response to learned library
export async function saveLearnedResponse(question: string, response: string): Promise<boolean> {
  try {
    const keywords = extractKeywords(question);
    if (keywords.length === 0) {
      console.log('⚠️ No keywords extracted, skipping save');
      return false;
    }

    // Check if very similar question already exists
    const existing = await findSimilarResponse(question);
    if (existing.found && existing.similarity && existing.similarity > 0.8) {
      console.log('📦 Very similar question already exists, skipping save');
      return false;
    }

    await db.insert(learnedResponses).values({
      question,
      keywords,
      response,
    });

    console.log(`📚 Saved to learned library! Keywords: ${keywords.join(', ')}`);
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

// Get learning stats
export async function getLearningStats(): Promise<{
  totalResponses: number;
  totalUses: number;
  topKeywords: string[];
}> {
  try {
    const allResponses = await db.select().from(learnedResponses);
    
    const totalResponses = allResponses.length;
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

    return { totalResponses, totalUses, topKeywords };
  } catch (error) {
    console.error('Error getting learning stats:', error);
    return { totalResponses: 0, totalUses: 0, topKeywords: [] };
  }
}
