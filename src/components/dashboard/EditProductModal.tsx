'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

export default function EditProductModal({ isOpen, onClose, onRefresh, product }: any) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Category State Levels
  const [mainCategories, setMainCategories] = useState<any[]>([]); 
  const [secondaryCategories, setSecondaryCategories] = useState<any[]>([]);
  const [tertiaryCategories, setTertiaryCategories] = useState<any[]>([]);

  // Selection IDs
  const [mainCatId, setMainCatId] = useState('');
  const [secondaryCatId, setSecondaryCatId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });

  // 1. Hydrate Form and Determine 3-Level Hierarchy
  useEffect(() => {
    const hydrateForm = async () => {
      if (isOpen && product) {
        try {
          const res = await api.get('/categories');
          const allCats = res.data;
          setMainCategories(allCats);

          // Logic to find where this product fits in the 3-level tree
          let foundMainId = '';
          let foundSecondaryId = '';
          let secondaryList: any[] = [];
          let tertiaryList: any[] = [];

          allCats.forEach((main: any) => {
            main.children?.forEach((sec: any) => {
              // If the product is in the 3rd level (Tertiary)
              if (sec.children?.some((tert: any) => tert.id === product.categoryId)) {
                foundMainId = main.id;
                foundSecondaryId = sec.id;
                secondaryList = main.children;
                tertiaryList = sec.children;
              } 
              // If the product is in the 2nd level (Secondary)
              else if (sec.id === product.categoryId) {
                foundMainId = main.id;
                foundSecondaryId = sec.id;
                secondaryList = main.children;
                tertiaryList = sec.children || [];
              }
            });
          });

          setMainCatId(foundMainId);
          setSecondaryCatId(foundSecondaryId);
          setSecondaryCategories(secondaryList);
          setTertiaryCategories(tertiaryList);

          setFormData({
            title: product.title,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            categoryId: product.categoryId
          });
          setImages(product.images?.map((img: any) => img.imageUrl) || []);
        } catch (e) {
          console.error("Hydration failed", e);
        }
      }
    };

    hydrateForm();
  }, [isOpen, product]);

  const handleMainChange = (id: string) => {
    setMainCatId(id);
    const selected = mainCategories.find(c => c.id === id);
    setSecondaryCategories(selected?.children || []);
    setSecondaryCatId('');
    setTertiaryCategories([]);
    setFormData(prev => ({ ...prev, categoryId: '' }));
  };

  const handleSecondaryChange = (id: string) => {
    setSecondaryCatId(id);
    const selected = secondaryCategories.find(c => c.id === id);
    const children = selected?.children || [];
    setTertiaryCategories(children);
    setFormData(prev => ({ 
      ...prev, 
      categoryId: children.length === 0 ? id : '' 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...urls].slice(0, 4));
    } catch (err) {
      alert("Upload failed.");
    } finally { setIsUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Please select a final Sub-Category");
    
    setLoading(true);
    try {
      await api.patch(`/products/${product.id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: images 
      });
      onRefresh();
      onClose();
    } catch (error) {
      alert("Update failed.");
    } finally { setLoading(false); }
  };

  if (!isOpen || !product) return null;

  // Shared BOLD styles
  const inputClasses = "w-full p-5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none focus:border-orange-500 transition-all";
  const labelClasses = "text-[11px] font-black uppercase text-slate-600 mb-2 block ml-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Edit Listing</h2>
            <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mt-1">Product ID: {product.id.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-4 bg-white shadow-sm border border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Left Column: Images & Categories */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <ImageIcon size={16} strokeWidth={3} className="text-slate-900" />
                 <p className={labelClasses + " mb-0"}>Manage Gallery (Max 4)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-sm">
                    <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button 
                      type="button" 
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 size={24} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all text-slate-300">
                    {isUploading ? <Loader2 className="animate-spin text-orange-600" /> : <Plus size={48} strokeWidth={3} />}
                    <input type="file" multiple hidden onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* DARK BOLD CATEGORY PANEL */}
            <div className="space-y-6 bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-800 shadow-xl">
              <h3 className="text-[11px] font-black uppercase text-orange-500 mb-2 tracking-[0.2em]">Update Classification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block ml-1">1. Department</label>
                  <select required value={mainCatId} className={inputClasses + " bg-slate-800 border-slate-700 text-black"} onChange={e => handleMainChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Department</option>
                    {mainCategories.map((c: any) => <option key={c.id} value={c.id} className="text-slate-900 font-bold">{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block ml-1">2. Category</label>
                  <select required disabled={!secondaryCategories.length} value={secondaryCatId} className={inputClasses + " bg-slate-800 border-slate-700 text-black disabled:opacity-30"} onChange={e => handleSecondaryChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Category</option>
                    {secondaryCategories.map((s: any) => <option key={s.id} value={s.id} className="text-slate-900 font-bold">{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block ml-1">3. Sub-Category</label>
                  <select 
                    required 
                    disabled={!tertiaryCategories.length}
                    className={inputClasses + " bg-slate-800 border-orange-900/50 text-black disabled:opacity-30"} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    value={formData.categoryId}
                  >
                    <option value="" className="text-slate-900">Select Sub-Category</option>
                    {tertiaryCategories.map((t: any) => <option key={t.id} value={t.id} className="text-slate-900 font-bold">{t.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Product Title</label>
              <input 
                required value={formData.title}
                className={inputClasses}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClasses}>Price (₦)</label>
                <input 
                  type="number" required value={formData.price}
                  className={inputClasses}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>Current Stock</label>
                <input 
                  type="number" required value={formData.stock}
                  className={`${inputClasses} ${Number(formData.stock) < 5 ? 'border-red-500 text-red-600 bg-red-50' : ''}`}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea 
                required rows={6} value={formData.description}
                className={inputClasses + " h-[180px] resize-none font-bold"}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" disabled={loading || isUploading}
                className="flex-[2] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-2xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Listing</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}