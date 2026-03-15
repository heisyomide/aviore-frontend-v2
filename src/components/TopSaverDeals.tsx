'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from './shop/ProductCard'; // IMPORT USED
import { Flame, Zap, ShieldCheck } from 'lucide-react';

interface TopDealsProps {
  initialDeals: any[]; // These come from registry.sections['trending'].data
}

export function TopDealsSection({ initialDeals = [] }: TopDealsProps) {
  const [timeLeft, setTimeLeft] = useState<number>(8 * 3600);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeDisplay = useMemo(() => {
    const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
    const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return { h, m, s };
  }, [timeLeft]);

  if (!isMounted) return <section className="py-12 bg-white min-h-[600px]" />;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[98rem] mx-auto px-6">
        
        {/* HEADER SECTION: HIGH INTENSITY */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-zinc-100 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <Flame size={20} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Live_Inventory_Drop</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-zinc-900 leading-[0.8]">
              Top Saver <span className="text-zinc-300">Today</span>
            </h2>
          </div>
          
          <div className="flex gap-3">
            <TimeUnit val={timeDisplay.h} label="HRS" />
            <TimeUnit val={timeDisplay.m} label="MIN" />
            <TimeUnit val={timeDisplay.s} label="SEC" />
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {initialDeals.length > 0 ? (
            initialDeals.slice(0, 4).map((item) => <DealCard key={item.id} item={item} />)
          ) : (
            <div className="col-span-3 h-80 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50">
               <ShieldCheck size={40} className="text-zinc-200 mb-4" />
               <span className="text-zinc-400 font-black uppercase text-[11px] tracking-widest">Scanning_Registry_For_Deals...</span>
            </div>
          )}
          
          <ActivityPulseCard />
        </div>
      </div>
    </section>
  );
}

function DealCard({ item }: { item: any }) {

  const product = {
    ...item,
    images: item.images || (item.image ? [item.image] : ['/placeholder.png']),
  };

  const currentStock = product.stock || 12;
  const initialStock = 50;
  const progress = Math.min(
    100,
    ((initialStock - currentStock) / initialStock) * 100
  );

  return (
    <div className="group flex flex-col gap-6">

      <div className="relative overflow-hidden rounded-[3rem] bg-zinc-50 border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200/50">

        <ProductCard product={product} />

        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none z-20">

          <div className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl flex items-center gap-2">
            <Zap size={10} fill="currentColor" />
            Flash_Deal
          </div>

          <div className="bg-zinc-900/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase w-fit">
            -{product.discount || 20}% Off
          </div>

        </div>

      </div>

      <div className="bg-zinc-50 p-7 rounded-[2.5rem] border border-zinc-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">

        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Inventory_Load
          </span>

          <span className="text-red-600 text-[10px] font-black uppercase">
            {currentStock} Left
          </span>
        </div>

        <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden shadow-inner">

          <div
            className="bg-red-600 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

    </div>
  );
}

function TimeUnit({ val, label }: { val: string; label: string }) {
  return (
    <div className="bg-zinc-950 text-white p-3.5 rounded-2xl min-w-[75px] flex flex-col items-center border border-white/5 shadow-2xl">
      <span className="text-2xl font-mono font-bold tabular-nums leading-none tracking-tighter">{val}</span>
      <span className="text-[7px] font-black text-zinc-500 mt-1.5 tracking-widest">{label}</span>
    </div>
  );
}

function ActivityPulseCard() {
  return (
    <div className="bg-zinc-950 p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group min-h-[400px] shadow-2xl border border-white/5">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_#dc2626]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Live_Pulse</span>
        </div>

        <div className="space-y-6">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            Registry <br/> <span className="text-red-600">Activity</span>
          </h3>
          
          <div className="space-y-5">
            <ActivityLine user="USR_992" action="purchased" item="Core_V2" />
            <ActivityLine user="COL_ALPHA" action="followed" item="Neo_Tech" />
            <ActivityLine user="USR_104" action="purchased" item="Unit_09" />
          </div>
        </div>
      </div>

      <button className="relative z-10 w-full group/btn bg-zinc-900 border border-zinc-800 hover:border-red-600 py-5 rounded-2xl transition-all duration-300">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover/btn:text-white">
          Explore_Pulse
        </span>
      </button>
    </div>
  );
}

function ActivityLine({ user, action, item }: { user: string; action: string; item: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] font-medium tracking-tight border-l border-zinc-800 pl-4 py-1">
      <div className="flex flex-col">
        <span className="text-zinc-500 font-mono text-[9px]">{user}</span>
        <div className="flex gap-2 items-center">
           <span className="text-red-600 uppercase font-black text-[9px]">{action}</span>
           <span className="text-white truncate max-w-[90px] font-bold">{item}</span>
        </div>
      </div>
    </div>
  );
}