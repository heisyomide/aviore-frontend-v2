'use client';

import { useState } from 'react';
import { TopBar } from './TopBar';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileSidebar } from './MobileSidebar';
import { TrendingTags } from '../home/TrendingTags'; // 🚀 New: Discovery Trigger
import { CATEGORY_TREE } from '../../data/categories';

/**
 * 🚀 NAVBAR ORGANISM
 * Rule 14: Component Line Limit - We keep the assembly clean.
 * Rule 10: Performance - States are localized here to prevent full-page re-renders.
 */
export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_TREE[0]);

  return (
    <>
      <header className="sticky top-0 z-[150] w-full bg-white transition-all duration-300 shadow-sm">
        
        {/* 1. Psychological Hook - Ticker for FOMO/Trust */}
        <TopBar />
        
        {/* 2. Main Brand & Navigation Hub */}
        <div className="relative z-20 bg-white">
          {/* Desktop View - Rule 1: 1400px Container Logic inside */}
          <div className="hidden md:block border-b border-gray-50">
            <DesktopHeader 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />
          </div>

          {/* Mobile View - Rule 13: Mobile First Optimization */}
          <div className="md:hidden border-b border-gray-50">
            <MobileHeader 
              openSidebar={() => setSidebarOpen(true)} 
            />
          </div>
        </div>

        {/* 3. Discovery Loop - Horizontal Trending Pills */}
        <div className="bg-white">
          <TrendingTags />
        </div>
      </header>

      {/* 🚀 OFF-CANVAS MOBILE SYSTEM */}
      <MobileSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </>
  );
}