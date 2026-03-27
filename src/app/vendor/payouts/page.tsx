'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Banknote, 
  Clock, 
  Loader2, 
  ShieldCheck, 
  Download,
  History,
  TrendingUp,
  CreditCard,
  Bell,
  ChevronRight,
  ArrowDownLeft,
  RefreshCw
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import WithdrawalRequestModal from '@/src/components/dashboard/WithdrawalRequestModal';

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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 📱 MOBILE VIEW: Logistics Wallet Interface */}
      <div className="lg:hidden animate-in fade-in duration-500">
        <div className="bg-[#1E293B] p-6 pt-12 pb-14 rounded-b-[2.5rem] text-white flex justify-between items-start shadow-2xl relative z-10">
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic uppercase">Treasury Node</h1>
            <p className="opacity-50 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
              <ShieldCheck size={10} className="text-orange-500" /> Secure Escrow Active
            </p>
          </div>
          <button className="bg-slate-800 p-2.5 rounded-full border border-slate-700 active:scale-90 transition-transform">
            <RefreshCw size={18} onClick={fetchWalletData} />
          </button>
        </div>

        {/* Main Liquidity Card (Mobile) */}
        <div className="px-6 -mt-10 relative z-20">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl border border-slate-800 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Liquidity</p>
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">
              ₦{data.wallet.availableBalance.toLocaleString()}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/50">
              <div>
                <p className="text-[8px] font-bold text-slate-500 uppercase">In Escrow</p>
                <p className="text-sm font-black text-orange-500 italic">₦{data.wallet.pendingBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-500 uppercase">Lifetime</p>
                <p className="text-sm font-black text-green-500 italic">₦{data.wallet.totalEarnings.toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-orange-900/40"
            >
              Initialize Settlement <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Transaction History */}
        <div className="px-6 mt-8 space-y-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Registry</h3>
            <span className="text-[9px] font-bold text-blue-600 flex items-center gap-1">Download CSV <Download size={10}/></span>
          </div>
          <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100">
            {data.transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 group">
                <div className={`p-3 rounded-2xl ${t.type === 'SALE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                   {t.type === 'SALE' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black text-slate-900 uppercase italic">Node {t.reference.slice(-6).toUpperCase()}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(t.createdAt).toDateString()}</p>
                </div>
                <div className="text-right">
                   <p className={`text-xs font-black italic ${t.type === 'WITHDRAW' ? 'text-red-500' : 'text-slate-900'}`}>
                     {t.type === 'WITHDRAW' ? '-' : '+'}₦{t.amount.toLocaleString()}
                   </p>
                   <span className="text-[8px] font-black text-slate-300 uppercase">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💻 DESKTOP VIEW: Executive Treasury Ledger */}
      <div className="hidden lg:block max-w-6xl mx-auto space-y-8 p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Registry Treasury</h1>
            <p className="text-slate-400 text-sm font-medium italic flex items-center gap-2">
              <ShieldCheck size={14} className="text-orange-600" /> Decentralized Settlement Registry
            </p>
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 transition-all shadow-sm">
            <Download size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <WalletCard title="Available Liquidity" amount={data.wallet.availableBalance} icon={Banknote} variant="dark" />
          <WalletCard title="Escrow Reserve" amount={data.wallet.pendingBalance} icon={Clock} variant="light" />
          <WalletCard title="Platform Withdrawals" amount={data.totalWithdrawn} icon={ArrowUpRight} variant="light" />
        </div>

        <div className="bg-slate-900 p-10 rounded-4xl border-l-[12px] border-orange-600 shadow-2xl flex justify-between items-center group relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Liquidate Assets</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Initiate immediate settlement to business node</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="z-10 bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Request Payout
          </button>
          <TrendingUp className="absolute right-[-40px] bottom-[-40px] text-white opacity-5 w-64 h-64 group-hover:rotate-12 transition-all duration-1000" />
        </div>

        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History size={18} className="text-orange-600" />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs italic">Registry_Audit_History</h3>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="p-8">Registry_Reference</th>
                <th className="p-8 text-center">Protocol</th>
                <th className="p-8 text-right">Settlement_Value</th>
                <th className="p-8 text-right">Network_State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-8">
                    <p className="font-black text-slate-900 text-sm font-mono tracking-tighter uppercase">#{t.reference.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase border ${
                      t.type === 'SALE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`p-8 text-right font-black text-sm italic ${t.type === 'WITHDRAW' ? 'text-red-500' : 'text-slate-900'}`}>
                    {t.type === 'WITHDRAW' ? '-' : '+'} ₦{t.amount.toLocaleString()}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs font-black text-slate-900 uppercase italic">{t.status}</span>
                      <div className={`w-2 h-2 rounded-full ${t.status === 'COMPLETED' ? 'bg-green-500' : 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function WalletCard({ title, amount, icon: Icon, variant }: any) {
  const isDark = variant === 'dark';
  return (
    <div className={`p-8 rounded-4xl transition-all duration-500 group ${
      isDark ? 'bg-slate-900 text-white shadow-2xl ring-1 ring-slate-800' : 'bg-white text-slate-900 border border-slate-100 shadow-sm hover:border-orange-100'
    }`}>
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-8 transition-transform group-hover:-translate-y-1 ${isDark ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-orange-600'}`}>
        <Icon size={24} strokeWidth={3} />
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-300'}`}>{title}</p>
      <p className="text-3xl font-black mt-2 italic tracking-tighter group-hover:text-orange-500 transition-colors">₦{Number(amount).toLocaleString()}</p>
    </div>
  );
}

function LoadingTreasury() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Synchronizing_Treasury_Node</p>
    </div>
  );
}