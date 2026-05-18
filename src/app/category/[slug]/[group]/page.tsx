'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductCard } from '@/src/components/product/ProductCard'; // 🔥 Consuming your custom card item component

interface PageProps {
  params: Promise<{ slug: string; group: string }>;
}

interface DBProduct {
  id: string;
  title: string;
  slug?: string;
  price: number;
  stock?: number;
  basePrice?: number;
  totalStock?: number;
  displayPrice?: string;

  images?: {
    imageUrl: string;
  }[];

  generalImages?: string[];

  variants?: {

          stock?: number;
        price?: number;
    images?: {
      imageUrl: string;
    }[];
  }[];
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
  
  // 🎛️ Local Ecosystem States
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

  // 🛑 State Handlers: Loading Matrix
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
        <span className="text-[9px] font-black tracking-[0.25em] text-slate-400 uppercase animate-pulse">
          Synchronizing Ecosystem Records...
        </span>
      </div>
    );
  }

  // 🛑 State Handlers: Error State or Unresolved Parameters
  if (syncError || !currentGroup) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[10px] font-black tracking-widest text-red-600 uppercase mb-2">
          SYSTEM FAULT
        </span>
        <p className="text-xs font-bold text-slate-900 tracking-tight uppercase max-w-xs leading-relaxed mb-6">
          Ecosystem coordinates matching /{slug}/{group} lost or dropped by backend pipeline.
        </p>
        <Link 
          href="/marketplace" 
          className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white px-6 py-4 rounded-xl hover:bg-black transition-all shadow-lg"
        >
          Return to Terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 select-none font-sans antialiased text-slate-900">
      <Navbar />

      {/* 🌌 WORLD DEEP HERO */}
      <div className="p-6 lg:p-12 bg-slate-900 text-white relative overflow-hidden flex flex-col justify-end pt-20 border-b border-slate-800">
        <div className="absolute right-[-5%] top-[-30%] w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        
        <Link 
          href={`/category/${slug}`}
          className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase mb-4 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft size={12} /> Back to Department
        </Link>
        
        <span className="text-[8px] font-black tracking-[0.3em] text-blue-500 uppercase mb-1.5 block">
          SUBCATEGORY EXCLUSIVE MANIFEST
        </span>
        <h1 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter">
          {currentGroup.name}
        </h1>
      </div>

      {/* 💊 DYNAMIC SMART PILLS */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-4 px-4 overflow-x-auto no-scrollbar flex gap-2">
        <button
          onClick={() => setSelectedSubItem('all')}
          className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            selectedSubItem === 'all' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-slate-100 border border-slate-200/40 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          All Items
        </button>
        {currentGroup.children.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedSubItem(item.slug)}
            className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              selectedSubItem === item.slug 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-100 border border-slate-200/40 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
          }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* 🧱 THE FULL VERTICAL CANVAS WITH INTERNAL LIVE PRODUCT GRID */}
      <div className="py-8 px-4 lg:px-12 max-w-7xl mx-auto space-y-16">
        {displayedMicroCategories.map((item) => (
          <div key={item.id} className="space-y-6">
            
            {/* Dynamic Micro Section Header */}
            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-slate-900 rounded-sm" />
                <h3 className="text-xs lg:text-sm font-black text-slate-900 uppercase tracking-[0.15em]">
                  {item.name}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {item.products.length} Product Found
              </span>
            </div>

            {/* ⚡ DIRECT PRODUCT CARD INTERSECTION */}
            {item.products.length > 0 ? (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
  {item.products.map((p) => (
<ProductCard
  key={p.id}
  product={{
    ...p,

    // ✅ ALWAYS prioritize computed backend values
    price:
      Number(p.displayPrice) > 0
        ? Number(p.displayPrice)
        : p.variants?.length
          ? Math.min(
              ...p.variants.map((v) => Number(v.price) || 0)
            )
          : Number(p.price || 0),

    stock:
      Number(p.totalStock) > 0
        ? Number(p.totalStock)
        : p.variants?.reduce(
            (acc, variant) => acc + (Number(variant.stock) || 0),
            0
          ) || Number(p.stock || 0),

    // ✅ Preserve proper image behavior
    images:
      p.images?.length
        ? p.images
        : p.variants?.[0]?.images || [],

    // ✅ Safety fallback
    title: p.title || 'Untitled Product',
  }}
/>
  ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  No Active Inventory In Matrix Section
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔄 ENDLESS EXPLORATION EXIT GATEWAY */}
      <div className="mt-24 px-6 bg-slate-950 text-white py-16 -mb-32 pb-32 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-blue-500" />
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em]">
              OUT OF BOUNDS DISCOVERY
            </p>
          </div>
          <h3 className="text-xl lg:text-2xl font-black uppercase italic tracking-tighter mb-8">
            Shift To Another World
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jumpWorlds.map((world) => (
              <Link
                key={world.slug}
                href={`/category/${world.slug}`}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-white/10 shadow-inner shrink-0">
                    <Image src={world.banner} alt={world.name} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">
                    {world.name} Collection
                  </span>
                </div>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}