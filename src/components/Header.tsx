import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, Sparkles, Gift } from 'lucide-react';
import { CartItem, WishlistItem, UserAccount } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: UserAccount | null;
  activeView: 'home' | 'story' | 'donations' | 'profile' | 'admin' | 'shop';
  setActiveView: (view: 'home' | 'story' | 'donations' | 'profile' | 'admin' | 'shop') => void;
  openCart: () => void;
  openWishlist: () => void;
  openSearch: () => void;
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
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'Collection', view: 'home' as const },
    { label: 'Our Story', view: 'story' as const },
    { label: 'Dress with Purpose', view: 'donations' as const },
    { label: 'Fit Profile', view: 'profile' as const },
    ...(user?.role === 'admin' ? [{ label: 'Atelier (Admin)', view: 'admin' as const }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FDFCFB]/85 backdrop-blur-md border-b border-gray-200/80 py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`text-xs uppercase tracking-widest font-outfit font-medium transition-all duration-300 relative py-1 hover:text-[#78716c] cursor-pointer ${
                activeView === item.view ? 'text-[#1c1917]' : 'text-[#57534e]'
              }`}
            >
              {item.label}
              {activeView === item.view && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1c1917] animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center Logo Lockup (Vertical stacked Layout matching Image exactly) */}
        <div className="flex items-center select-none">
          <button
            onClick={() => setActiveView('home')}
            className="flex flex-col items-center justify-center focus:outline-hidden cursor-pointer group"
          >
            {/* New Gold Peacock Feather 'V' Logo Symbol (High-Fidelity SVG) */}
            <svg
              className="w-11 h-11 transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gold-metallic" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#dfba73" />
                  <stop offset="50%" stopColor="#c2a46c" />
                  <stop offset="100%" stopColor="#8d6f34" />
                </linearGradient>
                <linearGradient id="peacock-teal" x1="75" y1="15" x2="105" y2="45" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0a5c53" />
                  <stop offset="100%" stopColor="#01362f" />
                </linearGradient>
                <linearGradient id="emerald-core" x1="82" y1="22" x2="98" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00c49f" />
                  <stop offset="100%" stopColor="#017b62" />
                </linearGradient>
              </defs>

              {/* Left Wing of the V: Elegant calligraphic swoop */}
              <path
                d="M 22,25 
                   C 22,25   29,18   36,21 
                   C 42,24   40,32   35,42 
                   C 28,56   38,82   49,95 
                   C 56,103  63,105  65,103 
                   C 67,101  60,93   53,84 
                   C 43,71   33,48   42,32 
                   C 47,23   36,25   22,25 Z"
                fill="url(#gold-metallic)"
              />

              {/* Main Shaft / Spine of the peacock feather */}
              <path
                d="M 64,103
                   C 66,97 70,82 74,68
                   C 78,54 84,38 90,26"
                stroke="url(#gold-metallic)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />

              {/* Elegant gold feather barbs */}
              {/* Left side */}
              <path d="M 69,83 C 64,83 58,76 59,71" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 71,73 C 65,71 59,62 61,56" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 74,61 C 67,58 60,47 64,41" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 77,49 C 71,45 65,33 70,27" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 81,38 C 76,33 72,21 78,17" stroke="url(#gold-metallic)" strokeWidth="1.8" strokeLinecap="round" />

              {/* Right side */}
              <path d="M 67,90 C 72,91 79,94 84,89" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 70,80 C 76,82 84,85 89,79" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 72,69 C 79,71 88,74 92,67" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 75,57 C 83,59 92,61 95,53" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 78,46 C 87,48 95,49 98,40" stroke="url(#gold-metallic)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 82,34 C 91,35 98,34 100,26" stroke="url(#gold-metallic)" strokeWidth="1.8" strokeLinecap="round" />

              {/* Peacock Eye at the top */}
              <path
                d="M 90,26 
                   C 84,17 83,8 91,4 
                   C 99,0 107,7 101,17 
                   C 97,23 93,26 90,26 Z"
                fill="url(#gold-metallic)"
              />
              <path
                d="M 90,24 
                   C 86,17 86,10 91,7 
                   C 97,4 103,9 99,16 
                   C 96,21 93,24 90,24 Z"
                fill="url(#peacock-teal)"
              />
              <path
                d="M 91,21 
                   C 88,16 89,12 92,10 
                   C 96,8 99,12 97,16 
                   C 95,19 93,21 91,21 Z"
                fill="url(#emerald-core)"
              />
              <circle cx="93.5" cy="13.5" r="1.5" fill="#eafdf8" />
            </svg>

            {/* Brand Typography & Slogan Column */}
            <div className="flex flex-col items-center text-center -mt-0.5">
              <span className="font-serif text-2xl md:text-[26px] font-normal tracking-[-0.09em] text-[#1c1917] uppercase select-none leading-none transition-colors duration-300 group-hover:text-stone-600">
                VIVIDHRA
              </span>
              <span className="text-[7.5px] md:text-[8px] tracking-[0.25em] uppercase font-outfit text-[#78716c] font-light mt-1.5">
                Dress with purpose
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: Quick Utilities */}
        <div className="flex items-center space-x-4 md:space-x-5">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="p-1.5 text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all cursor-pointer"
            title="Search products..."
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Slogan Integration: Charity Quick Access */}
          <button
            onClick={() => setActiveView('donations')}
            className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-[#15803d]/10 text-[#15803d] text-[10px] uppercase tracking-wider rounded-full font-mono font-medium hover:bg-[#15803d]/15 transition-all cursor-pointer"
            title="Active Charity Donations Tracker"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Purpose Tracker</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={openWishlist}
            className="p-1.5 text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all relative cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#1c1917] text-[#fafaf9] text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="p-1.5 text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all relative cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c2a46c] text-[#fafaf9] text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Dashboard trigger */}
          <button
            onClick={() => setActiveView('profile')}
            className="p-1.5 text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all relative cursor-pointer"
            title="My Fit Profile & Account"
          >
            <User className="w-4.5 h-4.5" />
            {user?.role === 'admin' && (
              <span className="absolute bottom-0 right-0 bg-[#0f766e] w-1.5 h-1.5 rounded-full" />
            )}
          </button>
        </div>

      </div>

      {/* Full-screen Mobile Navigation Transition */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FDFCFB] z-50 flex flex-col justify-between px-6 py-8 animate-fade-in lg:hidden">
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

            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setActiveView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className="serif-header text-2xl text-left font-semibold tracking-wide text-[#1c1917] hover:text-[#78716c] transition-colors py-2 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
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
    </header>
  );
}
