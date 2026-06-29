'use client';

import { useState, useTransition, useEffect } from 'react';
import { X, Star, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReviewModalProps {
  product: { id: string; title: string; reviews?: any[] };
  onClose: () => void;
  onSuccess?: () => void;
  currentUserId?: string;
}

export default function ReviewModal({ product, onClose, onSuccess, currentUserId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. CLIENT-SIDE DUPLICATE REVIEW CHECK
  useEffect(() => {
    if (product.reviews && currentUserId) {
      const hasReviewedBefore = product.reviews.some((r: any) => r.userId === currentUserId);
      if (hasReviewedBefore) {
        toast.warning("You have already submitted a review for this product.");
        onClose();
      }
    }
  }, [product, currentUserId, onClose]);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a star rating.");
    
    startTransition(async () => {
      try {
        await api.post(`/products/${product.id}/reviews`, { rating, comment: comment.trim() });
        setIsSuccess(true);
        setTimeout(() => { 
          onSuccess?.(); 
          onClose(); 
        }, 2000);
      } catch (error: any) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message?.toLowerCase() || '';

        if (statusCode === 409 || statusCode === 400 || errorMessage.includes('already reviewed') || errorMessage.includes('duplicate')) {
          toast.error("You have already reviewed this item.");
          setTimeout(() => onClose(), 1500);
        } else {
          toast.error(error.response?.data?.message || "Failed to submit review");
        }
      }
    });
  };

  // SUCCESS STATE VIEW
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center space-y-4 shadow-xl border border-zinc-100">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} className="animate-in zoom-in duration-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-900">Review Submitted</h2>
            <p className="text-xs text-zinc-500">Thank you for sharing your feedback.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md flex flex-col rounded-t-3xl md:rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden animate-in slide-in-from-bottom-4 md:scale-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-zinc-100">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
              Product Feedback
            </span>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Write a Review
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="h-8 w-8 text-zinc-400 rounded-lg hover:bg-zinc-50 hover:text-zinc-950 transition-all flex items-center justify-center active:scale-95 shrink-0 border border-zinc-100"
          >
            <X size={15} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-5">
          
          {/* TARGET PRODUCT INFO */}
          <div className="space-y-1">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Item</span>
            <p className="text-sm font-semibold text-zinc-800 truncate">
              {product.title}
            </p>
          </div>

          {/* RATING SELECTION AREA */}
          <div className="flex flex-col items-center gap-3 py-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
              Overall Rating
            </span>
            
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num} 
                  onMouseEnter={() => setHoveredRating(num)} 
                  onMouseLeave={() => setHoveredRating(0)} 
                  onClick={() => setRating(num)} 
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={28} 
                    strokeWidth={num <= (hoveredRating || rating) ? 0 : 1.5} 
                    className={`transition-colors duration-150 ${
                      num <= (hoveredRating || rating) 
                        ? "fill-[#A4143D] text-[#A4143D]" 
                        : "text-zinc-300 fill-transparent"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <p className="text-[10px] font-bold text-zinc-500 min-h-[15px]">
              {rating > 0 ? `${rating} out of 5 stars` : "Tap to rate"}
            </p>
          </div>

          {/* COMMENT TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block">
              Review Details
            </label>
            <textarea 
              placeholder="What did you like or dislike? How was the quality?"
              className="w-full p-4 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-400 outline-none h-32 resize-none transition-all placeholder:text-zinc-400 leading-relaxed shadow-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isPending || rating === 0}
            className="w-full h-11 bg-zinc-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <span>Submit Review</span>
                <Send size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}