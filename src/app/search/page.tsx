'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2, X, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductCard } from '@/src/components/product/ProductCard';
import { Pagination } from '@/src/components/shop/Pagination';
import { api } from '@/src/lib/axios';

// ======================================================
// CONTEXT INTERFACES
// ======================================================
interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  images?: { imageUrl: string }[];
  vendor?: { storeName: string };
  category?: { name: string };
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  // Filter and Query States
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [sortBy, setSortBy] = useState('latest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination Parameters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [matchedCount, setMatchedCount] = useState(0);
  const [found, setFound] = useState(true);

  useEffect(() => {
    setQuery(initialQuery);
    setPage(1);
  }, [initialQuery]);

  // FETCH PRODUCTS DATA STREAM
  useEffect(() => {
    if (!initialQuery) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await api.get('/products/search', {
          params: {
            q: initialQuery,
            sort: sortBy,
            page,
            minPrice: minPrice.trim() !== '' ? minPrice : undefined,
            maxPrice: maxPrice.trim() !== '' ? maxPrice : undefined,
          },
        });

        setProducts(res.data?.products || []);
        setFound(res.data?.found ?? true);
        setMatchedCount(res.data?.matchedCount || 0);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error('Search API Fetch Error: ', err);
        setError('Failed to fetch marketplace products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialQuery, sortBy, minPrice, maxPrice, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('latest');
  };

  return (
    <Container className="py-8 lg:py-16 text-zinc-900">
      
      {/* ─── EDITORIAL HEADER BLOCK ─── */}
      <div className="flex flex-col border-b border-zinc-100 pb-10 mb-12">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections, brands, premium artifacts..."
            className="w-full h-14 rounded-full border border-zinc-200 bg-zinc-50/50 pl-14 pr-6 text-sm font-medium outline-none focus:bg-white focus:border-zinc-950 transition-all duration-300 placeholder:text-zinc-400"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        </form>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 block mb-1">Search Directory</span>
            <h1 className="text-3xl font-light tracking-tight text-zinc-950">
              Results for <span className="font-normal italic">“{initialQuery}”</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-1.5 font-medium">
              {found ? `${matchedCount} premium items indexed` : 'No exact matches located'}
            </p>
          </div>

          {/* BAR TOOL FILTER TRIGGER CONTROLS */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="h-11 px-5 rounded-full border border-zinc-200 hover:border-zinc-900 bg-white flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <SlidersHorizontal size={13} />
              <span>Filter & Sort</span>
              {(minPrice || maxPrice || sortBy !== 'latest') && (
                <span className="w-2 h-2 rounded-full bg-[#A4143D]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT CATALOG ROW DISPLAY GRID ─── */}
      <main className="min-h-[50vh] flex flex-col justify-between">
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="animate-spin text-zinc-300" size={32} strokeWidth={1.5} />
              <p className="text-[10px] tracking-widest uppercase font-bold text-zinc-400">Curating Gallery...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-red-600 text-xs font-semibold max-w-xl mx-auto text-center">
              {error}
            </div>
          ) : !found && products.length > 0 ? (
            <div className="mb-10 rounded-2xl bg-amber-50/60 border border-amber-100 p-5 max-w-4xl">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">No exact index matches found</p>
              <p className="text-xs text-amber-700/90 mt-0.5">Displaying fallback alternatives matching architectural queries.</p>
            </div>
          ) : null}

          {!loading && !error && products.length === 0 && (
            <div className="border border-dashed border-zinc-200 rounded-[2rem] bg-zinc-50/30 py-24 text-center max-w-xl mx-auto px-6">
              <p className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-2">No Artifacts Located</p>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto font-light">We couldn't find matching results. Try clearing price boundaries or shifting search variables.</p>
              {(minPrice || maxPrice) && (
                <button onClick={clearFilters} className="mt-5 text-xs font-bold text-[#A4143D] underline tracking-wider uppercase">Reset Filters</button>
              )}
            </div>
          )}

          {!loading && products.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
            >
              {products.map((product) => {
                const normalizedProduct = {
                  ...product,
                  price: Number(product.price) > 0 ? Number(product.price) : 0,
                };
                return <ProductCard key={product.id} product={normalizedProduct} />;
              })}
            </motion.div>
          )}
        </div>

        {/* ─── INTERACTION FOOTER PANEL PAGINATION ─── */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 pt-8 border-t border-zinc-100 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(nextPage: number) => {
                setPage(nextPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* ─── LUXURY SLIDE-OUT FILTER COMPANION DRAWER ─── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Blurring backdrop mask layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-[150]"
            />

            {/* Content drawer track layout */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[160] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] border-l border-zinc-100 flex flex-col justify-between"
            >
              {/* Header section container */}
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Filter Parameters</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Refine your marketplace perspective</p>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main operational bodies parameters listing */}
              <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                {/* Sorting Dropdown Selection Component Block */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Sort Order</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold outline-none appearance-none focus:border-zinc-950 transition-colors"
                    >
                      <option value="latest">Latest Releases</option>
                      <option value="low-high">Price: Low to High</option>
                      <option value="high-low">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Constraints Parameters Filter Rows */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Price Ceiling Boundary (₦)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Minimum"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Maximum"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions footer processing deck buttons */}
              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  disabled={!minPrice && !maxPrice && sortBy === 'latest'}
                  className="h-12 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 disabled:opacity-40 disabled:hover:border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={12} />
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 h-12 bg-zinc-950 hover:bg-[#A4143D] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300 shadow-sm"
                >
                  Apply & Perspective Close
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}

// 🛡️ EXPORT ROUTE WRAPPED SAFELY WITHIN COMPONENT SUSPENSE
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense
        fallback={
          <Container className="py-32 flex items-center justify-center">
            <Loader2 className="animate-spin text-zinc-300" size={32} strokeWidth={1.5} />
          </Container>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}