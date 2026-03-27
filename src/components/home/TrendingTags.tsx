// src/components/home/TrendingTags.tsx
import Link from 'next/link';

const TRENDING_LINKS = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/best-sellers" }, // 🚀 Points to your new page!
  { label: "Under ₦5,000", href: "/shop?maxPrice=5000" },
  { label: "Top Rated", href: "/shop?minRating=4" },
  { label: "Industrial", href: "/search?q=industrial" },
  { label: "Handmade", href: "/search?q=handmade" },
  { label: "Vintage", href: "/search?q=vintage" },
  { label: "Limited Edition", href: "/search?q=limited" },
];

export function TrendingTags() {
  return (
    <div className="bg-white border-b border-gray-50 py-3">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 shrink-0 tracking-widest">
          Trending:
        </span>
        {TRENDING_LINKS.map((tag) => (
          <Link 
            key={tag.label}
            href={tag.href}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}