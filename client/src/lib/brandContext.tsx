import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { activeBrand, BrandConfig } from '@/config/brands';
import { useLanguage } from './languageContext';

interface DynamicBrand {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  taglineEn: string;
  taglineId: string;
  subtitleEn: string;
  subtitleId: string;
  descriptionEn: string | null;
  descriptionId: string | null;
  colorPrimary: string;
  colorSecondary: string;
  logoUrl: string | null;
  tiktokHandle: string | null;
  tiktokUrl: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  isActive: boolean;
}

interface BrandContextType {
  brand: BrandConfig;
  dynamicBrand: DynamicBrand | null;
  isLoading: boolean;
  brandSlug: string | null;
  t: (enText: string, idText: string) => string;
  getTagline: () => string;
  getSubtitle: () => string;
  getDescription: () => string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const UNINITIALIZED = Symbol('uninitialized');

function convertDynamicToBrandConfig(dynamic: DynamicBrand): BrandConfig {
  return {
    id: dynamic.slug,
    name: dynamic.name,
    shortName: dynamic.shortName,
    logo: dynamic.slug,
    tagline: {
      en: dynamic.taglineEn,
      id: dynamic.taglineId,
    },
    subtitle: {
      en: dynamic.subtitleEn,
      id: dynamic.subtitleId,
    },
    description: {
      en: dynamic.descriptionEn || '',
      id: dynamic.descriptionId || '',
    },
    colors: {
      primary: dynamic.colorPrimary,
      secondary: dynamic.colorSecondary,
      accent: 'from-pink-500 to-cyan-500',
      accentHover: 'from-pink-600 to-cyan-600',
    },
    social: {
      tiktok: dynamic.tiktokHandle || '',
      tiktokUrl: dynamic.tiktokUrl || '',
    },
    meta: {
      title: dynamic.name,
      description: dynamic.descriptionEn || '',
    },
  };
}

function extractBrandSlugFromPath(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts.length === 0) return null;
  
  const reservedPaths = ['social-pro', 'creator', 'library', 'admin', 'api'];
  const firstPart = parts[0].toLowerCase();
  
  if (reservedPaths.includes(firstPart)) {
    return null;
  }
  
  return firstPart;
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [dynamicBrand, setDynamicBrand] = useState<DynamicBrand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [brandSlug, setBrandSlug] = useState<string | null>(null);
  const lastFetchedSlugRef = useRef<string | null | typeof UNINITIALIZED>(UNINITIALIZED);
  
  useEffect(() => {
    const slug = extractBrandSlugFromPath(location);
    
    if (slug === lastFetchedSlugRef.current) {
      return;
    }
    
    setBrandSlug(slug);
    lastFetchedSlugRef.current = slug;
    setIsLoading(true);
    
    if (slug) {
      fetch(`/api/brands/slug/${slug}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Brand not found');
        })
        .then(data => {
          setDynamicBrand(data);
        })
        .catch(() => {
          setDynamicBrand(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setDynamicBrand(null);
      setIsLoading(false);
    }
  }, [location]);
  
  const currentBrand: BrandConfig = dynamicBrand 
    ? convertDynamicToBrandConfig(dynamicBrand) 
    : activeBrand;
  
  const t = (enText: string, idText: string): string => {
    return language === 'en' ? enText : idText;
  };

  const getTagline = (): string => {
    if (dynamicBrand) {
      return language === 'en' ? dynamicBrand.taglineEn : dynamicBrand.taglineId;
    }
    return language === 'en' ? activeBrand.tagline.en : activeBrand.tagline.id;
  };

  const getSubtitle = (): string => {
    if (dynamicBrand) {
      return language === 'en' ? dynamicBrand.subtitleEn : dynamicBrand.subtitleId;
    }
    return language === 'en' ? activeBrand.subtitle.en : activeBrand.subtitle.id;
  };

  const getDescription = (): string => {
    if (dynamicBrand) {
      return language === 'en' ? (dynamicBrand.descriptionEn || '') : (dynamicBrand.descriptionId || '');
    }
    return language === 'en' ? activeBrand.description.en : activeBrand.description.id;
  };

  return (
    <BrandContext.Provider value={{ 
      brand: currentBrand,
      dynamicBrand,
      isLoading,
      brandSlug,
      t,
      getTagline,
      getSubtitle,
      getDescription
    }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextType {
  const context = useContext(BrandContext);
  if (context === undefined) {
    return {
      brand: activeBrand,
      dynamicBrand: null,
      isLoading: false,
      brandSlug: null,
      t: (en, id) => en,
      getTagline: () => activeBrand.tagline.en,
      getSubtitle: () => activeBrand.subtitle.en,
      getDescription: () => activeBrand.description.en,
    };
  }
  return context;
}
