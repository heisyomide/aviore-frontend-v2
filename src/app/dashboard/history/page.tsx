'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Clock, Sparkles } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../../../components/product/ProductCard';
import { Container } from '../../../components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';

interface HistoryItem {
  id: string;
  viewedAt: string;
  product: any; // We pass this directly to ProductCard
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      setHistory(res.data);
    } catch (error) {
      console.error('History fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    const confirmClear = window.confirm('Purge your browsing registry?');
    if (!confirmClear) return;

    try {
      await api.delete('/user/history');
      setHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedHistory = useMemo(() => {
    const groups = {
      Today: [] as HistoryItem[],
      Yesterday: [] as HistoryItem[],
      Earlier: [] as HistoryItem[],
    };

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    history.forEach((item) => {
      const viewedDate = new Date(item.viewedAt).toDateString();
      if (viewedDate === today) groups.Today.push(item);
      else if (viewedDate === yesterday) groups.Yesterday.push(item);
      else groups.Earlier.push(item);
    });

    return groups;
  }, [history]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB]">
        <Navbar />
        <Container className="pt-32 text-center">
          <div className="w-10 h-10 border-2 border-[#A4143D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Retrieving Registry...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />
      
      <Container className="pt-12 pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Browsing Registry</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Recent <span className="text-zinc-300">Views</span>
            </h1>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-black transition-colors"
            >
              <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
              Purge History
            </button>
          )}
        </header>

        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-20">
            {Object.entries(groupedHistory).map(([group, items]) => (
              items.length > 0 && (
                <section key={group}>
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="font-black text-[11px] uppercase tracking-[0.4em] text-zinc-400 whitespace-nowrap">
                      {group}
                    </h3>
                    <div className="h-[1px] w-full bg-zinc-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                    {items.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={item.id}
                      >
                        <ProductCard product={item.product} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-10 bg-zinc-50 rounded-full text-zinc-200 mb-6">
        <Clock size={64} strokeWidth={1} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No History Found</h2>
      <p className="text-sm font-medium text-zinc-400 max-w-xs italic">Your browsing registry is currently clear.</p>
    </div>
  );
}