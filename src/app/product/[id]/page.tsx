'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductData } from '@/src/hooks/useProductData';

// Layout & UI
import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

// Sidebar Components (The ones in your image)
import { ProductGallery } from '@/src/components/product/ProductGallery';
import { ProductInfo } from '@/src/components/product/ProductInfo';
import { VariantSelector } from '@/src/components/product/VariantSelector';
import { QuantitySelector } from '@/src/components/product/QuantitySelector';
import { ProductActions } from '@/src/components/product/ProductActions';
import { VendorCard } from '@/src/components/product/VendorCard';
import { DeliveryInfo } from '@/src/components/product/DeliveryInfo';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, vendor, loading, selectedVariant, setSelectedVariant, selectedSize, setSelectedSize, qty, setQty } = useProductData(id as string);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // 🛡️ THE MASTER GUARD
  // If we aren't mounted, or still loading, or don't have a product ID yet...
  // STOP. Show the skeleton. Do not let child components run.
  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }

  // 🧠 SAFE DATA PREP (Tailored to your JSON response)
  const price = Number(product.price) || 0;
  const rating = Number(product.averageRating) || 0;
  
  // Your API has images inside variants, so we extract them safely here
  const galleryImages = selectedVariant?.images || product.variants?.[0]?.images || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Container className="py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: GALLERY */}
          <div className="lg:col-span-7">
             <ProductGallery 
               images={galleryImages} 
               title={product.title} 
             />
          </div>

          {/* RIGHT COLUMN: SIDEBAR (Matching your screenshot) */}
          <aside className="lg:col-span-5 space-y-10">
            {/* 1. Header Info */}
            <ProductInfo 
              title={product.title}
              price={price}
              rating={rating}
              reviewCount={product.reviewCount || 0}
            />

            {/* 2. Selection Logic */}
            <VariantSelector 
              variants={product.variants || []}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* 3. Actions Box (The grey/white box in your design) */}
            <div className="p-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 space-y-8">
              <QuantitySelector qty={qty} setQty={setQty} maxStock={product.stock} />
              <ProductActions stockCount={product.stock} onAddToCart={() => {}} onBuyNow={() => {}} />
            </div>

            {/* 4. Vendor Card (Safe check for vendor data) */}
            {vendor && (
              <VendorCard vendor={vendor} isFollowing={false} onFollow={async () => {}} />
            )}

            {/* 5. Trust Badges */}
            <DeliveryInfo 
              origin={product.origin} 
              min={product.deliveryMin} 
              max={product.deliveryMax} 
            />
          </aside>
        </div>
      </Container>
    </div>
  );
}