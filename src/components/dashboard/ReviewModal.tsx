'use client';

import { useState, useTransition } from 'react';
import {
  X,
  Star,
  Loader2,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ReviewModalProps {
  product: {
    id: string;
    title: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({
  product,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!rating) {
      return toast.error(
        'Please provide a Quality_Score valuation.',
      );
    }

    startTransition(async () => {
      try {
        await api.post(
          `/products/${product.id}/reviews`,
          {
            rating,
            comment: comment.trim(),
          },
        );

        setIsSuccess(true);

        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2200);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            'Sync Protocol Failed',
        );
      }
    });
  };

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="w-full max-w-sm rounded-[2rem] bg-white p-10 shadow-2xl border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2
                  size={40}
                  className="animate-in zoom-in duration-700"
                />
              </div>
              <div className="absolute -inset-2 rounded-full border border-emerald-500/10 animate-ping" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
                Evaluation Logged
              </h2>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                Registry Synchronized
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-[110]
        flex justify-center
        items-start md:items-center
        pt-20 md:pt-0
        px-4 md:px-6
        pb-6
        bg-gray-900/60
        backdrop-blur-md
        overflow-y-auto
        animate-in fade-in duration-300
      "
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div
        className="
          w-full max-w-md
          max-h-[90vh]
          bg-white
          rounded-[2rem]
          shadow-2xl
          border border-gray-100
          overflow-hidden
          flex flex-col
          animate-in zoom-in-95 slide-in-from-bottom-8 duration-500
        "
      >
        {/* HEADER */}
        <div className="px-6 md:px-8 pt-6 pb-4 flex items-start justify-between border-b border-gray-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={12}
                className="text-[#A4143D]"
              />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A4143D]">
                Registry Protocol
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">
              Review Artifact
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
          {/* PRODUCT */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                Target Identity
              </p>
              <p className="mt-1 text-[12px] font-black uppercase truncate text-gray-800 pr-4">
                {product.title}
              </p>
            </div>

            <Sparkles
              size={14}
              className="text-[#A4143D] shrink-0"
            />
          </div>

          {/* STARS */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => {
                const active =
                  num <=
                  (hoveredRating || rating);

                return (
                  <button
                    key={num}
                    onMouseEnter={() =>
                      setHoveredRating(num)
                    }
                    onMouseLeave={() =>
                      setHoveredRating(0)
                    }
                    onClick={() =>
                      setRating(num)
                    }
                    className="transition-all active:scale-90 hover:-translate-y-1"
                  >
                    <Star
                      size={32}
                      strokeWidth={
                        active ? 0 : 1.5
                      }
                      className={`transition-all duration-300 ${
                        active
                          ? 'fill-[#A4143D] text-[#A4143D]'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="px-5 py-2 rounded-full bg-[#A4143D]/5 border border-[#A4143D]/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A4143D]">
                {rating
                  ? `${rating}/5 Quality Index`
                  : 'Awaiting Valuation'}
              </p>
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
              Detailed Transmission
            </label>

            <textarea
              placeholder="Describe the artifact experience..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              className="
                w-full h-36
                rounded-3xl
                bg-gray-50
                border border-gray-100
                p-5
                text-sm
                font-medium
                outline-none
                resize-none
                transition-all
                focus:bg-white
                focus:border-[#A4143D]/20
              "
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 md:p-8 border-t border-gray-50 bg-white">
          <button
            onClick={handleSubmit}
            disabled={
              isPending || !rating
            }
            className="
              w-full h-14
              rounded-2xl
              bg-gray-900
              text-white
              text-[11px]
              font-black
              uppercase
              tracking-[0.25em]
              flex items-center justify-center gap-3
              transition-all
              hover:bg-[#A4143D]
              disabled:opacity-30
              active:scale-[0.98]
            "
          >
            {isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <>
                Submit Review
                <Send
                  size={14}
                  className="-rotate-12"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}