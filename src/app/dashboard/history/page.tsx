'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Clock, Loader2, ShoppingBag } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { ProductCard } from '../../../components/product/ProductCard';

interface HistoryItem {
  id: string;
  viewedAt: string;
  product: any;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('History_Fetch_Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      setClearing(true);
      await api.delete('/user/history');
      setHistory([]);
      setConfirming(false);
    } catch (err) {
      console.error('History_Clear_Error:', err);
    } finally {
      setClearing(false);
    }
  };

  const grouped = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const out: { label: string; items: HistoryItem[] }[] = [
      { label: 'Today', items: [] },
      { label: 'Yesterday', items: [] },
      { label: 'Earlier', items: [] },
    ];
    history.forEach(item => {
      const d = new Date(item.viewedAt).toDateString();
      if (d === today) out[0].items.push(item);
      else if (d === yesterday) out[1].items.push(item);
      else out[2].items.push(item);
    });
    return out.filter(g => g.items.length > 0);
  }, [history]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Loading</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={11} className="text-[#A4143D]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
              Browsing History
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
            Recent Views
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            {history.length > 0 ? `${history.length} item${history.length === 1 ? '' : 's'} viewed` : 'Nothing here yet'}
          </p>
        </div>

        {history.length > 0 && (
          <div className="shrink-0 pt-1">
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 hidden sm:inline">Clear all?</span>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 uppercase tracking-wide px-3 py-2 rounded-lg border border-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearHistory}
                  disabled={clearing}
                  className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 uppercase tracking-wide px-3 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {clearing
                    ? <Loader2 size={11} className="animate-spin" />
                    : <Trash2 size={11} />}
                  Clear
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 hover:text-red-500 px-3 py-2 rounded-lg border border-zinc-200 hover:border-red-200 transition-all"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
          <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center">
            <ShoppingBag size={22} className="text-zinc-300" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-tight text-zinc-800">Nothing yet</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
              Products you view will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ label, items }) => (
            <section key={label}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">
                  {label}
                </span>
                <div className="h-px flex-1 bg-zinc-100" />
                <span className="text-[9px] font-mono text-zinc-300">{items.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map(item => (
                  <ProductCard key={item.id} product={item.product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}