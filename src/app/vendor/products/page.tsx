'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Package, Edit2, Trash2, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '@/src/lib/axios';

import CreateProductModal from '@/src/components/dashboard/CreateProductModal';
import EditProductModal from '@/src/components/dashboard/EditProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/my-products');
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductDisplayInfo = (p: any) => {
    if (!p.variants || p.variants.length === 0) {
      return {
        displayPrice: Number(p.price) || 0,
        displayStock: Number(p.stock) || 0,
      };
    }

    const prices = p.variants.map((v: any) => Number(v.price) || 0).filter(Boolean);
    const stocks = p.variants.map((v: any) => Number(v.stock) || 0);

    return {
      displayPrice: prices.length > 0 ? Math.min(...prices) : Number(p.price) || 0,
      displayStock: stocks.reduce((sum: number, s: number) => sum + s, 0),
    };
  };

  const resolveImage = (p: any) => {
    const mainImg = p.images?.[0]?.imageUrl || p.images?.[0];
    const variantImg = p.variants?.[0]?.images?.[0]?.imageUrl || p.variants?.[0]?.images?.[0];
    const path = mainImg || variantImg;
    return path || '/placeholder.jpg';
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const id = (p.id || '').toLowerCase();
      return title.includes(searchQuery.toLowerCase()) || id.includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, products]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this product asset from registry?')) return;

    setIsDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete product asset.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  if (loading) return <LoadingRegistry />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-32 animate-in fade-in duration-700">
      
      <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        
        {/* 1. BRANDED HEADER CONFIGURATION */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pb-6 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl font-light text-white uppercase tracking-widest font-sans">
              Catalogue Hub
            </h1>
            <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-[0.2em] mt-1.5">
              Product Manifest & Visibility Matrix
            </p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-[#991B1B] text-white px-6 py-3.5 rounded-xl font-mono font-bold uppercase tracking-wider text-[10px] hover:bg-[#7f1616] flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#991B1B] shadow-xl shadow-[#991B1B]/5 active:scale-98"
          >
            <Plus size={14} /> Initialize New Product
          </button>
        </div>

        {/* 2. REGISTRY FILTER BAR */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder="Search manifest by title or configuration id..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-[#111113] border border-zinc-900 rounded-xl text-xs font-mono tracking-wide text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors" 
          />
        </div>

        {/* 3. DESKTOP REGISTRY LEDGER */}
        <div className="hidden lg:block bg-[#111113] rounded-xl shadow-2xl border border-zinc-900 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/60 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900/60">
                <th className="p-5 pl-6">Registry Manifest</th>
                <th className="p-5">Classification</th>
                <th className="p-5 text-center">Settlement Price</th>
                <th className="p-5 text-center">Inventory Matrix</th>
                <th className="p-5 text-center">Protocol Status</th>
                <th className="p-5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40">
              {filteredProducts.map((p) => {
                const { displayPrice, displayStock } = getProductDisplayInfo(p);

                return (
                  <tr key={p.id} className="hover:bg-zinc-950/20 transition-colors">
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900 shrink-0">
                          <img src={resolveImage(p)} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" alt="" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-zinc-200 text-xs uppercase tracking-wide">{p.title}</p>
                          <p className="text-[9px] text-zinc-600 font-mono mt-1">NODE_ID: {p.id?.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      {p.category?.name || 'General'}
                    </td>
                    <td className="p-5 text-center font-mono font-bold text-zinc-100">
                      ₦{displayPrice.toLocaleString()}
                    </td>
                    <td className="p-5 text-center font-mono font-bold text-zinc-300">
                      {displayStock} <span className="text-[9px] text-zinc-600 font-bold ml-0.5">UNITS</span>
                    </td>
                    <td className="p-5 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-900 cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          disabled={isDeleting === p.id}
                          className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-rose-500 rounded-lg transition-colors border border-zinc-900 cursor-pointer"
                        >
                          {isDeleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. MOBILE LAYOUT FRAMEWORK */}
        <div className="lg:hidden space-y-4">
          {filteredProducts.map((p) => {
            const { displayPrice, displayStock } = getProductDisplayInfo(p);
            return (
              <div key={p.id} className="bg-[#111113] rounded-xl p-5 border border-zinc-900 shadow-xl">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900 shrink-0">
                    <img src={resolveImage(p)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="font-mono font-bold text-zinc-200 uppercase text-xs tracking-wide truncate">{p.title}</h3>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">ID: {p.id?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-xs font-mono font-bold text-white">₦{displayPrice.toLocaleString()}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-zinc-950/50 px-4 py-2.5 rounded-lg border border-zinc-900/60 mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Package size={12} className="text-zinc-600" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                      {displayStock} Units Stocked
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    {p.category?.name || 'General'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(p)}
                    className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={11} /> Edit Manifest
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2.5 bg-zinc-950 text-zinc-500 hover:text-rose-500 rounded-lg border border-zinc-900 cursor-pointer"
                  >
                    {isDeleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. NULL EXCEPTION HOOKS */}
        {products.length === 0 && <EmptyState />}
        {products.length > 0 && filteredProducts.length === 0 && (
          <div className="text-center bg-[#111113] border border-zinc-900 rounded-xl py-14">
            <p className="text-xs text-zinc-500 font-mono font-bold uppercase tracking-widest">
              No matching records found in system ledger
            </p>
          </div>
        )}
      </div>

      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProducts} 
      />

      <EditProductModal 
        isOpen={isEditModalOpen} 
        product={selectedProduct} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }} 
        onRefresh={fetchProducts} 
      />
    </div>
  );
}

/* --- UTILITY SUB-COMPONENTS --- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: 'bg-zinc-950 text-emerald-500 border-zinc-900/80',
    PENDING: 'bg-zinc-950 text-amber-500 border-zinc-900/80',
    REJECTED: 'bg-zinc-950 text-rose-500 border-zinc-900/80',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold border uppercase tracking-wider inline-block ${styles[status] || 'bg-zinc-950 text-zinc-500 border-zinc-900'}`}>
      {status}
    </span>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <Loader2 className="animate-spin text-[#991B1B]" size={36} />
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
        Synchronizing Catalogue Registry Node...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center border border-zinc-900 border-dashed rounded-xl flex flex-col items-center gap-4 bg-[#111113]/40">
      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl text-zinc-700">
        <AlertCircle size={24} />
      </div>
      <div className="space-y-1.5">
        <p className="text-zinc-400 font-mono font-bold uppercase text-[10px] tracking-widest">Registry Node Empty</p>
        <p className="text-zinc-600 text-[9px] uppercase font-mono tracking-tight">
          Initialize a production asset to begin catalog placement cycles.
        </p>
      </div>
    </div>
  );
}