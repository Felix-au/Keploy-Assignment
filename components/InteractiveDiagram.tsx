'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Disc,
  ArrowRight,
  Database,
  Server,
  Laptop,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Zap,
  Radio,
  Layers,
} from 'lucide-react';

export function InteractiveDiagram() {
  const [mode, setMode] = useState<'record' | 'test'>('record');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [manualPauseUntil, setManualPauseUntil] = useState<number>(0);

  const triggerManualHold = () => {
    setManualPauseUntil(Date.now() + 10000);
  };

  const recordSteps = [
    {
      title: '1. Inbound Ingestion',
      desc: 'Client sends real HTTP request to Gin. Keploy eBPF proxy intercepts kernel socket syscalls and logs transaction.',
      tag: 'eBPF Hook',
      highlight: [0, 1],
    },
    {
      title: '2. Live DB Execution',
      desc: 'Gin performs MongoDB wire-protocol query. Keploy captures binary OP_MSG request and response packets.',
      tag: 'Wire Protocol Mocks',
      highlight: [1, 2, 3],
    },
    {
      title: '3. Noise Filter & Artifacts',
      desc: 'Keploy sanitizes dynamic timestamps (body.ts, Date header) and writes post-url-1.yaml & mocks.yaml.',
      tag: 'YAML Artifacts',
      highlight: [1],
    },
  ];

  const testSteps = [
    {
      title: '1. Replay Request',
      desc: 'Keploy Test Runner reads post-url-1.yaml and fires identical HTTP payload into Gin app.',
      tag: 'Zero-Client Runner',
      highlight: [0, 2],
    },
    {
      title: '2. Virtualized Outbound',
      desc: 'Gin queries MongoDB. Keploy intercepts call at socket layer and returns mocks.yaml. Real DB stays offline!',
      tag: 'Mock Virtualization',
      highlight: [1, 2],
    },
    {
      title: '3. Assertions & Diffing',
      desc: 'Keploy matches HTTP response against expected YAML, ignoring noise. Generates ASCII diff on regression.',
      tag: 'Noise-Tolerant Diff',
      highlight: [0, 1],
    },
  ];

  const currentSteps = mode === 'record' ? recordSteps : testSteps;

  // Base duration is 3000ms (75% of original 4s); on hover it doubles to 6000ms
  const currentInterval = isHovered ? 6000 : 3000;

  useEffect(() => {
    const timer = setInterval(() => {
      // Pause step progression during 10-second manual interaction hold
      if (Date.now() < manualPauseUntil) {
        return;
      }
      setActiveStep((prev) => (prev + 1) % 3);
    }, currentInterval);

    return () => clearInterval(timer);
  }, [currentInterval, manualPauseUntil, mode]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-white to-slate-50 dark:from-[#11141a] dark:to-[#0b0d11] shadow-md"
    >
      {/* Mode Selector Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 p-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Interactive Architecture Flow
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                eBPF Syscall Virtualization
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle between Record and Replay modes to visualize packet flow and mock isolation
            </p>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('record');
                setActiveStep(0);
                triggerManualHold();
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === 'record'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Disc className={`h-3.5 w-3.5 ${mode === 'record' ? 'animate-spin' : ''}`} />
              <span>Record Mode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('test');
                setActiveStep(0);
                triggerManualHold();
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === 'test'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>Replay (Test) Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Mode State Banner */}
      <div
        className={`px-6 py-2.5 flex items-center justify-between text-xs border-b transition-colors ${
          mode === 'record'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {mode === 'record' ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="font-semibold tracking-wide uppercase text-[11px]">
                Live Wire Protocol Capture Active
              </span>
              <span className="hidden md:inline text-slate-500 dark:text-slate-400">
                - Intercepting real inbound HTTP & outbound MongoDB TCP sockets
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-semibold tracking-wide uppercase text-[11px]">
                Offline Replay Simulation Active
              </span>
              <span className="hidden md:inline text-slate-500 dark:text-slate-400">
                - Real MongoDB bypassed; responses served directly from mocks.yaml
              </span>
            </>
          )}
        </div>

        <div className="font-mono text-[11px] font-medium">
          Step {activeStep + 1} of 3: {currentSteps[activeStep].tag}
        </div>
      </div>

      {/* Visual Topology Canvas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch relative">
          {/* Node 0: Client / Keploy Test Runner */}
          <div
            className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
              currentSteps[activeStep].highlight.includes(0)
                ? 'ring-2 ring-blue-500 shadow-md bg-blue-50/40 dark:bg-blue-950/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
            }`}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {mode === 'record' ? <Laptop className="h-6 w-6" /> : <RefreshCw className="h-6 w-6 animate-spin duration-3000" />}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === 'record' ? 'API Consumer' : 'Keploy Runner'}
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {mode === 'record' ? 'curl / Postman / App' : 'keploy test (automated)'}
            </span>
            <span className="mt-1 text-[11px] text-slate-500 font-mono">
              {mode === 'record' ? 'POST /url (Real call)' : 'Replays post-url-1.yaml'}
            </span>

            {/* Traffic indicator */}
            <div className="mt-3 w-full pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {mode === 'record' ? 'Outbound Traffic' : 'Injected Traffic'}
            </div>
          </div>

          {/* Node 1: Keploy eBPF Interception Layer */}
          <div
            className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-300 relative ${
              currentSteps[activeStep].highlight.includes(1)
                ? 'border-orange-500 ring-2 ring-orange-500/50 shadow-md bg-orange-50/50 dark:bg-orange-950/30'
                : 'border-orange-500/50 bg-orange-50/20 dark:bg-orange-950/10'
            }`}
          >
            <div className="absolute -top-2.5 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              eBPF Kernel Layer
            </div>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Keploy Agent
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Kernel Socket Proxy
            </span>
            <span className="mt-1 text-[11px] text-slate-500">
              {mode === 'record' ? 'Passive eBPF hook (syscalls)' : 'Intercepts socket (returns mocks)'}
            </span>

            {/* Mode-specific badge */}
            <div className="mt-3 w-full pt-2 border-t border-orange-200/60 dark:border-orange-900/60 text-[10px] text-orange-700 dark:text-orange-300 font-semibold flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-orange-500" />
              {mode === 'record' ? 'Generates YAML' : 'Zero-Code Virtualizer'}
            </div>
          </div>

          {/* Node 2: Gin Microservice */}
          <div
            className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 ${
              currentSteps[activeStep].highlight.includes(2)
                ? 'ring-2 ring-purple-500 shadow-md bg-purple-50/40 dark:bg-purple-950/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
            }`}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Server className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              System Under Test
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Gin-Mongo App
            </span>
            <span className="mt-1 text-[11px] text-slate-500 font-mono">
              Port 8080 (Unmodified)
            </span>

            {/* Execution indicator */}
            <div className="mt-3 w-full pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1 font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
              Zero Code Changes
            </div>
          </div>

          {/* Node 3: MongoDB / Mock Virtualization */}
          <div
            className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 relative ${
              mode === 'test'
                ? 'border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                : currentSteps[activeStep].highlight.includes(3)
                ? 'border-slate-300 dark:border-slate-700 ring-2 ring-slate-400 bg-slate-50 dark:bg-slate-800/40'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
            }`}
          >
            {mode === 'test' && (
              <div className="absolute -top-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Zero-DB Mode
              </div>
            )}
            <div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                mode === 'test'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Database className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === 'record' ? 'Live Database' : 'Virtual Mocks'}
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {mode === 'record' ? 'MongoDB Container' : 'mocks.yaml (Offline)'}
            </span>
            <span className="mt-1 text-[11px] font-mono text-slate-500">
              {mode === 'record' ? 'Port 27017 Active' : 'DB can be stopped!'}
            </span>

            {/* Status indicator */}
            <div
              className={`mt-3 w-full pt-2 border-t text-[10px] font-semibold flex items-center justify-center gap-1 ${
                mode === 'record'
                  ? 'border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
                  : 'border-emerald-200/60 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {mode === 'record' ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Wire Active
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  No DB Required
                </>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Flow Cards */}
        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentSteps.map((step, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  triggerManualHold();
                }}
                className={`text-left rounded-xl p-3.5 transition-all border cursor-pointer ${
                  activeStep === idx
                    ? mode === 'record'
                      ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500/30 shadow-xs'
                      : 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                      activeStep === idx
                        ? mode === 'record'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {step.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  {step.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Real Metrics Footer */}
        <div className="mt-5 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Empirical Run Telemetry:</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {mode === 'record' ? 'Capture: 4 HTTP calls, 8 MongoDB wire packets' : 'Replay: 4/4 passing, 0 DB instances required'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {mode === 'record' ? 'Noise Sanitized' : 'Zero Flakiness'}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {mode === 'record' ? 'Docker Desktop 29.8' : 'WSL2 Linux 6.18'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
