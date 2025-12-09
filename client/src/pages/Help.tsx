import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { Link } from "wouter";

export default function Help() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      titleEn: "Ai Chat Analysis",
      titleId: "Analisis Chat Ai",
      descEn: "Chat with Ai mentor to analyze your scripts and get personalized recommendations.",
      descId: "Chat dengan mentor Ai untuk menganalisis script dan dapatkan rekomendasi personal."
    },
    {
      icon: <Video className="w-5 h-5" />,
      titleEn: "Video Analysis",
      titleId: "Analisis Video",
      descEn: "Upload video thumbnails or screenshots for Ai-powered engagement analysis.",
      descId: "Upload thumbnail video atau screenshot untuk analisis engagement berbasis Ai."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      titleEn: "A/B Hook Tester",
      titleId: "A/B Hook Tester",
      descEn: "Compare 2-5 hook variations to find the most effective opening for your content.",
      descId: "Bandingkan 2-5 variasi hook untuk menemukan pembuka paling efektif."
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      titleEn: "Batch Analysis",
      titleId: "Batch Analysis",
      descEn: "Analyze multiple videos at once to identify your best and worst performers.",
      descId: "Analisis banyak video sekaligus untuk identifikasi performa terbaik dan terburuk."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      titleEn: "Script Generator",
      titleId: "Generator Script",
      descEn: "Ready-to-use templates for cold calls, pitches, and follow-ups.",
      descId: "Template siap pakai untuk cold call, pitch, dan follow-up."
    },
    {
      icon: <Mic className="w-5 h-5" />,
      titleEn: "Voice Input",
      titleId: "Input Suara",
      descEn: "Use your microphone to input text without typing.",
      descId: "Gunakan mikrofon untuk input teks tanpa mengetik."
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
      answerEn: "Yes, BiAS Pro is fully responsive and works great on mobile browsers.",
      answerId: "Ya, BiAS Pro responsif dan berfungsi baik di browser HP."
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
      answerEn: "Free users get 10 Ai chats per day. Video analysis requires a premium subscription.",
      answerId: "Pengguna gratis mendapat 10 chat Ai per hari. Analisis video memerlukan langganan premium."
    },
    {
      questionEn: "What makes BiAS different from other tools?",
      questionId: "Apa yang membedakan BiAS dari tool lain?",
      answerEn: "BiAS uses a unique 8-layer behavioral analysis framework backed by research, not just generic Ai responses.",
      answerId: "BiAS menggunakan framework 8 layer analisis perilaku berbasis riset, bukan hanya respon Ai generik."
    },
    {
      questionEn: "Can I export my analysis results?",
      questionId: "Bisa export hasil analisis?",
      answerEn: "Yes! Use the PDF Export feature to download professional reports of your analysis.",
      answerId: "Ya! Gunakan fitur PDF Export untuk download laporan profesional dari analisis Anda."
    }
  ];

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
            <HelpCircle className="w-3 h-3 mr-1" />
            {t("Help Center", "Pusat Bantuan")}
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            {t("How to Use BiAS²³ Pro", "Cara Menggunakan BiAS²³ Pro")}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t(
              "Learn how to get the most out of Ai-powered behavioral analysis.",
              "Pelajari cara memaksimalkan analisis perilaku berbasis Ai."
            )}
          </p>
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
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">1</div>
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
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Input Your Content", "Masukkan Konten")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Paste your script, upload a video thumbnail, or use voice input.",
                        "Paste script Anda, upload thumbnail video, atau gunakan input suara."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Get Ai Analysis", "Dapatkan Analisis Ai")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Receive detailed feedback across 8 behavioral layers with actionable recommendations.",
                        "Terima feedback detail dari 8 layer perilaku dengan rekomendasi yang bisa ditindaklanjuti."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-white">{t("Chat & Improve", "Chat & Tingkatkan")}</h3>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "Ask follow-up questions to your Ai mentor for deeper insights.",
                        "Tanyakan lebih lanjut ke mentor Ai untuk insight lebih dalam."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-cyan-500" />
                {t("Features Overview", "Fitur-Fitur")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-pink-400">{feature.icon}</div>
                      <h3 className="font-semibold text-white">
                        {language === 'id' ? feature.titleId : feature.titleEn}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {language === 'id' ? feature.descId : feature.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-green-500" />
                {t("Privacy & Security", "Privasi & Keamanan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-gray-400">
                  {t(
                    "Analysis results are NOT stored on our servers",
                    "Hasil analisis TIDAK disimpan di server kami"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-gray-400">
                  {t(
                    "History is saved locally in your browser only",
                    "Riwayat hanya tersimpan lokal di browser Anda"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-gray-400">
                  {t(
                    "You can clear your history anytime from browser settings",
                    "Anda bisa hapus riwayat kapan saja dari pengaturan browser"
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-gray-400">
                  {t(
                    "No personal data collection or tracking",
                    "Tidak ada pengumpulan data pribadi atau tracking"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-yellow-500" />
                {t("Frequently Asked Questions", "Pertanyaan yang Sering Ditanyakan")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-zinc-700">
                    <AccordionTrigger className="text-white hover:text-pink-400">
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

          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
            <CardContent className="py-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("Ready to Upgrade?", "Siap Upgrade?")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t(
                  "Unlock video analysis, batch processing, and more with Premium.",
                  "Buka analisis video, batch processing, dan lainnya dengan Premium."
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
