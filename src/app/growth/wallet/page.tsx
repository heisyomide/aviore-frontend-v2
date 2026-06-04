// app/growth/wallet/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Banknote,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface WithdrawalHistory {
  id: string;
  amount: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  requestedBy: string;
  destinationBank: string;
  accountNumber: string;
  date: string;
}

export default function GrowthWalletPage() {
  // Mock Role Configuration to mimic the system architecture guardrails
  const [currentUserRole] = useState<'HEAD' | 'SUB_MARKETER'>('HEAD');

  // Hardcoded balance indicators mirroring image_3.png exactly
  const walletData = {
    availableBalance: 185750.00,
    totalWithdrawn: 640000.00,
    pendingClearance: 12400.00,
    minimumThreshold: 20000.00,
    withdrawalsThisMonth: 0,
    maxWithdrawalsPerMonth: 2,
    nextAvailableWindow: '12 Jun 2026'
  };

  const [history] = useState<WithdrawalHistory[]>([
    { id: 'WTH-8902', amount: 50000.00, status: 'SUCCESSFUL', requestedBy: 'Ify Onyedika', destinationBank: 'Access Bank', accountNumber: '00****4821', date: '28 May 2026' },
    { id: 'WTH-8741', amount: 120000.00, status: 'SUCCESSFUL', requestedBy: 'Ify Onyedika', destinationBank: 'Access Bank', accountNumber: '00****4821', date: '14 May 2026' },
    { id: 'WTH-8519', amount: 35000.00, status: 'FAILED', requestedBy: 'Ify Onyedika', destinationBank: 'Access Bank', accountNumber: '00****4821', date: '01 May 2026' },
    { id: 'WTH-8104', amount: 200000.00, status: 'SUCCESSFUL', requestedBy: 'Ify Onyedika', destinationBank: 'Access Bank', accountNumber: '00****4821', date: '15 Apr 2026' }
  ]);

  return (
    <div className="space-y-6">
      
      {/* SECTION BANNER PROMPT */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Wallet Hub & Payout Management
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Audit your shared team ledger, review pending operational clearings, and request structural bank liquidations.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl self-start sm:self-center">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-zinc-600">Ledger Audited: Real-Time</span>
        </div>
      </div>

      {/* CORE WALLET BLOCK ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTERACTIVE PAYOUT TRIGGER SYSTEM CARD */}
        <div className="bg-[#100C2A] text-white rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-xl min-h-[240px] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-28 w-28 bg-linear-to-br from-[#A4143D]/30 to-purple-600/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
              Available Team Pool Balance
            </span>
            <Wallet className="h-4 w-4 text-zinc-400" />
          </div>

          <div className="my-2">
            <h3 className="text-3xl font-mono font-bold tracking-tight text-white">
              ₦{walletData.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-zinc-400 font-light mt-1">
              Fully verified commission allocations settled into wallet vault.
            </p>
          </div>

          <div className="space-y-3">
            {currentUserRole === 'HEAD' ? (
              <button className="w-full bg-white text-[#100C2A] hover:bg-zinc-100 py-3 rounded-xl text-xs font-bold tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5">
                <Banknote className="h-4 w-4" />
                <span>Request Payout Withdrawal</span>
              </button>
            ) : (
              <div className="w-full bg-white/5 border border-white/10 text-zinc-400 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center justify-center space-x-2 cursor-not-allowed">
                <AlertCircle className="h-4 w-4 text-[#A4143D]" />
                <span>Withdrawal Restricted to Team Head</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Min Limit: ₦{walletData.minimumThreshold.toLocaleString()}</span>
              <span>{walletData.withdrawalsThisMonth}/{walletData.maxWithdrawalsPerMonth} requests used</span>
            </div>
          </div>
        </div>

        {/* METRIC CARD: TOTAL SYSTEM OUTFLOWS */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Total Converted Outflows</span>
            <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500 border border-zinc-100">
              <ArrowDownRight className="h-4 w-4 text-zinc-600" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-2xl font-mono font-bold text-zinc-900">
              ₦{walletData.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h4>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Gross liquid capital safely wired to your designated payout account nodes.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>All historical payout transfers settled safely</span>
          </div>
        </div>

        {/* METRIC CARD: INBOUND CLEARANCE LOCK */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Pending Clearance Escrow</span>
            <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500 border border-zinc-100">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-2xl font-mono font-bold text-zinc-800">
              ₦{walletData.pendingClearance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h4>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Incoming processing splits tied to unfulfilled or transit-locked marketplace orders.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Next sweep processing lock releases on {walletData.nextAvailableWindow}</span>
          </div>
        </div>

      </div>

      {/* HISTORICAL DISBURSEMENT LISTING TABLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Historical Withdrawal Logs
          </h3>
          <span className="text-[10px] font-mono font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md">
            Archive Registry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="p-4 pl-6">Reference ID</th>
                <th className="p-4">Amount Requested</th>
                <th className="p-4">Disbursement Destination</th>
                <th className="p-4">Initiated By</th>
                <th className="p-4">Status Flag</th>
                <th className="p-4 pr-6 text-right">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
              {history.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="p-4 pl-6 font-mono font-semibold text-zinc-900">
                    {tx.id}
                  </td>
                  <td className="p-4 font-mono font-bold text-zinc-800">
                    ₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-800">{tx.destinationBank}</span>
                      <span className="text-[10px] text-zinc-400 font-mono mt-0.5">{tx.accountNumber}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-500 font-medium">
                    {tx.requestedBy}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                      ${tx.status === 'SUCCESSFUL' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                        'bg-rose-50 text-rose-700 border-rose-100'}`}
                    >
                      {tx.status === 'SUCCESSFUL' ? 'SETTLED' : tx.status === 'PENDING' ? 'PROCESSING' : 'REJECTED'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-zinc-400 font-mono">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}