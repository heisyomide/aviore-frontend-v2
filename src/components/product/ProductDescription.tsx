'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, ShieldCheck, Truck } from 'lucide-react';

interface ProductDescriptionProps {
  description?: string | null;
  specifications?: Record<string, string> | null;
}

export function ProductDescription({ description, specifications }: ProductDescriptionProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const safeSpecs = useMemo(() => {
    if (specifications && typeof specifications === 'object' && Object.keys(specifications).length > 0) {
      return Object.entries(specifications);
    }
    return [
      ["Material", "Premium Quality"],
      ["Condition", "Brand New"],
      ["Origin", "Authentic"]
    ];
  }, [specifications]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-8 border-t border-zinc-100 pt-8 space-y-2">
      
      {/* 1. COLLAPSIBLE DESCRIPTION SECTION */}
      <div className="pb-4">
        <h3 className="text-[14px] font-bold text-zinc-900 mb-2 uppercase tracking-tight">
          Product Description
        </h3>
        <div className="relative">
          <div className={`
            text-[13px] leading-relaxed text-zinc-600 transition-all duration-300
            ${isDescExpanded ? 'block' : 'line-clamp-3'}
          `}>
            {description || "No description available for this product."}
          </div>
          
          <button 
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-2 text-blue-600 text-[12px] font-bold flex items-center gap-1"
          >
            {isDescExpanded ? 'Show Less' : 'See More'}
            {isDescExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <div className="h-px bg-zinc-50 w-full" />

      {/* 2. SPECIFICATIONS DROPDOWN */}
      <div className="border-b border-zinc-50">
        <button 
          onClick={() => toggleSection('specs')}
          className="w-full py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Package size={18} className="text-zinc-400" />
            <span className="text-[13px] font-bold text-zinc-800">Specifications</span>
          </div>
          {openSection === 'specs' ? <ChevronUp size={18} className="text-zinc-300" /> : <ChevronDown size={18} className="text-zinc-300" />}
        </button>

        {openSection === 'specs' && (
          <div className="pb-4 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-1">
            {safeSpecs.map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 bg-zinc-50/50 px-3 rounded-lg">
                <span className="text-[11px] font-bold uppercase text-zinc-400">{key}</span>
                <span className="text-[12px] font-medium text-zinc-700">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. SHIPPING & RETURNS DROPDOWN */}
      <div className="border-b border-zinc-50">
        <button 
          onClick={() => toggleSection('shipping')}
          className="w-full py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-zinc-400" />
            <span className="text-[13px] font-bold text-zinc-800">Shipping & Returns</span>
          </div>
          {openSection === 'shipping' ? <ChevronUp size={18} className="text-zinc-300" /> : <ChevronDown size={18} className="text-zinc-300" />}
        </button>

        {openSection === 'shipping' && (
          <div className="pb-4 space-y-3 px-3 text-[12px] text-zinc-500 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <p>Standard delivery: 3-5 business days across Lagos & SW.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500">✓</span>
              <p>7-day hassle-free returns for unworn items.</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. AUTHENTICITY / PROTECTION */}
      <div className="border-b border-zinc-50">
        <button 
          onClick={() => toggleSection('protection')}
          className="w-full py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-zinc-400" />
            <span className="text-[13px] font-bold text-zinc-800">Aviorè Buyer Protection</span>
          </div>
          {openSection === 'protection' ? <ChevronUp size={18} className="text-zinc-300" /> : <ChevronDown size={18} className="text-zinc-300" />}
        </button>

        {openSection === 'protection' && (
          <div className="pb-4 px-3 text-[12px] text-zinc-500 animate-in fade-in slide-in-from-top-1">
            <p>Shop with confidence. We guarantee the authenticity of every artifact or your money back.</p>
          </div>
        )}
      </div>
    </div>
  );
}