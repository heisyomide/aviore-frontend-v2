'use client';

export default function CareersPage() {
  return (
    <div className="bg-white text-zinc-900">

      {/* HERO */}
      <section className="py-20 text-center max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold">
          Build the Future of <span className="text-[#A4143D]">African Commerce</span>
        </h1>
        <p className="mt-4 text-sm text-zinc-600">
          Aviorè is growing — and we’re looking for people who want to build something real.
        </p>
      </section>

      {/* REALITY */}
      <section className="py-12 bg-zinc-50 text-center px-6">
        <p className="max-w-2xl mx-auto text-sm text-zinc-600">
          We’re not a big company yet. No fancy offices. No shortcuts.
          Just real work, real growth, and a vision to build something meaningful.
        </p>
      </section>

      {/* WHY JOIN */}
      <section className="py-16 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        
        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">Real Impact</h3>
          <p className="text-xs text-zinc-600">
            Your work directly shapes the product and the future of Aviorè.
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">Fast Growth</h3>
          <p className="text-xs text-zinc-600">
            Learn faster than anywhere else by building in real time.
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">Ownership Mindset</h3>
          <p className="text-xs text-zinc-600">
            We don’t babysit. You take responsibility and grow.
          </p>
        </div>

      </section>

      {/* ROLES */}
      <section className="py-16 bg-zinc-50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Open Opportunities</h2>

          <div className="space-y-4">

            <div className="p-5 border rounded-xl bg-white">
              <h4 className="font-semibold">Frontend Developer</h4>
              <p className="text-xs text-zinc-500">React / Next.js</p>
            </div>

            <div className="p-5 border rounded-xl bg-white">
              <h4 className="font-semibold">Vendor Growth Manager</h4>
              <p className="text-xs text-zinc-500">Onboarding & partnerships</p>
            </div>

            <div className="p-5 border rounded-xl bg-white">
              <h4 className="font-semibold">Social Media Manager</h4>
              <p className="text-xs text-zinc-500">Content & growth</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold">Ready to Build?</h2>
        <p className="text-sm text-zinc-600 mt-2">
          Send a message and tell us what you can do.
        </p>

        <a
          href="https://wa.me/message/DHHCJV5YDRRKD1"
          className="inline-block mt-6 bg-[#A4143D] text-white px-6 py-3 rounded-md text-sm font-semibold"
        >
          Apply via WhatsApp
        </a>
      </section>

    </div>
  );
}