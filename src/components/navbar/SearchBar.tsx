'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/axios";
import { AnimatePresence, motion } from "framer-motion"; // Highly recommended for premium feel

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], suggestions: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/search/preview?q=${query}`);
        setResults({
          products: res.data.products || [],
          suggestions: res.data.suggestions || [],
          categories: res.data.categories || []
        });
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (q?: string) => {
    const finalQuery = q || query;
    if (!finalQuery.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  return (
    <div className="relative w-full max-w-xl font-sans" ref={ref}>
      {/* PREMIUM INPUT BOX */}
      <div className={`flex items-center bg-white border-2 transition-all duration-300 rounded-full px-4 py-2 ${isOpen ? 'border-black shadow-lg' : 'border-zinc-100'}`}>
        <Search size={20} className="text-zinc-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if(e.target.value.length > 0) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for artifacts..."
          className="flex-1 bg-transparent px-3 text-base outline-none placeholder:text-zinc-400"
        />
        {loading && <Loader2 size={18} className="animate-spin text-zinc-400 mr-2" />}
        {query && !loading && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }} className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={18} className="text-zinc-500" />
          </button>
        )}
      </div>

      {/* SEARCH OVERLAY / DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Fullscreen / Desktop Dropdown */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed inset-0 z-[100] bg-white md:absolute md:inset-auto md:top-full md:left-0 md:right-0 md:mt-3 md:rounded-3xl md:shadow-2xl md:border md:overflow-hidden md:h-auto overflow-y-auto"
            >
              {/* Mobile Header (Hidden on Desktop) */}
              <div className="flex items-center p-4 border-b md:hidden">
                <button onClick={() => setIsOpen(false)} className="mr-4 p-2"><X size={24}/></button>
                <input 
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-lg outline-none"
                />
              </div>

              <div className="p-6 space-y-8">
                {/* PRE-SEARCH STATE (Trending) */}
                {query.length < 2 && (
                  <div>
                    <div className="flex items-center gap-2 text-zinc-900 font-bold mb-4 uppercase tracking-widest text-xs">
                      <TrendingUp size={14}/> Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Luxury Watches', 'Silk Shirts', 'Artifacts', 'Minimalist Home'].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => { setQuery(tag); handleSearch(tag); }}
                          className="px-4 py-2 bg-zinc-50 hover:bg-black hover:text-white transition-all rounded-full text-sm border border-zinc-100"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESULTS: PRODUCTS */}
                {results.products.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Suggested Artifacts</p>
                    <div className="grid grid-cols-1 gap-4">
                      {results.products.map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => { router.push(`/product/${p.id}`); setIsOpen(false); }}
                          className="flex items-center gap-4 group text-left"
                        >
                          <div className="w-14 h-14 overflow-hidden rounded-xl bg-zinc-100">
                            <img src={p.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-zinc-900 group-hover:underline">{p.title}</p>
                            <p className="text-xs font-bold mt-1">₦{p.displayPrice.toLocaleString()}</p>
                          </div>
                          <ArrowRight size={16} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESULTS: CATEGORIES */}
                {results.categories.length > 0 && (
                  <div className="pt-4 border-t border-zinc-50">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {results.categories.map((c: any) => (
                        <button 
                          key={c.id} 
                          onClick={() => { router.push(`/search?category=${c.slug}`); setIsOpen(false); }}
                          className="text-sm font-medium hover:text-blue-600 px-3 py-1 bg-zinc-50 rounded-lg"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* NO RESULTS VIEW */}
                {query.length >= 2 && !loading && results.products.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-zinc-400 text-sm">No artifacts matching "{query}"</p>
                  </div>
                )}
                
                {query.length >= 2 && (
                   <button 
                    onClick={() => handleSearch()}
                    className="w-full py-4 mt-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    View All Results <ArrowRight size={16}/>
                  </button>
                )}
              </div>
            </motion.div>

            {/* DARK BACKDROP (Desktop Only) */}
            <div 
              className="hidden md:block fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]" 
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}