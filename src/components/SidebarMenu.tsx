'use client';

import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, 
  Smartphone, 
  Cpu, 
  Home, 
  Shirt, 
  Zap, 
  Waves, 
  ShieldCheck,
  Flame,
  Truck,
  RotateCcw,
  BadgePercent,
  PhoneCall
} from "lucide-react";

const CATEGORIES = [
  { id: 'electronics', name: 'Industrial Parts & Tools', icon: <Cpu size={16} />, hot: true },
  { id: 'beauty', name: 'Health & Beauty', icon: <ShieldCheck size={16} /> },
  { id: 'sports', name: 'Gifts, Sports & Toys', icon: <Zap size={16} /> },
  { id: 'clothing', name: 'Textiles & Accessories', icon: <Shirt size={16} /> },
  { id: 'tech', name: 'Optimum Electronics', icon: <Smartphone size={16} />, hot: true },
  { id: 'home', name: 'Home, Lights & Construction', icon: <Home size={16} /> },
  { id: 'vapes', name: 'Components & Telecom', icon: <Waves size={16} /> },
];

export function SidebarMenu({ activeCategory }: { activeCategory?: string }) {
  return (
    <aside className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-left-4 duration-1000">
      
      {/* 1. MAIN CATEGORY BLOCK */}
      <nav className="bg-white rounded-[2rem] border border-zinc-100 overflow-hidden shadow-sm">
        <div className="bg-zinc-950 px-6 py-5 flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
             <div className="w-4 h-0.5 bg-red-600"></div>
             <div className="w-3 h-0.5 bg-white"></div>
             <div className="w-4 h-0.5 bg-white"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Categories</span>
        </div>

        <div className="py-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`group flex items-center justify-between px-6 py-3.5 transition-all hover:bg-zinc-50 ${
                activeCategory === cat.id ? 'bg-zinc-50 border-r-4 border-red-600' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`transition-colors ${activeCategory === cat.id ? 'text-red-600' : 'text-zinc-400 group-hover:text-zinc-900'}`}>
                  {cat.icon}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-tight ${activeCategory === cat.id ? 'text-zinc-950' : 'text-zinc-500 group-hover:text-zinc-900'}`}>
                  {cat.name}
                </span>
              </div>
              <ChevronRight size={12} className="text-zinc-200 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </nav>

      {/* 2. SIDEBAR PROMO BANNER (As seen in your sample) */}
      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group">
        <Image 
          src="/banners/kids-fashion.jpg" 
          alt="Promo" 
          fill 
          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 flex flex-col justify-end">
          <p className="text-yellow-400 font-black text-2xl italic leading-none">$49.89</p>
          <p className="text-white font-black uppercase italic tracking-tighter text-xl mt-1">Kids Fashion</p>
          <button className="text-[9px] font-black uppercase text-white/70 tracking-widest mt-4 border-b border-white/20 w-fit group-hover:text-white group-hover:border-white transition-all">Shop_Now</button>
        </div>
      </div>

      {/* 3. MINI PRODUCT FEED (Latest Products List) */}
      <div className="bg-white rounded-[2rem] border border-zinc-100 p-6 space-y-6 shadow-sm">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-zinc-100 pb-4">Latest_Products</h4>
        <div className="space-y-5">
           <MiniProductItem name="V-neck blouse" price="98.00" oldPrice="130.00" />
           <MiniProductItem name="I Watch Series 3" price="250.00" oldPrice="285.00" />
           <MiniProductItem name="Smart TV Premium" price="299.00" />
        </div>
      </div>

      {/* 4. CONTACT BLOCK */}
      <div className="bg-zinc-950 rounded-[2rem] p-6 text-white relative overflow-hidden group">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <PhoneCall size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-[8px] font-black uppercase opacity-50">Call_Us_Now</p>
            <p className="text-sm font-black italic tracking-tight group-hover:text-red-600 transition-colors">0123-444-666</p>
          </div>
        </div>
      </div>

      {/* 5. TRUST FEATURES (The vertical icons in your sample) */}
      <div className="bg-white rounded-[2rem] border border-zinc-100 p-6 space-y-6">
         <TrustItem icon={<Truck size={18}/>} title="Free Delivery" sub="On orders over $49.00" />
         <TrustItem icon={<ShieldCheck size={18}/>} title="Order Protection" sub="Secured Information" />
         <TrustItem icon={<RotateCcw size={18}/>} title="Money Back" sub="Return within 30 days" />
      </div>

    </aside>
  );
}

// --- Internal Helper Components ---

function MiniProductItem({ name, price, oldPrice }: { name: string, price: string, oldPrice?: string }) {
  return (
    <div className="flex gap-4 group cursor-pointer">
      <div className="w-14 h-14 bg-zinc-50 rounded-xl border border-zinc-100 shrink-0 overflow-hidden">
         <div className="w-full h-full bg-zinc-200 animate-pulse" /> {/* Placeholder for img */}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h5 className="text-[10px] font-bold text-zinc-900 truncate uppercase">{name}</h5>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-red-600 font-black text-xs italic">${price}</span>
          {oldPrice && <span className="text-[9px] text-zinc-400 line-through">${oldPrice}</span>}
        </div>
      </div>
    </div>
  );
}

function TrustItem({ icon, title, sub }: { icon: any, title: string, sub: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-red-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-zinc-900">{title}</span>
        <span className="text-[9px] font-medium text-zinc-400">{sub}</span>
      </div>
    </div>
  );
}