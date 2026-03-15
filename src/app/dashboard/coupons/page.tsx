'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Ticket, Copy, Loader2, Sparkles, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'GLOBAL' | 'VENDOR' | 'JOINT';
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue: number; // Updated to match latest Prisma schema
  startDate: string;
  endDate: string; // Updated to match latest Prisma schema
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
        // Fetches your Admin-created Global/Joint and Vendor-specific coupons
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
      description: `${code} is ready for the Checkout Security Protocol.`,
      icon: <Ticket className="text-[#A4143D]" size={16} />
    });
  };

  const filteredCoupons = coupons.filter(c => {
    if (!c.endDate) return activeTab === 'available';
    const isPast = new Date(c.endDate) < new Date();
    return activeTab === 'available' ? !isPast : isPast;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Sparkles size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Registry_Benefits</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
          Artifact Rewards
        </h1>
        <p className="text-xs font-medium text-gray-400 italic">
          Manage your platform privileges and vendor-specific deductions.
        </p>
      </div>

      {/* LUXURY TABS */}
      <div className="flex gap-10 border-b border-gray-100">
        {['available', 'expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-5 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-[#A4143D]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A4143D] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* REWARD GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-200" size={32} />
        </div>
      ) : filteredCoupons.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCoupons.map((coupon) => (
            <div 
              key={coupon.id}
              className={`group relative bg-white border rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 ${
                activeTab === 'expired' ? 'opacity-60 grayscale border-gray-100' : 'border-gray-100 hover:border-[#A4143D]/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${
                    coupon.type === 'GLOBAL' ? 'bg-gray-900 text-white' : 
                    coupon.type === 'JOINT' ? 'bg-indigo-600 text-white' : 
                    'bg-[#FBE9E3] text-[#A4143D]'
                  }`}>
                    {coupon.type === 'GLOBAL' ? 'Platform Wide' : 
                     coupon.type === 'JOINT' ? 'Campaign Reward' : 
                     coupon.vendor?.storeName || 'Vendor Exclusive'}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter pt-2">
                    {coupon.discountType === 'FREE_SHIPPING' ? 'Free Logistics' : 
                     coupon.discountType === 'PERCENTAGE' ? `${Number(coupon.discountValue)}% Privilege` : 
                     `₦${Number(coupon.discountValue).toLocaleString()} Deduct`}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Threshold: ₦{(Number(coupon.minOrderValue) || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-3xl text-[#A4143D] group-hover:bg-[#FBE9E3] transition-colors">
                  <Ticket size={24} />
                </div>
              </div>

              <p className="text-[10px] text-gray-500 font-medium italic mb-6 line-clamp-1">
                {coupon.description || "Applicable to selected artifacts in the registry."}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Protocol Code</p>
                  <p className="text-sm font-black text-gray-900 tracking-widest select-all uppercase">
                    {coupon.code}
                  </p>
                </div>
                
                {activeTab === 'available' && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyCode(coupon.code)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all border border-transparent"
                      title="Copy Code"
                    >
                      <Copy size={16} />
                    </button>
                    <Link 
                      href="/shop"
                      className="flex items-center gap-2 px-5 py-3 bg-[#A4143D] text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-[#A4143D]/20"
                    >
                      Use Now <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="absolute top-8 right-8 text-[8px] font-bold text-gray-300 uppercase italic">
                Valid Until: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'Infinite'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center border border-dashed border-gray-200 rounded-[4rem] bg-gray-50/30">
           <ShoppingBag size={40} className="mx-auto text-gray-200 mb-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">No active rewards found.</p>
        </div>
      )}
    </div>
  );
}