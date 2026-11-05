import { prisma } from '@/lib/db';
import { api, ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

export const GET = api({ auth: true, limit: 120 }, async ({ user }) => {
  const [top, me] = await Promise.all([
    prisma.user.findMany({ orderBy: [{ xp: 'desc' }, { createdAt: 'asc' }], take: 12, select: { id: true, walletAddress: true, xp: true } }),
    prisma.user.findUniqueOrThrow({ where: { id: user.id } }),
  ]);
  const [higher, tied] = await Promise.all([
    prisma.user.count({ where: { xp: { gt: me.xp } } }),
    prisma.user.count({ where: { xp: me.xp, createdAt: { lt: me.createdAt } } }),
  ]);
  return ok({
    top: top.map((u, i) => ({ rank: i + 1, address: u.walletAddress, xp: u.xp, isMe: u.id === user.id })),
    me: { rank: higher + tied + 1, xp: me.xp },
  });
});
