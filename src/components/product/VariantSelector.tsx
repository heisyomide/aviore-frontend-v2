'use client';

// 🔥 Interface updated to match the Matrix rows
interface ProductVariant {
  id: string;
  color: string;
  size: string; // Singular
  price?: number;
  stock: number;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (v: ProductVariant) => void;
}

export function VariantSelector({ 
  variants = [], 
  selectedVariant, 
  onSelectVariant 
}: VariantSelectorProps) {
  
  if (!variants.length) return null;

  // 1. Extract unique colors and unique sizes available for the current selection
  const uniqueColors = Array.from(new Set(variants.map(v => v.color)));
  
const availableSizesForColor = variants
  .filter(v => v.color === selectedVariant?.color)
  .flatMap(v =>
    v.size.split(',').map(size => ({
      size: size.trim(),
      stock: v.stock || 0,
      variant: v,
    }))
  );

  return (
    <div className="space-y-8">
      {/* --- COLOR SELECTION --- */}
      <div className="space-y-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
          Color: <span className="text-zinc-900">{selectedVariant?.color || 'Select Color'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                // When color changes, pick the first available variant of that color
                const firstAvailable = variants.find(v => v.color === color);
                if (firstAvailable) onSelectVariant(firstAvailable);
              }}
              className={`px-6 py-3 rounded-full border-2 text-[11px] font-black uppercase transition-all active:scale-95 ${
                selectedVariant?.color === color
                  ? 'border-black bg-black text-white shadow-xl shadow-black/10'
                  : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-300'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* --- SIZE SELECTION --- */}
      {selectedVariant?.color && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              Size: <span className="text-zinc-900">{selectedVariant.size}</span>
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {availableSizesForColor.map(({ size, stock, variant }) => {
              const isOutOfStock = stock <= 0;
              const isSelected = selectedVariant.id === variant.id;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onSelectVariant(variant)}
                  className={`h-14 flex flex-col items-center justify-center rounded-2xl border-2 font-black transition-all relative ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : isOutOfStock
                      ? 'border-zinc-50 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                      : 'border-zinc-100 hover:border-zinc-800 text-zinc-900'
                  }`}
                >
                  <span className="text-xs">{size}</span>
                  {isOutOfStock && (
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-zinc-300 -rotate-45" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
