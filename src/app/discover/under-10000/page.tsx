import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function Under10kPage() {
  return (
    <DiscoveryFeed 
      title="UNDER ₦10,000"
      subtitle="Premium value picks within immediate psychological budget limits"
      endpointParams="maxPrice=10000"
    />
  );
}