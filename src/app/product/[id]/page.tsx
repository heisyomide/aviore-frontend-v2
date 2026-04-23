'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/src/lib/axios';

// --- Import our New Components ---
import {ProductGallery} from '@/src/components/product/ProductGallery';
import {ProductInfo} from '@/src/components/product/ProductInfo';
import {VariantSelector} from '@/src/components/product/VariantSelector';
import {QuantitySelector} from '@/src/components/product/QuantitySelector';
import {ProductActions} from '@/src/components/product/ProductActions';
import {VendorCard} from '@/src/components/product/VendorCard';
import {DeliveryInfo} from '@/src/components/product/DeliveryInfo';
import {ProductDescription} from '@/src/components/product/ProductDescription';
import {RecommendedProducts} from '@/src/components/product/RecommendedProducts';

// --- Layout Wrappers ---
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

export default function ProductDetailsPage() {
  const { id: productId } = useParams();
  
  // State Management
  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive State
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function loadData() {
      if (!productId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
        
        // Fetch supplemental data
        const [vRes, rRes] = await Promise.all([
          api.get(`/storefront/vendors/public-profile/${data.vendorId}`),
          api.get('/products', { params: { category: data.category?.slug, limit: 10 } })
        ]);
        setVendor(vRes.data);
        setRecommended(rRes.data.data.filter((p: any) => p.id !== productId));
      } catch (err) {
        console.error("Layout_Mount_Error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-40 text-center font-black text-zinc-300">ENTRY_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Container className="py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* LEFT COLUMN: VISUALS (Scrolling) */}
          <div className="lg:col-span-7">
            <ProductGallery 
              images={selectedVariant?.images || product.images} 
              title={product.title} 
            />
            
            {/* Description is placed below the gallery on desktop to keep the buy panel accessible */}
            <div className="hidden lg:block">
              <ProductDescription description={product.description} />
            </div>
          </div>

          {/* RIGHT COLUMN: INFO & ACTIONS (Sticky) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-10">
              
              <ProductInfo 
                title={product.title}
                price={product.price}
                originalPrice={product.price * 1.2} // Example discount logic
                discount={20}
              />

              <VariantSelector 
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />

              <div className="space-y-8 bg-zinc-50/50 p-8 rounded-[2.5rem] border border-zinc-100">
                <QuantitySelector 
                  qty={qty} 
                  setQty={setQty} 
                  maxStock={product.stock} 
                />
                <ProductActions 
                  stockCount={product.stock}
                  onAddToCart={() => console.log("Added")}
                  onBuyNow={() => console.log("Buying")}
                />
              </div>

              <VendorCard 
                vendor={vendor} 
                isFollowing={false} 
                onFollow={() => {}} 
              />
              
              <DeliveryInfo />

              {/* Mobile Only: Description appears here */}
              <div className="lg:hidden">
                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH BOTTOM SECTION */}
        <RecommendedProducts products={recommended} />
      </Container>
    </div>
  );
}