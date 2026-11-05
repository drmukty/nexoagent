export function fmtPrice(n: number): string {
  if (!isFinite(n)) return 'n/a';
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(4);
  if (abs === 0) return '0';
  const decimals = Math.min(18, Math.max(4, 3 - Math.floor(Math.log10(abs))));
  return n.toFixed(decimals);
}
export const fmtNum = (n: number) => Math.round(n).toLocaleString('en-US');
export const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
export const fmtUsd = (n: number) =>
  n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` : `$${n.toFixed(0)}`;
