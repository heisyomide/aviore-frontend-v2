// components/growth/GrowthSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProfileContext } from '../../app/growth/layout';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Wallet, 
  ArrowLeftRight, 
  Wrench, 
  Trophy, 
  Gift, 
  Settings, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  profile: ProfileContext;
}

export default function GrowthSidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', href: '/growth/dashboard', icon: LayoutDashboard },
    { name: 'My Vendors', href: '/growth/vendors', icon: Users },
    { name: 'Team Performance', href: '/growth/analytics', icon: BarChart3 },
    { name: 'Wallet & Payouts', href: '/growth/wallet', icon: Wallet },
    { name: 'Transactions', href: '/growth/transactions', icon: ArrowLeftRight },
    { name: 'Marketing Tools', href: '/growth/tools', icon: Wrench },
    { name: 'Leaderboard', href: '/growth/leaderboard', icon: Trophy },
    { name: 'Rewards & Incentives', href: '/growth/rewards', icon: Gift },
    { name: 'Settings', href: '/growth/settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-[#0F0C21] text-white flex flex-col shrink-0 min-h-screen">
      {/* BRAND ARCHITECTURE LOGO */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center space-x-2">
        <div className="h-7 w-7 bg-[#A4143D] rounded-lg flex items-center justify-center font-bold text-sm tracking-tight">
          A
        </div>
        <span className="font-serif text-lg font-semibold tracking-wide text-white">
          Aviorè
        </span>
      </div>

      {/* TEAM PROFILE HOVER CARD */}
      <div className="p-4 mx-2 my-4 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#A4143D] flex items-center justify-center font-mono text-base font-bold text-white shadow-inner">
          {profile.teamCode.substring(0, 2)}
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-wide font-mono text-white">
            {profile.teamCode}
          </h4>
          <span className="inline-block mt-0.5 text-[10px] font-medium tracking-wider uppercase bg-[#A4143D] text-white px-2 py-0.5 rounded-md scale-90 origin-left">
            {profile.role === 'HEAD' ? 'MASTER TEAM' : 'SUB MARKETER'}
          </span>
        </div>
      </div>

      {/* RENDER DYNAMIC PLATFORM LINK STACK */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 text-xs font-medium tracking-wide rounded-xl transition-all duration-150 group
                ${isActive 
                  ? 'bg-[#A4143D] text-white shadow-md font-semibold' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* DESK ASSISTANCE TERMINAL */}
      <div className="p-3 border-t border-white/5 bg-[#0A0718]">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
            <div>
              <p className="text-xs font-medium text-white">Need Help?</p>
              <p className="text-[10px] text-zinc-500 font-light">Contact Support</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </aside>
  );
}