'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductCard } from '@/src/components/product/ProductCard';
import { Pagination } from '@/src/components/shop/Pagination';

import { api } from '@/src/lib/axios';

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  images?: {
    imageUrl: string;
  }[];
  vendor?: {
    storeName: string;
  };
  category?: {
    name: string;
  };
}

// 📦 1. INNER CONTENT COMPONENT
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
  const [mobileFilter, setMobileFilter] = useState(false);

  // Pagination & Server Response Matching States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [matchedCount, setMatchedCount] = useState(0);
  const [found, setFound] = useState(true);

  // Sync state if initialQuery changes from address line updates
  useEffect(() => {
    setQuery(initialQuery);
    setPage(1); // Reset to page 1 on a fresh query string execution
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

        // Safe extraction of parameters sent back by NestJS API
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

  // SEARCH FORM SUBMIT
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Container className="py-6 lg:py-10">
      {/* SEARCH HEADER */}
      <div className="mb-10">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-14 rounded-2xl border border-zinc-200 bg-white pl-14 pr-4 text-sm outline-none focus:border-black transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        </form>

        <div className="flex items-center justify-between mt-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Search Results</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {found ? `${matchedCount} matching products` : 'No exact match found'}
            </p>
          </div>

          <button
            onClick={() => setMobileFilter(!mobileFilter)}
            className="lg:hidden h-11 px-4 rounded-xl border border-zinc-200 flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>

      {/* LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* SIDEBAR FILTERS */}
        <aside className={`${mobileFilter ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-24 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="latest">Latest</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Price Range</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS STREAM */}
        <main className="flex flex-col justify-between h-full min-h-[50vh]">
          <div>
            {loading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-zinc-400" size={28} />
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-500 text-sm mb-6">
                {error}
              </div>
            )}

            {!loading && !found && products.length > 0 && (
              <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-900">No exact match for "{initialQuery}"</h3>
                <p className="text-sm text-amber-700 mt-1">Showing similar marketplace products.</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="rounded-3xl border border-zinc-100 bg-zinc-50 py-24 text-center">
                <h2 className="text-xl font-semibold text-zinc-800">No products found</h2>
                <p className="text-zinc-500 text-sm mt-2">Try adjusting your search criteria or price filters.</p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                {products.map((product) => {
                  // Clean-up normalization layer to force cast correct price fields and fix the ₦0 fallback bug
                  const clearDataProduct = {
                    ...product,
                    price: Number(product.price) > 0 ? Number(product.price) : 0,
                  };
                  return <ProductCard key={product.id} product={clearDataProduct} />;
                })}
              </div>
            )}
          </div>

          {/* PAGINATION PANEL FOOTER */}
          {!loading && totalPages > 1 && (
            <div className="mt-16 pt-6 border-t border-zinc-100">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(nextPage: number) => setPage(nextPage)}
              />
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}

// 🛡️ 2. EXPORT ENTRYPOINT WITH SUSPENSE BOUNDARY
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense
        fallback={
          <Container className="py-24 flex items-center justify-center">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </Container>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}