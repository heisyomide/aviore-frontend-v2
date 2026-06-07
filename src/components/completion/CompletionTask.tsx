'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CompletionTask as TaskType } from '@/src/types/completion.types';

interface CompletionTaskProps {
  task: TaskType;
  onCloseSidebar?: () => void; // Optional hook for mobile view drawers
}

export function CompletionTask({ task, onCloseSidebar }: CompletionTaskProps) {
  const router = useRouter();
  const isMilestone = task.progress !== undefined && task.target !== undefined;

  const handleAction = () => {
    if (onCloseSidebar) onCloseSidebar();
    router.push(task.route);
  };

  return (
    <div className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4
      ${task.completed 
        ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900' 
        : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          )}
        </div>
        
        <div className="space-y-0.5">
          <h5 className={`text-xs font-black uppercase tracking-wide ${task.completed ? 'text-emerald-800 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h5>
          {task.description && (
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {task.description}
            </p>
          )}
          
          {/* Milestone text rendering */}
          {!task.completed && isMilestone && (
            <span className="inline-block text-[10px] font-mono font-black px-2 py-0.5 bg-slate-100 rounded text-slate-600 mt-1">
              {task.progress} / {task.target} Completed
            </span>
          )}
        </div>
      </div>

      {!task.completed && (
        <button
          onClick={handleAction}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer self-end sm:self-center shrink-0"
        >
          Complete Now
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}