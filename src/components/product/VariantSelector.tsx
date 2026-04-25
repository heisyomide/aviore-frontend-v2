'use client';

interface Variant {
  color: string;
  sizes: string[];
}

interface VariantSelectorProps {
  variants?: Variant[]; // Made optional
  selectedVariant: Variant | null;
  onSelectVariant: (v: Variant) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export function VariantSelector({ 
  variants = [], 
  selectedVariant, 
  onSelectVariant, 
  selectedSize, 
  onSelectSize 
}: VariantSelectorProps) {
  
  // Guard: If there are no variants, don't render anything to avoid UI clutter
  const safeVariants = Array.isArray(variants) ? variants : [];
  if (safeVariants.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Color Selection */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          Color: <span className="text-zinc-900">{selectedVariant?.color || 'Select'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {safeVariants.map((v) => (
            <button
              key={`color-${v.color}`}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={`px-6 py-2.5 rounded-full border-2 text-[12px] font-bold uppercase transition-all active:scale-95 ${
                selectedVariant?.color === v.color
                  ? 'border-black bg-black text-white shadow-lg shadow-black/10'
                  : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {v.color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection - Guard against missing sizes array */}
      {selectedVariant && Array.isArray(selectedVariant.sizes) && selectedVariant.sizes.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Size: <span className="text-zinc-900">{selectedSize || 'Select'}</span>
            </p>
            <button 
              type="button"
              className="text-[10px] font-bold uppercase underline tracking-tighter text-zinc-400 hover:text-black"
            >
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {selectedVariant.sizes.map((size) => (
              <button
                key={`size-${size}`}
                type="button"
                onClick={() => onSelectSize(size)}
                className={`h-14 flex items-center justify-center rounded-2xl border-2 font-bold transition-all active:scale-90 ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-100 hover:border-zinc-300 text-zinc-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}