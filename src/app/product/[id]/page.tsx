'use client';

import { useState } from 'react';

export default function ProductDetailsPage() {
  const [qty, setQty] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);

  // 🔥 STATIC SAFE DATA (no undefined anywhere)
  const product = {
    id: '1',
    title: 'Luxury Black Hoodie',
    subTitle: 'Premium Streetwear',
    price: 25000,
    originalPrice: 30000,
    discount: 20,
    rating: 4.5,
    reviewCount: 12,
    stock: 10,
    description: 'This is a premium hoodie designed for comfort and style.',
    images: ['/placeholder.jpg'],
    vendor: {
      name: 'Aviore Store',
    },
  };

  const handleAddToCart = async () => {
    console.log('Added to cart');
  };

  const handleBuyNow = async () => {
    console.log('Buy now');
  };

  const handleFollow = async () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white p-10">
      
      <div className="grid lg:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div>
          <img
            src={product.images[0]}
            alt="product"
            className="w-full rounded-2xl"
          />
        </div>

        {/* INFO */}
        <div className="space-y-6">

          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500">{product.subTitle}</p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">
              ₦{product.price.toLocaleString()}
            </span>
            <span className="line-through text-gray-400">
              ₦{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-green-600">
              -{product.discount}%
            </span>
          </div>

          <div>
            ⭐ {product.rating} ({product.reviewCount} reviews)
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3 rounded-full"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="border px-6 py-3 rounded-full"
            >
              Buy Now
            </button>
          </div>

          {/* VENDOR */}
          <div className="border p-4 rounded-xl">
            <p className="font-semibold">{product.vendor.name}</p>
            <button onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="font-bold">Description</h2>
            <p>{product.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
}