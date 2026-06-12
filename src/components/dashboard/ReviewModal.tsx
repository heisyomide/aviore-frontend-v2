'use client';

import { useState, useTransition, useEffect } from 'react';
import { X, Star, Loader2, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReviewModalProps {
  product: { id: string; title: string; reviews?: any[] };
  onClose: () => void;
  onSuccess?: () => void;
  currentUserId?: string; // Optional: Pass current user ID to do a rapid client-side check on mount
}

export default function ReviewModal({ product, onClose, onSuccess, currentUserId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. RUN DEFENSIVE CLIENT-SIDE DUPLICATE REVIEW CHECK ON MOUNT
  useEffect(() => {
    if (product.reviews && currentUserId) {
      const hasReviewedBefore = product.reviews.some((r: any) => r.userId === currentUserId);
      if (hasReviewedBefore) {
        toast.warning("You have already submitted an evaluation for this product.");
        onClose();
      }
    }
  }, [product, currentUserId, onClose]);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please provide a Quality_Score valuation.");
    
    startTransition(async () => {
      try {
        await api.post(`/products/${product.id}/reviews`, { rating, comment: comment.trim() });
        setIsSuccess(true);
        setTimeout(() => { 
          onSuccess?.(); 
          onClose(); 
        }, 2200);
      } catch (error: any) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message?.toLowerCase() || '';

        // 2. BACKEND RESPONSE VALIDATION CHANNELS FOR ALREADY REVIEWED DATA
        if (statusCode === 409 || statusCode === 400 || errorMessage.includes('already reviewed') || errorMessage.includes('duplicate')) {
          toast.error("Review Denied: You have already completed a product evaluation for this item.");
          setTimeout(() => onClose(), 1500);
        } else {
          // Standard structural network fault fallback
          toast.error(error.response?.data?.message || "Sync Protocol Failed");
        }
      }
    });
  };

  // SUCCESS STATE VIEW
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-12 flex flex-col items-center text-center space-y-6 shadow-2xl border border-gray-50">
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={40} className="animate-in zoom-in duration-700" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/10 animate-ping" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Evaluation_Logged</h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">Registry Synchronized</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md flex flex-col rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#A4143D]" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Registry_Protocol</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900 leading-none">Review Artifact</h2>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-8 py-4 space-y-8">
          
          {/* TARGET INFO */}
          <div className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100 flex items-center justify-between group">
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Target_Identity</p>
              <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight truncate pr-4">{product.title}</p>
            </div>
            <Sparkles size={14} className="text-[#A4143D] shrink-0 group-hover:rotate-12 transition-transform" />
          </div>

          {/* RATING SECTION */}
          <div className="flex flex-col items-center gap-5 py-2">
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num} 
                  onMouseEnter={() => setHoveredRating(num)} 
                  onMouseLeave={() => setHoveredRating(0)} 
                  onClick={() => setRating(num)} 
                  className="transition-all transform active:scale-75 hover:-translate-y-1"
                >
                  <Star 
                    size={34} 
                    strokeWidth={num <= (hoveredRating || rating) ? 0 : 1.5} 
                    className={`transition-all duration-300 ${
                      num <= (hoveredRating || rating) 
                        ? "fill-[#A4143D] text-[#A4143D] drop-shadow-xl" 
                        : "text-gray-200 fill-transparent"
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="px-5 py-2 bg-[#A4143D]/5 rounded-full border border-[#A4143D]/5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A4143D]">
                {rating > 0 ? `${rating.toString().padStart(2, '0')} / 05 Quality_Index` : "Awaiting_Valuation"}
              </p>
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <div className="h-px w-4 bg-gray-100" />
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Detailed_Transmission</label>
            </div>
            <textarea 
              placeholder="Describe the artifact experience..."
              className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[1.8rem] text-[12px] font-medium focus:bg-white focus:border-[#A4143D]/10 focus:ring-0 outline-none h-36 resize-none transition-all placeholder:text-gray-300 leading-relaxed"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8">
          <button 
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
            className="w-full h-16 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 disabled:opacity-20 transition-all hover:bg-[#A4143D] hover:shadow-xl hover:shadow-[#A4143D]/20 active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Transmit_Evaluation
                <Send size={14} className="-rotate-12 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}