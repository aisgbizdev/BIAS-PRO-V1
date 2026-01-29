// Knowledge Extraction Service - Extract essence from conversations
import OpenAI from 'openai';
import { db } from '../../db';
import { knowledgeBase } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

const openai = new OpenAI();

interface ConversationContext {
  question: string;
  response: string;
  mode: 'tiktok' | 'marketing';
  sessionId?: string;
}

interface ExtractedKnowledge {
  topic: string;
  narrative: string;
  keywords: string[];
  category: string;
  subcategory: string;
  confidenceScore: number;
}

// Subcategories for each category
const SUBCATEGORIES = {
  tiktok: ['fyp', 'algoritma', 'hook', 'live', 'hashtag', 'engagement', 'content', 'growth', 'viral', 'audio', 'trend', 'general'],
  marketing: ['sales', 'pitch', 'cold-call', 'follow-up', 'objection', 'presentation', 'negotiation', 'email', 'wa', 'general']
};

// Minimum conversation quality thresholds
const MIN_QUESTION_LENGTH = 15;
const MIN_RESPONSE_LENGTH = 100;
const MIN_EXCHANGE_WORDS = 50;

// Rate limiting
const extractionCount = new Map<string, { count: number; resetAt: number }>();
const MAX_EXTRACTIONS_PER_HOUR = 10;

function canExtract(sessionId: string): boolean {
  const now = Date.now();
  const session = extractionCount.get(sessionId);
  
  if (!session || now > session.resetAt) {
    extractionCount.set(sessionId, { count: 0, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  
  return session.count < MAX_EXTRACTIONS_PER_HOUR;
}

function incrementExtractionCount(sessionId: string): void {
  const session = extractionCount.get(sessionId);
  if (session) {
    session.count++;
  }
}

// Check if conversation is worth extracting
export function isConversationWorthy(context: ConversationContext): { worthy: boolean; reason?: string } {
  const { question, response } = context;
  
  // Check minimum lengths
  if (question.length < MIN_QUESTION_LENGTH) {
    return { worthy: false, reason: 'Question too short' };
  }
  
  if (response.length < MIN_RESPONSE_LENGTH) {
    return { worthy: false, reason: 'Response too short' };
  }
  
  // Check total word count
  const totalWords = (question + ' ' + response).split(/\s+/).length;
  if (totalWords < MIN_EXCHANGE_WORDS) {
    return { worthy: false, reason: 'Conversation too brief' };
  }
  
  // Check for spam patterns
  const spamPatterns = [
    /^[a-z]{1,3}$/i,
    /^test+$/i,
    /^aaa+$/i,
    /(.)\1{4,}/,
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(question)) {
      return { worthy: false, reason: 'Spam detected' };
    }
  }
  
  // Check for analysis-specific requests (not generalizable knowledge)
  const analysisPatterns = [
    /@\w+/i,
    /analisa\s+(akun|video|account)/i,
    /analyze\s+(account|video|my)/i,
    /cek\s+(akun|video)/i,
    /hasil\s+(analisis|analysis)/i,
    /skor\s+saya/i,
    /score\s+saya/i,
  ];
  
  for (const pattern of analysisPatterns) {
    if (pattern.test(question)) {
      return { worthy: false, reason: 'Analysis request, not generalizable' };
    }
  }
  
  // Check for personal data
  const personalPatterns = [
    /\b\d{10,13}\b/,
    /\+62\d{9,12}/,
    /08\d{8,11}/,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  ];
  
  for (const pattern of personalPatterns) {
    if (pattern.test(question) || pattern.test(response)) {
      return { worthy: false, reason: 'Contains personal data' };
    }
  }
  
  return { worthy: true };
}

// Extract knowledge using AI
export async function extractKnowledge(context: ConversationContext): Promise<ExtractedKnowledge | null> {
  const { question, response, mode } = context;
  
  const subcategories = SUBCATEGORIES[mode] || SUBCATEGORIES.tiktok;
  
  const extractionPrompt = `Kamu adalah Knowledge Curator untuk BiAS Pro.

TUGAS: Ekstrak ESENSI dari percakapan ini menjadi knowledge yang bisa dipakai untuk pertanyaan serupa.

PERCAKAPAN:
User: "${question}"
AI: "${response.substring(0, 1500)}..."

MODE: ${mode}

INSTRUKSI:
1. Tentukan TOPIC (judul singkat 3-7 kata)
2. Tulis NARRATIVE (rangkuman esensi dalam 2-4 kalimat, bukan copy-paste)
3. Ekstrak KEYWORDS (5-10 kata kunci untuk matching)
4. Pilih SUBCATEGORY dari: ${subcategories.join(', ')}
5. Beri CONFIDENCE score (0.0-1.0) seberapa universal knowledge ini

FORMAT RESPONS (JSON only, no markdown):
{
  "topic": "Cara Masuk FYP TikTok",
  "narrative": "Untuk masuk FYP, fokus pada hook 3 detik pertama yang kuat. Gunakan audio trending dan posting di jam prime time (12.00, 19.00-21.00). Engagement di 1 jam pertama sangat menentukan.",
  "keywords": ["fyp", "hook", "trending", "prime time", "engagement"],
  "subcategory": "fyp",
  "confidenceScore": 0.85
}

ATURAN:
- Narrative harus ringkas dan actionable
- Jangan copy-paste, tulis ulang dengan bahasa sendiri
- Jika percakapan terlalu spesifik/personal, beri confidence rendah (<0.5)
- Keywords harus relevan untuk matching pertanyaan serupa`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a knowledge extraction assistant. Output valid JSON only.' },
        { role: 'user', content: extractionPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('❌ No content from extraction');
      return null;
    }

    const extracted = JSON.parse(content) as ExtractedKnowledge;
    
    // Validate extracted data
    if (!extracted.topic || !extracted.narrative || !extracted.keywords?.length) {
      console.error('❌ Invalid extraction result');
      return null;
    }
    
    // Add category from mode
    extracted.category = mode;
    
    // Validate subcategory
    if (!subcategories.includes(extracted.subcategory)) {
      extracted.subcategory = 'general';
    }
    
    return extracted;
    
  } catch (error) {
    console.error('❌ Knowledge extraction error:', error);
    return null;
  }
}

// Check for duplicate knowledge
async function isDuplicateKnowledge(topic: string, keywords: string[]): Promise<boolean> {
  try {
    const existing = await db.select({
      id: knowledgeBase.id,
      topic: knowledgeBase.topic,
      keywords: knowledgeBase.keywords,
    }).from(knowledgeBase);
    
    for (const kb of existing) {
      // Check topic similarity
      const topicLower = topic.toLowerCase();
      const existingTopicLower = kb.topic.toLowerCase();
      
      if (topicLower === existingTopicLower) {
        return true;
      }
      
      // Check keyword overlap (70%+)
      const existingKeywords = new Set(kb.keywords.map((k: string) => k.toLowerCase()));
      const newKeywords = keywords.map(k => k.toLowerCase());
      let matches = 0;
      
      for (const kw of newKeywords) {
        if (existingKeywords.has(kw)) matches++;
      }
      
      const overlap = matches / Math.max(newKeywords.length, 1);
      if (overlap >= 0.7) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return false;
  }
}

// Main function: Process conversation and save as pending knowledge
export async function processConversationForKnowledge(context: ConversationContext): Promise<{ saved: boolean; reason?: string }> {
  const { mode, sessionId } = context;
  
  // Check rate limit
  if (sessionId && !canExtract(sessionId)) {
    return { saved: false, reason: 'Rate limit exceeded' };
  }
  
  // Check if conversation is worthy
  const worthiness = isConversationWorthy(context);
  if (!worthiness.worthy) {
    return { saved: false, reason: worthiness.reason };
  }
  
  // Extract knowledge using AI
  console.log('🧠 Extracting knowledge from conversation...');
  const extracted = await extractKnowledge(context);
  
  if (!extracted) {
    return { saved: false, reason: 'Extraction failed' };
  }
  
  // Skip if confidence is too low
  if (extracted.confidenceScore < 0.5) {
    return { saved: false, reason: `Low confidence: ${extracted.confidenceScore}` };
  }
  
  // Check for duplicates
  const isDupe = await isDuplicateKnowledge(extracted.topic, extracted.keywords);
  if (isDupe) {
    return { saved: false, reason: 'Similar knowledge already exists' };
  }
  
  // Save to database as pending
  try {
    await db.insert(knowledgeBase).values({
      topic: extracted.topic,
      narrative: extracted.narrative,
      keywords: extracted.keywords,
      category: extracted.category,
      subcategory: extracted.subcategory,
      sourceQuestion: context.question.substring(0, 500),
      sourceSession: sessionId,
      confidenceScore: extracted.confidenceScore,
      status: 'pending',
    });
    
    if (sessionId) {
      incrementExtractionCount(sessionId);
    }
    
    console.log(`✅ Knowledge saved for review: "${extracted.topic}" (${extracted.confidenceScore})`);
    return { saved: true };
    
  } catch (error) {
    console.error('Error saving knowledge:', error);
    return { saved: false, reason: 'Database error' };
  }
}

// Get pending knowledge for admin review
export async function getPendingKnowledge(): Promise<any[]> {
  try {
    const pending = await db.select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.status, 'pending'))
      .orderBy(sql`${knowledgeBase.createdAt} DESC`);
    
    return pending;
  } catch (error) {
    console.error('Error getting pending knowledge:', error);
    return [];
  }
}

// Approve knowledge
export async function approveKnowledge(id: string, adminId: string, editedNarrative?: string): Promise<boolean> {
  try {
    const updates: any = {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date(),
    };
    
    if (editedNarrative) {
      updates.narrative = editedNarrative;
    }
    
    await db.update(knowledgeBase)
      .set(updates)
      .where(eq(knowledgeBase.id, id));
    
    return true;
  } catch (error) {
    console.error('Error approving knowledge:', error);
    return false;
  }
}

// Reject knowledge
export async function rejectKnowledge(id: string, reason: string): Promise<boolean> {
  try {
    await db.update(knowledgeBase)
      .set({
        status: 'rejected',
        rejectionReason: reason,
      })
      .where(eq(knowledgeBase.id, id));
    
    return true;
  } catch (error) {
    console.error('Error rejecting knowledge:', error);
    return false;
  }
}

// Find matching knowledge for a question
export async function findMatchingKnowledge(question: string, mode: string): Promise<{ found: boolean; knowledge?: any }> {
  try {
    // Extract keywords from question
    const questionLower = question.toLowerCase();
    const words = questionLower.split(/\s+/).filter(w => w.length > 2);
    
    // Get all approved knowledge for this mode
    const approved = await db.select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.status, 'approved'));
    
    let bestMatch: { knowledge: any; score: number } | null = null;
    
    for (const kb of approved) {
      // Skip if different category (unless cross-domain is relevant)
      if (kb.category !== mode && kb.category !== 'general') continue;
      
      // Calculate match score based on keywords
      const kbKeywordsArray = kb.keywords.map((k: string) => k.toLowerCase());
      const kbKeywordsSet = new Set(kbKeywordsArray);
      let score = 0;
      
      for (const word of words) {
        if (kbKeywordsSet.has(word)) {
          score += 2; // Exact match
        } else {
          // Partial match
          for (const kw of kbKeywordsArray) {
            if (word.includes(kw) || kw.includes(word)) {
              score += 1;
              break;
            }
          }
        }
      }
      
      // Also check topic match
      const topicWords = kb.topic.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (topicWords.some((tw: string) => tw.includes(word) || word.includes(tw))) {
          score += 1.5;
        }
      }
      
      // Normalize by question length
      const normalizedScore = score / Math.max(words.length, 1);
      
      if (normalizedScore > 0.3 && (!bestMatch || normalizedScore > bestMatch.score)) {
        bestMatch = { knowledge: kb, score: normalizedScore };
      }
    }
    
    if (bestMatch) {
      // Update use count
      await db.update(knowledgeBase)
        .set({
          useCount: sql`${knowledgeBase.useCount} + 1`,
          lastUsedAt: new Date(),
        })
        .where(eq(knowledgeBase.id, bestMatch.knowledge.id));
      
      console.log(`📚 Found matching knowledge: "${bestMatch.knowledge.topic}" (score: ${bestMatch.score.toFixed(2)})`);
      return { found: true, knowledge: bestMatch.knowledge };
    }
    
    return { found: false };
    
  } catch (error) {
    console.error('Error finding matching knowledge:', error);
    return { found: false };
  }
}

// Rate knowledge (user feedback)
export async function rateKnowledge(id: string, helpful: boolean): Promise<boolean> {
  try {
    if (helpful) {
      await db.update(knowledgeBase)
        .set({ helpfulCount: sql`${knowledgeBase.helpfulCount} + 1` })
        .where(eq(knowledgeBase.id, id));
    } else {
      await db.update(knowledgeBase)
        .set({ notHelpfulCount: sql`${knowledgeBase.notHelpfulCount} + 1` })
        .where(eq(knowledgeBase.id, id));
    }
    return true;
  } catch (error) {
    console.error('Error rating knowledge:', error);
    return false;
  }
}

// Get all knowledge for admin panel
export async function getAllKnowledge(status?: string): Promise<any[]> {
  try {
    if (status) {
      return await db.select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.status, status))
        .orderBy(sql`${knowledgeBase.createdAt} DESC`);
    }
    
    return await db.select()
      .from(knowledgeBase)
      .orderBy(sql`${knowledgeBase.createdAt} DESC`);
  } catch (error) {
    console.error('Error getting all knowledge:', error);
    return [];
  }
}

// Delete knowledge
export async function deleteKnowledge(id: string): Promise<boolean> {
  try {
    await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting knowledge:', error);
    return false;
  }
}

// Update knowledge
export async function updateKnowledge(id: string, updates: { topic?: string; narrative?: string; keywords?: string[]; subcategory?: string }): Promise<boolean> {
  try {
    await db.update(knowledgeBase)
      .set(updates)
      .where(eq(knowledgeBase.id, id));
    return true;
  } catch (error) {
    console.error('Error updating knowledge:', error);
    return false;
  }
}
