'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductData } from '@/src/hooks/useProductData';
import { useCartStore } from '@/src/store/useCartStore';

// Components
import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';
import { ProductGallery } from '@/src/components/product/ProductGallery';
import { ProductInfo } from '@/src/components/product/ProductInfo';
import { VariantSelector } from '@/src/components/product/VariantSelector';
import { QuantitySelector } from '@/src/components/product/QuantitySelector';
import { ProductActions } from '@/src/components/product/ProductActions';
import { VendorCard } from '@/src/components/product/VendorCard';
import { DeliveryInfo } from '@/src/components/product/DeliveryInfo';
import { ProductDescription } from '@/src/components/product/ProductDescription';
import { RecommendedProducts } from '@/src/components/product/RecommendedProducts';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(id as string);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // 🛒 HANDLERS (Now Fully Working)
  const handleAddToCart = useCallback(async () => {
    if (!product?.id) return;
    
    // Size Check
    if (product.variants?.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    // Resolve Image for Cart
    const cartImg = selectedVariant?.images?.[0]?.imageUrl || 
                    product.variants?.[0]?.images?.[0]?.imageUrl || 
                    '/placeholder.jpg';

    addItem({
      id: product.id,
      name: product.title,
      price: product.price, 
      image: cartImg,
      vendorId: product.vendorId,
      stock: product.stock,
      quantity: qty,
      size: selectedSize,
      variant: selectedVariant 
    });
  }, [product, selectedVariant, selectedSize, qty, addItem]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Redirect after adding
    router.push('/cart');
  };

  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }

  // Prep images for gallery
  const galleryImages = selectedVariant?.images || product.variants?.[0]?.images || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-8 lg:py-16">
        {/* Breadcrumbs (Optional but matches your screenshot) */}
        <nav className="flex gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-8">
          <span>Home</span> <span>/</span> <span>{product.category?.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* LEFT: GALLERY & DESCRIPTION */}
          <div className="lg:col-span-7 space-y-16">
             <ProductGallery images={galleryImages} title={product.title} />
             
             {/* Description only on Desktop here */}
             <div className="hidden lg:block">
               <ProductDescription description={product.description} />
             </div>
          </div>

          {/* RIGHT: SIDEBAR (Sticky on Desktop) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-10">
            <ProductInfo 
              title={product.title}
              price={product.price}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            <VariantSelector 
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* The "Buy Box" from your design */}
            <div className="p-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50/40 space-y-8">
              <QuantitySelector qty={qty} setQty={setQty} maxStock={product.stock} />
              
              <ProductActions 
                stockCount={product.stock} 
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>

            {vendor && <VendorCard vendor={vendor} isFollowing={false} onFollow={async () => {}} />}

            <DeliveryInfo origin={product.origin} min={product.deliveryMin} max={product.deliveryMax} />

            {/* Description only on Mobile here */}
            <div className="lg:hidden pt-8 border-t">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        {/* RECOMMENDATIONS: Hidden if empty, but ready for when you add more products */}
        {recommended && recommended.length > 0 && (
          <div className="mt-32">
            <RecommendedProducts products={recommended} />
          </div>
        )}
      </Container>
    </div>
  );
}