'use client';
import { Bell, Menu, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';
import { useApp } from '@/store/app';

export function TopBar() {
  const { me, unread, setPanel } = useApp();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-nexo-bg/80 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md sm:px-5">
      
      {/* Clicking Logo routes to Home */}
      <Link href="/" className="transition-opacity hover:opacity-80">
        <Logo />
      </Link>

      <div className="glass flex items-center gap-2 px-3 py-1.5" aria-label="Your XP">
        <span className="label">XP</span>
        <span className="font-display text-base font-semibold tabular-nums text-nexo-green">{me?.xp ?? 0}</span>
      </div>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Account">
        <button className="tap" onClick={() => setPanel('profile')} aria-label="Profile"><User className="h-5 w-5" /></button>
        <button className="tap" onClick={() => setPanel('rank')} aria-label="Leaderboard"><Trophy className="h-5 w-5" /></button>
        <button className="tap relative" onClick={() => setPanel('bell')} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute right-1 top-1 min-w-[18px] rounded-full bg-nexo-blue px-1 text-center text-[11px] font-medium leading-[18px]">{unread}</span>}
        </button>
      </nav>
      <button className="tap relative md:hidden" onClick={() => setPanel('menu')} aria-label="Open menu">
        <Menu className="h-6 w-6" />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-nexo-blue" />}
      </button>
    </header>
  );
}
