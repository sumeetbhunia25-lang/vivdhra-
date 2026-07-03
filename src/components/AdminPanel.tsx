import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, PieChart, TrendingUp, AlertTriangle, Sparkles, Plus, Edit2, Trash2, Check, RefreshCw, Download } from 'lucide-react';
import { Product, Order, DonationTarget } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  charities: DonationTarget[];
  onAddProduct: (product: Product) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<any>;
}

export default function AdminPanel({
  products,
  orders,
  charities,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'insights'>('insights');
  
  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [crudError, setCrudError] = useState('');
  const [crudSuccess, setCrudSuccess] = useState('');

  // AI upload & scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState('');

  const handleImageUploadAndAnalyze = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanMessage('Uploading and scanning garment details via VIVIDHRA AI...');
    setCrudError('');
    setCrudSuccess('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      setUploadedImagePreview(base64String);

      try {
        const response = await fetch('/api/products/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64String,
            mimeType: file.type,
            filename: file.name
          })
        });

        const data = await response.json();
        if (data.success && data.recognized) {
          const rec = data.recognized;
          
          setEditingProduct({
            id: editingProduct?.id || '',
            name: rec.name || '',
            category: (rec.category as any) || 'tops',
            subcategory: rec.subcategory || '',
            price: rec.price || 1899,
            originalPrice: rec.originalPrice || Math.round(rec.price * 1.35),
            description: rec.description || '',
            materials: rec.materials || '',
            care: rec.care || '',
            images: [data.imageUrl || rec.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'],
            sizes: rec.sizes || ['XS', 'S', 'M', 'L', 'XL'],
            colors: rec.colors || ['Warm Charcoal'],
            inStock: true,
            fitType: rec.fitType || 'regular',
            isTrending: true,
            tags: rec.tags || []
          });

          setCrudSuccess(`AI recognized "${rec.name}"! Form autocompleted. Review and edit details below.`);
        } else {
          setCrudError('AI was unable to extract details. Please enter details manually.');
        }
      } catch (err) {
        console.error('Image analyze error:', err);
        setCrudError('Network error during AI scan. Fell back to manual entry.');
      } finally {
        setIsScanning(false);
        setScanMessage('');
      }
    };

    reader.onerror = () => {
      setCrudError('Failed to read selected image file.');
      setIsScanning(false);
    };

    reader.readAsDataURL(file);
  };


  // AI Insights state
  const [aiInsights, setAiInsights] = useState<{
    trendingOccasions: string;
    sizingAdvisory: string;
    donationImpact: string;
  } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/admin/insights');
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'insights' && !aiInsights) {
      fetchInsights();
    }
  }, [activeTab]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudError('');
    setCrudSuccess('');

    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      setCrudError('Please fill in Name, Price, and Category.');
      return;
    }

    try {
      const payload: any = {
        id: editingProduct.id || '',
        name: editingProduct.name,
        category: editingProduct.category as any,
        subcategory: editingProduct.subcategory || '',
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        description: editingProduct.description || 'Premium VIVIDHRA luxury garment designed with purpose.',
        slogan: 'Dress with purpose',
        materials: editingProduct.materials || '100% Eco-conscious organic weave',
        care: editingProduct.care || 'Gentle wash in cold water',
        images: editingProduct.images && editingProduct.images.length > 0 
          ? editingProduct.images 
          : [
              'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
            ],
        sizes: editingProduct.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        colors: typeof editingProduct.colors === 'string' 
          ? (editingProduct.colors as string).split(',').map((c: string) => c.trim()) 
          : editingProduct.colors || ['Pristine White'],
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        fitType: (editingProduct.fitType as any) || 'regular',
        isTrending: editingProduct.isTrending !== false,
        tags: typeof editingProduct.tags === 'string'
          ? (editingProduct.tags as string).split(',').map((t: string) => t.trim())
          : editingProduct.tags || []
      };

      await onAddProduct(payload);
      setCrudSuccess(editingProduct.id ? 'Product updated successfully.' : 'Product created successfully.');
      setEditingProduct(null);
    } catch (err) {
      setCrudError('Failed to save product. Please check input formats.');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDonationsCombined = charities.reduce((sum, c) => sum + c.totalDonated, 0);

  return (
    <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      
      {/* Visual Workspace Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[#e7e5e4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#0f766e] font-semibold bg-[#0f766e]/10 px-3 py-1 rounded-full">
            MANAGEMENT WORKSPACE
          </span>
          <h1 className="serif-header text-2xl md:text-4xl font-bold tracking-tight text-[#1c1917] mt-3">
            VIVIDHRA Atelier Control Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#78716c] font-light mt-1">
            Overview of product listings, customer orders, and AI predictive insights based on body profiles.
          </p>
        </div>

        {/* Tab Switchers & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex bg-[#f5f5f4] p-1 rounded-xl border border-[#e7e5e4] flex-1 md:flex-initial justify-between gap-1">
            {[
              { id: 'insights', label: 'AI Insights', icon: PieChart },
              { id: 'products', label: 'Garment CRUD', icon: Package },
              { id: 'orders', label: 'Order Tracking', icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-outfit font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-[#1c1917] shadow-xs font-bold'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <a
            href="/api/admin/download-db"
            download="vividhra_db.json"
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white rounded-xl text-xs font-mono tracking-tight transition-all shadow-xs cursor-pointer"
            title="Download database copy"
          >
            <Download className="w-3.5 h-3.5 text-[#c2a46c]" />
            <span>Backup DB JSON</span>
          </a>
        </div>
      </div>

      {/* Dynamic Tab Views */}

      {/* TAB 1: AI INSIGHTS & ANALYTICS */}
      {activeTab === 'insights' && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Quick Metrics Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-[#e7e5e4]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Combined Revenue</span>
              <p className="font-serif text-2xl font-bold text-[#1c1917] mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-600 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Direct atelier ledger</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e7e5e4]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Combined Charity Raised</span>
              <p className="font-serif text-2xl font-bold text-emerald-600 mt-1">₹{totalDonationsCombined.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-[#78716c] font-light">Dress with purpose</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e7e5e4]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Active Catalogue</span>
              <p className="font-serif text-2xl font-bold text-[#1c1917] mt-1">{products.length} Designs</p>
              <span className="text-[10px] text-[#78716c] font-light">Refined luxury neutrals</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e7e5e4]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Completed Orders</span>
              <p className="font-serif text-2xl font-bold text-[#1c1917] mt-1">{orders.length} Logged</p>
              <span className="text-[10px] text-stone-500 font-mono">Status: 100% Secure</span>
            </div>
          </div>

          {/* Charity Pools Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#e7e5e4]">
            <h3 className="serif-header text-lg font-bold text-[#1c1917] mb-6">
              Charitable Fundraising Pools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {charities.map((c) => (
                <div key={c.id} className="p-4 bg-[#f5f5f4]/50 border border-[#e7e5e4] rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#1c1917] truncate">{c.name}</h4>
                    <p className="text-[11px] text-[#78716c] mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>
                  <div className="pt-4 border-t border-[#e7e5e4] mt-4 flex items-end justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#a8a29e]">Pool Total</span>
                    <span className="font-mono text-sm font-bold text-[#1c1917]">₹{c.totalDonated.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini Compiled Reports */}
          <div className="bg-gradient-to-br from-[#fafaf9] to-[#fafaf9] border border-[#e7e5e4] p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c2a46c]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#c2a46c]/10 text-[#c2a46c] rounded-full">
                  <Sparkles className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="serif-header text-lg font-bold text-[#1c1917]">
                    Atelier Predictive Sizing & Trend Audits
                  </h3>
                  <p className="text-[10px] font-mono uppercase text-[#78716c]">
                    Compiled via Gemini 3.5 Flash
                  </p>
                </div>
              </div>

              <button
                onClick={fetchInsights}
                disabled={loadingInsights}
                className="p-2 text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] rounded-full transition-all cursor-pointer disabled:opacity-50"
                title="Regenerate Report"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingInsights ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#c2a46c] animate-spin" />
                <span className="text-xs text-[#78716c] font-mono">Assembling inventory, fit coordinates, and donor logs...</span>
              </div>
            ) : aiInsights ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-mono font-medium">
                    1. Trending Occasions
                  </span>
                  <p className="text-xs text-[#57534e] font-light leading-relaxed whitespace-pre-line pt-2">
                    {aiInsights.trendingOccasions}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#e7e5e4] pt-6 md:pt-0 md:pl-8">
                  <span className="text-[10px] uppercase tracking-wider text-[#0f766e] bg-[#0f766e]/5 px-2.5 py-1 rounded-full font-mono font-medium">
                    2. Fit & Design Advisories
                  </span>
                  <p className="text-xs text-[#57534e] font-light leading-relaxed whitespace-pre-line pt-2">
                    {aiInsights.sizingAdvisory}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#e7e5e4] pt-6 md:pt-0 md:pl-8">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-mono font-medium">
                    3. Purpose Slogan Impact
                  </span>
                  <p className="text-xs text-[#57534e] font-light leading-relaxed whitespace-pre-line pt-2">
                    {aiInsights.donationImpact}
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-10">
                <button
                  onClick={fetchInsights}
                  className="px-5 py-2 bg-[#1c1917] text-white text-xs uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Generate AI Atelier Audit
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: GARMENT CRUD MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Form panel: Add/Edit */}
          <div className="lg:col-span-5 bg-white border border-[#e7e5e4] p-5 md:p-6 rounded-2xl shadow-xs">
            <h3 className="serif-header text-base md:text-lg font-bold text-[#1c1917] mb-5 pb-3 border-b border-[#f5f5f4] flex items-center justify-between">
              <span>{editingProduct?.id ? 'Edit Garment Details' : 'Design New Garment'}</span>
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-[10px] uppercase tracking-widest text-[#78716c] hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </h3>

            {crudError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg">
                {crudError}
              </div>
            )}
            {crudSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg">
                {crudSuccess}
              </div>
            )}

            {/* AI Image Scan & Autocomplete upload component */}
            <div className="mb-6 p-5 bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-center relative overflow-hidden transition-all hover:bg-stone-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUploadAndAnalyze}
                disabled={isScanning}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                {editingProduct?.images?.[0] ? (
                  <div className="relative w-20 h-24 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-2xs">
                    <img
                      src={editingProduct.images[0]}
                      alt="Uploaded product preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-[8px] uppercase tracking-wider text-white font-bold">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#c2a46c]/10 text-[#c2a46c] rounded-full">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-semibold text-stone-900">
                    {editingProduct?.images?.[0] ? 'Replace Product Image' : 'AI Scan Product Image'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-light max-w-xs mx-auto mt-0.5 leading-normal">
                    Drag & drop or click to upload. Server-side Gemini AI will detect garment cuts, colors, subcategories, and autocomplete this catalog form!
                  </p>
                </div>

                {isScanning && (
                  <div className="w-full pt-2 flex flex-col items-center justify-center space-y-1.5 z-20 bg-stone-50/95 absolute inset-0">
                    <RefreshCw className="w-5 h-5 text-[#c2a46c] animate-spin" />
                    <span className="text-[10px] font-mono text-stone-600 font-bold">{scanMessage}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Garment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sanskrit Ribbed Tunic"
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-mono"
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct?.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-mono"
                    placeholder="Compare tag"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Category</label>
                  <select
                    value={editingProduct?.category || 'blazers'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden"
                  >
                    <option value="dresses">Dresses</option>
                    <option value="co-ords">Co-ords</option>
                    <option value="tops">Tops</option>
                    <option value="trousers">Trousers</option>
                    <option value="blazers">Blazers</option>
                    <option value="vacation">Vacation Wear</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Fit Drape</label>
                  <select
                    value={editingProduct?.fitType || 'regular'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fitType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden"
                  >
                    <option value="slim">Slim Fit</option>
                    <option value="regular">Regular Fit</option>
                    <option value="oversized">Oversized / Fluid</option>
                  </select>
                </div>
              </div>

              {/* Subcategory & Image URL Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Subcategory</label>
                  {editingProduct?.category === 'tops' ? (
                    <select
                      value={editingProduct?.subcategory || 'Structured Tops'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden"
                    >
                      <option value="Structured Tops">Structured Tops</option>
                      <option value="Statement Tops">Statement Tops</option>
                      <option value="Occasion Tops">Occasion Tops</option>
                      <option value="Party Tops">Party Tops</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Linen Blouses"
                      value={editingProduct?.subcategory || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Image Path / URL</label>
                  <input
                    type="text"
                    placeholder="Auto-filled, or enter URL"
                    value={editingProduct?.images?.[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-mono"
                  />
                </div>
              </div>

              {/* Colors & Tags Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Colors (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Warm Taupe, Cream White"
                    value={Array.isArray(editingProduct?.colors) ? editingProduct.colors.join(', ') : editingProduct?.colors || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Style Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. peplum, asymmetric, resort"
                    value={Array.isArray(editingProduct?.tags) ? editingProduct.tags.join(', ') : editingProduct?.tags || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tags: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Materials / Fabric Composition</label>
                <input
                  type="text"
                  placeholder="e.g. 100% GOTS Certified Long-Staple Egyptian Cotton"
                  value={editingProduct?.materials || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Care Guide</label>
                <input
                  type="text"
                  placeholder="e.g. Dry clean only. Steam recommended."
                  value={editingProduct?.care || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, care: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                />
              </div>


              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78716c] font-outfit">Description</label>
                <textarea
                  placeholder="Luxury editorial description of the garment cuts and design..."
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit h-20"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center space-x-2 text-xs text-[#57534e] font-outfit cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.inStock !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded border-[#d6d3d1] text-[#1c1917] focus:ring-0"
                  />
                  <span>Is in Stock</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-[#57534e] font-outfit cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.isTrending || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isTrending: e.target.checked })}
                    className="rounded border-[#d6d3d1] text-[#1c1917] focus:ring-0"
                  />
                  <span>Is Atelier Curated</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer"
              >
                {editingProduct?.id ? 'Apply Garment Updates' : 'Publish Garment design'}
              </button>
            </form>
          </div>

          {/* Garments Table */}
          <div className="lg:col-span-7 bg-white border border-[#e7e5e4] p-5 rounded-2xl shadow-xs">
            <h3 className="serif-header text-base font-bold text-[#1c1917] mb-4">
              Atelier Garment Inventory
            </h3>
            
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="p-3.5 bg-[#f5f5f4]/40 border border-[#e7e5e4] rounded-xl flex items-center justify-between gap-4 hover:shadow-2xs transition-shadow">
                  <div className="flex items-center space-x-3.5 truncate">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover rounded-md bg-stone-100 flex-shrink-0"
                    />
                    <div className="truncate space-y-0.5">
                      <p className="font-serif text-sm font-bold text-[#1c1917] truncate">{p.name}</p>
                      <p className="text-[10px] text-[#78716c] font-outfit capitalize">
                        {p.category} | {p.materials.split(',')[0]}
                      </p>
                      <span className="mono-text text-xs font-semibold text-[#1c1917]">₹{p.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 bg-white hover:bg-[#1c1917] hover:text-white border border-[#e7e5e4] rounded-lg transition-colors cursor-pointer"
                      title="Edit Garment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you wish to dissolve ${p.name} listing?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-2 bg-white hover:bg-rose-600 hover:text-white hover:border-rose-600 border border-[#e7e5e4] rounded-lg transition-colors cursor-pointer"
                      title="Dissolve Design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ORDER TRACKING & STATUS UPDATES */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#e7e5e4] p-5 md:p-6 rounded-2xl shadow-xs animate-fade-in">
          <h3 className="serif-header text-base md:text-lg font-bold text-[#1c1917] mb-6">
            Patron Purchase Registers
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e7e5e4] text-[#78716c] uppercase tracking-wider text-[10px] font-outfit">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Address / City</th>
                  <th className="py-3 px-4 font-semibold">Items Count</th>
                  <th className="py-3 px-4 font-semibold">Purpose Roundup</th>
                  <th className="py-3 px-4 font-semibold">Total Price</th>
                  <th className="py-3 px-4 font-semibold">Atelier Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f4] font-outfit">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f5f5f4]/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#1c1917]">{order.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#1c1917]">{order.customerName}</p>
                      <p className="text-[10px] text-[#78716c] font-mono">{order.customerEmail}</p>
                      {order.phone && (
                        <p className="text-[10px] text-stone-500 font-mono mt-0.5 flex items-center gap-1">
                          <span>📞 {order.phone}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#57534e]">
                      <p>{order.address}</p>
                      <p className="text-[10px] font-mono">{order.city}</p>
                      
                      {order.notes && (
                        <p className="text-[10px] bg-stone-100 text-stone-600 rounded p-1 mt-1 font-sans italic max-w-[200px] whitespace-normal">
                          &ldquo;{order.notes}&rdquo;
                        </p>
                      )}
                      {order.giftWrapping && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 mt-1">
                          🎁 Handwrap + Gold Wax Seal
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#1c1917]">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} pc(s)
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                      ₹{order.donationAmount || 0}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-mono font-bold text-[#1c1917]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-stone-500 font-bold mt-0.5">
                        {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}
                      </p>
                      {order.promoCode && (
                        <p className="text-[9px] text-emerald-700 font-medium mt-0.5">
                          Code: {order.promoCode} (-₹{order.promoDiscount})
                        </p>
                      )}
                      {order.shippingFee !== undefined && (
                        <p className="text-[9px] text-stone-500 mt-0.5">
                          Logistics: {order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium font-outfit border bg-white focus:outline-hidden ${
                          order.status === 'delivered'
                            ? 'text-emerald-700 border-emerald-300 bg-emerald-50'
                            : order.status === 'shipped'
                            ? 'text-blue-700 border-blue-300 bg-blue-50'
                            : order.status === 'processing'
                            ? 'text-amber-700 border-amber-300 bg-amber-50'
                            : 'text-stone-700 border-stone-300 bg-stone-50'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
