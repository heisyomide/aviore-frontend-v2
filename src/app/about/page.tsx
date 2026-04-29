'use client';

import Image from 'next/image';
import { Section } from '../../components/layout/Section';

export default function AboutPage() {
  return (
    <div className="bg-white text-zinc-900">

      {/* HERO */}
      <section className="relative h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?q=80&w=2070"
          alt="Aviorè Fashion"
          fill
          className="object-cover scale-105 opacity-30"
        />

        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A4143D] font-bold">
            Our Story
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Built for the <br />
            <span className="text-[#A4143D]">Next Generation</span> <br />
            of African Commerce
          </h1>

          <p className="mt-5 text-sm md:text-base text-zinc-600 max-w-xl mx-auto">
            Aviorè is more than a marketplace. It’s where modern African vendors
            meet real buyers  with trust, speed, and style at the center.
          </p>
        </div>
      </section>

      {/* STORY (Split Layout) */}
      <Section className="py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-6">

          {/* TEXT */}
          <div className="space-y-5">
            <h2 className="text-3xl font-bold">
              It Started With a Problem
            </h2>

            <p className="text-zinc-600 text-sm leading-relaxed">
              Online shopping wasn’t working the way it should.
              Fake listings. Low trust. Vendors struggling to be seen.
              Buyers unsure of what they’d receive.
            </p>

            <p className="text-zinc-600 text-sm leading-relaxed">
              So we built Aviorè  a platform where quality stands out,
              vendors grow faster, and customers shop with confidence.
            </p>

            <p className="text-sm font-semibold text-[#A4143D]">
              Not just another marketplace  a better one.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070"
              alt="Marketplace"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </Section>

      {/* STATS / TRUST */}
      <Section className="py-14 bg-zinc-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-6">

          <div>
            <h3 className="text-2xl font-bold text-[#A4143D]">100+</h3>
            <p className="text-xs text-zinc-500">Products Listed</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#A4143D]">Fast</h3>
            <p className="text-xs text-zinc-500">Vendor Response</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#A4143D]">Secure</h3>
            <p className="text-xs text-zinc-500">Transactions</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#A4143D]">Trusted</h3>
            <p className="text-xs text-zinc-500">Marketplace</p>
          </div>

        </div>
      </Section>

      {/* MISSION + VISION */}
      <Section className="py-20">
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">

          <div className="p-8 rounded-2xl border bg-white hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-3">Our Mission</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Empower African vendors with visibility, tools, and access
              to real buyers while delivering quality products to customers.
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-white hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-3">Our Vision</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              To become Africa’s most trusted digital marketplace
              where commerce meets culture, speed, and innovation.
            </p>
          </div>

        </div>
      </Section>

      {/* DIFFERENCE */}
      <Section className="py-16 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Why Aviorè Stands Out
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-6 bg-white rounded-xl border hover:shadow-md transition">
              <h4 className="font-semibold mb-2">Curated Vendors</h4>
              <p className="text-xs text-zinc-600">
                Only serious sellers. No spam. No low-quality listings.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border hover:shadow-md transition">
              <h4 className="font-semibold mb-2">Real Value</h4>
              <p className="text-xs text-zinc-600">
                Transparent pricing and products that match expectations.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border hover:shadow-md transition">
              <h4 className="font-semibold mb-2">Built for Speed</h4>
              <p className="text-xs text-zinc-600">
                Fast browsing, quick responses, and smooth checkout experience.
              </p>
            </div>

          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="py-20 bg-[#A4143D] text-white text-center">
        <h2 className="text-3xl font-bold">
          Join the Future of Shopping
        </h2>

        <p className="text-sm mt-3 opacity-80 max-w-md mx-auto">
          Whether you're buying or selling, Aviorè is built for speed,
          trust, and modern commerce.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <a
            href="/shop"
            className="bg-white text-[#A4143D] px-6 py-3 rounded-md text-sm font-semibold"
          >
            Start Shopping
          </a>

          <a
            href="/become-a-vendor"
            className="border border-white px-6 py-3 rounded-md text-sm font-semibold"
          >
            Become a Vendor
          </a>
        </div>
      </section>

    </div>
  );
}