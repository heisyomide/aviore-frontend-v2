'use client';
import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Box, Tag, Zap, Palette, Layers, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { toast } from 'sonner';

/* ---------------- TYPES ---------------- */
type Category = { id: string; name: string; children?: Category[]; };
type Variant = {
  id: string | null;
  color: string;
  size: string;      // 🔥 Must be singular 'size'
  price: string;     // 🔥 Add this
  stock: string;     // 🔥 Add this (string because inputs are strings)
  images: string[];
};

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
  const [optionInputs, setOptionInputs] = useState({ colors: '', sizes: '' });
  const [generalImages, setGeneralImages] = useState<string[]>([]);

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

  const removeGeneralImage = (index: number) => {
  setGeneralImages(prev => prev.filter((_, i) => i !== index));
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

  const handleGeneralImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const urls = await uploadFiles(e.target.files);
  setGeneralImages(prev => [...prev, ...urls].slice(0, 8)); // max 8 general images
};



  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const urls = await uploadFiles(e.target.files);
    setVariants(prev => prev.map((v, i) => i === index 
      ? { ...v, images: [...v.images, ...urls].slice(0, 4) } : v
    ));
  };

  const addVariant = () => 
  setVariants(prev => [
    ...prev, 
    { 
      id: null, 
      color: '', 
      size: '',    // 🔥 Change sizes to size
      price: '',   // 🔥 Add price
      stock: '',   // 🔥 Add stock as string
      images: [] 
    }
  ]);

  const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));

  };

const handleGenerateMatrix = () => {
  const colorArr = optionInputs.colors.split(',').map(c => c.trim()).filter(Boolean);
  const sizeArr = optionInputs.sizes.split(',').map(s => s.trim()).filter(Boolean);

  if (colorArr.length === 0 || sizeArr.length === 0) {
    return alert("Registry Error: Enter at least one color and one size to generate matrix .");
  }

  // Generate individual Color/Size rows
const newMatrix = colorArr.flatMap(color => 
  sizeArr.map(size => ({
    id: null,
    color,
    size,
    price: formData.price, // Ensure this is a string from your form
    stock: "0",            // 🔥 Change 0 to "0" (Must be a string)
    images: []
  }))
);


  setVariants(newMatrix);
};

// 3. Update the Submit Handler for the Matrix
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.categoryId) return alert("Please select a sub-category");
  if (variants.length === 0) return alert("Please generate at least one variant");

  setLoading(true);

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      origin: formData.origin,
      deliveryMin: Number(formData.deliveryMin) || 1,
      deliveryMax: Number(formData.deliveryMax) || 3,

      // 🔥 NEW: Send General Images
      generalImages: generalImages,

      // Variants
      variants: variants.map(v => ({
        color: v.color.trim(),
        size: v.size.trim(),
        price: Number(v.price) || Number(formData.price),
        stock: Number(v.stock) || 0,
        images: v.images || []
      }))
    };

    await api.post('/products', payload);

    toast.success("Product submitted for review!");
    onRefresh();
    onClose();

  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to create product");
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
              <Zap size={12} className="text-blue-600" /> Initializing Hardware Product
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

          {/* GENERAL IMAGES - Main Gallery (Temu Style) */}
<div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="font-bold text-slate-900">General Product Images</h3>
      <p className="text-xs text-slate-500">Default gallery shown before color selection (max 8)</p>
    </div>
    <span className="text-xs font-mono text-slate-400">{generalImages.length}/8</span>
  </div>

  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
    {/* Upload Box */}
    <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all shrink-0">
      <ImageIcon size={28} className="text-slate-400 mb-1" />
      <span className="text-[10px] font-bold text-slate-500">Add Photos</span>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        hidden 
        onChange={handleGeneralImageUpload} 
      />
    </label>

    {/* Preview General Images */}
    {generalImages.map((img, idx) => (
      <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0 group">
        <img src={img} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => removeGeneralImage(idx)}
          className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
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

{/* VARIANT GENERATOR - The "Options" Phase */}
<div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-xl space-y-6 border border-slate-800">
  <div className="flex justify-between items-center">
    <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic flex items-center gap-2">
      <Layers size={14} /> Matrix Generator
    </h3>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">Colors (Comma separated)</label>
      <input 
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
        placeholder="Red, Blue, Black..."
        value={optionInputs.colors}
        onChange={e => setOptionInputs({...optionInputs, colors: e.target.value})}
      />
    </div>
    <div>
      <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">Sizes (Comma separated)</label>
      <input 
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
        placeholder="S, M, L, XL..."
        value={optionInputs.sizes}
        onChange={e => setOptionInputs({...optionInputs, sizes: e.target.value})}
      />
    </div>
  </div>

  <button 
    type="button"
    onClick={handleGenerateMatrix}
    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
  >
    Generate Configuration Matrix
  </button>
</div>

{/* THE MATRIX TABLE - Refactored for Density & Image Management */}
{variants.length > 0 && (
  <div className="mt-8 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
    <div className="flex justify-between items-center px-1">
      <label className={labelClasses}>Active Configuration Matrix</label>
      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">
        {variants.length} matrix Online
      </span>
    </div>

    {variants.map((v, i) => (
      <div key={i} className="p-4 bg-white border border-slate-200 rounded-[2rem] shadow-sm relative group animate-in slide-in-from-bottom-4 border-l-4 border-l-blue-600">
        {/* Remove Action */}
        <button 
          type="button" 
          onClick={() => removeVariant(i)} 
          className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
        >
          <Trash2 size={12} />
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Identity Badge */}
          <div className="shrink-0">
            <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 min-w-[110px] text-center">
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">
                {v.color} <span className="text-slate-600 mx-1">/</span> {v.size}
              </span>
            </div>
          </div>
          
          {/* Inputs Grid */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">₦</span>
              <input 
                type="number" 
                className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Price"
                value={v.price}
                onChange={e => updateVariant(i, 'price', e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">QTY</span>
              <input 
                type="number" 
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Stock"
                value={v.stock}
                onChange={e => updateVariant(i, 'stock', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Media Strip - Added Delete Functionality */}
        <div className="flex gap-2 items-center overflow-x-auto mt-4 p-2 bg-slate-50 rounded-2xl border border-slate-100 scrollbar-hide">
          <label className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer shrink-0 hover:bg-white hover:border-blue-400 transition-all group">
            <Plus size={14} className="group-hover:scale-110 transition-transform" />
            <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
          </label>

          {v.images.map((img: string, idx: number) => (
            <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden group/img shrink-0 border border-white shadow-sm">
              <img src={img} className="w-full h-full object-cover" alt="" />
              <button 
                type="button"
                onClick={() => {
                  const updatedImages = v.images.filter((_, imgIdx) => imgIdx !== idx);
                  updateVariant(i, 'images', updatedImages as any);
                }}
                className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {isUploading && (
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Loader2 size={14} className="animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}


            <div>
              <label className={labelClasses}>PRODUCT DESCRIPTION</label>
              <textarea required placeholder="Describe features..." className={inputClasses + " h-30 resize-none"} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

<button 
  type="submit" 
  disabled={loading || isUploading} 
  className="w-full bg-[#1E293B] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-300"
>
  {loading ? (
    <span className="flex items-center gap-2">
      <Loader2 className="animate-spin" size={16} /> 
      SYNCING REGISTRY...
    </span>
  ) : (
    <><Box size={18} /> CONFIRM & PUBLISH</>
  )}
</button>

          </div>
        </form>
      </div>
    </div>
  );
}