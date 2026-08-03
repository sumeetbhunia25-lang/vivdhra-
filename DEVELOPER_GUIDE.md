# 📖 VIVIDHRA Customization & Developer Guide

This developer guide provides step-by-step instructions for customizing brand styling, adding new clothing inventory, modifying fonts and logos, managing reviews, and working with the AI backend integration in VIVIDHRA.

---

## 📑 Table of Contents
1. [Adding & Managing Clothing Products](#1-adding--managing-clothing-products)
2. [Changing Brand Fonts & Typography](#2-changing-brand-fonts--typography)
3. [Updating Brand Logos & Headers](#3-updating-brand-logos--headers)
4. [Mapping Custom Data to Dynamic Display Components](#4-mapping-custom-data-to-dynamic-display-components)
5. [Product Reviews Storage & AI Integration](#5-product-reviews-storage--ai-integration)
6. [Backend API Routes & Admin UI Components](#6-backend-api-routes--admin-ui-components)
7. [Managing & Customizing Search Images, Category Avatars & Product Visuals](#7-managing--customizing-search-images-category-avatars--product-visuals)

---

## 1. Adding & Managing Clothing Products

There are two primary ways to add new garments to the VIVIDHRA catalog:

### Option A: Via the Admin Control Panel (Recommended)
1. Navigate to the **Atelier Control Dashboard** (Admin Panel).
2. Go to the **Garment CRUD** section.
3. **AI Automated Scan**: Drag & drop or upload a high-resolution garment photo into the **AI Scan Product Image** uploader. The backend proxies the image to Google Gemini (`gemini-3.6-flash`), which automatically extracts:
   - Garment name & slogan
   - Category & subcategory
   - Price & original price
   - Luxury description
   - Fabric materials & garment care
   - Color palettes & style tags
4. **Manual Customization**: Review and edit any pre-filled fields.
5. Click **Publish Garment Design**. The item is immediately saved to `/data/vividhra_db.json` and goes live on the storefront without requiring a rebuild or server restart!

### Option B: Direct Database Entry (`/data/vividhra_db.json`)
You can manually add products directly to the `products` array in `/data/vividhra_db.json`:

```json
{
  "id": "prod-101",
  "name": "Elysian Silk Wrap Kurti",
  "category": "dresses",
  "subcategory": "Silk Dresses",
  "price": 4999,
  "originalPrice": 6999,
  "description": "Hand-tailored mulberry silk wrap dress with fluid drapes.",
  "slogan": "Elegance woven with purpose.",
  "materials": "100% Pure Mulberry Silk",
  "care": "Dry clean only. Store in breathable muslin bag.",
  "images": [
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80"
  ],
  "sizes": ["XS", "S", "M", "L", "XL"],
  "colors": ["Burgundy", "Emerald", "Ivory"],
  "rating": 4.9,
  "reviewCount": 18,
  "isTrending": true,
  "tags": ["Eco-Silk", "Evening", "Draped"]
}
```

---

## 2. Changing Brand Fonts & Typography

Brand fonts are configured across three layers: Google Fonts import (`index.html`), Tailwind CSS configuration (`src/index.css`), and font utility classes.

### Step 1: Update Font Imports in `index.html`
Open `/index.html` and edit the Google Fonts `<link>` tag:
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..800&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Step 2: Configure CSS Utilities in `src/index.css`
Define font families using CSS variables or utility classes in `/src/index.css`:
```css
@theme {
  --font-serif: "Playfair Display", "Cinzel", Georgia, serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-outfit: "Outfit", sans-serif;
}

.serif-header {
  font-family: var(--font-serif);
}
```

---

## 3. Updating Brand Logos & Headers

### Header Brand Logo
The top navigation wordmark and logo are rendered inside `/src/components/Header.tsx`:
- **Desktop Wordmark**: Search for `<span className="serif-header ...">VIVIDHRA</span>` around line 225 in `/src/components/Header.tsx`.
- To replace text with an image/SVG logo, swap the text block for an image tag:
  ```tsx
  <img src="/assets/logo.svg" alt="VIVIDHRA Logo" className="h-8 w-auto object-contain" />
  ```

### Footer Brand Logo
The footer logo is located in `/src/App.tsx`:
- Search for `VIVIDHRA` in the footer section around line 2520.

### SEO Metadata & Tab Titles
The document title, Open Graph image, and meta tags are managed dynamically by `/src/components/ReactHelmet.tsx`. Update brand fallbacks inside `ReactHelmet.tsx` if you rename the brand.

---

## 4. Mapping Custom Data to Dynamic Display Components

The storefront dynamically binds product fields to standard components:

| Component | File Path | Bound Fields |
| :--- | :--- | :--- |
| **Product Detail Page** | `src/components/ProductDetailPage.tsx` | `name`, `price`, `originalPrice`, `images`, `rating`, `reviewCount`, `materials`, `care`, `description`, `slogan`, `sizes`, `colors`, `tags` |
| **Product Card** | `src/components/ProductCard.tsx` | `name`, `price`, `originalPrice`, `images`, `rating`, `reviewCount`, `isTrending` |
| **Admin Panel** | `src/components/AdminPanel.tsx` | Full `Product` interface for CRUD & AI parsing |
| **AI Stylist** | `src/components/AIStylist.tsx` | `Product` data passed to Gemini prompt for context-aware styling |
| **Silhouette Studio** | `src/components/AISilhouetteStudio.tsx` | `height`, `bodyType`, `styleVibe` mapped to fit insights |

When adding new custom properties to products, declare them in `/src/types.ts` under the `Product` interface:
```typescript
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  // Add your custom property here:
  customFabricGrade?: string;
}
```

---

## 5. Product Reviews Storage & AI Integration

### How Reviews Are Stored
Product reviews are stored in `/data/vividhra_db.json` inside the `reviews` array:
```json
{
  "id": "rev-1722000000",
  "productId": "prod-1",
  "authorName": "Priyal Sharma",
  "rating": 5,
  "title": "Immaculate fit & drape",
  "comment": "The bamboo linen texture feels incredibly soft and breathes well in summer.",
  "createdAt": "2026-08-01T10:00:00.000Z"
}
```

### Review API Endpoints (`/server.ts`)
- **Fetch Reviews**: `GET /api/products/:id/reviews`
- **Post Review**: `POST /api/products/:id/reviews`
  - When a review is posted, `server.ts` automatically recalculates the product's average rating and `reviewCount`, updating `db.products` and persisting to disk via `saveDB()`.

### AI Integration with Reviews
The server's AI Stylist route (`/api/stylist/chat`) accesses product descriptions and rating stats to recommend top-rated garments to customers during styling chats.

---

## 7. Managing & Customizing Search Images, Category Avatars & Product Visuals

If any image fails to load or if you want to replace category bubbles (e.g. "Dresses", "Footwear", "Tops", "Co-ords", "Outerwear"):

### A. Updating Search Overlay Category Avatars (`src/App.tsx`)
In `/src/App.tsx` around line 2208, locate the horizontal category bubbles list:
```tsx
{[
  { label: 'Dresses', image: 'https://images.unsplash.com/...', query: 'dresses' },
  { label: 'Footwear', image: 'https://images.unsplash.com/...', query: 'trousers' },
  { label: 'Tops', image: 'https://images.unsplash.com/...', query: 'tops' },
  { label: 'Co-ords', image: 'https://images.unsplash.com/...', query: 'co-ord' },
  { label: 'Outerwear', image: 'https://images.unsplash.com/...', query: 'blazers' }
]}
```
- Replace the `image` URL string with any hosted image URL or local asset path (e.g., `/assets/coords-category.jpg`).
- Automatic Fallback: All `<img />` elements feature an `onError` handler that automatically swaps in a high-resolution fallback image if an external URL becomes unreachable or broken.

### B. Updating Collection Drawer Images (`src/components/CollectionDrawer.tsx`)
The side collection navigation drawer uses category thumbnail images defined in `/src/components/CollectionDrawer.tsx` under `CATEGORIES`. Update the `image` property for any category item.

### C. Updating Garment Images
To change product photos:
1. Go to the **Admin Panel** (`/admin` view or click "Atelier (Admin)" in header).
2. Edit any product, click on the **Image URLs** field, and paste new image links or upload photos using the AI Scan Uploader.
3. Or update the `"images"` array inside `/data/vividhra_db.json`.

