'use client';

import { Section } from '../../components/layout/Section';

export default function PrivacyPage() {
  return (
    <div className="bg-white text-zinc-900">

      {/* HERO */}
      <section className="py-20 text-center max-w-3xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#A4143D] font-bold">
          Legal
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          Privacy Policy
        </h1>

        <p className="text-sm text-zinc-600 mt-4">
          We respect your privacy. This page explains how your data is collected,
          used, and protected when you use Aviorè.
        </p>

        <p className="text-xs text-zinc-400 mt-2">
          Last updated: April 2026
        </p>
      </section>

      {/* GRID CONTENT */}
      <Section className="pb-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">

          {/* CARD */}
          <div className="p-6 border rounded-2xl bg-white">
            <h3 className="font-bold text-lg mb-2">What We Collect</h3>
            <p className="text-sm text-zinc-600">
              We collect basic information like your name, email, phone number,
              delivery details, and transaction history when you use our platform.
            </p>
          </div>

          <div className="p-6 border rounded-2xl bg-white">
            <h3 className="font-bold text-lg mb-2">How We Use It</h3>
            <p className="text-sm text-zinc-600">
              Your data is used to process orders, improve your experience,
              communicate updates, and prevent fraud.
            </p>
          </div>

          <div className="p-6 border rounded-2xl bg-white">
            <h3 className="font-bold text-lg mb-2">Payments</h3>
            <p className="text-sm text-zinc-600">
              Payments are securely handled by third-party providers like Paystack.
              We do not store your card details.
            </p>
          </div>

          <div className="p-6 border rounded-2xl bg-white">
            <h3 className="font-bold text-lg mb-2">Sharing</h3>
            <p className="text-sm text-zinc-600">
              We only share necessary data with vendors, logistics partners,
              and service providers to complete your orders.
            </p>
          </div>

        </div>
      </Section>

      {/* FULL TEXT SECTION */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-8 text-sm text-zinc-700 leading-relaxed">

          <div>
            <h2 className="font-bold text-xl mb-2">Data Security</h2>
            <p>
              We implement strong security measures to protect your data.
              However, no system is completely secure, and we cannot guarantee absolute protection.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-xl mb-2">Cookies</h2>
            <p>
              We use cookies to improve your browsing experience, remember preferences,
              and analyze usage patterns on the platform.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-xl mb-2">Your Rights</h2>
            <p>
              You can request access, correction, or deletion of your data at any time.
              Contact us if you need help managing your information.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-xl mb-2">Third-Party Services</h2>
            <p>
              Some services on Aviorè rely on third-party providers. These services
              operate under their own privacy policies.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-xl mb-2">Updates</h2>
            <p>
              We may update this policy occasionally. Changes will be reflected here.
            </p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold">Questions?</h2>
        <p className="text-sm text-zinc-600 mt-2">
          If you have any concerns about your privacy, reach out to us.
        </p>

        <p className="mt-4 font-semibold">
          support@aviore.com
        </p>
      </section>

    </div>
  );
}