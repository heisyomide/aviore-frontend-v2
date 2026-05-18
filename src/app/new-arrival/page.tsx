'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sparkles, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Container } from '../../components/layout/Container'; // Adjusted to match your directory style

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  slug?: string;
  category?: { name: string };
  vendor?: { storeName: string };
}

export default function NewArrivalsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/storefront/products?sort=newest`);
        const data = Array.isArray(response.data) ? response.data : response.data?.products || [];
        setProducts(data);
      } catch (err) {
        console.error("New_Arrivals_Fetch_Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  // Isolate categories dynamically from loaded products
  const categories = useMemo(() => {
    const extracted = products.map((p) => p.category?.name).filter(Boolean) as string[];
    return ['ALL', ...Array.from(new Set(extracted))];
  }, [products]);

  // Handle local classification filtering
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products;
    return products.filter((p) => p.category?.name === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <main className="w-full min-h-screen bg-white text-zinc-900 pt-28 pb-24 selection:bg-zinc-900 selection:text-white">
      <Container>
        
        {/* 🎯 INTENSE EDITORIAL TYPOGRAPHY HEADER */}
        <div className="w-full border-b border-zinc-100 pb-10 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Sparkles size={13} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">Latest Drops</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
              NEW <span className="text-zinc-300 font-light not-italic">ARRIVALS</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest max-w-md leading-relaxed">
              Pristine artifacts and newly dropped inventory sourced direct from our verified network houses.
            </p>
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 px-4 py-2 rounded-full bg-zinc-50/50">
            METRIC: {filteredProducts.length} // {products.length} OBJECTS LIVE
          </div>
        </div>

        {/* 🏎️ HORIZONTAL FILTER CHIP ROW (Full Width, No Sidebar) */}
        <div className="w-full flex gap-2.5 overflow-x-auto pb-6 mb-10 no-scrollbar border-b border-zinc-100/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border transition-all duration-300 shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-md translate-y-[-1px]' 
                  : 'bg-white text-zinc-400 border-zinc-200 hover:text-zinc-900 hover:border-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📦 FULL-BLEED RESPONSIVE GRID CANVAS */}
        <div className="w-full">
          {loading ? (
            <LoadingGridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <EmptyCollectionState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} router={router} />
              ))}
            </div>
          )}
        </div>

      </Container>
    </main>
  );
}

/* --- SUBSIDIARY COMPONENTS --- */

function ProductCard({ product, router }: { product: Product; router: any }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const targetImage = product.imageUrl || (product.images && product.images[0]);
  const formattedImage = targetImage?.startsWith('http') 
    ? targetImage 
    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${targetImage}`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div 
      className="group flex flex-col space-y-4 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/product/${product.slug || product.id}`)}
    >
      {/* Editorial Aspect Display Area */}
      <div className="w-full aspect-[3/4] bg-zinc-50 border border-zinc-100 rounded-[2.5rem] overflow-hidden relative shadow-sm group-hover:shadow-2xl hover:border-zinc-300/80 transition-all duration-500 flex items-center justify-center">
        {targetImage ? (
          <Image
            src={formattedImage}
            alt={product.title}
            fill
            sizes="(max-w-7xl) 25vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
          />
        ) : (
          <ShoppingBag size={28} className="text-zinc-200" />
        )}

        {/* Drop Label Flag */}
        <div className="absolute top-5 left-5 bg-zinc-900 text-white text-[8px] font-black tracking-[0.2em] uppercase py-1 px-3 rounded-lg z-10 shadow-sm">
          NEW ARRIVAL
        </div>

        {/* Dynamic Interactive Quick Action Dock */}
        <div className={`absolute inset-x-0 bottom-6 px-6 flex items-center justify-center gap-2.5 transition-all duration-300 z-10 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <button className="flex-1 bg-white hover:bg-zinc-900 text-zinc-900 hover:text-white text-[9px] font-black uppercase tracking-widest py-3.5 px-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
            <ShoppingBag size={11} /> ADD TO REGISTRY
          </button>
          <div className="w-11 h-11 bg-white hover:bg-zinc-50 rounded-xl shadow-lg flex items-center justify-center text-zinc-500 hover:text-[#A4143D] transition-colors">
            <Heart size={13} />
          </div>
        </div>
      </div>

      {/* Meta Label Descriptions */}
      <div className="space-y-1.5 px-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-[#A4143D] tracking-widest uppercase line-clamp-1 max-w-[65%]">
            {product.vendor?.storeName || 'AVIORÈ VENDOR'}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
            {product.category?.name}
          </span>
        </div>
        
        <h3 className="font-black text-sm uppercase italic tracking-tighter text-zinc-900 line-clamp-1 group-hover:text-[#A4143D] transition-colors leading-none">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between pt-0.5">
          <p className="font-black text-xs text-zinc-900 tracking-tight">
            {formatCurrency(product.price)}
          </p>
          <ArrowRight size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#A4143D]" />
        </div>
      </div>
    </div>
  );
}

function LoadingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 w-full">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col space-y-4 w-full animate-pulse">
          <div className="w-full aspect-[3/4] bg-zinc-50 rounded-[2.5rem] border border-zinc-100" />
          <div className="space-y-2 px-2">
            <div className="h-2 bg-zinc-100 rounded-md w-20" />
            <div className="h-4 bg-zinc-100 rounded-md w-full" />
            <div className="h-3 bg-zinc-100 rounded-md w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyCollectionState() {
  return (
    <div className="w-full h-[400px] border border-dashed border-zinc-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 bg-zinc-50/50">
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
        <ShoppingBag size={16} />
      </div>
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-800">No Fresh Drops Found</h3>
      <p className="text-[10px] text-zinc-400 uppercase tracking-tight max-w-xs mt-1">
        This specific archive category is empty. Select another tier to browse.
      </p>
    </div>
  );
}