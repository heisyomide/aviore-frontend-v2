'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  Star, Minus, Plus, ShieldCheck, Truck, BadgeCheck, 
  Zap, Share2, ChevronRight, Store, Users, Timer, MessageSquare, ShoppingBag
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

/* ================= TYPES ================= */

interface ImageObj {
  imageUrl: string;
}

interface Variant {
  color: string;
  images: ImageObj[];
  sizes: string[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  discount: number;
  stock: number;
  description: string;
  origin: 'LOCAL' | 'INTERNATIONAL';
  images: (string | ImageObj)[];
  category?: { name: string; slug: string };
  variants?: Variant[];
  vendorId: string;
  vendor?: { storeName: string; isVerified: boolean };
  deliveryMin?: number;
  deliveryMax?: number;
  deliveryUnit?: string;
  reviews?: any[];
}

interface VendorData {
  storeName: string;
  slug: string;
  logo?: string;
  isVerified: boolean;
  _count?: { followers: number; products: number };
}

/* ================= MAIN COMPONENT ================= */

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  // --- State with Strict Types ---
  const [product, setProduct] = useState<Product | null>(null);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const addItem = useCartStore((state) => state.addItem);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  /* --- DATA FETCHING --- */

  const fetchAllData = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const { data: productData } = await api.get<Product>(`/products/${productId}`);
      setProduct(productData);

      if (productData.variants?.length) {
        setSelectedVariant(productData.variants[0]);
      }

      if (productData.vendorId) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const [vendorRes, recsRes, followRes] = await Promise.allSettled([
          api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
          api.get('/products', { params: { category: productData.category?.slug, limit: 10 } }),
          token ? api.get('/vendors/followed') : Promise.reject('GUEST')
        ]);

        if (vendorRes.status === 'fulfilled') setVendorData(vendorRes.value.data);
        if (recsRes.status === 'fulfilled') {
          const list = recsRes.value.data.data || [];
          setRecommended(list.filter((p: Product) => p.id !== productId));
        }
        if (followRes.status === 'fulfilled') {
          const followed = followRes.value.data || [];
          setIsFollowing(followed.some((v: any) => v.id === productData.vendorId));
        }
      }
    } catch (err) {
      console.error("CRITICAL_SYNC_ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, [productId]);

  /* --- IMAGE RESOLUTION LOGIC --- */

  const resolvedImages = useMemo(() => {
    const rawList = selectedVariant?.images?.length 
      ? selectedVariant.images 
      : (product?.images || []);

    if (rawList.length === 0) return ["/placeholder.jpg"];

    return rawList.map((img) => {
      const path = typeof img === 'string' ? img : img.imageUrl;
      if (!path || path === 'undefined') return "/placeholder.jpg";
      
      return path.startsWith('http') 
        ? path 
        : `${apiBase}/uploads/${path.replace(/^\//, '')}`;
    });
  }, [selectedVariant, product, apiBase]);

  /* --- HELPERS --- */

  const deliveryText = useMemo(() => {
    if (!product) return '';
    if (product.origin === 'LOCAL') return 'Delivery within 1–3 days';
    return product.deliveryMin ? `Delivery in ${product.deliveryMin}–${product.deliveryMax} days` : 'International delivery';
  }, [product]);

  const validateSelection = () => {
    if (product?.variants?.length && !selectedVariant) {
      toast.error("Please select a color/variant");
      return false;
    }
    if (selectedVariant?.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    return true;
  };

  /* --- ACTIONS --- */

  const handleCartAction = (checkout = false) => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    if (!product || !validateSelection()) return;

    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: resolvedImages[0],
      vendorId: product.vendorId,
      stock: product.stock,
      quantity: qty,
      variant: selectedVariant,
      size: selectedSize
    });

    if (checkout) router.push('/checkout');
    else toast.success("Added to cart");
  };

  const handleFollowToggle = async () => {
    if (!localStorage.getItem('token')) return router.push('/login');
    if (!product?.vendorId) return;

    try {
      if (isFollowing) {
        await api.delete(`/vendors/${product.vendorId}/unfollow`);
        setIsFollowing(false);
      } else {
        await api.post(`/vendors/${product.vendorId}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  /* --- RENDER --- */

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-40 text-center font-black uppercase text-zinc-400">Registry_Entry_Not_Found</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar />
      
      {/* Trust Bar */}
      <div className="bg-black text-white py-2.5 text-[11px] font-black uppercase tracking-widest">
        <Container className="flex justify-between items-center overflow-x-auto no-scrollbar gap-8">
          <div className="flex items-center gap-2"><Truck size={14} className="text-emerald-400"/> Free shipping</div>
          <div className="flex items-center gap-2"><Zap size={14} className="text-amber-400"/> Price Guarantee</div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-400"/> Secure payments</div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] text-zinc-400 mb-6 font-black uppercase">
          <span>Home</span> <ChevronRight size={10}/> <span>{product.category?.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* VISUALS */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
              <Image src={resolvedImages[activeImg]} alt={product.title} fill className="object-cover" priority />
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full"><Share2 size={18}/></button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
              {resolvedImages.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${activeImg === idx ? "border-[#A4143D]" : "border-transparent opacity-50"}`}>
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Vendor Card */}
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 relative overflow-hidden flex items-center justify-center">
                    {vendorData?.logo ? (
                      <Image src={vendorData.logo.startsWith('http') ? vendorData.logo : `${apiBase}/uploads/${vendorData.logo}`} fill alt="logo" className="object-cover" />
                    ) : <Store size={24} className="text-zinc-200" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-black text-gray-900 uppercase italic leading-none">{vendorData?.storeName || product.vendor?.storeName}</h3>
                       {(vendorData?.isVerified || product.vendor?.isVerified) && <BadgeCheck size={18} className="text-blue-500" />}
                    </div>
                    <div className="flex gap-4 mt-2 text-[10px] font-black text-zinc-400 uppercase">
                      <span className="flex items-center gap-1"><Users size={12}/> {vendorData?._count?.followers || 0}</span>
                      <span className="flex items-center gap-1"><Star size={12} fill="currentColor" className="text-gray-900"/> 4.8</span>
                    </div>
                  </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <button onClick={handleFollowToggle} className={`flex-1 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isFollowing ? 'bg-zinc-200' : 'bg-zinc-900 text-white'}`}>
                   {isFollowing ? 'Unfollow' : '+ Follow'}
                 </button>
                 <button onClick={() => router.push(`/vendors/${vendorData?.slug}`)} className="flex-1 px-6 py-2.5 border-2 border-zinc-900 rounded-full text-[10px] font-black uppercase">Shop All</button>
               </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">{product.title}</h1>
              <div className="flex items-end gap-3 border-b border-gray-100 pb-6">
                <span className="text-5xl font-black text-[#A4143D] italic">₦{product.price.toLocaleString()}</span>
                {product.discount > 0 && <div className="ml-auto bg-emerald-50 text-emerald-600 text-[11px] font-black px-3 py-1 rounded-xl border border-emerald-100">-{product.discount}% OFF</div>}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-black uppercase text-zinc-500">
              <Truck size={14} className="text-blue-500" /> {deliveryText}
            </div>

            {/* Selection Logic */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase mb-2">Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v, i) => (
                      <button key={i} onClick={() => { setSelectedVariant(v); setSelectedSize(''); setActiveImg(0); }} 
                        className={`px-4 py-2 rounded-full border text-xs font-bold uppercase transition-all ${selectedVariant === v ? 'bg-black text-white' : 'bg-white'}`}>
                        {v.color}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedVariant?.sizes?.length ? (
                  <div>
                    <p className="text-[10px] font-black uppercase mb-2">Size</p>
                    <div className="flex gap-2">
                      {selectedVariant.sizes.map((size, i) => (
                        <button key={i} onClick={() => setSelectedSize(size)} 
                          className={`w-12 h-12 rounded-xl border font-bold transition-all ${selectedSize === size ? 'bg-black text-white' : 'bg-white'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Checkout Card */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-6">
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <span className="text-xs font-black text-orange-600 uppercase italic">
                  {product.stock > 0 ? `Only ${product.stock} units left` : "Out of Stock"}
                </span>
                <Timer size={18} className="text-orange-600 animate-pulse" />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center bg-zinc-50 rounded-2xl border border-zinc-200 p-1">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center"><Minus size={18}/></button>
                  <span className="w-10 text-center font-black text-xl italic">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center"><Plus size={18}/></button>
                </div>
                <button onClick={() => handleCartAction(false)} className="flex-1 h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-[#A4143D]/20 transition-all">
                  <ShoppingBag size={20}/> Add to Cart
                </button>
              </div>
              <button onClick={() => handleCartAction(true)} className="w-full h-16 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all">
                <Zap size={20} fill="currentColor"/> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 space-y-3 border-t pt-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Description</h3>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">{product.description}</p>
        </div>

        {/* Recommendations */}
        <section className="mt-20">
          <h2 className="text-4xl font-black uppercase italic text-zinc-900 mb-10 tracking-tighter">Recommended for you</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommended.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      </Container>
    </div>
  );
}