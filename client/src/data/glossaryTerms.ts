export interface GlossaryTerm {
  term: string;
  termId: string;
  definition: string;
  definitionId: string;
  category: string;
  source: 'bias' | 'tiktok' | 'marketing';
  examples?: string[];
  examplesId?: string[];
}

export const biasTerms: GlossaryTerm[] = [
  {
    term: 'VBM (Visual Behavior Mapping)',
    termId: 'VBM (Visual Behavior Mapping)',
    definition: 'Analysis of body language, facial expressions, gestures, and visual presentation in communication',
    definitionId: 'Analisis bahasa tubuh, ekspresi wajah, gestur, dan presentasi visual dalam komunikasi',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'EPM (Emotional Processing Matrix)',
    termId: 'EPM (Emotional Processing Matrix)',
    definition: 'Evaluation of emotional intelligence, empathy, and emotional regulation in communication',
    definitionId: 'Evaluasi kecerdasan emosional, empati, dan regulasi emosi dalam komunikasi',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'NLP (Narrative Logic Patterns)',
    termId: 'NLP (Narrative Logic Patterns)',
    definition: 'Assessment of storytelling structure, message clarity, and logical flow',
    definitionId: 'Penilaian struktur cerita, kejelasan pesan, dan alur logis',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'ETH (Ethical Compliance)',
    termId: 'ETH (Ethical Compliance)',
    definition: 'Review of content ethics, community guidelines adherence, and social responsibility',
    definitionId: 'Review etika konten, kepatuhan terhadap pedoman komunitas, dan tanggung jawab sosial',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'ECO (Ecosystem Awareness)',
    termId: 'ECO (Ecosystem Awareness)',
    definition: 'Understanding of platform algorithms, trends, and audience behavior',
    definitionId: 'Pemahaman algoritma platform, tren, dan perilaku audiens',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'SOC (Social Dynamics)',
    termId: 'SOC (Social Dynamics)',
    definition: 'Analysis of community building, engagement patterns, and social influence',
    definitionId: 'Analisis pembangunan komunitas, pola engagement, dan pengaruh sosial',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'COG (Cognitive Impact)',
    termId: 'COG (Cognitive Impact)',
    definition: 'Evaluation of educational value, thought provocation, and intellectual engagement',
    definitionId: 'Evaluasi nilai edukatif, provokasi pemikiran, dan keterlibatan intelektual',
    category: 'BIAS Layer',
    source: 'bias',
  },
  {
    term: 'BMIL (Brand & Marketing Intelligence)',
    termId: 'BMIL (Brand & Marketing Intelligence)',
    definition: 'Assessment of personal branding, marketing effectiveness, and commercial strategy',
    definitionId: 'Penilaian personal branding, efektivitas marketing, dan strategi komersial',
    category: 'BIAS Layer',
    source: 'bias',
  },
];

export const tiktokTerms: GlossaryTerm[] = [
  {
    term: 'FYP (For You Page)',
    termId: 'FYP (For You Page)',
    definition: 'TikTok main feed powered by algorithm that shows personalized content',
    definitionId: 'Feed utama TikTok yang didukung algoritma untuk menampilkan konten personal',
    category: 'Platform Feature',
    source: 'tiktok',
  },
  {
    term: 'Hook',
    termId: 'Hook',
    definition: 'First 1-3 seconds of video designed to grab attention and prevent scrolling',
    definitionId: '1-3 detik pertama video untuk menarik perhatian dan mencegah scroll',
    category: 'Content Strategy',
    source: 'tiktok',
  },
  {
    term: 'Engagement Rate',
    termId: 'Engagement Rate',
    definition: '(Likes + Comments + Shares) / Views × 100. Measures audience interaction quality',
    definitionId: '(Likes + Komentar + Share) / Views × 100. Mengukur kualitas interaksi audiens',
    category: 'Metric',
    source: 'tiktok',
  },
  {
    term: 'Shadowban',
    termId: 'Shadowban',
    definition: 'Unofficial penalty where content reach is limited without notification to creator',
    definitionId: 'Penalti tidak resmi di mana jangkauan konten dibatasi tanpa pemberitahuan ke creator',
    category: 'Platform Issue',
    source: 'tiktok',
  },
  {
    term: 'Watch Time',
    termId: 'Watch Time',
    definition: 'Average duration viewers watch your video. Key signal for TikTok algorithm',
    definitionId: 'Durasi rata-rata penonton menonton video. Sinyal kunci algoritma TikTok',
    category: 'Metric',
    source: 'tiktok',
  },
  {
    term: 'Duet',
    termId: 'Duet',
    definition: 'Feature allowing creators to respond to videos side-by-side with original content',
    definitionId: 'Fitur yang memungkinkan creator merespons video berdampingan dengan konten asli',
    category: 'Platform Feature',
    source: 'tiktok',
  },
  {
    term: 'Stitch',
    termId: 'Stitch',
    definition: 'Feature to incorporate up to 5 seconds of another video into your own',
    definitionId: 'Fitur untuk memasukkan hingga 5 detik video lain ke dalam video kamu',
    category: 'Platform Feature',
    source: 'tiktok',
  },
  {
    term: 'Trending / Viral',
    termId: 'Trending / Viral',
    definition: 'Content experiencing rapid growth in views, shares, and engagement',
    definitionId: 'Konten yang mengalami pertumbuhan cepat dalam views, shares, dan engagement',
    category: 'Content Strategy',
    source: 'tiktok',
  },
  {
    term: 'Algorithm',
    termId: 'Algorithm / Algoritma',
    definition: 'System determining which content appears on users For You Page based on behavior',
    definitionId: 'Sistem yang menentukan konten mana yang muncul di For You Page berdasarkan perilaku user',
    category: 'Platform Feature',
    source: 'tiktok',
  },
  {
    term: 'TikTok Shop',
    termId: 'TikTok Shop',
    definition: 'E-commerce feature allowing creators to sell products directly through TikTok',
    definitionId: 'Fitur e-commerce yang memungkinkan creator menjual produk langsung melalui TikTok',
    category: 'Monetization',
    source: 'tiktok',
  },
  {
    term: 'Creator Fund',
    termId: 'Creator Fund',
    definition: 'Monetization program paying creators based on video views and engagement',
    definitionId: 'Program monetisasi yang membayar creator berdasarkan views dan engagement video',
    category: 'Monetization',
    source: 'tiktok',
  },
  {
    term: 'Live Streaming',
    termId: 'Live Streaming',
    definition: 'Real-time broadcasting to viewers who can send gifts and interact via chat',
    definitionId: 'Siaran langsung ke penonton yang bisa mengirim gift dan berinteraksi via chat',
    category: 'Platform Feature',
    source: 'tiktok',
  },
];

export const marketingTerms: GlossaryTerm[] = [
  {
    term: 'Call-to-Action (CTA)',
    termId: 'Call-to-Action (CTA)',
    definition: 'A prompt encouraging audience to take specific action like buy, subscribe, or click',
    definitionId: 'Ajakan mendorong audiens melakukan tindakan spesifik seperti beli, subscribe, atau klik',
    category: 'Marketing Fundamental',
    source: 'marketing',
  },
  {
    term: 'Copywriting',
    termId: 'Copywriting',
    definition: 'The art of writing persuasive text to drive sales or engagement',
    definitionId: 'Seni menulis teks persuasif untuk mendorong penjualan atau engagement',
    category: 'Marketing Skill',
    source: 'marketing',
  },
  {
    term: 'Conversion Rate',
    termId: 'Conversion Rate',
    definition: 'Percentage of audience who complete desired action after viewing content',
    definitionId: 'Persentase audiens yang menyelesaikan tindakan yang diinginkan setelah melihat konten',
    category: 'Metric',
    source: 'marketing',
  },
  {
    term: 'Objection Handling',
    termId: 'Objection Handling',
    definition: 'Techniques to address customer concerns and resistance during sales process',
    definitionId: 'Teknik untuk mengatasi kekhawatiran dan resistensi pelanggan selama proses penjualan',
    category: 'Sales Technique',
    source: 'marketing',
  },
  {
    term: 'Cold Call',
    termId: 'Cold Call',
    definition: 'Unsolicited call to potential customer who has no prior relationship with seller',
    definitionId: 'Panggilan tak terduga ke calon pelanggan yang tidak memiliki hubungan sebelumnya dengan penjual',
    category: 'Sales Technique',
    source: 'marketing',
  },
  {
    term: 'Sales Pitch',
    termId: 'Sales Pitch',
    definition: 'Prepared presentation designed to persuade potential customers to buy product or service',
    definitionId: 'Presentasi yang disiapkan untuk meyakinkan calon pelanggan membeli produk atau layanan',
    category: 'Sales Technique',
    source: 'marketing',
  },
  {
    term: 'Closing',
    termId: 'Closing',
    definition: 'Final stage of sales process where deal is finalized and customer commits to purchase',
    definitionId: 'Tahap akhir proses penjualan di mana kesepakatan tercapai dan pelanggan berkomitmen membeli',
    category: 'Sales Technique',
    source: 'marketing',
  },
  {
    term: 'Lead Generation',
    termId: 'Lead Generation',
    definition: 'Process of attracting and converting strangers into potential customers',
    definitionId: 'Proses menarik dan mengubah orang asing menjadi calon pelanggan potensial',
    category: 'Marketing Strategy',
    source: 'marketing',
  },
];

export const allGlossaryTerms: GlossaryTerm[] = [
  ...biasTerms,
  ...tiktokTerms,
  ...marketingTerms,
];

export function searchGlossary(query: string): GlossaryTerm[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return allGlossaryTerms.filter(term =>
    term.term.toLowerCase().includes(q) ||
    term.termId.toLowerCase().includes(q) ||
    term.definition.toLowerCase().includes(q) ||
    term.definitionId.toLowerCase().includes(q) ||
    term.category.toLowerCase().includes(q)
  );
}
