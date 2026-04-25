'use client';

import Image from 'next/image';

interface VendorInfoProps {
  vendorData?: {
    logo?: string;
    storeName?: string;
  } | null;
  product?: {
    vendor?: {
      storeName?: string;
    };
  } | null;
  isFollowing: boolean;
  handleFollowToggle: () => void;
}

export const VendorInfo = ({
  vendorData,
  product,
  isFollowing,
  handleFollowToggle
}: VendorInfoProps) => {
  
  // Guard against missing names
  const storeName = vendorData?.storeName || product?.vendor?.storeName || 'Official Store';
  const logoUrl = vendorData?.logo || null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
      
      <div className="flex items-center gap-3">
        {/* Added 'relative' so the 'fill' image stays inside this circle */}
        <div className="relative w-10 h-10 rounded-full bg-zinc-100 overflow-hidden border border-zinc-50">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">
              {storeName.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-zinc-900 leading-tight">
            {storeName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600">
            Verified Seller
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleFollowToggle}
        className={`text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all active:scale-95 ${
          isFollowing 
            ? 'bg-zinc-50 text-zinc-500 border-zinc-200' 
            : 'bg-white text-black border-black hover:bg-black hover:text-white'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};