'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
// Ensure these are imported correctly from your data file
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from "../../data/categories"

export function CategoryMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<MegaMainCategory>(MEGA_MENU_DATA[0])

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 font-semibold text-sm hover:text-orange-600 py-4">
        Categories
        <ChevronDown size={14} className="group-hover:rotate-180 transition" />
      </button>

      <div className="absolute left-0 top-full hidden group-hover:flex w-225 bg-white border shadow-xl rounded-xl overflow-hidden z-50">
        
        {/* LEFT SIDEBAR */}
        <div className="w-55 bg-gray-50 border-r">
          {MEGA_MENU_DATA.map((cat: MegaMainCategory) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors
                ${activeCategory.id === cat.id ? "bg-white text-orange-600 shadow-sm" : "hover:bg-gray-100"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-6 max-h-125 overflow-y-auto">
          <div className="grid grid-cols-3 gap-8">
            {activeCategory.children.map((sub: MegaSubCategory) => (
              <div key={sub.slug} className="flex flex-col gap-3">
                <h4 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
                  {sub.name}
                </h4>
                
                <div className="flex flex-col gap-2">
                  {sub.items.map((item: string | MegaMenuItem, idx: number) => {
                    const isObject = typeof item !== 'string';
                    const name = isObject ? (item as MegaMenuItem).name : (item as string);
                    const slug = isObject ? (item as MegaMenuItem).slug : name.toLowerCase().replace(/ /g, '-');
                    const img = isObject ? (item as MegaMenuItem).img : null;

                    return (
                      <Link
                        key={idx}
                        href={`/category/${activeCategory.id}/${sub.slug}/${slug}`}
                        className="flex items-center gap-2 group/item"
                      >
                        {img && (
                          <div className="w-8 h-8 relative rounded bg-gray-100 overflow-hidden">
                            <Image src={img} alt={name} fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-xs text-slate-500 group-hover/item:text-orange-600 transition-colors">
                          {name}
                          {isObject && (item as MegaMenuItem).hot && (
                            <span className="ml-1 text-[8px] font-black text-red-500 underline">HOT</span>
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}