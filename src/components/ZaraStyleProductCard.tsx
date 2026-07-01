import React, { useState } from 'react';
import { Heart, Plus, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ZaraStyleProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
  onWishlistToggle: (productId: string) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  className?: string;
}

export default function ZaraStyleProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted,
  onQuickView,
  className = "",
}: ZaraStyleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | null>(null);

  const handleQuickAdd = (size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    onAddToCart(product, size, product.colors[0]);
    setSelectedSize(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        e.preventDefault();
        onQuickView(product);
      }
    }
  };

  // Deterministic ratings to simulate high-converting social proof
  const ratingValue = Number(((product.name.length % 5) * 0.1 + 4.5).toFixed(1));
  const reviewCount = (product.name.charCodeAt(0) * 3) + 45;

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Urgent stock warning for even IDs
  const showUrgentStock = product.id.charCodeAt(product.id.length - 1) % 2 === 0;

  return (
    <div
      tabIndex={0}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-stone-200/60 hover:border-stone-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a46c] focus-visible:ring-offset-2 h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
      onKeyDown={handleKeyDown}
      aria-label={`${product.name}, Price ₹${product.price}, Rating ${ratingValue} stars. Press Enter for Quick View.`}
    >
      {/* 1. Top Section: Product Image Container (Amazon aspect ratio) */}
      <div className="relative w-full aspect-[3/4] bg-stone-50 overflow-hidden shrink-0">
        
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Secondary Hover Image (Zara/Amazon style dual display) */}
        <img
          src={product.images[1] || product.images[0]}
          alt={`${product.name} lifestyle`}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        />

        {/* Wishlist Heart Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-xs border ${
            isWishlisted
              ? 'bg-[#1c1917] border-[#1c1917] text-[#fafaf9]'
              : 'bg-white/95 border-stone-200 text-[#57534e] hover:text-[#1c1917] hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Curated/Trending Badge */}
        {product.isTrending && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#c2a46c] text-white text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-md font-sans font-semibold shadow-xs">
            Best Seller
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute bottom-2.5 left-2.5 z-10 bg-red-600 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded-sm shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* View Details Icon Overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="w-4 h-4 text-[#1c1917]" />
          </div>
        </div>

      </div>

      {/* 2. Bottom Section: Highly Informative Amazon-style Content Details */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 min-w-0 bg-white">
        
        <div className="space-y-1.5">
          {/* Brand & Category Breadcrumb */}
          <div className="flex items-center justify-between text-[9px] text-stone-400 font-mono uppercase tracking-wider">
            <span>VIVIDHRA ATELIER</span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded-sm text-stone-500 font-semibold">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-sans text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Amazon Rating Stars Block */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(ratingValue) ? 'fill-current' : 'text-stone-200'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">{ratingValue}</span>
            <span className="text-[10px] text-stone-400">({reviewCount})</span>
          </div>

          {/* Slogan or Materials Details */}
          <p className="text-[10px] text-stone-500 font-light font-sans line-clamp-1 italic">
            {product.materials}
          </p>

          {/* Pricing Block with discount computation */}
          <div className="flex items-baseline space-x-1.5 pt-0.5">
            <span className="text-sm sm:text-base font-bold text-stone-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  M.R.P: ₹{product.originalPrice}
                </span>
                <span className="text-[9px] sm:text-[10px] text-red-600 font-bold">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Free Shipping Tag (Amazon Prime style) */}
          <div className="flex items-center space-x-1 text-[10px] text-stone-500 font-sans font-medium">
            <span className="text-[#c2a46c] font-bold">✓</span>
            <span>FREE Vividhra Express Delivery</span>
          </div>

          {/* Urgency Stock Warning */}
          {showUrgentStock && (
            <p className="text-[9px] sm:text-[10px] text-amber-700 font-medium font-sans">
              Only {product.name.length % 4 + 1} left in stock - order soon.
            </p>
          )}
        </div>

        {/* Colors representation row */}
        <div className="flex items-center gap-1.5 py-2">
          {product.colors.map((c) => (
            <span
              key={c}
              className="w-2.5 h-2.5 rounded-full border border-stone-200 shadow-2xs block"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Size circular buttons & direct add action */}
        <div className="border-t border-stone-100 pt-2.5 mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">Quick Size Add</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 capitalize">{product.fitType} fit</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAdd(size);
                }}
                className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md border border-stone-200 text-[10px] font-mono flex items-center justify-center hover:bg-[#1c1917] hover:text-white hover:border-[#1c1917] transition-all cursor-pointer bg-stone-50/40 font-medium"
                title={`Quick Add ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
