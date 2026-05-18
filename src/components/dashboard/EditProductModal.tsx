'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, Loader2, Plus, Trash2, Box, Tag, Zap, Layers, Image as ImageIcon
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { toast } from 'sonner';

type Category = { 
  id: string; 
  name: string; 
  children?: Category[]; 
};

type Variant = {
  id?: string;
  color: string;
  size: string;
  price?: string;
  stock?: string;
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

  const [generalImages, setGeneralImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // 🌍 CATEGORY ENGINE LAYER STACK
  const [mainCategories, setMainCategories] = useState<Category[]>([]); 
  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>([]);
  const [tertiaryCategories, setTertiaryCategories] = useState<Category[]>([]);

  const [mainCatId, setMainCatId] = useState('');
  const [secondaryCatId, setSecondaryCatId] = useState('');

  // Fetch your structured categories from the DB on layout open
  useEffect(() => { 
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setMainCategories(res.data);
    } catch (e) { 
      console.error("Registry_Fetch_Failure", e); 
    }
  };

  // ================= HYDRATION & RE-MAPPING ENGINE =================
  useEffect(() => {
    if (!isOpen || !product || mainCategories.length === 0) return;

    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: String(product.price || ''),
      stock: String(product.stock || ''),
      categoryId: product.categoryId || '',
      origin: product.origin || 'LOCAL',
      deliveryMin: String(product.deliveryMin || ''),
      deliveryMax: String(product.deliveryMax || ''),
    });

    setGeneralImages(
      product.images?.map((img: any) => img.imageUrl) || []
    );

    setVariants(
      product.variants?.map((v: any) => ({
        id: v.id,
        color: v.color || '',
        size: Array.isArray(v.sizes) ? v.sizes.join(', ') : (v.size || v.sizes || ''),
        price: String(v.price || ''),
        stock: String(v.stock || ''),
        images: v.images?.map((img: any) => img.imageUrl) || [],
      })) || []
    );

    // 🎯 REVERSE CASCADE ALIGNMENT FOR PRE-SET SELECTIONS
    if (product.categoryId) {
      // Traverse down into your DB layers to re-select matching dropdown levels
      let foundMainId = '';
      let foundSecondaryId = '';
      let targetTertiaryList: Category[] = [];
      let targetSecondaryList: Category[] = [];

      for (const main of mainCategories) {
        if (main.children) {
          for (const sub of main.children) {
            // Check if product is set at level 3 (Leaf node)
            const matchedLeaf = sub.children?.find(leaf => leaf.id === product.categoryId);
            if (matchedLeaf) {
              foundMainId = main.id;
              foundSecondaryId = sub.id;
              targetSecondaryList = main.children;
              targetTertiaryList = sub.children || [];
              break;
            }
            // Fallback match if it was stored directly at level 2
            if (sub.id === product.categoryId) {
              foundMainId = main.id;
              foundSecondaryId = sub.id;
              targetSecondaryList = main.children;
              targetTertiaryList = sub.children || [];
              break;
            }
          }
        }
      }

      if (foundMainId) {
        setMainCatId(foundMainId);
        setSecondaryCategories(targetSecondaryList);
        setSecondaryCatId(foundSecondaryId);
        setTertiaryCategories(targetTertiaryList);
      }
    }
  }, [isOpen, product, mainCategories]);

  // ================= TIER CHANGING LOGIC PIPELINES =================
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

  // ================= IMAGES UPLOAD MECHANICS =================
  const handleGeneralImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(file => uploadToCloudinary(file))
      );
      setGeneralImages(prev => [...prev, ...urls].slice(0, 8));
    } finally {
      setIsUploading(false);
    }
  };

  const removeGeneralImage = (index: number) => {
    setGeneralImages(prev => prev.filter((_, i) => i !== index));
  };

  // ================= VARIANT ROUTINE OPERATIONS =================
  const addVariant = () => {
    setVariants(prev => [...prev, { color: '', size: '', price: '', stock: '', images: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(file => uploadToCloudinary(file))
      );
      setVariants(prev =>
        prev.map((v, i) =>
          i === index ? { ...v, images: [...v.images, ...urls].slice(0, 6) } : v
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ================= FORM SUBMISSION PROTOCOL =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!formData.categoryId) return toast.error("Please select a valid sub-category path.");

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        stock: formData.stock ? Number(formData.stock) : undefined,
        deliveryMin: formData.deliveryMin ? Number(formData.deliveryMin) : undefined,
        deliveryMax: formData.deliveryMax ? Number(formData.deliveryMax) : undefined,
        generalImages,
        variants: variants.map(v => ({
          id: v.id,
          color: v.color.trim(),
          size: v.size.trim(),
          price: v.price !== '' && v.price !== undefined ? Number(v.price) : undefined,
          stock: v.stock !== '' && v.stock !== undefined ? Number(v.stock) : undefined,
          images: v.images,
        })),
      };

      await api.patch(`/products/${product.id}`, payload);

      localStorage.removeItem(`draft-${product.id}`);
      onRefresh();
      onClose();
      toast.success("Product updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product alignment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";
  const darkSelectClasses = "w-full p-4 lg:p-5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-600 transition-all";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER BLOCK */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              EDIT PRODUCT
            </h2>
            <p className="text-xs text-slate-500">Node ID: {product.id}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid lg:grid-cols-2 gap-8 overflow-y-auto">
          
          {/* LEFT COLUMN - System Images & Categorization */}
          <div className="space-y-8">
            
            {/* 🌐 NEW CATEGORIZATION CONTROLS */}
            <div className="bg-[#1E293B] p-6 lg:p-8 rounded-4xl shadow-xl border border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest flex items-center gap-2 italic">
                <Tag size={12} /> SYSTEM RECLASSIFICATION
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">DEPARTMENT</label>
                  <select required value={mainCatId} className={darkSelectClasses} onChange={e => handleMainChange(e.target.value)}>
                    <option value="">Select Department</option>
                    {mainCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">GROUP SECTOR</label>
                  <select required disabled={!secondaryCategories.length} value={secondaryCatId} className={`${darkSelectClasses} disabled:opacity-20`} onChange={e => handleSecondaryChange(e.target.value)}>
                    <option value="">Select Group Sector</option>
                    {secondaryCategories.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">MICRO SUB-CATEGORY</label>
                  <select required disabled={!tertiaryCategories.length} className={`${darkSelectClasses} border-orange-900/30 disabled:opacity-20`} onChange={e => setFormData({...formData, categoryId: e.target.value})} value={formData.categoryId}>
                    <option value="">Select Sub-Category Target</option>
                    {tertiaryCategories.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* General Product Images Preview Strip */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">General Product Images</h3>
                <span className="text-xs font-mono text-slate-400">{generalImages.length}/8</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4">
                <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 shrink-0">
                  <ImageIcon size={24} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 mt-1">Add Image</span>
                  <input type="file" multiple hidden accept="image/*" onChange={handleGeneralImageUpload} />
                </label>

                {generalImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGeneralImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Specs */}
            <div>
              <label className={labelClasses}>Product Title</label>
              <input
                className={inputClasses}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Base Price (₦)</label>
                <input
                  type="number"
                  className={inputClasses}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Global Base Stock</label>
                <input
                  type="number"
                  className={inputClasses}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description Summary</label>
              <textarea
                className={`${inputClasses} h-40 resize-none`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Variants & Submission Engine */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Active Specification Matrix</h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:text-blue-500"
              >
                <Plus size={18} /> Add New Matrix Node
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {variants.map((variant, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm relative group border-l-4 border-l-blue-600">
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Color Variant</label>
                      <input
                        value={variant.color}
                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                        className={inputClasses}
                        placeholder="Red, Black..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Size Metric</label>
                      <input
                        value={variant.size}
                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                        className={inputClasses}
                        placeholder="M, L, XL..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Overriding Price (₦)</label>
                      <input
                        type="number"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(i, 'price', e.target.value)}
                        className={inputClasses}
                        placeholder="Defaults to Base Price"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Allocation Stock</label>
                      <input
                        type="number"
                        value={variant.stock || ''}
                        onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                        className={inputClasses}
                        placeholder="Allocated QTY"
                      />
                    </div>
                  </div>

                  {/* Variant Media Strip */}
                  <div className="mt-4">
                    <label className="text-[10px] font-bold text-slate-400 mb-2 block">Variant-Specific Media</label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      <label className="w-12 h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 shrink-0">
                        <Plus size={16} className="text-slate-400" />
                        <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
                      </label>

                      {variant.images.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = variant.images.filter((_, j) => j !== idx);
                              updateVariant(i, 'images', newImages as any);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center shadow-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM MASTER ACTION BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="lg:col-span-2 w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Syncing Payload Changes...
              </>
            ) : (
              'Commit Changes to Database'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}