import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';
import { api, ok } from '@/lib/http';

export const POST = api({ limit: 20 }, async () => {
  const expiresAt = new Date(Date.now() + 5 * 60_000);
  const message = [
    'Sign in to NexoAi',
    'This proves you own this wallet. It is free and sends no transaction.',
    `Nonce: ${randomBytes(16).toString('hex')}`,
    `Expires: ${expiresAt.toISOString()}`,
  ].join('\n');
  const c = await prisma.challenge.create({ data: { message, expiresAt } });
  return ok({ challengeId: c.id, message });
});
