import Image from 'next/image';

export const VendorInfo = ({
  vendorData,
  product,
  isFollowing,
  handleFollowToggle
}: any) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden">
          {vendorData?.logo && (
            <Image
              src={vendorData.logo}
              alt="logo"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-medium">
            {vendorData?.storeName || product.vendor?.storeName}
          </p>
          <p className="text-xs text-zinc-500">
            Verified seller
          </p>
        </div>
      </div>

      <button
        onClick={handleFollowToggle}
        className="text-sm border px-4 py-2 rounded-lg"
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};