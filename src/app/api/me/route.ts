import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clearSessionCookie } from '@/lib/auth';
import { api } from '@/lib/http';

/** Delete Account: wipes the user and, via cascade, bets, analyses and notifications. */
export const DELETE = api({ auth: true, limit: 5 }, async ({ user }) => {
  await prisma.user.delete({ where: { id: user.id } });
  const res = NextResponse.json({ deleted: true });
  clearSessionCookie(res);
  return res;
});
