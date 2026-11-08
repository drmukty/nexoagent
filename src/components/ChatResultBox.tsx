'use client';
import { useEffect, useRef } from 'react';
import { useApp } from '@/store/app';
import { LoadingSkeleton } from './LoadingSkeleton';
import { AnalysisResultCard } from './AnalysisResultCard';
import { MindshareResultCard } from './MindshareResultCard';
import { ReportResultCard } from './ReportResultCard';
import { ErrorCard } from './ResultParts';
import { Logo } from './Logo';
import { Trash2, MessageSquare } from 'lucide-react';
import type { CommandName, ErrorResult } from '@/types';

function retryFor(r: ErrorResult, run: (c: CommandName, q: string) => Promise<void>) {
  const { retryable, command, query } = r;
  return retryable && command && query ? () => run(command as CommandName, query) : undefined;
}

export function ChatResultBox() {
  const { messages, run, recentChats, loadRecentChat, deleteRecentChat } = useApp();
  const end = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-5" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        
        {/* --- WELCOME SCREEN & RECENT CHATS --- */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 sm:mt-20 text-center px-4">
            <div className="scale-125 mb-6">
              <Logo size="xl" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome to <span className="text-nexo-blue">NexoAi</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-gray-400 font-medium leading-relaxed">
              The AI agent for DeFi trading. <br />
              Get signals across timeframes, bet against AI analysis, and win XP.
            </p>

            {/* Recent Chats List */}
            {recentChats.length > 0 && (
              <div className="mt-12 w-full max-w-sm text-left">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Recent Chats</p>
                <div className="space-y-2">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2 transition-colors hover:bg-white/[0.06]">
                      <button onClick={() => loadRecentChat(chat.id)} className="flex flex-1 items-center gap-3 overflow-hidden text-left px-2 py-1">
                        <MessageSquare className="h-4 w-4 shrink-0 text-nexo-blue" />
                        <span className="truncate text-sm text-gray-300 group-hover:text-white">{chat.title}</span>
                      </button>
                      <button onClick={() => deleteRecentChat(chat.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* -------------------------------------- */}

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
