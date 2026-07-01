import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Check, RotateCcw, ChevronRight, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { Product, WishlistItem } from '../types';
import ZaraStyleProductCard from './ZaraStyleProductCard';

interface CategoryListingPageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  handleAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
  handleToggleWishlist: (productId: string) => void;
  wishlist: WishlistItem[];
  categoriesList: Array<{ id: string; label: string; image: string }>;
}

export default function CategoryListingPage({
  selectedCategory,
  setSelectedCategory,
  products,
  searchQuery,
  setSearchQuery,
  setSelectedProduct,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
  categoriesList,
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
    return categoriesList.find((c) => c.id === selectedCategory)?.label || 'Our Collection';
  }, [selectedCategory, categoriesList]);

  // Dynamically filter products using the unified app category filter rules first, then the custom materials & price constraints
  const finalFilteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Core category match (mirroring the main App filtering block for absolute integrity)
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

        // 2. Search Query Match
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        // 3. Material Texture Match
        let matchMaterial = true;
        if (selectedMaterial !== 'all') {
          matchMaterial = p.materials.toLowerCase().includes(selectedMaterial) || p.description.toLowerCase().includes(selectedMaterial);
        }

        // 4. Price Bracket Match
        let matchPrice = true;
        if (selectedPriceRange === 'under-1500') {
          matchPrice = p.price < 1500;
        } else if (selectedPriceRange === '1500-2500') {
          matchPrice = p.price >= 1500 && p.price <= 2500;
        } else if (selectedPriceRange === 'over-2500') {
          matchPrice = p.price > 2500;
        }

        return matchCategory && matchSearch && matchMaterial && matchPrice;
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

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 1. Category Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-stone-500 font-outfit mb-6">
          <button 
            onClick={() => setSelectedCategory('all')} 
            className="hover:text-[#1c1917] hover:underline"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-400">Collections</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-medium tracking-wide uppercase text-[10px] bg-stone-100 px-2 py-0.5 rounded-sm">
            {activeCategoryLabel}
          </span>
        </div>

        {/* 2. Brand Category Banner */}
        <div className="relative overflow-hidden bg-[#1c1917] rounded-3xl p-8 md:p-12 text-white mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-stone-800">
          <div className="space-y-3 max-w-2xl relative z-10 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#dfba73] font-bold">
              Exclusive Sustainable Atelier
            </span>
            <h1 className="serif-header text-3xl md:text-5xl font-bold tracking-tight text-[#fafaf9]">
              {activeCategoryLabel}
            </h1>
            <p className="text-xs md:text-sm text-stone-300 font-light leading-relaxed">
              Discover clean architectural cuts, tailored silhouettes, and organic textiles crafted for comfort. All proceeds direct support to veterinary aid, elder care sanctuaries, and child educational drives.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 text-left self-start md:self-auto min-w-[200px]">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#dfba73] font-bold">
              Sustainable Promise
            </p>
            <p className="text-xs text-stone-200 mt-1">
              ✓ 100% GOTS Cotton & Linen
            </p>
            <p className="text-xs text-stone-200 mt-0.5">
              ✓ Tailored in Mumbai, India
            </p>
            <p className="text-xs text-stone-200 mt-0.5">
              ✓ Empowering Communities
            </p>
          </div>
          
          {/* Subtle gold glow behind banner */}
          <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[#c2a46c]/15 rounded-full blur-3xl pointer-events-none" />
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
                    <ZaraStyleProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.productId === prod.id)}
                      onQuickView={(p) => setSelectedProduct(p)}
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
