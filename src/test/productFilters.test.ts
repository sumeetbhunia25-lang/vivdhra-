import { describe, it, expect } from 'vitest';
import { filterProducts } from '../lib/productFilters';
import { Product } from '../types';

const mockProductsList: Product[] = [
  {
    id: 'p1',
    name: 'Elegant Linen Dress',
    category: 'dresses',
    price: 2450,
    originalPrice: 2450,
    description: 'Pure organic linen crafted with standard care.',
    slogan: 'Timeless organic elegance',
    materials: 'Organic Linen',
    care: 'Hand wash only',
    images: ['img1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Ivory'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p2',
    name: 'Summer Knit Top',
    category: 'tops',
    price: 1500,
    originalPrice: 2000, // On Sale
    description: 'Comfortable cotton summer top.',
    slogan: 'Lighter than air',
    materials: 'GOTS Certified Cotton',
    care: 'Dry clean recommended',
    images: ['img2.jpg'],
    sizes: ['M', 'L'],
    colors: ['Beige'],
    inStock: true,
    fitType: 'slim',
    isTrending: false
  },
  {
    id: 'p14', // AI Atelier Pick
    name: 'Atelier AI Silk Blazer',
    category: 'blazers',
    price: 4500,
    originalPrice: 4500,
    description: 'Bespoke custom-made AI generated fit blazer.',
    slogan: 'The future of tailoring',
    materials: 'Pure Mulberry Silk',
    care: 'Professional dry clean',
    images: ['img3.jpg'],
    sizes: ['M', 'XL'],
    colors: ['Charcoal'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p15', // AI Atelier Pick & New Arrival
    name: 'Eco-Luxury Silk Trousers',
    category: 'trousers',
    price: 3200,
    originalPrice: 3200,
    description: 'Flowy comfortable bespoke trousers.',
    slogan: 'Silk reimagined',
    materials: 'Eco Silk Blend',
    care: 'Hand wash cold',
    images: ['img4.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Emerald'],
    inStock: true,
    fitType: 'regular',
    isTrending: false
  }
];

describe('filterProducts', () => {
  describe('Category Filtering', () => {
    it('should return all products when category is "all" and search is empty', () => {
      const result = filterProducts(mockProductsList, 'all', '');
      expect(result).toHaveLength(mockProductsList.length);
    });

    it('should filter correctly for specific category "dresses"', () => {
      const result = filterProducts(mockProductsList, 'dresses', '');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p1');
    });

    it('should filter correctly for "atelier-ai" picks based on IDs', () => {
      const result = filterProducts(mockProductsList, 'atelier-ai', '');
      expect(result).toHaveLength(2); // p14 and p15
      expect(result.map(p => p.id)).toContain('p14');
      expect(result.map(p => p.id)).toContain('p15');
    });

    it('should filter correctly for "new-arrivals" based on isTrending or specific IDs', () => {
      const result = filterProducts(mockProductsList, 'new-arrivals', '');
      // p1 isTrending: true (yes)
      // p2 isTrending: false, not ID p14/p15 (no)
      // p14 isTrending: true (yes)
      // p15 is ID p15 (yes)
      expect(result).toHaveLength(3);
      expect(result.map(p => p.id)).not.toContain('p2');
    });

    it('should filter correctly for "best-sellers" (trending & price > 1600)', () => {
      const result = filterProducts(mockProductsList, 'best-sellers', '');
      // p1: isTrending true, price 2450 (> 1600) -> Yes
      // p14: isTrending true, price 4500 (> 1600) -> Yes
      // p15: isTrending false -> No
      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('p1');
      expect(result.map(p => p.id)).toContain('p14');
    });

    it('should filter correctly for "sale" (originalPrice > price)', () => {
      const result = filterProducts(mockProductsList, 'sale', '');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p2'); // 2000 -> 1500
    });
  });

  describe('Search Keyword Matching', () => {
    it('should match products based on name (case insensitive)', () => {
      const result = filterProducts(mockProductsList, 'all', 'top');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p2');
    });

    it('should match products based on materials description', () => {
      const result = filterProducts(mockProductsList, 'all', 'Mulberry');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p14');
    });

    it('should match products based on generic category text', () => {
      const result = filterProducts(mockProductsList, 'all', 'trousers');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p15');
    });
  });

  describe('Semantic Search and Intelligent Expansions', () => {
    it('should expand "dress" to include all items under "dresses" category', () => {
      const result = filterProducts(mockProductsList, 'all', 'summer dress');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('dresses');
    });

    it('should expand "sustainable" to match products with organic, eco, or gots materials', () => {
      const result = filterProducts(mockProductsList, 'all', 'sustainable');
      // p1: 'Organic Linen' -> matches (Organic)
      // p2: 'GOTS Certified Cotton' -> matches (GOTS)
      // p14: 'Pure Mulberry Silk' -> does not match
      // p15: 'Eco Silk Blend' -> matches (Eco)
      expect(result).toHaveLength(3);
    });

    it('should expand "college" to match budget friendly items (< 1800)', () => {
      const result = filterProducts(mockProductsList, 'all', 'college outfit');
      // p2 is 1500 (< 1800) -> Yes
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p2');
    });
  });
});
