import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Shield, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { Link } from "wouter";

export default function About() {
  const { t, language } = useLanguage();

  const benefits = [
    {
      icon: Brain,
      titleEn: "Ai That Learns From You",
      titleId: "Ai yang Belajar dari Kamu",
      descEn: "The more you use BIAS, the more it understands your communication style and provides personalized insights.",
      descId: "Semakin sering dipakai, semakin BIAS memahami gaya komunikasimu dan memberikan insight yang personal.",
    },
    {
      icon: Target,
      titleEn: "8-Layer Behavioral Analysis",
      titleId: "Analisis Perilaku 8 Lapis",
      descEn: "Our proprietary framework evaluates your content across 8 behavioral dimensions for comprehensive feedback.",
      descId: "Framework eksklusif kami mengevaluasi kontenmu di 8 dimensi perilaku untuk feedback komprehensif.",
    },
    {
      icon: Shield,
      titleEn: "Risk Detection & Compliance",
      titleId: "Deteksi Risiko & Kepatuhan",
      descEn: "Get early warnings about content that might violate platform guidelines or appear misleading.",
      descId: "Dapatkan peringatan dini tentang konten yang mungkin melanggar pedoman platform atau tampak menyesatkan.",
    },
  ];

  const useCases = [
    {
      en: "Analyze your TikTok videos for viral potential",
      id: "Analisis video TikTok untuk potensi viral",
    },
    {
      en: "Improve your sales pitch scripts",
      id: "Tingkatkan skrip sales pitch kamu",
    },
    {
      en: "Test different hooks with A/B comparison",
      id: "Uji berbagai hook dengan perbandingan A/B",
    },
  ];

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            {t("Behavioral Intelligence", "Kecerdasan Perilaku")}
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            {t("What is BiAS Pro?", "Apa itu BiAS Pro?")}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t(
              "BiAS Pro is an Ai-powered platform that analyzes your communication patterns and provides actionable insights to improve your content and influence.",
              "BiAS Pro adalah platform berbasis Ai yang menganalisis pola komunikasimu dan memberikan insight untuk meningkatkan konten dan pengaruhmu."
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <Card key={i} className="bg-[#141414] border-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    {language === 'id' ? benefit.titleId : benefit.titleEn}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'id' ? benefit.descId : benefit.descEn}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {t("What Can You Do?", "Apa yang Bisa Kamu Lakukan?")}
            </h2>
            <div className="space-y-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-gray-300">
                    {language === 'id' ? useCase.id : useCase.en}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 gap-2">
              {t("Start Using Now", "Mulai Gunakan Sekarang")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            {t("Free during beta period. No credit card required.", "Gratis selama periode beta. Tanpa kartu kredit.")}
          </p>
        </div>
      </div>
    </div>
  );
}
