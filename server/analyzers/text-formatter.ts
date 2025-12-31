/**
 * Text Formatter - Converts informal analyzer output to formal, concise format
 * Replaces "lo" with formal Indonesian, shortens verbose messages
 */

/**
 * Simplifies and formalizes diagnosis text
 * - Replaces "lo" with "Anda" (formal) or removes it
 * - Shortens long diagnosis to 1-2 sentences
 * - Removes score mentions from text (will be shown separately)
 */
export function simplifyDiagnosis(text: string): string {
  // Step 1: Remove ALL emoji (NO emoji allowed per user requirement)
  let result = text;
  result = result.replace(/[\u1F300-\u1F9FF]|[\u2600-\u26FF]|[\u2700-\u27BF]/g, '');
  
  // Step 2: Replace "lo" with formal alternatives
  result = result.replace(/\blo\b/gi, 'Anda');
  result = result.replace(/\bLo\b/g, 'Anda');
  
  // Replace informal phrases
  result = result.replace(/udah/gi, 'sudah');
  result = result.replace(/gak/gi, 'tidak');
  result = result.replace(/aja/gi, 'saja');
  result = result.replace(/emang/gi, 'memang');
  result = result.replace(/banget/gi, 'sangat');
  result = result.replace(/kalo/gi, 'kalau');
  result = result.replace(/gimana/gi, 'bagaimana');
  result = result.replace(/kayak/gi, 'seperti');
  result = result.replace(/pake/gi, 'pakai');
  result = result.replace(/bisa/gi, 'dapat');
  
  // Step 3: Extract only the main message (remove score mentions)
  // Remove patterns like (X/100), **X/100**, etc
  result = result.replace(/\*\*?\d+\/\d+\*\*?/g, '');
  result = result.replace(/\(\d+\/\d+\)/g, '');
  
  // Step 4: Get first sentence only (shortest, most concise)
  const sentences = result.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length > 0) {
    result = sentences[0].trim();
  }
  
  // Step 5: Remove excessive punctuation and formatting
  result = result.replace(/\*\*/g, ''); // Remove bold markers
  result = result.replace(/\s+/g, ' '); // Normalize whitespace
  result = result.trim();
  
  // Step 6: Capitalize first letter
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  // Step 7: Ensure it ends with period
  if (result && !result.match(/[.!?]$/)) {
    result += '.';
  }
  
  return result;
}

/**
 * Simplifies layer feedback to ultra-concise format
 * Example: "Perlu optimize profile & thumbnails"
 */
export function ultraConciseFeedback(diagnosis: string, score: number): string {
  const simplified = simplifyDiagnosis(diagnosis);
  
  // If score is low, prefix with action needed
  if (score < 50) {
    if (!simplified.match(/^(Perlu|Harus|Tingkatkan|Perbaiki|Optimize)/i)) {
      return `Perlu perbaikan - ${simplified.toLowerCase()}`;
    }
  }
  
  // Keep concise (max 60 chars)
  if (simplified.length > 60) {
    return simplified.substring(0, 57) + '...';
  }
  
  return simplified;
}
