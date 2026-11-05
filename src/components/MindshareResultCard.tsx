'use client';
import { CardShell, DataField, NFA } from './ResultParts';
import type { MindshareResult } from '@/types';

export function MindshareResultCard({ r }: { r: MindshareResult }) {
  if (r.status === 'unavailable') {
    return (
      <CardShell title={`Mindshare Report for ${r.token}`}>
        <p>Source unavailable. Try again later.</p>
        <p className="text-gray-500">{r.reason}</p>
      </CardShell>
    );
  }
  const m = r.metrics!;
  const why = { iq: 'Needs a market-wide baseline that the X search endpoint does not provide.', share: 'Needs total market mentions, which the X search endpoint does not provide.' };
  return (
    <CardShell title={`Mindshare Report for ${r.token}`} footer={NFA}>
      <div className="space-y-1">
        <DataField label="MAIGA IQ" value={m.maigaIq} why={why.iq} />
        <DataField label="Mindshare %" value={m.mindsharePct} why={why.share} />
        <DataField label="Hype" value={m.hype} />
        <DataField label="Loyalty" value={m.loyalty} />
        <DataField label="Bullish" value={m.bullish} why="Sentiment classification was unavailable." />
        <DataField label="Neutral" value={m.neutral} why="Sentiment classification was unavailable." />
        <DataField label="Bearish" value={m.bearish} why="Sentiment classification was unavailable." />
      </div>
      <div><p className="mb-1 font-display font-semibold">Summary</p><ul className="list-disc space-y-1 pl-5 text-gray-300">{r.summary?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      {r.tweetStats && (
        <div>
          <p className="mb-1 font-display font-semibold">AI Summary of Tweets (24h)</p>
          <ul className="list-disc space-y-1 pl-5 text-gray-300">
            <li>Total Tweets: {r.tweetStats.total}</li><li>Unique Authors: {r.tweetStats.authors}</li><li>Total Engagement: {r.tweetStats.engagement}</li>
          </ul>
          {r.tweetStats.note && <p className="mt-1 text-xs text-gray-500">{r.tweetStats.note}</p>}
        </div>
      )}
      {!!r.highlights?.length && <div><p className="mb-1 font-display font-semibold">Tweet Highlights</p><ul className="list-disc space-y-1 pl-5 text-gray-300">{r.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul></div>}
      {r.interpretation && (
        <div><p className="mb-1 font-display font-semibold">Overall Interpretation</p>
          <ul className="list-disc space-y-1 pl-5 text-gray-300"><li>Strengths: {r.interpretation.strengths}</li><li>Weaknesses: {r.interpretation.weaknesses}</li></ul>
        </div>
      )}
    </CardShell>
  );
}
