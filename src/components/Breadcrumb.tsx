import React, { useMemo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Product } from '../types';

interface BreadcrumbProps {
  activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
  selectedCategory: string;
  selectedProduct: Product | null;
  searchQuery: string;
  navHistory: Array<{
    activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
    selectedCategory: string;
    selectedProduct: Product | null;
    searchQuery: string;
  }>;
  setNavHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking') => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  isGoingBackRef: React.MutableRefObject<boolean>;
  categoriesList: Array<{ id: string; label: string }>;
}

export default function Breadcrumb({
  activeView,
  selectedCategory,
  selectedProduct,
  searchQuery,
  navHistory,
  setNavHistory,
  setActiveView,
  setSelectedCategory,
  setSelectedProduct,
  setSearchQuery,
  isGoingBackRef,
  categoriesList,
}: BreadcrumbProps) {
  // Compute display names for category ID
  const getCategoryLabel = (catId: string) => {
    const found = categoriesList.find((c) => c.id === catId);
    if (found) return found.label;
    return catId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleNavigate = (target: {
    activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
    selectedCategory: string;
    selectedProduct: Product | null;
    searchQuery: string;
  }) => {
    // Find matching state in history
    const idx = navHistory.findIndex((item) => {
      if (item.activeView !== target.activeView) return false;
      if (item.selectedCategory !== target.selectedCategory) return false;
      if ((item.selectedProduct?.id || null) !== (target.selectedProduct?.id || null)) return false;
      if (item.searchQuery !== target.searchQuery) return false;
      return true;
    });

    if (idx > -1) {
      isGoingBackRef.current = true;
      const targetState = navHistory[idx];
      setNavHistory(navHistory.slice(0, idx));
      setActiveView(targetState.activeView);
      setSelectedCategory(targetState.selectedCategory);
      setSelectedProduct(targetState.selectedProduct);
      setSearchQuery(targetState.searchQuery);
    } else {
      setActiveView(target.activeView);
      setSelectedCategory(target.selectedCategory);
      setSelectedProduct(target.selectedProduct);
      setSearchQuery(target.searchQuery);
    }
  };

  // Generate breadcrumb path items based on current active state
  const items = useMemo(() => {
    const list: Array<{
      label: string;
      onClick: () => void;
      isCurrent: boolean;
      id: string;
    }> = [];

    // All paths start with Home
    list.push({
      label: 'Home',
      id: 'home',
      isCurrent: activeView === 'home' && !selectedProduct,
      onClick: () =>
        handleNavigate({
          activeView: 'home',
          selectedCategory: 'all',
          selectedProduct: null,
          searchQuery: '',
        }),
    });

    if (activeView === 'shop' || selectedProduct) {
      // Collections list level
      list.push({
        label: 'Collections',
        id: 'collections',
        isCurrent: activeView === 'shop' && selectedCategory === 'all' && !searchQuery && !selectedProduct,
        onClick: () =>
          handleNavigate({
            activeView: 'shop',
            selectedCategory: 'all',
            selectedProduct: null,
            searchQuery: '',
          }),
      });

      // Category level
      const currentCategory = selectedProduct ? selectedProduct.category : selectedCategory;
      if (currentCategory && currentCategory !== 'all') {
        list.push({
          label: getCategoryLabel(currentCategory),
          id: `category-${currentCategory}`,
          isCurrent: activeView === 'shop' && selectedCategory === currentCategory && !searchQuery && !selectedProduct,
          onClick: () =>
            handleNavigate({
              activeView: 'shop',
              selectedCategory: currentCategory,
              selectedProduct: null,
              searchQuery: '',
            }),
        });
      }

      // Search Query level (if present)
      if (searchQuery && !selectedProduct) {
        list.push({
          label: `Search: "${searchQuery}"`,
          id: 'search-query',
          isCurrent: true,
          onClick: () => {},
        });
      }

      // Product level
      if (selectedProduct) {
        list.push({
          label: selectedProduct.name,
          id: `product-${selectedProduct.id}`,
          isCurrent: true,
          onClick: () => {},
        });
      }
    } else if (activeView !== 'home') {
      // Other non-home views: Story, Stylist, Profile, Admin, etc.
      const viewLabels: Record<string, string> = {
        story: 'Our Story',
        stylist: 'AI Stylist',
        profile: 'Fit Profile',
        admin: 'Atelier (Admin)',
        tracking: 'Track Journey',
      };
      list.push({
        label: viewLabels[activeView] || activeView.charAt(0).toUpperCase() + activeView.slice(1),
        id: `view-${activeView}`,
        isCurrent: true,
        onClick: () => {},
      });
    }

    return list;
  }, [activeView, selectedCategory, selectedProduct, searchQuery, navHistory, categoriesList]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-[11px] sm:text-xs text-stone-500 font-outfit select-none"
      id="vividhra-breadcrumb-nav"
    >
      {items.map((item, idx) => (
        <React.Fragment key={item.id}>
          {idx > 0 && <ChevronRight className="w-3 h-3 text-stone-300 flex-shrink-0" />}
          {item.isCurrent ? (
            <span className="text-stone-900 font-medium truncate max-w-[150px] sm:max-w-[220px]" id={`breadcrumb-item-current-${item.id}`}>
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-[#c2a46c] hover:underline cursor-pointer bg-transparent border-none p-0 text-stone-500 transition-colors font-outfit"
              id={`breadcrumb-item-btn-${item.id}`}
            >
              {item.id === 'home' && (
                <span className="inline-flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </span>
              )}
              {item.id !== 'home' && <span>{item.label}</span>}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
