"use client";

import { useState } from "react";
import {
  X,
  FileText,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  Terminal,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/src/lib/axios";

interface Vendor {
  id: string;
  storeName: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface Props {
  vendor: Vendor;
  onClose: () => void;
  onUpdate: () => void;
}

export default function KYCDetailModal({ vendor, onClose, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const fullName = `${vendor.user.firstName ?? ""} ${vendor.user.lastName ?? ""}`.trim() || "Unknown Merchant";

  async function handleDecision(status: "APPROVED" | "REJECTED", reason?: string) {
    if (loading) return;

    try {
      setLoading(true);
      // Ensure the key 'reason' is only sent if rejected or null otherwise
      const payload = {
        status,
        reason: status === "REJECTED" ? (reason || "No reason provided") : null,
      };

      // Corrected URL matching your NestJS Patch route
      await api.patch(`/admin/vendors/${vendor.id}/kyc-decision`, payload);

      toast.success(status === "APPROVED" ? "Identity Authorized" : "Identity Rejected");
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("KYC_DECISION_ERROR", error);
      const message = error?.response?.data?.message || "Protocol override failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = () => handleDecision("APPROVED");

  const handleReject = () => {
    const reason = window.prompt("ENTER REJECTION REASON:");
    if (!reason || reason.trim().length === 0) {
      toast.error("Rejection reason is mandatory.");
      return;
    }
    handleDecision("REJECTED", reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl scale-in-95 animate-in">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-500">
              <Terminal size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Identity Verification</span>
            </div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Merchant Validation</h2>
            <p className="text-[10px] font-mono text-zinc-600 uppercase">Node_ID: {vendor.id}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6 p-6 rounded-xl bg-zinc-900/20 border border-zinc-800">
            <div>
              <span className="text-[9px] text-zinc-600 uppercase flex gap-2 items-center font-bold tracking-widest"><User size={12} /> Merchant</span>
              <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight">{fullName}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">{vendor.user.email}</p>
            </div>
            <div>
              <span className="text-[9px] text-zinc-600 uppercase flex gap-2 items-center font-bold tracking-widest"><Building size={12} /> Store</span>
              <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight">{vendor.storeName}</p>
            </div>
          </div>

          {/* DOCUMENT VIEWER - FIXED HOVER TRIGGER */}
          <div className="group relative aspect-video bg-zinc-950 rounded-xl border border-zinc-900 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-amber-500/30">
            <FileText size={48} className="text-zinc-800 mb-3 group-hover:text-amber-500/50 transition-colors duration-500" />
            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Government Identity Document</span>

            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:border-amber-500 hover:text-amber-500 transition-all">
                <Eye size={14} /> View Document
              </button>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex gap-4">
          <button
            disabled={loading}
            onClick={handleReject}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-30 transition-all hover:bg-rose-500/20"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
            Reject Access
          </button>

          <button
            disabled={loading}
            onClick={handleApprove}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-30 transition-all hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Authorize Node
          </button>
        </div>
      </div>
    </div>
  );
}