export interface Candle { t: number; o: number; h: number; l: number; c: number; v: number }

function ema(values: number[], period: number): number[] {
  const out = new Array(values.length).fill(NaN);
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

/** Wilder RSI. */
export function rsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return NaN;
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d; else loss -= d;
  }
  gain /= period; loss /= period;
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    gain = (gain * (period - 1) + Math.max(d, 0)) / period;
    loss = (loss * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (loss === 0) return 100;
  return 100 - 100 / (1 + gain / loss);
}

function atr(c: Candle[], period = 14): number {
  if (c.length < period + 1) return NaN;
  const tr = c.slice(1).map((x, i) => Math.max(x.h - x.l, Math.abs(x.h - c[i].c), Math.abs(x.l - c[i].c)));
  let a = tr.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < tr.length; i++) a = (a * (period - 1) + tr[i]) / period;
  return a;
}

export interface Indicators {
  price: number;
  rsi: number;
  macd: { line: number; signal: number; hist: number; state: 'flat' | 'rising' | 'falling' };
  bb: { mid: number; upper: number; lower: number; pctB: number; bandwidth: number; state: 'squeeze' | 'expanding' | 'normal' };
  atr: number;
}

/** Needs >= 35 candles. Returns null if there is not enough history. */
export function computeIndicators(candles: Candle[]): Indicators | null {
  const closes = candles.map((c) => c.c);
  const n = closes.length;
  if (n < 35) return null;
  const price = closes[n - 1];

  const e12 = ema(closes, 12), e26 = ema(closes, 26);
  const line = closes.map((_, i) => (isNaN(e26[i]) ? NaN : e12[i] - e26[i]));
  const defined = line.filter((x) => !isNaN(x));
  const sigDef = ema(defined, 9);
  const signal = new Array(n).fill(NaN);
  const offset = n - defined.length;
  sigDef.forEach((v, i) => (signal[offset + i] = v));
  const hist = line.map((v, i) => v - signal[i]);
  const h = hist[n - 1], hPrev = hist[n - 4];
  if ([h, hPrev, line[n - 1], signal[n - 1]].some(isNaN)) return null;
  const eps = Math.abs(price) * 0.0003;
  const delta = h - hPrev;
  const macdState = Math.abs(delta) < eps ? 'flat' : delta > 0 ? 'rising' : 'falling';

  const bw: number[] = [];
  let last = { mid: 0, upper: 0, lower: 0 };
  for (let i = 19; i < n; i++) {
    const w = closes.slice(i - 19, i + 1);
    const mid = w.reduce((a, b) => a + b, 0) / 20;
    const sd = Math.sqrt(w.reduce((a, b) => a + (b - mid) ** 2, 0) / 20);
    last = { mid, upper: mid + 2 * sd, lower: mid - 2 * sd };
    bw.push(mid === 0 ? 0 : (last.upper - last.lower) / mid);
  }
  const cur = bw[bw.length - 1];
  const hist50 = bw.slice(-51, -1);
  const avg = hist50.reduce((a, b) => a + b, 0) / Math.max(1, hist50.length);
  const bbState = cur < avg * 0.75 ? 'squeeze' : cur > avg * 1.25 ? 'expanding' : 'normal';
  const width = last.upper - last.lower;

  return {
    price,
    rsi: rsi(closes, 14),
    macd: { line: line[n - 1], signal: signal[n - 1], hist: h, state: macdState },
    bb: { ...last, pctB: width === 0 ? 0.5 : (price - last.lower) / width, bandwidth: cur, state: bbState },
    atr: atr(candles, 14),
  };
}

export interface Plan {
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  direction: 'LONG' | 'SHORT';
  entry: number;
  target: number;
  stop: number;
  confidence: number;
  score: number;
}

/** Deterministic trade plan. All numbers come from code; the LLM only writes prose around them. */
export function buildPlan(ind: Indicators, entry: number): Plan {
  let score = 0;
  if (ind.rsi > 55) score++; else if (ind.rsi < 45) score--;
  score += ind.macd.hist > 0 ? 1 : -1;
  if (ind.macd.state === 'rising') score++; else if (ind.macd.state === 'falling') score--;
  if (ind.bb.pctB > 0.6) score++; else if (ind.bb.pctB < 0.4) score--;
  score += entry > ind.bb.mid ? 1 : -1;

  const bias = score >= 2 ? 'BULLISH' : score <= -2 ? 'BEARISH' : 'NEUTRAL';
  const direction = score > 0 || (score === 0 && ind.macd.hist >= 0) ? 'LONG' : 'SHORT';
  const atr = isFinite(ind.atr) && ind.atr > 0 ? ind.atr : entry * 0.01;
  const target = direction === 'LONG' ? entry + 1.5 * atr : Math.max(entry - 1.5 * atr, entry * 0.2);
  const stop = direction === 'LONG' ? Math.max(entry - atr, entry * 0.5) : entry + atr;
  let confidence = Math.round(2 + Math.abs(score) * 1.6);
  if (ind.rsi > 75 || ind.rsi < 25) confidence -= 1;
  if (bias === 'NEUTRAL') confidence = Math.min(confidence, 4);
  return { bias, direction, entry, target, stop, confidence: Math.min(10, Math.max(1, confidence)), score };
}
