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
  CreditCard
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import WithdrawalRequestModal from '@/src/components/dashboard/WithdrawalRequestModal';

// Types aligned with Multi-Vendor Settlement Registry
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

  useEffect(() => {
    fetchWalletData();
  }, []);

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
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. COMPACT HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Treasury</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck size={12} className="text-orange-600" strokeWidth={3} />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Escrow_Protocol_Active</span>
          </div>
        </div>
        <button className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} className="text-slate-600" />
        </button>
      </div>

      {/* 2. LIQUIDITY CARDS (Mobile Scrollable / Desktop Grid) */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        <WalletCard 
          title="Liquidity" 
          amount={data.wallet.availableBalance} 
          icon={Banknote} 
          variant="dark"
        />
        <WalletCard 
          title="Escrow" 
          amount={data.wallet.pendingBalance} 
          icon={Clock} 
          variant="light"
        />
        <WalletCard 
          title="Withdrawn" 
          amount={data.totalWithdrawn} 
          icon={ArrowUpRight} 
          variant="light"
        />
      </div>

      {/* 3. SETTLEMENT ACTION */}
      <div className="bg-slate-900 p-6 md:p-10 rounded-[2rem] border-l-[8px] border-orange-600 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 group relative overflow-hidden">
        <div className="z-10 text-center md:text-left">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Initiate Settlement</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Migrate earnings to verified business account</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="z-10 w-full md:w-auto bg-white text-slate-900 px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-lg active:scale-95"
        >
          Request Payout
        </button>
        <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-white opacity-5 w-40 h-40 group-hover:rotate-12 transition-transform duration-1000" />
      </div>

      {/* 4. ACTIVITY LEDGER */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-2">
          <History size={16} className="text-slate-400" />
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Registry_Audit_History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400">
              <tr className="text-[9px] font-black uppercase tracking-widest">
                <th className="p-6">Registry_Ref</th>
                <th className="p-6 text-center">Protocol</th>
                <th className="p-6 text-right">Value</th>
                <th className="p-6 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.transactions.length > 0 ? data.transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-black text-slate-900 text-[11px] font-mono tracking-tighter uppercase">#{t.reference.slice(-6)}</p>
                    <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-md uppercase border ${
                      t.type === 'SALE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`p-6 text-right font-black text-xs italic ${t.type === 'WITHDRAW' ? 'text-red-500' : 'text-slate-900'}`}>
                    {t.type === 'WITHDRAW' ? '-' : '+'} ₦{Number(t.amount).toLocaleString()}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[9px] font-black text-slate-900 uppercase italic">{t.status}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'COMPLETED' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center font-black text-slate-200 uppercase text-[10px] tracking-widest">Registry_Empty</td>
                </tr>
              )}
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
    <div className={`min-w-[240px] md:min-w-0 p-7 rounded-[1.8rem] transition-all duration-300 ${
      isDark ? 'bg-slate-900 text-white shadow-xl ring-4 ring-slate-900/10' : 'bg-white text-slate-900 border border-slate-100 shadow-sm'
    }`}>
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl mb-6 ${isDark ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
        <Icon size={20} strokeWidth={3} />
      </div>
      <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-300'}`}>{title}</p>
      <p className="text-2xl font-black mt-1 italic tracking-tighter leading-none">₦{Number(amount).toLocaleString()}</p>
    </div>
  );
}

function LoadingTreasury() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={32} />
      <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400 italic">Syncing_Treasury_Node</p>
    </div>
  );
}