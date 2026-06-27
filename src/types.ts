export interface Product {
  id: string;
  name: string;
  category: 'dresses' | 'co-ords' | 'tops' | 'trousers' | 'blazers' | 'office' | 'party' | 'vacation' | 'daily';
  price: number;
  originalPrice?: number;
  description: string;
  slogan?: string;
  materials: string;
  care: string;
  images: string[]; // Two images for Zara-style hover effect
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: string[];
  inStock: boolean;
  fitType: 'slim' | 'regular' | 'oversized';
  isTrending?: boolean;
}

export interface FitProfile {
  height: number; // in cm
  bodyType: 'petite' | 'hourglass' | 'rectangle' | 'pear' | 'athletic';
  shoulderStructure: 'narrow' | 'average' | 'broad';
  bustFitPreference: 'snug' | 'comfort' | 'relaxed';
  waistFitPreference: 'snug' | 'comfort' | 'relaxed';
  hipFitPreference: 'snug' | 'comfort' | 'relaxed';
  fitStyle: 'classic' | 'relaxed' | 'experimental';
  comfortPreference: 'high' | 'standard';
  preferredLengths: string;
  sleevePreference: 'sleeveless' | 'short' | 'three-quarter' | 'full';
  modestyPreference: 'low' | 'medium' | 'high';
  outfitMood: 'elegant' | 'minimalist' | 'casual' | 'bold';
  occasionPreference: 'daily' | 'office' | 'party' | 'vacation';
}

export interface CartItem {
  id: string; // cart item entry id
  productId: string;
  productName: string;
  price: number;
  image: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface DonationTarget {
  id: string;
  name: string;
  description: string;
  image: string;
  totalDonated: number;
  impactLabel: string;
}

export interface DonationLog {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  targetCharities: string[]; // IDs of charities
  timestamp: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  donationAmount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  address: string;
  city: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  fitProfile?: FitProfile;
  wishlist: WishlistItem[];
  cart: CartItem[];
}
