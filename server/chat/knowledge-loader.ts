import * as fs from 'fs';
import * as path from 'path';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'attached_assets');

const PRIORITY_FILES = [
  'bias_master_reality_tik_tok_v_3_3',
  'BIAS_Creator_Intelligence_Core',
  'BIAS_VoiceEmotion_Core',
  'BIAS_Full_Core',
  'BMIL_Ethics',
  'ESI_EthicalSensitivity',
  'NLP_Storytelling',
  'MarketingPitch',
  'Leadership',
  'PublicSpeaking',
  'TeamBuilding',
];

let cachedKnowledge: string | null = null;

export function loadKnowledgeBase(): string {
  if (cachedKnowledge) {
    return cachedKnowledge;
  }

  try {
    const files = fs.readdirSync(KNOWLEDGE_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const knowledgeParts: string[] = [];
    const loadedFiles: string[] = [];

    for (const priorityName of PRIORITY_FILES) {
      const matchingFile = mdFiles.find(f => f.includes(priorityName));
      if (matchingFile) {
        try {
          const filePath = path.join(KNOWLEDGE_DIR, matchingFile);
          const content = fs.readFileSync(filePath, 'utf-8');
          const condensed = condenseContent(content, matchingFile);
          if (condensed) {
            knowledgeParts.push(condensed);
            loadedFiles.push(matchingFile);
          }
        } catch (err) {
          console.error(`Failed to read ${matchingFile}:`, err);
        }
      }
    }

    cachedKnowledge = knowledgeParts.join('\n\n---\n\n');
    console.log(`📚 Loaded ${loadedFiles.length} knowledge files`);
    return cachedKnowledge;

  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return '';
  }
}

function condenseContent(content: string, filename: string): string {
  const lines = content.split('\n');
  const importantLines: string[] = [];
  
  let currentSection = '';
  let skipSection = false;
  
  for (const line of lines) {
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      currentSection = line;
      skipSection = false;
      
      if (line.toLowerCase().includes('changelog') || 
          line.toLowerCase().includes('meta') ||
          line.toLowerCase().includes('integration note') ||
          line.toLowerCase().includes('footer')) {
        skipSection = true;
      }
      
      if (!skipSection) {
        importantLines.push(line);
      }
    } else if (!skipSection) {
      if (line.includes('|') && line.includes('---')) {
        continue;
      }
      if (line.startsWith('|') || 
          line.includes('✅') || line.includes('❌') || line.includes('⚠️') ||
          line.includes('💡') || line.includes('🎯') ||
          line.includes('Example') || line.includes('Contoh') ||
          line.includes('Tip') || line.includes('Insight') ||
          line.trim().startsWith('-') || line.trim().startsWith('•')) {
        importantLines.push(line);
      }
    }
  }

  const condensed = importantLines.join('\n').trim();
  
  if (condensed.length > 3000) {
    return condensed.slice(0, 3000) + '\n... [condensed]';
  }
  
  return condensed;
}

export function getRelevantKnowledge(topic: string): string {
  const knowledge = loadKnowledgeBase();
  
  const topicLower = topic.toLowerCase();
  const keywords: { [key: string]: string[] } = {
    'fyp': ['FYP', 'For You', 'algoritma', 'viral', 'reach'],
    'shadowban': ['shadowban', 'pelanggaran', 'visibilitas', 'banned'],
    'live': ['Live', 'streaming', 'gift', 'interaksi'],
    'hook': ['Hook', '3 detik', 'pembuka', 'retention'],
    'agency': ['agency', 'agensi', 'monetisasi', 'brand deal'],
    'engagement': ['engagement', 'like', 'comment', 'share'],
    'followers': ['follower', 'growth', 'pertumbuhan'],
    'content': ['konten', 'video', 'posting', 'upload'],
    'ethics': ['etika', 'ethics', 'BMIL', 'ESI', 'community guidelines'],
    'voice': ['suara', 'voice', 'tone', 'VPL', 'pacing'],
    'emotion': ['emosi', 'emotion', 'EPM', 'empati'],
    'visual': ['visual', 'VBM', 'gesture', 'framing', 'ekspresi'],
  };

  const relevantSections: string[] = [];
  
  for (const [category, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(kw => topicLower.includes(kw.toLowerCase()))) {
      const sections = extractSectionsWithKeywords(knowledge, keywordList);
      relevantSections.push(...sections);
    }
  }

  if (relevantSections.length === 0) {
    return knowledge.slice(0, 4000);
  }

  const combined = relevantSections.join('\n\n');
  return combined.slice(0, 6000);
}

function extractSectionsWithKeywords(knowledge: string, keywords: string[]): string[] {
  const sections: string[] = [];
  const lines = knowledge.split('\n');
  
  let currentSection: string[] = [];
  let includeSection = false;
  
  for (const line of lines) {
    if (line.startsWith('#') || line === '---') {
      if (includeSection && currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
      }
      currentSection = [line];
      includeSection = false;
    } else {
      currentSection.push(line);
      if (keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()))) {
        includeSection = true;
      }
    }
  }
  
  if (includeSection && currentSection.length > 0) {
    sections.push(currentSection.join('\n'));
  }
  
  return sections;
}
