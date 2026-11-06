import { prisma } from '@/lib/db';
import { resolveDue } from '@/lib/betting';
import { api, ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

export const GET = api({ auth: true, limit: 120 }, async ({ user }) => {
  await resolveDue(10).catch(() => undefined); // lazy resolution on top of cron
  const me = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  const [higher, tied, notifications, unread, bets] = await Promise.all([
    prisma.user.count({ where: { xp: { gt: me.xp } } }),
    prisma.user.count({ where: { xp: me.xp, createdAt: { lt: me.createdAt } } }),
    prisma.notification.findMany({ where: { userId: me.id }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.notification.count({ where: { userId: me.id, isRead: false } }),
    prisma.bet.findMany({ where: { userId: me.id }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ]);
  return ok({
    me: { address: me.walletAddress, xp: me.xp, rank: higher + tied + 1, createdAt: me.createdAt },
    notifications: notifications.map((n) => ({ id: n.id, message: n.message, xpChange: n.xpChange, isRead: n.isRead, createdAt: n.createdAt })),
    unread,
    bets: bets.map((b) => ({ id: b.id, analysisId: b.analysisId, status: b.status, userChoice: b.userChoice, xpAwarded: b.xpAwarded, resolvesAt: b.resolvesAt, createdAt: b.createdAt, tokenSymbol: b.tokenSymbol })),
  });
});
