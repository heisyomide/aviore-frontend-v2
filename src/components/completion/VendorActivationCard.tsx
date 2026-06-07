'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CompletionTask } from '@/src/types/completion.types';

interface VendorActivationCardProps {
  percentage: number;
  tasks: CompletionTask[];
  isFullyActive: boolean;
}

export function VendorActivationCard({ percentage, tasks, isFullyActive }: VendorActivationCardProps) {
  const router = useRouter();
  const uncompletedTasks = tasks.filter((t) => !t.completed);

  // 🎉 SUCCESS STATE: Rendered when the backend reports the vendor is 100% compliant
  if (isFullyActive) {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-900 to-slate-950 text-white rounded-2xl p-6 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center justify-center md:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
            🎉 Store Fully Active
          </h3>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Your AVIORÈ storefront infrastructure configuration matches operational launch readiness guidelines. You are ready to handle settlements.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono font-black text-emerald-400 uppercase tracking-widest shrink-0">
          Live Ready
        </div>
      </div>
    );
  }

  // ⚠️ ATTENTION STATE: Displays the progress and highlights the highest priority pending setup item
  return (
    <div className="w-full bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      
      {/* Cinematic ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A4143D]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Store Activation Checklist
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Complete your onboarding milestones to activate search queries and clear withdrawal sequences.
          </p>
        </div>

        {/* PROGRESS TELEMETRY OVERVIEW */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Progress</span>
            <span className="text-sm font-mono font-black text-slate-100">{percentage}%</span>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
            <div 
              className="h-full bg-[#A4143D] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* HIGHEST PRIORITY REMAINING TASK ACTION MODULE */}
      {uncompletedTasks.length > 0 && (
        <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-800">
          <div className="space-y-1">
            <span className="inline-block text-[9px] font-mono font-black px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase rounded tracking-wider">
              Attention Required
            </span>
            <h4 className="text-xs font-black uppercase tracking-wide text-slate-200 pt-1">
              {uncompletedTasks[0].title}
            </h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-xl">
              {uncompletedTasks[0].description}
            </p>
          </div>

          <button
            onClick={() => router.push(uncompletedTasks[0].route)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 active:scale-98 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer self-start sm:self-center shrink-0 shadow-sm"
          >
            Fix This Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TASK VOLUME SUMMARY ACCENT */}
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {uncompletedTasks.length} setup action {uncompletedTasks.length === 1 ? 'item remaining' : 'items remaining'} total
      </div>
    </div>
  );
}