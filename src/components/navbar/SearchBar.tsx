'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Search,
  Loader2,
  X,
  Clock3,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { api } from '@/src/lib/axios';


// ======================================================
// TYPES
// ======================================================

interface SearchProduct {
  id: string;
  title: string;
  displayPrice: number;

  images?: {
    imageUrl?: string;
  }[];
}

interface SearchCategory {
  id: string;
  name: string;
}

interface SearchPreviewResponse {
  products: SearchProduct[];
  suggestions: string[];
  categories: SearchCategory[];
}


// ======================================================
// CONSTANTS
// ======================================================

const TRENDING_SEARCHES = [
  'Luxury Watches',
  'Vintage Artifacts',
  'Minimal Decor',
  'Designer Bags',
  'Silk Shirts',
  'Premium Sneakers',
];


// ======================================================
// COMPONENT
// ======================================================

export function SearchBar() {

  const router = useRouter();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const [query, setQuery] =
    useState('');

  const [isOpen, setIsOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState<string[]>([]);

  const [results, setResults] =
    useState<SearchPreviewResponse>({
      products: [],
      suggestions: [],
      categories: [],
    });


  // ======================================================
  // LOAD RECENTS
  // ======================================================

  useEffect(() => {

    const stored =
      localStorage.getItem(
        'recent_searches'
      );

    if (stored) {
      setRecentSearches(
        JSON.parse(stored)
      );
    }

  }, []);


  // ======================================================
  // SAVE RECENT
  // ======================================================

  const saveRecentSearch = (
    search: string
  ) => {

    const cleaned =
      search.trim();

    if (!cleaned) return;

    const updated = [
      cleaned,
      ...recentSearches.filter(
        (r) => r !== cleaned
      ),
    ].slice(0, 6);

    setRecentSearches(updated);

    localStorage.setItem(
      'recent_searches',
      JSON.stringify(updated)
    );
  };


  // ======================================================
  // SEARCH PREVIEW
  // ======================================================

  useEffect(() => {

    const delay =
      setTimeout(async () => {

        if (
          query.trim().length < 2
        ) {

          setResults({
            products: [],
            suggestions: [],
            categories: [],
          });

          return;
        }

        try {

          setLoading(true);

          // ==========================================
          // STOREFRONT SEARCH ENDPOINT
          // ==========================================

          const res =
            await api.get(
              `/products/search/preview?q=${encodeURIComponent(query)}`
            );

          setResults({
            products:
              res.data?.products || [],

            suggestions:
              res.data?.suggestions || [],

            categories:
              res.data?.categories || [],
          });

        } catch (err) {

          console.error(
            'Search preview failed',
            err
          );

          setResults({
            products: [],
            suggestions: [],
            categories: [],
          });

        } finally {

          setLoading(false);

        }

      }, 350);

    return () =>
      clearTimeout(delay);

  }, [query]);


  // ======================================================
  // CLOSE OUTSIDE
  // ======================================================

  useEffect(() => {

    const handler = (
      e: MouseEvent
    ) => {

      if (
        !containerRef.current?.contains(
          e.target as Node
        )
      ) {
        setIsOpen(false);
      }

    };

    document.addEventListener(
      'mousedown',
      handler
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handler
      );
    };

  }, []);


  // ======================================================
  // SEARCH ACTION
  // ======================================================

  const handleSearch = (
    value?: string
  ) => {

    const finalQuery =
      value || query;

    if (
      !finalQuery.trim()
    ) return;

    saveRecentSearch(finalQuery);

    setIsOpen(false);

    router.push(
      `/search?q=${encodeURIComponent(
        finalQuery
      )}`
    );
  };


  // ======================================================
  // CLEAN PRODUCTS
  // ======================================================

  const displayProducts =
    useMemo(() => {

      return (
        results.products || []
      ).slice(0, 5);

    }, [results.products]);


  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl"
    >

      {/* SEARCH INPUT */}

      <div
        className={`
          flex items-center
          h-12
          rounded-2xl
          border
          bg-white
          px-4
          transition-all
          duration-300

          ${
            isOpen
              ? 'border-black shadow-lg'
              : 'border-zinc-200'
          }
        `}
      >

        <Search
          size={18}
          className="text-zinc-400"
        />

        <input
          type="text"
          value={query}
          placeholder="Search products..."
          onFocus={() =>
            setIsOpen(true)
          }
          onChange={(e) => {

            setQuery(
              e.target.value
            );

            setIsOpen(true);

          }}
          onKeyDown={(e) => {

            if (
              e.key === 'Enter'
            ) {
              handleSearch();
            }

          }}
          className="
            flex-1
            bg-transparent
            px-3
            text-sm
            outline-none
            placeholder:text-zinc-400
          "
        />

        {loading && (
          <Loader2
            size={16}
            className="
              animate-spin
              text-zinc-400
            "
          />
        )}

        {!loading &&
          query && (
            <button
              onClick={() =>
                setQuery('')
              }
              className="
                text-zinc-400
                hover:text-black
                transition-colors
              "
            >
              <X size={16} />
            </button>
          )}
      </div>


      {/* RESULTS */}

      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              absolute
              top-full
              left-0
              right-0
              mt-3
              z-50
              overflow-hidden
              rounded-3xl
              border
              border-zinc-100
              bg-white
              shadow-2xl
            "
          >

            <div className="p-5">

              {/* TRENDING */}

              {query.length < 2 && (

                <div className="space-y-6">

                  <div>

                    <div className="flex items-center gap-2 mb-3">

                      <TrendingUp
                        size={14}
                      />

                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Trending Searches
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {TRENDING_SEARCHES.map(
                        (item) => (
                          <button
                            key={item}
                            onClick={() =>
                              handleSearch(item)
                            }
                            className="
                              rounded-full
                              bg-zinc-100
                              px-4
                              py-2
                              text-xs
                              font-medium
                              hover:bg-black
                              hover:text-white
                              transition-all
                            "
                          >
                            {item}
                          </button>
                        )
                      )}

                    </div>

                  </div>

                </div>
              )}


              {/* PRODUCTS */}

              {query.length >= 2 && (

                <div className="space-y-2">

                  {displayProducts.map(
                    (product) => {

                      const image =
                        product?.images?.[0]
                          ?.imageUrl ||
                        '/placeholder.jpg';

                      return (
                        <button
                          key={product.id}
                          onClick={() => {

                            router.push(
                              `/product/${product.id}`
                            );

                            setIsOpen(false);

                          }}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-2xl
                            p-2
                            hover:bg-zinc-50
                            transition-all
                          "
                        >

                          <img
                            src={image}
                            alt={product.title}
                            className="
                              h-14
                              w-14
                              rounded-xl
                              object-cover
                            "
                          />

                          <div className="flex-1 text-left">

                            <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                              {product.title}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              ₦
                              {Number(
                                product.displayPrice
                              ).toLocaleString()}
                            </p>

                          </div>

                          <ArrowRight
                            size={16}
                            className="text-zinc-400"
                          />

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}