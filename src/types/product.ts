export interface ProductImage {
  id: string;
  imageUrl: string;
  variantId?: string;
}

export interface Variant {
  id: string;
  color: string;
  sizes: string[];
  images: ProductImage[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string | number; // Handling the string from your API
  stock: number;
  images: string[]; // Usually empty in your API
  variants: Variant[];
  vendorId: string;
  category?: {
    slug: string;
    name: string;
  };
}

export interface Vendor {
  id: string;
  storeName: string;
  imageUrl: string | null;
  followers: number;
  productsCount: number;
}