"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Package, Trash2, ChevronRight, FolderTree, List, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  parent?: { 
    name: string;
    parent?: { name: string }; 
  };
  _count: { products: number; children: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await api.post("/admin/categories", { 
        name: categoryName, 
        parentId: selectedParentId || undefined 
      });
      toast.success("Category created successfully!");
      setCategoryName("");
      setSelectedParentId("");
      fetchCategories();
    } catch (error) {
      toast.error("Could not create category.");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2 text-purple-500 mb-2">
          <FolderTree size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Store Management</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Product <span className="text-purple-500">Categories</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2">Add or manage your shop categories and subcategories.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* ADD CATEGORY FORM */}
        <div className="xl:col-span-1">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#090909] space-y-6 shadow-xl sticky top-8">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Plus size={18} className="text-purple-500" /> New Category
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Name</label>
                <input 
                  type="text" 
                  value={categoryName} 
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Parent Category</label>
                <select 
                  value={selectedParentId} 
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.parent ? `↳ ${c.name}` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                Save Category
              </button>
            </form>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="xl:col-span-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#090909] shadow-xl overflow-hidden">
            {/* Added overflow-x-auto to prevent the Actions column from being cut off */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 text-[10px] md:text-[11px] uppercase tracking-widest font-black border-b border-zinc-800">
                    <th className="p-5 w-[25%]">Category</th>
                    <th className="p-5 w-[40%]">Breadcrumbs</th>
                    <th className="p-5 w-[20%]">Stats</th>
                    <th className="p-5 w-[15%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center">
                        <Loader2 className="animate-spin text-purple-500 mx-auto" />
                      </td>
                    </tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <Tag size={16} className={cat.parentId ? "text-zinc-600" : "text-purple-500"} />
                          <span className={`font-bold text-sm ${!cat.parentId ? 'text-zinc-100' : 'text-zinc-400'}`}>
                            {cat.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase bg-black/40 px-3 py-1.5 rounded-full w-fit max-w-full">
                          {cat.parent?.parent && (
                            <><span className="text-zinc-600 truncate">{cat.parent.parent.name}</span> <ChevronRight size={10} /></>
                          )}
                          {cat.parent && (
                            <><span className="text-zinc-500 truncate">{cat.parent.name}</span> <ChevronRight size={10} /></>
                          )}
                          <span className="text-purple-400 truncate">{cat.name}</span>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="text-[10px] font-bold space-y-1 uppercase tracking-tighter">
                          <p className="flex items-center gap-1.5 text-zinc-400">
                            <Package size={12} className="text-zinc-600" /> {cat._count.products} Items
                          </p>
                          <p className="flex items-center gap-1.5 text-zinc-500">
                            <List size={12} /> {cat._count.children} Children
                          </p>
                        </div>
                      </td>

                      <td className="p-5 text-right">
                        <button 
                          className="inline-flex p-2.5 text-zinc-600 hover:text-red-500 transition-all bg-zinc-900 border border-zinc-800 rounded-lg"
                          onClick={() => {/* Add Delete Logic */}}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}