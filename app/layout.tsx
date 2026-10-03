import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { ProgressBar } from '../components/ProgressBar';
import { Navbar } from '../components/Navbar';
import { TableOfContents } from '../components/TableOfContents';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Keploy Go Masterclass: Zero-Code eBPF Testing for Gin & MongoDB',
  description:
    'An exhaustive, real-world developer guide to capturing live traffic, virtualizing MongoDB wire-protocol dependencies via eBPF syscalls, and catching regressions with Keploy.',
  keywords: [
    'Keploy',
    'Go',
    'Golang',
    'Gin',
    'MongoDB',
    'eBPF',
    'Integration Testing',
    'Mocking',
    'Regression Testing',
    'API Testing',
    'Docker',
  ],
  authors: [{ name: 'DevRel Candidate', url: 'https://github.com/keploy' }],
  openGraph: {
    title: 'Keploy Go Masterclass: Zero-Code eBPF Testing for Gin & MongoDB',
    description:
      'Grounded in empirical runs: record live HTTP traffic, generate zero-maintenance YAML test sets, and replay with mock isolation.',
    type: 'article',
    url: 'https://keploy-go-masterclass.vercel.app',
    siteName: 'Keploy Developer Documentation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keploy Go Masterclass: Zero-Code eBPF Testing for Gin & MongoDB',
    description:
      'Grounded in empirical runs: record live HTTP traffic, generate zero-maintenance YAML test sets, and replay with mock isolation.',
    creator: '@KeployIO',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#0b0d11] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-orange-500/20 selection:text-orange-600 dark:selection:text-orange-400 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ProgressBar />
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content Area */}
              <main className="lg:col-span-8 xl:col-span-9 min-w-0">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  {children}
                </article>
              </main>

              {/* Sticky Sidebar Table of Contents */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
                <TableOfContents />
              </aside>
            </div>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
