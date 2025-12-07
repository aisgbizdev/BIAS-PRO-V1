import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Search, BookOpen, TrendingUp, Shield, AlertCircle, CheckCircle, Heart, ShoppingCart, X, Check, Ban, BarChart3, Palette, Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff, Megaphone } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { TIKTOK_RULES, type PlatformRule } from '@/data/platformRules';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

interface GlossaryTerm {
  term: string;
  termId: string;
  definition: string;
  definitionId: string;
  category: string;
  examples?: string[];
  examplesId?: string[];
  contributor?: string; // Community contributor username
}

const biasTerms: GlossaryTerm[] = [
  {
    term: 'VBM (Visual Behavior Mapping)',
    termId: 'VBM (Visual Behavior Mapping)',
    definition: 'Analysis of body language, facial expressions, gestures, and visual presentation in communication',
    definitionId: 'Analisis bahasa tubuh, ekspresi wajah, gestur, dan presentasi visual dalam komunikasi',
    category: 'BIAS Layer',
    examples: ['Eye contact patterns', 'Hand gestures while speaking', 'Posture and positioning'],
    examplesId: ['Pola kontak mata', 'Gerakan tangan saat bicara', 'Postur dan posisi tubuh'],
  },
  {
    term: 'EPM (Emotional Processing Matrix)',
    termId: 'EPM (Emotional Processing Matrix)',
    definition: 'Evaluation of emotional intelligence, empathy, and emotional regulation in communication',
    definitionId: 'Evaluasi kecerdasan emosional, empati, dan regulasi emosi dalam komunikasi',
    category: 'BIAS Layer',
    examples: ['Tone of voice', 'Emotional authenticity', 'Response to criticism'],
    examplesId: ['Nada bicara', 'Keaslian emosi', 'Respons terhadap kritik'],
  },
  {
    term: 'NLP (Narrative Logic Patterns)',
    termId: 'NLP (Narrative Logic Patterns)',
    definition: 'Assessment of storytelling structure, message clarity, and logical flow',
    definitionId: 'Penilaian struktur cerita, kejelasan pesan, dan alur logis',
    category: 'BIAS Layer',
    examples: ['Hook-content-CTA structure', 'Story arc', 'Message coherence'],
    examplesId: ['Struktur hook-konten-CTA', 'Alur cerita', 'Koherensi pesan'],
  },
  {
    term: 'ETH (Ethical Compliance)',
    termId: 'ETH (Ethical Compliance)',
    definition: 'Review of content ethics, community guidelines adherence, and social responsibility',
    definitionId: 'Review etika konten, kepatuhan terhadap pedoman komunitas, dan tanggung jawab sosial',
    category: 'BIAS Layer',
    examples: ['No hate speech', 'No misinformation', 'Respectful messaging'],
    examplesId: ['Tidak ada ujaran kebencian', 'Tidak ada misinformasi', 'Pesan yang sopan'],
  },
  {
    term: 'ECO (Ecosystem Awareness)',
    termId: 'ECO (Ecosystem Awareness)',
    definition: 'Understanding of platform algorithms, trends, and audience behavior',
    definitionId: 'Pemahaman algoritma platform, tren, dan perilaku audiens',
    category: 'BIAS Layer',
    examples: ['Platform-specific best practices', 'Trend participation', 'Hashtag strategy'],
    examplesId: ['Best practice platform tertentu', 'Partisipasi tren', 'Strategi hashtag'],
  },
  {
    term: 'SOC (Social Dynamics)',
    termId: 'SOC (Social Dynamics)',
    definition: 'Analysis of community building, engagement patterns, and social influence',
    definitionId: 'Analisis pembangunan komunitas, pola engagement, dan pengaruh sosial',
    category: 'BIAS Layer',
    examples: ['Reply rate', 'Community interaction', 'Influence on followers'],
    examplesId: ['Tingkat balasan', 'Interaksi komunitas', 'Pengaruh pada followers'],
  },
  {
    term: 'COG (Cognitive Impact)',
    termId: 'COG (Cognitive Impact)',
    definition: 'Evaluation of educational value, thought provocation, and intellectual engagement',
    definitionId: 'Evaluasi nilai edukatif, provokasi pemikiran, dan keterlibatan intelektual',
    category: 'BIAS Layer',
    examples: ['Teaches new skill', 'Challenges assumptions', 'Provides insights'],
    examplesId: ['Mengajarkan skill baru', 'Menantang asumsi', 'Memberikan wawasan'],
  },
  {
    term: 'BMIL (Brand & Marketing Intelligence)',
    termId: 'BMIL (Brand & Marketing Intelligence)',
    definition: 'Assessment of personal branding, marketing effectiveness, and commercial strategy',
    definitionId: 'Penilaian personal branding, efektivitas marketing, dan strategi komersial',
    category: 'BIAS Layer',
    examples: ['Consistent brand voice', 'Clear value proposition', 'Call-to-action effectiveness'],
    examplesId: ['Suara brand yang konsisten', 'Proposisi nilai yang jelas', 'Efektivitas call-to-action'],
  },
  {
    term: 'Behavioral Intelligence',
    termId: 'Behavioral Intelligence',
    definition: 'The science of understanding and analyzing human communication patterns, behaviors, and psychological triggers',
    definitionId: 'Ilmu memahami dan menganalisis pola komunikasi manusia, perilaku, dan trigger psikologis',
    category: 'Core Concept',
  },
  {
    term: 'Creator Mode',
    termId: 'Creator Mode',
    definition: 'BIAS analysis mode focused on content creators, influencers, and social media personalities',
    definitionId: 'Mode analisis BIAS yang fokus pada content creator, influencer, dan personalitas media sosial',
    category: 'Analysis Mode',
  },
  {
    term: 'Academic Mode',
    termId: 'Academic Mode',
    definition: 'BIAS analysis mode for professional communication, leadership, and team dynamics',
    definitionId: 'Mode analisis BIAS untuk komunikasi profesional, kepemimpinan, dan dinamika tim',
    category: 'Analysis Mode',
  },
  {
    term: 'Hybrid Mode',
    termId: 'Hybrid Mode',
    definition: 'Combined BIAS analysis using both creator and academic frameworks',
    definitionId: 'Analisis BIAS gabungan menggunakan framework creator dan akademik',
    category: 'Analysis Mode',
  },
];

const tiktokTerms: GlossaryTerm[] = [
  {
    term: 'FYP (For You Page)',
    termId: 'FYP (For You Page)',
    definition: 'TikTok main feed powered by algorithm that shows personalized content',
    definitionId: 'Feed utama TikTok yang didukung algoritma untuk menampilkan konten personal',
    category: 'Platform Feature',
  },
  {
    term: 'FYF (For Your Feed)',
    termId: 'FYF (For Your Feed)',
    definition: 'Content eligible for algorithmic distribution to wider audience on For You Page',
    definitionId: 'Konten yang memenuhi syarat untuk distribusi algoritma ke audiens lebih luas di For You Page',
    category: 'Platform Feature',
  },
  {
    term: 'PK (Player Kill / Battle)',
    termId: 'PK (Player Kill / Battle)',
    definition: 'Live battle feature where two creators compete for gifts from viewers in real-time',
    definitionId: 'Fitur live battle di mana dua creator berkompetisi untuk mendapat gift dari penonton secara real-time',
    category: 'Live Feature',
    examples: ['PK vs creator lain', 'Menang PK dapat hadiah', 'Strategi PK untuk engagement tinggi'],
    examplesId: ['PK vs creator lain', 'Menang PK dapat hadiah', 'Strategi PK untuk engagement tinggi'],
  },
  {
    term: 'Multi Guest',
    termId: 'Multi Guest',
    definition: 'Feature allowing multiple viewers or creators to join live stream simultaneously',
    definitionId: 'Fitur yang memungkinkan beberapa penonton atau creator bergabung ke live stream bersamaan',
    category: 'Live Feature',
    examples: ['Live multi guest bersama fans', 'Kolaborasi multi guest creator', 'Sesi tanya jawab multi guest'],
    examplesId: ['Live multi guest bersama fans', 'Kolaborasi multi guest creator', 'Sesi tanya jawab multi guest'],
  },
  {
    term: 'Gifter',
    termId: 'Gifter',
    definition: 'Viewers who send virtual gifts to creators during live streams, supporting them financially',
    definitionId: 'Penonton yang mengirim gift virtual ke creator saat live, mendukung mereka secara finansial',
    category: 'Live Feature',
    examples: ['Top gifter minggu ini', 'Ucapan terima kasih untuk gifter', 'Reward khusus untuk gifter setia'],
    examplesId: ['Top gifter minggu ini', 'Ucapan terima kasih untuk gifter', 'Reward khusus untuk gifter setia'],
  },
  {
    term: 'Podium',
    termId: 'Podium',
    definition: 'Ranking display showing top 3 gift givers during live stream',
    definitionId: 'Tampilan ranking yang menunjukkan 3 pemberi gift teratas saat live stream',
    category: 'Live Feature',
    examples: ['Naik ke podium 1', 'Bersaing untuk podium', 'Hadiah untuk yang di podium'],
    examplesId: ['Naik ke podium 1', 'Bersaing untuk podium', 'Hadiah untuk yang di podium'],
  },
  {
    term: 'Mutualan / Mutuals',
    termId: 'Mutualan / Mutuals',
    definition: 'Practice of following each other back to grow follower count mutually',
    definitionId: 'Praktik saling follow untuk menambah jumlah follower secara bersama-sama',
    category: 'Growth Strategy',
    examples: ['Yuk mutualan', 'F4F (Follow for Follow)', 'Mutualan aktif komen'],
    examplesId: ['Yuk mutualan', 'F4F (Follow for Follow)', 'Mutualan aktif komen'],
  },
  {
    term: 'Shadowban',
    termId: 'Shadowban',
    definition: 'Unofficial penalty where content reach is limited without notification to creator',
    definitionId: 'Penalti tidak resmi di mana jangkauan konten dibatasi tanpa pemberitahuan ke creator',
    category: 'Platform Issue',
    examples: ['Video kena shadowban', 'FYP views turun drastis', 'Cek apakah ter-shadowban'],
    examplesId: ['Video kena shadowban', 'FYP views turun drastis', 'Cek apakah ter-shadowban'],
  },
  {
    term: 'Engagement Rate',
    termId: 'Engagement Rate',
    definition: '(Likes + Comments + Shares) / Views × 100. Measures audience interaction quality',
    definitionId: '(Likes + Komentar + Share) / Views × 100. Mengukur kualitas interaksi audiens',
    category: 'Metric',
  },
  {
    term: 'Viral Potential',
    termId: 'Viral Potential',
    definition: 'Likelihood of content spreading rapidly based on early engagement signals',
    definitionId: 'Kemungkinan konten menyebar cepat berdasarkan sinyal engagement awal',
    category: 'Metric',
  },
  {
    term: 'Hook',
    termId: 'Hook',
    definition: 'First 1-3 seconds of video designed to grab attention and prevent scrolling',
    definitionId: '1-3 detik pertama video untuk menarik perhatian dan mencegah scroll',
    category: 'Content Strategy',
    examples: ['Viral hook: "Wait for it..."', 'Hook dengan pertanyaan provokatif', 'Visual hook yang menarik'],
    examplesId: ['Hook viral: "Tunggu dulu..."', 'Hook dengan pertanyaan provokatif', 'Hook visual yang menarik'],
  },
  {
    term: 'Watch Time',
    termId: 'Watch Time',
    definition: 'Average duration viewers watch your video. Key signal for TikTok algorithm',
    definitionId: 'Durasi rata-rata penonton menonton video. Sinyal kunci algoritma TikTok',
    category: 'Metric',
  },
  {
    term: 'Duet',
    termId: 'Duet',
    definition: 'Feature allowing creators to respond to videos side-by-side with original content',
    definitionId: 'Fitur yang memungkinkan creator merespons video berdampingan dengan konten asli',
    category: 'Platform Feature',
    examples: ['Duet challenge viral', 'Duet reaction video', 'Duet kolaborasi creator'],
    examplesId: ['Duet challenge viral', 'Duet reaction video', 'Duet kolaborasi creator'],
  },
  {
    term: 'Stitch',
    termId: 'Stitch',
    definition: 'Feature to incorporate up to 5 seconds of another video into your own',
    definitionId: 'Fitur untuk memasukkan hingga 5 detik video lain ke dalam video kamu',
    category: 'Platform Feature',
    examples: ['Stitch untuk reaction', 'Stitch educational content', 'Stitch trending video'],
    examplesId: ['Stitch untuk reaksi', 'Stitch konten edukatif', 'Stitch video trending'],
  },
  {
    term: 'Sounds / Audio',
    termId: 'Sounds / Audio',
    definition: 'Audio tracks (music, voice, effects) that can be reused across videos',
    definitionId: 'Track audio (musik, suara, efek) yang bisa digunakan ulang di berbagai video',
    category: 'Content Element',
    examples: ['Trending sound meningkatkan FYP', 'Original sound untuk branding', 'Sound viral challenge'],
    examplesId: ['Sound trending tingkatkan FYP', 'Sound original untuk branding', 'Sound viral challenge'],
  },
  {
    term: 'Pelanggaran / Violation',
    termId: 'Pelanggaran / Violation',
    definition: 'Content that breaks TikTok Community Guidelines, resulting in removal or account penalties',
    definitionId: 'Konten yang melanggar Panduan Komunitas TikTok, mengakibatkan penghapusan atau penalti akun',
    category: 'Platform Issue',
    examples: ['Video dihapus karena pelanggaran', 'Warning pelanggaran konten', 'Banding pelanggaran'],
    examplesId: ['Video dihapus karena pelanggaran', 'Peringatan pelanggaran konten', 'Banding pelanggaran'],
  },
  {
    term: 'Creator Fund',
    termId: 'Creator Fund',
    definition: 'Monetization program paying creators based on video views and engagement',
    definitionId: 'Program monetisasi yang membayar creator berdasarkan views dan engagement video',
    category: 'Monetization',
    examples: ['Syarat Creator Fund', 'Penghasilan dari Creator Fund', 'Tips maksimalkan Creator Fund'],
    examplesId: ['Syarat Creator Fund', 'Penghasilan dari Creator Fund', 'Tips maksimalkan Creator Fund'],
  },
  {
    term: 'TikTok Shop',
    termId: 'TikTok Shop',
    definition: 'E-commerce feature allowing creators to sell products directly through TikTok',
    definitionId: 'Fitur e-commerce yang memungkinkan creator menjual produk langsung melalui TikTok',
    category: 'Monetization',
    examples: ['Jualan via TikTok Shop', 'Affiliate TikTok Shop', 'Live shopping TikTok Shop'],
    examplesId: ['Jualan via TikTok Shop', 'Affiliate TikTok Shop', 'Live shopping TikTok Shop'],
  },
  {
    term: 'Trending / Viral',
    termId: 'Trending / Viral',
    definition: 'Content experiencing rapid growth in views, shares, and engagement',
    definitionId: 'Konten yang mengalami pertumbuhan cepat dalam views, shares, dan engagement',
    category: 'Content Strategy',
    examples: ['Ikut trending challenge', 'Bikin konten viral', 'Strategi trending sound'],
    examplesId: ['Ikut trending challenge', 'Bikin konten viral', 'Strategi trending sound'],
  },
  {
    term: 'Algorithm',
    termId: 'Algorithm / Algoritma',
    definition: 'System determining which content appears on users For You Page based on behavior',
    definitionId: 'Sistem yang menentukan konten mana yang muncul di For You Page berdasarkan perilaku user',
    category: 'Platform Feature',
    examples: ['Pahami algoritma TikTok', 'Sinyal algoritma: watch time', 'Optimasi untuk algoritma'],
    examplesId: ['Pahami algoritma TikTok', 'Sinyal algoritma: watch time', 'Optimasi untuk algoritma'],
  },
  {
    term: 'Niche / Target Audience',
    termId: 'Niche / Target Audience',
    definition: 'Specific content category or audience segment that creator focuses on',
    definitionId: 'Kategori konten atau segmen audiens spesifik yang menjadi fokus creator',
    category: 'Content Strategy',
    examples: ['Temukan niche kamu', 'Konsisten dengan niche', 'Niche foodie, beauty, gaming'],
    examplesId: ['Temukan niche kamu', 'Konsisten dengan niche', 'Niche foodie, beauty, gaming'],
  },
  {
    term: 'Bio',
    termId: 'Bio',
    definition: 'Profile description introducing creator and linking to other platforms or products',
    definitionId: 'Deskripsi profil yang memperkenalkan creator dan link ke platform lain atau produk',
    category: 'Profile Element',
    examples: ['Bio menarik perhatian', 'Link di bio', 'CTA di bio'],
    examplesId: ['Bio menarik perhatian', 'Link di bio', 'CTA di bio'],
  },
  {
    term: 'Hashtag',
    termId: 'Hashtag',
    definition: 'Keywords prefixed with # used for content discovery and categorization',
    definitionId: 'Kata kunci dengan awalan # untuk penemuan dan kategorisasi konten',
    category: 'Content Element',
    examples: ['Hashtag trending', 'Mix hashtag besar & kecil', 'Branded hashtag challenge'],
    examplesId: ['Hashtag trending', 'Mix hashtag besar & kecil', 'Branded hashtag challenge'],
  },
];

const marketingTerms: GlossaryTerm[] = [
  {
    term: 'Call-to-Action (CTA)',
    termId: 'Call-to-Action (CTA)',
    definition: 'A prompt encouraging audience to take specific action like buy, subscribe, or click',
    definitionId: 'Ajakan mendorong audiens melakukan tindakan spesifik seperti beli, subscribe, atau klik',
    category: 'Marketing Fundamental',
    examples: ['Buy now', 'Subscribe for more', 'Click the link', 'Comment below'],
    examplesId: ['Beli sekarang', 'Subscribe untuk lebih banyak', 'Klik link', 'Komentar di bawah'],
  },
  {
    term: 'Copywriting',
    termId: 'Copywriting',
    definition: 'The art of writing persuasive text to drive sales or engagement',
    definitionId: 'Seni menulis teks persuasif untuk mendorong penjualan atau engagement',
    category: 'Marketing Skill',
    examples: ['Headlines', 'Sales pages', 'Email subject lines', 'Social captions'],
    examplesId: ['Headlines', 'Sales pages', 'Subject email', 'Caption sosmed'],
  },
  {
    term: 'Lead Magnet',
    termId: 'Lead Magnet',
    definition: 'Free valuable content offered in exchange for contact information',
    definitionId: 'Konten gratis berharga yang ditawarkan sebagai ganti informasi kontak',
    category: 'Marketing Strategy',
    examples: ['Free ebook', 'Webinar', 'Checklist', 'Templates'],
    examplesId: ['Ebook gratis', 'Webinar', 'Checklist', 'Template'],
  },
  {
    term: 'Sales Funnel',
    termId: 'Sales Funnel',
    definition: 'Customer journey stages from awareness to purchase decision',
    definitionId: 'Tahapan perjalanan pelanggan dari awareness hingga keputusan pembelian',
    category: 'Marketing Strategy',
    examples: ['TOFU (Top of Funnel)', 'MOFU (Middle)', 'BOFU (Bottom)', 'Conversion'],
    examplesId: ['TOFU (Atas Funnel)', 'MOFU (Tengah)', 'BOFU (Bawah)', 'Konversi'],
  },
  {
    term: 'AIDA Model',
    termId: 'AIDA Model',
    definition: 'Marketing framework: Attention, Interest, Desire, Action',
    definitionId: 'Framework marketing: Attention, Interest, Desire, Action',
    category: 'Marketing Framework',
    examples: ['Grab attention with hook', 'Build interest', 'Create desire', 'Drive action'],
    examplesId: ['Tarik perhatian dengan hook', 'Bangun interest', 'Ciptakan desire', 'Dorong action'],
  },
  {
    term: 'Unique Selling Proposition (USP)',
    termId: 'Unique Selling Proposition (USP)',
    definition: 'What makes your product/service different and better than competitors',
    definitionId: 'Apa yang membuat produk/jasa Anda berbeda dan lebih baik dari kompetitor',
    category: 'Marketing Fundamental',
    examples: ['Fastest delivery', 'Lowest price', 'Best quality', 'Exclusive features'],
    examplesId: ['Pengiriman tercepat', 'Harga termurah', 'Kualitas terbaik', 'Fitur eksklusif'],
  },
  {
    term: 'Elevator Pitch',
    termId: 'Elevator Pitch',
    definition: '30-60 second summary of who you are and what you offer',
    definitionId: 'Ringkasan 30-60 detik tentang siapa Anda dan apa yang Anda tawarkan',
    category: 'Public Speaking',
    examples: ['Problem you solve', 'Target audience', 'Unique solution', 'Call to action'],
    examplesId: ['Masalah yang diselesaikan', 'Target audiens', 'Solusi unik', 'Ajakan bertindak'],
  },
  {
    term: 'Body Language',
    termId: 'Body Language / Bahasa Tubuh',
    definition: 'Non-verbal communication through posture, gestures, and facial expressions',
    definitionId: 'Komunikasi non-verbal melalui postur, gestur, dan ekspresi wajah',
    category: 'Public Speaking',
    examples: ['Eye contact', 'Hand gestures', 'Open posture', 'Confident stance'],
    examplesId: ['Kontak mata', 'Gerakan tangan', 'Postur terbuka', 'Sikap percaya diri'],
  },
  {
    term: 'Storytelling',
    termId: 'Storytelling',
    definition: 'Using narrative structure to convey message and connect emotionally',
    definitionId: 'Menggunakan struktur naratif untuk menyampaikan pesan dan terhubung secara emosional',
    category: 'Communication Skill',
    examples: ['Hero journey', 'Before-after-bridge', 'Problem-agitate-solve', 'Case studies'],
    examplesId: ['Perjalanan hero', 'Before-after-bridge', 'Problem-agitate-solve', 'Studi kasus'],
  },
  {
    term: 'Objection Handling',
    termId: 'Objection Handling',
    definition: 'Techniques to address customer concerns and resistance',
    definitionId: 'Teknik mengatasi kekhawatiran dan penolakan pelanggan',
    category: 'Sales Skill',
    examples: ['Feel-felt-found', 'Acknowledge then redirect', 'Reframe the objection'],
    examplesId: ['Feel-felt-found', 'Akui lalu arahkan ulang', 'Reframe keberatan'],
  },
  {
    term: 'Closing Techniques',
    termId: 'Closing Techniques',
    definition: 'Methods to finalize sales and get commitment from prospects',
    definitionId: 'Metode untuk menyelesaikan penjualan dan mendapatkan komitmen dari prospek',
    category: 'Sales Skill',
    examples: ['Assumptive close', 'Urgency close', 'Summary close', 'Question close'],
    examplesId: ['Assumptive close', 'Urgency close', 'Summary close', 'Question close'],
  },
  {
    term: 'Pain Point',
    termId: 'Pain Point',
    definition: 'Specific problem or frustration that customers experience',
    definitionId: 'Masalah atau frustrasi spesifik yang dialami pelanggan',
    category: 'Marketing Fundamental',
    examples: ['Time constraints', 'Budget limits', 'Lack of knowledge', 'Fear of failure'],
    examplesId: ['Keterbatasan waktu', 'Batasan budget', 'Kurang pengetahuan', 'Takut gagal'],
  },
  {
    term: 'Social Proof',
    termId: 'Social Proof',
    definition: 'Evidence that others have benefited from your product/service',
    definitionId: 'Bukti bahwa orang lain telah mendapat manfaat dari produk/jasa Anda',
    category: 'Marketing Psychology',
    examples: ['Testimonials', 'Case studies', 'Reviews', 'User count'],
    examplesId: ['Testimoni', 'Studi kasus', 'Review', 'Jumlah pengguna'],
  },
  {
    term: 'Scarcity & Urgency',
    termId: 'Scarcity & Urgency',
    definition: 'Creating limited availability or time pressure to drive action',
    definitionId: 'Menciptakan ketersediaan terbatas atau tekanan waktu untuk mendorong tindakan',
    category: 'Marketing Psychology',
    examples: ['Limited stock', 'Deadline', 'Exclusive offer', 'Early bird pricing'],
    examplesId: ['Stok terbatas', 'Deadline', 'Penawaran eksklusif', 'Harga early bird'],
  },
  {
    term: 'Voice Projection',
    termId: 'Voice Projection',
    definition: 'Controlling volume, tone, and clarity for effective speaking',
    definitionId: 'Mengontrol volume, nada, dan kejelasan untuk berbicara efektif',
    category: 'Public Speaking',
    examples: ['Diaphragm breathing', 'Vary your pace', 'Strategic pauses', 'Emphasis on keywords'],
    examplesId: ['Nafas diafragma', 'Variasi kecepatan', 'Jeda strategis', 'Penekanan kata kunci'],
  },
  {
    term: 'Rapport Building',
    termId: 'Rapport Building',
    definition: 'Creating connection and trust with audience or prospect',
    definitionId: 'Menciptakan koneksi dan kepercayaan dengan audiens atau prospek',
    category: 'Communication Skill',
    examples: ['Mirroring', 'Finding common ground', 'Active listening', 'Genuine interest'],
    examplesId: ['Mirroring', 'Mencari kesamaan', 'Mendengarkan aktif', 'Minat genuine'],
  },
  {
    term: 'Value Proposition',
    termId: 'Value Proposition',
    definition: 'Clear statement of benefits customer will receive',
    definitionId: 'Pernyataan jelas tentang manfaat yang akan diterima pelanggan',
    category: 'Marketing Fundamental',
    examples: ['Save time', 'Make money', 'Reduce stress', 'Achieve goals'],
    examplesId: ['Hemat waktu', 'Hasilkan uang', 'Kurangi stres', 'Capai tujuan'],
  },
  {
    term: 'Audience Analysis',
    termId: 'Audience Analysis',
    definition: 'Understanding demographics, psychographics, and needs of target audience',
    definitionId: 'Memahami demografi, psikografi, dan kebutuhan target audiens',
    category: 'Marketing Strategy',
    examples: ['Age group', 'Interests', 'Pain points', 'Buying behavior'],
    examplesId: ['Kelompok usia', 'Minat', 'Pain points', 'Perilaku pembelian'],
  },
  {
    term: 'Hook',
    termId: 'Hook',
    definition: 'Opening statement or visual that captures attention immediately',
    definitionId: 'Pernyataan atau visual pembuka yang menarik perhatian langsung',
    category: 'Content Element',
    examples: ['Question hook', 'Shocking statement', 'Bold claim', 'Pattern interrupt'],
    examplesId: ['Hook pertanyaan', 'Pernyataan mengejutkan', 'Klaim berani', 'Pattern interrupt'],
  },
  {
    term: 'Presentation Skills',
    termId: 'Presentation Skills',
    definition: 'Ability to deliver information effectively to an audience',
    definitionId: 'Kemampuan menyampaikan informasi secara efektif kepada audiens',
    category: 'Public Speaking',
    examples: ['Slide design', 'Speaking flow', 'Q&A handling', 'Engagement techniques'],
    examplesId: ['Desain slide', 'Alur bicara', 'Penanganan Q&A', 'Teknik engagement'],
  },
];

export default function Library() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const [search, setSearch] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approvedContributions, setApprovedContributions] = useState<any[]>([]);

  // Check for admin mode in URL (path /admin, /:brand/admin, or query ?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathSegments = location.split('/').filter(Boolean);
    const isAdminPath = location === '/admin' || 
      (pathSegments.length === 2 && pathSegments[1] === 'admin');
    if (isAdminPath || params.get('admin') === 'true') {
      setShowAdminPanel(true);
    }
  }, [location]);

  // Fetch approved contributions
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        console.log('[LIBRARY] Fetching approved contributions...');
        const res = await fetch('/api/library/contributions/approved');
        const data = await res.json();
        console.log('[LIBRARY] Approved contributions received:', data);
        setApprovedContributions(data);
      } catch (error) {
        console.error('[LIBRARY] Error fetching approved contributions:', error);
      }
    };
    fetchApproved();
  }, []);

  // Convert approved contributions to GlossaryTerm format
  const contributedTerms: { tiktok: GlossaryTerm[] } = {
    tiktok: [],
  };

  approvedContributions.forEach((contrib) => {
    const term: GlossaryTerm = {
      term: contrib.term,
      termId: contrib.termId || contrib.term,
      definition: contrib.definition,
      definitionId: contrib.definitionId || contrib.definition,
      category: 'Community',
      examples: contrib.example ? [contrib.example] : [],
      examplesId: contrib.exampleId ? [contrib.exampleId] : [],
      contributor: contrib.username, // Add contributor info
    };
    if (contrib.platform === 'tiktok') {
      contributedTerms.tiktok.push(term);
    }
  });
  
  console.log('[LIBRARY] Contributed terms by platform:', contributedTerms);
  console.log('[LIBRARY] Total TikTok terms (including contrib):', [...tiktokTerms, ...contributedTerms.tiktok].length);

  const allTerms = [
    ...biasTerms,
    ...tiktokTerms,
    ...contributedTerms.tiktok,
    ...marketingTerms,
  ];

  // Filter terms based on search
  const filterTerms = (terms: GlossaryTerm[]) => {
    if (!search) return terms;
    const query = search.toLowerCase();
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        (language === 'id' ? term.definitionId : term.definition).toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query)
    );
  };

  const filteredBias = filterTerms(biasTerms);
  const filteredTikTok = filterTerms([...contributedTerms.tiktok, ...tiktokTerms]);
  const filteredMarketing = filterTerms(marketingTerms);

  const TermCard = ({ term }: { term: GlossaryTerm }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {language === 'id' && term.termId ? term.termId : term.term}
          </CardTitle>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {term.category}
          </Badge>
        </div>
        {term.contributor && (
          <p className="text-xs text-muted-foreground mt-1">
            {t('Contributed by', 'Dikontribusi oleh')} @{term.contributor}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {language === 'id' ? term.definitionId : term.definition}
        </p>
        {term.examples && term.examples.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-medium mb-1">
              {t('Examples:', 'Contoh:')}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {(language === 'id' && term.examplesId ? term.examplesId : term.examples).map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Show admin panel if in admin mode
  if (showAdminPanel) {
    return <AdminPanel isAdmin={isAdmin} setIsAdmin={setIsAdmin} />;
  }

  return (
    <div className="container max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {t('BIAS Library', 'Perpustakaan BIAS')}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t(
            'Complete glossary of TikTok, Marketing, and BIAS framework terminology. Learn essential terms for TikTok mastery, sales, public speaking, and behavioral communication.',
            'Glosarium lengkap terminologi TikTok, Marketing, dan framework BIAS. Pelajari istilah penting untuk penguasaan TikTok, penjualan, public speaking, dan komunikasi perilaku.'
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('Search terms...', 'Cari istilah...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          data-testid="input-search-library"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tiktok" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1">
          <TabsTrigger value="tiktok" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-tiktok">
            <SiTiktok className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">TikTok ({filteredTikTok.length})</span>
            <span className="sm:hidden">TikTok</span>
          </TabsTrigger>
          <TabsTrigger value="marketing" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-marketing">
            <Megaphone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Marketing ({filteredMarketing.length})</span>
            <span className="sm:hidden">Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="bias" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-bias">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">BIAS ({filteredBias.length})</span>
            <span className="sm:hidden">BIAS</span>
          </TabsTrigger>
          <TabsTrigger value="contribute" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-contribute">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('Promote', 'Promosi')}</span>
            <span className="sm:hidden">+</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-rules">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('Guidelines', 'Panduan')}</span>
            <span className="sm:hidden">{t('Guidelines', 'Panduan')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bias" className="space-y-4 mt-6">
          {filteredBias.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t('No terms found', 'Tidak ada istilah ditemukan')}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredBias.map((term, i) => (
                <TermCard key={i} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tiktok" className="space-y-4 mt-6">
          {filteredTikTok.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t('No terms found', 'Tidak ada istilah ditemukan')}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredTikTok.map((term, i) => (
                <TermCard key={i} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4 mt-6">
          {filteredMarketing.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t('No terms found', 'Tidak ada istilah ditemukan')}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredMarketing.map((term, i) => (
                <TermCard key={i} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-6 mt-6">
          <PlatformRulesHub search={search} />
        </TabsContent>

        <TabsContent value="contribute" className="space-y-6 mt-6">
          <ContributionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContributionForm() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    termId: '',
    definitionId: '',
    platform: 'tiktok' as 'tiktok',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[CONTRIB] Form submitted!', formData);
    
    if (!formData.termId || !formData.definitionId || !formData.username) {
      console.log('[CONTRIB] Validation failed:', { termId: formData.termId, definitionId: formData.definitionId, username: formData.username });
      toast({
        title: t('Missing Fields', 'Field Kosong'),
        description: t('Please fill in all required fields', 'Mohon isi semua field yang wajib'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Send with bilingual placeholders - backend will auto-translate if needed
      const submissionData = {
        term: formData.termId, // Use Indonesian as base
        termId: formData.termId,
        definition: formData.definitionId, // Use Indonesian as base
        definitionId: formData.definitionId,
        platform: formData.platform,
        username: formData.username,
      };
      
      console.log('[CONTRIB] Sending to backend:', submissionData);
      const res = await apiRequest('POST', '/api/library/contribute', submissionData);
      console.log('[CONTRIB] Response status:', res.status);
      const data = await res.json();
      console.log('[CONTRIB] Response data:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Submission failed');
      }
      
      toast({
        title: t('Contribution Submitted!', 'Kontribusi Terkirim!'),
        description: t(
          'Thank you! Your contribution will be reviewed and approved soon.',
          'Terima kasih! Kontribusi Anda akan direview dan disetujui segera.'
        ),
      });
      
      // Reset form
      setFormData({
        termId: '',
        definitionId: '',
        platform: 'tiktok',
        username: '',
      });
    } catch (error: any) {
      console.error('[CONTRIB] Error:', error);
      toast({
        title: t('Submission Failed', 'Pengiriman Gagal'),
        description: error.message || t('Please try again', 'Silakan coba lagi'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">
            {t('FREE Account Promotion!', 'Promosi Akun GRATIS!')}
          </CardTitle>
          <CardDescription>
            {t(
              'Add new TikTok terms and get your account listed in our library for FREE exposure! Your username will be displayed on every term you contribute. Example: "@yourname contributed this term" - instant visibility!',
              'Tambahkan istilah TikTok baru dan dapatkan akun kamu terdaftar di library kami untuk promosi GRATIS! Username kamu akan ditampilkan di setiap istilah yang kamu kontribusi. Contoh: "@namakamu mengontribusi istilah ini" - langsung terlihat!'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-primary/30">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              {t(
                '🎯 Your contribution = FREE promotion! All approved terms will show "Contributed by @yourusername" at the top of the library. Get your name in front of thousands of users!',
                '🎯 Kontribusimu = Promosi GRATIS! Semua istilah yang disetujui akan menampilkan "Dikontribusi oleh @usernamekamu" di bagian atas library. Namamu akan terlihat ribuan pengguna!'
              )}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform">{t('Platform', 'Platform')}</Label>
              <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background/50">
                <SiTiktok className="w-4 h-4" />
                <span>TikTok</span>
              </div>
              <input type="hidden" name="platform" value="tiktok" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="termId">{t('Term / Istilah', 'Istilah')} *</Label>
              <Input
                id="termId"
                placeholder={t('e.g., FYP, Shadowban, Viral', 'contoh: FYP, Shadowban, Viral')}
                value={formData.termId}
                onChange={(e) => setFormData({ ...formData, termId: e.target.value })}
                data-testid="input-term-id"
                required
                minLength={2}
              />
              <p className="text-xs text-muted-foreground">
                {t('The term you want to add to the library', 'Istilah yang ingin ditambahkan ke perpustakaan')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="definitionId">{t('Definition / Penjelasan', 'Penjelasan')} *</Label>
              <textarea
                id="definitionId"
                placeholder={t('Explain what this term means...', 'Jelaskan apa arti istilah ini...')}
                value={formData.definitionId}
                onChange={(e) => setFormData({ ...formData, definitionId: e.target.value })}
                className="w-full min-h-24 px-3 py-2 rounded-md border border-input bg-background resize-y"
                data-testid="textarea-definition-id"
                required
                minLength={10}
              />
              <p className="text-xs text-muted-foreground">
                {t('Minimum 10 characters', 'Minimal 10 karakter')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                {t('Your Username (This Gets Promoted!)', 'Username Anda (Ini yang Dipromosikan!)')} *
              </Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                data-testid="input-username-contrib"
                required
                minLength={2}
              />
              <p className="text-xs text-primary font-medium">
                {t(
                  '✨ This TikTok account will be displayed publicly! Example: "Contributed by @yourname" - Free exposure for your TikTok!',
                  '✨ Akun TikTok ini akan ditampilkan secara publik! Contoh: "Dikontribusi oleh @namakamu" - Promosi gratis untuk TikTok kamu!'
                )}
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:opacity-90" 
              size="lg" 
              disabled={loading}
              data-testid="button-submit-contribution"
            >
              {loading ? t('Submitting...', 'Mengirim...') : t('🚀 Submit & Get FREE Promotion!', '🚀 Kirim & Dapatkan Promosi GRATIS!')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel({ isAdmin, setIsAdmin }: { isAdmin: boolean; setIsAdmin: (v: boolean) => void }) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingContributions, setPendingContributions] = useState<any[]>([]);
  const [allLibraryItems, setAllLibraryItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAdmin(true);
        toast({
          title: t('Admin Access Granted', 'Akses Admin Diberikan'),
          description: t(`Welcome, ${data.username}!`, `Selamat datang, ${data.username}!`),
        });
        loadPendingContributions();
        loadAllLibraryItems();
      } else {
        toast({
          title: t('Login Failed', 'Login Gagal'),
          description: t(data.error || 'Invalid credentials', data.error || 'Kredensial tidak valid'),
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAdmin(false);
      toast({
        title: t('Logged Out', 'Keluar'),
        description: t('Successfully logged out', 'Berhasil keluar'),
      });
    } catch (error: any) {
      console.error('[ADMIN] Logout error:', error);
    }
  };

  const loadPendingContributions = async () => {
    try {
      const res = await fetch('/api/library/contributions/pending');
      const data = await res.json();
      setPendingContributions(data);
    } catch (error: any) {
      toast({
        title: t('Error loading contributions', 'Error memuat kontribusi'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const loadAllLibraryItems = async () => {
    try {
      const res = await fetch('/api/library/all');
      const data = await res.json();
      setAllLibraryItems(data);
      console.log('[ADMIN] Loaded all library items:', data.length);
    } catch (error: any) {
      toast({
        title: t('Error loading library items', 'Error memuat item library'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (contribution: any) => {
    setEditingId(contribution.id);
    setEditData({
      term: contribution.term,
      termId: contribution.termId || '',
      definition: contribution.definition,
      definitionId: contribution.definitionId || '',
      example: contribution.example || '',
      exampleId: contribution.exampleId || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await apiRequest('PUT', `/api/library/contributions/${id}`, editData);
      toast({
        title: t('Saved', 'Tersimpan'),
        description: t('Changes saved successfully', 'Perubahan berhasil disimpan'),
      });
      setEditingId(null);
      loadPendingContributions();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiRequest('POST', `/api/library/contributions/${id}/approve`);
      toast({
        title: t('Approved!', 'Disetujui!'),
        description: t('Contribution approved and published', 'Kontribusi disetujui dan dipublikasikan'),
      });
      loadPendingContributions();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiRequest('POST', `/api/library/contributions/${id}/reject`);
      toast({
        title: t('Rejected', 'Ditolak'),
        description: t('Contribution rejected', 'Kontribusi ditolak'),
      });
      loadPendingContributions();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('Delete this item permanently?', 'Hapus item ini permanen?'))) {
      return;
    }
    
    try {
      const res = await fetch(`/api/library/contributions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      
      toast({
        title: t('Deleted', 'Dihapus'),
        description: t('Item deleted permanently', 'Item dihapus permanen'),
      });
      
      loadPendingContributions();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: t('No items selected', 'Tidak ada item yang dipilih'),
        description: t('Please select items to delete', 'Silakan pilih item untuk dihapus'),
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(t(`Delete ${selectedItems.size} items permanently?`, `Hapus ${selectedItems.size} item permanen?`))) {
      return;
    }

    try {
      const res = await apiRequest('POST', '/api/library/bulk-delete', {
        itemIds: Array.from(selectedItems)
      });
      const data = await res.json();

      toast({
        title: t('Deleted', 'Dihapus'),
        description: t(`${data.deletedCount} items deleted`, `${data.deletedCount} item dihapus`),
      });

      setSelectedItems(new Set());
      loadAllLibraryItems();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === allLibraryItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allLibraryItems.map(item => item.id)));
    }
  };

  if (!isAdmin) {
    return (
      <div className="container max-w-md mx-auto p-6 mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              {t('Admin Login', 'Login Admin')}
            </CardTitle>
            <CardDescription>
              {t('Enter your credentials to access admin panel', 'Masukkan kredensial untuk mengakses panel admin')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">{t('Username', 'Username')}</Label>
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin"
                  data-testid="input-admin-username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">{t('Password', 'Password')}</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('Enter password', 'Masukkan password')}
                  data-testid="input-admin-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading} data-testid="button-admin-login">
                {loading ? t('Logging in...', 'Masuk...') : t('Login', 'Login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            {t('Admin Panel', 'Panel Admin')}
          </h1>
          <p className="text-muted-foreground">
            {t('Manage library and view analytics', 'Kelola perpustakaan dan lihat analitik')}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          {t('Logout', 'Keluar')}
        </Button>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="gap-2">
            <BookOpen className="w-4 h-4" />
            {t('Library', 'Perpustakaan')}
          </TabsTrigger>
          <TabsTrigger value="brands" className="gap-2">
            <Palette className="w-4 h-4" />
            {t('Brands', 'Partner')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            {t('Analytics', 'Analitik')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t('Pending Contributions', 'Kontribusi Pending')} ({pendingContributions.length})
            </h2>

        {pendingContributions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('No pending contributions', 'Tidak ada kontribusi pending')}
            </CardContent>
          </Card>
        ) : (
          pendingContributions.map((contrib) => (
            <Card key={contrib.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {editingId === contrib.id ? (
                        <Input
                          value={editData.term}
                          onChange={(e) => setEditData({ ...editData, term: e.target.value })}
                          placeholder="Term (English)"
                          data-testid={`input-edit-term-${contrib.id}`}
                        />
                      ) : (
                        contrib.term
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{contrib.platform.toUpperCase()}</Badge>
                      <Badge variant="outline">by {contrib.username}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingId === contrib.id ? (
                      <>
                        <Button size="sm" onClick={() => handleSaveEdit(contrib.id)} data-testid={`button-save-${contrib.id}`}>
                          {t('Save', 'Simpan')}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)} data-testid={`button-cancel-${contrib.id}`}>
                          {t('Cancel', 'Batal')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(contrib)} data-testid={`button-edit-${contrib.id}`}>
                          {t('Edit', 'Edit')}
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(contrib.id)} data-testid={`button-approve-${contrib.id}`}>
                          {t('Approve', 'Setujui')}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(contrib.id)} data-testid={`button-reject-${contrib.id}`}>
                          {t('Reject', 'Tolak')}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(contrib.id)} data-testid={`button-delete-${contrib.id}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingId === contrib.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label>{t('Term (Indonesian)', 'Istilah (Indonesia)')}</Label>
                      <Input
                        value={editData.termId}
                        onChange={(e) => setEditData({ ...editData, termId: e.target.value })}
                        placeholder="Term (Indonesian)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Definition (English)', 'Penjelasan (English)')}</Label>
                      <textarea
                        value={editData.definition}
                        onChange={(e) => setEditData({ ...editData, definition: e.target.value })}
                        className="w-full min-h-20 px-3 py-2 rounded-md border border-input bg-background resize-y"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Definition (Indonesian)', 'Penjelasan (Indonesia)')}</Label>
                      <textarea
                        value={editData.definitionId}
                        onChange={(e) => setEditData({ ...editData, definitionId: e.target.value })}
                        className="w-full min-h-20 px-3 py-2 rounded-md border border-input bg-background resize-y"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Example (English)', 'Contoh (English)')}</Label>
                      <Input
                        value={editData.example}
                        onChange={(e) => setEditData({ ...editData, example: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Example (Indonesian)', 'Contoh (Indonesia)')}</Label>
                      <Input
                        value={editData.exampleId}
                        onChange={(e) => setEditData({ ...editData, exampleId: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Term ID:</strong> {contrib.termId || '-'}</p>
                    <p className="text-sm"><strong>Definition:</strong> {contrib.definition}</p>
                    <p className="text-sm"><strong>Definition ID:</strong> {contrib.definitionId || '-'}</p>
                    {contrib.example && <p className="text-sm"><strong>Example:</strong> {contrib.example}</p>}
                    {contrib.exampleId && <p className="text-sm"><strong>Example ID:</strong> {contrib.exampleId}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* All Library Items with Bulk Delete */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t('All Library Items', 'Semua Item Library')} ({allLibraryItems.length})
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSelectAll}
              data-testid="button-select-all"
            >
              {selectedItems.size === allLibraryItems.length 
                ? t('Deselect All', 'Batalkan Semua')
                : t('Select All', 'Pilih Semua')
              }
            </Button>
            {selectedItems.size > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                data-testid="button-bulk-delete"
              >
                <X className="w-4 h-4 mr-1" />
                {t(`Delete ${selectedItems.size} Items`, `Hapus ${selectedItems.size} Item`)}
              </Button>
            )}
          </div>
        </div>

        {allLibraryItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('No library items found', 'Tidak ada item library')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {allLibraryItems.map((item) => (
              <Card 
                key={item.id} 
                className={`border ${selectedItems.has(item.id) ? 'border-pink-500/50 bg-pink-500/5' : ''}`}
              >
                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="mt-1 w-4 h-4 cursor-pointer"
                      data-testid={`checkbox-item-${item.id}`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{item.term}</p>
                          {item.termId && <p className="text-xs text-muted-foreground">{item.termId}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              item.platform === 'tiktok' ? 'bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/20' :
                              item.platform === 'instagram' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' :
                              'bg-red-500/10 text-red-500 border-red-500/20'
                            }
                          >
                            {item.platform.toUpperCase()}
                          </Badge>
                          {item.source === 'user-contribution' ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              {t('User', 'User')}: {item.username}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              {t('Original', 'Original')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{item.definition}</p>
                      {item.definitionId && <p className="text-xs text-muted-foreground italic">{item.definitionId}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <BrandManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Brand {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  taglineEn: string;
  taglineId: string;
  subtitleEn: string;
  subtitleId: string;
  descriptionEn: string | null;
  descriptionId: string | null;
  colorPrimary: string;
  colorSecondary: string;
  logoUrl: string | null;
  tiktokHandle: string | null;
  tiktokUrl: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

function BrandManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    shortName: '',
    taglineEn: '',
    taglineId: '',
    subtitleEn: '',
    subtitleId: '',
    descriptionEn: '',
    descriptionId: '',
    colorPrimary: 'from-pink-500 via-purple-500 to-cyan-500',
    colorSecondary: 'from-purple-500 via-pink-400 to-cyan-400',
    logoUrl: '',
    tiktokHandle: '',
    tiktokUrl: '',
    instagramHandle: '',
    instagramUrl: '',
  });

  const loadBrands = async () => {
    try {
      const res = await fetch('/api/brands', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load brands');
      const data = await res.json();
      setBrands(data);
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      shortName: '',
      taglineEn: '',
      taglineId: '',
      subtitleEn: '',
      subtitleId: '',
      descriptionEn: '',
      descriptionId: '',
      colorPrimary: 'from-pink-500 via-purple-500 to-cyan-500',
      colorSecondary: 'from-purple-500 via-pink-400 to-cyan-400',
      logoUrl: '',
      tiktokHandle: '',
      tiktokUrl: '',
      instagramHandle: '',
      instagramUrl: '',
    });
    setEditingBrand(null);
    setShowForm(false);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      slug: brand.slug,
      name: brand.name,
      shortName: brand.shortName,
      taglineEn: brand.taglineEn,
      taglineId: brand.taglineId,
      subtitleEn: brand.subtitleEn,
      subtitleId: brand.subtitleId,
      descriptionEn: brand.descriptionEn || '',
      descriptionId: brand.descriptionId || '',
      colorPrimary: brand.colorPrimary,
      colorSecondary: brand.colorSecondary,
      logoUrl: brand.logoUrl || '',
      tiktokHandle: brand.tiktokHandle || '',
      tiktokUrl: brand.tiktokUrl || '',
      instagramHandle: brand.instagramHandle || '',
      instagramUrl: brand.instagramUrl || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.name || !formData.shortName) {
      toast({
        title: t('Missing Fields', 'Field Kosong'),
        description: t('Please fill in all required fields', 'Mohon isi semua field yang wajib'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save brand');
      }

      toast({
        title: editingBrand ? t('Brand Updated', 'Partner Diupdate') : t('Brand Created', 'Partner Dibuat'),
        description: editingBrand 
          ? t('Brand updated successfully', 'Partner berhasil diupdate')
          : t('Brand created successfully', 'Partner berhasil dibuat'),
      });
      
      resetForm();
      loadBrands();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...brand, isActive: !brand.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update brand');

      toast({
        title: brand.isActive ? t('Brand Deactivated', 'Partner Dinonaktifkan') : t('Brand Activated', 'Partner Diaktifkan'),
        description: brand.isActive 
          ? t('Brand is now inactive', 'Partner sekarang tidak aktif')
          : t('Brand is now active', 'Partner sekarang aktif'),
      });
      
      loadBrands();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(t(`Delete brand "${brand.name}"? This cannot be undone.`, `Hapus partner "${brand.name}"? Ini tidak bisa dibatalkan.`))) {
      return;
    }

    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete brand');

      toast({
        title: t('Brand Deleted', 'Partner Dihapus'),
        description: t('Brand deleted successfully', 'Partner berhasil dihapus'),
      });
      
      loadBrands();
    } catch (error: any) {
      toast({
        title: t('Error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">{t('Loading brands...', 'Memuat partner...')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t('Partner Brands', 'Partner Brands')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Manage white-label partner brands for reselling', 'Kelola partner white-label untuk reselling')}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('Add Brand', 'Tambah Partner')}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-pink-500/20">
          <CardHeader>
            <CardTitle>
              {editingBrand ? t('Edit Brand', 'Edit Partner') : t('New Brand', 'Partner Baru')}
            </CardTitle>
            <CardDescription>
              {t('Fill in the brand details. The slug will be used as the URL path (e.g., /newsmaker)', 
                 'Isi detail partner. Slug akan digunakan sebagai path URL (contoh: /newsmaker)')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('URL Slug *', 'URL Slug *')}</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="newsmaker"
                    disabled={!!editingBrand}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('Only lowercase letters, numbers, and dashes', 'Hanya huruf kecil, angka, dan strip')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{t('Brand Name *', 'Nama Partner *')}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Newsmaker Academy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Short Name *', 'Nama Singkat *')}</Label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="Newsmaker"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Logo URL', 'URL Logo')}</Label>
                  <Input
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Tagline (English)', 'Tagline (English)')}</Label>
                  <Input
                    value={formData.taglineEn}
                    onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                    placeholder="Your Success Partner"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Tagline (Indonesian)', 'Tagline (Indonesia)')}</Label>
                  <Input
                    value={formData.taglineId}
                    onChange={(e) => setFormData({ ...formData, taglineId: e.target.value })}
                    placeholder="Partner Sukses Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Subtitle (English)', 'Subtitle (English)')}</Label>
                  <Input
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    placeholder="AI-Powered Analysis"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Subtitle (Indonesian)', 'Subtitle (Indonesia)')}</Label>
                  <Input
                    value={formData.subtitleId}
                    onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
                    placeholder="Analisis AI"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Description (English)', 'Deskripsi (English)')}</Label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full min-h-20 px-3 py-2 rounded-md border border-input bg-background resize-y"
                    placeholder="Full description in English..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Description (Indonesian)', 'Deskripsi (Indonesia)')}</Label>
                  <textarea
                    value={formData.descriptionId}
                    onChange={(e) => setFormData({ ...formData, descriptionId: e.target.value })}
                    className="w-full min-h-20 px-3 py-2 rounded-md border border-input bg-background resize-y"
                    placeholder="Deskripsi lengkap dalam Bahasa Indonesia..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Primary Gradient', 'Gradient Primer')}</Label>
                  <Input
                    value={formData.colorPrimary}
                    onChange={(e) => setFormData({ ...formData, colorPrimary: e.target.value })}
                    placeholder="from-pink-500 via-purple-500 to-cyan-500"
                  />
                  <div className={`h-8 rounded-md bg-gradient-to-r ${formData.colorPrimary}`} />
                </div>
                <div className="space-y-2">
                  <Label>{t('Secondary Gradient', 'Gradient Sekunder')}</Label>
                  <Input
                    value={formData.colorSecondary}
                    onChange={(e) => setFormData({ ...formData, colorSecondary: e.target.value })}
                    placeholder="from-purple-500 via-pink-400 to-cyan-400"
                  />
                  <div className={`h-8 rounded-md bg-gradient-to-r ${formData.colorSecondary}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('TikTok Handle', 'Handle TikTok')}</Label>
                  <Input
                    value={formData.tiktokHandle}
                    onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                    placeholder="@newsmaker_id"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('TikTok URL', 'URL TikTok')}</Label>
                  <Input
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://www.tiktok.com/@newsmaker_id"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Instagram Handle', 'Handle Instagram')}</Label>
                  <Input
                    value={formData.instagramHandle}
                    onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                    placeholder="@newsmaker_id"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Instagram URL', 'URL Instagram')}</Label>
                  <Input
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/newsmaker_id"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="gap-2">
                  {editingBrand ? t('Update Brand', 'Update Partner') : t('Create Brand', 'Buat Partner')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t('Cancel', 'Batal')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {brands.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {t('No partner brands yet. Create your first one!', 'Belum ada partner. Buat partner pertama Anda!')}
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              {t('Add Brand', 'Tambah Partner')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {brands.map((brand) => (
            <Card key={brand.id} className={`border-2 ${brand.isActive ? 'border-green-500/20' : 'border-muted/20 opacity-60'}`}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{brand.name}</h3>
                      <Badge variant={brand.isActive ? 'default' : 'secondary'}>
                        {brand.isActive ? t('Active', 'Aktif') : t('Inactive', 'Tidak Aktif')}
                      </Badge>
                      <a 
                        href={`/${brand.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded">/{brand.slug}</span>
                      <span>•</span>
                      <span>{brand.shortName}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className={`h-4 w-24 rounded bg-gradient-to-r ${brand.colorPrimary}`} />
                      {brand.tiktokHandle && (
                        <Badge variant="outline" className="text-xs">
                          <SiTiktok className="w-3 h-3 mr-1" />
                          {brand.tiktokHandle}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleToggleActive(brand)}
                      className="gap-1"
                    >
                      {brand.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {brand.isActive ? t('Deactivate', 'Nonaktifkan') : t('Activate', 'Aktifkan')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(brand)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(brand)} className="gap-1">
                      <Trash2 className="w-4 h-4" />
                      {t('Delete', 'Hapus')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlatformRulesHub({ search }: { search: string }) {
  const { t, language } = useLanguage();

  const currentRules = TIKTOK_RULES;

  const filteredCategories = currentRules.map(category => ({
    ...category,
    rules: category.rules.filter(rule => {
      const searchLower = search.toLowerCase();
      const title = language === 'id' ? rule.titleId : rule.title;
      const description = language === 'id' ? rule.descriptionId : rule.description;
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        rule.category.toLowerCase().includes(searchLower)
      );
    }),
  })).filter(cat => cat.rules.length > 0);

  const getStatusBadge = (status: PlatformRule['status']) => {
    switch (status) {
      case 'not-allowed':
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="w-3 h-3" />
            {t('Not Allowed', 'Tidak Diizinkan')}
          </Badge>
        );
      case 'age-restricted':
        return (
          <Badge className="gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20">
            <span>18+</span>
            {t('Age Restricted', 'Dibatasi Usia')}
          </Badge>
        );
      case 'not-eligible-fyf':
        return (
          <Badge className="gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20">
            <Ban className="w-3 h-3" />
            {t('Not Eligible for FYF', 'Tidak Memenuhi Syarat FYF')}
          </Badge>
        );
      case 'allowed':
        return (
          <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20">
            <Check className="w-3 h-3" />
            {t('Allowed', 'Diizinkan')}
          </Badge>
        );
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Shield,
      Heart,
      AlertCircle,
      CheckCircle,
      ShoppingCart,
    };
    return icons[iconName] || Shield;
  };

  return (
    <div className="space-y-6">
      {/* TikTok Guidelines Header */}
      <div className="flex items-center gap-3 p-3 bg-[#FE2C55]/10 border border-[#FE2C55]/20 rounded-lg">
        <SiTiktok className="w-6 h-6 text-[#FE2C55]" />
        <span className="font-semibold text-[#FE2C55]">{t('TikTok Community Guidelines', 'Panduan Komunitas TikTok')}</span>
      </div>

      {/* Rules Display */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('No rules found', 'Tidak ada aturan ditemukan')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">
                    {language === 'id' ? category.nameId : category.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {category.rules.map((rule) => (
                    <Card key={rule.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-base">
                            {language === 'id' ? rule.titleId : rule.title}
                          </CardTitle>
                          {getStatusBadge(rule.status)}
                        </div>
                        <CardDescription className="text-sm">
                          {language === 'id' ? rule.descriptionId : rule.description}
                        </CardDescription>
                      </CardHeader>
                      {rule.examples && rule.examples.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <ul className="text-xs space-y-1.5">
                              {(language === 'id' && rule.examplesId ? rule.examplesId : rule.examples).map((ex, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-0.5 text-muted-foreground">•</span>
                                  <span className="flex-1">{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
