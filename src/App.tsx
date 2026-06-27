import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  Gift,
  Plus,
  Minus,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Lock,
  Unlock,
  Package,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Product, CartItem, WishlistItem, Order, DonationTarget, DonationLog, FitProfile, UserAccount } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ZaraStyleProductCard from './components/ZaraStyleProductCard';
import DonationTrackerPage from './components/DonationTrackerPage';
import FitProfileForm from './components/FitProfileForm';
import AIStylist from './components/AIStylist';
import AdminPanel from './components/AdminPanel';
import StoryPage from './components/StoryPage';
import ZaraOpeningIntro from './components/ZaraOpeningIntro';
import AISilhouetteStudio from './components/AISilhouetteStudio';

export default function App() {
  // Navigation & Core views
  const [showIntro, setShowIntro] = useState(true);
  const [activeView, setActiveView] = useState<'home' | 'story' | 'donations' | 'profile' | 'admin' | 'shop'>('home');
  const [profileSubTab, setProfileSubTab] = useState<'ai-silhouette' | 'profile-form'>('ai-silhouette');
  const [user, setUser] = useState<UserAccount | null>({
    id: 'user_1',
    name: 'Ananya Iyer',
    email: 'ananya@vividhra.com',
    role: 'admin', // Full multi-role support. Users can change this in the UI!
    fitProfile: {
      height: 164,
      bodyType: 'hourglass',
      shoulderStructure: 'average',
      bustFitPreference: 'comfort',
      waistFitPreference: 'comfort',
      hipFitPreference: 'comfort',
      fitStyle: 'classic',
      comfortPreference: 'standard',
      preferredLengths: 'Midi, Ankle Length',
      sleevePreference: 'full',
      modestyPreference: 'medium',
      outfitMood: 'elegant',
      occasionPreference: 'office'
    }
  });

  // Database lists
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [charities, setCharities] = useState<DonationTarget[]>([]);
  const [donationLogs, setDonationLogs] = useState<DonationLog[]>([]);

  // Interactive states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI Drawers & Modals
  const [selectedOccasion, setSelectedOccasion] = useState<'office' | 'party' | 'home' | 'college'>('office');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Checkout states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState(true);
  const [checkoutCharities, setCheckoutCharities] = useState<string[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Fetch full-stack database states
  const loadData = async () => {
    try {
      const [prodRes, targetRes, logRes, orderRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/donations/targets').then((r) => r.json()),
        fetch('/api/donations/logs').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
      ]);

      setProducts(prodRes);
      setCharities(targetRes);
      setDonationLogs(logRes);
      setOrders(orderRes);

      // Pre-select checkout charities
      if (targetRes.length > 0) {
        setCheckoutCharities(targetRes.map((c: any) => c.id));
      }
    } catch (err) {
      console.error('Error loading database structures:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.email) {
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Add Item to cart
  const handleAddToCart = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id && item.size === size);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { id: Math.random().toString(), product, quantity: 1, size, color }]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updated);
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    const existingIndex = wishlist.findIndex((w) => w.product.id === productId);
    if (existingIndex > -1) {
      setWishlist(wishlist.filter((w) => w.product.id !== productId));
    } else {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setWishlist([...wishlist, { id: Math.random().toString(), product: prod }]);
      }
    }
  };

  // Direct Direct Donation Handler
  const handleDirectDonation = async (donorName: string, donorEmail: string, amount: number, selectedCharityIds: string[]) => {
    const res = await fetch('/api/donations/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorName, donorEmail, amount, targetCharities: selectedCharityIds }),
    });
    const data = await res.json();
    await loadData(); // Reload stats and logs
    return data;
  };

  // Save Fit Sizing Profile
  const handleSaveFitProfile = async (profile: FitProfile) => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, fitProfile: profile }),
    });
    const data = await res.json();
    setUser(data);
    return data;
  };

  // Admin: CRUD additions / updates
  const handleAdminAddProduct = async (product: Product) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    await loadData();
    return data;
  };

  const handleAdminDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    await loadData();
    return data;
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const res = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });
    const data = await res.json();
    await loadData();
    return data;
  };

  // Calculations for Checkout
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const nextHundredValue = Math.ceil((cartSubtotal + 10) / 100) * 100;
  const computedRoundUp = isRoundUpEnabled && cartSubtotal > 0 ? (nextHundredValue - cartSubtotal) : 0;
  const checkoutTotal = cartSubtotal + computedRoundUp;

  // Perform Checkout purchase
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutAddress || !checkoutCity) {
      alert('Please complete all delivery coordinates.');
      return;
    }

    try {
      const payload = {
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        address: checkoutAddress,
        city: checkoutCity,
        items: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
          selectedSize: c.size,
          selectedColor: c.color,
        })),
        subtotal: cartSubtotal,
        donationAmount: computedRoundUp,
        donationCharities: isRoundUpEnabled ? checkoutCharities : [],
        total: checkoutTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setPlacedOrderId(data.orderId || Math.floor(1000 + Math.random() * 9000).toString());
      setCheckoutSuccess(true);
      setCart([]); // Clear Cart
      await loadData(); // Reload pools and counts
    } catch (err) {
      console.error(err);
      alert('Failed to execute purchase. Check parameters.');
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'atelier-ai' && ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id));
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#78716c]/20 selection:text-[#1c1917] antialiased">
      
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-100"
          >
            <ZaraOpeningIntro onEnter={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Transparent/Frosted Sticky Header */}
      <Header
        cart={cart}
        wishlist={wishlist}
        user={user}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Visual Canvas Views */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          
          {/* HOMEPAGE VIEW */}
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10 pt-24 md:pt-28 pb-16"
            >
              
              {/* Cinematic Hero Segment (Structured Bento Box) */}
              <section className="mx-4 md:mx-10 relative h-[80vh] flex items-center justify-center bg-stone-900 overflow-hidden rounded-3xl border border-gray-200/50 shadow-xs">
                <div className="absolute inset-0 bg-black/35 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
                  alt="Vividhra luxury editorial"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center scale-100 hover:scale-[1.02] transition-transform duration-[4000ms]"
                />
                
                <div className="relative z-20 text-center text-white max-w-4xl px-4 space-y-6 flex flex-col items-center">
                  <span className="text-xs uppercase tracking-[0.45em] text-[#c2a46c] font-outfit font-semibold animate-pulse">
                    Women Exclusive &bull; Sustainable Couture
                  </span>
                  
                  <h1 className="serif-header text-4xl sm:text-6xl md:text-7xl font-extralight tracking-[0.2em] leading-none text-white uppercase max-w-3xl drop-shadow-xs">
                    VIVIDHRA
                  </h1>
                  
                  <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-stone-200 font-light font-outfit">
                    Slogan: Dress with purpose &bull; Versatile Tailoring
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => {
                        const listSec = document.getElementById('collection-grid');
                        listSec?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-3.5 bg-white text-stone-900 text-xs uppercase tracking-widest font-outfit font-semibold hover:bg-[#1c1917] hover:text-white transition-all rounded-md shadow-lg cursor-pointer flex items-center space-x-2 group"
                    >
                      <span>Browse Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => setActiveView('story')}
                      className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-widest font-outfit font-semibold hover:bg-white/20 transition-all rounded-md border border-white/20 cursor-pointer"
                    >
                      Our Philosophy
                    </button>
                  </div>
                </div>

                {/* Quick Trust Anchor Rail (Anti-AI-Slop, Humble details) */}
                <div className="absolute bottom-6 left-0 right-0 z-20 hidden md:flex justify-center">
                  <div className="bg-black/40 backdrop-blur-md py-2.5 px-8 rounded-full border border-white/10 flex items-center space-x-8 text-[11px] font-mono tracking-wide text-stone-300">
                    <span>Mumbai Atelier</span>
                    <span className="text-[#c2a46c]">&bull;</span>
                    <span>100% Organic Cotton &amp; Silk</span>
                    <span className="text-[#c2a46c]">&bull;</span>
                    <span>Sustainably Certified</span>
                  </div>
                </div>
              </section>

              {/* Custom Silhouette Exhibition Section */}
              <section className="mx-4 md:mx-10 bg-[#faf9f5] border border-[#e7e5e4] rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e7e5e4]">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider text-[#c2a46c] font-mono bg-[#c2a46c]/10 px-3 py-1 rounded-full font-bold">
                      <Sparkles className="w-3 h-3 mr-1 text-[#c2a46c]" /> New Release: Autumn/Winter Capsule
                    </span>
                    <h2 className="serif-header text-2xl md:text-3xl font-bold text-stone-950">
                      The AI Stylist Silhouette Exhibition
                    </h2>
                    <p className="text-xs md:text-sm text-stone-600 font-light">
                      A limited collection engineered by our Digital Stylist, specifically designed to flatter vertical proportions, structured shoulders, and draped lines.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('atelier-ai');
                      const listSec = document.getElementById('collection-grid');
                      listSec?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs uppercase tracking-widest font-mono font-bold text-[#c2a46c] hover:text-stone-900 transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
                  >
                    <span>View all atelier picks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {products.filter(p => ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id)).map((p) => {
                    // Match visual label descriptions
                    const structureLabels: Record<string, { body: string; vibe: string }> = {
                      p14: { body: "Hourglass Frame", vibe: "Corporate Chic" },
                      p15: { body: "Petite Frame", vibe: "Quiet Luxury" },
                      p16: { body: "Broad Frame", vibe: "Bold Sculptural" },
                      p17: { body: "Rectangle Frame", vibe: "Asymmetrical" },
                      p18: { body: "Pear Frame", vibe: "Structured Corset" },
                      p19: { body: "All Heights", vibe: "Resort Lounge" },
                    };
                    const labels = structureLabels[p.id] || { body: "Balanced Proportions", vibe: "Aesthetic" };

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="bg-white border border-[#e7e5e4] rounded-2xl p-3 flex flex-col justify-between group hover:border-[#c2a46c] transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                      >
                        <div className="space-y-3">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 relative">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs py-1 px-2.5 rounded-full text-[8px] uppercase tracking-wider text-white font-mono font-bold">
                              {labels.vibe}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#c2a46c] transition-colors leading-tight uppercase tracking-tight">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-[#c2a46c] font-mono font-bold">
                              ₹{p.price} <span className="text-stone-400 line-through font-normal ml-1 font-mono text-[9px]">₹{p.originalPrice}</span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] text-stone-500 font-outfit">
                            <span>Fit Profile:</span>
                            <span className="font-bold text-stone-800">{labels.body}</span>
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-stone-400 font-mono uppercase">
                            <span>{p.category}</span>
                            <span className="text-stone-600 font-bold group-hover:underline">Tailor &bull; View &rarr;</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Category Filter Rail (Pristine Bento Card) */}
              <section id="collection-grid" className="mx-4 md:mx-10 bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xs scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#e7e5e4] pb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#c2a46c] font-semibold">
                      THE COMMODITY REGISTRY
                    </span>
                    <h2 className="serif-header text-2xl md:text-4xl font-bold text-[#1c1917] mt-1.5">
                      Mindful Silhouettes
                    </h2>
                  </div>

                  {/* Category Tags (Dresses, Co-ords, Tops, Trousers, Blazers) */}
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'all', label: 'All Items' },
                      { id: 'atelier-ai', label: '✨ AI Atelier Picks' },
                      { id: 'dresses', label: 'Dresses' },
                      { id: 'co-ords', label: 'Co-ords' },
                      { id: 'tops', label: 'Tops' },
                      { id: 'trousers', label: 'Trousers' },
                      { id: 'blazers', label: 'Blazers' },
                      { id: 'vacation', label: 'Vacation' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-outfit font-medium transition-all duration-300 cursor-pointer border ${
                          selectedCategory === cat.id
                            ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-xs'
                            : 'bg-white text-[#57534e] border-[#e7e5e4] hover:border-[#78716c]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Zara Style Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-[#e7e5e4]">
                    <p className="text-sm text-[#78716c] font-outfit">No garments found matching criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((prod) => (
                      <ZaraStyleProductCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        onWishlistToggle={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w.product.id === prod.id)}
                        onQuickView={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Purpose & Slogan Showcase Column (Editorial Bento Box) */}
              <section className="mx-4 md:mx-10 bg-[#F3F2EE] py-12 md:py-20 rounded-3xl border border-gray-200/40 shadow-xs">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#c2a46c] font-semibold">
                    MANDATORY BRAND CHARTER
                  </span>
                  <h3 className="serif-header text-2xl md:text-4xl font-light tracking-wide text-[#1c1917]">
                    &ldquo;Dress with purpose&rdquo;
                  </h3>
                  <p className="text-xs md:text-sm text-[#57534e] leading-relaxed max-w-2xl mx-auto font-sans font-light">
                    VIVIDHRA is not simply a label—it is an active communal movement. 
                    Every pattern we execute, every sustainably crafted weave we tailor, and every transaction we register is tied directly 
                    to funding shelters for animals, homes for the elderly, education for orphans, and tools for the disabled.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveView('donations')}
                      className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      View active donation pools
                    </button>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* STORY PAGE VIEW */}
          {activeView === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <StoryPage />
            </motion.div>
          )}

          {/* DONATION TRACKER VIEW */}
          {activeView === 'donations' && (
            <motion.div
              key="donations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <DonationTrackerPage
                charities={charities}
                logs={donationLogs}
                onDonate={handleDirectDonation}
              />
            </motion.div>
          )}

          {/* FIT PROFILE VIEW */}
          {activeView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-24 md:pt-32 pb-20 max-w-5xl mx-auto px-4 md:px-8 space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#c2a46c] font-semibold bg-[#c2a46c]/10 px-3 py-1 rounded-full">
                  Sizing Integrity
                </span>
                <h1 className="serif-header text-2xl md:text-4xl font-bold text-[#1c1917]">
                  Your Fit Profile & Saved Sizing
                </h1>
                <p className="text-xs md:text-sm text-[#78716c] font-light">
                  Configure your sizing indicators and consult our AI Atelier to generate tailored outfits mapped to your vertical frame.
                </p>
              </div>

              {/* Settle admin/customer mock identity switcher */}
              <div className="max-w-4xl mx-auto bg-stone-100 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-stone-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-stone-900">{user?.name} ({user?.email})</p>
                    <p className="text-[10px] text-stone-500 uppercase font-mono">Role: {user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500">Change role:</span>
                  <button
                    onClick={() => setUser(user ? { ...user, role: user.role === 'admin' ? 'customer' : 'admin' } : null)}
                    className="px-3 py-1 bg-white hover:bg-stone-200 text-[10px] uppercase tracking-wider font-bold rounded-md border cursor-pointer"
                  >
                    Switch to {user?.role === 'admin' ? 'Customer' : 'Atelier Admin'}
                  </button>
                </div>
              </div>

              {/* Sub tab Selector */}
              <div className="flex justify-center max-w-md mx-auto">
                <div className="flex bg-[#fafaf9] border border-stone-200 p-1 rounded-xl w-full">
                  <button
                    onClick={() => setProfileSubTab('ai-silhouette')}
                    className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      profileSubTab === 'ai-silhouette'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>AI Silhouette Studio</span>
                  </button>
                  <button
                    onClick={() => setProfileSubTab('profile-form')}
                    className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      profileSubTab === 'profile-form'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sizing Portfolio</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {profileSubTab === 'ai-silhouette' ? (
                  <motion.div
                    key="ai-silhouette"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AISilhouetteStudio
                      products={products}
                      onSelectProduct={(product) => setSelectedProduct(product)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="profile-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FitProfileForm
                      currentProfile={user?.fitProfile}
                      onSaveProfile={handleSaveFitProfile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ADMIN WORKSPACE VIEW */}
          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminPanel
                products={products}
                orders={orders}
                charities={charities}
                onAddProduct={handleAdminAddProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Global Styling Assistant Floating Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {isAIStylistOpen ? (
          <div className="w-[360px] md:w-[420px] h-[520px] shadow-2xl relative animate-fade-in">
            <AIStylist
              fitProfile={user?.fitProfile}
              currentProduct={selectedProduct}
              onClose={() => setIsAIStylistOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAIStylistOpen(true)}
            className="flex items-center space-x-2 px-4.5 py-3.5 bg-[#1c1917] hover:bg-[#3c3734] text-[#fafaf9] rounded-full shadow-2xl transition-all cursor-pointer border border-[#c2a46c]/40 group hover:scale-105"
            title="Open AI Atelier Stylist"
          >
            <Sparkles className="w-4 h-4 text-[#c2a46c] animate-pulse" />
            <span className="text-xs font-outfit uppercase tracking-widest font-semibold">AI Stylist</span>
          </button>
        )}
      </div>

      {/* 4. Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e7e5e4] shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-[#f5f5f4] hover:bg-[#e7e5e4] rounded-full transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5 text-stone-800" />
            </button>

            {/* Left Image Carousel */}
            <div className="space-y-3">
              <div className="aspect-[3/4] bg-[#f5f5f4] rounded-xl overflow-hidden border">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.images.map((img, idx) => (
                  <div key={idx} className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden border">
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right details panel */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c]">
                    {selectedProduct.category}
                  </span>
                  <h2 className="serif-header text-xl md:text-3xl font-bold text-[#1c1917]">
                    {selectedProduct.name}
                  </h2>
                </div>

                <div className="flex items-baseline space-x-3">
                  <span className="font-mono text-lg font-bold text-[#1c1917]">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="font-mono text-xs text-[#a8a29e] line-through">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-[#57534e] leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                <div className="space-y-1.5 text-xs text-[#57534e] border-y border-[#f5f5f4] py-3.5">
                  <p>
                    <strong className="text-[#1c1917]">Materials:</strong> {selectedProduct.materials}
                  </p>
                  <p>
                    <strong className="text-[#1c1917]">Care Guide:</strong> {selectedProduct.care}
                  </p>
                  <p>
                    <strong className="text-[#1c1917]">Slogan:</strong>{' '}
                    <span className="text-emerald-600 font-serif italic">Dress with purpose</span>
                  </p>
                </div>

                {/* Interactive Occasion Suitability Matcher */}
                <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#e7e5e4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                      Interactive Suitability Match
                    </span>
                    <span className="text-[9px] uppercase font-mono bg-[#c2a46c]/10 text-[#c2a46c] px-2 py-0.5 rounded-full font-bold">
                      Womenswear Ready
                    </span>
                  </div>

                  {/* Occasion buttons */}
                  <div className="grid grid-cols-4 gap-1">
                    {(['office', 'party', 'home', 'college'] as const).map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setSelectedOccasion(occ)}
                        className={`py-1 rounded-lg text-[10px] font-outfit uppercase tracking-wider transition-all font-semibold cursor-pointer text-center border ${
                          selectedOccasion === occ
                            ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-2xs'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-[#c2a46c]'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>

                  {/* Score & Commentary */}
                  {(() => {
                    const cat = selectedProduct.category.toLowerCase();
                    let score = 80;
                    let desc = "";

                    if (cat === 'blazers') {
                      if (selectedOccasion === 'office') { score = 98; desc = "Sharp tailored shoulders and sustainable weave commands executive presence."; }
                      else if (selectedOccasion === 'party') { score = 88; desc = "Throw over a silk cowl slip with heels for an effortless high-fashion lounge look."; }
                      else if (selectedOccasion === 'home') { score = 55; desc = "Structured silhouette. Perfect for polished video calls, but less suited for direct lounging."; }
                      else if (selectedOccasion === 'college') { score = 82; desc = "Drape it open over high-waisted denim and simple sneakers for an academic edge."; }
                    } else if (cat === 'dresses') {
                      if (selectedOccasion === 'office') { score = 75; desc = "Elegant length. Style with a clean blazer to anchor office presentation."; }
                      else if (selectedOccasion === 'party') { score = 99; desc = "An absolute showstopper. Silk flows luxuriously under twilight lights."; }
                      else if (selectedOccasion === 'home') { score = 72; desc = "Extremely breathable natural weave offers comfort, though looks highly glamorous."; }
                      else if (selectedOccasion === 'college') { score = 78; desc = "An effortlessly bohemian option. Pairs lovely with simple flat sandals and tote bags."; }
                    } else if (cat === 'co-ords') {
                      if (selectedOccasion === 'office') { score = 84; desc = "Ribbed knit tunic is neat and professional. Keeps you super comfortable during long tasks."; }
                      else if (selectedOccasion === 'party') { score = 88; desc = "Minimalist luxury base. Add layered necklaces and micro bag to stand out."; }
                      else if (selectedOccasion === 'home') { score = 98; desc = "Crafted in bamboo cotton. Incredibly soft against skin for premium homestyle hours."; }
                      else if (selectedOccasion === 'college') { score = 92; desc = "Super trendy matching set look that feels lazy-cozy but displays top-tier taste."; }
                    } else if (cat === 'trousers') {
                      if (selectedOccasion === 'office') { score = 98; desc = "Architectural pleats and clean high-waisted rise. Perfect formal staple."; }
                      else if (selectedOccasion === 'party') { score = 90; desc = "Style with an backless satin top and bold lips for a chic, structural party look."; }
                      else if (selectedOccasion === 'home') { score = 78; desc = "Fluid satin trousers breathe easily, though we recommend a softer knit for sleep."; }
                      else if (selectedOccasion === 'college') { score = 92; desc = "Pairs stunningly with simple cropped cardigans and vintage canvas shoes."; }
                    } else if (cat === 'tops') {
                      if (selectedOccasion === 'office') { score = 94; desc = "Our poplin shirts are crisp and reliable. Essential core garment."; }
                      else if (selectedOccasion === 'party') { score = 80; desc = "Tuck with high-rise silk skirts and fine earrings to convert to evening wear."; }
                      else if (selectedOccasion === 'home') { score = 88; desc = "Lightweight premium yarns keep you feeling fresh and weightless."; }
                      else if (selectedOccasion === 'college') { score = 96; desc = "Extremely versatile, breathable, and easily layered for library to lab transitions."; }
                    } else { // vacation or other
                      if (selectedOccasion === 'office') { score = 68; desc = "Best styled with a tailored blazer to ground the flowing resort silhouette."; }
                      else if (selectedOccasion === 'party') { score = 94; desc = "Gorgeous earthy colors and breezy silk tiers capture the perfect cocktail hours."; }
                      else if (selectedOccasion === 'home') { score = 85; desc = "Breezy and loose. Incredible comfort for spending leisure hours reading."; }
                      else if (selectedOccasion === 'college') { score = 88; desc = "Relaxed vacation energy that makes the campus pathways feel like a coastal retreat."; }
                    }

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-stone-600 font-sans font-medium">
                            Suitability for <span className="font-bold uppercase text-stone-900">{selectedOccasion}</span>
                          </span>
                          <span className="font-mono text-xs font-bold text-[#c2a46c]">
                            {score}% Match
                          </span>
                        </div>
                        {/* Suitability score bar */}
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              score >= 90 ? 'bg-[#c2a46c]' : score >= 80 ? 'bg-stone-800' : 'bg-stone-500'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500 leading-normal italic">
                          &ldquo;{desc}&rdquo;
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Sizing & Actions */}
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[#78716c] font-outfit font-medium">
                    Available Sizes
                  </p>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          handleAddToCart(selectedProduct, size, selectedProduct.colors[0]);
                          setSelectedProduct(null);
                        }}
                        className="w-10 h-10 rounded-full border border-[#d6d3d1] text-xs font-mono flex items-center justify-center hover:bg-[#1c1917] hover:text-white hover:border-[#1c1917] transition-all cursor-pointer font-bold"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Styling consultation deep-link */}
                <button
                  onClick={() => {
                    setIsAIStylistOpen(true);
                  }}
                  className="w-full py-2 bg-[#c2a46c]/10 hover:bg-[#c2a46c]/15 text-[#c2a46c] text-[10px] uppercase tracking-widest font-mono font-bold rounded-lg border border-[#c2a46c]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consult AI Stylist for this garment</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 5. Cart Slide-Out Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          
          <div className="bg-[#fafaf9] w-full max-w-md h-full relative z-10 flex flex-col justify-between shadow-2xl p-6 border-l border-[#e7e5e4] animate-slide-in-right">
            
            <div>
              <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-4 mb-6">
                <h3 className="serif-header text-lg font-bold text-[#1c1917] flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#c2a46c]" />
                  <span>Your Shopping Bag</span>
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <p className="text-xs text-[#78716c] font-outfit">Your bag is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] uppercase tracking-wider text-[#c2a46c] hover:underline font-mono"
                  >
                    Continue sourcing
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-[#e7e5e4] shadow-2xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3.5 truncate">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-16 object-cover rounded-md bg-stone-50"
                        />
                        <div className="truncate space-y-0.5">
                          <h4 className="font-serif text-xs font-bold text-[#1c1917] truncate">{item.product.name}</h4>
                          <p className="text-[9px] text-[#a8a29e] font-mono">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="mono-text text-xs font-bold text-[#1c1917]">
                            ₹{item.product.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 border border-[#e7e5e4] rounded-lg bg-stone-50 p-1">
                        <button
                          onClick={() => handleUpdateCartQuantity(item.id, -1)}
                          className="p-1 hover:bg-stone-200 rounded text-[#1c1917]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateCartQuantity(item.id, 1)}
                          className="p-1 hover:bg-stone-200 rounded text-[#1c1917]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#e7e5e4] pt-6 space-y-4 bg-[#fafaf9]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#78716c] font-outfit uppercase tracking-widest">Subtotal</span>
                  <span className="font-mono text-sm font-bold text-[#1c1917]">₹{cartSubtotal}</span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                    <span>Purpose Roundup (Split)</span>
                    <span>₹{computedRoundUp}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 leading-normal">
                    Check the box at checkout to round up your total to ₹{nextHundredValue} in support of our charity ledger. Slogan: Dress with purpose.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer text-center"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. Wishlist Slide-Out Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />
          
          <div className="bg-[#fafaf9] w-full max-w-md h-full relative z-10 flex flex-col justify-between shadow-2xl p-6 border-l border-[#e7e5e4] animate-slide-in-right">
            
            <div>
              <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-4 mb-6">
                <h3 className="serif-header text-lg font-bold text-[#1c1917] flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <span>Curated Wishlist</span>
                </h3>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <p className="text-xs text-[#78716c] font-outfit">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-[#e7e5e4] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-16 object-cover rounded-md"
                        />
                        <div className="truncate space-y-0.5">
                          <h4 className="font-serif text-xs font-bold text-[#1c1917] truncate">{item.product.name}</h4>
                          <p className="mono-text text-xs font-bold text-[#1c1917]">₹{item.product.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            handleAddToCart(item.product, 'M', item.product.colors[0]);
                            setIsWishlistOpen(false);
                          }}
                          className="p-1.5 bg-[#1c1917] text-white hover:bg-stone-700 rounded-lg text-xs"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(item.product.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-3 bg-[#1c1917] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all"
            >
              Close Drawer
            </button>

          </div>
        </div>
      )}

      {/* 7. Interactive Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-20 backdrop-blur-xs animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="serif-header font-bold text-stone-900">Explore the Atelier catalog</span>
              <button onClick={() => setIsSearchOpen(false)} className="text-stone-500 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by fabrics, silhouettes, or styles (e.g. Linen, Co-ord)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-100 border rounded-xl focus:outline-hidden focus:border-stone-900 focus:bg-white text-xs font-outfit"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>

            {searchQuery && (
              <p className="text-[11px] text-stone-500">
                Found {filteredProducts.length} matching designs for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            <div className="max-h-60 overflow-y-auto divide-y">
              {filteredProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsSearchOpen(false);
                  }}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-stone-50 rounded-lg px-2"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded" />
                    <div>
                      <p className="font-serif text-xs font-bold text-stone-900">{p.name}</p>
                      <p className="text-[10px] text-stone-500 font-outfit">{p.materials}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-stone-900">₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Checkout Purchase Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative border shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 bg-[#f5f5f4] hover:bg-[#e7e5e4] rounded-full cursor-pointer"
            >
              <X className="w-4 h-4 text-stone-800" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto border border-emerald-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="serif-header text-xl md:text-2xl font-bold text-stone-900">
                  Purchase Transacted Successfully
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-outfit">
                  An amount of <strong className="text-stone-900">₹{checkoutTotal}</strong> has been secured under Order ID <strong className="text-stone-900 font-mono">#{placedOrderId}</strong>. 
                  Thank you deeply for your support.
                </p>
                <div className="p-4 bg-stone-50 rounded-xl border">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Charitable split logged</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">₹{computedRoundUp} successfully routed to community pools</p>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCheckoutSuccess(false);
                    setActiveView('donations');
                  }}
                  className="px-6 py-2 bg-stone-900 text-white hover:bg-stone-800 text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer"
                >
                  View Purpose Ledger
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="serif-header text-lg md:text-2xl font-bold text-stone-900">
                    Secure Delivery Details
                  </h3>
                  <p className="text-[11px] text-stone-500 font-outfit">
                    Complete your checkout parameters to finalize purchase from the Mumbai atelier.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Email Address</label>
                    <input
                      type="email"
                      placeholder="patron@vividhra.com"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Street name, Building name, Apartment number"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">City</label>
                    <input
                      type="text"
                      placeholder="Mumbai, India"
                      value={checkoutCity}
                      onChange={(e) => setCheckoutCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRoundUpEnabled}
                      onChange={(e) => setIsRoundUpEnabled(e.target.checked)}
                      className="rounded border-stone-300 text-stone-900 focus:ring-0 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 font-outfit block">
                        Enable &ldquo;Dress with purpose&rdquo; Roundup
                      </span>
                      <span className="text-[11px] text-stone-500 leading-normal block mt-0.5">
                        Round up from ₹{cartSubtotal} to ₹{nextHundredValue} (contributing ₹{computedRoundUp}) to split among animal shelters, old age caretakers, orphans, and the disabled.
                      </span>
                    </div>
                  </label>

                  {isRoundUpEnabled && charities.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                        Target Charities (Split equally)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {charities.map((c) => {
                          const active = checkoutCharities.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                if (active) {
                                  setCheckoutCharities(checkoutCharities.filter((x) => x !== c.id));
                                } else {
                                  setCheckoutCharities([...checkoutCharities, c.id]);
                                }
                              }}
                              className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-outfit text-left truncate transition-colors ${
                                active
                                  ? 'bg-[#1c1917] text-white border-[#1c1917]'
                                  : 'bg-white text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              ✓ {c.name.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 font-outfit">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900">₹{cartSubtotal}</span>
                  </div>
                  {isRoundUpEnabled && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Purpose roundup</span>
                      <span className="font-mono text-stone-900">₹{computedRoundUp}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t text-stone-900">
                    <span>Total secured amount</span>
                    <span className="font-mono text-[#c2a46c]">₹{checkoutTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer"
                >
                  Pay ₹{checkoutTotal} (Secured Ledger)
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 9. Premium Brand Footer */}
      <Footer setActiveView={(v) => {
        setActiveView(v);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}
