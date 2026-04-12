'use client';

import Link from 'next/link';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Error code */}
        <p className="text-[120px] md:text-[180px] font-black italic tracking-tighter text-gray-100 leading-none">
          404
        </p>

        {/* Main message */}
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111] -mt-6">
          Page Not Found
        </h1>

        <p className="mt-4 text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          The page you’re looking for may have been moved, deleted,
          or the link might be incorrect.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#111] text-white px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wide hover:scale-[1.02] transition-all"
          >
            <Home size={16} />
            Go Home
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-all"
          >
            <Search size={16} />
            Explore Products
          </Link>
        </div>

        {/* small back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-gray-400 hover:text-[#A4143D] text-sm font-semibold transition-all"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
      </div>
    </main>
  );
}