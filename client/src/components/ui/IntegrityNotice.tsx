import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export function IntegrityNotice() {
  const { t } = useLanguage();
  
  return (
    <div className="bg-amber-950/20 border-l-4 border-amber-600/50 rounded-r-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-200 mb-1">
            {t('Integrity Notice', 'Peringatan Integritas')}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t(
              'BIAS23 does NOT provide services to increase followers, views, likes, or artificial engagement. This system is designed for behavioral auditing, education, and algorithmic risk mitigation to support safe and sustainable account growth.',
              'BIAS23 TIDAK menyediakan layanan penambah followers, views, likes, atau engagement palsu. Sistem ini dibuat untuk audit perilaku, edukasi, dan mitigasi risiko algoritma agar pertumbuhan akun lebih aman dan berkelanjutan.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
