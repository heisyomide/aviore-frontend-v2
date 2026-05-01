'use client';

import { useEffect, useState, useRef } from 'react';
import {
  X, Loader2, Plus, Trash2, Box, Zap,
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
  const isFirstLoad = useRef(true);

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

    isFirstLoad.current = true;
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

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

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
      } catch {
        console.error('AUTOSAVE FAILED');
      }
    };

    autoSave();
  }, [debouncedForm, images, variants]);

  /* ================= IMAGE UPLOAD ================= */

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const urls = await Promise.all(
        Array.from(files).map(file => uploadToCloudinary(file))
      );

      setImages(prev => [...prev, ...urls]);
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleVariantImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const urls = await Promise.all(
        Array.from(files).map(file => uploadToCloudinary(file))
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

  /* ================= STYLES ================= */

  const inputClasses =
    "w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 shadow-sm";

  const labelClasses =
    "text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center bg-[#0F172A]/80 backdrop-blur-md">
      <div className="bg-[#F4F7FE] w-full max-w-6xl lg:rounded-4xl rounded-t-[2.5rem] shadow-2xl max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="p-6 lg:p-8 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl lg:text-2xl font-black uppercase italic">
              EDIT PRODUCT
            </h2>
            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
              <Zap size={12} className="text-blue-600" /> Modifying Hardware Node
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 grid lg:grid-cols-2 gap-8 overflow-y-auto">

          {/* LEFT */}
          <div className="space-y-8">
            <div className="bg-[#1E293B] p-6 rounded-4xl">
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(i)}
                    className="w-full h-20 object-cover rounded-xl cursor-move"
                  />
                ))}

                <label className="h-20 flex items-center justify-center border-dashed border-2 cursor-pointer">
                  <Plus />
                  <input type="file" hidden multiple onChange={handleMainImageUpload} />
                </label>
              </div>
            </div>

            <input className={inputClasses} value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <textarea className={inputClasses} value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <input type="number" className={inputClasses} value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />

            <input type="number" className={inputClasses} value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {variants.map((v, i) => (
              <div key={i}>
                <input value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                <input value={v.sizes} onChange={e => updateVariant(i, 'sizes', e.target.value)} />

                <input type="file" multiple onChange={(e) => handleVariantImageUpload(e, i)} />

                <div className="flex gap-2">
                  {v.images.map((img, idx) => (
                    <img key={idx} src={img} className="w-10 h-10" />
                  ))}
                </div>
              </div>
            ))}

            <button type="button" onClick={addVariant}>
              <Plus /> Add Variant
            </button>

            <button disabled={loading}>
              {loading ? <Loader2 /> : <Box />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}