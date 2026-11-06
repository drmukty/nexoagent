'use client';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/store/app';
import { LoadingSkeleton } from './LoadingSkeleton';
import { AnalysisResultCard } from './AnalysisResultCard';
import { MindshareResultCard } from './MindshareResultCard';
import { ReportResultCard } from './ReportResultCard';
import { ErrorCard } from './ResultParts';
import type { CommandName, ErrorResult } from '@/types';
import { History, Plus, X } from 'lucide-react';

function retryFor(r: ErrorResult, run: (c: CommandName, q: string) => Promise<void>) {
  const { retryable, command, query } = r;
  return retryable && command && query ? () => run(command as CommandName, query) : undefined;
}

export function ChatResultBox() {
  const { messages, run, setView, setMessages } = useApp();
  const [showHistory, setShowHistory] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => { 
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
  }, [messages]);

  // Extract past user searches for the history drawer
  const pastSearches = messages
    .filter((m) => m.role === 'user' && m.text)
    .map((m) => m.text as string)
    .reverse(); // Newest first

  return (
    <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 relative" aria-live="polite">
      
      {/* Chat History Drawer */}
      {showHistory && (
        <div className="absolute inset-y-0 left-0 z-20 w-72 border-r border-white/10 bg-[#0F1116] shadow-2xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Search History</h3>
            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {pastSearches.length === 0 ? (
            <p className="text-sm text-gray-500">No history yet.</p>
          ) : (
            <ul className="space-y-2">
              {pastSearches.map((search, i) => (
                <li key={i} className="flex items-center justify-between group rounded-lg bg-white/5 px-3 py-2 text-sm font-mono text-gray-300">
                  <span className="truncate">{search}</span>
                  <button 
                    onClick={() => {
                      // Simple clear entire history for now
                      setMessages([]); 
                      setShowHistory(false);
                    }}
                    className="text-gray-500 hover:text-nexo-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {/* Top action bar */}
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setShowHistory(true)} className="tap flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:text-white">
            <History className="h-3.5 w-3.5" /> Recent
          </button>
          <button 
            onClick={() => {
              setView('home');
              setMessages([]);
            }} 
            className="tap flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> New Chat
          </button>
        </div>

        {messages.length === 0 && (
          <div className="glass mt-8 p-5 text-sm text-gray-400">
            <p className="font-display text-base text-gray-200">Pick a command, then paste a contract address or ticker.</p>
            <ul className="mt-3 space-y-1.5">
              <li><span className="font-mono text-nexo-blue">/analyse</span> 15-minute trade signal you can bet on</li>
              <li><span className="font-mono text-nexo-blue">/report</span> full token intel snapshot</li>
            </ul>
          </div>
        )}

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
