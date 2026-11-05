import { NextResponse } from 'next/server';
import { getAddress, verifyMessage } from 'ethers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { setSessionCookie, signSession } from '@/lib/auth';
import { api, fail } from '@/lib/http';

const Body = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/),
  challengeId: z.string().uuid(),
});

export const POST = api({ limit: 20 }, async ({ req }) => {
  const { address, signature, challengeId } = Body.parse(await req.json());
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.usedAt || challenge.expiresAt < new Date()) return fail(400, 'Sign-in expired. Try again.');

  let recovered: string;
  try {
    recovered = verifyMessage(challenge.message, signature);
  } catch {
    return fail(400, 'Signature could not be verified.');
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) return fail(401, 'Signature does not match this wallet.');

  // One-time use: atomic claim.
  const claim = await prisma.challenge.updateMany({ where: { id: challengeId, usedAt: null }, data: { usedAt: new Date() } });
  if (claim.count !== 1) return fail(400, 'Sign-in expired. Try again.');

  const wallet = getAddress(address).toLowerCase();
  const user = await prisma.user.upsert({ where: { walletAddress: wallet }, update: {}, create: { walletAddress: wallet } });
  const res = NextResponse.json({ address: user.walletAddress });
  setSessionCookie(res, await signSession(user.id, user.walletAddress));
  return res;
});
