'use client';
import { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { ProductGrid } from '../product/ProductGrid';
import { Section } from '../layout/Section';

export function FlashDeals({ products }: { products: any[] }) {
  const [timeLeft, setTimeLeft] = useState(3600 * 5); // 5 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const time = formatTime(timeLeft);

  return (
    <Section bg className="py-8!">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            <Zap size={18} fill="currentColor" />
            <span className="text-sm font-black uppercase italic">Flash Deals</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ends in:</span>
            <div className="flex gap-1">
              <TimerBox value={time.h} />
              <span className="font-bold">:</span>
              <TimerBox value={time.m} />
              <span className="font-bold">:</span>
              <TimerBox value={time.s} />
            </div>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest group">
          View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Uses the reusable grid we built in Phase 2 */}
      <ProductGrid products={[...products].slice(0, 6)} />
    </Section>
  );
}

function TimerBox({ value }: { value: string }) {
  return (
    <div className="bg-black text-white text-xs font-mono font-bold w-7 h-7 flex items-center justify-center rounded shadow-sm">
      {value}
    </div>
  );
}