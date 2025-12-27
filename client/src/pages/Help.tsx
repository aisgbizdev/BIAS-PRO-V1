import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Video, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  Mic, 
  BarChart3,
  Shield,
  CreditCard,
  ArrowRight,
  BookOpen,
  Zap,
  Search,
  Users,
  Camera,
  GitCompare,
  Download,
  Save,
  Bot,
  Trophy,
  ScrollText
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useLanguage } from "@/lib/languageContext";
import { Link } from "wouter";

export default function Help() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const tutorials = [
    {
      id: "tiktok-account",
      icon: <Users className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "Account Analysis",
      titleId: "Analisis Akun",
      descEn: "Analyze any public TikTok account to get behavioral insights and growth recommendations.",
      descId: "Analisis akun TikTok publik manapun untuk mendapatkan insight perilaku dan rekomendasi pertumbuhan.",
      stepsEn: [
        "Go to TikTok Pro from the homepage",
        "Stay on the 'Analytics' tab, select 'Akun' sub-tab",
        "Enter a TikTok username (without @)",
        "Click 'Analyze' and wait for results",
        "View follower stats, engagement rate, and AI recommendations"
      ],
      stepsId: [
        "Buka TikTok Pro dari halaman utama",
        "Tetap di tab 'Analytics', pilih sub-tab 'Akun'",
        "Masukkan username TikTok (tanpa @)",
        "Klik 'Analyze' dan tunggu hasilnya",
        "Lihat statistik follower, engagement rate, dan rekomendasi AI"
      ],
      keywords: ["account", "akun", "tiktok", "follower", "analytics", "analitik", "profile", "profil"]
    },
    {
      id: "video-analysis",
      icon: <Video className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "Video Analysis",
      titleId: "Analisis Video",
      descEn: "Upload a video file to get comprehensive analysis including audio, visuals, and behavioral patterns.",
      descId: "Upload file video untuk analisis komprehensif termasuk audio, visual, dan pola perilaku.",
      stepsEn: [
        "Go to TikTok Pro → Analytics → Video tab",
        "Click 'Choose File' or drag & drop your video",
        "Wait for AI to process (audio transcription + visual analysis)",
        "Review the 8-layer BIAS analysis results",
        "Use 'Discuss with AI' to ask follow-up questions"
      ],
      stepsId: [
        "Buka TikTok Pro → Analytics → tab Video",
        "Klik 'Choose File' atau drag & drop video Anda",
        "Tunggu AI memproses (transkripsi audio + analisis visual)",
        "Review hasil analisis 8 layer BIAS",
        "Gunakan 'Diskusi dengan AI' untuk bertanya lebih lanjut"
      ],
      keywords: ["video", "upload", "analysis", "analisis", "8 layer", "bias", "audio", "visual"]
    },
    {
      id: "screenshot-analysis",
      icon: <Camera className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "Screenshot Analysis",
      titleId: "Analisis Screenshot",
      descEn: "Upload a screenshot of your TikTok analytics or video thumbnail for quick AI feedback.",
      descId: "Upload screenshot dari analytics TikTok atau thumbnail video untuk feedback AI cepat.",
      stepsEn: [
        "Go to TikTok Pro → Analytics → Screenshot tab",
        "Upload a screenshot image (PNG/JPG)",
        "AI will analyze the content and metrics visible",
        "Get instant recommendations based on what AI sees"
      ],
      stepsId: [
        "Buka TikTok Pro → Analytics → tab Screenshot",
        "Upload gambar screenshot (PNG/JPG)",
        "AI akan menganalisis konten dan metrik yang terlihat",
        "Dapatkan rekomendasi instan berdasarkan yang dilihat AI"
      ],
      keywords: ["screenshot", "gambar", "image", "thumbnail", "analytics", "analitik", "capture"]
    },
    {
      id: "competitor-compare",
      icon: <GitCompare className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "Competitor Compare",
      titleId: "Bandingkan Kompetitor",
      descEn: "Compare up to 3 TikTok accounts side-by-side to benchmark your performance.",
      descId: "Bandingkan hingga 3 akun TikTok secara berdampingan untuk benchmark performa Anda.",
      stepsEn: [
        "Go to TikTok Pro → Analytics → Compare tab",
        "Enter 2-3 TikTok usernames to compare",
        "Click 'Compare' to analyze all accounts",
        "View side-by-side metrics: followers, engagement, growth",
        "Read AI insights on competitive advantages"
      ],
      stepsId: [
        "Buka TikTok Pro → Analytics → tab Compare",
        "Masukkan 2-3 username TikTok untuk dibandingkan",
        "Klik 'Compare' untuk analisis semua akun",
        "Lihat metrik berdampingan: follower, engagement, pertumbuhan",
        "Baca insight AI tentang keunggulan kompetitif"
      ],
      keywords: ["compare", "bandingkan", "competitor", "kompetitor", "benchmark", "versus", "vs"]
    },
    {
      id: "batch-analysis",
      icon: <BarChart3 className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "Batch Analysis",
      titleId: "Batch Analysis",
      descEn: "Analyze 2-10 videos at once to find your best and worst performing content.",
      descId: "Analisis 2-10 video sekaligus untuk menemukan konten terbaik dan terburuk Anda.",
      stepsEn: [
        "Go to TikTok Pro → Analytics → Batch tab",
        "Upload 2-10 video files at once",
        "Wait for AI to process all videos",
        "See ranked results: best performer, worst performer",
        "Get overall patterns and improvement suggestions"
      ],
      stepsId: [
        "Buka TikTok Pro → Analytics → tab Batch",
        "Upload 2-10 file video sekaligus",
        "Tunggu AI memproses semua video",
        "Lihat hasil ranking: performa terbaik, performa terburuk",
        "Dapatkan pola keseluruhan dan saran perbaikan"
      ],
      keywords: ["batch", "multiple", "banyak", "bulk", "compare", "ranking", "best", "worst"]
    },
    {
      id: "ab-hook-tester",
      icon: <Zap className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "A/B Hook Tester",
      titleId: "A/B Hook Tester",
      descEn: "Compare 2-5 hook variations to find the most engaging opening for your content.",
      descId: "Bandingkan 2-5 variasi hook untuk menemukan pembuka paling menarik untuk konten Anda.",
      stepsEn: [
        "Go to TikTok Pro → Analytics → A/B tab",
        "Enter 2-5 different hook variations",
        "Click 'Test Hooks' to analyze",
        "See which hook wins with AI scoring",
        "Read strengths and weaknesses of each hook"
      ],
      stepsId: [
        "Buka TikTok Pro → Analytics → tab A/B",
        "Masukkan 2-5 variasi hook berbeda",
        "Klik 'Test Hooks' untuk analisis",
        "Lihat hook mana yang menang dengan skor AI",
        "Baca kelebihan dan kekurangan tiap hook"
      ],
      keywords: ["hook", "ab", "a/b", "test", "opening", "pembuka", "viral", "compare"]
    },
    {
      id: "ai-coach-tiktok",
      icon: <Bot className="w-5 h-5" />,
      category: "TikTok Pro",
      titleEn: "AI Coach (TikTok)",
      titleId: "AI Coach (TikTok)",
      descEn: "Chat with AI Coach about anything TikTok: FYP algorithm, viral strategies, live streaming tips.",
      descId: "Chat dengan AI Coach tentang semua hal TikTok: algoritma FYP, strategi viral, tips live streaming.",
      stepsEn: [
        "Go to TikTok Pro → Click 'AI Coach' tab",
        "Type your question in the chat box",
        "Ask about: FYP, viral hooks, live tips, content ideas",
        "AI will respond with personalized advice",
        "Continue the conversation for deeper insights"
      ],
      stepsId: [
        "Buka TikTok Pro → Klik tab 'AI Coach'",
        "Ketik pertanyaan di kotak chat",
        "Tanya tentang: FYP, hook viral, tips live, ide konten",
        "AI akan merespons dengan saran personal",
        "Lanjutkan percakapan untuk insight lebih dalam"
      ],
      keywords: ["ai", "coach", "mentor", "chat", "tiktok", "fyp", "viral", "live", "streaming"]
    },
    {
      id: "marketing-analyze",
      icon: <Zap className="w-5 h-5" />,
      category: "Marketing Pro",
      titleEn: "Video/Script Analyze",
      titleId: "Analisis Video/Script",
      descEn: "Upload sales videos or marketing presentations for behavioral analysis.",
      descId: "Upload video sales atau presentasi marketing untuk analisis perilaku.",
      stepsEn: [
        "Go to Marketing Pro from homepage",
        "Stay on 'Analyze' tab",
        "Upload your sales video or presentation recording",
        "AI analyzes: voice tone, confidence, persuasion techniques",
        "Get 8-layer BIAS feedback with improvement tips"
      ],
      stepsId: [
        "Buka Marketing Pro dari halaman utama",
        "Tetap di tab 'Analisis'",
        "Upload video sales atau rekaman presentasi",
        "AI menganalisis: nada suara, kepercayaan diri, teknik persuasi",
        "Dapatkan feedback 8 layer BIAS dengan tips perbaikan"
      ],
      keywords: ["marketing", "sales", "pitch", "presentasi", "presentation", "video", "analyze"]
    },
    {
      id: "script-review",
      icon: <FileText className="w-5 h-5" />,
      category: "Marketing Pro",
      titleEn: "Script Review",
      titleId: "Review Script",
      descEn: "Paste your sales script or pitch text for AI feedback and improvements.",
      descId: "Paste script sales atau teks pitch Anda untuk feedback dan perbaikan AI.",
      stepsEn: [
        "Go to Marketing Pro → 'Review' tab",
        "Select script type: Sales Pitch, Cold Call, Presentation, etc.",
        "Paste your script text in the box",
        "Click 'Review' for AI analysis",
        "Get line-by-line feedback and suggested rewrites"
      ],
      stepsId: [
        "Buka Marketing Pro → tab 'Review'",
        "Pilih tipe script: Sales Pitch, Cold Call, Presentasi, dll.",
        "Paste teks script di kotak",
        "Klik 'Review' untuk analisis AI",
        "Dapatkan feedback per baris dan saran penulisan ulang"
      ],
      keywords: ["script", "review", "text", "teks", "sales", "pitch", "cold call", "writing"]
    },
    {
      id: "ai-coach-marketing",
      icon: <Bot className="w-5 h-5" />,
      category: "Marketing Pro",
      titleEn: "AI Coach (Marketing)",
      titleId: "AI Coach (Marketing)",
      descEn: "Chat with AI Coach about sales, leadership, negotiation, and professional communication.",
      descId: "Chat dengan AI Coach tentang sales, leadership, negosiasi, dan komunikasi profesional.",
      stepsEn: [
        "Go to Marketing Pro → Click 'AI Coach' tab",
        "Type your question in the chat",
        "Ask about: closing techniques, objection handling, leadership",
        "AI provides tailored advice based on context",
        "Use for practice scenarios and role-playing"
      ],
      stepsId: [
        "Buka Marketing Pro → Klik tab 'AI Coach'",
        "Ketik pertanyaan di chat",
        "Tanya tentang: teknik closing, handling keberatan, leadership",
        "AI memberikan saran yang disesuaikan konteks",
        "Gunakan untuk skenario latihan dan role-play"
      ],
      keywords: ["ai", "coach", "marketing", "sales", "leadership", "negotiation", "negosiasi", "closing"]
    },
    {
      id: "voice-input",
      icon: <Mic className="w-5 h-5" />,
      category: "General",
      titleEn: "Voice Input",
      titleId: "Input Suara",
      descEn: "Use your microphone to input text without typing - great for mobile users.",
      descId: "Gunakan mikrofon untuk input teks tanpa mengetik - cocok untuk pengguna mobile.",
      stepsEn: [
        "Look for the microphone icon in any text input",
        "Click the mic icon to start recording",
        "Speak clearly in Indonesian or English",
        "Your speech is converted to text automatically",
        "Edit if needed, then submit"
      ],
      stepsId: [
        "Cari ikon mikrofon di input teks manapun",
        "Klik ikon mic untuk mulai merekam",
        "Bicara dengan jelas dalam Bahasa Indonesia atau Inggris",
        "Ucapan Anda dikonversi ke teks secara otomatis",
        "Edit jika perlu, lalu submit"
      ],
      keywords: ["voice", "suara", "mic", "microphone", "mikrofon", "speech", "talk", "bicara"]
    },
    {
      id: "pdf-export",
      icon: <Download className="w-5 h-5" />,
      category: "General",
      titleEn: "PDF Export",
      titleId: "Export PDF",
      descEn: "Download your analysis results as a professional PDF report.",
      descId: "Download hasil analisis Anda sebagai laporan PDF profesional.",
      stepsEn: [
        "Complete any analysis (video, script, account)",
        "Scroll to the analysis results section",
        "Click the 'Download PDF' button",
        "PDF is generated with your full analysis",
        "Save or share the report as needed"
      ],
      stepsId: [
        "Selesaikan analisis apapun (video, script, akun)",
        "Scroll ke bagian hasil analisis",
        "Klik tombol 'Download PDF'",
        "PDF dibuat dengan analisis lengkap Anda",
        "Simpan atau bagikan laporan sesuai kebutuhan"
      ],
      keywords: ["pdf", "export", "download", "report", "laporan", "save", "simpan", "print"]
    },
    {
      id: "save-history",
      icon: <Save className="w-5 h-5" />,
      category: "General",
      titleEn: "Save History",
      titleId: "Simpan Riwayat",
      descEn: "Your analysis results are automatically saved locally for future reference.",
      descId: "Hasil analisis Anda otomatis tersimpan secara lokal untuk referensi di masa depan.",
      stepsEn: [
        "Complete any analysis",
        "Results are auto-saved to your browser",
        "View saved history in the 'History' section",
        "Click any saved item to view full details",
        "Delete unwanted items with the trash icon"
      ],
      stepsId: [
        "Selesaikan analisis apapun",
        "Hasil otomatis tersimpan di browser Anda",
        "Lihat riwayat tersimpan di bagian 'History'",
        "Klik item tersimpan untuk melihat detail lengkap",
        "Hapus item yang tidak diinginkan dengan ikon tempat sampah"
      ],
      keywords: ["history", "riwayat", "save", "simpan", "local", "lokal", "storage", "browser"]
    },
    {
      id: "library",
      icon: <BookOpen className="w-5 h-5" />,
      category: "General",
      titleEn: "Knowledge Library",
      titleId: "Perpustakaan Pengetahuan",
      descEn: "Browse glossary terms, TikTok rules, marketing tips, and community contributions.",
      descId: "Jelajahi istilah glosarium, aturan TikTok, tips marketing, dan kontribusi komunitas.",
      stepsEn: [
        "Click 'Library' in the navigation menu",
        "Browse tabs: Glossary, TikTok, Marketing, BIAS, Rules",
        "Use search to find specific terms",
        "Click any item to expand details",
        "Contribute your own knowledge via 'Submit' button"
      ],
      stepsId: [
        "Klik 'Library' di menu navigasi",
        "Jelajahi tab: Glosarium, TikTok, Marketing, BIAS, Aturan",
        "Gunakan pencarian untuk menemukan istilah tertentu",
        "Klik item apapun untuk melihat detail",
        "Kontribusi pengetahuan Anda via tombol 'Submit'"
      ],
      keywords: ["library", "perpustakaan", "glossary", "glosarium", "terms", "istilah", "rules", "aturan"]
    },
    {
      id: "platform-rules",
      icon: <ScrollText className="w-5 h-5" />,
      category: "General",
      titleEn: "Platform Rules",
      titleId: "Aturan Platform",
      descEn: "Searchable database of official TikTok community guidelines to stay compliant.",
      descId: "Database aturan komunitas TikTok resmi yang bisa dicari untuk tetap patuh.",
      stepsEn: [
        "Go to Library → 'Rules' tab",
        "Browse categories: Content, Safety, Monetization, etc.",
        "Use search to find specific rules",
        "Each rule includes official guidance",
        "Stay updated to avoid account violations"
      ],
      stepsId: [
        "Buka Library → tab 'Aturan'",
        "Jelajahi kategori: Konten, Keamanan, Monetisasi, dll.",
        "Gunakan pencarian untuk menemukan aturan spesifik",
        "Setiap aturan mencakup panduan resmi",
        "Tetap update untuk menghindari pelanggaran akun"
      ],
      keywords: ["rules", "aturan", "guidelines", "panduan", "community", "komunitas", "tiktok", "policy"]
    },
    {
      id: "success-stories",
      icon: <Trophy className="w-5 h-5" />,
      category: "General",
      titleEn: "Success Stories",
      titleId: "Cerita Sukses",
      descEn: "Share your success story and get featured on the homepage to inspire others.",
      descId: "Bagikan cerita sukses Anda dan tampil di halaman utama untuk menginspirasi orang lain.",
      stepsEn: [
        "Go to Library → 'Sukses' tab",
        "Click 'Share Your Story' button",
        "Fill in: your name, platform, story details",
        "Submit for admin review",
        "If approved, your story appears on homepage"
      ],
      stepsId: [
        "Buka Library → tab 'Sukses'",
        "Klik tombol 'Bagikan Cerita Anda'",
        "Isi: nama Anda, platform, detail cerita",
        "Submit untuk review admin",
        "Jika disetujui, cerita Anda tampil di homepage"
      ],
      keywords: ["success", "sukses", "story", "cerita", "testimonial", "share", "bagikan", "featured"]
    }
  ];

  const faqs = [
    {
      questionEn: "Is my data safe and private?",
      questionId: "Apakah data saya aman dan privat?",
      answerEn: "Yes! We don't store your analysis results on our servers. All history is saved locally in your browser only.",
      answerId: "Ya! Kami tidak menyimpan hasil analisis di server. Semua riwayat tersimpan lokal di browser Anda saja."
    },
    {
      questionEn: "Can I use this on my phone?",
      questionId: "Bisa diakses dari HP?",
      answerEn: "Yes, BiAS Pro is fully responsive and works great on mobile browsers. You can also install it as an app.",
      answerId: "Ya, BiAS Pro responsif dan berfungsi baik di browser HP. Anda juga bisa install sebagai aplikasi."
    },
    {
      questionEn: "What languages are supported?",
      questionId: "Bahasa apa yang didukung?",
      answerEn: "We support Indonesian and English. Click the language toggle in the header to switch.",
      answerId: "Kami mendukung Bahasa Indonesia dan English. Klik tombol bahasa di header untuk mengganti."
    },
    {
      questionEn: "How many free analyses can I do?",
      questionId: "Berapa analisis gratis yang bisa dilakukan?",
      answerEn: "Free users get 10 AI chats per day. Check the usage indicator in the header to see remaining quota.",
      answerId: "Pengguna gratis mendapat 10 chat AI per hari. Cek indikator penggunaan di header untuk melihat kuota tersisa."
    },
    {
      questionEn: "What makes BiAS different from other tools?",
      questionId: "Apa yang membedakan BiAS dari tool lain?",
      answerEn: "BiAS uses a unique 8-layer behavioral analysis framework backed by research, not just generic AI responses.",
      answerId: "BiAS menggunakan framework 8 layer analisis perilaku berbasis riset, bukan hanya respon AI generik."
    },
    {
      questionEn: "What are the 8 layers of BIAS analysis?",
      questionId: "Apa saja 8 layer analisis BIAS?",
      answerEn: "VBM (Values), EPM (Emotions), NLP (Language), ETH (Ethics), ECO (Economy), SOC (Social), COG (Cognitive), BMIL (Behavioral Intention).",
      answerId: "VBM (Nilai), EPM (Emosi), NLP (Bahasa), ETH (Etika), ECO (Ekonomi), SOC (Sosial), COG (Kognitif), BMIL (Intensi Perilaku)."
    },
    {
      questionEn: "Can I export my analysis results?",
      questionId: "Bisa export hasil analisis?",
      answerEn: "Yes! Use the PDF Export feature to download professional reports of your analysis.",
      answerId: "Ya! Gunakan fitur PDF Export untuk download laporan profesional dari analisis Anda."
    },
    {
      questionEn: "How do I install BiAS Pro as an app?",
      questionId: "Bagaimana install BiAS Pro sebagai aplikasi?",
      answerEn: "On mobile, tap the share button and 'Add to Home Screen'. On desktop Chrome, click the install icon in the address bar.",
      answerId: "Di HP, tap tombol share dan 'Tambah ke Layar Utama'. Di Chrome desktop, klik ikon install di address bar."
    }
  ];

  const filteredTutorials = useMemo(() => {
    if (!searchQuery.trim()) return tutorials;
    const query = searchQuery.toLowerCase();
    return tutorials.filter(tutorial => 
      tutorial.titleEn.toLowerCase().includes(query) ||
      tutorial.titleId.toLowerCase().includes(query) ||
      tutorial.descEn.toLowerCase().includes(query) ||
      tutorial.descId.toLowerCase().includes(query) ||
      tutorial.category.toLowerCase().includes(query) ||
      tutorial.keywords.some(kw => kw.includes(query))
    );
  }, [searchQuery]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(faq =>
      faq.questionEn.toLowerCase().includes(query) ||
      faq.questionId.toLowerCase().includes(query) ||
      faq.answerEn.toLowerCase().includes(query) ||
      faq.answerId.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const categories = ["TikTok Pro", "Marketing Pro", "General"];

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
            <HelpCircle className="w-3 h-3 mr-1" />
            {t("Help Center", "Pusat Bantuan")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            {t("How to Use BiAS Pro", "Cara Menggunakan BiAS Pro")}
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-6">
            {t(
              "Complete guide for all features. Search or browse to find what you need.",
              "Panduan lengkap untuk semua fitur. Cari atau jelajahi untuk menemukan yang Anda butuhkan."
            )}
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t("Search features, tutorials, FAQ...", "Cari fitur, tutorial, FAQ...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-gray-500"
            />
            {searchQuery && (
              <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-pink-500/20 text-pink-400 border-pink-500/50">
                {filteredTutorials.length + filteredFaqs.length} {t("results", "hasil")}
              </Badge>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-pink-500" />
                {t("Quick Start Guide", "Panduan Cepat")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Choose Your Mode", "Pilih Mode Anda")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "TikTok Pro for content creators, Marketing Pro for business professionals.",
                        "TikTok Pro untuk kreator konten, Marketing Pro untuk profesional bisnis."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Run an Audit First", "Jalankan Audit Dulu")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Analyze your account, video, or script to get baseline insights.",
                        "Analisis akun, video, atau script Anda untuk mendapatkan insight awal."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Review the 8-Layer Analysis", "Review Analisis 8 Layer")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Understand your strengths and areas for improvement across behavioral dimensions.",
                        "Pahami kekuatan dan area perbaikan Anda di berbagai dimensi perilaku."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Chat with AI Coach", "Chat dengan AI Coach")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Ask follow-up questions and get personalized strategies for improvement.",
                        "Tanyakan lebih lanjut dan dapatkan strategi personal untuk perbaikan."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {categories.map(category => {
            const categoryTutorials = filteredTutorials.filter(t => t.category === category);
            if (categoryTutorials.length === 0) return null;
            
            return (
              <Card key={category} className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {category === "TikTok Pro" && <SiTiktok className="w-5 h-5 text-pink-500" />}
                    {category === "Marketing Pro" && <Sparkles className="w-5 h-5 text-purple-500" />}
                    {category === "General" && <BookOpen className="w-5 h-5 text-cyan-500" />}
                    {category}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {categoryTutorials.length} {t("features", "fitur")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {categoryTutorials.map((tutorial) => (
                      <AccordionItem key={tutorial.id} value={tutorial.id} className="border-zinc-700">
                        <AccordionTrigger className="text-white hover:text-pink-400">
                          <div className="flex items-center gap-3">
                            <div className="text-pink-400">{tutorial.icon}</div>
                            <span>{language === 'id' ? tutorial.titleId : tutorial.titleEn}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                          <p className="mb-4">
                            {language === 'id' ? tutorial.descId : tutorial.descEn}
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-white">{t("Steps:", "Langkah-langkah:")}</p>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                              {(language === 'id' ? tutorial.stepsId : tutorial.stepsEn).map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-green-500" />
                {t("Privacy & Security", "Privasi & Keamanan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400">
                  {t(
                    "Analysis results are NOT stored on our servers - your data stays private",
                    "Hasil analisis TIDAK disimpan di server kami - data Anda tetap privat"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400">
                  {t(
                    "History is saved locally in your browser only - you control your data",
                    "Riwayat hanya tersimpan lokal di browser Anda - Anda mengontrol data Anda"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400">
                  {t(
                    "Clear your history anytime by clearing browser data or using delete buttons",
                    "Hapus riwayat kapan saja dengan menghapus data browser atau menggunakan tombol hapus"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p className="text-gray-400">
                  {t(
                    "No personal data collection, tracking, or third-party sharing",
                    "Tidak ada pengumpulan data pribadi, tracking, atau berbagi ke pihak ketiga"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {filteredFaqs.length > 0 && (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <HelpCircle className="w-5 h-5 text-yellow-500" />
                  {t("Frequently Asked Questions", "Pertanyaan yang Sering Ditanyakan")}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {filteredFaqs.length} FAQ
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-zinc-700">
                      <AccordionTrigger className="text-white hover:text-pink-400 text-left">
                        {language === 'id' ? faq.questionId : faq.questionEn}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        {language === 'id' ? faq.answerId : faq.answerEn}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
            <CardContent className="py-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("Need More Features?", "Butuh Lebih Banyak Fitur?")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t(
                  "Unlock batch analysis, A/B testing, unlimited history, and more with Premium.",
                  "Buka batch analysis, A/B testing, riwayat unlimited, dan lainnya dengan Premium."
                )}
              </p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600">
                  {t("View Premium Plans", "Lihat Paket Premium")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
