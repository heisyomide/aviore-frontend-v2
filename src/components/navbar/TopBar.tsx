// src/components/navbar/TopBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Zap } from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: "Free shipping on all orders over ₦25,000", icon: Truck },
  { text: "Flash Sale: Up to 70% off artifacts ends tonight!", icon: Zap },
  { text: "Secure payments & 90-day easy returns", icon: ShieldCheck },
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = ANNOUNCEMENTS[index].icon;

  return (
    <div className="bg-[#111] text-white py-2 overflow-hidden h-9 flex items-center">
      <div className="container mx-auto px-4 flex justify-center items-center gap-2 transition-all duration-500 ease-in-out">
        <ActiveIcon size={14} className="text-yellow-400" />
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">
          {ANNOUNCEMENTS[index].text}
        </p>
      </div>
    </div>
  );
}