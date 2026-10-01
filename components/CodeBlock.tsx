import React from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from './CopyButton';
import { Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  lang = 'text',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const cleanCode = code.trim();

  let html = '';
  try {
    html = await codeToHtml(cleanCode, {
      lang: lang === 'shell' || lang === 'sh' || lang === 'bash' ? 'bash' : lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch {
    // Fallback if language is unsupported
    html = `<pre><code>${cleanCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</code></pre>`;
  }

  const isTerminal = ['bash', 'sh', 'shell', 'zsh', 'terminal', 'powershell'].includes(
    lang.toLowerCase()
  );

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0b0f19] shadow-sm transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-600 dark:text-slate-400">
          {isTerminal ? (
            <Terminal className="h-3.5 w-3.5 text-orange-500" />
          ) : (
            <FileCode className="h-3.5 w-3.5 text-sky-500" />
          )}
          <span>{filename || (isTerminal ? 'Terminal' : lang.toUpperCase())}</span>
        </div>
        <div className="flex items-center gap-2">
          {lang && (
            <span className="rounded bg-slate-200/70 dark:bg-slate-800/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang}
            </span>
          )}
          <CopyButton text={cleanCode} />
        </div>
      </div>

      {/* Code Container */}
      <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200">
        <div
          className={`[&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 [&_code]:!font-mono ${
            showLineNumbers ? 'code-line-numbers' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
