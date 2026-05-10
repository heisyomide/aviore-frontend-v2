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
import { api } from '@/src/lib/axios';
import { ProductReviews } from '@/src/components/product/ProductReviews';

type VendorType = {
  id: string;
  storeName: string;
  logo?: string;
  isVerified?: boolean;
  rating?: number;
  followers?: number;
  productsCount?: number;
  responseRate?: number;
};

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


const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [vendorState, setVendorState] = useState<VendorType | null>(null);
  const [mounted, setMounted] = useState(false);

  // Dynamic values
const currentPrice = selectedVariant?.price ?? product?.displayPrice ?? 0;
  const currentStock = selectedVariant?.stock ?? product?.totalStock ?? 0;
  const galleryImages = selectedVariant?.images?.length > 0 
    ? selectedVariant.images 
    : product?.images || [];

    
useEffect(() => {
  setVendorState(vendor);
}, [vendor]);

 
  useEffect(() => { setMounted(true); }, []);
  

  useEffect(() => {
  if (!vendor?.id) return;

  const fetchFollowState = async () => {
    try {
      const res = await api.get(`/vendor/${vendor.id}`);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Failed to fetch follow state");
    }
  };

  fetchFollowState();
}, [vendor?.id]);

useEffect(() => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  // only logged in users
  if (!token) return;

  // must have product id
  if (!product?.id) return;

  const recordHistory = async () => {
    try {
      await api.post(
        `/user/history/${product.id}`
      );
    } catch (error) {
      console.error(
        'History record failed:',
        error
      );
    }
  };

  recordHistory();
}, [product?.id]);


  // 🛒 HANDLERS
  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant){alert("Please select a color and size");
     return;
    }
    
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

  // ✅ REQUIRED
  productId: product.id,

  name: product.title,
  price: currentPrice,

  image:
    selectedVariant.images?.[0]?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    '/placeholder.jpg',

  vendorId: product.vendorId,
  stock: selectedVariant.stock,
  quantity: qty,

  color: selectedVariant.color,
  size: selectedVariant.size,

  // ✅ Variant uniqueness
  variantId: selectedVariant.id,

  variant: selectedVariant,
});
  }, [product, selectedVariant, qty, currentPrice, addItem]);

 const handleFollow = async () => {
  if (!vendor?.id || followLoading) return;

  setFollowLoading(true);

  const prev = isFollowing;

  // optimistic
  setIsFollowing(!prev);

  setVendorState((v) => {
    if (!v) return v;

    return {
      ...v,
      followers: !prev
        ? (v.followers || 0) + 1
        : (v.followers || 1) - 1,
    };
  });

  try {
    await api.post(`/vendor/${vendor.id}/follow`);
  } catch (err) {
    // rollback
    setIsFollowing(prev);

    setVendorState((v) => {
      if (!v) return v;

      return {
        ...v,
        followers: prev
          ? (v.followers || 0) + 1
          : (v.followers || 1) - 1,
      };
    });
  } finally {
    setFollowLoading(false);
  }
};

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  if (!mounted || loading || !product?.id) {
    return <ProductSkeleton />;
  }



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

        <div className="hidden lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-0 h-[calc(100vh-80px)] overflow-hidden">
          
          {/* LEFT: GALLERY SECTION */}
          <div className="h-full overflow-y-auto pr-8 scrollbar-hide">
             <ProductGallery images={galleryImages} title={product.title} productId={product.id} price={currentPrice} />
             
             <ProductReviews

  reviews={product.reviews}

  averageRating={product.rating}

  totalReviews={product.reviewCount}

/>

               <ProductDescription description={product.description} />
          </div>




          {/* RIGHT: SIDEBAR (Sticky Layout) */}
         <aside className="h-full overflow-y-auto pl-8 pr-2 scrollbar-hide">
            
            {/* 1. Header Info (Price/Title/Rating) */}
<ProductInfo 
  title={product.title}
  basePrice={product.basePrice}
  displayPrice={product.displayPrice}
  totalStock={product.totalStock}
  selectedVariant={selectedVariant}
  rating={product.rating}
  reviewCount={product.reviewCount}
/>

            {/* 2. Variant & Size Selection */}
{/* 2. Variant & Size Selection */}
<VariantSelector 
  variants={product.variants}     // The flat array of Matrix rows from backend
  selectedVariant={selectedVariant}
  onSelectVariant={(v) => {
    setSelectedVariant(v);
    // Optional: if you still need the string 'S', 'M' for other logic
    setSelectedSize(v.size); 
  }}
/>


            {/* 3. Action Box (Grey background match) */}
            <div className="p-8 rounded-[3rem] border border-zinc-100 bg-zinc-50/50 space-y-8">
              <QuantitySelector
               qty={qty} 
               setQty={setQty} 
                maxStock={currentStock} />
              
              <div className="space-y-4">
                <ProductActions 
                   stockCount={currentStock}  
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
                
                {/* Low Stock Indicator */}
                {currentStock > 0 && currentStock <= 10 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-orange-600">Only {selectedVariant?.stock ?? product.totalStock} Left!</p>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500" 
                        style={{ width: `${(currentStock / 10) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Vendor Section */}
            {vendor && (
              <div className="pt-4 border-t border-zinc-100">
<VendorCard 
  vendor={vendorState || vendor} 
  isFollowing={isFollowing} 
  onFollow={handleFollow} 
/>
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
          <div className="mt-24 border-t border-zinc-100 pt-20">
            <RecommendedProducts products={recommended} />
          </div>
        )}
      </Container>
    </div>
  );
}