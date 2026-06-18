'use client';

import { useState, useEffect } from 'react';
import { Store, Star, Loader2, ArrowUpRight, Unlink, Heart, X, Check } from 'lucide-react';
import { api } from '@/src/lib/axios';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FollowedVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminatingId, setTerminatingId] = useState<string | null>(null);

  const fetchFollowedVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/following');
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Registry Sync Error:", err);
      toast.error("Failed to synchronize vendor ledger");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (vendorId: string) => {
    try {
      await api.delete(`/vendors/${vendorId}/unfollow`);
      setVendors(prev => prev.filter(v => (v.vendor?.id || v.id) !== vendorId));
      toast.success("Vendor connection terminated");
      setTerminatingId(null);
    } catch (err) {
      console.error("Action Error:", err);
      toast.error("Failed to sever vendor pipeline");
    }
  };

  useEffect(() => {
    fetchFollowedVendors();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Loader2 className="animate-spin text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Synchronizing_Vendor_Ledger...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. ARCHITECTURAL LAYER HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <Heart size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Registry_Followed_Nodes</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          Favorite <span className="text-zinc-600 font-normal font-sans tracking-normal">Vendors</span>
        </h1>
      </header>

      {/* 2. VENDOR DATA STREAM PIPELINE */}
      {vendors.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border border-zinc-900 bg-[#111113]/40 rounded-lg text-center">
          <Store size={32} className="text-zinc-800 mb-3" />
          <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">
            Empty_Vendor_Pipeline
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((item) => {
            const vendorData = item.vendor || item;
            const vendorId = vendorData.id;
            const storeName = vendorData.storeName || "SYSTEM_UNASSIGNED_NODE";
            const isConfirmingTermination = terminatingId === vendorId;

            return (
              <div 
                key={item.id || vendorId} 
                className="group relative bg-[#111113] border border-zinc-900 p-6 rounded-lg flex flex-col justify-between gap-5 transition-colors duration-300 hover:border-zinc-800"
              >
                {/* Real-time Telemetry Status Link */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2 py-0.5 bg-zinc-950 rounded border border-zinc-900">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Linked</span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Structural Identity Icon Cube */}
                  <div className="bg-zinc-950 border border-zinc-900 p-4 rounded text-zinc-500 transition-colors group-hover:text-[#991B1B] group-hover:border-[#991B1B]/30 shrink-0">
                    <Store size={20} />
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wide truncate pr-16">
                        {storeName}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">
                          <Star size={9} className="text-[#991B1B] fill-[#991B1B]" />
                          <span className="text-[10px] font-mono font-bold text-zinc-300">
                            {Number(vendorData.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 w-[1px] bg-zinc-900" />
                        <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                          {vendorData.followersCount?.toString().padStart(4, '0') || '0000'} Subscribers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC METRIC INTERFACE BUTTONS */}
                <div className="pt-4 border-t border-zinc-900/60 min-h-[46px] flex items-center">
                  {isConfirmingTermination ? (
                    <div className="w-full flex items-center justify-between bg-zinc-950 border border-[#991B1B]/30 rounded px-3 py-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
                      <span className="text-[8px] font-mono font-bold text-[#991B1B] uppercase tracking-wider">
                        Terminate Connection?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUnfollow(vendorId)}
                          className="text-emerald-500 hover:text-emerald-400 p-1 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                        >
                          <Check size={11} /> Yes
                        </button>
                        <button
                          onClick={() => setTerminatingId(null)}
                          className="text-zinc-500 hover:text-white p-1 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                        >
                          <X size={11} /> No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      <Link 
                        href={`/vendors/${vendorId}`}
                        className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 h-8 rounded flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white transition-all active:scale-[0.99]"
                      >
                        <span>Inspect Store</span>
                        <ArrowUpRight size={11} className="text-zinc-500" />
                      </Link>

                      <button 
                        onClick={() => setTerminatingId(vendorId)}
                        className="h-8 w-8 bg-zinc-950 border border-zinc-900 hover:border-[#991B1B]/40 hover:text-[#991B1B] text-zinc-500 rounded flex items-center justify-center transition-colors"
                        title="Sever Connection Pipeline"
                      >
                        <Unlink size={12} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
        AVIORÈ_PIPELINE_VEND_v1.09
      </p>
    </div>
  );
}