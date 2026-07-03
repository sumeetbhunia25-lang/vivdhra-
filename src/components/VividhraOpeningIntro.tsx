import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface VividhraOpeningIntroProps {
  onEnter: () => void;
}

export default function VividhraOpeningIntro({ onEnter }: VividhraOpeningIntroProps) {
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

  const handleScreenClick = () => {
    if (stage === 'brand') {
      setStage('campaign');
    } else {
      onEnter();
    }
  };

  return (
    <div 
      onClick={handleScreenClick}
      className="fixed inset-0 z-100 bg-[#FDFCFB] flex flex-col justify-center items-center overflow-hidden select-none cursor-pointer"
    >
      
      {/* Main Interactive Stage */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center">
        
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
                {/* High-Fidelity Custom Transparent Vector SVG Logo Monogram */}
                <svg
                  className="w-20 h-20 md:w-24 md:h-24 mx-auto"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gold-metallic-logo-intro" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
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

                  {/* Left Wing of the V: Elegant gold spiral loop swoop */}
                  <path
                    d="M 22,38 
                       C 18,30 25,18 35,21 
                       C 45,24 45,38 38,42 
                       C 30,46 22,40 24,30 
                       C 26,18 42,12 56,22 
                       C 68,31 72,50 70,70 
                       C 68,85 55,98 62,103
                       C 63,105 64,105 64,105
                       C 60,105 52,95 49,82
                       C 46,65 52,48 42,38
                       C 35,30 28,32 30,38
                       C 32,42 36,42 38,38"
                    fill="url(#gold-metallic-logo-intro)"
                  />

                  {/* Main Shaft / Spine of the peacock feather */}
                  <path
                    d="M 62,103 C 65,95 72,78 80,60 C 88,42 96,26 102,15"
                    stroke="url(#gold-metallic-logo-intro)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    />

                  {/* Elegant gold feather barbs */}
                  {/* Left side */}
                  <path d="M 65,88 C 58,86 52,78 54,72" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 69,76 C 60,73 52,62 56,54" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 73,63 C 63,58 54,45 61,37" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 77,50 C 66,43 59,27 68,20" stroke="url(#gold-metallic-logo-intro)" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 82,36 C 72,28 66,13 77,7" stroke="url(#gold-metallic-logo-intro)" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Right side */}
                  <path d="M 63,94 C 70,95 79,97 84,91" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 66,82 C 75,84 85,85 90,77" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 70,70 C 81,72 91,72 96,63" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 74,57 C 87,58 96,56 100,45" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 79,44 C 94,44 102,39 103,26" stroke="url(#gold-metallic-logo-intro)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 84,31 C 99,28 104,18 102,8" stroke="url(#gold-metallic-logo-intro)" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Peacock Eye nestled at the top right of the feather */}
                  <path
                    d="M 88,32 
                       C 80,22 78,11 87,6 
                       C 96,1 104,9 98,21 
                       C 94,28 90,32 88,32 Z"
                    fill="url(#gold-metallic-logo-intro)"
                  />
                  <path
                    d="M 88,30 
                       C 82,22 81,13 87,9 
                       C 93,5 100,11 96,20 
                       C 93,26 90,30 88,30 Z"
                    fill="url(#peacock-teal-intro)"
                  />
                  <path
                    d="M 88,28 
                       C 84,22 83,15 87,12 
                       C 91,9 96,13 94,19 
                       C 91,24 89,28 88,28 Z"
                    fill="url(#emerald-core-intro)"
                  />
                  <path
                    d="M 89,25 
                       C 86,21 86,17 89,14 
                       C 92,11 95,15 93,20 
                       C 91,23 90,25 89,25 Z"
                    fill="#00c49f"
                  />
                  <circle cx="91.5" cy="17.5" r="1.5" fill="#eafdf8" />
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
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="serif-header text-4xl md:text-7xl font-light tracking-wide uppercase leading-tight max-w-3xl"
                  >
                    Curated Exclusively <br />
                    For Women
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-4 flex flex-wrap gap-4"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnter();
                    }}
                    className="px-8 py-4 bg-[#FDFCFB] hover:bg-stone-900 hover:text-white text-stone-900 text-xs uppercase tracking-[0.2em] font-bold font-outfit transition-all rounded-full flex items-center space-x-3 cursor-pointer group shadow-2xl"
                  >
                    <span>ENTER COLLECTION</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-[#c2a46c]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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

    </div>
  );
}
