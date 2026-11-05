'use client';
import { useEffect, useState } from 'react';
import type { BetDTO } from '@/types';

export function BetCountdown({ bet }: { bet: BetDTO }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (bet.status !== 'PENDING') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [bet.status]);

  if (bet.status !== 'PENDING') {
    const won = bet.xpAwarded === 10;
    return <p className={`font-mono text-sm ${won ? 'text-nexo-green' : 'text-gray-300'}`}>{won ? 'Resolved: you won 10 XP' : 'Resolved: you earned 1 XP'}</p>;
  }
  const left = Math.max(0, Math.ceil((new Date(bet.resolvesAt).getTime() - now) / 1000));
  if (left === 0) return <p className="font-mono text-sm text-gray-400">Resolving now</p>;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return <p className="font-mono text-sm text-nexo-blue" aria-live="off">Resolving in {mm}:{ss}</p>;
}
