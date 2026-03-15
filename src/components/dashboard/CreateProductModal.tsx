'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

export default function CreateProductModal({ isOpen, onClose, onRefresh }: any) {
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

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setMainCategories(res.data);
    } catch (e) { console.error("Categories fetch failed"); }
  };

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
    if (!formData.categoryId) return alert("Please select the final Sub-Category");
    
    setLoading(true);
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: images 
      });
      onRefresh();
      onClose();
      resetForm();
    } catch (error) {
      alert("Error creating product");
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setImages([]);
    setFormData({ title: '', description: '', price: '', stock: '', categoryId: '' });
    setMainCatId('');
    setSecondaryCatId('');
    setSecondaryCategories([]);
    setTertiaryCategories([]);
  };

  if (!isOpen) return null;

  // Shared Tailwind classes for bold, high-visibility inputs
  const inputClasses = "w-full p-5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none focus:border-orange-500 transition-all placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-black uppercase text-slate-600 mb-2 block ml-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">List New Product</h2>
            <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mt-1">Inventory Management Console</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-900"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Left Side: Images & Categories */}
          <div className="space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-slate-900">
                  <ImageIcon size={16} strokeWidth={3} />
                  <span className={labelClasses + " mb-0"}>Product Gallery (Max 4)</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-sm">
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={24} strokeWidth={3} /></button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all text-slate-400 group">
                    {isUploading ? <Loader2 size={32} className="animate-spin text-orange-600" /> : <Plus size={48} strokeWidth={3} className="group-hover:text-orange-500" />}
                    <input type="file" multiple hidden onChange={handleImageUpload} accept="image/*" />
                  </label>
                )}
               </div>
            </div>

            {/* BOLD CATEGORY SELECTORS */}
            <div className="space-y-6 bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-800 shadow-xl">
              <h3 className="text-[11px] font-black uppercase text-orange-500 mb-2 tracking-[0.2em]">Categorization Matrix</h3>
              
              <div className="space-y-4">
                {/* Level 1 */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block ml-1">1. Department</label>
                  <select required value={mainCatId} className={inputClasses + " bg-slate-800 border-slate-700 text-black"} onChange={e => handleMainChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Department</option>
                    {mainCategories.map((c: any) => <option key={c.id} value={c.id} className="text-slate-900 font-bold">{c.name}</option>)}
                  </select>
                </div>

                {/* Level 2 */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block ml-1">2. Category</label>
                  <select required disabled={!secondaryCategories.length} value={secondaryCatId} className={inputClasses + " bg-slate-800 text-black border-slate-700  disabled:opacity-30"} onChange={e => handleSecondaryChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Category</option>
                    {secondaryCategories.map((s: any) => <option key={s.id} value={s.id} className="text-slate-900 font-bold">{s.name}</option>)}
                  </select>
                </div>

                {/* Level 3 - ALWAYS VISIBLE BUT DISABLED IF NO DATA */}
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

          {/* Right Side: Details */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Product Title</label>
              <input required placeholder="e.g. iPhone 15 Pro Max - 256GB" className={inputClasses} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClasses}>Price (₦)</label>
                <input type="number" required placeholder="0.00" className={inputClasses} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>Stock Units</label>
                <input type="number" required placeholder="QTY" className={inputClasses} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Product Description</label>
              <textarea required placeholder="Describe the item features, condition, and specs..." className={inputClasses + " h-[180px] resize-none font-bold"} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <button 
              type="submit" 
              disabled={loading || isUploading} 
              className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:bg-slate-400"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}