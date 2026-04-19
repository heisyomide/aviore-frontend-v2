'use client';
import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, Edit2, Trash2, Loader2, AlertCircle} from 'lucide-react';
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


  const resolveImage = (p: any) => {
  const img = p.images?.[0];

  if (!img) return '/placeholder.png';

  const path =
    typeof img === 'string'
      ? img
      : img.imageUrl;

  if (!path) return '/placeholder.png';

  return path.startsWith('http')
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path.replace(/^\//, '')}`;
};

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/my-products');
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Inventory_Sync_Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const title = p.title?.toLowerCase() || '';
    const id = p.id?.toLowerCase() || '';

    return (
      title.includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery.toLowerCase())
    );
  });
}, [searchQuery, products]);

  const handleDelete = async (id: string) => {
    if (!confirm('Abort Registry Node? This action removes the product from the public discovery loop.')) return;
    setIsDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('NODE_DESTRUCTION_FAILURE');
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 🚀 EXECUTIVE HEADER */}
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Catalogue Hub</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Product Manifest & Visibility Control</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Initialize New Product
          </button>
        </div>

        {/* SEARCH PROTOCOL */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH REGISTRY BY TITLE OR ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-5 bg-white border border-slate-100 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
          />
        </div>

        {/* 📱 MOBILE VIEW: Catalogue Card Stack */}
        <div className="lg:hidden space-y-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                  <img src={resolveImage(p)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase italic truncate mt-2">{p.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">₦{Number(p.price).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl mb-6">
                 <div className="flex items-center gap-2">
                    <Package size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase italic">{p.stock} Units</span>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.category?.name || 'General'}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(p)}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Edit2 size={14} /> Edit Node
                </button>
<button
  onClick={() => handleDelete(p.id)}
  className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-100"
>
  {isDeleting === p.id ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Trash2 size={16} />
  )}
</button>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP VIEW: High-Density Registry */}
        <div className="hidden lg:block bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Registry Manifest</th>
                <th className="p-6">Category</th>
                <th className="p-6 text-center">Settlement Price</th>
                <th className="p-6 text-center">Inventory</th>
                <th className="p-6 text-center">Visibility</th>
                <th className="p-6 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                       <img src={resolveImage(p)} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm uppercase italic leading-none">{p.title}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1">NODE_ID: {p.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-tighter">{p.category?.name || 'General'}</td>
                  <td className="p-6 text-center font-black text-slate-900 italic">₦{Number(p.price).toLocaleString()}</td>
                  <td className="p-6 text-center font-black text-slate-900 italic">{p.stock} <span className="text-[9px] text-slate-300 ml-1">UNITS</span></td>
                  <td className="p-6 text-center"><StatusBadge status={p.status} /></td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEditClick(p)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-slate-100"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-slate-100"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       {products.length === 0 ? (
  <EmptyState />
) : filteredProducts.length === 0 ? (
  <p className="text-center text-sm text-slate-400 font-bold uppercase">
    No matching products found
  </p>
) : null}
      </div>

      <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchProducts} />
      <EditProductModal isOpen={isEditModalOpen} product={selectedProduct} onClose={() => { setIsEditModalOpen(false); setSelectedProduct(null); }} onRefresh={fetchProducts} />
    </div>
  );
}

/* ------------------ */
/* SUB-COMPONENTS */
/* ------------------ */

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    PENDING: 'bg-orange-50 text-orange-600 border-orange-100 shadow-lg shadow-orange-500/5',
    REJECTED: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest inline-block ${styles[status] || 'bg-slate-50 text-slate-400'}`}>
      {status}
    </span>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Syncing Catalogue Registry...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-32 text-center flex flex-col items-center gap-4 bg-transparent lg:bg-white lg:rounded-4xl lg:border lg:border-slate-50 lg:m-10">
      <div className="bg-slate-50 p-6 rounded-[2.5rem]">
        <AlertCircle size={48} className="text-slate-200" />
      </div>
      <div className="space-y-1 px-10">
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Registry Node Empty</p>
        <p className="text-slate-300 text-[10px] uppercase font-bold tracking-tighter">Initialize a new product to begin discovery cycle</p>
      </div>
    </div>
  );
}