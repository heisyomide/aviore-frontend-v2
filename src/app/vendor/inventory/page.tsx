'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  AlertTriangle, Download, Upload, Save, Loader2, 
  Package, Search, Filter, ArrowUpRight, ArrowDown 
} from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/inventory'); 
      setProducts(res.data);
    } catch (e) {
      console.error("Inventory sync failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
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
      await fetchInventory();
      setUpdates({});
    } catch (e) {
      alert("Fulfillment Node Error: Sync Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 🚀 EXECUTIVE HEADER */}
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory Registry</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Hardware Stock Synchronization Node</p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="SEARCH BY ID/TITLE..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all" 
              />
            </div>
            <button className="hidden lg:flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* 📱 MOBILE VIEW: Unit Registry Cards */}
        <div className="lg:hidden space-y-4">
          {filteredProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                  <img src={item.images[0]?.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 uppercase italic truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">SKU: {item.id.slice(-8)}</span>
                    {item.stock <= 5 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="text-center flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Current</p>
                  <p className="text-xl font-black text-slate-900 italic">{item.stock}</p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div className="flex-1 flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleStockChange(item.id, (updates[item.id] ?? item.stock) - 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 active:scale-90 transition-transform"
                  >
                    -
                  </button>
                  <span className="text-xl font-black text-blue-600 italic">
                    {updates[item.id] ?? item.stock}
                  </span>
                  <button 
                    onClick={() => handleStockChange(item.id, (updates[item.id] ?? item.stock) + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP VIEW: High-Density Table */}
        <div className="hidden lg:block bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Product Manifest</th>
                <th className="p-6 text-center">Registry Node</th>
                <th className="p-6 text-center">Unit Status</th>
                <th className="p-6 text-center">Current Stock</th>
                <th className="p-6 text-right">Adjustment Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <img src={item.images[0]?.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      </div>
                      <p className="font-black text-slate-900 text-sm uppercase italic leading-none">{item.title}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center text-[10px] font-mono font-black text-slate-300">#{item.id.slice(-8).toUpperCase()}</td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center">
                      {item.stock <= 5 ? (
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase border border-red-100 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={10} /> Critical
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase border border-green-100">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-center font-black text-slate-900 italic text-lg">{item.stock}</td>
                  <td className="p-6 text-right">
                    <div className="inline-flex items-center gap-2 bg-slate-900 p-1 rounded-xl">
                      <input 
                        type="number" 
                        defaultValue={item.stock}
                        onChange={(e) => handleStockChange(item.id, Number(e.target.value))}
                        className="w-16 bg-transparent text-center text-blue-500 text-sm font-black outline-none appearance-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🏁 FLOATING ACTION BAR: Only shows when changes are pending */}
      {Object.keys(updates).length > 0 && (
        <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] lg:w-auto animate-in slide-in-from-bottom-10">
          <div className="bg-[#0F172A] p-4 lg:p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-8 border border-slate-700/50 backdrop-blur-md">
            <div className="flex flex-col">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registry Queue</p>
              <p className="text-white text-xs font-black italic">{Object.keys(updates).length} Nodes Modified</p>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Sync Live</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Syncing Hardware Inventory Registry...</p>
    </div>
  );
}