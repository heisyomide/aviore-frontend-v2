import Image from "next/image";
import Link from "next/link";

interface CategoryCircleProps {
  name: string;
  image: string;
  slug?: string; // 🚀 Made optional to prevent crash if data is missing
}

export function CategoryCircle({ name, image, slug }: CategoryCircleProps) {
  // 🛡️ Fallback Logic: Ensure the app never crashes on missing data
  const validImage = image || `https://picsum.photos/200/200?random=${name || 'category'}`;
  
  // 🚀 Construct safe URL: Default to # if slug is missing, otherwise lowercase the slug
  const safeSlug = slug ? slug.toLowerCase() : "";
  const shopHref = safeSlug ? `/shop?category=${safeSlug}` : "#";

  return (
    <Link 
      href={shopHref} 
      className="group flex flex-col items-center gap-3 shrink-0 focus:outline-none"
    >
      {/* Visual Circle Container */}
      <div className="relative h-16 w-16 md:h-24 md:w-24 overflow-hidden rounded-full border-2 border-transparent bg-white p-1 shadow-sm transition-all duration-500 group-hover:border-[#A4143D]/20 group-hover:shadow-xl group-active:scale-90">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-50">
          <Image 
            src={validImage} 
            alt={`${name || 'Category'} collection`} 
            fill 
            sizes="(max-width: 768px) 64px, 96px"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-125"
          />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      {/* Typography Label */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 transition-colors duration-300 group-hover:text-[#A4143D] md:text-[11px]">
          Shop
        </span>
        <span className="max-w-[90px] text-center text-[11px] font-black uppercase italic leading-none tracking-tight text-gray-900 transition-colors group-hover:text-black md:text-xs">
          {name || "Untitled"}
        </span>
      </div>
    </Link>
  );
}