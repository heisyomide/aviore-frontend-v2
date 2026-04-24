'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Hooks & Store
import { useProductData } from '@/src/hooks/useProductData';
import { useCartStore } from '@/src/store/useCartStore';

// Components
import { ProductGallery } from '@/src/components/product/ProductGallery';
import { ProductInfo } from '@/src/components/product/ProductInfo';
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

export default function ProductDetailsPage() {
  const { id: productId } = useParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    product,
    vendor,
    recommended,
    loading,
    selectedVariant,
    setSelectedVariant,
    selectedSize,
    setSelectedSize,
    qty,
    setQty,
  } = useProductData(productId as string);

  const [isFollowing, setIsFollowing] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // ✅ SAFE HELPERS (centralized)
  const toSafeNumber = (value: any, fallback = 0): number => {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  };

  const toSafeString = (value: any, fallback = ''): string => {
    if (value === null || value === undefined) return fallback;
    return String(value);
  };

  // ✅ PRICE LOGIC
  const priceData = useMemo(() => {
    const base = toSafeNumber(product?.price);

    return {
      current: base,
      original: Math.round(base * 1.2),
      discount: base > 0 ? 20 : 0,
    };
  }, [product]);

  // ✅ SAFE IMAGE
  const safeImage = useMemo(() => {
    if (selectedVariant?.images?.length) {
      return selectedVariant.images[0]?.imageUrl || '/placeholder.jpg';
    }

    if (product?.images?.length) {
      const first = product.images[0];
      return typeof first === 'string'
        ? first
        : first?.imageUrl || '/placeholder.jpg';
    }

    return '/placeholder.jpg';
  }, [selectedVariant, product]);

  // ✅ SAFE NUMBERS
  const rating = toSafeNumber(product?.rating);
  const reviewCount = toSafeNumber(product?.reviewCount);

  // ✅ HANDLERS
  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    if (product.variants?.length && !selectedSize) {
      alert('Please select a size to continue.');
      return;
    }

    addItem({
      id: product.id,
      name: toSafeString(product.title, 'Untitled'),
      price: priceData.current,
      image: safeImage,
      vendorId: product.vendorId,
      stock: product.stock ?? 0,
      quantity: qty,
      size: selectedSize,
      variant: selectedVariant,
    });
  }, [product, selectedSize, selectedVariant, priceData, qty, safeImage, addItem]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing((prev) => !prev);
  };

  // ✅ LOADING GUARD
  if (!mounted || loading) return <ProductSkeleton />;

  // ✅ NOT FOUND GUARD
  if (!product?.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <Container className="py-40 text-center">
          <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
            Product Not Found
          </h1>
          <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
            The item you are looking for may be unavailable.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-8 py-3 bg-black text-white rounded-full text-xs uppercase tracking-widest"
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

          {/* GALLERY */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery
              images={selectedVariant?.images || product.images || []}
              title={toSafeString(product.title, 'Product')}
            />

            <div className="hidden lg:block pt-12 border-t border-zinc-100">
              <ProductDescription description={product.description || ''} />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">

            <ProductInfo
              title={toSafeString(product.title)}
              subTitle={toSafeString(product.subTitle)}
              price={priceData.current}
              originalPrice={priceData.original}
              discount={priceData.discount}
              rating={rating}
              reviewCount={reviewCount}
            />

            <VariantSelector
              variants={product.variants || []}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <div className="p-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 space-y-8">
              <QuantitySelector
                qty={qty}
                setQty={setQty}
                maxStock={product.stock ?? 0}
              />

              <ProductActions
                stockCount={product.stock ?? 0}
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
              <ProductDescription description={product.description || ''} />
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