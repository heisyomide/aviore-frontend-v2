'use client';

import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Save, 
  CreditCard, 
  Sliders,
  AlertTriangle
} from 'lucide-react';

export default function GrowthSettingsPage() {
  // Mock Role Configuration to mimic the privileged ecosystem guardrails
  const [currentUserRole] = useState<'HEAD' | 'SUB_MARKETER'>('HEAD');

  // Input states
  const [notifications, setNotifications] = useState({
    onVendorSignup: true,
    onSaleDelivered: true,
    onPayoutSettled: true,
    weeklyDigest: false
  });

  return (
    <div className="space-y-6">
      
      {/* SECTION BANNER PROMPT */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Global Settings & Access Management
        </h2>
        <p className="text-xs text-zinc-400 font-light mt-0.5">
          Configure personal notification routing, adjust your disbursement nodes, and manage core operational parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: CORE ACCOUNT & PAYOUT ROUTING */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* PROFILE CONFIGURATION BLOCK */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800 flex items-center space-x-2 border-b border-zinc-100 pb-3">
              <User className="h-4 w-4 text-[#A4143D]" />
              <span>Operator Profile Parameters</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Full Legal Name</label>
                <input 
                  type="text" 
                  defaultValue="Ayomide Oluwaseun Kofoworola" 
                  disabled 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">System Node Tag ID</label>
                <input 
                  type="text" 
                  defaultValue="TEAM_OK" 
                  disabled 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-mono text-zinc-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Registered Communication Email</label>
                <input 
                  type="email" 
                  defaultValue="kofoworola.dev@gmail.com" 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all"
                />
              </div>
            </div>
          </div>

          {/* SYSTEM DISBURSEMENT ACCOUNT NODE */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800 flex items-center space-x-2 border-b border-zinc-100 pb-3">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              <span>Settlement Account Nodes</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-light">
              Designate the bank terminal where your unlocked wallet commissions are disbursed upon liquidation sweeps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Bank Institution</label>
                <select className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all bg-white font-medium text-zinc-700">
                  <option>Access Bank Plc</option>
                  <option>Zenith Bank</option>
                  <option>Guaranty Trust Bank</option>
                  <option>United Bank for Africa</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Account Number String</label>
                <input 
                  type="text" 
                  placeholder="0012345678"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Verified Account Holder</label>
                <input 
                  type="text" 
                  placeholder="A. O. KOFOWOROLA"
                  disabled
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DISCRETE PREFERENCES & POLICY CRITICAL HOOKS */}
        <div className="space-y-6">
          
          {/* SYSTEM ALERTS NOTIFICATION CONTROL WRAPPER */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800 flex items-center space-x-2 border-b border-zinc-100 pb-3">
              <Bell className="h-4 w-4 text-amber-500" />
              <span>Real-Time System Alerts</span>
            </h3>

            <div className="space-y-3.5 text-xs text-zinc-600">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notifications.onVendorSignup}
                  onChange={(e) => setNotifications({...notifications, onVendorSignup: e.target.checked})}
                  className="mt-0.5 rounded border-zinc-300 text-[#A4143D] focus:ring-[#A4143D]"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-800 group-hover:text-[#A4143D] transition-colors">Vendor Registration Pings</span>
                  <p className="text-[11px] text-zinc-400 font-light">Receive a real-time event socket alert when a merchant initializes an application under your tracker nodes.</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notifications.onSaleDelivered}
                  onChange={(e) => setNotifications({...notifications, onSaleDelivered: e.target.checked})}
                  className="mt-0.5 rounded border-zinc-300 text-[#A4143D] focus:ring-[#A4143D]"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-800 group-hover:text-[#A4143D] transition-colors">Delivered Order Commissions</span>
                  <p className="text-[11px] text-zinc-400 font-light">Trigger incoming wallet credit updates the moment a customer transaction settles across the 3PL distribution route.</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={notifications.onPayoutSettled}
                  onChange={(e) => setNotifications({...notifications, onPayoutSettled: e.target.checked})}
                  className="mt-0.5 rounded border-zinc-300 text-[#A4143D] focus:ring-[#A4143D]"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-800 group-hover:text-[#A4143D] transition-colors">Payout Sweep Finalizations</span>
                  <p className="text-[11px] text-zinc-400 font-light">Get confirmation emails detailing processing references when a payout clears into your Access Bank terminal.</p>
                </div>
              </label>
            </div>
          </div>

          {/* CRITICAL ACCESS LEVEL GUARD CARD */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-800 flex items-center space-x-2 border-b border-zinc-100 pb-3">
              <Sliders className="h-4 w-4 text-purple-600" />
              <span>Privileged Strategy Configurations</span>
            </h3>
            
            {currentUserRole === 'HEAD' ? (
              <div className="space-y-4 text-xs">
                <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl text-[11px] text-purple-700 font-light flex items-start space-x-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Authorized Node Configuration access confirmed. Modifications here deploy cluster-wide across all connected sub-marketers instantly.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Global Team Allocation Cut Split (%)</label>
                  <input 
                    type="number" 
                    defaultValue={20} 
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all text-zinc-800 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Voucher Multi-Sign Minimum Limit</label>
                  <input 
                    type="number" 
                    defaultValue={5} 
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all text-zinc-800 font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center text-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                  <Lock className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-800">Advanced Adjustments Locked</h4>
                <p className="text-[11px] text-zinc-400 font-light max-w-[200px] leading-relaxed">
                  Global strategy matrices can only be modified by the designated cluster **HEAD**.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* FOOTER SAVE TRIGGER HUB */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-light">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Altering routing endpoints requires secondary multi-factor vault signature clearance hooks.</span>
        </div>
        <button className="w-full sm:w-auto bg-[#A4143D] hover:bg-[#801030] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all flex items-center justify-center space-x-1.5 self-end">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
}