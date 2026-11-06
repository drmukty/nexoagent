'use client';
import { CardShell, ChartLink, DataField, NFA } from './ResultParts';
import type { ReportResult } from '@/types';

export function ReportResultCard({ r }: { r: ReportResult }) {
  return (
    <CardShell 
      title={`Full Crypto Intel Report for ${r.token}`} 
      footer={
        <>
          {NFA}
          {r.narrative === 'template' && ' Summary is template-based because the AI narrative was unavailable.'}
        </>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="space-y-3">
          <DataField label="Trend" value={r.trend} />
          <DataField label="RSI (14)" value={r.rsi} why="Not enough 15-minute candles to compute RSI." />
          <DataField label="Open Interest" value={r.openInterest} why="Open interest is not available for on-chain pools from the free data sources." />
        </div>
        <div className="space-y-3">
          <DataField label="Funding Rate" value={r.funding} why="Funding rates are not available for on-chain pools from the free data sources." />
          <DataField label="Fund Flow" value={r.fundFlow} />
          <DataField label="Sentiment" value={r.sentiment} />
        </div>
      </div>
      
      <div className="flex gap-3 border-b border-white/5 pb-6">
        <span className="w-36 shrink-0 text-sm text-gray-500">Chart</span>
        <ChartLink href={r.chartUrl} />
      </div>

      <div className="mt-6">
        <p className="mb-2 font-display font-semibold text-white">Deep Market Analysis</p>
        <p className="text-sm leading-relaxed text-gray-300">{r.summary}</p>
      </div>
    </CardShell>
  );
}
