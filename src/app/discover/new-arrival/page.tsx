import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function NewArrivalsPage() {
  return (
    <DiscoveryFeed 
      title="NEW ARRIVALS"
      subtitle="Fresh curated styles uploaded directly to the storefront today"
      endpointParams="sort=newest"
    />
  );
}