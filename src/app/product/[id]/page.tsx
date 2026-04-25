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

  // 🛒 HANDLERS
  const handleAddToCart = useCallback(async () => {
    if (!product?.id) return;
    
    // ✅ FIXED TS7006: Added types (v: any, s: any) to the parameters
    const hasValidSizes = product.variants?.some((v: any) => 
      v.sizes?.some((s: any) => s && s.trim() !== "")
    );
    
    if (hasValidSizes && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

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
      size: selectedSize || undefined,
      variant: selectedVariant 
    });
  }, [product, selectedVariant, selectedSize, qty, addItem]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }

  const galleryImages = selectedVariant?.images || product.variants?.[0]?.images || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-6 lg:py-10">
        {/* Breadcrumbs */}
        <nav className="flex gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-8">
          <span>Home</span> <span className="text-zinc-200">/</span> 
          <span>{product.category?.name}</span> <span className="text-zinc-200">/</span> 
          <span className="text-zinc-900">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-24 items-start">
          
          {/* LEFT: GALLERY SECTION */}
          <div className="lg:col-span-7">
             <ProductGallery images={galleryImages} title={product.title} />
             
             {/* Desktop Tabs at Bottom */}
             <div className="hidden lg:block mt-24">
               <ProductDescription description={product.description} />
             </div>
          </div>

          {/* RIGHT: SIDEBAR (Sticky Layout) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-10">
            
            {/* 1. Header Info (Price/Title/Rating) */}
            <ProductInfo 
              title={product.title}
              price={product.price}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            {/* 2. Variant & Size Selection */}
            <VariantSelector 
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* 3. Action Box (Grey background match) */}
            <div className="p-8 rounded-[3rem] border border-zinc-100 bg-zinc-50/50 space-y-8">
              <QuantitySelector qty={qty} setQty={setQty} maxStock={product.stock} />
              
              <div className="space-y-4">
                <ProductActions 
                  stockCount={product.stock} 
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
                
                {/* Low Stock Indicator */}
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-orange-600">Only {product.stock} items left!</p>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500" 
                        style={{ width: `${(product.stock / 10) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Vendor Section */}
            {vendor && (
              <div className="pt-4 border-t border-zinc-100">
                <VendorCard vendor={vendor} isFollowing={false} onFollow={async () => {}} />
              </div>
            )}

            {/* 5. Trust Badges */}
            <DeliveryInfo 
              origin={product.origin} 
              min={product.deliveryMin} 
              max={product.deliveryMax} 
            />

            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        {/* Recommended Products */}
        {recommended && recommended.length > 0 && (
          <div className="mt-24">
            <RecommendedProducts products={recommended} />
          </div>
        )}
      </Container>
    </div>
  );
}