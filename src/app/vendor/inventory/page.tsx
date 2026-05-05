'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AlertTriangle, Save, Loader2, Bell,
  Package, Search, Plus, Minus, Inbox, MoreHorizontal
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

      // ✅ TRUST BACKEND (NO MORE CALCULATIONS HERE)
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
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
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

  /* ---------------- STATES ---------------- */
  if (loading) return <LoadingState />;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#0A0F1C] pb-40">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-xl px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic">
            Inventory
          </h1>
          <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 italic">
            Stock Synchronization
          </p>
        </div>
        <button className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white">
          <Bell size={22} />
        </button>
      </div>

      <div className="px-6 space-y-10 mt-8">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH SKU..."
            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase text-white"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Package size={20} />}
            label="Total SKU"
            value={`${products.length} Products`}
            highlight
          />
          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Critical Units"
            value={`${products.filter(p => p.displayStock <= 5).length} SKU`}
          />
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredProducts.length ? (
            filteredProducts.map((item) => {
              const stock = updates[item.id] ?? item.displayStock;

              return (
                <div key={item.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/10">

                  {/* INFO */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={item.images?.[0]?.imageUrl || '/placeholder.jpg'}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-white font-black uppercase">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        SKU_{item.id.slice(-6)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-blue-400">Stock</p>
                      <p className="text-lg text-white font-black">
                        {stock}
                      </p>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex justify-between bg-[#0F172A] p-3 rounded-xl">
                    <button
                      onClick={() => handleStockChange(item.id, stock - 1)}
                    >
                      <Minus />
                    </button>

                    <span className="text-blue-400 font-bold">
                      {stock}
                    </span>

                    <button
                      onClick={() => handleStockChange(item.id, stock + 1)}
                    >
                      <Plus />
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

      {/* SAVE BAR */}
      {!!Object.keys(updates).length && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-blue-600 px-6 py-4 rounded-xl text-white font-bold"
          >
            {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ icon, label, value, highlight }: any) {
  return (
    <div className={`p-6 rounded-2xl ${highlight ? 'bg-blue-600' : 'bg-white/5'}`}>
      {icon}
      <p className="text-xs mt-4 text-slate-400">{label}</p>
      <h2 className="text-white font-black">{value}</h2>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#0A0F1C]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center text-slate-500">
      <Inbox size={40} />
      <p>No inventory found</p>
    </div>
  );
}