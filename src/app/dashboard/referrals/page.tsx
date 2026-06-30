'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Copy, Check, Gift, ArrowUpRight, Share2 } from 'lucide-react';
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
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function fetchReferralProgress() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token missing.');
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/referrals/dashboard`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to synchronize referral progress details.');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setLoading(false);
      }
    }
    fetchReferralProgress();
  }, []);

  const handleCopyCode = async () => {
    if (!data?.referralCode) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      toast.success("Code Copied", { description: "Your referral code is ready to share." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500">{error || 'Could not load data.'}</p>
        <p className="text-[10px] text-zinc-400 mt-1 italic">Please refresh or try again later.</p>
      </div>
    );
  }

  const progressPercentage = Math.min((data.currentProgress / data.targetThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Gift size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Referral Program</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Invite Friends & <span className="text-zinc-300 font-medium">Earn Rewards</span>
        </h1>
      </header>

      {/* 2. MAIN CORE WIDGET CARD */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden p-6 sm:p-8 space-y-8">
        
        {/* Top Banner Content Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase px-2.5 py-1 bg-zinc-900 text-white rounded-md tracking-wider inline-block">
              Active Campaign
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 pt-1">
              Unlock Your ₦2,500 Discount Voucher
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Invite your friends to shop and unlock premium order discounts upon their verification.
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Reward Value</span>
            <span className="text-2xl font-black text-zinc-900">₦2,500</span>
          </div>
        </div>

        {/* Dynamic Progress Bar Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-900">
              Milestone Progress
            </span>
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
              {data.currentProgress} / {data.targetThreshold} Verified Signups
            </span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div 
              className="h-full bg-[#A4143D] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>0 Invites</span>
            <span>Goal: 5 Friends</span>
          </div>
        </div>

        {/* Share Action Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50/50 p-5 rounded-xl border border-zinc-100 items-end">
          
          {/* Left Column: Copy Referral Code */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Your Unique Referral Code
            </label>
            <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm">
              <span className="flex-1 px-3 font-mono text-sm font-bold tracking-widest text-zinc-900 uppercase">
                {data.referralCode || 'AVR-XXXXX'}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-900 text-white hover:bg-black'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Right Column: Invite Button Driver */}
          <div className="space-y-2">
            <a
              href={data.whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-black text-white px-5 py-[13px] text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
            >
              <Share2 size={12} />
              Invite Friends via WhatsApp
              <ArrowUpRight size={12} className="text-zinc-400" />
            </a>
          </div>
        </div>

        {/* Bottom Status Callout Text */}
        <div className="border-t border-zinc-100 pt-6 flex items-start gap-3">
          <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${data.hasUnlockedVoucher ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            {data.hasUnlockedVoucher 
              ? "Your reward voucher is now unlocked. Visit your Voucher Wallet page to claim your active promo code details." 
              : "Once 5 of your referred friends successfully complete account verification, your ₦2,500 promotional discount code will automatically unlock instantly."
            }
          </p>
        </div>

      </div>
    </div>
  );
}