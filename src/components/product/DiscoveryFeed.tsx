'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container } from '../../components/layout/Container';
import { Navbar } from '../../components/navbar/Navbar';
import { Footer } from '../../components/Footer';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader2, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface DiscoveryFeedProps {
  title: string;
  subtitle: string;
  endpointParams: string;
}

export function DiscoveryFeed({ title, subtitle, endpointParams }: DiscoveryFeedProps) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/storefront/products?${endpointParams}&limit=40`);
        setProducts(res.data?.products || res.data || []);
      } catch (err) {
        console.error(`Failed to sync discovery feed: ${title}`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [endpointParams, title]);

  return (
    <main className="w-full min-h-screen bg-white text-zinc-950 flex flex-col selection:bg-[#A4143D] selection:text-white">
      <Navbar />
      <div className="grow">
        <div className="w-full border-b border-zinc-100 bg-zinc-50/30 py-12">
          <Container>
            <button 
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase hover:text-zinc-950 transition-colors font-mono"
            >
              <ArrowLeft size={12} /> RETURN BACK
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-zinc-900">{title}</h1>
                <p className="text-xs font-bold uppercase tracking-wider text-[#A4143D] font-mono">// {subtitle}</p>
              </div>
              <button className="h-11 px-5 border border-zinc-200 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:border-zinc-950 transition-all font-mono self-start md:self-auto">
                <SlidersHorizontal size={14} /> FILTER & SORT
              </button>
            </div>
          </Container>
        </div>
        <Container className="py-12">
          {loading ? (
            <div className="w-full h-[40vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#A4143D]" size={32} />
              <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">STREAMING EXPERIENCE DATA...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full h-[30vh] border border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm font-black uppercase tracking-tight text-zinc-400">No products listed here yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </main>
  );
}