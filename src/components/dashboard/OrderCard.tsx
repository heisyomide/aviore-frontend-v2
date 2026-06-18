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
    paid: 'bg-orange-50 text-orange-600 border-orange-100',
    processing: 'bg-orange-50 text-orange-600 border-orange-100',
    shipped: 'bg-blue-50 text-blue-600 border-blue-100',
    delivered: 'bg-[#A4143D]/5 text-[#A4143D] border-[#A4143D]/10',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    returned: 'bg-red-50 text-red-600 border-red-100',
    cancelled: 'bg-slate-50 text-slate-400 border-slate-100',
  };

  const navigateToChat = () => {
    router.push(`/dashboard/chat/${fullId}?vendorId=${vendorId}`);
  };

  return (
    <div 
      className={`bg-white p-5 md:p-7 rounded-3xl border transition-all duration-300 group hover:shadow-xl hover:border-[#A4143D]/20 ${
        intent === 'chat' 
          ? 'border-[#A4143D] shadow-lg shadow-[#A4143D]/5 ring-1 ring-[#A4143D]/20' 
          : 'border-gray-100 shadow-sm'
      }`}
    >
      
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">#{id}</p>
            <span className="text-[8px] text-slate-300">•</span>
            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">{date}</p>
          </div>
          <div className="flex items-center gap-2">
             <h3 className="font-black italic text-slate-900 text-lg md:text-xl uppercase tracking-tight">
               Purchase Product
             </h3>
          </div>
        </div>
        <span className={`text-[8px] px-3 py-1.5 rounded-lg font-black border uppercase tracking-widest ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      {/* TRACKING (IF SHIPPED) */}
      {(trackingNumber || carrier) && (status === 'shipped' || status === 'delivered') && (
        <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-400">
              <Truck size={16} />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase text-slate-400 leading-none mb-1">Via {carrier}</p>
              <p className="text-[10px] font-bold text-slate-700 font-mono tracking-tight">{trackingNumber}</p>
            </div>
          </div>
          <ExternalLink size={14} className="text-slate-300" />
        </div>
      )}

      {/* FOOTER: PRICE & ACTIONS */}
      <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="w-full sm:w-auto text-center sm:text-left">
          <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] mb-0.5">Settlement_Total</p>
          <p className="font-black italic text-2xl text-slate-900 tracking-tighter">₦{amount.toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 w-full sm:w-auto">
          
          {/* Direct Vendor Communication Gateway */}
          <button 
            onClick={navigateToChat}
            className="p-3.5 bg-zinc-50 text-zinc-900 rounded-xl hover:bg-[#A4143D]/10 hover:text-[#A4143D] transition-all flex items-center justify-center"
            title="Open Vendor Chat"
          >
            <MessageCircle size={16} />
          </button>

          {/* Action: Release Escrow Funds */}
          {(status === 'shipped' || status === 'delivered') && (
            <button 
              onClick={onConfirmReceipt}
              disabled={isSettling}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3.5 bg-[#A4143D] text-white rounded-xl shadow-md hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isSettling ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              Confirm_Receipt
            </button>
          )}

          {/* Contextual Options */}
          <div className="flex items-center gap-2">
            {status === 'completed' && (
              <button 
                onClick={onRateProduct}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[9px] font-black uppercase px-6 py-3.5 border border-[#A4143D] text-[#A4143D] rounded-xl hover:bg-[#A4143D] hover:text-white transition-all"
              >
                <Star size={14} /> Rate
              </button>
            )}
            
            <button 
               onClick={() => onOpenDetails(fullId)}
               className="flex-1 sm:flex-nowrap flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all"
            >
              Details <ChevronRight size={14} />
            </button>
          </div>

          {/* Invoice Clipboard Anchor */}
          <button 
            className="p-3.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#A4143D]/10 hover:text-[#A4143D] transition-all"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}