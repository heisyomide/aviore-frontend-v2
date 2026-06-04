// app/growth/vendors/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ShoppingBag,
  Layers,
  Sparkles,
  Download
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

export default function GrowthVendorsPage() {
  // Static cohort array mirroring your database metrics configuration
  const [vendors] = useState<VendorData[]>([
    { id: 'VND-001', storeName: 'Trendify Store', ownerName: 'Tunde Bakare', status: 'Active', productsCount: 12, successfulSales: 5, totalRevenue: 185000, joinedDate: '2 May 2025', email: 'contact@trendify.ng' },
    { id: 'VND-002', storeName: 'Glow Skincare', ownerName: 'Amara Okafor', status: 'Active', productsCount: 9, successfulSales: 3, totalRevenue: 124000, joinedDate: '7 May 2025', email: 'info@glowskin.com' },
    { id: 'VND-003', storeName: 'Smart Gadgets NG', ownerName: 'Chidi Nwosu', status: 'Pending', productsCount: 3, successfulSales: 0, totalRevenue: 0, joinedDate: '9 May 2025', email: 'sales@smartgadgets.ng' },
    { id: 'VND-004', storeName: 'Home Essentials', ownerName: 'Yinka Ahmed', status: 'Inactive', productsCount: 2, successfulSales: 0, totalRevenue: 0, joinedDate: '10 May 2025', email: 'yinka@homeessentials.shop' },
   // app/growth/vendors/page.tsx

// Change lines 37 to 39 to match the correct 'successfulSales' key:
{ id: 'VND-005', storeName: 'Fashions by Ella', ownerName: 'Emmanuela Kalu', status: 'Active', productsCount: 18, successfulSales: 6, totalRevenue: 216000, joinedDate: '12 May 2025', email: 'ella.fashion@gmail.com' },
{ id: 'VND-006', storeName: 'Sceptre Footwear', ownerName: 'Tewogbola Adeola', status: 'Pending', productsCount: 2, successfulSales: 0, totalRevenue: 0, joinedDate: '24 May 2025', email: 'sceptre.kicks@outlook.com' },
{ id: 'VND-007', storeName: 'Vanguard Luxury', ownerName: 'Ifeoluwa Olayinka', status: 'Inactive', productsCount: 0, successfulSales: 0, totalRevenue: 0, joinedDate: '02 Jun 2025', email: 'vanguard.lux@gmail.com' },
]);

  // UI Control states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Compute layout summary metrics dynamically
  const metrics = useMemo(() => {
    return {
      total: vendors.length,
      active: vendors.filter(v => v.productsCount >= 5).length,
      pending: vendors.filter(v => v.productsCount < 5 && v.productsCount > 0).length,
      stalled: vendors.filter(v => v.productsCount === 0).length,
    };
  }, [vendors]);

  // Handle Search and Filter rules safely
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = 
        vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'ALL' || 
        vendor.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchQuery, statusFilter]);

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
        <button className="inline-flex items-center space-x-2 bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-center">
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
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
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
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-zinc-50/40 transition-colors group">
                    {/* Identity Metadata Profile Column */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 text-zinc-800 font-mono font-bold text-xs flex items-center justify-center uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                          {vendor.storeName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 flex items-center space-x-1.5">
                            <span>{vendor.storeName}</span>
                            <ArrowUpRight className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-indigo-600" />
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            {vendor.ownerName} • <span className="font-mono">{vendor.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Operational Checkpoint Badges */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                        ${vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          vendor.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-rose-50 text-rose-700 border-rose-100'}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 
                          ${vendor.status === 'Active' ? 'bg-emerald-500' : vendor.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        />
                        {vendor.status === 'Active' ? 'ACTIVE (Verified)' : vendor.status === 'Pending' ? 'PENDING ACTION' : 'STALLED INACTIVE'}
                      </span>
                    </td>

                    {/* Products live counter checking rule targets */}
                    <td className="p-4 text-center font-mono text-zinc-500">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-zinc-800">{vendor.productsCount}</span>
                        <span className="text-[9px] text-zinc-400 font-sans">items live</span>
                      </div>
                    </td>

                    {/* Transaction metrics derived values */}
                    <td className="p-4 text-center font-mono text-zinc-500">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-zinc-800">{vendor.successfulSales}</span>
                        <span className="text-[9px] text-zinc-400 font-sans">orders</span>
                      </div>
                    </td>

                    {/* Gross Generated Pipeline Financial Counter */}
                    <td className="p-4 font-mono text-xs font-semibold text-zinc-800">
                      ₦{vendor.totalRevenue.toLocaleString()}
                    </td>

                    {/* Onboarding Timestamp Profile Reference */}
                    <td className="p-4 pr-6 text-right text-zinc-400 font-mono">
                      {vendor.joinedDate}
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty Search Array Fallback Environment */
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
            Showing {filteredVendors.length} of {vendors.length} total referrals
          </div>
        </div>
      </div>

    </div>
  );
}