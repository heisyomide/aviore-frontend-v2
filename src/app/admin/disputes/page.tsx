"use client";

import { useState, useEffect } from "react";
import { 
  Gavel, AlertCircle, CheckCircle2, XCircle, 
  Scale, Banknote, ShieldAlert, Image as ImageIcon,
  User, Store, ArrowRight, Loader2, Search
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

export default function DisputeCenter() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      const res = await api.get("/admin/disputes");
      setDisputes(res.data);
    } catch (error) {
      toast.error("LEDGER_ERROR: Handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDisputes(); }, []);

  const renderVerdict = async (action: string, amount?: number) => {
    try {
      await api.patch(`/admin/disputes/${selectedDispute.id}/resolve`, { action, amount });
      toast.success("VERDICT_RENDERED: Protocol updated.");
      fetchDisputes();
      setSelectedDispute(null);
    } catch {
      toast.error("COMMAND_ERROR: Arbitration failed.");
    }
  };

  return (
    <div className="p-8 bg-[#020202] min-h-screen text-zinc-100 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-900 pb-10 mb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Scale size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arbitration Center</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            Conflicts <span className="text-zinc-800">&</span> Claims
          </h1>
        </div>

        <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 h-14 w-80 items-center px-4 gap-3 focus-within:border-indigo-500 transition-all">
          <Search size={18} className="text-zinc-600" />
          <input placeholder="Search Dispute ID..." className="bg-transparent border-none outline-none text-xs font-bold w-full uppercase" />
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* DISPUTE TABLE (SCANNABLE) */}
        <div className="lg:col-span-2 bg-[#050505] border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] uppercase text-zinc-600 font-black border-b border-zinc-900">
                <th className="p-8">Dispute_Node</th>
                <th>Order_Ref</th>
                <th>Entity_Conflict</th>
                <th>Status</th>
                <th className="p-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {disputes.map((d) => (
                <tr key={d.id} className="group hover:bg-zinc-900/30 transition-colors">
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black italic tracking-tight">{d.id.slice(-8)}</span>
                      <span className="text-[9px] font-mono text-zinc-700">{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="text-xs font-bold text-zinc-400">#{d.orderId.slice(-6)}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase"><User size={12} className="text-indigo-500"/> {d.customerId.slice(0, 8)}</div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase"><Store size={12} className="text-amber-500"/> {d.vendorId.slice(0, 8)}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                      d.status === 'OPEN' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' : 'border-zinc-800 text-zinc-600'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => setSelectedDispute(d)} className="p-3 bg-zinc-900 rounded-xl hover:bg-indigo-600 transition-all text-zinc-500 hover:text-white border border-zinc-800">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ARBITRATION PANEL (DECISION) */}
        <div className="lg:col-span-1">
          {selectedDispute ? (
            <div className="bg-[#050505] border border-zinc-900 p-10 rounded-[2.5rem] sticky top-8 space-y-10 animate-in slide-in-from-right-4 duration-500 shadow-2xl">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><Gavel size={14}/> Verdict_Chamber</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Analyze Conflict</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-black/50 border border-zinc-900 p-6 rounded-2xl">
                  <span className="text-[9px] font-black text-zinc-700 uppercase block mb-2">Claim_Reason</span>
                  <p className="text-xs leading-relaxed text-zinc-400 font-medium">"{selectedDispute.reason}"</p>
                </div>
              </div>

              {/* ACTION HUB */}
              <div className="space-y-4">
                <button 
                  onClick={() => renderVerdict('REFUND_FULL')}
                  className="w-full h-16 bg-white text-black rounded-2xl flex items-center justify-between px-6 hover:bg-emerald-500 hover:text-white transition-all group"
                >
                  <span className="text-xs font-black uppercase tracking-widest">Full Refund Buyer</span>
                  <Banknote size={20} className="group-hover:rotate-12 transition-transform" />
                </button>

                <button 
                  onClick={() => renderVerdict('PAY_VENDOR')}
                  className="w-full h-16 bg-zinc-900 border border-zinc-800 text-white rounded-2xl flex items-center justify-between px-6 hover:bg-indigo-600 transition-all group"
                >
                  <span className="text-xs font-black uppercase tracking-widest">Release Payment to Vendor</span>
                  <CheckCircle2 size={20} />
                </button>

                <button 
                   onClick={() => {
                     const amount = prompt("Enter Partial Refund Amount:");
                     if(amount) renderVerdict('PARTIAL_REFUND', Number(amount));
                   }}
                   className="w-full h-16 bg-zinc-900/50 border border-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-between px-6 hover:text-white transition-all group"
                >
                  <span className="text-xs font-black uppercase tracking-widest">Partial Refund</span>
                  <ShieldAlert size={20} />
                </button>
              </div>

              <button onClick={() => setSelectedDispute(null)} className="w-full py-4 text-[10px] font-black uppercase text-zinc-700 hover:text-zinc-400 transition-colors">
                Deselect Node
              </button>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-40">
              <Scale size={60} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">
                Awaiting_Arbitration_Node <br /> Select a claim to render verdict
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}