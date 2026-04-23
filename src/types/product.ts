export interface ProductImage {
  id?: string;
  imageUrl?: string;
  url?: string; // fallback support (some APIs use this)
  variantId?: string;
}

export interface Variant {
  id: string;
  color?: string;

  sizes?: string[]; // API may omit this
  stock?: number;

  price?: number | string;

  images?: ProductImage[]; // ❗ make optional (this was crashing you)
}

export interface Product {
  id: string;

  title?: string;
  name?: string; // fallback (you already use this in UI)

  description?: string;

  price?: number | string; // ❗ make optional (fix TS + runtime)
  oldPrice?: number;

  stock?: number;

  images?: (string | ProductImage)[]; // ❗ support BOTH formats
  image?: string; // fallback single image

  variants?: Variant[]; // ❗ optional

  vendorId: string;

  category?: {
    slug?: string;
    name?: string;
  };

  // 🔥 DELIVERY (your new feature)
  origin?: 'local' | 'international' | string;
  deliveryMin?: number;
  deliveryMax?: number;
  deliveryUnit?: string;

  // 🔥 REVIEWS (used in ProductCard)
  averageRating?: number;
  rating?: number;
  reviews?: any[];
  reviewCount?: number;

  // 🔥 UI extras
  discount?: number;
}

export interface Vendor {
  id: string;
  storeName: string;

  imageUrl?: string | null;

  followers?: number;
  productsCount?: number;

  rating?: number;
  responseRate?: number;

  isVerified?: boolean;
}