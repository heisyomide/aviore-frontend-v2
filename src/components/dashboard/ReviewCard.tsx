'use client';

import { Star, Edit3, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  product: string;
  rating: number;
  date: string;
  review: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReviewCard({ product, rating, date, review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-50 transition-colors" />

      <div className="relative z-10 space-y-6">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter italic text-lg leading-none">{product}</h3>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < rating ? "fill-orange-500 text-orange-500" : "text-gray-200"} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{date}</span>
          </div>
        </header>

        <blockquote className="text-sm font-medium text-gray-600 leading-relaxed italic border-l-4 border-orange-500/20 pl-6 py-1">
          "{review || 'Synchronized without textual log.'}"
        </blockquote>

        <footer className="flex gap-4 pt-2">
          <button 
            onClick={onEdit} 
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg"
          >
            <Edit3 size={14} /> Edit_Registry
          </button>
          <button 
            onClick={onDelete} 
            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
          >
            <Trash2 size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}