'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Gift, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { useState } from 'react';

const AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState(AMOUNTS[1]);

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#A4143D]">
      
      {/* 🚀 HERO SECTION */}
      <Section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A4143D]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* LEFT: TEXT CONTENT */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <Sparkles size={14} className="text-[#A4143D]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Registry Access</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-white">
                Digital <br /> <span className="text-transparent text-outline-white">Sovereignty</span>
              </h1>
              
              <p className="text-lg text-zinc-300 font-medium max-w-lg leading-relaxed">
                Gift the ultimate standard. The AVIORÈ Gift Card grants access to our entire 
                curated registry of high-end assets and premium vendors.
              </p>

              <div className="flex flex-wrap gap-4">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`px-8 py-4 rounded-2xl border-2 transition-all font-black text-sm tracking-tighter
                      ${selectedAmount === amt 
                        ? 'border-[#A4143D] bg-[#A4143D] text-white scale-105' 
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/30'}`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button className="w-full md:w-auto px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-[#A4143D] hover:text-white transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-4">
                Issue Gift Asset <ArrowRight size={20} />
              </button>
            </div>

            {/* RIGHT: THE CARD VISUAL (NEUMORPHIC/GLASS) */}
            <div className="relative group perspective-1000">
              <motion.div 
                whileHover={{ rotateY: -10, rotateX: 5 }}
                className="relative aspect-[1.6/1] w-full bg-linear-to-br from-zinc-800 to-black rounded-[2.5rem] border-2 border-white/10 p-12 shadow-[0_40px_100px_-20px_rgba(164,20,61,0.3)] overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-10 bg-linear-to-r from-zinc-700 to-zinc-500 rounded-lg opacity-50" /> {/* Chip */}
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white/90">AVIORÈ</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A4143D]">Registry Value</p>
                    <p className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                      ₦{selectedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Grainy Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </motion.div>
              
              {/* Card Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-3xl border-4 border-[#050505] shadow-2xl">
                 <ShieldCheck size={32} />
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* 🛡️ FEATURES: THE ASSURANCE */}
      <Section className="py-24 bg-[#080808] border-y border-white/5">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={<Zap className="text-[#A4143D]" />}
              title="Instant Delivery"
              desc="Asset keys are delivered via secure encrypted email protocol immediately upon confirmation."
            />
            <Feature 
              icon={<Globe className="text-[#A4143D]" />}
              title="Registry-Wide"
              desc="Usable across all categories, from high-end fashion to tech assets and registry services."
            />
            <Feature 
              icon={<ShieldCheck className="text-[#A4143D]" />}
              title="No Expiry"
              desc="Your balance is stored on the AVIORÈ ledger permanently until redeemed by the holder."
            />
          </div>
        </Container>
      </Section>

      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.4);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-6 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#A4143D] transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
      <p className="text-zinc-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}