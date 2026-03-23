'use client';

import { useState } from 'react';
import { TopBar } from './TopBar';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileSidebar } from './MobileSidebar';
import { TrendingTags } from '../home/TrendingTags'; 
import { MEGA_MENU_DATA } from '../../data/categories';

/**
 * 🚀 NAVBAR ORGANISM
 * We removed the category state from here because DesktopHeader 
 * now uses the self-contained CategoryMegaMenu component.
 */
export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Keep this only for the MobileSidebar if it still needs it
  const [activeCategory, setActiveCategory] = useState(MEGA_MENU_DATA[0]);

  return (
    <>
      {/* 🛠️ FIXED: Updated z-index to canonical class as per linter */}
      <header className="sticky top-0 z-150 w-full bg-white transition-all duration-300 shadow-sm">
        
        {/* 1. Psychological Hook - Ticker for FOMO/Trust */}
        <TopBar />
        
        {/* 2. Main Brand & Navigation Hub */}
        <div className="relative z-20 bg-white">
          {/* Desktop View */}
          <div className="hidden md:block border-b border-gray-50">
            {/* 🚀 FIXED: Removed the props that DesktopHeader no longer needs */}
            <DesktopHeader />
          </div>

          {/* Mobile View */}
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