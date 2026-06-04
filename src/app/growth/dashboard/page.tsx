// app/growth/dashboard/page.tsx
'use client';

import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  ShoppingBag, 
  Coins, 
  ExternalLink, 
  Copy,
  ChevronRight,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function GrowthDashboardPage() {
  // Static context payload matching image_3.png exactly
  const mockStats = [
    { title: 'Total Vendors Referred', value: '38', subtext: 'All time', icon: Users, color: 'text-purple-600 bg-purple-50 border border-purple-100' },
    { title: 'Active Vendors', value: '22', subtext: 'Met 5+ product rule', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' },
    { title: 'Successful Sales', value: '14', subtext: 'All time', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50 border border-amber-100' },
    { title: 'Total Earnings (This Month)', value: '₦35,240.00', subtext: 'From 7 successful sales', icon: Coins, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
  ];

  const mockVendors = [
    { name: 'Trendify Store', status: 'Active', items: 12, sales: 5, date: '2 May 2025', avatarInit: 'T' },
    { name: 'Glow Skincare', status: 'Active', items: 9, sales: 3, date: '7 May 2025', avatarInit: 'G' },
    { name: 'Smart Gadgets NG', status: 'Pending', items: 3, sales: 0, date: '9 May 2025', avatarInit: 'S' },
    { name: 'Home Essentials', status: 'Inactive', items: 2, sales: 0, date: '10 May 2025', avatarInit: 'H' },
    { name: 'Fashions by Ella', status: 'Active', items: 18, sales: 6, date: '12 May 2025', avatarInit: 'F' },
  ];

  const mockTransactions = [
    { target: 'Trendify Store', id: '#ORD-9842', amount: '₦1,850.00', date: '23 May 2025' },
    { target: 'Glow Skincare', id: '#ORD-9841', amount: '₦1,240.00', date: '23 May 2025' },
    { target: 'Fashions by Ella', id: '#ORD-9840', amount: '₦2,160.00', date: '22 May 2025' },
    { target: 'Smart Gadgets NG', id: '#ORD-9839', amount: '₦950.00', date: '22 May 2025' },
    { target: 'Trendify Store', id: '#ORD-9838', amount: '₦1,600.00', date: '21 May 2025' },
  ];

  return (
    <div className="space-y-6">
      
      {/* TOP DECK ROW: GOAL PROGRESS CARD + WALLET SUMMARY CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ANNUAL GOAL CARRIER CARD */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
          {/* Subtle Ambient Scenic Frame representation from image_3.png */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-sky-100/50 via-white/0 to-white pointer-events-none hidden sm:block" />
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base">🌴</span>
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                Your Annual Vacation Goal Progress
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Complete 500 successful transactions to unlock your fully paid vacation!
            </p>
          </div>

          <div className="my-4 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-semibold text-zinc-900">14</span>
              <span className="text-sm text-zinc-400 font-light">/ 500 Sales Completed</span>
            </div>
            <span className="text-4xl font-serif font-semibold text-indigo-600">2%</span>
          </div>

          <div>
            <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden mb-2">
              <div className="bg-indigo-600 h-full w-[2%] rounded-full transition-all duration-300" />
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center space-x-1.5 font-light">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>14 successful sales down, 486 to go!</span>
            </p>
          </div>
        </div>

        {/* FINANCIAL WALLET HUB CARD */}
        <div className="bg-[#100C2A] text-white rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden">
          {/* Geometric Accent Circles */}
          <div className="absolute -right-12 -top-12 h-32 w-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
              Wallet Balance
            </span>
            <Wallet className="h-4 w-4 text-zinc-400" />
          </div>

          <div className="my-3">
            <h3 className="text-3xl font-mono font-bold tracking-tight text-white">
              ₦185,750.00
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-0.5">
              Available to withdraw
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white text-[#100C2A] hover:bg-zinc-100 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5">
              <span>Request Payout</span>
            </button>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Min ₦20,000</span>
              <span>2 withdrawals/month</span>
            </div>
            <p className="text-[10px] text-indigo-400 text-center pt-0.5 font-light">
              Next available window: 12 Jun 2026
            </p>
          </div>
        </div>
      </div>

      {/* METRIC STATISTICS ROW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {mockStats.map((stat) => (
          <div key={stat.title} className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex items-center space-x-4 shadow-sm group hover:border-zinc-300 transition-colors">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-400 font-medium truncate tracking-normal">
                {stat.title}
              </p>
              <h4 className="text-xl font-semibold text-zinc-900 tracking-tight mt-0.5">
                {stat.value}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide mt-0.5">
                {stat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MID-SECTION COMPONENT ROW GRID: VENDORS OVERVIEW + TRANSACTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* VENDORS OVERVIEW SUMMARY DATA BOX */}
        <div className="xl:col-span-2 bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
              My Vendors Overview
            </h3>
            <Link href="/growth/vendors" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-0.5 transition-colors group">
              <span>View All Vendors</span>
              <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200/60 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="p-4 pl-6">Vendor Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Products</th>
                  <th className="p-4 text-center">Successful Sales</th>
                  <th className="p-4 pr-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
                {mockVendors.map((vendor) => (
                  <tr key={vendor.name} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-4 pl-6 flex items-center space-x-3 font-medium text-zinc-900">
                      <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center font-mono text-[10px] font-bold text-white uppercase shadow-sm">
                        {vendor.avatarInit}
                      </div>
                      <span>{vendor.name}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide border
                        ${vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          vendor.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-rose-50 text-rose-700 border-rose-100'}`}
                      >
                        <span className={`h-1 w-1 rounded-full mr-1.5 ${vendor.status === 'Active' ? 'bg-emerald-500' : vendor.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        {vendor.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-zinc-500">{vendor.items}</td>
                    <td className="p-4 text-center font-mono text-zinc-500">{vendor.sales}</td>
                    <td className="p-4 pr-6 text-right text-zinc-400 font-mono">{vendor.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRANSACTIONS ACTIVITY STACK */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
              Recent Transactions
            </h3>
            <Link href="/growth/transactions" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-0.5 transition-colors group">
              <span>View All</span>
              <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 px-6 overflow-y-auto max-h-[295px]">
            {mockTransactions.map((tx, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-mono font-bold text-zinc-500">
                      #{(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-900 truncate">
                      {tx.target}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Order {tx.id}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <p className="text-xs font-mono font-semibold text-emerald-600">
                    +{tx.amount}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM HUB DECK: SYSTEM REF ARCHITECTURE & COMMISSIONS SUMMARY */}
      <div className="bg-[#FAF9FF] border border-indigo-100 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* REFERRAL CODE DISPATCH */}
        <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-inner flex flex-col justify-between h-full">
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            Your Referral Code
          </span>
          <div className="mt-3 flex items-center justify-between bg-indigo-50/50 p-3 rounded-lg border border-dashed border-indigo-200">
            <span className="text-xl font-mono font-bold tracking-widest text-[#100C2A]">
              TEAM_IO
            </span>
            <button className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-all shadow-sm">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 font-light mt-2 leading-relaxed">
            Share this individual operational tag with onboarding vendors to bridge metrics.
          </p>
        </div>

        {/* REFERRAL LINK CONTROLLER */}
        <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-inner flex flex-col justify-between h-full">
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider font-mono">
            Share Your Link
          </span>
          <div className="mt-3 flex items-center space-x-2">
            <div className="flex-1 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 text-zinc-500 text-xs truncate font-mono select-all">
              https://aviore.com/register?ref=TEAM_IO
            </div>
            <button className="bg-[#A4143D] hover:bg-[#801030] text-white px-3 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
              Copy
            </button>
          </div>
          {/* Quick social share matrix tags from image_3.png */}
          <div className="flex items-center space-x-3 mt-3 text-[10px] text-zinc-400">
            <span className="font-light">Share on:</span>
            <div className="flex space-x-2 text-indigo-600 font-medium">
              <span className="cursor-pointer hover:underline">WhatsApp</span>
              <span className="text-zinc-300">•</span>
              <span className="cursor-pointer hover:underline">Telegram</span>
              <span className="text-zinc-300">•</span>
              <span className="cursor-pointer hover:underline">Twitter</span>
            </div>
          </div>
        </div>

        {/* COMMISSION STATEMENT BADGE */}
        <div className="flex items-center space-x-4 p-2">
          <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-200 shadow-sm">
            <Coins className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">
              Earn 20% of our 10%
            </h4>
            <p className="text-[11px] text-zinc-500 font-light mt-1 leading-relaxed">
              Receive automated splits applied directly over the standard ecosystem commissions on every single delivery validation across your cohort.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}