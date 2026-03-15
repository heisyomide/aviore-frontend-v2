'use client';
import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, Edit2, Trash2, Loader2, AlertCircle, X } from 'lucide-react';
import { api } from '@/src/lib/axios';
import CreateProductModal from '@/src/components/dashboard/CreateProductModal';
import EditProductModal from '@/src/components/dashboard/EditProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  // 1. Fetch Vendor Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/my-products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Optimized Search Filter
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  // 3. Soft Delete Logic
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action is reversible by admin.')) return;
    setIsDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Delete failed. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };


    const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };


  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Inventory...</p>
    </div>
  );

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Products</h1>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Store Catalog & Stock Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-orange-700 flex items-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Modern Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or product ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-12 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 transition-all" 
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full">
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Product Details</th>
                <th className="p-6">Category</th>
                <th className="p-6 text-center">Price</th>
                <th className="p-6 text-center">Inventory</th>
                <th className="p-6">Visibility</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                        {p.images?.[0] ? (
                          <img src={p.images[0].imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base line-clamp-1">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase mt-0.5">ID: {p.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 rounded-full text-slate-500 uppercase tracking-widest">
                      {p.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <p className="font-black text-slate-900 text-base">₦{Number(p.price).toLocaleString()}</p>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                        {p.stock} units
                      </span>
                      {p.stock < 10 && (
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter animate-pulse">Low Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleEditClick(p)} // 👈 Attach edit handler
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting === p.id}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-90 shadow-sm"
                      >
                        {isDeleting === p.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-4 bg-white">
            <div className="bg-slate-50 p-6 rounded-[2.5rem]">
              <AlertCircle size={48} className="text-slate-200" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Inventory is empty</p>
              <p className="text-slate-300 text-xs">No products match your current search criteria.</p>
            </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
    REJECTED: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-4 py-2 rounded-full text-[9px] font-black border uppercase tracking-widest ${styles[status] || 'bg-slate-50 text-slate-400'}`}>
      {status}
    </span>
  );
}