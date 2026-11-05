import { z } from 'zod';
import { api, ok, fail } from '@/lib/http';
import { rateLimit } from '@/lib/rateLimit';
import { DataError } from '@/lib/errors';
import { QUERY_RE } from '@/lib/gecko';
import { runAnalyse } from '@/lib/analyse';
import { runMindshare } from '@/lib/mindshare';
import { runReport } from '@/lib/report';

export const maxDuration = 30;

const Body = z.object({
  command: z.enum(['analyse', 'mindshare', 'report']),
  query: z.string().trim().min(1).max(80).transform((s) => s.replace(/^\$/, '')).refine((s) => QUERY_RE.test(s)),
});

export const POST = api({ auth: true, limit: 30 }, async ({ req, user }) => {
  const { command, query } = Body.parse(await req.json());
  if (!rateLimit(`cmd:${user.id}`, 10, 60_000)) return fail(429, 'Easy there. Max 10 commands per minute.');
  try {
    const result =
      command === 'analyse' ? await runAnalyse(query, user.id) : command === 'mindshare' ? await runMindshare(query) : await runReport(query);
    return ok(result);
  } catch (e) {
    if (e instanceof DataError) return ok({ kind: 'error', message: e.message, retryable: e.retryable, command, query });
    throw e;
  }
});
