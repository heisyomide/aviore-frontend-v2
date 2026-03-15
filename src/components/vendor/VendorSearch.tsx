"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

// ADD THE INTERFACE HERE
interface VendorSearchProps {
  defaultValue?: string;
}

export function VendorSearch({ defaultValue }: VendorSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultValue || "");

  // Keeps the input in sync if the URL changes externally
  useEffect(() => {
    setQuery(defaultValue || "");
  }, [defaultValue]);

  function handleSearch(term: string) {
    setQuery(term);
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="max-w-xl relative pt-8">
      <div className="absolute left-4 top-11 z-10">
        {isPending ? (
          <Loader2 className="text-red-600 animate-spin" size={18} />
        ) : (
          <Search className="text-zinc-500" size={18} />
        )}
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Filter by partner name..."
        className="w-full bg-zinc-900 border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-zinc-600 font-medium"
      />
    </div>
  );
}