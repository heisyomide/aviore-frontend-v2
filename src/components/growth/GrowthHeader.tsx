// components/growth/GrowthHeader.tsx
'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { ProfileContext } from '../../app/growth/layout';

interface HeaderProps {
  profile: ProfileContext;
}

export default function GrowthHeader({ profile }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
      {/* PAGE IDENTIFIER DESCRIPTOR */}
      <div className="flex items-center space-x-3">
        <button className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 xl:hidden transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-medium tracking-tight text-zinc-800">
          Vendor Growth Performance Space
        </h1>
      </div>

      {/* NOTIFICATION HUB & IDENTITY INTERPOLATION */}
      <div className="flex items-center space-x-4">
        {/* BELL NOTIFICATION BADGE */}
        <button className="relative p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 bg-[#A4143D] h-4 w-4 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center ring-2 ring-white">
            3
          </span>
        </button>

        {/* STRUCTURAL PROFILE AVATAR ELEMENT */}
        <div className="flex items-center space-x-3 border-l border-zinc-200 pl-4">
          <div className="text-right hidden sm:block">
            <h3 className="text-xs font-semibold text-zinc-900">{profile.name}</h3>
            <p className="text-[10px] text-zinc-400 font-light mt-0.5 tracking-wide">
              Head of Vendor Growth
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-[#A4143D] p-[1.5px] shadow-sm">
            <div className="h-full w-full bg-white rounded-full flex items-center justify-center overflow-hidden text-xs font-mono font-bold text-zinc-800 border border-zinc-100">
              IO
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}