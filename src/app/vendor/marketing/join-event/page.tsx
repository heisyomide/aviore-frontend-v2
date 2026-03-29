'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { 
  Zap, Calendar, ArrowRight, Sparkles, 
  Loader2, Megaphone, Users, Bell, Globe
} from 'lucide-react';
import Link from 'next/link';

export default function GlobalEventMarketplace() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/coupons/public/joint-events');
        setEvents(res.data);
      } catch (err) {
        console.error("EVENT_FETCH_ERROR", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] pb-40 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY HEADER NODE (Top-Left Identity) */}
      <div className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-xl px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Marketplace
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white active:scale-90 transition-all">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0A0F1C]" />
        </button>
      </div>

      <div className="px-6 space-y-10 mt-8">
        
        {/* 🚀 2. SURGE HERO NODE (Full Width Visualizer) */}
        <div className="w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Growth_Surge_Protocol</span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">
                        Global Event <br /> Registry
                    </h2>
                </div>
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/40">
                    <Globe size={24} className="animate-spin-slow" />
                </div>
            </div>
            <p className="relative z-10 text-[10px] text-slate-400 font-medium uppercase tracking-wider italic leading-relaxed max-w-xs">
                Join platform-led surges. Inject artifacts into global traffic nodes to maximize yield and network visibility.
            </p>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        </div>

        {/* 🚀 3. EVENT REGISTRY LIST */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-1">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Available Cycles</h3>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-4">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group active:bg-white/10 transition-all">
                {/* Yield Badge */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black italic text-lg tracking-tighter border-l border-b border-blue-500/50">
                    -{Number(event.discountValue)}%
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-500">
                            <Zap size={14} fill="currentColor" className="animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Flash_Surge_Active</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{event.code}</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-medium italic mt-2 tracking-tight line-clamp-2">
                            {event.description || "Deploy your artifacts into this high-traffic collection hub."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                               Ends: {new Date(event.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={12} className="text-slate-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                               Nodes Active
                            </span>
                        </div>
                    </div>

                    <Link 
                        href={`/dashboard/vendor/marketing/join-event/${event.id}`}
                        className="h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-900/40"
                    >
                        Participate in Cycle <ArrowRight size={14} />
                    </Link>
                </div>
                
                {/* Subtle Glow */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all" />
              </div>
            )) : (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-30">
                <Megaphone size={48} className="mx-auto text-white mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Registry Neutral: No Surge Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🎨 SUB-COMPONENTS */

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F1C] gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-500 italic animate-pulse">Syncing Global Events Hub...</p>
    </div>
  );
}