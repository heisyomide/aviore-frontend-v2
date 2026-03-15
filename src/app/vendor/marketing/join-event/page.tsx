'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { 
  Zap, Calendar, ArrowRight, Sparkles, 
  Loader2, Megaphone, Trophy, Users 
} from 'lucide-react';
import Link from 'next/link';

export default function GlobalEventMarketplace() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetching only Admin-created JOINT campaigns
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

  return (
    <div className="space-y-12 pb-24">
      {/* 1. HERO SECTION */}
      <div className="relative bg-gray-900 rounded-[3rem] p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A4143D]/20 blur-[120px] -mr-48 -mt-48" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global_Growth_Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
            Event Marketplace
          </h1>
          <p className="text-sm text-gray-400 font-medium italic leading-relaxed">
            Join platform-led marketing surges. Inject your high-tier artifacts into global traffic nodes to maximize ROI and visibility.
          </p>
        </div>
      </div>

      {/* 2. EVENT REGISTRY */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">Available_Surge_Events</span>
          <div className="h-[1px] w-full bg-gray-100" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#A4143D]" /></div>
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-gray-200 rounded-[3rem] bg-gray-50/30">
             <Megaphone size={32} className="mx-auto text-gray-200 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No active global events detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-[#A4143D]/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
      {/* Percentage Badge */}
      <div className="absolute top-0 right-0 bg-[#A4143D] text-white px-8 py-2 rounded-bl-[2rem] font-black italic text-xl tracking-tighter">
        -{Number(event.discountValue)}%
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Zap size={14} fill="currentColor" />
            <span className="text-[9px] font-black uppercase tracking-widest">Flash_Surge_Active</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">{event.code}</h3>
          <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed max-w-xs">
            {event.description || "Inject your artifacts into this high-traffic collection."}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-300" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Ends: {new Date(event.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-300" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">12+ Vendors Joined</span>
          </div>
        </div>
      </div>

      <Link 
        href={`/dashboard/vendor/marketing/join-event/${event.id}`}
        className="mt-10 h-14 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 hover:bg-[#A4143D] transition-all group-hover:shadow-xl shadow-[#A4143D]/20"
      >
        Participate in Event <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}