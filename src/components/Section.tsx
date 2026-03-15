// components/Section.tsx
'use client';

import { ReactNode } from 'react';

export default function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 px-6 md:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto text-center">
        {/* Title with gold underline */}
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#1f2937] inline-block relative">
          {title}
          <span className="block w-16 h-[3px] bg-[#bfa76f] mx-auto mt-3 rounded"></span>
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}