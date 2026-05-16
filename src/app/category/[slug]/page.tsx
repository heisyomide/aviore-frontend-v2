'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductGrid } from '@/src/components/product/ProductGrid';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface DBProduct {
  id: string;
  title: string;
  price: number;
  img: string;
}

interface CategoryGroupPayload {
  id: string;
  name: string;
  slug: string;
  products?: DBProduct[]; // Made optional to prevent structural crashes if undefined
}

interface ParentCategoryPayload {
  id: string;
  name: string;
  slug: string;
  banner: string;
  children: CategoryGroupPayload[];
}

export default function CategoryWorldPage({ params }: PageProps) {
  const { slug } = use(params);

  // 🎛️ Local UI States
  const [categoryData, setCategoryData] = useState<ParentCategoryPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<boolean>(false);

  // Memoize static backup metadata context for banner paths during initial server sync
  const staticFallback = useMemo(() => {
    return MARKETPLACE_CATEGORIES.find((cat) => cat.slug === slug) || MARKETPLACE_CATEGORIES[0];
  }, [slug]);

  // Memoize cross-universe discovery portals
  const discoveryJumps = useMemo(() => {
    return MARKETPLACE_CATEGORIES.filter((cat) => cat.slug !== slug);
  }, [slug]);

  // 📡 Sync Live Market Core Matrix with NestJS Framework Core
  useEffect(() => {
    async function syncParentEcosystem() {
      try {
        setIsLoading(true);
        setSyncError(false);

        // Targeted storefront routing controller endpoint 
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/storefront/category/${slug}`;
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Top-level realm synchronization linkage dropped.');

        const data: ParentCategoryPayload = await res.json();
        setCategoryData(data);
      } catch (err) {
        console.error('CRITICAL: Node landscape connection severed:', err);
        setSyncError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      syncParentEcosystem();
    }
  }, [slug]);

  // 🛑 State Handlers: Loading Canvas Spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#A4143D] border-t-transparent rounded-full animate-spin" />
        <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase animate-pulse">
          Synchronizing Realm Structures...
        </span>
      </div>
    );
  }

  // 🛑 State Handlers: Broken Data Stream Fallback
  if (syncError || !categoryData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[10px] font-black tracking-widest text-[#A4143D] uppercase mb-2">
          REALM DISCOVERY ERROR
        </span>
        <p className="text-xs font-bold text-slate-800 tracking-tight uppercase max-w-xs leading-relaxed">
          The infrastructure query for category sector /{slug} timed out or failed validation.
        </p>
        <Link 
          href="/marketplace" 
          className="mt-6 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white px-6 py-3 rounded-full hover:bg-slate-900 transition-colors"
        >
          Reset Environment Terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 select-none font-sans">
      <Navbar />

      {/* 🎬 HERO BANNER */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={staticFallback.banner}
          alt={categoryData.name}
          fill
          priority
          className="object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
          <span className="text-[9px] font-black tracking-[0.3em] text-[#A4143D] uppercase mb-1">
            EXPLORE THE REALM OF
          </span>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
            {categoryData.name}
          </h1>
        </div>
      </div>

      {/* 🚂 THE GROUP SECTIONS (e.g., Women Fashion, Men Fashion) */}
      <div className="py-8 space-y-12 px-4">
        {categoryData.children.map((group) => {
          // Flatten database models elegantly to pass down verified attributes seamlessly
          const standardizedProducts = (group.products || []).map((p) => ({
            id: p.id,
            name: p.title, // Flawlessly transforms database 'title' field to target generic 'name' structures
            price: p.price,
            img: p.img,
          }));

          // 🧼 Safe Slicing: Strips out parent prefixes (e.g., "fashion-women-fashion" -> "women-fashion")
          const cleanGroupSlug = group.slug.startsWith(`${slug}-`)
            ? group.slug.replace(`${slug}-`, '')
            : group.slug;

          return (
            <div key={group.id} className="space-y-5">
              {/* Rail Header */}
              <div className="flex justify-between items-end border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#A4143D]" />
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.15em]">
                    {group.name}
                  </h3>
                </div>
                {/* 🚀 TARGETED REDIRECTION: Formats dynamic link flawlessly with structural params */}
                <Link
                  href={`/category/${slug}/${cleanGroupSlug}`}
                  className="text-[10px] font-black text-[#A4143D] uppercase tracking-wider flex items-center gap-1 active:translate-x-1 transition-transform"
                >
                  See All <ChevronRight size={12} />
                </Link>
              </div>

              {/* ⚡ THE LIVE SYSTEM CANVAS PRODUCT GRID */}
              <div>
                <ProductGrid products={standardizedProducts} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔄 ENDLESS WORLD JUMPING */}
      <div className="mt-12 px-4 border-t border-gray-100 pt-10 bg-gradient-to-b from-gray-50/50 to-white -mb-32 pb-32">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-[#A4143D]" />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Jump to Another Universe
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {discoveryJumps.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="relative h-24 rounded-2xl overflow-hidden group border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
            >
              <Image
                src={cat.banner}
                alt={cat.name}
                fill
                className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-slate-950/80 to-transparent">
                <p className="text-[11px] font-black text-white uppercase tracking-tighter flex items-center gap-1">
                  {cat.name} <ArrowRight size={10} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}