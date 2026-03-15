import { Navbar } from '../components/Header';
import { SidebarMenu } from '../components/SidebarMenu';
import { HeroSection } from '../components/HeroBanner';
import { PromoBanners } from '../components/PromoBanners';
import { TopDealsSection } from '../components/TopSaverDeals';
import { ProductRow } from '../components/ProductRow';
import { PopularVendorsSection } from '../components/PopularVendors';
import { FeaturedBrandsSection } from '../components/FeaturedBrand';
import HomeCartWidget from '../components/CartStatusBar';
import { Footer } from '../components/Footer';
import HomeRegistry from '../components/storefront/HomeRegistry';
import { DynamicCampaignSection, type Campaign } from '../components/CampaignSection';

async function getActiveCampaigns(): Promise<Campaign[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiBase}/storefront/campaigns/active`, { next: { revalidate: 30 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

async function getRegistryData(): Promise<any> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiBase}/storefront/registry`, { next: { revalidate: 60 } });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [registry, campaigns] = await Promise.all([getRegistryData(), getActiveCampaigns()]);
  const { category: activeCat } = await searchParams;

  const trending = registry?.sections?.find((s: any) => s.id === 'trending')?.data || [];
  const electronics = registry?.sections?.find((s: any) => s.id === 'electronics')?.data || [];
  const furniture = registry?.sections?.find((s: any) => s.id === 'furniture')?.data || [];
  const vendors = registry?.vendors || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* 🏛️ ULTRA-WIDE ENGINE: Increased to 1800px to prevent "Jam-Packing" */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
        
        {/* 1. SIDEBAR: Kept slim to leave room for products */}
        <aside className="hidden xl:block col-span-2">
          <div className="sticky top-8 space-y-6">
            <SidebarMenu activeCategory={activeCat} />
            <div className="bg-[#A4143D] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Aviore_Pro</span>
               <h4 className="text-2xl font-black italic mt-3 leading-none uppercase">Registry <br/> Prime</h4>
               <div className="absolute -right-6 -bottom-6 text-8xl font-black italic opacity-10 group-hover:scale-110 transition-transform">VIP</div>
            </div>
          </div>
        </aside>

        {/* 🚀 2. MAIN ENGINE: Flexible Column Spanning */}
        <main className="col-span-12 xl:col-span-10 2xl:col-span-8 space-y-12">
          
          {/* TOP HERO GRID */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <HeroSection />
            </div>
            <div className="hidden lg:grid col-span-4 grid-rows-2 gap-8">
              <div className="bg-orange-600 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl">
                <span className="text-[10px] font-black tracking-widest uppercase">Flash_Inventory</span>
                <h4 className="text-4xl font-black italic leading-none uppercase">60% <br/> Drop</h4>
              </div>
              <div className="bg-zinc-950 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl border border-white/5">
                <span className="text-[10px] font-black tracking-widest uppercase">New_Artifacts</span>
                <h4 className="text-4xl font-black italic leading-none uppercase">Tech <br/> Vault</h4>
              </div>
            </div>
          </div>

          {/* CAMPAIGNS & REGISTRY */}
          {campaigns.map((camp) => <DynamicCampaignSection key={camp.id} campaign={camp} />)}
          
          <div className="bg-white rounded-[3.5rem] p-4 shadow-sm border border-zinc-100">
             <HomeRegistry />
          </div>

          <TopDealsSection initialDeals={trending} />
          
          <PromoBanners />

          {/* DYNAMIC ROWS: Refactored spacing */}
          <div className="space-y-12">
            <ProductRow title="Electronics & Technology" products={electronics} color="#E67E22" />
            <ProductRow title="Furniture & Living" products={furniture} color="#27AE60" />
          </div>

          <PopularVendorsSection initialVendors={vendors} />
          
          <div className="bg-white rounded-[3.5rem] p-16 border border-zinc-100 shadow-sm">
             <FeaturedBrandsSection />
          </div>
        </main>

        {/* 3. RIGHT SIDEBAR */}
        <aside className="hidden 2xl:block col-span-2">
          <div className="sticky top-8 space-y-8">
            <HomeCartWidget />
            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
              <h5 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-6">Concierge</h5>
              <p className="text-base font-bold leading-tight uppercase italic">Registry <br/> Support_Live</p>
              <button className="mt-8 w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                Contact_Expert
              </button>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}