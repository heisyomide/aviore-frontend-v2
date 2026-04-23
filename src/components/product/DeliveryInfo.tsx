'use client';

import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export function DeliveryInfo() {
  const items = [
    {
      icon: <ShieldCheck size={20} className="text-zinc-400" />,
      title: "100% Authentic Products",
      desc: "Sourced directly from brands"
    },
    {
      icon: <RotateCcw size={20} className="text-zinc-400" />,
      title: "7 Days Return",
      desc: "Not satisfied? Return within 7 days"
    },
    {
      icon: <Headphones size={20} className="text-zinc-400" />,
      title: "24/7 Customer Support",
      desc: "We are here to help you"
    }
  ];

  return (
    <div className="space-y-4 pt-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100/50 group hover:bg-white hover:border-zinc-200 transition-all duration-300">
          <div className="mt-0.5 transition-colors group-hover:text-black">
            {item.icon}
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-tight text-zinc-900">
              {item.title}
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}