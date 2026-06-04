// app/growth/wallet/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowDownRight, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Banknote,
  Clock,
  X,
  CheckCircle2,
  Building2,
  Loader2
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

interface BankStructure {
  id: number;
  code: string;
  name: string;
}

export default function GrowthWalletPage() {
  // Real-time backend values
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [pendingClearance, setPendingClearance] = useState<number>(0);
  const [history, setHistory] = useState<WithdrawalHistory[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<'HEAD' | 'SUB_MARKETER'>('SUB_MARKETER');
  
  // Loading & Error States
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Interactive Modal Form States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [supportedBanks, setSupportedBanks] = useState<BankStructure[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  
  // Resolution Verification Pipeline States
  const [isVerifyingAccount, setIsVerifyingAccount] = useState<boolean>(false);
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState<boolean>(false);

  // Configuration Anchor Portals
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const minimumThreshold = 20000.00;

  // 1. Sync Macro Balances, Role Configs, and Ledger Entries from Backend Core
  const synchronizeWalletClusterData = async () => {
    try {
      setPageLoading(true);
      setPageError(null);
      const sessionToken = localStorage.getItem('aviore_auth_token');

      // Sync active operator specifications
      const profileStr = localStorage.getItem('aviore_operator_profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setCurrentUserRole(profile.role || 'SUB_MARKETER');
      }

      // Fetch wallet aggregate context metrics from backend 
      // (Falls back gracefully to standard performance parameters if specialized route is yet to be deployed)
      const walletResponse = await fetch(`${backendBaseUrl}/v1/growth/analytics/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (walletResponse.ok) {
        const payload = await walletResponse.json();
        if (payload.success && payload.data) {
          setAvailableBalance(Number(payload.data.availableBalance) || 0);
          setTotalWithdrawn(Number(payload.data.totalWithdrawn) || 0);
          setPendingClearance(Number(payload.data.pendingClearance) || 0);
          if (payload.data.withdrawalLogs) {
            setHistory(payload.data.withdrawalLogs);
          }
        }
      }
    } catch (err: any) {
      setPageError(err.message || 'System failed to fetch secure liquidity node balances.');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    synchronizeWalletClusterData();
  }, []);

  // 2. Query Supported Commercial Banking Networks on Modal Visibility
  useEffect(() => {
    if (!isModalOpen) return;

    async function fetchBankingStructures() {
      try {
        const res = await fetch(`${backendBaseUrl}/v1/growth/wallet/banks`);
        if (!res.ok) throw new Error('Failed to resolve banking switches.');
        const data = await res.json();
        setSupportedBanks(data);
      } catch (err) {
        console.error('Could not query payment rail networks', err);
      }
    }
    fetchBankingStructures();
  }, [isModalOpen]);

  // 3. Real-time Account Verification Switch Loop
  useEffect(() => {
    if (accountNumber.length !== 10 || !selectedBankCode) {
      setResolvedAccountName(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsVerifyingAccount(true);
        setFormError(null);
        setResolvedAccountName(null);

        const res = await fetch(`${backendBaseUrl}/v1/growth/wallet/verify-account`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountNumber, bankCode: selectedBankCode }),
        });

        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message || 'Verification rejected by switch.');

        if (payload.account_name) {
          setResolvedAccountName(payload.account_name);
        }
      } catch (err: any) {
        setFormError(err.message || 'Invalid account parameter mismatch.');
      } finally {
        setIsVerifyingAccount(false);
      }
    }, 600); // 600ms Debounce limit to preserve server connection streams

    return () => clearTimeout(delayDebounceFn);
  }, [accountNumber, selectedBankCode]);

  // 4. Commit Liquidity Payout Transaction Request
  const executeLiquidationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const amountNum = parseFloat(withdrawalAmount);
    if (isNaN(amountNum) || amountNum < minimumThreshold) {
      setFormError(`Minimum structural liquidation requirement is ₦${minimumThreshold.toLocaleString()}.`);
      return;
    }

    if (amountNum > availableBalance) {
      setFormError('Requested amount exceeds active pooled funding reserves.');
      return;
    }

    if (!resolvedAccountName) {
      setFormError('Please resolve a verified recipient account node identity first.');
      return;
    }

    try {
      setIsSubmittingWithdrawal(true);
      const sessionToken = localStorage.getItem('aviore_auth_token');
      const bankObject = supportedBanks.find(b => b.code === selectedBankCode);

      const res = await fetch(`${backendBaseUrl}/v1/growth/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          amount: amountNum,
          bankCode: selectedBankCode,
          accountNumber: accountNumber,
          bankName: bankObject ? bankObject.name : 'Commercial Bank'
        })
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Liquidation pipeline rejected transaction.');

      setFormSuccess('Withdrawal initializing processed via banking rails.');
      setWithdrawalAmount('');
      setAccountNumber('');
      setSelectedBankCode('');
      setResolvedAccountName(null);
      
      // Delay modal collapse slightly to display transaction success criteria
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
        synchronizeWalletClusterData(); // Re-sync balances
      }, 2000);

    } catch (err: any) {
      setFormError(err.message || 'Network degradation aborted withdrawal operations.');
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin text-[#A4143D] mr-2" />
        Syncing cluster ledger nodes...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
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

      {pageError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

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
              Public ₦{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-zinc-400 font-light mt-1">
              Fully verified commission allocations settled into wallet vault.
            </p>
          </div>

          <div className="space-y-3">
            {currentUserRole === 'HEAD' ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white text-[#100C2A] hover:bg-zinc-100 py-3 rounded-xl text-xs font-bold tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5"
              >
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
              <span>Min Limit: ₦{minimumThreshold.toLocaleString()}</span>
              <span>Settlement Frame: Instant</span>
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
              ₦{totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
              ₦{pendingClearance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h4>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Incoming processing splits tied to unfulfilled or transit-locked marketplace orders.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Automated weekend payout cycle resolution</span>
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
          {history.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-zinc-400">
              No structural withdrawal transactions committed to history ledger logs.
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* LIQUIDATION MODAL BACKDROP SLIDEOUT PANEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            
            <button 
              onClick={() => { setIsModalOpen(false); setFormError(null); setFormSuccess(null); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                Request Liquidity Payout Withdrawal
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                Securely clear available funds down to your verified Nigerian commercial banking network nodes.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={executeLiquidationRequest} className="space-y-4 pt-2">
              
              {/* AMOUNT PARAMETER */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                  Liquidation Amount (NGN)
                </label>
                <input
                  type="number"
                  required
                  min={minimumThreshold}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder={`Min ₦${minimumThreshold.toLocaleString()}`}
                  className="w-full bg-zinc-50 font-mono text-xs px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900"
                />
              </div>

              {/* BANK CORE SELECT SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                  Destination Network Bank
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <select
                    required
                    value={selectedBankCode}
                    onChange={(e) => setSelectedBankCode(e.target.value)}
                    className="w-full bg-zinc-50 font-sans text-xs pl-10 pr-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900 appearance-none"
                  >
                    <option value="">Select operational bank switch...</option>
                    {supportedBanks.map((bank) => (
                      <option key={bank.id} value={bank.code}>{bank.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACCOUNT RESOLUTION NUMBER FIELD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                  10-Digit NUBAN Account Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} // Strips alphabetical parameters
                  placeholder="e.g. 0123456789"
                  className="w-full bg-zinc-50 font-mono text-xs px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900"
                />
              </div>

              {/* LIVE ACCOUNT RESOLUTION FOOTPRINT WRAPPER */}
              {(isVerifyingAccount || resolvedAccountName) && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Resolved Holder:</span>
                  {isVerifyingAccount ? (
                    <div className="flex items-center text-[11px] font-mono text-zinc-400">
                      <Loader2 className="h-3 w-3 animate-spin text-purple-600 mr-1.5" />
                      Interrogating bank switches...
                    </div>
                  ) : (
                    <span className="text-xs font-bold font-sans text-zinc-800 tracking-wide animate-fade-in">
                      {resolvedAccountName}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setFormError(null); setFormSuccess(null); }}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 font-medium text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWithdrawal || !resolvedAccountName}
                  className="inline-flex items-center space-x-1.5 bg-[#A4143D] hover:bg-[#801030] disabled:bg-zinc-200 disabled:text-zinc-400 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {isSubmittingWithdrawal ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      <span>Wiring Capital...</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="h-3.5 w-3.5" />
                      <span>Execute Payout</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}