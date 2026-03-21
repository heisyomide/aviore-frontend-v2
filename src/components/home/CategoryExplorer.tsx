'use client';

import { ArrowRight, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductCard } from '../product/ProductCard';
import { Container } from '../layout/Container';

interface Props {
  categoryName: string;
  categorySlug: string;
  products: any[];
}

export function CategoryExplorer({ categoryName, categorySlug, products }: Props) {
  const router = useRouter();

  if (!products.length) return null;

  return (
    <section className="py-20 bg-white overflow-hidden select-none">
      <Container>
        
        {/* 🚀 1. INDUSTRIAL HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-50 pb-8">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#A4143D]"
            >
              <div className="p-1 bg-[#A4143D]/10 rounded-md">
                <TrendingUp size={14} className="animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Section_Explorer_v2</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-8xl font-[1000] text-slate-900 uppercase italic tracking-tighter leading-[0.8] drop-shadow-sm">
              {categoryName}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] ml-1">
              Curated Selection • Verified Vendors • Next-Day Delivery
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/shop?category=${categorySlug}`)}
            className="group flex items-center gap-6 bg-slate-900 text-white pl-10 pr-3 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all hover:bg-[#A4143D]"
          >
            <span className="text-[11px] font-black uppercase tracking-widest">Explore All</span>
            <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
              <ArrowRight size={20} />
            </div>
          </motion.button>
        </div>

        {/* 🚀 2. THE KINETIC MASONRY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🔥 FEATURED MINI-HERO (Takes up 4 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 relative rounded-[2.5rem] bg-slate-50 overflow-hidden group cursor-pointer border border-gray-100 h-[400px] lg:h-auto"
          >
             <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/20 mb-4">
                  <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest text-white">Editors Choice</span>
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
                  Best of {categoryName}
                </h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Limited Edition Artifacts</p>
             </div>
             <img 
               src={products[0]?.images?.[0] || products[0]?.img || '/placeholder.png'} 
               alt="Featured"
               className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms]"
             />
          </motion.div>

          {/* ⚡ THE PRODUCT MATRIX (Remaining 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.slice(1, 7).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

        </div>

        {/* 🚀 3. FOOTER DECORATION */}
        <div className="mt-16 flex items-center gap-4 opacity-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-900" />
          <Zap size={14} className="text-slate-900" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-900" />
        </div>

      </Container>
    </section>
  );
}