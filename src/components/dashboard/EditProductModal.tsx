'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, Loader2, Plus, Trash2, Box, Tag, Zap, Palette, Layers, Image as ImageIcon
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { toast } from 'sonner';

type Variant = {
  id?: string;
  color: string;
  size: string;           // Changed to singular 'size'
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
  const [isSaving, setIsSaving] = useState(false);

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

  const [generalImages, setGeneralImages] = useState<string[]>([]);   // Main images
  const [variants, setVariants] = useState<Variant[]>([]);

  const dragIndex = useRef<number | null>(null);

  // ================= HYDRATION FROM PRODUCT =================
  useEffect(() => {
    if (!isOpen || !product) return;

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

    // General Images
    setGeneralImages(
      product.images?.map((img: any) => img.imageUrl) || []
    );

    // Variants
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
  }, [isOpen, product]);

  // ================= GENERAL IMAGE UPLOAD =================
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

  // ================= VARIANT HANDLERS =================
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

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        deliveryMin: formData.deliveryMin ? Number(formData.deliveryMin) : undefined,
        deliveryMax: formData.deliveryMax ? Number(formData.deliveryMax) : undefined,
        images: generalImages,   // General images
        variants: variants.map(v => ({
          id: v.id,
          color: v.color,
          size: v.size,
          price: v.price ? Number(v.price) : undefined,
          stock: v.stock ? Number(v.stock) : undefined,
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
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const inputClasses = "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";
  const labelClasses = "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
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
          
          {/* LEFT COLUMN - General Info & Images */}
          <div className="space-y-8">
            {/* General Images */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <h3 className="font-bold mb-4">General Product Images</h3>
              <div className="flex gap-3 overflow-x-auto pb-4">
                <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                  <Plus size={28} className="text-slate-400" />
                  <input type="file" multiple hidden onChange={handleGeneralImageUpload} />
                </label>

                {generalImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGeneralImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <label className={labelClasses}>Product Title</label>
              <input
                className={inputClasses}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                className={`${inputClasses} h-40 resize-none`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Variants */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-blue-600 text-sm font-bold"
              >
                <Plus size={18} /> Add Variant
              </button>
            </div>

            {variants.map((variant, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl">
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="float-right text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold">Color</label>
                    <input
                      value={variant.color}
                      onChange={(e) => updateVariant(i, 'color', e.target.value)}
                      className={inputClasses}
                      placeholder="Red, Blue..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold">Size</label>
                    <input
                      value={variant.size}
                      onChange={(e) => updateVariant(i, 'size', e.target.value)}
                      className={inputClasses}
                      placeholder="S, M, L, 41, 42..."
                    />
                  </div>
                </div>

                {/* Variant Images */}
                <div className="mt-6">
                  <label className="text-xs font-bold mb-2 block">Variant Images</label>
                  <div className="flex gap-2 overflow-x-auto">
                    <label className="w-12 h-12 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer">
                      <Plus size={16} />
                      <input type="file" multiple hidden onChange={(e) => handleVariantImageUpload(e, i)} />
                    </label>

                    {variant.images.map((img, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = variant.images.filter((_, j) => j !== idx);
                            updateVariant(i, 'images', newImages as any);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center"
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

          <button
            type="submit"
            disabled={loading}
            className="lg:col-span-2 w-full bg-black text-white py-6 rounded-2xl font-bold text-sm tracking-widest"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}