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
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/src/lib/axios';

// ======================================================
// TYPES & INTERFACES
// ======================================================

interface SearchProduct {
  id: string;
  title: string;
  imageUrl: string | null; // ⚡ Aligned with NestJS flat field mapper
  displayPrice: number;
  category: string;
  vendor: string;
}

interface SearchCategory {
  id: string;
  name: string;
}

interface SearchVendor {
  id: string;
  storeName: string;
  imageUrl: string | null;
}

interface SearchPreviewResponse {
  products: SearchProduct[];
  suggestions: string[];
  categories: SearchCategory[];
  vendors?: SearchVendor[];
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

const LOCAL_STORAGE_KEY = 'aviore_recent_searches';
const DEBOUNCE_DELAY_MS = 350;

// ======================================================
// MAIN COMPONENT
// ======================================================

export function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const [results, setResults] = useState<SearchPreviewResponse>({
    products: [],
    suggestions: [],
    categories: [],
    vendors: [],
  });

  // 1. Sync & Hydrate Recent Searches from LocalStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse recent searches cache:', err);
    }
  }, []);

  // 2. Commit a unique query string cleanly to LocalStorage
  const saveRecentSearch = (search: string) => {
    const cleaned = search.trim();
    if (!cleaned) return;

    const updated = [
      cleaned,
      ...recentSearches.filter((r) => r !== cleaned),
    ].slice(0, 6);

    setRecentSearches(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update recent searches cache:', err);
    }
  };

  // 3. Debounced API Search Preview Execution Pipe
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], suggestions: [], categories: [], vendors: [] });
      return;
    }

    const delayHandler = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get<SearchPreviewResponse>(
          `/products/search/preview?q=${encodeURIComponent(query)}`
        );

        if (res.data) {
          setResults({
            products: res.data.products || [],
            suggestions: res.data.suggestions || [],
            categories: res.data.categories || [],
            vendors: res.data.vendors || [],
          });
        }
      } catch (err) {
        console.error('[AVIORÈ SEARCH ERROR]: Preview pipeline failed:', err);
        setResults({ products: [], suggestions: [], categories: [], vendors: [] });
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(delayHandler);
  }, [query]);

  // 4. Close Dropdown instantly on outside click interactions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 5. Fire full router redirection routing parameters
  const handleSearchSubmit = (targetValue?: string) => {
    const finalQuery = (targetValue ?? query).trim();
    if (!finalQuery) return;

    saveRecentSearch(finalQuery);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  // 6. Enforce hard-max slice limit of elements for cleaner view layouts
  const displayProducts = useMemo(() => {
    return (results.products || []).slice(0, 5);
  }, [results.products]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl text-zinc-900">
      
      {/* --- INPUT WRAPPER MTRX --- */}
      <div
        className={`
          flex items-center h-12 rounded-2xl border bg-white px-4 
          transition-all duration-300 ease-out
          ${isOpen ? 'border-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.08)]' : 'border-zinc-200'}
        `}
      >
        <Search size={18} className="text-zinc-400 shrink-0" />

        <input
          type="text"
          value={query}
          placeholder="Search products, brands, luxury items..."
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit();
          }}
          className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-400"
        />

        {loading ? (
          <Loader2 size={16} className="animate-spin text-zinc-400 shrink-0" />
        ) : (
          query && (
            <button
              onClick={() => {
                setQuery('');
                setResults({ products: [], suggestions: [], categories: [], vendors: [] });
              }}
              className="text-zinc-400 hover:text-zinc-900 transition-colors p-0.5"
              aria-label="Clear query input content field"
            >
              <X size={16} />
            </button>
          )
        )}
      </div>

      {/* --- RESULTS PANEL DROPDOWN LAYER --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {/* STATE A: BLANK BAR QUERY STATE -> DISPLAY TRENDING SEARCH METRICS */}
              {query.trim().length < 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-zinc-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Trending Searches
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSearchSubmit(item)}
                        className="rounded-full bg-zinc-50 border border-zinc-100 px-4 py-2 text-xs font-medium hover:bg-zinc-900 hover:border-zinc-900 hover:text-white transition-all duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STATE B: EVALUATED DATA SET RESULTS PRESENT */}
              {query.trim().length >= 2 && (
                <div className="space-y-1">
                  
                  {displayProducts.map((product) => {
                    // 🛡️ Safe fallback to standard placeholder string asset
                    const safeImageSrc = product.imageUrl?.trim() || '/placeholder.jpg';

                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          router.push(`/product/${product.id}`);
                          setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-3.5 rounded-xl p-2 hover:bg-zinc-50 group transition-all duration-200"
                      >
                        <div className="h-12 w-12 rounded-xl bg-zinc-50 overflow-hidden shrink-0 relative border border-zinc-100/50">
                          <img
                            src={safeImageSrc}
                            alt={product.title}
                            onError={(e) => {
                              // Dynamic run-time break handler to swap invalid storage target objects
                              (e.target as HTMLImageElement).src = '/placeholder.jpg';
                            }}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-800 group-hover:text-zinc-950 transition-colors">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs font-semibold text-zinc-900">
                              ₦{Number(product.displayPrice || 0).toLocaleString('en-NG')}
                            </p>
                            {product.vendor && (
                              <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                                • {product.vendor}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight
                          size={15}
                          className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                        />
                      </button>
                    );
                  })}

                  {/* Empty Result Boundary Notification Wrapper */}
                  {displayProducts.length === 0 && !loading && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-zinc-400">
                        No product results match <span className="font-semibold text-zinc-600">"{query}"</span>
                      </p>
                    </div>
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