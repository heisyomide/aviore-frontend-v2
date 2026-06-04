// app/growth/layout.tsx
'use client';

import React, { useState } from 'react';
import { Menu, X, Trophy, Target, Gift, LayoutDashboard, Users, LineChart, Wallet, ShoppingBag, Settings, Wrench, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type UserRole = 'HEAD' | 'SUB_MARKETER';

export interface ProfileContext {
  teamCode: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
}

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profile] = useState<ProfileContext>({
    teamCode: 'TEAM_IO',
    name: 'Ify Onyedika',
    avatarUrl: '/images/mock-avatar.jpg',
    role: 'HEAD',
  });

  // Consolidated navigation links map to handle desktop sidebar and sticky bottom mobile tabs
  const navLinks = [
    { name: 'Dashboard', href: '/growth/dashboard', icon: LayoutDashboard },
    { name: 'My Vendors', href: '/growth/vendors', icon: Users },
    { name: 'Team Performance', href: '/growth/analytics', icon: LineChart },
    { name: 'Wallet & Payouts', href: '/growth/wallet', icon: Wallet },
    { name: 'Transactions', href: '/growth/transactions', icon: ShoppingBag },
    { name: 'Marketing Tools', href: '/growth/tools', icon: Wrench },
    { name: 'Leaderboard', href: '/growth/leaderboard', icon: Trophy },
    { name: 'Rewards & Incentives', href: '/growth/rewards', icon: Gift },
    { name: 'Settings', href: '/growth/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] text-[#1A1A1A] font-sans antialiased">
      
      {/* --- DESKTOP SIDEBAR ASSEMBLY --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#100C2A] text-white shrink-0 p-5 justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 px-2">
            <span className="text-xl font-bold tracking-tight text-white font-serif">Aviore</span>
            <span className="text-[10px] bg-[#A4143D] px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-wide">Growth</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-purple-600 font-mono font-bold text-xs text-white flex items-center justify-center uppercase">
              {profile.teamCode.slice(-2)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">{profile.name}</h4>
              <span className="text-[9px] font-mono text-purple-300 bg-purple-900/40 px-1 py-0.5 rounded mt-0.5 inline-block font-bold">
                {profile.role} TEAM
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all
                    ${isActive ? 'bg-[#A4143D] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER OVERLAY SHEET (Ref: image_4.png Right Panel) --- */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 right-0 w-[280px] bg-[#100C2A] text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-serif">Aviore</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-purple-600 font-mono font-bold text-xs text-white flex items-center justify-center">
                {profile.teamCode.slice(-2)}
              </div>
              <div>
                <h4 className="text-xs font-bold">{profile.name}</h4>
                <span className="text-[9px] font-mono text-purple-300 bg-purple-900/40 px-1 py-0.5 rounded font-bold uppercase">{profile.role} TEAM</span>
              </div>
            </div>

            <nav className="space-y-1 overflow-y-auto max-h-[60vh] scrollbar-none">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                      ${isActive ? 'bg-[#A4143D] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/5 pt-4 text-[11px] text-zinc-500 flex items-center space-x-2">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Contact Support Terminal</span>
          </div>
        </div>
      </div>

      {/* --- MAIN APPLICATION MAIN FRAME ENVIRONMENT --- */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        
        {/* TOP MOBILE RESPONSIVE NAVIGATION BAR HEADER */}
        <header className="bg-white border-b border-zinc-200/80 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-base font-bold font-serif lg:hidden tracking-tight text-zinc-900">Aviore</span>
            <span className="hidden lg:block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Ecosystem Control Module</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-zinc-600">
              {profile.teamCode}
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-600 hover:bg-zinc-50 rounded-xl border border-zinc-200"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* CORE SCROLLABLE CONTENT VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {children}
        </main>
      </div>

      {/* --- STICKY MOBILE NAVIGATION BOTTOM TAB BAR (Ref: image_4.png Bottom Anchors) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200/80 px-4 py-2 flex items-center justify-around text-zinc-400 z-40 lg:hidden shadow-lg">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center space-y-0.5 text-center transition-colors ${isActive ? 'text-[#A4143D]' : 'hover:text-zinc-700'}`}
            >
              <link.icon className="h-4 w-4 stroke-[1.75]" />
              <span className="text-[9px] font-medium tracking-wide">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        {/* "More" Trigger matching the visual paradigm from image_4.png Panels */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center space-y-0.5 text-center text-zinc-400 hover:text-zinc-700"
        >
          <Menu className="h-4 w-4 stroke-[1.75]" />
          <span className="text-[9px] font-medium tracking-wide">More</span>
        </button>
      </nav>

    </div>
  );
}