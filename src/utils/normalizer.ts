// src/utils/normalizer.ts
import { safeNumber, safeString, safeArray } from './safe';

export const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  const variants = safeArray(raw.variants).map((v: any) => ({
    id: safeString(v.id),
    color: safeString(v.color, 'Default'),
    size: safeString(v.size, ''), // ✅ FIXED
    price: safeNumber(v.price, 0), // ✅ KEEP PRICE
    stock: safeNumber(v.stock, 0), // ✅ KEEP STOCK
    images: safeArray(v.images).map((img: any) => ({
      id: safeString(img.id),
      imageUrl: safeString(img.imageUrl || img.url, '/placeholder.jpg'),
    })),
  }));

  // ✅ COMPUTE CORE VALUES
  const prices = variants.map(v => v.price).filter(p => p > 0);
  const displayPrice = prices.length ? Math.min(...prices) : 0;

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  return {
    id: safeString(raw.id),
    title: safeString(raw.title || raw.name, 'Unnamed Product'),
    description: safeString(raw.description, ''),

    // ❌ DON'T TRUST THESE ANYMORE
    basePrice: safeNumber(raw.price, 0),

    // ✅ USE THESE
    displayPrice,
    totalStock,

    origin: safeString(raw.origin, 'LOCAL').toUpperCase(),
    deliveryMin: safeNumber(raw.deliveryMin, 3),
    deliveryMax: safeNumber(raw.deliveryMax, 7),

    rating: safeNumber(raw.averageRating, 0),
    reviewCount: safeNumber(raw.reviewCount, 0),

    variants,

    vendor: raw.vendor
      ? {
          id: safeString(raw.vendor.id),
          storeName: safeString(raw.vendor.storeName),
          logo: safeString(raw.vendor.imageUrl, ''),
          isVerified: !!raw.vendor.isVerified,
          followers: safeNumber(raw.vendor._count?.followers, 0),
          productsCount: safeNumber(raw.vendor._count?.products, 0),
        }
      : null,

    category: {
      name: safeString(raw.category?.name, 'General'),
      slug: safeString(raw.category?.slug, ''),
    },
  };
};