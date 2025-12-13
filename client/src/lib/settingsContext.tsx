import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { updateCachedLimit } from './usageLimit';

interface PlatformSettings {
  daily_video_limit: number;
  daily_chat_limit: number;
  feature_batch_analysis: boolean;
  feature_ab_hook_tester: boolean;
  feature_screenshot_analytics: boolean;
  feature_competitor_analysis: boolean;
  feature_thumbnail_generator: boolean;
  free_trial_days: number;
  beta_end_date: string;
  maintenance_mode: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  slug: string;
  priceIdr: number;
  priceUsd?: number;
  period: string;
  descriptionEn?: string;
  descriptionId?: string;
  featuresEn?: string[];
  featuresId?: string[];
  chatLimit?: number;
  videoLimit?: number;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
}

interface SettingsContextType {
  settings: PlatformSettings;
  pricing: PricingTier[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: PlatformSettings = {
  daily_video_limit: 5,
  daily_chat_limit: 50,
  feature_batch_analysis: true,
  feature_ab_hook_tester: true,
  feature_screenshot_analytics: true,
  feature_competitor_analysis: true,
  feature_thumbnail_generator: true,
  free_trial_days: 90,
  beta_end_date: '2025-03-31',
  maintenance_mode: false,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  pricing: [],
  loading: true,
  refetch: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [settingsRes, pricingRes] = await Promise.all([
        fetch('/api/settings/public'),
        fetch('/api/pricing'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings({ ...defaultSettings, ...data });
        if (data.daily_video_limit) {
          updateCachedLimit(data.daily_video_limit);
        }
      }

      if (pricingRes.ok) {
        const data = await pricingRes.json();
        setPricing(data);
      }
    } catch (error) {
      console.error('[SETTINGS] Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, pricing, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function useDailyVideoLimit(): number {
  const { settings } = useSettings();
  return settings.daily_video_limit;
}

export function useFeatureEnabled(feature: keyof PlatformSettings): boolean {
  const { settings } = useSettings();
  const value = settings[feature];
  return typeof value === 'boolean' ? value : true;
}
