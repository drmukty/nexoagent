import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import clsx from 'clsx';

export function CardShell({ 
  title, 
  children, 
  footer 
}: { 
  title: string; 
  children: React.ReactNode; 
  footer?: React.ReactNode 
}) {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0F1116]/90 p-5 shadow-2xl">
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <div className="flex flex-col gap-3 text-sm text-gray-300">
        {children}
      </div>
      {/* Footer only shows if explicitly passed in now. No default NFA or fallback text. */}
      {footer && <div className="mt-2 text-xs text-gray-500">{footer}</div>}
    </div>
  );
}

export function ChartLink({ href }: { href: string }) {
  if (!href) return <span className="text-gray-500">Unavailable</span>;
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="inline-flex items-center gap-1 text-nexo-blue hover:text-blue-400 hover:underline"
    >
      View chart <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function DataField({ label, value, why }: { label: string; value?: string | null; why?: string }) {
  if (!value || value === 'Data unavailable') {
    return (
      <div className="flex gap-3">
        <span className="w-36 shrink-0 text-gray-500">{label}</span>
        <div className="group relative flex items-center gap-1 text-gray-500">
          <span>Data unavailable</span>
          {why && (
            <>
              <Info className="h-3.5 w-3.5 cursor-help" />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-black p-2 text-center text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {why}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span className="w-36 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

export function ErrorCard({ r, onRetry }: { r: any, onRetry?: () => void }) {
  return (
    <CardShell title="Error">
      <p className="text-nexo-red">{r.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">
          Try again
        </button>
      )}
    </CardShell>
  );
}
