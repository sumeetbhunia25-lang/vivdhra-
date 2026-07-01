import { Compass, Mail, Phone, MapPin, Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  setActiveView: (view: 'home' | 'story' | 'stylist' | 'profile' | 'admin' | 'shop') => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  // Completely blank as requested
  return null;
}

