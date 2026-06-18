'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Ticket, Copy, Check, ShieldAlert, History } from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  discountAmount: number;
  minimumOrder: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  daysRemaining: number;
}

export default function VoucherWalletPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('AUTHENTICATION_TOKEN_MISSING');
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/storefront/vouchers/my-vouchers`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('FAILED_TO_SYNC_VOUCHER_LEDGER');
        }
        const result = await response.json();
        setVouchers(Array.isArray(result) ? result : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'COMMUNICATION_LAYER_FAILURE');
      } finally {
        setLoading(false);
      }
    }
    fetchVouchers();
  }, []);

  const handleCopyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code segment:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Loader2 className="animate-spin text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Indexing_Voucher_Nodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md border border-[#991B1B]/40 bg-[#111113] p-6 rounded-lg my-8 flex items-start gap-3">
        <ShieldAlert size={16} className="text-[#991B1B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">System Fault Encountered</p>
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">{error}</p>
        </div>
      </div>
    );
  }

  const activeVouchers = vouchers.filter(v => v.status === 'ACTIVE');
  const pastVouchers = vouchers.filter(v => v.status !== 'ACTIVE');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. ARCHITECTURAL LAYER HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <Ticket size={13} />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Reward_Allocation_Registry</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          My Reward <span className="text-zinc-600 font-normal font-sans tracking-normal">Wallet</span>
        </h1>
      </header>

      {/* =====================================================
          SECTION 1: ACTIVE PIPELINE RECORDS
         ===================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <h2 className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
            Active Allocations ({activeVouchers.length.toString().padStart(2, '0')})
          </h2>
        </div>

        {activeVouchers.length === 0 ? (
          <div className="rounded-lg border border-zinc-900 bg-[#111113]/40 p-10 text-center flex flex-col items-center justify-center">
            <Ticket size={24} className="text-zinc-800 mb-3" />
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600">No active codes mapped to profile</p>
            <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-tight mt-1">Complete referral progression matrices to release assets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVouchers.map((voucher) => (
              <div 
                key={voucher.id} 
                className="relative overflow-hidden rounded-lg border border-zinc-900 bg-[#111113] p-5 flex flex-col justify-between gap-5 group transition-colors duration-300 hover:border-zinc-800"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xl font-mono font-bold tracking-tight text-white">
                        ₦{voucher.discountAmount.toLocaleString()} OFF
                      </span>
                      <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wide">
                        Min. Spending: ₦{voucher.minimumOrder.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-emerald-500 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded uppercase tracking-widest">
                      Usable
                    </span>
                  </div>

                  {/* Operational Code Interactive Area */}
                  <div className="flex items-center gap-2 rounded bg-zinc-950 border border-zinc-900 p-1">
                    <span className="flex-1 font-mono text-[11px] font-bold tracking-[0.15em] text-zinc-300 px-2 uppercase truncate">
                      {voucher.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(voucher.id, voucher.code)}
                      className={`h-7 px-3 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        copiedId === voucher.id
                          ? 'bg-zinc-900 border border-zinc-800 text-white'
                          : 'bg-[#111113] text-zinc-400 border border-zinc-900 hover:text-white hover:border-zinc-800'
                      }`}
                    >
                      {copiedId === voucher.id ? (
                        <>
                          <Check size={10} className="text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={10} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-wide text-zinc-600">
                  <span className="text-[#991B1B] flex items-center gap-1">
                    ⏱ TTL: {voucher.daysRemaining} Cycles Remaining
                  </span>
                  <span>Closing: {new Date(voucher.expiresAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          SECTION 2: TRANSACTION HISTORICAL HISTORY
         ===================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
          <History size={11} className="text-zinc-600" />
          <h2 className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
            Historical Archive Ledger
          </h2>
        </div>

        {pastVouchers.length === 0 ? (
          <p className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-wider pl-1">No structural historic mutations logged.</p>
        ) : (
          <div className="rounded-lg border border-zinc-900 bg-[#111113] overflow-hidden">
            <div className="divide-y divide-zinc-900/40">
              {pastVouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950/20 hover:bg-zinc-950/40 transition-colors opacity-60">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs tracking-wider text-zinc-500 line-through uppercase">
                        {voucher.code}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                        (₦{voucher.discountAmount.toLocaleString()} Reduction)
                      </span>
                    </div>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tight">
                      Checkout Threshold Constraint: ₦{voucher.minimumOrder.toLocaleString()}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {voucher.status === 'USED' ? (
                      <span className="px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-widest border border-zinc-800 bg-zinc-900 text-zinc-400">
                        Redeemed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-widest border border-[#991B1B]/40 bg-zinc-950 text-[#991B1B]">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
        AVIORÈ_PIPELINE_VUCH_v1.12
      </p>
    </div>
  );
}