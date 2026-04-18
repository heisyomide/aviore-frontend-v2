'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

/* ---------------- TYPES ---------------- */

type Category = {
  id: string;
  name: string;
  children?: Category[];
};

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
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
};

/* ---------------- COMPONENT ---------------- */

export default function CreateProductModal({
  isOpen,
  onClose,
  onRefresh
}: Props) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [images, setImages] = useState<string[]>([]);
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
    categoryId: ''
  });

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setMainCategories(res.data);
  };

  /* ---------------- CATEGORY HANDLERS ---------------- */

  const handleMainChange = (id: string) => {
    const selected = mainCategories.find(c => c.id === id);

    setMainCatId(id);
    setSecondaryCategories(selected?.children || []);
    setSecondaryCatId('');
    setTertiaryCategories([]);

    setFormData(prev => ({ ...prev, categoryId: '' }));
  };

  const handleSecondaryChange = (id: string) => {
    const selected = secondaryCategories.find(c => c.id === id);
    const children = selected?.children || [];

    setSecondaryCatId(id);
    setTertiaryCategories(children);

    setFormData(prev => ({
      ...prev,
      categoryId: children.length ? '' : id
    }));
  };

  /* ---------------- UPLOAD UTILS ---------------- */

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];

    setUploading(true);
    try {
      const fileArray = Array.from(files);

      const validFiles = fileArray.filter(
        (file): file is File => file instanceof File
      );

      return await Promise.all(
        validFiles.map(file => uploadToCloudinary(file))
      );
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- IMAGE HANDLERS ---------------- */

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const urls = await uploadFiles(e.target.files);
    setImages(prev => [...prev, ...urls].slice(0, 4));
  };

  const handleVariantImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const urls = await uploadFiles(e.target.files);

    setVariants(prev =>
      prev.map((v, i) =>
        i === index
          ? { ...v, images: [...v.images, ...urls].slice(0, 4) }
          : v
      )
    );
  };

  /* ---------------- VARIANT HANDLERS ---------------- */

  const addVariant = () => {
    setVariants(prev => [...prev, { color: '', sizes: '', images: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      return alert('Select category');
    }

    setLoading(true);

    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),

        images: variants.length ? [] : images,

        variants: variants.map(v => ({
          color: v.color,
          sizes: v.sizes.split(',').map(s => s.trim()),
          images: v.images
        }))
      });

      onRefresh();
      onClose();
      resetForm();
    } catch {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImages([]);
    setVariants([]);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      categoryId: ''
    });
  };

  if (!isOpen) return null;

  const input = 'w-full p-4 border rounded-xl';

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="font-bold text-lg">Create Product</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            className={input}
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className={input}
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              className={input}
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <textarea
            className={input}
            placeholder="Description"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* NORMAL IMAGES */}
          {variants.length === 0 && (
            <input type="file" multiple onChange={handleImageUpload} />
          )}

          {/* VARIANTS */}
          <div>
            <h3 className="font-bold mb-3">Variants</h3>

            {variants.map((v, i) => (
              <div key={i} className="border p-4 mb-4 rounded-xl space-y-3">

                <input
                  className={input}
                  placeholder="Color"
                  value={v.color}
                  onChange={e => updateVariant(i, 'color', e.target.value)}
                />

                <input
                  className={input}
                  placeholder="Sizes (S,M,L)"
                  value={v.sizes}
                  onChange={e => updateVariant(i, 'sizes', e.target.value)}
                />

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleVariantImageUpload(e, i)}
                />

                <div className="flex gap-2">
                  {v.images.map((img, idx) => (
                    <img key={idx} src={img} className="w-16 h-16 object-cover" />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="bg-black text-white px-4 py-2 rounded"
            >
              + Add Variant
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>

        </form>
      </div>
    </div>
  );
}