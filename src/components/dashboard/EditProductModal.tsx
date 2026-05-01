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
  color: string;
  sizes: string;
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
    setVariants(product.variants || []);
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
    if (!product) return;

    const autoSave = async () => {
      try {
        await api.patch(`/products/${product.id}`, {
          ...debouncedForm,
          price: Number(debouncedForm.price),
          stock: Number(debouncedForm.stock),
          deliveryMin: debouncedForm.deliveryMin
            ? Number(debouncedForm.deliveryMin)
            : undefined,
          deliveryMax: debouncedForm.deliveryMax
            ? Number(debouncedForm.deliveryMax)
            : undefined,
          images,
          variants: variants.map(v => ({
            color: v.color,
            sizes: v.sizes.split(',').map(s => s.trim()),
            images: v.images,
          })),
        });

        console.log('AUTO SAVED');
      } catch (err) {
        console.error('AUTOSAVE FAILED');
      }
    };

    autoSave();
  }, [debouncedForm, images, variants]);

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
    <div className="fixed inset-0 z-300 flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER (UNCHANGED STYLE) */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl lg:text-2xl font-black uppercase italic">
              Edit Product
            </h2>
            <p className="text-[10px] font-bold text-slate-400 flex gap-2 mt-1">
              <Zap size={12} /> Editing Node
            </p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid lg:grid-cols-2 gap-8 overflow-y-auto">

          {/* LEFT */}
          <div className="space-y-6">

            <div>
              <label className={labelClasses}>TITLE</label>
              <input
                className={inputClasses}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClasses}>DESCRIPTION</label>
              <textarea
                className={inputClasses}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input className={inputClasses} value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
              />
              <input className={inputClasses} value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Stock"
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* IMAGE DRAG */}
            <div className="flex gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  className="w-16 h-16 object-cover rounded cursor-move"
                />
              ))}
            </div>

            {/* VARIANTS (UNCHANGED STYLE) */}
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-3xl border relative">
                  <button onClick={() => removeVariant(i)}
                    className="absolute top-2 right-2 text-red-500">
                    <Trash2 size={12} />
                  </button>

                  <input
                    value={v.color}
                    onChange={e => updateVariant(i, 'color', e.target.value)}
                    placeholder="Color"
                    className={inputClasses}
                  />

                  <input
                    value={v.sizes}
                    onChange={e => updateVariant(i, 'sizes', e.target.value)}
                    placeholder="Sizes"
                    className={inputClasses}
                  />

                  <input type="file" multiple
                    onChange={(e) => handleVariantImageUpload(e, i)}
                  />

                </div>
              ))}
            </div>

            <button type="button" onClick={addVariant}>
              <Plus /> Add Variant
            </button>

            <button
              disabled={loading || isUploading}
              className="w-full bg-[#1E293B] text-white py-5 rounded-3xl"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Box />}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}