'use client';

interface CompletionProgressProps {
  percentage: number;
}

export function CompletionProgress({ percentage }: CompletionProgressProps) {
  // Ensure bounds
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400">
        <span>Progress</span>
        <span className="text-slate-900 font-mono text-sm">{clampedPercentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div 
          className="h-full bg-[#A4143D] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}