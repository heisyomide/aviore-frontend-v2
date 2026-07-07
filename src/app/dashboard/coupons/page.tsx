'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Ticket, Copy, Check, Loader2, ShoppingBag, ArrowUpRight, Gift, Sparkles, Percent } from 'lucide-react';
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await api.get('/coupons/active'); 
        setCoupons(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Coupon_Fetch_Error:", error);
        toast.error("Network Error", { description: "Failed to retrieve rewards data." });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    
    toast.success("Code Copied", { 
      description: `${code} applied to clipboard buffer setup.`,
      icon: <Ticket className="text-[#A4143D]" size={14} />
    });
  };

  const filteredCoupons = coupons.filter(c => {
    if (!c.endDate) return activeTab === 'available';
    const isPast = new Date(c.endDate).getTime() < Date.now();
    return activeTab === 'available' ? !isPast : isPast;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-zinc-900" size={24} strokeWidth={1.5} />
        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Loading Rewards Hub</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-sans antialiased animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER SECTION */}
      <header className="mb-12 flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Sparkles size={12} className="animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.35em]">Exclusive Privileges</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
              Incentives <span className="text-zinc-300 font-light font-serif lowercase italic">and</span> Rewards
            </h1>
            <p className="text-xs text-zinc-400 font-light mt-2 max-w-md">
              Unlock exclusive storewide discounts, custom vendor tier rewards, and premium referral packages built for our patrons.
            </p>
          </div>
        </div>
      </header>

      {/* 2. REFERRAL & WALLET HUB CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Link
          href="/dashboard/referrals"
          className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/40 p-6 transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-100/40"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#A4143D]">
                <Gift size={16} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Referral Campaign</span>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Earn ₦2,500 Voucher</h3>
                <p className="mt-1 text-xs text-zinc-500 font-light leading-relaxed max-w-sm">
                  Invite 5 verified accounts onto the platform to instantly deliver a voucher usable on orders matching eligibility scales.
                </p>
              </div>
            </div>
            <div className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/vouchers"
          className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/40 p-6 transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-100/40"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Ticket size={16} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Personal Vault</span>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Voucher Ledger</h3>
                <p className="mt-1 text-xs text-zinc-500 font-light leading-relaxed max-w-sm">
                  Review claimable system balances, active point codes, specific item exemptions, and personal dynamic wallet balances.
                </p>
              </div>
            </div>
            <div className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      {/* 3. SUB-NAVIGATION TAB SWITCHES */}
      <div className="flex gap-8 border-b border-zinc-100 mb-8">
        {(['available', 'expired'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-zinc-900' : 'text-zinc-300 hover:text-zinc-400'
            }`}
          >
            {tab} Offers ({coupons.filter(c => {
              if (!c.endDate) return tab === 'available';
              const past = new Date(c.endDate).getTime() < Date.now();
              return tab === 'available' ? !past : past;
            }).length})
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-zinc-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4. ACTIVE REWARDS MAP GRID */}
      {filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCoupons.map((coupon) => {
            const isCouponExpired = activeTab === 'expired';
            
            return (
              <div 
                key={coupon.id}
                className={`relative flex flex-col md:flex-row bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isCouponExpired 
                    ? 'opacity-40 grayscale border-zinc-100 bg-zinc-50/50' 
                    : 'border-zinc-200/80 hover:border-zinc-400/80 hover:shadow-md'
                }`}
              >
                
                {/* Visual Left/Top Accent Ticket Stamp Column */}
                <div className={`flex flex-row md:flex-col items-center justify-between p-4 md:p-6 border-b md:border-b-0 md:border-r border-dashed border-zinc-200 w-full md:w-44 shrink-0 text-center md:text-left ${
                  isCouponExpired ? 'bg-zinc-100/50' : 'bg-zinc-50/60'
                }`}>
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2 w-full justify-between md:justify-start">
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                      coupon.type === 'GLOBAL' ? 'bg-zinc-900 text-white' : 
                      coupon.type === 'JOINT' ? 'bg-[#A4143D] text-white' : 
                      'bg-zinc-200 text-zinc-700'
                    }`}>
                      {coupon.type === 'GLOBAL' ? 'Storewide' : 
                       coupon.type === 'JOINT' ? 'Joint Venture' : 
                       coupon.vendor?.storeName || 'Exclusive'}
                    </span>
                    
                    <div className="text-[10px] font-mono text-zinc-400 uppercase mt-0 md:mt-2">
                      {coupon.endDate ? `Till: ${new Date(coupon.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}` : 'Infinite Term'}
                    </div>
                  </div>
                </div>

                {/* Primary Reward Descriptive Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight leading-none">
                      {coupon.discountType === 'FREE_SHIPPING' ? (
                        <span className="flex items-center gap-1.5 text-zinc-900">Free Shipping</span>
                      ) : coupon.discountType === 'PERCENTAGE' ? (
                        `${Number(coupon.discountValue)}% Off Voucher`
                      ) : (
                        `₦${Number(coupon.discountValue || 0).toLocaleString()}`
                      )}
                    </h3>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                      Min Threshold: ₦{Number(coupon.minOrderValue || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500 font-light mt-3 leading-relaxed">
                      {coupon.description || "Applicable toward payment steps during immediate secure checkout workflow configurations."}
                    </p>
                  </div>

                  {/* Operational Footer Bar Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-300">Checkout Key</span>
                      <p className="text-sm font-bold text-zinc-900 tracking-wider font-mono select-all uppercase">
                        {coupon.code}
                      </p>
                    </div>

                    {!isCouponExpired && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => copyCode(coupon.code)}
                          className="p-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl transition-all active:scale-95"
                          title="Copy Code Key"
                        >
                          {copiedCode === coupon.code ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                        
                        <Link 
                          href="/shop"
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                        >
                          Redeem <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Ledger State Component */
        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/20 animate-in fade-in duration-300">
          <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl mb-4 text-zinc-300">
            <ShoppingBag size={24} strokeWidth={1.5} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">Vault Empty</p>
          <p className="text-[10px] text-zinc-400 font-light mt-1 max-w-[200px]">
            No matching reward vouchers found inside this section parameter.
          </p>
        </div>
      )}
    </div>
  );
}