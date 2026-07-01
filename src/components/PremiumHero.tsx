import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { Sparkles, ArrowRight, MousePointer } from 'lucide-react';

interface PremiumHeroProps {
  onBrowse: () => void;
  onExplorePhilosophy: () => void;
}

export default function PremiumHero({ onBrowse, onExplorePhilosophy }: PremiumHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate state for GPU parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Scroll interactive hooks
  const { scrollY } = useScroll();
  // As we scroll, translate the background image and content for seamless exit parallax
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 800], [0, -100]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Letters of the brand VIVIDHRA
  const letters = "VIVIDHRA".split("");

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ultra smooth cubic ease-out
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Entrance Sequencing
    const ctx = gsap.context(() => {
      // Create an elegant master timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Ensure elements start hidden or in initial state to prevent flash of unstyled content
      gsap.set(".char-node", { opacity: 0, scale: 0.85, filter: "blur(12px)", y: 40 });

      tl.to(".intro-overlay", {
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        pointerEvents: "none",
      })
      .fromTo(logoRef.current, 
        { opacity: 0, scale: 0.9, y: 15, filter: "blur(8px)" },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
        "-=0.4"
      )
      .to(".char-node", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: {
          each: 0.08,
          ease: "power2.out"
        },
        duration: 1.2,
      }, "-=0.8")
      .fromTo(taglineRef.current,
        { opacity: 0, y: 15, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(buttonGroupRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.0 },
        "-=0.8"
      )
      .fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.8, y: 0, duration: 1.0 },
        "-=0.6"
      );
    }, containerRef);

    // Clean up
    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  // Mouse Parallax movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const x = (e.clientX / clientWidth - 0.5) * 20; // max 20px translation
      const y = (e.clientY / clientHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Magnetic CTA Button utility
  const ctaRef = useRef<HTMLButtonElement>(null);
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ctaRef.current) return;
    const { left, top, width, height } = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    
    // Move slightly towards the mouse (magnetic effect)
    gsap.to(ctaRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleCtaMouseLeave = () => {
    if (!ctaRef.current) return;
    gsap.to(ctaRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-stone-950 flex flex-col justify-between"
      id="premium-hero"
    >
      {/* 1. Slow-fading page cover for smooth entrance transitions */}
      <div className="intro-overlay absolute inset-0 bg-[#FDFCFB] z-100 flex items-center justify-center opacity-100 pointer-events-auto" />

      {/* 2. Panoramic Luxury Background Image with Custom GPU-Accelerated Parallax and Subtle Ken-Burns */}
      <motion.div 
        style={{ 
          y: bgY,
        }}
        className="absolute inset-0 w-full h-full select-none pointer-events-none"
      >
        <motion.div
          style={{
            x: mousePos.x * 0.4, // micro parallax response
            y: mousePos.y * 0.4,
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/50 to-stone-950/85 z-10" />
          <motion.img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=90&w=2400"
            alt="VIVIDHRA Haute Couture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.05]"
            animate={{
              scale: [1.05, 1.08, 1.05],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* 3. Empty Space / Spacer */}
      <div className="relative z-30 p-3" />

      {/* 4. Center-Aligned Editorial Brand Content */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-8"
      >
        
        {/* Brand Monogram Logo */}
        <div ref={logoRef} className="flex flex-col items-center select-none">
          {/* High-Fidelity Custom Transparent Vector SVG Logo Monogram */}
          <svg
            className="w-16 h-16 md:w-20 md:h-20 transition-transform duration-700 hover:scale-105"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gold-metallic-logo-hero" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#dfba73" />
                <stop offset="50%" stopColor="#c2a46c" />
                <stop offset="100%" stopColor="#8d6f34" />
              </linearGradient>
              <linearGradient id="peacock-teal-hero" x1="75" y1="15" x2="105" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0a5c53" />
                <stop offset="100%" stopColor="#01362f" />
              </linearGradient>
              <linearGradient id="emerald-core-hero" x1="82" y1="22" x2="98" y2="38" gradientUnits="userSpaceOnUse">
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
              fill="url(#gold-metallic-logo-hero)"
            />

            {/* Main Shaft / Spine of the peacock feather */}
            <path
              d="M 62,103 C 65,95 72,78 80,60 C 88,42 96,26 102,15"
              stroke="url(#gold-metallic-logo-hero)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Elegant gold feather barbs */}
            {/* Left side */}
            <path d="M 65,88 C 58,86 52,78 54,72" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 69,76 C 60,73 52,62 56,54" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 73,63 C 63,58 54,45 61,37" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 77,50 C 66,43 59,27 68,20" stroke="url(#gold-metallic-logo-hero)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 82,36 C 72,28 66,13 77,7" stroke="url(#gold-metallic-logo-hero)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right side */}
            <path d="M 63,94 C 70,95 79,97 84,91" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 66,82 C 75,84 85,85 90,77" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 70,70 C 81,72 91,72 96,63" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 74,57 C 87,58 96,56 100,45" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 79,44 C 94,44 102,39 103,26" stroke="url(#gold-metallic-logo-hero)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 84,31 C 99,28 104,18 102,8" stroke="url(#gold-metallic-logo-hero)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Peacock Eye nestled at the top right of the feather */}
            <path
              d="M 88,32 
                 C 80,22 78,11 87,6 
                 C 96,1 104,9 98,21 
                 C 94,28 90,32 88,32 Z"
              fill="url(#gold-metallic-logo-hero)"
            />
            <path
              d="M 88,30 
                 C 82,22 81,13 87,9 
                 C 93,5 100,11 96,20 
                 C 93,26 90,30 88,30 Z"
              fill="url(#peacock-teal-hero)"
            />
            <path
              d="M 88,28 
                 C 84,22 83,15 87,12 
                 C 91,9 96,13 94,19 
                 C 91,24 89,28 88,28 Z"
              fill="url(#emerald-core-hero)"
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
        </div>

        {/* Brand Wordmark Title - EXACT "TAN HEADLINE" replica styling */}
        <h1 
          ref={titleRef}
          className="tan-headline-text text-white leading-none tracking-[-0.095em] select-none uppercase select-none drop-shadow-2xl flex flex-nowrap items-center justify-center"
          style={{
            fontSize: 'clamp(3.8rem, 13vw + 0.5rem, 9.5rem)',
          }}
        >
          {letters.map((char, index) => (
            <span
              key={index}
              className="char-node inline-block transform glow-hover select-none"
              style={{
                willChange: "transform, opacity, filter",
                marginRight: index === letters.length - 1 ? '0' : '-0.02em', // precise optical alignment tweak
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Tagline Column */}
        <div ref={taglineRef} className="space-y-2 select-none">
          <p className="text-stone-300 font-sans font-light tracking-[0.25em] text-[11px] sm:text-[13px] uppercase">
            Dress with purpose &bull; Women Exclusive
          </p>
          <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            tailored coordinates with biological organic structures
          </p>
        </div>

        {/* Elegant Action Buttons with Magnetic Effects */}
        <div ref={buttonGroupRef} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            onClick={onBrowse}
            className="w-56 sm:w-auto px-8 py-4 bg-white text-stone-950 text-xs font-outfit uppercase font-semibold tracking-widest hover:bg-[#1c1917] hover:text-white transition-colors rounded-full shadow-2xl cursor-pointer flex items-center justify-center space-x-2 group relative overflow-hidden"
          >
            <span>Browse Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <button
            onClick={onExplorePhilosophy}
            className="w-56 sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white text-xs font-outfit uppercase font-medium tracking-widest hover:bg-white/15 transition-all rounded-full border border-white/20 cursor-pointer"
          >
            Philosophy
          </button>
        </div>

      </motion.div>

      {/* 5. Scroll Indicator & Ambient Coordinates (Emptied per request) */}
      <div 
        ref={scrollIndicatorRef}
        className="relative z-30 p-2"
      />

    </div>
  );
}
