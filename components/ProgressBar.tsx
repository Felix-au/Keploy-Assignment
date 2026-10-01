'use client';

import * as React from 'react';

export function ProgressBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-slate-200/20 dark:bg-slate-800/20"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 transition-all duration-75 ease-out shadow-sm shadow-orange-500/20"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
