'use client';

import { CompletionTask as TaskType } from '@/src/types/completion.types';
import { CompletionProgress } from './CompletionProgress';
import { CompletionTask } from './CompletionTask';
import { Sparkles } from 'lucide-react';

interface CompletionBannerProps {
  title: string;
  percentage: number;
  tasks: TaskType[];
}

export function CompletionBanner({ title, percentage, tasks }: CompletionBannerProps) {
  const remainingTasks = tasks.filter(t => !t.completed);
  const isFinished = percentage === 100 || remainingTasks.length === 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 overflow-hidden">
      
      {/* HEADER STATE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            {isFinished && <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />}
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {isFinished 
              ? "Your ecosystem profiles match production launch readiness guidelines."
              : `${remainingTasks.length} setup action ${remainingTasks.length === 1 ? 'item' : 'items'} require attention.`
            }
          </p>
        </div>
        
        {/* Dynamic Context Progress Block */}
        <div className="w-full md:w-64">
          <CompletionProgress percentage={percentage} />
        </div>
      </div>

      {/* BODY ENGINE ACTIONS */}
      {isFinished ? (
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-100/50 flex flex-col items-center text-center space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
            🎉 Setup Complete
          </h4>
          <p className="text-xs text-slate-600 font-medium max-w-md">
            Your workspace profile is fully active, visible in queries, and configured to route settlements seamlessly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {remainingTasks.map((task) => (
            <CompletionTask key={task.id} task={task} />
          ))}
        </div>
      )}

    </div>
  );
}