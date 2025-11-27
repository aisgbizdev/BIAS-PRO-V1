import biasConfig from './bias.json';
import thiConfig from './thi.json';

export interface BrandConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: {
    en: string;
    id: string;
  };
  subtitle: {
    en: string;
    id: string;
  };
  description: {
    en: string;
    id: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentHover: string;
  };
  social: {
    tiktok: string;
    tiktokUrl: string;
  };
  meta: {
    title: string;
    description: string;
  };
}

const brands: Record<string, BrandConfig> = {
  bias: biasConfig as BrandConfig,
  thi: thiConfig as BrandConfig,
};

const activeBrandId = import.meta.env.VITE_BRAND || 'bias';

export const activeBrand: BrandConfig = brands[activeBrandId] || brands.bias;

export const getBrand = (brandId: string): BrandConfig => {
  return brands[brandId] || brands.bias;
};

export const getAllBrands = (): BrandConfig[] => {
  return Object.values(brands);
};

export default activeBrand;
