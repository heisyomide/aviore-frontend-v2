"use client";

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { api } from "@/src/lib/axios";
import { ShopHeader } from "@/src/components/shop/ShopHeader";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { Pagination } from "@/src/components/shop/Pagination";
import { debounce } from "lodash";
import { Navbar } from "../../components/navbar/Navbar";
import { Footer } from "@/src/components/Footer";
import { ShoppingBag, Dices } from "lucide-react";
import { motion } from "framer-motion";

interface ShopFilters {
  search: string;
  sort: string;
  page: number;
  status: string;
}

interface NormalizedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryName?: string;
  categoryId?: string;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF9]" />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });
  const [loading, setLoading] = useState(true);
  
  const topAnchorRef = useRef<HTMLDivElement>(null);

  // 🎲 FIX 1: Set the initial state of sort to "random" so it forces the backend `getDiscoveryProducts` dice roll on load/refresh
  const [filters, setFilters] = useState<ShopFilters>({
    search: "",
    sort: "random", 
    page: 1,
    status: "APPROVED" 
  });

  const fetchProducts = async (currentFilters: ShopFilters) => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== "" && v !== undefined)
      );
      
      // This maps directly to StorefrontService.getDiscoveryProducts(query) on the backend
      const { data } = await api.get("/products", { params: activeParams });
      
      const incomingProducts = data.products || data.data || [];
      
      setProducts(incomingProducts);
      setMeta(data.meta || { total: data.count || incomingProducts.length, page: currentFilters.page, lastPage: data.lastPage || 1 });
    } catch (error) {
      console.error("AVIORÈ_SHOP_FETCH_ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const prioritizedProducts = useMemo(() => {
    if (!filters.search.trim()) return products;

    const query = filters.search.toLowerCase().trim();

    const primaryMatches: NormalizedProduct[] = [];
    const secondaryMatches: NormalizedProduct[] = [];

    products.forEach((product) => {
      const title = (product.title || "").toLowerCase();
      const category = (product.category?.name || product.categoryName || product.categoryId || "").toLowerCase();

      if (title.includes(query) || category.includes(query)) {
        primaryMatches.push(product);
      } else {
        secondaryMatches.push(product);
      }
    });

    return [...primaryMatches, ...secondaryMatches];
  }, [products, filters.search]);

  const debouncedFetch = useMemo(
    () => debounce((f: ShopFilters) => fetchProducts(f), 400),
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

  const handleFilterReset = (updater: (prev: ShopFilters) => ShopFilters) => {
    setFilters(prev => updater(prev));
    
    if (topAnchorRef.current) {
      const elementPosition = topAnchorRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 140;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-zinc-900 selection:bg-[#E4A07A] selection:text-white antialiased">
      <Navbar />
      
      <div className="bg-white border-b border-zinc-200/50 sticky top-0 z-40 shadow-sm shadow-zinc-100/40">
        <ShopHeader 
          totalItems={meta.total}
          onSearch={(val: string) => handleFilterReset(prev => ({ ...prev, search: val, page: 1 }))} 
        />
      </div>

      <main ref={topAnchorRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 scroll-mt-36">
        <div className="space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/60 pb-5 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#E4A07A] uppercase block">
                {loading ? "Refreshing Catalog..." : "Curated Collection"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-zinc-900">
                {filters.search ? `Results for "${filters.search}"` : "All Products"}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-zinc-200/80 shadow-sm shrink-0">
              {filters.sort === "random" ? (
                <Dices size={14} className="text-[#E4A07A] animate-pulse" />
              ) : (
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider pl-1">Sort By</span>
              )}
              <select 
                value={filters.sort}
                className="bg-transparent text-xs font-medium text-zinc-700 outline-none pr-2 cursor-pointer hover:text-zinc-900 transition-colors"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleFilterReset(prev => ({ ...prev, sort: e.target.value, page: 1 }))
                }
              >
                {/* 🎲 FIX 2: Expose the option to select shuffle sorting manually or let it sit on default */}
                <option value="random">🎲 Explore & Shuffle</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-[#F5F0EA]/60 aspect-[4/5] rounded-2xl w-full" />
                    <div className="h-4 bg-zinc-200/60 rounded w-2/3 mx-auto" />
                    <div className="h-3 bg-zinc-200/40 rounded w-1/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : prioritizedProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white rounded-2xl border border-zinc-200/40 p-8 shadow-sm max-w-sm mx-auto"
              >
                <ShoppingBag size={28} className="mx-auto text-zinc-300 mb-3.5" />
                <h3 className="font-serif text-base font-medium text-zinc-800">No Matches Found</h3>
                <p className="text-zinc-400 text-xs mt-1.5 font-light leading-relaxed">
                  We couldn't find items matching your search. Try checking your spelling or look for different keywords.
                </p>
              </motion.div>
            ) : (
              <div>
                <ProductGrid products={prioritizedProducts} />
              </div>
            )}
          </div>
          
          {meta.lastPage > 1 && (
            <div className="pt-8 border-t border-zinc-200/60">
              <Pagination 
                current={filters.page} 
                total={meta.lastPage} 
                onPageChange={(p: number) => handleFilterReset(prev => ({ ...prev, page: p }))} 
              />
            </div>
          )}
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}