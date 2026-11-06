import { NextRequest, NextResponse } from 'next/server';
import { resolveDue } from '@/lib/betting';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Call every minute (Vercel Cron on Pro, or any external pinger). Authorization: Bearer $CRON_SECRET */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const resolved = await resolveDue(50);
  return NextResponse.json({ resolved });
}
