import type { MDXComponents } from 'mdx/types';
import React, { ComponentPropsWithoutRef } from 'react';
import { Callout } from './components/Callout';
import { CodeBlock } from './components/CodeBlock';
import { Tabs, TabItem } from './components/Tabs';
import { Accordion, AccordionItem } from './components/Accordion';
import { InteractiveDiagram } from './components/InteractiveDiagram';
import { Badge } from './components/Badge';
import { Card, Stepper, Step } from './components/Card';
import { Link2 } from 'lucide-react';

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (React.isValidElement(node) && (node.props as { children?: React.ReactNode }).children) {
    return extractText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

const SECTION_NUM_MAP: Record<string, string> = {
  '1': 'why-keploy',
  '2': 'how-it-works',
  '3': 'sample-application',
  '4': 'step-1-environment',
  '5': 'step-2-start-app',
  '6': 'step-3-record',
  '7': 'step-4-inspect-artifacts',
  '8': 'step-5-replay',
  '9': 'scenario-offline-replay',
  '10': 'scenario-regression',
  '11': 'real-world-troubleshooting',
  '12': 'cicd-integration',
  '13': 'summary-key-takeaways',
};

const HEADING_ID_MAP: Record<string, string> = {
  '1-the-modern-go-testing-dilemma': 'why-keploy',
  '2-under-the-hood-how-keploy-operates': 'how-it-works',
  '3-the-sample-application-gin-mongodb-url-shortener': 'sample-application',
  '4-prerequisites-environment-setup': 'step-1-environment',
  '5-step-by-step-setup-building-the-stack': 'step-2-start-app',
  '6-recording-live-api-calls-with-keploy': 'step-3-record',
  '7-inspecting-the-generated-artifacts': 'step-4-inspect-artifacts',
  '8-replay-mode-running-the-test-suite-keploy-test': 'step-5-replay',
  '9-advanced-scenario-1-zero-database-replay': 'scenario-offline-replay',
  '10-advanced-scenario-2-catching-a-real-regression': 'scenario-regression',
  '11-real-world-field-guide-troubleshooting': 'real-world-troubleshooting',
  '12-cicd-integration-github-actions': 'cicd-integration',
  '13-summary-comparison': 'summary-key-takeaways',
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-8 mb-4"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, id, ...props }: ComponentPropsWithoutRef<'h2'>) => {
      const headingText = extractText(children);
      const generatedSlug = slugify(headingText);
      const numMatch = headingText.trim().match(/^(\d+)\./);
      const numMappedId = numMatch ? SECTION_NUM_MAP[numMatch[1]] : undefined;
      const canonicalId = id || numMappedId || HEADING_ID_MAP[generatedSlug] || generatedSlug;

      return (
        <h2
          id={canonicalId}
          className="group relative flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-12 mb-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5 scroll-mt-24"
          {...props}
        >
          {generatedSlug !== canonicalId && <span id={generatedSlug} className="sr-only -top-24 absolute" />}
          {numMappedId && numMappedId !== canonicalId && <span id={numMappedId} className="sr-only -top-24 absolute" />}
          <span>{children}</span>
          <a
            href={`#${canonicalId}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-orange-500"
            aria-label={`Link to section ${headingText}`}
          >
            <Link2 className="h-4 w-4" />
          </a>
        </h2>
      );
    },
    h3: ({ children, id, ...props }: ComponentPropsWithoutRef<'h3'>) => {
      const headingText = typeof children === 'string' ? children : String(children);
      const headingId = id || slugify(headingText);
      return (
        <h3
          id={headingId}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-8 mb-3"
          {...props}
        >
          {children}
        </h3>
      );
    },
    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 my-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-outside pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-300 my-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 text-sm text-slate-600 dark:text-slate-300 my-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className="my-5 border-l-4 border-orange-500 pl-4 py-1 italic text-slate-700 dark:text-slate-300 bg-orange-50/20 dark:bg-orange-950/10 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<'thead'>) => (
      <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: ComponentPropsWithoutRef<'tbody'>) => (
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0c121e]" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<'tr'>) => (
      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
      <th className="px-4 py-3 text-left font-semibold text-slate-800 dark:text-slate-200" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]" {...props}>
        {children}
      </td>
    ),
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
      // Check if inside pre or inline code
      return (
        <code
          className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 font-mono text-[12px] text-orange-600 dark:text-orange-400 border border-slate-200/80 dark:border-slate-700/80"
          {...props}
        >
          {children}
        </code>
      );
    },
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-medium text-orange-600 dark:text-orange-400 underline decoration-orange-500/30 underline-offset-2 hover:decoration-orange-500 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    },
    // Custom MDX Components
    Callout,
    CodeBlock,
    Tabs,
    TabItem,
    Accordion,
    AccordionItem,
    InteractiveDiagram,
    Badge,
    Card,
    Stepper,
    Step,
  };
}
