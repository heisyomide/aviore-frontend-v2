export interface ProductImage {
  id?: string;
  imageUrl?: string;
  url?: string; // fallback support (some APIs use this)
  variantId?: string;
}

export interface Variant {
  id: string | null; // Use null for brand new variants
  color: string;     // Required for the Matrix logic
  size: string;      // 🔥 Singular 'size' for the Matrix row
  stock: number;     // Changed to number for the backend
  price: number | string; 
  images: string[];  // 🔥 Changed to string[] to match Cloudinary URLs
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