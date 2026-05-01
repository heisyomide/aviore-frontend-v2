'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Loader2, Plus, Trash2, Save, Zap, Tag, Box, Palette, Layers, Image as ImageIcon } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/src/schemas/product.schema';
import { useDebounce } from '@/src/hooks/useDebounce';

interface Variant {
  color: string;
  sizes: string[];
  images: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  product: any;
}

export default function EditProductModal({ isOpen, onClose, onRefresh, product }: Props) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const dragIndex = useRef<number | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  const formValues = watch();
  const debouncedForm = useDebounce(formValues, 1200);

  /* ---------------- PERSISTENCE ---------------- */
  useEffect(() => {
    if (!product) return;
    const draft = localStorage.getItem(`draft-${product.id}`);
    if (draft) {
      const parsed = JSON.parse(draft);
      reset(parsed.form);
      setImages(parsed.images || []);
      setVariants(parsed.variants || []);
    }
  }, [product, reset]);

  useEffect(() => {
    if (!product) return;
    localStorage.setItem(`draft-${product.id}`, JSON.stringify({ form: formValues, images, variants }));
  }, [formValues, images, variants, product]);

  useEffect(() => {
    if (!product || !isOpen) return;
    const autoSave = async () => {
      try {
        await api.patch(`/products/${product.id}`, { ...debouncedForm, images, variants });
      } catch (err) { console.error('AUTOSAVE_FAIL', err); }
    };
    autoSave();
  }, [debouncedForm, images, variants, product, isOpen]);

  useEffect(() => {
    if (!isOpen || !product) return;
    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      origin: product.origin,
      deliveryMin: product.deliveryMin,
      deliveryMax: product.deliveryMax,
    });
    setImages(product.images?.map((i: any) => i.imageUrl) || []);
    setVariants(product.variants || []);
  }, [isOpen, product, reset]);

  /* ---------------- HANDLERS ---------------- */
  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, vIndex: number) => {
    if (!e.target.files) return;
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(e.target.files).map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setVariants(prev => prev.map((v, i) => i === vIndex ? { ...v, images: [...v.images, ...urls] } : v));
    } finally { setIsUploading(false); }
  };

  const addVariant = () => setVariants(prev => [...prev, { color: '', sizes: [], images: [] }]);
  
  const onSubmit = async (data: any) => {
    if (!product) return;
    setLoading(true);
    try {
      await api.patch(`/products/${product.id}`, { ...data, images, variants });
      localStorage.removeItem(`draft-${product.id}`);
      onRefresh();
      onClose();
    } finally { setLoading(false); }
  };

  if (!isOpen || !product) return null;

  /* ---------------- STYLES ---------------- */
  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 lg:slide-in-from-bottom-0 duration-500 max-h-[95vh] lg:max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Patch Protocol</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={12} className="text-blue-600" /> Modifying Hardware Node: {product.id.slice(0, 8)}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto scrollbar-hide">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-4xl shadow-xl border border-slate-800">
               <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic"><ImageIcon size={12} /> MEDIA REGISTRY</h3>
               <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-700">
                      <img 
                        src={img} 
                        className="w-full h-full object-cover cursor-move" 
                        onDragStart={() => (dragIndex.current = i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex.current === null) return;
                          const copy = [...images];
                          const [moved] = copy.splice(dragIndex.current, 1);
                          copy.splice(i, 0, moved);
                          setImages(copy);
                          dragIndex.current = null;
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
               </div>
            </div>

            <div>
              <label className={labelClasses}>PRODUCT DESCRIPTION</label>
              <textarea {...register('description')} className={inputClasses + " h-48 resize-none"} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>PRODUCT TITLE</label>
              <input {...register('title')} className={inputClasses} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>PRICE (₦)</label>
                <input type="number" {...register('price')} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>STOCK</label>
                <input type="number" {...register('stock')} className={inputClasses} />
              </div>
            </div>

            {/* VARIANT CONFIG */}
            <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className={labelClasses}>Variant Matrix</label>
                <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest"><Plus size={14} /> Add Variant</button>
              </div>

              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 relative group animate-in slide-in-from-right-4">
                    <button type="button" onClick={() => setVariants(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                       <div className="relative">
                          <Palette size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            placeholder="Color" 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" 
                            value={v.color} 
                            onChange={e => setVariants(prev => prev.map((item, idx) => idx === i ? { ...item, color: e.target.value } : item))} 
                          />
                       </div>
                       <div className="relative">
                          <Layers size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            placeholder="Sizes (S, M, L)" 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" 
                            value={v.sizes.join(', ')} 
                            onChange={e => setVariants(prev => prev.map((item, idx) => idx === i ? { ...item, sizes: e.target.value.split(',').map(s => s.trim()) } : item))} 
                          />
                       </div>
                    </div>
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

            <button type="submit" disabled={loading || isUploading} className="w-full bg-[#1E293B] text-white py-6 lg:py-7 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:bg-slate-300">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><Save size={18} /> UPDATE REGISTRY</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}