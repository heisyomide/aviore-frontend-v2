'use client';

import { ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    <section className="py-16 border-b border-gray-100 bg-white">
      <Container>
        {/* Category Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#A4143D] mb-1">
              <Zap size={14} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Shop by Category</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              {categoryName}
            </h2>
          </div>

          <button 
            onClick={() => router.push(`/shop?category=${categorySlug}`)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-black transition-all group shadow-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">See More {categoryName}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 10-Product Grid for this category */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}