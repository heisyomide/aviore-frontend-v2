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
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300">
      
      {/* BACKGROUND TAP DISMISSAL BOUNDARY */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
        
      {/* OVERALL CONTAINER MODAL LAYER */}
      <div
        className="
          relative
          w-full
          max-w-xl
          bg-[#0D0D0D]
          rounded-t-xl
          md:rounded-xl
          border-t md:border border-zinc-900
          shadow-[0_24px_64px_rgba(0,0,0,0.8)]
          max-h-[90vh]
          md:max-h-[85vh]
          flex
          flex-col
          overflow-hidden
          animate-in
          slide-in-from-bottom md:zoom-in-95
          duration-300
          text-zinc-100
        "
      >

        {/* 1. STICKY SYSTEM HEADER PANEL */}
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
            bg-[#111113]/95
            backdrop-blur-md
            border-b
            border-zinc-900/60
            shrink-0
          "
        >
          <div className="space-y-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-[#991B1B]">
              <Sparkles size={12} className="shrink-0 animate-pulse" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] block truncate">
                Fulfillment_Manifest
              </span>
            </div>

            <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
              Order Summary
            </h2>

            <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest truncate">
              ID: {order.orderNumber || order.id?.slice(-12).toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center active:scale-95 shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* INTERNAL VIEWPORT SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-6 space-y-6 no-scrollbar">
          
          {/* 2. ORIGIN & LOGISTICS TRACKING MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <section className="bg-[#111113] p-4 rounded-lg border border-zinc-900 flex items-center gap-3.5">
              <div className="w-9 h-9 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-center text-zinc-500 shrink-0">
                <Store size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Vendor</p>
                <p className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide leading-tight truncate">
                  {order.vendor?.storeName || "AVIORÈ Registry"}
                </p>
                <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider mt-0.5">Verified Protocol</p>
              </div>
            </section>

            <section className="bg-[#111113] p-4 rounded-lg border border-zinc-900 flex items-center gap-3.5">
              <div className="w-9 h-9 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-center text-zinc-500 shrink-0">
                <Truck size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Logistics_ID</p>
                <p className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide leading-tight truncate">
                  {order.trackingNumber || "PENDING_HANDOFF"}
                </p>
                <p className="text-[8px] font-mono font-bold text-[#991B1B] uppercase tracking-wider mt-0.5 truncate">
                  {order.carrier || "Awaiting Carrier"}
                </p>
              </div>
            </section>
          </div>

          {/* 3. INVENTORY LINE-ITEM PIPELINE */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Package size={13} className="text-zinc-600 shrink-0" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">Inventory_Manifest</span>
              <div className="h-[1px] flex-1 bg-zinc-900/60" />
            </div>
            
            <div className="space-y-2.5">
              {order.items?.map((item: any) => {
                const userReview = item.product?.reviews?.find((r: any) => r.userId === order.userId);
                const hasReply = userReview && userReview.reply;

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center gap-4 p-3.5 bg-[#111113]/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-colors duration-300">
                      <div className="w-12 h-12 rounded border border-zinc-900 overflow-hidden bg-zinc-950 flex-shrink-0 relative">
                        <img 
                          src={item.product?.images?.[0]?.imageUrl || item.product?.image || '/api/placeholder/150/150'} 
                          className="w-full h-full object-cover grayscale opacity-80" 
                          alt="Artifact Source"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-xs font-mono font-bold text-white uppercase tracking-wide truncate">
                          {item.product?.title || item.product?.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest">
                          QTY_UNIT: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="text-xs font-mono font-bold text-zinc-300 tracking-wide">
                          ₦{(Number(item.price || item.priceAtPurchase) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* VENDOR REPLY TIMELINE NODE */}
                    {hasReply && (
                      <div className="ml-4 p-4 bg-zinc-950 rounded-lg border border-zinc-900 border-l-[#991B1B] relative">
                        <div className="flex items-center gap-2 mb-1.5">
                          <MessageSquareQuote size={12} className="text-[#991B1B] shrink-0" />
                          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                            Store_Response
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-zinc-400 leading-relaxed italic">
                          "{userReview.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. DESTINATION METRICS & SETTLEMENT PARSING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                <MapPin size={12} className="text-zinc-600 shrink-0" /> Target_Coordinates
              </div>
              <div className="text-[11px] font-sans text-zinc-500 leading-relaxed bg-[#111113] p-4 rounded-lg border border-zinc-900 min-h-[110px] flex flex-col justify-center">
                <p className="text-zinc-300 font-mono font-bold uppercase text-xs tracking-wide mb-1 truncate">{order.address?.fullName || 'Registered Agent'}</p>
                <p className="truncate">{order.address?.street}</p>
                <p className="truncate">{order.address?.city}, {order.address?.state}</p>
                <span className="text-[#991B1B] font-mono font-bold block mt-1 tracking-wider">{order.address?.phone || order.address?.phoneNumber}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                <CreditCard size={12} className="text-zinc-600 shrink-0" /> Ledger_Settlement
              </div>
              <div className="bg-[#111113] p-4 rounded-lg border border-zinc-900 min-h-[110px] flex flex-col justify-center space-y-2.5">
                <div>
                  <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase block tracking-wider">Gateway Protocol</span>
                  <p className="text-[10px] font-mono font-bold text-[#991B1B] uppercase tracking-widest mt-0.5">
                    {order.payment?.provider || 'Paystack Channel'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase block tracking-wider">Reference Node</span>
                  <p className="text-[9px] font-mono text-zinc-400 truncate tracking-wide">{order.payment?.reference || 'pending_sync'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. METRIC FOOTER TOTAL PANEL */}
        <div className="p-4 bg-[#111113] border-t border-zinc-900/60 shrink-0 space-y-3.5">
          <section className="bg-zinc-950 p-4 border border-zinc-900 rounded-lg text-white relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600 block">Net_Aggregate</span>
                <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                  <ShieldCheck size={12} className="text-[#991B1B]" /> <span>Authorized_Settled</span>
                </div>
              </div>
              <span className="text-xl font-mono font-bold tracking-wide text-white">
                ₦{Number(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </section>

          <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
            AVIORÈ_REGISTRY_PROTOCOL_V3.0
          </p>
        </div>

      </div>
    </div>
  );
}