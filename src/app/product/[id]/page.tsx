'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, Heart, ShoppingBag, ShieldCheck, Truck, BadgeCheck, LayoutGrid } from 'lucide-react';
import { useParams } from 'next/navigation';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import { useCartStore } from '@/src/store/useCartStore';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { ProductCard } from '@/src/components/shop/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Global Stores
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        
        // Fetch recommendations based on category
        const recResponse = await api.get('/products', { 
          params: { category: data.category?.slug, limit: 4 } 
        });
        // Filter out current product from recommendations
        setRecommended(recResponse.data.data.filter((p: any) => p.id !== id));
      } catch (err) {
        toast.error("ARTIFACT_NOT_FOUND");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="py-20 text-center font-bold">Registry Entry Missing</div>;

  const images = product.images?.length > 0 ? product.images : [{ imageUrl: '/placeholder.jpg' }];
  const isLiked = wishlistItems.some((item) => item.id === product.id);

  const handleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.info("REMOVED_FROM_WISHLIST");
    } else {
      addToWishlist(product);
      toast.success("ADDED_TO_WISHLIST");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 bg-[#FDFCFB]">
      
      {/* 1. NAVIGATION & IDENTITY */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-10">
        <span>Home</span>
        {product.category?.parent?.name && (
           <><span>/</span><span>{product.category.parent.name}</span></>
        )}
        <span>/</span>
        <span className="text-gray-900">{product.category?.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* LEFT: VISUAL REPOSITORY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
            <Image
              src={images[activeImg].imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-all duration-700"
              priority
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img: any, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImg === idx ? "border-[#A4143D]" : "border-transparent opacity-60"
                }`}
              >
                <Image src={img.imageUrl} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: SPECIFICATIONS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="px-3 py-1 bg-[#FBE9E3] text-[#A4143D] text-[9px] font-black uppercase rounded-full tracking-widest">
                 {product.category?.name}
               </span>
               <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                 <Star size={12} fill="currentColor" />
                 <span className="text-[10px] font-bold text-amber-700">{product.rating || 4.9}</span>
               </div>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4">
               <p className="text-4xl font-black text-[#A4143D] tracking-tighter italic">
                 ₦{Number(product.price).toLocaleString()}
               </p>
            </div>
          </div>

          {/* VENDOR IDENTITY WITH VERIFICATION */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-3 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Curated by Vendor</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-gray-900">{product.vendor?.storeName || 'Aviorè Global'}</p>
                    {product.vendor?.isVerified && (
                      <BadgeCheck size={18} className="text-blue-500 fill-blue-50" />
                    )}
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-green-600 uppercase italic tracking-widest">Verified Partner</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{product.sold || '200+'} SOLD</p>
                </div>
             </div>
          </div>

          {/* ACTIONS HUB */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-100 bg-white rounded-2xl px-2 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-lg">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <button 
                className="flex-1 h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#A4143D]/20 transition-all active:scale-95"
                onClick={() => {
                  addItem({ 
                    id: product.id, 
                    name: product.title, 
                    price: Number(product.price), 
                    image: images[0].imageUrl, 
                    quantity: qty,
                    stock: product.stock,
                    vendorId: product.vendorId 
                  });
                  toast.success("REGISTRY_UPDATED", { description: "Item added to your secure cart." });
                }}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button 
                onClick={handleWishlist}
                className={`h-16 w-16 border rounded-2xl flex items-center justify-center transition-all ${
                  isLiked ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-300 hover:text-red-500"
                }`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <BenefitItem icon={<Truck size={16}/>} label="Global Delivery" sub="Arrives in 5-7 days" />
               <BenefitItem icon={<ShieldCheck size={16}/>} label="Secure Registry" sub="100% End-to-End Encryption" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPECIFICATIONS & RECOMMENDATIONS */}
      <div className="mt-24 space-y-24">
        <div className="grid lg:grid-cols-12 gap-16 border-t border-gray-100 pt-16">
          <div className="lg:col-span-8 space-y-8">
             <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Inventory Specifications</h2>
             <div className="prose prose-sm text-gray-600 leading-relaxed max-w-none">
                {product.description || "No detailed description provided for this node."}
             </div>
          </div>
          <div className="lg:col-span-4">
             <div className="bg-gray-50 rounded-3xl p-8 space-y-6 border border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Node Properties</h3>
                <div className="space-y-4">
                   <PropertyItem label="Condition" value="Certified New" />
                   <PropertyItem label="Availability" value={product.stock > 0 ? "Active Inventory" : "Out of Stock"} />
                   <PropertyItem label="Category Path" value={product.category?.name} />
                </div>
             </div>
          </div>
        </div>

        {/* 3. DYNAMIC RECOMMENDATIONS ENGINE */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#A4143D]">
                <LayoutGrid size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Related Registry Entries</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Recommended
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommended.length > 0 ? (
              recommended.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/6] bg-gray-50 rounded-[2rem] animate-pulse border border-gray-100" />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function BenefitItem({ icon, label, sub }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
      <div className="text-[#A4143D]">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">{label}</p>
        <p className="text-[9px] font-bold text-gray-400 italic">{sub}</p>
      </div>
    </div>
  )
}

function PropertyItem({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-gray-900 uppercase">{value}</span>
    </div>
  )
}

function ProductSkeleton() {
  return <div className="max-w-[1400px] mx-auto px-6 py-20 animate-pulse bg-[#FDFCFB]">
    <div className="h-6 w-48 bg-gray-200 rounded-full mb-10" />
    <div className="grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-7 aspect-square bg-gray-100 rounded-[2.5rem]" />
      <div className="lg:col-span-5 space-y-8">
        <div className="h-12 w-full bg-gray-200 rounded-2xl" />
        <div className="h-24 w-full bg-gray-200 rounded-3xl" />
        <div className="h-16 w-full bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </div>
}