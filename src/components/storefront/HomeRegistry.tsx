"use client";

import { useStorefront } from "@/src/hooks/use-storefront";
import { Loader2, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductRow } from "@/src/components/ProductRow";
import { MultiBannerGrid } from "@/src/components/MultiBannerGrid";

export default function HomeRegistry() {
  const { data, loading } = useStorefront();

  if (loading) return <RegistryLoader />;

  const categorySection = data?.sections.find((s: any) => s.id === 'categories');
  const dynamicRows = data?.sections.filter((s: any) => s.id !== 'categories') || [];

  return (
    <div className="bg-[#F8F9FA] -mt-10 pb-20 w-full overflow-hidden">
      
      {/* 🚀 1. TOP NAVIGATION HUD (Sticky Quick-Access) */}
      <section className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1750px] mx-auto flex items-center gap-4 py-4 px-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 pr-6 border-r border-zinc-100 shrink-0">
             <Flame size={14} className="text-red-600" fill="currentColor" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Live_Registry</span>
          </div>
          {categorySection?.data.map((cat: any) => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.slug}`}
              className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-zinc-50 shrink-0 transition-all group"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200 grayscale group-hover:grayscale-0 transition-all">
                <Image src={findCategoryImg(cat.slug)} alt={cat.name} fill className="object-cover" />
              </div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-zinc-900 whitespace-nowrap tracking-tighter">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏛️ 2. FULL-WIDTH CONTENT ENGINE */}
      <div className="max-w-[1750px] mx-auto px-6 py-10">
        <main className="w-full space-y-20">
          
          {/* 🚀 FIRST ROW: LATEST PRODUCTS */}
          {dynamicRows.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <ProductRow 
                title={dynamicRows[0].title}
                products={dynamicRows[0].data}
                color="#A4143D"
                bannerTitle="HOT DEALS"
              />
            </div>
          )}

          {/* 🚀 SECTION BREAK: MULTI-BANNER GRID (Z-Pattern) 
              This is the component we created based on your sample image.
          */}
          <div className="py-4">
            <MultiBannerGrid />
          </div>

          {/* 🚀 REMAINING DYNAMIC ROWS */}
          <div className="space-y-20">
            {dynamicRows.slice(1).map((section: any, index: number) => {
              const themeColors = ["#E67E22", "#27AE60", "#2980B9", "#8E44AD"];
              return (
                <div key={section.id} className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                  <ProductRow 
                    title={section.title}
                    products={section.data}
                    color={themeColors[index % themeColors.length]}
                    bannerTitle={index % 2 === 0 ? "BIG DEALS" : "EXCLUSIVE"}
                  />
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}

// Helper to resolve category images for the top HUD
function findCategoryImg(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('fashion')) return "/categories/fashion.jpg";
  if (s.includes('electronic')) return "/categories/electronics.jpg";
  if (s.includes('furniture')) return "/categories/funiture.jpg";
  if (s.includes('home')) return "/categories/mirrors.jpg";
  return "/placeholder.jpg";
}

function RegistryLoader() {
  return (
    <div className="py-40 flex flex-col items-center justify-center gap-4 bg-white rounded-[3rem] mx-6 border border-zinc-100 shadow-sm">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Expanding_Market_Vault</p>
        <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">Syncing_Global_Drops...</p>
      </div>
    </div>
  );
}