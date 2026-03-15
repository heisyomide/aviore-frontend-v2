'use client';

import { useState, useTransition } from 'react';
import { X, Star, Loader2, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReviewModalProps {
  product: { id: string; title: string };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({ product, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please provide a Quality_Score valuation.");
    startTransition(async () => {
      try {
        await api.post(`/products/${product.id}/reviews`, { rating, comment: comment.trim() });
        setIsSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 2200);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Sync Protocol Failed");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl animate-in fade-in">
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 flex flex-col items-center text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 relative">
            <CheckCircle2 size={40} className="animate-in zoom-in duration-700" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Evaluation_Logged</h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">Registry Synchronized</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Container limited to 90% screen height */}
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-[3rem] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4">
        
        {/* FIXED HEADER */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#A4143D]" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Registry_Protocol</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">Review Artifact</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-2 space-y-6 scrollbar-hide">
          {/* TARGET INFO */}
          <div className="p-4 bg-gray-50/80 rounded-[1.5rem] border border-gray-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Target_Identity</p>
              <p className="text-xs font-black text-gray-900 italic uppercase tracking-tighter truncate max-w-[240px]">{product.title}</p>
            </div>
            <Sparkles size={14} className="text-[#A4143D]" />
          </div>

          {/* RATING SECTION */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} onMouseEnter={() => setHoveredRating(num)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setRating(num)} className="transition-all transform active:scale-75 hover:-translate-y-1">
                  <Star size={32} strokeWidth={1.5} className={`transition-all duration-300 ${num <= (hoveredRating || rating) ? "fill-[#A4143D] text-[#A4143D] drop-shadow-lg" : "text-gray-200 fill-gray-50"}`} />
                </button>
              ))}
            </div>
            <div className="px-4 py-1.5 bg-[#A4143D]/5 rounded-full">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A4143D]">
                {rating > 0 ? `${rating} / 05 Quality_Index` : "Select Valuation"}
              </p>
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="space-y-2 pb-2">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Detailed_Transmission</label>
            <textarea 
              placeholder="Log experience..."
              className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] text-[11px] font-bold focus:bg-white focus:border-[#A4143D]/10 outline-none h-32 resize-none transition-all placeholder:text-gray-300"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="p-8 pt-4">
          <button 
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
            className="w-full py-5 bg-gray-900 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 disabled:opacity-30 transition-all hover:bg-[#A4143D]"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} className="-rotate-12" /> Transmit_Evaluation</>}
          </button>
        </div>
      </div>
    </div>
  );
}