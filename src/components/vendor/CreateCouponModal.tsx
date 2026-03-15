'use client';

import { useState } from 'react';
import { X, Ticket, Percent, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
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
      // Logic: Maps to the new vendor/create protocol
      await api.post('/coupons/vendor/create', {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null
      });
      
      toast.success("PROTOCOL_INITIALIZED", { 
        description: "Your exclusive coupon is now registered in the registry." 
      });
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error("VALIDATION_ERROR", { 
        description: err.response?.data?.message || "Ensure all parameters meet standards." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
      <div className="bg-[#FDFCFB] w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="p-10 pb-6 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Exclusive_Reward</span>
            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Create Coupon</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Coupon Code</label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                placeholder="E.G. SUMMER25"
                className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-[#A4143D] outline-none transition-all"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Discount Value (%)</label>
              <div className="relative">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="number"
                  required
                  placeholder="20"
                  className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl text-xs font-bold focus:border-[#A4143D] outline-none"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expiration Node</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="date"
                  required
                  className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl text-xs font-bold focus:border-[#A4143D] outline-none"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Threshold (Min Order ₦)</label>
            <input 
              type="number"
              placeholder="5000"
              className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-xs font-bold focus:border-[#A4143D] outline-none"
              value={formData.minOrderValue}
              onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[#A4143D]/20 transition-all active:scale-95"
          >
            {loading ? "INITIALIZING..." : "Activate Registry Coupon"}
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-300 uppercase italic tracking-widest">
            <ShieldCheck size={12} /> Encrypted Marketing Protocol
          </div>
        </form>
      </div>
    </div>
  );
}