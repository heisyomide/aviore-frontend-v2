'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Save, 
  CreditCard, 
  Sliders,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NotificationState {
  onVendorSignup: boolean;
  onSaleDelivered: boolean;
  onPayoutSettled: boolean;
  weeklyDigest: boolean;
}

interface ProfileState {
  fullName: string;
  systemNodeTagId: string;
  email: string;
}

interface SettlementState {
  bankInstitution: string;
  accountNumber: string;
  verifiedAccountHolder: string;
}

interface StrategyState {
  globalTeamAllocationSplit: number;
  voucherMultiSignLimit: number;
}

export default function GrowthSettingsPage() {
  // Operational State Vectors Hydrated Dynamically from NestJS
  const [currentUserRole, setCurrentUserRole] = useState<'HEAD' | 'SUB_MARKETER'>('SUB_MARKETER');
  const [profile, setProfile] = useState<ProfileState>({ fullName: '', systemNodeTagId: '', email: '' });
  const [settlement, setSettlement] = useState<SettlementState>({ bankInstitution: 'Access Bank Plc', accountNumber: '', verifiedAccountHolder: '' });
  const [notifications, setNotifications] = useState<NotificationState>({ onVendorSignup: true, onSaleDelivered: true, onPayoutSettled: true, weeklyDigest: false });
  const [strategy, setStrategy] = useState<StrategyState>({ globalTeamAllocationSplit: 20, voucherMultiSignLimit: 5 });

  // Infrastructure UX & Operation State Trackers
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ status: 'SUCCESS' | 'ERROR' | null; message: string | null }>({ status: null, message: null });

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch current cluster parameters from the gateway node on mount
  useEffect(() => {
    const fetchOperatorSettings = async () => {
      try {
        setIsLoading(true);
        const sessionToken = localStorage.getItem('aviore_auth_token');
        if (!sessionToken) {
          throw new Error('Active security authorization credentials not found in storage.');
        }

        const response = await fetch(`${backendBaseUrl}/v1/growth/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ecosystem node returned error status code: ${response.status}`);
        }

        const payload = await response.json();

        // Hydrate data pools safely matching backend response payload schema
        setCurrentUserRole(payload.role);
        setProfile(payload.profile);
        setSettlement(payload.settlementNode);
        setNotifications(payload.notifications);
        setStrategy(payload.privilegedStrategy);

      } catch (err: any) {
        console.error('[Settings Hydration Failure]:', err.message);
        setActionFeedback({ status: 'ERROR', message: err.message || 'Failed to establish tunnel to setting configurations.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperatorSettings();
  }, [backendBaseUrl]);

  // Handle setting updates submission to the NestJS database transactional controller
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setActionFeedback({ status: null, message: null });

      const sessionToken = localStorage.getItem('aviore_auth_token');
      if (!sessionToken) {
        throw new Error('Active security authorization credentials not found in storage.');
      }

      // Build out update data body schema matching UpdateSettingsDto structure expected by NestJS
      const updatePayload = {
        bankInstitution: settlement.bankInstitution,
        accountNumber: settlement.accountNumber,
        notifications: {
          onVendorSignup: notifications.onVendorSignup,
          onSaleDelivered: notifications.onSaleDelivered,
          onPayoutSettled: notifications.onPayoutSettled,
          weeklyDigest: notifications.weeklyDigest,
        },
        // Conditionally attach privileged configurations if user occupies HEAD role node
        ...(currentUserRole === 'HEAD' && {
          globalTeamAllocationSplit: Number(strategy.globalTeamAllocationSplit),
          voucherMultiSignLimit: Number(strategy.voucherMultiSignLimit),
        }),
      };

      const response = await fetch(`${backendBaseUrl}/v1/growth/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Validation error intercepted settings cluster deployment.');
      }

      setActionFeedback({ status: 'SUCCESS', message: 'Ecosystem configuration matrices successfully propagated across cluster nodes.' });
      
      // Clear alert banner after a small delay window
      setTimeout(() => setActionFeedback({ status: null, message: null }), 5000);

    } catch (err: any) {
      console.error('[Settings Save Failure]:', err.message);
      setActionFeedback({ status: 'ERROR', message: err.message || 'Network processing failure encountered saving parameters.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400 font-mono text-xs space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#A4143D]" />
        <span>Synchronizing operator configuration maps from gateway cluster...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* SECTION BANNER PROMPT */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Global Settings & Access Management
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Configure personal notification routing, adjust your disbursement nodes, and manage core operational parameters.
          </p>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 self-start sm:self-center">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Active Role:</span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            currentUserRole === 'HEAD' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
          }`}>
            {currentUserRole}
          </span>
        </div>
      </div>

      {/* FEEDBACK SYSTEM ALERTS BAR */}
      {actionFeedback.message && (
        <div className={`p-4 rounded-xl border font-mono text-xs flex items-center space-x-2.5 shadow-xs transition-all ${
          actionFeedback.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {actionFeedback.status === 'SUCCESS' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

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
                  value={profile.fullName}
                  disabled 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-500 cursor-not-allowed outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">System Node Tag ID</label>
                <input 
                  type="text" 
                  value={profile.systemNodeTagId} 
                  disabled 
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-mono text-zinc-400 cursor-not-allowed outline-none"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Registered Communication Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-400 cursor-not-allowed outline-none"
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
                <select 
                  value={settlement.bankInstitution}
                  onChange={(e) => setSettlement({ ...settlement, bankInstitution: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all bg-white font-medium text-zinc-700"
                >
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
                  value={settlement.accountNumber}
                  maxLength={10}
                  onChange={(e) => setSettlement({ ...settlement, accountNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all text-zinc-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Verified Account Holder</label>
                <input 
                  type="text" 
                  value={settlement.verifiedAccountHolder}
                  disabled
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-400 cursor-not-allowed outline-none"
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
                  <p className="text-[11px] text-zinc-400 font-light">Get confirmation emails detailing processing references when a payout clears into your settlement node.</p>
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
                    value={strategy.globalTeamAllocationSplit} 
                    onChange={(e) => setStrategy({ ...strategy, globalTeamAllocationSplit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all text-zinc-800 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Voucher Multi-Sign Minimum Limit</label>
                  <input 
                    type="number" 
                    value={strategy.voucherMultiSignLimit} 
                    onChange={(e) => setStrategy({ ...strategy, voucherMultiSignLimit: Number(e.target.value) })}
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
        <button 
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto bg-[#A4143D] hover:bg-[#801030] disabled:bg-[#a414387a] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all flex items-center justify-center space-x-1.5 self-end"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Propagating Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}