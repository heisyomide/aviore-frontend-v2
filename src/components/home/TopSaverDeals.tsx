'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '../product/ProductCard';
import { Section } from '../layout/Section';
import { Flame, Activity, ChevronRight } from 'lucide-react';

/**
 * 🚀 TOP DEALS SECTION (Organism)
 * Rule 4: Urgency System
 * Rule 7: Product Grid Blueprint
 */
export function TopDealsSection({ initialDeals = [] }: { initialDeals: any[] }) {
  const [timeLeft, setTimeLeft] = useState<number>(8 * 3600);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="h-[600px] bg-white animate-pulse" />;

  return (
    <Section className="!py-16 overflow-hidden">
      {/* HEADER: Rules 3 & 4 (Typography & Urgency) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Flame size={18} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live_Inventory_Drop</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-[#111] leading-none">
            Top Saver <span className="text-gray-200">Today</span>
          </h2>
        </div>
        
        <FlashTimer seconds={timeLeft} />
      </div>

      {/* CONTENT GRID: Rule 7 (5 Columns Desktop / 2 Columns Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {initialDeals.slice(0, 4).map((item) => (
          <div key={item.id} className="flex flex-col gap-3 group">
            <ProductCard product={item} />
            <InventoryMeter stock={item.stock || 12} />
          </div>
        ))}
        
        <ActivityPulseCard />
      </div>
    </Section>
  );
}

/** * ⏱️ TIMER MOLECULE 
 */
function FlashTimer({ seconds }: { seconds: number }) {
  const time = useMemo(() => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  }, [seconds]);

  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-sm">
      <span className="text-[9px] font-black text-gray-400 uppercase ml-2 mr-1">Ends_In</span>
      <div className="flex gap-1">
        {[time.h, time.m, time.s].map((val, i) => (
          <div key={i} className="bg-[#111] text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="text-lg font-mono font-bold leading-none">{val}</span>
            <span className="text-[6px] font-black text-gray-400 mt-1 uppercase">
              {i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** * 📊 INVENTORY METER (Molecule)
 * Rule 4: Urgency Trigger
 */
function InventoryMeter({ stock }: { stock: number }) {
  const percentage = Math.max(15, (stock / 50) * 100); // Mock percentage logic

  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Stock_Level</span>
        <span className="text-[#A4143D] text-[9px] font-black uppercase">{stock} Left</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-[#A4143D] h-full transition-all duration-1000 ease-out" 
          style={{ width: `${100 - percentage}%` }} 
        />
      </div>
    </div>
  );
}

/** * 💓 ACTIVITY PULSE (Molecule)
 * Rule 8: Interaction / Social Proof
 */
function ActivityPulseCard() {
  return (
    <div className="col-span-2 md:col-span-1 bg-[#111] p-6 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden min-h-[350px] shadow-2xl border border-white/5">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A4143D_0.5px,transparent_0.5px)] [background-size:12px_12px]" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#A4143D] animate-bounce" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Live_Pulse</span>
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight">
          Registry <br/> <span className="text-[#A4143D]">Activity</span>
        </h3>
        <div className="space-y-4">
          <ActivityLine user="USR_992" action="purchased" item="Core_V2" />
          <ActivityLine user="COL_ALPHA" action="followed" item="Neo_Tech" />
          <ActivityLine user="USR_104" action="purchased" item="Unit_09" />
        </div>
      </div>

      <button className="relative z-10 w-full group bg-white/5 border border-white/10 hover:border-[#A4143D] py-3.5 rounded-xl transition-all backdrop-blur-sm">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white flex items-center justify-center gap-2">
          Explore_Pulse <ChevronRight size={12} />
        </span>
      </button>
    </div>
  );
}

function ActivityLine({ user, action, item }: { user: string; action: string; item: string }) {
  return (
    <div className="flex flex-col border-l-2 border-white/5 pl-3">
      <span className="text-gray-500 font-mono text-[8px] uppercase tracking-tighter">{user}</span>
      <div className="flex gap-2 items-center">
        <span className="text-[#A4143D] uppercase font-black text-[8px]">{action}</span>
        <span className="text-white truncate text-[10px] font-bold tracking-tight">{item}</span>
      </div>
    </div>
  );
}