import { cached } from './cache';
import { classifySentiment, narrate } from './gemini';
import { resolveToken } from './gecko';
import { fmtNum } from './fmt';
import type { MindshareResult } from '@/types';

interface Tweet { id: string; text: string; author_id: string; public_metrics?: { like_count: number; retweet_count: number; reply_count: number; quote_count: number } }

class XError extends Error {}

async function searchX(query: string, startTime: string) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) throw new XError('X API is not configured for this deployment.');
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=100&start_time=${encodeURIComponent(startTime)}&tweet.fields=public_metrics,author_id,created_at`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(12_000), cache: 'no-store' });
  if (res.status === 429) throw new XError('X API rate limit reached.');
  if (res.status === 401 || res.status === 403) throw new XError('X API credentials are missing or do not include search access.');
  if (!res.ok) throw new XError(`X API returned an error (${res.status}).`);
  const json = await res.json();
  return { tweets: (json.data ?? []) as Tweet[], capped: Boolean(json.meta?.next_token) };
}

export async function runMindshare(rawQuery: string): Promise<MindshareResult> {
  const query = rawQuery.trim().replace(/^\$/, '');
  const asOf = new Date().toISOString();
  let label = query.toUpperCase();
  let isCa = /^0x[a-fA-F0-9]{40}$/.test(query) || query.length > 30;
  try {
    const pool = await resolveToken(query);
    label = pool.baseSymbol || label;
  } catch { /* the label is cosmetic; X search can still run on the raw query */ }

  const q = isCa ? `"${query}" -is:retweet` : `($${query} OR #${query}) -is:retweet lang:en`;
  const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

  let data: { tweets: Tweet[]; capped: boolean };
  try {
    data = await cached(`x:${q}`, 5 * 60_000, () => searchX(q, start));
  } catch (e) {
    return { kind: 'mindshare', token: label, status: 'unavailable', reason: e instanceof XError ? e.message : 'X data could not be fetched.', asOf };
  }

  const { tweets, capped } = data;
  const total = tweets.length;
  if (total === 0) {
    return { kind: 'mindshare', token: label, status: 'ok', summary: ['No tweets found for this token in the last 24 hours.'], metrics: { maigaIq: null, mindsharePct: null, hype: null, loyalty: null, bullish: null, neutral: null, bearish: null }, tweetStats: { total: '0', authors: '0', engagement: '0' }, highlights: [], interpretation: null, asOf };
  }

  const eng = (t: Tweet) => { const m = t.public_metrics; return m ? m.like_count + m.retweet_count + m.reply_count + m.quote_count : 0; };
  const totalEng = tweets.reduce((s, t) => s + eng(t), 0);
  const counts = new Map<string, number>();
  tweets.forEach((t) => counts.set(t.author_id, (counts.get(t.author_id) ?? 0) + 1));
  const authors = counts.size;
  const repeat = Array.from(counts.values()).filter((c) => c >= 2).length;
  const hype = totalEng / total;
  const loyalty = (repeat / authors) * 100;

  const labels = await classifySentiment(tweets.map((t) => t.text));
  let bullish: number | null = null, bearish: number | null = null, neutral: number | null = null;
  if (labels) {
    bullish = Math.round((labels.filter((l) => l === 'bullish').length / total) * 100);
    bearish = Math.round((labels.filter((l) => l === 'bearish').length / total) * 100);
    neutral = 100 - bullish - bearish;
  }

  const top = [...tweets].sort((a, b) => eng(b) - eng(a)).slice(0, 2);
  const highlights = top.map((t) => `${t.text.replace(/\s+/g, ' ').slice(0, 200)} (${fmtNum(eng(t))} engagements)`);

  const payload = { token: label, tweets_sampled: total, unique_authors: authors, total_engagement: totalEng, engagement_per_tweet: Number(hype.toFixed(1)), repeat_author_percent: Number(loyalty.toFixed(1)), bullish_percent: bullish, neutral_percent: neutral, bearish_percent: bearish };
  const { data: n } = await narrate(
    'summary1/summary2/summary3 = three short insights about social activity. strengths and weaknesses = one sentence each. Mention that figures reflect a sample if relevant.',
    { summary1: 'string', summary2: 'string', summary3: 'string', strengths: 'string', weaknesses: 'string' },
    payload,
    () => ({
      summary1: `${fmtNum(total)} tweets from ${fmtNum(authors)} unique authors in the sampled window.`,
      summary2: `Engagement averages ${hype.toFixed(1)} per tweet.`,
      summary3: bullish !== null ? `Sentiment split: ${bullish}% bullish, ${neutral}% neutral, ${bearish}% bearish.` : 'Sentiment classification was unavailable.',
      strengths: authors > total * 0.7 ? 'Discussion comes from many distinct accounts.' : 'A core group of accounts keeps posting about it.',
      weaknesses: authors <= total * 0.7 ? 'A few accounts may be driving a large share of the volume.' : 'Few accounts repeat, so loyalty is thin.',
    }),
  );

  return {
    kind: 'mindshare',
    token: label,
    status: 'ok',
    metrics: {
      maigaIq: null, // needs a market-wide baseline we do not have
      mindsharePct: null, // needs total market mentions, not available from the X search endpoint
      hype: `${hype.toFixed(1)} engagements per tweet`,
      loyalty: `${loyalty.toFixed(0)}% repeat authors`,
      bullish: bullish === null ? null : `${bullish}%`,
      neutral: neutral === null ? null : `${neutral}%`,
      bearish: bearish === null ? null : `${bearish}%`,
    },
    summary: [n.summary1, n.summary2, n.summary3],
    tweetStats: { total: `${fmtNum(total)}${capped ? '+' : ''}`, authors: fmtNum(authors), engagement: fmtNum(totalEng), note: capped ? 'Sample of the 100 most recent tweets; more exist.' : undefined },
    highlights,
    interpretation: { strengths: n.strengths, weaknesses: n.weaknesses },
    asOf,
  };
}
