import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, AlertTriangle, Ban, CreditCard, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function Terms() {
  const { t, language } = useLanguage();
  const lastUpdated = "9 Desember 2024";

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 mb-4">
            <FileText className="w-3 h-3 mr-1" />
            {t("Terms of Service", "Syarat & Ketentuan")}
          </Badge>
          <h1 className="text-3xl font-bold mb-4 text-white">
            {t("Terms of Service", "Syarat & Ketentuan")}
          </h1>
          <p className="text-gray-400">
            {t("Last updated", "Terakhir diperbarui")}: {lastUpdated}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Scale className="w-5 h-5 text-pink-500" />
                {t("Acceptance of Terms", "Penerimaan Ketentuan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "Dengan mengakses dan menggunakan BiAS Pro, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami."
                  : "By accessing and using BiAS Pro, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-cyan-500" />
                {t("Service Description", "Deskripsi Layanan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "BiAS Pro adalah platform analisis perilaku berbasis Ai yang menyediakan:"
                  : "BiAS Pro is an Ai-powered behavioral analysis platform that provides:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Ai mentoring for TikTok creators and marketing professionals", "Ai mentoring untuk kreator TikTok dan profesional marketing")}</li>
                <li>{t("Behavioral communication analysis using 8-layer BIAS framework", "Analisis komunikasi perilaku menggunakan framework 8-layer BIAS")}</li>
                <li>{t("Script generation and optimization tools", "Alat pembuatan dan optimisasi script")}</li>
                <li>{t("Educational resources and knowledge library", "Sumber edukasi dan knowledge library")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5 text-green-500" />
                {t("Free & Premium Services", "Layanan Gratis & Premium")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "BiAS Pro menawarkan layanan gratis dengan batasan harian yang direset setiap 24 jam. Layanan premium akan tersedia dengan fitur tambahan dan batasan yang lebih tinggi."
                  : "BiAS Pro offers free services with daily limits that reset every 24 hours. Premium services will be available with additional features and higher limits."}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Free tier: Limited daily usage, resets every 24 hours", "Tier gratis: Penggunaan harian terbatas, reset setiap 24 jam")}</li>
                <li>{t("Premium tiers: Coming soon with extended features", "Tier premium: Segera hadir dengan fitur tambahan")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Ban className="w-5 h-5 text-red-500" />
                {t("Prohibited Uses", "Penggunaan Terlarang")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>{t("You may NOT use BiAS Pro for:", "Anda TIDAK boleh menggunakan BiAS Pro untuk:")}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Creating misleading or fraudulent content", "Membuat konten menyesatkan atau penipuan")}</li>
                <li>{t("Generating hate speech or discriminatory material", "Menghasilkan ujaran kebencian atau materi diskriminatif")}</li>
                <li>{t("Violating intellectual property rights", "Melanggar hak kekayaan intelektual")}</li>
                <li>{t("Attempting to hack, exploit, or abuse our systems", "Mencoba meretas, mengeksploitasi, atau menyalahgunakan sistem kami")}</li>
                <li>{t("Automated scraping or data extraction", "Scraping otomatis atau ekstraksi data")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                {t("Disclaimer", "Penafian")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Ai recommendations are suggestions, not guarantees of success", "Rekomendasi Ai adalah saran, bukan jaminan keberhasilan")}</li>
                <li>{t("We are not responsible for how you use our analysis results", "Kami tidak bertanggung jawab atas bagaimana Anda menggunakan hasil analisis kami")}</li>
                <li>{t("Results may vary based on implementation and context", "Hasil dapat bervariasi berdasarkan implementasi dan konteks")}</li>
                <li>{t("BiAS Pro is not affiliated with TikTok or ByteDance", "BiAS Pro tidak berafiliasi dengan TikTok atau ByteDance")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <RefreshCw className="w-5 h-5 text-purple-500" />
                {t("Changes to Terms", "Perubahan Ketentuan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan diumumkan melalui platform dan berlaku segera setelah dipublikasikan. Penggunaan berkelanjutan setelah perubahan berarti Anda menerima ketentuan yang diperbarui."
                  : "We reserve the right to modify these Terms at any time. Changes will be announced through the platform and take effect immediately upon publication. Continued use after changes means you accept the updated terms."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Scale className="w-5 h-5 text-blue-500" />
                {t("Governing Law", "Hukum yang Berlaku")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui arbitrase di Indonesia."
                  : "These Terms are governed by the laws of the Republic of Indonesia. Any disputes will be resolved through arbitration in Indonesia."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
