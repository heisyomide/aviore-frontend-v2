'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Heart } from 'lucide-react';
import { useWishlistStore } from '@/src/store/useWishlistStore';

interface GalleryProps {
  images?: any[];
  title?: string;
  productId: string;
  price: number;
}

export function ProductGallery({
  images = [],
  title = 'Product Image',
  productId,
  price,
}: GalleryProps) {
  const [activeImg, setActiveImg] = useState(0);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const { toggleWishlist, isWishlisted } =
    useWishlistStore();

  const isLiked = isWishlisted(productId);

const resolvedImages = useMemo(() => {
  const list = Array.isArray(images)
    ? images
    : [];

  if (!list.length) {
    return ['/placeholder.jpg'];
  }

  const normalized = list
    .map((img) => {
      if (!img) return null;

      let path = '';

      if (typeof img === 'string') {
        path = img;
      } else if (img?.imageUrl) {
        path = img.imageUrl;
      } else if (img?.url) {
        path = img.url;
      }

      if (!path) return null;

      // Full URL already
      if (path.startsWith('http')) {
        return path;
      }

      // Already contains uploads
      if (path.startsWith('/uploads')) {
        return `${apiBase}${path}`;
      }

      // Plain filename
      return `${apiBase}/uploads/${path.replace(/^\//, '')}`;
    })
    .filter((img): img is string => Boolean(img));

  // remove duplicates
  return [...new Set(normalized)];
}, [images, apiBase]);

useEffect(() => {
  setActiveImg(0);
}, [images]);


  const currentImage =
    resolvedImages[activeImg] ||
    '/placeholder.jpg';

  const handleWishlist = () => {
    toggleWishlist({
      id: productId,
      name: title,
      price,
      image: currentImage,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
      {/* THUMBNAILS */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-24">
        {resolvedImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImg(idx)}
            className={`relative w-16 h-20 lg:w-20 lg:h-24 overflow-hidden rounded-2xl border transition-all shrink-0 ${
              activeImg === idx
                ? 'border-black'
                : 'border-zinc-100 opacity-60'
            }`}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative flex-1 bg-[#f5f5f5] overflow-hidden rounded-none lg:rounded-[2rem] aspect-[4/5]">
        <Image
          src={currentImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width:768px) 100vw, 60vw"
        />

        {/* FLOATING ACTIONS */}
        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <button
            onClick={handleWishlist}
            className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md"
          >
            <Heart
              size={18}
              className={
                isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-black'
              }
            />
          </button>

          <button
            className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* IMAGE COUNT */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold">
          {activeImg + 1}/
          {resolvedImages.length}
        </div>
      </div>
    </div>
  );
}