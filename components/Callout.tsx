'use client';

import * as React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = {
    info: {
      icon: Info,
      defaultTitle: 'Note',
      containerClasses:
        'border-blue-200/80 bg-blue-50/70 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200',
      iconClasses: 'text-blue-600 dark:text-blue-400',
      titleClasses: 'text-blue-950 dark:text-blue-100',
    },
    tip: {
      icon: Lightbulb,
      defaultTitle: 'Pro-Tip',
      containerClasses:
        'border-emerald-200/80 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200',
      iconClasses: 'text-emerald-600 dark:text-emerald-400',
      titleClasses: 'text-emerald-950 dark:text-emerald-100',
    },
    warning: {
      icon: AlertTriangle,
      defaultTitle: 'Caution',
      containerClasses:
        'border-amber-200/80 bg-amber-50/70 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200',
      iconClasses: 'text-amber-600 dark:text-amber-400',
      titleClasses: 'text-amber-950 dark:text-amber-100',
    },
    danger: {
      icon: AlertOctagon,
      defaultTitle: 'Important Gotcha',
      containerClasses:
        'border-rose-200/80 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
      iconClasses: 'text-rose-600 dark:text-rose-400',
      titleClasses: 'text-rose-950 dark:text-rose-100',
    },
    success: {
      icon: CheckCircle2,
      defaultTitle: 'Verified Success',
      containerClasses:
        'border-teal-200/80 bg-teal-50/70 text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/30 dark:text-teal-200',
      iconClasses: 'text-teal-600 dark:text-teal-400',
      titleClasses: 'text-teal-950 dark:text-teal-100',
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div
      className={`my-6 rounded-xl border p-4 sm:p-5 shadow-2xs transition-colors ${config.containerClasses}`}
      role="region"
      aria-label={title || config.defaultTitle}
    >
      <div className="flex items-start gap-3.5">
        <div className={`mt-0.5 shrink-0 ${config.iconClasses}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm leading-relaxed space-y-1">
          <p className={`font-semibold tracking-tight text-sm ${config.titleClasses}`}>
            {title || config.defaultTitle}
          </p>
          <div className="text-[13.5px] opacity-95 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:bg-black/5 dark:[&_code]:bg-white/10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
