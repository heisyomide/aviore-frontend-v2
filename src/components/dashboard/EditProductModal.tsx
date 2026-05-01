'use client';

import { useEffect, useState , useRef } from 'react';
import { X, Loader2, Plus, Trash2, Save, Zap } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/src/schemas/product.schema';
import { useDebounce } from '@/src/hooks/useDebounce';

/* ================= TYPES ================= */

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

/* ================= COMPONENT ================= */

export default function EditProductModal({
  isOpen,
  onClose,
  onRefresh,
  product,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const dragIndex = useRef<number | null>(null);

  /* ================= FORM ================= */

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  /* ================= WATCH ================= */

  const formValues = watch();
  const debouncedForm = useDebounce(formValues, 1200);

  /* ================= DRAFT SYSTEM ================= */

  // load draft
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

  // save draft
  useEffect(() => {
    if (!product) return;

    localStorage.setItem(
      `draft-${product.id}`,
      JSON.stringify({
        form: formValues,
        images,
        variants,
      })
    );
  }, [formValues, images, variants]);

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    if (!product) return;

    const autoSave = async () => {
      try {
        await api.patch(`/products/${product.id}`, {
          ...debouncedForm,
          images,
          variants,
        });

        console.log('AUTO SAVED');
      } catch (err) {
        console.error('AUTOSAVE FAILED', err);
      }
    };

    autoSave();
  }, [debouncedForm, images, variants]);

  /* ================= HYDRATION ================= */

  useEffect(() => {
    if (!isOpen || !product) return;

    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      origin: product.origin,
      deliveryMin: product.deliveryMin,
      deliveryMax: product.deliveryMax,
    });

    setImages(product.images?.map((i: any) => i.imageUrl) || []);
    setVariants(product.variants || []);
  }, [isOpen, product, reset]);

  /* ================= IMAGE DRAG ================= */

  const handleDrag = (from: number, to: number) => {
    const copy = [...images];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setImages(copy);
  };

  /* ================= VARIANT MATRIX ================= */

  const sizes = ['S', 'M', 'L', 'XL'];

  const toggleSize = (color: string, size: string) => {
    setVariants(prev => {
      let existing = prev.find(v => v.color === color);

      if (!existing) {
        return [...prev, { color, sizes: [size], images: [] }];
      }

      const hasSize = existing.sizes.includes(size);

      return prev.map(v =>
        v.color === color
          ? {
              ...v,
              sizes: hasSize
                ? v.sizes.filter(s => s !== size)
                : [...v.sizes, size],
            }
          : v
      );
    });
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: any) => {
    if (!product) return;

    setLoading(true);

    try {
      await api.patch(`/products/${product.id}`, {
        ...data,
        images,
        variants,
      });

      localStorage.removeItem(`draft-${product.id}`);
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Zap size={16} /> Update Product
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-4">
            <input {...register('title')} placeholder="Title" className="input" />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}

            <textarea {...register('description')} placeholder="Description" className="input" />

            <input type="number" {...register('price')} placeholder="Price" className="input" />
            <input type="number" {...register('stock')} placeholder="Stock" className="input" />
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {/* IMAGE REORDER */}
            <div className="flex gap-2">
{images.map((img, i) => (
  <img
    key={i}
    src={img}
    draggable
    onDragStart={() => {
      dragIndex.current = i;
    }}
    onDragOver={(e) => e.preventDefault()}
    onDrop={() => {
      if (dragIndex.current === null) return;

      const copy = [...images];
      const [moved] = copy.splice(dragIndex.current, 1);
      copy.splice(i, 0, moved);

      setImages(copy);
      dragIndex.current = null;
    }}
    className="w-16 h-16 object-cover rounded cursor-move"
  />
))}
            </div>

            {/* VARIANT MATRIX */}
            <div>
              <p className="font-bold text-sm mb-2">Variants</p>

              {['Red', 'Blue', 'Black'].map(color => (
                <div key={color} className="flex gap-2 items-center mb-2">
                  <span className="w-16">{color}</span>

                  {sizes.map(size => {
                    const active = variants
                      .find(v => v.color === color)
                      ?.sizes.includes(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(color, size)}
                        className={`px-2 py-1 border rounded ${
                          active ? 'bg-black text-white' : ''
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <button disabled={loading} className="bg-blue-600 text-white p-3 w-full rounded">
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}