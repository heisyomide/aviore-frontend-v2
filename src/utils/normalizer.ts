// src/utils/normalizer.ts
import { safeNumber, safeString, safeArray } from './safe';

// src/utils/normalizer.ts

export const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  const variants = safeArray(raw.variants).map((v: any) => ({
    id: safeString(v.id),
    color: safeString(v.color, 'Default'),
    size: safeString(v.size, ''),
    price: safeNumber(v.price, 0),
    stock: safeNumber(v.stock, 0),

    images: safeArray(v.images).map((img: any) => ({
      id: safeString(img.id),
      imageUrl: safeString(
        img.imageUrl || img.url,
        '/placeholder.jpg'
      ),
    })),
  }));

  // ✅ ADD THIS
  const images = safeArray(raw.images).map((img: any) => ({
    id: safeString(img.id),
    imageUrl: safeString(
      img.imageUrl || img.url,
      '/placeholder.jpg'
    ),
  }));

  const prices = variants
    .map(v => v.price)
    .filter(p => p > 0);

  const displayPrice =
    prices.length ? Math.min(...prices) : 0;

  const totalStock = variants.reduce(
    (sum, v) => sum + v.stock,
    0
  );

  return {
    id: safeString(raw.id),

    title: safeString(
      raw.title || raw.name,
      'Unnamed Product'
    ),

    description: safeString(
      raw.description,
      ''
    ),

    // ✅ ADD THIS
    images,

    basePrice: safeNumber(raw.price, 0),

    displayPrice,

    totalStock,

    origin: safeString(
      raw.origin,
      'LOCAL'
    ).toUpperCase(),

    deliveryMin: safeNumber(
      raw.deliveryMin,
      3
    ),

    deliveryMax: safeNumber(
      raw.deliveryMax,
      7
    ),

    rating: safeNumber(
      raw.averageRating,
      0
    ),

    reviewCount: safeNumber(
      raw.reviewCount,
      0
    ),

    variants,

    vendor: raw.vendor
      ? {
          id: safeString(raw.vendor.id),

          storeName: safeString(
            raw.vendor.storeName
          ),

          logo: safeString(
            raw.vendor.imageUrl,
            ''
          ),

          isVerified:
            !!raw.vendor.isVerified,

          followers: safeNumber(
            raw.vendor._count?.followers,
            0
          ),

          productsCount: safeNumber(
            raw.vendor._count?.products,
            0
          ),
        }
      : null,

    category: {
      name: safeString(
        raw.category?.name,
        'General'
      ),

      slug: safeString(
        raw.category?.slug,
        ''
      ),
    },
  };
};