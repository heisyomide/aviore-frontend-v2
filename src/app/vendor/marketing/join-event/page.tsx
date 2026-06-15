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
    <div className="min-h-screen bg-[#0d0d0d] pb-40 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY HEADER NODE */}
      <div className="sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Marketplace
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Global Campaigns Registry
          </p>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#991b1b] rounded-full" />
        </button>
      </div>

      <div className="space-y-10 mt-10 max-w-7xl mx-auto">
        
        {/* 🚀 2. SURGE HERO NODE */}
        <div className="w-full bg-[#111113] rounded-2xl p-8 border border-zinc-900 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Sparkles size={14} className="text-zinc-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Growth_Surge_Protocol</span>
                    </div>
                    <h2 className="text-2xl font-light tracking-tight text-white uppercase font-sans">
                      Global Event <br /><span className="font-medium text-zinc-400">Registry Network</span>
                    </h2>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 shadow-inner">
                    <Globe size={20} className="text-zinc-300" />
                </div>
            </div>
            <p className="relative z-10 text-[11px] text-zinc-500 max-w-md leading-relaxed font-medium uppercase tracking-wider">
                Sync operational assets with platform-led traffic modules. Inject verified inventory vectors into active consumer channels to cross-optimize overall volume and merchant footprint.
            </p>
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#991b1b]/5 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        </div>

        {/* 🚀 3. EVENT REGISTRY LIST */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-1">
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Available Active Cycles</h3>
             <div className="h-[1px] flex-1 bg-zinc-900/60" />
          </div>

          <div className="space-y-4">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="bg-[#111113] border border-zinc-900 p-8 rounded-2xl relative overflow-hidden group transition-all hover:border-zinc-800 shadow-xl">
                
                {/* Monochromatic Allocation Discount Tag */}
                <div className="absolute top-0 right-0 bg-zinc-900 border-l border-b border-zinc-800 text-zinc-200 px-5 py-2 rounded-bl-xl font-mono text-xs font-bold tracking-wider">
                    -{Number(event.discountValue)}% Allocation
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Zap size={12} className="text-zinc-400" />
                            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">Flash_Surge_Engaged</span>
                        </div>
                        <h3 className="text-xl font-medium text-white uppercase tracking-wider leading-none pt-1">
                          {event.code}
                        </h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mt-2 tracking-wide leading-relaxed max-w-xl line-clamp-2">
                            {event.description || "Deploy collection units and metadata layers into this running public cluster pipeline."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-5 border-t border-zinc-900/60 font-mono">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-zinc-600" />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-wider">
                               Terminus: {new Date(event.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={12} className="text-zinc-600" />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-wider">
                               Nodes Engaged
                            </span>
                        </div>
                    </div>

                    <Link 
                        href={`/dashboard/vendor/marketing/join-event/${event.id}`}
                        className="h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                        Participate in Cycle <ArrowRight size={14} />
                    </Link>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-[#111113] rounded-2xl border border-zinc-900 shadow-xl">
                <Megaphone size={32} strokeWidth={1} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Registry Neutral: No pipeline distribution detected</p>
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Syncing Global Events Hub Pipeline...</p>
    </div>
  );
}