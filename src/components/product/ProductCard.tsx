'use client';

import { useMemo } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, ImageOff } from "lucide-react";
import { Rating } from "../ui/Rating";
import { useCartStore } from "../../store/useCartStore";

export function ProductCard({ product }: any) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 🖼️ Image Resolver Logic
  const resolvedImage = useMemo(() => {
    const hasImagesArray = product.images && product.images.length > 0;
    const rawValue = hasImagesArray 
      ? product.images[0].imageUrl 
      : product.image;

    if (!rawValue || typeof rawValue !== 'string') return null;

    return rawValue.startsWith('http') 
      ? rawValue 
      : `${apiBase}/uploads/${rawValue.replace(/^\//, '')}`;
  }, [product, apiBase]);

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!product.id) return;

    addItem({
      id: product.id,
      name: product.title || product.name || "Unknown Product",
      price: product.price || 0,
      image: resolvedImage || "/placeholder.png",
      vendorId: product.vendorId,
      stock: product.stock || 0,
      quantity: 1,
    });
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group relative bg-white rounded-2xl p-3 border border-transparent hover:border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
    >
      {/* 🖼️ 1. VISUAL HUB */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center border border-gray-50">
        {resolvedImage ? (
          <Image 
            src={resolvedImage} 
            alt={product.title || "Product image"} 
            fill 
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <ImageOff size={24} />
            <span className="text-[8px] font-black uppercase tracking-widest">No Media</span>
          </div>
        )}
        
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#A4143D] text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg z-10">
            -{product.discount}%
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/40 to-transparent hidden md:block">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white text-black text-[10px] font-black py-3 rounded-xl shadow-xl uppercase tracking-widest hover:bg-[#A4143D] hover:text-white transition-all active:scale-90 flex items-center justify-center gap-2"
          >
            <Zap size={12} fill="currentColor" />
            Quick Add
          </button>
        </div>
      </div>

      {/* 📝 2. PRODUCT DATA */}
      <div className="space-y-3 px-1">
        <h3 className="text-[11px] font-black text-gray-500 line-clamp-2 h-8 leading-tight group-hover:text-black transition-colors uppercase tracking-tight">
          {product.title || product.name}
        </h3>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#A4143D] italic tracking-tighter">
              ₦{(product.price || 0).toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] text-gray-300 line-through">
                ₦{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleQuickAdd}
            className="md:hidden w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-black active:bg-[#A4143D] active:text-white transition-all active:scale-90"
          >
            <ShoppingCart size={14} strokeWidth={3} />
          </button>
        </div>

        {/* ⭐ 3. SOCIAL PROOF & STOCK */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          {/* 🚀 FIXED: Passed .length for reviews array to prevent runtime object error */}
          <Rating 
            rate={product.averageRating || product.rating || 5} 
            count={Array.isArray(product.reviews) ? product.reviews.length : (product.reviewCount || 0)} 
          />
          
          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-tighter ${
            product.stock < 10 ? "text-orange-600 bg-orange-50 animate-pulse" : "text-emerald-600 bg-emerald-50"
          }`}>
             {product.stock < 10 ? `Only ${product.stock} Left` : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}