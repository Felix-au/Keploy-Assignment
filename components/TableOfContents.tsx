'use client';

import * as React from 'react';
import { ListCollapse, CheckCircle2, Clock, Terminal, Database, ShieldAlert, Sparkles } from 'lucide-react';

interface TocItem {
  id: string;
  label: string;
  level: number;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'why-keploy', label: '1. The Go Testing Dilemma', level: 2 },
  { id: 'how-it-works', label: '2. Under the Hood: eBPF & Mocks', level: 2 },
  { id: 'sample-application', label: '3. Gin + MongoDB Sample App', level: 2 },
  { id: 'step-1-environment', label: '4. Prerequisites & Setup', level: 2 },
  { id: 'step-2-start-app', label: '5. Building the Stack', level: 2 },
  { id: 'step-3-record', label: '6. Record Live API Calls', level: 2 },
  { id: 'step-4-inspect-artifacts', label: '7. Inspecting YAML Artifacts', level: 2 },
  { id: 'step-5-replay', label: '8. Replay Mode: keploy test', level: 2 },
  { id: 'scenario-offline-replay', label: '9. Zero-Database Replay', level: 2 },
  { id: 'scenario-regression', label: '10. Catching a Real Regression', level: 2 },
  { id: 'real-world-troubleshooting', label: '11. Troubleshooting & Field Guide', level: 2 },
  { id: 'cicd-integration', label: '12. GitHub Actions CI/CD', level: 2 },
  { id: 'summary-key-takeaways', label: '13. Summary & Comparison', level: 2 },
];

export function TableOfContents() {
  const [activeId, setActiveId] = React.useState<string>('why-keploy');

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Quick Meta Widget */}
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Estimated Read
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-200">8 min</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Stack</span>
              <span className="font-semibold text-slate-900 dark:text-white">Go (Gin) + MongoDB</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Keploy Version</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">v3.6.86</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Live Test Suite</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> 4/4 Verified
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-2">
            <ListCollapse className="w-3.5 h-3.5 text-orange-500" />
            Table of Contents
          </h4>
          <nav className="space-y-0.5 text-xs max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {TOC_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleScrollTo(e, item.id)}
                  className={`block py-1.5 px-2.5 rounded-lg transition-all leading-snug ${
                    item.level === 3 ? 'pl-5 text-[11px]' : 'font-medium'
                  } ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-semibold border-l-2 border-orange-500 pl-2'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
