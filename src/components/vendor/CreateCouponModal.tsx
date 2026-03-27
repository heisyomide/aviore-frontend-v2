'use client';

import { useState } from 'react';
import { X, Ticket, Percent, Calendar, ShieldCheck, ArrowRight, Loader2, Zap, Target, AlignLeft, Info } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export default function CreateCouponModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '',
    endDate: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/coupons/vendor/create', {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null
      });
      
      toast.success("PROTOCOL_INITIALIZED", { 
        description: "Your growth node is now live in the global registry." 
      });
      onRefresh();
      onClose();
      setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '', endDate: '', description: '' });
    } catch (err: any) {
      toast.error("SYNCHRONIZATION_ERROR", { 
        description: err.response?.data?.message || "Verify all registry parameters." 
      });
    } finally {
      setLoading(false);
    }
  };

  // 🎨 High-Visibility Input Styling
  const inputClasses = "w-full bg-slate-50 border-2 border-slate-100 p-4 lg:p-5 pl-12 rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 shadow-sm";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2 flex items-center gap-2 ml-1";

  return (
    <div className="fixed inset-0 z-[400] flex items-end lg:items-center justify-center bg-[#0F172A]/90 backdrop-blur-sm animate-in fade-in duration-300 p-0 lg:p-6">
      
      {/* Container - Bottom Sheet on Mobile / Centered Modal on Desktop */}
      <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] lg:rounded-[3rem] shadow-2xl overflow-hidden border-t border-white/20 lg:border animate-in slide-in-from-bottom-10 lg:zoom-in-95 duration-500 max-h-[92vh] flex flex-col">
        
        {/* 🚀 HUB HEADER */}
        <div className="p-8 lg:p-10 pb-8 flex justify-between items-start bg-white border-b border-slate-50 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
               <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Growth_Registry_v4</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">CREATE COUPON</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Marketing Deployment Console</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-slate-100"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* 📦 DATA ENTRY STAGE */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 pt-8 space-y-8 overflow-y-auto no-scrollbar pb-12">
          
          {/* Section 1: Identifier */}
          <div className="space-y-3">
            <label className={labelClasses}><Ticket size={14}/> Coupon Code</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                <Zap size={18} fill="currentColor" className="opacity-20 group-focus-within:opacity-100" />
              </div>
              <input 
                required
                placeholder="E.G. AVIORE_VIP_20"
                className={inputClasses}
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          {/* Section 2: Values */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3">
              <label className={labelClasses}><Percent size={14}/> Yield Value</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm group-focus-within:text-blue-600">%</span>
                <input 
                  type="number"
                  required
                  placeholder="20"
                  className={inputClasses}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className={labelClasses}><Calendar size={14}/> Expiry Node</label>
              <div className="relative group">
                <input 
                  type="date"
                  required
                  className={inputClasses + " pl-6"} // Date inputs have native icons on some browsers
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Parameters */}
          <div className="space-y-3">
            <label className={labelClasses}><Target size={14}/> Liquidity Threshold (Min Order ₦)</label>
            <div className="relative group">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm group-focus-within:text-blue-600">₦</span>
               <input 
                type="number"
                placeholder="5000"
                className={inputClasses}
                value={formData.minOrderValue}
                onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
              />
            </div>
          </div>

          {/* Section 4: Manifest */}
          <div className="space-y-3">
             <label className={labelClasses}><AlignLeft size={14}/> Coupon Description</label>
             <textarea 
               placeholder="Enter public promotion details..."
               className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-[2rem] text-[13px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none h-28 resize-none transition-all shadow-sm"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
             />
          </div>

          {/* Finalize Action */}
          <div className="pt-6">
            <button 
              disabled={loading}
              className="w-full h-16 lg:h-20 bg-slate-900 text-white rounded-2xl lg:rounded-3xl font-black uppercase tracking-[0.25em] text-[11px] lg:text-xs flex items-center justify-center gap-4 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-600/30 transition-all active:scale-95 disabled:bg-slate-300 shadow-xl"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} strokeWidth={3} />
              ) : (
                <>Publish Coupon Code <ArrowRight size={20} strokeWidth={3} /></>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-300 uppercase italic tracking-[0.3em] pb-4">
            <ShieldCheck size={12} className="text-blue-500" /> Authorized Marketing Protocol
          </div>
        </form>
      </div>
    </div>
  );
}