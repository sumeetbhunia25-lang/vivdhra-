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
}

export default function ZaraStyleProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted,
  onQuickView,
}: ZaraStyleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | null>(null);
  const [showSizes, setShowSizes] = useState(false);

  const handleQuickAdd = (size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    onAddToCart(product, size, product.colors[0]);
    setSelectedSize(null);
    setShowSizes(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-xl border border-gray-100/80 cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        setShowSizes(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizes(false);
      }}
      onClick={() => onQuickView(product)}
    >
      {/* Zara-Style Dual-Image Container */}
      <div className="relative w-full aspect-[3/4] bg-[#f5f5f4] overflow-hidden">
        
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
          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-xs border ${
            isWishlisted
              ? 'bg-[#1c1917] border-[#1c1917] text-[#fafaf9]'
              : 'bg-white/80 border-[#e7e5e4] text-[#57534e] hover:text-[#1c1917] hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Slogan Accent Tag */}
        {product.isTrending && (
          <span className="absolute top-4 left-4 z-10 bg-[#c2a46c] text-[#fafaf9] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-outfit font-medium shadow-xs">
            Atelier Curated
          </span>
        )}

        {/* Quick Sizes Slide-Up drawer on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-xs border-t border-[#e7e5e4] p-3 transition-all duration-500 transform ${
            showSizes ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit text-center mb-2 font-medium">
            Quick Add to Cart
          </p>
          <div className="flex justify-center gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleQuickAdd(size)}
                className="w-8 h-8 rounded-full border border-[#e7e5e4] text-xs font-mono flex items-center justify-center hover:bg-[#1c1917] hover:text-white hover:border-[#1c1917] transition-all cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* View Details Icon Overlay */}
        <div className="absolute inset-0 bg-[#1c1917]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-2.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
            <Eye className="w-4.5 h-4.5 text-[#1c1917]" />
          </div>
        </div>

      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col space-y-1.5 bg-white">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-sm md:text-base font-semibold text-[#1c1917] group-hover:text-[#78716c] transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="mono-text text-sm font-semibold text-[#1c1917]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="mono-text text-[11px] text-[#a8a29e] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[#78716c] font-light font-sans line-clamp-1">
          {product.materials}
        </p>

        {/* Slogan */}
        <span className="text-[9px] uppercase tracking-widest font-mono text-[#c2a46c] font-medium pt-0.5">
          {product.slogan || 'Dress with purpose'}
        </span>
      </div>
    </div>
  );
}
