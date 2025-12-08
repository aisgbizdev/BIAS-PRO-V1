import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Copy, CheckCircle2, Clock, Zap, MessageSquare, Phone, Mail, Presentation, Quote, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// ROTATING PLACEHOLDER EXAMPLES - Broker/Pialang Focus
// ==========================================
const COMPANY_EXAMPLES = [
  { name: 'PT Futures Prima', nameId: 'PT Futures Prima' },
  { name: 'Golden Commodity Broker', nameId: 'Golden Commodity Broker' },
  { name: 'PT Pialang Berjangka Mandiri', nameId: 'PT Pialang Berjangka Mandiri' },
  { name: 'Asia Pacific Futures', nameId: 'Asia Pacific Futures' },
  { name: 'PT Millennium Penata Futures', nameId: 'PT Millennium Penata Futures' },
  { name: 'Capital Trade Indonesia', nameId: 'Capital Trade Indonesia' },
  { name: 'PT Valbury Asia Futures', nameId: 'PT Valbury Asia Futures' },
  { name: 'Prime Commodity Trading', nameId: 'Prime Commodity Trading' },
];

const PRODUCT_EXAMPLES = [
  { name: 'Gold & Forex Trading', nameId: 'Trading Emas & Forex' },
  { name: 'Crude Oil Futures', nameId: 'Kontrak Berjangka Minyak' },
  { name: 'Index Trading CFD', nameId: 'Trading Indeks CFD' },
  { name: 'Managed Account Service', nameId: 'Layanan Managed Account' },
  { name: 'Copy Trading Platform', nameId: 'Platform Copy Trading' },
  { name: 'Signal Trading Premium', nameId: 'Signal Trading Premium' },
  { name: 'Private Wealth Management', nameId: 'Pengelolaan Aset Pribadi' },
  { name: 'Commodity Futures Contract', nameId: 'Kontrak Berjangka Komoditas' },
];

const TARGET_EXAMPLES = [
  { name: 'High-net-worth individuals', nameId: 'Individu dengan aset tinggi' },
  { name: 'Active retail traders', nameId: 'Trader retail aktif' },
  { name: 'Business owners seeking diversification', nameId: 'Pemilik usaha yang ingin diversifikasi' },
  { name: 'Professional investors', nameId: 'Investor profesional' },
  { name: 'Corporate treasury departments', nameId: 'Departemen treasury perusahaan' },
  { name: 'Young professionals with savings', nameId: 'Profesional muda dengan tabungan' },
  { name: 'Retirees looking for passive income', nameId: 'Pensiunan yang cari passive income' },
  { name: 'First-time investors', nameId: 'Investor pemula' },
];

const PAIN_EXAMPLES = [
  { name: 'Savings barely growing', nameId: 'Uang di tabungan gak berkembang' },
  { name: 'Want extra income but confused how', nameId: 'Mau cuan tambahan tapi bingung caranya' },
  { name: 'Tried investing but always lost', nameId: 'Udah coba invest tapi selalu rugi' },
  { name: 'No time to learn trading', nameId: 'Gak ada waktu belajar trading' },
  { name: 'Scared of losing money', nameId: 'Takut uangnya hilang' },
  { name: 'Don\'t know who to trust', nameId: 'Bingung mau percaya siapa' },
  { name: 'Too many choices, overwhelmed', nameId: 'Kebanyakan pilihan, pusing' },
  { name: 'Want passive income for retirement', nameId: 'Mau penghasilan pasif buat pensiun' },
];

const VALUE_EXAMPLES = [
  { name: 'Personal guide 24 hours', nameId: 'Ada yang bantu 24 jam' },
  { name: 'Legal & supervised by government', nameId: 'Legal & diawasi pemerintah' },
  { name: 'Free daily tips', nameId: 'Tips harian gratis' },
  { name: 'No hidden fees', nameId: 'Tanpa biaya tersembunyi' },
  { name: 'Learn while earning', nameId: 'Belajar sambil dapat cuan' },
  { name: 'Try free without risk', nameId: 'Coba gratis tanpa risiko' },
  { name: 'Withdraw anytime', nameId: 'Tarik dana kapan aja' },
  { name: 'Special signals for members', nameId: 'Sinyal khusus buat member' },
];

// ==========================================
// MOTIVATIONAL QUOTES BANK
// ==========================================
const MOTIVATIONAL_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", quoteId: "Satu-satunya cara melakukan pekerjaan hebat adalah mencintai apa yang kamu kerjakan." },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", quoteId: "Sukses bukanlah akhir, kegagalan bukanlah fatal: yang penting adalah keberanian untuk terus maju." },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", quoteId: "Waktu terbaik menanam pohon adalah 20 tahun lalu. Waktu terbaik kedua adalah sekarang." },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", quoteId: "Jangan lihat jam; lakukan seperti yang dilakukannya. Terus bergerak." },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", quoteId: "Rahasia untuk maju adalah memulai." },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown", quoteId: "Batasanmu—hanyalah imajinasimu." },
  { quote: "Great things never come from comfort zones.", author: "Unknown", quoteId: "Hal-hal hebat tidak pernah datang dari zona nyaman." },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", quoteId: "Impikan. Inginkan. Lakukan." },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", quoteId: "Sukses biasanya datang kepada mereka yang terlalu sibuk untuk mencarinya." },
  { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", quoteId: "Jangan takut melepas yang baik untuk meraih yang hebat." },
  { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", quoteId: "Semakin keras aku bekerja, semakin beruntung diriku." },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", quoteId: "Cara untuk memulai adalah berhenti bicara dan mulai melakukan." },
  { quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn", quoteId: "Jika kamu tidak mau ambil risiko yang biasa, kamu harus puas dengan yang biasa-biasa saja." },
  { quote: "Whether you think you can or think you can't, you're right.", author: "Henry Ford", quoteId: "Apakah kamu pikir bisa atau tidak bisa, kamu benar." },
  { quote: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", quoteId: "Satu-satunya tempat di mana sukses datang sebelum kerja adalah di kamus." },
  { quote: "It's not about having time. It's about making time.", author: "Unknown", quoteId: "Bukan soal punya waktu. Tapi soal membuat waktu." },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali", quoteId: "Jangan hitung hari, buat hari-harimu berarti." },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser", quoteId: "Peluang tidak terjadi begitu saja. Kamu yang menciptakannya." },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", quoteId: "Perjalanan yang mustahil adalah yang tidak pernah kamu mulai." },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", quoteId: "Semua yang pernah kamu inginkan ada di sisi lain dari ketakutan." },
  { quote: "Hustle in silence and let your success make the noise.", author: "Unknown", quoteId: "Kerja keras dalam diam dan biarkan suksesmu yang bersuara." },
  { quote: "Small daily improvements are the key to staggering long-term results.", author: "Unknown", quoteId: "Perbaikan kecil setiap hari adalah kunci hasil luar biasa jangka panjang." },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston", quoteId: "Apa yang kamu lakukan hari ini bisa memperbaiki semua hari esokmu." },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin", quoteId: "Jadilah begitu baik sehingga mereka tidak bisa mengabaikanmu." },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", quoteId: "Masa depan milik mereka yang percaya pada keindahan impian mereka." },
];

interface ScriptTemplate {
  id: string;
  name: string;
  nameId: string;
  icon: ReactNode;
  description: string;
  descriptionId: string;
  sections: {
    name: string;
    content: string;
    contentId: string;
    timing?: string;
  }[];
}

const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'cold-call',
    name: 'Cold Call Script',
    nameId: 'Script Cold Call',
    icon: <Phone className="w-5 h-5" />,
    description: 'First-time call to prospect - grab attention in 10 seconds',
    descriptionId: 'Telepon pertama ke prospek - tarik perhatian dalam 10 detik',
    sections: [
      {
        name: '🎯 HOOK (0-10 detik)',
        content: '"Hi [Name], this is [Your Name] from [Company]. I noticed your [specific observation about their business] and I think I can help you [specific benefit]. Do you have 30 seconds?"',
        contentId: '"Halo [Nama], saya [Nama Anda] dari [Perusahaan]. Saya lihat [observasi spesifik tentang bisnis mereka] dan saya yakin bisa bantu [benefit spesifik]. Ada 30 detik?"',
        timing: '10 detik'
      },
      {
        name: '💡 VALUE PROP (10-30 detik)',
        content: '"We help companies like [similar company] achieve [specific result] in [timeframe]. Most of our clients see [metric] improvement within [period]."',
        contentId: '"Kami bantu perusahaan seperti [perusahaan serupa] mencapai [hasil spesifik] dalam [waktu]. Kebanyakan klien kami lihat peningkatan [metrik] dalam [periode]."',
        timing: '20 detik'
      },
      {
        name: '🎯 QUALIFY',
        content: '"Quick question - are you currently [pain point question]? / Who handles [relevant area] at your company?"',
        contentId: '"Pertanyaan singkat - apakah saat ini Anda [pertanyaan pain point]? / Siapa yang handle [area relevan] di perusahaan Anda?"',
        timing: '15 detik'
      },
      {
        name: '📅 CTA',
        content: '"I\'d love to show you how this works in 15 minutes. Are you free [specific day/time] or [alternative]?"',
        contentId: '"Saya ingin tunjukkan cara kerjanya dalam 15 menit. Apakah Anda free [hari/waktu spesifik] atau [alternatif]?"',
        timing: '10 detik'
      }
    ]
  },
  {
    id: 'sales-pitch',
    name: 'Sales Pitch (Meeting)',
    nameId: 'Sales Pitch (Meeting)',
    icon: <Presentation className="w-5 h-5" />,
    description: 'Face-to-face or video meeting pitch structure',
    descriptionId: 'Struktur pitch untuk meeting tatap muka atau video',
    sections: [
      {
        name: '🤝 RAPPORT (0-2 menit)',
        content: 'Small talk + acknowledge their time. "Thanks for meeting with me. Before we dive in, I saw [personalized observation]. That\'s impressive!"',
        contentId: 'Small talk + hargai waktu mereka. "Terima kasih sudah meeting. Sebelum mulai, saya lihat [observasi personal]. Keren banget!"',
        timing: '2 menit'
      },
      {
        name: '🔍 DISCOVERY (5-10 menit)',
        content: 'Ask open-ended questions: "What\'s your biggest challenge with [area]?" "Walk me through your current process." "What would success look like for you?"',
        contentId: 'Tanya pertanyaan terbuka: "Apa tantangan terbesar Anda di [area]?" "Ceritakan proses saat ini." "Seperti apa kesuksesan menurut Anda?"',
        timing: '5-10 menit'
      },
      {
        name: '💡 SOLUTION (10-15 menit)',
        content: 'Present solution TIED to their specific problems. "Based on what you shared about [their pain], here\'s how we solve that..." Use case studies relevant to their industry.',
        contentId: 'Presentasikan solusi TERKAIT masalah spesifik mereka. "Berdasarkan yang Anda ceritakan soal [pain mereka], ini cara kami selesaikan..." Gunakan case study relevan dengan industri mereka.',
        timing: '10-15 menit'
      },
      {
        name: '💰 VALUE & ROI',
        content: 'Quantify the value: "Our clients typically see [X%] improvement in [metric]. For a company your size, that translates to approximately [$ amount] in [benefit]."',
        contentId: 'Kuantifikasi nilai: "Klien kami biasanya lihat peningkatan [X%] di [metrik]. Untuk perusahaan ukuran Anda, itu berarti sekitar [Rp jumlah] dalam [benefit]."',
        timing: '3 menit'
      },
      {
        name: '🎯 CLOSE',
        content: 'Assumptive close: "Based on our conversation, I think [specific package] would be perfect for you. Shall we get started with [next step]?"',
        contentId: 'Assumptive close: "Berdasarkan pembicaraan kita, saya rasa [paket spesifik] cocok untuk Anda. Mau kita mulai dengan [langkah selanjutnya]?"',
        timing: '2 menit'
      }
    ]
  },
  {
    id: 'objection-handling',
    name: 'Objection Handling',
    nameId: 'Handling Keberatan',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Scripts to handle common sales objections',
    descriptionId: 'Script untuk handle keberatan umum dalam sales',
    sections: [
      {
        name: '💰 "TOO EXPENSIVE"',
        content: '"I understand budget is important. Let me ask - if price wasn\'t a factor, would this be the right solution? [If yes] Great, let\'s discuss options. Many clients felt the same way initially, but found the ROI more than justified the investment. Shall I show you the math?"',
        contentId: '"Saya paham budget itu penting. Boleh tanya - kalau harga bukan faktor, apakah ini solusi yang tepat? [Jika ya] Bagus, mari diskusi opsi. Banyak klien awalnya merasa sama, tapi ternyata ROI-nya lebih dari justify investasinya. Mau saya tunjukkan hitungannya?"',
      },
      {
        name: '⏰ "NEED TO THINK ABOUT IT"',
        content: '"Absolutely, this is an important decision. Help me understand - is there something specific you\'re unsure about? I want to make sure I\'ve addressed all your concerns." [Address specific concern, then] "If I could address that, would you be ready to move forward?"',
        contentId: '"Tentu, ini keputusan penting. Bantu saya memahami - ada yang spesifik yang Anda ragukan? Saya mau pastikan semua concern Anda terjawab." [Jawab concern spesifik, lalu] "Kalau itu teratasi, apakah Anda siap lanjut?"',
      },
      {
        name: '👥 "NEED TO DISCUSS WITH TEAM"',
        content: '"That makes sense. Who else would be involved in this decision? I\'d be happy to set up a call with everyone to address any questions directly. What works for your team\'s schedule?"',
        contentId: '"Masuk akal. Siapa lagi yang terlibat dalam keputusan ini? Saya dengan senang hati setup call bersama untuk jawab pertanyaan langsung. Kapan jadwal yang cocok untuk tim Anda?"',
      },
      {
        name: '🏢 "WE HAVE A VENDOR"',
        content: '"I appreciate you being upfront. How\'s that working out for you? [Listen] Many of our clients came from [competitor]. The main difference they found was [unique value]. Would it be worth 15 minutes to see if we could offer something better?"',
        contentId: '"Saya hargai Anda terus terang. Bagaimana performanya? [Dengarkan] Banyak klien kami pindah dari [kompetitor]. Perbedaan utama yang mereka rasakan adalah [nilai unik]. Apakah worth 15 menit untuk lihat apakah kami bisa tawarkan yang lebih baik?"',
      },
      {
        name: '❌ "NOT INTERESTED"',
        content: '"I respect that. Before I go, may I ask what specifically makes this not a fit right now? [Listen] I understand. If anything changes, I\'d love to reconnect. Is it okay if I follow up in [timeframe]?"',
        contentId: '"Saya hormati itu. Sebelum saya pergi, boleh tanya apa spesifiknya yang membuat ini tidak cocok sekarang? [Dengarkan] Saya paham. Kalau ada perubahan, saya ingin reconnect. Boleh saya follow up dalam [waktu]?"',
      }
    ]
  },
  {
    id: 'follow-up',
    name: 'Follow-up Messages',
    nameId: 'Pesan Follow-up',
    icon: <Mail className="w-5 h-5" />,
    description: 'WhatsApp/Email follow-up templates',
    descriptionId: 'Template follow-up WhatsApp/Email',
    sections: [
      {
        name: '📩 POST-MEETING (Same Day)',
        content: '"Hi [Name], great speaking with you today! As promised, here\'s [resource/proposal]. Key takeaways: 1) [Pain point] → [Solution] 2) [Expected result]. Happy to answer any questions. Talk soon!"',
        contentId: '"Hai [Nama], senang ngobrol hari ini! Sesuai janji, ini [resource/proposal]. Poin penting: 1) [Pain point] → [Solusi] 2) [Hasil yang diharapkan]. Happy bantu jawab pertanyaan. Sampai jumpa!"',
      },
      {
        name: '📅 REMINDER (2-3 Days)',
        content: '"Hi [Name], just checking in on the proposal I sent. Did you have a chance to review? I\'m here if you have any questions. Looking forward to hearing your thoughts!"',
        contentId: '"Hai [Nama], just checking in soal proposal yang saya kirim. Sudah sempat review? Saya di sini kalau ada pertanyaan. Ditunggu feedbacknya!"',
      },
      {
        name: '🔥 URGENCY (7 Days)',
        content: '"Hi [Name], wanted to give you a heads up - we have limited slots for [offer] this month. If you\'re still interested in [benefit], let\'s lock in your spot. What do you think?"',
        contentId: '"Hai [Nama], mau kasih heads up - slot [penawaran] bulan ini terbatas. Kalau masih tertarik dengan [benefit], yuk amankan slot Anda. Bagaimana?"',
      },
      {
        name: '💡 VALUE-ADD (14 Days)',
        content: '"Hi [Name], saw this article about [relevant topic] and thought of you. [Brief insight]. By the way, are you still looking to [solve pain point]? Would love to help if timing is better now."',
        contentId: '"Hai [Nama], lihat artikel tentang [topik relevan] dan kepikiran Anda. [Insight singkat]. By the way, masih mencari solusi untuk [pain point]? Ingin bantu kalau waktunya lebih tepat sekarang."',
      }
    ]
  },
  {
    id: 'elevator-pitch',
    name: 'Elevator Pitch (30s)',
    nameId: 'Elevator Pitch (30 detik)',
    icon: <Zap className="w-5 h-5" />,
    description: 'Quick intro for networking events',
    descriptionId: 'Intro singkat untuk acara networking',
    sections: [
      {
        name: '🎯 THE FORMULA',
        content: '"I help [target audience] [achieve desired outcome] without [common pain point]. For example, [brief case study]. I\'m looking to connect with [ideal prospect]."',
        contentId: '"Saya bantu [target audience] [capai hasil yang diinginkan] tanpa [pain point umum]. Contohnya, [case study singkat]. Saya ingin connect dengan [prospek ideal]."',
      },
      {
        name: '📝 EXAMPLE 1 (SaaS)',
        content: '"I help growing startups reduce their customer churn by 40% without hiring extra support staff. Last month, we helped [Company] save $50K in retention. I\'m looking to connect with founders scaling past their first 100 customers."',
        contentId: '"Saya bantu startup berkembang kurangi customer churn 40% tanpa hire staf support tambahan. Bulan lalu, kami bantu [Perusahaan] hemat Rp700jt di retention. Saya ingin connect dengan founder yang scaling melewati 100 customer pertama."',
      },
      {
        name: '📝 EXAMPLE 2 (Service)',
        content: '"I help busy executives communicate with confidence on camera without spending months in training. In just 2 weeks, our clients go from camera-shy to commanding presence. I work best with leaders who have upcoming speaking opportunities."',
        contentId: '"Saya bantu eksekutif sibuk komunikasi dengan percaya diri di kamera tanpa butuh bulan-bulan training. Dalam 2 minggu, klien kami dari camera-shy jadi punya commanding presence. Saya cocok dengan leader yang punya kesempatan speaking mendatang."',
      }
    ]
  }
];

// Helper to get random item from array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Get random indices for placeholders (regenerates on each component mount)
const getRandomPlaceholders = () => ({
  company: getRandomItem(COMPANY_EXAMPLES),
  product: getRandomItem(PRODUCT_EXAMPLES),
  target: getRandomItem(TARGET_EXAMPLES),
  pain: getRandomItem(PAIN_EXAMPLES),
  value: getRandomItem(VALUE_EXAMPLES),
});

export function SalesScriptGenerator() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate | null>(null);
  const [customizations, setCustomizations] = useState({
    companyName: '',
    productName: '',
    targetAudience: '',
    painPoint: '',
    uniqueValue: '',
  });
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Rotating placeholders - different for each user/session
  const [placeholders, setPlaceholders] = useState(getRandomPlaceholders);
  
  // Random motivational quote
  const [currentQuote, setCurrentQuote] = useState(() => getRandomItem(MOTIVATIONAL_QUOTES));
  
  const refreshPlaceholders = () => {
    setPlaceholders(getRandomPlaceholders());
  };
  
  const refreshQuote = () => {
    setCurrentQuote(getRandomItem(MOTIVATIONAL_QUOTES));
  };

  const handleCopy = (content: string, sectionName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(sectionName);
    toast({
      title: t('Copied!', 'Disalin!'),
      description: t('Script copied to clipboard', 'Script disalin ke clipboard'),
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const personalizeScript = (content: string): string => {
    let personalized = content;
    if (customizations.companyName) {
      personalized = personalized.replace(/\[Company\]/g, customizations.companyName);
      personalized = personalized.replace(/\[Perusahaan\]/g, customizations.companyName);
    }
    if (customizations.productName) {
      personalized = personalized.replace(/\[Product\]/g, customizations.productName);
      personalized = personalized.replace(/\[Produk\]/g, customizations.productName);
    }
    if (customizations.targetAudience) {
      personalized = personalized.replace(/\[target audience\]/g, customizations.targetAudience);
    }
    if (customizations.painPoint) {
      personalized = personalized.replace(/\[pain point\]/g, customizations.painPoint);
      personalized = personalized.replace(/\[Pain point\]/g, customizations.painPoint);
    }
    if (customizations.uniqueValue) {
      personalized = personalized.replace(/\[unique value\]/g, customizations.uniqueValue);
      personalized = personalized.replace(/\[nilai unik\]/g, customizations.uniqueValue);
    }
    return personalized;
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-purple-400" />
            {t('Sales Script Generator', 'Generator Script Sales')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t(
              'Ready-to-use scripts for cold calls, sales meetings, objection handling, and follow-ups. Customize with your details!',
              'Script siap pakai untuk cold call, meeting sales, handling keberatan, dan follow-up. Personalisasi dengan detail Anda!'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SCRIPT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedTemplate?.id === template.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-full ${
                    selectedTemplate?.id === template.id ? 'bg-purple-500/30' : 'bg-gray-700/50'
                  }`}>
                    {template.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {t(template.name, template.nameId)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <>
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                {t('Quick Customization', 'Personalisasi Cepat')}
              </CardTitle>
              <CardDescription>
                {t('Fill in your details to personalize the scripts', 'Isi detail Anda untuk personalisasi script')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">{t('Company Name', 'Nama Perusahaan')}</Label>
                  <Input
                    placeholder={language === 'id' ? placeholders.company.nameId : placeholders.company.name}
                    value={customizations.companyName}
                    onChange={(e) => setCustomizations({ ...customizations, companyName: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('Product/Service', 'Produk/Layanan')}</Label>
                  <Input
                    placeholder={language === 'id' ? placeholders.product.nameId : placeholders.product.name}
                    value={customizations.productName}
                    onChange={(e) => setCustomizations({ ...customizations, productName: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('Target Audience', 'Target Audience')}</Label>
                  <Input
                    placeholder={language === 'id' ? placeholders.target.nameId : placeholders.target.name}
                    value={customizations.targetAudience}
                    onChange={(e) => setCustomizations({ ...customizations, targetAudience: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('Main Pain Point', 'Pain Point Utama')}</Label>
                  <Input
                    placeholder={language === 'id' ? placeholders.pain.nameId : placeholders.pain.name}
                    value={customizations.painPoint}
                    onChange={(e) => setCustomizations({ ...customizations, painPoint: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('Unique Value', 'Nilai Unik')}</Label>
                  <Input
                    placeholder={language === 'id' ? placeholders.value.nameId : placeholders.value.name}
                    value={customizations.uniqueValue}
                    onChange={(e) => setCustomizations({ ...customizations, uniqueValue: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshPlaceholders}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {t('New Examples', 'Contoh Baru')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedTemplate.icon}
                {t(selectedTemplate.name, selectedTemplate.nameId)}
              </CardTitle>
              <CardDescription>
                {t(selectedTemplate.description, selectedTemplate.descriptionId)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTemplate.sections.map((section, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{section.name}</span>
                      {section.timing && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {section.timing}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(
                        personalizeScript(t(section.content, section.contentId)),
                        section.name
                      )}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSection === section.name ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {personalizeScript(t(section.content, section.contentId))}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Motivational Quote Section */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-cyan-900/30 border border-purple-500/20">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-lg text-white italic leading-relaxed">
              "{language === 'id' ? currentQuote.quoteId : currentQuote.quote}"
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-purple-300">— {currentQuote.author}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshQuote}
                className="text-gray-400 hover:text-white text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                {t('New Quote', 'Quote Baru')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
