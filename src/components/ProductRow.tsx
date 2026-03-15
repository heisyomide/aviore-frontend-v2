'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductGrid } from './shop/ProductGrid';
import { ArrowRight, Timer, Zap, TrendingUp } from 'lucide-react';

interface ProductRowProps {
  title: string;
  products: any[];
  color: string;
  bannerTitle?: string;
  bannerDiscount?: string;
}

export function ProductRow({ 
  title, 
  products, 
  color, 
  bannerTitle = "BIG DEALS", 
  bannerDiscount = "70% OFF" 
}: ProductRowProps) {
  const [timeLeft, setTimeLeft] = useState(8 * 3600);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = useMemo(() => {
    const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
    const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return { h, m, s };
  }, [timeLeft]);

  return (
    <section className="group w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:shadow-md">
      
      {/* 1. HEADER HUD - Thinner on Mobile */}
      <div className="flex items-center justify-between border-b border-zinc-50 bg-zinc-50/30 px-5 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-2 md:gap-3">
          <div style={{ backgroundColor: color }} className="h-5 w-1 md:h-6 md:w-1.5 rounded-full shadow-sm" />
          <h2 className="text-sm md:text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            {title}
          </h2>
        </div>
        <button className="flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#A4143D]">
          SEE_ALL 
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        
        {/* 2. DYNAMIC SIDE BANNER - Compact on Mobile, Sidebar on Desktop */}
        <div className="relative flex w-full shrink-0 flex-row lg:flex-col justify-between items-center lg:items-start overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-950 p-5 lg:p-8 lg:w-72">
          <div className="relative z-10 space-y-2 lg:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-2 py-1 lg:px-3 lg:py-1.5 text-red-500">
              <Zap size={10} fill="currentColor" className="animate-pulse" />
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest">{bannerTitle}</span>
            </div>

            <div className="hidden lg:block space-y-2">
              <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
                SAVE UP TO <br /> <span className="text-red-600">{bannerDiscount}</span>
              </h3>
            </div>

            {/* Timer - Horizontal on all screens */}
            <div className="flex gap-1.5 lg:gap-2">
              <TimerBox val={time.h} label="H" />
              <TimerBox val={time.m} label="M" />
              <TimerBox val={time.s} label="S" />
            </div>
          </div>
          
          {/* Action Button - Hidden on Mobile Banner to save space */}
          <div className="hidden lg:block relative z-10 mt-10 w-full space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="mb-3 flex justify-between text-[9px] font-black uppercase text-zinc-400">
                <span className="flex items-center gap-1"><TrendingUp size={10}/> LIVE</span>
                <span className="text-red-500">88% SOLD</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: '88%' }} />
              </div>
            </div>
            <button className="w-full rounded-2xl bg-white py-4 text-[10px] font-black uppercase tracking-widest text-zinc-950">
              GET_THE_DROP
            </button>
          </div>
        </div>

        {/* 🚀 3. FLUID PRODUCT GRID - 2 Columns on Mobile */}
        <div className="flex-1 overflow-hidden bg-white p-2 md:p-10">
          <ProductGrid 
            title={title} 
            products={products.slice(0, 4)} 
            /* grid-cols-2: Fixes the 'rubbish' squash by forcing 2 items per row on phones.
               gap-2: Keeps it tight like Jumia/Temu.
            */
            className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 md:gap-10" 
          />
        </div>

      </div>
    </section>
  );
}

function TimerBox({ val, label }: { val: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-2 py-1 lg:px-3 lg:py-2">
      <span className="font-mono text-sm lg:text-xl font-black leading-none text-white tabular-nums">{val}</span>
      <span className="text-[6px] lg:text-[7px] font-bold uppercase text-zinc-600">{label}</span>
    </div>
  );
}