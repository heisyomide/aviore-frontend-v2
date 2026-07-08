'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/axios'; // 🟢 FIXED: Using your integrated API instance helper
import { Loader2, KeyRound, ArrowLeft } from 'lucide-react';

interface ForgotInput {
  email: string;
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotInput>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: ForgotInput) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      // 🟢 FIXED: Routed directly through your custom api instance to map the backend prefix properly
      const response = await api.post('/auth/forgot-password', {
        email: data.email.toLowerCase().trim(),
      });

      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'A network communication anomaly was detected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">
      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        {/* TOP STATUS NAVIGATION BAR */}
        <div className="flex items-center justify-between mb-8">
          <button 
            type="button"
            onClick={() => router.push('/login')}
            className="w-10 h-10 rounded-full bg-[#e0e5ec] flex items-center justify-center text-slate-500 shadow-[4px_4px_10px_#bebebe,-4px_-4px_10px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A4143D]">
            Auth_Node
          </span>
        </div>

        {/* HERO ICON EMBLEM */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <KeyRound size={28} className="text-slate-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-700 tracking-tight uppercase italic font-serif">Recover Account</h1>
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1 font-mono">Secret Parameter Reset</p>
        </div>

        {message ? (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="text-xs text-emerald-700 font-medium leading-relaxed bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)]">
              {message}
            </div>
            <p className="text-[11px] text-slate-400">
              Please monitor your email dashboard inbox. If the link does not appear in 3 minutes, examine your secondary spam parameters.
            </p>
            <button 
              type="button"
              onClick={() => router.push('/login')}
              className="w-full text-xs font-bold text-slate-600 uppercase tracking-widest hover:underline pt-2 cursor-pointer"
            >
              Back to Authorization Gate
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register('email', { 
                  required: 'Email coordinates are missing',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email specification' }
                })}
                type="email"
                placeholder="Secure Account Email"
                className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 text-slate-700 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]"
              />
              {errors.email && (
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mt-1.5 pl-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-500 text-center font-bold uppercase tracking-wider bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white p-4 rounded-xl bg-[#092c5c] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#04152d] font-bold transition-all duration-300 flex items-center justify-center cursor-pointer uppercase tracking-widest text-xs border border-white/5 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Dispatch Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}