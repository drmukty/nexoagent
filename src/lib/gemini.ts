const EXTRA_ALLOWED = [1, 2, 3, 9, 10, 12, 14, 15, 20, 24, 26, 50, 100];

export function collectNumbers(x: unknown, out: number[] = []): number[] {
  if (typeof x === 'number' && isFinite(x)) out.push(x);
  else if (typeof x === 'string') (x.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/g) ?? []).forEach((m) => out.push(parseFloat(m)));
  else if (Array.isArray(x)) x.forEach((v) => collectNumbers(v, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => collectNumbers(v, out));
  return out;
}

/** True only if every number in `text` exists (within 0.5%) in the input payload. */
export function numbersAreGrounded(text: string, allowed: number[]): boolean {
  const found = (text.replace(/(\d),(\d{3})/g, '$1$2').match(/\d+(?:\.\d+)?/g) ?? []).map(parseFloat);
  const pool = [...allowed.map(Math.abs), ...EXTRA_ALLOWED];
  return found.every((n) => pool.some((a) => Math.abs(a - n) <= Math.max(a * 0.005, 1e-12)));
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

function parseJson(text: string | null): any | null {
  if (!text) return null;
  try {
    return JSON.parse(text.replace(/^```json|```$/g, '').trim());
  } catch {
    return null;
  }
}

/**
 * Gemini writes prose ONLY. The prompt contains the real computed values; the output is rejected (and retried
 * up to 2 more times) if it is missing a key or contains any number that is not in the input.
 */
export async function narrate<K extends string>(
  task: string,
  keys: Record<K, string>,
  payload: object,
  fallback: () => Record<K, string>,
): Promise<{ data: Record<K, string>; source: 'gemini' | 'template' }> {
  const allowed = collectNumbers(payload);
  const prompt = [
    'You are the analyst voice of NexoAi. Write short, neutral market commentary. No emojis. No financial advice. No hype.',
    'Use ONLY numbers that appear in INPUT, copied exactly as given. Do not add, estimate, round differently, or invent any figure.',
    'If you have no number to cite, write without one.',
    `TASK: ${task}`,
    `Return ONLY a JSON object with exactly these string keys: ${JSON.stringify(keys)}`,
    `INPUT: ${JSON.stringify(payload)}`,
  ].join('\n');

  for (let attempt = 0; attempt < 3; attempt++) {
    const obj = parseJson(await callGemini(prompt));
    if (!obj) continue;
    const ks = Object.keys(keys) as K[];
    if (!ks.every((k) => typeof obj[k] === 'string' && obj[k].length > 0 && obj[k].length <= 400)) continue;
    if (!ks.every((k) => numbersAreGrounded(obj[k], allowed))) continue;
    return { data: Object.fromEntries(ks.map((k) => [k, obj[k]])) as Record<K, string>, source: 'gemini' };
  }
  return { data: fallback(), source: 'template' };
}

/** Classify tweets. Counts are computed by code from the labels; no numbers come from the model. */
export async function classifySentiment(texts: string[]): Promise<('bullish' | 'neutral' | 'bearish')[] | null> {
  if (!texts.length) return [];
  const prompt = [
    'Classify the sentiment of each tweet toward the token it discusses as exactly one of: bullish, neutral, bearish.',
    'Return ONLY JSON: {"labels": ["bullish"|"neutral"|"bearish", ...]} with one label per tweet, in order.',
    `TWEETS: ${JSON.stringify(texts.map((t) => t.slice(0, 240)))}`,
  ].join('\n');
  const obj = parseJson(await callGemini(prompt));
  const labels = obj?.labels;
  if (!Array.isArray(labels) || labels.length !== texts.length) return null;
  return labels.every((l: unknown) => l === 'bullish' || l === 'neutral' || l === 'bearish') ? labels : null;
}
