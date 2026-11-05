'use client';
import clsx from 'clsx';
import { Panel } from './Panel';
import { useApp } from '@/store/app';

export default function NotificationsPanel() {
  const { notifications, unread, markRead } = useApp();
  return (
    <Panel title="Notifications">
      {unread > 0 && <button className="btn-ghost mb-3 w-full" onClick={() => markRead()}>Mark all as read</button>}
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing yet. Place a bet on an /analyse result and the outcome will show up here.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id}>
              <button onClick={() => !n.isRead && markRead(n.id)} className={clsx('glass flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left', !n.isRead && 'border-nexo-blue/40')}>
                {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-nexo-blue" aria-label="Unread" />}
                <span className="flex-1"><span className="block text-sm">{n.message}</span><span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span></span>
                <span className="font-mono text-sm text-nexo-green">+{n.xpChange}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
