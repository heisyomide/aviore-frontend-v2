'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, QrCode, ShieldAlert, Award, Radio } from 'lucide-react';

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
          const errorText = await response.text();
          console.error(errorText);
          throw new Error(
            'Failed to synchronize referral milestones telemetry.'
          );
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unexpected communication failure.');
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard context:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[60vh]">
        <Radio className="animate-pulse text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Polling_Network_Telemetry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md rounded border border-zinc-900 bg-[#111113] p-6 text-center my-12">
        <div className="flex justify-center mb-3 text-[#991B1B]">
          <ShieldAlert size={24} />
        </div>
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">System Sync Failure</p>
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-normal mt-1">{error || 'Could not map telemetry data.'}</p>
      </div>
    );
  }

  const progressPercentage = Math.min((data.currentProgress / data.targetThreshold) * 100, 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 text-zinc-100">
      
      {/* 1. LAYOUT CONTROL HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <QrCode size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Network_Affiliation_Loop</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          Invite <span className="text-zinc-600 font-normal font-sans tracking-normal">Nodes</span>
        </h1>
        <p className="text-[10px] font-sans text-zinc-500 max-w-md leading-relaxed mt-1">
          Expand the exclusive ecosystem footprint, monitor validated registration nodes, and release premium checkout benefits into your account ledger.
        </p>
      </header>

      {/* 2. CORE PERFORMANCE METRICS PANEL */}
      <div className="bg-[#111113] rounded-lg border border-zinc-900 overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <div className="p-5 md:p-7 space-y-6">
          
          {/* Active Campaign Header Band */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/40 pb-5 gap-4">
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#991B1B] bg-[#991B1B]/10 px-2.5 py-1 rounded border border-[#991B1B]/20">
                Active_Campaign_v2
              </span>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wide pt-1.5">
                Targeted Settlement Reward
              </h2>
            </div>
            <div className="text-left sm:text-right bg-zinc-950 p-3 rounded border border-zinc-900 min-w-[120px]">
              <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block tracking-wider">Asset Value</span>
              <span className="text-lg font-mono font-bold text-white tracking-wide">₦2,500</span>
            </div>
          </div>

          {/* 3. GRAPHICAL HUD PROGRESS PIPELINE */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={12} className="text-zinc-500" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Milestone Matrix
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900">
                {data.currentProgress} / {data.targetThreshold} Nodes Verified
              </span>
            </div>
            
            {/* Structural Custom Track Outer Boundary */}
            <div className="h-2 w-full rounded bg-zinc-950 p-[1px] border border-zinc-900 overflow-hidden">
              {/* Internal Hard Filled Matrix Line */}
              <div 
                className="h-full rounded bg-[#991B1B] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
              <span>Origin_0</span>
              <span>Threshold: {data.targetThreshold} Nodes</span>
            </div>
          </section>

          {/* 4. DRIVER SHARING HUB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-zinc-950 p-4 rounded border border-zinc-900">
            
            {/* Left Wing: Token Extraction Interface */}
            <div className="space-y-2">
              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                Unique Access Code
              </label>
              <div className="flex items-center rounded bg-[#111113] border border-zinc-900 p-1">
                <span className="flex-1 px-2.5 font-mono text-xs font-bold tracking-widest text-white uppercase truncate">
                  {data.referralCode || 'AVR-XXXXX'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`rounded px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ${
                    copied 
                      ? 'bg-[#991B1B] text-white' 
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-900 hover:text-white hover:border-zinc-800'
                  }`}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Right Wing: Dynamic Dispatch Button */}
            <div>
              <a
                href={data.whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-4 py-2 text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest transition-all active:scale-[0.98] group"
              >
                <Share2 size={11} className="text-[#991B1B] group-hover:scale-110 transition-transform" />
                Dispatch via WhatsApp
              </a>
            </div>

          </div>

          {/* 5. METRIC BOUNDARY NOTIFICATION FOOTER */}
          <footer className="border-t border-zinc-900/60 pt-5 flex items-start gap-3.5">
            <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${data.hasUnlockedVoucher ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></div>
            <p className="text-[10px] font-sans text-zinc-500 leading-relaxed">
              {data.hasUnlockedVoucher 
                ? "Authorization successful. Your cryptographic account profile has unlocked the designated promotional asset. Access your digital voucher grid panel to extract the checkout promo token key." 
                : `Pipeline holding. Once ${data.targetThreshold} system links successfully clear active validation parameters and complete client setup, your promotional credit layer updates automatically.`
              }
            </p>
          </footer>

        </div>
      </div>

      <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
        AVIORÈ_AFFILIATE_SYS_v3.01
      </p>
    </div>
  );
}