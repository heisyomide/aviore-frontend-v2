'use client';

import { Mail, PhoneCall, MapPin, ShieldCheck, Zap, ArrowRight, Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./layout/Container"; // 🚀 Rule 1 Alignment

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090b] text-zinc-400 border-t border-white/5">

      {/* 🏛️ MAIN FOOTER ENGINE - Rule 14 (Modular Blocks) */}
      <Container className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* BRAND BLOCK (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
<Link href="/" className="group flex items-center">
  <span className="text-2xl md:text-[28px] font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-black">
    Avior<span className="text-[#A4143D]">è</span>
  </span>
</Link>

            <p className="text-xs leading-relaxed max-w-sm text-zinc-500 font-bold uppercase tracking-tight">
              Aviore is a curated global registry for premium artifacts and daily essentials. 
              Bridging luxury sourcing with marketplace convenience.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* DYNAMIC NAVIGATION - Rule 3 (Typography Scale) */}
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

          {/* SUBSCRIPTION HUB - Rule 12 (Interaction) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Newsletter_Registry</h3>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Registry_Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-black text-white focus:outline-none focus:border-[#A4143D] focus:ring-4 focus:ring-[#A4143D]/10 transition-all placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#A4143D] text-white px-4 rounded-lg hover:bg-black transition-all active:scale-95"
              >
                <ArrowRight size={14} />
              </button>
            </form>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter leading-tight">
              Agreement to Digital Registry Terms required for sub.
            </p>
          </div>
        </div>
      </Container>

      {/* 📜 BOTTOM BAR - Rule 6 (Brand Token Integration) */}
      <div className="border-t border-white/5 bg-black/20">
        <Container className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            &copy; {currentYear} Aviore_Market_System. Built_for_Legacy.
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Network_Live</span>
            <Link href="#" className="hover:text-white transition-colors underline decoration-[#A4143D] underline-offset-4">Registry_v2.0.6</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

// --- Internal Helper Components (Keeping within line limits) ---

function TrustBadge({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#A4143D]/10 border border-white/5">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-white">{title}</span>
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{desc}</span>
      </div>
    </div>
  );
}

function FooterList({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col space-y-6">
      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic border-l-2 border-[#A4143D] pl-3">
        {title}
      </h3>
      <ul className="flex flex-col space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-[10px] font-black uppercase text-zinc-600 hover:text-[#A4143D] hover:translate-x-1 transition-all inline-block tracking-tighter">
              {link.replace('_', ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-[#A4143D] hover:border-[#A4143D] transition-all cursor-pointer shadow-lg active:scale-90">
      {icon}
    </div>
  );
}