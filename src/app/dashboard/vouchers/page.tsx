'use client';

import React, { useState, useEffect } from 'react';

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
        throw new Error('Authentication token missing.');
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
        const errorText = await response.text();
        console.error(errorText);
        throw new Error(
          'Failed to retrieve your wallet vouchers.'
        );
      }
      const result = await response.json();
      setVouchers(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Communication layer failure.');
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
      console.error('Failed to copy reward code context:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-xl bg-red-50 p-6 text-center border border-red-100 my-8">
        <p className="text-sm font-medium text-red-800">{error}</p>
      </div>
    );
  }

  // Separate active/usable vouchers from used/expired history rows
  const activeVouchers = vouchers.filter(v => v.status === 'ACTIVE');
  const pastVouchers = vouchers.filter(v => v.status !== 'ACTIVE');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header Context */}
      <div className="mb-8 border-b border-neutral-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          My Reward Wallet
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Claim, verify, and track your discount voucher codes earned across the Aviore network.
        </p>
      </div>

      {/* =====================================================
          SECTION 1: ACTIVE / UNLOCKED REWARDS
         ===================================================== */}
      <div className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
          Active Vouchers ({activeVouchers.length})
        </h2>

        {activeVouchers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
            <p className="text-sm text-neutral-500">You don't have any active discount codes yet.</p>
            <p className="text-xs text-neutral-400 mt-1">Complete your referral milestone progress bar to unlock a voucher!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeVouchers.map((voucher) => (
              <div 
                key={voucher.id} 
                className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Left Side Ticket Cutout Accent Pattern via CSS */}
                <div className="absolute top-1/2 -left-2 h-4 w-4 -translate-y-1/2 rounded-full bg-neutral-50 border border-neutral-200"></div>
                <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full bg-neutral-50 border border-neutral-200"></div>

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl font-black text-neutral-900">
                        ₦{voucher.discountAmount.toLocaleString()} OFF
                      </span>
                      <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                        Minimum Spend: ₦{voucher.minimumOrder.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Usable
                    </span>
                  </div>

                  {/* Field Code Input Wrap */}
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1.5">
                    <span className="flex-1 font-mono text-sm font-bold tracking-wider text-neutral-800 px-2">
                      {voucher.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(voucher.id, voucher.code)}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                        copiedId === voucher.id
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 shadow-sm'
                      }`}
                    >
                      {copiedId === voucher.id ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1 font-medium text-amber-600">
                    ⏱ Expires in {voucher.daysRemaining} days
                  </span>
                  <span>Ends {new Date(voucher.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          SECTION 2: TRANSACTION HISTORICAL HISTORY
         ===================================================== */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
          History Ledger
        </h2>

        {pastVouchers.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">No historical archive records found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
            <div className="divide-y divide-neutral-100">
              {pastVouchers.map((voucher) => (
                <div key={voucher.id} className="flex items-center justify-between p-4 bg-neutral-50/50 opacity-70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm tracking-wide text-neutral-600 line-through">
                        {voucher.code}
                      </span>
                      <span className="text-xs font-medium text-neutral-500">
                        (₦{voucher.discountAmount.toLocaleString()} Off)
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Target checkout constraint subtotal: ₦{voucher.minimumOrder.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    {voucher.status === 'USED' ? (
                      <span className="text-xs font-bold text-neutral-500 bg-neutral-200/60 px-2.5 py-1 rounded-md">
                        Redeemed 🎉
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                        Expired ⏰
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}