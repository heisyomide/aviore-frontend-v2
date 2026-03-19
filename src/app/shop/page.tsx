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
  { name: 'Textiles', slug: 'textiles', img: '/categories/textiles.jpg' },
  { name: 'Electronics', slug: 'electronics', img: '/categories/electronics.jpg' },
  { name: 'Home', slug: 'home', img: '/categories/home.jpg' },
  { name: 'Telecom', slug: 'telecom', img: '/categories/telecom.jpg' },
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

      <section className="bg-white border-b border-zinc-50 overflow-hidden">
        {/* 🚀 FIXED: Used canonical class max-w-437.5 as per linter suggestion */}
        <div className="max-w-437.5 mx-auto px-6 py-12">
          <div className="flex gap-12 overflow-x-auto no-scrollbar pb-4 justify-start md:justify-center">
            {CIRCLE_CATEGORIES.map((cat) => (
              <button 
                key={cat.slug}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                className="flex flex-col items-center gap-5 shrink-0 group transition-all"
              >
                <div className={`relative w-24 h-24 rounded-full p-1.5 border transition-all duration-700 ${
                  filters.category === cat.slug 
                    ? 'border-[#A4143D] bg-[#A4143D]/5 scale-110 shadow-xl shadow-[#A4143D]/10' 
                    : 'border-zinc-100 group-hover:border-zinc-400 group-active:scale-95'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image 
                        src={cat.img} 
                        alt={cat.name} 
                        fill 
                        className={`object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 ${
                            filters.category === cat.slug ? 'grayscale-0 scale-110' : ''
                        }`} 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all ${
                  filters.category === cat.slug ? 'text-[#A4143D] italic' : 'text-zinc-400 group-hover:text-zinc-900'
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
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
      
      <Footer />
    </div>
  );
}