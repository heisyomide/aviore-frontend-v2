'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Share2, Heart } from 'lucide-react';

interface GalleryProps {
  images: any[];        // Keep as is
  title: string;
}

export function ProductGallery({ images, title }: GalleryProps) {
  const [activeImg, setActiveImg] = useState(0);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'; // your backend port

  const resolvedImages = useMemo(() => {
    // Stronger safety: treat null/undefined as empty array
    const imageList = Array.isArray(images) ? images : [];

    if (imageList.length === 0) {
      return ['/placeholder.jpg'];
    }

    return imageList
      .filter((img): img is any => img != null) // remove null/undefined
      .map((img) => {
        const path = typeof img === 'string' 
          ? img 
          : img?.imageUrl || img?.url;

        if (!path) return '/placeholder.jpg';

        if (path.startsWith('http')) return path;

        // Clean path and add base URL
        const cleanPath = path.replace(/^\//, '');
        return `${apiBase}/uploads/${cleanPath}`;
      });
  }, [images, apiBase]);

  // Safety for active image index
  const currentImage = resolvedImages[activeImg] || resolvedImages[0] || '/placeholder.jpg';

  console.log('🖼 GALLERY INPUT:', images);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnail Strip */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-scrollbar py-2">
        {resolvedImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImg(idx)}
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
              activeImg === idx ? 'border-black scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={img} 
              alt={`${title} view ${idx}`} 
              fill 
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
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition active:scale-90">
            <Heart size={20} className="text-zinc-900" />
          </button>
          <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition active:scale-90">
            <Share2 size={20} className="text-zinc-900" />
          </button>
        </div>
      </div>
    </div>
  );
}