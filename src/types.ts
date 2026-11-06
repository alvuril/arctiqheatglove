export type ActivePage = 'home' | 'products' | 'product-detail' | 'accessories' | 'accessory-detail' | 'purchase' | 'orders';

export type GloveModelType = 'adult' | 'kids';
export type GloveColourType = 'black' | 'white';

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

export interface ProductColourway {
  id: GloveColourType;
  name: string;
  hex: string;
  image: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  modelType: GloveModelType;
  tagline: string;
  price: string;
  numericPrice: number;
  description: string;
  colourway: string;
  colourways: ProductColourway[];
  sizes: string[];
  batteryLife: string;
  thermalOutput: string;
  waterproofing: string;
  outerShellMaterial: string;
  weight: string;
  warranty: string;
  safetyFeatures?: string;
}

export interface GloveCardItem {
  id: string;
  model: GloveModelType;
  colour: GloveColourType;
  title: string;
  editionBadge: string;
  colourName: string;
  price: string;
  image: string;
  specsSummary: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  description: string;
  image: string;
  compatibility: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  itemType: 'glove' | 'accessory';
  name: string;
  modelType?: GloveModelType;
  colourway?: string;
  size?: string;
  price: string;
  numericPrice: number;
  image: string;
  quantity: number;
}

export interface CustomerOrderLine {
  id: string;
  name: string;
  colourway?: string;
  size?: string;
  price: string;
  numericPrice?: number;
  image?: string;
  quantity: number;
}

export interface CustomerOrder {
  orderRef: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  deliveryDaysEstimate: string;
  status: 'Confirmed' | 'Preparing at Gothenburg Terminal' | 'In Transit' | 'Delivered';
  customerName: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  paymentMethod: string;
  items: CustomerOrderLine[];
  totalPrice: string;
  trackingCarrier: string;
  trackingCode: string;
}
