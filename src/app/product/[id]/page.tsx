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
import { safeNumber, safeString } from '@/src/utils/safe';

// Layout
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

export default function ProductDetailsPage() {
  console.log('🚀 [PAGE] Render Start');
  
  const { id: productId } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // 1. Mount State
  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    setMounted(true); 
    console.log('✅ [PAGE] Component Mounted');
  }, []);

  // 2. Data Fetching
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(productId as string);

  const [isFollowing, setIsFollowing] = useState(false);

  // ================= 3. HIGH PRIORITY GUARD RAILS =================
  // We check this BEFORE calculating prices or images to prevent null pointers
  if (loading) {
    console.log('⏳ [PAGE] State: Loading');
    return <ProductSkeleton />;
  }

  if (!product || !product.id) {
    console.warn('⚠️ [PAGE] State: Product Invalid or Missing ID', product);
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <Container className="py-40 text-center">
          <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
            Product Not Found
          </h1>
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

  // ================= 4. DEFENSIVE CALCULATIONS =================
  console.log('🧠 [PAGE] Running Calculations for Product:', product.id);

  // Inside ProductDetailsPage.tsx

const priceData = useMemo(() => {
  const basePrice = safeNumber(product?.price, 0);
  return {
    current: basePrice,
    original: Math.round(basePrice * 1.2),
    discount: 20,
  };
}, [product?.id, product?.price]);

// 2. Image Logic (Deep diving into variants)
const safeImage = useMemo(() => {
  // Priority 1: Selected Variant Images
  if (selectedVariant?.images?.length > 0) {
    return selectedVariant.images[0].imageUrl;
  }

  // Priority 2: First Variant fallback (since product.images is empty [])
  if (product?.variants?.[0]?.images?.[0]?.imageUrl) {
    return product.variants[0].images[0].imageUrl;
  }

  return '/placeholder.jpg';
}, [product?.id, selectedVariant?.id]);

  // ================= 5. HANDLERS =================
  const handleAddToCart = useCallback(async () => {
    console.log('🛒 [ACTION] Add to Cart Triggered');
    if (!product) return;
    
    if (Array.isArray(product.variants) && product.variants.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    try {
      await addItem({
        id: String(product.id),
        name: safeString(product.title || product.name, 'Product'),
        price: priceData.current, 
        image: safeImage,
        vendorId: String(product.vendorId || ''),
        stock: safeNumber(product.stock, 0),
        quantity: qty,
        size: selectedSize,
        variant: selectedVariant 
      });
      console.log('✅ [ACTION] Item added to store');
    } catch (err) {
      console.error('❌ [ACTION] Add to Cart Failed:', err);
    }
  }, [product, selectedSize, selectedVariant, priceData, qty, addItem, safeImage]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing(prev => !prev);
  };

  // ================= 6. FINAL UI RENDER =================
  console.log('✨ [PAGE] Rendering UI');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT: GALLERY & DESCRIPTION */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery 
              images={selectedVariant?.images || product.images || []} 
              title={product.title} 
            />
            <div className="hidden lg:block pt-12 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </div>

          {/* RIGHT: CONFIGURATION SIDEBAR */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <ProductInfo 
              title={product.title}
              subTitle={product.subTitle}
              price={priceData.current}
              originalPrice={priceData.original}
              discount={priceData.discount}
              rating={product.averageRating}
              reviewCount={product.reviewCount}
            />

            <VariantSelector 
              variants={product.variants}
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