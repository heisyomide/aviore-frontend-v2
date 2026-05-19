import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function FastDeliveryPage() {
  return (
    <DiscoveryFeed 
      title="FAST LOCAL DELIVERY"
      subtitle="Domestic verification items // Dispatched to arrive in 48-72 hours max"
      endpointParams="origin=LOCAL&maxDeliveryDays=3"
    />
  );
}