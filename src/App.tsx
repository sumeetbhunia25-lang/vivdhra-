import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import gsap from 'gsap';
import Lenis from 'lenis';
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
  Trash2,
  History
} from 'lucide-react';
import { Product, CartItem, WishlistItem, Order, FitProfile, UserAccount } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import VividhraStyleProductCard from './components/VividhraStyleProductCard';
import FitProfileForm from './components/FitProfileForm';
import AIStylist from './components/AIStylist';
import AdminPanel from './components/AdminPanel';
import StoryPage from './components/StoryPage';
import VividhraOpeningIntro from './components/VividhraOpeningIntro';
import AISilhouetteStudio from './components/AISilhouetteStudio';
import PremiumHero from './components/PremiumHero';
import OrderJourneyTracker from './components/OrderJourneyTracker';
import OrderTrackingPage from './components/OrderTrackingPage';
import OrderHistoryDashboard from './components/OrderHistoryDashboard';
import CollectionDrawer, { collectionCategories } from './components/CollectionDrawer';
import { ReactHelmet } from './components/ReactHelmet';
import CategoryListingPage from './components/CategoryListingPage';
import ProductDetailPage from './components/ProductDetailPage';
import QuickViewModal from './components/QuickViewModal';
import ErrorBoundary from './components/ErrorBoundary';
import { addItemToCart, updateCartQuantity } from './lib/cartUtils';
import { filterProducts } from './lib/productFilters';

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
  const [showIntro, setShowIntro] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking'>('home');
  const [profileSubTab, setProfileSubTab] = useState<'ai-silhouette' | 'profile-form' | 'order-tracking' | 'order-history'>('ai-silhouette');
  const [user, setUser] = useState<UserAccount | null>({
    id: 'user_1',
    uid: 'user_1',
    name: 'Ananya Iyer',
    displayName: 'Ananya Iyer',
    email: 'ananya@vividhra.com',
    role: 'admin', // Full multi-role support. Users can change this in the UI!
    wishlist: [],
    cart: [],
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Initialize and synchronize in-memory React state with URL search query params for deep-linking & SEO
  const urlInitRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (urlInitRef.current && products.length > 0) return;

    const params = new URLSearchParams(window.location.search);
    const urlProduct = params.get('product');
    const urlCategory = params.get('category');
    const urlSearch = params.get('search');
    const urlView = params.get('view');

    if (products && products.length > 0) {
      urlInitRef.current = true;
      if (urlProduct) {
        const found = products.find(p => p.id === urlProduct);
        if (found) {
          setSelectedProduct(found);
          setActiveView('shop');
          if (urlCategory) {
            setSelectedCategory(urlCategory);
          }
          return;
        }
      }
    }

    if (!urlInitRef.current) {
      if (urlView && ['home', 'story', 'stylist', 'profile', 'admin', 'shop', 'tracking'].includes(urlView)) {
        setActiveView(urlView as any);
        urlInitRef.current = true;
      } else if (urlCategory) {
        setSelectedCategory(urlCategory);
        setActiveView('shop');
        urlInitRef.current = true;
      } else if (urlSearch) {
        setSearchQuery(urlSearch);
        setActiveView('shop');
        urlInitRef.current = true;
      }
    }
  }, [products]);

  // Dynamically update the address bar parameters when user alters view, category, product, or search filter
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams();
    if (selectedProduct) {
      params.set('product', selectedProduct.id);
      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
    } else if (activeView === 'shop') {
      if (searchQuery) {
        params.set('search', searchQuery);
      } else if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      } else {
        params.set('view', 'shop');
      }
    } else if (activeView !== 'home') {
      params.set('view', activeView);
    }

    const newQuery = params.toString();
    const newSearch = newQuery ? `?${newQuery}` : '';
    if (window.location.search !== newSearch) {
      window.history.replaceState(null, '', `${window.location.pathname}${newSearch}`);
    }
  }, [activeView, selectedCategory, selectedProduct, searchQuery]);

  // Drag-scroll state for popular category bubbles
  const bubbleScrollRef = useRef<HTMLDivElement>(null);
  const [isBubbleDragging, setIsBubbleDragging] = useState(false);
  const [bubbleDragStartX, setBubbleDragStartX] = useState(0);
  const [bubbleScrollLeft, setBubbleScrollLeft] = useState(0);

  const handleBubbleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsBubbleDragging(true);
    setBubbleDragStartX(e.pageX - (bubbleScrollRef.current?.offsetLeft || 0));
    setBubbleScrollLeft(bubbleScrollRef.current?.scrollLeft || 0);
  };

  const handleBubbleMouseLeaveOrUp = () => {
    setIsBubbleDragging(false);
  };

  const handleBubbleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isBubbleDragging) return;
    e.preventDefault();
    const x = e.pageX - (bubbleScrollRef.current?.offsetLeft || 0);
    const walk = (x - bubbleDragStartX) * 1.5; // sensitivity
    if (bubbleScrollRef.current) {
      bubbleScrollRef.current.scrollLeft = bubbleScrollLeft - walk;
    }
  };

  // Global Navigation History State and Scroll Restoration
  interface NavigationHistoryItem {
    activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
    selectedCategory: string;
    selectedProduct: Product | null;
    searchQuery: string;
  }

  const [navHistory, setNavHistory] = useState<NavigationHistoryItem[]>([]);
  const isGoingBackRef = useRef(false);
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const lastStateRef = useRef<NavigationHistoryItem>({
    activeView: 'home',
    selectedCategory: 'all',
    selectedProduct: null,
    searchQuery: '',
  });

  // Full-stack e-commerce dynamic data cache
  const productCacheRef = useRef<{
    products: Product[];
    orders: any[];
    timestamp: number;
  } | null>(null);

  const getStateKey = (view: string, category: string, product: Product | null, search: string) => {
    if (product) return `product-${product.id}`;
    if (view === 'shop') return `shop-${category}-${search || ''}`;
    return `view-${view}`;
  };

  const handleBack = () => {
    if (navHistory.length > 0) {
      isGoingBackRef.current = true;
      const previousState = navHistory[navHistory.length - 1];
      
      setNavHistory((prev) => prev.slice(0, -1));

      setActiveView(previousState.activeView);
      setSelectedCategory(previousState.selectedCategory);
      setSelectedProduct(previousState.selectedProduct);
      setSearchQuery(previousState.searchQuery);
    } else {
      if (selectedProduct) {
        setSelectedProduct(null);
      } else if (selectedCategory !== 'all') {
        setSelectedCategory('all');
      } else {
        setActiveView('home');
      }
    }
  };

  useEffect(() => {
    const oldState = lastStateRef.current;
    const currentKey = getStateKey(activeView, selectedCategory, selectedProduct, searchQuery);
    const oldKey = getStateKey(oldState.activeView, oldState.selectedCategory, oldState.selectedProduct, oldState.searchQuery);

    if (oldKey !== currentKey) {
      // Save scroll position for the state we are leaving
      scrollPositionsRef.current[oldKey] = window.scrollY;

      if (isGoingBackRef.current) {
        // Navigating back: do not push. Just reset flag.
        isGoingBackRef.current = false;
      } else {
        // Navigating forward: push oldState to history stack
        setNavHistory((prev) => {
          // Avoid pushing duplicate top elements
          if (prev.length > 0) {
            const topKey = getStateKey(prev[prev.length - 1].activeView, prev[prev.length - 1].selectedCategory, prev[prev.length - 1].selectedProduct, prev[prev.length - 1].searchQuery);
            if (topKey === oldKey) {
              return prev;
            }
          }
          return [...prev, {
            activeView: oldState.activeView,
            selectedCategory: oldState.selectedCategory,
            selectedProduct: oldState.selectedProduct,
            searchQuery: oldState.searchQuery,
          }];
        });
      }

      // Update ref to new state
      lastStateRef.current = {
        activeView,
        selectedCategory,
        selectedProduct,
        searchQuery,
      };

      // Determine target scroll position for seamless cross-device UX
      let targetScroll = 0;
      if (selectedProduct) {
        // Always start at top (0) when opening a product detail page
        targetScroll = 0;
      } else if (oldState.selectedProduct) {
        // Going back from a product detail page: target the exact product card in the catalog grid
        const cardElem = document.getElementById(`product-card-${oldState.selectedProduct.id}`);
        if (cardElem) {
          const rect = cardElem.getBoundingClientRect();
          const currentY = (window as any).lenis?.scroll ?? window.scrollY;
          targetScroll = Math.max(0, currentY + rect.top - 110);
        } else {
          targetScroll = scrollPositionsRef.current[currentKey] || 0;
        }
      } else {
        targetScroll = scrollPositionsRef.current[currentKey] || 0;
      }

      const restoreScroll = () => {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(targetScroll, { immediate: true });
        }
        window.scrollTo({ top: targetScroll, behavior: 'instant' as any });
      };

      // Call immediately, then schedule across animation frames and timeout ticks for guaranteed precision
      restoreScroll();
      const rafId = requestAnimationFrame(restoreScroll);
      const t1 = setTimeout(restoreScroll, 50);
      const t2 = setTimeout(restoreScroll, 150);
      const t3 = setTimeout(restoreScroll, 350);

      // Save scroll restoration cleanup routine
      (window as any)._scrollRestoreCleanup = () => {
        cancelAnimationFrame(rafId);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [activeView, selectedCategory, selectedProduct, searchQuery]);

  // Handle scroll restoration cleanup
  useEffect(() => {
    return () => {
      if ((window as any)._scrollRestoreCleanup) {
        (window as any)._scrollRestoreCleanup();
      }
    };
  }, [activeView, selectedCategory, selectedProduct, searchQuery]);

  // Initialize Lenis for buttery smooth scrolling across the entire application on all devices
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium smooth transition
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });

    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      (window as any).lenis = undefined;
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);
  
  // Checkout states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Patron Authentication states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
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
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
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
          { opacity: 0.85, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.015,
            ease: 'power2.out',
            overwrite: 'auto'
          }
        );
      }
    };

    observer.observe(productGridRef.current);

    // Immediate execution without artificial delay
    animateCards();

    return () => {
      observer.disconnect();
    };
  }, [products, selectedCategory, searchQuery, activeView]);

  // Fetch full-stack database states with fast client-side memory cache
  const loadData = async (retries = 3, delayMs = 500, forceFetch = false) => {
    // If not a forced fetch, and we already have products and other state in memory, return instantly!
    if (!forceFetch && products && products.length > 0) {
      return;
    }
    // Return cached values immediately if fresh (within 5 minutes) and not a forced re-fetch
    if (productCacheRef.current && !forceFetch && (Date.now() - productCacheRef.current.timestamp < 300000)) {
      setProducts(productCacheRef.current.products);
      if (productCacheRef.current.orders) setOrders(productCacheRef.current.orders);
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const fetchJSON = async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status} on ${url}`);
          }
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            throw new Error(`Expected JSON but got ${contentType} on ${url}`);
          }
          return res.json();
        };

        const [prodRes, orderRes] = await Promise.all([
          fetchJSON('/api/products'),
          fetchJSON('/api/orders'),
        ]);

        setProducts(prodRes);
        setOrders(orderRes);

        // Store fetched values in cache
        productCacheRef.current = {
          products: prodRes,
          orders: orderRes,
          timestamp: Date.now(),
        };
        
        return; // Success!
      } catch (err) {
        if (attempt === retries) {
          console.warn('Database structures loading warning (all retries exhausted):', err);
        } else {
          console.warn(`Attempt ${attempt} to load database failed. Retrying in ${delayMs}ms...`, err);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
  };

  useEffect(() => {
    loadData();
    // Periodically poll for updated inventory and 'Limited Stock' badges in real-time
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAndSetProfile = async (uid?: string, retries = 5, delayMs = 1500) => {
    const savedUid = uid || localStorage.getItem('vividhra_user_uid');
    const url = savedUid ? `/api/user/profile?uid=${savedUid}` : '/api/user/profile';
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Expected JSON but got ${contentType}`);
        }
        const data = await res.json();
        if (data.email) {
          setUser(data);
        }
        return;
      } catch (err) {
        if (attempt === retries) {
          console.error('Error fetching user profile:', err);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
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
  
  // Patron Forgot Password Reset Handler
  const handleForgotPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!authEmail) {
      setAuthError('Registered patron email address is required.');
      return;
    }
    setIsAuthLoading(true);
    // Simulate premium server-side security link dispatching delay
    setTimeout(() => {
      setIsAuthLoading(false);
      setAuthSuccess(`Secure Reset Link Dispatched! We have simulated sending an encrypted credential reset link to "${authEmail}". Please check your inbox or spam folder within 10 minutes to safely change your security password.`);
    }, 1500);
  };

  // Patron Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('vividhra_user_uid');
    setAuthSuccess('');
    setAuthError('');
    // Reload default guest profile from backend
    fetchAndSetProfile('guest-uid');
  };

  // Grid keyboard arrow key navigation
  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      return;
    }

    const cards = Array.from(e.currentTarget.querySelectorAll('.gsap-product-card')) as HTMLElement[];
    if (cards.length === 0) return;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = cards.indexOf(activeElement);

    if (currentIndex === -1) {
      e.preventDefault();
      cards[0].focus();
      return;
    }

    let targetIndex = -1;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % cards.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + cards.length) % cards.length;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentRect = activeElement.getBoundingClientRect();
      const currentCenterX = currentRect.left + currentRect.width / 2;
      
      let bestCandidateIndex = -1;
      let minDistance = Infinity;

      for (let i = 0; i < cards.length; i++) {
        if (i === currentIndex) continue;
        const rect = cards[i].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        const isBelow = rect.top >= currentRect.bottom - 10;
        const isAbove = rect.bottom <= currentRect.top + 10;

        if ((e.key === 'ArrowDown' && isBelow) || (e.key === 'ArrowUp' && isAbove)) {
          const dy = Math.abs(rect.top - currentRect.top);
          const dx = Math.abs(centerX - currentCenterX);
          const distance = dy + dx * 2.5; // Weight horizontal alignment more strongly
          
          if (distance < minDistance) {
            minDistance = distance;
            bestCandidateIndex = i;
          }
        }
      }

      if (bestCandidateIndex !== -1) {
        targetIndex = bestCandidateIndex;
      } else {
        // Safe Grid Column approximation fallback
        let cols = 2;
        if (window.innerWidth >= 1024) cols = 4;
        else if (window.innerWidth >= 768) cols = 3;
        
        if (e.key === 'ArrowDown') {
          targetIndex = Math.min(currentIndex + cols, cards.length - 1);
        } else if (e.key === 'ArrowUp') {
          targetIndex = Math.max(currentIndex - cols, 0);
        }
      }
    }

    if (targetIndex !== -1 && cards[targetIndex]) {
      cards[targetIndex].focus();
      cards[targetIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  // Add Item to cart
  const handleAddToCart = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => {
    setCart(addItemToCart(cart, product, size, color));
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart(updateCartQuantity(cart, itemId, delta));
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    const existingIndex = wishlist.findIndex((w) => w.product?.id === productId);
    if (existingIndex > -1) {
      setWishlist(wishlist.filter((w) => w.product?.id !== productId));
    } else {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setWishlist([...wishlist, { id: Math.random().toString(), product: prod }]);
      }
    }
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
    await loadData(5, 1500, true);
    return data;
  };

  const handleAdminDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    await loadData(5, 1500, true);
    return data;
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const res = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });
    const data = await res.json();
    await loadData(5, 1500, true);
    return data;
  };

  // Calculations for Checkout
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product?.price ?? item.price ?? 0) * item.quantity, 0);
  
  // Promo code validation and discount calculation
  const promoDiscount = appliedPromo ? Math.round(cartSubtotal * (appliedPromo.discountPercent / 100)) : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - promoDiscount);
  
  // Free Shipping Threshold of ₹5000: if subtotal is > 0 and < ₹5000, charge ₹150 flat shipping
  const shippingFee = cartSubtotal > 0 && discountedSubtotal < 5000 ? 150 : 0;
  
  const checkoutTotal = discountedSubtotal + shippingFee;

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
      setLastOrderTotal(checkoutTotal);
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
      await loadData(5, 1500, true); // Reload pools and counts
    } catch (err) {
      console.error(err);
      alert('Failed to execute purchase. Check parameters.');
    }
  };

  // Filter products by search and category mapping dynamically for all 17 categories
  const filteredProducts = filterProducts(products, selectedCategory, searchQuery);

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#78716c]/20 selection:text-[#1c1917] antialiased">
      <ReactHelmet 
        activeView={activeView}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategory}
        products={products}
        searchQuery={searchQuery}
      />
      
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-100"
          >
            <VividhraOpeningIntro onEnter={() => setShowIntro(false)} />
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
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        onOpenCollectionMenu={() => setIsCollectionDrawerOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedProduct={selectedProduct}
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
        <ErrorBoundary>
          <AnimatePresence mode="wait">

          {/* DEDICATED PRODUCT DETAIL VIEW */}
          {selectedProduct && (
            <motion.div
              key={`product-detail-${selectedProduct.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ProductDetailPage
                product={selectedProduct}
                onBack={handleBack}
                onAddToCart={(p, size, color, qty) => {
                  const qtyToAdd = qty || 1;
                  setCart((prev) => {
                    const existingIndex = prev.findIndex(
                      (item) => item.product?.id === p.id && item.size === size && item.color === color
                    );
                    if (existingIndex > -1) {
                      const updated = [...prev];
                      updated[existingIndex].quantity += qtyToAdd;
                      return updated;
                    }
                    return [...prev, { 
                      id: Math.random().toString(),
                      productId: p.id,
                      productName: p.name,
                      price: p.price,
                      image: p.images[0] || '',
                      product: p, 
                      quantity: qtyToAdd, 
                      size, 
                      color 
                    }];
                  });
                }}
                onBuyNow={(p, size, color, qty) => {
                  const qtyToAdd = qty || 1;
                  setCart((prev) => {
                    const existingIndex = prev.findIndex(
                      (item) => item.product?.id === p.id && item.size === size && item.color === color
                    );
                    let updated = [...prev];
                    if (existingIndex > -1) {
                      updated[existingIndex].quantity += qtyToAdd;
                    } else {
                      updated = [...prev, { 
                        id: Math.random().toString(),
                        productId: p.id,
                        productName: p.name,
                        price: p.price,
                        image: p.images[0] || '',
                        product: p, 
                        quantity: qtyToAdd, 
                        size, 
                        color 
                      }];
                    }
                    return updated;
                  });
                  setSelectedProduct(null);
                  setIsCartOpen(true);
                }}
                onWishlistToggle={handleToggleWishlist}
                isWishlisted={wishlist.some((w) => w.product?.id === selectedProduct.id)}
                products={products}
                setSelectedProduct={setSelectedProduct}
                setIsAIStylistOpen={setIsAIStylistOpen}
                setSelectedCategory={setSelectedCategory}
                setActiveView={setActiveView}
                navHistory={navHistory}
                setNavHistory={setNavHistory}
                isGoingBackRef={isGoingBackRef}
                categoriesList={categoriesList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </motion.div>
          )}

          {/* DEDICATED CATEGORY LISTING VIEW */}
          <div 
            key="shop-cached-view"
            style={{ display: (!selectedProduct && activeView === 'shop') ? 'block' : 'none' }}
            className="animate-fade-in"
          >
            <CategoryListingPage
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSelectedProduct={setSelectedProduct}
              onQuickView={(p) => setQuickViewProduct(p)}
              handleAddToCart={handleAddToCart}
              handleToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              categoriesList={categoriesList}
              onBack={handleBack}
              setActiveView={setActiveView}
              navHistory={navHistory}
              setNavHistory={setNavHistory}
              isGoingBackRef={isGoingBackRef}
            />
          </div>

          {/* HOMEPAGE VIEW */}
          <div 
            key="home-cached-view"
            style={{ display: (!selectedProduct && activeView === 'home') ? 'block' : 'none' }}
            className="space-y-10 pb-16 animate-fade-in"
          >
            <PremiumHero 
              onBrowse={() => {
                const listSec = document.getElementById('collection-grid');
                listSec?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExplorePhilosophy={() => setActiveView('story')}
              selectedCategory={selectedCategory}
              products={products}
            />

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

              {/* Products Grid - Amazon Style fully visible vertical layout */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[#e7e5e4]">
                  <p className="text-sm text-[#78716c] font-outfit">No garments found matching criteria.</p>
                </div>
              ) : (
                <div 
                  ref={productGridRef} 
                  onKeyDown={handleGridKeyDown}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
                >
                  {filteredProducts.map((prod) => (
                    <VividhraStyleProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.product?.id === prod.id)}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                      className="gsap-product-card h-full"
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
          </div>

          {/* STORY PAGE VIEW */}
          {activeView === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <StoryPage />
            </motion.div>
          )}

          {/* STANDALONE ORDER TRACKING VIEW */}
          {activeView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <OrderTrackingPage 
                orders={orders}
                currentUserEmail={user?.email}
                onBackToShop={() => setActiveView('home')}
              />
            </motion.div>
          )}

          {/* AI ATELIER STYLIST VIEW */}
          {activeView === 'stylist' && (
            <motion.div
              key="stylist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
                            authMode === 'login' || authMode === 'forgot'
                              ? 'border-[#1c1917] text-[#1c1917]'
                              : 'border-transparent text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          {authMode === 'forgot' ? 'Forgot Password' : 'Sign In'}
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
                      <form onSubmit={authMode === 'login' ? handleLogin : authMode === 'register' ? handleRegister : handleForgotPasswordReset} className="space-y-4 text-left">
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

                        {authMode !== 'forgot' && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                                Security Password
                              </label>
                              {authMode === 'login' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAuthMode('forgot');
                                    setAuthError('');
                                    setAuthSuccess('');
                                  }}
                                  className="text-[9px] text-[#c2a46c] hover:text-[#b0915a] hover:underline font-mono cursor-pointer uppercase tracking-wider"
                                >
                                  Forgot?
                                </button>
                              )}
                            </div>
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
                        )}

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
                              <span>
                                {authMode === 'login' 
                                  ? 'Authenticate Sanctuary' 
                                  : authMode === 'register' 
                                  ? 'Join the Atelier' 
                                  : 'Dispatch Reset Link'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        {authMode === 'forgot' && (
                          <div className="text-center pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode('login');
                                setAuthError('');
                                setAuthSuccess('');
                              }}
                              className="text-[10px] text-stone-500 hover:text-[#1c1917] underline font-mono cursor-pointer"
                            >
                              Remembered credentials? Back to Sign In
                            </button>
                          </div>
                        )}

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
              <div className="flex justify-center max-w-2xl mx-auto">
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
                  <button
                    onClick={() => setProfileSubTab('order-history')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-outfit font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 md:space-x-1.5 ${
                      profileSubTab === 'order-history'
                        ? 'bg-[#1c1917] text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>Order History</span>
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

                {profileSubTab === 'order-history' && (
                  <motion.div
                    key="order-history"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <OrderHistoryDashboard
                      orders={orders}
                      products={products}
                      currentUserEmail={user?.email}
                      onAddToCart={handleAddToCart}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <AdminPanel
                products={products}
                orders={orders}
                onAddProduct={handleAdminAddProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              />
            </motion.div>
          )}

        </AnimatePresence>
        </ErrorBoundary>
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

      {/* 4. Product Detail Modal replaced by Dedicated Product Detail Page */}

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
                          src={item.product?.images?.[0] ?? item.image}
                          alt={item.product?.name ?? item.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-16 object-cover rounded-md bg-stone-50"
                        />
                        <div className="truncate space-y-0.5">
                          <h4 className="font-serif text-xs font-bold text-[#1c1917] truncate">{item.product?.name ?? item.productName}</h4>
                          <p className="text-[9px] text-[#a8a29e] font-mono">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="mono-text text-xs font-bold text-[#1c1917]">
                            ₹{item.product?.price ?? item.price}
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
                          src={item.product?.images?.[0] ?? ''}
                          alt={item.product?.name ?? ''}
                          referrerPolicy="no-referrer"
                          className="w-12 h-16 object-cover rounded-md"
                        />
                        <div className="truncate space-y-0.5">
                          <h4 className="font-serif text-xs font-bold text-[#1c1917] truncate">{item.product?.name ?? 'Garment'}</h4>
                          <p className="mono-text text-xs font-bold text-[#1c1917]">₹{item.product?.price ?? 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (item.product) {
                              handleAddToCart(item.product, 'M', item.product.colors?.[0] || 'Default');
                            }
                            setIsWishlistOpen(false);
                          }}
                          className="p-1.5 bg-[#1c1917] text-white hover:bg-stone-700 rounded-lg text-xs"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(item.product?.id || '')}
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

      {/* 7. Premium Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#FDFCFB] z-50 flex flex-col overflow-y-auto"
            id="premium-search-overlay"
          >
            {/* Search Header Area */}
            <div className="sticky top-0 bg-[#FDFCFB]/95 backdrop-blur-md z-10 border-b border-stone-200/50 py-3.5 px-4 md:px-8">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                {/* Rounded search bar wrapped in form for proper device submission */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      addRecentSearch(searchQuery);
                      setActiveView('shop');
                      setSelectedCategory('all');
                      setIsSearchOpen(false);
                    }
                  }}
                  className="relative flex-1"
                >
                  <input
                    id="search-input-field"
                    type="text"
                    placeholder="Search For..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-[#F4F3F0] border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white text-[14px] text-stone-900 placeholder-stone-500 font-outfit transition-all duration-300"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-stone-500 absolute left-4 top-3.5" />
                  
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
                      title="Clear search"
                      id="search-clear-btn"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Cancel button */}
                <button
                  id="search-cancel-btn"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-stone-900 font-outfit font-medium text-[14px] px-2 py-2 hover:text-stone-600 transition-all cursor-pointer select-none"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Search Content Body */}
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8">
              {!searchQuery ? (
                <>
                  {/* POPULAR CHOICES SECTION */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-stone-400 mb-3.5" id="popular-choices-title">
                      Popular Choices
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {[
                        { label: 'Casual Wear', query: 'casual' },
                        { label: 'Party Wear', query: 'party' },
                        { label: 'Dresses', query: 'dresses' },
                        { label: 'Formal Wear', query: 'formal' },
                        { label: 'Mini Dresses', query: 'dress' }
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          id={`popular-chip-${chip.label.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => {
                            setSearchQuery(chip.query);
                            addRecentSearch(chip.query);
                            setActiveView('shop');
                            setSelectedCategory('all');
                            setIsSearchOpen(false);
                          }}
                          className="border border-stone-300/80 rounded-lg px-4 py-3 text-center font-outfit text-[13px] text-stone-800 hover:border-stone-900 bg-white hover:bg-stone-50 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* HORIZONTAL CATEGORY BUBBLES */}
                  <div>
                    <div 
                      ref={bubbleScrollRef}
                      onMouseDown={handleBubbleMouseDown}
                      onMouseLeave={handleBubbleMouseLeaveOrUp}
                      onMouseUp={handleBubbleMouseLeaveOrUp}
                      onMouseMove={handleBubbleMouseMove}
                      className="flex items-center gap-6 overflow-x-auto scroll-smooth py-2 select-none cursor-grab active:cursor-grabbing [-webkit-overflow-scrolling:touch] scrollbar-none"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {[
                        { label: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300', query: 'dresses' },
                        { label: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=300', query: 'trousers' },
                        { label: 'Tops', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=300', query: 'tops' },
                        { label: 'Co-ords', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300', query: 'co-ord' },
                        { label: 'Outerwear', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=300', query: 'blazers' }
                      ].map((cat) => (
                        <div
                          key={cat.label}
                          id={`category-bubble-${cat.label.toLowerCase()}`}
                          onClick={() => {
                            setSearchQuery(cat.query);
                            addRecentSearch(cat.query);
                            setActiveView('shop');
                            setSelectedCategory('all');
                            setIsSearchOpen(false);
                          }}
                          className="flex flex-col items-center flex-shrink-0 group cursor-pointer select-none"
                        >
                          <div className="w-20 h-20 rounded-full overflow-hidden border border-stone-200/80 shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:border-[#c2a46c] bg-stone-100 flex items-center justify-center">
                            <img
                              src={cat.image}
                              alt={cat.label}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300';
                              }}
                            />
                          </div>
                          <span className="text-[12px] text-stone-700 font-medium text-center mt-2.5 font-outfit group-hover:text-[#c2a46c] transition-colors">
                            {cat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RECOMMENDED FOR YOU */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-stone-400 mb-4" id="recommended-choices-title">
                      Recommended for You
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {products && products.length > 0 ? (
                        products
                          .filter(p => ['p15', 'p17', 'p19', 'p20'].includes(p.id) || p.isTrending)
                          .slice(0, 4)
                          .map((p) => (
                            <div
                              key={p.id}
                              id={`recommended-card-${p.id}`}
                              onClick={() => {
                                setSelectedProduct(p);
                                setIsSearchOpen(false);
                              }}
                              className="group bg-[#F4F3F0]/25 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col cursor-pointer pb-2"
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100 relative">
                                <img
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'}
                                  alt={p.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                                  }}
                                />
                                {/* Gift Icon overlay on Recommended card matching reference image mockup */}
                                <div className="absolute bottom-3 left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                  <Gift className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <p className="font-outfit text-xs font-medium text-stone-800 mt-2 px-2 truncate">
                                {p.name}
                              </p>
                              <p className="font-mono text-[11px] text-stone-500 px-2 mt-0.5">
                                ₹{p.price}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="col-span-full py-4 text-stone-400 italic text-xs">
                          Loading recommendations...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* RECENT SEARCHES HISTORY */}
                  {recentSearches.length > 0 && (
                    <div className="border-t border-stone-200/50 pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          Recent Searches
                        </span>
                        <button
                          id="clear-recent-searches-btn"
                          onClick={clearRecentSearches}
                          className="text-[10px] uppercase tracking-wider font-mono text-stone-500 hover:text-red-600 font-bold transition-all cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((q, idx) => (
                          <div
                            key={idx}
                            className="flex items-center bg-stone-100 border border-stone-200/60 rounded-full py-1 px-3 transition-all hover:bg-stone-200/60"
                          >
                            <button
                              onClick={() => {
                                setSearchQuery(q);
                                setActiveView('shop');
                                setSelectedCategory('all');
                                setIsSearchOpen(false);
                              }}
                              className="text-xs text-stone-700 font-outfit cursor-pointer mr-1.5 hover:text-[#c2a46c] transition-all"
                            >
                              {q}
                            </button>
                            <button
                              onClick={() => removeRecentSearch(q)}
                              className="text-stone-400 hover:text-stone-600 rounded-full transition-all cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* LIVE SEARCH RESULTS */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-200/50 pb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-stone-400">
                        Live Discoveries ({filteredProducts.length})
                      </h3>
                      {filteredProducts.length > 0 && (
                        <button
                          onClick={() => {
                            addRecentSearch(searchQuery);
                            setActiveView('shop');
                            setSelectedCategory('all');
                            setIsSearchOpen(false);
                          }}
                          className="text-[11px] font-outfit font-bold text-[#c2a46c] hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          View All in Shop &rarr;
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 font-outfit">
                      Showing matches for &ldquo;{searchQuery}&rdquo;
                    </p>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          id={`live-match-card-${p.id}`}
                          onClick={() => {
                            addRecentSearch(searchQuery);
                            setSelectedProduct(p);
                            setIsSearchOpen(false);
                          }}
                          className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer border border-stone-100 pb-3"
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden bg-stone-50 relative">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                              }}
                            />
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm shadow-xs">
                                Sale
                              </span>
                            )}
                          </div>
                          <div className="p-2.5 space-y-1">
                            <h4 className="font-outfit text-xs font-semibold text-stone-900 group-hover:text-[#c2a46c] transition-colors truncate">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-outfit line-clamp-1">
                              {p.materials}
                            </p>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="font-mono text-xs font-bold text-stone-900">₹{p.price}</span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="font-mono text-[10px] text-stone-400 line-through">₹{p.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <p className="text-sm text-stone-500 font-light italic">
                        No matching atelier designs located for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-stone-400 font-outfit">
                        Try searching for materials like <strong className="text-stone-600">Linen</strong>, silhouettes like <strong className="text-stone-600">Asymmetric</strong>, or dress lines.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                        A summary of your transaction details and shipping coordinates are structured below.
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
                                src={item.product?.images?.[0] ?? item.image}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-10 h-13 object-cover rounded bg-stone-50 border border-stone-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-serif text-xs font-bold text-stone-900 truncate">{item.product?.name ?? item.productName}</p>
                                <p className="text-[9px] text-stone-500 font-mono mt-0.5">
                                  Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-stone-800 shrink-0">
                              ₹{(item.product?.price ?? item.price ?? 0) * item.quantity}
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
                      <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t">
                        <span>Total Transacted & Settled</span>
                        <span className="font-mono text-[#c2a46c]">₹{lastOrderTotal}</span>
                      </div>
                    </div>

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
        window.scrollTo({ top: 0, behavior: 'auto' });
      }} />

      {/* 10. Floating Quick View Modal Overlay */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(p, sz, clr) => {
            handleAddToCart(p, sz, clr);
            setQuickViewProduct(null);
          }}
        />
      )}

    </div>
  );
}
