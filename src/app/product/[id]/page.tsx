'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductData } from '@/src/hooks/useProductData';
import { useCartStore } from '@/src/store/useCartStore';

// Layout & UI
import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

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
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ================= 🛡️ THE MASTER GUARD =================
  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }

  // ================= 🧠 DATA PREP =================
  const price = Number(product.price) || 0;
  const rating = Number(product.averageRating) || 0;
  
  // Safe Image resolution for Cart/Gallery
  const galleryImages = selectedVariant?.images || product.variants?.[0]?.images || [];
  const cartImage = galleryImages?.[0]?.imageUrl || galleryImages?.[0] || '/placeholder.jpg';

  // ================= 🛒 HANDLERS =================
const handleAddToCart = useCallback(async () => {
    // 1. Use a local check instead of relying on the 'product' dependency being stable
    if (!product?.id) return;
    
    if (product.variants?.length > 0 && !selectedSize) {
      alert("Please select a size to continue.");
      return;
    }

    // 2. Pass data directly. 
    // We remove price/image from the dependency array by calculating them inside or 
    // using primitives.
    addItem({
      id: String(product.id),
      name: String(product.title),
      price: Number(product.price) || 0, 
      image: selectedVariant?.images?.[0]?.imageUrl || product.variants?.[0]?.images?.[0]?.imageUrl || '/placeholder.jpg',
      vendorId: String(product.vendorId || ''),
      stock: Number(product.stock) || 0,
      quantity: qty,
      size: selectedSize,
      variant: selectedVariant 
    });
    
    // We ONLY depend on the primitives that actually change
  }, [product?.id, selectedSize, selectedVariant?.id, qty, addItem]);

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleFollow = async () => {
    setIsFollowing(prev => !prev);
    // Add API logic here: await toggleFollow(vendor.id);
  };

  // ================= ✨ UI RENDER =================
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: VISUALS & SPECS */}
          <div className="lg:col-span-7 space-y-12">
             <ProductGallery images={galleryImages} title={product.title} />
             
             {/* Product Description (Desktop) */}
             <div className="hidden lg:block pt-12 border-t border-zinc-100">
               <ProductDescription 
                 description={product.description} 
                 specifications={product.specifications} 
               />
             </div>
          </div>

          {/* RIGHT COLUMN: CONFIGURATION SIDEBAR */}
          <aside className="lg:col-span-5 space-y-10">
            <ProductInfo 
              title={product.title}
              subTitle={product.category?.name}
              price={price}
              rating={rating}
              reviewCount={product.reviewCount || 0}
            />

            <VariantSelector 
              variants={product.variants || []}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Selection & Actions Box */}
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

            {/* Vendor Details */}
            {vendor && (
              <VendorCard 
                vendor={vendor} 
                isFollowing={isFollowing} 
                onFollow={handleFollow} 
              />
            )}

            {/* Shipping & Trust Info */}
            <DeliveryInfo 
              origin={product.origin} 
              min={product.deliveryMin} 
              max={product.deliveryMax} 
            />

            {/* Product Description (Mobile) */}
            <div className="lg:hidden pt-10 border-t border-zinc-100">
              <ProductDescription description={product.description} />
            </div>
          </aside>
        </div>

        {/* Recommendations Section */}
        {recommended && recommended.length > 0 && (
          <RecommendedProducts products={recommended} />
        )}
      </Container>
    </div>
  );
}