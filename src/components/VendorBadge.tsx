import { BadgeCheck } from 'lucide-react';

interface VendorBadgeProps {
  isVerified: boolean;
  size?: number;
  className?: string;
}

export const VendorBadge = ({ isVerified, size = 18, className = "" }: VendorBadgeProps) => {
  if (!isVerified) return null;

  return (
    <BadgeCheck 
      size={size} 
      className={`text-blue-500 fill-blue-500/10 inline-block mb-1 ${className}`} 
      style={{ verticalAlign: 'middle' }}
    />
  );
};