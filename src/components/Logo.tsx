export function Logo({ size = 'md' }: { size?: 'md' | 'xl' }) {
  const big = size === 'xl';
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className={big ? 'h-12 w-12' : 'h-7 w-7'} fill="none" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="8" stroke="#3B82F6" strokeOpacity=".5" />
        <path d="M9 23V9l14 14V9" stroke="url(#g)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <defs><linearGradient id="g" x1="9" y1="9" x2="23" y2="23"><stop stopColor="#3B82F6" /><stop offset="1" stopColor="#8B5CF6" /></linearGradient></defs>
      </svg>
      <span className={`font-display font-semibold tracking-tight ${big ? 'text-4xl' : 'text-lg'}`}>NexoAi</span>
    </div>
  );
}
