import { Compass, Mail, Phone, MapPin, Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  setActiveView: (view: 'home' | 'story' | 'donations' | 'profile' | 'admin' | 'shop') => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  return (
    <footer id="footer" className="bg-[#1c1917] text-[#e7e5e4] pt-16 pb-8 border-t border-[#2e2a28]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <span className="serif-header text-2xl font-bold tracking-[0.25em] text-[#fafaf9] uppercase">
            VIVIDHRA
          </span>
          <p className="text-[10px] tracking-[0.2em] uppercase font-outfit text-[#a8a29e] font-light">
            Dress with purpose
          </p>
          <p className="text-xs text-[#a8a29e] leading-relaxed max-w-sm pt-2">
            Derived from Sanskrit meaning &ldquo;varied, manifold, diverse,&rdquo; bringing mindful aesthetics, creative silhouettes, and purposeful luxury to modern women.
          </p>
        </div>

        {/* Navigation Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-outfit text-[#fafaf9] font-semibold">
            Explore
          </h4>
          <ul className="space-y-2.5 text-xs text-[#a8a29e]">
            <li>
              <button
                onClick={() => setActiveView('home')}
                className="hover:text-[#fafaf9] transition-all cursor-pointer"
              >
                The Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('story')}
                className="hover:text-[#fafaf9] transition-all cursor-pointer"
              >
                Our Story
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('donations')}
                className="hover:text-[#fafaf9] transition-all cursor-pointer"
              >
                Purpose & Charities
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('profile')}
                className="hover:text-[#fafaf9] transition-all cursor-pointer"
              >
                Fit Questionnaire
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Column (No college details, Mumbai place, Smita phone number) */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-outfit text-[#fafaf9] font-semibold">
            Contact Info
          </h4>
          <ul className="space-y-3 text-xs text-[#a8a29e]">
            <li className="flex items-start space-x-2.5">
              <Phone className="w-3.5 h-3.5 mt-0.5 text-[#c2a46c] flex-shrink-0" />
              <div>
                <p className="text-[#fafaf9] font-medium text-[11px]">Smita Sharma</p>
                <a href="tel:+919820012345" className="hover:text-[#fafaf9] transition-all font-mono">
                  +91 98200 12345
                </a>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#c2a46c] flex-shrink-0" />
              <div>
                <p className="text-[#fafaf9] font-medium text-[11px]">Place</p>
                <p>Mumbai, India</p>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <Mail className="w-3.5 h-3.5 mt-0.5 text-[#c2a46c] flex-shrink-0" />
              <div>
                <p className="text-[#fafaf9] font-medium text-[11px]">Inquiries</p>
                <a href="mailto:contact@vividhra.com" className="hover:text-[#fafaf9] transition-all font-mono">
                  contact@vividhra.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Sustainable Statement Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-outfit text-[#fafaf9] font-semibold">
            Our Purpose
          </h4>
          <div className="p-4 bg-[#262220] rounded-lg border border-[#3c3734] space-y-2.5">
            <div className="flex items-center space-x-2 text-[#22c55e]">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                Guaranteed Sustainable
              </span>
            </div>
            <p className="text-[11px] text-[#a8a29e] leading-relaxed">
              We stand for ethical design. 100% of our fabrics are organic, ethically sourced, and hand-tailored, with part of all profits directly funding shelters and homes.
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-[#2e2a28] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716c]">
        <div>
          <p>&copy; {new Date().getFullYear()} VIVIDHRA. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-[#fafaf9]/5 px-3 py-1 rounded-full text-[10px] text-[#c2a46c] tracking-widest uppercase font-outfit">
          <Heart className="w-3 h-3 fill-current text-[#ef4444]" />
          <span>Dress with purpose</span>
        </div>
        <div className="flex space-x-6">
          <span className="hover:text-[#fafaf9] cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-[#fafaf9] cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
