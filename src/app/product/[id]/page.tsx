'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

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
import { useRecommendations, RecommendedProducts } from '@/src/components/product/RecommendedProducts';
import { ProductReviews } from '@/src/components/product/ProductReviews';

import { api } from '@/src/lib/axios';

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

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const {
    product,
    vendor,
    
    loading,

    selectedVariant,
    setSelectedVariant,

    selectedSize,
    setSelectedSize,

    qty,
    setQty,
  } = useProductData(id as string);

const {
  recommended,
  vendorProducts,
  explore,
} = useRecommendations(
  product?.id,
  vendor?.id
);

  const [mounted, setMounted] =
    useState(false);

  const [isFollowing, setIsFollowing] =
    useState(false);

  const [followLoading, setFollowLoading] =
    useState(false);

  const [vendorState, setVendorState] =
    useState<VendorType | null>(null);


    
  // =========================
  // DYNAMIC VALUES
  // =========================

  const currentPrice =
    selectedVariant?.price ??
    product?.displayPrice ??
    0;

  const currentStock =
    selectedVariant?.stock ??
    product?.totalStock ??
    0;

  /**
   * IMPORTANT:
   * Show normal product images FIRST.
   * Only switch to variant images after
   * user selects a variant with images.
   */


const galleryImages = useMemo(() => {
  if (!product) return [];
  
  // 1. Helper to extract URL from various image formats
  const getUrl = (img: any) => {
    if (typeof img === 'string') return img;
    return img?.imageUrl || img?.url || '';
  };

  // 2. Normalize Base Images
  const baseImages = (product.images || []).map(getUrl).filter(Boolean);

  // 3. Normalize Variant Images (if any)
  const variantImages = (selectedVariant?.images || []).map(getUrl).filter(Boolean);

  // 4. Logic: If we have variant images, show them first. 
  // Then append base images so the gallery isn't empty.
  const combined = [...variantImages, ...baseImages];
  
  // 5. If for some reason everything is empty, return empty array 
  // (ProductGallery will handle the placeholder)
  const finalImages = [...new Set(combined)];
  
  

  return finalImages.length > 0 ? finalImages : baseImages;
}, [product, selectedVariant]);

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVendorState(vendor);
  }, [vendor]);

  // =========================
  // FOLLOW STATE
  // =========================

useEffect(() => {
  if (!vendor?.id) return;

  // 🚀 Prevent guest users from hitting protected route
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  if (!token) return;

  const fetchFollowState = async () => {
    try {
      const res = await api.get(
        `/vendor/${vendor.id}`
      );

      setIsFollowing(
        res.data.isFollowing
      );

    } catch (err: any) {

      // Ignore unauthorized silently
      if (err?.response?.status !== 401) {
        console.error(
          'Failed to fetch follow state',
          err
        );
      }
    }
  };

  fetchFollowState();

}, [vendor?.id]);

  // =========================
  // RECENTLY VIEWED
  // =========================

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    if (!token) return;

    if (!product?.id) return;

    const recordHistory =
      async () => {
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

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart =
    useCallback(async () => {
      if (!product || !selectedVariant) {
        alert(
          'Please select a color and size'
        );

        return;
      }

      addItem({
        id: product.id,

        productId: product.id,

        name: product.title,

        price: currentPrice,

        image:
          selectedVariant.images?.[0]
            ?.imageUrl ||
          product.images?.[0]?.imageUrl ||
          '/placeholder.jpg',

        vendorId: product.vendorId,

        stock: selectedVariant.stock,

        quantity: qty,

        color: selectedVariant.color,

        size: selectedVariant.size,

        variantId: selectedVariant.id,

        variant: selectedVariant,
      });
    }, [
      product,
      selectedVariant,
      qty,
      currentPrice,
      addItem,
    ]);

  // =========================
  // FOLLOW VENDOR
  // =========================

  const handleFollow = async () => {
    if (!vendor?.id || followLoading)
      return;

    setFollowLoading(true);

    const prev = isFollowing;

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
      await api.post(
        `/vendor/${vendor.id}/follow`
      );
    } catch {
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

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = async () => {
    await handleAddToCart();

    router.push('/cart');
  };





  // =========================
  // LOADING
  // =========================

  if (
    !mounted ||
    loading ||
    !product?.id
  ) {
    return <ProductSkeleton />;
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-4 lg:py-10">
        {/* ========================= */}
        {/* BREADCRUMB */}
        {/* ========================= */}

        <nav className="hidden lg:flex gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-8">
          <span>Home</span>

          <span>/</span>

          <span>
            {product.category?.name}
          </span>

          <span>/</span>

          <span className="text-zinc-900">
            {product.title}
          </span>
        </nav>

        {/* ================================================= */}
        {/* MOBILE LAYOUT */}
        {/* ================================================= */}

        <div className="lg:hidden">
          {/* GALLERY */}
          <ProductGallery
            images={galleryImages}
            title={product.title}
            productId={product.id}
            price={currentPrice}
          />

          {/* PRODUCT INFO */}
          <div className="mt-6">
            <ProductInfo
              title={product.title}
              basePrice={product.basePrice}
              displayPrice={
                product.displayPrice
              }
              totalStock={
                product.totalStock
              }
              selectedVariant={
                selectedVariant
              }
              rating={product.rating}
              reviewCount={
                product.reviewCount
              }
            />
          </div>

          {/* VARIANTS */}
          <div className="mt-8">
            <VariantSelector
              variants={product.variants}
              selectedVariant={
                selectedVariant
              }
onSelectVariant={(v) => {
  setSelectedVariant(v);
  setSelectedSize(v.size);
}}
            />
          </div>

          {/* ACTION BOX */}
          <div className="mt-8 rounded-[2rem] border border-zinc-100 bg-zinc-50 p-5 space-y-6">
            <QuantitySelector
              qty={qty}
              setQty={setQty}
              maxStock={currentStock}
            />

            <ProductActions
              stockCount={currentStock}
              onAddToCart={
                handleAddToCart
              }
              onBuyNow={handleBuyNow}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-12">
            <ProductDescription
              description={
                product.description
              }
            />
          </div>

          {/* REVIEWS */}
          <div className="mt-14">
            <ProductReviews
              reviews={
                product.reviews || []
              }
              averageRating={
                product.rating || 0
              }
              totalReviews={
                product.reviewCount || 0
              }
            />
          </div>

          {/* VENDOR */}
          {vendor && (
            <div className="mt-14">
              <VendorCard
                vendor={
                  vendorState || vendor
                }
                isFollowing={
                  isFollowing
                }
                onFollow={
                  handleFollow
                }
              />
            </div>
          )}

          {/* DELIVERY */}
          <div className="mt-10">
            <DeliveryInfo
              origin={product.origin}
              min={product.deliveryMin}
              max={product.deliveryMax}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* DESKTOP LAYOUT */}
        {/* ================================================= */}

        <div className="hidden lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-14 h-[calc(100vh-90px)] overflow-hidden">
          {/* LEFT SCROLL */}
          <div className="h-full overflow-y-auto pr-6 scrollbar-hide">
            <ProductGallery
              images={galleryImages}
              title={product.title}
              productId={product.id}
              price={currentPrice}
            />

            {/* REVIEWS */}
            <div className="mt-20">
              <ProductReviews
                reviews={
                  product.reviews || []
                }
                averageRating={
                  product.rating || 0
                }
                totalReviews={
                  product.reviewCount || 0
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-20">
              <ProductDescription
                description={
                  product.description
                }
              />
            </div>
          </div>

          {/* RIGHT SCROLL */}
          <aside className="h-full overflow-y-auto pl-2 pr-2 scrollbar-hide">
            <div className="space-y-10 pb-20">
              {/* PRODUCT INFO */}
              <ProductInfo
                title={product.title}
                basePrice={
                  product.basePrice
                }
                displayPrice={
                  product.displayPrice
                }
                totalStock={
                  product.totalStock
                }
                selectedVariant={
                  selectedVariant
                }
                rating={product.rating}
                reviewCount={
                  product.reviewCount
                }
              />

              {/* VARIANTS */}
              <VariantSelector
                variants={product.variants}
                selectedVariant={
                  selectedVariant
                }
onSelectVariant={(v) => {
  setSelectedVariant(v);

  setSelectedSize(v.size);
}}
              />

              {/* ACTIONS */}
              <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-7 space-y-7">
                <QuantitySelector
                  qty={qty}
                  setQty={setQty}
                  maxStock={
                    currentStock
                  }
                />

                <ProductActions
                  stockCount={
                    currentStock
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onBuyNow={
                    handleBuyNow
                  }
                />
              </div>

              {/* VENDOR */}
              {vendor && (
                <div className="pt-8 border-t border-zinc-100">
                  <VendorCard
                    vendor={
                      vendorState ||
                      vendor
                    }
                    isFollowing={
                      isFollowing
                    }
                    onFollow={
                      handleFollow
                    }
                  />
                </div>
              )}

              {/* DELIVERY */}
              <DeliveryInfo
                origin={product.origin}
                min={product.deliveryMin}
                max={product.deliveryMax}
              />
            </div>
          </aside>
        </div>

        {/* ================================================= */}
        {/* RECOMMENDED */}
        {/* ================================================= */}

<div className="mt-20 lg:mt-28 border-t border-zinc-100 pt-16">

  <RecommendedProducts
    products={recommended}
    currentProductId={product.id}
    title="You May Also Like"
    subtitle="Related products based on this artifact."
  />

  <RecommendedProducts
    products={vendorProducts}
    currentProductId={product.id}
    title="More From This Vendor"
    subtitle="More inventory from this storefront."
  />

  <RecommendedProducts
    products={explore}
    currentProductId={product.id}
    title="Explore Marketplace"
    subtitle="Discover more across Aviorè."
  />

</div>
         
      </Container>
    </div>
  );
}