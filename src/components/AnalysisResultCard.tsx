'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { BetCountdown } from './BetCountdown';
import { CardShell, ChartLink, NFA } from './ResultParts';
import { useApp } from '@/store/app';
import type { AnalyseResult } from '@/types';

const biasTone = { BULLISH: 'text-nexo-green', BEARISH: 'text-nexo-red', NEUTRAL: 'text-gray-300' };
const MAX_AGE_MS = 10 * 60_000;

export function AnalysisResultCard({ r }: { r: AnalyseResult }) {
  const bet = useApp((s) => s.bets[r.analysisId]);
  const place = useApp((s) => s.bet);
  const [sending, setSending] = useState<'AGREE' | 'DISAGREE' | null>(null);
  const expired = Date.now() - new Date(r.asOf).getTime() > MAX_AGE_MS;

  async function go(choice: 'AGREE' | 'DISAGREE') {
    setSending(choice);
    await place(r.analysisId, choice);
    setSending(null);
  }

  return (
    <CardShell 
      title={`Analysis: ${r.symbol}`} 
      // FIXED: Removed the "Commentary is template-based..." text
      footer={<>{NFA}</>}
    >
      <dl className="space-y-1">
        <div className="flex gap-3"><dt className="w-36 shrink-0 text-gray-500">Token Symbol</dt><dd className="font-medium">{r.symbol}</dd></div>
        <div className="flex gap-3"><dt className="w-36 shrink-0 text-gray-500">Contract Address</dt><dd className="break-all font-mono text-xs leading-5">{r.ca}</dd></div>
        <div className="flex gap-3"><dt className="w-36 shrink-0 text-gray-500">GeckoTerminal</dt><dd><ChartLink href={r.chartUrl} /></dd></div>
      </dl>
      <p><strong>{r.symbol}</strong> is currently <strong className={biasTone[r.bias]}>{r.bias}</strong>. {r.description}</p>
      <p>RSI sits at <strong>{r.rsi.value}</strong>, {r.rsi.note}.</p>
      <p>MACD is <strong>{r.macd.state}</strong>, {r.macd.note}.</p>
      <p>Bollinger Bands are <strong>{r.bb.state}</strong>, {r.bb.note}.</p>
      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <p className="mb-2 font-display font-semibold">Trade plan</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-sm">
          <dt className="text-gray-500">Entry</dt><dd>${r.plan.entry}</dd>
          <dt className="text-gray-500">Target</dt><dd className="text-nexo-green">${r.plan.target}</dd>
          <dt className="text-gray-500">Stop Loss</dt><dd className="text-nexo-red">${r.plan.stop}</dd>
          <dt className="text-gray-500">Direction</dt><dd className={r.plan.direction === 'LONG' ? 'text-nexo-green' : 'text-nexo-red'}>{r.plan.direction}</dd>
        </dl>
      </div>
      <p>Confidence score: <strong>{r.confidence.score}/10</strong>. {r.confidence.caution}</p>

      <div className="border-t border-white/10 pt-3">
        {bet ? (
          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              {(['AGREE', 'DISAGREE'] as const).map((c) => (
                <button key={c} disabled className={clsx('btn flex-1 border', bet.userChoice === c ? 'border-nexo-blue bg-nexo-blue/20 text-white' : 'border-white/10 text-gray-500')}>{c === 'AGREE' ? 'Agree' : 'Disagree'}</button>
              ))}
            </div>
            <BetCountdown bet={bet} />
          </div>
        ) : expired ? (
          <p className="text-sm text-gray-500">This signal is more than 10 minutes old, so betting is closed. Run /analyse again for a fresh one.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Do you agree with the AI? One bet per result. It resolves 15 minutes after you click.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="btn flex-1 bg-nexo-green/15 text-nexo-green hover:bg-nexo-green/25" disabled={!!sending} onClick={() => go('AGREE')}>{sending === 'AGREE' ? 'Placing bet' : 'Agree'}</button>
              <button className="btn flex-1 bg-nexo-red/15 text-nexo-red hover:bg-nexo-red/25" disabled={!!sending} onClick={() => go('DISAGREE')}>{sending === 'DISAGREE' ? 'Placing bet' : 'Disagree'}</button>
            </div>
          </div>
        )}
      </div>
    </CardShell>
  );
}
