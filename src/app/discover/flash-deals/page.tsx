// src/app/discovery/flash-deals/page.tsx
import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function FlashDealsPage() {
  return (
    <DiscoveryFeed 
      title="FLASH DEALS"
      subtitle="High-velocity premium liquidation events. Expiring strictly on schedule."
      endpointParams="isFlashDeal=true" // 👈 Matches your query controller logic
    />
  );
}