'use client';

import { ShieldCheck, Zap, Loader2, Lock } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Finance_Registry</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Payment <span className="text-zinc-200">Methods</span>
        </h1>
      </header>

      {/* 2. SECURITY PROTOCOL NOTICE */}
      <div className="relative group overflow-hidden bg-zinc-50 border-2 border-zinc-100 rounded-[2.5rem] p-10 transition-all duration-500 hover:border-[#A4143D]/20">
        {/* Visual Bloom */}
        <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-[#A4143D]/5 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-900">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Lock size={20} className="text-[#A4143D]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Secure_External_Gateway</h3>
            </div>
            
            <p className="max-w-xl text-[11px] font-bold text-zinc-500 uppercase leading-relaxed tracking-tight">
              Internal card storage is currently <span className="text-zinc-900">Disabled</span> for security maintenance. 
              All financial settlements are encrypted and processed through our verified partner: 
              <span className="text-[#A4143D] ml-1">Flutterwave Secure Gateway</span>.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Status: Redirect_Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DISABLED ACTION HUD */}
      <div className="flex flex-col gap-6">
        <div className="h-px bg-zinc-100 w-full" />
        
        <div className="flex justify-start">
          <button 
            disabled
            className="relative px-10 py-5 bg-zinc-50 rounded-xl overflow-hidden cursor-not-allowed group border border-zinc-100"
          >
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
              Add New Card <Loader2 size={14} className="animate-spin" />
            </span>
            <div className="absolute inset-0 bg-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
        
        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] italic">
          Registry_Note: Direct card registration will be enabled following the next system synchronization.
        </p>
      </div>
    </div>
  );
}