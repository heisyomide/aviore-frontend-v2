'use client';

import React from 'react';
import { Truck } from 'lucide-react';

export function CheckoutNotice() {
  return (
    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 flex gap-4 items-start animate-in fade-in duration-500">
      <div className="p-2.5 bg-slate-900 rounded-xl text-white shrink-0 shadow-sm">
        <Truck size={16} />
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
          Important Delivery Notice
        </h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xl">
          Products purchased from different vendors are processed independently and shipped separately. 
          Your items may arrive in multiple packages at different times.
        </p>
      </div>
    </div>
  );
}