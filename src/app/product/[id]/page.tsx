'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductData } from '@/src/hooks/useProductData';

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
  const { 
    product, vendor, recommended, loading, 
    selectedVariant, setSelectedVariant,
    selectedSize, setSelectedSize,
    qty, setQty 
  } = useProductData(id as string);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // 🛡️ ZERO-CRASH GUARD
  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }

  // 🚀 DATA IS ALREADY NORMALIZED BY THE HOOK
  const galleryImages = selectedVariant?.images || product.variants?.[0]?.images || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Container className="py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
             <ProductGallery images={galleryImages} title={product.title} />
             <div className="hidden lg:block pt-12 border-t border-zinc-100">
               <ProductDescription description={product.description} />
             </div>
          </div>

          <aside className="lg:col-span-5 space-y-10">
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

            <div className="p-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 space-y-8">
              <QuantitySelector qty={qty} setQty={setQty} maxStock={product.stock} />
              <ProductActions stockCount={product.stock} onAddToCart={() => {}} onBuyNow={() => {}} />
            </div>

            {vendor && <VendorCard vendor={vendor} isFollowing={false} onFollow={async () => {}} />}

            <DeliveryInfo origin={product.origin} min={product.deliveryMin} max={product.deliveryMax} />
          </aside>
        </div>

        {recommended.length > 0 && <RecommendedProducts products={recommended} />}
      </Container>
    </div>
  );
}