export type ActivePage = 'home' | 'product';

export interface CompanyInfo {
  name: string;
  slogan: string;
  about: string;
  location: string;
  contactEmail: string;
  values: {
    title: string;
    description: string;
  }[];
}

export interface ProductInfo {
  name: string;
  price: string;
  description: string;
  colourway: string;
  sizes: string[];
  batteryLife: string;
  thermalOutput: string;
  waterproofing: string;
  outerShellMaterial: string;
  weight: string;
  warranty: string;
}
