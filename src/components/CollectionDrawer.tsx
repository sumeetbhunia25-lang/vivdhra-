import { X, Search, Heart, ShoppingBag, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, WishlistItem, UserAccount, Product } from '../types';

export interface CollectionCategory {
  id: string;
  label: string;
  description: string;
  image: string;
}

export const collectionCategories: CollectionCategory[] = [
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    description: 'Fresh tailored edits & modern drops',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'best-sellers',
    label: 'Best Sellers',
    description: 'Most-loved high-demand silhouettes',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'dresses',
    label: 'Dresses',
    description: 'Elegant midi, wrap & structured dresses',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'tops',
    label: 'Tops',
    description: 'Asymmetric wrap tops & tailored waistcoats',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'co-ords',
    label: 'Co-ords',
    description: 'Effortless matching jacket & trouser sets',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'bottoms',
    label: 'Bottoms',
    description: 'Wide-leg organic linen & cotton trousers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'kurtis',
    label: 'Kurtis',
    description: 'Contemporary drape tunics & longlines',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'ethnic-sets',
    label: 'Ethnic Sets',
    description: 'Modern fusion sets with elegant drapes',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'party-wear',
    label: 'Party Wear',
    description: 'Sculptural satin & premium wine crepe statement wear',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'office-wear',
    label: 'Office Wear',
    description: 'Sharp tailored blazers & sleek coordinates',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'daily-wear',
    label: 'Daily Wear',
    description: 'Easy, soft cotton essential styles',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'vacation-wear',
    label: 'Vacation Wear',
    description: 'Breezy linen dresses & sunny travel picks',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'college-wear',
    label: 'College Wear',
    description: 'Youthful aesthetic trends & stylish casuals',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'house-wear',
    label: 'House Wear',
    description: 'Relaxed loungewear & breathable basics',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'minimal-collection',
    label: 'Minimal Collection',
    description: 'Neutral tones & pure geometric cuts',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'sustainable-picks',
    label: 'Sustainable Picks',
    description: '100% organic cotton & GOTS tencel blends',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'sale',
    label: 'Sale',
    description: 'Approachably priced luxury edits',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop') => void;
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: UserAccount | null;
  products: Product[];
  openCart: () => void;
  openWishlist: () => void;
  openSearch: () => void;
}

export default function CollectionDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  setActiveView,
  cart,
  wishlist,
  user,
  products,
  openCart,
  openWishlist,
  openSearch,
}: CollectionDrawerProps) {
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to count matches dynamically per category
  const getCategoryCount = (catId: string) => {
    return products.filter((p) => {
      if (catId === 'all') return true;
      if (catId === 'atelier-ai') return ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id);
      if (catId === 'new-arrivals') return p.isTrending || p.id === 'p14';
      if (catId === 'best-sellers') return p.isTrending && p.price > 1600;
      if (catId === 'dresses') return p.category === 'dresses';
      if (catId === 'tops') return p.category === 'tops';
      if (catId === 'co-ords') return p.category === 'co-ords';
      if (catId === 'bottoms') return p.category === 'trousers';
      if (catId === 'kurtis') return p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape');
      if (catId === 'ethnic-sets') return p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric');
      if (catId === 'party-wear') return p.name.toLowerCase().includes('corset') || p.name.toLowerCase().includes('satin') || p.category === 'blazers';
      if (catId === 'office-wear') return p.category === 'blazers' || p.category === 'trousers';
      if (catId === 'daily-wear') return p.category === 'tops' || p.category === 'co-ords';
      if (catId === 'vacation-wear') return p.category === 'vacation' || p.materials.toLowerCase().includes('linen');
      if (catId === 'college-wear') return p.price < 1800;
      if (catId === 'house-wear') return p.materials.toLowerCase().includes('cotton') && p.category === 'tops';
      if (catId === 'minimal-collection') return p.materials.toLowerCase().includes('linen') || p.category === 'blazers';
      if (catId === 'sustainable-picks') return p.materials.toLowerCase().includes('organic') || p.materials.toLowerCase().includes('gots');
      if (catId === 'sale') return p.originalPrice > p.price;
      return p.category === catId;
    }).length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="relative w-full max-w-md h-full bg-[#FDFCFB] shadow-2xl flex flex-col z-10 border-r border-stone-200/60 overflow-hidden"
          >
            {/* Header Lockup */}
            <div className="p-5 border-b border-stone-200/60 flex items-center justify-between bg-stone-50/50">
              <div className="flex flex-col">
                <span className="serif-header text-lg font-normal tracking-[-0.06em] text-[#1c1917] uppercase">
                  VIVIDHRA
                </span>
                <span className="text-[9px] tracking-widest text-[#c2a46c] font-outfit uppercase font-semibold mt-0.5">
                  Collection Registry
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer text-stone-600 hover:text-stone-900"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Access Utility Actions Panel (Wishlist, Cart, Search, Account, Stylist) */}
            <div className="px-5 py-4.5 bg-stone-50 border-b border-stone-200/50 flex items-center justify-around gap-2">
              <button
                onClick={() => {
                  onClose();
                  openSearch();
                }}
                className="flex flex-col items-center flex-1 py-1.5 hover:bg-white rounded-xl transition-all cursor-pointer group"
              >
                <Search className="w-4.5 h-4.5 text-stone-600 group-hover:text-stone-900" />
                <span className="text-[9px] uppercase font-outfit tracking-wider text-stone-500 group-hover:text-stone-800 mt-1">Search</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  openWishlist();
                }}
                className="flex flex-col items-center flex-1 py-1.5 hover:bg-white rounded-xl transition-all relative cursor-pointer group"
              >
                <Heart className="w-4.5 h-4.5 text-stone-600 group-hover:text-stone-900" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-5 bg-[#c2a46c] text-white text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
                <span className="text-[9px] uppercase font-outfit tracking-wider text-stone-500 group-hover:text-stone-800 mt-1">Wishlist</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  openCart();
                }}
                className="flex flex-col items-center flex-1 py-1.5 hover:bg-white rounded-xl transition-all relative cursor-pointer group"
              >
                <ShoppingBag className="w-4.5 h-4.5 text-stone-600 group-hover:text-stone-900" />
                {totalCartItems > 0 && (
                  <span className="absolute top-1 right-5 bg-stone-900 text-white text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
                <span className="text-[9px] uppercase font-outfit tracking-wider text-stone-500 group-hover:text-stone-800 mt-1">Bag ({totalCartItems})</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveView('profile');
                }}
                className="flex flex-col items-center flex-1 py-1.5 hover:bg-white rounded-xl transition-all cursor-pointer group"
              >
                <User className="w-4.5 h-4.5 text-stone-600 group-hover:text-stone-900" />
                <span className="text-[9px] uppercase font-outfit tracking-wider text-stone-500 group-hover:text-stone-800 mt-1">Account</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveView('stylist');
                }}
                className="flex flex-col items-center flex-1 py-1.5 bg-[#c2a46c]/10 hover:bg-[#c2a46c]/20 rounded-xl transition-all cursor-pointer group border border-[#c2a46c]/10"
              >
                <Sparkles className="w-4.5 h-4.5 text-[#a0834c]" />
                <span className="text-[9px] uppercase font-outfit tracking-wider text-[#a0834c] font-bold mt-1">AI Stylist</span>
              </button>
            </div>

            {/* Scrolling Collection Categories List */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-none" data-lenis-prevent>
              <div className="px-5 mb-5">
                <h3 className="serif-header text-xl md:text-2xl font-bold text-[#1c1917]">
                  Mindful Silhouettes
                </h3>
                <div className="border-b border-stone-200 mt-2.5" />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 px-5 pb-8">
                {collectionCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = getCategoryCount(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveView('shop');
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#1c1917] text-[#fafaf9] border-[#1c1917] shadow-md scale-[1.01]'
                          : 'bg-[#fafaf9]/80 text-[#1c1917] border-stone-200/90 hover:bg-[#fafaf9] hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 truncate">
                        {/* Circle Image Preview */}
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-stone-200/80 flex-shrink-0 bg-stone-100 relative shadow-xs">
                          <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="truncate pr-1">
                          <span className="text-xs font-outfit font-bold tracking-wider block uppercase truncate leading-tight">
                            {cat.label}
                          </span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {count} {count === 1 ? 'Garment' : 'Garments'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isSelected ? 'text-[#c2a46c] translate-x-1' : 'text-stone-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer lockup */}
            <div className="p-4 bg-stone-50 border-t border-stone-200/60 flex flex-col items-center space-y-1 text-center">
              <span className="text-[9px] uppercase tracking-widest font-mono text-stone-400">
                Slogan: Dress with purpose
              </span>
              <span className="text-[9px] text-stone-300 font-mono">
                Atelier Exclusive women collection &bull; Mumbai
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
