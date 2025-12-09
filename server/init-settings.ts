import { db } from '../db';
import { appSettings, pricingTiers } from '../shared/schema';

const defaultSettings = [
  { key: 'daily_video_limit', value: '5', valueType: 'number', category: 'limits', labelEn: 'Daily Video Analysis Limit', labelId: 'Limit Analisis Video Harian', descriptionEn: 'Maximum video/screenshot analysis per day for free users', descriptionId: 'Maksimum analisis video/screenshot per hari untuk user gratis', isEditable: true },
  { key: 'daily_chat_limit', value: '50', valueType: 'number', category: 'limits', labelEn: 'Daily Chat Limit', labelId: 'Limit Chat Harian', descriptionEn: 'Maximum AI chat messages per day for free users', descriptionId: 'Maksimum pesan chat AI per hari untuk user gratis', isEditable: true },
  { key: 'enable_batch_analysis', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Batch Analysis', labelId: 'Batch Analysis', descriptionEn: 'Enable batch video analysis feature', descriptionId: 'Aktifkan fitur analisis batch video', isEditable: true },
  { key: 'enable_ab_testing', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'A/B Hook Tester', labelId: 'A/B Hook Tester', descriptionEn: 'Enable A/B hook testing feature', descriptionId: 'Aktifkan fitur A/B hook testing', isEditable: true },
  { key: 'enable_screenshot_analytics', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Screenshot Analytics', labelId: 'Screenshot Analytics', descriptionEn: 'Enable screenshot analytics feature', descriptionId: 'Aktifkan fitur analitik screenshot', isEditable: true },
  { key: 'enable_competitor_analysis', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Competitor Analysis', labelId: 'Competitor Analysis', descriptionEn: 'Enable competitor analysis feature', descriptionId: 'Aktifkan fitur analisis kompetitor', isEditable: true },
  { key: 'enable_thumbnail_generator', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Thumbnail Generator', labelId: 'Thumbnail Generator', descriptionEn: 'Enable AI thumbnail generator', descriptionId: 'Aktifkan generator thumbnail AI', isEditable: true },
  { key: 'enable_voice_input', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Voice Input', labelId: 'Voice Input', descriptionEn: 'Enable voice input for analysis forms', descriptionId: 'Aktifkan input suara untuk form analisis', isEditable: true },
  { key: 'enable_pdf_export', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'PDF Export', labelId: 'PDF Export', descriptionEn: 'Enable PDF export for analysis results', descriptionId: 'Aktifkan ekspor PDF untuk hasil analisis', isEditable: true },
  { key: 'enable_save_history', value: 'true', valueType: 'boolean', category: 'features', labelEn: 'Save History', labelId: 'Save History', descriptionEn: 'Enable save analysis history to localStorage', descriptionId: 'Aktifkan simpan riwayat analisis ke localStorage', isEditable: true },
];

const defaultPricingTiers = [
  { slug: 'gratis', name: 'Gratis', priceIdr: 0, period: 'month', descriptionEn: 'Perfect for trying out', descriptionId: 'Cocok untuk mencoba', videoLimit: 2, chatLimit: 10, featuresEn: ['10 Ai chat/day', '2 video analysis/day', 'Basic knowledge base'], featuresId: ['10 chat Ai/hari', '2 analisis video/hari', 'Knowledge base dasar'], isPopular: false, isActive: true, sortOrder: 1 },
  { slug: 'basic', name: 'Basic', priceIdr: 10000, period: 'month', descriptionEn: 'For casual creators', descriptionId: 'Untuk kreator kasual', videoLimit: 10, chatLimit: -1, featuresEn: ['Unlimited Ai chat', '10 video analysis/month', 'Full knowledge base', 'Save history'], featuresId: ['Chat Ai unlimited', '10 analisis video/bulan', 'Knowledge base lengkap', 'Simpan riwayat'], isPopular: false, isActive: true, sortOrder: 2 },
  { slug: 'pro', name: 'Pro', priceIdr: 25000, period: 'month', descriptionEn: 'For serious creators', descriptionId: 'Untuk kreator serius', videoLimit: 30, chatLimit: -1, featuresEn: ['All Basic features', '30 video analysis/month', 'Batch Analysis', 'A/B Hook Tester', 'PDF Export'], featuresId: ['Semua fitur Basic', '30 analisis video/bulan', 'Batch Analysis', 'A/B Hook Tester', 'Export PDF'], isPopular: true, isActive: true, sortOrder: 3 },
  { slug: 'unlimited', name: 'Unlimited', priceIdr: 99000, period: 'month', descriptionEn: 'For agencies & power users', descriptionId: 'Untuk agensi & power user', videoLimit: 100, chatLimit: -1, featuresEn: ['All Pro features', '100 video analysis/month', 'Priority support', 'White-label option'], featuresId: ['Semua fitur Pro', '100 analisis video/bulan', 'Priority support', 'White-label option'], isPopular: false, isActive: true, sortOrder: 4 },
];

export async function initializeDefaultSettings(): Promise<void> {
  try {
    // Check if settings already exist
    const existingSettings = await db.select().from(appSettings);
    const existingTiers = await db.select().from(pricingTiers);
    
    const needsSettings = existingSettings.length === 0;
    const needsPricing = existingTiers.length === 0;
    
    if (!needsSettings && !needsPricing) {
      return; // Nothing to seed
    }

    // Use transaction to ensure atomicity - either all succeed or none
    await db.transaction(async (tx) => {
      if (needsSettings) {
        console.log('[INIT] No settings found, seeding defaults...');
        for (const setting of defaultSettings) {
          await tx.insert(appSettings).values(setting).onConflictDoNothing();
        }
        console.log(`[INIT] ✅ Seeded ${defaultSettings.length} default settings`);
      }

      if (needsPricing) {
        console.log('[INIT] No pricing tiers found, seeding defaults...');
        for (const tier of defaultPricingTiers) {
          await tx.insert(pricingTiers).values(tier).onConflictDoNothing();
        }
        console.log(`[INIT] ✅ Seeded ${defaultPricingTiers.length} default pricing tiers`);
      }
    });
  } catch (error) {
    console.error('[INIT] Error initializing settings:', error);
  }
}
