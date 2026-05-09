'use client';

import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  useWishlistStore,
  WishlistItem,
} from '@/src/store/useWishlistStore';

import { useCartStore } from '@/src/store/useCartStore';

interface WishlistCardProps {
  item: WishlistItem;
}

export function WishlistCard({
  item,
}: WishlistCardProps) {
  const router = useRouter();

  const { toggleWishlist } =
    useWishlistStore();

  const { addItem } = useCartStore();

  const handleRemove = async (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    await toggleWishlist({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color,
      size: item.size,
    });

    toast.success(
      'Removed from wishlist',
    );
  };

  const handleAddToCart = async (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    await addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: '',
      stock: 999,
      quantity: 1,
      color: item.color,
      size: item.size,
    });

    toast.success('Added to cart');
  };

  return (
    <div
      onClick={() =>
        router.push(
          `/product/${item.productId}`,
        )
      }
      className="group bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-zinc-50 overflow-hidden">
        <Image
          src={
            item.image ||
            '/placeholder.png'
          }
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* REMOVE */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-zinc-200 flex items-center justify-center hover:bg-red-50 transition"
        >
          <Heart
            size={16}
            className="fill-[#A4143D] text-[#A4143D]"
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-zinc-900 line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-zinc-400 mt-1">
            Luxury Collection
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-[#A4143D]">
            ₦
            {Number(
              item.price || 0,
            ).toLocaleString()}
          </span>

          <button
            onClick={handleAddToCart}
            className="h-11 px-4 rounded-full bg-black text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-[#A4143D] transition"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>

        {(item.color || item.size) && (
          <div className="flex gap-2 flex-wrap pt-2">
            {item.color && (
              <span className="px-2 py-1 rounded-full bg-zinc-100 text-[10px] font-bold uppercase">
                {item.color}
              </span>
            )}

            {item.size && (
              <span className="px-2 py-1 rounded-full bg-zinc-100 text-[10px] font-bold uppercase">
                {item.size}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}