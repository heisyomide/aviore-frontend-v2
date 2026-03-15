'use client';

import { X, Banknote, ArrowRight, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onRefresh: () => void;
}

export default function WithdrawalRequestModal({ isOpen, onClose, availableBalance, onRefresh }: ModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const remainingBalance = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    return availableBalance - numAmount;
  }, [amount, availableBalance]);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 1000) {
      toast.error("Minimum withdrawal is ₦1,000");
      return;
    }

    setLoading(true);
    try {
      await api.post('/vendor/payouts/request', { amount: numAmount });
      setSuccess(true);
      setTimeout(() => {
        onRefresh();
        handleClose();
      }, 2500);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        
        {/* SUCCESS STATE */}
        {success ? (
          <div className="p-10 text-center space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={32} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Request Logged</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
              Funds are migrating. Payout reflects post-authorization.
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] mb-0.5">Treasury_Protocol</p>
                <h3 className="text-lg font-black text-slate-900 uppercase italic">Initiate_Payout</h3>
              </div>
              <button onClick={handleClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors">
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* BALANCE SUMMARY */}
              <div className="bg-slate-900 p-5 rounded-2xl text-white flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Liquid_Capital</p>
                  <p className="text-xl font-black italic">₦{availableBalance.toLocaleString()}</p>
                </div>
                <Banknote size={20} className="text-orange-500 opacity-80" />
              </div>

              {/* INPUT Area */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Withdrawal_Value (₦)</label>
                <div className="relative">
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-5 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl text-2xl font-black text-slate-900 outline-none transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              {/* STATS BAR */}
              <div className="grid grid-cols-2 gap-4 px-1">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Residual_Balance</p>
                  <p className={`text-xs font-black italic ${remainingBalance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                    ₦{remainingBalance.toLocaleString()}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Min_Threshold</p>
                  <p className="text-xs font-black text-slate-900 italic">₦1,000</p>
                </div>
              </div>

              {/* INFO BOX */}
              <div className="flex gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-blue-800 leading-snug uppercase italic">
                  Settlements are processed within 24 registry hours to your linked business account.
                </p>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 pt-0">
              <button 
                onClick={handleSubmit}
                disabled={loading || !amount || remainingBalance < 0 || parseFloat(amount) < 1000}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none group"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (
                  <span className="flex items-center justify-center gap-2">
                    Authorize_Transfer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}