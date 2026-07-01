import React, { useEffect } from 'react';
import { Product } from '../types';

interface ReactHelmetProps {
  activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop';
  selectedProduct: Product | null;
  selectedCategory: string;
}

export function ReactHelmet({ activeView, selectedProduct, selectedCategory }: ReactHelmetProps) {
  // Determine dynamic metadata based on the current user view
  let title = 'VIVIDHRA | Modern, Elegant & Diverse Women\'s Clothing';
  let description = 'Discover VIVIDHRA, an elegant, aesthetic, creative, and diverse clothing brand for women. Shop premium dresses, tops, co-ords, bottom wear, and unique design collections.';
  let ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200';
  const ogUrl = typeof window !== 'undefined' ? window.location.href : 'https://vividhra.com';

  if (selectedProduct) {
    title = `${selectedProduct.name} | VIVIDHRA`;
    description = `Shop the exquisite ${selectedProduct.name} on VIVIDHRA. Price: ₹${selectedProduct.price}. Premium Fabric: ${selectedProduct.materials}. ${selectedProduct.slogan || 'Dress with purpose.'}`;
    ogImage = selectedProduct.images[0] || ogImage;
  } else if (activeView === 'story') {
    title = 'Our Story | VIVIDHRA';
    description = 'Read the story of VIVIDHRA - an affordable, elegant, aesthetic, and women-focused fashion brand designed to empower and inspire diverse modern styles.';
  } else if (activeView === 'stylist') {
    title = 'AI Stylist & Fit Profiler | VIVIDHRA';
    description = 'Get personalized styling recommendations from the VIVIDHRA AI Stylist. Craft your unique fit profile based on comfort preferences and body silhouettes.';
  } else if (activeView === 'profile') {
    title = 'My Fit Profile | VIVIDHRA';
    description = 'Manage your VIVIDHRA account, fit profiles, body silhouettes, size guidelines, and track your sustainable couture orders.';
  } else if (selectedCategory && selectedCategory !== 'all') {
    const categoryName = selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title = `${categoryName} Collection | VIVIDHRA`;
    description = `Explore the finest selection of ${categoryName} at VIVIDHRA. Curated with premium linen, rich silk, organic cotton blends, and modern silhouettes.`;
  }

  // Double-secure fallback: client-side meta synchronization
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;

      // Helper function to set meta tag content
      const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
        let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attributeName, attributeValue);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'og:image', ogImage);
      setMetaTag('property', 'og:url', ogUrl);
      setMetaTag('property', 'og:type', selectedProduct ? 'product' : 'website');
      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', description);
      setMetaTag('name', 'twitter:image', ogImage);
    }
  }, [title, description, ogImage, ogUrl, selectedProduct]);

  // React 19 natively hoists these tags to document head
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={selectedProduct ? 'product' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="VIVIDHRA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {selectedProduct && (
        <>
          <meta property="product:price:amount" content={selectedProduct.price.toString()} />
          <meta property="product:price:currency" content="INR" />
          <meta property="product:availability" content="instock" />
          <meta name="keywords" content={`Vividhra, ${selectedProduct.name}, Women's Clothing, Fashion, ${selectedProduct.category}, ${selectedProduct.materials}`} />
        </>
      )}
    </>
  );
}
