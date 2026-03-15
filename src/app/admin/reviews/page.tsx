"use client";

import { useState, useEffect } from "react";
import { 
  Star, MessageSquare, ShieldCheck, Trash2, 
  Flag, EyeOff, CheckCircle, Search, 
  Filter, Loader2, User, Store, ExternalLink,
  ChevronRight
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

export default function AdminReviewModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reviews");
      setReviews(res.data);
    } catch {
      toast.error("MODERATION_ERROR: Failed to fetch social proof.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleVisibility = async (id: string) => {
    try {
      await api.patch(`/admin/reviews/${id}/toggle`);
      toast.success("LEGAL_UPDATE: Review visibility updated.");
      fetchReviews();
    } catch {
      toast.error("COMMAND_ERROR: Visibility toggle failed.");
    }
  };

  return (
    <div className="p-8 bg-[#020202] min-h-screen text-zinc-400 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-900 pb-10 mb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Content Moderation</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
            Social <span className="text-zinc-800">Proof</span>
          </h1>
        </div>

        <div className="flex gap-4">
           <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-2xl h-14 items-center px-6 gap-3 focus-within:border-indigo-500 transition-all">
             <Search size={18} className="text-zinc-700" />
             <input placeholder="Filter by product or user..." className="bg-transparent border-none outline-none text-xs font-bold uppercase w-64" />
           </div>
        </div>
      </header>

      {/* MODERATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-800" /></div>
        ) : reviews.map((r) => (
          <div key={r.id} className="group bg-[#050505] border border-zinc-900 p-8 rounded-[2rem] space-y-6 hover:border-zinc-700 transition-all relative overflow-hidden">
            
            {/* Rating & Identity */}
            <div className="flex justify-between items-start">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-zinc-800"} />
                ))}
              </div>
              <span className="text-[9px] font-mono text-zinc-700 uppercase italic">Node_{r.id.slice(-6)}</span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm text-zinc-200 leading-relaxed font-medium">"{r.comment}"</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                <User size={12} className="text-indigo-500" /> {r.customer?.name || "Anonymous"}
                <ChevronRight size={10} />
                <Store size={12} className="text-amber-500" /> {r.product?.vendor?.storeName || "Marketplace"}
              </div>
            </div>

            {/* Product Meta */}
            <div className="bg-black/50 border border-zinc-900 p-4 rounded-2xl flex items-center gap-4">
               <div className="h-10 w-10 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                  <img src={r.product?.images?.[0]} className="w-full h-full object-cover opacity-50" />
               </div>
               <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-zinc-700 uppercase block">Product_Target</span>
                  <span className="text-xs font-bold text-zinc-400 truncate block uppercase tracking-tighter">{r.product?.name}</span>
               </div>
            </div>

            {/* Admin Moderation Actions */}
            <div className="pt-4 flex gap-3 border-t border-zinc-900">
              <button 
                onClick={() => toggleVisibility(r.id)}
                className={`flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  r.isVisible ? "bg-zinc-900 text-zinc-500 hover:bg-rose-600 hover:text-white" : "bg-emerald-600 text-white"
                }`}
              >
                {r.isVisible ? <><EyeOff size={14} /> Hide Review</> : <><CheckCircle size={14} /> Restore</>}
              </button>
              
              <button className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:bg-rose-600 hover:text-white hover:border-rose-500 transition-all">
                 <Trash2 size={16} />
              </button>
            </div>

            {!r.isVisible && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]">
                 <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full flex items-center gap-2">
                    <Flag size={12} className="text-rose-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Shadowed_By_Admin</span>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}