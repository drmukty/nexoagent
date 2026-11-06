import { cached } from './cache';
import { DataError } from './errors';
import type { Candle } from './indicators';

const BASE = 'https://api.geckoterminal.com/api/v2';

async function gget(path: string, ttlMs: number): Promise<any> {
  return cached(`gt:${path}`, ttlMs, async () => {
    let res: Response;
    try {
      res = await fetch(BASE + path, {
        headers: { accept: 'application/json;version=20230302' },
        signal: AbortSignal.timeout(10_000),
        cache: 'no-store',
      });
    } catch {
      throw new DataError('GeckoTerminal did not respond. Try again in a moment.');
    }
    if (res.status === 429) throw new DataError('GeckoTerminal rate limit reached. Try again in a minute.');
    if (res.status === 404) throw new DataError('Token or pool not found on GeckoTerminal.', false);
    if (!res.ok) throw new DataError(`GeckoTerminal returned an error (${res.status}).`);
    return res.json();
  });
}

export interface Pool {
  network: string;
  address: string;
  name: string;
  priceUsd: number | null;
  reserveUsd: number;
  volumeH24: number | null;
  changeH1: number | null;
  changeH24: number | null;
  buysH24: number | null;
  sellsH24: number | null;
  baseSymbol: string;
  baseAddress: string;
}

const num = (x: unknown): number | null => {
  const n = typeof x === 'string' || typeof x === 'number' ? Number(x) : NaN;
  return isFinite(n) ? n : null;
};

function toPool(d: any, tokens: Map<string, any>): Pool {
  const a = d.attributes ?? {};
  const baseId: string = d.relationships?.base_token?.data?.id ?? '';
  const tok = tokens.get(baseId)?.attributes ?? {};
  const network = d.relationships?.network?.data?.id ?? baseId.split('_')[0] ?? '';
  return {
    network,
    address: a.address,
    name: a.name ?? '',
    priceUsd: num(a.base_token_price_usd),
    reserveUsd: num(a.reserve_in_usd) ?? 0,
    volumeH24: num(a.volume_usd?.h24),
    changeH1: num(a.price_change_percentage?.h1),
    changeH24: num(a.price_change_percentage?.h24),
    buysH24: num(a.transactions?.h24?.buys),
    sellsH24: num(a.transactions?.h24?.sells),
    baseSymbol: String(tok.symbol ?? (a.name ?? '').split('/')[0]?.trim() ?? ''),
    baseAddress: String(tok.address ?? baseId.split('_').slice(1).join('_') ?? ''),
  };
}

export const QUERY_RE = /^(0x[a-fA-F0-9]{40}|[A-Za-z0-9._\-]{1,60})$/;

/** Resolve a contract address or ticker to the deepest-liquidity pool GeckoTerminal knows about. */
export async function resolveToken(rawQuery: string): Promise<Pool> {
  const query = rawQuery.trim().replace(/^\$/, '');
  if (!QUERY_RE.test(query)) throw new DataError('Enter a valid contract address or ticker.', false);
  const json = await gget(`/search/pools?query=${encodeURIComponent(query)}&include=base_token,network&page=1`, 60_000);
  const tokens = new Map<string, any>((json.included ?? []).filter((i: any) => i.type === 'token').map((i: any) => [i.id, i]));
  const pools: Pool[] = (json.data ?? []).map((d: any) => toPool(d, tokens)).filter((p: Pool) => p.address);
  const isCa = /^0x/i.test(query) || query.length > 30;
  const matches = pools.filter((p) =>
    isCa ? p.baseAddress.toLowerCase() === query.toLowerCase() : p.baseSymbol.toLowerCase() === query.toLowerCase(),
  );
  if (!matches.length) throw new DataError(`No pool found for "${query}". Check the contract address or ticker.`, false);
  return matches.sort((a, b) => b.reserveUsd - a.reserveUsd)[0];
}

/** Last ~100 candles on a 15-minute timeframe, oldest first. */
export async function fetchCandles15m(network: string, pool: string): Promise<Candle[]> {
  const json = await gget(`/networks/${network}/pools/${pool}/ohlcv/minute?aggregate=15&limit=100&currency=usd`, 60_000);
  const list: number[][] = json?.data?.attributes?.ohlcv_list ?? [];
  return list.map(([t, o, h, l, c, v]) => ({ t, o, h, l, c, v })).sort((a, b) => a.t - b.t);
}

/** Pool price at a specific moment: close of the last 1-minute candle at or before `tsSec`. Uncached. */
export async function fetchPriceAt(network: string, pool: string, tsSec: number): Promise<number | null> {
  const json = await gget(`/networks/${network}/pools/${pool}/ohlcv/minute?aggregate=1&limit=5&before_timestamp=${tsSec + 60}&currency=usd`, 0);
  const list: number[][] = json?.data?.attributes?.ohlcv_list ?? [];
  const hit = list.filter((r) => r[0] <= tsSec).sort((a, b) => b[0] - a[0])[0];
  return hit ? hit[4] : null;
}

export const chartUrl = (network: string, pool: string) => `https://www.geckoterminal.com/${network}/pools/${pool}`;
