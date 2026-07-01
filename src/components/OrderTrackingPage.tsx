import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Package, 
  Gift, 
  Check, 
  Truck, 
  Scissors, 
  User, 
  HelpCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ClipboardCheck,
  ShieldCheck,
  Calendar,
  Layers,
  Heart,
  Share2,
  Printer
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingPageProps {
  orders: Order[];
  currentUserEmail?: string;
  onBackToShop?: () => void;
}

export default function OrderTrackingPage({ orders, currentUserEmail, onBackToShop }: OrderTrackingPageProps) {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Filter real orders belonging to the current authenticated user
  const userOrders = useMemo(() => {
    return orders.filter(
      (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === (currentUserEmail || '').toLowerCase().trim()
    );
  }, [orders, currentUserEmail]);

  // Set default selection on load if user has orders
  React.useEffect(() => {
    if (userOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(userOrders[0]);
      setSearchId(userOrders[0].id);
    } else if (orders.length > 0 && !selectedOrder) {
      // Fallback to the preseeded order VIV-94827 if available
      const sample = orders.find(o => o.id === 'VIV-94827');
      if (sample) {
        setSelectedOrder(sample);
        setSearchId(sample.id);
      }
    }
  }, [orders, userOrders]);

  const handleTrack = (orderId: string) => {
    setSearchError('');
    setIsSimulated(false);
    const id = orderId.trim().toUpperCase();
    if (!id) return;

    // Search inside database orders
    const found = orders.find((o) => o.id.toUpperCase() === id);
    if (found) {
      setSelectedOrder(found);
      setSearchId(found.id);
    } else {
      // Generous feature: If order ID is not in our live DB, generate a premium simulated order tracking page
      // so the user can test any Order ID on all devices!
      const simulatedOrder: Order = {
        id: id,
        customerName: 'Aesthetic Patron',
        customerEmail: 'patron@vividhra.com',
        items: [
          {
            id: 'sim-1',
            productId: 'p14',
            productName: 'Atelier Tailored Vest & Trouser Set',
            price: 3499,
            image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=200',
            size: 'M',
            color: 'Desert Khaki & Brown',
            quantity: 1
          }
        ],
        subtotal: 3499,
        donationAmount: 350,
        total: 3849,
        status: id.charCodeAt(id.length - 1) % 4 === 0 ? 'delivered' 
              : id.charCodeAt(id.length - 1) % 3 === 0 ? 'shipped' 
              : 'processing',
        createdAt: new Date().toISOString(),
        address: 'Sunset Vista Boulevard, Bandra West',
        city: 'Mumbai',
        phone: '+91 98765 43210',
        paymentMethod: 'UPI (GPay)',
        giftWrapping: true,
        shippingFee: 0
      };

      setSelectedOrder(simulatedOrder);
      setIsSimulated(true);
    }
  };

  const copyOrderId = () => {
    if (!selectedOrder) return;
    navigator.clipboard.writeText(selectedOrder.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const printTracking = () => {
    window.print();
  };

  // Luxury step-by-step journey timeline builder
  const getTimelineSteps = (status: Order['status'] = 'pending') => {
    const steps = [
      {
        id: 1,
        title: 'Bespoke Sizing Verification',
        location: 'Mumbai Atelier - CAD Bay',
        time: 'Day 1 - 09:30 AM',
        description: 'Your registered Sizing Indicators and Sizing Portfolio are validated. Sourcing premium 100% GOTS organic cotton yarns from certified growers.',
        icon: Sparkles,
        status: 'completed'
      },
      {
        id: 2,
        title: 'Artisan Template Hand-Cutting',
        location: 'Mumbai Atelier - Cutting Suite',
        time: 'Day 1 - 02:45 PM',
        description: 'Bespoke fabric molds hand-laid, pattern templates arranged carefully by our senior cutting technician to maintain textile flow.',
        icon: Scissors,
        status: 'pending'
      },
      {
        id: 3,
        title: 'Master-Tailored Fine Sewing',
        location: 'Mumbai Atelier - Sewing Hub',
        time: 'Day 2 - 10:15 AM',
        description: 'Garment meticulously constructed with high-density threads, inner linings master-finished for fluid structural drape.',
        icon: Layers,
        status: 'pending'
      },
      {
        id: 4,
        title: 'Gold Wax Stamp Packaging',
        location: 'Mumbai Atelier - Presentation Suite',
        time: 'Day 2 - 04:30 PM',
        description: 'The garment is pressed, wrapped in customized seed-paper sheets, sealed with a direct gold wax crest stamp, and nested in our organic cotton dust protector.',
        icon: Gift,
        status: 'pending'
      },
      {
        id: 5,
        title: 'Premium Air-Courier Transit',
        location: 'Mumbai Air Cargo Gateway',
        time: 'Day 3 - 08:00 AM',
        description: 'Handed over to premium expedited air partners. Package leaves the regional transit hub with real-time flight coordinates.',
        icon: Truck,
        status: 'pending'
      },
      {
        id: 6,
        title: 'Concierge Hand Delivery',
        location: 'Recipient Residence',
        time: 'Day 3 - 04:15 PM',
        description: 'Expedited courier successfully completes personal delivery. Your sustainable garment is now in your hands. Slogan: Dress with purpose.',
        icon: Package,
        status: 'pending'
      }
    ];

    if (status === 'pending') {
      steps[0].status = 'active';
    } else if (status === 'processing') {
      steps[0].status = 'completed';
      steps[1].status = 'completed';
      steps[2].status = 'active';
      steps[3].status = 'active';
    } else if (status === 'shipped') {
      steps[0].status = 'completed';
      steps[1].status = 'completed';
      steps[2].status = 'completed';
      steps[3].status = 'completed';
      steps[4].status = 'active';
    } else if (status === 'delivered') {
      steps[0].status = 'completed';
      steps[1].status = 'completed';
      steps[2].status = 'completed';
      steps[3].status = 'completed';
      steps[4].status = 'completed';
      steps[5].status = 'completed';
    }

    return steps;
  };

  const activeSteps = selectedOrder ? getTimelineSteps(selectedOrder.status) : [];
  const currentActiveStep = activeSteps.findIndex(s => s.status === 'active' || s.status === 'pending') === -1 
    ? 6 
    : activeSteps.findIndex(s => s.status === 'active' || s.status === 'pending');

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-24 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header Column */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1 text-left">
            <button 
              onClick={onBackToShop}
              className="group inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 transition-colors uppercase font-mono tracking-wider mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Atelier Collections</span>
            </button>
            <h1 className="serif-header text-3xl font-bold text-stone-900 flex items-center gap-2">
              Order Journey Portal <span className="text-xs bg-[#c2a46c]/10 text-[#c2a46c] font-mono px-2 py-0.5 rounded-full uppercase border border-[#c2a46c]/20">Real-Time</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 font-light">
              Track the sustainable, hand-crafted assembly and express transit coordinates of your bespoke garments.
            </p>
          </div>

          {/* Active Search Field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(searchId);
            }}
            className="flex items-center gap-2 max-w-md w-full"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Order ID (e.g. VIV-94827)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono uppercase bg-white focus:ring-1 focus:ring-stone-500/50 focus:border-stone-500 outline-hidden"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-outfit uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Association Alerts & Quick Select */}
        <div className="space-y-3 text-left">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-400 block">
            Associated Atelier Registers
          </span>
          <div className="flex flex-wrap gap-2.5">
            {/* Seeded default order */}
            <button
              onClick={() => handleTrack('VIV-94827')}
              className={`px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                selectedOrder?.id === 'VIV-94827' && !isSimulated
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#c2a46c]" />
              <span>VIV-94827 (Standard Sample)</span>
              <span className="text-[10px] text-stone-400 font-sans font-normal">&bull; Active</span>
            </button>

            {userOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedOrder(o);
                  setSearchId(o.id);
                  setIsSimulated(false);
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  selectedOrder?.id === o.id && !isSimulated
                    ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-[#c2a46c]" />
                <span>{o.id} (My Order)</span>
                <span className="text-[10px] text-stone-400 font-sans font-normal">&bull; ₹{o.total}</span>
              </button>
            ))}

            {isSimulated && selectedOrder && (
              <div className="px-3 py-2 rounded-xl border border-[#c2a46c] bg-[#c2a46c]/10 text-xs font-mono text-[#c2a46c] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generated Tracker ID: {selectedOrder.id}</span>
                <span className="text-[9px] bg-[#c2a46c] text-white px-1.5 py-0.5 rounded-full font-sans uppercase">Simulated</span>
              </div>
            )}
          </div>
        </div>

        {selectedOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Side Column: Order Ledger Cards */}
            <div className="lg:col-span-4 space-y-6 text-left">
              
              {/* Main Ledger card */}
              <div className="bg-stone-950 text-stone-100 p-6 rounded-3xl border border-stone-900 shadow-xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c2a46c]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#c2a46c] font-bold block">Vividhra Registry</span>
                    <h2 className="font-mono text-xl font-bold tracking-tight text-white">{selectedOrder.id}</h2>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono font-bold tracking-wider border ${
                    selectedOrder.status === 'delivered' 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900' 
                      : selectedOrder.status === 'shipped'
                      ? 'bg-blue-950/80 text-blue-400 border-blue-900'
                      : 'bg-amber-950/80 text-amber-400 border-amber-900'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-3.5 border-t border-stone-800 pt-5 text-xs text-stone-300 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Patron Name</span>
                    <span className="font-bold text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Design Hub</span>
                    <span className="font-mono text-[#c2a46c]">Mumbai, India</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Destination</span>
                    <span className="font-bold text-white">{selectedOrder.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Expedited Gateway</span>
                    <span className="font-mono text-stone-400">{selectedOrder.city.substring(0, 3).toUpperCase()}-AIR</span>
                  </div>
                  {selectedOrder.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Delivery Contact</span>
                      <span className="font-mono text-white">{selectedOrder.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Packaging Type</span>
                    <span className="font-bold text-[#c2a46c] flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Gold Wax Wrapping
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-850 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <button 
                    onClick={copyOrderId}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>{copiedId ? 'Copied Ledger ID!' : 'Copy Tracking ID'}</span>
                  </button>
                  <button 
                    onClick={printTracking}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>

              {/* Design Manifest items details */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-stone-500">
                    Bespoke Design Manifest
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[#c2a46c] bg-[#c2a46c]/10 px-2 py-0.5 rounded-full">
                    {selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                <div className="space-y-3 divide-y divide-stone-100 max-h-[250px] overflow-y-auto pr-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className={`flex gap-3 pt-3 first:pt-0 items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        {it.image && (
                          <img 
                            src={it.image} 
                            alt={it.productName} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-13 object-cover rounded-md bg-stone-100"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-serif text-xs font-bold text-stone-900 truncate max-w-[180px]">
                            {it.productName}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            Size: {it.size} &bull; Color: {it.color}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-xs font-semibold text-stone-900">₹{it.price}</p>
                        <p className="text-[9px] text-stone-400 font-mono">Qty: {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Order Subtotal</span>
                    <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.donationAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-emerald-600" /> Purpose Donation
                      </span>
                      <span className="font-mono">+₹{selectedOrder.donationAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedOrder.shippingFee !== undefined && (
                    <div className="flex justify-between text-stone-500">
                      <span>Express Shipping Fee</span>
                      <span className="font-mono">{selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-900 font-bold border-t border-stone-100 pt-2 text-sm">
                    <span>Grand Total</span>
                    <span className="font-mono text-stone-900">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Slogan Branding Box */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-150 flex items-start gap-2 text-left">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#c2a46c] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-stone-600 leading-normal">
                    <span className="font-bold text-stone-800 block mb-0.5">Purposed Sizing Integrity</span>
                    Your custom fits are securely digitized. Our master craft process offsets 100% garment textile waste.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Side Column: Beautiful Timeline Step Visualizer */}
            <div className="lg:col-span-8 space-y-6 text-left">
              
              {/* Journey Overview Bar */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c2a46c]/10 flex items-center justify-center text-[#c2a46c]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-stone-400 block font-bold">Transit Status</span>
                    <p className="text-xs text-stone-700 font-outfit">
                      Your order is currently undergoing <strong className="text-stone-950 font-bold font-serif">{activeSteps[currentActiveStep - 1]?.title || 'Atelier Checking'}</strong>
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto self-stretch flex sm:block items-center justify-between bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  <div className="text-left">
                    <span className="text-[8px] uppercase tracking-widest font-mono text-stone-400 block">Est. Delivery</span>
                    <p className="text-xs font-mono font-bold text-stone-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c2a46c]" /> 3 Days from Order Date
                    </p>
                  </div>
                </div>
              </div>

              {/* Steps timeline card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c2a46c] animate-ping" />
                    <h3 className="serif-header text-base font-bold text-stone-900">
                      Step-by-Step Production & Dispatch Timeline
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    UPDATED RECENTLY
                  </span>
                </div>

                {/* Vertical and horizontal responsive step visual timeline */}
                <div className="relative pl-8 md:pl-10 space-y-8 before:absolute before:left-3.5 md:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-100">
                  
                  {/* Dynamic Progress Line Overlay that matches active steps */}
                  <div 
                    className="absolute left-3.5 md:before:left-4 top-2 w-[2px] bg-stone-900 transition-all duration-1000 ease-in-out" 
                    style={{ 
                      height: `${Math.max(0, Math.min(100, ((currentActiveStep - 1) / 5) * 98))}%`,
                      backgroundColor: '#c2a46c'
                    }} 
                  />

                  {activeSteps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';
                    const StepIcon = step.icon;

                    return (
                      <div key={step.id} className="relative group">
                        
                        {/* Dot / Icon Indicator */}
                        <div className={`absolute -left-[35px] md:-left-[39px] top-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 border z-10 ${
                          isCompleted
                            ? 'bg-stone-900 border-stone-900 text-white'
                            : isActive
                            ? 'bg-[#c2a46c] border-[#c2a46c] text-white animate-pulse shadow-md scale-110'
                            : 'bg-white border-stone-200 text-stone-400'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                          ) : (
                            <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                          )}
                        </div>

                        {/* Step Details Column */}
                        <div className={`pl-2.5 space-y-1.5 transition-all duration-300 ${
                          isCompleted ? 'opacity-90' : isActive ? 'opacity-100 scale-[1.01]' : 'opacity-40'
                        }`}>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <h4 className={`text-sm md:text-base font-bold font-serif ${
                              isActive ? 'text-[#c2a46c]' : isCompleted ? 'text-stone-900' : 'text-stone-400'
                            }`}>
                              {step.id}. {step.title}
                            </h4>

                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isActive 
                                  ? 'bg-[#c2a46c]/15 text-[#c2a46c]' 
                                  : isCompleted 
                                  ? 'bg-stone-100 text-stone-600' 
                                  : 'bg-transparent text-stone-400 border border-stone-100'
                              }`}>
                                {step.location}
                              </span>
                              {isCompleted && (
                                <span className="text-[9px] font-mono text-stone-400">
                                  {step.time}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed font-outfit max-w-2xl font-light">
                            {step.description}
                          </p>
                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* Bottom Courier details and map-pin summary */}
                <div className="border-t border-stone-100 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-stone-500">
                    <MapPin className="w-4.5 h-4.5 text-[#c2a46c] shrink-0" />
                    <span>Real-time handloom origins verified directly with regional artisans.</span>
                  </div>
                  <div className="text-stone-400 text-[11px] font-mono uppercase">
                    LEDGER SECURE &bull; SSL DISPATCH
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-stone-200 rounded-3xl max-w-lg mx-auto p-8 space-y-5">
            <div className="w-16 h-16 bg-stone-50 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 mx-auto shadow-inner">
              <HelpCircle className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-2">
              <h3 className="serif-header font-bold text-stone-900 text-lg">
                Atelier Registry Query
              </h3>
              <p className="text-xs text-stone-500 font-outfit leading-relaxed max-w-sm mx-auto">
                No active order is currently queried. Enter your Order ID above or select the preseeded sample order to inspect the premium step-based visual timeline.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
