import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ZaraOpeningIntroProps {
  onEnter: () => void;
}

export default function ZaraOpeningIntro({ onEnter }: ZaraOpeningIntroProps) {
  const [stage, setStage] = useState<'brand' | 'campaign' | 'ready'>('brand');

  useEffect(() => {
    // Stage 1: Brand Typography (0s to 2.2s)
    // Stage 2: Campaign Image Reveal (2.2s onwards)
    const t1 = setTimeout(() => {
      setStage('campaign');
    }, 2200);

    return () => {
      clearTimeout(t1);
    };
  }, []);

  const campaignImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200", // Elegant dark model
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200", // Soft cream tailoring
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200"  // Flowing silk
  ];

  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    if (stage === 'campaign') {
      const interval = setInterval(() => {
        setBgIdx((prev) => (prev + 1) % campaignImages.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-100 bg-[#FDFCFB] flex flex-col justify-between overflow-hidden select-none">
      
      {/* Top minimalistic header line */}
      <div className="p-6 flex justify-between items-center z-50 text-[10px] tracking-[0.25em] text-stone-500 font-mono uppercase">
        <span>VIVIDHRA ATELIER</span>
        <span>A/W WOMENSWEAR EDIT &apos;26</span>
        <button 
          onClick={onEnter} 
          className="text-stone-900 hover:text-[#c2a46c] hover:underline cursor-pointer transition-colors font-bold font-sans"
        >
          SKIP INTRO
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        
        {/* Animated Brand Introduction (Stage 1) */}
        <AnimatePresence mode="wait">
          {stage === 'brand' && (
            <motion.div
              key="brand-entrance"
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-6 animate-fade-in"
            >
              {/* Detailed Gold Peacock Feather 'V' Logo Symbol (High-Fidelity SVG) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-2"
              >
                <svg
                  className="w-18 h-18 text-[#1c1917]"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gold-metallic-intro" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#dfba73" />
                      <stop offset="50%" stopColor="#c2a46c" />
                      <stop offset="100%" stopColor="#8d6f34" />
                    </linearGradient>
                    <linearGradient id="peacock-teal-intro" x1="75" y1="15" x2="105" y2="45" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0a5c53" />
                      <stop offset="100%" stopColor="#01362f" />
                    </linearGradient>
                    <linearGradient id="emerald-core-intro" x1="82" y1="22" x2="98" y2="38" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00c49f" />
                      <stop offset="100%" stopColor="#017b62" />
                    </linearGradient>
                  </defs>

                  {/* Left Wing of the V: Elegant calligraphic swoop */}
                  <path
                    d="M 22,25 
                       C 22,25   29,18   36,21 
                       C 42,24   40,32   35,42 
                       C 28,56   38,82   49,95 
                       C 56,103  63,105  65,103 
                       C 67,101  60,93   53,84 
                       C 43,71   33,48   42,32 
                       C 47,23   36,25   22,25 Z"
                    fill="url(#gold-metallic-intro)"
                  />

                  {/* Main Shaft / Spine of the peacock feather */}
                  <path
                    d="M 64,103
                       C 66,97 70,82 74,68
                       C 78,54 84,38 90,26"
                    stroke="url(#gold-metallic-intro)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />

                  {/* Elegant gold feather barbs */}
                  {/* Left side */}
                  <path d="M 69,83 C 64,83 58,76 59,71" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 71,73 C 65,71 59,62 61,56" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 74,61 C 67,58 60,47 64,41" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 77,49 C 71,45 65,33 70,27" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 81,38 C 76,33 72,21 78,17" stroke="url(#gold-metallic-intro)" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Right side */}
                  <path d="M 67,90 C 72,91 79,94 84,89" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 70,80 C 76,82 84,85 89,79" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 72,69 C 79,71 88,74 92,67" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 75,57 C 83,59 92,61 95,53" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 78,46 C 87,48 95,49 98,40" stroke="url(#gold-metallic-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 82,34 C 91,35 98,34 100,26" stroke="url(#gold-metallic-intro)" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Peacock Eye at the top */}
                  <path
                    d="M 90,26 
                       C 84,17 83,8 91,4 
                       C 99,0 107,7 101,17 
                       C 97,23 93,26 90,26 Z"
                    fill="url(#gold-metallic-intro)"
                  />
                  <path
                    d="M 90,24 
                       C 86,17 86,10 91,7 
                       C 97,4 103,9 99,16 
                       C 96,21 93,24 90,24 Z"
                    fill="url(#peacock-teal-intro)"
                  />
                  <path
                    d="M 91,21 
                       C 88,16 89,12 92,10 
                       C 96,8 99,12 97,16 
                       C 95,19 93,21 91,21 Z"
                    fill="url(#emerald-core-intro)"
                  />
                  <circle cx="93.5" cy="13.5" r="1.5" fill="#eafdf8" />
                </svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="serif-header text-5xl md:text-8xl font-normal tracking-[-0.09em] text-[#1c1917] select-none uppercase"
              >
                VIVIDHRA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="text-[10px] tracking-[0.4em] font-mono text-stone-400 uppercase text-center"
              >
                Dress with purpose &bull; Women exclusive
              </motion.p>
            </motion.div>
          )}

          {/* Luxury Editorial Campaign Reveal (Stage 2) */}
          {stage !== 'brand' && (
            <motion.div
              key="campaign-interactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              {/* Ken Burns background imagery */}
              <div className="absolute inset-0 bg-black/45 z-10" />
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={bgIdx}
                  src={campaignImages[bgIdx]}
                  alt="High fashion womenswear campaign"
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Dynamic Overlay Campaign Elements */}
              <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-20 md:pb-28 text-white space-y-6">
                <div className="space-y-2">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs uppercase tracking-[0.4em] font-mono text-[#c2a46c] font-semibold"
                  >
                    The Purposeful Fashion Manifesto
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="serif-header text-4xl md:text-7xl font-light tracking-wide uppercase leading-tight max-w-3xl"
                  >
                    Curated Exclusively <br />
                    For Women
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xs md:text-sm text-stone-200 tracking-wider font-light max-w-xl font-sans"
                  >
                    Crafting versatile, semi-casual tailoring engineered to travel seamlessly between the boardroom, the college yard, cozy home spaces, and evening celebrations.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-4 flex flex-wrap gap-4"
                >
                  <button
                    onClick={onEnter}
                    className="px-8 py-4 bg-[#FDFCFB] hover:bg-stone-900 hover:text-white text-stone-900 text-xs uppercase tracking-[0.2em] font-bold font-outfit transition-all rounded-full flex items-center space-x-3 cursor-pointer group shadow-2xl"
                  >
                    <span>ENTER COLLECTION</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-[#c2a46c]" />
                  </button>
                  <button
                    onClick={() => {
                      onEnter();
                    }}
                    className="px-8 py-4 bg-transparent border border-white/30 hover:border-white text-white text-xs uppercase tracking-[0.2em] font-bold font-outfit transition-all rounded-full cursor-pointer"
                  >
                    PHILOSOPHY
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer info line with elegant coordinates */}
      <div className="p-6 flex justify-between items-center z-50 text-[10px] tracking-widest text-stone-400 font-mono">
        <span>© VIVIDHRA 2026</span>
        <span className="hidden md:inline">ORGANIC &bull; SUSTAINABLE &bull; PURPOSE-DRIVEN</span>
        <span>MUMBAI, IN</span>
      </div>

    </div>
  );
}
