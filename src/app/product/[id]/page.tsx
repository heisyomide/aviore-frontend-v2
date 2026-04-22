'use client';

import { useState, useEffect, useMemo , useCallback } from 'react';
import Image from 'next/image';
import { 
  Star, Minus, Plus, Heart, ShoppingBag, 
  ShieldCheck, Truck, BadgeCheck, LayoutGrid, 
  Zap, Share2, Loader2, ChevronRight, Store, Users, Timer, MessageSquare
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import { useCartStore } from '@/src/store/useCartStore';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { ProductCard } from '@/src/components/product/ProductCard';
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';
import { ProductSkeleton } from '@/src/components/product/ProductSkeleton';

export default function ProductDetailsPage() {
  
  const router = useRouter();
    const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [vendorData, setVendorData] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
const [selectedSize, setSelectedSize] = useState<string>('');

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems } = useWishlistStore();
  
  // 🛡️ Ensure apiBase matches your deployed NestJS URL in production
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

const fetchAllData = async () => {
  if (!productId) return;

  try {
    setLoading(true);

    // 🚀 STEP 1: Core Product Fetch (Required for everything else)
    const { data: productData } = await api.get(`/products/${productId}`);
    setProduct(productData);

    // 🚀 STEP 2: Parallel Discovery (Vendor, Recommendations, & Auth Status)
    if (productData.vendorId) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // Execute these three independent requests simultaneously
      const [vendorRes, recsRes, followRes] = await Promise.allSettled([
        // A. Public Vendor Stats & Slug
        api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
        
        // B. Contextual Recommendations
        api.get('/products', { 
          params: { 
            category: productData.category?.slug, 
            limit: 10 
          } 
        }),

        // C. Auth-dependent Following Status
        token ? api.get('/vendors/followed') : Promise.reject('GUEST_SESSION')
      ]);

      // --- Handle Vendor Results ---
      if (vendorRes.status === 'fulfilled') {
        setVendorData(vendorRes.value.data);
      } else {
        console.warn("VENDOR_REGISTRY_OFFLINE", vendorRes.reason);
      }

      // --- Handle Recommendations ---
      if (recsRes.status === 'fulfilled') {
        const recData = recsRes.value.data.data || [];
        setRecommended(recData.filter((p: any) => p.id !== productId));
      }

      // --- Handle Following Status ---
      if (followRes.status === 'fulfilled') {
        const followedArray = followRes.value.data || [];
        setIsFollowing(followedArray.some((v: any) => v.id === productData.vendorId));
      }
    }
  } catch (err) {
    console.error("REGISTRY_CRITICAL_SYNC_ERROR", err);
    // Optional: toast.error("Failed to sync item data")
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!productId) return;

  const token = localStorage.getItem('token');
  if (!token) return; // ✅ STOP HERE IF NOT LOGGED IN

  const recordView = async () => {
    try {
      await api.post(`/user/history/${productId}`);
    } catch (error) {
      console.error('History record failed:', error);
    }
  };

  recordView();
}, [productId]);

  useEffect(() => {
  if (product?.variants?.length) {
    setSelectedVariant(product.variants[0]);
  }
}, [product]);


  useEffect(() => {
    if (!productId) return;
    fetchAllData();
  }, [productId]);

const resolvedImages = useMemo(() => {
  if (selectedVariant?.images?.length) {
    return selectedVariant.images.map((img: any) => {
      const path = img.imageUrl;

      return path.startsWith('http')
        ? path
        : `${apiBase}/uploads/${path.replace(/^\//, '')}`;
    });
  }

  if (!product?.images || product.images.length === 0) {
    return ["/placeholder.jpg"];
  }

  return product.images.map((img: any) => {
    const path =
      typeof img === 'string'
        ? img
        : img.imageUrl;

    return path.startsWith('http')
      ? path
      : `${apiBase}/uploads/${path.replace(/^\//, '')}`;
  });

}, [selectedVariant, product, apiBase]);

  // 🚀 AUTH_INTERCEPT: Add to Cart
const handleAddToCart = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error("AUTH_REQUIRED: Please sign in.");
    router.push('/login');
    return;
  }

  if (product.variants?.length && !selectedVariant) {
    return toast.error("Select a variant");
  }

  if (selectedVariant?.sizes?.length && !selectedSize) {
    return toast.error("Select a size");
  }

  addItem({
    ...product,
    quantity: qty,
    image: resolvedImages[0],
    variant: selectedVariant,
    size: selectedSize
  });

  toast.success("Added to cart");
};

  // 🚀 AUTH_INTERCEPT: Buy Now
const handleBuyNow = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    router.push('/login');
    return;
  }

  if (product.variants?.length && !selectedVariant) {
    return toast.error("Select a variant");
  }

  if (selectedVariant?.sizes?.length && !selectedSize) {
    return toast.error("Select a size");
  }

  addItem({
    ...product,
    quantity: qty,
    image: resolvedImages[0],
    variant: selectedVariant,
    size: selectedSize
  });

  router.push('/checkout');
};


  // 🚀 AUTH_INTERCEPT: Follow Toggle
  const handleFollowToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("AUTH_REQUIRED: Sign in to follow vendors.");
      router.push('/login');
      return;
    }
    if (!product?.vendorId) return;

    try {
      if (isFollowing) {
        await api.delete(`/vendors/${product.vendorId}/unfollow`);
        setIsFollowing(false);
        toast.info("CONNECTION_TERMINATED: Unfollowed store");
      } else {
        await api.post(`/vendors/${product.vendorId}/follow`);
        setIsFollowing(true);
        toast.success("CONNECTION_ESTABLISHED: Following store");
      }
      fetchAllData(); 
    } catch (err: any) {
      toast.error("PROTOCOL_ERROR: Action rejected.");
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-40 text-center font-black uppercase tracking-widest text-zinc-400">Registry_Entry_Not_Found</div>;


  const deliveryText = useMemo(() => {
  if (!product) return '';

  if (product.origin === 'LOCAL') {
    return 'Delivery within 1–3 days';
  }

  if (product.origin === 'INTERNATIONAL') {
    if (product.deliveryMin && product.deliveryMax) {
      return `Delivery in ${product.deliveryMin}–${product.deliveryMax} days`;
    }

    return 'International delivery';
  }

  return '';
}, [product]);


  return (
    <div className="min-h-screen bg-white pb-24 md:pb-12">
       <Navbar />
      <div className="bg-black text-white py-2.5 text-[11px] font-black uppercase tracking-widest">
        <Container className="flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-8">
          <div className="flex items-center gap-2"><Truck size={14} className="text-emerald-400"/> Free shipping on all orders</div>
          <div className="flex items-center gap-2"><Zap size={14} className="text-amber-400"/> Best price adjustment guarantee</div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-400"/> Secure payments</div>
        </Container>
      </div>

      <Container className="py-4 md:py-8">
        <nav className="flex items-center gap-2 text-[10px] text-zinc-400 mb-6 font-black uppercase tracking-tighter">
          <span>Home</span> <ChevronRight size={10}/> <span>{product.category?.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* 🖼️ VISUALS */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            <div className="relative aspect-4/5 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group">
              <Image src={resolvedImages[activeImg]} 
              alt={product.title} 
              fill 
              className="object-cover" priority />
              <button className="absolute top-4 right-4 p-3 bg-white shadow-xl rounded-full hover:text-[#A4143D] transition-all"><Share2 size={18}/></button>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {resolvedImages.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${activeImg === idx ? "border-[#A4143D]" : "border-transparent opacity-50"}`}>
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 🛒 CONTENT & ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 🚀 FIXED VENDOR HUB: Storefront Service Implementation */}
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center relative overflow-hidden">
                    <Store size={24} className="text-zinc-200" />
                    {vendorData?.logo && (
  <Image 
    src={vendorData.logo.startsWith('http') 
      ? vendorData.logo 
      : `${apiBase}/uploads/${vendorData.logo}`}
    fill 
    alt="logo" 
    className="object-cover" 
  />
)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-black text-gray-900 uppercase italic leading-none">{vendorData?.storeName || product.vendor?.storeName}</h3>
                       {(vendorData?.isVerified || product.vendor?.isVerified) && <BadgeCheck size={18} className="text-blue-500 fill-blue-50" />}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Users size={12}/> {vendorData?._count?.followers || 0} Followers</span>
                      <span className="flex items-center gap-1"><ShoppingBag size={12}/> {vendorData?._count?.products || 0} Items Listed</span>
                      <span className="flex items-center gap-1 text-gray-900"><Star size={12} fill="currentColor"/> 4.8</span>
                    </div>
                  </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <button 
                   onClick={handleFollowToggle} 
                   className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10'}`}
                 >
                   {isFollowing ? 'Unfollow' : '+ Follow'}
                 </button>
                 <button onClick={() => router.push(`/vendors/${vendorData?.slug || product.vendorId}`)} className="flex-1 md:flex-none px-6 py-2.5 border-2 border-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest">Shop All</button>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded italic uppercase">#1 Best Seller</div>
                <span className="text-emerald-600 text-[10px] font-black flex items-center gap-1 uppercase tracking-tighter"><BadgeCheck size={14}/> Verified purchase protection</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-none tracking-tighter uppercase italic">{product.title}</h1>
              <div className="flex items-end gap-3 border-b border-gray-100 pb-6 pt-2">
                <span className="text-5xl font-black text-[#A4143D] tracking-tighter italic leading-none">₦{Number(product.price).toLocaleString()}</span>
                {product.discount > 0 && <div className="ml-auto bg-emerald-50 text-emerald-600 text-[11px] font-black px-3 py-1 rounded-xl border border-emerald-100 uppercase">-{product.discount}% Off</div>}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-[11px] font-black uppercase text-zinc-500">
  <Truck size={14} className="text-blue-500" />
  {deliveryText}
</div>
<div className="flex items-center gap-2">
  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase
    ${product.origin === 'LOCAL' 
      ? 'bg-emerald-100 text-emerald-600' 
      : 'bg-purple-100 text-purple-600'}
  `}>
    {product.origin}
  </span>
</div>
            {/* VARIANTS */}
{product?.variants?.length > 0 && (
  <div className="space-y-6">

    {/* COLORS */}
    <div>
      <p className="text-[10px] font-black uppercase mb-2">Select Color</p>
      <div className="flex gap-2 flex-wrap">
        {product.variants.map((v: any, i: number) => (
          <button
            key={i}
            onClick={() => {
              setSelectedVariant(v);
              setSelectedSize('');
              setActiveImg(0);
            }}
            className={`px-4 py-2 rounded-full border text-xs font-bold uppercase
              ${selectedVariant === v
                ? 'bg-black text-white border-black'
                : 'bg-white border-zinc-300'
              }`}
          >
            {v.color}
          </button>
        ))}
      </div>
    </div>

    {/* SIZES */}
    {selectedVariant?.sizes?.length > 0 && (
      <div>
        <p className="text-[10px] font-black uppercase mb-2">Select Size</p>
        <div className="flex gap-2 flex-wrap">
          {selectedVariant.sizes.map((size: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 rounded-xl border font-bold
                ${selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'bg-white border-zinc-300'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    )}

  </div>
)}



            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
              <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                 <span className="text-xs font-black text-orange-600 uppercase italic">
                    {product.stock > 0 ? `Stock Available: ${product.stock} pieces left` : "Out of Stock"}
                 </span>
                 <Timer size={18} className="text-orange-600 animate-pulse" />
              </div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Quantity Controller */}
  <div className="flex items-center bg-zinc-50 rounded-2xl border border-zinc-200 p-1">
    <button 
      onClick={() => setQty(Math.max(1, qty - 1))} 
      className="w-12 h-12 flex items-center justify-center hover:text-[#A4143D] transition-colors"
    >
      <Minus size={18}/>
    </button>
    <span className="w-14 text-center font-black text-xl italic text-zinc-900">{qty}</span>
    <button 
      onClick={() => setQty(qty + 1)} 
      className="w-12 h-12 flex items-center justify-center hover:text-[#A4143D] transition-all"
    >
      <Plus size={18}/>
    </button>
  </div>

  {/* 🚀 FIXED: Pointing directly to the Auth Intercept function */}
  <button 
    onClick={handleAddToCart} 
    className="flex-1 h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#A4143D]/10"
  >
    <ShoppingBag size={20}/> Add to Cart
  </button>
</div>
              <button onClick={handleBuyNow} className="w-full h-16 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all">
                <Zap size={20} fill="currentColor"/> Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
  <h3 className="text-sm text-gray-900 font-bold uppercase">
    Product Description
  </h3>
  <p className="text-sm text-zinc-600 leading-relaxed">
    {product.description}
  </p>
</div>

        {/* 🚀 DYNAMIC REVIEWS SECTION (Using User First/Last Name) */}
        <section className="mt-16 bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100">
           <h2 className="text-3xl font-black text-gray-900 uppercase italic mb-8 border-b border-gray-100 pb-8 tracking-tighter">Customer Reviews</h2>
           <div className="space-y-12">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any) => (
                  <div key={rev.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center font-black uppercase text-[10px]">
                        {rev.user?.firstName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase italic text-zinc-900 leading-none">
                          {rev.user?.firstName} {rev.user?.lastName}
                        </p>
                        <div className="flex text-amber-400 gap-0.5 mt-1.5"><Star size={12} fill="currentColor" /> {rev.rating}</div>
                      </div>
                      <div className="ml-auto text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Verified Purchase</div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-zinc-50 pl-6 ml-5">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-4 py-12 opacity-20 text-center">
                   <MessageSquare size={48} />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">No reviews logged for this product.</p>
                </div>
              )}
           </div>
        </section>

        {/* EXPLORE Grid */}
        <section className="mt-20">
          <h2 className="text-4xl font-black uppercase italic text-zinc-900 mb-10 tracking-tighter">Explore your interests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommended.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      </Container>
    </div>
  )
}