import { DataError } from './errors';
import { chartUrl, fetchCandles15m, resolveToken } from './gecko';
import { narrate } from './gemini';
import { computeIndicators } from './indicators';
import { fmtNum, fmtPct, fmtUsd } from './fmt';
import type { ReportResult } from '@/types';

export async function runReport(query: string): Promise<ReportResult> {
  const pool = await resolveToken(query);
  const candles = await fetchCandles15m(pool.network, pool.address).catch(() => []);
  const ind = computeIndicators(candles);

  const { changeH1: h1, changeH24: h24, buysH24: buys, sellsH24: sells, volumeH24: vol } = pool;

  // Everything below is derived from fields GeckoTerminal actually returned; otherwise null => "Data unavailable".
  const trend = h24 !== null ? `${h24 >= 0 ? 'Up' : 'Down'} ${Math.abs(h24).toFixed(1)}% over 24h${h1 !== null ? `, ${fmtPct(h1)} over the last hour` : ''}` : null;
  const flow = buys !== null && sells !== null ? `${buys - sells >= 0 ? 'Net buying' : 'Net selling'}: ${fmtNum(buys)} buys vs ${fmtNum(sells)} sells (24h)${vol !== null ? `, volume ${fmtUsd(vol)}` : ''}` : null;
  let sentiment: string | null = null;
  if (h24 !== null && buys !== null && sells !== null) {
    const up = h24 > 1 && buys > sells, down = h24 < -1 && sells > buys;
    sentiment = `${up ? 'Positive' : down ? 'Negative' : 'Neutral'} (price action and trade flow, not social)`;
  }

  const payload = { token: pool.baseSymbol, change_24h_percent: h24, change_1h_percent: h1, buys_24h: buys, sells_24h: sells, rsi: ind ? Number(ind.rsi.toFixed(1)) : null };
  if (h24 === null && !ind) throw new DataError('Not enough market data is available for this token yet.', false);

  const { data, source } = await narrate(
    'Write a 2-3 sentence neutral conclusion about this token using only the data provided. Mention gaps in data if fields are null.',
    { summary: 'string' },
    payload,
    () => ({ summary: `${pool.baseSymbol}: ${trend ?? 'trend data unavailable'}. ${flow ?? 'Trade-flow data unavailable.'} Open interest and funding are not available for on-chain pools from the free data sources.` }),
  );

  return {
    kind: 'report',
    token: pool.baseSymbol,
    ca: pool.baseAddress,
    chartUrl: chartUrl(pool.network, pool.address),
    trend,
    rsi: ind ? `${ind.rsi.toFixed(1)} (15m)` : null,
    openInterest: null,
    funding: null,
    fundFlow: flow,
    sentiment,
    summary: data.summary,
    narrative: source,
    asOf: new Date().toISOString(),
  };
}
