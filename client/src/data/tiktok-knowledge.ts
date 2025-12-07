export interface KnowledgeItem {
  id: string;
  category: 'myth' | 'algorithm' | 'script' | 'live' | 'growth' | 'monetization' | 'engagement';
  keywords: string[];
  titleEn: string;
  titleId: string;
  factEn: string;
  factId: string;
  explanationEn: string;
  explanationId: string;
  tipsEn: string[];
  tipsId: string[];
  conclusionEn: string;
  conclusionId: string;
  followUpEn: string;
  followUpId: string;
  icon: string;
}

export interface ScriptTemplate {
  id: string;
  category: string;
  keywords: string[];
  duration: number;
  titleEn: string;
  titleId: string;
  hookEn: string;
  hookId: string;
  middleEn: string[];
  middleId: string[];
  closingEn: string;
  closingId: string;
  tipsEn: string[];
  tipsId: string[];
}

export interface LiveTemplate {
  id: string;
  keywords: string[];
  duration: number;
  titleEn: string;
  titleId: string;
  openingEn: string;
  openingId: string;
  timelineEn: { minute: string; activity: string }[];
  timelineId: { minute: string; activity: string }[];
  giftStrategyEn: string[];
  giftStrategyId: string[];
  closingEn: string;
  closingId: string;
}

export const tiktokKnowledge: KnowledgeItem[] = [
  {
    id: 'tap-layar',
    category: 'myth',
    keywords: ['tap', 'layar', 'tap tap', 'klik', 'ketuk', 'screen'],
    titleEn: 'Tap Screen Myth',
    titleId: 'Mitos Tap Tap Layar',
    factEn: '"Tap the screen to help FYP!" → ⚠️ Half true but often misunderstood.',
    factId: '"Tap layar biar FYP!" → ⚠️ Setengah benar tapi sering disalahpahami.',
    explanationEn: 'Screen taps = light interaction (engagement signal). TikTok records that viewers like your video. BUT TikTok doesn\'t use tap count as the main FYP determinant. What matters more: Retention (watch time), Interaction quality (like, share, comment, follow), and Consistency.',
    explanationId: 'Tap layar = interaksi ringan (engagement signal). TikTok mencatat bahwa penonton menyukai videomu. TAPI TikTok gak pakai jumlah tap sebagai penentu utama FYP. Yang lebih penting: Retention (lama nonton), Kualitas interaksi (like, share, comment, follow), dan Konsistensi.',
    tipsEn: [
      'If you want to ask for taps, use emotional context, not technical',
      'Example: "If you relate to this, tap the screen so I know we\'re on the same vibe"',
      'Avoid: "Tap tap for FYP guys!!!" - this is read as engagement baiting'
    ],
    tipsId: [
      'Kalau mau ajak tap, pakai konteks emosional, bukan teknikal',
      'Contoh: "Kalau kamu relate sama ini, tap layarnya biar gue tau kita satu vibe"',
      'Hindari: "Tap tap biar FYP ya guys!!!" - ini dibaca sebagai engagement baiting'
    ],
    conclusionEn: 'Tap screen = safe ✅ But spam or explicit repeated requests = less effective 🚫 Use with emotional context, not manipulative.',
    conclusionId: 'Tap layar = aman ✅ Tapi spam atau ajakan eksplisit berulang = kurang efektif 🚫 Gunakan dengan konteks emosional, bukan manipulatif.',
    followUpEn: 'Want me to create a 30-second educational script about "TAP TAP MYTH DOESN\'T MAKE FYP"?',
    followUpId: 'Mau aku buatkan script 30 detik edukatif tentang "MITOS TAP TAP LAYAR GAK BIKIN FYP"?',
    icon: '👆'
  },
  {
    id: 'fyp-algorithm',
    category: 'algorithm',
    keywords: ['fyp', 'algoritma', 'algorithm', 'for you', 'for you page', 'viral'],
    titleEn: 'How FYP Algorithm Works',
    titleId: 'Cara Kerja Algoritma FYP',
    factEn: 'FYP is NOT random. TikTok uses machine learning to match content with the right audience.',
    factId: 'FYP BUKAN random. TikTok pakai machine learning untuk mencocokkan konten dengan audiens yang tepat.',
    explanationEn: 'The algorithm considers: 1) Watch time (most important!) - do people watch till the end? 2) Engagement rate - likes, comments, shares, saves 3) Profile visits after watching 4) Completion rate & replay 5) Following rate after video',
    explanationId: 'Algoritma mempertimbangkan: 1) Watch time (paling penting!) - apakah orang nonton sampai habis? 2) Engagement rate - like, comment, share, save 3) Profile visit setelah nonton 4) Completion rate & replay 5) Following rate setelah video',
    tipsEn: [
      'Focus on the first 3 seconds - hook must be strong',
      'Keep videos short if content is simple (15-30s)',
      'End with a question or CTA to boost comments',
      'Post when your audience is active (check analytics)'
    ],
    tipsId: [
      'Fokus di 3 detik pertama - hook harus kuat',
      'Video pendek kalau konten simpel (15-30 detik)',
      'Akhiri dengan pertanyaan atau CTA untuk boost comment',
      'Post saat audiens aktif (cek analytics)'
    ],
    conclusionEn: 'FYP = Quality content + Right timing + Strong hook. No shortcuts, just consistent good content.',
    conclusionId: 'FYP = Konten berkualitas + Timing tepat + Hook kuat. Gak ada jalan pintas, cuma konsisten bikin konten bagus.',
    followUpEn: 'Want me to analyze your content strategy for better FYP chances?',
    followUpId: 'Mau aku analisis strategi kontenmu untuk peluang FYP lebih baik?',
    icon: '📈'
  },
  {
    id: 'hashtag-myth',
    category: 'myth',
    keywords: ['hashtag', 'tagar', '#fyp', '#foryou', '#viral'],
    titleEn: 'Hashtag Myths Busted',
    titleId: 'Mitos Hashtag Terbongkar',
    factEn: '#fyp #foryou #viral does NOT guarantee FYP placement!',
    factId: '#fyp #foryou #viral TIDAK menjamin masuk FYP!',
    explanationEn: 'Generic hashtags are oversaturated with millions of posts. TikTok prioritizes CONTENT QUALITY over hashtags. Niche-specific hashtags help categorize your content for the right audience. 3-5 relevant hashtags work better than 20 generic ones.',
    explanationId: 'Hashtag generik oversaturated dengan jutaan post. TikTok prioritaskan KUALITAS KONTEN di atas hashtag. Hashtag niche-specific membantu kategorikan konten untuk audiens yang tepat. 3-5 hashtag relevan lebih efektif dari 20 hashtag generik.',
    tipsEn: [
      'Use 3-5 niche-specific hashtags',
      'Mix popular + medium + small hashtags',
      'Create a branded hashtag for your content',
      'Check trending hashtags in your niche weekly'
    ],
    tipsId: [
      'Pakai 3-5 hashtag niche-specific',
      'Campuran hashtag populer + medium + kecil',
      'Buat branded hashtag untuk kontenmu',
      'Cek trending hashtag di niche kamu mingguan'
    ],
    conclusionEn: 'Hashtags help categorization, not virality. Focus on content first, hashtags second.',
    conclusionId: 'Hashtag membantu kategorisasi, bukan viralitas. Fokus konten dulu, hashtag kemudian.',
    followUpEn: 'Want me to suggest the best hashtags for your niche?',
    followUpId: 'Mau aku sarankan hashtag terbaik untuk niche kamu?',
    icon: '#️⃣'
  },
  {
    id: 'posting-time',
    category: 'algorithm',
    keywords: ['waktu', 'posting', 'jam', 'kapan', 'time', 'schedule', 'jadwal'],
    titleEn: 'Best Posting Time',
    titleId: 'Waktu Posting Terbaik',
    factEn: 'There\'s no universal "best time" - it depends on YOUR audience!',
    factId: 'Gak ada "waktu terbaik" universal - tergantung audiens KAMU!',
    explanationEn: 'General guidelines for Indonesia: Weekdays 11:00-13:00 (lunch break), 19:00-21:00 (after work). Weekends 09:00-11:00, 20:00-22:00. BUT your analytics will show when YOUR specific audience is online.',
    explanationId: 'Panduan umum untuk Indonesia: Weekdays 11:00-13:00 (jam makan siang), 19:00-21:00 (setelah kerja). Weekend 09:00-11:00, 20:00-22:00. TAPI analytics kamu akan tunjukkan kapan audiens SPESIFIK kamu online.',
    tipsEn: [
      'Check TikTok Analytics > Followers > Most Active Times',
      'Test different times for 2 weeks and track results',
      'Post 30 minutes BEFORE peak time for best initial push',
      'Consistency matters more than perfect timing'
    ],
    tipsId: [
      'Cek TikTok Analytics > Followers > Most Active Times',
      'Test waktu berbeda selama 2 minggu dan track hasilnya',
      'Post 30 menit SEBELUM peak time untuk push awal terbaik',
      'Konsistensi lebih penting dari timing sempurna'
    ],
    conclusionEn: 'Use your analytics, not generic advice. Every audience is different.',
    conclusionId: 'Gunakan analytics kamu, bukan saran generik. Setiap audiens berbeda.',
    followUpEn: 'Want me to help you create a posting schedule based on best practices?',
    followUpId: 'Mau aku bantu buatkan jadwal posting berdasarkan best practices?',
    icon: '⏰'
  },
  {
    id: 'follower-growth',
    category: 'growth',
    keywords: ['follower', 'followers', 'nambah', 'tambah', 'grow', 'growth', 'naik'],
    titleEn: 'How to Grow Followers',
    titleId: 'Cara Menambah Follower',
    factEn: 'Followers are the RESULT of trust, not the goal itself.',
    factId: 'Follower adalah HASIL dari trust, bukan tujuan itu sendiri.',
    explanationEn: 'The key is only THREE things: 1) Consistent upload at the same time - algorithm loves predictability 2) Build positive vibes in comments - don\'t ignore your audience 3) Re-upload your best performing videos - TikTok loves "recycled performance"',
    explanationId: 'Kuncinya cuma TIGA: 1) Konsisten upload jam yang sama - algoritma suka predictability 2) Bangun vibe positif di komentar - jangan cuek sama audiens 3) Re-upload video performamu yang bagus - TikTok suka "recycle performance"',
    tipsEn: [
      'Focus on making people feel "I relate to this person"',
      'Reply to every comment in the first hour',
      'Create content series to keep people coming back',
      'Collaborate with creators in your niche'
    ],
    tipsId: [
      'Fokus bikin orang merasa "gue relate sama orang ini"',
      'Reply setiap komen di jam pertama',
      'Buat content series supaya orang balik lagi',
      'Kolaborasi dengan kreator di niche kamu'
    ],
    conclusionEn: 'Followers = Trust. Build connection first, numbers will follow.',
    conclusionId: 'Follower = Trust. Bangun koneksi dulu, angka akan mengikuti.',
    followUpEn: 'Want me to create a 30-second VT script about growing followers?',
    followUpId: 'Mau aku buatkan script VT 30 detik tentang cara nambah follower?',
    icon: '👥'
  },
  {
    id: 'engagement-rate',
    category: 'growth',
    keywords: ['engagement', 'rate', 'like', 'comment', 'share', 'interaksi'],
    titleEn: 'Boosting Engagement Rate',
    titleId: 'Meningkatkan Engagement Rate',
    factEn: 'Good engagement rate on TikTok is 4-6%. Above 10% is excellent!',
    factId: 'Engagement rate bagus di TikTok adalah 4-6%. Di atas 10% itu excellent!',
    explanationEn: 'Engagement = (Likes + Comments + Shares) / Views x 100. Low engagement signals algorithm that your content isn\'t resonating. High engagement = more FYP distribution.',
    explanationId: 'Engagement = (Like + Comment + Share) / Views x 100. Engagement rendah sinyal ke algoritma bahwa kontenmu gak resonating. Engagement tinggi = lebih banyak distribusi FYP.',
    tipsEn: [
      'End every video with a question to encourage comments',
      'Use controversial (but safe) opinions to spark discussion',
      'Create "save-worthy" content (tips, tutorials, lists)',
      'Reply to comments with video responses'
    ],
    tipsId: [
      'Akhiri setiap video dengan pertanyaan untuk encourage komen',
      'Pakai opini kontroversial (tapi aman) untuk pancing diskusi',
      'Buat konten "layak save" (tips, tutorial, list)',
      'Reply komen dengan video response'
    ],
    conclusionEn: 'Engagement is a conversation. Talk WITH your audience, not AT them.',
    conclusionId: 'Engagement adalah percakapan. Bicara DENGAN audiensmu, bukan KE mereka.',
    followUpEn: 'Want me to suggest engagement-boosting techniques for your content type?',
    followUpId: 'Mau aku sarankan teknik boost engagement untuk tipe kontenmu?',
    icon: '💬'
  },
  {
    id: 'live-tips',
    category: 'live',
    keywords: ['live', 'streaming', 'siaran', 'langsung', 'gift', 'hadiah'],
    titleEn: 'Live Streaming Success',
    titleId: 'Sukses Live Streaming',
    factEn: 'Live streaming is the fastest way to build deep connection with audience.',
    factId: 'Live streaming adalah cara tercepat bangun koneksi mendalam dengan audiens.',
    explanationEn: 'Successful lives need: 1) Clear topic/theme 2) Minimum 30 minutes duration 3) Interactive elements (Q&A, challenges) 4) Consistent schedule 5) Energy and authenticity',
    explanationId: 'Live sukses butuh: 1) Topik/tema jelas 2) Durasi minimum 30 menit 3) Elemen interaktif (Q&A, challenge) 4) Jadwal konsisten 5) Energi dan autentisitas',
    tipsEn: [
      'Announce your live 24 hours before on Stories',
      'Start with high energy - first 5 minutes determine viewership',
      'Acknowledge every viewer by name when possible',
      'Have a "gift goal" but don\'t beg for gifts'
    ],
    tipsId: [
      'Announce live 24 jam sebelumnya di Stories',
      'Mulai dengan energi tinggi - 5 menit pertama tentukan viewership',
      'Acknowledge setiap viewer dengan nama kalau bisa',
      'Punya "gift goal" tapi jangan ngemis gift'
    ],
    conclusionEn: 'Lives build loyalty. Treat every viewer like a VIP.',
    conclusionId: 'Live membangun loyalitas. Treat setiap viewer seperti VIP.',
    followUpEn: 'Want me to create a minute-by-minute live streaming timeline for you?',
    followUpId: 'Mau aku buatkan timeline live streaming menit-per-menit untukmu?',
    icon: '📺'
  },
  {
    id: 'hook-importance',
    category: 'algorithm',
    keywords: ['hook', 'opening', 'awal', 'pembuka', '3 detik', 'first', 'pertama'],
    titleEn: 'The Power of Hooks',
    titleId: 'Kekuatan Hook',
    factEn: 'You have exactly 1-3 seconds to stop someone from scrolling.',
    factId: 'Kamu punya tepat 1-3 detik untuk stop orang dari scroll.',
    explanationEn: 'Strong hooks trigger curiosity, emotion, or promise value. Types: 1) Question hook "Did you know...?" 2) Shock hook "This changed everything..." 3) Promise hook "3 things that will..." 4) Story hook "So this happened..."',
    explanationId: 'Hook kuat trigger curiosity, emosi, atau promise value. Tipe: 1) Question hook "Tau gak...?" 2) Shock hook "Ini mengubah segalanya..." 3) Promise hook "3 hal yang akan..." 4) Story hook "Jadi ini terjadi..."',
    tipsEn: [
      'Never start with "Hey guys" or greetings - waste of precious seconds',
      'Use pattern interrupts - unexpected visuals or sounds',
      'Text on screen in first second increases retention',
      'Match your hook energy with the content that follows'
    ],
    tipsId: [
      'Jangan pernah mulai dengan "Hey guys" atau salam - buang detik berharga',
      'Pakai pattern interrupt - visual atau suara tak terduga',
      'Teks di layar di detik pertama tingkatkan retention',
      'Cocokkan energi hook dengan konten setelahnya'
    ],
    conclusionEn: 'Your hook is your first impression. Make it count.',
    conclusionId: 'Hook kamu adalah kesan pertama. Buat itu berarti.',
    followUpEn: 'Want me to generate 5 hook variations for your content idea?',
    followUpId: 'Mau aku generate 5 variasi hook untuk ide kontenmu?',
    icon: '🎣'
  },
  {
    id: 'shadowban',
    category: 'myth',
    keywords: ['shadowban', 'shadow ban', 'banned', 'sepi', 'views turun', 'gak fyp'],
    titleEn: 'Shadowban: Myth vs Reality',
    titleId: 'Shadowban: Mitos vs Realita',
    factEn: 'TikTok has NEVER officially confirmed "shadowban" exists.',
    factId: 'TikTok TIDAK PERNAH secara resmi konfirmasi "shadowban" ada.',
    explanationEn: 'What people call shadowban is usually: 1) Normal algorithm fluctuation 2) Posting low-quality content 3) Violating community guidelines 4) Hashtag misuse 5) Inconsistent posting. The algorithm just isn\'t pushing your content because it doesn\'t perform well.',
    explanationId: 'Yang orang sebut shadowban biasanya: 1) Fluktuasi algoritma normal 2) Posting konten kualitas rendah 3) Melanggar community guidelines 4) Hashtag misuse 5) Posting gak konsisten. Algoritma cuma gak push kontenmu karena performanya gak bagus.',
    tipsEn: [
      'If views drop suddenly, check if you violated any guidelines',
      'Try posting different content style to test',
      'Stay consistent - don\'t stop posting',
      'Focus on content quality, not "fixing shadowban"'
    ],
    tipsId: [
      'Kalau views turun tiba-tiba, cek apakah melanggar guidelines',
      'Coba post style konten berbeda untuk test',
      'Tetap konsisten - jangan stop posting',
      'Fokus kualitas konten, bukan "fix shadowban"'
    ],
    conclusionEn: 'There\'s no shadowban button at TikTok HQ. Focus on better content.',
    conclusionId: 'Gak ada tombol shadowban di kantor TikTok. Fokus bikin konten lebih baik.',
    followUpEn: 'Want me to help diagnose why your views might be dropping?',
    followUpId: 'Mau aku bantu diagnosa kenapa views kamu mungkin turun?',
    icon: '👻'
  },
  {
    id: 'monetization',
    category: 'monetization',
    keywords: ['uang', 'money', 'monetisasi', 'monetize', 'cuan', 'penghasilan', 'income', 'creator fund'],
    titleEn: 'TikTok Monetization Guide',
    titleId: 'Panduan Monetisasi TikTok',
    factEn: 'Creator Fund is just ONE of many ways to make money on TikTok.',
    factId: 'Creator Fund cuma SATU dari banyak cara menghasilkan uang di TikTok.',
    explanationEn: 'Monetization methods: 1) Creator Fund (low pay, need 10K followers) 2) Brand deals (highest pay) 3) Affiliate marketing 4) Live gifts 5) Selling own products/services 6) Driving traffic to other platforms',
    explanationId: 'Metode monetisasi: 1) Creator Fund (bayaran rendah, butuh 10K followers) 2) Brand deals (bayaran tertinggi) 3) Affiliate marketing 4) Gift dari live 5) Jual produk/jasa sendiri 6) Arahkan traffic ke platform lain',
    tipsEn: [
      'Don\'t rely only on Creator Fund - diversify income',
      'Build a media kit when you hit 10K followers',
      'Affiliate links work great in bio and comments',
      'Live gifts can earn $100-1000+ per session for active streamers'
    ],
    tipsId: [
      'Jangan cuma andalkan Creator Fund - diversifikasi income',
      'Buat media kit saat capai 10K followers',
      'Link affiliate work bagus di bio dan komen',
      'Gift live bisa dapat $100-1000+ per sesi untuk streamer aktif'
    ],
    conclusionEn: 'Build audience first, monetization opportunities will come.',
    conclusionId: 'Bangun audiens dulu, peluang monetisasi akan datang.',
    followUpEn: 'Want me to create a monetization roadmap based on your follower count?',
    followUpId: 'Mau aku buatkan roadmap monetisasi berdasarkan jumlah followermu?',
    icon: '💰'
  }
];

export const scriptTemplates: ScriptTemplate[] = [
  {
    id: 'grow-followers-30',
    category: 'growth',
    keywords: ['follower', 'nambah', 'tambah', 'grow', 'growth'],
    duration: 30,
    titleEn: 'How to Grow Followers (30s)',
    titleId: 'Cara Menambah Follower (30 detik)',
    hookEn: '"Bro, if your followers aren\'t growing, it\'s not because your content is bad — the algorithm just hasn\'t caught your energy yet."',
    hookId: '"Bro, kalau follower kamu gak nambah-nambah, bukan berarti kontenmu jelek — tapi algoritma belum nangkep energi kamu."',
    middleEn: [
      '🎯 Key point 1: Consistently upload at the same time',
      '🎯 Key point 2: Build positive vibes in comments, don\'t be cold',
      '🎯 Key point 3: Re-upload your best videos — TikTok loves "recycled performance"'
    ],
    middleId: [
      '🎯 Poin 1: Konsisten upload jam yang sama',
      '🎯 Poin 2: Bangun vibe positif di komentar, jangan cuek',
      '🎯 Poin 3: Re-upload video terbaikmu — TikTok suka "recycle performance"'
    ],
    closingEn: '"Followers aren\'t numbers, they\'re the result of trust. Focus on making people feel \'I relate to this person.\' Save this video if you relate, bro ✌️"',
    closingId: '"Follower itu bukan angka, tapi hasil dari trust. Fokus bikin orang ngerasa \'gue relate sama dia.\' Save video ini kalau kamu relate, bro ✌️"',
    tipsEn: [
      'Speak at 0.4-0.5 seconds per sentence so viewers can digest',
      'Tone: warm but firm, like chatting with a friend',
      'Use small hand gestures when mentioning points',
      'End with a smile and 1-2 seconds of eye contact'
    ],
    tipsId: [
      'Bicara 0.4-0.5 detik per kalimat biar penonton sempat mencerna',
      'Tone: hangat tapi tegas, kayak ngobrol sama teman',
      'Pakai gestur tangan kecil saat nyebut poin',
      'Akhiri dengan senyum dan kontak mata 1-2 detik'
    ]
  },
  {
    id: 'fyp-tips-30',
    category: 'algorithm',
    keywords: ['fyp', 'viral', 'algorithm', 'algoritma'],
    duration: 30,
    titleEn: 'FYP Tips (30s)',
    titleId: 'Tips FYP (30 detik)',
    hookEn: '"Everyone\'s chasing FYP but doing it all wrong..."',
    hookId: '"Semua orang kejar FYP tapi caranya salah semua..."',
    middleEn: [
      '🎯 Point 1: Hook in the first 1 second — no greetings!',
      '🎯 Point 2: Keep viewers till the end — short but impactful',
      '🎯 Point 3: Post 30 minutes BEFORE your audience\'s peak time'
    ],
    middleId: [
      '🎯 Poin 1: Hook di 1 detik pertama — gak usah salam!',
      '🎯 Poin 2: Buat penonton stay sampai akhir — pendek tapi impactful',
      '🎯 Poin 3: Post 30 menit SEBELUM peak time audiensmu'
    ],
    closingEn: '"FYP isn\'t luck. It\'s strategy. Which tip are you trying first? Comment below!"',
    closingId: '"FYP bukan luck. Ini strategi. Tips mana yang kamu coba duluan? Komen di bawah!"',
    tipsEn: [
      'Use text overlay for key points',
      'Maintain high energy throughout',
      'Add trending sound in the background'
    ],
    tipsId: [
      'Pakai text overlay untuk poin kunci',
      'Jaga energi tinggi sepanjang video',
      'Tambah trending sound di background'
    ]
  },
  {
    id: 'engagement-tips-30',
    category: 'engagement',
    keywords: ['engagement', 'like', 'comment', 'share', 'interaksi'],
    duration: 30,
    titleEn: 'Boost Engagement (30s)',
    titleId: 'Tingkatkan Engagement (30 detik)',
    hookEn: '"Your engagement is low because you\'re talking AT your audience, not WITH them..."',
    hookId: '"Engagement kamu rendah karena kamu bicara KE audiens, bukan SAMA mereka..."',
    middleEn: [
      '🎯 Point 1: End every video with a question',
      '🎯 Point 2: Reply to EVERY comment in the first hour',
      '🎯 Point 3: Create content that makes people want to share with friends'
    ],
    middleId: [
      '🎯 Poin 1: Akhiri setiap video dengan pertanyaan',
      '🎯 Poin 2: Reply SEMUA komen di jam pertama',
      '🎯 Poin 3: Buat konten yang bikin orang mau share ke teman'
    ],
    closingEn: '"Engagement is a conversation. Start one now — what\'s your biggest struggle with TikTok?"',
    closingId: '"Engagement itu percakapan. Mulai sekarang — apa struggle terbesarmu di TikTok?"',
    tipsEn: [
      'Make eye contact when asking the question',
      'Pause briefly before the CTA for emphasis',
      'Use a warm, inviting tone'
    ],
    tipsId: [
      'Kontak mata saat tanya pertanyaan',
      'Jeda sebentar sebelum CTA untuk penekanan',
      'Pakai tone hangat dan mengundang'
    ]
  }
];

export const liveTemplates: LiveTemplate[] = [
  {
    id: 'live-30min-general',
    keywords: ['live', '30 menit', 'streaming', 'general'],
    duration: 30,
    titleEn: '30-Minute Live Template',
    titleId: 'Template Live 30 Menit',
    openingEn: '"What\'s up everyone! Thanks for joining tonight\'s live. Today we\'re going to talk about [TOPIC]. Drop a wave emoji if you\'re ready!"',
    openingId: '"Halo semuanya! Makasih udah join live malam ini. Hari ini kita bakal bahas [TOPIK]. Drop emoji wave kalau udah siap!"',
    timelineEn: [
      { minute: '0-5', activity: 'Greet viewers, introduce topic, ask where everyone is from' },
      { minute: '5-10', activity: 'Main content point 1 + Q&A' },
      { minute: '10-15', activity: 'Main content point 2 + engage with comments' },
      { minute: '15-20', activity: 'Main content point 3 + gift acknowledgment' },
      { minute: '20-25', activity: 'Open Q&A session, answer viewer questions' },
      { minute: '25-30', activity: 'Recap, thank viewers, announce next live, CTA to follow' }
    ],
    timelineId: [
      { minute: '0-5', activity: 'Sapa viewers, intro topik, tanya pada dari mana' },
      { minute: '5-10', activity: 'Poin konten utama 1 + Q&A' },
      { minute: '10-15', activity: 'Poin konten utama 2 + engage dengan komentar' },
      { minute: '15-20', activity: 'Poin konten utama 3 + acknowledge gift' },
      { minute: '20-25', activity: 'Sesi Q&A terbuka, jawab pertanyaan viewer' },
      { minute: '25-30', activity: 'Recap, terima kasih viewers, announce live berikutnya, CTA follow' }
    ],
    giftStrategyEn: [
      'Thank every gifter by name immediately',
      'Have a special shoutout for bigger gifts',
      'Don\'t beg for gifts — create value first',
      'Set a gift goal (e.g., "If we hit 100 roses, I\'ll share a bonus tip!")'
    ],
    giftStrategyId: [
      'Terima kasih setiap gifter dengan nama langsung',
      'Shoutout special untuk gift besar',
      'Jangan ngemis gift — buat value dulu',
      'Set gift goal (contoh: "Kalau kita capai 100 rose, aku share bonus tips!")'
    ],
    closingEn: '"That\'s a wrap for tonight! Thanks everyone for hanging out. Same time next [DAY]? Drop a heart if you\'ll be here! Love you all, bye!"',
    closingId: '"Segitu dulu untuk malam ini! Makasih semuanya udah nongkrong. Waktu yang sama [HARI] depan? Drop heart kalau kamu bakal hadir! Love you all, bye!"'
  }
];

export function findKnowledge(input: string): KnowledgeItem | null {
  const normalizedInput = input.toLowerCase();
  
  for (const item of tiktokKnowledge) {
    for (const keyword of item.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        return item;
      }
    }
  }
  return null;
}

export function findScriptTemplate(input: string, duration?: number): ScriptTemplate | null {
  const normalizedInput = input.toLowerCase();
  
  for (const template of scriptTemplates) {
    for (const keyword of template.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        if (duration && template.duration !== duration) continue;
        return template;
      }
    }
  }
  return null;
}

export function findLiveTemplate(input: string, duration?: number): LiveTemplate | null {
  const normalizedInput = input.toLowerCase();
  
  if (!normalizedInput.includes('live')) return null;
  
  for (const template of liveTemplates) {
    if (duration && template.duration !== duration) continue;
    return template;
  }
  return liveTemplates[0];
}

export function detectIntent(input: string): {
  type: 'question' | 'script_request' | 'live_request' | 'general';
  duration?: number;
  topic?: string;
} {
  const normalizedInput = input.toLowerCase();
  
  const durationMatch = normalizedInput.match(/(\d+)\s*(detik|menit|seconds?|minutes?|s|m)/);
  let duration: number | undefined;
  if (durationMatch) {
    const num = parseInt(durationMatch[1]);
    const unit = durationMatch[2];
    if (unit.includes('menit') || unit.includes('minute') || unit === 'm') {
      duration = num;
    } else {
      duration = num;
    }
  }
  
  if (normalizedInput.includes('live') || normalizedInput.includes('streaming') || normalizedInput.includes('siaran')) {
    return { type: 'live_request', duration };
  }
  
  if (normalizedInput.includes('vt') || normalizedInput.includes('video') || normalizedInput.includes('script') || 
      normalizedInput.includes('bikin') || normalizedInput.includes('buat')) {
    return { type: 'script_request', duration };
  }
  
  if (normalizedInput.includes('?') || normalizedInput.includes('apa') || normalizedInput.includes('gimana') || 
      normalizedInput.includes('kenapa') || normalizedInput.includes('apakah') || normalizedInput.includes('boleh')) {
    return { type: 'question' };
  }
  
  return { type: 'general' };
}
