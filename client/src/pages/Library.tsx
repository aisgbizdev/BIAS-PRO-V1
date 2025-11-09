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
import { Search, BookOpen, TrendingUp, Shield, AlertCircle, CheckCircle, Heart, ShoppingCart, X, Check, Ban, BarChart3 } from 'lucide-react';
import { SiTiktok, SiInstagram, SiYoutube } from 'react-icons/si';
import { TIKTOK_RULES, INSTAGRAM_RULES, YOUTUBE_RULES, type PlatformRule } from '@/data/platformRules';
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

const instagramTerms: GlossaryTerm[] = [
  {
    term: 'Reels',
    termId: 'Reels',
    definition: 'Short-form video content (up to 90 seconds) similar to TikTok format',
    definitionId: 'Konten video pendek (hingga 90 detik) mirip format TikTok',
    category: 'Content Type',
    examples: ['Reels viral trending', 'Tutorial di Reels', 'Behind-the-scenes Reels'],
    examplesId: ['Reels viral trending', 'Tutorial di Reels', 'Behind-the-scenes Reels'],
  },
  {
    term: 'Stories',
    termId: 'Stories',
    definition: '24-hour temporary content for casual, behind-the-scenes sharing',
    definitionId: 'Konten sementara 24 jam untuk berbagi casual dan behind-the-scenes',
    category: 'Content Type',
    examples: ['Daily stories update', 'Story poll & quiz', 'Swipe up link di story'],
    examplesId: ['Update story harian', 'Poll & quiz di story', 'Swipe up link di story'],
  },
  {
    term: 'Highlight',
    termId: 'Highlight',
    definition: 'Permanent collection of Stories saved to profile for ongoing visibility',
    definitionId: 'Koleksi permanen Stories yang disimpan di profil untuk visibilitas berkelanjutan',
    category: 'Profile Element',
    examples: ['Highlight produk', 'Highlight testimoni', 'Highlight FAQ'],
    examplesId: ['Highlight produk', 'Highlight testimoni', 'Highlight FAQ'],
  },
  {
    term: 'Close Friends',
    termId: 'Close Friends',
    definition: 'Private Stories list visible only to selected followers for exclusive content',
    definitionId: 'Daftar Stories privat yang hanya terlihat untuk follower terpilih untuk konten eksklusif',
    category: 'Platform Feature',
    examples: ['Konten eksklusif Close Friends', 'Behind-the-scenes untuk Close Friends', 'Promo khusus Close Friends'],
    examplesId: ['Konten eksklusif Close Friends', 'Behind-the-scenes untuk Close Friends', 'Promo khusus Close Friends'],
  },
  {
    term: 'Carousel',
    termId: 'Carousel',
    definition: 'Multi-image/video posts that users swipe through (up to 10 items)',
    definitionId: 'Postingan multi-gambar/video yang digeser pengguna (hingga 10 item)',
    category: 'Content Type',
    examples: ['Carousel tutorial step-by-step', 'Carousel produk', 'Carousel before-after'],
    examplesId: ['Carousel tutorial step-by-step', 'Carousel produk', 'Carousel before-after'],
  },
  {
    term: 'Saves',
    termId: 'Saves',
    definition: 'Number of users who bookmark content. Strong signal for Instagram algorithm',
    definitionId: 'Jumlah pengguna yang bookmark konten. Sinyal kuat untuk algoritma Instagram',
    category: 'Metric',
    examples: ['Konten yang banyak di-save', 'Save rate tinggi = algoritma boost', 'Bikin konten yang worth saving'],
    examplesId: ['Konten yang banyak di-save', 'Save rate tinggi = boost algoritma', 'Bikin konten yang worth saving'],
  },
  {
    term: 'Reach',
    termId: 'Reach',
    definition: 'Total unique accounts that saw your content',
    definitionId: 'Total akun unik yang melihat konten kamu',
    category: 'Metric',
    examples: ['Reach vs Impressions', 'Tingkatkan reach organik', 'Reach dari Explore page'],
    examplesId: ['Reach vs Impressions', 'Tingkatkan reach organik', 'Reach dari Explore page'],
  },
  {
    term: 'Shadowban',
    termId: 'Shadowban',
    definition: 'Unofficial penalty limiting content visibility without notification',
    definitionId: 'Penalti tidak resmi yang membatasi visibilitas konten tanpa pemberitahuan',
    category: 'Platform Issue',
    examples: ['Ciri-ciri kena shadowban', 'Cara keluar dari shadowban', 'Hindari trigger shadowban'],
    examplesId: ['Ciri-ciri kena shadowban', 'Cara keluar dari shadowban', 'Hindari trigger shadowban'],
  },
  {
    term: 'Link in Bio',
    termId: 'Link in Bio',
    definition: 'Clickable URL in profile (only location for external links before Stories)',
    definitionId: 'URL yang bisa diklik di profil (satu-satunya lokasi link eksternal sebelum Stories)',
    category: 'Platform Feature',
    examples: ['Link tree di bio', 'CTA: cek link di bio', 'Update link bio rutin'],
    examplesId: ['Link tree di bio', 'CTA: cek link di bio', 'Update link bio rutin'],
  },
  {
    term: 'Explore Page',
    termId: 'Explore Page / Jelajah',
    definition: 'Discovery feed showing content from accounts users dont follow based on interests',
    definitionId: 'Feed discovery yang menampilkan konten dari akun yang tidak di-follow berdasarkan minat',
    category: 'Platform Feature',
    examples: ['Masuk Explore page', 'Strategi Explore page', 'Viral dari Explore'],
    examplesId: ['Masuk Explore page', 'Strategi Explore page', 'Viral dari Explore'],
  },
  {
    term: 'Engagement Rate',
    termId: 'Engagement Rate',
    definition: '(Likes + Comments + Saves + Shares) / Followers × 100. Measures audience interaction',
    definitionId: '(Likes + Komentar + Saves + Shares) / Followers × 100. Mengukur interaksi audiens',
    category: 'Metric',
    examples: ['ER di atas 3% bagus', 'Cara tingkatkan ER', 'ER penting untuk kolaborasi brand'],
    examplesId: ['ER di atas 3% bagus', 'Cara tingkatkan ER', 'ER penting untuk kolaborasi brand'],
  },
  {
    term: 'Kollab / Collab',
    termId: 'Kollab / Collab',
    definition: 'Feature allowing co-authors on posts, sharing content to both profiles',
    definitionId: 'Fitur yang memungkinkan ko-penulis di postingan, berbagi konten ke kedua profil',
    category: 'Platform Feature',
    examples: ['Kollab post dengan brand', 'Cross-promote via kollab', 'Kollab untuk reach lebih luas'],
    examplesId: ['Kollab post dengan brand', 'Cross-promote via kollab', 'Kollab untuk reach lebih luas'],
  },
  {
    term: 'DM (Direct Message)',
    termId: 'DM (Direct Message)',
    definition: 'Private messaging feature for one-on-one or group conversations',
    definitionId: 'Fitur pesan privat untuk percakapan satu-satu atau grup',
    category: 'Platform Feature',
    examples: ['Balas DM followers', 'Open DM untuk kerjasama', 'Automation DM'],
    examplesId: ['Balas DM followers', 'Open DM untuk kerjasama', 'Automation DM'],
  },
  {
    term: 'Feed Post',
    termId: 'Feed Post',
    definition: 'Standard permanent post appearing in followers timelines and profile grid',
    definitionId: 'Postingan permanen standar yang muncul di timeline followers dan grid profil',
    category: 'Content Type',
    examples: ['Feed aesthetic', 'Feed planning', 'Feed vs Reels strategy'],
    examplesId: ['Feed aesthetic', 'Feed planning', 'Strategi feed vs Reels'],
  },
  {
    term: 'Hashtag',
    termId: 'Hashtag',
    definition: 'Keywords prefixed with # for content discovery and categorization',
    definitionId: 'Kata kunci dengan awalan # untuk penemuan dan kategorisasi konten',
    category: 'Content Element',
    examples: ['Mix hashtag besar & niche', 'Riset hashtag kompetitor', 'Branded hashtag campaign'],
    examplesId: ['Mix hashtag besar & niche', 'Riset hashtag kompetitor', 'Branded hashtag campaign'],
  },
  {
    term: 'Grid Aesthetic',
    termId: 'Grid Aesthetic',
    definition: 'Cohesive visual theme across profile posts for brand consistency',
    definitionId: 'Tema visual yang kohesif di seluruh postingan profil untuk konsistensi brand',
    category: 'Content Strategy',
    examples: ['Grid planning tools', 'Consistent color palette', 'Feed preview sebelum posting'],
    examplesId: ['Tools planning grid', 'Palet warna konsisten', 'Preview feed sebelum posting'],
  },
];

const youtubeTerms: GlossaryTerm[] = [
  {
    term: 'Shorts',
    termId: 'Shorts',
    definition: 'Vertical short-form videos (up to 60 seconds) competing with TikTok/Reels',
    definitionId: 'Video pendek vertikal (hingga 60 detik) bersaing dengan TikTok/Reels',
    category: 'Content Type',
    examples: ['Shorts viral tips', 'Monetisasi Shorts', 'Hook kuat di 3 detik pertama'],
    examplesId: ['Tips Shorts viral', 'Monetisasi Shorts', 'Hook kuat di 3 detik pertama'],
  },
  {
    term: 'Subscribe / Lonceng',
    termId: 'Subscribe / Lonceng',
    definition: 'Follow feature + notification bell for new content alerts',
    definitionId: 'Fitur follow + lonceng notifikasi untuk alert konten baru',
    category: 'Platform Feature',
    examples: ['CTA: Subscribe & nyalakan lonceng', 'Subscriber count milestone', 'Subscriber loyalty rewards'],
    examplesId: ['CTA: Subscribe & nyalakan lonceng', 'Milestone subscriber count', 'Reward subscriber setia'],
  },
  {
    term: 'Thumbnail',
    termId: 'Thumbnail',
    definition: 'Video preview image that determines click-through rate. Critical for views',
    definitionId: 'Gambar preview video yang menentukan click-through rate. Krusial untuk views',
    category: 'Content Element',
    examples: ['Thumbnail eye-catching', 'Text overlay di thumbnail', 'A/B testing thumbnail'],
    examplesId: ['Thumbnail eye-catching', 'Text overlay di thumbnail', 'A/B testing thumbnail'],
  },
  {
    term: 'CTR (Click-Through Rate)',
    termId: 'CTR (Click-Through Rate)',
    definition: 'Percentage of impressions that resulted in clicks. Measures thumbnail effectiveness',
    definitionId: 'Persentase impressions yang menghasilkan klik. Mengukur efektivitas thumbnail',
    category: 'Metric',
    examples: ['CTR di atas 4% bagus', 'Thumbnail & title optimalkan CTR', 'Tracking CTR per video'],
    examplesId: ['CTR di atas 4% bagus', 'Thumbnail & title optimalkan CTR', 'Tracking CTR per video'],
  },
  {
    term: 'Watch Time',
    termId: 'Watch Time',
    definition: 'Total minutes viewers spend watching content. Primary ranking signal',
    definitionId: 'Total menit yang dihabiskan penonton menonton konten. Sinyal ranking utama',
    category: 'Metric',
    examples: ['4000 jam watch time untuk monetisasi', 'Tingkatkan watch time dengan pacing', 'Watch time vs views'],
    examplesId: ['4000 jam watch time untuk monetisasi', 'Tingkatkan watch time dengan pacing', 'Watch time vs views'],
  },
  {
    term: 'AVD (Average View Duration)',
    termId: 'AVD (Average View Duration)',
    definition: 'Average time viewers watch a video before leaving',
    definitionId: 'Waktu rata-rata penonton menonton video sebelum pergi',
    category: 'Metric',
    examples: ['AVD tinggi = algoritma boost', 'Cek AVD di YouTube Analytics', 'Pattern recognition di drop-off points'],
    examplesId: ['AVD tinggi = boost algoritma', 'Cek AVD di YouTube Analytics', 'Pattern recognition di drop-off points'],
  },
  {
    term: 'Retention / Retensi',
    termId: 'Retention / Retensi',
    definition: 'Percentage of video watched by viewers. Key metric for algorithm',
    definitionId: 'Persentase video yang ditonton oleh penonton. Metrik kunci untuk algoritma',
    category: 'Metric',
    examples: ['Retention graph analysis', 'Hook kuat untuk retention awal', '60% retention adalah target'],
    examplesId: ['Analisis retention graph', 'Hook kuat untuk retention awal', '60% retention adalah target'],
  },
  {
    term: 'Monetisasi / Monetization',
    termId: 'Monetisasi / Monetization',
    definition: 'Earning money from YouTube through ads, memberships, Super Chat, and more',
    definitionId: 'Menghasilkan uang dari YouTube melalui iklan, membership, Super Chat, dan lainnya',
    category: 'Monetization',
    examples: ['Syarat monetisasi: 1000 subs + 4000 jam', 'AdSense setup', 'Multiple revenue streams'],
    examplesId: ['Syarat monetisasi: 1000 subs + 4000 jam', 'Setup AdSense', 'Multiple revenue streams'],
  },
  {
    term: 'CPM (Cost Per Mille)',
    termId: 'CPM (Cost Per Mille)',
    definition: 'Revenue per 1000 ad impressions. Varies by niche and audience location',
    definitionId: 'Pendapatan per 1000 tayangan iklan. Bervariasi per niche dan lokasi audiens',
    category: 'Monetization',
    examples: ['CPM Indonesia vs US', 'Niche dengan CPM tinggi', 'CPM naik saat Q4 (holiday season)'],
    examplesId: ['CPM Indonesia vs US', 'Niche dengan CPM tinggi', 'CPM naik saat Q4 (holiday season)'],
  },
  {
    term: 'Premiere',
    termId: 'Premiere',
    definition: 'Scheduled video release with live chat for real-time engagement',
    definitionId: 'Rilis video terjadwal dengan live chat untuk engagement real-time',
    category: 'Platform Feature',
    examples: ['Premiere untuk buzz building', 'Live chat selama premiere', 'Countdown premiere'],
    examplesId: ['Premiere untuk buzz building', 'Live chat selama premiere', 'Countdown premiere'],
  },
  {
    term: 'Community Tab',
    termId: 'Community Tab / Tab Komunitas',
    definition: 'Text/poll posts for engaging subscribers between video uploads',
    definitionId: 'Postingan teks/polling untuk engaging subscriber di antara upload video',
    category: 'Platform Feature',
    examples: ['Poll di Community Tab', 'Teaser video berikutnya', 'Q&A via Community Tab'],
    examplesId: ['Poll di Community Tab', 'Teaser video berikutnya', 'Q&A via Community Tab'],
  },
  {
    term: 'Subscriber',
    termId: 'Subscriber',
    definition: 'User who opted-in to receive notifications about new content',
    definitionId: 'Pengguna yang memilih menerima notifikasi tentang konten baru',
    category: 'Metric',
    examples: ['1000 subs untuk monetisasi', 'Subscriber loyalty', 'Call-to-action subscribe'],
    examplesId: ['1000 subs untuk monetisasi', 'Loyalitas subscriber', 'Call-to-action subscribe'],
  },
  {
    term: 'Algorithm / Algoritma',
    termId: 'Algorithm / Algoritma',
    definition: 'System recommending videos based on watch time, CTR, and engagement signals',
    definitionId: 'Sistem yang merekomendasikan video berdasarkan watch time, CTR, dan sinyal engagement',
    category: 'Platform Feature',
    examples: ['Pahami algoritma YouTube', 'Sinyal algoritma: CTR + AVD', 'Optimasi untuk recommended'],
    examplesId: ['Pahami algoritma YouTube', 'Sinyal algoritma: CTR + AVD', 'Optimasi untuk recommended'],
  },
  {
    term: 'Playlist',
    termId: 'Playlist',
    definition: 'Curated collection of videos for binge-watching and improved watch time',
    definitionId: 'Koleksi video yang dikurasi untuk binge-watching dan meningkatkan watch time',
    category: 'Content Strategy',
    examples: ['Serial video dalam playlist', 'Playlist meningkatkan session time', 'Organize content by topic'],
    examplesId: ['Serial video dalam playlist', 'Playlist meningkatkan session time', 'Organize konten by topik'],
  },
  {
    term: 'End Screen',
    termId: 'End Screen',
    definition: 'Interactive elements at video end promoting other videos, playlists, or subscribe',
    definitionId: 'Elemen interaktif di akhir video yang mempromosikan video lain, playlist, atau subscribe',
    category: 'Content Element',
    examples: ['End screen untuk video berikutnya', 'CTA subscribe di end screen', 'Playlist suggestion'],
    examplesId: ['End screen untuk video berikutnya', 'CTA subscribe di end screen', 'Saran playlist'],
  },
  {
    term: 'Description & Tags',
    termId: 'Description & Tags / Deskripsi & Tag',
    definition: 'Video metadata helping YouTube understand content for search and recommendations',
    definitionId: 'Metadata video yang membantu YouTube memahami konten untuk pencarian dan rekomendasi',
    category: 'Content Element',
    examples: ['Keyword-rich description', 'Relevant tags untuk SEO', 'Timestamp di description'],
    examplesId: ['Deskripsi kaya keyword', 'Tag relevan untuk SEO', 'Timestamp di deskripsi'],
  },
  {
    term: 'Live Stream',
    termId: 'Live Stream',
    definition: 'Real-time video broadcast with chat interaction and Super Chat donations',
    definitionId: 'Siaran video real-time dengan interaksi chat dan donasi Super Chat',
    category: 'Content Type',
    examples: ['Live gaming stream', 'Q&A live stream', 'Super Chat revenue'],
    examplesId: ['Live gaming stream', 'Live stream Q&A', 'Revenue Super Chat'],
  },
];

export default function Library() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const [search, setSearch] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approvedContributions, setApprovedContributions] = useState<any[]>([]);

  // Check for admin mode in URL (path /admin or query ?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (location === '/admin' || params.get('admin') === 'true') {
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
  const contributedTerms: { tiktok: GlossaryTerm[]; instagram: GlossaryTerm[]; youtube: GlossaryTerm[] } = {
    tiktok: [],
    instagram: [],
    youtube: [],
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
    contributedTerms[contrib.platform as 'tiktok' | 'instagram' | 'youtube'].push(term);
  });
  
  console.log('[LIBRARY] Contributed terms by platform:', contributedTerms);
  console.log('[LIBRARY] Total TikTok terms (including contrib):', [...tiktokTerms, ...contributedTerms.tiktok].length);

  const allTerms = [
    ...biasTerms,
    ...tiktokTerms,
    ...contributedTerms.tiktok,
    ...instagramTerms,
    ...contributedTerms.instagram,
    ...youtubeTerms,
    ...contributedTerms.youtube,
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
  const filteredTikTok = filterTerms([...tiktokTerms, ...contributedTerms.tiktok]);
  const filteredInstagram = filterTerms([...instagramTerms, ...contributedTerms.instagram]);
  const filteredYouTube = filterTerms([...youtubeTerms, ...contributedTerms.youtube]);

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
            'Complete glossary of BIAS framework and social media platform terminology',
            'Glosarium lengkap framework BIAS dan terminologi platform media sosial'
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
      <Tabs defaultValue="bias" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
          <TabsTrigger value="bias" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-bias">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">BIAS ({filteredBias.length})</span>
            <span className="sm:hidden">BIAS</span>
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-tiktok">
            <SiTiktok className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">TikTok ({filteredTikTok.length})</span>
            <span className="sm:hidden">TikTok</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-instagram">
            <SiInstagram className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Instagram ({filteredInstagram.length})</span>
            <span className="sm:hidden">IG</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-youtube">
            <SiYoutube className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">YouTube ({filteredYouTube.length})</span>
            <span className="sm:hidden">YT</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-rules">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('Rules', 'Aturan')}</span>
            <span className="sm:hidden">{t('Rules', 'Aturan')}</span>
          </TabsTrigger>
          <TabsTrigger value="contribute" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3" data-testid="tab-contribute">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('Contribute', 'Kontribusi')}</span>
            <span className="sm:hidden">+</span>
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

        <TabsContent value="instagram" className="space-y-4 mt-6">
          {filteredInstagram.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t('No terms found', 'Tidak ada istilah ditemukan')}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredInstagram.map((term, i) => (
                <TermCard key={i} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4 mt-6">
          {filteredYouTube.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t('No terms found', 'Tidak ada istilah ditemukan')}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredYouTube.map((term, i) => (
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
    platform: 'tiktok' as 'tiktok' | 'instagram' | 'youtube',
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
            {t('Contribute to Library', 'Kontribusi ke Perpustakaan')}
          </CardTitle>
          <CardDescription>
            {t(
              'Help grow our library by adding new terms and definitions',
              'Bantu kembangkan perpustakaan kami dengan menambahkan istilah dan definisi baru'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {t(
                'Submissions will be reviewed and may be edited to maintain consistency and quality without changing the meaning.',
                'Kontribusi akan direview dan dapat diedit seperlunya untuk menjaga konsistensi dan kualitas tanpa mengurangi arti dan makna.'
              )}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform">{t('Platform', 'Platform')} *</Label>
              <select
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                data-testid="select-platform"
                required
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
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
              <Label htmlFor="username">
                {t('Your Username', 'Username Anda')} *
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
              <p className="text-xs text-muted-foreground">
                {t(
                  'Your contribution will be credited to this account',
                  'Kontribusi Anda akan dikreditkan ke akun ini'
                )}
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={loading}
              data-testid="button-submit-contribution"
            >
              {loading ? t('Submitting...', 'Mengirim...') : t('Submit Contribution', 'Kirim Kontribusi')}
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library" className="gap-2">
            <BookOpen className="w-4 h-4" />
            {t('Library', 'Perpustakaan')}
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

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlatformRulesHub({ search }: { search: string }) {
  const { t, language } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'instagram' | 'youtube'>('tiktok');

  const platformData = {
    tiktok: TIKTOK_RULES,
    instagram: INSTAGRAM_RULES,
    youtube: YOUTUBE_RULES,
  };

  const currentRules = platformData[selectedPlatform];

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
      {/* Platform Selector */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedPlatform('tiktok')}
          data-testid="button-rules-tiktok"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover-elevate active-elevate-2 ${
            selectedPlatform === 'tiktok'
              ? 'bg-[#FE2C55]/10 border-[#FE2C55]/20 text-[#FE2C55]'
              : 'bg-card border-border'
          }`}
        >
          <SiTiktok className="w-5 h-5" />
          <span className="font-medium">TikTok</span>
        </button>
        <button
          onClick={() => setSelectedPlatform('instagram')}
          data-testid="button-rules-instagram"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover-elevate active-elevate-2 ${
            selectedPlatform === 'instagram'
              ? 'bg-pink-500/10 border-pink-500/20 text-pink-500'
              : 'bg-card border-border'
          }`}
        >
          <SiInstagram className="w-5 h-5" />
          <span className="font-medium">Instagram</span>
        </button>
        <button
          onClick={() => setSelectedPlatform('youtube')}
          data-testid="button-rules-youtube"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover-elevate active-elevate-2 ${
            selectedPlatform === 'youtube'
              ? 'bg-red-500/10 border-red-500/20 text-red-500'
              : 'bg-card border-border'
          }`}
        >
          <SiYoutube className="w-5 h-5" />
          <span className="font-medium">YouTube</span>
        </button>
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
