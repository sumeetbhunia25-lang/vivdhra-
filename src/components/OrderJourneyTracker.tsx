import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

interface OrderJourneyTrackerProps {
  orders: Order[];
  currentUserEmail?: string;
  onClose?: () => void;
}

export default function OrderJourneyTracker({ orders, currentUserEmail }: OrderJourneyTrackerProps) {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');

  // Sourcing a user's matched orders to let them quickly click & track
  const userOrders = orders.filter(
    (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === (currentUserEmail || '').toLowerCase().trim()
  );

  const handleTrack = (orderId: string) => {
    setSearchError('');
    const id = orderId.trim().toUpperCase();
    if (!id) return;

    const found = orders.find((o) => o.id.toUpperCase() === id);
    if (found) {
      setSelectedOrder(found);
    } else {
      setSearchError(`We couldn't locate Order ${id} in our Atelier Registers.`);
      setSelectedOrder(null);
    }
  };

  // Automatically select the first order if there is exactly one matching user order and no selected order yet
  React.useEffect(() => {
    if (userOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(userOrders[0]);
    }
  }, [orders, currentUserEmail]);

  // Define our premium 6 stages of the bespoke garment's journey
  const getJourneyStages = (status: Order['status'] = 'pending') => {
    const stages = [
      {
        id: 1,
        title: 'Digitized Sizing & Pattern Crafting',
        location: 'Mumbai Atelier - CAD Bay',
        description: 'Sizing indicators validated against your registered Fit Profile. Raw luxury fabrics sourced from regional handloom weavers.',
        icon: Sparkles,
        status: 'completed' // Always completed or active if order exists
      },
      {
        id: 2,
        title: 'Artisan Precision Hand-Cutting',
        location: 'Mumbai Atelier - Cutting Suite',
        description: 'Bespoke pattern templates hand-laid and sliced along the natural grainlines by our senior cutter.',
        icon: Scissors,
        status: 'pending'
      },
      {
        id: 3,
        title: 'Master-Tailored Stitching',
        location: 'Mumbai Atelier - Tailoring Bay',
        description: 'Silhouettes meticulously stitched with high-density threads. Linings hand-attached for unmatched drape and comfort.',
        icon: Scissors,
        status: 'pending'
      },
      {
        id: 4,
        title: 'Wax Seal Wrapping & Dust Bag Pack',
        location: 'Mumbai Atelier - Presentation Room',
        description: 'Garments wrapped carefully in hand-made Jaipur paper, stamped with our gold wax insignia, and secured inside a raw cotton protective bag.',
        icon: Gift,
        status: 'pending'
      },
      {
        id: 5,
        title: 'Premium Express Air Logistics',
        location: 'Mumbai Gateway Hub',
        description: 'Handed over to premium air courier transit for expedited shipping to your residence.',
        icon: Truck,
        status: 'pending'
      },
      {
        id: 6,
        title: 'Bespoke Concierge Doorstep Delivery',
        location: 'Recipient Residence',
        description: 'Local courier delivers the custom package directly to your hands. Slogan: Dress with purpose.',
        icon: Package,
        status: 'pending'
      }
    ];

    // Map Order.status ('pending' | 'processing' | 'shipped' | 'delivered') to stages
    if (status === 'pending') {
      stages[0].status = 'active';
      // Rest are pending
    } else if (status === 'processing') {
      stages[0].status = 'completed';
      stages[1].status = 'completed';
      stages[2].status = 'active';
      stages[3].status = 'active';
    } else if (status === 'shipped') {
      stages[0].status = 'completed';
      stages[1].status = 'completed';
      stages[2].status = 'completed';
      stages[3].status = 'completed';
      stages[4].status = 'active';
    } else if (status === 'delivered') {
      stages[0].status = 'completed';
      stages[1].status = 'completed';
      stages[2].status = 'completed';
      stages[3].status = 'completed';
      stages[4].status = 'completed';
      stages[5].status = 'completed'; // everything is done
    }

    return stages;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-8 max-w-4xl mx-auto shadow-xs">
      
      {/* Tracker Header */}
      <div className="border-b border-stone-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="serif-header text-lg md:text-2xl font-bold text-[#1c1917]">
            Real-Time Atelier Tracking
          </h3>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Monitor your bespoke garment’s transit journey from our physical Mumbai atelier directly to your doorstep.
          </p>
        </div>
        
        {/* Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(searchId);
          }}
          className="flex items-center gap-2 max-w-sm w-full"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. VIV-12345)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono uppercase focus:ring-1 focus:ring-stone-500/50 focus:border-stone-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-stone-950 hover:bg-stone-850 text-white text-xs font-outfit uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {searchError && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-outfit font-medium">
          ⚠️ {searchError}
        </div>
      )}

      {/* Suggested Quick Tracker Links */}
      {userOrders.length > 0 && (
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500 block">
            Associated Atelier Purchases
          </span>
          <div className="flex flex-wrap gap-2">
            {userOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedOrder(o);
                  setSearchId(o.id);
                  setSearchError('');
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedOrder?.id === o.id
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Package className="w-3 h-3 text-[#c2a46c]" />
                <span>{o.id}</span>
                <span className="text-[10px] uppercase text-stone-400">
                  (₹{o.total.toLocaleString('en-IN')})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Visualization Content */}
      <AnimatePresence mode="wait">
        {selectedOrder ? (
          <motion.div
            key={selectedOrder.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2"
          >
            {/* Left Hand: Order Info Card & Item Manifest */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-stone-950 text-white p-5 rounded-2xl border border-stone-850 space-y-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-[#c2a46c] font-bold">Atelier Ledger</span>
                    <h4 className="font-mono text-base font-bold">{selectedOrder.id}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    selectedOrder.status === 'delivered' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                      : selectedOrder.status === 'shipped'
                      ? 'bg-blue-950 text-blue-400 border border-blue-900'
                      : 'bg-amber-950 text-amber-400 border border-amber-900'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-2 border-t border-stone-800 pt-3 text-[11px] font-outfit text-stone-300">
                  <div className="flex justify-between">
                    <span>Registered Patron</span>
                    <span className="font-bold text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atelier Hub</span>
                    <span className="font-mono text-[#c2a46c]">Mumbai, IN</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination Gateway</span>
                    <span className="font-bold text-white">{selectedOrder.city}</span>
                  </div>
                  {selectedOrder.phone && (
                    <div className="flex justify-between">
                      <span>Delivery Contact</span>
                      <span className="font-mono">{selectedOrder.phone}</span>
                    </div>
                  )}
                  {selectedOrder.paymentMethod && (
                    <div className="flex justify-between">
                      <span>Logistics Charge</span>
                      <span className="font-bold text-white">{selectedOrder.shippingFee === 0 ? "Free Express" : `₹${selectedOrder.shippingFee}`}</span>
                    </div>
                  )}
                </div>

                {selectedOrder.giftWrapping && (
                  <div className="p-2.5 bg-amber-950/40 rounded-xl border border-amber-900/50 flex items-start gap-2">
                    <Gift className="w-4 h-4 text-[#c2a46c] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-200 leading-normal">
                      <span className="font-bold block text-[#c2a46c]">Complimentary Handwrap</span>
                      Wax-stamped handmade paper parcel included.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items List */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-stone-50/50">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500 block">
                  Design Manifest
                </span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center justify-between py-1 border-b border-stone-100 last:border-0">
                      <div className="min-w-0">
                        <p className="font-serif text-xs font-bold text-stone-900 truncate">
                          Garment Design #{it.productId || idx}
                        </p>
                        <p className="text-[10px] text-stone-500 font-outfit truncate">
                          Color: {it.selectedColor || 'Default'} | Size: Fit Custom
                        </p>
                      </div>
                      <span className="font-mono text-xs text-stone-800 flex-shrink-0">
                        {it.quantity} pc(s)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hand: Elegant Real-Time Vertical Journey Timeline */}
            <div className="lg:col-span-8 bg-stone-50/30 border border-stone-200 p-5 md:p-6 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2 text-stone-900">
                  <Clock className="w-4 h-4 text-[#c2a46c]" />
                  <span className="font-serif text-sm font-bold">Real-time Sourcing & Transit Journey</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                  Atelier Dispatch
                </span>
              </div>

              {/* Steps timeline vertical */}
              <div className="relative pl-6 space-y-6 md:space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
                {getJourneyStages(selectedOrder.status).map((stage) => {
                  const isActive = stage.status === 'active';
                  const isCompleted = stage.status === 'completed';
                  const StageIcon = stage.icon;

                  return (
                    <div key={stage.id} className="relative group">
                      
                      {/* Timeline dot / icon */}
                      <div className={`absolute -left-[23px] top-0.5 w-[15px] h-[15px] rounded-full flex items-center justify-center transition-all border duration-300 ${
                        isCompleted
                          ? 'bg-stone-900 border-stone-900'
                          : isActive
                          ? 'bg-[#c2a46c] border-[#c2a46c] animate-pulse shadow-md scale-110'
                          : 'bg-white border-stone-300'
                      }`}>
                        {isCompleted && (
                          <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                        )}
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>

                      {/* Timeline Step Card */}
                      <div className={`pl-2.5 space-y-1 transition-all ${
                        isCompleted ? 'opacity-85' : isActive ? 'opacity-100' : 'opacity-40'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h5 className={`text-xs md:text-sm font-bold font-serif ${
                            isActive ? 'text-[#c2a46c]' : 'text-stone-900'
                          }`}>
                            {stage.title}
                          </h5>
                          
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase self-start sm:self-center font-bold ${
                            isActive 
                              ? 'bg-[#c2a46c]/10 text-[#c2a46c]' 
                              : isCompleted 
                              ? 'bg-stone-100 text-stone-600' 
                              : 'bg-transparent text-stone-400'
                          }`}>
                            {stage.location}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-600 leading-relaxed font-outfit max-w-2xl">
                          {stage.description}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Transit Note Footer */}
              <div className="border-t border-stone-100 pt-4 flex items-center gap-2.5 text-[10px] text-stone-500 font-outfit leading-relaxed">
                <MapPin className="w-4 h-4 text-[#c2a46c] flex-shrink-0" />
                <span>
                  Our Mumbai Atelier updates this log ledger multiple times daily. Deliveries to major Indian metro hubs typically settle within 48-72 dispatch hours.
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="max-w-xs mx-auto p-4 bg-stone-50 rounded-full border border-stone-100 flex items-center justify-center text-stone-400">
              <HelpCircle className="w-10 h-10 stroke-1" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif font-bold text-stone-900 text-base">
                No Order Currently Highlighted
              </h4>
              <p className="text-xs text-stone-500 font-outfit max-w-sm mx-auto">
                Please enter a valid VIVIDHRA Order ID in the search bar above, or select one of your associated purchases to view real-time transit status.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
