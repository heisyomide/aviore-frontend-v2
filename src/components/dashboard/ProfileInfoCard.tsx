'use client';

interface ProfileInfoCardProps {
  label: string;
  value: string | number; // Updated to handle numbers from backend counts
}

export default function ProfileInfoCard({ label, value }: ProfileInfoCardProps) {
  return (
    <div className="flex justify-between items-center border-b last:border-0 py-4 transition-colors hover:bg-gray-50/50">
      <span className="text-gray-500 text-sm font-medium">{label}</span>
      <span className="font-semibold text-gray-900">
        {value || 'Not set'}
      </span>
    </div>
  );
}