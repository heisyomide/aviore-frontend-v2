// app/growth/vendors/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Layers,
  Sparkles,
  Download,
  Loader2
} from 'lucide-react';

interface VendorData {
  id: string;
  storeName: string;
  ownerName: string;
  status: 'Active' | 'Pending' | 'Inactive';
  productsCount: number;
  successfulSales: number;
  totalRevenue: number;
  joinedDate: string;
  email: string;
}

interface MetricsSummary {
  total: number;
  active: number;
  pending: number;
  stalled: number;
}

export default function GrowthVendorsPage() {
  // 1. Live state environments replacing hardcoded static array loops
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary>({ total: 0, active: 0, pending: 0, stalled: 0 });
  
  // UI Control states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Tracking states for system feedback loaders and network errors
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorContext, setErrorContext] = useState<string | null>(null);

  // 2. Async data fetching coordinator calling your NestJS API endpoint
  const syncCohortTelemetry = async (search: string, filter: string) => {
    try {
      setIsLoading(true);
      setErrorContext(null);
      
      // Pull down authorization vectors from persistent local client space
      const token = localStorage.getItem('aviore_auth_token');
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Build search params query strings dynamically
      const urlParams = new URLSearchParams();
      if (filter !== 'ALL') urlParams.append('status', filter);
      if (search.trim().length > 0) urlParams.append('search', search);

      const fetchUrl = `${apiHost}/v1/growth/vendors/cohort-network?${urlParams.toString()}`;

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP state context: ${response.status}`);
      }

      const payload = await response.json();
      
      if (payload.success) {
        setVendors(payload.data);
        setMetrics(payload.metrics);
      } else {
        throw new Error(payload.message || 'Failed to map incoming cohort metadata channels.');
      }
    } catch (err: any) {
      console.error('Operational network failure tracking vendor registry:', err);
      setErrorContext(err?.message || 'An error occurred while tracking your network cohorts.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Debouncing input side-effects or tracking state variations
  useEffect(() => {
    const processDelayHandler = setTimeout(() => {
      syncCohortTelemetry(searchQuery, statusFilter);
    }, 350); // 350ms debounce window to prevent database query floods on rapid typing

    return () => clearTimeout(processDelayHandler);
  }, [searchQuery, statusFilter]);

  // Handle data export download trigger safely
  const handleExportData = () => {
    if (vendors.length === 0) return;
    
    const headers = ['Vendor ID', 'Store Name', 'Owner Name', 'Email', 'Status', 'Live Catalog Items', 'Successful Sales', 'Total Volume (NGN)', 'Joined Date'];
    const rows = vendors.map(v => [
      v.id, v.storeName, v.ownerName, v.email, v.status, v.productsCount, v.successfulSales, v.totalRevenue, v.joinedDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `cohort_network_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER ACTION DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            My Referred Cohort Network
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Monitor, track, and support independent vendors registered under your operational team tracking code.
          </p>
        </div>
        <button 
          onClick={handleExportData}
          disabled={isLoading || vendors.length === 0}
          className="inline-flex items-center space-x-2 bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-700 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-center"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Network Data</span>
        </button>
      </div>

      {/* COHORT SNAPSHOT COUNTER TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Referred Portfolio</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">{metrics.total} Stores</h3>
          <p className="text-[10px] text-zinc-400 font-light mt-1">Aggregated platform signups</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Verified Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-emerald-600 mt-2">{metrics.active} Stores</h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Passed 5+ product upload rule</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Pending Catalogs</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-amber-600 mt-2">{metrics.pending} Stores</h3>
          <p className="text-[10px] text-zinc-400 font-light mt-1">Under the 5 item activation limit</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Zero Uploads</span>
            <XCircle className="h-4 w-4 text-zinc-400" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-500 mt-2">{metrics.stalled} Stores</h3>
          <p className="text-[10px] text-zinc-400 font-light mt-1">Requires follow-up communication</p>
        </div>
      </div>

      {/* FILTER SEARCH CONTROL CONSOLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input field */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by store name, manager or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all"
          />
        </div>

        {/* Status Quick Filters Tab Stack */}
        <div className="flex items-center space-x-1 border border-zinc-100 p-1 bg-zinc-50 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', 'ACTIVE', 'PENDING', 'INACTIVE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap
                ${statusFilter === tab 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* COMPREHENSIVE VENDOR PIPELINE MATRIX GRID */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden min-h-[250px] relative">
        
        {/* RUNTIME LOADING INTERCEPTOR OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backup-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-zinc-500 bg-white border border-zinc-200 p-3 rounded-xl shadow-md">
              <Loader2 className="h-4 w-4 animate-spin text-[#A4143D]" />
              <span className="text-xs font-medium font-sans">Syncing registry telemetry...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="p-4 pl-6">Vendor Portfolio Details</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-center">Live Catalog</th>
                <th className="p-4 text-center">Orders Fulfilled</th>
                <th className="p-4">Volume Track (NGN)</th>
                <th className="p-4 pr-6 text-right">Onboarded Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
              {errorContext ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-rose-500 text-xs font-mono font-medium">
                    ⚠️ {errorContext}
                  </td>
                </tr>
              ) : vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-zinc-50/40 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 text-zinc-800 font-mono font-bold text-xs flex items-center justify-center uppercase group-hover:bg-[#A4143D]/5 group-hover:text-[#A4143D] group-hover:border-[#A4143D]/10 transition-colors">
                          {vendor.storeName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 flex items-center space-x-1.5">
                            <span>{vendor.storeName}</span>
                            <ArrowUpRight className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-[#A4143D]" />
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            {vendor.ownerName} • <span className="font-mono">{vendor.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                        ${vendor.status.toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          vendor.status.toUpperCase() === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-rose-50 text-rose-700 border-rose-100'}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 
                          ${vendor.status.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500' : vendor.status.toUpperCase() === 'PENDING' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        />
                        {vendor.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE (Verified)' : vendor.status.toUpperCase() === 'PENDING' ? 'PENDING ACTION' : 'STALLED INACTIVE'}
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono text-zinc-500">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-zinc-800">{vendor.productsCount}</span>
                        <span className="text-[9px] text-zinc-400 font-sans">items live</span>
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono text-zinc-500">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-zinc-800">{vendor.successfulSales}</span>
                        <span className="text-[9px] text-zinc-400 font-sans">orders</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-xs font-semibold text-zinc-800">
                      ₦{vendor.totalRevenue.toLocaleString()}
                    </td>

                    <td className="p-4 pr-6 text-right text-zinc-400 font-mono">
                      {vendor.joinedDate}
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 bg-zinc-50/20">
                      <div className="max-w-xs mx-auto flex flex-col items-center space-y-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <Search className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-700">No vendors discovered</h4>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                          We couldn't track any records matching "{searchQuery}" inside your filtered parameter setup.
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER CONTEXT: COACHING INSIGHT PROMPT BLOCK */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-light">
            <Sparkles className="h-3.5 w-3.5 text-[#A4143D]" />
            <span>
              <strong>Growth Tip:</strong> Reach out to vendors in <span className="text-amber-600 font-medium">Pending Action</span>. Getting them to upload just a few more pieces of inventory unlocks their status and boosts your recurring commission splits!
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono tracking-normal shrink-0">
            Showing {vendors.length} total referrals
          </div>
        </div>
      </div>

    </div>
  );
}