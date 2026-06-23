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
      <Section className="pt-32 md:pt-40 pb-20 relative overflow-hidden">
        {/* Ambient Backlight */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#A4143D]/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT: TEXT CONTENT */}
            <div className="space-y-8 md:space-y-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-fit">
                <Sparkles size={14} className="text-[#A4143D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">The Registry Access</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                  Digital <br /> 
                  <span 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 tracking-tighter"
                    style={{ 
                      WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
                      WebkitBackgroundClip: 'text'
                    }}
                  >
                    Sovereignty
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-zinc-400 font-medium max-w-lg leading-relaxed">
                  Gift the ultimate standard. The AVIORÈ Gift Card grants access to our entire 
                  curated registry of high-end assets and premium vendors.
                </p>
              </div>

              {/* Responsive Amount Selector Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all duration-300 font-black text-xs md:text-sm tracking-tighter select-none
                      ${selectedAmount === amt 
                        ? 'border-[#A4143D] bg-[#A4143D] text-white scale-105 shadow-[0_10px_30px_rgba(164,20,61,0.2)]' 
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/30 hover:text-white'}`}
                  >
                    Loc. ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-[#A4143D] hover:text-white transition-all duration-300 shadow-2xl shadow-white/5 flex items-center justify-center gap-4 group">
                <span>Issue Gift Asset</span> 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* RIGHT: THE CARD VISUAL (NEUMORPHIC/3D GLASS) */}
            <div className="relative group order-1 lg:order-2 w-full max-w-xl mx-auto lg:max-w-none" style={{ perspective: '1000px' }}>
              <motion.div 
                whileHover={{ rotateY: -12, rotateX: 6, z: 10 }}
                style={{ transformStyle: 'preserve-3d' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative aspect-[1.58/1] w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl md:rounded-[2.5rem] border border-white/10 p-6 sm:p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(164,20,61,0.25)] overflow-hidden flex flex-col justify-between"
              >
                {/* Micro-dot Background Pattern */}
                <div className="absolute inset-0 opacity-5 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="flex justify-between items-start z-10" style={{ transform: 'translateZ(30px)' }}>
                  {/* Smart Chip Graphic */}
                  <div className="w-12 sm:w-16 h-8 sm:h-10 bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 rounded-lg opacity-40 border border-white/5" />
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-white/90">AVIORÈ</h2>
                </div>
                
                <div className="space-y-2 sm:space-y-4 z-10" style={{ transform: 'translateZ(45px)' }}>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Registry Value</p>
                  <p className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white transition-all duration-300">
                    ₦{selectedAmount.toLocaleString()}
                  </p>
                </div>
                
                {/* Subtle Structural Grain Texturing */}
                <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </motion.div>
              
              {/* Floating Verification Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white text-black p-4 md:p-5 rounded-2xl md:rounded-3xl border-4 border-[#050505] shadow-2xl z-20 pointer-events-none">
                 <ShieldCheck size={24} className="md:w-8 md:h-8 text-black" />
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* 🛡️ FEATURES: THE ASSURANCE */}
      <Section className="py-20 md:py-24 bg-[#080808] border-y border-white/5">
        <Container>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <Feature 
              icon={<Zap className="text-[#A4143D]" size={22} />}
              title="Instant Delivery"
              desc="Asset keys are delivered via secure encrypted email protocol immediately upon confirmation."
            />
            <Feature 
              icon={<Globe className="text-[#A4143D]" size={22} />}
              title="Registry-Wide"
              desc="Usable across all categories, from high-end fashion to tech assets and registry services."
            />
            <Feature 
              icon={<ShieldCheck className="text-[#A4143D]" size={22} />}
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
    <div className="space-y-4 md:space-y-6 group">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#A4143D] group-hover:bg-[#A4143D]/5 transition-all duration-300">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">{title}</h3>
        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}