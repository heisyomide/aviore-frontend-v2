import { DiscoveryFeed } from '../../../components/product/DiscoveryFeed';

export default function ImportedPage() {
  return (
    <DiscoveryFeed 
      title="IMPORTED DEALS"
      subtitle="Global trends sourced from overseas international logistical nodes"
      endpointParams="origin=INTERNATIONAL"
    />
  );
}