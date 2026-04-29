'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Zap, Globe, BarChart3, 
  ArrowRight, Check, HelpCircle, FileText, 
  ChevronRight, Percent, Landmark
} from 'lucide-react';
import { Navbar } from '@/src/components/navbar/Navbar';
import { api } from '@/src/lib/api';

// Define proper interfaces for TypeScript
interface PriceCardProps {
  tier: string;
  mainValue: string;
  subText: string;
  desc: string;
  features: string[];
  featured?: boolean;
  disabled?: boolean;
}

export default function VendorOnboardingLanding() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-100">
       <Navbar />
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-[#0a0c10] pt-24 pb-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-6">
            Aviore Merchant Program 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
            Scale your business <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              without the limits.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop worrying about logistics and payments. Join 5,000+ active vendors using Aviore’s 
            advanced infrastructure to reach 1.2M+ buyers monthly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('fees')?.scrollIntoView({behavior: 'smooth'})}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              See Fee Structure
            </button>
            <button 
              onClick={() => document.getElementById('register-section')?.scrollIntoView({behavior: 'smooth'})}
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
            >
              Start Selling Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Built for growth, <br/>trusted by experts.</h2>
            <p className="text-slate-500 mb-8">We don't just host your products; we provide a high-performance ecosystem designed to convert visitors into loyal customers.</p>
            
            <div className="space-y-6">
              <BenefitItem title="Instant Settlements" desc="Funds are released to your wallet within 24 hours of successful delivery." />
              <BenefitItem title="Advanced Analytics" desc="Track sales trends, customer behavior, and inventory health in real-time." />
              <BenefitItem title="Automated Marketing" desc="Our AI promotes your top-rated products to thousands of relevant buyers." />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl flex items-center justify-center">
              <BarChart3 size={120} className="text-orange-500 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMISSION SECTION --- */}
      <section id="fees" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Transparent Pricing</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Choose a plan that scales with your ambition. We believe in growing together.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          
          <PriceCard 
            tier="Standard Merchant" 
            mainValue="10%" 
            subText="Commission per sale"
            desc="The best way to start. No monthly fees, no hidden costs. Pay only when you sell."
            features={[
              'Standard Storefront',
              'Basic Sales Analytics',
              '24-Hour Payout Processing',
              'Community Support Access'
            ]}
            featured={true}
          />

          <div className="relative group">
            <div className="absolute -top-4 right-10 z-20 bg-slate-900 text-white text-[10px] font-black px-5 py-2 rounded-full tracking-widest uppercase shadow-2xl">
              Coming Soon
            </div>
            
            <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500 h-full">
              <PriceCard 
                tier="Premium Merchant" 
                mainValue="₦10,000" 
                subText="Flat monthly subscription"
                desc="For high-volume sellers who want 0% commission and advanced growth tools."
                features={[
                  '0% Sales Commission',
                  'Priority Search Placement',
                  'Dedicated Account Manager',
                  'Advanced API Integrations'
                ]}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- TERMS & REGISTER SECTION --- */}
      <section id="register-section" className="py-24 max-w-4xl mx-auto px-6">
        <div className="bg-[#0a0c10] rounded-[2rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to join the elite?</h2>
            
            <div className="space-y-4 mb-10">
              <p className="text-slate-400 text-sm">Please review and accept our Merchant Guidelines:</p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-48 overflow-y-auto text-sm text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-white/20">
                <h4 className="text-white font-bold mb-2">Aviore Terms of Service (Abridged)</h4>
                <p className="mb-4">1. Product Authenticity: Vendors must strictly list only 100% original products. Counterfeit goods result in permanent bans.</p>
                <p className="mb-4">2. KYC Requirements: You must provide a valid Government ID and proof of business registration to initiate withdrawals.</p>
                <p className="mb-4">3. Shipping: Orders must be marked as "Ready to Ship" within 48 hours. Excessive delays lower your store rating.</p>
                <p className="mb-4">4. Payouts: Aviore holds a 10% commission on Standard plans. Settlements occur after delivery confirmation.</p>
                <p>5. Conduct: Professional communication is mandatory. Harassment of customers will not be tolerated.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${agreed ? 'bg-orange-600 border-orange-600' : 'border-white/20 group-hover:border-white/40'}`}>
                  <input type="checkbox" className="hidden" onChange={(e) => setAgreed(e.target.checked)} />
                  {agreed && <Check size={16} />}
                </div>
                <span className="text-sm text-slate-300 select-none">I have read, understood, and agree to the Aviore Merchant Terms.</span>
              </label>
            </div>

            <button 
              disabled={!agreed}
              onClick={() => router.push('/register-vendor')}
              className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${agreed ? 'bg-white text-black hover:scale-[1.02] shadow-xl' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              Continue to Registration <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function BenefitItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
        <Check size={12} className="text-orange-600" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function PriceCard({ tier, mainValue, subText, desc, features, featured = false, disabled = false }: PriceCardProps) {
  return (
    <div className={`h-full p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${
      featured 
        ? 'bg-white border-orange-500 shadow-[0_25px_60px_rgba(249,115,22,0.15)] scale-105 z-10' 
        : 'bg-slate-50 border-slate-200 shadow-sm'
    }`}>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h3 className={`text-xl font-bold ${disabled ? 'text-slate-500' : 'text-slate-900'}`}>{tier}</h3>
          {featured && <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase">Most Popular</span>}
        </div>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {desc}
        </p>
      </div>
      
      <div className="mb-10">
        <div className="flex items-baseline gap-1">
          <span className={`text-6xl font-black tracking-tighter ${disabled ? 'text-slate-400' : 'text-orange-600'}`}>
            {mainValue}
          </span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
          {subText}
        </p>
      </div>

      <ul className="space-y-4 flex-grow">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
            <div className={`p-1 rounded-full shrink-0 ${disabled ? 'bg-slate-200' : 'bg-green-100'}`}>
              <Check size={14} className={disabled ? 'text-slate-400' : 'text-green-600'} />
            </div>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}