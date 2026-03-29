'use client';

import { useState } from 'react';
import { Bell, LogOut, User, ChevronDown, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth'; // 👈 Point this to where you saved that code

export default function VendorHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth(); // 🚀 Using your Auth Hook
  const router = useRouter();

  // Logic: Generate initials from your AuthUser type
  const getInitials = () => {
    if (!user) return "V";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "V";
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Guard: Don't show header if user is not a vendor or logged out
  if (!user || user.role !== 'VENDOR') return null;

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1E293B] text-white px-6 pt-12 pb-14 rounded-b-[2.5rem] shadow-2xl">
      <div className="flex justify-between items-center">
        
        {/* 1. WELCOME NODE */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Aviorè Hub</h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            Welcome back, <span className="text-white">{user.firstName || 'Merchant'}</span>
          </p>
        </div>

        {/* 2. ACTION CLUSTER */}
        <div className="flex items-center gap-4">
          
          {/* Notification Node */}
          <button className="relative p-2.5 bg-slate-800 rounded-full border border-slate-700 shadow-inner active:scale-90 transition-transform">
            <Bell size={18} className="text-slate-300" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#1E293B]" />
          </button>

          {/* Profile Initiative */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-slate-800 p-1 pr-3 rounded-full border border-slate-700 active:bg-slate-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs italic shadow-lg border border-blue-400/30">
                {getInitials()}
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-4 w-48 bg-white rounded-3xl shadow-2xl py-3 border border-slate-100 z-20 animate-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-2 border-b border-slate-50 mb-2">
                    <p className="text-[10px] font-black text-slate-900 uppercase truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Authorized Vendor</p>
                  </div>
                  
                  <button onClick={() => { setIsProfileOpen(false); router.push('/vendor/settings'); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50">
                    <User size={14} className="text-blue-600" /> My Identity
                  </button>
                  
                  <button onClick={() => { setIsProfileOpen(false); router.push('/vendor/settings?tab=KYC'); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50">
                    <Zap size={14} className="text-blue-600" /> Registry Node
                  </button>

                  <div className="h-px bg-slate-50 my-2 mx-4" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Terminate Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}