'use client';
import { Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { useApp } from '@/store/app';
import type { CommandName } from '@/types';

const COMMANDS: { cmd: CommandName; hint: string }[] = [
  { cmd: 'analyse', hint: '15-minute trade signal' },
  // { cmd: 'mindshare', hint: 'X social intelligence' }, // Hidden for now
  { cmd: 'report', hint: 'Full crypto intel report' },
];

export function SearchBox() {
  const { run, toast, messages } = useApp();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const busy = messages.some((m) => m.pending);

  function pick(cmd: CommandName) {
    setValue(`/${cmd} `);
    setOpen(false);
    input.current?.focus();
  }

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    
    // Only allow analyse and report
    const m = value.trim().match(/^\/(analyse|report)\s+(\S+)$/);
    if (!m) {
      toast('Choose a command, then paste one contract address or ticker.', 'error');
      return;
    }
    setValue('');
    setOpen(false);
    void run(m[1] as CommandName, m[2]);
  }

  return (
    <div className="relative border-t border-white/10 bg-nexo-bg/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:px-5">
      <div className="mx-auto max-w-3xl">
        {open && !value.includes(' ') && (
          <ul role="listbox" aria-label="Commands" className="glass absolute bottom-full left-3 right-3 mb-2 mx-auto max-w-3xl overflow-hidden bg-[#0F1116] sm:left-5 sm:right-5">
            {COMMANDS.map(({ cmd, hint }) => (
              <li key={cmd} role="option" aria-selected="false">
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(cmd)} className="flex min-h-[48px] w-full items-center justify-between px-4 text-left hover:bg-white/[0.06]">
                  <span className="font-mono text-sm text-nexo-blue">/{cmd}</span>
                  <span className="text-xs text-gray-500">{hint}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={send} className="glass flex items-center gap-2 p-1.5">
          <input ref={input} value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} placeholder="Type / for commands, then paste a contract address or ticker" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} aria-label="Command" className="min-h-[44px] flex-1 bg-transparent px-3 font-mono text-sm outline-none placeholder:font-sans placeholder:text-gray-600" />
          <button className="btn-primary px-4" disabled={busy || !value.trim()} aria-label="Send"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </div>
  );
}
