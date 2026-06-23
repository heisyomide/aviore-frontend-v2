'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { useState } from 'react';

const AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState(AMOUNTS[1]);

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#A4143D] overflow-x-hidden">
      
      {/* 🚀 HERO SECTION */}
      <Section className="pt-32 md:pt-44 pb-24 relative">
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* LEFT: CRISP, HIGH-CONTRAST TYPOGRAPHY */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/10 w-fit">
                <Sparkles size={14} className="text-[#A4143D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">The Registry Access</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">
                  Digital <br /> 
                  <span className="text-white/60">Sovereignty</span>
                </h1>
                
                <p className="text-base md:text-lg text-zinc-200 font-medium max-w-lg leading-relaxed">
                  Gift the ultimate standard. The AVIORÈ Gift Card grants access to our entire 
                  curated registry of high-end assets and premium vendors.
                </p>
              </div>

              {/* Solid, Readable Amount Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`px-6 py-4 rounded-xl border-2 transition-all duration-200 font-black text-sm tracking-tight select-none
                      ${selectedAmount === amt 
                        ? 'border-[#A4143D] bg-[#A4143D] text-white scale-105' 
                        : 'border-white/20 bg-white/5 text-white hover:border-white hover:bg-white/10'}`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-[#A4143D] hover:text-white transition-all duration-300 flex items-center justify-center gap-4 group">
                <span>Issue Gift Asset</span> 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* RIGHT: RENDERED CARD METRICS */}
            <div className="relative order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none">
              <div className="relative aspect-[1.58/1] w-full bg-gradient-to-br from-zinc-900 to-black rounded-2xl border-2 border-white/20 p-8 md:p-10 shadow-2xl flex flex-col justify-between">
                
                <div className="flex justify-between items-start">
                  {/* Clean Solid Gold/Metallic Chip Representation */}
                  <div className="w-14 h-9 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-md shadow-inner" />
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">AVIORÈ</h2>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Registry Value</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    ₦{selectedAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Crisp Badge Anchor */}
              <div className="absolute -bottom-4 -right-4 bg-white text-black p-4 rounded-xl border-4 border-[#050505] shadow-2xl">
                 <ShieldCheck size={24} className="text-black" />
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* 🛡️ FEATURES GRID: CLEAR & SOLID */}
      <Section className="py-20 bg-[#0c0c0c] border-t border-white/10">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={<Zap className="text-white" size={24} />}
              title="Instant Delivery"
              desc="Asset keys are delivered via secure encrypted email protocol immediately upon confirmation."
            />
            <Feature 
              icon={<Globe className="text-white" size={24} />}
              title="Registry-Wide"
              desc="Usable across all categories, from high-end fashion to tech assets and registry services."
            />
            <Feature 
              icon={<ShieldCheck className="text-white" size={24} />}
              title="No Expiry"
              desc="Your balance is stored on the AVIORÈ ledger permanently until redeemed by the holder."
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function Feature({ icon, title, desc }: FeatureProps) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-black uppercase tracking-tight text-white">{title}</h3>
        <p className="text-zinc-300 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}