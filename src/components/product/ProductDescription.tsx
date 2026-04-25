'use client';

import { useState, useMemo } from 'react';

interface ProductDescriptionProps {
  description?: string | null;
  specifications?: Record<string, string> | null;
}

export function ProductDescription({ description, specifications }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // 1. Defensively prepare specifications
  const safeSpecs = useMemo(() => {
    if (specifications && typeof specifications === 'object' && Object.keys(specifications).length > 0) {
      return Object.entries(specifications);
    }
    // Default fallback specs if none provided
    return [
      ["Material", "Premium Quality"],
      ["Condition", "Brand New"],
      ["Origin", "Authentic"]
    ];
  }, [specifications]);

  const tabs = [
    { id: 'details', label: 'Product Details' },
    { id: 'specs', label: 'Specifications' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ] as const;

  return (
    <div className="mt-20 border-t border-zinc-100 pt-12">
      {/* Tab Headers */}
      <div className="flex gap-8 border-b border-zinc-100 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative flex-shrink-0 ${
              activeTab === tab.id ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[200px]">
        {activeTab === 'details' && (
          <div className="prose prose-zinc prose-sm">
            <p className="text-zinc-600 leading-relaxed italic text-lg mb-4">
              Elevating the everyday through intentional design.
            </p>
            <p className="text-zinc-500 leading-relaxed whitespace-pre-line">
              {description || "No description available for this product."}
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {safeSpecs.map(([key, val]) => (
              <div key={key} className="flex justify-between py-3 border-b border-zinc-50">
                <span className="text-[10px] font-bold uppercase text-zinc-400">{key}</span>
                <span className="text-[11px] font-medium text-zinc-900">{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 text-zinc-500 text-sm leading-relaxed">
            <p>• Standard shipping: 3-5 business days.</p>
            <p>• Express shipping available at checkout.</p>
            <p>• 7-day hassle-free return policy for unworn items in original packaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}