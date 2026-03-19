"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Tag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

interface ProductRowProps {
  title: string;
  products: Product[];
  color: string;
  bannerTitle?: string;
}

export function ProductRow({ title, products, color, bannerTitle }: ProductRowProps) {
  return (
    <div className="w-full space-y-8">
      {/* 🛠️ ROW INSTRUMENTATION HEADER */}
      <div className="flex items-end justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2" style={{ color }}>
            <Tag size={12} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Batch_Sequence</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            {title}
          </h2>
        </div>
        
        <Link 
          href="/shop" 
          className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Full_Registry</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🚀 SIDE BARREL: Promo HUD */}
        <div 
          className="w-full lg:w-64 h-48 lg:h-auto rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group shrink-0 shadow-2xl shadow-zinc-200/50"
          style={{ backgroundColor: color }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-[100px] font-black leading-none break-all whitespace-normal select-none italic">
            AVIORE_REGISTRY_SYSTEM_AUTH_001
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Registry_Promo</span>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight mt-2">
              {bannerTitle || "Exclusive"}
            </h3>
          </div>

          <div className="relative z-10">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 inline-block">
                <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live_Access</span>
             </div>
          </div>
        </div>

        {/* 📦 PRODUCT NODES: Horizontal Scroll/Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link 
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-white border border-zinc-100 p-5 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/60 hover:border-[#A4143D]/20"
            >
              {/* Image Terminal */}
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-50 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image 
                  src={product.image || "/placeholder.jpg"} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Monospaced Stock Metric */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-zinc-100 shadow-sm">
                   <div className="flex items-center gap-1 text-zinc-400">
                      <BarChart3 size={10} />
                      <span className="text-[8px] font-black uppercase tracking-tighter font-mono">
                        Vault_ID: {product.id.slice(0, 4)}
                      </span>
                   </div>
                </div>
              </div>

              {/* Data Content */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-[13px] font-black uppercase italic tracking-tighter text-zinc-900 leading-tight group-hover:text-[#A4143D] transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                   <p className="text-xl font-black italic tracking-tighter text-zinc-900 font-mono">
                     ₦{product.price.toLocaleString()}
                   </p>
                   <div className="h-px bg-zinc-100 flex-1" />
                </div>

                <div className="flex items-center justify-between pt-2">
                   <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.2em] font-mono">Registry_Auth_True</span>
                   <div className="w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-[#A4143D] group-hover:text-white transition-all duration-500">
                      <ArrowUpRight size={12} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}