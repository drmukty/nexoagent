import clsx from 'clsx';

export function LoadingSkeleton({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-3', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="relative h-4 overflow-hidden rounded bg-white/[0.06]" style={{ width: `${95 - i * 12}%` }}>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
