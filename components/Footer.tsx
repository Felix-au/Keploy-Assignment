import { ExternalLink, Heart, Shield, BookOpen } from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#070b13] py-12 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 font-bold text-white shadow-xs">
                K
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Keploy Go Masterclass
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              An exhaustive, real-world guide to zero-code eBPF test generation and regression testing for Go microservices. Written with verified real runs on Docker Desktop and Linux kernel 6.x.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Key Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://keploy.io/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  Official Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/keploy/keploy"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  Keploy Core GitHub <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/keploy/samples-go"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  Go Sample Projects <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://join.slack.com/t/keploy/shared_invite/zt-2hv2sfl3k-yD57e84q~2f3Mpm7sQ1y5Q"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  Join Slack Community <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/keployio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  Twitter / X @KeployIO <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">
            Crafted for the Keploy DevRel Candidate Evaluation. Grounded entirely in empirical command execution on Linux kernel 6.18 / Docker Desktop.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Built with Next.js 16, React 19 & MDX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
