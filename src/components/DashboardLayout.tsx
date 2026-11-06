'use client';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { ChatResultBox } from './ChatResultBox';
import { SearchBox } from './SearchBox';
import { useApp } from '@/store/app';

// Heavy panels load on demand.
const ProfilePanel = dynamic(() => import('./ProfilePanel'));
const LeaderboardPanel = dynamic(() => import('./LeaderboardPanel'));
const NotificationsPanel = dynamic(() => import('./NotificationsPanel'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));

export function DashboardLayout() {
  const panel = useApp((s) => s.panel);
  return (
    <div className="flex h-[100dvh] flex-col">
      <TopBar />
      <ChatResultBox />
      <SearchBox />
      <AnimatePresence>
        {panel === 'menu' && <MobileMenuDrawer key="menu" />}
        {panel === 'profile' && <ProfilePanel key="profile" />}
        {panel === 'rank' && <LeaderboardPanel key="rank" />}
        {panel === 'bell' && <NotificationsPanel key="bell" />}
      </AnimatePresence>
    </div>
  );
}
