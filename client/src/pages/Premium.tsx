import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { Link } from "wouter";

export default function Premium() {
  const { t } = useLanguage();

  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      period: t("forever", "selamanya"),
      description: t("Perfect for trying out", "Cocok untuk mencoba"),
      features: [
        t("10 AI chats/day", "10 chat AI/hari"),
        t("No video analysis", "Tanpa analisis video"),
        t("Basic knowledge base", "Knowledge base dasar"),
      ],
      cta: t("Current Plan", "Paket Saat Ini"),
      popular: false,
      disabled: true,
    },
    {
      name: "Basic",
      price: "Rp 10K",
      period: t("/month", "/bulan"),
      description: t("For casual creators", "Untuk kreator kasual"),
      features: [
        t("Unlimited AI chats", "Chat AI unlimited"),
        t("10 video analysis/month", "10 analisis video/bulan"),
        t("Full knowledge base", "Knowledge base lengkap"),
        t("Save history", "Simpan riwayat"),
      ],
      cta: t("Coming Soon", "Segera Hadir"),
      popular: false,
      disabled: true,
    },
    {
      name: "Pro",
      price: "Rp 25K",
      period: t("/month", "/bulan"),
      description: t("For serious creators", "Untuk kreator serius"),
      features: [
        t("Unlimited AI chats", "Chat AI unlimited"),
        t("30 video analysis/month", "30 analisis video/bulan"),
        t("Batch analysis", "Batch analysis"),
        t("A/B Hook testing", "A/B Hook testing"),
        t("Priority support", "Dukungan prioritas"),
      ],
      cta: t("Coming Soon", "Segera Hadir"),
      popular: true,
      disabled: true,
    },
    {
      name: "Unlimited",
      price: "Rp 99K",
      period: t("/month", "/bulan"),
      description: t("For agencies & power users", "Untuk agensi & power user"),
      features: [
        t("Everything in Pro", "Semua fitur Pro"),
        t("100 video analysis/month", "100 analisis video/bulan"),
        t("White-label branding", "White-label branding"),
        t("API access", "Akses API"),
        t("Dedicated support", "Dukungan khusus"),
      ],
      cta: t("Coming Soon", "Segera Hadir"),
      popular: false,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            {t("Coming Soon", "Segera Hadir")}
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            BiAS²³ Pro Premium
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t(
              "Unlock the full power of AI-powered behavioral analysis. Premium plans coming soon!",
              "Buka kekuatan penuh analisis perilaku berbasis AI. Paket premium segera hadir!"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-[#141414] border-gray-800 relative ${
                plan.popular ? "ring-2 ring-pink-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-pink-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    {t("Most Popular", "Paling Populer")}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-pink-500 to-pink-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  disabled={plan.disabled}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Rocket className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("Early Bird Offer", "Penawaran Early Bird")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t(
                  "Sign up now and get 50% off when premium launches! Limited time offer.",
                  "Daftar sekarang dan dapatkan diskon 50% saat premium diluncurkan! Penawaran terbatas."
                )}
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    {t("Back to App", "Kembali ke Aplikasi")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>{t("Free during beta period (3 months)", "Gratis selama periode beta (3 bulan)")}</p>
          <p className="mt-1">
            {t("Current limit: 5 video analysis per day", "Limit saat ini: 5 analisis video per hari")}
          </p>
        </div>
      </div>
    </div>
  );
}
