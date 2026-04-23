'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Hooks & Store
import { useProductData } from '@/src/hooks/useProductData'; // New custom hook for fetching
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
  
  // 1. Centralized Data Fetching
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(productId as string);

  // 2. Zustand Store Actions
  const addItem = useCartStore((state) => state.addItem);

  // 3. Optimized Event Handlers
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Safety check for variants
    if (product.variants?.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    await addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: selectedVariant?.images?.[0]?.imageUrl || product.images?.[0] || '/placeholder.jpg',
      vendorId: product.vendorId,
      stock: product.stock,
      quantity: qty,
      size: selectedSize,
      variant: selectedVariant
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  // 4. Memoized Prices (Avoid recalculating on every re-render)
  const priceData = useMemo(() => ({
    current: product?.price || 0,
    original: (product?.price || 0) * 1.2,
    discount: 20
  }), [product?.price]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-40 text-center font-bold text-zinc-400">PRODUCT_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* VISUALS COLUMN */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery 
              images={selectedVariant?.images || product.images} 
              title={product.title} 
            />
            <div className="hidden lg:block">
              <ProductDescription description={product.description} />
            </div>
          </div>

          {/* PURCHASE COLUMN (Sticky) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            <ProductInfo 
              title={product.title}
              price={priceData.current}
              originalPrice={priceData.original}
              discount={priceData.discount}
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
  onAddToCart={handleAddToCart} // The real deal
  onBuyNow={() => {
    handleAddToCart();
    router.push('/cart');
  }} 
/>
            </div>

            <VendorCard 
              vendor={vendor} 
              isFollowing={false} 
              onFollow={() => {}} 
            />
            
            <DeliveryInfo />

            <div className="lg:hidden">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        <RecommendedProducts products={recommended} />
      </Container>
    </div>
  );
}