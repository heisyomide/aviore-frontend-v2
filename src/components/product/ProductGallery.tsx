'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Heart } from 'lucide-react';
import { useWishlistStore } from '@/src/store/useWishlistStore';

interface GalleryProps {
  images?: any[];
  title?: string;
  productId: string;
  price: number;           // Required by your component
}

export function ProductGallery({ 
  images = [], 
  title = "Product Image", 
  productId, 
  price 
}: GalleryProps) {
  
  const [activeImg, setActiveImg] = useState(0);
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const isLiked = isWishlisted(productId);

  const resolvedImages = useMemo(() => {
    const list = Array.isArray(images) ? images : [];
    if (list.length === 0) return ['/placeholder.jpg'];

    return list
      .map((img) => {
        if (!img) return null;
        const path = typeof img === 'string' ? img : (img?.imageUrl || img?.url);
        if (!path || typeof path !== 'string') return null;

        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\//, '');
        return `${apiBase}/uploads/${cleanPath}`;
      })
      .filter((url): url is string => url !== null);
  }, [images, apiBase]);

  useEffect(() => {
    if (activeImg >= resolvedImages.length) {
      setActiveImg(0);
    }
  }, [resolvedImages]);

  const currentImage = resolvedImages[activeImg] || resolvedImages[0] || '/placeholder.jpg';

  const handleWishlist = () => {
    toggleWishlist({
      id: productId,
    
      name: title,
      price: price,                    // Now using real price
      image: currentImage,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: "Check out this product on Aviorè", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-scrollbar py-2">
        {resolvedImages.map((img, idx) => (
          <button
            key={`thumb-${idx}`}
            onClick={() => setActiveImg(idx)}
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
              activeImg === idx 
                ? 'border-black scale-95 shadow-md' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={img} 
              alt={`${title} thumbnail ${idx + 1}`} 
              fill 
              sizes="(max-width: 768px) 64px, 80px"
              className="object-cover" 
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative aspect-square md:aspect-[4/5] rounded-2xl bg-white border border-zinc-100 overflow-hidden p-6">
        <Image
          src={currentImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />

        {/* Floating Actions */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          <button 
            onClick={handleWishlist}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow hover:bg-white transition active:scale-90"
          >
            <Heart 
              size={20} 
              className={isLiked ? "fill-red-500 text-red-500" : "text-zinc-900"} 
            />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 bg-white/90 backdrop-blur-md text-zinc-900 rounded-full shadow hover:bg-white transition active:scale-90"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}