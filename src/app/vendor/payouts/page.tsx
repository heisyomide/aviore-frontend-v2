'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, Banknote, Loader2, ShieldCheck, Download,
  RefreshCw, ArrowDownLeft, Lock
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import WithdrawalRequestModal from '@/src/components/dashboard/WithdrawalRequestModal';

// --- INTERFACES ---
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
      console.error("TREASURY_SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <LoadingTreasury />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-32 animate-in fade-in duration-700">
      
      {/* 1. STICKY EXECUTIVE HEADER (Unified Mobile & Desktop Layout Framework) */}
      <div className="sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md px-6 lg:px-10 py-8 flex justify-between items-end border-b border-zinc-900">
        <div>
          <h1 className="text-2xl font-light tracking-widest text-white uppercase font-sans">
            Treasury Ledger
          </h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium uppercase tracking-wider hidden sm:block">
            Capital distribution, rolling escrow balances, and liquidity clearing nodes
          </p>
        </div>
        <button 
          onClick={fetchWalletData}
          className="relative p-2.5 text-zinc-500 hover:text-white active:rotate-180 transition-all duration-500 bg-zinc-950 border border-zinc-900 rounded-xl cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="px-6 lg:px-10 space-y-8 mt-10 max-w-7xl mx-auto">

        {/* 2. ONYX TREASURY VAULT HERO NODE */}
        <div className="w-full bg-[#111113] border border-zinc-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="space-y-1.5">
                <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">CLEARED_AVAILABLE_LIQUIDITY</p>
                <h2 className="text-4xl font-mono font-bold tracking-tight text-white">₦{data.wallet.availableBalance.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-[#991B1B]/10 border border-[#991B1B]/30 rounded-xl text-[#ef4444] shadow-lg">
                 <Banknote size={18} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6 relative z-10 pt-6 border-t border-zinc-900">
              <div>
                <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Lock size={10} /> ESCROWED_FUNDS
                </p>
                <p className="text-lg font-mono font-bold text-amber-500">₦{data.wallet.pendingBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">LIFETIME_YIELD_MANIFEST</p>
                <p className="text-lg font-mono font-bold text-emerald-500">₦{data.wallet.totalEarnings.toLocaleString()}</p>
              </div>
           </div>

           <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-8 py-4.5 bg-[#991B1B] hover:bg-[#7f1616] text-white rounded-xl font-mono font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#991B1B] shadow-xl shadow-[#991B1B]/10"
            >
              Initialize Settlement Distribution <ArrowUpRight size={14} />
           </button>

           {/* Backdrop Shadow Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#991B1B]/5 blur-[100px] -mr-24 -mt-24 pointer-events-none" />
        </div>

        {/* 3. METRIC EXTENSION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex flex-col justify-center">
              <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1">AGGREGATED_WITHDRAWALS</p>
              <p className="text-2xl font-mono font-bold text-zinc-100 tracking-tight">₦{data.totalWithdrawn.toLocaleString()}</p>
           </div>
           
           <div className="md:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex items-center justify-between">
              <div>
                 <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-[#991B1B]" /> Escrow Protocol Architecture
                 </h4>
                 <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mt-1.5">
                   Funds transition to cleared state automatically matching system fulfillment triggers.
                 </p>
              </div>
           </div>
        </div>

        {/* 4. ACTIVITY AUDIT REGISTRY */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">Transaction Audit History</h3>
             <button className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-400 hover:text-white uppercase transition-colors cursor-pointer">
                Export_CSV <Download size={11}/>
             </button>
          </div>

          <div className="bg-[#111113] rounded-2xl border border-zinc-900 overflow-hidden divide-y divide-zinc-900/60 shadow-2xl">
            {data.transactions.length === 0 ? (
              <div className="p-16 text-center text-zinc-600 font-mono text-[9px] tracking-widest">
                No ledger activity sequences recorded.
              </div>
            ) : (
              data.transactions.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-5 hover:bg-zinc-950/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                     t.type === 'SALE' 
                       ? 'bg-zinc-950 text-emerald-500 border-zinc-900' 
                       : 'bg-zinc-950 text-rose-500 border-zinc-900'
                  }`}>
                     {t.type === 'SALE' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide truncate">
                      {t.type === 'SALE' ? `SALES_NODE_${t.reference.slice(-8).toUpperCase()}` : `SETTLEMENT_REF_${t.reference.slice(-8).toUpperCase()}`}
                    </p>
                    <p className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-wider mt-1">
                      {new Date(t.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1.5">
                    <p className={`text-xs font-mono font-bold tracking-tight ${t.type === 'WITHDRAW' ? 'text-rose-500' : 'text-zinc-100'}`}>
                      {t.type === 'WITHDRAW' ? '-' : '+'} ₦{Math.abs(t.amount).toLocaleString()}
                    </p>
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-md inline-block border ${
                      t.status === 'COMPLETED' ? 'bg-zinc-950 text-emerald-500 border-zinc-900' :
                      t.status === 'PROCESSING' ? 'bg-zinc-950 text-blue-400 border-zinc-900' :
                      t.status === 'PENDING' ? 'bg-zinc-950 text-amber-500 border-zinc-900' :
                      'bg-zinc-950 text-zinc-600 border-zinc-900'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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

/* --- SUB-COMPONENTS --- */

function LoadingTreasury() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <Loader2 className="animate-spin text-[#991B1B]" size={36} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-mono font-bold uppercase tracking-[0.3em] text-[9px] text-zinc-500 animate-pulse">Synchronizing_Treasury_Matrix</p>
    </div>
  );
}