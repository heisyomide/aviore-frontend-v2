'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Download, Upload, Save, Loader2, Package, Search } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Fetches vendor products from your backend
      const res = await api.get('/vendor/inventory'); 
      setProducts(res.data);
    } catch (e) {
      console.error("Inventory fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productId: string, newQuantity: string) => {
    setUpdates(prev => ({
      ...prev,
      [productId]: Number(newQuantity)
    }));
  };

  const handleSaveAll = async () => {
    if (Object.keys(updates).length === 0) return;
    
    setSaving(true);
    try {
      // Send bulk updates to backend
      await api.patch('/vendor/inventory/bulk-stock', { updates });
      await fetchInventory(); // Refresh data
      setUpdates({});
      alert("Inventory synced successfully!");
    } catch (e) {
      alert("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  // UI Helper for bold input styles
  const inputClasses = "w-24 p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-black text-orange-500 text-center outline-none focus:border-orange-500 transition-all";

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin" size={40} strokeWidth={3} />
        <p className="font-black uppercase tracking-widest text-xs">Loading Live Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Package className="text-orange-600" size={28} strokeWidth={3} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Inventory Control</h1>
          </div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Real-time stock synchronization</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Upload size={16} strokeWidth={3} /> Import
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} strokeWidth={3} /> Export
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl overflow-hidden shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Details</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Current Stock</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Adjust Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={item.images[0]?.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm line-clamp-1 uppercase tracking-tight">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {item.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">
                      {item.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-lg font-black text-slate-900">{item.stock}</span>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Units</span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      {item.stock <= 5 ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full font-black text-[10px] uppercase tracking-wider animate-pulse border border-red-100">
                          <AlertTriangle size={12} strokeWidth={3} /> Critical Stock
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full font-black text-[10px] uppercase tracking-wider border border-green-100">
                          Healthy
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <input 
                        type="number" 
                        defaultValue={item.stock}
                        onChange={(e) => handleStockChange(item.id, e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="p-8 bg-slate-50 border-t-2 border-slate-100 flex justify-between items-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
            {Object.keys(updates).length} Pending updates to sync
          </p>
          <button 
            onClick={handleSaveAll}
            disabled={saving || Object.keys(updates).length === 0}
            className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-600 disabled:bg-slate-300 transition-all shadow-xl active:scale-95"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} strokeWidth={3} /> Push Updates Live</>}
          </button>
        </div>
      </div>
    </div>
  );
}