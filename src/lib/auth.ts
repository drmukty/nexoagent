import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest, NextResponse } from 'next/server';
import { prisma } from './db';

export const COOKIE = 'nexo_session';
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET must be set (32+ chars)');
  return new TextEncoder().encode(s);
}

export async function signSession(userId: string, address: string) {
  return new SignJWT({ address })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({ name: COOKIE, value: '', path: '/', maxAge: 0 });
}

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    // Confirms the account still exists (Delete Account invalidates old tokens).
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, walletAddress: true } });
    return user ? { id: user.id, address: user.walletAddress } : null;
  } catch {
    return null;
  }
}
