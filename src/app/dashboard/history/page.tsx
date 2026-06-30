'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Clock, Loader2, Inbox } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { motion } from 'framer-motion';
import { ProductCard } from '../../../components/product/ProductCard';

interface HistoryItem {
  id: string;
  viewedAt: string;
  product: any; // Passed directly to ProductCard
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      setHistory(Array.isArray(res.data) ? res.data : []);
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
    const confirmClear = window.confirm('Are you sure you want to clear your browsing history?');
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
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Browsing History</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Recent <span className="text-zinc-300 font-medium">Views</span>
          </h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors pt-2 sm:pt-0"
          >
            <Trash2 size={14} className="group-hover:scale-105 transition-transform" />
            Clear History
          </button>
        )}
      </header>

      {/* 2. MAIN VIEWS LOG */}
      {history.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
          <Inbox size={36} className="text-zinc-300 mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">No History Found</p>
          <p className="text-[10px] text-zinc-400 mt-1 italic">Your recently viewed items will appear here.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {(Object.entries(groupedHistory) as [keyof typeof groupedHistory, HistoryItem[]][]).map(([group, items]) => (
            items.length > 0 && (
              <section key={group} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">
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
    </div>
  );
}