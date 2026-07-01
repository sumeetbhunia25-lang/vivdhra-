import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, WishlistItem, UserAccount, Product } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: UserAccount | null;
  activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking') => void;
  openCart: () => void;
  openWishlist: () => void;
  openSearch: () => void;
  onOpenCollectionMenu: () => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  products?: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  cart,
  wishlist,
  user,
  activeView,
  setActiveView,
  openCart,
  openWishlist,
  openSearch,
  onOpenCollectionMenu,
  selectedCategory,
  setSelectedCategory,
  products,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);

  const megamenuGroups = [
    {
      title: "Curated Drops",
      items: [
        { id: 'new-arrivals', label: 'New Arrivals' },
        { id: 'best-sellers', label: 'Best Sellers' },
        { id: 'sustainable-picks', label: 'Sustainable Picks' },
        { id: 'minimal-collection', label: 'Minimal Collection' },
        { id: 'sale', label: 'Sale' }
      ]
    },
    {
      title: "Key Silhouettes",
      items: [
        { id: 'dresses', label: 'Dresses' },
        { id: 'tops', label: 'Tops' },
        { id: 'co-ords', label: 'Co-ords' },
        { id: 'bottoms', label: 'Bottoms' }
      ]
    },
    {
      title: "Ethnic & Fusion",
      items: [
        { id: 'kurtis', label: 'Kurtis' },
        { id: 'ethnic-sets', label: 'Ethnic Sets' }
      ]
    },
    {
      title: "By Occasion",
      items: [
        { id: 'daily-wear', label: 'Daily Wear' },
        { id: 'office-wear', label: 'Office Wear' },
        { id: 'party-wear', label: 'Party Wear' },
        { id: 'vacation-wear', label: 'Vacation Wear' },
        { id: 'college-wear', label: 'College Wear' },
        { id: 'house-wear', label: 'House Wear' }
      ]
    }
  ];

  const getCategoryCount = (catId: string) => {
    if (!products) return 0;
    return products.filter((p) => {
      if (catId === 'all') return true;
      if (catId === 'atelier-ai') return ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id);
      if (catId === 'new-arrivals') return p.isTrending || p.id === 'p14' || p.id === 'p15';
      if (catId === 'best-sellers') return p.isTrending && p.price > 1600;
      if (catId === 'dresses') return p.category === 'dresses';
      if (catId === 'tops') return p.category === 'tops';
      if (catId === 'co-ords') return p.category === 'co-ords';
      if (catId === 'bottoms') return p.category === 'trousers';
      if (catId === 'kurtis') return p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape');
      if (catId === 'ethnic-sets') return p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric');
      if (catId === 'party-wear') return p.name.toLowerCase().includes('corset') || p.name.toLowerCase().includes('satin') || p.name.toLowerCase().includes('wine') || p.category === 'blazers';
      if (catId === 'office-wear') return p.category === 'blazers' || p.category === 'trousers';
      if (catId === 'daily-wear') return p.category === 'tops' || p.category === 'co-ords';
      if (catId === 'vacation-wear') return p.category === 'vacation' || p.materials.toLowerCase().includes('linen');
      if (catId === 'college-wear') return p.price < 1800;
      if (catId === 'house-wear') return p.materials.toLowerCase().includes('cotton') && p.category === 'tops';
      if (catId === 'minimal-collection') return p.materials.toLowerCase().includes('linen') || p.category === 'blazers';
      if (catId === 'sustainable-picks') return p.materials.toLowerCase().includes('organic') || p.materials.toLowerCase().includes('gots') || p.materials.toLowerCase().includes('eco');
      if (catId === 'sale') return p.originalPrice > p.price;
      return p.category === catId;
    }).length;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'Collections', view: 'home' as const },
    { label: 'Our Story', view: 'story' as const },
    { label: 'Track Journey', view: 'tracking' as const },
    { label: 'Fit Profile', view: 'profile' as const },
    ...(user?.role === 'admin' ? [{ label: 'Atelier (Admin)', view: 'admin' as const }] : []),
  ];

  const isDarkHeroOverlay = activeView === 'home' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
        mobileMenuOpen
          ? 'inset-0 z-[100] h-screen w-screen bg-[#FDFCFB] overflow-y-auto'
          : `z-50 ${
              isScrolled
                ? 'bg-[#FDFCFB]/85 backdrop-blur-md border-b border-gray-200/80 py-3 shadow-xs'
                : 'bg-transparent py-5'
            }`
      }`}
    >
      {!mobileMenuOpen && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  if (item.label === 'Collections') {
                    onOpenCollectionMenu();
                  } else {
                    setActiveView(item.view);
                  }
                }}
                onMouseEnter={() => {
                  if (item.label === 'Collections') {
                    setIsCollectionsHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  if (item.label === 'Collections') {
                    setIsCollectionsHovered(false);
                  }
                }}
                className={`text-xs uppercase tracking-widest font-outfit font-medium transition-all duration-300 relative py-1 cursor-pointer ${
                  isActive 
                    ? (isDarkHeroOverlay ? 'text-white' : 'text-[#1c1917]') 
                    : (isDarkHeroOverlay ? 'text-stone-300 hover:text-white' : 'text-[#57534e] hover:text-[#1c1917]')
                }`}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] animate-fade-in ${
                    isDarkHeroOverlay ? 'bg-[#c2a46c]' : 'bg-[#1c1917]'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`lg:hidden p-1.5 rounded-full transition-all cursor-pointer ${
            isDarkHeroOverlay 
              ? 'text-white hover:bg-white/10' 
              : 'text-[#1c1917] hover:bg-[#f5f5f4]'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Brand Wordmark VIVIDHRA */}
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => setActiveView('home')}
            className={`font-serif text-lg sm:text-xl md:text-2xl font-light tracking-[0.25em] uppercase select-none transition-colors duration-300 focus:outline-none cursor-pointer ${
              isDarkHeroOverlay 
                ? 'text-white hover:text-stone-300' 
                : 'text-[#1c1917] hover:text-[#57534e]'
            }`}
          >
            VIVIDHRA
          </button>
        </div>

        {/* Right Side: Quick Utilities - fully visible on all devices per user request */}
        <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-3 md:space-x-4">
          {/* Real Inline Search Bar Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search clothes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Force return to shop list to show instant search results
                if (activeView !== 'home') {
                  setActiveView('home');
                }
              }}
              className={`pl-7 pr-2.5 py-1 rounded-full text-[11px] sm:text-xs transition-all w-20 xs:w-28 sm:w-44 md:w-56 lg:w-64 border outline-none font-sans focus:ring-1 focus:ring-[#c2a46c] focus:border-[#c2a46c] ${
                isDarkHeroOverlay
                  ? 'bg-white/15 text-white placeholder-stone-300 border-white/20'
                  : 'bg-stone-100 text-stone-900 placeholder-stone-500 border-stone-200'
              }`}
            />
            <Search className={`w-3 h-3 sm:w-3.5 sm:h-3.5 absolute left-2 pointer-events-none ${isDarkHeroOverlay ? 'text-stone-300' : 'text-stone-500'}`} />
          </div>

          {/* Wishlist Trigger */}
          <button
            onClick={openWishlist}
            className={`p-1.5 rounded-full transition-all relative cursor-pointer ${
              isDarkHeroOverlay 
                ? 'text-stone-200 hover:text-white hover:bg-white/10' 
                : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
            title="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c2a46c] text-[#fafaf9] text-[8px] font-mono w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className={`p-1.5 rounded-full transition-all relative cursor-pointer ${
              isDarkHeroOverlay 
                ? 'text-stone-200 hover:text-white hover:bg-white/10' 
                : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {totalCartItems > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 text-[#fafaf9] text-[8px] font-mono w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold ${
                isDarkHeroOverlay ? 'bg-[#dfba73]' : 'bg-[#c2a46c]'
              }`}>
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Dashboard trigger */}
          <button
            onClick={() => setActiveView('profile')}
            className={`p-1.5 rounded-full transition-all relative cursor-pointer ${
              isDarkHeroOverlay 
                ? 'text-stone-200 hover:text-white hover:bg-white/10' 
                : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4]'
            }`}
            title="My Fit Profile & Account"
          >
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {user?.role === 'admin' && (
              <span className="absolute bottom-0 right-0 bg-[#0f766e] w-1.5 h-1.5 rounded-full" />
            )}
          </button>
        </div>

      </div>
      )}

      {/* Full-screen Mobile Navigation Transition */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 bg-[#FDFCFB] z-50 flex flex-col justify-between px-6 py-8 animate-fade-in lg:hidden min-h-screen">
          <div>
            <div className="flex items-center justify-between mb-12">
              <span className="serif-header text-xl font-normal tracking-[-0.08em] text-[#1c1917] uppercase">
                VIVIDHRA
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

              <nav className="flex flex-col space-y-2 overflow-y-auto max-h-[60vh] pr-1">
                {navItems.map((item) => {
                  const isActive = activeView === item.view;
                  if (item.label === 'Collections') {
                    return (
                      <div key={item.view} className="border-b border-stone-100 py-1.5">
                        <button
                          onClick={() => {
                            setIsMobileCollectionsOpen(!isMobileCollectionsOpen);
                          }}
                          className={`w-full serif-header text-xl text-left font-light tracking-[0.05em] transition-all duration-300 py-2 flex items-center justify-between cursor-pointer ${
                            isMobileCollectionsOpen ? 'text-[#1c1917] font-normal pl-2' : 'text-[#57534e] hover:text-[#1c1917] pl-1'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className={`transform transition-transform duration-300 ${isMobileCollectionsOpen ? 'rotate-90 text-[#c2a46c]' : 'text-stone-400'}`}>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </button>
                        
                        <AnimatePresence>
                          {isMobileCollectionsOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden pl-4 pr-2 mt-2 space-y-4 pb-2"
                            >
                              {megamenuGroups.map((group) => (
                                <div key={group.title} className="space-y-1.5">
                                  <h4 className="text-[9px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                                    {group.title}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {group.items.map((subcat) => {
                                      const count = getCategoryCount(subcat.id);
                                      return (
                                        <button
                                          key={subcat.id}
                                          onClick={() => {
                                            if (setSelectedCategory) {
                                              setSelectedCategory(subcat.id);
                                            }
                                            setActiveView('shop');
                                            setMobileMenuOpen(false);
                                            setIsMobileCollectionsOpen(false);
                                          }}
                                          className="text-[#57534e] hover:text-[#1c1917] text-xs font-outfit py-1.5 text-left flex items-center justify-between group cursor-pointer pr-1"
                                        >
                                          <span className="truncate pr-1">{subcat.label}</span>
                                          <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">
                                            {count}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveView(item.view);
                      }}
                      className={`serif-header text-xl text-left font-light tracking-[0.05em] transition-all duration-300 py-3.5 border-b border-stone-100 flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'text-[#1c1917] font-normal border-l-2 border-l-[#1c1917] pl-3 bg-stone-50/50' 
                          : 'text-[#57534e] hover:text-[#1c1917] pl-1'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c2a46c]" />}
                    </button>
                  );
                })}
              </nav>

            {/* Mobile Utility Actions in Drawer */}
            <div className="mt-8 pt-6 border-t border-stone-200/60 flex items-center justify-around">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="flex flex-col items-center space-y-1.5 text-[#57534e] hover:text-[#1c1917] cursor-pointer"
              >
                <Search className="w-5 h-5 text-stone-700" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Search</span>
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWishlist();
                }}
                className="flex flex-col items-center space-y-1.5 text-[#57534e] hover:text-[#1c1917] relative cursor-pointer"
              >
                <Heart className="w-5 h-5 text-stone-700" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-2 bg-[#1c1917] text-[#fafaf9] text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
                <span className="text-[10px] uppercase font-mono tracking-wider">Wishlist</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveView('profile');
                }}
                className="flex flex-col items-center space-y-1.5 text-[#57534e] hover:text-[#1c1917] cursor-pointer"
              >
                <User className="w-5 h-5 text-stone-700" />
                <span className="text-[10px] uppercase font-mono tracking-wider">Profile</span>
              </button>
            </div>

          </div>

          <div className="border-t border-[#e7e5e4] pt-6 flex flex-col space-y-3">
            <span className="text-xs tracking-wider uppercase text-[#78716c] font-outfit">
              Slogan: Dress with purpose
            </span>
            <span className="text-[11px] text-[#a8a29e] font-mono">
              Atelier Location: Mumbai, India
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isCollectionsHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={() => setIsCollectionsHovered(true)}
            onMouseLeave={() => setIsCollectionsHovered(false)}
            className="absolute left-0 right-0 top-full bg-[#FDFCFB]/95 backdrop-blur-md border-b border-stone-200/80 shadow-lg z-40 py-8 px-6 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
              {megamenuGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#c2a46c] font-bold">
                    {group.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.items.map((cat) => {
                      const count = getCategoryCount(cat.id);
                      return (
                        <li key={cat.id}>
                          <button
                            onClick={() => {
                              if (setSelectedCategory) {
                                setSelectedCategory(cat.id);
                              }
                              setActiveView('shop');
                              setIsCollectionsHovered(false);
                            }}
                            className="text-stone-600 hover:text-[#1c1917] text-xs font-outfit tracking-wide flex items-center justify-between w-full group/item text-left py-1 cursor-pointer"
                          >
                            <span className="font-medium group-hover/item:translate-x-1 transition-transform duration-300">
                              {cat.label}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full group-hover/item:bg-[#c2a46c]/10 group-hover/item:text-[#c2a46c] transition-colors">
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
