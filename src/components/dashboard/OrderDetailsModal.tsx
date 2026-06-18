'use client';

import { useEffect } from 'react';
import { X, Package, Truck, CreditCard, Sparkles, ShieldCheck, Store, MapPin, MessageSquareQuote } from 'lucide-react';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  // Prevent background scrolling while the user interacts with the dataset
  useEffect(() => {
    if (order) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300">
      
      {/* BACKGROUND TAP DISMISSAL BOUNDARY */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
        
      {/* OVERALL CONTAINER MODAL LAYER */}
      <div
        className="
          relative
          w-full
          max-w-xl
          bg-[#FDFCFB]
          rounded-t-[2rem]
          md:rounded-[2.5rem]
          border-t md:border border-white/20
          shadow-[0_24px_64px_rgba(0,0,0,0.16)]
          max-h-[90vh]
          md:max-h-[85vh]
          flex
          flex-col
          overflow-hidden
          animate-in
          slide-in-from-bottom md:zoom-in-95
          duration-300
        "
      >

        {/* STICKY ACCESSIBLE HEADER PANEL */}
        <div
          className="
            sticky
            top-0
            z-30
            flex
            items-center
            justify-between
            px-5
            md:px-6
            py-4
            bg-white/95
            backdrop-blur-md
            border-b
            border-zinc-100
            shrink-0
          "
        >
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-[#A4143D]">
              <Sparkles size={11} className="shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] block truncate">
                Fulfillment_Manifest
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tight leading-none">
              Order Summary
            </h2>

            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
              ID: {order.orderNumber || order.id?.slice(-12).toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-zinc-100 hover:bg-[#A4143D] hover:text-white text-zinc-600 transition-all duration-200 flex items-center justify-center active:scale-95 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* INTERNAL VIEWPORT SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 space-y-6 no-scrollbar">
          
          {/* 1. ORIGIN & LOGISTICS TRACKING MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <section className="bg-white p-4 rounded-2xl border border-[#A4143D]/10 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A4143D]/5 rounded-xl flex items-center justify-center text-[#A4143D] shrink-0">
                <Store size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vendor</p>
                <p className="text-xs font-black text-gray-900 uppercase italic leading-tight truncate">
                  {order.vendor?.storeName || "AVIORÈ Registry"}
                </p>
                <p className="text-[8px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Verified Source</p>
              </div>
            </section>

            <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                <Truck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Logistics_ID</p>
                <p className="text-xs font-black text-gray-900 uppercase italic leading-tight truncate">
                  {order.trackingNumber || "PENDING_HANDOFF"}
                </p>
                <p className="text-[8px] font-bold text-[#A4143D] uppercase tracking-widest mt-0.5 truncate">
                  {order.carrier || "Awaiting Carrier"}
                </p>
              </div>
            </section>
          </div>

          {/* 2. INVENTORY LINE-ITEM COMPONENT PIPELINE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-[#A4143D] shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            
            <div className="space-y-3">
              {order.items?.map((item: any) => {
                const userReview = item.product?.reviews?.find((r: any) => r.userId === order.userId);
                const hasReply = userReview && userReview.reply;

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                        <img 
                          src={item.product?.images?.[0]?.imageUrl || item.product?.image || '/api/placeholder/150/150'} 
                          className="w-full h-full object-cover" 
                          alt="Artifact Source"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 uppercase italic truncate tracking-tight">
                          {item.product?.title || item.product?.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-black uppercase mt-0.5 tracking-widest">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="text-xs font-black text-gray-900 italic tracking-tighter">
                          ₦{(Number(item.price || item.priceAtPurchase) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* EXTRACTED VENDOR REPLY CHANNELS */}
                    {hasReply && (
                      <div className="ml-6 p-4 bg-[#A4143D]/5 rounded-2xl border-l-2 border-[#A4143D] relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MessageSquareQuote size={12} className="text-[#A4143D] shrink-0" />
                          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A4143D]">
                            Store_Response
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-gray-700 leading-relaxed italic">
                          "{userReview.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. DESTINATION METRICS & SETTLEMENT PARSING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                <MapPin size={12} className="text-[#A4143D] shrink-0" /> Delivery Target
              </div>
              <div className="text-[11px] font-bold text-gray-500 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100 shadow-sm min-h-[100px] flex flex-col justify-center">
                <p className="text-gray-900 uppercase font-black mb-1 truncate">{order.address?.fullName || 'Registered User'}</p>
                <p className="truncate">{order.address?.street}</p>
                <p className="truncate">{order.address?.city}, {order.address?.state}</p>
                <span className="text-[#A4143D] block mt-1 font-black">{order.address?.phone || order.address?.phoneNumber}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                <CreditCard size={12} className="text-[#A4143D] shrink-0" /> Settlement Engine
              </div>
              <div className="bg-[#A4143D]/5 p-4 rounded-2xl border border-[#A4143D]/10 min-h-[100px] flex flex-col justify-center space-y-2">
                <div>
                  <span className="text-[8px] text-gray-400 font-black uppercase block">Gateway Channel</span>
                  <p className="text-[10px] font-black text-[#A4143D] uppercase tracking-wider mt-0.5">
                    {order.payment?.provider || 'Paystack Gateway'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] text-gray-400 font-black uppercase block">Reference Token</span>
                  <p className="text-[9px] font-bold text-gray-700 truncate">{order.payment?.reference || 'pending_sync'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER TOTAL PANEL */}
        <div className="p-4 bg-white border-t border-zinc-100 shrink-0 space-y-3">
          <section className="bg-gray-900 p-5 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A4143D]/20 blur-[40px] -mr-16 -mt-16 pointer-events-none" />
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Net_Total</span>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  <ShieldCheck size={12} className="text-[#A4143D]" /> <span>Authorized</span>
                </div>
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-[#A4143D]">
                ₦{Number(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </section>

          <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
            AVIORÈ_REGISTRY_PROTOCOL_V3.0
          </p>
        </div>

      </div>
    </div>
  );
}