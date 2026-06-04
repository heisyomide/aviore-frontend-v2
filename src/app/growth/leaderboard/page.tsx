// app/growth/leaderboard/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Search, 
  Zap, 
  Info,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  code: string;
  tier: 'ELITE' | 'PRO' | 'RISING';
  vendorsReferred: number;
  activeVendors: number;
  volumeRouted: number;
  growthStreak: 'HOT' | 'STEADY' | 'STABLE';
}

export default function GrowthLeaderboardPage() {
  // Competitive growth matrices synchronized straight from the ecosystem pipeline
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [cycleReset, setCycleReset] = useState<string>('June 30, 2026');
  
  // Infrastructure UX & Pipeline Flow Trackers
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback / Environment Port Mapping Configurations 
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Synchronize live pipeline metrics from the central tracking cluster on component mount
  useEffect(() => {
    const fetchGlobalCohortLeaderboard = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const sessionToken = localStorage.getItem('aviore_auth_token');
        if (!sessionToken) {
          throw new Error('Active security authorization credentials not found in storage.');
        }

        const response = await fetch(`${backendBaseUrl}/v1/growth/leaderboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || `Ecosystem node responded with error code: ${response.status}`);
        }

        // Hydrate live values from response payload architecture
        setLeaderboard(payload.leaderboard || []);
        if (payload.cycleReset) {
          setCycleReset(payload.cycleReset);
        }

      } catch (err: any) {
        console.error('[Leaderboard Hydration Failure]:', err.message);
        setErrorMessage(err.message || 'Ecosystem processing issue intercepted ranking registry compilation.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalCohortLeaderboard();
  }, [backendBaseUrl]);

  // Filter list securely across handles and keys
  const filteredLeaderboard = useMemo(() => {
    return leaderboard.filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leaderboard, searchQuery]);

  // Safely extract podium positions for layout focus wrappers dynamically from sorted state array
  const topThree = useMemo(() => {
    return {
      first: leaderboard.find(e => e.rank === 1),
      second: leaderboard.find(e => e.rank === 2),
      third: leaderboard.find(e => e.rank === 3),
    };
  }, [leaderboard]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400 font-mono text-xs space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#A4143D]" />
        <span>Compiling performance rankings, conversion depths, and transaction paces...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* PAGE INTRO HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
            <span>Growth Cohort Leaderboard</span>
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Real-time acquisition rankings evaluating vendor integration density, activation ratios, and processed GMV output.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl flex items-center space-x-2 self-start sm:self-center">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wide">Cycle Reset: {cycleReset}</span>
        </div>
      </div>

      {/* ERROR FEEDBACK ACTION BAR */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* VISUAL PODIUM STACK FOR TOP 3 OPERATORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        
        {/* SECOND PLACE */}
        {topThree.second && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm order-2 md:order-1 flex flex-col items-center relative text-center h-fit pt-10">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 bg-zinc-100 border-2 border-zinc-300 rounded-full flex items-center justify-center text-zinc-500 shadow-sm">
              <Medal className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">{topThree.second.name}</h3>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{topThree.second.code}</p>
            <div className="my-3 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1 text-[11px] font-mono font-bold text-zinc-600">
              ₦{topThree.second.volumeRouted.toLocaleString()} Routed
            </div>
            <span className="text-[10px] text-zinc-400 font-light">{topThree.second.activeVendors} Active Fronts</span>
          </div>
        )}

        {/* FIRST PLACE */}
        {topThree.first && (
          <div className="bg-linear-to-b from-zinc-900 to-[#100C2A] text-white rounded-2xl p-6 shadow-md order-1 md:order-2 flex flex-col items-center relative text-center md:mb-4 pt-12 border border-white/5">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-[#100C2A] rounded-full flex items-center justify-center text-white shadow-md">
              <Crown className="h-8 w-8 text-white drop-shadow-sm" />
            </div>
            <h3 className="text-base font-bold text-white">{topThree.first.name}</h3>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{topThree.first.code}</p>
            <div className="my-4 bg-white/10 border border-white/10 rounded-xl px-4 py-1.5 text-xs font-mono font-bold text-amber-400">
              ₦{topThree.first.volumeRouted.toLocaleString()} Routed
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-zinc-300 font-light">
              <span>{topThree.first.vendorsReferred} Sourced</span>
              <span className="h-1 w-1 bg-zinc-500 rounded-full" />
              <span className="text-emerald-400 font-medium">{topThree.first.activeVendors} Active</span>
            </div>
          </div>
        )}

        {/* THIRD PLACE */}
        {topThree.third && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm order-3 flex flex-col items-center relative text-center h-fit pt-10">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 bg-amber-50/50 border-2 border-amber-700/30 rounded-full flex items-center justify-center shadow-sm">
              <Medal className="h-6 w-6 text-amber-700/60" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">{topThree.third.name}</h3>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{topThree.third.code}</p>
            <div className="my-3 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1 text-[11px] font-mono font-bold text-zinc-600">
              ₦{topThree.third.volumeRouted.toLocaleString()} Routed
            </div>
            <span className="text-[10px] text-zinc-400 font-light">{topThree.third.activeVendors} Active Fronts</span>
          </div>
        )}

      </div>

      {/* SEARCH REGISTRY PIPELINE CONTROLS */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm relative">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search operator nodes, track keys or individual handles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:border-[#A4143D] transition-all"
          />
        </div>
      </div>

      {/* COMPLETE BREAKDOWN REGISTER TABLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="p-4 pl-6 text-center w-16">Rank</th>
                <th className="p-4">Growth Partner Node</th>
                <th className="p-4">Tracking Node Tag</th>
                <th className="p-4 text-center">Tier Class</th>
                <th className="p-4 text-center">Stores Sourced</th>
                <th className="p-4 text-center">Activation Depth Ratio</th>
                <th className="p-4">Gross Vol Routed</th>
                <th className="p-4 pr-6 text-center">Velocity Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-zinc-50/40 transition-colors group">
                    
                    {/* Rank Numeric Badge */}
                    <td className="p-4 pl-6 text-center">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-lg font-mono font-bold text-xs
                        ${entry.rank === 1 ? 'bg-amber-100 text-amber-800' : 
                          entry.rank === 2 ? 'bg-zinc-100 text-zinc-800' : 
                          entry.rank === 3 ? 'bg-amber-50 text-amber-700' : 'bg-zinc-50 text-zinc-500'}`}
                      >
                        {entry.rank}
                      </span>
                    </td>

                    {/* Operational Handle Node */}
                    <td className="p-4 font-semibold text-zinc-900 group-hover:text-[#A4143D] transition-colors">
                      {entry.name}
                    </td>

                    {/* Access Registry Tracker Key */}
                    <td className="p-4 font-mono text-zinc-500 font-medium">
                      {entry.code}
                    </td>

                    {/* Volume Tier Classification */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border
                        ${entry.tier === 'ELITE' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                          entry.tier === 'PRO' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                          'bg-zinc-50 text-zinc-600 border-zinc-200'}`}
                      >
                        {entry.tier}
                      </span>
                    </td>

                    {/* Total Sourced Vendor Metrics */}
                    <td className="p-4 text-center font-mono font-medium text-zinc-800">
                      {entry.vendorsReferred}
                    </td>

                    {/* Onboard Activation Conversion Slider Ratio */}
                    <td className="p-4">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-mono text-[11px] font-semibold text-zinc-700">
                          {entry.activeVendors} / {entry.vendorsReferred}
                        </span>
                        <div className="w-16 bg-zinc-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ 
                              width: entry.vendorsReferred > 0 
                                ? `${(entry.activeVendors / entry.vendorsReferred) * 100}%` 
                                : '0%' 
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Converted Gross Volume Routing Numbers */}
                    <td className="p-4 font-mono font-bold text-zinc-900">
                      ₦{entry.volumeRouted.toLocaleString()}.00
                    </td>

                    {/* Transaction Velocity Stabs */}
                    <td className="p-4 pr-6 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium border mx-auto w-fit
                        ${entry.growthStreak === 'HOT' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          entry.growthStreak === 'STEADY' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          'bg-zinc-50 text-zinc-500 border-zinc-200'}`}
                      >
                        {entry.growthStreak === 'HOT' && <Flame className="h-3 w-3 text-rose-500 fill-rose-500 mr-0.5" />}
                        {entry.growthStreak === 'STEADY' && <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500 mr-0.5" />}
                        <span>{entry.growthStreak === 'HOT' ? 'BURNING' : entry.growthStreak === 'STEADY' ? 'STEADY' : 'STABLE'}</span>
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400 font-light font-sans text-xs">
                    No system records corresponding to your parameters inside this cohort registry block.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RUNNING SYSTEM STATEMENTS */}
        <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-start space-x-2.5 text-[11px] text-zinc-400 font-light">
          <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p><strong>Ecosystem Ranking & Operational Performance Calculation Statement:</strong></p>
            <p>
              Rank dynamics are updated automatically based on verified gross order volumes across routing nodes. Performance milestones unlock access to enhanced target allocation rewards, priority support pipelines, and operational payout clearing tiers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}