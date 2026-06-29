import React, { useState } from 'react';
import { Heart, Plus, Eye } from 'lucide-react';
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

  return (
    <div
      className={`group relative flex flex-row bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-xl border border-gray-100/90 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Left Column: Zara-Style Dual-Image Container */}
      <div className="relative w-[115px] sm:w-[150px] md:w-[170px] aspect-[3/4] bg-[#f5f5f4] overflow-hidden shrink-0">
        
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out-expo ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Secondary Hover Image (Zara style) */}
        <img
          src={product.images[1] || product.images[0]}
          alt={`${product.name} lifestyle`}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out-expo ${
            isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        />

        {/* Wishlist Button (Heart) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xs border ${
            isWishlisted
              ? 'bg-[#1c1917] border-[#1c1917] text-[#fafaf9]'
              : 'bg-white/80 border-[#e7e5e4] text-[#57534e] hover:text-[#1c1917] hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Slogan Accent Tag */}
        {product.isTrending && (
          <span className="absolute top-3 left-3 z-10 bg-[#c2a46c] text-[#fafaf9] text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-outfit font-medium shadow-xs">
            Curated
          </span>
        )}

        {/* View Details Icon Overlay */}
        <div className="absolute inset-0 bg-[#1c1917]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
            <Eye className="w-4 h-4 text-[#1c1917]" />
          </div>
        </div>

      </div>

      {/* Right Column: Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0 bg-white">
        
        {/* Title and Price */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1c1917] group-hover:text-[#78716c] transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              <span className="mono-text text-xs sm:text-sm font-semibold text-[#1c1917]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="mono-text text-[10px] sm:text-[11px] text-[#a8a29e] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#78716c] font-light font-sans line-clamp-2">
            {product.materials}
          </p>
        </div>

        {/* Colors and Category */}
        <div className="flex items-center justify-between text-[11px] text-[#78716c] font-outfit py-1.5 border-t border-b border-stone-50">
          <span className="uppercase tracking-wider font-mono text-[9px]">{product.category}</span>
          <div className="flex gap-1">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-2.5 h-2.5 rounded-full border border-stone-200 shadow-2xs"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Sizes and Slogan Footer (Highly accessible inline quick add) */}
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[#a8a29e] font-mono">Quick Add Size</span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(size);
                  }}
                  className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full border border-stone-200 text-[10px] font-mono flex items-center justify-center hover:bg-[#1c1917] hover:text-white hover:border-[#1c1917] transition-all cursor-pointer bg-stone-50/40"
                  title={`Quick Add ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Slogan */}
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-mono text-[#c2a46c] font-semibold block">
              {product.slogan || 'Dress with purpose'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
