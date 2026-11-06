'use client';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { ChatResultBox } from './ChatResultBox';
import { SearchBox } from './SearchBox';
import { WelcomeScreen } from './WelcomeScreen';
import { useApp } from '@/store/app';

// Heavy panels load on demand.
const ProfilePanel = dynamic(() => import('./ProfilePanel'));
const LeaderboardPanel = dynamic(() => import('./LeaderboardPanel'));
const NotificationsPanel = dynamic(() => import('./NotificationsPanel'));
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'));

export function DashboardLayout() {
  const { panel, me, view } = useApp();

  return (
    <div className="flex h-[100dvh] flex-col bg-nexo-bg">
      <TopBar />
      
      <main className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
        {!me || view === 'home' ? (
          // Welcome Screen now handles its own scrolling
          <div className="flex-1 overflow-y-auto">
            <WelcomeScreen />
          </div>
        ) : (
          // Chat view uses flex-1 and min-h-0 to allow ChatResultBox to scroll
          <div className="flex flex-1 flex-col min-h-0">
            <ChatResultBox />
            <SearchBox />
          </div>
        )}
      </main>

      <AnimatePresence>
        {panel === 'menu' && <MobileMenuDrawer key="menu" />}
        {panel === 'profile' && <ProfilePanel key="profile" />}
        {panel === 'rank' && <LeaderboardPanel key="rank" />}
        {panel === 'bell' && <NotificationsPanel key="bell" />}
      </AnimatePresence>
    </div>
  );
}
