import { safeNumber, safeString, safeArray } from './safe';

export const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  // 1. Clean variants with Matrix fields (price/stock/size)
  const cleanVariants = safeArray(raw.variants).map((v: any) => ({
    id: safeString(v.id),
    color: safeString(v.color, 'Default'),
    // Support both the new Matrix 'size' and the old 'sizes' array
    size: safeString(v.size || (v.sizes && v.sizes[0]) || ''), 
    price: safeNumber(v.price, 0),
    stock: safeNumber(v.stock, 0),
    images: safeArray(v.images).map((img: any) => ({
      id: safeString(img.id),
      imageUrl: safeString(img.imageUrl || img.url, '/placeholder.jpg')
    }))
  }));

  return {
    id: safeString(raw.id),
    title: safeString(raw.title || raw.name, 'Unnamed Product'),
    description: safeString(raw.description, 'No description available.'),
    
    // 2. ROOT PRICING: Priority to displayPrice to avoid the ₦0 bug
    displayPrice: safeNumber(raw.displayPrice || raw.price, 0),
    basePrice: safeNumber(raw.price, 0),
    
    // 3. ROOT STOCK: Use totalStock so it doesn't show "Out of Stock" immediately
    totalStock: safeNumber(raw.totalStock ?? raw.stock, 0),
    
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
      followers: safeNumber(raw.vendor._count?.followers || raw.vendor.followers, 0),
      productsCount: safeNumber(raw.vendor._count?.products || raw.vendor.productsCount, 0),
      rating: safeNumber(raw.vendor.rating, 0),
    } : null,
    category: {
      name: safeString(raw.category?.name, 'General'),
      slug: safeString(raw.category?.slug, '')
    }
  };
};