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
    <section className="group w-full overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:shadow-md">
      
      {/* 1. HEADER HUD */}
      <div className="flex items-center justify-between border-b border-zinc-50 bg-zinc-50/30 px-8 py-5">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: color }} className="h-6 w-1.5 rounded-full shadow-sm" />
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            {title}
          </h2>
        </div>
        <button className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-red-600">
          EXPLORE_COLLECTION 
          <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        
        {/* 2. DYNAMIC SIDE BANNER */}
        <div className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden border-r border-zinc-100 bg-zinc-950 p-8 lg:w-72">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1.5 text-red-500">
              <Zap size={12} fill="currentColor" className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">{bannerTitle}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
                SAVE UP TO <br /> <span className="text-red-600">{bannerDiscount}</span>
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">Flash_Registry</p>
            </div>

            <div className="flex gap-2">
              <TimerBox val={time.h} label="H" />
              <TimerBox val={time.m} label="M" />
              <TimerBox val={time.s} label="S" />
            </div>
          </div>
          
          <div className="relative z-10 mt-10 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="mb-3 flex justify-between text-[9px] font-black uppercase text-zinc-400">
                <span className="flex items-center gap-1"><TrendingUp size={10}/> LIVE_REGISTRY</span>
                <span className="text-red-500">88% SOLD</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.6)] transition-all duration-1000" style={{ width: '88%' }} />
              </div>
            </div>
            <button className="w-full rounded-2xl bg-white py-5 text-[10px] font-black uppercase tracking-widest text-zinc-950 shadow-xl transition-all active:scale-95 hover:bg-red-600 hover:text-white">
              GET_THE_DROP
            </button>
          </div>

          <div className="absolute -bottom-8 -right-8 text-9xl font-black uppercase italic text-white/3 pointer-events-none select-none">
            DROP
          </div>
        </div>

        {/* 🚀 3. FLUID PRODUCT GRID */}
        <div className="flex-1 overflow-hidden bg-white p-6 md:p-10">
          <ProductGrid 
            /* FIX: Added title prop to satisfy TypeScript. 
               Passed title so it can be used for accessibility or sub-filtering. */
            title={title} 
            products={products.slice(0, 4)} 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-10" 
          />
        </div>

      </div>
    </section>
  );
}

function TimerBox({ val, label }: { val: string; label: string }) {
  return (
    <div className="flex min-w-12 flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="font-mono text-xl font-black italic leading-none text-white tabular-nums">{val}</span>
      <span className="mt-1 text-[7px] font-bold uppercase tracking-widest text-zinc-600">{label}</span>
    </div>
  );
}