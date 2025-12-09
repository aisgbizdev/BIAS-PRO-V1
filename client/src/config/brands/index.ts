import biasConfig from './bias.json';
import thiConfig from './thi.json';
import newsmakerConfig from './newsmaker.json';
import biasLogo from '@assets/bias logo_1762016709581.jpg';

const logoMap: Record<string, string> = {
  bias: biasLogo,
  thi: biasLogo,
  newsmaker: biasLogo,
};

export interface BrandConfig {
  id: string;
  name: string;
  shortName: string;
  logo: string;
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
  newsmaker: newsmakerConfig as BrandConfig,
};

const activeBrandId = import.meta.env.VITE_BRAND || 'bias';

export const activeBrand: BrandConfig = brands[activeBrandId] || brands.bias;

export const getBrandLogo = (brandId: string): string => {
  return logoMap[brandId] || logoMap.bias;
};

export const getActiveBrandLogo = (): string => {
  return getBrandLogo(activeBrandId);
};

export const getBrand = (brandId: string): BrandConfig => {
  return brands[brandId] || brands.bias;
};

export const getAllBrands = (): BrandConfig[] => {
  return Object.values(brands);
};

export default activeBrand;
