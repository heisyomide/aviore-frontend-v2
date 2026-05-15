'use client';

import { X, Package, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import {
  useState
} from 'react';

import {
  MARKETPLACE_CATEGORIES,
  MarketplaceCategory,
  CategoryGroup,
  CategoryItem
} from '@/src/data/category.data';

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] =
    useState<MarketplaceCategory>(MARKETPLACE_CATEGORIES[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-300 md:hidden">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <div className="absolute top-0 left-0 w-[85%] h-full bg-white shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="bg-slate-900 p-6 text-white pt-12 flex justify-between items-center relative overflow-hidden">

          <span className="text-lg font-black uppercase italic tracking-tighter">
            Categories
          </span>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>

        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT CATEGORY LIST */}
          <div className="w-24 bg-gray-50 border-r overflow-y-auto">

            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat)}
                className={`w-full px-2 py-5 flex flex-col items-center gap-2 transition-all
                  ${activeCategory.slug === cat.slug
                    ? 'bg-white text-[#A4143D]'
                    : 'text-gray-400'
                  }
                `}
              >

                <div className="w-10 h-10 rounded-xl overflow-hidden border">
                  <Image
                    src={cat.banner}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>

                <span className="text-[8px] font-black uppercase text-center">
                  {cat.name}
                </span>

              </button>
            ))}

          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 overflow-y-auto p-5">

            <div className="mb-6 flex justify-between items-center">

              <h3 className="text-[10px] font-black uppercase text-slate-400">
                Explore {activeCategory.name}
              </h3>

              <Link
                href={`/category/${activeCategory.slug}`}
                onClick={onClose}
                className="text-[9px] font-black text-[#A4143D] uppercase underline"
              >
                View All
              </Link>

            </div>

            <div className="space-y-10">

              {activeCategory.children.map((group: CategoryGroup) => (
                <div key={group.slug} className="space-y-4">

                  {/* GROUP TITLE */}
                  <h4 className="text-[12px] font-black uppercase text-slate-900 flex items-center gap-2">

                    <span className="w-4 h-[2px] bg-[#A4143D]" />

                    {group.name}

                  </h4>

                  {/* ITEMS GRID */}
                  <div className="grid grid-cols-2 gap-4">

                    {group.children.map((item: CategoryItem) => (
                      <Link
                        key={item.slug}
                        href={`/category/${activeCategory.slug}/${group.slug}/${item.slug}`}
                        onClick={onClose}
                        className="flex flex-col gap-2 active:scale-95 transition"
                      >

                        <div className="w-full aspect-square bg-slate-50 rounded-2xl border flex items-center justify-center">

                          <Image
                            src="/placeholder.png"
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-contain p-3"
                          />

                        </div>

                        <span className="text-[10px] font-bold text-slate-600">
                          {item.name}
                        </span>

                      </Link>
                    ))}

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-gray-50">

          <div className="grid grid-cols-2 gap-3">

            <Link
              href="/dashboard/orders"
              onClick={onClose}
              className="flex items-center gap-2 p-3 bg-white rounded-xl border text-[10px] font-black uppercase"
            >
              <Package size={16} className="text-[#A4143D]" />
              Orders
            </Link>

            <Link
              href="/dashboard/coupons"
              onClick={onClose}
              className="flex items-center gap-2 p-3 bg-white rounded-xl border text-[10px] font-black uppercase"
            >
              <Ticket size={16} className="text-[#A4143D]" />
              Coupons
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}