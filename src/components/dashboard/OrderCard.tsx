'use client';

import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Star, 
  Truck, 
  ExternalLink, 
  ChevronRight, 
  FileText,
  ShieldCheck,
  Loader2
} from 'lucide-react';

type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'returned' | 'cancelled';

interface OrderCardProps {
  id: string;
  fullId: string; 
  date: string;
  amount: number;
  status: OrderStatus;
  vendorId: string;
  trackingNumber?: string;
  carrier?: string;
  intent?: 'chat' | 'return' | null;
  onOpenDetails: (id: string) => void;
  onRateProduct: () => void;
  onReturnRequest: () => void;
  onConfirmReceipt: () => void;
  isSettling: boolean;
}

export default function OrderCard({ 
  id, fullId, date, amount, status, vendorId, trackingNumber, 
  carrier, intent, onOpenDetails, onRateProduct, 
  onConfirmReceipt, isSettling 
}: OrderCardProps) {
  const router = useRouter();

  // Modern, clean typography-based badge styles (No heavy colored backgrounds)
  const statusStyles: Record<OrderStatus, string> = {
    paid: 'text-orange-600 font-extrabold',
    processing: 'text-orange-500 font-extrabold',
    shipped: 'text-blue-600 font-extrabold',
    delivered: 'text-[#A4143D] font-extrabold',
    completed: 'text-emerald-600 font-extrabold',
    returned: 'text-red-600 font-extrabold',
    cancelled: 'text-zinc-400 font-medium',
  };

  const navigateToChat = () => {
    router.push(`/dashboard/chat/${fullId}?vendorId=${vendorId}`);
  };

  return (
    <div 
      className={`w-full bg-white transition-colors duration-200 ${
        intent === 'chat' ? 'bg-zinc-50/60 px-4 rounded-xl' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
        
        {/* ─── LEFT: PRIMARY INDEX & DETAILS METADATA ─── */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-wider text-zinc-400">
            <span className="text-zinc-900 font-black">REF::{id}</span>
            <span className="text-zinc-300">•</span>
            <span>{date}</span>
            <span className="text-zinc-300">•</span>
            <span className={`tracking-widest ${statusStyles[status]}`}>{status}</span>
          </div>
          
          <h3 className="font-extrabold text-base text-zinc-950 uppercase tracking-tight truncate">
            Purchase Manifest Product
          </h3>

          {/* Inline Micro Tracking View */}
          {(trackingNumber || carrier) && (status === 'shipped' || status === 'delivered') && (
            <div className="inline-flex items-center gap-2 mt-1 text-[10px] bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md text-zinc-600 font-mono">
              <Truck size={12} className="text-zinc-400" />
              <span>{carrier}</span>
              <span className="text-zinc-300">|</span>
              <span className="font-bold tracking-tight text-zinc-900">{trackingNumber}</span>
              <ExternalLink size={10} className="text-zinc-400 ml-0.5" />
            </div>
          )}
        </div>

        {/* ─── RIGHT: PRICE INDEX & OPERATIONAL ACTION DOCK ─── */}
        <div className="flex flex-row items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0 shrink-0">
          
          {/* Flat Monetary Unit Layout */}
          <div className="text-left md:text-right">
            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest leading-none mb-0.5">Value</p>
            <p className="font-black text-lg text-zinc-950 tracking-tight">₦{amount.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Group 1: Comm Gateway */}
            <button 
              onClick={navigateToChat}
              className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-100 active:scale-95 transition-all"
              title="Open Vendor Workspace Communication"
            >
              <MessageCircle size={15} />
            </button>

            {/* Action Group 2: Escrow Dispatch Operations */}
            {(status === 'shipped' || status === 'delivered') && (
              <button 
                onClick={onConfirmReceipt}
                disabled={isSettling}
                className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-4 py-3 bg-[#A4143D] text-white rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isSettling ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                <span>Disburse</span>
              </button>
            )}

            {/* Action Group 3: Contextual Worksheets */}
            {status === 'completed' && (
              <button 
                onClick={onRateProduct}
                className="flex items-center justify-center gap-1 text-[10px] font-black uppercase px-4 py-3 border border-zinc-200 text-zinc-800 rounded-xl hover:bg-zinc-50 transition-all"
              >
                <Star size={12} /> <span>Rate</span>
              </button>
            )}
            
            {/* Master Details Trigger */}
            <button 
              onClick={() => onOpenDetails(fullId)}
              className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider px-4 py-3 bg-zinc-950 text-white rounded-xl hover:bg-zinc-900 transition-all active:scale-95"
            >
              <span>Review</span>
              <ChevronRight size={12} strokeWidth={2.5} />
            </button>

            {/* Documentation Export Link */}
            <button 
              className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-400 rounded-xl hover:text-zinc-900 transition-all hidden sm:inline-block"
              aria-label="Export invoice statement"
            >
              <FileText size={15} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}