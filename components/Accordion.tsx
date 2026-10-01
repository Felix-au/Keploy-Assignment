'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  badge,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-slate-800 dark:text-slate-200 transition-colors hover:text-orange-500 dark:hover:text-orange-400"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="h-4 w-4 text-orange-500 shrink-0" />
          <span>{title}</span>
          {badge && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-normal text-slate-600 dark:text-slate-400">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-5 pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  title?: string;
}

export function Accordion({ children, title }: AccordionProps) {
  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-4 shadow-sm">
      {title && (
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </h4>
      )}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">{children}</div>
    </div>
  );
}
