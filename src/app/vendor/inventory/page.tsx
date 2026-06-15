'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AlertTriangle, Save, Loader2, Bell,
  Package, Search, Plus, Minus, Inbox
} from 'lucide-react';
import { api } from '@/src/lib/axios';

/* ---------------- TYPES ---------------- */
type Product = {
  id: string;
  title: string;
  images?: { imageUrl: string }[];
  displayStock: number;
  displayPrice?: number;
};

/* ---------------- COMPONENT ---------------- */
export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [updates, setUpdates] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  /* ---------------- FETCH ---------------- */
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/inventory');

      const cleanProducts: Product[] = (res.data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        images: p.images,
        displayStock: p.displayStock ?? 0,
        displayPrice: p.displayPrice ?? 0,
      }));

      setProducts(cleanProducts);
    } catch (err) {
      console.error('Inventory sync failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /* ---------------- FILTER ---------------- */
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  /* ---------------- STOCK HANDLING ---------------- */
  const handleStockChange = (id: string, value: number) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleSaveAll = async () => {
    if (!Object.keys(updates).length) return;

    try {
      setSaving(true);
      await api.patch('/vendor/inventory/bulk-stock', { updates });
      await fetchInventory();
      setUpdates({});
    } catch {
      alert('Failed to save stock updates');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-40 text-zinc-100 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Inventory
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Stock Synchronization Matrix
          </p>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <Bell size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-10 mt-10">

        {/* SEARCH INPUT */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH SKU / SERIAL NUMBER..."
            className="w-full pl-12 pr-6 py-4 bg-[#111113] border border-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-zinc-700 transition-all shadow-xl placeholder-zinc-600"
          />
        </div>

        {/* STATS MATRIX */}
        <div className="grid grid-cols-2 gap-6">
          <StatCard
            icon={<Package size={16} />}
            label="Total SKU Allocation"
            value={`${products.length} Products`}
          />
          <StatCard
            icon={<AlertTriangle size={16} />}
            label="Critical Low Threshold"
            value={`${products.filter(p => p.displayStock <= 5).length} Units`}
            isCritical={products.filter(p => p.displayStock <= 5).length > 0}
          />
        </div>

        {/* INVENTORY TRACK NODE CONTAINER */}
        <div className="space-y-4">
          {filteredProducts.length ? (
            filteredProducts.map((item) => {
              const stock = updates[item.id] ?? item.displayStock;
              const isModified = updates[item.id] !== undefined;

              return (
                <div key={item.id} className="bg-[#111113] p-6 rounded-2xl border border-zinc-900 shadow-xl transition-all hover:border-zinc-800">

                  {/* INFO GRID */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={item.images?.[0]?.imageUrl || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover bg-zinc-950 border border-zinc-900 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h3 className="text-xs font-medium text-white tracking-wide truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        SKU_{item.id.slice(-6).toUpperCase()}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5 shrink-0">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Available</p>
                      <p className={`text-lg font-mono font-light ${isModified ? 'text-amber-500 font-normal' : 'text-zinc-200'}`}>
                        {stock}
                      </p>
                    </div>
                  </div>

                  {/* INC/DEC LOGIC CONTROLS */}
                  <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900/60 p-2.5 rounded-xl">
                    <button
                      onClick={() => handleStockChange(item.id, stock - 1)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all active:scale-90 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-xs font-mono text-zinc-400 font-medium">
                      Adjust Node Units
                    </span>

                    <button
                      onClick={() => handleStockChange(item.id, stock + 1)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all active:scale-90 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* FLOAT SAVE NOTIFICATION SYSTEM CONTAINER */}
      {!!Object.keys(updates).length && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-6 duration-300 w-[calc(100%-3rem)] max-w-sm">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="w-full bg-zinc-100 text-zinc-950 font-bold uppercase text-[10px] tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl hover:bg-white disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="animate-spin text-zinc-950" size={14} />
            ) : (
              <>
                <Save size={14} />
                Commit Bulk Stock Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

function StatCard({ icon, label, value, isCritical }: { icon: React.ReactNode, label: string, value: string, isCritical?: boolean }) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
       <div className="space-y-2 min-w-0 flex-1 pr-2">
         <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase truncate">{label}</p>
         <h2 className={`text-xl font-light font-mono tracking-tight truncate leading-none ${isCritical ? 'text-[#991b1b] font-normal' : 'text-white'}`}>
           {value}
         </h2>
       </div>
       <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner shrink-0 ${isCritical ? 'text-[#991b1b]' : 'text-zinc-400 group-hover:text-white transition-all'}`}>
         {icon}
       </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Indexing Stock Units Matrix...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#111113] border border-zinc-900 rounded-2xl">
      <Inbox size={32} strokeWidth={1} className="text-zinc-700" />
      <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-600">No batch lines found in active registry</p>
    </div>
  );
}