'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Heart } from 'lucide-react';

interface GalleryProps {
  images?: any[]; // Made optional for safety
  title?: string;
}

export function ProductGallery({ images = [], title = "Product Image" }: GalleryProps) {
  const [activeImg, setActiveImg] = useState(0);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  const resolvedImages = useMemo(() => {
    // Ensure we are working with an array
    const list = Array.isArray(images) ? images : [];
    
    if (list.length === 0) return ['/placeholder.jpg'];

    return list
      .map((img) => {
        if (!img) return null;
        
        // Handle string path or object with imageUrl/url
        const path = typeof img === 'string' ? img : (img?.imageUrl || img?.url);
        if (!path || typeof path !== 'string') return null;

        if (path.startsWith('http')) return path;

        // Ensure path doesn't have double slashes
        const cleanPath = path.replace(/^\//, '');
        return `${apiBase}/uploads/${cleanPath}`;
      })
      .filter((url): url is string => url !== null);
  }, [images, apiBase]);

  // Reset active image if the list changes and the current index is out of bounds
  useEffect(() => {
    if (activeImg >= resolvedImages.length) {
      setActiveImg(0);
    }
  }, [resolvedImages, activeImg]);

  // Final safety check for the current image string
  const currentImage = resolvedImages[activeImg] || resolvedImages[0] || '/placeholder.jpg';

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnail Strip */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-scrollbar py-2">
        {resolvedImages.map((img, idx) => (
          <button
            key={`thumb-${idx}-${img.slice(-10)}`} // More unique key
            onClick={() => setActiveImg(idx)}
            type="button"
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
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
      <div className="flex-1 relative aspect-square md:aspect-[4/5] rounded-[2.5rem] bg-zinc-50 overflow-hidden order-1 md:order-2 group">
        <Image
          src={currentImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button 
            type="button"
            className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition active:scale-90"
          >
            <Heart size={20} className="text-zinc-900" />
          </button>
          <button 
            type="button"
            className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition active:scale-90"
          >
            <Share2 size={20} className="text-zinc-900" />
          </button>
        </div>
      </div>
    </div>
  );
}