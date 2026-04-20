// /components/shop/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ current, total, onPageChange }: any) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-8 pt-12 border-t border-zinc-900">
      <button 
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="p-4 rounded-full border border-zinc-900 hover:border-white transition-all disabled:opacity-20"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-white italic tracking-tighter">0{current}</span>
        <div className="w-12 h-px bg-zinc-800" />
        <span className="text-xs font-bold text-zinc-600 tracking-widest uppercase">Registry_Limit: 0{total}</span>
      </div>

      <button 
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        className="p-4 rounded-full border border-zinc-900 hover:border-white transition-all disabled:opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}