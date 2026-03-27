'use client';
import { motion, Variants } from 'framer-motion';
import { Breadcrumb } from '../../components/Breadcrumb';
import { FeaturedBrandsSection } from '../../components/FeaturedBrand';
import { Footer } from '../../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Navbar } from '@/src/components/navbar/Navbar';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: 'spring' as const, 
      damping: 15, 
      stiffness: 100 
    },
  },
};

const cardHover = {
  hover: { scale: 1.03, transition: { duration: 0.25 } },
} as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white text-gray-900">
       <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-6">
        <Breadcrumb />
      </div>

      <section className="py-20 md:py-28 text-center border-b border-gray-100/60 bg-white/40 backdrop-blur-sm">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
        >
          Contact <span className="text-[#f26522]">Aviore</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Reach our specialists 24/7 — we're here to help you unlock the full potential of our premium marketplace.
        </motion.p>
      </section>

      <section className="py-20 px-5 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-12 xl:gap-16"
        >
          <motion.div variants={itemVariants} className="space-y-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Our dedicated support team is available around the clock. Choose your preferred channel below.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, title: 'Email Support', value: 'support@aviore.com', href: 'mailto:support@aviore.com' },
                { icon: Phone, title: 'Call Center', value: '+1 (800) 555-0199', href: 'tel:+18005550199' },
                {
                  icon: MapPin,
                  title: 'HQ Office',
                  value: '828 W Valley Blvd, California, USA',
                  href: 'https://maps.google.com/?q=828+W+Valley+Blvd,+California,+USA',
                },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-5 p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:border-[#f26522]/30 transition-all duration-300"
                >
                  <div className="p-4 bg-[#f26522]/10 rounded-xl group-hover:bg-[#f26522]/20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#f26522]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-[#f26522] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.form
            variants={itemVariants}
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/65 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-100/70 shadow-xl shadow-gray-200/40"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:border-[#f26522] focus:ring-2 focus:ring-[#f26522]/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:border-[#f26522] focus:ring-2 focus:ring-[#f26522]/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                How can we help you?
              </label>
              <textarea
                id="message"
                rows={7}
                placeholder="Tell us about your inquiry..."
                required
                className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:border-[#f26522] focus:ring-2 focus:ring-[#f26522]/20 outline-none transition-all resize-none placeholder:text-gray-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-8 w-full flex items-center justify-center gap-3 bg-[#f26522] text-white py-4.5 rounded-xl font-bold text-lg shadow-lg shadow-[#f26522]/30 hover:shadow-[#f26522]/50 hover:bg-orange-600 transition-all duration-300"
            >
              <Send size={20} />
              Send Inquiry
            </motion.button>
          </motion.form>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="h-80 md:h-96 lg:h-120 w-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60"
        >
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium bg-linear-to-br from-gray-50 to-gray-100">
            [ Google Maps / Leaflet / Mapbox Embed Here ]
            <br />
            <small className="mt-4 block">828 W Valley Blvd, California, USA</small>
          </div>
        </motion.div>
      </section>

      <FeaturedBrandsSection />
      <Footer />
    </main>
  );
}