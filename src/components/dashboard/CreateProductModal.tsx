'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Box, Tag, Zap, Palette, Layers, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

/* ---------------- TYPES ---------------- */
type Category = { id: string; name: string; children?: Category[]; };
type Variant = { color: string; sizes: string; images: string[]; };
type FormData = {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  origin: 'LOCAL' | 'INTERNATIONAL';
  deliveryMin: string;
  deliveryMax: string;
};
export default function CreateProductModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
 
  const [variants, setVariants] = useState<Variant[]>([]);

  const [mainCategories, setMainCategories] = useState<Category[]>([]); 
  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>([]);
  const [tertiaryCategories, setTertiaryCategories] = useState<Category[]>([]);

  const [mainCatId, setMainCatId] = useState('');
  const [secondaryCatId, setSecondaryCatId] = useState('');

const [formData, setFormData] = useState<FormData>({
  title: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  origin: 'LOCAL',
  deliveryMin: '',
  deliveryMax: '',
});

  useEffect(() => { if (isOpen) fetchCategories(); }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setMainCategories(res.data);
    } catch (e) { console.error("Registry_Fetch_Failure"); }
  };

  /* ---------------- LOGIC HANDLERS ---------------- */

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
    setFormData(prev => ({ ...prev, categoryId: children.length === 0 ? id : '' }));
  };

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      return await Promise.all(uploadPromises);
    } catch (err) {
      alert("Network_Upload_Interrupted");
      return [];
    } finally { setIsUploading(false); }
  };



  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const urls = await uploadFiles(e.target.files);
    setVariants(prev => prev.map((v, i) => i === index 
      ? { ...v, images: [...v.images, ...urls].slice(0, 4) } : v
    ));
  };

  const addVariant = () => setVariants(prev => [...prev, { color: '', sizes: '', images: [] }]);
  const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.categoryId) return alert("Select a Sub-Category node");
  if (variants.length === 0) return alert("At least one configuration variant is required");

  setLoading(true);
  try {
    await api.post('/products', {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      // Only send delivery range if INTERNATIONAL
      deliveryMin: formData.origin === 'INTERNATIONAL' ? Number(formData.deliveryMin) : 1,
      deliveryMax: formData.origin === 'INTERNATIONAL' ? Number(formData.deliveryMax) : 3,
      variants: variants.map(v => ({
        color: v.color,
        // filter(Boolean) removes empty values from trailing commas
        sizes: v.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images: v.images
      }))
    });
    
    onRefresh();
    onClose();
  } catch (error) {
    console.error("PROTOCOL_REJECTION:", error);
    alert("Protocol_Error: Check data integrity");
  } finally {
    setLoading(false);
  }
};




  if (!isOpen) return null;

  /* ---------------- STYLES ---------------- */
  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";
  const darkSelectClasses = "w-full p-4 lg:p-5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500 transition-all";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-300 flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 lg:slide-in-from-bottom-0 duration-500 max-h-[95vh] lg:max-h-[90vh] flex flex-col">
        
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

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto scrollbar-hide">
          
          {/* LEFT: MEDIA & CATEGORIES */}
          <div className="space-y-8">
            {/* Image Registry - Only visible if no variants exist */}


            {/* Category Node Matrix */}
            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-4xl shadow-xl border border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic"><Tag size={12} /> CATEGORIZATION</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">DEPARTMENT</label>
                  <select required value={mainCatId} className={darkSelectClasses} onChange={e => handleMainChange(e.target.value)}>
                    <option value="">Select Department</option>
                    {mainCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">CATEGORY</label>
                  <select required disabled={!secondaryCategories.length} value={secondaryCatId} className={darkSelectClasses + " disabled:opacity-20"} onChange={e => handleSecondaryChange(e.target.value)}>
                    <option value="">Select Category</option>
                    {secondaryCategories.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">SUB-CATEGORY</label>
                  <select required disabled={!tertiaryCategories.length} className={darkSelectClasses + " border-orange-900/30 disabled:opacity-20"} onChange={e => setFormData({...formData, categoryId: e.target.value})} value={formData.categoryId}>
                    <option value="">Select Sub-Category</option>
                    {tertiaryCategories.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: DATA SPECIFICATIONS & VARIANTS */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>PRODUCT TITLE</label>
              <input required placeholder="Registry Name..." className={inputClasses} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>PRICE (₦)</label>
                <input type="number" required placeholder="0.00" className={inputClasses} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className={labelClasses}>TOTAL STOCK</label>
                <input type="number" required placeholder="QTY" className={inputClasses} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>

                        <div className="grid grid-cols-2 gap-4">
  <div>
    <label className={labelClasses}>Origin</label>
    <select
      className={inputClasses}
      value={formData.origin}
onChange={(e) =>
  setFormData({
    ...formData,
    origin: e.target.value as 'LOCAL' | 'INTERNATIONAL',
  })
}
    >
      <option value="LOCAL">Local</option>
      <option value="INTERNATIONAL">International</option>
    </select>
  </div>

  {formData.origin === 'INTERNATIONAL' && (
    <>
      <div>
        <label className={labelClasses}>Delivery Min (days)</label>
        <input
          type="number"
          className={inputClasses}
          value={formData.deliveryMin}
          onChange={(e) =>
            setFormData({ ...formData, deliveryMin: e.target.value })
          }
        />
      </div>

      <div>
        <label className={labelClasses}>Delivery Max (days)</label>
        <input
          type="number"
          className={inputClasses}
          value={formData.deliveryMax}
          onChange={(e) =>
            setFormData({ ...formData, deliveryMax: e.target.value })
          }
        />
      </div>
    </>
  )}
</div>

            {/* VARIANT SYSTEM */}
            <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className={labelClasses}>Variant Config</label>
                <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest"><Plus size={14} /> Add Variant</button>
              </div>

              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 relative group animate-in slide-in-from-right-4">
                    <button type="button" onClick={() => removeVariant(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="relative">
                        <Palette size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Color (e.g. Onyx)" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                      </div>
                      <div className="relative">
                        <Layers size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Sizes (S, M, L)" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={v.sizes} onChange={e => updateVariant(i, 'sizes', e.target.value)} />
                      </div>
                    </div>
                    {/* Variant Specific Images */}
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-hide">
                      <label className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer shrink-0">
                        <ImageIcon size={14} className="text-slate-400" />
                        <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
                      </label>
                      {v.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} className="w-12 h-12 rounded-lg object-cover border border-slate-200" alt="" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClasses}>PRODUCT DESCRIPTION</label>
              <textarea required placeholder="Describe features..." className={inputClasses + " h-30 resize-none"} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <button type="submit" disabled={loading || isUploading} className="w-full bg-[#1E293B] text-white py-6 lg:py-7 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:bg-slate-300">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><Box size={18} /> CONFIRM & PUBLISH</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}