'use client';

interface ProductMetaProps {
  deliveryText?: string | null;
}

export function ProductMeta({ deliveryText }: ProductMetaProps) {
  // Guard against missing delivery text
  const safeDelivery = deliveryText || "Standard Delivery Available";

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
      <div className="flex items-center gap-2">
        <span className="text-sm">🚚</span>
        <span>{safeDelivery}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">🔒</span>
        <span>Secure Payment</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">↩️</span>
        <span>Easy Returns</span>
      </div>
    </div>
  );
}