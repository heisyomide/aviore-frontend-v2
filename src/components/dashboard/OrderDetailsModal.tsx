'use client';

import { X, Package, Truck, CreditCard, Sparkles, ShieldCheck, Store, MapPin, MessageSquareQuote } from 'lucide-react';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

return (
  <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md overflow-y-auto">
    
    {/* CENTER WRAPPER */}
    <div className="min-h-full flex items-center justify-center px-4 py-10 md:py-16">
      
      {/* MODAL */}
      <div
        className="
          relative
          w-full
          max-w-2xl
          bg-[#FDFCFB]
          rounded-[2.5rem]
          md:rounded-[3rem]
          border border-white/20
          shadow-[0_20px_80px_rgba(0,0,0,0.12)]
          overflow-hidden
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >

        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-30
            flex
            items-center
            justify-between
            px-5
            md:px-8
            py-5
            bg-white/90
            backdrop-blur-xl
            border-b
            border-zinc-100
          "
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Sparkles size={12} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em]">
                Fulfillment_Manifest
              </span>
            </div>

            <h2
              className="
                text-xl
                md:text-2xl
                font-black
                text-gray-900
                uppercase
                italic
                tracking-tight
                leading-none
              "
            >
              Order Summary
            </h2>

            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ID: {order.orderNumber || order.id?.slice(-12).toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              h-11
              w-11
              rounded-full
              bg-zinc-100
              hover:bg-[#A4143D]
              hover:text-white
              transition-all
              duration-300
              flex
              items-center
              justify-center
              active:scale-95
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-5 md:px-8 py-6 md:py-8 space-y-8 md:space-y-10 pb-14">
         
        </div>
      
          {/* 1. ORIGIN & LOGISTICS HUB */}
          <div className="grid md:grid-cols-2 gap-4">
            <section className="bg-white p-6 rounded-[2.5rem] border border-[#A4143D]/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-[#A4143D]/5 rounded-2xl flex items-center justify-center text-[#A4143D]">
                <Store size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vendor</p>
                <p className="text-sm font-black text-gray-900 uppercase italic leading-tight truncate">
                  {order.vendor?.storeName || "Aviore Registry"}
                </p>
                <p className="text-[8px] font-bold text-green-600 uppercase tracking-widest mt-1">Verified Source</p>
              </div>
            </section>

            <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Truck size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Logistics_ID</p>
                <p className="text-sm font-black text-gray-900 uppercase italic leading-tight truncate">
                  {order.trackingNumber || "PENDING_HANDOFF"}
                </p>
                <p className="text-[8px] font-bold text-[#A4143D] uppercase tracking-widest mt-1">
                  {order.carrier || "Awaiting Carrier"}
                </p>
              </div>
            </section>
          </div>

          {/* 2. ARTIFACT BREAKDOWN & VENDOR REPLIES */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Package size={16} className="text-[#A4143D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Inventory</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            
            <div className="grid gap-6">
              {order.items?.map((item: any) => {
                const userReview = item.product?.reviews?.find((r: any) => r.userId === order.userId);
                const hasReply = userReview && userReview.reply;

                return (
                  <div key={item.id} className="space-y-4">
                    <div className="flex items-center gap-5 p-5 bg-white rounded-[2rem] border border-gray-100 group transition-all duration-500">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img 
                          src={item.product?.images?.[0]?.imageUrl || item.product?.image || '/api/placeholder/150/150'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt="Artifact"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 uppercase italic truncate tracking-tight">{item.product?.title || item.product?.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 italic tracking-tighter">
                          ₦{(Number(item.price || item.priceAtPurchase) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {hasReply && (
                      <div className="ml-8 p-6 bg-[#A4143D]/5 rounded-[2rem] border-l-4 border-[#A4143D] relative animate-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquareQuote size={14} className="text-[#A4143D]" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A4143D]">
                            Store_Response
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-700 leading-relaxed italic">
                          "{userReview.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. DESTINATION & SETTLEMENT */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <MapPin size={14} className="text-[#A4143D]" /> Destination Address
              </div>
              <div className="text-[11px] font-bold text-gray-500 leading-relaxed bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm min-h-[120px]">
                <p className="text-gray-900 uppercase font-black mb-2">{order.address?.fullName || 'Registered User'}</p>
                <p>{order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state}</p>
                <span className="text-[#A4143D] block mt-2 font-black">{order.address?.phone || order.address?.phoneNumber}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <CreditCard size={14} className="text-[#A4143D]" /> Settlement
              </div>
              <div className="bg-[#A4143D]/5 p-6 rounded-[2rem] border border-[#A4143D]/10 space-y-3 min-h-[120px]">
                <p className="text-[10px] font-black text-[#A4143D] uppercase tracking-widest leading-none">
                  {order.payment?.provider || 'Secure_Gateway'}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-400 font-black uppercase">Reference</span>
                  <p className="text-[10px] font-bold text-gray-700 truncate">{order.payment?.reference || 'pending_sync'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. FINAL VALUATION */}
          <section className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#A4143D]/20 blur-[60px] -mr-20 -mt-20" />
            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Net_Total</span>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <ShieldCheck size={14} className="text-[#A4143D]" /> <span>Authorized</span>
                </div>
              </div>
              <span className="text-4xl font-black italic tracking-tighter text-[#A4143D]">
                ₦{Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </section>

          <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] pt-4">
            Aviore_Registry_Protocol_v3.0
          </p>
        </div>
      </div>
    </div>
  );
}