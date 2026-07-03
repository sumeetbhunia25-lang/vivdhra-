import React, { useState } from 'react';
import { Heart, Plus, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface VividhraStyleProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
  onWishlistToggle: (productId: string) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  className?: string;
}

export default function VividhraStyleProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted,
  onQuickView,
  onSelectProduct,
  className = "",
}: VividhraStyleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | null>(null);
  const [isPrimaryLoaded, setIsPrimaryLoaded] = useState(true);
  const [isSecondaryLoaded, setIsSecondaryLoaded] = useState(true);

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

  // Deterministic stock to simulate live inventory levels
  const productStock = product.stock !== undefined 
    ? product.stock 
    : (product.id.charCodeAt(product.id.length - 1) % 2 === 0 ? (product.name.length % 4 + 1) : 12);

  const showUrgentStock = productStock < 5;

  return (
    <div
      tabIndex={0}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-stone-200/60 hover:border-stone-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a46c] focus-visible:ring-offset-2 h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => onSelectProduct ? onSelectProduct(product) : onQuickView(product)}
      onKeyDown={handleKeyDown}
      aria-label={`${product.name}, Price ₹${product.price}, Rating ${ratingValue} stars. Press Enter for Quick View.`}
    >
      {/* 1. Top Section: Product Image Container (Square aspect ratio for modern, balanced editorial style) */}
      <div className="relative w-full aspect-square bg-stone-50 overflow-hidden shrink-0">
        
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setIsPrimaryLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out ${
            product.images.length > 1
              ? (isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100')
              : (isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-100')
          } ${isPrimaryLoaded ? 'blur-0' : 'blur-md opacity-40 bg-stone-100'}`}
        />

        {/* Secondary Hover Image (Vividhra style dual display) */}
        {product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={`${product.name} lifestyle`}
            referrerPolicy="no-referrer"
            onLoad={() => setIsSecondaryLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out ${
              isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            } ${isSecondaryLoaded ? 'blur-0' : 'blur-md opacity-40 bg-stone-100'}`}
          />
        )}

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

        {/* Top-Left Badges Stack (Limited Stock & Best Seller) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          {productStock < 5 && (
            <span className="bg-red-600 text-white text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold shadow-xs flex items-center gap-1 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
              Limited Stock
            </span>
          )}
          {product.isTrending && (
            <span className="bg-[#c2a46c] text-white text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-semibold shadow-xs">
              Best Seller
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute bottom-2 left-2 z-10 bg-red-600 text-white text-[7.5px] font-sans font-bold px-1.5 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
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

      {/* 2. Bottom Section: Simplified Premium Details containing Name, Price, and Size availability only */}
      <div className="p-3.5 flex flex-col justify-between bg-white border-t border-stone-100">
        
        <div className="space-y-1.5">
          {/* Product Title */}
          <h3 className="font-sans text-xs font-semibold text-stone-900 group-hover:text-stone-600 transition-colors leading-tight line-clamp-1">
            {product.name}
          </h3>

          {/* Pricing Block */}
          <div className="flex items-baseline space-x-1.5 pt-0.5">
            <span className="text-xs font-bold text-stone-900">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-stone-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Size availability */}
          <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500 font-sans">
            <span className="font-medium">Sizes:</span>
            <div className="flex gap-1">
              {product.sizes.map((sz) => (
                <span key={sz} className="px-1 py-0.5 bg-stone-50 border border-stone-100 rounded text-[9px] font-mono text-stone-600">
                  {sz}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
