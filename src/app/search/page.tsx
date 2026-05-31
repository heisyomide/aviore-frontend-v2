'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductCard } from '@/src/components/product/ProductCard';

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

export default function SearchPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const initialQuery =
    searchParams.get('q') || '';

  const [query, setQuery] =
    useState(initialQuery);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [sortBy, setSortBy] =
    useState('latest');

  const [minPrice, setMinPrice] =
    useState('');

  const [maxPrice, setMaxPrice] =
    useState('');

  const [mobileFilter, setMobileFilter] =
    useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================

 useEffect(() => {
  if (!initialQuery) return;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Build a clean parameters object to prevent sending empty strings
      const queryParams: Record<string, string> = {
        q: initialQuery,
        sort: sortBy,
      };

      if (minPrice.trim() !== '') queryParams.minPrice = minPrice;
      if (maxPrice.trim() !== '') queryParams.maxPrice = maxPrice;

      // 2. Correct the endpoint path to plural "/products/search" to match your API layout
      const res = await api.get('/products/search', {
        params: queryParams,
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [initialQuery, sortBy, minPrice, maxPrice]);
  // =========================
  // SEARCH SUBMIT
  // =========================

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );
  };

  // =========================
  // FILTERED COUNT
  // =========================

  const resultCount = useMemo(() => {
    return products.length;
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-6 lg:py-10">

        {/* ========================= */}
        {/* SEARCH HEADER */}
        {/* ========================= */}

        <div className="mb-10">

          <form
            onSubmit={handleSearch}
            className="relative w-full"
          >
            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search products..."
              className="w-full h-14 rounded-2xl border border-zinc-200 bg-white pl-14 pr-4 text-sm outline-none focus:border-black transition-all"
            />

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
          </form>

          <div className="flex items-center justify-between mt-6">

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Search Results
              </h1>

              <p className="text-zinc-500 text-sm mt-1">
                {resultCount} products found
              </p>
            </div>

            <button
              onClick={() =>
                setMobileFilter(
                  !mobileFilter
                )
              }
              className="lg:hidden h-11 px-4 rounded-xl border border-zinc-200 flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />

              <span className="text-sm">
                Filters
              </span>
            </button>
          </div>
        </div>

        {/* ========================= */}
        {/* LAYOUT */}
        {/* ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          {/* ========================= */}
          {/* SIDEBAR */}
          {/* ========================= */}

          <aside
            className={`
              ${
                mobileFilter
                  ? 'block'
                  : 'hidden'
              }
              lg:block
            `}
          >

            <div className="sticky top-24 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 space-y-6">

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                  Sort By
                </h3>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
                >
                  <option value="latest">
                    Latest
                  </option>

                  <option value="low-high">
                    Price: Low to High
                  </option>

                  <option value="high-low">
                    Price: High to Low
                  </option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                  Price Range
                </h3>

                <div className="space-y-3">

                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                    className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value
                      )
                    }
                    className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
                  />
                </div>
              </div>

            </div>
          </aside>

          {/* ========================= */}
          {/* PRODUCTS */}
          {/* ========================= */}

          <main>

            {/* LOADING */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              products.length === 0 && (
                <div className="rounded-3xl border border-zinc-100 bg-zinc-50 py-24 text-center">
                  <h2 className="text-xl font-semibold">
                    No products found
                  </h2>

                  <p className="text-zinc-500 text-sm mt-2">
                    Try searching with a
                    different keyword.
                  </p>
                </div>
              )}

            {/* PRODUCTS GRID */}
            {!loading &&
              products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">

                  {products.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}

                </div>
              )}

          </main>
        </div>
      </Container>
    </div>
  );
}