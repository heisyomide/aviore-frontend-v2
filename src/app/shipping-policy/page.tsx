import Link from 'next/link';

export default function ShippingPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] antialiased selection:bg-[#A4143D]/10">
      {/* HERO SECTION */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center md:py-24">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A4143D] block mb-3">
            Legal & Operations
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-zinc-900 mb-4">
            Shipping & Fulfillment Policy
          </h1>
          <p className="text-sm font-mono text-zinc-400">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* QUICK SUMMARY SIDEBAR */}
          <aside className="md:col-span-1 space-y-6 md:sticky md:top-8 h-fit">
            <div className="border-l-2 border-[#A4143D] pl-4 py-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Fulfillment Engine</h4>
              <p className="text-sm font-medium text-zinc-800">Multi-Vendor Verified</p>
            </div>
            <div className="border-l-2 border-[#A4143D] pl-4 py-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Standard Processing</h4>
              <p className="text-sm font-medium text-zinc-800">1–3 Business Days</p>
            </div>
            <div className="border-l-2 border-[#A4143D] pl-4 py-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Primary Network</h4>
              <p className="text-sm font-medium text-zinc-800">Nigeria Nationwide</p>
            </div>
          </aside>

          {/* POLICY BODY */}
          <div className="md:col-span-3 space-y-16 text-[15px] leading-8 text-zinc-600 font-light">
            
            {/* 1. OVERVIEW */}
            <section className="scroll-mt-6">
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                1. Overview
              </h2>
              <p>
                AVIORÈ operates as a premium multi-vendor logistics ecosystem, connecting discerning 
                clientele with independent merchants across Nigeria. Each item discovered on the 
                platform is directly curated, packaged, and dispatched by third-party verified 
                vendors under strict operational guidelines to guarantee authentic product arrival.
              </p>
            </section>

            {/* 2. ORDER PROCESSING TIMELINE */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                2. Order Processing Pipeline
              </h2>
              <p className="mb-6">
                Upon checkout authorization, your transaction initializes order sequences instantly inside vendor storefront systems:
              </p>
              
              {/* VISUAL TIMELINE COMPONENT */}
              <div className="relative border-l border-zinc-200 pl-6 ml-2 space-y-8 my-8">
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 bg-[#A4143D] w-2.5 h-2.5 rounded-full ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-zinc-900">Step 1: Payment Verification</h4>
                  <p className="text-sm text-zinc-500 leading-6">Immediate secure clearance via centralized checkout infrastructure.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 bg-zinc-300 w-2.5 h-2.5 rounded-full ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-zinc-900">Step 2: Merchant Assembly (1–3 Business Days)</h4>
                  <p className="text-sm text-zinc-500 leading-6">Vendors verify quality alignment, package with care, and transfer assets to our freight networks.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 bg-zinc-300 w-2.5 h-2.5 rounded-full ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-zinc-900">Step 3: Transit Dispatch</h4>
                  <p className="text-sm text-zinc-500 leading-6">Live telemetry and package monitoring tracking tokens link to your digital registry profile.</p>
                </div>
              </div>
            </section>

            {/* 3. TIMELINES */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                3. Delivery Timelines
              </h2>
              <p className="mb-6">
                Actual delivery times depend entirely on merchant proximity and target drop-off destinations. 
                Below is our current standardized shipping estimation frame:
              </p>

              <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 font-medium text-zinc-700">
                      <th className="p-4 pl-6">Region Tier</th>
                      <th className="p-4 pr-6 text-right">Estimated Transit Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-600">
                    <tr>
                      <td className="p-4 pl-6 font-medium text-zinc-900">Intra-Lagos Logistics</td>
                      <td className="p-4 pr-6 text-right font-mono text-xs text-zinc-500">1 – 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-4 pl-6 font-medium text-zinc-900">Regional Major Hubs <span className="text-xs text-zinc-400 font-normal">(Abuja, PH, Ibadan, etc.)</span></td>
                      <td className="p-4 pr-6 text-right font-mono text-xs text-zinc-500">2 – 7 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-4 pl-6 font-medium text-zinc-900">Other Nationwide Locations</td>
                      <td className="p-4 pr-6 text-right font-mono text-xs text-zinc-500">3 – 10 Business Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. FEES & ASSIGNMENTS */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                4. Shipping Fees & Dynamic Calculation
              </h2>
              <p>
                Shipping costs are dynamically calculated during the checkout cycle. Fees are dictated by individual merchant 
                origin points, targeted recipient coordinates, physical package volumes, volumetric weight profiles, 
                and specific freight tier demands.
              </p>
            </section>

            {/* 5. ACCOUNTABILITY AND MANAGEMENT */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                5. Distribution Accountability
              </h2>
              <p>
                The independent merchant maintains complete legal title and packaging custody over components until handoff validation occurs at 3PL carrier centers. AVIORÈ serves as a luxury structural platform facilitating transaction transparency, buyer support services, and unified escrow verification, but does not claim factory manufacturing liabilities.
              </p>
            </section>

            {/* 6. FAILED COURIER ATTEMPTS */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                6. Failed Delivery Parameters
              </h2>
              <p>
                Our selected courier handlers make up to three contact dispatch attempts to fulfill drop-off objectives. 
                If deliveries fail continuously due to erroneous contact credentials, incorrect drop-off directions, or unreached receiver status, products revert to vendor warehouse locations. The client will handle additional re-routing logistics overhead costs generated by subsequent delivery requests.
              </p>
            </section>

            {/* 7. RECOGNIZED TRANSLATION DELAYS */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                7. Force Majeure & Exceptions
              </h2>
              <p className="mb-4">
                Fulfillment estimates may experience minor disruptions during specific external events:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-zinc-500 list-inside list-disc pl-2">
                <li>Adverse severe weather systems</li>
                <li>Statutory public & federal holidays</li>
                <li>Localized regional security shifts</li>
                <li>Fuel or 3PL partner supply chain breaks</li>
                <li>Exceptional holiday order spikes</li>
              </ul>
            </section>

            {/* 8. INTERNATIONAL CONTEXTS */}
            <section>
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                8. Cross-Border Shipments
              </h2>
              <p>
                International delivery routes rely entirely on vendor global configuration permissions and regional transport clearance limits. Any cross-border import tasks, custom handling tariffs, taxes, or local administrative clearance duties fall under the sole direct coverage responsibilities of the receiving buyer.
              </p>
            </section>

            {/* 9. REVERSALS & POLICIES */}
            <section className="border-t border-zinc-200 pt-12">
              <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-4 font-serif">
                9. Protection & Returns
              </h2>
              <p className="mb-6">
                All transit damage challenges, order omissions, or product variances are directly protected under our active global refund systems.
              </p>
              <Link
                href="/return-policy"
                className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#A4143D] hover:text-[#801030] transition-colors"
              >
                Review Customer Return Policy 
                <svg className="w-4 h-4 ml-2 transition-transform duration-200 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>

            {/* 10. SUPPORT DESK */}
            <section className="bg-zinc-50 p-6 rounded-lg border border-zinc-200">
              <h3 className="text-base font-semibold text-zinc-900 mb-2">Concierge Support Desk</h3>
              <p className="text-sm text-zinc-500 mb-4">
                If your tracking pipeline flags an issue or you require tailored delivery assistance, please reach out to our team.
              </p>
              <a 
                href="mailto:support@aviore.com" 
                className="text-sm font-mono text-[#A4143D] font-medium hover:underline"
              >
                support@aviore.com
              </a>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}