'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Hero } from '../components/home/Hero';
import { FlashDeals } from '../components/home/FlashDeals';
import { CategoryCircle } from '../components/home/CategoryCircle';
import { CategoryExplorer } from '../components/home/CategoryExplorer'; 
import { Section } from '../components/layout/Section';
import { ProductGrid } from '../components/product/ProductGrid';
import { SkeletonGrid } from '../components/product/SkeletonGrid';
import { TrustBar } from '../components/home/TrustBar';
import { HomeCategories } from '@/src/components/home/HomeCategories';
import { TopDealsSection } from '../components/home/TopSaverDeals';
import {  PromoBanner } from '../components/home/MultiBannerGrid';
import { PopularVendorsSection } from '../components/home/PopularVendors';
import { api } from '@/src/lib/axios';
import { ChevronRight, Sparkles, Zap, Loader2, PackageSearch } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/Footer';
import { BreakoutBannerGrid } from '../components/home/BreakBannerGrid';
import { VendorCTA } from '../components/home/VendorCTA';
import { CategoryWorldSection } from '../components/home/CategoryWorldSection';
import { HomeRailSection } from '../components/home/HomeRailSection';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [registry, setRegistry] = useState<{
    departments: any[];
    feed: any[];
    vendors: any[];
    topSaver: any[];
  }>({
    departments: [],
    feed: [],
    vendors: [],
    topSaver: []
  });

  useEffect(() => {
    const syncAvioreRegistry = async () => {
      try {
        setLoading(true);
        const [depRes, homeRes, dealsRes] = await Promise.all([
          api.get('/storefront/registry'), 
          api.get('/storefront/homepage'),
          api.get('/storefront/top-deals')
        ]);
        
        setRegistry({
          departments: depRes.data?.sections || [],
          feed: homeRes.data?.sections?.flatMap((s: any) => s.data) || [],
          vendors: homeRes.data?.vendors || [],
          topSaver: dealsRes.data || []
        });
      } catch (err) {
        console.error("AVI_REGISTRY_SYNC_FAILURE", err);
      } finally {
        setLoading(false);
      }
    };
    syncAvioreRegistry();
  }, []);

  /**
   * 🛡️ SMART INVENTORY SLICING
   * Logic: If total items > 10, we skip the first 6 (shown in Flash Deals) to avoid duplication.
   * If total items are low, we show everything to prevent an empty Discovery Feed.
   */
  const flashDealsInventory = useMemo(() => registry.feed.slice(0, 6), [registry.feed]);
  
  const paginatedDiscovery = useMemo(() => {
    const skipCount = registry.feed.length > 10 ? 6 : 0;
    return registry.feed.slice(skipCount, skipCount + visibleCount);
  }, [registry.feed, visibleCount]);

  const hasMoreItems = (paginatedDiscovery.length + (registry.feed.length > 10 ? 6 : 0)) < registry.feed.length;

  const handleRegistrySync = useCallback(() => {
    if (isSyncing || !hasMoreItems) return;
    setIsSyncing(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 12);
      setIsSyncing(false);
    }, 850);
  }, [isSyncing, hasMoreItems]);



  if (loading) return <HomeSkeleton />;

  return (
    /* 🚀 THE FIX: flex flex-col min-h-screen ensures the main container 
       fills the height of the phone, pushing the footer stack to the bottom. */
    <main className="bg-white min-h-screen flex flex-col selection:bg-[#A4143D] selection:text-white">
      <Navbar />
      
      {/* WRAPPER: This div grows to fill all available space, 
          ensuring the footer stack below it is always at the bottom. */}
      <div className="grow">
        <Hero />

        <HomeRailSection title={''} href={''} products={[]} />

        {/* 3. URGENCY ZONE */}
        <div className="mt-6 md:mt-12 border-y border-zinc-100 bg-zinc-50/50 py-7">
          {flashDealsInventory.length > 0 && <FlashDeals products={flashDealsInventory} />}
        </div>

        <div className="py-12">
          <PopularVendorsSection initialVendors={registry.vendors} />
        </div>

<BreakoutBannerGrid 
  items={[
    { 
      tag: "Get Rewarded", 
      heading: "Save Up", 
      discount: "50% Off", 
      subtext: "Best price on the market", 
      image: "/cta.jpg", 
      link: "/shop/women" 
    },
    { 
      tag: "New Arrivals", 
      heading: "B&O Beoplay", 
      subtext: "Free delivery over ₦25000", 
      image: "/cta2.png", 
      link: "/shop/audio" 
    },
    { 
      tag: "Top Seller", 
      heading: "Beauty on Your Wrist", 
      subtext: "Buy 1 get 1 free", 
      image: "/cta3.png", 
      link: "/shop/jewelry" 
    },
  ]} 
/>

        {/* 2. DYNAMIC DEPARTMENTS */}
<div className="px-4 md:px-8">

  {registry.departments.map((section: any) => (

    section.data?.length > 0 && (

      <CategoryWorldSection
        key={section.slug}
        title={section.title}
        slug={section.slug}
        products={section.data}
      />

    )

  ))}

</div>

<BreakoutBannerGrid 
  items={[
    { 
      tag: "Get Rewarded", 
      heading: "Super Cheap Price", 
      subtext: "Earn 20% Back", 
      image: "/cta1.png", 
      link: "/shop/electronics" 
    },
    { 
      tag: "Power", 
      heading: "Charger Power Bank", 
      subtext: "Starting at ₦14000.99", 
      image: "/cta5.png", 
      link: "/shop/accessories" 
    },
    { 
      tag: "Gaming", 
      heading: "Switch Controller", 
      discount: "30% Off", 
      subtext: "Nintendo OLED Ready", 
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=1915", 
      link: "/shop/gaming" 
    },
  ]} 
/>

        <div className="mt-6 md:mt-12">
          <TopDealsSection initialDeals={registry.topSaver} />
        </div>

          <VendorCTA />

        {/* 5. DISCOVERY ENGINE */}
        <div id="discovery-feed">
          <Container className="mt-22 md:mt-12">
            <header className="mb-16 flex flex-col justify-between gap-6 border-b border-gray-100 pb-10 md:flex-row md:items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#A4143D]">
                  <Sparkles size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Inventory_Pulse</span>
                </div>
                <h2 className="text-4xl font-black italic uppercase leading-none tracking-tighter text-gray-900 md:text-6xl">
                  Explore your interests
                </h2>
              </div>
            </header>

            {paginatedDiscovery.length > 0 ? (
              <>
                <ProductGrid products={paginatedDiscovery} />
                {hasMoreItems && (
                  <div className="mt-12 md:mt-12 flex flex-col items-center gap-8 text-center">
                    <button 
                      onClick={handleRegistrySync}
                      className="group relative overflow-hidden rounded-full border-2 border-black bg-white px-20 py-6 transition-all active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                        {isSyncing ? "Syncing..." : "Load More Artifacts"}
                      </span>
                      <div className="absolute inset-0 translate-y-full bg-black transition-transform duration-300 group-hover:translate-y-0" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <DiscoveryEmptyState />
            )}
          </Container>
        </div>
      </div>

      {/* 🚀 THE FOOTER STACK: Pushed to bottom by flex-grow above */}
      <div className="mt-auto">
        <div className="mt-16 md:mt-12 w-full border-t border-slate-50 bg-white">
          <div className="max-w-7xl mx-auto">
            <TrustBar />
          </div>
        </div>
        
        <footer className="w-full bg-[#0A0A0A] text-white border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <Footer />
          </div>
          {/* Navigation Buffer for Fixed Mobile Nav - Background matches footer black */}
          <div className="h-24 lg:hidden bg-[#0A0A0A]" />
        </footer>
      </div>

    </main>
  );
}


// 🦴 SKELETON BLUEPRINT - Fixed canonical classes
function HomeSkeleton() {
  return (
    <Container className="space-y-16 py-20">
      <div className="flex gap-8 overflow-hidden">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-25 min-w-25 animate-pulse rounded-full bg-gray-50" />)}
      </div>
      <div className="h-125 animate-pulse rounded-[3rem] bg-gray-50" />
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-md bg-gray-50" />
        <SkeletonGrid count={10} />
      </div>
    </Container>
  );
}

function DiscoveryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-gray-100 py-32 text-center space-y-6">
      <PackageSearch size={64} className="text-gray-100" strokeWidth={1} />
      <div className="space-y-2">
        <p className="text-[13px] font-black uppercase tracking-[0.4em] text-gray-300">Registry_Refresh_Required</p>
        <p className="text-xs uppercase tracking-widest text-gray-400">Awaiting new marketplace listings from partners</p>
      </div>
    </div>
  );
}