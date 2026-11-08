'use client';
import { useEffect, useRef } from 'react';
import { useApp } from '@/store/app';
import { LoadingSkeleton } from './LoadingSkeleton';
import { AnalysisResultCard } from './AnalysisResultCard';
import { MindshareResultCard } from './MindshareResultCard';
import { ReportResultCard } from './ReportResultCard';
import { ErrorCard } from './ResultParts';
import type { CommandName, ErrorResult } from '@/types';

function retryFor(r: ErrorResult, run: (c: CommandName, q: string) => Promise<void>) {
  const { retryable, command, query } = r;
  return retryable && command && query ? () => run(command as CommandName, query) : undefined;
}

export function ChatResultBox() {
  const { messages, run } = useApp();
  const end = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-5" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        
        {/* The instruction box has been completely removed from here. 
            When messages.length === 0, this simply renders nothing, 
            allowing the Big Logo in WelcomeScreen to show. */}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="self-end rounded-2xl rounded-br-sm bg-nexo-blue/20 px-4 py-2 font-mono text-sm">{m.text}</div>
          ) : m.pending ? (
            <div key={m.id} className="glass p-4"><LoadingSkeleton lines={5} /></div>
          ) : m.result?.kind === 'analyse' ? (
            <AnalysisResultCard key={m.id} r={m.result} />
          ) : m.result?.kind === 'mindshare' ? (
            <MindshareResultCard key={m.id} r={m.result} />
          ) : m.result?.kind === 'report' ? (
            <ReportResultCard key={m.id} r={m.result} />
          ) : m.result?.kind === 'error' ? (
            <ErrorCard key={m.id} r={m.result} onRetry={retryFor(m.result, run)} />
          ) : null,
        )}
        <div ref={end} />
      </div>
    </main>
  );
}
