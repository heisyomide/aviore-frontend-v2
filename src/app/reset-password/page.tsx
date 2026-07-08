'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Eye, EyeOff, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ResetInput {
  password:  string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">
      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <ShieldCheck size={28} className="text-slate-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-700 tracking-tight uppercase italic font-serif">Override Secrets</h1>
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1 font-mono">Authorization Pool Override</p>
        </div>

        {/* Next.js Query params require standard Suspense wrapping containment context */}
        <Suspense fallback={<div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" /></div>}>
          <ResetFormFields />
        </Suspense>
      </div>
    </div>
  );
}

function ResetFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetInput>();

  const [token, setToken] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Missing cryptographic secure parameter context token.');
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetInput) => {
    if (!token) {
      setError('Transaction execution canceled due to invalid key attributes.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/reset-password`, {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      setSuccess(response.data.message);
      
      // Auto-re-route inside login pool following success
      setTimeout(() => {
        router.push('/login');
      }, 3500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync authorization updates.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 animate-fadeIn">
        <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
          {success}
        </div>
        <p className="text-[10px] text-slate-400 animate-pulse font-mono tracking-wide">
          Syncing records... Redirecting to entry layout.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* NEW PASSWORD INPUT */}
      <div>
        <div className="relative">
          <input
            {...register('password', { 
              required: 'New authorization secret is required',
              minLength: { value: 8, message: 'Must be minimum 8 characters long' }
            })}
            type={showPass ? 'text' : 'password'}
            placeholder="New Master Password"
            disabled={!token}
            className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12 text-slate-700 transition-all focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mt-1.5 pl-1">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* CONFIRM PASSWORD INPUT */}
      <div>
        <div className="relative">
          <input
            {...register('confirmPassword', { 
              required: 'Verification secret re-entry required',
              validate: (val) => val === watch('password') || 'Secret mismatch anomaly detected'
            })}
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Master Password"
            disabled={!token}
            className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12 text-slate-700 transition-all focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mt-1.5 pl-1">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-500 text-center font-bold uppercase tracking-wider bg-red-500/5 p-3 rounded-xl border border-red-500/10 flex items-center justify-center gap-2">
          <ShieldAlert size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full text-white p-4 rounded-xl bg-[#092c5c] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#04152d] font-bold transition-all duration-300 flex items-center justify-center cursor-pointer uppercase tracking-widest text-xs disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Commit Update'}
      </button>
    </form>
  );
}