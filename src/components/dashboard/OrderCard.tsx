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

  const statusStyles: Record<OrderStatus, string> = {
    paid: 'bg-amber-950/20 text-amber-500 border-amber-900/40',
    processing: 'bg-zinc-900/40 text-zinc-400 border-zinc-800/60',
    shipped: 'bg-blue-950/20 text-blue-400 border-blue-900/40',
    delivered: 'bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/20',
    completed: 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50',
    returned: 'bg-red-950/20 text-red-400 border-red-900/40',
    cancelled: 'bg-zinc-950 text-zinc-600 border-zinc-900',
  };

  const navigateToChat = () => {
    router.push(`/dashboard/chat/${fullId}?vendorId=${vendorId}`);
  };

  return (
    <div 
      className={`bg-[#111113] p-5 md:p-7 rounded-xl border transition-all duration-300 group hover:border-zinc-700 select-none ${
        intent === 'chat' 
          ? 'border-[#C5A880] shadow-[0_0_20px_rgba(197,168,128,0.05)]' 
          : 'border-zinc-900 shadow-xl'
      }`}
    >
      
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-[8px] font-mono font-bold uppercase text-zinc-500 tracking-widest">#{id}</p>
            <span className="text-[8px] text-zinc-700">•</span>
            <p className="text-[8px] font-mono font-bold uppercase text-zinc-500 tracking-widest">{date}</p>
          </div>
          <h3 className="font-mono font-bold text-white text-base uppercase tracking-wider">
            Acquisition Manifest
          </h3>
        </div>
        <span className={`text-[8px] px-3 py-1.5 rounded-lg font-mono font-bold border uppercase tracking-widest ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      {/* TRACKING (IF SHIPPED/DELIVERED) */}
      {(trackingNumber || carrier) && (status === 'shipped' || status === 'delivered') && (
        <div className="mt-5 p-4 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#111113] p-2.5 rounded border border-zinc-900 text-zinc-500">
              <Truck size={14} />
            </div>
            <div>
              <p className="text-[8px] font-mono font-bold uppercase text-zinc-500 leading-none mb-1">Carrier // {carrier}</p>
              <p className="text-[10px] font-mono font-bold text-zinc-300 tracking-tight">{trackingNumber}</p>
            </div>
          </div>
          <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      )}

      {/* FOOTER: PRICE & ACTIONS */}
      <div className="mt-6 pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="w-full sm:w-auto text-center sm:text-left">
          <p className="text-[8px] font-mono font-bold uppercase text-zinc-600 tracking-[0.2em] mb-0.5">Settlement_Total</p>
          <p className="font-mono font-bold text-2xl text-white tracking-wide">₦{amount.toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 w-full sm:w-auto">
          
          {/* Vendor Chat Trigger */}
          <button 
            onClick={navigateToChat}
            className="p-3.5 bg-zinc-950 text-zinc-400 rounded-lg border border-zinc-900 hover:bg-[#C5A880]/10 hover:text-[#C5A880] hover:border-[#C5A880]/20 transition-all flex items-center justify-center"
            title="Open Vendor Communication Portal"
          >
            <MessageCircle size={15} />
          </button>

          {/* Action: Release Escrow Funds */}
          {(status === 'shipped' || status === 'delivered') && (
            <button 
              onClick={onConfirmReceipt}
              disabled={isSettling}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest px-6 py-3.5 bg-[#C5A880] text-zinc-950 rounded-lg shadow-md hover:bg-white transition-all disabled:opacity-50"
            >
              {isSettling ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
              Confirm_Receipt
            </button>
          )}

          {/* Contextual Options */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none w-full sm:w-auto">
            {status === 'completed' && (
              <button 
                onClick={onRateProduct}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[9px] font-mono font-bold uppercase px-6 py-3.5 border border-[#C5A880]/30 text-[#C5A880] rounded-lg hover:bg-[#C5A880]/10 transition-all"
              >
                <Star size={13} /> Rate
              </button>
            )}
            
            <button 
               onClick={() => onOpenDetails(fullId)}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest px-6 py-3.5 bg-zinc-950 border border-zinc-900 text-zinc-300 rounded-lg hover:border-zinc-700 transition-all"
            >
              Details <ChevronRight size={13} />
            </button>
          </div>

          {/* Invoice Document Handler */}
          <button 
            className="p-3.5 bg-zinc-950 text-zinc-500 border border-zinc-900 rounded-lg hover:text-zinc-300 transition-all"
          >
            <FileText size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}