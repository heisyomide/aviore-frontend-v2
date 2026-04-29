'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ShieldCheck, Scale, FileText, Lock } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "April 29, 2026";

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#A4143D]">
      
      {/* 🚀 HERO: MINIMALIST HEADER */}
      <Section className="pt-32 pb-16 border-b border-white/[0.03]">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-[#A4143D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A4143D]">Governance</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
              Terms of <br />
              <span className="text-transparent text-outline-white">Service</span>
            </h1>
            
            <div className="flex flex-wrap gap-8 mt-12 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#A4143D]" /> Version 2.0.4
              </div>
              <div className="flex items-center gap-2">
                <Scale size={14} className="text-[#A4143D]" /> Effective: {lastUpdated}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 📜 CONTENT: STRUCTURED ARCHITECTURE */}
      <Section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* STICKY NAVIGATION FOR LEGAL SECTIONS */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
              <nav className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-8">Index</p>
                {['Registry Access', 'Vendor Obligations', 'Security Protocols', 'Financial Logic', 'Intellectual Assets'].map((item, idx) => (
                  <a 
                    key={idx}
                    href={`#section-${idx}`}
                    className="block text-sm font-medium text-zinc-500 hover:text-[#A4143D] transition-colors border-l border-white/5 pl-6"
                  >
                    0{idx + 1}. {item}
                  </a>
                ))}
              </nav>
            </aside>

            {/* MAIN LEGAL TEXT */}
            <div className="lg:col-span-8 space-y-20">
              
              <LegalBlock 
                id="section-0"
                number="01"
                title="The AVIORÈ Registry Access"
                content="By accessing the AVIORÈ marketplace, you agree to operate within our established digital protocol. We reserve the right to revoke access to any entity that compromises the integrity of our curated registry."
              />

              <LegalBlock 
                id="section-1"
                number="02"
                title="Vendor Obligations"
                content="All partners must adhere to the AVIORÈ standard of authenticity. Any submission of counterfeit or substandard assets will result in immediate permanent suspension from the ecosystem."
              />

              <div className="p-12 rounded-[2.5rem] bg-[#080808] border border-[#A4143D]/20 relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <Lock className="text-[#A4143D]" size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-tight">03. Security Protocols</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      User accounts are protected under high-encryption layers. Users are strictly prohibited from attempting unauthorized penetration testing or vulnerability scanning on the AVIORÈ domain.
                    </p>
                    <p className="text-[#A4143D] text-[10px] font-bold uppercase tracking-widest">
                      Any breach attempts will be logged and reported to relevant authorities.
                    </p>
                 </div>
                 {/* Grainy Texture */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
              </div>

              <LegalBlock 
                id="section-3"
                number="04"
                title="Financial Logic"
                content="Transactions are processed via secure gateway protocols. AVIORÈ acts as a verified intermediary, ensuring that assets are only released upon successful verification of funds and logistical compliance."
              />

              <LegalBlock 
                id="section-4"
                number="05"
                title="Intellectual Assets"
                content="The branding, code, and curated imagery within the AVIORÈ ecosystem are protected intellectual property. Unauthorized reproduction is a violation of our governing laws."
              />

            </div>
          </div>
        </Container>
      </Section>

      {/* 📣 FOOTER CTA: QUESTIONS */}
      <Section className="py-24 bg-[#080808] border-t border-white/[0.03]">
        <Container className="text-center">
          <p className="text-zinc-500 text-sm mb-6 font-medium">Have questions regarding our legal architecture?</p>
          <a 
            href="mailto:legal@aviore.registry" 
            className="text-2xl md:text-4xl font-bold italic tracking-tight hover:text-[#A4143D] transition-colors"
          >
            legal@aviore.registry
          </a>
        </Container>
      </Section>

      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

function LegalBlock({ id, number, title, content }: { id: string, number: string, title: string, content: string }) {
  return (
    <div id={id} className="space-y-6 group">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-[#A4143D]">{number}</span>
        <h3 className="text-2xl font-bold uppercase tracking-tighter">{title}</h3>
      </div>
      <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl font-medium">
        {content}
      </p>
    </div>
  );
}