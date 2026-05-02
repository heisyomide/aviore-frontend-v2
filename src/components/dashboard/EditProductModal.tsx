'use client';

import { useEffect, useState, useRef } from 'react';
import {
  X, Loader2, Plus, Trash2, Box, Tag, Zap,
  Palette, Layers, Image as ImageIcon
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { useDebounce } from '@/src/hooks/useDebounce';

/* ---------------- TYPES ---------------- */

type Variant = {
  id?: string; // 🔥 CRITICAL
  color: string;
  sizes: string; // Keep as string for the input, we'll split it later
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

export default function EditProductModal({
  isOpen,
  onClose,
  onRefresh,
  product,
}: any) {

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
const [lastSavedData, setLastSavedData] = useState<string | null>(null);


  const dragIndex = useRef<number | null>(null);

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

  /* ================= DEBOUNCE ================= */

  const debouncedForm = useDebounce(formData, 1200);

  /* ================= HYDRATION ================= */

  useEffect(() => {
    if (!isOpen || !product) return;

    setFormData({
      title: product.title,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
      origin: product.origin,
      deliveryMin: product.deliveryMin || '',
      deliveryMax: product.deliveryMax || '',
    });

  setImages(product.images?.map((i: any) => i.imageUrl) || []);
  
  // 🔥 Transform array sizes from DB back to string for UI input
  setVariants(product.variants?.map((v: any) => ({
    id: v.id, // Capture the ID
    color: v.color,
    sizes: Array.isArray(v.sizes) ? v.sizes.join(', ') : v.sizes,
    images: v.images?.map((img: any) => img.imageUrl) || []
  })) || []);
}, [isOpen, product]);

  /* ================= DRAFT ================= */

  useEffect(() => {
    if (!product) return;

    const draft = localStorage.getItem(`draft-${product.id}`);
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData(parsed.form);
      setImages(parsed.images);
      setVariants(parsed.variants);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    localStorage.setItem(
      `draft-${product.id}`,
      JSON.stringify({
        form: formData,
        images,
        variants,
      })
    );
  }, [formData, images, variants]);

  /* ================= AUTOSAVE ================= */

useEffect(() => {
  if (!product || !isOpen) return;

  const autoSave = async () => {
    // 🔥 1. Prepare & Format Data
    const formattedVariants = variants.map(v => ({
      id: v.id, // CRITICAL: Keeps IDs stable for the Backend Upsert
      color: v.color,
      // Handle potential empty strings or non-string values
      sizes: typeof v.sizes === 'string' 
        ? v.sizes.split(',').map(s => s.trim()).filter(Boolean) 
        : v.sizes,
      images: v.images,
    }));

    const payload = {
      ...debouncedForm,
      price: Number(debouncedForm.price),
      stock: Number(debouncedForm.stock),
      deliveryMin: debouncedForm.deliveryMin ? Number(debouncedForm.deliveryMin) : undefined,
      deliveryMax: debouncedForm.deliveryMax ? Number(debouncedForm.deliveryMax) : undefined,
      images,
      variants: formattedVariants,
    };

    // 🔥 2. Dirty Check: Don't save if nothing changed
    const currentDataString = JSON.stringify(payload);
    if (currentDataString === lastSavedData) return;

    setIsSaving(true);
    try {
      await api.patch(`/products/${product.id}`, payload);
      
      // Update the "last saved" reference to prevent loops
      setLastSavedData(currentDataString);
      console.log('✨ CLOUD REGISTRY SYNCED');
    } catch (err) {
      console.error('❌ AUTOSAVE CORE FAILURE', err);
    } finally {
      // Small delay for UI feel
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  autoSave();
}, [debouncedForm, images, variants, product, isOpen, lastSavedData]);

  /* ================= IMAGE DRAG ================= */

  const handleDrop = (to: number) => {
    if (dragIndex.current === null) return;

    const copy = [...images];
    const [moved] = copy.splice(dragIndex.current, 1);
    copy.splice(to, 0, moved);

    setImages(copy);
    dragIndex.current = null;
  };

  /* ================= VARIANT ================= */

  const addVariant = () =>
    setVariants(prev => [...prev, { color: '', sizes: '', images: [] }]);

  const removeVariant = (i: number) =>
    setVariants(prev => prev.filter((_, idx) => idx !== i));

  const updateVariant = (i: number, field: keyof Variant, value: string) =>
    setVariants(prev =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );

const handleVariantImageUpload = async (e: any, i: number) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setIsUploading(true);

  try {
    const urls = await Promise.all(
      Array.from(files as FileList).map((file: File) =>
        uploadToCloudinary(file)
      )
    );

    setVariants(prev =>
      prev.map((v, idx) =>
        idx === i
          ? { ...v, images: [...v.images, ...urls].slice(0, 4) }
          : v
      )
    );
  } finally {
    setIsUploading(false);
  }
};

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.patch(`/products/${product.id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        deliveryMin: formData.deliveryMin
          ? Number(formData.deliveryMin)
          : undefined,
        deliveryMax: formData.deliveryMax
          ? Number(formData.deliveryMax)
          : undefined,
        images,
        variants: variants.map(v => ({
          color: v.color,
          sizes: v.sizes.split(',').map(s => s.trim()),
          images: v.images,
        })),
      });

      localStorage.removeItem(`draft-${product.id}`);
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  /* ================= SAME STYLE AS CREATE ================= */
const inputClasses =
    "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";

  const labelClasses =
    "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in slide-in-from-bottom-10 duration-500">

        {/* HEADER */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">

          <div className="flex items-center gap-2">
  {isSaving ? (
    <div className="flex items-center gap-1.5 text-blue-500 animate-pulse">
      <Loader2 size={10} className="animate-spin" />
      <span className="text-[9px] font-black uppercase tracking-tighter">Syncing...</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-emerald-500">
      <Zap size={10} fill="currentColor" />
      <span className="text-[9px] font-black uppercase tracking-tighter">Registry Safe</span>
    </div>
  )}
</div>

          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              EDIT PRODUCT
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={12} className="text-blue-600" /> Modifying Hardware Node
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto scrollbar-hide">

          {/* LEFT: CORE IDENTITY */}
          <div className="space-y-8">
            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-4xl shadow-xl border border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic">
                <ImageIcon size={12} /> Media Registry
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all shadow-lg">
                    <img
                      src={img}
                      draggable
                      onDragStart={() => (dragIndex.current = i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(i)}
                      className="w-full h-full object-cover cursor-move"
                    />
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-all">
                  <Plus size={18} className="text-slate-500" />
                  <input type="file" hidden multiple />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Primary Designation</label>
                <input
                  className={inputClasses}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Technical Summary</label>
                <textarea
                  className={`${inputClasses} h-40 resize-none`}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Unit Price (₦)</label>
                  <input className={inputClasses} value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Inventory Stock</label>
                  <input className={inputClasses} value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: VARIANT MATRIX */}
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
              <label className={labelClasses}>Configuration Matrix</label>
              <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
              >
                <Plus size={14} /> Add Variant
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              {variants.map((v, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative group animate-in slide-in-from-right-4">
                  <button 
                    onClick={() => removeVariant(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <Palette size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={v.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        placeholder="Hex/Color"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="relative">
                      <Layers size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={v.sizes}
                        onChange={e => updateVariant(i, 'sizes', e.target.value)}
                        placeholder="Sizes"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600 hover:border-blue-200">
                      <ImageIcon size={14} />
                      <span className="text-[10px] font-black uppercase">Upload Media</span>
                      <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={loading || isUploading}
              className="w-full bg-[#1E293B] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Box size={18} /> Update Node Registry</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}