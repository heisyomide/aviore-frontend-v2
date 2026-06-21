"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { api } from "@/src/lib/axios";
import { ShopHeader } from "@/src/components/shop/ShopHeader";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { Pagination } from "@/src/components/shop/Pagination";
import { debounce } from "lodash";
import { Navbar } from "../../components/navbar/Navbar";
import { Footer } from "@/src/components/Footer";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface ShopFilters {
  search: string;
  sort: string;
  page: number;
  status: string;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9]" />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<ShopFilters>({
    search: "",
    sort: "newest",
    page: 1,
    status: "APPROVED" // Keeps your marketplace pristine by only serving approved inventory
  });

  const fetchProducts = async (currentFilters: ShopFilters) => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== "" && v !== undefined)
      );
      const { data } = await api.get("/products", { params: activeParams });
      setProducts(data.data || []);
      setMeta(data.meta || { total: 0, page: 1, lastPage: 1 });
    } catch (error) {
      console.error("AVIORÈ_SHOP_FETCH_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((f: ShopFilters) => fetchProducts(f), 400),
    []
  );

  useEffect(() => {
    if (filters.search) {
      debouncedFetch(filters);
    } else {
      fetchProducts(filters);
    }
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-zinc-900 selection:bg-[#E4A07A] selection:text-white antialiased">
      <Navbar />
      
      {/* GLOBAL SEARCH / HEADER STICKY ANCHOR */}
      <div className="bg-white border-b border-zinc-200/50 sticky top-0 z-40 shadow-sm shadow-zinc-100/40">
        <ShopHeader 
          totalItems={meta.total}
          onSearch={(val: string) => setFilters(prev => ({ ...prev, search: val, page: 1 }))} 
        />
      </div>

      {/* MAIN PRODUCTS SHOWCASE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="space-y-10">
          
          {/* HEADER ORDER MANAGEMENT CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/60 pb-5 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#E4A07A] uppercase block">
                {loading ? "Refreshing Catalog..." : "Curated Collection"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-zinc-900">
                All Products
              </h2>
            </div>
            
            {/* MINIMAL SORT SELECTION DROPDOWN */}
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-zinc-200/80 shadow-sm shrink-0 alignment-right">
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider pl-1">Sort By</span>
              <select 
                value={filters.sort}
                className="bg-transparent text-xs font-medium text-zinc-700 outline-none pr-2 cursor-pointer hover:text-zinc-900 transition-colors"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))
                }
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC PRODUCT INVENTORY GRID CONTAINER */}
          <div className="relative min-h-[400px]">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-[#F5F0EA]/60 aspect-[4/5] rounded-2xl w-full" />
                    <div className="h-4 bg-zinc-200/60 rounded w-2/3 mx-auto" />
                    <div className="h-3 bg-zinc-200/40 rounded w-1/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white rounded-2xl border border-zinc-200/40 p-8 shadow-sm max-w-sm mx-auto"
              >
                <ShoppingBag size={28} className="mx-auto text-zinc-300 mb-3.5" />
                <h3 className="font-serif text-base font-medium text-zinc-800">Boutique Empty</h3>
                <p className="text-zinc-400 text-xs mt-1.5 font-light leading-relaxed">
                  No verified products are currently active on the catalog. Check back shortly.
                </p>
              </motion.div>
            ) : (
              <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <ProductGrid products={products} />
              </div>
            )}
          </div>
          
          {/* CATALOG PAGINATION */}
          {meta.lastPage > 1 && (
            <div className="pt-8 border-t border-zinc-200/60">
              <Pagination 
                current={meta.page} 
                total={meta.lastPage} 
                onPageChange={(p: number) => setFilters(prev => ({ ...prev, page: p }))} 
              />
            </div>
          )}
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}