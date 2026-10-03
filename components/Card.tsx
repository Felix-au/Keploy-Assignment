import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, icon, children, className = '' }: CardProps) {
  return (
    <div
      className={`my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141a] p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
    >
      {(title || icon) && (
        <div className="mb-3 flex items-start gap-3">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h4>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

interface StepProps {
  number: number | string;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      {/* Step line indicator */}
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 last:hidden" />
      {/* Step Circle */}
      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white shadow-xs">
        {number}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Stepper({ children }: { children: ReactNode }) {
  return <div className="my-6 space-y-2">{children}</div>;
}
