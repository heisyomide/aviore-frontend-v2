'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Clock } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { motion } from 'framer-motion';
import { ProductCard } from '../../../components/product/ProductCard';
import { Container } from '../../../components/layout/Container';

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
    const confirmClear = window.confirm('Purge your browsing registry cache?');
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
      <div className="min-h-screen bg-[#0D0D0D]">
        <Container className="pt-32 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-[#991B1B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">Syncing History Node...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Container className="pt-12 pb-24 w-full animate-in fade-in duration-500">
        
        {/* LUXURY REGISTRY HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/60 pb-6 mb-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <Clock size={13} className="animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Browsing_Registry</span>
            </div>
            <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
              Recent <span className="text-zinc-600 font-normal font-sans tracking-normal">Views</span>
            </h1>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="group flex items-center gap-2.5 text-[9px] font-mono font-bold uppercase tracking-widest text-red-500 hover:text-white bg-zinc-950/60 hover:bg-zinc-950 px-4 py-2 border border-zinc-900 hover:border-zinc-800 rounded-lg transition-all active:scale-[0.98]"
            >
              <Trash2 size={12} className="group-hover:rotate-6 transition-transform text-[#991B1B]" />
              Purge History
            </button>
          )}
        </header>

        {/* TIMELINE SECTION PIPELINES */}
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedHistory).map(([group, items]) => (
              items.length > 0 && (
                <section key={group} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h3 className="font-mono font-bold text-[9px] uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">
                      {group}_Log
                    </h3>
                    <div className="h-[1px] w-full bg-zinc-900/60" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                    {items.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
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
    <div className="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl text-center bg-[#111113]/20">
      <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-xl mb-4">
        <Clock size={22} strokeWidth={1.5} />
      </div>
      <h2 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1">No Trace Matrix Found</h2>
      <p className="text-[11px] font-sans text-zinc-600 max-w-xs">Your viewing history log stream is currently empty.</p>
    </div>
  );
}