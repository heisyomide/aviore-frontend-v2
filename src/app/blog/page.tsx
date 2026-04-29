'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ArrowUpRight, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const POSTS = [
  {
    category: "Vanguard Design",
    title: "The Architecture of Minimalist Luxury",
    excerpt: "Exploring the intersection of brutalist engineering and modern artisanal craft.",
    image: "/fash.jpg",
    date: "April 24, 2026",
    featured: true
  },
  {
    category: "Security",
    title: "Protocol Zero: Securing the Registry",
    excerpt: "How we implemented a multi-layer security audit for the 2026 AVIORÈ infrastructure.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    date: "April 20, 2026",
    featured: false
  },
  {
    category: "Fashion",
    title: "Spring/Summer: The 2026 Edit",
    excerpt: "A curated look at the couture pieces entering our verified marketplace this season.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
    date: "April 18, 2026",
    featured: false
  }
];

export default function JournalPage() {
  const featuredPost = POSTS.find(p => p.featured);
  const regularPosts = POSTS.filter(p => !p.featured);

  return (
    <div className="bg-[#050505] text-white min-h-screen">
      
      {/* 🚀 EDITORIAL HERO */}
      <Section className="pt-32 pb-16">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-[#A4143D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A4143D]">Journal</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                Editorial <br />
                <span className="text-transparent text-outline-white">Intelligence</span>
              </h1>
            </div>
            
            {/* Search/Filter Bar */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4 md:min-w-[300px]">
              <Search size={18} className="text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search the archive..." 
                className="bg-transparent outline-none text-sm font-medium w-full placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* FEATURED POST */}
          {featuredPost && (
            <Link href="/journal/featured" className="group relative block w-full aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-white/5">
              <Image 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A4143D] mb-4 block">Featured Story</span>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-4 italic">{featuredPost.title}</h2>
                  <p className="text-zinc-400 font-medium max-w-lg">{featuredPost.excerpt}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#A4143D] group-hover:text-white transition-all">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </Link>
          )}
        </Container>
      </Section>

      {/* 📂 GRID: RECENT STORIES */}
      <Section className="py-20 border-t border-white/[0.03]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {regularPosts.map((post, idx) => (
              <Link href={`/journal/${idx}`} key={idx} className="group block space-y-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/5">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{post.date}</span>
                    <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-[#A4143D] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-[#A4143D] transition-colors">{post.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ✉️ NEWSLETTER: JOIN THE VANGUARD */}
      <Section className="py-24 bg-[#080808]">
        <Container>
          <div className="relative p-12 md:p-24 rounded-[3rem] bg-[#A4143D] overflow-hidden flex flex-col items-center text-center">
             <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">The Weekly <br /> Registry</h2>
                <p className="max-w-md mx-auto text-white/70 font-medium">Get the latest on security updates, designer drops, and editorial insights delivered to your inbox.</p>
                <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto w-full">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 text-sm outline-none placeholder:text-white/40 focus:border-white transition-all"
                  />
                  <button className="bg-white text-[#A4143D] px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                    Subscribe
                  </button>
                </div>
             </div>
             {/* Background Noise/Texture */}
             <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </Container>
      </Section>

      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}