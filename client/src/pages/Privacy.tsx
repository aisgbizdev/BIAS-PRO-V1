import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Trash2, Globe, Server } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function Privacy() {
  const { t, language } = useLanguage();
  const lastUpdated = "9 Desember 2024";

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-4">
            <Shield className="w-3 h-3 mr-1" />
            {t("Privacy Policy", "Kebijakan Privasi")}
          </Badge>
          <h1 className="text-3xl font-bold mb-4 text-white">
            {t("Privacy Policy", "Kebijakan Privasi")}
          </h1>
          <p className="text-gray-400">
            {t("Last updated", "Terakhir diperbarui")}: {lastUpdated}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-pink-500" />
                {t("Information We Collect", "Informasi yang Kami Kumpulkan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "BiAS Pro mengumpulkan informasi minimal yang diperlukan untuk menyediakan layanan:"
                  : "BiAS Pro collects minimal information necessary to provide our services:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Session ID (anonymous, auto-generated)", "Session ID (anonim, dibuat otomatis)")}</li>
                <li>{t("Language preference", "Preferensi bahasa")}</li>
                <li>{t("Analysis inputs (text, scripts) - NOT stored permanently", "Input analisis (teks, script) - TIDAK disimpan permanen")}</li>
                <li>{t("Usage statistics (aggregate, anonymous)", "Statistik penggunaan (agregat, anonim)")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="w-5 h-5 text-cyan-500" />
                {t("Data Privacy Commitment", "Komitmen Privasi Data")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p>{t("Analysis results are NOT stored on our servers", "Hasil analisis TIDAK disimpan di server kami")}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p>{t("Chat history exists only in your browser (localStorage)", "Riwayat chat hanya ada di browser Anda (localStorage)")}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p>{t("We do NOT sell or share your personal data", "Kami TIDAK menjual atau membagikan data pribadi Anda")}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p>{t("No user tracking or profiling for advertising", "Tidak ada pelacakan atau profiling untuk iklan")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Server className="w-5 h-5 text-purple-500" />
                {t("Ai Services & Third Parties", "Layanan Ai & Pihak Ketiga")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <p>
                {language === 'id' 
                  ? "BiAS Pro menggunakan layanan Ai pihak ketiga untuk analisis:"
                  : "BiAS Pro uses third-party Ai services for analysis:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>OpenAI GPT-4o-mini - {t("For behavioral analysis", "Untuk analisis perilaku")}</li>
              </ul>
              <p className="text-sm">
                {language === 'id' 
                  ? "Data yang dikirim ke Ai hanya berupa teks analisis (script/konten) tanpa informasi identitas pribadi. OpenAI tidak menyimpan data percakapan untuk training model."
                  : "Data sent to Ai consists only of analysis text (scripts/content) without personally identifiable information. OpenAI does not store conversation data for model training."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trash2 className="w-5 h-5 text-red-500" />
                {t("Your Rights", "Hak Anda")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Clear browser data anytime to delete all local history", "Hapus data browser kapan saja untuk menghapus semua riwayat lokal")}</li>
                <li>{t("Request data deletion by contacting us", "Minta penghapusan data dengan menghubungi kami")}</li>
                <li>{t("No account required - use anonymously", "Tidak perlu akun - gunakan secara anonim")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-blue-500" />
                {t("Contact", "Kontak")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 space-y-4">
              <p>
                {language === 'id' 
                  ? "Untuk pertanyaan atau bantuan, hubungi kami melalui:"
                  : "For questions or support, contact us via:"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-pink-400 text-sm">@</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("Email", "Email")}</p>
                    <a href="mailto:support@bias23.com" className="text-pink-400 hover:underline">support@bias23.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-pink-400 text-sm">♪</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("TikTok DM", "DM TikTok")}</p>
                    <a href="https://www.tiktok.com/@bias23_pro" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">@bias23_pro</a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
