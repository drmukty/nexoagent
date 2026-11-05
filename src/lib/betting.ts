import { prisma } from './db';
import { fetchPriceAt } from './gecko';

export const XP_WIN = 10;
export const XP_LOSS = 1;
export const WINDOW_MS = (Number(process.env.BET_WINDOW_SECONDS) || 900) * 1000;

/** AI is "correct" if price moved in the predicted direction past entry, or ended closer to target than stop. */
export function aiWasCorrect(dir: string, entry: number, target: number, stop: number, price: number): boolean {
  const moved = dir === 'LONG' ? price > entry : price < entry;
  const closerToTarget = Math.abs(price - target) < Math.abs(price - stop);
  return moved || closerToTarget;
}

export function xpFor(choice: string, aiCorrect: boolean): number {
  return (choice === 'AGREE') === aiCorrect ? XP_WIN : XP_LOSS;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function priceWithRetry(network: string, pool: string, atSec: number): Promise<number | null> {
  for (let i = 0; i < 3; i++) {
    try {
      const p = await fetchPriceAt(network, pool, atSec);
      if (p !== null) return p;
    } catch { /* retry */ }
    await sleep(500 * (i + 1));
  }
  return null; // stays PENDING; retried on the next poll or cron run
}

/** Resolves one due bet. Idempotent: the status flip is an atomic claim, so XP can never be awarded twice. */
export async function resolveBet(betId: string): Promise<boolean> {
  const bet = await prisma.bet.findUnique({ where: { id: betId } });
  if (!bet || bet.status !== 'PENDING' || bet.resolvesAt.getTime() > Date.now()) return false;

  // Price at the resolution instant (T+15m), even if this runs late.
  const price = await priceWithRetry(bet.network, bet.poolAddress, Math.floor(bet.resolvesAt.getTime() / 1000));
  if (price === null) return false;

  const correct = aiWasCorrect(bet.aiDirection, bet.entryPrice, bet.targetPrice, bet.stopPrice, price);
  const xp = xpFor(bet.userChoice, correct);

  return prisma.$transaction(async (tx) => {
    const claim = await tx.bet.updateMany({
      where: { id: bet.id, status: 'PENDING' },
      data: { status: xp === XP_WIN ? 'WON' : 'LOST', xpAwarded: xp, resolvePrice: price, resolvedAt: new Date() },
    });
    if (claim.count !== 1) return false;
    await tx.user.update({ where: { id: bet.userId }, data: { xp: { increment: xp } } });
    await tx.notification.create({
      data: { userId: bet.userId, xpChange: xp, message: xp === XP_WIN ? `You won ${XP_WIN} XP` : `You earned ${XP_LOSS} XP` },
    });
    return true;
  });
}

export async function resolveDue(limit = 25): Promise<number> {
  const due = await prisma.bet.findMany({
    where: { status: 'PENDING', resolvesAt: { lte: new Date() } },
    orderBy: { resolvesAt: 'asc' },
    take: limit,
    select: { id: true },
  });
  const results = await Promise.allSettled(due.map((b) => resolveBet(b.id)));
  return results.filter((r) => r.status === 'fulfilled' && r.value).length;
}
