import { createContext, useContext, ReactNode } from 'react';
import { activeBrand, BrandConfig } from '@/config/brands';
import { useLanguage } from './languageContext';

interface BrandContextType {
  brand: BrandConfig;
  t: (enText: string, idText: string) => string;
  getTagline: () => string;
  getSubtitle: () => string;
  getDescription: () => string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  
  const t = (enText: string, idText: string): string => {
    return language === 'en' ? enText : idText;
  };

  const getTagline = (): string => {
    return language === 'en' ? activeBrand.tagline.en : activeBrand.tagline.id;
  };

  const getSubtitle = (): string => {
    return language === 'en' ? activeBrand.subtitle.en : activeBrand.subtitle.id;
  };

  const getDescription = (): string => {
    return language === 'en' ? activeBrand.description.en : activeBrand.description.id;
  };

  return (
    <BrandContext.Provider value={{ 
      brand: activeBrand, 
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
      t: (en, id) => en,
      getTagline: () => activeBrand.tagline.en,
      getSubtitle: () => activeBrand.subtitle.en,
      getDescription: () => activeBrand.description.en,
    };
  }
  return context;
}
