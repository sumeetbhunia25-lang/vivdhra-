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
  images: string[]; // Two images for Vividhra-style hover effect
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: string[];
  inStock: boolean;
  stock?: number;
  fitType: 'slim' | 'regular' | 'oversized';
  isTrending?: boolean;
  subcategory?: string;
  tags?: string[];
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
  product?: Product; // Full product detail reference
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  productId?: string;
  addedAt?: string;
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
  phone?: string;
  notes?: string;
  paymentMethod?: string;
  giftWrapping?: boolean;
  promoCode?: string | null;
  promoDiscount?: number;
  shippingFee?: number;
}

export interface UserAccount {
  uid: string;
  id?: string;
  email: string;
  displayName: string;
  name?: string;
  role: 'customer' | 'admin';
  fitProfile?: FitProfile;
  wishlist: WishlistItem[];
  cart: CartItem[];
}
