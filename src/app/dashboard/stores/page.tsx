'use client';

import { useState, useEffect } from 'react';
import { Store, Star, Loader2, ArrowUpRight, UserMinus, Heart, Inbox } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';

export default function FollowedVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowedVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/following');
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Registry Sync Error:", err);
      toast.error("Error", { description: "Failed to align your merchant following records." });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (vendorId: string) => {
    const confirmAction = window.confirm("Disconnect your updates from this vendor profile?");
    if (!confirmAction) return;
    
    try {
      await api.delete(`/vendors/${vendorId}/unfollow`);
      setVendors(prev => prev.filter(v => (v.vendor?.id || v.id) !== vendorId));
      toast.success("Connection Removed", { description: "You are no longer following this store account." });
    } catch (err) {
      console.error("Action Error:", err);
      toast.error("Action Error", { description: "Could not alter store following parameters." });
    }
  };

  useEffect(() => { 
    fetchFollowedVendors(); 
  }, []);

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
          <Heart size={14} className="text-[#A4143D]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Saved Partnerships</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Favorite <span className="text-zinc-300 font-medium">Vendors</span>
        </h1>
      </header>

      {/* 2. VENDOR SHOWCASE GRID */}
      {vendors.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
          <Inbox size={36} className="text-zinc-300 mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Registry Empty</p>
          <p className="text-[10px] text-zinc-400 mt-1 italic">You haven't added any favorite vendors to your catalog feeds yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((item) => {
            const vendorData = item.vendor || item;
            const vendorId = vendorData.id;
            const storeName = vendorData.storeName || "Premium Storefront";

            return (
              <div 
                key={item.id || vendorId} 
                className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 transition-all duration-300 hover:border-zinc-400"
              >
                {/* Micro Online Pulse Identifier */}
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 rounded-md border border-zinc-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Active</span>
                </div>

                <div className="flex items-start gap-5">
                  {/* Clean Square Minimal Icon Container */}
                  <div className="bg-zinc-50 p-4 rounded-xl text-zinc-400 border border-zinc-200 group-hover:text-[#A4143D] transition-colors shrink-0">
                    <Store size={24} />
                  </div>

                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black uppercase text-zinc-900 leading-none truncate pr-16">
                        {storeName}
                      </h3>
                      
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-[#A4143D] fill-[#A4143D]" />
                          <span className="text-xs font-bold text-zinc-900 tracking-tight">
                            {vendorData.rating ? Number(vendorData.rating).toFixed(1) : '0.0'}
                          </span>
                        </div>
                        <div className="h-2.5 w-px bg-zinc-200" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {vendorData.followersCount?.toLocaleString() || '0'} Followers
                        </span>
                      </div>
                    </div>

                    {/* Integrated Action Row Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-100">
                      <Link 
                        href={`/vendors/${vendorId}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-black text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                      >
                        Enter Catalog
                        <ArrowUpRight size={12} className="text-zinc-400" />
                      </Link>

                      <button 
                        onClick={() => handleUnfollow(vendorId)}
                        className="p-3 bg-white text-zinc-400 hover:text-red-600 border border-zinc-200 hover:border-zinc-300 rounded-xl transition-all shrink-0"
                        title="Disconnect Merchant Updates"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}