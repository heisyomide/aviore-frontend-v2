'use client';

import Link from 'next/link';
import { UserPlus, Sparkles } from 'lucide-react';
import { Section } from '../layout/Section';

export function VendorCTA() {
  return (
    <Section className="py-8">
      <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#A4143D] p-12 md:p-20">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <Sparkles size={12} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Partner Program</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Ready to elevate <br /> your business?
            </h2>
            <p className="max-w-md text-white/70 text-sm font-medium">
              Join the AVIORÈ registry as a verified vendor and reach a global audience of elite collectors.
            </p>
          </div>

          <Link href="/become-a-vendor" className="group flex items-center gap-4 bg-white px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] text-black hover:scale-105 transition-all shadow-2xl">
            Become a Vendor <UserPlus size={18} />
          </Link>
        </div>
      </div>
    </Section>
  );
}