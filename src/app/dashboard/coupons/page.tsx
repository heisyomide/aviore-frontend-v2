'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Ticket, Copy, Loader2, ShoppingBag, ArrowUpRight, Gift } from 'lucide-react';
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
        console.error("Coupon_Fetch_Error:", error);
        toast.error("Error", { description: "Failed to load active coupons." });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code Copied", { 
      description: `${code} is ready to use at checkout.`,
      icon: <Ticket className="text-[#A4143D]" size={16} />
    });
  };

  const filteredCoupons = coupons.filter(c => {
    if (!c.endDate) return activeTab === 'available';
    const isPast = new Date(c.endDate).getTime() < Date.now();
    return activeTab === 'available' ? !isPast : isPast;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Gift size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Incentives & Rewards</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Artifact <span className="text-zinc-300 font-medium">Rewards</span>
        </h1>
      </header>

      {/* REWARDS HUB LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/referrals"
          className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:border-[#A4143D]/20 hover:shadow-xl hover:shadow-zinc-100/50"
        >
          <div className="mb-4 flex items-center gap-3 text-[#A4143D]">
            <Gift size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Referral Program
            </span>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            Earn ₦2,500
          </h3>
          <p className="mt-2 text-xs text-zinc-500 max-w-sm leading-relaxed">
            Invite 5 verified customers and unlock a ₦2,500 voucher usable on orders above ₦15,000.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#A4143D]">
            Open Referral Center
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard/vouchers"
          className="group rounded-2xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:border-[#A4143D]/20 hover:shadow-xl hover:shadow-zinc-100/50"
        >
          <div className="mb-4 flex items-center gap-3 text-[#A4143D]">
            <Ticket size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Voucher Wallet
            </span>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            My Vouchers
          </h3>
          <p className="mt-2 text-xs text-zinc-500 max-w-sm leading-relaxed">
            View all referral rewards, active vouchers, redeemed codes, and expiration terms.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#A4143D]">
            View Voucher Wallet
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex gap-8 border-b border-zinc-100">
        {(['available', 'expired'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-[#A4143D]' : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            {tab} Rewards
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#A4143D] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 3. REWARDS GRID */}
      {filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className={`group relative bg-white border rounded-2xl p-6 transition-all duration-300 ${
                activeTab === 'expired' 
                  ? 'opacity-50 grayscale border-zinc-100' 
                  : 'border-zinc-200 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              {/* Floating Expiry */}
              <div className="absolute top-6 right-6 text-[9px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-3 py-1 rounded-md">
                {coupon.endDate ? `Expires: ${new Date(coupon.endDate).toLocaleDateString()}` : 'No Expiry'}
              </div>

              <div className="space-y-4">
                <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-md tracking-wider inline-block ${
                  coupon.type === 'GLOBAL' ? 'bg-zinc-900 text-white' : 
                  coupon.type === 'JOINT' ? 'bg-[#A4143D] text-white' : 
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  {coupon.type === 'GLOBAL' ? 'Storewide' : 
                   coupon.type === 'JOINT' ? 'Joint Offer' : 
                   coupon.vendor?.storeName || 'Vendor Exclusive'}
                </span>
                
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tight leading-none">
                    {coupon.discountType === 'FREE_SHIPPING' ? 'Free Shipping' : 
                     coupon.discountType === 'PERCENTAGE' ? `${Number(coupon.discountValue)}% Off` : 
                     `₦${Number(coupon.discountValue).toLocaleString()}`}
                  </h3>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Minimum Order: ₦{Number(coupon.minOrderValue || 0).toLocaleString()}
                  </p>
                </div>

                <p className="text-xs text-zinc-500 font-medium leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
                  {coupon.description || "Valid for use on items across matching collections at checkout."}
                </p>
              </div>

              {/* Action Bottom Bar */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">Coupon Code</p>
                  <p className="text-md font-bold text-zinc-900 tracking-widest uppercase font-mono">
                    {coupon.code}
                  </p>
                </div>
                
                {activeTab === 'available' && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="p-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 rounded-xl transition-all border border-zinc-200/60 active:scale-95"
                      title="Copy Code"
                    >
                      <Copy size={14} />
                    </button>
                    
                    <Link 
                      href="/shop"
                      className="flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
                    >
                      Use Code <ArrowUpRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
          <ShoppingBag size={36} className="text-zinc-300 mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">No Rewards Found</p>
          <p className="text-[10px] text-zinc-400 mt-1 italic">Check back later for active discount offers.</p>
        </div>
      )}
    </div>
  );
}