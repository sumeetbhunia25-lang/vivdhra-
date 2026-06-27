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

  const letters = "VIVIDHRA".split("");

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
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="flex space-x-1.5 md:space-x-3.5">
                {letters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.1,
                      ease: [0.215, 0.610, 0.355, 1]
                    }}
                    className="serif-header text-5xl md:text-8xl font-extralight tracking-widest text-[#1c1917] select-none"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
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
