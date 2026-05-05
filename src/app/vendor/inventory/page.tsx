'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, Save, Loader2, Bell,
  Package, Search, ArrowUpRight, Plus, Minus, Inbox, MoreHorizontal
} from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { 
    fetchInventory(); 
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/inventory'); 

      // Filter deleted and inactive products + calculate display stock
      const activeProducts = (res.data || []).filter((p: any) => 
        p.isDeleted !== true && p.isActive !== false
      ).map((p: any) => {
        // Calculate total stock from variants if available
        const totalStock = p.variants && p.variants.length > 0 
          ? p.variants.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0)
          : Number(p.stock) || 0;

        return {
          ...p,
          displayStock: totalStock
        };
      });

      setProducts(activeProducts);
    } catch (e) {
      console.error("Inventory sync failed", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleStockChange = (productId: string, newQuantity: number) => {
    setUpdates(prev => ({ ...prev, [productId]: Math.max(0, newQuantity) }));
  };

  const handleSaveAll = async () => {
    if (Object.keys(updates).length === 0) return;
    setSaving(true);
    try {
      await api.patch('/vendor/inventory/bulk-stock', { updates });
      await fetchInventory();   // Refresh to get latest stock
      setUpdates({});
    } catch (e) {
      alert("Failed to save stock updates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] pb-40 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-xl px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Inventory
          </h1>
          <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 italic">Stock Synchronization</p>
        </div>
        <button className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white active:scale-90 transition-all">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0A0F1C]" />
        </button>
      </div>

      <div className="px-6 space-y-10 mt-8">
        
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH REGISTRY ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all shadow-2xl" 
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2.2rem] bg-blue-600 border border-blue-500 shadow-xl shadow-blue-900/20">
            <Package size={20} className="text-white mb-6" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-100 mb-1.5">Total SKU</p>
            <h2 className="text-xl font-black text-white italic">{products.length} Products</h2>
          </div>
          <div className="p-6 rounded-[2.2rem] bg-white/5 border border-white/10">
            <AlertTriangle size={20} className="text-orange-500 mb-6" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Critical Units</p>
            <h2 className="text-xl font-black text-white italic">
              {products.filter(p => p.displayStock <= 5).length} SKU
            </h2>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Manifest Registry</h3>
            <button className="p-2 bg-white/5 rounded-xl text-blue-500 hover:bg-white/10 transition-colors">
              <MoreHorizontal size={18}/>
            </button>
          </div>

          <div className="space-y-4">
            {filteredProducts.length > 0 ? filteredProducts.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-[2.2rem] animate-in fade-in duration-500 active:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden border border-white/10 shrink-0 shadow-inner">
                    <img 
                      src={item.images?.[0]?.imageUrl || '/placeholder.jpg'} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white uppercase italic truncate leading-none">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        SKU_{item.id?.slice(-8).toUpperCase()}
                      </p>
                      {item.displayStock <= 5 && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Stock</p>
                    <p className="text-lg font-black text-white italic tracking-tighter">
                      {updates[item.id] ?? item.displayStock} Units
                    </p>
                  </div>
                </div>

                {/* Stock Adjustment */}
                <div className="flex items-center justify-between bg-[#0F172A] p-3 rounded-[1.5rem] border border-white/5 shadow-inner">
                  <button 
                    onClick={() => handleStockChange(item.id, (updates[item.id] ?? item.displayStock) - 1)}
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex flex-col items-center">
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Stock Adjustment</p>
                    <span className="text-sm font-black text-blue-500 italic">
                      {updates[item.id] ?? item.displayStock} Units
                    </span>
                  </div>
                  <button 
                    onClick={() => handleStockChange(item.id, (updates[item.id] ?? item.displayStock) + 1)}
                    className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-blue-900/40"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )) : <EmptyState />}
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      {Object.keys(updates).length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[92%] lg:w-auto animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#1E293B] p-5 lg:p-6 rounded-[2rem] shadow-2xl flex items-center justify-between gap-8 border border-white/10 backdrop-blur-xl ring-1 ring-white/5">
            <div className="flex flex-col">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Registry Sync Pending</p>
              <p className="text-white text-xs font-black italic">{Object.keys(updates).length} Nodes Modified</p>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Deploy Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table (optional) */}
      <div className="hidden lg:block px-10 mt-10">
        {/* ... your desktop table if needed */}
      </div>
    </div>
  );
}

/* Sub Components */
function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F1C] gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-500 italic animate-pulse">
        Synchronizing Inventory Hub...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center text-slate-600 flex flex-col items-center gap-4 border-2 border-dashed border-white/5 rounded-[2.5rem]">
      <Inbox size={64} className="opacity-20" />
      <p className="font-black uppercase text-[10px] tracking-[0.3em]">No items in manifest</p>
    </div>
  );
}