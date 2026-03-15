"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Package, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Tag, 
  Store,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

interface Product {
  id: string;
  name: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  vendor: { storeName: string };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch specifically pending products for moderation
      const { data } = await api.get("/admin/products/pending");
      setProducts(data);
    } catch (error) {
      toast.error("SYSTEM ERROR: Failed to sync inventory nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(`/admin/products/${id}/status`, { status });
      toast.success(`PROTOCOL UPDATED: Item ${status.toLowerCase()} successfully.`);
      fetchProducts();
    } catch (error) {
      toast.error("OVERRIDE FAILED: Conflict in inventory signal.");
    }
  };

  const handleToggleVisibility = async (id: string, currentActive: boolean) => {
    try {
      await api.patch(`/admin/products/${id}/visibility`, { isActive: !currentActive });
      toast.success(`VISIBILITY: ${!currentActive ? 'Enabled' : 'Disabled'}`);
      fetchProducts();
    } catch (error) {
      toast.error("OVERRIDE FAILED: Visibility toggle failed.");
    }
  };

const filteredProducts = products.filter(p => {
  const searchTerm = search.toLowerCase();
  
  // Safely access name and storeName with fallbacks to empty strings
  const productName = (p.name ?? "").toLowerCase();
  const storeName = (p.vendor?.storeName ?? "").toLowerCase();

  return productName.includes(searchTerm) || storeName.includes(searchTerm);
});
  return (
    <div className="p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/50 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Inventory // Quality Control</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Product <span className="text-zinc-600">Moderation</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Protocol: Asset Verification & Deployment
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-blue-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-black border border-zinc-800 rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-zinc-600 mr-3" />
            <input 
              type="text"
              placeholder="SEARCH ASSETS OR STORES..."
              className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest uppercase w-full md:w-64 placeholder:text-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* PRODUCT DATA TABLE */}
      <div className="rounded-2xl border border-zinc-800 bg-[#050505] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                <th className="p-6">Asset Details</th>
                <th className="p-6">Origin Node</th>
                <th className="p-6">Valuation</th>
                <th className="p-6">Visibility</th>
                <th className="p-6 text-right">Moderation Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="p-10 bg-zinc-900/10"></td></tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-blue-500">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 uppercase tracking-tight">{product.name}</p>
                        <p className="text-[9px] text-zinc-600 font-mono italic">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Store size={14} className="text-zinc-700" />
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.vendor.storeName}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Tag size={12} className="text-zinc-700" />
                      <span className="text-sm font-black text-zinc-200 uppercase tracking-tighter italic">₦{product.price.toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <button 
                      onClick={() => handleToggleVisibility(product.id, product.isActive)}
                      className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border transition-all ${
                        product.isActive 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                        : "bg-zinc-900 text-zinc-600 border-zinc-800"
                      }`}
                    >
                      {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.isActive ? "Visible" : "Hidden"}
                    </button>
                  </td>

                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleStatusUpdate(product.id, 'REJECTED')}
                        className="p-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all shadow-[0_0_15px_rgba(225,29,72,0.05)]"
                        title="Reject Protocol"
                      >
                        <XCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(product.id, 'APPROVED')}
                        className="p-2.5 rounded-xl border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        title="Authorize Protocol"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="p-16 text-center text-zinc-600">
            <AlertCircle className="mx-auto mb-4 opacity-20" size={48} />
            <p className="text-xs font-mono uppercase tracking-[0.2em]">Zero pending assets detected in queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}