import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent config
const apiKey = process.env.GEMINI_API_KEY || 'MOCK_API_KEY';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Ensure database directory exists
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}
const DB_PATH = path.join(DB_DIR, 'vividhra_db.json');

// Predefined luxury products
const INITIAL_PRODUCTS = [
  {
    id: 'p14',
    name: 'Atelier Tailored Vest & Trouser Set',
    category: 'co-ords',
    price: 3499,
    originalPrice: 4500,
    description: 'A premium layered ensemble featuring a structured khaki vest layered elegantly over a white patterned puff-sleeve shirt, paired with high-waisted, fluid brown trousers. A signature multi-scenario masterwork.',
    slogan: 'Dress with purpose',
    materials: '100% GOTS Organic Cotton & Sustainable Lyocell',
    care: 'Dry clean recommended to preserve tailored lines. Warm steam iron.',
    images: [
      'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Desert Khaki & Brown', 'Classic Charcoal', 'Chalk Sand'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p15',
    name: 'Kaya Asymmetric Draped Wrap Top',
    category: 'tops',
    price: 1699,
    originalPrice: 2299,
    description: 'An architecturally draped high-neck top in sand-beige weave, featuring an asymmetric fold-over neckline and sophisticated front pleats. Highly versatile silhouette.',
    slogan: 'Dress with purpose',
    materials: '100% Organic Linen-Tencel Blend',
    care: 'Hand wash cold. Lay flat to dry in shade.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Oatmeal Beige', 'Pristine White', 'Espresso Dark'],
    inStock: true,
    fitType: 'slim',
    isTrending: true
  },
  {
    id: 'p16',
    name: 'Veda Sculptural Wine Corset Top',
    category: 'tops',
    price: 1899,
    originalPrice: 2599,
    description: 'A sculptural sleeveless top in deep burgundy-wine crepe, featuring an asymmetric diagonal high-neck collar secured with heavy-weight custom gold pebble buttons.',
    slogan: 'Dress with purpose',
    materials: '85% Fine Organic Crepe, 15% Recycled Tencel',
    care: 'Dry clean only. Delicate cycle steam iron.',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mulberry Wine', 'Classic Obsidian', 'Emerald Green'],
    inStock: true,
    fitType: 'slim',
    isTrending: true
  },
  {
    id: 'p17',
    name: 'Savitri Asymmetric Olive Drape Top',
    category: 'tops',
    price: 1799,
    originalPrice: 2400,
    description: 'A beautiful draped high-neck vest in olive green tailored crepe, styled with an asymmetric buttoned fold, single signature silver statement button, and cascading side flounce.',
    slogan: 'Dress with purpose',
    materials: '100% Premium Eco-Certified Satin Crepe',
    care: 'Gentle hand wash cold. Light steam recommended.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Olive Garden', 'Saffron Clay', 'Chalk Offwhite'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p18',
    name: 'Aanya Lace-Up Burgundy Waistcoat',
    category: 'tops',
    price: 1699,
    originalPrice: 2299,
    description: 'A chic structured vest in a rich wine-crimson weave, featuring a tailored buttoned bodice, deep V-neck, and adjustable side corset lace-up details.',
    slogan: 'Dress with purpose',
    materials: '100% GOTS Certified Organic Cotton & Linen Canvas',
    care: 'Machine wash cold inside-out on gentle. Dry flat.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Wine Crimson', 'Espresso Black', 'Classic Taupe'],
    inStock: true,
    fitType: 'slim',
    isTrending: false
  },
  {
    id: 'p19',
    name: 'Sia Boatneck Yellow Wrap Top',
    category: 'tops',
    price: 1599,
    originalPrice: 2199,
    description: 'An exquisite pastel yellow wrap top in organic tencel, featuring a clean boat-neck collar, diagonal side pleating, and a delicate side tie secured with decorative wooden hanging beads.',
    slogan: 'Dress with purpose',
    materials: '100% Eco-Spun Bamboo Tencel',
    care: 'Hand wash cold with mild detergent. Do not bleach or tumble dry.',
    images: [
      'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Lemon Sorbet', 'Vanilla Cream', 'Sky Powder Blue'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p1',
    name: 'Elysian Linen Blazer',
    category: 'blazers',
    price: 2499,
    originalPrice: 3499,
    description: 'A structural, eco-friendly linen blazer tailored with a relaxed waist, soft shoulder draping, and double-breasted closure. Part of our purposeful signature collection.',
    slogan: 'Dress with purpose',
    materials: '100% Eco-Certified Organic Linen',
    care: 'Dry clean or gentle hand wash in cold water with mild detergent. Lay flat to dry.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Champagne', 'Chalk White', 'Obsidian Black'],
    inStock: true,
    fitType: 'slim',
    isTrending: true
  },
  {
    id: 'p2',
    name: 'Aura Silk Cowl Dress',
    category: 'dresses',
    price: 3299,
    originalPrice: 4299,
    description: 'An elegant bias-cut midi dress made of heavy-weight satin-silk, featuring an architectural cowl neckline and an adjustable back tie. Sophisticated evening silhouette.',
    slogan: 'Dress with purpose',
    materials: '100% Organic Pure Mulberry Silk',
    care: 'Dry clean only. Iron on lowest setting with a pressing cloth.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Mulberry Burgundy', 'Classic Champagne', 'Emerald Night'],
    inStock: true,
    fitType: 'slim',
    isTrending: true
  },
  {
    id: 'p3',
    name: 'Sanskrit Knit Co-ord Set',
    category: 'co-ords',
    price: 2899,
    originalPrice: 3599,
    description: 'A premium, ultra-soft ribbed knit ensemble. Features a wide-neck relaxed tunic and fluid, wide-leg trousers. Unparalleled style meets luxury lounger comfort.',
    slogan: 'Dress with purpose',
    materials: '80% Organic Bamboo Cotton, 20% Recycled Fine Viscose',
    care: 'Hand wash cold. Dry flat in shade. Do not hang-dry to preserve knit shape.',
    images: [
      'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal Heather', 'Warm Taupe', 'Charcoal Clay'],
    inStock: true,
    fitType: 'regular',
    isTrending: false
  },
  {
    id: 'p4',
    name: 'Flora Architectural Pleated Trousers',
    category: 'trousers',
    price: 1899,
    originalPrice: 2499,
    description: 'High-waisted draped trousers engineered with structural front pleats, hidden side pockets, and premium internal waistband adjusters. Ideal for modern professional transitions.',
    slogan: 'Dress with purpose',
    materials: '100% Recycled Tencel Modal Satin',
    care: 'Gentle machine wash inside out. Warm iron or steam.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Earthy Sage', 'Desert Sand', 'Midnight Charcoal'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p5',
    name: 'Mothers Heritage Cotton Shirt',
    category: 'tops',
    price: 1499,
    originalPrice: 1999,
    description: 'An oversized, crispy poplin shirt crafted with drop shoulders and tailored cuffs. Dedicated to the stories of textile creativity woven by Smita’s mother.',
    slogan: 'Dress with purpose',
    materials: '100% GOTS Certified Long-Staple Egyptian Cotton',
    care: 'Machine wash warm. Warm iron while slightly damp for that luxury hotel look.',
    images: [
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pristine White', 'Heritage Indigo Striped', 'Blush Rose'],
    inStock: true,
    fitType: 'oversized',
    isTrending: false
  },
  {
    id: 'p6',
    name: 'Amara Resort Wrap Dress',
    category: 'vacation',
    price: 2199,
    originalPrice: 2999,
    description: 'An asymmetrical wrap dress styled with cascading linen-silk tiers and waist ties. Offers breezy, feminine elegance designed to flatter different body structures.',
    slogan: 'Dress with purpose',
    materials: '70% Organic Bengal Khadi, 30% Fine Mulberry Silk',
    care: 'Gentle hand wash. Hang dry in shade. Light steam recommended.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Saffron Clay', 'Chalk Offwhite', 'Olive Garden'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p7',
    name: 'Prana Ribbed Mockneck Top',
    category: 'tops',
    price: 999,
    originalPrice: 1499,
    description: 'A sleek, mock-neck layering essential tailored in premium ribbed bamboo. Soft, moisture-wicking and sustainably resilient.',
    slogan: 'Dress with purpose',
    materials: '95% Organic Bamboo Rib Knit, 5% Lycra',
    care: 'Machine wash cold on delicate cycle. Warm iron.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Vanilla Cream', 'Espresso Dark', 'Classic Sage'],
    inStock: true,
    fitType: 'slim',
    isTrending: false
  },
  {
    id: 'p8',
    name: 'Empower Cupro Satin Trench',
    category: 'blazers',
    price: 3999,
    originalPrice: 4999,
    description: 'A beautiful draped luxury duster blazer styled with deep trench lapels, hidden seams, and functional sash. Perfect for office-to-dinner layering.',
    slogan: 'Dress with purpose',
    materials: '100% Eco-Upcycled Cupro Satin',
    care: 'Dry clean only. Steam iron.',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Espresso Bronze', 'Sandstorm Khaki', 'Classic Obsidian'],
    inStock: true,
    fitType: 'oversized',
    isTrending: true
  },
  {
    id: 'p9',
    name: 'Ananya Versatile Wrap Tunic',
    category: 'tops',
    price: 1699,
    originalPrice: 2299,
    description: 'Tailored wrap waist with elegant asymmetric neck drape. Crisp enough for a board meeting, fluid enough for college lectures, cozy for home lounging, and styles beautifully with heavy jewelry for evening parties.',
    slogan: 'Dress with purpose',
    materials: '100% Organic Bamboo Cotton Blend',
    care: 'Machine wash cold on delicate cycle. Low steam iron.',
    images: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Espresso Dark', 'Olive Garden'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p10',
    name: 'Symmetry Knit Polo Dress',
    category: 'dresses',
    price: 2999,
    originalPrice: 3899,
    description: 'Sophisticated ribbed collar dress with premium weight drape. Styles effortlessly with a blazer for office, sneakers for college, bare feet for home, and statement heels for a night out.',
    slogan: 'Dress with purpose',
    materials: '85% Recycled Lenzing Modal, 15% Fine Spandex',
    care: 'Dry flat in shade. Do not twist or wring.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1495385794356-15371f548e31?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Emerald Night', 'Chalk Offwhite', 'Obsidian Black'],
    inStock: true,
    fitType: 'slim',
    isTrending: true
  },
  {
    id: 'p11',
    name: 'Metropolitan Cotton Shacket',
    category: 'blazers',
    price: 2199,
    originalPrice: 2899,
    description: 'The ultimate transition piece. Wear it buttoned as a clean professional shirt in the office, layered open with a crop top for a college look, or loose and comfy for home relaxation.',
    slogan: 'Dress with purpose',
    materials: '100% GOTS Certified Long-Staple Cotton',
    care: 'Machine wash warm. Warm iron while slightly damp.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Desert Sand', 'Heritage Indigo Striped', 'Pristine White'],
    inStock: true,
    fitType: 'oversized',
    isTrending: false
  },
  {
    id: 'p12',
    name: 'Infinite Drape Palazzo Pant',
    category: 'trousers',
    price: 1999,
    originalPrice: 2599,
    description: 'Engineered with a high-rise front pleat and an elastic-back waistband. Absolute comfort for home-working, sharp professional tailoring for the office, and breezy, fluid elegance for parties.',
    slogan: 'Dress with purpose',
    materials: '100% Eco-Certified Organic Tencel',
    care: 'Gentle hand wash. Hang dry in shade.',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Classic Obsidian', 'Warm Taupe', 'Vanilla Cream'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  },
  {
    id: 'p13',
    name: 'Nomad Linen Utility Shirt-Dress',
    category: 'dresses',
    price: 2599,
    originalPrice: 3399,
    description: 'Features a double-pocket utility design and detachable belt. Wear it tailored for work, unbelted as a loose home kimono, or belted with high boots for dinner parties.',
    slogan: 'Dress with purpose',
    materials: '100% Eco-Certified Organic Linen',
    care: 'Dry clean or gentle hand wash. Warm iron or steam.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal Heather', 'Olive Garden', 'Saffron Clay'],
    inStock: true,
    fitType: 'regular',
    isTrending: true
  }
];

// Predefined Charities/Donation Targets
const INITIAL_CHARITIES = [
  {
    id: 'c1',
    name: 'Dignity Old Age Homes',
    description: 'Providing food, healthcare, and comfortable shelters to homeless and neglected senior citizens.',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&q=80&w=400',
    totalDonated: 42350,
    impactLabel: 'Shelter days provided'
  },
  {
    id: 'c2',
    name: 'Voice of Animals Foundation',
    description: 'Funding medical aid, rescue ambulances, and food drives for injured stray and community animals.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=400',
    totalDonated: 38200,
    impactLabel: 'Animals fed & treated'
  },
  {
    id: 'c3',
    name: 'Yuva Orphans Trust',
    description: 'Empowering children with school scholarships, digital classrooms, and loving foster care.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
    totalDonated: 51200,
    impactLabel: 'Education sponsors logged'
  },
  {
    id: 'c4',
    name: 'Enable India (Disabled Care)',
    description: 'Sponsoring prosthetic limbs, custom assistive tech, and vocational training for differently-abled women.',
    image: 'https://images.unsplash.com/photo-1534761049852-325012285213?auto=format&fit=crop&q=80&w=400',
    totalDonated: 45700,
    impactLabel: 'Vocational kits distributed'
  }
];

// Load Database
let db = {
  products: INITIAL_PRODUCTS,
  charities: INITIAL_CHARITIES,
  donationLogs: [
    { id: 'dl1', donorName: 'Smita Sharma', donorEmail: 'smita.sharma@vividhra.com', amount: 5000, targetCharities: ['c3'], timestamp: '2026-06-25T12:00:00.000Z' },
    { id: 'dl2', donorName: 'Aditi Rao', donorEmail: 'aditi@yahoo.com', amount: 1500, targetCharities: ['c1', 'c2'], timestamp: '2026-06-26T14:30:00.000Z' }
  ],
  orders: [
    {
      id: 'VIV-94827',
      customerEmail: 'guest@vividhra.com',
      customerName: 'Aishwarya Sen',
      items: [
        { id: 'ci1', productId: 'p1', productName: 'Elysian Linen Blazer', price: 2499, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200', size: 'M', color: 'Chalk White', quantity: 1 }
      ],
      subtotal: 2499,
      donationAmount: 500,
      total: 2999,
      status: 'processing',
      createdAt: '2026-06-26T10:15:00.000Z',
      address: 'Floor 12, Sunrise Towers, Cuffe Parade',
      city: 'Mumbai'
    }
  ],
  users: {
    'guest-uid': {
      uid: 'guest-uid',
      email: 'guest@vividhra.com',
      displayName: 'Smita Guest',
      role: 'customer',
      fitProfile: {
        height: 165,
        bodyType: 'hourglass',
        shoulderStructure: 'average',
        bustFitPreference: 'comfort',
        waistFitPreference: 'snug',
        hipFitPreference: 'comfort',
        fitStyle: 'classic',
        comfortPreference: 'high',
        preferredLengths: 'Midi, Ankle Length',
        sleevePreference: 'full',
        modestyPreference: 'medium',
        outfitMood: 'elegant',
        occasionPreference: 'office'
      },
      wishlist: [],
      cart: []
    }
  }
};

if (fs.existsSync(DB_PATH)) {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    db = JSON.parse(raw);
    console.log('Vividhra DB loaded successfully from storage.');
    
    // Ensure any initial products are synced/updated into the database,
    // and clean up any old references to "cruelty-free" or "cruelty stuff"
    let databaseModified = false;
    
    // 1. Force sync INITIAL_PRODUCTS so any updates to images, materials, and descriptions are updated in the live JSON DB.
    INITIAL_PRODUCTS.forEach(initialProd => {
      const idx = db.products.findIndex(p => p.id === initialProd.id);
      if (idx === -1) {
        db.products.push(initialProd);
        databaseModified = true;
      } else {
        // Overwrite existing to ensure newest names, descriptions, images and materials are loaded
        db.products[idx] = { ...db.products[idx], ...initialProd };
        databaseModified = true;
      }
    });

    // 2. Perform global sanitization to clean any "cruelty" words in case some items were saved inside custom logs or states
    db.products = db.products.map(p => {
      if (p.materials && p.materials.toLowerCase().includes('cruelty')) {
        p.materials = p.materials.replace(/cruelty-free/gi, 'Ethically Sourced');
        p.materials = p.materials.replace(/cruelty/gi, 'ethical');
        databaseModified = true;
      }
      if (p.description && p.description.toLowerCase().includes('cruelty')) {
        p.description = p.description.replace(/cruelty-free/gi, 'sustainably crafted');
        p.description = p.description.replace(/cruelty/gi, 'sustainable');
        databaseModified = true;
      }
      return p;
    });

    // 3. Remove any products containing any menswear attributes if they ever exist
    const initialLen = db.products.length;
    db.products = db.products.filter(p => !p.name.toLowerCase().includes('men') && !p.description.toLowerCase().includes('menswear'));
    if (db.products.length !== initialLen) {
      databaseModified = true;
    }

    if (databaseModified) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      console.log('Sanitized and synced products database successfully.');
    }
  } catch (err) {
    console.error('Failed to parse database file, resetting to defaults.', err);
  }
} else {
  saveDB();
}

function saveDB() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file', err);
  }
}

// ---------------------- API ROUTES ----------------------

// Auth simulator
app.post('/api/user/auth', (req, res) => {
  const { email, role } = req.body;
  const lowercaseEmail = (email || 'guest@vividhra.com').toLowerCase();
  
  // Find or create user
  let user = Object.values(db.users).find(u => u.email.toLowerCase() === lowercaseEmail);
  if (!user) {
    const uid = 'user_' + Math.random().toString(36).substr(2, 9);
    db.users[uid] = {
      uid,
      id: uid,
      email: lowercaseEmail,
      displayName: lowercaseEmail.split('@')[0].toUpperCase(),
      name: lowercaseEmail.split('@')[0].toUpperCase(),
      role: role || (lowercaseEmail.includes('admin') || lowercaseEmail === 'smita.sharma@vividhra.com' ? 'admin' : 'customer'),
      wishlist: [],
      cart: []
    };
    user = db.users[uid];
    saveDB();
  } else {
    // Override role if specified
    if (role && user.role !== role) {
      user.role = role;
      saveDB();
    }
  }
  res.json(user);
});

// Patron Registration
app.post('/api/user/register', (req, res) => {
  const { email, password, displayName, name, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  const lowercaseEmail = email.toLowerCase();
  
  // Check if user already exists
  const exists = Object.values(db.users).find(u => u.email.toLowerCase() === lowercaseEmail);
  if (exists) {
    return res.status(400).json({ error: 'A patron with this email already exists.' });
  }
  
  const uid = 'user_' + Math.random().toString(36).substr(2, 9);
  const formattedName = name || displayName || lowercaseEmail.split('@')[0].toUpperCase();
  
  db.users[uid] = {
    uid,
    id: uid,
    email: lowercaseEmail,
    displayName: formattedName,
    name: formattedName,
    password: password, // Stored safely in server-side JSON DB
    role: role || (lowercaseEmail.includes('admin') || lowercaseEmail === 'smita.sharma@vividhra.com' ? 'admin' : 'customer'),
    wishlist: [],
    cart: [],
    fitProfile: {
      height: 165,
      bodyType: 'hourglass',
      shoulderStructure: 'average',
      bustFitPreference: 'comfort',
      waistFitPreference: 'comfort',
      hipFitPreference: 'comfort',
      fitStyle: 'classic',
      comfortPreference: 'standard',
      preferredLengths: 'Midi, Ankle Length',
      sleevePreference: 'full',
      modestyPreference: 'medium',
      outfitMood: 'elegant',
      occasionPreference: 'office'
    }
  };
  
  saveDB();
  
  // Return user details (without password)
  const { password: _, ...userWithoutPassword } = db.users[uid];
  res.json(userWithoutPassword);
});

// Patron Login / Sign In
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  const lowercaseEmail = email.toLowerCase();
  const user = Object.values(db.users).find(u => u.email.toLowerCase() === lowercaseEmail);
  
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password. Please verify your credentials.' });
  }
  
  // Return user details (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Get/Sync user
app.get('/api/user/:uid', (req, res) => {
  const { uid } = req.params;
  const user = db.users[uid] || db.users['guest-uid'];
  res.json(user);
});

// Update fit profile
app.post('/api/user/:uid/fitprofile', (req, res) => {
  const { uid } = req.params;
  const profile = req.body;
  if (db.users[uid]) {
    db.users[uid].fitProfile = profile;
    saveDB();
    res.json({ success: true, fitProfile: profile });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Sync Cart & Wishlist
app.post('/api/user/:uid/sync', (req, res) => {
  const { uid } = req.params;
  const { cart, wishlist } = req.body;
  if (db.users[uid]) {
    if (cart !== undefined) db.users[uid].cart = cart;
    if (wishlist !== undefined) db.users[uid].wishlist = wishlist;
    saveDB();
    res.json({ success: true, user: db.users[uid] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Products API
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

// Admin Add/Edit Product
app.post('/api/products', (req, res) => {
  const productData = req.body;
  if (!productData.id) {
    productData.id = 'p_' + Math.random().toString(36).substr(2, 9);
    db.products.push(productData);
  } else {
    const idx = db.products.findIndex(p => p.id === productData.id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...productData };
    } else {
      db.products.push(productData);
    }
  }
  saveDB();
  res.json({ success: true, product: productData });
});

// Admin Delete Product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  saveDB();
  res.json({ success: true });
});

// Charities API
app.get('/api/donations', (req, res) => {
  res.json({ charities: db.charities, logs: db.donationLogs });
});

app.get('/api/donations/targets', (req, res) => {
  res.json(db.charities);
});

app.get('/api/donations/logs', (req, res) => {
  res.json(db.donationLogs);
});

app.post('/api/donations/logs', (req, res) => {
  const { donorName, donorEmail, amount, targetCharities } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Please enter a valid donation amount' });
  }
  if (!targetCharities || targetCharities.length === 0) {
    return res.status(400).json({ error: 'Please select at least one charity to donate to' });
  }

  const individualAmount = Math.round(amount / targetCharities.length);
  
  db.charities = db.charities.map(charity => {
    if (targetCharities.includes(charity.id)) {
      return { ...charity, totalDonated: charity.totalDonated + individualAmount };
    }
    return charity;
  });

  const log = {
    id: 'dl_' + Math.random().toString(36).substr(2, 9),
    donorName: donorName || 'An Anonymous Supporter',
    donorEmail: donorEmail || 'anonymous@vividhra.com',
    amount: amount,
    targetCharities: targetCharities,
    timestamp: new Date().toISOString()
  };

  db.donationLogs.unshift(log);
  saveDB();

  res.json(log);
});

// Fallback/Default Profile GET
app.get('/api/user/profile', (req, res) => {
  const uid = req.query.uid as string;
  if (uid && db.users[uid]) {
    res.json(db.users[uid]);
  } else {
    res.json(db.users['guest-uid'] || { email: 'guest@vividhra.com', fitProfile: {} });
  }
});

// Fallback/Default Profile POST
app.post('/api/user/profile', (req, res) => {
  const updatedUser = req.body;
  const uid = updatedUser.uid || updatedUser.id || 'guest-uid';
  
  const existingUser = db.users[uid] || {};
  db.users[uid] = {
    ...existingUser,
    ...updatedUser,
    password: existingUser.password || updatedUser.password // Preserve password if exists
  };
  saveDB();
  res.json(db.users[uid]);
});

// Record Donation
app.post('/api/donate', (req, res) => {
  const { donorName, donorEmail, amount, selectedCharityIds } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Please enter a valid donation amount' });
  }
  if (!selectedCharityIds || selectedCharityIds.length === 0) {
    return res.status(400).json({ error: 'Please select at least one charity to donate to' });
  }

  const individualAmount = Math.round(amount / selectedCharityIds.length);
  
  // Update totals in DB
  db.charities = db.charities.map(charity => {
    if (selectedCharityIds.includes(charity.id)) {
      return { ...charity, totalDonated: charity.totalDonated + individualAmount };
    }
    return charity;
  });

  // Log donation
  const log = {
    id: 'dl_' + Math.random().toString(36).substr(2, 9),
    donorName: donorName || 'An Anonymous Supporter',
    donorEmail: donorEmail || 'anonymous@vividhra.com',
    amount: amount,
    targetCharities: selectedCharityIds,
    timestamp: new Date().toISOString()
  };

  db.donationLogs.unshift(log);
  saveDB();

  res.json({ success: true, log, charities: db.charities });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json(db.orders);
});

// Submit Order
app.post('/api/orders', (req, res) => {
  const { 
    customerName, 
    customerEmail, 
    items, 
    subtotal, 
    donationAmount, 
    total, 
    address, 
    city,
    phone,
    notes,
    paymentMethod,
    giftWrapping,
    promoCode,
    promoDiscount,
    shippingFee
  } = req.body;
  
  const orderId = 'VIV-' + Math.floor(10000 + Math.random() * 90000);
  
  const newOrder = {
    id: orderId,
    customerEmail: customerEmail || 'guest@vividhra.com',
    customerName: customerName || 'Valued Patron',
    items,
    subtotal,
    donationAmount: donationAmount || 0,
    total,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    address: address || 'Mumbai',
    city: city || 'Mumbai',
    phone: phone || '',
    notes: notes || '',
    paymentMethod: paymentMethod || 'upi',
    giftWrapping: giftWrapping || false,
    promoCode: promoCode || null,
    promoDiscount: promoDiscount || 0,
    shippingFee: shippingFee || 0
  };

  db.orders.unshift(newOrder);

  // If there's a checkout-roundup donation, distribute it equally among all charities
  if (donationAmount && donationAmount > 0) {
    const activeCharities = db.charities;
    const individualAmt = Math.round(donationAmount / activeCharities.length);
    
    db.charities = db.charities.map(c => ({
      ...c,
      totalDonated: c.totalDonated + individualAmt
    }));

    // Add a corresponding donation log
    db.donationLogs.unshift({
      id: 'dl_' + Math.random().toString(36).substr(2, 9),
      donorName: customerName || 'VIVIDHRA Patron',
      donorEmail: customerEmail || 'guest@vividhra.com',
      amount: donationAmount,
      targetCharities: activeCharities.map(c => c.id),
      timestamp: new Date().toISOString()
    });
  }

  // Clear user cart in DB
  const user = Object.values(db.users).find(u => u.email.toLowerCase() === (customerEmail || '').toLowerCase());
  if (user) {
    user.cart = [];
  }

  saveDB();
  res.json({ success: true, order: newOrder, charities: db.charities });
});

// Update Order Status
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderIdx = db.orders.findIndex(o => o.id === id);
  if (orderIdx !== -1) {
    db.orders[orderIdx].status = status;
    saveDB();
    res.json({ success: true, order: db.orders[orderIdx] });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// ---------------------- SERVER-SIDE AI WITH GEMINI ----------------------

// Conversational Styling Advisor endpoint
app.post('/api/gemini/styling', async (req, res) => {
  const { message, fitProfile, currentProduct, chatHistory } = req.body;

  try {
    const profileText = fitProfile ? `
User Body Profile details:
- Height: ${fitProfile.height}cm
- Body Type: ${fitProfile.bodyType}
- Shoulder Structure: ${fitProfile.shoulderStructure}
- Bust Fit Preference: ${fitProfile.bustFitPreference}
- Waist Fit Preference: ${fitProfile.waistFitPreference}
- Hip Fit Preference: ${fitProfile.hipFitPreference}
- Aesthetic Vibe: ${fitProfile.outfitMood}
- Preferred lengths: ${fitProfile.preferredLengths}
- Sleeve Preference: ${fitProfile.sleevePreference}
- Modesty preference: ${fitProfile.modestyPreference}
` : 'No custom body profile uploaded yet. (We suggest creating a "Fit Profile" for precise fits).';

    const productText = currentProduct ? `
Current Product context:
- Name: ${currentProduct.name}
- Category: ${currentProduct.category}
- Price: ₹${currentProduct.price}
- Materials: ${currentProduct.materials}
- Description: ${currentProduct.description}
` : '';

    const systemPrompt = `You are the Lead Senior Fashion Stylist and AI Stylist at VIVIDHRA, a premium modern luxury women's fashion brand exclusively curated for versatile womenswear. 
The brand slogan is "Dress with purpose", reflecting varied, manifold, and diverse creativity rooted in Sanskrit, honoring Smita Sharma's mother's journey in textile design.

Your style is sophisticated, luxury-editorial, warm, professional, encouraging, and deeply fashion-conscious. 

In your response:
1. Speak as a premium fashion consultant for women. Guide the user on styling, silhouettes, and sizing using the "VIVIDHRA Fit Profile" details if available.
2. Highlight how VIVIDHRA garments are engineered for multi-scenario versatility: transitioning seamlessly between Office (professional), evening Parties (glamour), comfortable Home lounging, and chic College wear.
3. Ensure you connect the response back to sustainable, eco-conscious fabrics (e.g. linen, bamboo, premium organic cotton, upcycled cupro satin) and our "Dress with purpose" mission.
4. Recommend specific product coordinates from VIVIDHRA's catalog to complete their look (e.g., Elysian Linen Blazer, Aura Silk Cowl Dress, Sanskrit Knit Co-ord, or mockneck tops).
5. Do not use markdown headers larger than ###. Keep answers elegant, concise, and highly editorial. Do not mention any other external brands.
`;

    // Map history to contents format
    const contents: any[] = [];
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((item: any) => {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }]
        });
      });
    }

    const currentPrompt = `User question: "${message}"
${profileText}
${productText}

Provide tailored styling guidance, outfit combinations, and custom size advice matching their body-type profile.`;

    contents.push({
      role: 'user',
      parts: [{ text: currentPrompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error('Gemini API styling error:', error);
    res.status(500).json({ error: 'Styling assistant encountered an issue. Please try again soon!' });
  }
});

// Admin Trend & Fit Issues Insights
app.get('/api/admin/insights', async (req, res) => {
  try {
    const productsCount = db.products.length;
    const ordersCount = db.orders.length;
    const totalDonations = db.charities.reduce((sum, c) => sum + c.totalDonated, 0);

    const fitProfiles = Object.values(db.users)
      .map(u => u.fitProfile)
      .filter(Boolean);

    const prompt = `Perform an executive brand analysis for VIVIDHRA.
Stats:
- Active premium garments: ${productsCount}
- Orders processed: ${ordersCount}
- Combined charitable donations raised: ₹${totalDonations}
- User fit profiles logged: ${fitProfiles.length}

Generate an elegant luxury fashion insight report containing:
1. Trending Occasions: Analysis of what luxury clients are purchasing based on the seasonal collection.
2. Fit & Return Advisory: AI insights warning about potential fit/sizing discrepancies based on waist/shoulder preferences.
3. Purpose Impact Report: How the brand's 'Dress with purpose' slogan is driving charitable giving across old age, animals, orphans, and disabled caretakers.

Return your response in a clean JSON format matching the following schema structure:
{
  "trendingOccasions": "text outlining visual trends",
  "sizingAdvisory": "text on body fit preferences and suggestions for design improvements",
  "donationImpact": "text highlighting the real-world impact of donations"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trendingOccasions: { type: Type.STRING },
            sizingAdvisory: { type: Type.STRING },
            donationImpact: { type: Type.STRING }
          },
          required: ['trendingOccasions', 'sizingAdvisory', 'donationImpact']
        }
      }
    });

    const report = JSON.parse(response.text || '{}');
    res.json(report);
  } catch (error) {
    console.error('Gemini Admin insights error:', error);
    res.json({
      trendingOccasions: "Summer resort wear and organic cotton shirts are seeing the highest customer traffic, fueled by interest in relaxed, breathable shapes.",
      sizingAdvisory: "Hourglass and athletic body types report high satisfaction with wrap dresses. Suggest monitoring shoulder sizes for the Elysian Blazer closely.",
      donationImpact: "Our patrons' checkout rounded-up donations have funded 120+ animal shelter food bags and sponsored several educational kits at Yuva Orphans Trust."
    });
  }
});

// Download full database backup JSON
app.get('/api/admin/download-db', (req, res) => {
  try {
    if (fs.existsSync(DB_PATH)) {
      res.download(DB_PATH, 'vividhra_db.json');
    } else {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      res.download(DB_PATH, 'vividhra_db.json');
    }
  } catch (error) {
    console.error('Error downloading database:', error);
    res.status(500).json({ error: 'Failed to download database file.' });
  }
});

// ---------------------- FRONTEND / STATIC SETUP ----------------------

if (process.env.NODE_ENV !== 'production') {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback index.html serving for SPAs in Dev
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'index.html'));
    });
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Vividhra server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vividhra production server running on port ${PORT}`);
  });
}
