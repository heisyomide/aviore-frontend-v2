'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ShieldAlert, Fingerprint, Lock, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';

const SECURITY_LAYERS = [
  {
    icon: <Fingerprint size={24} />,
    title: "Identity Verification",
    desc: "Every vendor on the AVIORÈ registry undergoes a rigorous KYC (Know Your Customer) process, ensuring that every asset comes from a legitimate source."
  },
  {
    icon: <Lock size={24} />,
    title: "Encrypted Transactions",
    desc: "We utilize AES-256 bit encryption for all financial data. Your payment details are never stored on our local servers."
  },
  {
    icon: <EyeOff size={24} />,
    title: "Privacy First",
    desc: "Our data retention policy is built on the principle of least privilege. We only collect the data necessary to fulfill your logistical routing."
  }
];

export default function SafetyPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#A4143D]">
      
      {/* 🚀 HERO: THE SECURITY VANGUARD */}
      <Section className="pt-32 pb-20">
        <Container>
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-[1px] w-12 bg-[#A4143D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A4143D]">Infrastructure</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12">
              Engineered <br />
              <span className="text-transparent text-outline-white">Security.</span>
            </h1>
            
            <p className="text-xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
              AVIORÈ is built on a Zero-Trust architecture. We believe that luxury is nothing 
              without the certainty of safety.
            </p>
          </div>
        </Container>
      </Section>

      {/* 🧩 THE LAYERS: TECHNICAL GRID */}
      <Section className="py-24 border-y border-white/[0.03] bg-[#080808]">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            {SECURITY_LAYERS.map((layer, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#A4143D] group-hover:border-[#A4143D]/50 transition-all duration-500">
                  {layer.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{layer.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 🔍 LOGISTICS: VERIFIED ROUTING */}
      <Section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight italic">
                From the Vendor to <br /> Your Doorstep.
              </h2>
              <div className="space-y-6">
                <Step 
                  title="Asset Inspection" 
                  desc="Quality control officers inspect the physical condition and authenticity of premium goods before shipping."
                />
                <Step 
                  title="Secure Logistics" 
                  desc="We partner with verified logistical agencies that specialize in high-value asset transport."
                />
                <Step 
                  title="Escrow Assurance" 
                  desc="Funds are held in a secure state and only released to vendors once delivery is confirmed by the recipient."
                />
              </div>
            </div>
            
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-[#A4143D]/10 z-10 group-hover:bg-transparent transition-colors duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1557597774-9d2739f8fa00?q=80&w=2044" 
                alt="Security Audit" 
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 🚨 REPORTING: INCIDENT RESPONSE */}
      <Section className="py-24 bg-[#A4143D]">
        <Container className="text-center">
          <ShieldAlert size={48} className="mx-auto mb-8 text-white" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Found a Bug?</h2>
          <p className="max-w-xl mx-auto text-white/80 font-medium mb-10">
            We operate an active Bug Bounty program for security researchers. If you identify a 
            vulnerability in the AVIORÈ registry, report it to our security vanguard immediately.
          </p>
          <a 
            href="mailto:security@aviore.registry" 
            className="inline-block bg-white text-black px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
          >
            Report Vulnerability
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

function Step({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="mt-1">
        <CheckCircle2 size={18} className="text-[#A4143D]" />
      </div>
      <div>
        <h4 className="text-lg font-bold uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}