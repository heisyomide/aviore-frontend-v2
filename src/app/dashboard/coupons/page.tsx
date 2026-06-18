'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Ticket, Copy, Loader2, ArrowUpRight, ShoppingBag, Gift } from 'lucide-react';
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
        const res = await api.get('/coupons/active'); 
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
      icon: <Ticket className="text-[#991B1B]" size={16} />
    });
  };

  const filteredCoupons = coupons.filter(c => {
    if (!c.endDate) return activeTab === 'available';
    const isPast = new Date(c.endDate) < new Date();
    return activeTab === 'available' ? !isPast : isPast;
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#991B1B]" size={26} />
        <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">Syncing Incentives...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 w-full animate-in fade-in duration-500">
      {/* 1. LUXURY HEADER DECK */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <Gift size={14} className="animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Incentive_Registry</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          Artifact <span className="text-zinc-600 font-normal font-sans tracking-normal">Rewards</span>
        </h1>
      </header>

      {/* REWARDS GRID HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/referrals"
          className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-gradient-to-br from-[#161619] to-[#0D0D0D] p-6 transition-all duration-300 hover:border-zinc-800"
        >
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#991B1B]/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="mb-3 flex items-center gap-2.5 text-[#991B1B]">
                <Gift size={16} />
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                  Referral Program
                </span>
              </div>
              <h3 className="text-xl font-mono font-bold uppercase text-white">
                Earn ₦2,500
              </h3>
              <p className="mt-2 text-[11px] font-sans text-zinc-500 leading-relaxed max-w-sm">
                Invite 5 verified accounts and unlock an infrastructure voucher credit usable on standard orders.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">
              <span>Open Referral Center</span>
              <ArrowUpRight size={12} className="text-[#991B1B]" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/vouchers"
          className="group rounded-xl border border-zinc-900 bg-[#111113]/40 p-6 transition-all duration-300 hover:border-zinc-800"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="mb-3 flex items-center gap-2.5 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <Ticket size={16} />
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                  My Vouchers
                </span>
              </div>
              <h3 className="text-xl font-mono font-bold uppercase text-zinc-200 group-hover:text-white transition-colors">
                Voucher Wallet
              </h3>
              <p className="mt-2 text-[11px] font-sans text-zinc-500 leading-relaxed max-w-sm">
                View all tracking codes, system wide reductions, active credits, and operational dates.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-[#991B1B] group-hover:text-red-400 transition-colors">
              <span>View Voucher Wallet</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </Link>
      </div>

      {/* 2. INDUSTRIAL TAB CONTROLLER */}
      <div className="flex gap-8 border-b border-zinc-900/40">
        {['available', 'expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-[#991B1B]' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab}_Coupons
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#991B1B]" />
            )}
          </button>
        ))}
      </div>

      {/* 3. INCENTIVES PIPELINE VIEWPORT */}
      {filteredCoupons.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className={`group relative bg-[#111113] border rounded-xl p-6 transition-all duration-300 flex flex-col justify-between ${
                activeTab === 'expired' 
                  ? 'opacity-30 border-zinc-950 bg-black/40' 
                  : 'border-zinc-900 bg-[#111113]/90 hover:border-zinc-800 shadow-xl'
              }`}
            >
              {/* Floating Validity Badge */}
              <div className="absolute top-6 right-6 text-[7px] font-mono font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2.5 py-1 border border-zinc-900 rounded">
                EXP: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : 'INFINITE'}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className={`text-[7px] font-mono font-bold uppercase px-2.5 py-1 rounded border tracking-widest inline-block ${
                    coupon.type === 'GLOBAL' ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 
                    coupon.type === 'JOINT' ? 'bg-zinc-950 border-[#991B1B]/40 text-red-400' : 
                    'bg-zinc-950 border-zinc-900 text-zinc-500'
                  }`}>
                    {coupon.type === 'GLOBAL' ? 'System_Wide' : 
                     coupon.type === 'JOINT' ? 'Joint_Protocol' : 
                     coupon.vendor?.storeName || 'Vendor_Specific'}
                  </div>
                  
                  <h3 className="text-xl font-mono font-bold text-white tracking-wide pt-2">
                    {coupon.discountType === 'FREE_SHIPPING' ? 'Logistics_Null' : 
                     coupon.discountType === 'PERCENTAGE' ? `${Number(coupon.discountValue)}% Index` : 
                     `₦${Number(coupon.discountValue).toLocaleString()}`}
                  </h3>
                  
                  <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                    Threshold: ₦{(Number(coupon.minOrderValue) || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-zinc-950/60 rounded-lg p-3.5 border border-zinc-900/60">
                   <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                     // {coupon.description || "Active metrics reduction architecture applied directly onto standard workspace registry."}
                   </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-zinc-900/60">
                <div className="space-y-0.5">
                  <p className="text-[7px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Protocol_Code</p>
                  <p className="text-sm font-mono font-bold text-white tracking-widest uppercase">
                    {coupon.code}
                  </p>
                </div>
                
                {activeTab === 'available' && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="p-2.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded border border-zinc-900 hover:border-zinc-800 transition-colors active:scale-[0.96]"
                      title="Copy Code"
                    >
                      <Copy size={12} />
                    </button>
                    
                    <Link 
                      href="/shop"
                      className="group relative px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 overflow-hidden rounded transition-all active:scale-[0.96]"
                    >
                      <span className="relative z-10 flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-white">
                        Deploy <ArrowUpRight size={10} className="text-[#991B1B]" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl text-center bg-[#111113]/20">
          <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-xl mb-4">
            <ShoppingBag size={22} />
          </div>
          <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">Reward_Registry_Empty</p>
          <p className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1 font-sans">Awaiting secure reduction allocations.</p>
        </div>
      )}
    </div>
  );
}