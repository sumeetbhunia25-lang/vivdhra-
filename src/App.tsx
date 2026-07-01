import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import gsap from 'gsap';
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
  DollarSign,
  Mail,
  Send,
  Check,
  Phone,
  CreditCard,
  Ticket,
  Clock,
  Trash2
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
import PremiumHero from './components/PremiumHero';
import OrderJourneyTracker from './components/OrderJourneyTracker';
import CollectionDrawer, { collectionCategories } from './components/CollectionDrawer';

const categoriesList = [
  { id: 'all', label: 'All Items', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200' },
  { id: 'atelier-ai', label: 'AI Atelier Picks', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=200' },
  ...collectionCategories
];

export default function App() {
  // Scroll progress for Home & Story view
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Navigation & Core views
  const [showIntro, setShowIntro] = useState(true);
  const [activeView, setActiveView] = useState<'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop'>('home');
  const [profileSubTab, setProfileSubTab] = useState<'ai-silhouette' | 'profile-form' | 'order-tracking'>('ai-silhouette');
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
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState(false);
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

  // Patron Authentication states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'customer' | 'admin'>('customer');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Launch-ready premium enhancements
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // States to preserve details for the simulated email order receipt
  const [lastOrderItems, setLastOrderItems] = useState<any[]>([]);
  const [lastOrderSubtotal, setLastOrderSubtotal] = useState(0);
  const [lastOrderRoundUp, setLastOrderRoundUp] = useState(0);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderCharities, setLastOrderCharities] = useState<string[]>([]);
  const [lastOrderEmail, setLastOrderEmail] = useState('');
  const [lastOrderName, setLastOrderName] = useState('');
  const [lastOrderAddress, setLastOrderAddress] = useState('');
  const [lastOrderCity, setLastOrderCity] = useState('');
  const [lastOrderPromoDiscount, setLastOrderPromoDiscount] = useState(0);
  const [lastOrderShippingFee, setLastOrderShippingFee] = useState(0);
  const [lastOrderGiftWrapping, setLastOrderGiftWrapping] = useState(false);
  const [lastOrderPhone, setLastOrderPhone] = useState('');
  const [lastOrderNotes, setLastOrderNotes] = useState('');
  const [lastOrderPaymentMethod, setLastOrderPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isEmailResending, setIsEmailResending] = useState(false);
  const [emailResentSuccess, setEmailResentSuccess] = useState(false);

  // Recent Searches state and persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vividhra_recent_searches');
      return saved ? JSON.parse(saved) : ['Linen', 'Silk', 'Co-ord', 'Kurta', 'Handloom'];
    } catch {
      return ['Linen', 'Silk', 'Co-ord', 'Kurta', 'Handloom'];
    }
  });

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('vividhra_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(q => q !== query);
      try {
        localStorage.setItem('vividhra_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('vividhra_recent_searches');
    } catch (e) {
      console.error(e);
    }
  };

  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!productGridRef.current) return;

    let isIntersecting = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting = true;
            animateCards();
          } else {
            isIntersecting = false;
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );

    const animateCards = () => {
      if (!productGridRef.current) return;
      const cards = productGridRef.current.querySelectorAll('.gsap-product-card');
      if (cards.length > 0) {
        gsap.killTweensOf(cards);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            overwrite: 'auto'
          }
        );
      }
    };

    observer.observe(productGridRef.current);

    // Trigger on mount or products change
    const delay = setTimeout(() => {
      animateCards();
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(delay);
    };
  }, [products, selectedCategory, searchQuery]);

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

  const fetchAndSetProfile = async (uid?: string) => {
    try {
      const savedUid = uid || localStorage.getItem('vividhra_user_uid');
      const url = savedUid ? `/api/user/profile?uid=${savedUid}` : '/api/user/profile';
      const res = await fetch(url);
      const data = await res.json();
      if (data.email) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user profile
  useEffect(() => {
    fetchAndSetProfile();
  }, []);

  // Patron Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!authEmail || !authPassword) {
      setAuthError('Email and password are required.');
      return;
    }
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName,
          role: authRole
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess('Welcome to VIVIDHRA! Your patron profile was created successfully.');
        localStorage.setItem('vividhra_user_uid', data.uid);
        setUser(data);
        // Clear input credentials
        setAuthPassword('');
        setAuthName('');
      } else {
        setAuthError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Network error. Failed to reach server.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Patron Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!authEmail || !authPassword) {
      setAuthError('Email and password are required.');
      return;
    }
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess('Sign in successful. Welcome back!');
        localStorage.setItem('vividhra_user_uid', data.uid);
        setUser(data);
        // Clear sensitive inputs
        setAuthPassword('');
      } else {
        setAuthError(data.error || 'Invalid credentials. Please verify your details.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Network error. Failed to reach server.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Patron Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('vividhra_user_uid');
    setAuthSuccess('');
    setAuthError('');
    // Reload default guest profile from backend
    fetchAndSetProfile('guest-uid');
  };

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
  
  // Promo code validation and discount calculation
  const promoDiscount = appliedPromo ? Math.round(cartSubtotal * (appliedPromo.discountPercent / 100)) : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - promoDiscount);
  
  // Free Shipping Threshold of ₹5000: if subtotal is > 0 and < ₹5000, charge ₹150 flat shipping
  const shippingFee = cartSubtotal > 0 && discountedSubtotal < 5000 ? 150 : 0;
  
  const nextHundredValue = Math.ceil((discountedSubtotal + shippingFee + 10) / 100) * 100;
  const computedRoundUp = isRoundUpEnabled && cartSubtotal > 0 ? (nextHundredValue - (discountedSubtotal + shippingFee)) : 0;
  const checkoutTotal = discountedSubtotal + shippingFee + computedRoundUp;

  // Handle Promo Code Submission
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discountPercent: 10 });
    } else if (code === 'LAUNCH20') {
      setAppliedPromo({ code: 'LAUNCH20', discountPercent: 20 });
    } else if (code === 'DIRECTSUPPORT') {
      setAppliedPromo({ code: 'DIRECTSUPPORT', discountPercent: 15 });
    } else {
      setPromoError('Invalid coupon code. Try WELCOME10 or LAUNCH20.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

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
        phone: checkoutPhone,
        notes: checkoutNotes,
        paymentMethod: paymentMethod,
        giftWrapping: giftWrapping,
        items: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
          selectedSize: c.size,
          selectedColor: c.color,
        })),
        subtotal: cartSubtotal,
        promoDiscount: promoDiscount,
        promoCode: appliedPromo ? appliedPromo.code : null,
        shippingFee: shippingFee,
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
      
      // Store checkout parameters for the simulated email order receipt
      setLastOrderItems([...cart]);
      setLastOrderSubtotal(cartSubtotal);
      setLastOrderPromoDiscount(promoDiscount);
      setLastOrderShippingFee(shippingFee);
      setLastOrderGiftWrapping(giftWrapping);
      setLastOrderPhone(checkoutPhone);
      setLastOrderNotes(checkoutNotes);
      setLastOrderPaymentMethod(paymentMethod);
      setLastOrderRoundUp(computedRoundUp);
      setLastOrderTotal(checkoutTotal);
      setLastOrderCharities(isRoundUpEnabled ? [...checkoutCharities] : []);
      setLastOrderEmail(checkoutEmail);
      setLastOrderName(checkoutName);
      setLastOrderAddress(checkoutAddress);
      setLastOrderCity(checkoutCity);
      setEmailResentSuccess(false); // Reset resend indicator
      
      setPlacedOrderId(data.orderId || Math.floor(1000 + Math.random() * 9000).toString());
      setCheckoutSuccess(true);
      
      // Clear Cart and Checkout Form variables
      setCart([]);
      setPromoCode('');
      setAppliedPromo(null);
      setGiftWrapping(false);
      setCheckoutPhone('');
      setCheckoutNotes('');
      await loadData(); // Reload pools and counts
    } catch (err) {
      console.error(err);
      alert('Failed to execute purchase. Check parameters.');
    }
  };

  // Filter products by search and category mapping dynamically for all 17 categories
  const filteredProducts = products.filter((p) => {
    let matchCategory = false;
    
    if (selectedCategory === 'all') {
      matchCategory = true;
    } else if (selectedCategory === 'atelier-ai') {
      matchCategory = ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id);
    } else if (selectedCategory === 'new-arrivals') {
      matchCategory = p.isTrending || p.id === 'p14' || p.id === 'p15';
    } else if (selectedCategory === 'best-sellers') {
      matchCategory = p.isTrending && p.price > 1600;
    } else if (selectedCategory === 'dresses') {
      matchCategory = p.category === 'dresses';
    } else if (selectedCategory === 'tops') {
      matchCategory = p.category === 'tops';
    } else if (selectedCategory === 'co-ords') {
      matchCategory = p.category === 'co-ords';
    } else if (selectedCategory === 'bottoms') {
      matchCategory = p.category === 'trousers';
    } else if (selectedCategory === 'kurtis') {
      matchCategory = p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape');
    } else if (selectedCategory === 'ethnic-sets') {
      matchCategory = p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric');
    } else if (selectedCategory === 'party-wear') {
      matchCategory = p.name.toLowerCase().includes('corset') || p.name.toLowerCase().includes('satin') || p.name.toLowerCase().includes('wine') || p.category === 'blazers';
    } else if (selectedCategory === 'office-wear') {
      matchCategory = p.category === 'blazers' || p.category === 'trousers';
    } else if (selectedCategory === 'daily-wear') {
      matchCategory = p.category === 'tops' || p.category === 'co-ords';
    } else if (selectedCategory === 'vacation-wear') {
      matchCategory = p.category === 'vacation' || p.materials.toLowerCase().includes('linen');
    } else if (selectedCategory === 'college-wear') {
      matchCategory = p.price < 1800;
    } else if (selectedCategory === 'house-wear') {
      matchCategory = p.materials.toLowerCase().includes('cotton') && p.category === 'tops';
    } else if (selectedCategory === 'minimal-collection') {
      matchCategory = p.materials.toLowerCase().includes('linen') || p.category === 'blazers';
    } else if (selectedCategory === 'sustainable-picks') {
      matchCategory = p.materials.toLowerCase().includes('organic') || p.materials.toLowerCase().includes('gots') || p.materials.toLowerCase().includes('eco');
    } else if (selectedCategory === 'sale') {
      matchCategory = p.originalPrice > p.price;
    } else {
      matchCategory = p.category === selectedCategory;
    }

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
      {(activeView === 'home' || activeView === 'story') && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#dfba73] via-[#c2a46c] to-[#8d6f34] origin-left"
          style={{ scaleX, zIndex: 100 }}
        />
      )}
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
        onOpenCollectionMenu={() => setIsCollectionDrawerOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        products={products}
      />

      <CollectionDrawer
        isOpen={isCollectionDrawerOpen}
        onClose={() => setIsCollectionDrawerOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setActiveView={setActiveView}
        cart={cart}
        wishlist={wishlist}
        user={user}
        products={products}
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
              className="space-y-10 pb-16"
            >
              
              <PremiumHero 
                onBrowse={() => {
                  const listSec = document.getElementById('collection-grid');
                  listSec?.scrollIntoView({ behavior: 'smooth' });
                }}
                onExplorePhilosophy={() => setActiveView('story')}
              />

              {/* Custom Silhouette Exhibition Section */}
              <section className="mx-4 md:mx-10 bg-[#faf9f5] border border-[#e7e5e4] rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e7e5e4]">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider text-[#c2a46c] font-mono bg-[#c2a46c]/10 px-3 py-1 rounded-full font-bold">
                      <Sparkles className="w-3 h-3 mr-1 text-[#c2a46c]" /> New Release: Autumn/Winter Collection
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

                <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-6 lg:overflow-x-visible lg:pb-0 scrollbar-none">
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
                        className="flex-none w-[260px] sm:w-[300px] lg:w-auto snap-start bg-white border border-[#e7e5e4] rounded-2xl p-3 flex flex-col justify-between group hover:border-[#c2a46c] transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.01]"
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

              {/* Products Catalog Grid */}
              <section id="collection-grid" className="mx-4 md:mx-10 bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xs scroll-mt-24">
                <div className="mb-8 border-b border-[#e7e5e4] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#c2a46c] font-semibold">
                      VIVIDHRA SELECTION
                    </span>
                    <h2 className="serif-header text-2xl md:text-4xl font-bold text-[#1c1917] mt-1.5">
                      {categoriesList.find(c => c.id === selectedCategory)?.label || 'Our Collection'}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3.5 py-1.5 rounded-full font-semibold self-start sm:self-auto">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'} Available
                  </span>
                </div>

                {/* Products Zara Style Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-[#e7e5e4]">
                    <p className="text-sm text-[#78716c] font-outfit">No garments found matching criteria.</p>
                  </div>
                ) : (
                  <div ref={productGridRef} className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-none w-full">
                    {filteredProducts.map((prod) => (
                      <ZaraStyleProductCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        onWishlistToggle={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w.product.id === prod.id)}
                        onQuickView={(p) => setSelectedProduct(p)}
                        className="flex-none w-[315px] sm:w-[380px] md:w-[410px] lg:w-[440px] snap-start gsap-product-card opacity-0"
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
                      onClick={() => setActiveView('stylist')}
                      className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Consult AI Styling Atelier
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

          {/* AI ATELIER STYLIST VIEW */}
          {activeView === 'stylist' && (
            <motion.div
              key="stylist"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-24 md:pt-32 pb-20 max-w-5xl mx-auto px-4 md:px-8 space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#c2a46c] font-semibold bg-[#c2a46c]/10 px-3 py-1 rounded-full">
                  Atelier Intelligent Guidance
                </span>
                <h1 className="serif-header text-2xl md:text-4xl font-bold text-[#1c1917]">
                  VIVIDHRA AI Atelier Stylist
                </h1>
                <p className="text-xs md:text-sm text-[#78716c] font-light">
                  Consult our intelligent stylist on sustainable fabric structures, silhouette matches for your fit profile, and co-ord curation guidelines.
                </p>
              </div>

              <div className="h-[600px] max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white">
                <AIStylist
                  fitProfile={user?.fitProfile}
                  currentProduct={selectedProduct}
                />
              </div>
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
              {(() => {
                const isRegisteredPatron = user && localStorage.getItem('vividhra_user_uid') === user.uid && user.email !== 'guest@vividhra.com';
                
                return !isRegisteredPatron ? (
                  <div className="max-w-4xl mx-auto bg-[#faf9f6] border border-stone-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-5">
                    {/* Left Side Banner */}
                    <div className="col-span-2 bg-[#1c1917] p-8 text-white flex flex-col justify-between space-y-6 relative overflow-hidden">
                      <div className="space-y-4 relative z-10">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#c2a46c] font-bold border border-[#c2a46c]/40 px-2.5 py-1 rounded-full bg-[#c2a46c]/10">
                          Patron Sanctuary
                        </span>
                        <h2 className="serif-header text-xl md:text-2xl font-bold tracking-tight text-stone-100">
                          VIVIDHRA Patron Portal
                        </h2>
                        <p className="text-[11px] text-stone-300 font-light leading-relaxed">
                          Welcome to our textile sanctuary. Establish an authentic patron profile to securely store your digital silhouette profiles, customize material preferences, and preserve order histories across all your devices.
                        </p>
                      </div>
                      <div className="pt-4 border-t border-stone-800 text-[10px] text-stone-400 font-mono relative z-10 text-left">
                        <p className="font-serif italic text-[#c2a46c] text-[11px] mb-1">“Dress with purpose”</p>
                        <p>Sanskrit heritage & sustainable tailoring.</p>
                      </div>
                      {/* Decorative pattern */}
                      <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#c2a46c]/10 rounded-full blur-2xl pointer-events-none" />
                    </div>

                    {/* Right Side Controls */}
                    <div className="col-span-3 p-8 space-y-6 bg-white">
                      {/* Tab Toggles */}
                      <div className="flex border-b border-stone-200 pb-1">
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          className={`pb-2.5 text-xs font-bold uppercase tracking-wider font-outfit mr-6 border-b-2 transition-all cursor-pointer ${
                            authMode === 'login'
                              ? 'border-[#1c1917] text-[#1c1917]'
                              : 'border-transparent text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setAuthMode('register');
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          className={`pb-2.5 text-xs font-bold uppercase tracking-wider font-outfit border-b-2 transition-all cursor-pointer ${
                            authMode === 'register'
                              ? 'border-[#1c1917] text-[#1c1917]'
                              : 'border-transparent text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          Create Account
                        </button>
                      </div>

                      {/* Alerts */}
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-light leading-relaxed flex items-center space-x-2 text-left"
                        >
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                          <span>{authError}</span>
                        </motion.div>
                      )}

                      {authSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-light leading-relaxed flex items-center space-x-2 text-left"
                        >
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full flex-shrink-0" />
                          <span>{authSuccess}</span>
                        </motion.div>
                      )}

                      {/* Form */}
                      <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4 text-left">
                        {authMode === 'register' && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                              Full Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                placeholder="Ananya Iyer"
                                required
                                className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-xs font-outfit focus:outline-hidden focus:border-[#1c1917] bg-stone-50/50"
                              />
                              <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                            Patron Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              placeholder="ananya@vividhra.com"
                              required
                              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-xs font-outfit focus:outline-hidden focus:border-[#1c1917] bg-stone-50/50"
                            />
                            <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                            Security Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-xs font-outfit focus:outline-hidden focus:border-[#1c1917] bg-stone-50/50"
                            />
                            <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                          </div>
                        </div>

                        {authMode === 'register' && (
                          <div className="space-y-2 pt-1">
                            <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold block">
                              Atelier Access Role
                            </span>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2 text-xs font-outfit cursor-pointer text-stone-700">
                                <input
                                  type="radio"
                                  name="authRole"
                                  checked={authRole === 'customer'}
                                  onChange={() => setAuthRole('customer')}
                                  className="accent-[#1c1917]"
                                />
                                <span>Customer Patron</span>
                              </label>
                              <label className="flex items-center space-x-2 text-xs font-outfit cursor-pointer text-stone-700">
                                <input
                                  type="radio"
                                  name="authRole"
                                  checked={authRole === 'admin'}
                                  onChange={() => setAuthRole('admin')}
                                  className="accent-[#1c1917]"
                                />
                                <span>Atelier Admin</span>
                              </label>
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isAuthLoading}
                          className="w-full py-2.5 bg-[#1c1917] hover:bg-[#3c3734] disabled:bg-stone-300 text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                        >
                          {isAuthLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>{authMode === 'login' ? 'Authenticate Sanctuary' : 'Join the Atelier'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Quick fill with Guest demo
                              setUser({
                                uid: 'guest-uid',
                                email: 'guest@vividhra.com',
                                displayName: 'Demo Guest',
                                role: 'customer',
                                wishlist: [],
                                cart: []
                              });
                            }}
                            className="text-[10px] text-stone-400 hover:text-stone-600 underline font-mono cursor-pointer"
                          >
                            Continue exploring as Guest Patron
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto bg-[#fbfbfa] p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1c1917] flex items-center justify-center text-[#c2a46c] shadow-xs">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-[#c2a46c] font-bold">
                          Authenticated Patron
                        </span>
                        <p className="text-sm font-bold text-stone-900">{user?.name || user?.displayName}</p>
                        <p className="text-xs text-stone-500 font-outfit leading-none">{user?.email}</p>
                        <p className="text-[10px] text-stone-400 font-mono uppercase pt-1">Role: {user?.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2 border-r border-stone-200 pr-4 mr-1">
                        <span className="text-[10px] uppercase tracking-wider text-stone-500">Quick role switch:</span>
                        <button
                          onClick={() => setUser(user ? { ...user, role: user.role === 'admin' ? 'customer' : 'admin' } : null)}
                          className="px-3 py-1 bg-white hover:bg-stone-100 text-[10px] uppercase tracking-wider font-bold rounded-md border cursor-pointer transition-all"
                        >
                          {user?.role === 'admin' ? 'Be Customer' : 'Be Admin'}
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer shadow-xs flex items-center space-x-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Sub tab Selector */}
              <div className="flex justify-center max-w-xl mx-auto">
                <div className="flex bg-[#fafaf9] border border-stone-200 p-1 rounded-xl w-full">
                  <button
                    onClick={() => setProfileSubTab('ai-silhouette')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 md:space-x-1.5 ${
                      profileSubTab === 'ai-silhouette'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>AI Silhouette</span>
                  </button>
                  <button
                    onClick={() => setProfileSubTab('profile-form')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 md:space-x-1.5 ${
                      profileSubTab === 'profile-form'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sizing Portfolio</span>
                  </button>
                  <button
                    onClick={() => setProfileSubTab('order-tracking')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 md:space-x-1.5 ${
                      profileSubTab === 'order-tracking'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {profileSubTab === 'ai-silhouette' && (
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
                )}

                {profileSubTab === 'profile-form' && (
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

                {profileSubTab === 'order-tracking' && (
                  <motion.div
                    key="order-tracking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <OrderJourneyTracker
                      orders={orders}
                      currentUserEmail={user?.email}
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
      <AnimatePresence>
        {isAIStylistOpen ? (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop for mobile to focus of chat panel */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-xs sm:hidden"
              onClick={() => setIsAIStylistOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md sm:w-[420px] h-[82vh] sm:h-[540px] shadow-2xl relative bg-[#fafaf9] rounded-2xl overflow-hidden flex flex-col z-10 border border-[#e7e5e4]"
            >
              <AIStylist
                fitProfile={user?.fitProfile}
                currentProduct={selectedProduct}
                onClose={() => setIsAIStylistOpen(false)}
              />
            </motion.div>
          </div>
        ) : (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsAIStylistOpen(true)}
              className="flex items-center space-x-2 px-4.5 py-3.5 bg-[#1c1917] hover:bg-[#3c3734] text-[#fafaf9] rounded-full shadow-2xl transition-all cursor-pointer border border-[#c2a46c]/40 group hover:scale-105 animate-fade-in"
              title="Open AI Atelier Stylist"
            >
              <Sparkles className="w-4 h-4 text-[#c2a46c] animate-pulse" />
              <span className="text-xs font-outfit uppercase tracking-widest font-semibold">AI Stylist</span>
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 210, mass: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e7e5e4] shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8"
            >
            
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

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
                <div className="space-y-4">
                  {/* Premium Free Shipping Meter */}
                  <div className="p-3 bg-stone-100 rounded-xl border border-stone-200/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-outfit">
                      <span className="font-medium text-stone-700 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-[#c2a46c]" />
                        {cartSubtotal >= 5000 ? (
                          <span className="text-emerald-800 font-semibold">Complimentary Express Shipping Applied</span>
                        ) : (
                          <span>Complimentary Express Shipping</span>
                        )}
                      </span>
                      <span className="font-mono text-stone-950 font-bold">
                        {cartSubtotal >= 5000 ? "FREE" : `₹${Math.max(0, 5000 - cartSubtotal)} left`}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#c2a46c] h-1.5 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, (cartSubtotal / 5000) * 100)}%` }}
                      />
                    </div>
                    {cartSubtotal < 5000 && (
                      <p className="text-[9px] text-stone-500 font-outfit">
                        Purchase ₹{5000 - cartSubtotal} more to unlock free shipping. Current flat fee: ₹150.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[48vh] overflow-y-auto pr-1">
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
              </div>
            )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#e7e5e4] pt-4 space-y-3 bg-[#fafaf9]">
                {/* Premium Promo Code Entry */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-stone-500 block">
                    Have an Atelier Access Code?
                  </label>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10, LAUNCH20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={!!appliedPromo}
                        className="w-full pl-7 pr-2 py-1 rounded-lg border border-stone-200 text-[11px] bg-white font-mono uppercase focus:ring-1 focus:ring-stone-500/50"
                      />
                      <Ticket className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                    {appliedPromo ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </form>
                  {promoError && (
                    <p className="text-[9px] text-red-500 font-outfit font-medium">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-[10px] text-emerald-700 font-outfit font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 animate-bounce" />
                      Code Applied: &ldquo;{appliedPromo.code}&rdquo; ({appliedPromo.discountPercent}% OFF)
                    </p>
                  )}
                </div>

                {/* Gift Wrapping Option */}
                <label className="flex items-start space-x-2 p-1.5 bg-stone-50 rounded-lg border border-stone-200/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => setGiftWrapping(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0 mt-0.5"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-stone-800 font-outfit flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-[#c2a46c]" />
                      Complimentary Gift Wrap & Dust Bag
                    </span>
                    <span className="text-[8px] text-stone-500 block leading-tight mt-0.5">
                       जयपुर hand-made paper, custom gold wax seal stamp, premium dust pouch.
                    </span>
                  </div>
                </label>

                {/* Pricing summary */}
                <div className="space-y-1 text-xs border-t border-b border-stone-100 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-outfit">Sourcing Subtotal</span>
                    <span className="font-mono text-stone-900">₹{cartSubtotal}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-emerald-700 font-medium">
                      <span className="font-outfit">Access Code Discount</span>
                      <span className="font-mono">-₹{promoDiscount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-outfit">Express Delivery</span>
                    <span className="font-mono text-stone-950 font-bold">
                      {shippingFee === 0 ? <span className="text-emerald-700 uppercase text-[10px] font-bold">Complimentary</span> : `₹${shippingFee}`}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                    <span>Atelier Purpose Roundup (Optional)</span>
                    <span>₹{computedRoundUp}</span>
                  </div>
                  <p className="text-[9px] text-emerald-600 leading-normal">
                    Turn ₹{discountedSubtotal + shippingFee} into ₹{nextHundredValue} at checkout to support animal care, orphans, and the disabled.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (user) {
                      setCheckoutName(user.name || user.displayName || '');
                      setCheckoutEmail(user.email || '');
                    }
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer text-center"
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
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-20 backdrop-blur-xs"
          >
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.94, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 1 }}
              className="bg-white rounded-2xl w-full max-w-2xl relative z-10 p-6 border shadow-2xl space-y-4"
            >
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addRecentSearch(searchQuery);
                  }
                }}
                className="w-full pl-10 pr-10 py-3 bg-stone-100 border rounded-xl focus:outline-hidden focus:border-stone-900 focus:bg-white text-xs font-outfit"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-all cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-[11px] text-stone-500">
                Found {filteredProducts.length} matching designs for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {!searchQuery ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Recent Searches */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#c2a46c]" />
                      Recent Searches
                    </span>
                    {recentSearches.length > 0 && (
                      <button 
                        onClick={clearRecentSearches}
                        className="text-[10px] uppercase tracking-wider font-mono text-red-600 hover:text-red-700 font-bold transition-all cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {recentSearches.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((q, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center bg-stone-50 border border-stone-200/80 rounded-lg py-1 px-2.5 transition-all hover:bg-stone-100 hover:border-stone-300 group"
                        >
                          <button
                            onClick={() => {
                              setSearchQuery(q);
                              addRecentSearch(q);
                            }}
                            className="text-xs text-stone-700 font-outfit cursor-pointer mr-1.5 hover:text-[#c2a46c] transition-all"
                          >
                            {q}
                          </button>
                          <button
                            onClick={() => removeRecentSearch(q)}
                            className="text-stone-400 hover:text-stone-600 rounded transition-all cursor-pointer p-0.5"
                            title="Remove from history"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 font-light italic">
                      No recent searches recorded yet. Explore our bespoke designs to populate your history.
                    </p>
                  )}
                </div>

                {/* Trending Categories */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#c2a46c]" />
                    Trending Categories
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { query: 'Linen', title: 'Summer Linens', desc: 'Lightweight & airy' },
                      { query: 'Silk', title: 'Banarasi Silk', desc: 'Royal evening heritage' },
                      { query: 'Co-ord', title: 'Premium Co-ords', desc: 'Pre-matched luxury sets' },
                      { query: 'Cotton', title: 'Mulmul Cotton', desc: 'Buttery soft daywear' },
                      { query: 'Kurta', title: 'Atelier Kurtas', desc: 'Traditional artisan fits' },
                      { query: 'Donation', title: 'Dress with Purpose', desc: 'Ethical fashion lines' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item.query);
                          addRecentSearch(item.query);
                        }}
                        className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 text-left transition-all cursor-pointer flex flex-col justify-between h-full group"
                      >
                        <span className="font-serif text-xs font-bold text-stone-900 group-hover:text-[#c2a46c] transition-all">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-stone-400 font-outfit leading-tight mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        addRecentSearch(searchQuery);
                        setSelectedProduct(p);
                        setIsSearchOpen(false);
                      }}
                      className="py-3 flex items-center justify-between cursor-pointer hover:bg-stone-50 rounded-lg px-2"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded pointer-events-none" />
                        <div>
                          <p className="font-serif text-xs font-bold text-stone-900">{p.name}</p>
                          <p className="text-[10px] text-stone-500 font-outfit">{p.materials}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-stone-900">₹{p.price}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-[#78716c] font-light italic">
                    No matching atelier designs located for &ldquo;{searchQuery}&rdquo;. Try another search term or browse Trending.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* 8. Checkout Purchase Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className={`bg-white rounded-2xl w-full p-6 md:p-8 relative border shadow-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${checkoutSuccess ? 'max-w-3xl' : 'max-w-lg'}`}>
            
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 bg-[#f5f5f4] hover:bg-[#e7e5e4] rounded-full cursor-pointer z-10"
            >
              <X className="w-4 h-4 text-stone-800" />
            </button>

            {checkoutSuccess ? (
              <div className="space-y-6 animate-fade-in">
                {/* Header with Email Simulator Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
                  <div>
                    <h3 className="serif-header text-xl md:text-2xl font-bold text-stone-900 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                      <span>Order Completed!</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-outfit mt-0.5">
                      Simulated confirmation email has been dispatched.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      disabled={isEmailResending}
                      onClick={() => {
                        setIsEmailResending(true);
                        setTimeout(() => {
                          setIsEmailResending(false);
                          setEmailResentSuccess(true);
                          setTimeout(() => setEmailResentSuccess(false), 4000);
                        }, 1200);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c2a46c]/10 hover:bg-[#c2a46c]/20 text-[#c2a46c] hover:text-stone-900 text-[11px] uppercase tracking-wider font-mono font-bold rounded-lg border border-[#c2a46c]/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isEmailResending ? (
                        <>
                          <Sparkles className="w-3 h-3 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Resend simulated receipt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {emailResentSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in font-outfit">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Simulated receipt successfully dispatched to <strong>{lastOrderEmail}</strong>!</span>
                  </div>
                )}

                {/* Simulated Email Envelope Client */}
                <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  {/* Email Client Header Bar */}
                  <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">Simulated Email Client</span>
                    <div className="w-12" />
                  </div>

                  {/* Email Headers */}
                  <div className="p-4 space-y-1.5 text-xs border-b border-stone-200/60 bg-white/50 font-outfit">
                    <div className="grid grid-cols-[60px_1fr] text-stone-500">
                      <span>From:</span>
                      <span className="text-stone-800 font-medium font-outfit">atelier@vividhra.com &lt;Vividhra Atelier Mumbai&gt;</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] text-stone-500">
                      <span>To:</span>
                      <span className="text-stone-800 font-medium font-mono">{lastOrderEmail} ({lastOrderName})</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] text-stone-500">
                      <span>Subject:</span>
                      <span className="text-stone-900 font-bold">Order Confirmation & Impact Receipt - #{placedOrderId}</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] text-stone-500">
                      <span>Date:</span>
                      <span className="text-stone-700 font-mono">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>

                  {/* Email Body Content */}
                  <div className="bg-white p-6 space-y-6 font-outfit text-[#1c1917] max-h-[45vh] overflow-y-auto">
                    {/* Brand Banner */}
                    <div className="text-center pb-6 border-b border-stone-100">
                      <span className="serif-header font-normal text-2xl tracking-[-0.08em] uppercase text-stone-900 block">VIVIDHRA</span>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-[#c2a46c] block mt-1">tailored coordinates with purpose</span>
                    </div>

                    {/* Greeting */}
                    <div className="space-y-2">
                      <p className="font-serif text-sm font-bold text-stone-950">Dear {lastOrderName},</p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        We are honored to confirm receipt of your tailored order. Our master artisans at the Mumbai atelier are now preparing your selected items with surgical precision. 
                        A summary of your transactions, shipping coordinates, and your community charity ledger split are structured below.
                      </p>
                    </div>

                    {/* Details and Shipping */}
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 text-xs space-y-2 leading-relaxed">
                      <p className="font-bold text-stone-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c2a46c]" />
                        <span>Delivery & Sourcing Parameters</span>
                      </p>
                      <p className="text-stone-600 font-mono pl-4.5">
                        <span className="text-stone-900 font-bold">{lastOrderName}</span> <br />
                        {lastOrderAddress}, {lastOrderCity} <br />
                        Phone: {lastOrderPhone || "N/A"} <br />
                        {lastOrderNotes && (
                          <>
                            <span className="italic text-stone-500">Atelier Note: &ldquo;{lastOrderNotes}&rdquo;</span> <br />
                          </>
                        )}
                        {lastOrderGiftWrapping && (
                          <span className="text-[#c2a46c] text-[10px] font-bold flex items-center gap-1 mt-0.5">
                            <Gift className="w-3.5 h-3.5" /> Applied: Complimentary Jaipur Hand-made Paper Gift Wrap (Wax Seal Stamp)
                          </span>
                        )}
                        <span className="text-stone-500 text-[10px]">Payment Parameter: {lastOrderPaymentMethod.toUpperCase()} (Secured Ledger)</span>
                      </p>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold border-b pb-1">Garments in tailors' queue</h4>
                      <div className="divide-y divide-stone-100">
                        {lastOrderItems.map((item, index) => (
                          <div key={index} className="py-2.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.product.images[0]}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-10 h-13 object-cover rounded bg-stone-50 border border-stone-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-serif text-xs font-bold text-stone-900 truncate">{item.product.name}</p>
                                <p className="text-[9px] text-stone-500 font-mono mt-0.5">
                                  Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-stone-800 shrink-0">
                              ₹{item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="border-t pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-stone-500">
                        <span>Sourced Subtotal</span>
                        <span className="font-mono text-stone-800">₹{lastOrderSubtotal}</span>
                      </div>
                      {lastOrderPromoDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Access Code Discount Applied</span>
                          <span className="font-mono">-₹{lastOrderPromoDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-500">
                        <span>Express Logistics Delivery</span>
                        <span className="font-mono text-stone-800">
                          {lastOrderShippingFee === 0 ? "Complimentary" : `₹${lastOrderShippingFee}`}
                        </span>
                      </div>
                      {lastOrderRoundUp > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/50 p-1.5 rounded-md">
                          <span className="flex items-center gap-1">🌿 Dress with Purpose Roundup</span>
                          <span className="font-mono">₹{lastOrderRoundUp}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t">
                        <span>Total Transacted & Settled</span>
                        <span className="font-mono text-[#c2a46c]">₹{lastOrderTotal}</span>
                      </div>
                    </div>

                    {/* Charity Impact Summary */}
                    {lastOrderRoundUp > 0 && lastOrderCharities.length > 0 ? (
                      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-4 space-y-3.5">
                        <div className="space-y-1 text-center">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 block">🌱 Purpose Split Analysis</span>
                          <p className="text-xs text-emerald-800 font-bold">
                            ₹{lastOrderRoundUp} split equally among {lastOrderCharities.length} community partners
                          </p>
                          <p className="text-[10px] text-emerald-600 leading-normal max-w-md mx-auto">
                            Thank you! Under our immutable ledger, 100% of your round-up is transferred to direct-support community programs.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {charities
                            .filter((c) => lastOrderCharities.includes(c.id))
                            .map((c) => {
                              const share = (lastOrderRoundUp / lastOrderCharities.length).toFixed(2);
                              return (
                                <div key={c.id} className="bg-white p-3 rounded-lg border border-emerald-100 space-y-2 flex flex-col justify-between shadow-3xs">
                                  <div className="space-y-1">
                                    <p className="text-xs font-bold text-stone-900 font-outfit flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span>{c.name}</span>
                                    </p>
                                    <p className="text-[10px] text-stone-500 leading-normal font-outfit">
                                      {c.description}
                                    </p>
                                  </div>
                                  <div className="pt-2 border-t border-stone-50 mt-1 flex items-center justify-between">
                                    <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Dispatched</span>
                                    <span className="font-mono text-xs font-bold text-emerald-700 font-outfit">₹{share}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-stone-50 rounded-xl text-center text-xs text-stone-500 border border-stone-100 font-outfit">
                        No charity round-up was chosen for this transaction. Feel free to opt-in on future coordinates to split spare change with social causes!
                      </div>
                    )}

                    {/* Closing Slogan */}
                    <div className="text-center pt-6 border-t border-stone-100 text-stone-400 space-y-1">
                      <p className="text-[11px] italic font-serif">&ldquo;Dress with precision, act with purpose.&rdquo;</p>
                      <p className="text-[9px] font-mono tracking-wider uppercase">Vividhra Atelier Mumbai</p>
                    </div>

                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutSuccess(false);
                      setActiveView('profile');
                      setProfileSubTab('order-tracking');
                    }}
                    className="px-5 py-2.5 bg-amber-600 text-white hover:bg-amber-700 text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Package className="w-4 h-4" />
                    <span>Track Order Sourcing</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutSuccess(false);
                    }}
                    className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800 text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Done & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Aditi Sharma"
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={checkoutPhone}
                        onChange={(e) => setCheckoutPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Email Address</label>
                    <input
                      type="email"
                      placeholder="patron@vividhra.com"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full px-3.5 py-1.5 rounded-lg border text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Delivery Address</label>
                      <input
                        type="text"
                        placeholder="Street, Apt, Area"
                        value={checkoutAddress}
                        onChange={(e) => setCheckoutAddress(e.target.value)}
                        className="w-full px-3.5 py-1.5 rounded-lg border text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">City</label>
                      <input
                        type="text"
                        placeholder="Mumbai, Maharashtra"
                        value={checkoutCity}
                        onChange={(e) => setCheckoutCity(e.target.value)}
                        className="w-full px-3.5 py-1.5 rounded-lg border text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit">Atelier Notes & Instructions (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. gift wrap card message or custom height hem instructions"
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      className="w-full px-3.5 py-1.5 rounded-lg border text-xs"
                    />
                  </div>

                  {/* Secure Payment selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-outfit block">Secure Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs font-bold'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Sliders className="w-3 h-3 text-[#c2a46c]" />
                        <span className="text-[10px] font-outfit">UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs font-bold'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <CreditCard className="w-3 h-3 text-[#c2a46c]" />
                        <span className="text-[10px] font-outfit">Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs font-bold'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Package className="w-3 h-3 text-[#c2a46c]" />
                        <span className="text-[10px] font-outfit">COD</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
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
                      <span className="text-[10px] text-stone-500 leading-normal block mt-0.5">
                        Round up from ₹{discountedSubtotal + shippingFee} to ₹{nextHundredValue} (contributing ₹{computedRoundUp}) to split among animal shelters, old age caretakers, orphans, and the disabled.
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
                              className={`py-1 px-2 rounded-lg border text-[10px] font-outfit text-left truncate transition-colors ${
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

                <div className="space-y-1.5 font-outfit text-stone-600 text-xs">
                  <div className="flex justify-between">
                    <span>Sourcing Subtotal</span>
                    <span className="font-mono text-stone-900">₹{cartSubtotal}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Access Code Discount ({appliedPromo.code})</span>
                      <span className="font-mono">-₹{promoDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Logistics</span>
                    <span className="font-mono text-stone-900">
                      {shippingFee === 0 ? <span className="text-emerald-700 uppercase font-bold text-[10px]">Complimentary</span> : `₹${shippingFee}`}
                    </span>
                  </div>
                  {isRoundUpEnabled && (
                    <div className="flex justify-between">
                      <span>Purpose roundup</span>
                      <span className="font-mono text-stone-900">₹{computedRoundUp}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-1.5 border-t text-stone-900">
                    <span>Total secured amount</span>
                    <span className="font-mono text-[#c2a46c]">₹{checkoutTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer text-center"
                >
                  Pay ₹{checkoutTotal} via {paymentMethod.toUpperCase()}
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
