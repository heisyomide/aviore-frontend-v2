'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductProps {
  product: {
    id: string;
    name?: string;
    title?: string;
    price: number | string;
    images: any[]; // Prisma returns string[] or object[]
    category?: { name: string };
    rating?: number;
    sold?: number;
    discount?: number;
    stock?: number;
    vendor?: { storeName: string };
  };
}

export function ProductCard({ product }: ProductProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const [imgError, setImgError] = useState(false);

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const isLiked = wishlistItems.some((item) => item.id === product.id);

  /**
   * 🛠️ UNIVERSAL IMAGE RESOLVER
   * Resolves images from Prisma arrays, cloud URLs, or local NestJS uploads.
   */
  const getDisplayImage = () => {
    if (imgError) return '/placeholder.jpg';
    
    const imageItem = product.images?.[0];
    if (!imageItem) return '/placeholder.jpg';

    // 1. Extract raw string from either String or Object
    const rawPath = typeof imageItem === 'string' 
      ? imageItem 
      : imageItem.url || imageItem.imageUrl || imageItem.path;

    if (!rawPath || typeof rawPath !== 'string') return '/placeholder.jpg';

    // 2. Handle absolute URLs (Cloudinary/S3)
    if (rawPath.startsWith('http')) return rawPath;

    // 3. Handle local NestJS uploads
    const backendBase = process.env.NEXT_PUBLIC_API_URL;
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    
    // If your backend serves static files from /uploads
    return `${backendBase}/uploads${cleanPath}`;
  };

  const displayImage = getDisplayImage();
  const productName = product.name || product.title || "Unnamed Artifact";
  const numericPrice = typeof product.price === 'string'
    ? parseFloat(product.price.replace(/,/g, '')) || 0
    : Number(product.price);

  const handleAction = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("AUTH_REQUIRED", { description: "Please login to manage your registry." });
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    callback();
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 flex flex-col h-full">
      
      {/* 🖼️ IMAGE LAYER */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={displayImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-700 ${!imgError && 'group-hover:scale-110'}`}
          unoptimized={displayImage.includes('localhost')} 
          onError={() => setImgError(true)}
        />
        
        {/* TOP BADGES */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {product.discount && (
            <div className="bg-[#A4143D] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.category?.name && (
            <div className="bg-white/90 backdrop-blur-md text-gray-950 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-100 shadow-sm">
              {product.category.name}
            </div>
          )}
        </div>

        {/* INTERACTION OVERLAY */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => handleAction(e, () => isLiked ? removeFromWishlist(product.id) : addToWishlist(product as any))}
            className={`p-4 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl transform translate-y-4 group-hover:translate-y-0 ${
              isLiked 
                ? 'bg-[#A4143D] border-[#A4143D] text-white' 
                : 'bg-white/20 border-white/40 text-white hover:bg-white hover:text-black'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          
          <Link 
            href={`/product/${product.id}`} 
            className="p-4 bg-white text-gray-950 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 delay-75 hover:bg-[#A4143D] hover:text-white transition-all duration-300"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>

      {/* 📝 CONTENT LAYER */}
      <div className="p-7 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight h-10">
              {productName}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
              {product.vendor?.storeName || 'Aviore_Official'}
            </p>
          </div>
          <p className="text-xl font-black text-[#A4143D] italic tracking-tighter">
            ₦{numericPrice.toLocaleString()}
          </p>
        </div>

        {/* 📊 FOOTER STATS */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Star size={10} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black text-amber-700">{product.rating || '4.8'}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
              {product.sold || 0} SOLD
            </span>
          </div>
          
          <button
            onClick={(e) => handleAction(e, () => {
              addItem({ 
                id: product.id, 
                name: productName, 
                price: numericPrice, 
                image: displayImage, 
                vendorId: 'default', 
                stock: product.stock || 10, 
                quantity: 1 
              });
              toast.success("SUCCESS", { description: "Added to your registry." });
            })}
            className="group/btn flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:text-[#A4143D] transition-colors"
          >
            <div className="p-2.5 rounded-xl bg-gray-50 group-hover/btn:bg-[#FBE9E3] group-hover/btn:rotate-12 transition-all">
                <ShoppingBag size={14} className="group-hover/btn:text-[#A4143D]" />
            </div>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}