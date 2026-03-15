import { Store, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/src/components/shop/ProductCard";
import { FollowButton } from "@/src/components/vendor/FollowButton";

async function getVendorData(id: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ;
  try {
    const res = await fetch(`${apiBase}/storefront/vendors/${id}`, { 
      next: { revalidate: 0 } // Live data for real-time inventory and follower counts
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function VendorStorefront({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const vendor = await getVendorData(id);
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  if (!vendor) return <VendorNotFound />;

  const logoUrl = vendor.imageUrl 
    ? (vendor.imageUrl.startsWith('http') ? vendor.imageUrl : `${apiBase}/uploads/${vendor.imageUrl}`)
    : null;

  // Initial check could be handled via a secure cookie-based API call here
  const isFollowing = false; 

  return (
    <div className="min-h-screen bg-white">
      {/* HUD HEADER */}
      <div className="bg-zinc-950 pt-16 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/vendors" className="group flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-12 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Directory
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            {/* BRAND LOGO */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white overflow-hidden border-[6px] border-zinc-900 shadow-2xl shrink-0">
              {logoUrl ? (
                <Image src={logoUrl} alt={vendor.storeName} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                   <Store size={40} className="text-zinc-200" />
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-4 pb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-red-600">
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified_Registry_Partner</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
                {vendor.storeName}
              </h1>
              <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed uppercase tracking-tight">
                {vendor.description || "Official marketplace partner specializing in premium artifacts."}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
                <Metric label="Collection" value={vendor._count?.products} />
                <Metric label="Followers" value={vendor._count?.followers} border />
                
                {/* INTERACTIVE FOLLOW ACTION */}
                <FollowButton vendorId={vendor.id} initialIsFollowing={isFollowing} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 pb-32">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-zinc-200/50 border border-zinc-50">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-1">
               <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Available_Inventory</span>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                Store <span className="text-zinc-400 font-medium">Catalog</span>
               </h2>
            </div>
            <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
              Total_Items: {vendor.products?.length || 0}
            </div>
          </div>

          {vendor.products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {vendor.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">This store has no active listings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, border }: { label: string; value: number; border?: boolean }) {
  return (
    <div className={`text-white ${border ? 'border-l border-zinc-800 pl-8' : ''}`}>
      <span className="block text-2xl font-black italic leading-none">{value || 0}</span>
      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="py-40 text-center space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Error_404</p>
      <h2 className="text-2xl font-black italic uppercase tracking-tighter">Vendor_Not_Found</h2>
      <Link href="/vendors" className="text-red-600 font-bold text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">
        Return to Directory
      </Link>
    </div>
  );
}