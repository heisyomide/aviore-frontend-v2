'use client';

import { useState, useTransition } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Info, Loader2, Ban } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReturnMediationProps {
  request: {
    id: string;
    orderId: string;
    reason: string;
    description: string;
    user: { firstName: string; lastName: string };
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReturnMediationModal({ request, onClose, onSuccess }: ReturnMediationProps) {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  const handleMediation = async (status: 'APPROVED' | 'REJECTED') => {
    startTransition(async () => {
      try {
        await api.patch(`/vendor/returns/${request.id}/mediate`, { status });
        toast.success(`Registry updated: Return ${status}`);
        onSuccess?.();
        onClose();
      } catch (error: any) {
        toast.error("Mediation Protocol Failed");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#A4143D]" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Mediation_Protocol_v1</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">Review Reversal</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6 scrollbar-hide">
          {/* CUSTOMER INFO */}
          <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
               <Info size={20} />
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Claimant_Identity</p>
              <p className="text-sm font-black text-gray-900 italic uppercase tracking-tighter">
                {request.user.firstName} {request.user.lastName}
              </p>
            </div>
          </div>

          {/* CLAIM DETAILS */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[#A4143D] uppercase tracking-widest">Reason_Log</p>
              <p className="text-xs font-bold text-gray-900 bg-[#A4143D]/5 px-4 py-2 rounded-xl inline-block">
                {request.reason.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Detailed_Evidence</p>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 italic text-xs font-medium text-gray-600 leading-relaxed">
                "{request.description}"
              </div>
            </div>
          </div>
        </div>

        {/* MEDIATION ACTIONS */}
        <div className="p-8 pt-4 bg-gray-50/50 grid grid-cols-2 gap-4 border-t border-gray-50">
          <button
            onClick={() => handleMediation('REJECTED')}
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-5 bg-white border-2 border-gray-200 text-gray-400 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-30"
          >
            {isPending && actionType === 'REJECT' ? <Loader2 className="animate-spin" size={14} /> : <><Ban size={14} /> Reject</>}
          </button>

          <button
            onClick={() => handleMediation('APPROVED')}
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-5 bg-gray-900 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 disabled:opacity-30"
          >
            {isPending && actionType === 'APPROVE' ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle2 size={14} /> Approve</>}
          </button>
        </div>
      </div>
    </div>
  );
}