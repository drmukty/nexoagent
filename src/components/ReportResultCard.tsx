'use client';
import { CardShell, ChartLink, DataField } from './ResultParts';
import type { ReportResult } from '@/types';

export function ReportResultCard({ r }: { r: ReportResult }) {
  return (
    <CardShell title={`Full Crypto Intel Report for ${r.token}`}>
      <div className="space-y-1">
        <DataField label="Trend" value={r.trend} />
        <DataField label="RSI" value={r.rsi} why="Not enough 15-minute candles to compute RSI." />
        <DataField label="Open Interest" value={r.openInterest} why="Open interest is not available for on-chain pools from the free data sources." />
        <DataField label="Funding" value={r.funding} why="Funding rates are not available for on-chain pools from the free data sources." />
        <DataField label="Fund Flow" value={r.fundFlow} />
        <DataField label="Sentiment" value={r.sentiment} />
        <div className="flex gap-3"><span className="w-36 shrink-0 text-gray-500">Chart</span><ChartLink href={r.chartUrl} /></div>
      </div>
      <div><p className="mb-1 font-display font-semibold">Summary</p><p className="text-gray-300">{r.summary}</p></div>
    </CardShell>
  );
}
