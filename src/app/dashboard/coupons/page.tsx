'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Ticket, Copy, Loader2, Sparkles, ShoppingBag, ArrowUpRight, Zap, Gift } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'GLOBAL' | 'VENDOR' | 'JOINT';
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  vendor?: { storeName: string };
}

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'expired'>('available');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vendor/marketing/active'); 
        setCoupons(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error("PROTOCOL_ERROR", { description: "Failed to synchronize artifact rewards." });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("CODE_COPIED", { 
      description: `${code} is ready for Checkout Security Protocol.`,
      icon: <Ticket className="text-[#A4143D]" size={16} />
    });
  };

  const filteredCoupons = coupons.filter(c => {
    if (!c.endDate) return activeTab === 'available';
    const isPast = new Date(c.endDate) < new Date();
    return activeTab === 'available' ? !isPast : isPast;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HEADER SECTION: Rule 1 (Identity Protocol) */}
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Gift size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Incentive_Registry</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
          Artifact <span className="text-zinc-200">Rewards</span>
        </h1>
      </header>

      {/* 2. TAB HUD: Industrial Control System */}
      <div className="flex gap-10 border-b border-zinc-100">
        {['available', 'expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
              activeTab === tab ? 'text-[#A4143D]' : 'text-zinc-300 hover:text-zinc-600'
            }`}
          >
            {tab}_Incentives
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A4143D] rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* 3. REWARD GRID */}
      {filteredCoupons.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className={`group relative bg-white border-2 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50 ${
                activeTab === 'expired' ? 'opacity-40 grayscale border-zinc-50' : 'border-zinc-50 hover:border-[#A4143D]/20'
              }`}
            >
              {/* Floating Validity Badge */}
              <div className="absolute top-8 right-8 text-[8px] font-black text-zinc-300 uppercase italic tracking-widest bg-zinc-50 px-3 py-1 rounded-full">
                Expiry: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString().toUpperCase() : 'INFINITE_NODE'}
              </div>

              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] inline-block ${
                    coupon.type === 'GLOBAL' ? 'bg-zinc-900 text-white' : 
                    coupon.type === 'JOINT' ? 'bg-[#A4143D] text-white' : 
                    'bg-zinc-100 text-zinc-500'
                  }`}>
                    {coupon.type === 'GLOBAL' ? 'System_Wide' : 
                     coupon.type === 'JOINT' ? 'Joint_Protocol' : 
                     coupon.vendor?.storeName || 'Vendor_Specific'}
                  </div>
                  
                  <h3 className="text-4xl font-black text-zinc-900 italic tracking-tighter leading-none pt-4 uppercase">
                    {coupon.discountType === 'FREE_SHIPPING' ? 'Logistics_Null' : 
                     coupon.discountType === 'PERCENTAGE' ? `${Number(coupon.discountValue)}% Index` : 
                     `₦${Number(coupon.discountValue).toLocaleString()}`}
                  </h3>
                  
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] font-mono">
                    Threshold: ₦{(Number(coupon.minOrderValue) || 0).toLocaleString().padStart(6, '0')}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-3xl p-6 mb-8 border border-zinc-100 group-hover:bg-zinc-100/50 transition-colors">
                 <p className="text-[10px] text-zinc-500 font-bold italic uppercase tracking-tight leading-relaxed">
                   // {coupon.description || "Active reduction protocol applied to selected artifact nodes."}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">Protocol_Code</p>
                  <p className="text-lg font-black text-zinc-900 tracking-[0.2em] uppercase font-mono">
                    {coupon.code}
                  </p>
                </div>
                
                {activeTab === 'available' && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="p-4 bg-zinc-50 hover:bg-zinc-900 hover:text-white text-zinc-400 rounded-2xl transition-all border border-zinc-100 active:scale-95"
                      title="Sync Code"
                    >
                      <Copy size={16} />
                    </button>
                    
                    <Link 
                      href="/shop"
                      className="group relative px-8 py-4 bg-black overflow-hidden rounded-2xl transition-all active:scale-95 shadow-xl shadow-zinc-200"
                    >
                      <span className="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Deploy <ArrowUpRight size={14} />
                      </span>
                      <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[4rem] text-center bg-zinc-50/20">
            <ShoppingBag size={48} className="text-zinc-100 mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-300">Reward_Registry_Empty</p>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-2 italic">Awaiting new incentive nodes...</p>
        </div>
      )}
    </div>
  );
}