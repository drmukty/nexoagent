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
      
      <main className="relative flex-1 overflow-hidden">
        {/* Show Home Dashboard if logged out OR explicitly on the 'home' view */}
        {!me || view === 'home' ? (
          <WelcomeScreen />
        ) : (
          /* Otherwise, show the Chat */
          <div className="flex h-full flex-col">
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
