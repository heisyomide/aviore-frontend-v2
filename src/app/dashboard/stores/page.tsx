'use client';

import { useState, useEffect } from 'react';
import { Store, Star, Loader2, ArrowUpRight, Unlink, Heart } from 'lucide-react';
import { api } from '@/src/lib/axios';
import Link from 'next/link';

export default function FollowedVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowedVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/following');
      // Ensure we are working with an array
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Registry Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (vendorId: string) => {
    if (!confirm("Terminate connection with this vendor?")) return;
    try {
      await api.delete(`/vendors/${vendorId}/unfollow`);
      setVendors(prev => prev.filter(v => (v.vendor?.id || v.id) !== vendorId));
    } catch (err) {
      console.error("Action Error:", err);
    }
  };

  useEffect(() => { fetchFollowedVendors(); }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header Section */}
      <header className="flex flex-col gap-1 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Heart size={14} fill="#A4143D" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry_Followed</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Favorite <span className="text-zinc-200">Vendors</span>
        </h1>
      </header>

      {/* 2. Vendor Grid */}
      {vendors.length === 0 ? (
        <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[3rem] text-center bg-zinc-50/30">
          <Store size={48} className="text-zinc-200 mb-4" />
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Registry empty. No vendors followed.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {vendors.map((item) => {
            // FIX: Normalize data structure (item might be a 'Following' record or a 'Vendor' record)
            const vendorData = item.vendor || item;
            const vendorId = vendorData.id;
            const storeName = vendorData.storeName || "Unknown Vendor";

            return (
              <div 
                key={item.id || vendorId} 
                className="group relative bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#A4143D]/20"
              >
                {/* Status Badge */}
                <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest font-mono">Online</span>
                </div>

                <div className="flex items-start gap-6">
                  {/* Icon HUD */}
                  <div className="bg-zinc-50 p-5 rounded-3xl text-zinc-300 transition-colors group-hover:text-[#A4143D] group-hover:bg-[#A4143D]/5 shrink-0">
                    <Store size={32} />
                  </div>

                  <div className="space-y-4 flex-1 min-w-0">
                    <div>
                      {/* FIX: Use normalized store name and handle truncation */}
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none truncate pr-16">
                        {storeName}
                      </h3>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Star size={10} className="text-[#A4143D]" fill="#A4143D" />
                          <span className="text-[11px] font-black text-zinc-900 font-mono tracking-tighter">
                            {vendorData.rating || '0.0'}
                          </span>
                        </div>
                        <div className="h-3 w-px bg-zinc-100" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          {vendorData.followersCount?.toLocaleString().padStart(4, '0') || '0000'} Followers
                        </span>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                      <Link 
                        href={`/vendors/${vendorId}`}
                        className="flex-1 group/btn relative overflow-hidden bg-black py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-zinc-200/50"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                          View Store <ArrowUpRight size={14} />
                        </span>
                        <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                      </Link>

                      <button 
                        onClick={() => handleUnfollow(vendorId)}
                        className="p-3 bg-zinc-50 text-zinc-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shrink-0"
                        title="Unfollow Vendor"
                      >
                        <Unlink size={16} />
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