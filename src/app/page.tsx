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
import { HOME_CATEGORIES } from '../data/categories';
import { TopDealsSection } from '../components/home/TopSaverDeals';
import { MultiBannerGrid } from '../components/home/MultiBannerGrid';
import { PopularVendorsSection } from '../components/home/PopularVendors';
import { api } from '@/src/lib/axios';
import { ChevronRight, Sparkles, Zap, Loader2, PackageSearch } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Navbar } from '../components/navbar/Navbar';

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
    <main className="bg-white min-h-screen pb-24 selection:bg-[#A4143D] selection:text-white">
       <Navbar />
      <Hero />

{/* 1. QUICK-ACCESS REGISTRY NAV */}
<Section className="bg-white border-b border-gray-50 py-8">
  <Container>
<div className="flex items-start gap-6 overflow-x-auto pb-4 md:gap-10 md:pb-2 no-scrollbar">
  
{/* Dynamic Marketplace Categories */}
{HOME_CATEGORIES.map((cat) => (
  <CategoryCircle 
    key={cat.id}
    name={cat.name}
    /** * 🚀 THE FIX: We use cat.image directly. 
     * No more clashing with the Mega Menu product photos. 
     */
    image={cat.image || '/placeholder.png'}
    slug={cat.id.toLowerCase()} 
  />
))}

      {/* Static "Specialty" Collections */}
      <div className="flex gap-6 border-l border-gray-100 pl-6 md:gap-10 md:pl-10">
        <CategoryCircle 
          name="Best Sellers" 
          image="/registry/categories/bestsellers.jpg" 
          slug="best-sellers" 
        />
        <CategoryCircle 
          name="Flash Deals" 
          image="/registry/categories/flash.jpg" 
          slug="flash-deals" 
        />
        <CategoryCircle 
          name="New Arrivals" 
          image="/registry/categories/newarrival.jpg" 
          slug="new-arrivals" 
        />
      </div>
    </div>
  </Container>
</Section>

      {/* 2. DYNAMIC DEPARTMENTS */}
      <div className="flex flex-col">
        {registry.departments.map((section: any) => (
          section.data?.length > 0 && (
            <CategoryExplorer 
              key={section.id}
              categoryName={section.title} 
              categorySlug={section.slug}
              products={section.data}
            />
          )
        ))}
      </div>

      {/* 3. URGENCY ZONE */}
      <div className="mt-12 border-y border-zinc-100 bg-zinc-50/50 py-16">
        {flashDealsInventory.length > 0 && <FlashDeals products={flashDealsInventory} />}
        {registry.topSaver.length > 0 && (
          <div className="mt-12">
            <TopDealsSection initialDeals={registry.topSaver} />
          </div>
        )}
      </div>

      {/* 4. VISUAL BREAKS */}
      <div className="py-12">
        <MultiBannerGrid />
        <PopularVendorsSection initialVendors={registry.vendors} />
      </div>

      {/* 🚀 5. DISCOVERY ENGINE - Fixed 'id' error by moving it to a wrapper div */}
      <div id="discovery-feed">
        <Container className="mt-32">
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
                <div className="mt-24 flex flex-col items-center gap-8 text-center">
                  <button 
                    onClick={handleRegistrySync}
                    disabled={isSyncing}
                    className="group relative overflow-hidden rounded-full border-2 border-black bg-white px-20 py-6 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-colors group-hover:text-white">
                      {isSyncing ? <>Syncing <Loader2 size={16} className="animate-spin" /></> : "Load More Artifacts"}
                    </span>
                    {!isSyncing && (
                      <div className="absolute inset-0 translate-y-full bg-black transition-transform duration-300 group-hover:translate-y-0" />
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <DiscoveryEmptyState />
          )}
        </Container>
      </div>

      <div className="mt-32">
        <TrustBar />
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