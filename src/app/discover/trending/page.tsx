import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function TrendingPage() {
  return (
    <DiscoveryFeed 
      title="TRENDING NOW"
      subtitle="High-velocity drops calculated by user engagement and ratings"
      endpointParams="sort=trending"
    />
  );
}