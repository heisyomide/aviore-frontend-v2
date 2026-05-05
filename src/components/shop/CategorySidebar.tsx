'use client';

import { useEffect, useState } from "react";
import { SlidersHorizontal, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { api } from "@/src/lib/axios";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[]; // To handle nested levels
}

interface NavItemProps {
  category: Category;
  activeCategory: string;
  onSelect: (slug: string) => void;
  level?: number;
}

/**
 * RECURSIVE NAV ITEM
 * Handles the display of categories and their nested children
 */
function NavItem({ category, activeCategory, onSelect, level = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isActive = activeCategory === (category.slug || category.id);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => {
          onSelect(category.slug || category.id);
          if (hasChildren) setIsOpen(!isOpen);
        }}
        style={{ paddingLeft: `${(level * 12) + 16}px` }}
        className={`group flex items-center justify-between py-2.5 pr-4 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest ${
          isActive
            ? "bg-[#FBE9E3] text-[#A4143D]"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <span className="truncate">{category.name}</span>
        <div className="flex items-center">
          {hasChildren ? (
            isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : (
            <ChevronRight 
              size={12} 
              className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
            />
          )}
        </div>
      </button>

      {/* RENDER CHILDREN RECURSIVELY */}
      {hasChildren && isOpen && (
        <div className="flex flex-col mt-1 gap-1">
          {category.children?.map((child) => (
            <NavItem
              key={child.id}
              category={child}
              activeCategory={activeCategory}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategorySidebar({ activeCategory, onSelect, onPriceChange }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-10 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 ml-1">
          Category Index
        </h3>
        
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelect("")}
            className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest ${
              activeCategory === ""
                ? "bg-[#FBE9E3] text-[#A4143D]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            All Categories
            <ChevronRight size={12} className={activeCategory === "" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={16} className="animate-spin text-gray-300" />
            </div>
          ) : (
            categories.map((cat) => (
              <NavItem
                key={cat.id}
                category={cat}
                activeCategory={activeCategory}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* PRICE FILTER (Unchanged) */}
      <div className="space-y-6 pt-8 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <SlidersHorizontal size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Price Filter</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">₦</span>
            <input 
              type="number"
              placeholder="MIN" 
              className="w-full bg-gray-50 border border-gray-100 p-3 pl-7 rounded-xl text-[10px] font-bold text-gray-900 outline-none focus:border-[#A4143D]/20 focus:bg-white transition-all"
              onChange={(e) => onPriceChange(e.target.value, undefined)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">₦</span>
            <input 
              type="number"
              placeholder="MAX" 
              className="w-full bg-gray-50 border border-gray-100 p-3 pl-7 rounded-xl text-[10px] font-bold text-gray-900 outline-none focus:border-[#A4143D]/20 focus:bg-white transition-all"
              onChange={(e) => onPriceChange(undefined, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}