import React, { useState } from 'react';
import { X, ShoppingBag, Star, Info, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
}: QuickViewModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Original');
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [isAdded, setIsAdded] = useState(false);

  // Deterministic ratings to simulate social proof
  const ratingValue = Number(((product.name.length % 5) * 0.1 + 4.5).toFixed(1));
  const reviewCount = (product.name.charCodeAt(0) * 3) + 45;

  // Deterministic stock
  const productStock = product.stock !== undefined 
    ? product.stock 
    : (product.id.charCodeAt(product.id.length - 1) % 2 === 0 ? (product.name.length % 4 + 1) : 12);

  const isLimitedStock = productStock < 5;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-scale-up border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-stone-900 hover:scale-105 transition-all shadow-xs cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Column */}
        <div className="md:w-1/2 bg-stone-50 p-6 flex flex-col justify-between border-r border-stone-100 overflow-y-auto">
          <div className="relative aspect-square w-full bg-stone-100 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-200/50">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-500"
            />
            {isLimitedStock && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-sans font-bold shadow-xs">
                Limited Stock (Only {productStock} left)
              </span>
            )}
          </div>

          {/* Image Selector Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img ? 'border-[#c2a46c]' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5 text-left">
            <div>
              {/* Slogan and Category */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#c2a46c] font-bold">
                  {product.category}
                </span>
                {product.isTrending && (
                  <span className="bg-[#c2a46c]/15 text-[#a18146] text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold font-mono">
                    Atelier Curated
                  </span>
                )}
              </div>
              
              <h2 className="serif-header text-xl md:text-2xl font-bold tracking-tight text-stone-900 mt-2">
                {product.name}
              </h2>
              {product.slogan && (
                <p className="text-[10px] italic font-serif text-stone-500 mt-0.5">
                  &ldquo;{product.slogan}&rdquo;
                </p>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline space-x-3 pb-3 border-b border-stone-100">
              <span className="text-xl font-bold text-stone-900 font-mono">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs line-through text-stone-400 font-mono">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Rating summary */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex text-[#c2a46c]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(ratingValue) ? 'fill-current' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-stone-700">{ratingValue}</span>
              <span className="text-stone-400">({reviewCount} reviews)</span>
            </div>

            {/* Mini description */}
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Materials & Sourcing */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                Atelier Composition & Care
              </p>
              <p className="text-xs text-stone-700 font-light">
                🌿 <span className="font-medium">Fabric:</span> {product.materials}
              </p>
              <p className="text-[11px] text-stone-500 italic">
                ✨ <span className="font-medium">Care:</span> {product.care}
              </p>
            </div>

            {/* Color selector */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                Select Shade: <span className="text-stone-800">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-outfit border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'bg-stone-900 border-stone-900 text-white font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-bold">
                  Select Size
                </span>
                <span className="text-[10px] text-[#c2a46c] hover:underline cursor-pointer">
                  Size Advisor
                </span>
              </div>
              <div className="flex gap-2">
                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-lg text-xs font-outfit border flex items-center justify-center transition-all ${
                        !isAvailable
                          ? 'opacity-30 cursor-not-allowed bg-stone-50 border-stone-100'
                          : selectedSize === size
                          ? 'bg-stone-900 border-stone-900 text-white font-bold scale-105'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-stone-100 mt-6 flex gap-3">
            {onWishlistToggle && (
              <button
                onClick={() => onWishlistToggle(product.id)}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}

            <button
              onClick={handleAddToCartClick}
              disabled={isAdded}
              className={`flex-1 py-3 px-6 rounded-xl text-xs uppercase tracking-widest font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1c1917] hover:bg-stone-800 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAdded ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
