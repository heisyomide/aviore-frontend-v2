'use client';

import { ShieldCheck, Loader2, Lock, Activity } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Payment Security</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Payment <span className="text-zinc-300 font-medium">Methods</span>
        </h1>
      </header>

      {/* 2. SECURITY PROTOCOL NOTICE */}
      <div className="relative group overflow-hidden bg-white border border-zinc-200 rounded-2xl p-8 transition-all duration-300 hover:border-zinc-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-900">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <Lock size={18} className="text-[#A4143D]" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Secure Checkout Integration</h3>
            </div>
            
            <p className="max-w-xl text-xs font-medium text-zinc-500 leading-relaxed">
              Internal card storage is temporarily disabled for regular security maintenance. 
              All financial settlements are encrypted and processed off-site through our fully verified provider: 
              <span className="text-zinc-900 font-bold ml-1">Flutterwave Secure Gateway</span>.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Gateway Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INACTIVE ACTIONS */}
      <div className="space-y-6">
        <div className="h-[1px] bg-zinc-100 w-full" />
        
        <div className="flex justify-start">
          <button 
            disabled
            className="flex items-center gap-3 px-8 py-4 bg-zinc-50 border border-zinc-200 rounded-xl cursor-not-allowed opacity-60"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              Add New Card <Loader2 size={12} className="animate-spin" />
            </span>
          </button>
        </div>
        
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide italic">
          Note: Direct card registration features will become available following the upcoming server updates.
        </p>
      </div>
    </div>
  );
}