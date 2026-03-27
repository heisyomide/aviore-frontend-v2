'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Image as ImageIcon, Box, Tag, Info, Zap } from 'lucide-react';
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
    } catch (e) { console.error("Registry_Fetch_Failure"); }
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
      alert("Network_Upload_Interrupted");
    } finally { setIsUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Validation Error: Please select the target Sub-Category node");
    
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
      alert("Protocol_Error: Failed to initialize product node");
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

  // Shared Styles
  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";
  const darkSelectClasses = "w-full p-4 lg:p-5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500 transition-all";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F7FE] w-full max-w-5xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 lg:slide-in-from-bottom-0 duration-500 max-h-[95vh] lg:max-h-[90vh] flex flex-col">
        
        {/* HEADER PROTOCOL */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Listing Protocol</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={12} className="text-blue-600" /> Initializing Hardware Node
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto no-scrollbar">
          
          {/* LEFT: MEDIA & CATEGORIES */}
          <div className="space-y-8">
            {/* Image Registry */}
            <div className="space-y-4">
               <label className={labelClasses}>Media Manifest (Max 4)</label>
               <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black uppercase text-[10px]">Remove Node</button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all text-slate-400 group">
                    {isUploading ? <Loader2 size={24} className="animate-spin text-blue-600" /> : <Plus size={32} strokeWidth={3} className="group-hover:text-blue-500" />}
                    <span className="text-[8px] font-black uppercase mt-2 group-hover:text-blue-500">Inject Frame</span>
                    <input type="file" multiple hidden onChange={handleImageUpload} accept="image/*" />
                  </label>
                )}
               </div>
            </div>

            {/* Category Node Matrix */}
            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-[2rem] shadow-xl border border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic">
                <Tag size={12} /> CATEGORIZATION
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">DEPARTMENT</label>
                  <select required value={mainCatId} className={darkSelectClasses} onChange={e => handleMainChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Department</option>
                    {mainCategories.map((c: any) => <option key={c.id} value={c.id} className="text-slate-900 font-bold">{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">CATEGORY</label>
                  <select required disabled={!secondaryCategories.length} value={secondaryCatId} className={darkSelectClasses + " disabled:opacity-20"} onChange={e => handleSecondaryChange(e.target.value)}>
                    <option value="" className="text-slate-900">Select Category</option>
                    {secondaryCategories.map((s: any) => <option key={s.id} value={s.id} className="text-slate-900 font-bold">{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">SUB-CATEGORY</label>
                  <select 
                    required 
                    disabled={!tertiaryCategories.length}
                    className={darkSelectClasses + " border-orange-900/30 disabled:opacity-20"} 
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

          {/* RIGHT: DATA SPECIFICATIONS */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>PRODUCT TITLE</label>
              <input required placeholder="Registry Name..." className={inputClasses} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex-1">
                <label className={labelClasses}>PRICE (₦)</label>
                <input type="number" required placeholder="0.00" className={inputClasses} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>STOCK UNIT</label>
                <input type="number" required placeholder="QTY" className={inputClasses} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>PRODUCT DESCRIPTION</label>
              <textarea required placeholder="Describe the item features, condition, and specs...." className={inputClasses + " h-[160px] lg:h-[200px] resize-none"} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="pt-4 pb-10 lg:pb-0 shrink-0">
               <button 
                type="submit" 
                disabled={loading || isUploading} 
                className="w-full bg-[#1E293B] text-white py-5 lg:py-7 rounded-3xl font-black uppercase tracking-[0.2em] text-xs lg:text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-900/20 active:scale-95 disabled:bg-slate-300"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <><Box size={18} /> CONFIRM & PUBLISH</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}