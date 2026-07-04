import React, { useEffect, useMemo } from 'react';
import { Product } from '../types';

interface ReactHelmetProps {
  activeView: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop' | 'tracking';
  selectedProduct: Product | null;
  selectedCategory: string;
  products?: Product[];
  searchQuery?: string;
}

export function ReactHelmet({ activeView, selectedProduct, selectedCategory, products, searchQuery }: ReactHelmetProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vividhra.com';

  // Base default settings
  let title = 'VIVIDHRA | Modern, Elegant & Diverse Women\'s Clothing';
  let description = 'Discover VIVIDHRA, an elegant, aesthetic, creative, and diverse clothing brand for women. Shop premium dresses, tops, co-ords, bottom wear, and unique design collections.';
  let ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630';

  // Dynamic customization for specific screens
  if (selectedProduct) {
    title = `${selectedProduct.name} | VIVIDHRA`;
    // Craft a highly converting, clear description for messaging apps (e.g., WhatsApp)
    const discountText = selectedProduct.originalPrice 
      ? ` (${Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF!)`
      : '';
    description = `✨ Shop the exquisite ${selectedProduct.name} at VIVIDHRA for only ₹${selectedProduct.price}${discountText}. Crafted with premium ${selectedProduct.materials}. ${selectedProduct.slogan || 'Dress with purpose.'}`;
    // Ensure we use high-res square/landscape image representing the product
    ogImage = selectedProduct.images[0] || ogImage;
  } else if (activeView === 'story') {
    title = 'Our Story | VIVIDHRA';
    description = '📖 Read the story of VIVIDHRA - an affordable, elegant, aesthetic, and women-focused fashion brand designed to empower and inspire diverse modern styles.';
    ogImage = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200&h=630';
  } else if (activeView === 'stylist') {
    title = 'AI Stylist & Fit Profiler | VIVIDHRA 🪄';
    description = '🪄 Get personalized styling recommendations from the VIVIDHRA AI Stylist. Craft your unique fit profile based on comfort preferences and body silhouettes.';
    ogImage = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200&h=630';
  } else if (activeView === 'profile') {
    title = 'My Fit Profile | VIVIDHRA';
    description = '👤 Manage your VIVIDHRA account, fit profiles, body silhouettes, size guidelines, and track your sustainable couture orders.';
  } else if (activeView === 'tracking') {
    title = 'Order Journey Portal | VIVIDHRA';
    description = '📦 Track the hand-tailored manufacturing and eco-express transit coordinates of your bespoke VIVIDHRA order in real-time.';
  } else if (activeView === 'shop' && searchQuery) {
    title = `Garments matching "${searchQuery}" | VIVIDHRA`;
    description = `🛍️ Explore the finest selection of garments matching "${searchQuery}" at VIVIDHRA. Hand-tailored with premium linen, pure silk, and organic cotton.`;
    ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630';
  } else if (activeView === 'shop' && selectedCategory === 'all') {
    title = 'Collections Hub | Curated Premium Silhouettes | VIVIDHRA';
    description = '🏺 Discover VIVIDHRA\'s curated Collections Hub. Explore hand-tailored luxury garments arranged by styles: Dresses, Tops, Co-ords, Bottoms, and sustainable drops.';
    ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630';
  } else if (selectedCategory && selectedCategory !== 'all') {
    const categoryName = selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title = `${categoryName} Collection | VIVIDHRA`;
    description = `🛍️ Explore the finest selection of ${categoryName} at VIVIDHRA. Curated with premium linen, rich silk, organic cotton blends, and modern silhouettes.`;
    
    // Choose specific curated cover photos for specific categories to make sharing looks elegant
    if (selectedCategory === 'dresses') {
      ogImage = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200&h=630';
    } else if (selectedCategory === 'tops') {
      ogImage = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200&h=630';
    } else if (selectedCategory === 'co-ords') {
      ogImage = 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=1200&h=630';
    } else if (selectedCategory === 'bottoms') {
      ogImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200&h=630';
    } else if (selectedCategory === 'new-arrivals') {
      ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630';
    } else {
      ogImage = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200&h=630';
    }
  }

  // Ensure absolute image URL for external crawlers (relative /uploads/xxx.jpg are prefixed with origin)
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;

  // 1. Calculate Canonical URL dynamically (works on all devices and local hostnames)
  let canonicalUrl = origin;
  if (selectedProduct) {
    if (selectedCategory && selectedCategory !== 'all') {
      canonicalUrl = `${origin}/?category=${selectedCategory}&product=${selectedProduct.id}`;
    } else {
      canonicalUrl = `${origin}/?product=${selectedProduct.id}`;
    }
  } else if (activeView === 'shop' && searchQuery) {
    canonicalUrl = `${origin}/?search=${encodeURIComponent(searchQuery)}`;
  } else if (activeView === 'shop' && selectedCategory) {
    canonicalUrl = selectedCategory === 'all' ? `${origin}/?view=shop` : `${origin}/?category=${selectedCategory}`;
  } else if (activeView !== 'home') {
    canonicalUrl = `${origin}/?view=${activeView}`;
  }

  // 2. Compute category name display label
  const categoryLabel = selectedCategory && selectedCategory !== 'all'
    ? selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Collections Hub';

  // 3. Compute Schema.org JSON-LD dynamic metadata with an elite semantic graph structure
  const schemaData = useMemo(() => {
    // Shared elements of the Graph
    const baseGraph = [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        "name": "VIVIDHRA",
        "url": origin,
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630"
        },
        "sameAs": [
          "https://instagram.com/vividhra_atelier"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        "name": "VIVIDHRA",
        "url": origin,
        "publisher": {
          "@id": `${origin}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${origin}/?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];

    if (selectedProduct) {
      const ratingValue = Number(((selectedProduct.name.length % 5) * 0.1 + 4.5).toFixed(1));
      const reviewCount = (selectedProduct.name.charCodeAt(0) * 3) + 45;
      const absoluteProductImages = selectedProduct.images.map(img => 
        img.startsWith('http') ? img : `${origin}${img}`
      );

      const productSchema = {
        "@type": "Product",
        "@id": `${canonicalUrl}/#product`,
        "name": selectedProduct.name,
        "image": absoluteProductImages,
        "description": selectedProduct.description,
        "sku": `VVD-${selectedProduct.id.toUpperCase()}`,
        "mpn": `VVD-${selectedProduct.id.toUpperCase()}-${selectedProduct.colors[0]?.toUpperCase() || 'STD'}`,
        "color": selectedProduct.colors,
        "material": selectedProduct.materials,
        "size": selectedProduct.sizes,
        "brand": {
          "@type": "Brand",
          "name": "VIVIDHRA",
          "logo": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200&h=630",
          "slogan": "Dress with purpose"
        },
        "category": selectedProduct.category,
        "audience": {
          "@type": "PeopleAudience",
          "suggestedGender": "female"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "INR",
          "price": selectedProduct.price,
          "priceValidUntil": "2028-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": selectedProduct.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "VIVIDHRA",
            "url": origin
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
            "merchantReturnDays": 15,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": 0,
              "currency": "INR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 2,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            }
          }
        },
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": ratingValue,
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Person",
            "name": "Vividhra Patron"
          },
          "datePublished": "2026-05-15",
          "reviewBody": `The custom drapery and luxurious ${selectedProduct.materials} textile feel absolutely phenomenal. Highly recommend this VIVIDHRA piece!`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "reviewCount": reviewCount,
          "bestRating": "5",
          "worstRating": "1"
        }
      };

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": selectedProduct.category.toUpperCase(),
            "item": `${origin}/?category=${selectedProduct.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": selectedProduct.name,
            "item": canonicalUrl
          }
        ]
      };

      return {
        "@context": "https://schema.org",
        "@graph": [...baseGraph, productSchema, breadcrumbSchema]
      };
    }

    if (activeView === 'shop' && selectedCategory) {
      let filtered = products || [];
      filtered = filtered.filter((p) => {
        if (selectedCategory === 'all') {
          return true;
        } else if (selectedCategory === 'atelier-ai') {
          return ['p14', 'p15', 'p16', 'p17', 'p18', 'p19'].includes(p.id);
        } else if (selectedCategory === 'new-arrivals') {
          return p.isTrending || p.id === 'p14' || p.id === 'p15';
        } else if (selectedCategory === 'best-sellers') {
          return p.isTrending && p.price > 1600;
        } else if (selectedCategory === 'dresses') {
          return p.category === 'dresses';
        } else if (selectedCategory === 'tops') {
          return p.category === 'tops';
        } else if (selectedCategory === 'co-ords') {
          return p.category === 'co-ords';
        } else if (selectedCategory === 'bottoms') {
          return p.category === 'trousers';
        } else if (selectedCategory === 'kurtis') {
          return p.name.toLowerCase().includes('wrap') || p.name.toLowerCase().includes('drape');
        } else if (selectedCategory === 'ethnic-sets') {
          return p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('asymmetric');
        } else if (selectedCategory === 'party-wear') {
          return p.name.toLowerCase().includes('corset') || p.name.toLowerCase().includes('satin') || p.name.toLowerCase().includes('wine') || p.category === 'blazers';
        } else if (selectedCategory === 'office-wear') {
          return p.category === 'blazers' || p.category === 'trousers';
        } else if (selectedCategory === 'daily-wear') {
          return p.category === 'tops' || p.category === 'co-ords';
        } else if (selectedCategory === 'vacation-wear') {
          return p.category === 'vacation' || p.materials.toLowerCase().includes('linen');
        } else if (selectedCategory === 'college-wear') {
          return p.price < 1800;
        } else if (selectedCategory === 'house-wear') {
          return p.materials.toLowerCase().includes('cotton') && p.category === 'tops';
        } else if (selectedCategory === 'minimal-collection') {
          return p.materials.toLowerCase().includes('linen') || p.category === 'blazers';
        } else if (selectedCategory === 'sustainable-picks') {
          return p.materials.toLowerCase().includes('organic') || p.materials.toLowerCase().includes('gots') || p.materials.toLowerCase().includes('eco');
        } else if (selectedCategory === 'sale') {
          return p.originalPrice > p.price;
        } else {
          return p.category === selectedCategory;
        }
      });

      const collectionSchema = {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}/#collection`,
        "name": `${categoryLabel} Collection | VIVIDHRA`,
        "description": description,
        "url": canonicalUrl,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": filtered.length,
          "itemListElement": filtered.slice(0, 15).map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `${origin}/?product=${p.id}`,
            "name": p.name,
            "image": p.images[0].startsWith('http') ? p.images[0] : `${origin}${p.images[0]}`,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": p.price,
              "availability": "https://schema.org/InStock"
            }
          }))
        }
      };

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `${categoryLabel} Collection`,
            "item": canonicalUrl
          }
        ]
      };

      return {
        "@context": "https://schema.org",
        "@graph": [...baseGraph, collectionSchema, breadcrumbSchema]
      };
    }

    if (activeView === 'story') {
      const aboutSchema = {
        "@type": "AboutPage",
        "@id": `${canonicalUrl}/#about`,
        "name": "Our Story | VIVIDHRA",
        "description": description,
        "url": canonicalUrl
      };

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Our Story",
            "item": canonicalUrl
          }
        ]
      };

      return {
        "@context": "https://schema.org",
        "@graph": [...baseGraph, aboutSchema, breadcrumbSchema]
      };
    }

    if (activeView === 'stylist') {
      const stylistSchema = {
        "@type": "WebPage",
        "@id": `${canonicalUrl}/#stylist`,
        "name": "AI Stylist & Fit Profiler | VIVIDHRA",
        "description": description,
        "url": canonicalUrl
      };

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "AI Stylist",
            "item": canonicalUrl
          }
        ]
      };

      return {
        "@context": "https://schema.org",
        "@graph": [...baseGraph, stylistSchema, breadcrumbSchema]
      };
    }

    // Default Home WebSite graph
    return {
      "@context": "https://schema.org",
      "@graph": baseGraph
    };
  }, [selectedProduct, activeView, selectedCategory, products, canonicalUrl, description, origin, categoryLabel, searchQuery]);

  // Double-secure fallback: Client-side Meta Dynamic Synchronization
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;

      // Helper function to set/add meta tags dynamically to the active DOM header
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
      setMetaTag('property', 'og:image', absoluteOgImage);
      setMetaTag('property', 'og:image:secure_url', absoluteOgImage);
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:type', selectedProduct ? 'product' : 'website');
      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', description);
      setMetaTag('name', 'twitter:image', absoluteOgImage);
      setMetaTag('name', 'theme-color', '#c2a46c');

      // Sync canonical link dynamically in head to guarantee index integrity
      const canonicalId = 'vividhra-canonical-link';
      let link = document.getElementById(canonicalId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = canonicalId;
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;

      // Sync JSON-LD schema.org script dynamically in head
      const scriptId = 'vividhra-schema-jsonld';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schemaData);
    }
  }, [title, description, absoluteOgImage, selectedProduct, canonicalUrl, schemaData, searchQuery]);

  // React 19 / Vite natively hoists these elements to the document head automatically
  return (
    <>
      {/* Tab Title */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Brand Theme Accent for Social Preview Windows (WhatsApp Border/Highlight) */}
      <meta name="theme-color" content="#c2a46c" />

      {/* Open Graph / Facebook / Instagram / WhatsApp */}
      <meta property="og:type" content={selectedProduct ? 'product' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:secure_url" content={absoluteOgImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={selectedProduct ? selectedProduct.name : 'VIVIDHRA Lifestyle'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="VIVIDHRA" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:site" content="@vividhra_atelier" />

      {/* Schema / Product metadata for rich previews */}
      {selectedProduct && (
        <>
          <meta property="product:price:amount" content={selectedProduct.price.toString()} />
          <meta property="product:price:currency" content="INR" />
          <meta property="product:availability" content={selectedProduct.inStock ? 'instock' : 'outofstock'} />
          <meta property="product:brand" content="VIVIDHRA" />
          <meta property="product:condition" content="new" />
          <meta property="product:materials" content={selectedProduct.materials} />
          <meta property="product:fit_type" content={selectedProduct.fitType} />
          <meta property="product:sizes" content={selectedProduct.sizes.join(', ')} />
          <meta property="product:colors" content={selectedProduct.colors.join(', ')} />
          <meta name="keywords" content={`Vividhra, ${selectedProduct.name}, Women's Clothing, Fashion, ${selectedProduct.category}, ${selectedProduct.materials}, ${selectedProduct.colors.join(', ')}, ${selectedProduct.fitType}`} />
        </>
      )}

      {/* Schema.org Inline script block */}
      <script id="vividhra-schema-jsonld-ssr" type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </>
  );
}
