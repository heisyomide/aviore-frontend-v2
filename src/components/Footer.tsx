'use client';

import { Instagram, Twitter, Facebook, Youtube, ArrowUpRight, Send, Globe } from "lucide-react";
import Link from "next/link";
import { Container } from "./layout/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Social Links Data
  const SOCIAL_LINKS = [
    { name: 'Instagram', icon: <Instagram size={16} />, href: 'https://www.instagram.com/avioremarketplace?igsh=MnUzYnpnZmV6Y2lw&utm_source=qr' },
    { name: 'Twitter', icon: <Twitter size={16} />, href: 'https://x.com/shopaviore?s=21' },
    { name: 'Facebook', icon: <Facebook size={16} />, href: 'https://www.facebook.com/share/18dCcLJLW8/?mibextid=wwXIfr' },
    { name: 'Youtube', icon: <Youtube size={16} />, href: 'https://youtube.com/shopaviore' },
    { name: 'Tiktok', icon: <TiktokIcon size={16} />, href: 'https://www.tiktok.com/@shopaviore' }, // Updated
  
  ];

  return (
    <footer className="bg-[#050505] text-zinc-400 border-t border-white/[0.03]">
      
      {/* 🚀 TOP: BRAND & NEWSLETTER SECTION */}
      <Container className="pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LOGO & PHILOSOPHY */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-bold tracking-tighter text-white">
                Avior<span className="text-[#A4143D]">è</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-500 font-medium">
              A curated destination for the modern collector. Bridging the gap between 
              artisanal luxury and global accessibility.
            </p>
            
            {/* CONNECT: MODERN SOCIAL ROW */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-[#A4143D] hover:border-[#A4143D] transition-all duration-500 group"
                  aria-label={social.name}
                >
                  <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* NEWSLETTER: EDITORIAL STYLE */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Join the Inner Circle</h3>
                <p className="text-sm text-zinc-500 max-w-md">Be the first to access limited drops, seasonal curations, and registry updates.</p>
                
                <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-black/40 border-b border-white/10 py-4 pr-12 text-sm text-white focus:outline-none focus:border-[#A4143D] transition-colors placeholder:text-zinc-700"
                  />
                  <button type="submit" className="absolute right-0 text-zinc-400 hover:text-[#A4143D] transition-colors">
                    <Send size={20} strokeWidth={1.5} />
                  </button>
                </form>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                <Globe size={300} />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* 🚀 MIDDLE: SITE LINKS GRID */}
      <div className="border-y border-white/[0.03]">
        <Container className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
            <FooterList 
              title="Collections" 
              links={[
                { label: "Electronics", href: "/shop/electronics" },
                { label: "High Fashion", href: "/shop/fashion" },
                { label: "Art & Decor", href: "/shop/home" },
                { label: "Beauty Vault", href: "/shop/beauty" }
              ]} 
            />
            <FooterList 
              title="Registry" 
              links={[
                { label: "Track Shipments", href: "/track" },
                { label: "New Arrivals", href: "/shop?sort=newest" },
                { label: "Top Vendors", href: "/vendors" },
                { label: "Gift Cards", href: "/gifts" }
              ]} 
            />
            <FooterList 
              title="Assistance" 
              links={[
                { label: "Service Terms", href: "/terms" },
                { label: "Safety Center", href: "/safety" },
                { label: "Returns Policy", href: "/returns" },
                { label: "Help Desk", href: "/help" }
              ]} 
            />
            <FooterList 
              title="Company" 
              links={[
                { label: "The Story", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Privacy Registry", href: "/privacy" },
                { label: "Journal", href: "/blog" }
              ]} 
            />
          </div>
        </Container>
      </div>

      {/* 🚀 BOTTOM: FINAL BAR */}
      <div className="bg-black py-10">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[11px] font-medium tracking-widest text-zinc-600">
              &copy; {currentYear} AVIORÈ SYSTEM
            </p>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">System Online</span>
            </div>
          </div>
          
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors tracking-widest uppercase">System Status</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-4 decoration-[#A4143D]">v.1.4.0</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

// --- Sub-components for Clean Structure ---

function FooterList({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-7">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
        {title}
      </h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              className="text-[13px] text-zinc-500 hover:text-white transition-all duration-300 flex items-center group/link"
            >
              {link.label}
              <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all text-[#A4143D]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}