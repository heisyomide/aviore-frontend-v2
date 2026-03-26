"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { api } from "@/src/lib/axios";
import { ShopHeader } from "@/src/components/shop/ShopHeader";
import { CategorySidebar } from "@/src/components/shop/CategorySidebar";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { Pagination } from "@/src/components/shop/Pagination";
import { debounce } from "lodash";
import Image from "next/image";
import { Navbar } from "../../components/navbar/Navbar";
import { Footer } from "@/src/components/Footer";
import { Layers, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface ShopFilters {
  category: string;
  search: string;
  sort: string;
  page: number;
  minPrice: string;
  maxPrice: string;
}

const CIRCLE_CATEGORIES = [
  { name: 'Industrial', slug: 'industrial', img: '/categories/industrial.jpg' },
  { name: 'Beauty', slug: 'beauty', img: '/categories/beauty.jpg' },
  { name: 'Automobile', slug: 'automobile', img: '/categories/automobile.jpg' },
  { name: 'Electronics', slug: 'electronics', img: '/categories/electro.jpg' },
  { name: 'Home', slug: 'home', img: '/categories/home.jpg' },
  { name: 'Clearance-Deals', slug: 'Clearance-Deals-Flash-Sales', img: '/categories/flashsales.jpg' },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<ShopFilters>({
    category: "",
    search: "",
    sort: "newest",
    page: 1,
    minPrice: "",
    maxPrice: ""
  });

  const fetchRegistry = async (currentFilters: ShopFilters) => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== "" && v !== undefined)
      );
      const { data } = await api.get("/products", { params: activeParams });
      setProducts(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("REGISTRY_SYNC_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((f: ShopFilters) => fetchRegistry(f), 500),
    []
  );

  useEffect(() => {
    if (filters.search || filters.minPrice || filters.maxPrice) {
      debouncedFetch(filters);
    } else {
      fetchRegistry(filters);
    }
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 selection:bg-[#A4143D] selection:text-white">
     
      
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40">
         <ShopHeader 
            totalItems={meta.total}
            onSearch={(val: string) => setFilters(prev => ({ ...prev, search: val, page: 1 }))} 
         />
      </div>


<section className="bg-white border-b border-zinc-100 overflow-hidden select-none">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* 🚀 THE KINETIC TILE TRACK */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 justify-start md:justify-center items-center">
          {CIRCLE_CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.slug;

            return (
              <button 
                key={cat.slug}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                className="relative shrink-0 group focus:outline-none"
              >
                {/* 🛠️ THE CATEGORY CARD */}
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-28 h-36 md:w-32 md:h-44 rounded-2xl overflow-hidden transition-all duration-500 border ${
                    isActive 
                      ? 'border-[#A4143D] ring-4 ring-[#A4143D]/5 shadow-2xl' 
                      : 'border-zinc-100 group-hover:border-zinc-300'
                  }`}
                >
                  {/* Image Layer with Zoom */}
                  <Image 
                    src={cat.img} 
                    alt={cat.name} 
                    fill 
                    className={`object-cover transition-all duration-[1.5s] ${
                      isActive ? 'scale-110 brightness-75' : 'brightness-90 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110'
                    }`} 
                  />

                  {/* Dark Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* 🏷️ THE LABEL (Inside the Tile) */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-end items-start">
                    <span className={`text-[10px] md:text-[11px] font-[1000] uppercase tracking-tighter leading-none transition-all duration-300 ${
                      isActive ? 'text-white italic scale-110' : 'text-zinc-200'
                    }`}>
                      {cat.name}
                    </span>
                    
                    {/* Active Indicator Line (Inside) */}
                    <motion.div 
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      className="h-[2px] bg-[#A4143D] mt-1.5"
                    />
                  </div>

                  {/* ⚡ ACTIVE "LIVE" GLOW */}
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-2 h-2 bg-[#A4143D] rounded-full shadow-[0_0_10px_#A4143D] animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Subtle outer shadow that only appears when active */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-[#A4143D]/10 blur-xl -z-10 rounded-2xl"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>


      {/* 🚀 FIXED: Used canonical class max-w-375 as per linter suggestion */}
      <main className="max-w-375 mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="w-full lg:w-72 shrink-0 space-y-10">
            <div className="flex items-center gap-2 text-[#A4143D] mb-4">
               <Filter size={14} />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Filter_Control</span>
            </div>
            <CategorySidebar 
              activeCategory={filters.category}
              onSelect={(cat: string) => setFilters(prev => ({ ...prev, category: cat, page: 1 }))}
              onPriceChange={(min: string | undefined, max: string | undefined) => {
                setFilters(prev => ({ 
                  ...prev, 
                  ...(min !== undefined && { minPrice: min }),
                  ...(max !== undefined && { maxPrice: max }),
                  page: 1 
                }));
              }}
            />
          </aside>

          <section className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 pb-8 gap-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-zinc-300">
                    <Layers size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Inventory_Output</span>
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
                    {filters.category ? filters.category : "Collections"}
                 </h2>
                 <p className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                    SYNC_STATUS: <span className={loading ? "text-amber-500 animate-pulse" : "text-emerald-500"}>
                        {loading ? "SYNCING..." : "LIVE"}
                    </span> // {meta.total.toString().padStart(5, '0')} ARTIFACTS_FOUND
                 </p>
              </div>
              
              <div className="flex items-center gap-4 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-2">Sort_Order</span>
                  <select 
                    value={filters.sort}
                    className="bg-white border-zinc-200 text-[10px] font-black uppercase tracking-widest outline-none px-4 py-2 rounded-lg cursor-pointer hover:border-[#A4143D]/30 transition-all"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))
                    }
                  >
                    <option value="newest">System_Newest</option>
                    <option value="price_asc">Price_Ascending</option>
                    <option value="price_desc">Price_Descending</option>
                  </select>
              </div>
            </div>

            {/* 🚀 FIXED: Removed 'loading' prop to resolve TypeScript error TS2322 */}
            <ProductGrid products={products} />
            
            <div className="pt-12 border-t border-zinc-100">
                <Pagination 
                  current={meta.page} 
                  total={meta.lastPage} 
                  onPageChange={(p: number) => setFilters(prev => ({ ...prev, page: p }))} 
                />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}