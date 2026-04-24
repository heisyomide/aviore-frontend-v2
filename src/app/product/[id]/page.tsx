'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Hooks & Store
import { useProductData } from '@/src/hooks/useProductData';
import { useCartStore } from '@/src/store/useCartStore';

// Components
import { ProductGallery } from '@/src/components/product/ProductGallery';
import { VariantSelector } from '@/src/components/product/VariantSelector';
import { QuantitySelector } from '@/src/components/product/QuantitySelector';
import { ProductActions } from '@/src/components/product/ProductActions';
import { VendorCard } from '@/src/components/product/VendorCard';
import { DeliveryInfo } from '@/src/components/product/DeliveryInfo';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { RecommendedProducts } from '@/src/components/product/RecommendedProducts';

// Layout
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

/**
 * 1. PURE UTILITIES
 * Extracted from the component scope to avoid re-allocation on every render.
 */
const toSafeNumber = (value: any, fallback = 0): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

const getSafeImage = (product: any, selectedVariant: any): string => {
  if (selectedVariant?.images?.[0]?.imageUrl) return selectedVariant.images[0].imageUrl;
  if (typeof product?.images?.[0] === 'string') return product.images[0];
  return product?.images?.[0]?.imageUrl || '/placeholder.jpg';
};

export default function ProductDetailsPage() {
  const { id: productId } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // 2. DATA FETCHING & UI STATE
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(productId as string);

  const [isFollowing, setIsFollowing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 3. MEMOIZED LOGIC
  const priceData = useMemo(() => {
    if (!product) return { current: 0, original: 0, discount: 0 };
    const current = toSafeNumber(product.price);
    return {
      current,
      original: Math.round(current * 1.2), // Matches AVIORÈ's 20% luxury markup
      discount: current > 0 ? 20 : 0,
    };
  }, [product]);

  const safeImage = useMemo(() => 
    getSafeImage(product, selectedVariant), 
    [product, selectedVariant]
  );

  // 4. HANDLERS
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    if (product.variants?.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    addItem({
      id: product.id,
      name: product.title,
      price: priceData.current, 
      image: safeImage,
      vendorId: product.vendorId,
      stock: product.stock,
      quantity: qty,
      size: selectedSize,
      variant: selectedVariant 
    });
  }, [product, selectedSize, selectedVariant, priceData.current, safeImage, qty, addItem]);

  const handleBuyNow = async () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing(prev => !prev);
    // await toggleFollow(vendor?.id);
  };

  // 5. GUARD RAILS
  if (!mounted || loading) return <ProductSkeleton />;
  
  if (!product?.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <Container className="py-40 text-center">
          <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
            Product Not Found
          </h1>
          <button 
            onClick={() => router.push('/shop')}
            className="px-8 py-3 bg-black text-white rounded-full text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Back to Shop
          </button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT: VISUALS & DETAILED CONTENT */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery 
              images={selectedVariant?.images || product?.images || []} 
              title={product.title} 
            />
            <div className="hidden lg:block pt-12 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </div>

          {/* RIGHT: INTERACTIVE SIDEBAR */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <div className="space-y-4">
               <h1 className="text-3xl font-light tracking-tight text-zinc-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-medium text-zinc-800">
                ₦{priceData.current.toLocaleString()}
              </p>
            </div>

            <VariantSelector 
              variants={product.variants || []}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <div className="p-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 space-y-8">
              <QuantitySelector qty={qty} setQty={setQty} maxStock={product.stock} />
              <ProductActions 
                stockCount={product.stock}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow} 
              />
            </div>

            {vendor && (
              <VendorCard 
                vendor={vendor} 
                isFollowing={isFollowing} 
                onFollow={handleFollow} 
              />
            )}
            
            <DeliveryInfo 
              origin={product.origin}
              min={product.deliveryMin}
              max={product.deliveryMax}
            />

            <div className="lg:hidden pt-10 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        {recommended?.length > 0 && (
          <RecommendedProducts products={recommended} />
        )}
      </Container>
    </div>
  );
}