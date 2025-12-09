import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Rocket, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";
import { Link } from "wouter";

function formatPrice(price: number): string {
  if (price === 0) return "Rp 0";
  if (price >= 1000) {
    return `Rp ${Math.round(price / 1000)}K`;
  }
  return `Rp ${price.toLocaleString()}`;
}

export default function Premium() {
  const { t, language } = useLanguage();
  const { pricing, settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  const activePlans = pricing.filter(p => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const fallbackPlans = [
    {
      name: "Gratis",
      slug: "gratis",
      priceIdr: 0,
      period: "month",
      descriptionEn: "Perfect for trying out",
      descriptionId: "Cocok untuk mencoba",
      featuresEn: ["10 Ai chats/day", "2 video analysis/day", "Basic knowledge base"],
      featuresId: ["10 chat Ai/hari", "2 analisis video/hari", "Knowledge base dasar"],
      isPopular: false,
    },
    {
      name: "Basic",
      slug: "basic",
      priceIdr: 10000,
      period: "month",
      descriptionEn: "For casual creators",
      descriptionId: "Untuk kreator kasual",
      featuresEn: ["Unlimited Ai chats", "10 video analysis/month", "Full knowledge base", "Save history"],
      featuresId: ["Chat Ai unlimited", "10 analisis video/bulan", "Knowledge base lengkap", "Simpan riwayat"],
      isPopular: false,
    },
    {
      name: "Pro",
      slug: "pro",
      priceIdr: 25000,
      period: "month",
      descriptionEn: "For serious creators",
      descriptionId: "Untuk kreator serius",
      featuresEn: ["Unlimited Ai chats", "30 video analysis/month", "Batch analysis", "A/B Hook testing", "Priority support"],
      featuresId: ["Chat Ai unlimited", "30 analisis video/bulan", "Batch analysis", "A/B Hook testing", "Dukungan prioritas"],
      isPopular: true,
    },
    {
      name: "Unlimited",
      slug: "unlimited",
      priceIdr: 99000,
      period: "month",
      descriptionEn: "For agencies & power users",
      descriptionId: "Untuk agensi & power user",
      featuresEn: ["Everything in Pro", "100 video analysis/month", "White-label branding", "API access", "Dedicated support"],
      featuresId: ["Semua fitur Pro", "100 analisis video/bulan", "White-label branding", "Akses API", "Dukungan khusus"],
      isPopular: false,
    },
  ];

  const displayPlans = activePlans.length > 0 ? activePlans : fallbackPlans;

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
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
              "Unlock the full power of Ai-powered behavioral analysis. Premium plans coming soon!",
              "Buka kekuatan penuh analisis perilaku berbasis Ai. Paket premium segera hadir!"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {displayPlans.map((plan, index) => {
            const features = language === 'id' ? plan.featuresId : plan.featuresEn;
            const description = language === 'id' ? plan.descriptionId : plan.descriptionEn;
            const isGratis = plan.slug === 'gratis' || plan.priceIdr === 0;
            
            return (
              <Card
                key={plan.slug || index}
                className={`bg-[#141414] border-gray-800 relative ${
                  plan.isPopular ? "ring-2 ring-pink-500 scale-105" : ""
                }`}
              >
                {plan.isPopular && (
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
                    <span className="text-3xl font-bold text-white">{formatPrice(plan.priceIdr)}</span>
                    <span className="text-gray-400 text-sm">
                      {isGratis ? t("forever", " selamanya") : t("/month", "/bulan")}
                    </span>
                  </div>
                  <CardDescription className="text-gray-400 mt-2">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {features?.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-pink-500 to-pink-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    disabled={true}
                  >
                    {isGratis ? t("Current Plan", "Paket Saat Ini") : t("Coming Soon", "Segera Hadir")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
          <p>
            {t(
              `Free during beta period (${settings.free_trial_days} days)`,
              `Gratis selama periode beta (${settings.free_trial_days} hari)`
            )}
          </p>
          <p className="mt-1">
            {t(
              `Current limit: ${settings.daily_video_limit} video analysis per day`,
              `Limit saat ini: ${settings.daily_video_limit} analisis video per hari`
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
