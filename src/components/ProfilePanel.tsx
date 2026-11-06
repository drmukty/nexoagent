'use client';
import { useState } from 'react';
import { Panel } from './Panel';
import { ConfirmModal } from './ConfirmModal';
import { api } from '@/lib/client/api';
import { useApp } from '@/store/app';

export default function ProfilePanel() {
  const { me, reset, toast } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!me) return null;

  async function del() {
    setBusy(true);
    try {
      await api('/api/me', { method: 'DELETE' });
      reset();
    } catch {
      toast('Could not delete the account. Try again.', 'error');
      setBusy(false);
    }
  }

  const rows: [string, string][] = [
    ['Wallet', `${me.address.slice(0, 6)}...${me.address.slice(-4)}`],
    ['XP', String(me.xp)],
    ['Rank', `#${me.rank}`],
    ['Joined', new Date(me.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })],
  ];
  return (
    <Panel title="Profile">
      <dl className="glass divide-y divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3"><dt className="text-sm text-gray-400">{k}</dt><dd className="font-mono text-sm">{v}</dd></div>
        ))}
      </dl>
      <button className="btn mt-8 w-full border border-nexo-red/40 text-nexo-red hover:bg-nexo-red/10" onClick={() => setConfirm(true)}>Delete account</button>
      <p className="mt-2 text-xs text-gray-500">Deletes your XP, bets and notifications. Your key was never stored, so there is nothing else to remove.</p>
      {confirm && <ConfirmModal title="Delete account" danger busy={busy} confirmLabel="Delete account" body="This permanently wipes your XP, rank, bets and notifications. You will return to the welcome screen." onCancel={() => setConfirm(false)} onConfirm={del} />}
    </Panel>
  );
}
