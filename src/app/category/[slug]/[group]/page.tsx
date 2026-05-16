'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductGrid } from '@/src/components/product/ProductGrid';

interface PageProps {
  params: Promise<{ slug: string; group: string }>;
}

interface DBProduct {
  id: string;
  title: string;
  price: number;
  img: string;
}

interface MicroCategoryItem {
  id: string;
  name: string;
  slug: string;
  products: DBProduct[];
}

interface SubcategoryGroupPayload {
  id: string;
  name: string;
  slug: string;
  children: MicroCategoryItem[];
}

export default function SubcategoryWorldPage({ params }: PageProps) {
  const { slug, group } = use(params);
  
  // 🎛️ Local UI States
  const [currentGroup, setCurrentGroup] = useState<SubcategoryGroupPayload | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<boolean>(false);

  // Memoize outbound discovery portals
  const jumpWorlds = useMemo(() => MARKETPLACE_CATEGORIES.filter((cat) => cat.slug !== slug), [slug]);

  // 📡 Sync Live Market Matrix with NestJS Framework Core
  useEffect(() => {
    async function syncEcosystemPayload() {
      try {
        setIsLoading(true);
        setSyncError(false);
        
        // Cleaned endpoint construction to prevent double prefix barriers
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/storefront/category/${slug}/${group}`;
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Ecosystem payload linkage rejected.');
        
        const data: SubcategoryGroupPayload = await res.json();
        setCurrentGroup(data);
      } catch (err) {
        console.error('CRITICAL: Node infrastructure down-link dropped:', err);
        setSyncError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug && group) {
      syncEcosystemPayload();
    }
  }, [slug, group]);

  // 💊 Dynamic Filtering Matrix based on Active Pill selection state
  const displayedMicroCategories = useMemo(() => {
    if (!currentGroup) return [];
    if (selectedSubItem === 'all') return currentGroup.children;
    return currentGroup.children.filter((item) => item.slug === selectedSubItem);
  }, [selectedSubItem, currentGroup]);

  // 🛑 State Handlers: Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#A4143D] border-t-transparent rounded-full animate-spin" />
        <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase animate-pulse">
          Synchronizing Ecosystem Records...
        </span>
      </div>
    );
  }

  // 🛑 State Handlers: Error State or Unresolved Parameters
  if (syncError || !currentGroup) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[10px] font-black tracking-widest text-[#A4143D] uppercase mb-2">
          SYSTEM FAULT
        </span>
        <p className="text-xs font-bold text-slate-800 tracking-tight uppercase max-w-xs leading-relaxed">
          Ecosystem coordinates matching /{slug}/{group} lost or dropped by backend pipeline.
        </p>
        <Link 
          href="/marketplace" 
          className="mt-6 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white px-6 py-3 rounded-full hover:bg-slate-900 transition-colors"
        >
          Return to Terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 select-none font-sans">
      <Navbar />

      {/* 🌌 WORLD DEEP HERO */}
      <div className="p-6 bg-slate-950 text-white relative overflow-hidden flex flex-col justify-end pt-14">
        <div className="absolute right-[-10%] top-[-20%] w-44 h-44 bg-[#A4143D]/20 rounded-full blur-3xl" />
        <span className="text-[8px] font-black tracking-[0.25em] text-[#A4143D] uppercase mb-1">
          SUBCATEGORY EXCLUSIVE MANIFEST
        </span>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          {currentGroup.name}
        </h1>
      </div>

      {/* 💊 DYNAMIC SMART PILLS */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 px-4 overflow-x-auto no-scrollbar flex gap-2">
        <button
          onClick={() => setSelectedSubItem('all')}
          className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            selectedSubItem === 'all' 
              ? 'bg-[#A4143D] text-white shadow-lg shadow-[#A4143D]/20' 
              : 'bg-gray-50 border border-gray-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          All Items
        </button>
        {currentGroup.children.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedSubItem(item.slug)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              selectedSubItem === item.slug 
                ? 'bg-[#A4143D] text-white shadow-lg shadow-[#A4143D]/20' 
                : 'bg-gray-50 border border-gray-100 text-slate-500 hover:text-slate-900'
          }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* 🧱 THE FULL VERTICAL CANVAS WITH INTERNAL LIVE PRODUCT GRID */}
      <div className="py-6 px-4 space-y-12">
        {displayedMicroCategories.map((item) => {
          // Transform internal DB product keys safely to fit standard layout properties expected by generic client grids
          const standardizedProducts = item.products.map((p) => ({
            id: p.id,
            name: p.title, // Maps backend schema target property 'title' flawlessly to generic 'name' property
            price: p.price,
            img: p.img,
          }));

          return (
            <div key={item.id} className="space-y-5">
              {/* Dynamic Micro Section Header */}
              <div className="flex items-center gap-2.5 border-b border-gray-50 pb-3">
                <span className="w-2 h-2 rounded-full bg-[#A4143D]" />
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.15em]">
                  {item.name}
                </h3>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight ml-auto">
                  ({standardizedProducts.length} Items Available)
                </span>
              </div>

              {/* ⚡ THE SYSTEM CANVAS LIVE GRID */}
              <div>
                <ProductGrid products={standardizedProducts} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔄 ENDLESS EXPLORATION EXIT GATEWAY */}
      <div className="mt-16 px-4 bg-slate-950 text-white py-14 -mb-32 pb-32">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="text-[#A4143D]" />
          <p className="text-[8px] font-black text-[#A4143D] uppercase tracking-[0.3em]">
            OUT OF BOUNDS DISCOVERY
          </p>
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">
          Shift To Another World
        </h3>

        <div className="flex flex-col gap-3">
          {jumpWorlds.map((world) => (
            <Link
              key={world.slug}
              href={`/category/${world.slug}`}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 p-4.5 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
                  <Image src={world.banner} alt={world.name} fill className="object-cover" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">
                  {world.name} Collection
                </span>
              </div>
              <ArrowUpRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}