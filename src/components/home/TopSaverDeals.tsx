'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronRight, ShieldCheck, Zap, Package } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Section } from '../layout/Section';

/**
 * 🚀 TOP DEALS SECTION (Organism)
 * Orchestrates urgency molecules and product grid
 */
export function TopDealsSection({ initialDeals = [] }: { initialDeals: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[700px] w-full bg-zinc-50 animate-pulse rounded-[3rem]" />;

  return (
    <Section className="!py-20 overflow-hidden bg-white">
      {/* HEADER AREA */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-[#A4143D]">
            <div className="relative">
              <Flame size={20} fill="currentColor" className="animate-pulse" />
              <span className="absolute inset-0 bg-[#A4143D] blur-md opacity-20 animate-ping" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Live_Inventory_Drop</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-zinc-900 leading-[0.85]">
            Top Saver <span className="text-zinc-200">Today</span>
          </h2>
        </div>
        
        <FlashTimer />
      </div>

      {/* GRID: 5 Columns with dynamic Spotlight */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {initialDeals.slice(0, 4).map((item) => (
          <div key={item.id} className="flex flex-col gap-4 group">
            <ProductCard product={item} />
            <InventoryMeter stock={item.stock || 12} />
          </div>
        ))}
        
        <DealSpotlightCard />
      </div>
    </Section>
  );
}

/** * ⏱️ TIMER MOLECULE
 * Isolated state to prevent parent re-renders
 */
function FlashTimer() {
  const [seconds, setSeconds] = useState(8 * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  }, [seconds]);

  return (
    <div className="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-[2rem] border border-zinc-100 shadow-sm">
      <span className="text-[10px] font-black text-zinc-400 uppercase ml-3 mr-1 tracking-widest">Ends_In</span>
      <div className="flex gap-1.5">
        {[time.h, time.m, time.s].map((val, i) => (
          <div key={i} className="bg-zinc-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-xl">
            <span className="text-xl font-mono font-bold leading-none tracking-tighter">{val}</span>
            <span className="text-[7px] font-black text-zinc-500 mt-1 uppercase tracking-tighter">
              {i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** * 📊 INVENTORY METER
 * Styled as a luxury status indicator
 */
function InventoryMeter({ stock }: { stock: number }) {
  const percentage = Math.max(15, (stock / 50) * 100);

  return (
    <div className="bg-zinc-50 p-5 rounded-[2rem] border border-zinc-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-transparent transition-all duration-500">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Package size={10} className="text-zinc-400" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Inventory</span>
        </div>
        <span className="text-[#A4143D] text-[10px] font-black italic">{stock} Units</span>
      </div>
      <div className="w-full bg-zinc-200/50 rounded-full h-1.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${100 - percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="bg-[#A4143D] h-full shadow-[0_0_8px_rgba(164,20,61,0.3)]" 
        />
      </div>
    </div>
  );
}

/** * 💓 SPOTLIGHT CARD
 * The high-conversion "Hero" of the section
 */
function DealSpotlightCard() {
  return (
    <div className="col-span-2 md:col-span-1 bg-zinc-950 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden min-h-[400px] shadow-2xl border border-white/5 group">
      {/* Brand Aesthetic Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A4143D]/20 rounded-full blur-[100px] group-hover:bg-[#A4143D]/30 transition-colors duration-700" />

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-[#A4143D] fill-[#A4143D] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Deal_Of_Hour</span>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] uppercase text-zinc-500 font-black tracking-widest">Biggest Save</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-6xl font-black italic leading-none text-white tracking-tighter">
              ₦45<span className="text-[#A4143D]">K</span>
            </h3>
          </div>
          <p className="text-xl font-light uppercase tracking-tighter text-zinc-300 italic">Off Today</p>
        </div>

        <div className="space-y-5 pt-4 border-t border-white/5">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Allocation</span>
            <span className="text-[#A4143D] text-[11px] font-black">3 UNITS LEFT</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              className="bg-gradient-to-r from-[#A4143D] to-[#E31B54] h-full shadow-[0_0_15px_rgba(164,20,61,0.5)]" 
            />
          </div>

          <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
            <ShieldCheck size={14} className="text-[#A4143D]" />
            <span>94% Collector Satisfaction</span>
          </div>
        </div>
      </div>

      <button className="relative z-10 w-full group/btn bg-[#A4143D] hover:bg-[#8e1135] py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(164,20,61,0.5)] flex items-center justify-center gap-3 active:scale-95">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Grab_Deal</span>
        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}