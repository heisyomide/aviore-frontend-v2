// app/growth/transactions/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  Download, 
  HelpCircle,
  TrendingUp,
  Receipt,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TransactionRecord {
  id: string;
  orderId: string;
  vendorStore: string;
  orderGrossValue: number;
  platformCommission: number; // 10% standard ecosystem take
  teamShareCut: number;       // 20% of platform commission allocation
  status: 'DELIVERED' | 'TRANSIT' | 'CANCELLED';
  settlementDate: string;
}

export default function GrowthTransactionsPage() {
  // Static archive mimicking database parameters
  const [transactions] = useState<TransactionRecord[]>([
    { id: 'CTX-90812', orderId: '#ORD-9842', vendorStore: 'Trendify Store', orderGrossValue: 92500, platformCommission: 9250, teamShareCut: 1850, status: 'DELIVERED', settlementDate: '23 May 2025' },
    { id: 'CTX-90811', orderId: '#ORD-9841', vendorStore: 'Glow Skincare', orderGrossValue: 62000, platformCommission: 6200, teamShareCut: 1240, status: 'DELIVERED', settlementDate: '23 May 2025' },
    { id: 'CTX-90810', orderId: '#ORD-9840', vendorStore: 'Fashions by Ella', orderGrossValue: 108000, platformCommission: 10800, teamShareCut: 2160, status: 'DELIVERED', settlementDate: '22 May 2025' },
    { id: 'CTX-90809', orderId: '#ORD-9839', vendorStore: 'Smart Gadgets NG', orderGrossValue: 47500, platformCommission: 4750, teamShareCut: 950, status: 'DELIVERED', settlementDate: '22 May 2025' },
    { id: 'CTX-90808', orderId: '#ORD-9838', vendorStore: 'Trendify Store', orderGrossValue: 80000, platformCommission: 8000, teamShareCut: 1600, status: 'DELIVERED', settlementDate: '21 May 2025' },
    { id: 'CTX-90799', orderId: '#ORD-9711', vendorStore: 'Sceptre Footwear', orderGrossValue: 55000, platformCommission: 5500, teamShareCut: 1100, status: 'TRANSIT', settlementDate: 'In Progress' },
    { id: 'CTX-90790', orderId: '#ORD-9640', vendorStore: 'Glow Skincare', orderGrossValue: 42000, platformCommission: 4200, teamShareCut: 840, status: 'CANCELLED', settlementDate: 'Refused' }
  ]);

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Compute live contextual metrics inside current viewport arrays
  const aggregateMetrics = useMemo(() => {
    const deliveredRows = transactions.filter(t => t.status === 'DELIVERED');
    return {
      grossVolume: deliveredRows.reduce((sum, t) => sum + t.orderGrossValue, 0),
      netTeamCut: deliveredRows.reduce((sum, t) => sum + t.teamShareCut, 0),
      deliveredCount: deliveredRows.length
    };
  }, [transactions]);

  // Filter application arrays safely
  const filteredTransactions = useMemo(() => {
    return transactions.filter(record => {
      const matchesSearch = 
        record.vendorStore.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'ALL' || 
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      
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
        <button className="inline-flex items-center space-x-2 bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-center">
          <Download className="h-3.5 w-3.5" />
          <span>Download Statements</span>
        </button>
      </div>

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
            <h3 className="text-xl font-mono font-bold text-zinc-900 mt-1">₦{aggregateMetrics.grossVolume.toLocaleString()}.00</h3>
          </div>
          <div className="h-9 w-9 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-100">
            <TrendingUp className="h-4 w-4 text-zinc-600" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between border-l-2 border-l-indigo-500">
          <div>
            <span className="text-[10px] text-indigo-400 uppercase font-mono font-medium tracking-wider">Net Team Revenue share</span>
            <h3 className="text-xl font-mono font-bold text-indigo-600 mt-1">₦{aggregateMetrics.netTeamCut.toLocaleString()}.00</h3>
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
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all"
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/40 transition-colors">
                    {/* Node block identifier */}
                    <td className="p-4 pl-6 font-mono font-medium text-zinc-500">
                      {tx.id}
                    </td>

                    {/* Order ID tag reference */}
                    <td className="p-4 font-mono font-semibold text-zinc-900">
                      {tx.orderId}
                    </td>

                    {/* Vendor account association */}
                    <td className="p-4 font-medium text-zinc-900 flex items-center space-x-2">
                      <Building className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{tx.vendorStore}</span>
                    </td>

                    {/* Gross transaction value */}
                    <td className="p-4 text-right font-mono text-zinc-600">
                      ₦{tx.orderGrossValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Platform 10% ecosystem fee */}
                    <td className="p-4 text-right font-mono text-zinc-400">
                      ₦{tx.platformCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Team 20% growth network share cut */}
                    <td className="p-4 text-right font-mono font-bold text-emerald-600 bg-linear-to-r from-white to-zinc-50/40">
                      +₦{tx.teamShareCut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Pipeline Status Indicator Flags */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                        ${tx.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          tx.status === 'TRANSIT' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-rose-50 text-rose-700 border-rose-100'}`}
                      >
                        {tx.status === 'DELIVERED' ? 'SETTLED' : tx.status === 'TRANSIT' ? 'TRANSIT' : 'VOIDED'}
                      </span>
                    </td>

                    {/* Clear-down calendar marker */}
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
        </div>

        {/* MATH CALCULATION TRANSPARENCY BLOCKNOTE */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-start space-x-2.5 text-[11px] text-zinc-400 font-light">
          <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Ecosystem Automated Splitting Architecture Matrix Note:</strong> 
            </p>
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