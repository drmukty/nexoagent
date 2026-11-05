# NexoAi

AI agent for DeFAI and crypto signals. Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Zustand, Prisma + PostgreSQL, Ethers v6.

Not financial advice. AI can make mistakes.

## How it works

- **Wallet / auth.** The private key is generated or imported in the browser only. The client asks `/api/auth/challenge` for a one-time message, signs it locally, and posts `{ address, signature, challengeId }` to `/api/auth/verify`. The server checks the signature, then sets an httpOnly session cookie (JWT, 30 days). The server stores only `wallet_address`, `xp`, `created_at`. There is no key or key-hash column. The key is held in memory until you confirm, then dropped. It is never persisted (session-only is the default).
- **/analyse.** GeckoTerminal search resolves a CA or ticker to the deepest pool, then 15-minute OHLCV candles (about 100). RSI, MACD, Bollinger Bands and ATR are computed on the server, as are bias, direction, entry, target, stop and confidence. Gemini writes only the prose. Its output is rejected and retried (up to 2 more times) if it omits a field or contains any number that is not in the input. After that a template fallback is used, and the card says so.
- **Betting.** `POST /api/bets` reads entry/target/stop from the stored analysis (never from the client), enforces one bet per analysis (DB unique constraint), and sets `resolves_at = now + 15 min`. Resolution is server-side and idempotent: the price is the close of the 1-minute candle at the resolution instant, XP is awarded in one transaction, and a notification is inserted. If the price fetch fails it retries 3 times and the bet stays `PENDING` for the next run.
- **Leaderboard / rank.** Top 12 by `xp DESC` (ties by earlier `created_at`), plus the current user's rank. The client polls every 5 seconds.
- **Data gaps.** Open interest and funding are "Data unavailable" for on-chain pools. MAIGA IQ and Mindshare % are "Data unavailable" (they need baselines the X search API does not provide). If `X_BEARER_TOKEN` is missing or rate-limited, /mindshare returns a "Source unavailable" card. No numbers are invented anywhere.

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, APP_ORIGIN, keys
npx prisma migrate deploy   # applies prisma/migrations
npm run db:seed             # OPTIONAL, dev only: placeholder leaderboard rows
npm run dev
```

Use `openssl rand -base64 48` for `JWT_SECRET` and `CRON_SECRET`.

## Deploy to Vercel

1. Create a Postgres database (Neon, Supabase, Vercel Postgres) and set `DATABASE_URL` in Vercel.
2. Set `JWT_SECRET`, `APP_ORIGIN` (your https URL), `GEMINI_API_KEY`, optionally `X_BEARER_TOKEN`, and `CRON_SECRET`.
3. Run `npx prisma migrate deploy` once against the production DB.
4. Deploy. `vercel.json` raises function timeouts to 30s.

### Bet resolution timer on serverless

Serverless functions cannot hold a 15-minute timer, so resolution is claim-based:

- every `/api/state` poll (every 5s per open tab) resolves due bets, and
- `GET /api/cron/resolve` with `Authorization: Bearer $CRON_SECRET` resolves any stragglers.

Vercel Hobby only allows daily crons, so either use Vercel Pro and add
`"crons": [{ "path": "/api/cron/resolve", "schedule": "* * * * *" }]` to `vercel.json`
(Vercel sends `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set), or point a free external pinger (cron-job.org, GitHub Actions) at the endpoint every minute. Because the resolution price is read from the candle at `resolves_at`, a late run still produces the correct 15-minute price.

## Known limits (read before launch)

- Rate limiting and caching are in-memory per instance. Swap `src/lib/rateLimit.ts` and `src/lib/cache.ts` for Upstash/Redis for a global limit.
- "Real-time" is 5-second polling, not Socket.io/SSE (neither is reliable on Vercel serverless). Move to a persistent server if you need push.
- Outcome rule is implemented as specified: the AI is correct if price moved past entry in the predicted direction, or ended closer to target than stop. Because target/stop are asymmetric around entry, this effectively means "price moved the predicted way".
- The X API recent-search endpoint requires a paid tier. Sentiment is classified by Gemini from up to 100 sampled tweets; counts are computed in code.
- GeckoTerminal free API is rate limited (about 30 calls/min). Responses are cached for 60 seconds.
- Prices are stored as double precision, not NUMERIC.
- Check the Gemini model name in `GEMINI_MODEL`; model IDs change over time.
- Never use the seed script in production.
