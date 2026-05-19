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
import  { HomepageRail } from '../components/home/HomeRailSection';
import axios from 'axios';

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
    const fetchHomepageDiscoveryData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Parallelized network operations for maximum response velocity
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
          axios.get(`${API_URL}/storefront/products?sort=trending&limit=8`),
          axios.get(`${API_URL}/storefront/products?category=beauty-skincare&limit=8`),
          axios.get(`${API_URL}/storefront/products?maxPrice=10000&limit=8`),
          axios.get(`${API_URL}/storefront/products?sort=newest&limit=8`),
          axios.get(`${API_URL}/storefront/products?origin=INTERNATIONAL&limit=8`),
          axios.get(`${API_URL}/storefront/products?origin=LOCAL&maxDeliveryDays=3&limit=8`),
          axios.get(`${API_URL}/storefront/products?category=fashion&limit=8`),
          axios.get(`${API_URL}/storefront/products?category=accessories&limit=8`),
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

        {/* 3. URGENCY ZONE */}
        <div className="mt-6 md:mt-12 border-y border-zinc-100 bg-zinc-50/50 py-7">
          {flashDealsInventory.length > 0 && <FlashDeals products={flashDealsInventory} />}
        </div>

{/* 3. DENSE APP DISCOVERY ENGINE (ALL RAILS) */}
        <Container className="py-12 space-y-6">
          
          <HomepageRail 
            title="TRENDING NOW"
            subtitle="Hottest drops calculated across the network"
            products={data.trending}
            href="/discover/trending"
            loading={loading}
          />

          <HomepageRail 
            title="BEAUTY PICKS"
            subtitle="Pristine formulations & curated skincare"
            products={data.beauty}
            href="/category/beauty-skincare"
            loading={loading}
          />

          <HomepageRail 
            title="UNDER ₦10,000"
            subtitle="Elite styles at immediate price thresholds"
            products={data.under10k}
            href="/discover/under-10000"
            loading={loading}
          />

          <HomepageRail 
            title="RECENTLY ADDED"
            subtitle="Live mint condition artifacts uploaded today"
            products={data.recent}
            href="/discover/new-arrival"
            loading={loading}
          />

          <HomepageRail 
            title="IMPORTED DEALS"
            subtitle="Direct items sourced from overseas logistical nodes"
            products={data.imported}
            href="/discover/imported"
            loading={loading}
          />

          <HomepageRail 
            title="FAST LOCAL DELIVERY"
            subtitle="Dispatched locally // Arrives within 48-72 hours max"
            products={data.fastDelivery}
            href="/discover/fast-delivery"
            loading={loading}
          />

          <HomepageRail 
            title="AVIORÈ FASHION"
            subtitle="High garment cuts, statement archival denim & footwear"
            products={data.fashion}
            href="/category/fashion"
            loading={loading}
          />

          <HomepageRail 
            title="THE ACCESSORIES EDIT"
            subtitle="Hardware accents, lifestyle accessories, and leather goods"
            products={data.accessories}
            href="/category/accessories"
            loading={loading}
          />

        </Container>
        <div className="py-12">
          <PopularVendorsSection initialVendors={registry.vendors} />
        </div>

      

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
