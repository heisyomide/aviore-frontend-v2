'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Save, Tag, Zap, Palette, Layers, Image as ImageIcon, Box } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

/* ================= TYPES ================= */
interface Category { id: string; name: string; children?: Category[]; }
interface Variant { color: string; sizes: string[]; images: string[]; }
interface Product {
  id: string; title: string; description: string; price: number;
  stock: number; categoryId: string; images: { imageUrl: string }[];
  variants?: any[]; // Coming from backend
}

export default function EditProductModal({ isOpen, onClose, onRefresh, product }: any) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [mainCategories, setMainCategories] = useState<Category[]>([]); 
  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>([]);
  const [tertiaryCategories, setTertiaryCategories] = useState<Category[]>([]);

  const [mainCatId, setMainCatId] = useState('');
  const [secondaryCatId, setSecondaryCatId] = useState('');

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', stock: '', categoryId: ''
  });

  /* ================= HYDRATION LOGIC ================= */
  useEffect(() => {
    const hydrateProtocol = async () => {
      if (isOpen && product) {
        try {
          const { data: allCats } = await api.get('/categories');
          setMainCategories(allCats);

          // Find hierarchy for dropdowns
          for (const main of allCats) {
            for (const sec of main.children || []) {
              if (sec.children?.some((t: any) => t.id === product.categoryId) || sec.id === product.categoryId) {
                setMainCatId(main.id);
                setSecondaryCatId(sec.id);
                setSecondaryCategories(main.children || []);
                setTertiaryCategories(sec.children || []);
              }
            }
          }

          setFormData({
            title: product.title,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            categoryId: product.categoryId
          });

          setImages(product.images?.map((img: any) => img.imageUrl) || []);
          // Ensure variants sizes are handled as arrays
          setVariants(product.variants?.map((v: any) => ({
            ...v,
            sizes: Array.isArray(v.sizes) ? v.sizes : []
          })) || []);

        } catch (e) { console.error("Hydration_Protocol_Failure", e); }
      }
    };
    hydrateProtocol();
  }, [isOpen, product]);

  /* ================= HANDLERS ================= */
  const handleMainChange = (id: string) => {
    setMainCatId(id);
    const selected = mainCategories.find(c => c.id === id);
    setSecondaryCategories(selected?.children || []);
    setSecondaryCatId(''); setTertiaryCategories([]);
    setFormData(prev => ({ ...prev, categoryId: '' }));
  };

  const handleSecondaryChange = (id: string) => {
    setSecondaryCatId(id);
    const selected = secondaryCategories.find(c => c.id === id);
    const children = selected?.children || [];
    setTertiaryCategories(children);
    setFormData(prev => ({ ...prev, categoryId: children.length === 0 ? id : '' }));
  };

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];
    setIsUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(file => uploadToCloudinary(file)));
      return urls;
    } finally { setIsUploading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = await uploadFiles(e.target.files);
    setImages(prev => [...prev, ...urls].slice(0, 4));
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const urls = await uploadFiles(e.target.files);
    const copy = [...variants];
    copy[index].images = [...copy[index].images, ...urls].slice(0, 4);
    setVariants(copy);
  };

  const addVariant = () => setVariants([...variants, { color: '', sizes: [], images: [] }]);
  const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, key: keyof Variant, value: any) => {
    const copy = [...variants];
    (copy[i] as any)[key] = value;
    setVariants(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Select final taxonomy node.");
    setLoading(true);
    try {
      await api.patch(`/products/${product.id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
        variants
      });
      onRefresh(); onClose();
    } catch { alert("Product_Update_Failure"); } finally { setLoading(false); }
  };

  if (!isOpen || !product) return null;

  /* ================= STYLES ================= */
  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all shadow-sm";
  const darkSelectClasses = "w-full p-4 lg:p-5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500 transition-all";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[310] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F7FE] w-full max-w-5xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 lg:slide-in-from-bottom-0 duration-500 max-h-[95vh] lg:max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Update Registry</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={12} className="text-orange-500" /> Modifying Node: {product.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto no-scrollbar">
          
          {/* LEFT: MEDIA & TAXONOMY */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className={labelClasses}>Media Manifest</label>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <Trash2 size={24} /><span className="text-[9px] font-black uppercase">Purge</span>
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all text-slate-400 group">
                    {isUploading ? <Loader2 size={24} className="animate-spin text-blue-600" /> : <Plus size={32} />}
                    <span className="text-[8px] font-black uppercase mt-2">Append Media</span>
                    <input type="file" multiple hidden onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-[2rem] shadow-xl border border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic"><Tag size={12} /> Re-Classification Matrix</h3>
              <div className="space-y-5">
                <select value={mainCatId} className={darkSelectClasses} onChange={e => handleMainChange(e.target.value)}>
                  <option value="">Select Department</option>
                  {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select disabled={!secondaryCategories.length} value={secondaryCatId} className={darkSelectClasses + " disabled:opacity-20"} onChange={e => handleSecondaryChange(e.target.value)}>
                  <option value="">Select Category</option>
                  {secondaryCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select disabled={!tertiaryCategories.length} className={darkSelectClasses + " border-blue-900/30 disabled:opacity-20"} value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">Select Sub-Category</option>
                  {tertiaryCategories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: SPECS & VARIANTS */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Protocol Title</label>
              <input required value={formData.title} className={inputClasses} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Price (₦)</label>
                <input type="number" required value={formData.price} className={inputClasses} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className={labelClasses}>Inventory</label>
                <input type="number" required value={formData.stock} className={`${inputClasses} ${Number(formData.stock) < 5 ? 'border-red-500 bg-red-50' : ''}`} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

            {/* VARIANT SYSTEM - Integrated Design */}
            <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className={labelClasses}>Variant Config</label>
                <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest"><Plus size={14} /> Add Node</button>
              </div>
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                    <button type="button" onClick={() => removeVariant(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="relative">
                        <Palette size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Color" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                      </div>
                      <div className="relative">
                        <Layers size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Sizes (S,M,L)" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={v.sizes.join(',')} onChange={e => updateVariant(i, 'sizes', e.target.value.split(','))} />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
                      <label className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer shrink-0">
                        <ImageIcon size={14} className="text-slate-400" />
                        <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
                      </label>
                      {v.images.map((img, idx) => <img key={idx} src={img} className="w-12 h-12 rounded-lg object-cover border" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description Manifest</label>
              <textarea required rows={5} value={formData.description} className={inputClasses + " resize-none"} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex gap-4 pt-4">
               <button type="button" onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Abort</button>
               <button type="submit" disabled={loading || isUploading} className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 disabled:bg-slate-300">
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Push Updates</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}