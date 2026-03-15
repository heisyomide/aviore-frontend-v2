import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const PROMOS = [
  {
    id: 1,
    title: "The Audio Registry",
    subtitle: "Acher Fluence Series",
    price: "From $159.99",
    image: "/electronic.jpg", 
    href: "/shop/electronics",
    gridClass: "md:col-span-2",
    theme: "dark",
  },
  {
    id: 2,
    title: "Organic Form",
    subtitle: "Wooden Minimalist",
    price: "40% Exclusive",
    image: "/funiture.jpg",
    href: "/shop/furniture",
    gridClass: "md:col-span-1",
    theme: "light",
  }
];

export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOS.map((promo) => (
          <Link 
            key={promo.id}
            href={promo.href}
            className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:shadow-2xl ${promo.gridClass} ${
              promo.theme === 'dark' ? 'bg-black text-white' : 'bg-[#F4F4F4] text-zinc-900'
            }`}
          >
            <div className="flex flex-col md:flex-row h-full min-h-[420px]">
              
              {/* 1. CONTENT AREA (Left Side) */}
              <div className="relative z-30 p-10 md:p-14 flex flex-col justify-between flex-1 w-full md:w-1/2">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-10 bg-red-600"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Premium_Access</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.85]">
                    {promo.title} <br />
                    <span className={`${promo.theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} font-medium`}>
                      {promo.subtitle}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest block opacity-40">Current_Rate</span>
                    <span className="text-2xl font-black italic">{promo.price}</span>
                  </div>
                  <div className="w-14 h-14 rounded-full border-[2px] border-current flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all duration-500">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </div>

              {/* 2. IMAGE AREA (Right Side) */}
              <div className="relative w-full md:w-1/2 h-full overflow-hidden">
                
                {/* DYNAMIC GRADIENT OVERLAY (Fixes the text visibility) */}
                <div className={`absolute inset-0 z-20 pointer-events-none 
                  ${promo.theme === 'dark' 
                    ? 'bg-gradient-to-r from-black via-black/40 to-transparent' 
                    : 'bg-gradient-to-r from-[#F4F4F4] via-[#F4F4F4]/20 to-transparent'
                  } w-full md:w-[60%] h-full`} 
                />

                <div className="relative w-full h-full transform transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:-rotate-2">
                  <Image 
                    src={promo.image} 
                    alt={promo.title} 
                    fill 
                    className="object-cover object-center md:object-right-bottom"
                    priority
                  />
                </div>
              </div>

            </div>

            {/* 3. BRAND WATERMARK */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.04] pointer-events-none">
               <span className="text-[10rem] font-black italic select-none uppercase tracking-tighter leading-none">AVIORE</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}