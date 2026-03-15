'use client';

import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaArrowRight } from "react-icons/fa";
import { Mail, PhoneCall, MapPin, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 font-sans border-t border-white/5">
      
      {/* 🚀 TOP SECTION: TRUST HUD */}
      <div className="bg-zinc-900/50 border-b border-white/5">
        <div className="max-w-[1750px] mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TrustBadge icon={<ShieldCheck className="text-[#A4143D]" />} title="Secure_Registry" desc="End-to-end encrypted transactions" />
          <TrustBadge icon={<Zap className="text-yellow-500" />} title="Flash_Delivery" desc="Artifacts delivered in record time" />
          <TrustBadge icon={<PhoneCall className="text-blue-400" />} title="24/7_Support" desc="Expert concierge always live" />
          <TrustBadge icon={<MapPin className="text-green-500" />} title="Global_Network" desc="Sourcing from 50+ countries" />
        </div>
      </div>

      {/* 🏛️ MAIN FOOTER ENGINE */}
      <div className="max-w-[1750px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* BRAND BLOCK (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
               <Image 
                src="/aviore marketplace.png" 
                alt="Logo" 
                width={120} 
                height={50} 
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-500 font-medium">
              Aviore is a curated global registry for premium artifacts and daily essentials. 
              We bridge the gap between luxury sourcing and effortless marketplace convenience.
            </p>
            <div className="flex space-x-5 text-lg">
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedin />} />
              <SocialIcon icon={<FaFacebook />} />
              <SocialIcon icon={<FaTwitter />} />
            </div>
          </div>

          {/* DYNAMIC NAVIGATION GRID (5 Columns) */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterList 
              title="Departments" 
              links={["Electronics", "Fashion_Vault", "Home_Living", "Beauty_Health", "Industrial"]} 
            />
            <FooterList 
              title="Registry" 
              links={["Track_Order", "New_Arrivals", "Best_Sellers", "Featured_Vendors", "Flash_Drops"]} 
            />
            <FooterList 
              title="Company" 
              links={["About_Aviore", "Careers", "Safety_Center", "Privacy_Policy", "Service_Terms"]} 
            />
          </div>

          {/* SUBSCRIPTION HUB (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Newsletter_Registry</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Get live drop notifications</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Enter_Registry_Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#A4143D] transition-all placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#A4143D] text-white px-4 rounded-lg hover:bg-[#800f30] transition-all active:scale-95"
              >
                <FaArrowRight size={14} />
              </button>
            </form>
            <p className="text-[9px] text-zinc-600 font-medium leading-tight">
              By subscribing, you agree to our Digital Registry Terms and receive occasional drops.
            </p>
          </div>
        </div>
      </div>

      {/* 📜 BOTTOM BAR */}
      <div className="border-t border-white/5 bg-black/40">
        <div className="max-w-[1750px] mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">
            &copy; {currentYear} Aviore_Global_Marketplace. Built_for_Legacy.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">NGN_Lagos</Link>
            <Link href="#" className="hover:text-white transition-colors">Server_Status: Online</Link>
            <Link href="#" className="hover:text-white transition-colors underline decoration-[#A4143D]">Registry_v2.0.4</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Internal Helper Components ---

function TrustBadge({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/10 border border-white/5">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-white">{title}</span>
        <span className="text-[10px] font-medium text-zinc-600">{desc}</span>
      </div>
    </div>
  );
}

function FooterList({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic underline decoration-[#A4143D] underline-offset-8">
        {title}
      </h3>
      <ul className="flex flex-col space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-[11px] font-bold uppercase text-zinc-600 hover:text-white hover:translate-x-1 transition-all inline-block tracking-tighter">
              {link.replace('_', ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#A4143D] hover:border-[#A4143D] transition-all cursor-pointer">
      {icon}
    </div>
  );
}