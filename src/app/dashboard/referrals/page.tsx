'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, Gift, Copy, Check, Share2, ArrowUpRight, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralData {
  referralCode: string | null;
  currentProgress: number;
  targetThreshold: number;
  hasUnlockedVoucher: boolean;
  hasUsedReferralVoucher: boolean;
  whatsappShareUrl: string;
}

export default function ReferralDashboardPage() {
  const [data,    setData]    = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/storefront/referrals/dashboard');
        setData(res.data);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Could not load referral data.';
        setError(msg);
        console.error('Referral_Fetch_Error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const copyCode = async () => {
    if (!data?.referralCode) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      toast.success('Code copied', { description: 'Paste it anywhere to invite friends.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed', { description: 'Long-press the code to copy manually.' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Loading</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30 mt-8">
        <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center">
          <Gift size={22} className="text-zinc-300" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight text-red-500">Something went wrong</p>
          <p className="text-xs text-zinc-400 mt-1">{error || 'Refresh the page to try again.'}</p>
        </div>
      </div>
    );
  }

  const pct   = Math.min((data.currentProgress / data.targetThreshold) * 100, 100);
  const done  = data.hasUnlockedVoucher;
  const remaining = Math.max(data.targetThreshold - data.currentProgress, 0);

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Gift size={11} className="text-[#A4143D]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
            Referral Programme
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
          Invite &amp; Earn
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xs">
          Invite friends to Aviorè. Earn a ₦2,500 voucher once 5 of them sign up.
        </p>
      </div>

      {/* ── Reward card ── */}
      <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
        done
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-zinc-100 bg-zinc-50/40'
      }`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
          done ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white border-zinc-200 text-zinc-400'
        }`}>
          <Gift size={20} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">₦2,500 Voucher</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {done
              ? 'Unlocked — visit your Voucher Ledger to claim.'
              : `Invite ${remaining} more friend${remaining === 1 ? '' : 's'} to unlock.`}
          </p>
        </div>
        <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
          done ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'
        }`}>
          {done ? 'Unlocked' : 'Locked'}
        </span>
      </div>

      {/* ── Progress ── */}
      <div className="rounded-2xl border border-zinc-100 p-5 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-zinc-400" strokeWidth={1.5} />
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-tight">Progress</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-lg">
            {data.currentProgress} / {data.targetThreshold}
          </span>
        </div>

        {/* Track */}
        <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              done ? 'bg-emerald-500' : 'bg-[#A4143D]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between">
          {Array.from({ length: data.targetThreshold }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${
                i < data.currentProgress
                  ? done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-[#A4143D] bg-[#A4143D] text-white'
                  : 'border-zinc-200 bg-white text-zinc-400'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* ── Your code ── */}
      <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
        <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Your referral code</p>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
            <p className="font-mono text-base font-black tracking-widest text-zinc-900 select-all uppercase">
              {data.referralCode || 'AVR-XXXXX'}
            </p>
          </div>
          <button
            onClick={copyCode}
            className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* ── Share ── */}
      <a
        href={data.whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
      >
        <Share2 size={14} />
        Invite via WhatsApp
        <ArrowUpRight size={13} className="text-zinc-500" />
      </a>

    </div>
  );
}