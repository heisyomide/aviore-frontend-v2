'use client';

import React, { useState, useEffect } from 'react';

// Define the exact shape matching your NestJS backend payload
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

  // Fetch real-time progress data from your NestJS backend
  useEffect(() => {
    async function fetchReferralProgress() {
      try {
        // Adjust this URL path to match your API gateway configuration
        const response = await fetch('/storefront/referrals/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assumes standard JWT client storage
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to synchronize referral milestones telemetry.');
        }

        const result = await response.json();
        // If your backend wraps response data in a standard success object, extract it safely
        setData(result.success === false ? result : result);
      } catch (err: any) {
        setError(err.message || 'An unexpected communication error occurred.');
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
      setTimeout(() => setCopied(false), 2000); // Reset visual indicator state after 2 seconds
    } catch (err) {
      console.error('Failed to copy to clipboard context:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md rounded-xl bg-red-50 p-6 text-center border border-red-100 my-8">
        <p className="text-sm font-medium text-red-800">{error || 'Could not load data.'}</p>
      </div>
    );
  }

  // Calculate percentage dynamically for the progress bar bounds
  const progressPercentage = (data.currentProgress / data.targetThreshold) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Upper Layout Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Invite Friends & Unlock Rewards
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Grow the network loop, track verified signups, and earn premium checkout benefits.
        </p>
      </div>

      {/* Main Core Component Widget */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          
          {/* Top Banner Context Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Active Campaign
              </span>
              <h2 className="mt-2 text-lg font-bold text-neutral-800">
                Unlock your ₦2,500 Discount Voucher
              </h2>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <span className="text-xs text-neutral-400 block">Reward Value</span>
              <span className="text-xl font-black text-neutral-900">₦2,500</span>
            </div>
          </div>

          {/* Graphical Animated Progress Segment */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-neutral-700">
                Referral Milestone Progress
              </span>
              <span className="text-sm font-bold text-neutral-900 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                {data.currentProgress} / {data.targetThreshold} Verified
              </span>
            </div>
            
            {/* Structural Outer Track Bar */}
            <div className="h-3.5 w-full rounded-full bg-neutral-100 p-0.5 overflow-hidden">
              {/* Internal Filled Segment Grid mapping percentage weights */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_1s_linear_infinite]"></div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-400">
              <span>0 Invites</span>
              <span>Goal: 5 Friends</span>
            </div>
          </div>

          {/* Share System Vector Box Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-neutral-50 p-5 rounded-xl border border-neutral-100">
            
            {/* Left Box Pillar: Referral Token String */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">
                Your Unique Network Code
              </label>
              <div className="flex items-center rounded-lg border border-neutral-200 bg-white p-1 shadow-sm">
                <span className="flex-1 px-3 font-mono text-sm font-bold tracking-wider text-neutral-800">
                  {data.referralCode || 'AVR-XXXXX'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all ${
                    copied 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {copied ? 'Copied! ✓' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Right Box Pillar: Core Viral Driver Action Link Button */}
            <div>
              <a
                href={data.whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#20ba59] transition-all transform active:scale-[0.98]"
              >
                {/* Embedded Inline Micro-SVG WhatsApp Symbol Asset */}
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Invite Friends via WhatsApp
              </a>
            </div>

          </div>

          {/* Bottom Status Callout Messaging Engine Footer */}
          <div className="mt-8 border-t border-neutral-100 pt-6 flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${data.hasUnlockedVoucher ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
            <p className="text-xs font-semibold text-neutral-500">
              {data.hasUnlockedVoucher 
                ? "Congratulations! Your account has successfully issued your reward voucher asset. Look inside your Vouchers grid page to copy your promo key code. 🎉" 
                : "Keep driving invites! Once 5 of your shared contacts successfully complete registration and clear validation, your ₦2,500 promotional code unlocks instantly."
              }
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}