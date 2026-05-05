'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/axios";

export function SearchBar() {
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // 🔥 DEBOUNCED SEARCH
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setProducts([]);
        setSuggestions([]);
        setCategories([]);
        return;
      }

      setLoading(true);

      try {
        const res = await api.get(`/products/search/preview?q=${query}`);

        setProducts(res.data.products || []);
        setSuggestions(res.data.suggestions || []);
        setCategories(res.data.categories || []);

        setIsOpen(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 CLICK OUTSIDE CLOSE
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!ref.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔥 SUBMIT SEARCH
  const handleSearch = (q?: string) => {
    const finalQuery = q || query;
    if (!finalQuery.trim()) return;

    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  return (
    <div className="relative w-full max-w-xl" ref={ref}>
      
      {/* INPUT */}
      <div className="flex items-center bg-zinc-100 rounded-2xl overflow-hidden">
        <div className="pl-4 text-zinc-400">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder="Search products..."
          className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
        />

        {query && (
          <button onClick={() => setQuery("")} className="px-2">
            <X size={16} />
          </button>
        )}

        <button
          onClick={() => handleSearch()}
          className="bg-black text-white px-5 text-xs font-bold"
        >
          Search
        </button>
      </div>

      {/* 🔥 DROPDOWN */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">

          {/* LOADING */}
          {loading && (
            <div className="p-4 text-sm text-zinc-400">Searching...</div>
          )}

          {/* EMPTY */}
          {!loading && products.length === 0 && suggestions.length === 0 && (
            <div className="p-4 text-sm text-zinc-400">
              No results found
            </div>
          )}

          {/* 🔹 SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="p-2 border-b">
              <p className="px-3 text-xs text-zinc-400 mb-2">Suggestions</p>

              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 🔹 PRODUCTS */}
          {products.length > 0 && (
            <div className="p-2 border-b">
              <p className="px-3 text-xs text-zinc-400 mb-2">Products</p>

              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    router.push(`/product/${p.id}`);
                    setIsOpen(false);
                  }}
                  className="flex gap-3 w-full px-3 py-2 hover:bg-zinc-50"
                >
                  <img
                    src={p.imageUrl || "/placeholder.jpg"}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm">{p.title}</p>
                    <p className="text-xs text-zinc-500">
                      ₦{p.displayPrice.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 🔹 CATEGORIES */}
          {categories.length > 0 && (
            <div className="p-2">
              <p className="px-3 text-xs text-zinc-400 mb-2">Categories</p>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    router.push(`/search?category=${c.slug}`);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* 🔹 SEE ALL */}
          <button
            onClick={() => handleSearch()}
            className="w-full py-3 text-xs font-bold bg-zinc-50"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}