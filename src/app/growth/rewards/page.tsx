// app/growth/rewards/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  Target, 
  Award, 
  CheckCircle2, 
  Lock, 
  Users, 
  Sparkles, 
  Zap, 
  ShoppingBag, 
  ChevronRight, 
  HelpCircle 
} from 'lucide-react';

interface MilestoneReward {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  rewardType: 'BONUS' | 'PERK' | 'ASSET';
  rewardValue: string;
  isUnlocked: boolean;
  progress: number;
}

export default function GrowthRewardsPage() {
  // Current user metrics reflecting your real-time performance database profile
  const currentMetrics = {
    totalSourced: 3,
    activeVerified: 1, // Store milestone triggers verify on 5 active products uploaded
  };

  // Automated progression milestones for active sub-marketers
  const [milestones] = useState<MilestoneReward[]>([
    {
      id: 'MS-01',
      title: 'Ecosystem Activation Foundation',
      description: 'Secure your first fully active merchant with 5+ premium items cataloged and live on the network.',
      targetCount: 1,
      rewardType: 'BONUS',
      rewardValue: '₦10,000 Payout Boost',
      isUnlocked: currentMetrics.activeVerified >= 1,
      progress: Math.min((currentMetrics.activeVerified / 1) * 100, 100)
    },
    {
      id: 'MS-02',
      title: 'Vanguard Pipeline Expansion',
      description: 'Successfully onboard 5 verified luxury storefront fronts to unlock localized infrastructure perks.',
      targetCount: 5,
      rewardType: 'PERK',
      rewardValue: 'Priority 3PL Shipping Rates',
      isUnlocked: currentMetrics.activeVerified >= 5,
      progress: Math.min((currentMetrics.activeVerified / 5) * 100, 100)
    },
    {
      id: 'MS-03',
      title: 'High-Volume Alpha Master',
      description: 'Scale your active sub-network cluster to 10 verified storefronts driving consistent sales pipelines.',
      targetCount: 10,
      rewardType: 'ASSET',
      rewardValue: 'Extra +2.5% Lifetime Commission Split',
      isUnlocked: currentMetrics.activeVerified >= 10,
      progress: Math.min((currentMetrics.activeVerified / 10) * 100, 100)
    }
  ]);

  // Compute next milestone threshold context pointers
  const nextMilestone = useMemo(() => {
    return milestones.find(m => !m.isUnlocked) || null;
  }, [milestones]);

  return (
    <div className="space-y-6">
      
      {/* PAGE ACTION INTRO BAR */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center space-x-2">
            <Gift className="h-5 w-5 text-[#A4143D] shrink-0" />
            <span>Target Rewards & Automated Milestones</span>
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Track performance velocity targets, unlock bonus payouts, and earn operational advantages across your growth nodes.
          </p>
        </div>
        <div className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-semibold self-start sm:self-center">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Milestones Live for 2026</span>
        </div>
      </div>

      {/* REWARDS STATUS TRACKER PROFILE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-mono font-medium tracking-wider">Total Storefronts Onboarded</span>
            <h3 className="text-xl font-mono font-bold text-zinc-900 mt-1">{currentMetrics.totalSourced} Registered</h3>
          </div>
          <div className="h-9 w-9 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-100">
            <Users className="h-4 w-4 text-zinc-600" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between border-l-2 border-l-emerald-500">
          <div>
            <span className="text-[10px] text-emerald-500 uppercase font-mono font-medium tracking-wider">Verified Active Fronts (5+ Items)</span>
            <h3 className="text-xl font-mono font-bold text-emerald-600 mt-1">{currentMetrics.activeVerified} Verified</h3>
          </div>
          <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-mono font-medium tracking-wider">Next Target Progress</span>
            <h3 className="text-xl font-bold text-zinc-900 mt-1">
              {nextMilestone ? `${currentMetrics.activeVerified} / ${nextMilestone.targetCount}` : 'Fully Maxed'}
            </h3>
          </div>
          <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Target className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* CORE MILESTONES ROADMAP HOOK CONTAINER */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Milestone Distribution Registry
          </h3>
          <p className="text-[11px] text-zinc-400 font-light mt-0.5">
            Payout modifiers deploy directly into your clearing balance automatically upon system verification.
          </p>
        </div>

        <div className="p-6 space-y-6 divide-y divide-zinc-100">
          {milestones.map((ms, index) => (
            <div key={ms.id} className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${index > 0 ? 'pt-6' : ''}`}>
              
              {/* Descriptions block */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2.5">
                  <span className={`h-6 w-6 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold
                    ${ms.isUnlocked 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-zinc-50 text-zinc-400 border-zinc-200/60'
                    }`}
                  >
                    {ms.isUnlocked ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <h4 className={`text-sm font-semibold transition-colors ${ms.isUnlocked ? 'text-zinc-900 line-through decoration-zinc-300' : 'text-zinc-800'}`}>
                    {ms.title}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border
                    ${ms.rewardType === 'BONUS' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                      ms.rewardType === 'PERK' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-purple-50 text-purple-700 border-purple-100'}`}
                  >
                    {ms.rewardType}
                  </span>
                </div>
                <p className="text-xs font-light text-zinc-400 max-w-2xl leading-relaxed">
                  {ms.description}
                </p>

                {/* Progress Tracking Bar Engine */}
                <div className="pt-2 max-w-xs flex items-center space-x-3">
                  <div className="flex-1 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${ms.isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${ms.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 font-medium whitespace-nowrap">
                    {ms.progress.toFixed(0)}% Complete
                  </span>
                </div>
              </div>

              {/* Reward Value Tag Callout */}
              <div className="w-full lg:w-72 shrink-0 flex items-center justify-between lg:justify-end gap-4 bg-zinc-50/50 lg:bg-transparent border border-zinc-100 lg:border-none p-3 lg:p-0 rounded-xl">
                <div className="text-left lg:text-right">
                  <span className="text-[9px] uppercase font-mono font-medium tracking-wider text-zinc-400 block">Milestone Reward Value</span>
                  <span className={`text-sm font-mono font-bold ${ms.isUnlocked ? 'text-emerald-600' : 'text-zinc-700'}`}>
                    {ms.rewardValue}
                  </span>
                </div>

                <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shadow-xs shrink-0
                  ${ms.isUnlocked 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-white text-zinc-400 border-zinc-200'
                  }`}
                >
                  {ms.isUnlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4 stroke-[1.75]" />}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* SYSTEM AUDIT EXPLAINER BLOCKNOTE FOOTER */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-start space-x-2.5 text-[11px] text-zinc-400 font-light">
          <HelpCircle className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p><strong>Ecosystem Voucher and Activation Verification Rules Policy Note:</strong></p>
            <p>
              To maintain the integrity of the AVIORÈ marketplace, referral milestones strictly measure <span className="text-zinc-700 font-medium">Verified Active Fronts</span>. A storefront is considered active only after it has finalized registration parameters and successfully uploaded 5+ authentic product items into the system core. Fake accounts or incomplete profiles will trigger system fraud protection reviews.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}