'use client';

import { useState } from 'react';
import { Container } from '../../components/layout/Container'; // Adjust path based on project setup
import { ChevronDown, ChevronUp, CheckCircle2, MessageSquare, ArrowRight, Play, Users, DollarSign, Award, Target } from 'lucide-react';

export default function MarketingTeamPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pre-configured manager routing information
  const WHATSAPP_NUMBER = '+2348024831799'; // Replace with the actual manager number format
  const PRE_FILLED_TEXT = encodeURIComponent(
    "Hello Marketing Manager,\n\nI am interested in joining the Aviorè IO Marketing Team as a sales partner. Please provide me with the onboarding application details and training materials to get started today."
  );
  
  const whatsappRedirectUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_TEXT}`;

  const implementationSteps = [
    { num: '01', title: 'Sign Up', desc: 'Connect with our team to create your official marketing identifier link.' },
    { num: '02', title: 'Get Trained', desc: 'Access exclusive materials covering product knowledge, conversion funnels, and tracking metrics.' },
    { num: '03', title: 'Start Selling', desc: 'Promote curated catalog drops online through your channels or offline networks.' },
    { num: '04', title: 'Earn Commissions', desc: 'Receive high-tier payout payouts processed twice every month directly to your bank account.' },
  ];

  const commissionsData = [
    { level: 'Bronze Associate', sales: '1 - 10 Orders', rate: '2.5% Commission Base', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { level: 'Silver Growth', sales: '11 - 50 Orders', rate: '4.5% Commission Base', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { level: 'Gold Elite', sales: '51+ Orders', rate: '7.5% Commission Base', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  ];

  const faqs = [
    { q: "How do I make money online with the Aviorè IO team?", a: "You make money by sharing tracking links for products available on the Aviorè marketplace. Whenever a buyer completes an order using your direct recommendation, a percentage commission is captured and attributed to your profile." },
    { q: "Do I need to purchase products or hold stock inventory?", a: "No. This program is completely risk-free. Aviorè handles warehousing, package assembly, payment collection via escrow gateways, and delivery fleets. Your sole objective is network distribution and promotion." },
    { q: "What is Activation and how do I receive my payouts?", a: "Activation occurs once you connect with the manager and complete your introductory training session. Earnings are calculated dynamically and distributed twice monthly on standard payroll dates." }
  ];

  return (
    <main className="bg-[#F8F9FA] min-h-screen text-zinc-900 pb-20 selection:bg-[#A4143D]/10">
      
      {/* SECTION 1: CONVERSION HERO BANNER HERO */}
      <section className="bg-white border-b border-zinc-200 py-12 md:py-20">
        <Container>
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-[#A4143D]/10 text-[#A4143D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Users size={12} /> Aviorè IO Growth Hub
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
                Make Money Online by Joining <span className="text-[#A4143D]">Aviorè IO Marketing Team</span> as a Sales Consultant
              </h1>
              <p className="text-zinc-600 text-sm md:text-base max-w-xl leading-relaxed">
                Set your own working hours, earn highly competitive commissions, and scale your digital marketing business with a community of successful sales professionals.
              </p>
              
              <div className="pt-2">
                <a 
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#A4143D] hover:bg-[#851031] text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>Join Aviorè IO Team Today</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="md:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[380px] aspect-square rounded-2xl bg-gradient-to-br from-[#A4143D]/5 to-[#092c5c]/5 border border-zinc-200 p-6 flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="absolute right-[-20px] top-[-25px] w-48 h-48 bg-[#A4143D]/5 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#A4143D] text-white flex items-center justify-center font-bold text-xl shadow-md">
                    $
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Verified Payouts</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">Financial Independence</h3>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Leverage our established platform supply chains, premium high-demand catalogs, and global delivery systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2: 4-STEP OPERATIONAL ROADMAP */}
      <section className="py-16">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">How It Works</h2>
            <p className="text-xs md:text-sm text-zinc-500 mt-2">Four simple steps to transform your social network traffic into regular income.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {implementationSteps.map((step, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-5 relative shadow-2xs group hover:border-zinc-300 transition-colors">
                <span className="absolute top-4 right-4 text-3xl font-black text-zinc-100 group-hover:text-[#A4143D]/10 transition-colors select-none">
                  {step.num}
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 text-[#A4143D]">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="font-bold text-base text-zinc-900">{step.title}</h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 3: TIERED COMMISSION PERFORMANCE MATRIX */}
      <section className="py-6">
        <Container>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">Performance Tier Matrices</h2>
              <p className="text-xs text-zinc-500 mt-1">Scale your distribution output numbers to trigger larger reward percentages across monthly runs.</p>
            </div>

            <div className="overflow-hidden border border-zinc-200 rounded-xl">
              <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200 text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                <div>Performance Tier</div>
                <div>Target Volumes</div>
                <div className="text-right">Earnings Variable</div>
              </div>
              <div className="divide-y divide-zinc-100 text-xs md:text-sm">
                {commissionsData.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-3 items-center px-4 py-3.5 font-medium text-zinc-700">
                    <div className="font-bold text-zinc-900">{row.level}</div>
                    <div>{row.sales}</div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md border ${row.color}`}>
                        {row.rate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 4: DROPDOWN FAQ MODULE */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xs">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-center mb-6">Frequently Asked Questions</h2>
            <div className="divide-y divide-zinc-200">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-zinc-900 hover:text-[#A4143D] transition-colors py-1 cursor-pointer"
                  >
                    <span className="text-sm md:text-base">{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2.5 text-xs md:text-sm text-zinc-500 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 5: VIDEO TESTIMONIAL & PRIMARY REDIRECT CALL OUT */}
      <section className="py-6">
        <Container>
          <div className="max-w-3xl mx-auto bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="aspect-video bg-zinc-950 relative flex items-center justify-center group">
              {/* Dummy video background frame placeholder simulating Jumia layout */}
              <div className="absolute inset-0 bg-cover bg-center opacity-60 filter grayscale-20 pointer-events-none" style={{ backgroundImage: `url('/banners/store1.png')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              <button 
                onClick={() => window.open(whatsappRedirectUrl, '_blank')}
                className="w-16 h-16 rounded-full bg-[#A4143D] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 z-20 cursor-pointer"
              >
                <Play size={24} className="fill-current ml-1" />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded font-bold">Success Profile</span>
                <p className="text-sm md:text-lg font-bold mt-2 leading-snug">
                  "Aviorè IO provided the logistics backend infrastructure that allowed me to scale up my monthly distribution networks safely."
                </p>
                <span className="block text-xs text-zinc-300 mt-1 font-semibold">— Verified Marketing Associate</span>
              </div>
            </div>

            <div className="p-6 text-center bg-zinc-50 border-t border-zinc-200 space-y-4">
              <h3 className="text-base font-black text-zinc-900">Ready to start earning with Aviorè Team IO?</h3>
              <a 
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#A4143D] hover:bg-[#851031] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
              >
                <MessageSquare size={16} />
                <span>Connect with Marketing Manager via WhatsApp</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

    </main>
  );
}