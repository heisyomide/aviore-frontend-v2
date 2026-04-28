'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Section } from '../layout/Section';

interface BreakoutItem {
  image: string;
  tag: string;
  heading: string;
  subtext: string;
  link: string;
  discount?: string;
}

export function BreakoutBannerGrid({ items }: { items: BreakoutItem[] }) {
  return (
    <Section className="py-2">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {items.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className="min-w-[280px] sm:min-w-[400px] h-[160px] flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition relative"
          >
            {/* Image */}
            <div className="absolute right-0 top-0 h-full w-1/2">
              <Image
                src={item.image}
                alt={item.heading}
                fill
                className="object-contain p-3"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 flex flex-col justify-between h-full w-[60%]">
              <div>
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                  {item.tag}
                </p>

                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {item.heading}{' '}
                  {item.discount && (
                    <span className="text-red-500">{item.discount}</span>
                  )}
                </h3>

                <p className="text-[10px] text-gray-500 mt-1">
                  {item.subtext}
                </p>
              </div>

              <span className="inline-block text-[10px] font-semibold text-white bg-[#A4143D] px-2 py-1 rounded-md w-fit">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}