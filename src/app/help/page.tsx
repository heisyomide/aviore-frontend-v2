'use client';

import { Section } from '../../components/layout/Section';
import { Search, MessageCircle, Truck, CreditCard, User } from 'lucide-react';

export default function HelpDeskPage() {
  return (
    <div className="bg-white text-zinc-900">

      {/* HERO */}
      <section className="py-20 text-center max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold">How can we help?</h1>
        <p className="text-sm text-zinc-600 mt-3">
          Find answers, track orders, or get support from the Aviorè team.
        </p>

        {/* SEARCH */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full border rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </section>

      {/* QUICK HELP */}
      <Section className="pb-16">
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto px-6">

          <div className="p-5 border rounded-xl hover:shadow transition cursor-pointer">
            <Truck size={18} />
            <h3 className="font-semibold mt-3 text-sm">Orders & Delivery</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Track orders and delivery updates
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow transition cursor-pointer">
            <CreditCard size={18} />
            <h3 className="font-semibold mt-3 text-sm">Payments</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Payment issues and refunds
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow transition cursor-pointer">
            <User size={18} />
            <h3 className="font-semibold mt-3 text-sm">Account</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Login, profile & settings
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow transition cursor-pointer">
            <MessageCircle size={18} />
            <h3 className="font-semibold mt-3 text-sm">Vendor Support</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Selling on Aviorè
            </p>
          </div>

        </div>
      </Section>

      {/* FAQ */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-6">

          <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>

          <div className="space-y-4 mt-6">

            <div className="p-4 border rounded-xl bg-white">
              <h3 className="font-semibold text-sm">How do I track my order?</h3>
              <p className="text-xs text-zinc-600 mt-2">
                After placing an order, you’ll receive updates via your dashboard
                and notifications.
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-white">
              <h3 className="font-semibold text-sm">Can I return a product?</h3>
              <p className="text-xs text-zinc-600 mt-2">
                Returns depend on the vendor. Please check the product page or contact support.
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-white">
              <h3 className="font-semibold text-sm">What if my payment fails?</h3>
              <p className="text-xs text-zinc-600 mt-2">
                Ensure your payment method is valid. If issues persist, contact support.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold">Still need help?</h2>
        <p className="text-sm text-zinc-600 mt-2">
          Our support team is available to assist you.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a
            href="mailto:support@aviore.com"
            className="bg-black text-white px-6 py-2 rounded-md text-sm font-semibold"
          >
            Email Support
          </a>

          <a
            href="https://wa.me/message/DHHCJV5YDRRKD1"
            className="border px-6 py-2 rounded-md text-sm font-semibold"
          >
            WhatsApp Support
          </a>
        </div>
      </section>

    </div>
  );
}