'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Save, Tag, Zap } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

/* ================= TYPES ================= */

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface Variant {
  color: string;
  sizes: string[];
  images: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: { imageUrl: string }[];
  variants?: Variant[];
}

/* ================= COMPONENT ================= */

export default function EditProductModal({
  isOpen,
  onClose,
  onRefresh,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  product: Product;
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [secondary, setSecondary] = useState<Category[]>([]);
  const [tertiary, setTertiary] = useState<Category[]>([]);

  const [mainId, setMainId] = useState('');
  const [secondaryId, setSecondaryId] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  /* ================= INIT ================= */

  useEffect(() => {
    if (!isOpen || !product) return;

    init();
  }, [isOpen, product]);

  const init = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);

    hydrateCategory(data);
    hydrateProduct();
  };

  const hydrateProduct = () => {
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
    });

    setImages(product.images?.map(i => i.imageUrl) || []);
    setVariants(product.variants || []);
  };

  const hydrateCategory = (cats: Category[]) => {
    for (const main of cats) {
      for (const sec of main.children || []) {
        if (sec.children?.some(t => t.id === product.categoryId)) {
          setMainId(main.id);
          setSecondaryId(sec.id);
          setSecondary(main.children || []);
          setTertiary(sec.children || []);
          return;
        }

        if (sec.id === product.categoryId) {
          setMainId(main.id);
          setSecondaryId(sec.id);
          setSecondary(main.children || []);
          setTertiary([]);
          return;
        }
      }
    }
  };

  /* ================= CATEGORY HANDLERS ================= */

  const handleMainChange = (id: string) => {
    setMainId(id);
    const selected = categories.find(c => c.id === id);

    setSecondary(selected?.children || []);
    setSecondaryId('');
    setTertiary([]);
    setForm(f => ({ ...f, categoryId: '' }));
  };

  const handleSecondaryChange = (id: string) => {
    setSecondaryId(id);
    const selected = secondary.find(c => c.id === id);

    const children = selected?.children || [];
    setTertiary(children);

    setForm(f => ({
      ...f,
      categoryId: children.length ? '' : id,
    }));
  };

  /* ================= IMAGE UPLOAD ================= */

  const uploadImages = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(file => uploadToCloudinary(file))
      );
      return urls;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const urls = await uploadImages(e.target.files);
    if (!urls) return;

    setImages(prev => [...prev, ...urls].slice(0, 4));
  };

  const handleVariantImageUpload = async (e: any, index: number) => {
    const urls = await uploadImages(e.target.files);
    if (!urls) return;

    const copy = [...variants];
    copy[index].images = [...copy[index].images, ...urls].slice(0, 4);
    setVariants(copy);
  };

  /* ================= VARIANT ================= */

  const addVariant = () => {
    setVariants([...variants, { color: '', sizes: [], images: [] }]);
  };

  const removeVariant = (i: number) => {
    setVariants(v => v.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i: number, key: keyof Variant, value: any) => {
    const copy = [...variants];
    copy[i][key] = value;
    setVariants(copy);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.categoryId) {
      return alert('Select category');
    }

    setLoading(true);

    try {
      await api.patch(`/products/${product.id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images,
        variants, // ✅ NOW INCLUDED
      });

      onRefresh();
      onClose();
    } catch {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-6 overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl">Edit Product</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* IMAGES */}
            <div>
              <p className="font-bold text-sm mb-2">Images</p>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-32 w-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 hover:opacity-100"
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <input type="file" multiple onChange={handleImageUpload} />
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <select value={mainId} onChange={e => handleMainChange(e.target.value)}>
                <option>Select main</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select value={secondaryId} onChange={e => handleSecondaryChange(e.target.value)}>
                <option>Select sub</option>
                {secondary.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
              >
                <option>Select final</option>
                {tertiary.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
            />

            <input
              value={form.price}
              type="number"
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
            />

            <input
              value={form.stock}
              type="number"
              onChange={e => setForm({ ...form, stock: e.target.value })}
              placeholder="Stock"
            />

            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            {/* VARIANTS */}
            <div>
              <p className="font-bold">Variants</p>

              {variants.map((v, i) => (
                <div key={i} className="border p-2 mb-2">

                  <input
                    placeholder="Color"
                    value={v.color}
                    onChange={e => updateVariant(i, 'color', e.target.value)}
                  />

                  <input
                    placeholder="Sizes comma separated"
                    value={v.sizes.join(',')}
                    onChange={e =>
                      updateVariant(i, 'sizes', e.target.value.split(','))
                    }
                  />

                  <input type="file" multiple onChange={e => handleVariantImageUpload(e, i)} />

                  <button type="button" onClick={() => removeVariant(i)}>
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={addVariant}>
                <Plus /> Add Variant
              </button>
            </div>

            <button disabled={loading || uploading}>
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}