"use client";

import { useState, useEffect, useCallback, Suspense } from "react"; // 🚀 Added Suspense
import { api } from "@/src/lib/axios";
import { ShopHeader } from "@/src/components/shop/ShopHeader";
import { CategorySidebar } from "@/src/components/shop/CategorySidebar";
import { ProductGrid } from "@/src/components/shop/ProductGrid";
import { Pagination } from "@/src/components/shop/Pagination";
import { debounce } from "lodash";
import Image from "next/image"; // 🚀 Added Image import
import { Navbar } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";

// Define an interface for the filter state to improve type safety
interface ShopFilters {
  category: string;
  search: string;
  sort: string;
  page: number;
  minPrice: string;
  maxPrice: string;
}

// 🚀 CATEGORY DATA FOR CIRCULAR ICONS
const CIRCLE_CATEGORIES = [
  { name: 'Industrial', slug: 'electronics', img: '/categories/electronics.jpg' },
  { name: 'Beauty', slug: 'beauty', img: '/categories/fashion.jpg' },
  { name: 'Textiles', slug: 'clothing', img: '/categories/funiture.jpg' },
  { name: 'Electronics', slug: 'tech', img: '/categories/electronics.jpg' },
  { name: 'Home', slug: 'home', img: '/categories/mirrors.jpg' },
  { name: 'Telecom', slug: 'vapes', img: '/categories/electronics.jpg' },
];

export default function ShopPage() {
  // 🚀 Wrap in Suspense to fix the Vercel build error
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
      console.error("Failed to fetch products", error);
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
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900">
      <Navbar />
      <ShopHeader 
        totalItems={meta.total}
        onSearch={(val: string) => setFilters(prev => ({ ...prev, search: val, page: 1 }))} 
      />

      {/* 🚀 1. CIRCULAR CATEGORY STORY BAR */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-[1750px] mx-auto px-6 py-10">
          <div className="flex gap-10 overflow-x-auto scrollbar-hide pb-4 justify-start md:justify-center">
            {CIRCLE_CATEGORIES.map((cat) => (
              <button 
                key={cat.slug}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                className="flex flex-col items-center gap-4 shrink-0 group transition-all"
              >
                <div className={`relative w-20 h-20 rounded-full p-1 border-2 transition-all duration-500 transform group-hover:scale-110 group-active:scale-95 ${
                  filters.category === cat.slug ? 'border-[#A4143D] ring-4 ring-[#A4143D]/10' : 'border-zinc-100 group-hover:border-zinc-300'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    <Image src={cat.img} alt={cat.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  filters.category === cat.slug ? 'text-[#A4143D]' : 'text-zinc-400 group-hover:text-zinc-900'
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-64 shrink-0">
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

          <section className="flex-1 space-y-10">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <p className="text-sm font-medium text-gray-400 italic">
                Browse our collection of {meta.total} items
              </p>
              
              <select 
                value={filters.sort}
                className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))
                }
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <ProductGrid 
              title={filters.category ? filters.category.toUpperCase() : "SHOP"}
              products={products} 
              loading={loading} 
            />
            
            <Pagination 
              current={meta.page} 
              total={meta.lastPage} 
              onPageChange={(p: number) => setFilters(prev => ({ ...prev, page: p }))} 
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
    
  );
}