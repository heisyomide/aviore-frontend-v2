'use client';

import { useEffect } from 'react';
import { X, Package, Truck, CreditCard, ShieldCheck, Store, MapPin, MessageSquareQuote } from 'lucide-react';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
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
    <div className="fixed inset-0 z-[100] bg-zinc-950/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 transition-all duration-200">
      
      {/* BACKDROP ACTION BOUNDARY */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
        
      {/* MODAL STRUCTURE SHELL (Clean Minimalist White) */}
      <div
        className="
          relative
          w-full
          max-w-xl
          bg-white
          rounded-t-3xl
          md:rounded-2xl
          border border-zinc-200
          shadow-2xl
          max-h-[92vh]
          md:max-h-[85vh]
          flex
          flex-col
          overflow-hidden
          animate-in
          slide-in-from-bottom-4 md:scale-95
          duration-200
          text-zinc-950
        "
      >
        {/* SYSTEM MODAL HEADER */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-5 bg-white border-b border-zinc-100 shrink-0">
          <div className="space-y-0.5 min-w-0 pr-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
              Fulfillment Statement
            </span>
            <h2 className="text-base font-black uppercase tracking-tight text-zinc-900">
              Order Details
            </h2>
            <p className="text-[9px] font-bold font-mono text-[#A4143D] uppercase tracking-wider">
              ID: {order.orderNumber || order.id?.slice(-12).toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-950 transition-all flex items-center justify-center active:scale-95 shrink-0"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* MAIN VIEWPORT PORT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
          
          {/* VENDOR PROFILE & LINE CARRIER CODES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-500 shrink-0">
                <Store size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Origin Merchant</p>
                <p className="text-xs font-extrabold text-zinc-950 uppercase tracking-tight truncate">
                  {order.vendor?.storeName || "AVIORÈ Registry"}
                </p>
              </div>
            </section>

            <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-500 shrink-0">
                <Truck size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Logistics Ref</p>
                <p className="text-xs font-extrabold text-zinc-950 uppercase tracking-tight truncate">
                  {order.trackingNumber || "AWAITING_HANDOFF"}
                </p>
                <p className="text-[8px] font-black text-[#A4143D] uppercase tracking-wider mt-0.5 truncate">
                  {order.carrier || "Standard Dispatch"}
                </p>
              </div>
            </section>
          </div>

          {/* INVENTORY MANIFEST */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <Package size={13} className="text-zinc-400 shrink-0" /> 
              <span>Items Summary</span>
              <div className="h-[1px] flex-1 bg-zinc-100" />
            </div>
            
            <div className="divide-y divide-zinc-100">
              {order.items?.map((item: any) => {
                const userReview = item.product?.reviews?.find((r: any) => r.userId === order.userId);
                const hasReply = userReview && userReview.reply;

                return (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 flex-shrink-0 relative">
                        <img 
                          src={item.product?.images?.[0]?.imageUrl || item.product?.image || '/api/placeholder/150/150'} 
                          className="w-full h-full object-cover" 
                          alt="Product Asset"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-xs font-extrabold text-zinc-950 uppercase tracking-tight truncate">
                          {item.product?.title || item.product?.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="text-xs font-black text-zinc-950 tracking-tight">
                          ₦{(Number(item.price || item.priceAtPurchase) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* VENDOR REPLY CORNER */}
                    {hasReply && (
                      <div className="ml-4 p-3.5 bg-zinc-50 border-l-2 border-[#A4143D] rounded-r-xl space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MessageSquareQuote size={12} className="text-[#A4143D] shrink-0" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                            Merchant Response
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed italic">
                          "{userReview.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ROUTING DATA & PROTOCOL SYSTEMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <MapPin size={13} className="text-zinc-400 shrink-0" /> 
                <span>Shipping Destination</span>
              </div>
              <div className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-200 p-4 rounded-xl min-h-[110px] flex flex-col justify-center">
                <p className="text-zinc-950 font-extrabold uppercase text-xs tracking-tight mb-1 truncate">
                  {order.address?.fullName || 'Registered Agent'}
                </p>
                <p className="truncate text-zinc-600">{order.address?.street}</p>
                <p className="truncate text-zinc-500">{order.address?.city}, {order.address?.state}</p>
                <span className="text-[#A4143D] font-mono font-bold block mt-1 tracking-wide">
                  {order.address?.phone || order.address?.phoneNumber}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <CreditCard size={13} className="text-zinc-400 shrink-0" /> 
                <span>Settlement Node</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl min-h-[110px] flex flex-col justify-center space-y-2.5">
                <div>
                  <span className="text-[8px] text-zinc-400 font-black uppercase block tracking-wider">Gateway Channel</span>
                  <p className="text-[10px] font-extrabold text-zinc-950 uppercase tracking-wider mt-0.5">
                    {order.payment?.provider || 'Paystack Gateway'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-400 font-black uppercase block tracking-wider">Reference Reference</span>
                  <p className="text-[10px] font-mono text-zinc-500 truncate tracking-tight mt-0.5">
                    {order.payment?.reference || 'sync_completed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC BOTTOM BAR AGGREGATE */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 shrink-0 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Total Amount</span>
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                <ShieldCheck size={12} className="text-emerald-600" /> 
                <span>Payment Authorized</span>
              </div>
            </div>
            <span className="text-xl font-black text-zinc-950 tracking-tight">
              ₦{Number(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}