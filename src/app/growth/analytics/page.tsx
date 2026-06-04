// app/growth/analytics/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users2, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  UserPlus,
  ShieldAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface TeamMemberData {
  id: string;
  name: string;
  role: 'HEAD' | 'SUB_MARKETER';
  code: string;
  vendorsReferred: number;
  activeVendors: number;
  totalSalesCount: number;
  totalVolumeGenerated: number;
  teamCommissionShare: number;
  joinedDate: string;
}

export default function GrowthTeamPerformancePage() {
  // Static dataset mapping team member distributions
  const [teamMembers] = useState<TeamMemberData[]>([
    { id: 'MEM-001', name: 'Ify Onyedika', role: 'HEAD', code: 'TEAM_IO', vendorsReferred: 14, activeVendors: 10, totalSalesCount: 8, totalVolumeGenerated: 450000, teamCommissionShare: 9000, joinedDate: 'Jan 12, 2026' },
    { id: 'MEM-002', name: 'Tewogbola Adeola', role: 'SUB_MARKETER', code: 'TEAM_TA', vendorsReferred: 12, activeVendors: 6, totalSalesCount: 4, totalVolumeGenerated: 210000, teamCommissionShare: 4200, joinedDate: 'Feb 18, 2026' },
    { id: 'MEM-003', name: 'Ifeoluwa Olayinka', role: 'SUB_MARKETER', code: 'TEAM_IO2', vendorsReferred: 9, activeVendors: 5, totalSalesCount: 2, totalVolumeGenerated: 112000, teamCommissionShare: 2240, joinedDate: 'Mar 02, 2026' },
    { id: 'MEM-004', name: 'Oluwaseun Kofoworola', role: 'SUB_MARKETER', code: 'TEAM_OK', vendorsReferred: 3, activeVendors: 1, totalSalesCount: 0, totalVolumeGenerated: 0, teamCommissionShare: 0, joinedDate: 'May 14, 2026' },
  ]);

  // Global aggregate stats
  const totalTeamVolume = useMemo(() => teamMembers.reduce((sum, m) => sum + m.totalVolumeGenerated, 0), [teamMembers]);
  const totalTeamEarnings = useMemo(() => teamMembers.reduce((sum, m) => sum + m.teamCommissionShare, 0), [teamMembers]);
  const totalVendors = useMemo(() => teamMembers.reduce((sum, m) => sum + m.vendorsReferred, 0), [teamMembers]);

  return (
    <div className="space-y-6">
      
      {/* PAGE INTRO BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Team Performance & Analytics
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Evaluate cohort conversion velocity, individual sub-marketer contributions, and network volume split distributions.
          </p>
        </div>
        
        {/* Privileged Management Button Action */}
        <button className="inline-flex items-center space-x-2 bg-[#A4143D] hover:bg-[#801030] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-center">
          <UserPlus className="h-3.5 w-3.5" />
          <span>Add Sub Marketer</span>
        </button>
      </div>

      {/* STRATEGIC MACRO PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TOTAL SALES VOLUME TRAFFIC */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Gross Volume Routed</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-mono font-bold text-zinc-900">
              ₦{totalTeamVolume.toLocaleString()}.00
            </h3>
            <p className="text-[11px] text-emerald-600 flex items-center space-x-1 font-medium mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18.4% vs last calendar window</span>
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[74%]" />
          </div>
        </div>

        {/* ACCRUED TOTAL OVERHEAD POOL */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Combined Shared Cut</span>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-mono font-bold text-zinc-900">
              ₦{totalTeamEarnings.toLocaleString()}.00
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Derived from 20% of your 10% marketplace commission
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-[58%]" />
          </div>
        </div>

        {/* RECRUITMENT DENSITY CARD */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Core Cohort Reach</span>
            <Users2 className="h-4 w-4 text-pink-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-bold text-zinc-900">
              {totalVendors} Active Vendors
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Distributed across {teamMembers.length} functional structural operators
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-pink-600 h-full w-[82%]" />
          </div>
        </div>

      </div>

      {/* CORE TEAM ROSTER MATRIX GRID */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Team Member Breakdown Matrix
          </h3>
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-light">
            <Sliders className="h-3.5 w-3.5" />
            <span>Sorted by performance output</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="p-4 pl-6">Operator Node Details</th>
                <th className="p-4">Authorization Role</th>
                <th className="p-4 text-center">Tracking Tag</th>
                <th className="p-4 text-center">Vendors Connected</th>
                <th className="p-4 text-center">Active Ratio</th>
                <th className="p-4">Volume Driven (NGN)</th>
                <th className="p-4 pr-6 text-right">Commission Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/40 transition-colors group">
                  
                  {/* Identity profile Column */}
                  <td className="p-4 pl-6 font-medium text-zinc-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-600 uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-900">{member.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Joined {member.joinedDate}</p>
                      </div>
                    </div>
                  </td>

                  {/* System Level Role Access */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wider uppercase border
                      ${member.role === 'HEAD' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {member.role === 'HEAD' ? 'TEAM HEAD' : 'SUB MARKETER'}
                    </span>
                  </td>

                  {/* Unique Tracking Code Code */}
                  <td className="p-4 text-center font-mono text-xs text-zinc-900 font-semibold bg-zinc-50/30">
                    {member.code}
                  </td>

                  {/* Vendors Attached */}
                  <td className="p-4 text-center font-mono font-medium text-zinc-800">
                    {member.vendorsReferred}
                  </td>

                  {/* Active Validation Metrics Graphically Estimated */}
                  <td className="p-4">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-mono font-semibold text-zinc-800">
                        {member.activeVendors} / {member.vendorsReferred}
                      </span>
                      <div className="w-16 bg-zinc-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${(member.activeVendors / (member.vendorsReferred || 1)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Total Routed Gross Revenue */}
                  <td className="p-4 font-mono text-zinc-800 font-medium">
                    ₦{member.totalVolumeGenerated.toLocaleString()}
                  </td>

                  {/* Converted Final Revenue Share Net payouts */}
                  <td className="p-4 pr-6 text-right font-mono text-xs font-bold text-emerald-600">
                    +₦{member.teamCommissionShare.toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECURITY & PRIVILEGE POLICY FOOTNOTE */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-center space-x-2.5 text-[11px] text-zinc-400 font-light">
          <ShieldAlert className="h-4 w-4 text-[#A4143D] shrink-0" />
          <span>
            <strong>Access Control Guard Statement:</strong> Sub-marketers can check metrics, view rewards pipelines, and evaluate their individual portfolios. Global configuration parameters, performance targets, and cash payout trigger buttons are restricted strictly to the designated team **HEAD**.
          </span>
        </div>
      </div>

    </div>
  );
}