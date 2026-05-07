"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, Wallet, Clock, CheckCircle2, CreditCard, Search, Activity, 
  ArrowUpRight, Loader2, Info, Banknote, XCircle, ShieldCheck, Landmark, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

// --- DATA CONTRACTS ---
interface WithdrawalRequest {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: string;
  vendor: {
    id: string; storeName: string;
    bankName?: string; accountNumber?: string; accountName?: string;
  };
}

interface FinancialStats {
  totalRevenue: number; commissionEarned: number;
  pendingPayouts: number; payoutsIssued: number; refundsIssued: number;
}

export default function AdminPaymentsPage() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // PROTOCOL STATE
  const [viewingBank, setViewingBank] = useState<WithdrawalRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, withdrawalsRes] = await Promise.all([
        api.get("/admin/overview"),
        api.get("/admin/withdrawals/pending")
      ]);
      setStats(statsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch (error) {
      toast.error("PROTOCOL_SYNC_ERROR: Financial node offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (
  id: string,
  action: 'approve' | 'reject'
) => {
  const confirmMsg =
    action === 'approve'
      ? 'AUTHORIZE_SETTLEMENT: Finalize fund migration to vendor node?'
      : 'REJECT_SETTLEMENT: Return funds to vendor balance?';

  const confirmed = window.confirm(confirmMsg);

  if (!confirmed) return;

  try {
    setIsProcessing(id);

    // ✅ CORRECT ROUTE
    await api.patch(
      `/admin/withdrawals/${id}/${action}`
    );

    toast.success(
      `SETTLEMENT_${action.toUpperCase()}: Registry updated.`
    );

    setViewingBank(null);

    await fetchData();
  } catch (error: any) {
    toast.error(
      `COMMAND_FAILED: ${
        error?.response?.data?.message ||
        'Signal lost.'
      }`
    );
  } finally {
    setIsProcessing(null);
  }
};

  const filteredWithdrawals = withdrawals.filter(w => 
    w.vendor.storeName.toLowerCase().includes(search.toLowerCase()) ||
    w.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !stats) return <LoadingRegistry />;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100 selection:bg-emerald-500/30">
      
      {/* 1. COMPACT COMMAND HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/50 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <CreditCard size={12} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Treasury_Allocation_Node</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
            Payments <span className="text-zinc-600">& Payouts</span>
          </h1>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input 
            type="text"
            placeholder="QUERY REGISTRY..."
            className="bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[10px] font-bold tracking-widest uppercase w-full outline-none focus:border-emerald-500/50 transition-all font-mono"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* 2. REVENUE GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatNode label="Total Revenue" val={stats?.totalRevenue} color="text-white" />
        <StatNode label="Commission" val={stats?.commissionEarned} color="text-emerald-500" />
        <StatNode label="In Escrow" val={stats?.pendingPayouts} color="text-amber-500" />
        <StatNode label="Settled" val={stats?.payoutsIssued} color="text-zinc-400" isRaw />
        <StatNode label="Refunds" val={stats?.refundsIssued} color="text-rose-500" isRaw />
      </div>

      {/* 3. SETTLEMENT QUEUE */}
      <div className="rounded-2xl border border-zinc-800 bg-[#050505] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Withdrawal Request Queue</h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono text-zinc-600">
            <Clock size={12} /> Registry_Sync: Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                <th className="p-5 italic text-center">#</th>
                <th className="p-5">Vendor_Node</th>
                <th className="p-5">Value</th>
                <th className="p-5">Timestamp</th>
                <th className="p-5 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredWithdrawals.length === 0 ? (
                <EmptyTable colSpan={5} />
              ) : filteredWithdrawals.map((w, i) => (
                <tr key={w.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="p-5 text-zinc-700 font-mono text-[10px] text-center">{i + 1}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                        <Wallet size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-200 uppercase tracking-tight">{w.vendor.storeName}</p>
                        <button 
                          onClick={() => setViewingBank(w)}
                          className="text-[8px] font-mono text-emerald-500 hover:text-white uppercase tracking-widest mt-0.5 flex items-center gap-1"
                        >
                          <Landmark size={10} /> View_Bank_Node
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-black text-white italic tracking-tighter">
                    ₦{w.amount.toLocaleString()}
                  </td>
                  <td className="p-5 text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleAction(w.id, 'approve')} 
                      disabled={isProcessing === w.id}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black rounded-lg hover:bg-white transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      {isProcessing === w.id ? <Loader2 size={12} className="animate-spin" /> : 'Authorize_Release'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BANK VERIFICATION POPOVER */}
      {viewingBank && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Verification_Registry</h3>
              <button onClick={() => setViewingBank(null)} className="text-zinc-600 hover:text-white"><XCircle size={18} /></button>
            </div>
            
            <div className="p-6 space-y-5">
              <DetailBox label="Financial_Institution" value={viewingBank.vendor.bankName} />
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">NUBAN_Account</p>
                <div className="bg-black border border-zinc-900 p-3 rounded-lg flex justify-between items-center">
                  <p className="text-lg font-mono font-black text-white tracking-[0.2em]">{viewingBank.vendor.accountNumber || "----------"}</p>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
              </div>
              <DetailBox label="Registry_Identity" value={viewingBank.vendor.accountName || "PENDING_VERIFICATION"} />
            </div>

            <div className="p-4 bg-zinc-900/30 border-t border-zinc-900 flex gap-3">
              <button 
                onClick={() => handleAction(viewingBank.id, 'reject')}
                className="flex-1 py-3 border border-rose-500/30 text-rose-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Reject_Node
              </button>
              <button 
                onClick={() => handleAction(viewingBank.id, 'approve')}
                className="flex-1 py-3 bg-emerald-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all"
              >
                Confirm_&_Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECURITY NOTICE */}
      <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl max-w-2xl">
        <Info size={14} className="text-emerald-500 shrink-0" />
        <p className="text-[9px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest italic">
          Protocol: Manual verification of the account identity is required before capital release. Finalized migrations are irreversible.
        </p>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatNode({ label, val, color, isRaw }: any) {
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-1">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</p>
      <p className={`text-lg font-black italic tracking-tighter ${color}`}>
        {isRaw ? val ?? 0 : `₦${(val ?? 0).toLocaleString()}`}
      </p>
    </div>
  );
}

function DetailBox({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-zinc-200 uppercase italic tracking-tight">{value || "NOT_PROVIDED"}</p>
    </div>
  );
}

function EmptyTable({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-20 text-center text-zinc-700 text-[9px] font-mono uppercase tracking-[0.3em]">
        Registry sync complete: No pending settlements detected.
      </td>
    </tr>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] animate-pulse">Syncing_Treasury_Registry...</p>
    </div>
  );
}