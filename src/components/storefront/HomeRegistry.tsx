"use client";

import { useStorefront } from "@/src/hooks/use-storefront";
import { Loader2, Flame, Layers, Zap, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductRow } from "@/src/components/ProductRow";
import { PromoBanner } from "@/src/components/home/MultiBannerGrid";

export default function HomeRegistry() {
  const { data, loading } = useStorefront();

  if (loading) return <RegistryLoader />;

  const categorySection = data?.sections.find((s: any) => s.id === 'categories');
  const dynamicRows = data?.sections.filter((s: any) => s.id !== 'categories') || [];

  return (
    <div className="bg-[#FDFCFB] -mt-10 pb-20 w-full overflow-hidden selection:bg-[#A4143D] selection:text-white">
      
      {/* 🛠️ 1. QUICK-ACCESS HUD (Instrumentation Bar) */}
      <section className="bg-white border-b border-zinc-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-437.5 mx-auto flex items-center gap-6 py-4 px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 pr-8 border-r border-zinc-100 shrink-0">
             <div className="p-1.5 bg-[#A4143D]/5 rounded-lg">
                <Flame size={14} className="text-[#A4143D]" fill="currentColor" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 font-mono">Live_Registry</span>
          </div>

          <nav className="flex items-center gap-2">
            {categorySection?.data.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/shop?category=${cat.slug}`}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl hover:bg-zinc-50 shrink-0 transition-all group border border-transparent hover:border-zinc-100"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden relative border border-zinc-200 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src={findCategoryImg(cat.slug)} alt={cat.name} fill className="object-cover" />
                </div>
                <span className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-zinc-900 whitespace-nowrap tracking-widest transition-colors italic group-hover:not-italic">
                  {cat.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* 🏛️ 2. REGISTRY CONTENT ENGINE */}
      <div className="max-w-437.5 mx-auto px-6 py-12">
        <main className="w-full space-y-28">
          
          {/* ⚡ FIRST ROW: PRIMARY INGESTION */}
          {dynamicRows.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-3 mb-8 pl-2">
                 <Zap size={16} className="text-[#A4143D]" fill="currentColor" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">Section_Alpha_01</span>
              </div>
              <ProductRow 
                title={dynamicRows[0].title}
                products={dynamicRows[0].data}
                color="#A4143D"
                bannerTitle="HOT DEALS"
              />
            </div>
          )}

          {/* 🚀 INFOGRAPHIC GRID (Z-Pattern Banner) */}
          <div className="py-4">
            <PromoBanner type="audio" />
          </div>

          {/* ⚡ SUBSIDIARY REGISTRY ROWS */}
          <div className="space-y-28">
            {dynamicRows.slice(1).map((section: any, index: number) => {
              const themeColors = ["#E67E22", "#000000", "#2980B9", "#8E44AD"];
              const SectionIcon = index % 2 === 0 ? Layers : Globe;
              
              return (
                <div key={section.id} className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
                  <div className="flex items-center gap-3 mb-8 pl-2">
                     <SectionIcon size={16} className="text-zinc-200" />
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
                        Registry_Sequence_{ (index + 2).toString().padStart(2, '0') }
                     </span>
                  </div>
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

// 🛠️ INTERNAL LOGISTICS: Category Mapping
function findCategoryImg(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('fashion')) return "/categories/fashion.jpg";
  if (s.includes('electronic')) return "/categories/electronics.jpg";
  if (s.includes('furniture')) return "/categories/funiture.jpg";
  if (s.includes('home')) return "/categories/mirrors.jpg";
  return "/placeholder.jpg";
}

// 🛠️ HUD LOADER: System Sync State
function RegistryLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
      <div className="p-16 flex flex-col items-center justify-center gap-6 bg-white rounded-[4rem] border border-zinc-100 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="relative">
          <Loader2 className="animate-spin text-[#A4143D]" size={48} strokeWidth={3} />
          <div className="absolute inset-0 blur-xl bg-[#A4143D]/20 animate-pulse rounded-full" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 italic font-mono">Syncing_Market_Vault</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Global_Drops_Live</p>
          </div>
        </div>
      </div>
    </div>
  );
}