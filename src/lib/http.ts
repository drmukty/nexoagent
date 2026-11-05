import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getSessionUser } from './auth';
import { rateLimit } from './rateLimit';

export const ok = (data: unknown, init?: ResponseInit) => NextResponse.json(data, init);
export const fail = (status: number, message: string) => NextResponse.json({ error: message }, { status });

type Ctx = { req: NextRequest; user: { id: string; address: string } };
type Opts = { auth?: boolean; limit?: number; windowMs?: number };

/** Wraps a route: same-origin check on writes, rate limit, optional auth, safe error handling. Never logs bodies. */
export function api(opts: Opts, handler: (ctx: Ctx) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
    if (!rateLimit(`${req.nextUrl.pathname}:${ip}`, opts.limit ?? 60, opts.windowMs ?? 60_000)) {
      return fail(429, 'Too many requests. Slow down and try again shortly.');
    }
    if (req.method !== 'GET') {
      const origin = req.headers.get('origin');
      const allowed = process.env.APP_ORIGIN;
      if (origin && allowed && origin !== allowed) return fail(403, 'Cross-origin request blocked.');
    }
    let user: Ctx['user'] | null = null;
    if (opts.auth) {
      user = await getSessionUser(req);
      if (!user) return fail(401, 'Not signed in.');
    }
    try {
      return await handler({ req, user: user as Ctx['user'] });
    } catch (e) {
      if (e instanceof ZodError) return fail(400, 'Invalid input.');
      console.error('API error:', e instanceof Error ? e.message : 'unknown');
      return fail(500, 'Something went wrong on our side. Try again.');
    }
  };
}
