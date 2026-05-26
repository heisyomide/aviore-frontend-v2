'use client';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
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

import { AnimatePresence, motion } from 'framer-motion';

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
  'Luxury Watches 🔥',
  'Vintage Artifacts 🔥',
  'Minimal Decor 🔥',
  'Designer Bags 🔥',
  'Silk Shirts 🔥',
  'Premium Sneakers 🔥',
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
  // LOAD RECENT SEARCHES
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
  // SAVE RECENT SEARCH
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

          const res =
            await api.get(
              `/products/search/preview?q=${query}`
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
  // CLEANED PRODUCTS
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

      {/* ================================================= */}
      {/* SEARCH INPUT */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* DROPDOWN */}
      {/* ================================================= */}

      <AnimatePresence>

        {isOpen && (

          <>

            {/* BACKDROP */}
            <div
              className="
                fixed
                inset-0
                bg-black/20
                z-40
              "
              onClick={() =>
                setIsOpen(false)
              }
            />


            {/* DESKTOP */}
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
                hidden md:block
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

                {/* ========================================= */}
                {/* EMPTY STATE */}
                {/* ========================================= */}

                {query.length < 2 && (

                  <div className="space-y-6">

                    {/* TRENDING */}
                    <SectionTitle
                      icon={
                        <TrendingUp
                          size={14}
                        />
                      }
                      title="Trending Searches"
                    />

                    <div className="flex text-zinc-900 flex-wrap gap-2">

                      {TRENDING_SEARCHES.map(
                        (item) => (
                          <TagButton
                            key={item}
                            label={item}
                            onClick={() =>
                              handleSearch(
                                item
                              )
                            }
                          />
                        )
                      )}

                    </div>


                    {/* RECENT */}
                    {recentSearches.length >
                      0 && (
                      <>
                        <SectionTitle
                          icon={
                            <Clock3
                              size={14}
                            />
                          }
                          title="Recent Searches"
                        />

                        <div className="space-y-2">

                          {recentSearches.map(
                            (
                              item
                            ) => (
                              <RecentButton
                                key={
                                  item
                                }
                                label={
                                  item
                                }
                                onClick={() =>
                                  handleSearch(
                                    item
                                  )
                                }
                              />
                            )
                          )}

                        </div>
                      </>
                    )}

                  </div>
                )}


                {/* ========================================= */}
                {/* RESULTS */}
                {/* ========================================= */}

                {query.length >= 2 && (

                  <div className="space-y-6">

                    {/* PRODUCTS */}
                    {displayProducts.length >
                      0 && (
                      <div>

                        <SectionTitle
                          title="Products"
                        />

                        <div className="space-y-2 mt-3">

                          {displayProducts.map(
                            (
                              product
                            ) => {

                              const image =
                                product
                                  ?.images?.[0]
                                  ?.imageUrl ||
                                '/placeholder.jpg';

                              return (
                                <button
                                  key={
                                    product.id
                                  }
                                  onClick={() => {
                                    router.push(
                                      `/product/${product.id}`
                                    );

                                    setIsOpen(
                                      false
                                    );
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
                                    src={
                                      image
                                    }
                                    alt={
                                      product.title
                                    }
                                    className="
                                      h-14
                                      w-14
                                      rounded-xl
                                      object-cover
                                    "
                                  />

                                  <div className="flex-1 text-left">

                                    <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                                      {
                                        product.title
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-500">
                                      ₦
                                      {Number(
                                        product.displayPrice
                                      ).toLocaleString()}
                                    </p>

                                  </div>

                                  <ArrowRight
                                    size={
                                      16
                                    }
                                    className="
                                      text-zinc-400
                                    "
                                  />

                                </button>
                              );
                            }
                          )}

                        </div>

                      </div>
                    )}


                    {/* SUGGESTIONS */}
                    {results.suggestions
                      ?.length >
                      0 && (
                      <div>

                        <SectionTitle
                          title="Suggestions"
                        />

                        <div className="flex flex-wrap gap-2 mt-3">

                          {results.suggestions.map(
                            (
                              item
                            ) => (
                              <TagButton
                                key={
                                  item
                                }
                                label={
                                  item
                                }
                                onClick={() =>
                                  handleSearch(
                                    item
                                  )
                                }
                              />
                            )
                          )}

                        </div>

                      </div>
                    )}


                    {/* VIEW ALL */}
                    <button
                      onClick={() =>
                        handleSearch()
                      }
                      className="
                        mt-2
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        rounded-2xl
                        bg-black
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        hover:opacity-90
                      "
                    >
                      View All Results
                    </button>

                  </div>
                )}

              </div>

            </motion.div>


            {/* ================================================= */}
            {/* MOBILE SHEET */}
            {/* ================================================= */}

            <motion.div
              initial={{
                y: '100%',
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: '100%',
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                fixed
                bottom-0
                left-0
                right-0
                z-50
                max-h-[80vh]
                overflow-y-auto
                rounded-t-[2rem]
                bg-white
                p-5
                shadow-2xl
                md:hidden
              "
            >

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-lg font-bold">
                  Search
                </h2>

                <button
                  onClick={() =>
                    setIsOpen(false)
                  }
                >
                  <X size={20} />
                </button>

              </div>


              {/* MOBILE PRODUCTS */}
              <div className="space-y-4">

                {displayProducts.map(
                  (product) => {

                    const image =
                      product
                        ?.images?.[0]
                        ?.imageUrl ||
                      '/placeholder.jpg';

                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          router.push(
                            `/product/${product.id}`
                          );

                          setIsOpen(
                            false
                          );
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
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

                        <div className="text-left">

                          <p className="line-clamp-1 text-sm font-medium">
                            {
                              product.title
                            }
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            ₦
                            {Number(
                              product.displayPrice
                            ).toLocaleString()}
                          </p>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </motion.div>

          </>
        )}

      </AnimatePresence>

    </div>
  );
}



// ======================================================
// SUB COMPONENTS
// ======================================================

function SectionTitle({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}

      <p
        className="
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-zinc-400
        "
      >
        {title}
      </p>
    </div>
  );
}


function TagButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-full
        bg-zinc-100
        px-4
        py-2
        text-xs
        font-medium
        transition-all
        hover:bg-black
        hover:text-white
      "
    >
      {label}
    </button>
  );
}


function RecentButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-2
        rounded-xl
        px-3
        py-2
        text-sm
        text-zinc-700
        transition-all
        hover:bg-zinc-50
      "
    >

      <Clock3
        size={14}
        className="
          text-zinc-400
        "
      />

      <span>{label}</span>

    </button>
  );
}