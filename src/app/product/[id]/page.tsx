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
  
  // 1. Hydration & Mount State
  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    setMounted(true); 
  }, []);

  // 2. Data Fetching
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(productId as string);

  const [isFollowing, setIsFollowing] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // 3. Defensive Price Logic
const priceData = useMemo(() => {
  if (!product) return { current: 0, original: 0, discount: 0 };

  const basePrice =
    typeof product.price === 'number'
      ? product.price
      : typeof product.price === 'string'
      ? parseFloat(product.price)
      : 0;

  const safePrice = isNaN(basePrice) ? 0 : basePrice;

  return {
    current: safePrice,
    original: safePrice * 1.2,
    discount: safePrice ? 20 : 0
  };
}, [product]);

const safeImage =
  selectedVariant?.images?.[0]?.imageUrl ||
  (typeof product.images?.[0] === 'string'
    ? product.images[0]
    : product.images?.[0]?.imageUrl) ||
  '/placeholder.jpg';

  // 4. Handlers
  const handleAddToCart = useCallback(async () => {
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
  }, [product, selectedSize, selectedVariant, priceData, qty, addItem]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing(prev => !prev);
    // Future API call: await toggleFollow(vendor?.id);
  };

  // 5. High-Priority Guard Rails
  // Prevents UI flicker and crashes if data is missing during a timeout
  if (!mounted || loading) return <ProductSkeleton />;
  
  if (!product || !product.id) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <Container className="py-40 text-center">
          <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
            Product Not Found
          </h1>
          <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
            The item you are looking for may have been moved or is currently unavailable.
          </p>
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
          
          {/* GALLERY SECTION */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery 
              images={selectedVariant?.images?.map((img: any) => img.imageUrl) || product.images || []} 
              title={product.title} 
            />
            <div className="hidden lg:block pt-12 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </div>

          {/* PRODUCT CONFIGURATION SIDEBAR */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <ProductInfo 
              title={product.title}
              price={priceData.current}
              originalPrice={priceData.original}
              discount={priceData.discount}
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
                maxStock={product.stock} 
              />
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

        {recommended && recommended.length > 0 && (
          <RecommendedProducts products={recommended} />
        )}
      </Container>
    </div>
  );
}