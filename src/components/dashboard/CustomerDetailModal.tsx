'use client';
import { X, ShoppingBag, Calendar, Hash, Loader2, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';

export default function CustomerDetailModal({ isOpen, onClose, customer }: any) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && customer?.id) {
      fetchPurchaseHistory();
    }
  }, [isOpen, customer]);

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vendor/customers/${customer.id}`);
      setHistory(res.data);
    } catch (e) {
      console.error("Error loading history");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{customer?.name}</h2>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Customer Profile</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-900">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Marketplace Guard Notice */}
          <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-[2rem] flex items-start gap-4">
            <ShieldAlert className="text-orange-600 shrink-0" size={24} />
            <div>
              <p className="text-[11px] font-black uppercase text-orange-700 tracking-wider">Marketplace Policy</p>
              <p className="text-[12px] font-medium text-orange-900 leading-relaxed mt-1">
                Direct contact with customers outside the Aviore Support System is prohibited. If you need assistance regarding an order, please open a support ticket.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-orange-600" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Purchase Data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Vendor-Specific History</h3>
              
              {history.length === 0 ? (
                 <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
                 </div>
              ) : history.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 flex gap-6 items-center shadow-sm">
                  {/* Item Details (Same as before but strictly data-only) */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                    <img src={item.product.images[0]?.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{item.product.title}</p>
                      <p className="font-black text-slate-900 text-sm">₦{item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">QTY: {item.quantity}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">•</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-3 flex justify-between items-center">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                         {item.order.status}
                       </span>
                       <p className="text-[9px] font-bold text-slate-300 uppercase"># {item.order.orderNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}