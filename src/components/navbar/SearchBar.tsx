'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/src/lib/axios";


interface SearchResult {
  id: string;
  title: string;
  displayPrice: number;
  images: { imageUrl: string }[];
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef(null);

  // 1. Logic: Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Replace with your real search endpoint
        const res = await api.get(`/products/search/preview?q=${query}`);
        setResults(res.data.products);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms Debounce

    return () => clearTimeout(timer);
  }, [query]);

  // 2. Logic: Handle "Enter" or Button Click
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <form 
        onSubmit={handleSearch}
        className="group flex items-center bg-zinc-100 rounded-2xl border border-transparent focus-within:border-zinc-300 focus-within:bg-white transition-all duration-300 overflow-hidden"
      >
        <div className="pl-4 text-zinc-400">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder="Search for industrial designs..."
          className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-400 text-zinc-900"
        />

        {query && (
          <button 
            type="button" 
            onClick={() => setQuery("")}
            className="pr-2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={16} />
          </button>
        )}

        <button 
          type="submit"
          className="bg-zinc-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
          Find
        </button>
      </form>

      {/* 3. Logic: The Magnificent Dropdown */}
{/* 3. Logic: The Magnificent Dropdown */}
{isOpen && results.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-100 shadow-2xl z-50 overflow-hidden">
    <div className="p-2">
      <p className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Products Found</p>
      
      {results.map((product) => (
        <button
          key={product.id} // Fixed: id now exists on SearchResult
          onClick={() => {
            router.push(`/product/${product.id}`);
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors rounded-xl text-left"
        >
          {/* Tailwind Fix: flex-shrink-0 replaced with shrink-0 */}
          <div className="h-10 w-10 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
            <img 
              src={product.images[0]?.imageUrl || '/placeholder.jpg'} 
              alt={product.title} 
              className="object-cover h-full w-full" 
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-900 leading-none">
              {product.title}
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              ₦{product.displayPrice.toLocaleString()}
            </p>
          </div>
        </button>
      ))}
    </div>
    
    <button 
      onClick={handleSearch}
      className="w-full py-3 bg-zinc-50 border-t border-zinc-100 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
    >
      See all results for "{query}"
    </button>
  </div>
)}
    </div>
  );
}