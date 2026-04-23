'use client';

import { useMemo, useState, useEffect } from 'react';
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
  
  // 1. Hydration Guard: Prevents the "Server vs Client" disagreement
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // 2. Data Fetching
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(productId as string);

  const [isFollowing, setIsFollowing] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // 3. Price Logic: Normalized for string-to-number safety
  const priceData = useMemo(() => {
    // If product.price is "5000", parseFloat makes it a real number
    const basePrice = typeof product?.price === 'string' 
      ? parseFloat(product.price) 
      : (product?.price || 0);

    return {
      current: basePrice,
      original: basePrice * 1.2,
      discount: 20
    };
  }, [product?.price]);

  // 4. Handlers
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.variants?.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    // Pass the numeric price calculated in useMemo
 // Inside your handleAddToCart function in page.tsx

await addItem({
  id: product.id,
  name: product.title,
  price: priceData.current, 
  image: selectedVariant?.images?.[0]?.imageUrl || product.images?.[0] || '/placeholder.jpg',
  vendorId: product.vendorId,
  stock: product.stock,
  quantity: qty,
  size: selectedSize,
  // FIX: Change 'variantId' to 'variant' as per the TS error suggestion
  variant: selectedVariant // This passes the whole object, which is usually safer
});

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
  };

  // 5. Defensive Returns
  // If we aren't mounted or are still loading, show the Skeleton.
  if (!mounted || loading) return <ProductSkeleton />;
  
  // If loading finished but no product exists, show 404 state.
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="py-40 text-center font-bold text-zinc-400 uppercase tracking-widest">
          Product Not Found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            {/* FIX: Ensure we pass a flat array of image strings to the gallery */}
            <ProductGallery 
              images={selectedVariant?.images?.map((img: any) => img.imageUrl) || product.images || []} 
              title={product.title} 
            />
            <div className="hidden lg:block pt-12 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </div>

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
            
            <DeliveryInfo />

            <div className="lg:hidden pt-10 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        <RecommendedProducts products={recommended || []} />
      </Container>
    </div>
  );
}
}