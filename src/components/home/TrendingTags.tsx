// src/components/home/TrendingTags.tsx
import Link from 'next/link';

const TAGS = [
  "New Arrivals", "Best Sellers", "Under ₦5,000", "Top Rated", "Industrial", "Handmade", "Vintage", "Limited Edition"
];

export function TrendingTags() {
  return (
    <div className="bg-white border-b border-gray-50 py-3">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 shrink-0 tracking-widest">Trending:</span>
        {TAGS.map((tag) => (
          <Link 
            key={tag}
            href={`/search?q=${tag.toLowerCase()}`}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}