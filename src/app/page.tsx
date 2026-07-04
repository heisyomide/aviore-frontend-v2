'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Hero } from '../components/home/Hero';
import { FlashDeals } from '../components/home/FlashDeals';
import { ProductGrid } from '../components/product/ProductGrid';
import { SkeletonGrid } from '../components/product/SkeletonGrid';
import { TrustBar } from '../components/home/TrustBar';
import { TopDealsSection } from '../components/home/TopSaverDeals';
import { PopularVendorsSection } from '../components/home/PopularVendors';
import { api } from '@/src/lib/axios';
import { Sparkles, Loader2, PackageSearch } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/Footer';

import { VendorCTA } from '../components/home/VendorCTA';
import { HomepageRail } from '../components/home/HomeRailSection';
import axios from 'axios';
import CategoryGrid from '../components/storefront/CategoryGrid';

export default function HomePage() {
  const [data, setData] = useState({
    trending: [],
    beauty: [],
    under10k: [],
    recent: [],
    imported: [],
    fastDelivery: [],
    fashion: [],
    accessories: [],
  });
  const [loading, setLoading] = useState(true);

  // 🔄 INFINITE SCROLL STATE ARCHITECTURE
  const [visibleCount, setVisibleCount] = useState(16); 
  const itemsPerLoad = 16;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
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
    const fetchHomepageDiscoveryData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const [
          trendingRes, 
          beautyRes, 
          under10kRes, 
          recentRes, 
          importedRes, 
          fastRes, 
          fashionRes, 
          accessoriesRes
        ] = await Promise.all([
          axios.get(`${API_URL}/storefront/products?sort=trending&limit=10`),
          axios.get(`${API_URL}/storefront/products?category=beauty-skincare&limit=10`),
          axios.get(`${API_URL}/storefront/products?maxPrice=10000&limit=10`),
          axios.get(`${API_URL}/storefront/products?sort=newest&limit=10`),
          axios.get(`${API_URL}/storefront/products?origin=INTERNATIONAL&limit=10`),
          axios.get(`${API_URL}/storefront/products?origin=LOCAL&maxDeliveryDays=3&limit=10`),
          axios.get(`${API_URL}/storefront/products?category=fashion&limit=10`),
          axios.get(`${API_URL}/storefront/products?category=accessories&limit=10`),
        ]);

        setData({
          trending: trendingRes.data?.products || trendingRes.data || [],
          beauty: beautyRes.data?.products || beautyRes.data || [],
          under10k: under10kRes.data?.products || under10kRes.data || [],
          recent: recentRes.data?.products || recentRes.data || [],
          imported: importedRes.data?.products || importedRes.data || [],
          fastDelivery: fastRes.data?.products || fastRes.data || [],
          fashion: fashionRes.data?.products || fashionRes.data || [],
          accessories: accessoriesRes.data?.products || accessoriesRes.data || [],
        });
      } catch (err) {
        console.error("Discovery_Engine_Crash_Sync", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageDiscoveryData();
  }, []);

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

  const flashDealsInventory = useMemo(() => registry.feed.slice(0, 6), [registry.feed]);
  
  const availableDiscoveryPool = useMemo(() => {
    const skipCount = registry.feed.length > 10 ? 6 : 0;
    return registry.feed.slice(skipCount);
  }, [registry.feed]);

  /**
   * 🛠️ ACCUMULATIVE DISCOVERY SLICE
   * Pulls structural cuts out of our memoized array based on user's intersection depth
   */
  const paginatedDiscovery = useMemo(() => {
    return availableDiscoveryPool.slice(0, visibleCount);
  }, [availableDiscoveryPool, visibleCount]);

  const hasMore = useMemo(() => {
    return visibleCount < availableDiscoveryPool.length;
  }, [visibleCount, availableDiscoveryPool.length]);

  // 👀 INTERSECTION OBSERVER ROOT ENGINE
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // User scrolled to bottom! Increment view threshold smoothly
          setVisibleCount((prev) => prev + itemsPerLoad);
        }
      },
      { rootMargin: '200px' } // Pre-load products 200px before reaching screen viewport boundary
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading]);

  if (loading) return <HomeSkeleton />;

  return (
    <main className="bg-white min-h-screen flex flex-col selection:bg-[#A4143D] selection:text-white">
      <Navbar />
      
      <div className="grow">
        <Hero />
        <CategoryGrid />

        {/* URGENCY ZONE */}
        <div className="mt-6 md:mt-12 border-y border-zinc-100 bg-zinc-50/50 py-7">
          {flashDealsInventory.length > 0 && <FlashDeals products={flashDealsInventory} />}
        </div>

        {/* DENSE APP DISCOVERY ENGINE (ALL RAILS) */}
        <Container className="py-12 space-y-6">
          <HomepageRail title="TRENDING NOW" subtitle="Hottest drops calculated across the network" products={data.trending} href="/discover/trending" loading={loading} />
          <HomepageRail title="BEAUTY PICKS" subtitle="Pristine formulations & curated skincare" products={data.beauty} href="/category/beauty-skincare" loading={loading} />
          <HomepageRail title="UNDER ₦10,000" subtitle="Elite styles at immediate price thresholds" products={data.under10k} href="/discover/under-10000" loading={loading} />
          <HomepageRail title="RECENTLY ADDED" subtitle="Live mint condition artifacts uploaded today" products={data.recent} href="/discover/new-arrival" loading={loading} />
          <HomepageRail title="IMPORTED DEALS" subtitle="Direct items sourced from overseas logistical nodes" products={data.imported} href="/discover/imported" loading={loading} />
          <HomepageRail title="FAST LOCAL DELIVERY" subtitle="Dispatched locally // Arrives within 48-72 hours max" products={data.fastDelivery} href="/discover/fast-delivery" loading={loading} />
          <HomepageRail title="AVIORÈ FASHION" subtitle="High garment cuts, statement archival denim & footwear" products={data.fashion} href="/category/fashion" loading={loading} />
          <HomepageRail title="THE ACCESSORIES EDIT" subtitle="Hardware accents, lifestyle accessories, and leather goods" products={data.accessories} href="/category/accessories" loading={loading} />
        </Container>

        <div className="py-12">
          <PopularVendorsSection initialVendors={registry.vendors} />
        </div>

        <div className="mt-6 md:mt-12">
          <TopDealsSection initialDeals={registry.topSaver} />
        </div>

        <VendorCTA />

        {/* DISCOVERY CORE HOOK CONTAINER ANCHOR AREA */}
        <div id="discovery-feed" className="scroll-mt-24">
          <Container className="mt-22 md:mt-12 mb-20">
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
                
                {/* 🎯 Infinite Scroll Pull Anchor */}
                {hasMore && (
                  <div ref={loadMoreRef} className="mt-16 flex justify-center py-8">
                    <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/60 px-5 py-2.5 rounded-full shadow-sm text-zinc-500">
                      <Loader2 size={16} className="animate-spin text-[#A4143D]" />
                      <span className="text-xs font-mono font-medium tracking-wider uppercase">Loading matching inventory...</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <DiscoveryEmptyState />
            )}
          </Container>
        </div>
      </div>

      {/* FOOTER STACK */}
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
          <div className="h-24 lg:hidden bg-[#0A0A0A]" />
        </footer>
      </div>
    </main>
  );
}

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