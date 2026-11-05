'use client';
import { useEffect, useState } from 'react';
import { Panel } from './Panel';
import { LoadingSkeleton } from './LoadingSkeleton';
import { api } from '@/lib/client/api';
import type { LeaderboardDTO } from '@/types';
import clsx from 'clsx';

export default function LeaderboardPanel() {
  const [data, setData] = useState<LeaderboardDTO | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let live = true;
    const load = () => api<LeaderboardDTO>('/api/leaderboard').then((d) => { if (live) { setData(d); setErr(false); } }).catch(() => live && setErr(true));
    void load();
    const id = setInterval(load, 5000); // live while open
    return () => { live = false; clearInterval(id); };
  }, []);

  return (
    <Panel title="Leaderboard">
      {!data ? (err ? <p className="text-sm text-gray-400">Could not load the leaderboard. It will retry automatically.</p> : <LoadingSkeleton lines={6} />) : (
        <>
          <ol className="glass divide-y divide-white/10">
            {data.top.map((u) => (
              <li key={u.rank} className={clsx('flex min-h-[44px] items-center gap-3 px-4 py-2', u.isMe && 'bg-nexo-blue/10')}>
                <span className="w-7 font-display text-sm text-gray-500">{u.rank}</span>
                <span className="flex-1 font-mono text-sm">{u.address.slice(0, 6)}...{u.address.slice(-4)}{u.isMe && <span className="ml-2 text-xs text-nexo-blue">you</span>}</span>
                <span className="font-mono text-sm tabular-nums">{u.xp} XP</span>
              </li>
            ))}
            {data.top.length === 0 && <li className="p-4 text-sm text-gray-400">No one has earned XP yet.</li>}
          </ol>
          <div className="glass mt-4 flex items-center justify-between border-nexo-blue/30 px-4 py-3">
            <span className="text-sm text-gray-400">Your rank</span>
            <span className="font-mono text-sm">#{data.me.rank} &middot; {data.me.xp} XP</span>
          </div>
        </>
      )}
    </Panel>
  );
}
