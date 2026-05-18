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

type Category = {
  id: string;
  name: string;
  children?: Category[];
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

const [mainCategories, setMainCategories] = useState<Category[]>([]);

const [secondaryCategories, setSecondaryCategories] = useState<Category[]>([]);

const [tertiaryCategories, setTertiaryCategories] = useState<Category[]>([]);

const [mainCatId, setMainCatId] = useState('');

const [secondaryCatId, setSecondaryCatId] = useState('');

/* =========================

   FETCH CATEGORIES

========================= */

const fetchCategories = async () => {

  try {

    const res = await api.get('/categories');

    setMainCategories(res.data || []);

  } catch (err) {

    console.error('CATEGORY_FETCH_FAILED', err);

  }

};

/* =========================

   INITIALIZE MODAL

========================= */

useEffect(() => {

  if (!isOpen) return;

  fetchCategories();

}, [isOpen]);

/* =========================

   HYDRATE PRODUCT DATA

========================= */

useEffect(() => {

  if (

    !isOpen ||

    !product ||

    mainCategories.length === 0

  ) return;

  /* -------------------------

     BASIC FORM DATA

  ------------------------- */

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

  /* -------------------------

     GENERAL IMAGES

  ------------------------- */

  setGeneralImages(

    product.images?.map((img: any) => img.imageUrl) || []

  );

  /* -------------------------

     VARIANTS

  ------------------------- */

  setVariants(

    product.variants?.map((v: any) => ({

      id: v.id,

      color: v.color || '',

      size: v.size || '',

      price: String(v.price || ''),

      stock: String(v.stock || ''),

      images:

        v.images?.map((img: any) => img.imageUrl) || [],

    })) || []

  );

  /* -------------------------

     CATEGORY TREE HYDRATION

  ------------------------- */

  for (const main of mainCategories) {

    const secondary = (main.children || []).find(

      (sec: any) =>

        (sec.children || []).some(

          (ter: any) => ter.id === product.categoryId

        ) ||

        sec.id === product.categoryId

    );

    if (!secondary) continue;

    setMainCatId(main.id);

    setSecondaryCategories(main.children || []);

    setSecondaryCatId(secondary.id);

    setTertiaryCategories(secondary.children || []);

    break;

  }

}, [isOpen, product, mainCategories]);

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

const handleMainChange = (id: string) => {

  setMainCatId(id);

  const selected = mainCategories.find(

    c => c.id === id

  );

  setSecondaryCategories(selected?.children || []);

  setSecondaryCatId('');

  setTertiaryCategories([]);

  setFormData(prev => ({

    ...prev,

    categoryId: '',

  }));

};

const handleSecondaryChange = (id: string) => {

  setSecondaryCatId(id);

  const selected = secondaryCategories.find(

    c => c.id === id

  );

  const children = selected?.children || [];

  setTertiaryCategories(children);

  /*

    If no tertiary category exists,

    use secondary as final category

  */

  setFormData(prev => ({

    ...prev,

    categoryId:

      children.length === 0

        ? id

        : '',

  }));

};

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    try {
const payload = {
  ...formData,

  price: formData.price
    ? Number(formData.price)
    : undefined,

  stock: formData.stock
    ? Number(formData.stock)
    : undefined,

  deliveryMin: formData.deliveryMin
    ? Number(formData.deliveryMin)
    : undefined,

  deliveryMax: formData.deliveryMax
    ? Number(formData.deliveryMax)
    : undefined,

  generalImages,

variants: variants.map(v => ({
  id: v.id,
  color: v.color,
  size: v.size,

  price:
    v.price !== '' && v.price !== undefined
      ? Number(v.price)
      : undefined,

  stock:
    v.stock !== '' && v.stock !== undefined
      ? Number(v.stock)
      : undefined,

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

        <form
  onSubmit={handleSubmit}
  className="p-6 lg:p-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 overflow-y-auto"
>

  {/* ================= LEFT COLUMN ================= */}
  <div className="space-y-8">

    {/* CATEGORY ENGINE */}
    <div className="bg-[#1E293B] p-6 rounded-[2rem] border border-slate-800">

      <h3 className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest">
        Categorization
      </h3>

      <div className="space-y-5">

        {/* MAIN */}
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">
            Department
          </label>

          <select
            required
            value={mainCatId}
            onChange={(e) => handleMainChange(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white"
          >
            <option value="">Select Department</option>

            {mainCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SECONDARY */}
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">
            Category
          </label>

          <select
            required
            value={secondaryCatId}
            disabled={!secondaryCategories.length}
            onChange={(e) => handleSecondaryChange(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white"
          >
            <option value="">Select Category</option>

            {secondaryCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* TERTIARY */}
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1">
            Sub Category
          </label>

          <select
            required
            value={formData.categoryId}
            disabled={!tertiaryCategories.length}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId: e.target.value,
              })
            }
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white"
          >
            <option value="">Select Sub Category</option>

            {tertiaryCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>

    {/* PRODUCT TITLE */}
    <div>
      <label className={labelClasses}>Product Title</label>

      <input
        className={inputClasses}
        value={formData.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
      />
    </div>

    {/* PRICE + STOCK */}
    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className={labelClasses}>Price</label>

        <input
          type="number"
          className={inputClasses}
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className={labelClasses}>Stock</label>

        <input
          type="number"
          className={inputClasses}
          value={formData.stock}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock: e.target.value,
            })
          }
        />
      </div>

    </div>

    {/* ORIGIN */}
    <div className="grid grid-cols-3 gap-4">

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
            <label className={labelClasses}>Delivery Min</label>

            <input
              type="number"
              className={inputClasses}
              value={formData.deliveryMin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryMin: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Delivery Max</label>

            <input
              type="number"
              className={inputClasses}
              value={formData.deliveryMax}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryMax: e.target.value,
                })
              }
            />
          </div>
        </>
      )}

    </div>

    {/* VARIANTS */}
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="font-black text-lg text-slate-900">
          Variants
        </h3>

        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 text-blue-600 text-sm font-bold"
        >
          <Plus size={18} />
          Add Variant
        </button>
      </div>

      {variants.map((variant, i) => (
        <div
          key={i}
          className="p-6 bg-white border border-slate-200 rounded-3xl"
        >

          <button
            type="button"
            onClick={() => removeVariant(i)}
            className="float-right text-red-500"
          >
            <Trash2 size={18} />
          </button>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-bold">
                Color
              </label>

              <input
                value={variant.color}
                onChange={(e) =>
                  updateVariant(i, 'color', e.target.value)
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="text-xs font-bold">
                Size
              </label>

              <input
                value={variant.size}
                onChange={(e) =>
                  updateVariant(i, 'size', e.target.value)
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="text-xs font-bold">
                Price
              </label>

              <input
                type="number"
                value={variant.price || ''}
                onChange={(e) =>
                  updateVariant(i, 'price', e.target.value)
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="text-xs font-bold">
                Stock
              </label>

              <input
                type="number"
                value={variant.stock || ''}
                onChange={(e) =>
                  updateVariant(i, 'stock', e.target.value)
                }
                className={inputClasses}
              />
            </div>

          </div>

          {/* VARIANT IMAGES */}
          <div className="mt-6">

            <label className="text-xs font-bold mb-2 block">
              Variant Images
            </label>

            <div className="flex gap-2 overflow-x-auto">

              <label className="w-12 h-12 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer">
                <Plus size={16} />

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) =>
                    handleVariantImageUpload(e, i)
                  }
                />
              </label>

              {variant.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-12 h-12 rounded-xl overflow-hidden"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const newImages = variant.images.filter(
                        (_, j) => j !== idx
                      );

                      updateVariant(
                        i,
                        'images',
                        newImages as any
                      );
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

    {/* DESCRIPTION */}
    <div>
      <label className={labelClasses}>Description</label>

      <textarea
        className={`${inputClasses} h-40 resize-none`}
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />
    </div>

    {/* SUBMIT */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white py-6 rounded-2xl font-bold text-sm tracking-widest"
    >
      {loading ? 'Updating...' : 'Save Changes'}
    </button>

  </div>

  {/* ================= RIGHT COLUMN ================= */}
  <div className="space-y-8">

    {/* GENERAL IMAGES */}
    <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-0">

      <h3 className="font-bold mb-4">
        General Product Images
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-4">

        <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 shrink-0">
          <Plus size={28} className="text-slate-400" />

          <input
            type="file"
            multiple
            hidden
            onChange={handleGeneralImageUpload}
          />
        </label>

        {generalImages.map((img, idx) => (
          <div
            key={idx}
            className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0"
          >

            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />

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

  </div>

</form>
      </div>
    </div>
  );
}