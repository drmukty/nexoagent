'use client';
import { AlertCircle, ExternalLink, Info, RotateCw } from 'lucide-react';
import type { ErrorResult } from '@/types';

export function CardShell({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <article className="glass overflow-hidden">
      <header className="border-b border-white/10 px-4 py-3"><h3 className="font-display text-base font-semibold">{title}</h3></header>
      <div className="space-y-3 p-4 text-sm leading-relaxed">{children}</div>
      {footer && <footer className="border-t border-white/10 px-4 py-3 text-xs text-gray-500">{footer}</footer>}
    </article>
  );
}

/** A value, or the literal text "Data unavailable" with an info icon. Never a made-up number. */
export function DataField({ label, value, why }: { label: string; value: string | null | undefined; why?: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="w-36 shrink-0 text-gray-500">{label}</span>
      {value ? (
        <span className="font-medium">{value}</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-gray-500" title={why ?? 'This source does not provide this value for this token.'}>
          Data unavailable <Info className="h-3.5 w-3.5" aria-label={why ?? 'This source does not provide this value for this token.'} />
        </span>
      )}
    </div>
  );
}

export function ChartLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-nexo-blue hover:underline">View chart <ExternalLink className="h-3.5 w-3.5" /></a>
  );
}

export const NFA = 'NFA: AI can make mistakes.';

export function ErrorCard({ r, onRetry }: { r: ErrorResult; onRetry?: () => void }) {
  return (
    <article className="glass border-nexo-red/30 p-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-nexo-red" />
        <div className="flex-1 text-sm">
          <p>{r.message}</p>
          {onRetry && <button onClick={onRetry} className="btn-ghost mt-3"><RotateCw className="h-4 w-4" />Retry</button>}
        </div>
      </div>
    </article>
  );
}
