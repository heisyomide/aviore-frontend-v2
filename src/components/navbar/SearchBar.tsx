'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/axios";
import { AnimatePresence, motion } from "framer-motion";

const TRENDING = ["Luxury Watches", "Artifacts", "Silk Shirts", "Minimalist Decor"];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], suggestions: [], categories: [] });
  const [recent, setRecent] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // 🔥 LOAD RECENT SEARCHES
  useEffect(() => {
    const stored = localStorage.getItem("recent_searches");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const saveRecent = (q: string) => {
    let updated = [q, ...recent.filter(r => r !== q)].slice(0, 6);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) return;

      setLoading(true);
      try {
        const res = await api.get(`/products/search/preview?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 CLICK OUTSIDE
  useEffect(() => {
    const handle = (e: any) => {
      if (!ref.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSearch = (q?: string) => {
    const final = q || query;
    if (!final.trim()) return;

    saveRecent(final);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(final)}`);
  };

  return (
    <div ref={ref} className="relative w-full max-w-lg">

      {/* 🔥 INPUT (CLEAN + SMALL) */}
      <div className={`flex items-center bg-white border rounded-xl px-3 py-2 transition-all ${
        isOpen ? "border-black shadow-md" : "border-gray-200"
      }`}>
        <Search size={16} className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search artifacts..."
          className="flex-1 px-2 text-sm outline-none bg-transparent"
        />

        {loading && <Loader2 size={14} className="animate-spin text-gray-400" />}

        {query && !loading && (
          <button onClick={() => setQuery("")}>
            <X size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* 🔥 DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* DESKTOP */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="hidden md:block absolute top-full mt-2 w-full bg-white border rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 space-y-5">

                {/* TRENDING */}
                {query.length < 2 && (
                  <Section title="Trending">
                    {TRENDING.map(tag => (
                      <Tag key={tag} onClick={() => handleSearch(tag)}>
                        🔥 {tag}
                      </Tag>
                    ))}
                  </Section>
                )}

                {/* RECENT */}
                {recent.length > 0 && query.length < 2 && (
                  <Section title="Recent">
                    {recent.map(r => (
                      <Tag key={r} onClick={() => handleSearch(r)}>
                        <Clock size={12}/> {r}
                      </Tag>
                    ))}
                  </Section>
                )}

                {/* PRODUCTS */}
                {results.products?.length > 0 && (
                  <Section title="Products">
                    {results.products.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          router.push(`/product/${p.id}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-lg"
                      >
                        <img
                          src={p.imageUrl || "/placeholder.jpg"}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">
                            ₦{p.displayPrice.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </Section>
                )}

                {/* SEE ALL */}
                {query.length >= 2 && (
                  <button
                    onClick={() => handleSearch()}
                    className="w-full text-sm font-bold bg-black text-white py-3 rounded-xl"
                  >
                    View all results
                  </button>
                )}
              </div>
            </motion.div>

            {/* 🔥 MOBILE (BOTTOM SHEET STYLE) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed md:hidden bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[100] max-h-[75vh] overflow-y-auto"
            >
              <div className="p-4 space-y-5">

                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Search</span>
                  <X onClick={() => setIsOpen(false)} />
                </div>

                {query.length < 2 && (
                  <Section title="Trending">
                    {TRENDING.map(tag => (
                      <Tag key={tag} onClick={() => handleSearch(tag)}>
                        🔥 {tag}
                      </Tag>
                    ))}
                  </Section>
                )}

                {results.products?.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/product/${p.id}`);
                      setIsOpen(false);
                    }}
                    className="flex gap-3 w-full"
                  >
                    <img
                      src={p.imageUrl || "/placeholder.jpg"}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        ₦{p.displayPrice.toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 🔥 SMALL COMPONENTS */

function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Tag({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-xs rounded-full transition"
    >
      {children}
    </button>
  );
}