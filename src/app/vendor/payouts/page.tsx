'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, Banknote, Clock, Loader2, ShieldCheck, Download,
  History, TrendingUp, Bell, ArrowDownLeft, RefreshCw, ChevronRight 
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import WithdrawalRequestModal from '@/src/components/dashboard/WithdrawalRequestModal';

// --- INTERFACES (PRESERVED) ---
interface WalletData {
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
  };
  totalWithdrawn: number;
  transactions: Array<{
    id: string;
    reference: string;
    type: 'SALE' | 'WITHDRAW' | 'REFUND';
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WalletData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchWalletData(); }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/payouts/stats');
      setData(res.data);
    } catch (e) {
      console.error("Treasury_Sync_Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <LoadingTreasury />;

  return (
    <div className="min-h-screen bg-white lg:bg-[#FAFAFA] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY MOBILE LABEL (Top-Left Identity) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Payouts
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button 
          onClick={fetchWalletData}
          className="relative p-2 text-slate-400 active:rotate-180 transition-all duration-500"
        >
          <RefreshCw size={22} />
        </button>
      </div>

      <div className="px-6 lg:px-10 space-y-10 mt-6 max-w-7xl mx-auto">

        {/* 🚀 2. TREASURY HERO NODE (Full-Width Logic) */}
        <div className="w-full bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
           <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Liquidity</p>
                <h2 className="text-4xl font-black italic tracking-tighter">₦{data.wallet.availableBalance.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/40">
                 <Banknote size={20} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 relative z-10 pt-6 border-t border-white/5">
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">In Escrow</p>
                <p className="text-lg font-black text-orange-500 italic">₦{data.wallet.pendingBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Lifetime Yield</p>
                <p className="text-lg font-black text-emerald-500 italic">₦{data.wallet.totalEarnings.toLocaleString()}</p>
              </div>
           </div>

           <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-8 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-900/20"
            >
              Initialize Settlement <ArrowUpRight size={16} />
           </button>

           {/* Aesthetic Backdrop */}
           <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] -mr-20 -mt-20" />
        </div>

        {/* 🚀 3. DESKTOP EXTRAS (Hidden on Mobile - Preserved Context) */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
           <div className="bg-white border border-slate-100 p-8 rounded-4xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Withdrawals</p>
              <p className="text-3xl font-black text-slate-900 italic leading-none">₦{data.totalWithdrawn.toLocaleString()}</p>
           </div>
           <div className="col-span-2 bg-slate-50 rounded-4xl p-8 flex items-center justify-between border border-slate-100">
              <div>
                 <h4 className="text-sm font-black text-slate-900 uppercase italic">Secure Escrow Protocol</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Automatic 48-hour network hold active.</p>
              </div>
              <ShieldCheck className="text-blue-600" size={32} />
           </div>
        </div>

        {/* 🚀 4. ACTIVITY REGISTRY (Mobile Full-Bleed List) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] italic">Audit History</h3>
             <button className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-50">
                Download CSV <Download size={10}/>
             </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100">
            {data.transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-5 border-b border-slate-50 last:border-0 group active:bg-slate-50 transition-colors rounded-3xl">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                   t.type === 'SALE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                   {t.type === 'SALE' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 uppercase italic truncate">Node {t.reference.slice(-8).toUpperCase()}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                   <p className={`text-sm font-black italic tracking-tighter ${t.type === 'WITHDRAW' ? 'text-red-500' : 'text-slate-900'}`}>
                     {t.type === 'WITHDRAW' ? '-' : '+'}₦{t.amount.toLocaleString()}
                   </p>
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                     t.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600'
                   }`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WithdrawalRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        availableBalance={data.wallet.availableBalance}
        onRefresh={fetchWalletData}
      />
    </div>
  );
}

/* 🎨 SUB-COMPONENTS (PRESERVED) */

function LoadingTreasury() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Synchronizing_Treasury_Node</p>
    </div>
  );
}