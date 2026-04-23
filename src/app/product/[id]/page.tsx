'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Hooks & Store
import { useProductData } from '@/src/hooks/useProductData';
import { useCartStore } from '@/src/store/useCartStore';
import { api } from '@/src/lib/axios'; // Ensure you have your axios instance

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

  // 2. Vendor Interaction State
  const [isFollowing, setIsFollowing] = useState(false);
  const [localFollowerCount, setLocalFollowerCount] = useState(0);

  // Sync local state when vendor data arrives
  useEffect(() => {
    if (vendor) {
      setLocalFollowerCount(vendor.followers);
      // setIsFollowing(vendor.userIsFollowing); // Logic for checking if current user follows
    }
  }, [vendor]);

  // 3. Zustand Store Actions
  const addItem = useCartStore((state) => state.addItem);

  // 4. Optimized Event Handlers
  const handleAddToCart = async () => {
    if (!product) return;
    
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

  const handleFollowVendor = async () => {
    if (!vendor) return;

    try {
      // Optimistic Update
      const previousState = isFollowing;
      setIsFollowing(!previousState);
      setLocalFollowerCount(prev => previousState ? prev - 1 : prev + 1);

      // Actual API call
      await api.post(`/vendors/${vendor.id}/follow`);
    } catch (err) {
      // Revert if API fails
      setIsFollowing(prev => !prev);
      setLocalFollowerCount(prev => isFollowing ? prev + 1 : prev - 1);
      console.error("FOLLOW_ERROR", err);
    }
  };

  const priceData = useMemo(() => ({
    current: product?.price || 0,
    original: (product?.price || 0) * 1.2,
    discount: 20
  }), [product?.price]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-40 text-center font-bold text-zinc-400 text-xs uppercase tracking-widest">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery 
              images={selectedVariant?.images || product.images} 
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
                onBuyNow={async () => {
                  await handleAddToCart();
                  router.push('/cart');
                }} 
              />
            </div>

            {/* FIXED VENDOR CARD */}
            <VendorCard 
              vendor={{
                ...vendor,
                followers: localFollowerCount // Passing the dynamic local count
              }} 
              isFollowing={isFollowing} 
              onFollow={handleFollowVendor} 
            />
            
            <DeliveryInfo />

            <div className="lg:hidden border-t border-zinc-100 pt-10">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        <RecommendedProducts products={recommended} />
      </Container>
    </div>
  );
}