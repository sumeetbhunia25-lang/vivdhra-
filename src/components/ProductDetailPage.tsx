import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Sparkles, Shield, ArrowLeft, Plus, Minus, ShoppingBag, Truck, Undo2, ChevronRight, Check } from 'lucide-react';
import { Product, WishlistItem } from '../types';
import Breadcrumb from './Breadcrumb';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string, quantity?: number) => void;
  onBuyNow: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string, quantity?: number) => void;
  onWishlistToggle: (productId: string) => void;
  isWishlisted: boolean;
  products: Product[];
  setSelectedProduct: (product: Product | null) => void;
  setIsAIStylistOpen: (open: boolean) => void;
  setSelectedCategory: (cat: string) => void;
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking') => void;
  navHistory: any[];
  setNavHistory: React.Dispatch<React.SetStateAction<any[]>>;
  isGoingBackRef: React.MutableRefObject<boolean>;
  categoriesList: Array<{ id: string; label: string }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted,
  products,
  setSelectedProduct,
  setIsAIStylistOpen,
  setSelectedCategory,
  setActiveView,
  navHistory,
  setNavHistory,
  isGoingBackRef,
  categoriesList,
  searchQuery,
  setSearchQuery,
}: ProductDetailPageProps) {
  // Local Interactive States
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '#000');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<'office' | 'party' | 'home' | 'college'>('office');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Hover to zoom effect states for detailed inspection of luxury fabrics
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Synchronize active image state if selected product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors[0] || '#000');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Handle CTA Actions
  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 3000);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  // Deterministic ratings to simulate high-converting social proof
  const ratingValue = Number(((product.name.length % 5) * 0.1 + 4.5).toFixed(1));
  const reviewCount = (product.name.charCodeAt(0) * 3) + 45;

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Recommendations: Other products from the same category (excluding current)
  const recommendations = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  // Suitability match calculator
  const suitabilityScore = useMemo(() => {
    const cat = product.category.toLowerCase();
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
    } else {
      if (selectedOccasion === 'office') { score = 68; desc = "Best styled with a tailored blazer to ground the flowing resort silhouette."; }
      else if (selectedOccasion === 'party') { score = 94; desc = "Gorgeous earthy colors and breezy silk tiers capture the perfect cocktail hours."; }
      else if (selectedOccasion === 'home') { score = 85; desc = "Breezy and loose. Incredible comfort for spending leisure hours reading."; }
      else if (selectedOccasion === 'college') { score = 88; desc = "Relaxed vacation energy that makes the campus pathways feel like a coastal retreat."; }
    }

    return { score, desc };
  }, [product.category, selectedOccasion]);

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#FDFCFB] text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Toast Added To Bag notification */}
        <AnimatePresence>
          {isAddedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1c1917] text-[#fafaf9] px-6 py-3.5 rounded-full shadow-xl flex items-center space-x-3 border border-stone-800 text-xs font-semibold"
            >
              <Check className="w-4 h-4 text-[#c2a46c]" />
              <span>Garment added to your Shopping Bag successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Header Navigation Back Path */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200/60 pb-4 mb-8 gap-4">
          <button
            onClick={() => {
              onBack();
            }}
            className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-stone-600 hover:text-stone-900 group cursor-pointer transition-colors"
            id="product-back-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <Breadcrumb
            activeView="shop"
            selectedCategory={product.category}
            selectedProduct={product}
            searchQuery={searchQuery}
            navHistory={navHistory}
            setNavHistory={setNavHistory}
            setActiveView={setActiveView}
            setSelectedCategory={setSelectedCategory}
            setSelectedProduct={setSelectedProduct}
            setSearchQuery={setSearchQuery}
            isGoingBackRef={isGoingBackRef}
            categoriesList={categoriesList}
          />
        </div>

        {/* 2. Main Dual-Column Product Details Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Block: Image Carousel and Thumbnails (Col span 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Large primary visual with smooth interactive hover-to-zoom */}
            <div 
              className="aspect-[3/4] bg-stone-50 rounded-2xl overflow-hidden border border-stone-200/80 relative cursor-zoom-in select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-150 ease-out"
                style={zoomStyle}
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-[#fafaf9] text-xs font-sans font-bold px-3 py-1 rounded shadow-md pointer-events-none">
                  -{discountPercent}% OFF
                </span>
              )}
              {product.isTrending && (
                <span className="absolute top-4 right-4 bg-[#c2a46c] text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded font-bold shadow-md pointer-events-none">
                  Best Seller
                </span>
              )}
              {/* Subtle visual prompt */}
              <div className="absolute bottom-4 left-4 right-4 text-center bg-black/40 backdrop-blur-xs text-white text-[10px] font-mono tracking-widest py-1.5 rounded-lg opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
                Hover to Zoom Fabric Textures
              </div>
            </div>

            {/* Carousel alternate angle selector thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-[3/4] rounded-xl overflow-hidden border bg-stone-50 transition-all cursor-pointer ${
                      isActive ? 'border-[#1c1917] ring-1 ring-[#1c1917]' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Block: Content specs and purchasing inputs (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Metadata Header */}
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold bg-[#c2a46c]/10 px-2.5 py-0.5 rounded-sm">
                  {product.category} COLLECTION
                </span>
                <span className="text-[10px] uppercase font-mono text-stone-400">
                  ID: {product.id}
                </span>
              </div>
              
              <h1 className="serif-header text-2xl md:text-4xl font-bold tracking-tight text-[#1c1917]">
                {product.name}
              </h1>

              {/* Amazon Style reviews details */}
              <div className="flex items-center space-x-2 pt-1 border-b border-stone-100 pb-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(ratingValue) ? 'fill-current' : 'text-stone-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">{ratingValue} out of 5</span>
                <span className="text-stone-300">|</span>
                <span className="text-xs text-stone-500 hover:underline cursor-pointer">{reviewCount} patron ratings</span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/50 space-y-2">
              <div className="flex items-baseline space-x-2.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">Price:</span>
                <span className="text-2xl font-bold text-stone-900 font-sans">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-[10px] font-sans text-red-600 font-semibold">
                  You Save: ₹{product.originalPrice - product.price} ({discountPercent}% Off)
                </p>
              )}
              <p className="text-[10px] font-sans text-stone-500">
                Inclusive of all taxes & GST. Eligible for Free Shipping on order totals exceeding ₹5000.
              </p>
            </div>

            {/* Description narrative */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-stone-400 font-bold block">
                Overview & Silhouette Narrative
              </span>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Sizing & Material Specs Grid */}
            <div className="border-y border-stone-100 py-4 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-stone-400 font-mono uppercase text-[9px] tracking-wider">Organic Material</p>
                <p className="text-stone-800 font-semibold">{product.materials}</p>
              </div>
              <div className="space-y-1">
                <p className="text-stone-400 font-mono uppercase text-[9px] tracking-wider">Care Instructions</p>
                <p className="text-stone-800 font-semibold">{product.care}</p>
              </div>
            </div>

            {/* Interactive OCCASION MATCH widget */}
            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#e7e5e4] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                  Sizing Suitability Match
                </span>
                <span className="text-[9px] uppercase font-mono bg-[#c2a46c]/10 text-[#c2a46c] px-2 py-0.5 rounded-full font-bold">
                  Women Suitability
                </span>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {(['office', 'party', 'home', 'college'] as const).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setSelectedOccasion(occ)}
                    className={`py-1.5 rounded-lg text-[10px] font-outfit uppercase tracking-wider transition-all font-semibold cursor-pointer text-center border ${
                      selectedOccasion === occ
                        ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-2xs'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-[#c2a46c]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              {/* Progress and commentary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-600 font-sans">
                    Occasion match rate:
                  </span>
                  <span className="font-mono text-xs font-bold text-[#c2a46c]">
                    {suitabilityScore.score}% Match
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      suitabilityScore.score >= 90 ? 'bg-[#c2a46c]' : suitabilityScore.score >= 80 ? 'bg-stone-800' : 'bg-stone-500'
                    }`}
                    style={{ width: `${suitabilityScore.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed italic">
                  &ldquo;{suitabilityScore.desc}&rdquo;
                </p>
              </div>
            </div>

            {/* Colors Swatches Selector */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold">
                Select Shade / Color
              </p>
              <div className="flex items-center space-x-3">
                {product.colors.map((c) => {
                  const isActive = selectedColor === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6.5 h-6.5 rounded-full border border-stone-200 shadow-2xs block relative cursor-pointer ${
                        isActive ? 'ring-2 ring-stone-900 ring-offset-2 scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={`Select ${c}`}
                    >
                      {isActive && <span className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Swatches Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold">
                  Select Garment Size
                </p>
                <button 
                  onClick={() => setIsAIStylistOpen(true)}
                  className="text-[10px] text-[#c2a46c] hover:underline font-mono"
                >
                  Sizing Guide & Fit Finder &rarr;
                </button>
              </div>
              
              <div className="flex gap-2">
                {product.sizes.map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 rounded-lg border text-xs font-mono flex items-center justify-center cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#1c1917] text-white border-[#1c1917] font-bold shadow-md'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action CTAs Layout */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono font-bold">
                  Order Quantity
                </span>
                
                {/* Micro selector */}
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-mono text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dual Action CTAs */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAdd}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-[#fafaf9] text-xs uppercase tracking-widest font-outfit font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c2a46c]" />
                  <span>Add To Bag</span>
                </button>
                
                <button
                  onClick={handleBuy}
                  className="w-full py-3.5 bg-[#c2a46c] hover:bg-[#b0935a] text-[#fafaf9] text-xs uppercase tracking-widest font-outfit font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-sm border border-[#c2a46c]"
                >
                  <span>Buy Now Instantly</span>
                </button>
              </div>

              {/* Wishlist Overlay Button */}
              <button
                onClick={() => onWishlistToggle(product.id)}
                className={`w-full py-2.5 bg-white hover:bg-stone-50 rounded-xl text-xs font-semibold tracking-wider font-outfit transition-all cursor-pointer flex items-center justify-center space-x-2 border ${
                  isWishlisted 
                    ? 'border-red-600 text-red-600 bg-red-50/10' 
                    : 'border-stone-200 text-stone-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add To Wishlist'}</span>
              </button>

            </div>

            {/* Shipping, Returns & Guarantees (Amazon Prime style lockups) */}
            <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-2xl space-y-3 text-xs text-stone-600 text-left">
              <div className="flex items-start space-x-2.5">
                <Truck className="w-4 h-4 text-[#c2a46c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-800">Vividhra Premium Fast Delivery</p>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Free express shipping on order values exceeding ₹5,000. Under ₹5,000 flat ₹150. Estimated delivery in Mumbai/Delhi: 24 to 48 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pt-2 border-t border-stone-200/40">
                <Undo2 className="w-4 h-4 text-[#c2a46c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-800">15-day Hassle Free Exchange</p>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Secure doorstep pickup for alternate sizing exchanges or refund credits.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pt-2 border-t border-stone-200/40">
                <Shield className="w-4 h-4 text-[#c2a46c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-800">Ethical Social Pledge</p>
                  <p className="text-[11px] text-stone-500 leading-normal font-serif italic">
                    Dress with purpose. Every purchase directly allocates 10% of margins to veteran sanctuaries, blind school audio systems, and local veterinary drives.
                  </p>
                </div>
              </div>
            </div>

            {/* AI styling Atelier Deep Link */}
            <button
              onClick={() => setIsAIStylistOpen(true)}
              className="w-full py-2.5 bg-[#c2a46c]/10 hover:bg-[#c2a46c]/15 text-[#c2a46c] text-[11px] uppercase tracking-widest font-mono font-bold rounded-lg border border-[#c2a46c]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult AI Stylist for this garment</span>
            </button>

          </div>

        </div>

        {/* 3. Related Products Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mt-16 pt-12 border-t border-stone-200/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#c2a46c] font-bold">
                  Sourcing Pairings
                </span>
                <h3 className="serif-header text-xl md:text-2xl font-bold text-stone-950 mt-1">
                  You Might Also Love
                </h3>
              </div>
              
              <button
                onClick={onBack}
                className="text-xs uppercase font-mono tracking-widest font-bold text-[#c2a46c] hover:text-[#1c1917] transition-all"
              >
                See all pairings &rarr;
              </button>
            </div>

            {/* Fluid horizontal or grid based on screens */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendations.map((rec) => {
                const recRating = Number(((rec.name.length % 5) * 0.1 + 4.5).toFixed(1));
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedProduct(rec)}
                    className="group flex flex-col bg-white border border-stone-200/60 hover:border-stone-400 rounded-xl overflow-hidden p-2.5 cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50 relative">
                      <img
                        src={rec.images[0]}
                        alt={rec.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-all duration-500"
                      />
                    </div>
                    <div className="pt-3 text-left space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-[#c2a46c] font-mono block">{rec.category}</span>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#c2a46c] leading-tight truncate">
                        {rec.name}
                      </h4>
                      <p className="text-xs font-bold text-stone-800 font-mono">
                        ₹{rec.price}
                      </p>
                      
                      <div className="flex items-center text-amber-500 scale-90 origin-left">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-2.5 h-2.5 ${i < Math.floor(recRating) ? 'fill-current' : 'text-stone-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
