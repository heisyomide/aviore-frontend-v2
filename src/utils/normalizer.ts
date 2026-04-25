// src/utils/normalizer.ts
import { safeNumber, safeString, safeArray } from './safe';

export const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  // Clean the variants first
  const cleanVariants = safeArray(raw.variants).map((v: any) => ({
    id: safeString(v.id),
    color: safeString(v.color, 'Default'),
    sizes: safeArray(v.sizes).filter(s => s !== ""), // Remove empty strings
    images: safeArray(v.images).map((img: any) => ({
      id: safeString(img.id),
      imageUrl: safeString(img.imageUrl || img.url, '/placeholder.jpg')
    }))
  }));

  return {
    id: safeString(raw.id),
    title: safeString(raw.title || raw.name, 'Unnamed Product'),
    description: safeString(raw.description, 'No description available.'),
    price: safeNumber(raw.price, 0),
    stock: safeNumber(raw.stock, 0),
    origin: safeString(raw.origin, 'LOCAL').toUpperCase(),
    deliveryMin: safeNumber(raw.deliveryMin, 3),
    deliveryMax: safeNumber(raw.deliveryMax, 7),
    rating: safeNumber(raw.averageRating || raw.rating, 0),
    reviewCount: safeNumber(raw.reviewCount, 0),
    variants: cleanVariants,
    vendor: raw.vendor ? {
      id: safeString(raw.vendor.id),
      storeName: safeString(raw.vendor.storeName, 'Unknown Store'),
      logo: safeString(raw.vendor.imageUrl || raw.vendor.logo, ''),
      isVerified: !!raw.vendor.isVerified,
      followers: safeNumber(raw.vendor._count?.followers, 0),
      productsCount: safeNumber(raw.vendor._count?.products, 0),
      rating: safeNumber(raw.vendor.rating, 0),
    } : null,
    category: {
      name: safeString(raw.category?.name, 'General'),
      slug: safeString(raw.category?.slug, '')
    }
  };
};