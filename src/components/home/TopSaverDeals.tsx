'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Timer, ShoppingBag, Zap } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Section } from '../layout/Section';

export function TopDealsSection({ initialDeals = [] }: { initialDeals: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[600px] w-full bg-zinc-50 animate-pulse rounded-[3rem]" />;

  return (
    <Section className="!py-16 bg-white overflow-hidden">
      {/* 🚀 HEADER AREA: Matches the image structure but modernized */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-zinc-100 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#A4143D] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#A4143D]/20">
            <Flame size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
              Top Deals <span className="text-zinc-400 italic">Of The Day</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Live Inventory Sync</span>
            </div>
          </div>
        </div>
        
        <FlashTimer />
      </div>

      {/* 🚀 THE GRID: 6 Columns (Matches your image sample density) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {initialDeals.slice(0, 6).map((item) => (
          <div key={item.id} className="flex flex-col gap-4 group">
            {/* Standard Product Card */}
            <ProductCard product={item} />
            
            {/* The "Sold" Progress Bar - Modernized from your image */}
            <SoldProgress 
              sold={item.soldCount || Math.floor(Math.random() * 50)} 
              total={item.totalStock || 100} 
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

/** ⏱️ REFINED TIMER: High-contrast red bar like the sample image */
function FlashTimer() {
  const [seconds, setSeconds] = useState(14 * 3600 + 45 * 60 + 12);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  }, [seconds]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden lg:block">
        Hurry Up! Offer ends in:
      </span>
      <div className="flex items-center bg-[#A4143D] text-white px-4 py-2 rounded-xl shadow-lg shadow-[#A4143D]/20">
        <Timer size={14} className="mr-3 opacity-70" />
        <div className="flex gap-2 font-mono font-bold text-sm">
          <span>{time.h}</span>
          <span className="opacity-30">:</span>
          <span>{time.m}</span>
          <span className="opacity-30">:</span>
          <span className="text-rose-200">{time.s}</span>
        </div>
      </div>
    </div>
  );
}

/** 📊 SOLD PROGRESS: Matches the red indicator in your sample image */
function SoldProgress({ sold, total }: { sold: number; total: number }) {
  const percentage = Math.min(100, (sold / total) * 100);

  return (
    <div className="px-1 space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
          Sold: <b className="text-zinc-900">{sold}/{total}</b>
        </span>
        <span className="text-[9px] font-black text-[#A4143D] uppercase">
          {Math.round(percentage)}% Claimed
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-[#A4143D] rounded-full shadow-[0_0_8px_rgba(164,20,61,0.4)]"
        />
      </div>
    </div>
  );
}