'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, X, ArrowUpRight, Clock, Store, Layers, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { api } from '@/src/lib/axios';

// ======================================================
// CONFIGURATION & TYPES
// ======================================================
interface SearchProduct {
  id: string;
  title: string;
  imageUrl: string | null;
  displayPrice: number;
  category: string;
  vendor: string;
}

interface SearchCategory {
  id: string;
  name: string;
  slug?: string;
}

interface SearchVendor {
  id: string;
  storeName: string;
  slug: string;
  imageUrl: string | null;
}

interface SearchPreviewResponse {
  products: SearchProduct[];
  suggestions: string[];
  categories: SearchCategory[];
  vendors?: SearchVendor[];
}

const TRENDING_SEARCHES = [
  'Luxury Watches',
  'Vintage Artifacts',
  'Minimal Decor',
  'Designer Bags',
  'Silk Shirts',
];

const LOCAL_STORAGE_KEY = 'aviore_recent_searches';
const DEBOUNCE_DELAY_MS = 300;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Hydrate local cache safely after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to parse recent inquiries:', err);
    }
  }, []);

  // Trap background scroll when immersive search layout is pulled up
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle global keyboard escape interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced API Request pipeline
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
        setResults({ products: [], suggestions: [], categories: [], vendors: [] });
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(delayHandler);
  }, [query]);

  const handleSearchSubmit = (targetValue?: string) => {
    const finalQuery = (targetValue ?? query).trim();
    if (!finalQuery) return;

    const updated = [finalQuery, ...recentSearches.filter((r) => r !== finalQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  const clearSearchInput = () => {
    setQuery('');
    setResults({ products: [], suggestions: [], categories: [], vendors: [] });
    inputRef.current?.focus();
  };

  return (
    <>
      {/* ─── RESPONSIVE ROOT TRIGGERS ─── */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50/50 active:bg-white text-zinc-500 shrink-0 select-none"
        aria-label="Open search menu"
      >
        <Search size={16} />
      </button>

      <div 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center w-full max-w-md h-11 rounded-full border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-400 px-4 cursor-pointer transition-all duration-300 group"
      >
        <Search size={15} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
        <span className="px-3 text-xs font-medium text-zinc-400 group-hover:text-zinc-500 transition-colors flex-1 select-none">
          Search products, curated collections...
        </span>
        <span className="text-[10px] tracking-widest font-bold text-zinc-300 uppercase shrink-0">
          Open_
        </span>
      </div>

      {/* ─── IMMERSIVE FULLSCREEN OVERLAY PORTAL ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[100] flex flex-col justify-start md:pt-16 md:px-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Click-outside background trigger (hidden completely on full screen mobile screens) */}
            <div className="absolute inset-0 -z-10 hidden md:block" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : -20, scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : -20, scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0.98 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className="w-full max-w-[1100px] mx-auto bg-white md:rounded-[2.5rem] rounded-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-zinc-100 overflow-hidden flex flex-col h-full md:h-auto md:max-h-[85vh]"
            >
              {/* 🎯 MAIN INPUT PANEL ROW */}
              <div className="flex items-center h-20 px-4 md:px-8 border-b border-zinc-100 bg-white sticky top-0 z-10 gap-2">
                <Search size={20} className="text-zinc-400 shrink-0 ml-2 md:ml-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  autoFocus
                  aria-label="Search items"
                  placeholder="What artifact are you looking for?"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="flex-1 bg-transparent px-2 md:px-5 text-base md:text-lg font-medium text-zinc-900 placeholder:text-zinc-300 outline-none min-w-0"
                />
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  {loading && <Loader2 size={18} className="animate-spin text-zinc-400" />}
                  {query && !loading && (
                    <button 
                      onClick={clearSearchInput} 
                      className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors"
                      aria-label="Clear context"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="w-px h-6 bg-zinc-100 hidden md:block" />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-3 md:px-4 py-2 text-[10px] tracking-[0.15em] md:tracking-[0.2em] uppercase font-black bg-zinc-950 text-white rounded-full hover:bg-[#A4143D] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* 🏛️ EDITORIAL RESPONSIVE CONTEXT WORKSPACE */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-100 bg-zinc-50/30">
                
                {/* LEFT WORKSPACE FLANK (Recent Searches, Categories, Vendors) */}
                <div className="md:col-span-5 p-6 md:p-8 space-y-8 bg-white order-2 md:order-1">
                  {query.trim().length < 2 ? (
                    <>
                      {recentSearches.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Clock size={12} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Inquiries</h4>
                          </div>
                          <div className="flex flex-col gap-1">
                            {recentSearches.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSearchSubmit(item)}
                                className="flex items-center justify-between text-left text-sm font-medium text-zinc-600 hover:text-zinc-950 py-1.5 px-2 rounded-xl hover:bg-zinc-50 transition-colors group"
                              >
                                <span>{item}</span>
                                <ArrowUpRight size={14} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-zinc-400 group-hover:text-zinc-950 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Sparkles size={12} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Trending Curations</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {TRENDING_SEARCHES.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleSearchSubmit(item)}
                              className="rounded-xl bg-zinc-50 border border-zinc-100/80 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-900 hover:bg-zinc-950 hover:text-white transition-all duration-300"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {results.suggestions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Index Matches</h4>
                          <div className="flex flex-col gap-1">
                            {results.suggestions.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSearchSubmit(item)}
                                className="flex items-center justify-between text-left text-sm font-semibold text-zinc-800 hover:text-[#A4143D] py-2 px-2 rounded-xl hover:bg-[#A4143D]/5 transition-all"
                              >
                                <span>{item}</span>
                                <ArrowUpRight size={14} className="text-zinc-300" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.categories.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Layers size={11} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Filter Realms</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {results.categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setIsOpen(false);
                                  router.push(`/category/${cat.slug || cat.name.toLowerCase()}`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                              >
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.vendors && results.vendors.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Store size={11} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Boutiques</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {results.vendors.slice(0, 3).map((v) => {
                              const logo = v.imageUrl ? (v.imageUrl.startsWith('http') ? v.imageUrl : `${API_BASE}/uploads/${v.imageUrl}`) : null;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => {
                                    setIsOpen(false);
                                    router.push(`/vendors/${v.slug}`);
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all text-left bg-zinc-50/50 group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-zinc-100 relative overflow-hidden shrink-0 border border-zinc-100 flex items-center justify-center">
                                    {logo ? <Image src={logo} alt={v.storeName} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" /> : <Store size={14} className="text-zinc-300" />}
                                  </div>
                                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-tight">{v.storeName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* RIGHT WORKSPACE FLANK (Curated Previews) */}
                <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between order-1 md:order-2">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Curated Inventory Previews</h4>
                    
                    {query.trim().length < 2 ? (
                      <div className="h-36 md:h-48 border border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center bg-white p-6 text-center">
                        <p className="text-[10px] font-black tracking-widest text-zinc-300 uppercase italic">Awaiting_Input_Parameters</p>
                      </div>
                    ) : results.products.length === 0 ? (
                      <div className="h-36 md:h-48 border border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center bg-white p-6 text-center">
                        <p className="text-[10px] font-black tracking-widest text-[#A4143D] uppercase italic">No_Matching_Artifacts</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {results.products.slice(0, 4).map((product) => {
                          const src = product.imageUrl?.trim() || '/placeholder.jpg';
                          const fineSrc = src.startsWith('http') || src.startsWith('/') ? src : `${API_BASE}/uploads/${src}`;
                          
                          return (
                            <button
                              key={product.id}
                              onClick={() => {
                                setIsOpen(false);
                                router.push(`/product/${product.id}`);
                              }}
                              className="flex w-full items-center gap-3 md:gap-4 rounded-2xl p-2 hover:bg-white border border-transparent hover:border-zinc-100 hover:shadow-md transition-all duration-300 group"
                            >
                              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-zinc-100 overflow-hidden shrink-0 relative border border-zinc-100/20">
                                <Image
                                  src={fineSrc}
                                  alt={product.title}
                                  fill
                                  sizes="(max-width: 768px) 48px, 56px"
                                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                />
                              </div>

                              <div className="flex-1 text-left min-w-0">
                                <span className="text-[8px] font-black tracking-widest uppercase text-zinc-400 block mb-0.5">{product.category || 'Collection'}</span>
                                <p className="truncate text-xs md:text-sm font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors leading-tight">
                                  {product.title}
                                </p>
                                <span className="text-[10px] text-zinc-400 block mt-0.5 font-medium truncate">
                                  by {product.vendor || "Aviorè Maison"}
                                </span>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-xs font-black text-zinc-950">
                                  ₦{Number(product.displayPrice || 0).toLocaleString('en-NG')}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {query.trim().length >= 2 && results.products.length > 0 && (
                    <button 
                      onClick={() => handleSearchSubmit()}
                      className="w-full mt-6 h-12 bg-zinc-950 text-white hover:bg-[#A4143D] transition-colors rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      <span>View All Results ({results.products.length})</span>
                      <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}