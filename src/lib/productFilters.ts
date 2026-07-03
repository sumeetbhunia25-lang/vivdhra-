import { Product } from '../types';

/**
 * Filter products by selected category and search query dynamically for all 17 categories.
 */
export function filterProducts(
  products: Product[],
  selectedCategory: string,
  searchQuery: string
): Product[] {
  return products.filter((p) => {
    let matchCategory = false;
    
    // If search query is active, override category filtering so searching is global across the entire catalog!
    if (searchQuery.trim() !== '') {
      matchCategory = true;
    } else if (selectedCategory === 'all') {
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

    const q = searchQuery.toLowerCase().trim();
    
    let matchSearch = false;
    if (q === '') {
      matchSearch = true;
    } else {
      // Direct text searches
      matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q));

      // Smart semantic clothing-keyword expansions
      if (q.includes('dress')) {
        if (p.category === 'dresses') matchSearch = true;
      }
      if (q.includes('top')) {
        if (p.category === 'tops') matchSearch = true;
      }
      if (q.includes('co-ord') || q.includes('coord') || q.includes('set')) {
        if (p.category === 'co-ords' || p.name.toLowerCase().includes('set')) matchSearch = true;
      }
      if (q.includes('kurti') || q.includes('kurtis')) {
        if (p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape')) matchSearch = true;
      }
      if (q.includes('ethnic')) {
        if (p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric')) matchSearch = true;
      }
      if (q.includes('party')) {
        if (p.name.toLowerCase().includes('corset') || p.name.toLowerCase().includes('satin') || p.name.toLowerCase().includes('wine') || p.category === 'blazers') matchSearch = true;
      }
      if (q.includes('office') || q.includes('formal') || q.includes('work')) {
        if (p.category === 'blazers' || p.category === 'trousers') matchSearch = true;
      }
      if (q.includes('daily') || q.includes('casual') || q.includes('home')) {
        if (p.category === 'tops' || p.category === 'co-ords' || p.category === 'trousers') matchSearch = true;
      }
      if (q.includes('sale') || q.includes('discount') || q.includes('off')) {
        if (p.originalPrice > p.price) matchSearch = true;
      }
      if (q.includes('vacation') || q.includes('holiday') || q.includes('resort') || q.includes('beach')) {
        if (p.category === 'vacation' || p.materials.toLowerCase().includes('linen')) matchSearch = true;
      }
      if (q.includes('college')) {
        if (p.price < 1800) matchSearch = true;
      }
      if (q.includes('sustainable') || q.includes('eco') || q.includes('organic')) {
        if (p.materials.toLowerCase().includes('organic') || p.materials.toLowerCase().includes('gots') || p.materials.toLowerCase().includes('eco')) matchSearch = true;
      }
    }
      
    return matchCategory && matchSearch;
  });
}
