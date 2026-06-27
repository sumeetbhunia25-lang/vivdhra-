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

        {/* Center Logo Lockup */}
        <div className="flex flex-col items-center select-none">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-1.5 focus:outline-hidden cursor-pointer"
          >
            {/* Peacock Feather Styled V Symbol */}
            <svg
              className="w-8 h-8 text-[#1c1917] transition-transform duration-500 hover:rotate-6"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sleek V stroke */}
              <path
                d="M15 15 C35 60, 40 85, 50 85 C60 85, 65 60, 85 15"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Abstract Peacock Feather Details */}
              <path
                d="M50 85 C55 60, 68 35, 78 18"
                stroke="#c2a46c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1 3"
              />
              <path
                d="M50 85 C45 60, 32 35, 22 18"
                stroke="#0f766e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1 3"
              />
              {/* Central Feather Eye */}
              <path
                d="M78 18 C83 14, 82 8, 76 10 C70 12, 72 16, 78 18 Z"
                fill="#0f766e"
                opacity="0.8"
              />
              <circle cx="77" cy="14" r="2.5" fill="#c2a46c" />
            </svg>
            <span className="font-serif text-2xl md:text-3xl font-black tracking-[-0.07em] text-[#1c1917] uppercase select-none transition-all duration-300 hover:tracking-[-0.04em]">
              VIVIDHRA
            </span>
          </button>
          <span className="text-[9px] tracking-[0.3em] uppercase font-outfit text-[#78716c] font-light mt-0.5">
            Dress with purpose
          </span>
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
              <span className="serif-header text-lg font-bold tracking-widest text-[#1c1917] uppercase">
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
