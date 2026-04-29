'use client';

import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { RefreshCw, PackageCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const RETURN_STEPS = [
  {
    title: "Request Verification",
    desc: "Initiate your return via the user dashboard within the 7-day protocol window."
  },
  {
    title: "Inspection Logic",
    desc: "The asset must be returned in its original registry state with all security tags intact."
  },
  {
    title: "Credit Resolution",
    desc: "Once verified, your refund is processed to your original payment method or registry credit."
  }
];

export default function ReturnsPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-[#A4143D]">
      
      {/* 🚀 HERO: THE ASSURANCE STATEMENT */}
      <Section className="pt-32 pb-20">
        <Container>
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-[1px] w-12 bg-[#A4143D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A4143D]">Assurance</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
              Returns & <br />
              <span className="text-transparent text-outline-white">Exchanges</span>
            </h1>
            
            <p className="text-xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
              Our commitment to the registry means we stand by the quality of every asset. 
              If the physical reality does not meet the digital standard, we rectify it.
            </p>
          </div>
        </Container>
      </Section>

      {/* 📊 THE NUMBERS: QUICK STATS */}
      <Section className="py-12 bg-[#080808] border-y border-white/[0.03]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat item="7 Days" label="Return Window" />
            <Stat item="48 Hours" label="Inspection Time" />
            <Stat item="100%" label="Authenticity" />
            <Stat item="Free" label="Registry Exchanges" />
          </div>
        </Container>
      </Section>

      {/* 📋 THE POLICY: TECHNICAL BLOCKS */}
      <Section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold uppercase tracking-tighter italic">The Return Protocol</h2>
                <p className="text-zinc-500 leading-relaxed">
                  To maintain the integrity of our marketplace, all returns are subject to a standard validation check. 
                  Assets must be in unworn, unaltered condition with original packaging.
                </p>
              </div>

              <div className="space-y-8">
                {RETURN_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A4143D] group-hover:bg-[#A4143D] group-hover:text-white transition-all">
                      <span className="text-xs font-black">0{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold uppercase tracking-tight mb-1">{step.title}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NON-RETURNABLE ASSETS */}
            <div className="p-12 rounded-[3rem] bg-zinc-900/40 border border-white/5 backdrop-blur-sm">
              <AlertCircle className="text-[#A4143D] mb-6" size={32} />
              <h3 className="text-2xl font-bold uppercase tracking-tighter mb-6">Restricted Items</h3>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Due to the nature of luxury hygiene and technical authentication, the following items are 
                excluded from the standard return protocol:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <CheckCircle2 size={16} className="text-[#A4143D]" /> Bespoke / Custom Orders
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <CheckCircle2 size={16} className="text-[#A4143D]" /> Intimate Apparel & Jewelry
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <CheckCircle2 size={16} className="text-[#A4143D]" /> Sealed Tech & Software
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <CheckCircle2 size={16} className="text-[#A4143D]" /> Limited Edition Drops
                </li>
              </ul>
              
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Questions? Contact our concierge at support@aviore.registry
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 📣 CTA: PORTAL ACCESS */}
      <Section className="py-24 bg-[#A4143D]">
        <Container className="text-center">
          <RefreshCw size={48} className="mx-auto mb-8 text-white animate-spin-slow" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Ready to exchange?</h2>
          <p className="max-w-xl mx-auto text-white/80 font-medium mb-10">
            Access your secure registry portal to manage your orders and initiate an automated return request.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-white text-black px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
              Launch Return Portal
            </button>
            <button className="border border-white text-white px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#A4143D] transition-all">
              View Order History
            </button>
          </div>
        </Container>
      </Section>

      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Stat({ item, label }: { item: string, label: string }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl md:text-4xl font-black tracking-tighter uppercase">{item}</p>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}