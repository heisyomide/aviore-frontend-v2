'use client';

import { useState, useTransition } from 'react';
import { X, ArrowRight, Loader2, CheckCircle2, ShieldAlert, FileText, ClipboardList } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReturnModalProps {
  order: { id: string; vendorId: string; productTitle: string };
  onClose: () => void;
  onSuccess?: () => void;
}

const REASONS = [
  { id: 'DEFECTIVE', label: 'Artifact Defect', sub: 'Damaged or non-functional' },
  { id: 'NOT_AS_DESCRIBED', label: 'Registry Mismatch', sub: 'Differs from description' },
  { id: 'SIZE_ISSUE', label: 'Dimension Error', sub: 'Sizing requirements' },
  { id: 'OTHER', label: 'Other Protocol', sub: 'Generic reversal' },
];

export default function ReturnRequestModal({ order, onClose, onSuccess }: ReturnModalProps) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return toast.error("Please provide detailed context.");
    startTransition(async () => {
      try {
        await api.post('/user/support/returns', { orderId: order.id, vendorId: order.vendorId, reason, description: description.trim() });
        setIsSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 2500);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Return Protocol Failed");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xl animate-in fade-in">
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 flex flex-col items-center text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#f26522] relative">
            <CheckCircle2 size={40} className="animate-in zoom-in" />
            <div className="absolute inset-0 rounded-full border-4 border-[#f26522]/20 animate-ping" />
          </div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">Reversal_Initiated</h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pending Merchant Mediation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* 1. Added max-h-[90vh] and flex-col */}
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4">
        
        {/* FIXED HEADER */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert size={12} className="text-[#f26522]" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#f26522]">Reversal_Protocol</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">Request Return</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-8 flex gap-1">
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#f26522]' : 'bg-gray-100'}`} />
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#f26522]' : 'bg-gray-100'}`} />
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 scrollbar-hide">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Step_01</p>
                <h4 className="text-md font-bold text-gray-900">Select reason for reversal</h4>
              </div>
              <div className="grid gap-2">
                {REASONS.map((r) => (
                  <button key={r.id} onClick={() => { setReason(r.id); setStep(2); }} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.8rem] border-2 border-transparent hover:border-[#f26522]/20 hover:bg-white transition-all group">
                    <div className="text-left">
                      <p className="font-black text-[10px] uppercase tracking-tight text-gray-900">{r.label}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{r.sub}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-[#f26522] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <button onClick={() => setStep(1)} className="text-[9px] font-black text-[#f26522] uppercase tracking-widest flex items-center gap-1 hover:underline">
                ← Reasons
              </button>
              
              <div className="p-4 bg-gray-50 rounded-[1.2rem] flex items-center gap-3">
                <ClipboardList size={14} className="text-[#f26522]" />
                <p className="text-[9px] font-black text-gray-900 uppercase italic truncate">{reason.replace(/_/g, ' ')}</p>
              </div>

              <textarea
                placeholder="Detail the defect or reason..."
                className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] text-xs font-bold focus:bg-white focus:border-[#f26522]/10 outline-none h-32 resize-none transition-all placeholder:text-gray-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* FIXED FOOTER */}
        {step === 2 && (
          <div className="p-8 pt-0 animate-in slide-in-from-bottom-2">
            <button
              onClick={handleSubmit}
              disabled={isPending || !description.trim()}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#f26522] transition-all disabled:opacity-30"
            >
              {isPending ? <Loader2 className="animate-spin" size={16} /> : <><FileText size={16} /> Transmit_Request</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}