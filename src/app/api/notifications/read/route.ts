import { z } from 'zod';
import { prisma } from '@/lib/db';
import { api, ok } from '@/lib/http';

const Body = z.object({ id: z.string().uuid().optional(), all: z.boolean().optional() });

export const POST = api({ auth: true, limit: 60 }, async ({ req, user }) => {
  const { id, all } = Body.parse(await req.json());
  await prisma.notification.updateMany({ where: { userId: user.id, ...(all ? {} : { id }), isRead: false }, data: { isRead: true } });
  return ok({ ok: true });
});
