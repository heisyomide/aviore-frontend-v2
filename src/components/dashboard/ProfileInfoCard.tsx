'use client';

interface ProfileInfoCardProps {
  label: string;
  value: string | number;
}

export default function ProfileInfoCard({ label, value }: ProfileInfoCardProps) {
  return (
    <div className="flex justify-between items-center py-6 px-4 transition-all duration-300 hover:bg-zinc-50/80 group">
      {/* LABEL: Rule 1 (Industrial Tracking) */}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-[#A4143D] transition-colors">
        {label}
      </span>

      {/* VALUE: Rule 2 (High Contrast) */}
      <span className="text-xs font-black text-zinc-900 uppercase tracking-tight italic">
        {value || 'Not_Set'}
      </span>
    </div>
  );
}