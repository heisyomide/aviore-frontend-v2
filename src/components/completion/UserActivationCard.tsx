'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { CompletionTask } from '@/src/types/completion.types';

interface UserActivationCardProps {
  percentage: number;
  tasks: CompletionTask[];
  isFullyActive: boolean;
}

export function UserActivationCard({ percentage, tasks, isFullyActive }: UserActivationCardProps) {
  const router = useRouter();
  const uncompletedTasks = tasks.filter((t) => !t.completed);

  // 🎉 SUCCESS STATE: Rendered when the backend reports the user is 100% compliant
  if (isFullyActive) {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-900 to-slate-950 text-white rounded-2xl p-6 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center justify-center md:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
            🎉 Profile Fully Active
          </h3>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Your AVIORÈ identity configurations and destination address protocols match optimal operational guidelines. Your global marketplace node is running at maximum clearance level.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono font-black text-emerald-400 uppercase tracking-widest shrink-0">
          Core Verified
        </div>
      </div>
    );
  }

  // Determine if the highest priority uncompleted task is your custom growth guidance promo item
  const activeTask = uncompletedTasks[0];
  const isGuidancePromo = activeTask?.id === 'first-order-guidance';

  // ⚠️ ATTENTION STATE: Displays the premium dark checklist card
  return (
    <div className="w-full bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden animate-fadeIn">
      
      {/* Cinematic ambient background glow — Tint matches brand maroon */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A4143D]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Account Verification Progress
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Complete your security clearances and profile configuration details to unlock seamless checkouts and automated calculations.
          </p>
        </div>

        {/* PROGRESS TELEMETRY OVERVIEW */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Clearance</span>
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
      {activeTask && (
        <div className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          isGuidancePromo 
            ? 'bg-gradient-to-r from-[#A4143D]/20 via-slate-900/60 to-slate-900/60 border-[#A4143D]/40 hover:border-[#A4143D]/60' 
            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-800'
        }`}>
          <div className="space-y-1">
            <span className={`inline-block text-[9px] font-mono font-black px-2 py-0.5 border uppercase rounded tracking-wider ${
              isGuidancePromo
                ? 'bg-[#A4143D]/20 text-rose-400 border-[#A4143D]/30 flex items-center gap-1 w-fit'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {isGuidancePromo ? (
                <>
                  <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
                  Launch Bonus Unlocked
                </>
              ) : (
                'Attention Required'
              )}
            </span>
            <h4 className="text-xs font-black uppercase tracking-wide text-slate-200 pt-1">
              {activeTask.title}
            </h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-xl">
              {activeTask.description}
            </p>
          </div>

          <button
            onClick={() => router.push(activeTask.route)}
            className={`flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer self-start sm:self-center shrink-0 shadow-sm transition-all active:scale-98 ${
              isGuidancePromo 
                ? 'bg-gradient-to-r from-[#A4143D] to-[#D81B60] hover:from-[#831030] hover:to-[#b1124b] text-white' 
                : 'bg-white text-slate-950 hover:bg-slate-100'
            }`}
          >
            {isGuidancePromo ? 'Claim Active Rewards' : 'Resolve progress'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TASK VOLUME SUMMARY ACCENT */}
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {uncompletedTasks.length} pending operation {uncompletedTasks.length === 1 ? 'item requires execution' : 'items require execution'}
      </div>
    </div>
  );
}