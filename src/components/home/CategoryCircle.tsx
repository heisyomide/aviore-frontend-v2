'use client';

import Image from "next/image";
import Link from "next/link";

interface CategoryCircleProps {
  name: string;
  image?: string; 
  slug?: string;
}

export function CategoryCircle({ name, image, slug }: CategoryCircleProps) {
  const safeSlug = slug ? slug.toLowerCase() : "default";
  const localPath = `/registry/categories/${safeSlug}.jpg`;
  const finalImage = image || localPath;
  const shopHref = slug ? `/shop?category=${safeSlug}` : "/shop";

  return (
    <Link 
      href={shopHref} 
      className="group flex flex-col items-center gap-3 shrink-0 focus:outline-none"
    >
      {/* 🛠️ VIBRANT VISUAL NODE */}
      <div className="relative h-14 w-14 md:h-20 md:w-20 rounded-full p-1 border border-zinc-100 transition-all duration-500 ease-in-out group-hover:border-[#A4143D] group-hover:shadow-[0_0_20px_rgba(164,20,61,0.15)] group-active:scale-95">
        
        <div className="relative h-full w-full overflow-hidden rounded-full bg-zinc-50 shadow-inner">
          <Image 
            src={finalImage} 
            alt={`AVIORE_CAT_${name?.toUpperCase()}`} 
            fill 
            sizes="(max-width: 768px) 56px, 80px"
            /* 🚀 REMOVED GRAYSCALE: Image is now full color by default */
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
            priority={false}
          />
          {/* Subtle overlay for depth on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* 🟢 Status Pulse: Now matches the vibrant feel */}
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white scale-0 group-hover:scale-110 transition-transform duration-500 shadow-sm" />
      </div>

      {/* 🏷️ PREMIUM LABEL */}
      <div className="flex flex-col items-center">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 transition-colors duration-300 group-hover:text-[#A4143D] font-mono">
          {name || "NULL"}
        </span>
        {/* Animated underscore line */}
        <div className="w-0 h-0.5 bg-[#A4143D] mt-1 transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
}