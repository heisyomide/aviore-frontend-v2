export const ProductMeta = ({ deliveryText }: any) => {
  return (
    <div className="flex gap-6 text-sm text-zinc-500">
      <span>🚚 {deliveryText}</span>
      <span>🔒 Secure payment</span>
      <span>↩️ Easy returns</span>
    </div>
  );
};