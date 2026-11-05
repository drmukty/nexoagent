import { prisma } from './db';
import { DataError } from './errors';
import { chartUrl, fetchCandles15m, resolveToken } from './gecko';
import { narrate } from './gemini';
import { buildPlan, computeIndicators } from './indicators';
import { fmtPrice } from './fmt';
import type { AnalyseResult } from '@/types';

export async function runAnalyse(query: string, userId: string): Promise<AnalyseResult> {
  const pool = await resolveToken(query);
  const candles = await fetchCandles15m(pool.network, pool.address);
  const ind = computeIndicators(candles);
  if (!ind) throw new DataError('Not enough 15-minute candle history for this pool yet. Try again later or pick a more active token.', false);

  const entry = pool.priceUsd ?? ind.price;
  const plan = buildPlan(ind, entry);
  const rsiTxt = ind.rsi.toFixed(1);

  const rsiFallback =
    ind.rsi > 70 ? 'overbought territory, pullback risk is elevated' : ind.rsi > 55 ? 'buyers hold the edge' : ind.rsi < 30 ? 'oversold territory, a bounce is possible' : ind.rsi < 45 ? 'sellers hold the edge' : 'balanced, no momentum edge';
  const macdFallback = { rising: 'momentum is building to the upside', falling: 'momentum is fading', flat: 'no clear momentum shift' }[ind.macd.state];
  const bbFallback = { squeeze: 'volatility is compressed, a larger move may follow', expanding: 'volatility is expanding', normal: 'volatility is in a normal range' }[ind.bb.state];

  const payload = {
    token: pool.baseSymbol,
    timeframe_minutes: 15,
    bias: plan.bias,
    direction: plan.direction,
    price: entry,
    rsi: Number(rsiTxt),
    macd_state: ind.macd.state,
    macd_histogram_positive: ind.macd.hist > 0,
    bollinger_state: ind.bb.state,
    percent_b: Number(ind.bb.pctB.toFixed(2)),
    confidence_score: plan.confidence,
  };
  const { data, source } = await narrate(
    'Describe a 15-minute technical read of this token. description = 1-2 sentences on the overall state. rsiNote/macdNote/bbNote = one short phrase each interpreting that indicator. caution = one short line on the main risk to this read.',
    { description: 'string', rsiNote: 'string', macdNote: 'string', bbNote: 'string', caution: 'string' },
    payload,
    () => ({
      description: `Indicators lean ${plan.bias.toLowerCase()} on the 15-minute chart; the plan below follows from them.`,
      rsiNote: rsiFallback,
      macdNote: macdFallback,
      bbNote: bbFallback,
      caution: plan.confidence <= 4 ? 'Signals are mixed, so treat this as low conviction.' : 'Short-timeframe signals can reverse quickly; size accordingly.',
    }),
  );

  const analysis = await prisma.analysis.create({
    data: {
      userId,
      tokenSymbol: pool.baseSymbol,
      tokenCa: pool.baseAddress,
      network: pool.network,
      poolAddress: pool.address,
      direction: plan.direction,
      entryPrice: plan.entry,
      targetPrice: plan.target,
      stopPrice: plan.stop,
    },
  });

  return {
    kind: 'analyse',
    analysisId: analysis.id,
    symbol: pool.baseSymbol,
    ca: pool.baseAddress,
    chartUrl: chartUrl(pool.network, pool.address),
    bias: plan.bias,
    description: data.description,
    rsi: { value: rsiTxt, note: data.rsiNote },
    macd: { state: ind.macd.state, note: data.macdNote },
    bb: { state: ind.bb.state, note: data.bbNote },
    plan: { entry: fmtPrice(plan.entry), target: fmtPrice(plan.target), stop: fmtPrice(plan.stop), direction: plan.direction },
    confidence: { score: plan.confidence, caution: data.caution },
    asOf: new Date().toISOString(),
    narrative: source,
  };
}
