// app/growth/transactions/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Download, 
  HelpCircle,
  TrendingUp,
  Receipt,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface TransactionRecord {
  id: string;
  orderId: string;
  vendorStore: string;
  orderGrossValue: number;
  platformCommission: number; 
  teamShareCut: number;       
  status: 'DELIVERED' | 'TRANSIT' | 'CANCELLED';
  settlementDate: string;
}

interface AggregateMetrics {
  grossVolume: number;
  netTeamCut: number;
  deliveredCount: number;
}

export default function GrowthTransactionsPage() {
  // Live State Management Core Nodes
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [aggregateMetrics, setAggregateMetrics] = useState<AggregateMetrics>({
    grossVolume: 0,
    netTeamCut: 0,
    deliveredCount: 0
  });

  // Controls, Filtering, and Query Channels
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // UX Operation Pipeline States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Configuration Anchor Portals
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // 1. Debounce Search Input Streams to minimize server hits
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch Live Log Sets and Performance Aggregates from NestJS Endpoint
  const synchronizeLedgerState = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const sessionToken = localStorage.getItem('aviore_auth_token');
      if (!sessionToken) {
        throw new Error('Active security authorization credentials not found.');
      }

      // Map UI local filtering tabs onto backend schema queries
      // Backend handles database where clauses based on strings passed down
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);

      const endpointUrl = `${backendBaseUrl}/v1/growth/transactions?${queryParams.toString()}`;

      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || `Ledger switch responded with status: ${response.status}`);
      }

      // Map backend formatted variables directly to our UI state trees
      if (payload) {
        setTransactions(payload.transactions || []);
        setAggregateMetrics(payload.aggregateMetrics || {
          grossVolume: 0,
          netTeamCut: 0,
          deliveredCount: 0
        });
      }

    } catch (err: any) {
      console.error('[Ledger Sync Failure]:', err.message);
      setErrorMessage(err.message || 'Network degradation intercepted transaction loading.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, backendBaseUrl]);

  // Trigger synchronization whenever filtering parameters or search queries resolve
  useEffect(() => {
    synchronizeLedgerState();
  }, [synchronizeLedgerState]);

  // 3. Export Historical Statement Downloads to CSV Format
  const executeStatementExport = async () => {
    if (transactions.length === 0) return;
    
    try {
      setIsDownloading(true);
      // Constructing client-side CSV parsing engine based on live synced states
      const headers = ['Ledger Block ID', 'Origin Order', 'Referred Store', 'Gross Value (NGN)', 'Platform Fee (NGN)', 'Team Share Cut (NGN)', 'Status', 'Settlement Date'];
      const csvRows = [
        headers.join(','),
        ...transactions.map(tx => [
          tx.id,
          tx.orderId,
          `"${tx.vendorStore.replace(/"/g, '""')}"`, // Wrap strings in quotes to prevent escaping bugs
          tx.orderGrossValue,
          tx.platformCommission,
          tx.teamShareCut,
          tx.status,
          tx.settlementDate
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `AVIORE_Growth_Ledger_Statement_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Could not construct historical export sheets', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* HEADER BAR PROMPT */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Commission Transaction Ledger
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Audit automatic multi-split payouts processed across your referred vendor network.
          </p>
        </div>
        <button 
          onClick={executeStatementExport}
          disabled={isDownloading || transactions.length === 0}
          className="inline-flex items-center space-x-2 bg-white hover:bg-zinc-50 disabled:bg-zinc-50 disabled:text-zinc-300 disabled:cursor-not-allowed text-zinc-700 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-center"
        >
          {isDownloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A4143D]" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>Download Statements</span>
        </button>
      </div>

      {/* ERROR CONTEXT MESSAGE DISPLAY FALLBACK */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* QUICK CALCULATION CONTEXT SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-mono font-medium tracking-wider">Settled Orders Fulfilled</span>
            <h3 className="text-xl font-bold text-zinc-900 mt-1">{aggregateMetrics.deliveredCount} Sales</h3>
          </div>
          <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-mono font-medium tracking-wider">Gross Sales Tracked</span>
            <h3 className="text-xl font-mono font-bold text-zinc-900 mt-1">
              ₦{aggregateMetrics.grossVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="h-9 w-9 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-100">
            <TrendingUp className="h-4 w-4 text-zinc-600" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between border-l-2 border-l-indigo-500">
          <div>
            <span className="text-[10px] text-indigo-400 uppercase font-mono font-medium tracking-wider">Net Team Revenue share</span>
            <h3 className="text-xl font-mono font-bold text-indigo-600 mt-1">
              ₦{aggregateMetrics.netTeamCut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Receipt className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS TABS BAR */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Parameter */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by store name, order code, block reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all text-zinc-900"
          />
        </div>

        {/* Tab Selection Filter Engine */}
        <div className="flex items-center space-x-1 border border-zinc-100 p-1 bg-zinc-50 rounded-xl w-full lg:w-auto overflow-x-auto">
          {['ALL', 'DELIVERED', 'TRANSIT', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap
                ${statusFilter === tab 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-600'
                }`}
            >
              {tab === 'DELIVERED' ? 'SETTLED' : tab === 'TRANSIT' ? 'IN TRANSIT' : tab === 'CANCELLED' ? 'VOIDED' : 'ALL ENTRIES'}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER TABLE LOG STACK */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400 font-mono text-xs space-y-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#A4143D]" />
              <span>Querying transaction registers across the cluster database...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-4 pl-6">Ledger Block ID</th>
                  <th className="p-4">Origin Order</th>
                  <th className="p-4">Referred Store</th>
                  <th className="p-4 text-right">Gross Order Amount</th>
                  <th className="p-4 text-right">Platform Cut (10%)</th>
                  <th className="p-4 text-right text-indigo-600 font-semibold">Team Share (20%)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Settlement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="p-4 pl-6 font-mono font-medium text-zinc-500">{tx.id}</td>
                      <td className="p-4 font-mono font-semibold text-zinc-900">{tx.orderId}</td>
                      <td className="p-4 font-medium text-zinc-900 flex items-center space-x-2">
                        <Building className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{tx.vendorStore}</span>
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-600">
                        ₦{tx.orderGrossValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-400">
                        ₦{tx.platformCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600 bg-linear-to-r from-white to-zinc-50/40">
                        +₦{tx.teamShareCut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                          ${tx.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            tx.status === 'TRANSIT' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            'bg-rose-50 text-rose-700 border-rose-100'}`}
                        >
                          {tx.status === 'DELIVERED' ? 'SETTLED' : tx.status === 'TRANSIT' ? 'TRANSIT' : 'VOIDED'}
                        </span>
                      </td>
                      <td className={`p-4 pr-6 text-right font-mono ${tx.status === 'DELIVERED' ? 'text-zinc-400' : 'text-zinc-400 font-sans italic'}`}>
                        {tx.settlementDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty logs fallback viewport */
                  <tr>
                    <td colSpan={8} className="text-center py-12 bg-zinc-50/20">
                      <div className="max-w-xs mx-auto flex flex-col items-center space-y-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <ArrowLeftRight className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-700">No matching logs verified</h4>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                          There are currently no transactions matching your search parameter or filter choices inside this ledger.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* MATH CALCULATION TRANSPARENCY BLOCKNOTE */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-start space-x-2.5 text-[11px] text-zinc-400 font-light">
          <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p><strong>Ecosystem Automated Splitting Architecture Matrix Note:</strong></p>
            <p>
              When an order hits <span className="text-emerald-600 font-medium">DELIVERED</span> state, the marketplace system retains a base 10% commission fee. Your Growth Team receives exactly 20% of that total commission asset automatically mapped onto your active wallet balance. 
            </p>
            <p className="font-mono text-[10px] text-zinc-400 bg-white border border-zinc-200/60 p-2 rounded-md mt-1 inline-block">
              Formula: Gross Sale Price × 10% (Platform Share) × 20% (Team Revenue Asset) = Net Converted Payout
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}