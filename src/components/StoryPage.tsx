import { Compass, ShieldCheck, HeartHandshake, Eye, Sparkles } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="pt-24 md:pt-32 pb-20 max-w-6xl mx-auto px-4 md:px-8">
      
      {/* Editorial Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#c2a46c] font-semibold bg-[#c2a46c]/10 px-3 py-1 rounded-full">
          OUR RATIONALE & METIER
        </span>
        <h1 className="serif-header text-3xl md:text-5xl font-medium tracking-wide text-[#1c1917]">
          The Story of VIVIDHRA
        </h1>
        <p className="text-sm md:text-base text-[#78716c] font-light italic font-serif">
          &ldquo;Varied, manifold, diverse.&rdquo;
        </p>
      </div>

      {/* Hero Narrative Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-6 relative aspect-[4/5] bg-[#E5E1DA] rounded-3xl overflow-hidden shadow-md border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
            alt="Mindful atelier tailoring"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c]">Atelier Craftsmanship</span>
            <p className="serif-header text-lg font-bold">100% Organically Spun Cruelty-Free Weaves</p>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <h2 className="serif-header text-xl md:text-3xl font-bold text-[#1c1917]">
            Manifold Roots, Singular Purpose
          </h2>
          
          <div className="text-xs md:text-sm text-[#57534e] leading-relaxed space-y-4 font-sans font-light">
            <p>
              Derived from the Sanskrit term representing <strong className="text-[#1c1917] font-semibold">manifold shapes and varied expressions</strong>, 
              VIVIDHRA was established by designer and visual artist <strong className="text-[#1c1917] font-semibold">Smita Sharma</strong>. 
              The brand is a visual and sensory tribute to the multi-dimensional facets of modern women.
            </p>
            <p>
              Our design philosophy rejects fast fashion. We focus on structural honesty, natural textiles, and clean tailored cuts that respect both the wearer and the surrounding ecosystem. Every silhouette is thoughtfully designed to blend effortlessly into a high-powered office meeting, an organic weekend retreat, or a formal occasion.
            </p>
            <p>
              Under Smita&apos;s guidance, the Mumbai-based atelier prioritizes regional artisan loops. By combining indigenous weaving techniques with clean minimalist geometries, we create trans-seasonal garments built to endure.
            </p>
          </div>

          {/* Slogan block */}
          <div className="p-5 bg-[#c2a46c]/5 rounded-2xl border border-[#c2a46c]/10 text-[#c2a46c]">
            <p className="text-[10px] uppercase font-mono tracking-widest font-semibold">Brand Mandate & Slogan</p>
            <p className="font-serif text-lg font-bold italic text-[#1c1917] mt-1">
              &ldquo;Dress with purpose&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Core Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-stone-100 text-stone-800 rounded-xl w-fit">
            <Compass className="w-5 h-5 text-[#c2a46c]" />
          </div>
          <h3 className="serif-header text-sm md:text-base font-bold text-[#1c1917]">
            Artisan Centered Tailoring
          </h3>
          <p className="text-xs text-[#78716c] leading-relaxed">
            Every garment is constructed in small, batch-based iterations by skilled Indian artisans. This maintains high quality while supporting organic heritage textiles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-stone-100 text-stone-800 rounded-xl w-fit">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="serif-header text-sm md:text-base font-bold text-[#1c1917]">
            Sustainably Crafted Materials Only
          </h3>
          <p className="text-xs text-[#78716c] leading-relaxed">
            We are strictly dedicated to ecological harmony and non-violence. All silk, linen, cotton, and modal are sourced through ethical sustainable loops that safeguard regional ecosystems.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-stone-100 text-stone-800 rounded-xl w-fit">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="serif-header text-sm md:text-base font-bold text-[#1c1917]">
            Artisan Craft & Ethical Wages
          </h3>
          <p className="text-xs text-[#78716c] leading-relaxed">
            Every piece supports master weavers across India with fair living wages, preserving rare handloom traditions and sustainable livelihoods.
          </p>
        </div>

      </div>

      {/* Atelier Contact Details & Map Place Block */}
      <div className="bg-[#1c1917] rounded-3xl p-6 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#2e2a28] shadow-lg">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#c2a46c]">ATELIER LOCATION</span>
          <h3 className="serif-header text-xl md:text-2xl font-bold">VIVIDHRA Mumbai</h3>
          <p className="text-xs text-[#a8a29e] leading-relaxed max-w-sm">
            Our central atelier and design workspace operate directly out of Mumbai. Visits can be arranged by booking an appointment with Smita Sharma&apos;s styling office.
          </p>
          <div className="space-y-2 text-xs font-mono pt-2">
            <p className="text-stone-300">
              Founder: <span className="text-white font-bold">Smita Sharma</span>
            </p>
            <p className="text-stone-300">
              Hotline: <a href="tel:+919820012345" className="text-[#c2a46c] hover:underline">+91 98200 12345</a>
            </p>
            <p className="text-stone-300">
              Email: <span className="text-white">contact@vividhra.com</span>
            </p>
          </div>
        </div>

        {/* Minimal Editorial Location placeholder block */}
        <div className="relative h-48 md:h-full min-h-[160px] bg-[#2e2a28] rounded-xl overflow-hidden border border-[#3c3734] flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c2a46c_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="text-center relative z-10 space-y-1.5 p-4">
            <p className="serif-header text-base md:text-lg font-bold text-white uppercase tracking-widest">MUMBAI</p>
            <p className="text-[10px] text-[#c2a46c] uppercase tracking-widest font-mono">Maharashtra, India</p>
            <p className="text-[9px] text-[#a8a29e] max-w-xs mx-auto leading-normal">
              Atelier Coordinates: 19.0760&deg; N, 72.8777&deg; E
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
