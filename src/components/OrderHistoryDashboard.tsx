import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Download, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  Tag, 
  Heart, 
  Printer, 
  X, 
  CheckCircle, 
  Award,
  ArrowRight,
  Info
} from 'lucide-react';
import { Order, Product } from '../types';

interface OrderHistoryDashboardProps {
  orders: Order[];
  products: Product[];
  currentUserEmail?: string;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string) => void;
}

export default function OrderHistoryDashboard({ 
  orders, 
  products, 
  currentUserEmail, 
  onAddToCart 
}: OrderHistoryDashboardProps) {
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);

  // Filter orders matching currently logged-in user's email
  const userOrders = orders.filter(
    (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === (currentUserEmail || '').toLowerCase().trim()
  );

  // Re-order handler
  const handleReorder = (order: Order) => {
    let reorderCount = 0;
    
    order.items.forEach((item: any) => {
      // Find the corresponding live product structure
      const matchedProd = products.find((p) => p.id === item.productId);
      if (matchedProd) {
        onAddToCart(matchedProd, item.selectedSize || item.size || 'M', item.selectedColor || item.color || matchedProd.colors[0]);
        reorderCount++;
      }
    });

    if (reorderCount > 0) {
      setReorderedOrderId(order.id);
      setTimeout(() => {
        setReorderedOrderId(null);
      }, 3500);
    } else {
      alert('These garments are currently out of stock or could not be verified in our Atelier Registers.');
    }
  };

  const getStatusStyle = (status: Order['status'] = 'pending') => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-8 max-w-4xl mx-auto shadow-xs">
      
      {/* Dashboard Header */}
      <div className="border-b border-stone-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="serif-header text-lg md:text-2xl font-bold text-[#1c1917]">
            Atelier Order History
          </h3>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Review your past purchases, download premium PDF invoices, and instantly re-order signature VIVIDHRA co-ords.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-[#fafaf9] border border-stone-200 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold text-stone-600 self-start md:self-auto">
          <span>Registered Patron:</span>
          <span className="text-[#c2a46c] truncate max-w-[150px]">{currentUserEmail || 'Guest'}</span>
        </div>
      </div>

      {/* Orders List Container */}
      {userOrders.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-14 h-14 bg-stone-50 border border-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-serif text-base font-bold text-[#1c1917]">No purchases recorded yet</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-light leading-relaxed">
              Explore our versatile, sustainable garments and co-ords to place your very first order at VIVIDHRA.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div 
              key={order.id} 
              className="border border-stone-200 hover:border-stone-300 rounded-2xl overflow-hidden transition-all bg-[#FDFCFB]/45 shadow-xs"
            >
              {/* Card Title Bar */}
              <div className="bg-stone-50 border-b border-stone-200 px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400">Atelier Ledger</span>
                    <p className="font-mono text-stone-900 font-bold">{order.id}</p>
                  </div>
                  <div className="h-6 w-[1px] bg-stone-200 hidden sm:block" />
                  <div className="space-y-0.5 hidden sm:block">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400">Date Logged</span>
                    <p className="font-outfit text-stone-700 font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${getStatusStyle(order.status)}`}>
                    ● {order.status}
                  </span>
                </div>
              </div>

              {/* Items Manifest Column */}
              <div className="p-5 space-y-4">
                <div className="divide-y divide-stone-100">
                  {order.items.map((item: any, idx) => {
                    const matchedProduct = products.find((p) => p.id === item.productId);
                    const name = matchedProduct?.name || item.productName || `Garment Design #${item.productId}`;
                    const image = matchedProduct?.images?.[0] || item.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200";
                    const price = matchedProduct?.price || item.price || 1499;
                    
                    return (
                      <div key={idx} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                        <img 
                          src={image} 
                          alt={name} 
                          referrerPolicy="no-referrer"
                          className="w-14 h-18 object-cover object-center bg-stone-100 rounded-lg border border-stone-150 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-serif text-xs font-bold text-stone-900 leading-snug">
                            {name}
                          </h4>
                          <p className="text-[10px] text-stone-500 font-outfit">
                            Color: <span className="text-stone-700 font-medium">{item.selectedColor || item.color || 'Classic Default'}</span> | 
                            Size: <span className="text-stone-700 font-medium">{item.selectedSize || item.size || 'Fit Custom'}</span>
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-stone-400">
                            <span>Quantity: {item.quantity}</span>
                            <span>•</span>
                            <span>Price: ₹{price}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 self-center">
                          <span className="font-mono text-xs font-bold text-stone-950">
                            ₹{price * item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sizing verification */}
                <div className="border-t border-stone-100 pt-4 text-xs font-outfit">
                  <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Award className="w-4 h-4 text-[#c2a46c]" />
                      <span className="font-bold">Bespoke Fit Guaranteed</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed">
                      Custom-machined and handloom adjusted coordinates verified against your registered organic structure preferences.
                    </p>
                  </div>
                </div>

                {/* Ledger Financial Summary */}
                <div className="border-t border-stone-100 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-outfit">
                  <div className="flex flex-wrap gap-4 text-stone-500 font-mono text-[10px]">
                    <div>Subtotal: <span className="text-stone-800">₹{order.subtotal}</span></div>
                    {order.promoDiscount ? (
                      <div>Promo Discount: <span className="text-red-600">-₹{order.promoDiscount}</span></div>
                    ) : null}
                    <div>Delivery: <span className="text-stone-800">{order.shippingFee === 0 ? "FREE Express" : `₹${order.shippingFee}`}</span></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-stone-500 text-xs font-light">Total Paid:</span>
                    <span className="font-mono text-sm font-bold text-stone-950 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-250">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Actions Button Row */}
                <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-[10px] uppercase tracking-widest font-bold font-outfit rounded-lg text-stone-700 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c2a46c]" />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderedOrderId === order.id}
                    className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold font-outfit transition-all cursor-pointer flex items-center gap-1.5 ${
                      reorderedOrderId === order.id
                        ? 'bg-emerald-600 border border-emerald-600 text-white'
                        : 'bg-stone-900 border border-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    {reorderedOrderId === order.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-white animate-bounce" />
                        <span>Re-ordered!</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-[#c2a46c]" />
                        <span>Re-order Items</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* High-Fidelity Custom Printable E-Invoice Modal Overlay */}
      <AnimatePresence>
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-500 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white text-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-100 flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Toolbar (No-Print) */}
              <div className="no-print bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Printer className="w-4 h-4 text-[#c2a46c]" />
                  <span className="font-serif text-xs font-bold text-stone-800">
                    Atelier Ledger Invoice Preview
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-[#1c1917] hover:bg-[#2e2a27] text-white text-[10px] uppercase tracking-widest font-bold rounded-md transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoiceOrder(null)}
                    className="p-1.5 hover:bg-stone-200 text-stone-500 rounded-full transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Printable Invoice Sheet */}
              <div className="p-8 md:p-12 overflow-y-auto flex-1 bg-white" id="invoice-print-area">
                
                {/* Invoice Body Content */}
                <div className="space-y-8">
                  
                  {/* Header Letterhead */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-stone-200">
                    <div className="space-y-2">
                      {/* Brand Logo Monogram Symbol */}
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif text-2xl font-black tracking-widest text-[#1c1917]">
                          VIVIDHRA
                        </span>
                        <div className="w-2 h-2 rounded-full bg-[#c2a46c]" />
                      </div>
                      <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider leading-relaxed">
                        Mumbai Elite Atelier Suite 104<br />
                        Handloom Textile Registry Hub<br />
                        Maharashtra, India (400001)<br />
                        atelier@vividhra.com
                      </p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-[9px] uppercase font-mono text-stone-500 font-bold rounded">
                        TAX INVOICE
                      </span>
                      <h4 className="font-mono text-base font-bold text-stone-900">{selectedInvoiceOrder.id}</h4>
                      <p className="text-[10px] text-stone-500 font-outfit">
                        Logged: {formatDate(selectedInvoiceOrder.createdAt)}
                      </p>
                      <p className="text-[10px] text-stone-500 font-outfit">
                        Payment: {selectedInvoiceOrder.paymentMethod?.toUpperCase() || "UPI / NET"}
                      </p>
                    </div>
                  </div>

                  {/* Patron details & delivery details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-outfit">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-mono text-stone-400 font-bold block tracking-wider">
                        Registered Patron
                      </span>
                      <p className="font-serif text-stone-900 font-bold text-sm">
                        {selectedInvoiceOrder.customerName}
                      </p>
                      <p className="text-stone-600 text-[11px]">
                        {selectedInvoiceOrder.customerEmail}
                      </p>
                    </div>

                    <div className="space-y-1.5 sm:text-right">
                      <span className="text-[9px] uppercase font-mono text-stone-400 font-bold block tracking-wider">
                        Delivery Gateways
                      </span>
                      <p className="text-stone-800 text-[11px] leading-relaxed">
                        {selectedInvoiceOrder.address}<br />
                        {selectedInvoiceOrder.city}
                      </p>
                      {selectedInvoiceOrder.phone && (
                        <p className="text-stone-500 font-mono text-[10px]">
                          Contact: {selectedInvoiceOrder.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* itemized billing table */}
                  <div className="space-y-2">
                    <div className="border-b border-stone-200 pb-2">
                      <span className="text-[9px] uppercase font-mono text-stone-400 font-bold tracking-widest block">
                        Itemized Fabric Manifest
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-[10px] font-mono text-stone-400 uppercase">
                          <th className="py-2 font-normal">Garment Structure Description</th>
                          <th className="py-2 text-center font-normal">Size</th>
                          <th className="py-2 text-center font-normal">Qty</th>
                          <th className="py-2 text-right font-normal">Unit</th>
                          <th className="py-2 text-right font-normal">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-xs">
                        {selectedInvoiceOrder.items.map((item: any, idx) => {
                          const matchedProduct = products.find((p) => p.id === item.productId);
                          const name = matchedProduct?.name || item.productName || `Garment Design #${item.productId}`;
                          const price = matchedProduct?.price || item.price || 1499;

                          return (
                            <tr key={idx} className="align-top">
                              <td className="py-3">
                                <p className="font-serif font-bold text-stone-900 leading-snug">{name}</p>
                                <p className="text-[10px] text-[#c2a46c] mt-0.5">{item.selectedColor || item.color || 'Atelier Weave'}</p>
                              </td>
                              <td className="py-3 text-center font-mono text-[11px] text-stone-600">
                                {item.selectedSize || item.size || 'Fit Custom'}
                              </td>
                              <td className="py-3 text-center font-mono text-[11px] text-stone-600">
                                {item.quantity}
                              </td>
                              <td className="py-3 text-right font-mono text-[11px] text-stone-600">
                                ₹{price}
                              </td>
                              <td className="py-3 text-right font-mono text-[11px] font-bold text-stone-900">
                                ₹{price * item.quantity}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial calculation blocks */}
                  <div className="border-t border-stone-200 pt-5 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs font-outfit">
                    
                    {/* Atelier Insignia Wax Stamp Design */}
                    <div className="flex items-center space-x-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 max-w-xs">
                      {/* Transparent SVG Peacock Insignia stamp */}
                      <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-[#c2a46c] shadow-inner flex-shrink-0">
                        <span className="font-serif text-sm font-bold">V</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-stone-950">Atelier Approved</p>
                        <p className="text-[9px] text-stone-500 leading-tight">
                          Certified biological organic fibers under Indian Weaving Registry standards.
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-60 space-y-2 text-[11px] font-outfit">
                      <div className="flex justify-between text-stone-500">
                        <span>Items Subtotal</span>
                        <span className="font-mono text-stone-900">₹{selectedInvoiceOrder.subtotal}</span>
                      </div>
                      {selectedInvoiceOrder.promoDiscount ? (
                        <div className="flex justify-between text-stone-500">
                          <span>Promo Discount ({selectedInvoiceOrder.promoCode})</span>
                          <span className="font-mono text-red-600">-₹{selectedInvoiceOrder.promoDiscount}</span>
                        </div>
                      ) : null}
                      <div className="flex justify-between text-stone-500">
                        <span>Express Air Shipping Fee</span>
                        <span className="font-mono text-stone-900">
                          {selectedInvoiceOrder.shippingFee === 0 ? "FREE" : `₹${selectedInvoiceOrder.shippingFee}`}
                        </span>
                      </div>
                      <div className="border-t border-stone-200 pt-2 flex justify-between font-serif text-sm font-bold text-stone-900">
                        <span>Grand Total</span>
                        <span className="font-mono">₹{selectedInvoiceOrder.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Terms */}
                  <div className="pt-8 border-t border-stone-100 text-center space-y-1.5">
                    <p className="text-[9px] text-stone-400 font-mono uppercase tracking-widest">
                      VIVIDHRA &bull; DRESS WITH PURPOSE &bull; ATELIER LEDGER REGISTERED
                    </p>
                    <p className="text-[10px] text-stone-500 leading-relaxed font-light max-w-md mx-auto">
                      Thank you for supporting sustainable luxury coordinates and direct impact weaving. For size changes, contact your dedicated concierge.
                    </p>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
