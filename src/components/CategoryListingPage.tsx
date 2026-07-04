import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Check, RotateCcw, ChevronRight, ChevronLeft, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { Product, WishlistItem } from '../types';
import VividhraStyleProductCard from './VividhraStyleProductCard';
import Breadcrumb from './Breadcrumb';
import { filterProducts } from '../lib/productFilters';

interface CategoryListingPageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  onQuickView: (product: Product | null) => void;
  handleAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
  handleToggleWishlist: (productId: string) => void;
  wishlist: WishlistItem[];
  categoriesList: Array<{ id: string; label: string; image: string }>;
  onBack?: () => void;
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking') => void;
  navHistory: any[];
  setNavHistory: React.Dispatch<React.SetStateAction<any[]>>;
  isGoingBackRef: React.MutableRefObject<boolean>;
}

export default function CategoryListingPage({
  selectedCategory,
  setSelectedCategory,
  products,
  searchQuery,
  setSearchQuery,
  setSelectedProduct,
  onQuickView,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
  categoriesList,
  onBack,
  setActiveView,
  navHistory,
  setNavHistory,
  isGoingBackRef,
}: CategoryListingPageProps) {
  // Local Filter States
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // List of unique materials for filter
  const materialFilters = [
    { id: 'all', label: 'All Textures' },
    { id: 'silk', label: 'Luxurious Silk' },
    { id: 'linen', label: 'Breezy Linen' },
    { id: 'cotton', label: 'GOTS Organic Cotton' },
    { id: 'bamboo', label: 'Bamboo Tencel' },
    { id: 'knit', label: 'Premium Ribbed Knit' },
    { id: 'satin', label: 'Fluid Satin' },
  ];

  // Price range options
  const priceRanges = [
    { id: 'all', label: 'All Price Brackets' },
    { id: 'under-1500', label: 'Under ₹1,500' },
    { id: '1500-2500', label: '₹1,500 - ₹2,500' },
    { id: 'over-2500', label: 'Over ₹2,500' },
  ];

  const activeCategoryLabel = useMemo(() => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return categoriesList.find((c) => c.id === selectedCategory)?.label || 'Our Collection';
  }, [selectedCategory, categoriesList, searchQuery]);

  // Dynamically filter products using the unified app category filter rules first, then the custom materials & price constraints
  const finalFilteredProducts = useMemo(() => {
    // 1. Get products matching category and search query using the unified filter logic
    const coreFiltered = filterProducts(products, selectedCategory, searchQuery);

    return coreFiltered
      .filter((p) => {
        // 2. Material Texture Match
        let matchMaterial = true;
        if (selectedMaterial !== 'all') {
          matchMaterial = p.materials.toLowerCase().includes(selectedMaterial) || p.description.toLowerCase().includes(selectedMaterial);
        }

        // 3. Price Bracket Match
        let matchPrice = true;
        if (selectedPriceRange === 'under-1500') {
          matchPrice = p.price < 1500;
        } else if (selectedPriceRange === '1500-2500') {
          matchPrice = p.price >= 1500 && p.price <= 2500;
        } else if (selectedPriceRange === 'over-2500') {
          matchPrice = p.price > 2500;
        }

        return matchMaterial && matchPrice;
      })
      .sort((a, b) => {
        // Amazon-style Sorting Options
        if (sortBy === 'price-low-high') {
          return a.price - b.price;
        }
        if (sortBy === 'price-high-low') {
          return b.price - a.price;
        }
        if (sortBy === 'best-sellers') {
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        }
        if (sortBy === 'top-rated') {
          // Deterministic ratings
          const rA = Number(((a.name.length % 5) * 0.1 + 4.5).toFixed(1));
          const rB = Number(((b.name.length % 5) * 0.1 + 4.5).toFixed(1));
          return rB - rA;
        }
        // Default Recommended sorting
        return a.id.localeCompare(b.id);
      });
  }, [products, selectedCategory, searchQuery, selectedMaterial, selectedPriceRange, sortBy]);

  const resetFilters = () => {
    setSelectedMaterial('all');
    setSelectedPriceRange('all');
    setSortBy('recommended');
    setSearchQuery('');
  };

  if (selectedCategory === 'all' && !searchQuery) {
    return (
      <div className="pt-24 md:pt-32 pb-24 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Breadcrumb representing the collections hub */}
          <div className="mb-6">
            <Breadcrumb
              activeView="shop"
              selectedCategory="all"
              selectedProduct={null}
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

          {/* Section Header */}
          <div className="text-left mb-10 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c2a46c] font-bold block mb-1 font-mono">
              Vividhra Atelier
            </span>
            <h1 className="serif-header text-2xl md:text-3xl font-semibold tracking-tight text-[#1c1917] mb-2">
              Explore Collections
            </h1>
            <p className="text-xs text-[#78716c] font-outfit leading-relaxed">
              Discover exquisitely hand-tailored premium garments arranged by curated silhouettes, textures, and sustainable drops.
            </p>
          </div>

          {/* Sub-sections Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categoriesList
              .filter((cat) => cat.id !== 'all')
              .map((cat, idx) => {
                const count = products.filter((p) => {
                  if (cat.id === 'atelier-ai') return ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id);
                  if (cat.id === 'new-arrivals') return p.isTrending || p.id === 'p14' || p.id === 'p15';
                  if (cat.id === 'best-sellers') return p.isTrending && p.price > 1600;
                  if (cat.id === 'dresses') return p.category === 'dresses';
                  if (cat.id === 'tops') return p.category === 'tops';
                  if (cat.id === 'co-ords') return p.category === 'co-ords';
                  if (cat.id === 'bottoms') return p.category === 'trousers';
                  if (cat.id === 'kurtis') return p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape');
                  if (cat.id === 'ethnic-sets') return p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric');
                  return p.category === cat.id;
                }).length;

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 border border-stone-200/40"
                  >
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-stone-900/35 group-hover:bg-stone-900/30 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                      <span className="text-[8.5px] uppercase tracking-wider text-stone-200 font-mono mb-0.5">
                        {count} {count === 1 ? 'Garment' : 'Garments'}
                      </span>
                      <h2 className="serif-header text-sm font-semibold tracking-wide text-white leading-snug uppercase">
                        {cat.label}
                      </h2>
                      <div className="flex items-center gap-1 text-[10px] font-outfit text-stone-300 group-hover:text-white transition-colors mt-1">
                        <span>Enter</span>
                        <ArrowRight className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 1. Category Breadcrumbs */}
        <div className="mb-3">
          <Breadcrumb
            activeView="shop"
            selectedCategory={selectedCategory}
            selectedProduct={null}
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

        {selectedCategory !== 'all' && (
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                setSelectedCategory('all');
              }
            }}
            className="mb-3 inline-flex items-center gap-1 text-xs font-semibold font-outfit text-[#c2a46c] hover:text-[#1c1917] transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Collections Hub</span>
          </button>
        )}

        {/* 2. Simple Category Title */}
        <div className="mb-2 text-left">
          <h1 className="serif-header text-lg md:text-xl font-semibold tracking-tight text-[#1c1917]">
            {activeCategoryLabel}
          </h1>
        </div>

        {/* 3. Filter & Sort Toolbar for tablet/desktop */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-stone-900 uppercase">
              Filter By
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-mono text-stone-500">
              {finalFilteredProducts.length} {finalFilteredProducts.length === 1 ? 'Garment' : 'Garments'} Found
            </span>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Sort Dropdown */}
            <span className="text-xs font-mono text-stone-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-outfit border border-stone-200 rounded-lg py-1.5 pl-2.5 pr-8 bg-white focus:outline-none focus:border-[#c2a46c] focus:ring-1 focus:ring-[#c2a46c] font-semibold cursor-pointer text-stone-800"
            >
              <option value="recommended">Best Match (Recommended)</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="best-sellers">Bestselling Items</option>
              <option value="top-rated">Highest Customer Rating</option>
            </select>

            {/* Mobile Filter toggle button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* 4. Side-by-Side Category Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block space-y-8 text-left border-r border-stone-200/60 pr-6">
            
            {/* Texture Category Links */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                Organic Fabrics
              </h4>
              <div className="flex flex-col space-y-1">
                {materialFilters.map((mat) => {
                  const isActive = selectedMaterial === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`text-xs py-1.5 text-left font-outfit transition-colors flex items-center justify-between cursor-pointer ${
                        isActive ? 'text-[#1c1917] font-bold' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <span>{mat.label}</span>
                      {isActive && <Check className="w-3 h-3 text-[#c2a46c]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Brackets filter */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                Price Brackets
              </h4>
              <div className="flex flex-col space-y-1">
                {priceRanges.map((range) => {
                  const isActive = selectedPriceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`text-xs py-1.5 text-left font-outfit transition-colors flex items-center justify-between cursor-pointer ${
                        isActive ? 'text-[#1c1917] font-bold' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <span>{range.label}</span>
                      {isActive && <Check className="w-3 h-3 text-[#c2a46c]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Categories Navigation Rail */}
            <div className="space-y-3 pt-6 border-t border-stone-100">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                Other Collections
              </h4>
              <div className="flex flex-col space-y-1.5">
                {categoriesList
                  .filter((cat) => cat.id !== selectedCategory && cat.id !== 'atelier-ai')
                  .slice(0, 8)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="text-xs text-stone-500 hover:text-[#1c1917] font-outfit text-left truncate hover:underline py-1 cursor-pointer flex items-center space-x-1"
                    >
                      <span>&middot;</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Active Filters Clear Indicator */}
            {(selectedMaterial !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="w-full mt-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-widest font-mono font-bold rounded-lg border border-stone-200 flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Social Impact Pledge */}
            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl mt-8 space-y-2.5">
              <p className="text-[10px] uppercase tracking-wider font-mono text-[#c2a46c] font-bold">
                Sanskrit Heritage Pledge
              </p>
              <p className="text-[10px] text-stone-500 leading-normal font-sans">
                Every customer order funds veterinary support, blind school books, senior care centers, and educational tools. 
                <span className="block mt-1.5 font-bold italic text-stone-700">&ldquo;Dress with purpose&rdquo;</span>
              </p>
            </div>

          </div>

          {/* Product Grid Workspace (Col Span 3 on desktop) */}
          <div className="md:col-span-3">
            {finalFilteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center space-y-4">
                <p className="text-sm text-[#78716c] font-outfit font-light">
                  No garments match your active filters in <span className="font-bold">"{activeCategoryLabel}"</span>.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-[#1c1917] hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono rounded-lg cursor-pointer shadow-xs transition-colors"
                >
                  Clear Active Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                  {finalFilteredProducts.map((prod) => (
                    <VividhraStyleProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.productId === prod.id)}
                      onQuickView={onQuickView}
                      onSelectProduct={setSelectedProduct}
                      className="h-full"
                    />
                  ))}
                </div>

                {/* Simulated Pagination Social Proof Banner */}
                <div className="mt-14 pt-8 border-t border-stone-200/60 flex flex-col items-center justify-center space-y-3">
                  <p className="text-xs font-mono text-stone-500">
                    Showing all {finalFilteredProducts.length} garments of {finalFilteredProducts.length}
                  </p>
                  <p className="text-[10px] font-sans font-light text-stone-400">
                    ✓ Hand-crafted locally &bull; Express delivery options at checkout
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 5. Mobile Filters Slide-over panel */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-100 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-xs h-full relative z-10 p-6 flex flex-col justify-between shadow-2xl border-l text-left"
            >
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="serif-header text-lg font-bold text-[#1c1917]">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer text-xs uppercase font-mono"
                  >
                    Close
                  </button>
                </div>

                {/* Fabrics filter */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                    Organic Fabrics
                  </h4>
                  <div className="flex flex-col space-y-1">
                    {materialFilters.map((mat) => {
                      const isActive = selectedMaterial === mat.id;
                      return (
                        <button
                          key={mat.id}
                          onClick={() => {
                            setSelectedMaterial(mat.id);
                            setIsMobileFilterOpen(false);
                          }}
                          className={`text-xs py-2 text-left font-outfit transition-colors flex items-center justify-between cursor-pointer border-b border-stone-50 ${
                            isActive ? 'text-[#1c1917] font-bold' : 'text-stone-500'
                          }`}
                        >
                          <span>{mat.label}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#c2a46c]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Brackets filter */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c] font-bold">
                    Price Brackets
                  </h4>
                  <div className="flex flex-col space-y-1">
                    {priceRanges.map((range) => {
                      const isActive = selectedPriceRange === range.id;
                      return (
                        <button
                          key={range.id}
                          onClick={() => {
                            setSelectedPriceRange(range.id);
                            setIsMobileFilterOpen(false);
                          }}
                          className={`text-xs py-2 text-left font-outfit transition-colors flex items-center justify-between cursor-pointer border-b border-stone-50 ${
                            isActive ? 'text-[#1c1917] font-bold' : 'text-stone-500'
                          }`}
                        >
                          <span>{range.label}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#c2a46c]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-widest font-mono font-bold rounded-lg cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
