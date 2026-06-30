import { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Ruler, Palette, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface AISilhouetteStudioProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function AISilhouetteStudio({ products, onSelectProduct }: AISilhouetteStudioProps) {
  const [height, setHeight] = useState<number>(165);
  const [bodyType, setBodyType] = useState<'petite' | 'hourglass' | 'rectangle' | 'pear' | 'athletic'>('hourglass');
  const [styleVibe, setStyleVibe] = useState<'quiet-luxury' | 'corporate-chic' | 'resort-lounge' | 'bold-sculptural'>('quiet-luxury');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const bodyTypes = [
    { id: 'hourglass' as const, label: 'Hourglass', desc: 'Balanced bust & hips with a defined waistline.' },
    { id: 'petite' as const, label: 'Petite', desc: 'Shorter vertical lines and compact frame.' },
    { id: 'pear' as const, label: 'Pear Shape', desc: 'Wider hips with narrow shoulders & bust.' },
    { id: 'rectangle' as const, label: 'Rectangle', desc: 'Athletic, straight silhouette with balanced proportions.' },
    { id: 'athletic' as const, label: 'Broad/Athletic', desc: 'Structured, wider shoulder line with narrower hips.' },
  ];

  const styleVibes = [
    { id: 'quiet-luxury' as const, label: 'Quiet Luxury', desc: 'Minimalist, fluid lines in earthy, premium hues.' },
    { id: 'corporate-chic' as const, label: 'Corporate Chic', desc: 'Sharp tailoring, structured blazers, crisp collars.' },
    { id: 'resort-lounge' as const, label: 'Resort Lounge', desc: 'Relaxed co-ords, lightweight tencel and linen folds.' },
    { id: 'bold-sculptural' as const, label: 'Bold Sculptural', desc: 'Asymmetrical drapes, high-neck statement buttons.' },
  ];

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setAiResponse('');
    setRecommendedProducts([]);

    try {
      // Craft a descriptive message for the Gemini API
      const bodyTypeLabel = bodyTypes.find(b => b.id === bodyType)?.label || bodyType;
      const vibeLabel = styleVibes.find(v => v.id === styleVibe)?.label || styleVibe;
      
      const customPrompt = `I am selecting styling recommendations for my height (${height}cm), my body type structure (${bodyTypeLabel}), and my desired aesthetic vibe (${vibeLabel}). 
      Please provide customized editorial styling advice, silhouette suggestions, and material recommendations for my profile. Recommend specific style configurations.`;

      // Pass the parameters to our backend Gemini proxy
      const res = await fetch('/api/gemini/styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: customPrompt,
          fitProfile: {
            height,
            bodyType,
            fitStyle: styleVibe === 'resort-lounge' ? 'relaxed' : styleVibe === 'bold-sculptural' ? 'experimental' : 'classic',
            outfitMood: styleVibe === 'quiet-luxury' ? 'elegant' : styleVibe === 'corporate-chic' ? 'minimalist' : 'bold',
          },
          currentProduct: null,
          chatHistory: []
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiResponse(data.response);

      // Simple heuristic client-side filtering to pick 2-3 most relevant items in our actual products catalog!
      let filtered: Product[] = [];
      const cat = bodyType === 'petite' ? 'tops' : bodyType === 'pear' ? 'trousers' : 'co-ords';
      
      if (styleVibe === 'corporate-chic') {
        filtered = products.filter(p => p.category === 'blazers' || p.category === 'trousers' || p.id === 'p14');
      } else if (styleVibe === 'resort-lounge') {
        filtered = products.filter(p => p.category === 'co-ords' || p.id === 'p19');
      } else if (styleVibe === 'bold-sculptural') {
        filtered = products.filter(p => p.id === 'p15' || p.id === 'p16' || p.id === 'p17' || p.id === 'p18');
      } else { // quiet luxury
        filtered = products.filter(p => p.category === 'dresses' || p.id === 'p14' || p.id === 'p15');
      }

      // Fallback if none match
      if (filtered.length === 0) {
        filtered = products.slice(0, 3);
      }

      setRecommendedProducts(filtered.slice(0, 3));
    } catch (err) {
      console.error(err);
      setAiResponse(`### VIVIDHRA AI ATELIER INSIGHTS\n\nFor a **${height}cm** frame with a **${bodyType}** structure and a **${styleVibe}** aesthetic, we recommend embracing fluid, high-waisted linen trousers combined with our asymmetric draped tops to elongate the vertical silhouette.\n\nChoose materials like bamboo cotton, lightweight organic linen, or premium cupro satin to offer elegant movement. Pairs best with our tailoring ensembles.`);
      setRecommendedProducts(products.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e7e5e4] rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f5f5f4]">
        <div className="space-y-1">
          <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider text-[#c2a46c] font-mono bg-[#c2a46c]/10 px-2.5 py-0.5 rounded-full font-bold">
            <Sparkles className="w-3 h-3 mr-1" /> Custom Silhouette Studio
          </span>
          <h2 className="serif-header text-xl md:text-2xl font-bold text-stone-900">
            Interactive AI Style & Fit Atelier
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Select your specific measurements and aesthetic theme to construct custom lookbook recommendations instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PANEL: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Height Selector */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-xs uppercase tracking-widest font-outfit text-stone-700 font-bold">
              <Ruler className="w-4 h-4 text-[#c2a46c]" />
              <span>1. Your Height: <span className="font-mono text-sm text-[#c2a46c]">{height} cm</span></span>
            </label>
            <div className="pt-2">
              <input
                type="range"
                min="140"
                max="200"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1c1917]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>140 cm (Petite Frame)</span>
                <span>170 cm</span>
                <span>200 cm (Tall Frame)</span>
              </div>
            </div>
          </div>

          {/* Body Type Selector */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-xs uppercase tracking-widest font-outfit text-stone-700 font-bold">
              <UserCheck className="w-4 h-4 text-[#c2a46c]" />
              <span>2. Body Structure</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {bodyTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setBodyType(type.id)}
                  className={`flex items-start text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    bodyType === type.id
                      ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-sm'
                      : 'bg-[#fafaf9] hover:bg-stone-100 text-stone-700 border-[#e7e5e4]'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider">{type.label}</p>
                    <p className={`text-[10px] leading-tight mt-0.5 ${bodyType === type.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {type.desc}
                    </p>
                  </div>
                  {bodyType === type.id && (
                    <span className="w-2 h-2 rounded-full bg-[#c2a46c] mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Style Theme */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-xs uppercase tracking-widest font-outfit text-stone-700 font-bold">
              <Palette className="w-4 h-4 text-[#c2a46c]" />
              <span>3. Desired Style Mood</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleVibes.map((vibe) => (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setStyleVibe(vibe.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                    styleVibe === vibe.id
                      ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-sm'
                      : 'bg-[#fafaf9] hover:bg-stone-100 text-stone-700 border-[#e7e5e4]'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold block">{vibe.label}</span>
                  <span className={`text-[9px] leading-tight block ${styleVibe === vibe.id ? 'text-stone-300 font-light' : 'text-stone-500'}`}>
                    {vibe.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateRecommendations}
            disabled={loading}
            className="w-full py-3.5 bg-[#1c1917] hover:bg-[#3c3734] text-[#fafaf9] uppercase tracking-widest font-mono text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#c2a46c]" />
                <span>Generating Custom Lookbook...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#c2a46c]" />
                <span>Consult AI Silhouette Studio</span>
              </>
            )}
          </button>

        </div>

        {/* OUTPUT RESULTS PANEL: 7 cols */}
        <div className="lg:col-span-7 bg-[#faf9f5] border border-[#f5f5f4] rounded-2xl p-6 flex flex-col justify-between min-h-[450px]">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-3">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#c2a46c]">
                Atelier AI Analysis Result
              </span>
              <span className="text-[9px] uppercase font-mono text-stone-500 bg-stone-200/50 px-2 py-0.5 rounded-full">
                {height}cm &bull; {bodyType}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#c2a46c] animate-spin" />
                <p className="text-xs text-stone-500 font-mono animate-pulse">
                  Analyzing draping layers, tailored lines, and styling rules...
                </p>
              </div>
            ) : aiResponse ? (
              <div className="space-y-4 text-xs text-stone-700 leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                {/* Format paragraphs elegantly */}
                {aiResponse.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={idx} className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide mt-4">
                        {paragraph.replace('###', '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.')) {
                    return (
                      <div key={idx} className="pl-4 border-l border-[#c2a46c] py-0.5 text-stone-600 font-outfit">
                        {paragraph}
                      </div>
                    );
                  }
                  return <p key={idx} className="font-sans font-light text-stone-600">{paragraph}</p>;
                })}
              </div>
            ) : (
              <div className="text-center py-24 space-y-4">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <p className="serif-header text-sm font-bold text-stone-800">
                    No Live Lookbook Configured Yet
                  </p>
                  <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">
                    Select your custom silhouette parameters and click &ldquo;Consult AI Silhouette Studio&rdquo; above to generate personalized insights instantly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Catalog Recommendations */}
          {recommendedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#e7e5e4] space-y-3 animate-fade-in">
              <p className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500">
                Tailored Wardrobe Picks
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="bg-white border border-[#e7e5e4] rounded-xl p-2 cursor-pointer hover:border-[#c2a46c] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100 relative mb-1.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                      <h4 className="text-[10px] font-bold text-stone-800 truncate uppercase tracking-tight">
                        {p.name}
                      </h4>
                      <p className="text-[9px] text-[#c2a46c] font-mono font-bold">
                        ₹{p.price}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[8px] text-stone-400 font-mono uppercase">
                      <span>{p.category}</span>
                      <Eye className="w-2.5 h-2.5 text-stone-400 group-hover:text-stone-800 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
