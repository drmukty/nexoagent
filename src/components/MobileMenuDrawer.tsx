'use client';
import { motion } from 'framer-motion';
import { Bell, Trophy, User, X, Info, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/store/app';

export default function MobileMenuDrawer() {
  const { setPanel, unread, reset } = useApp();
  
  const items = [
    { id: 'bell' as const, label: 'Notifications', Icon: Bell, badge: unread },
    { id: 'rank' as const, label: 'Leaderboard', Icon: Trophy, badge: 0 },
    { id: 'profile' as const, label: 'Profile', Icon: User, badge: 0 },
  ];

  const handleLogout = () => {
    reset();
    setPanel(null);
  };

  return (
    <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setPanel(null)}>
      <motion.nav aria-label="Menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }} className="absolute right-0 top-0 h-full w-72 border-l border-white/10 bg-[#0D0F13] pt-[env(safe-area-inset-top)]">
        <div className="flex justify-end p-2">
          <button className="tap" onClick={() => setPanel(null)} aria-label="Close menu"><X className="h-6 w-6" /></button>
        </div>
        
        <ul className="px-3">
          {items.map(({ id, label, Icon, badge }) => (
            <li key={id}>
              <button className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 text-left hover:bg-white/[0.06]" onClick={() => setPanel(id)}>
                <Icon className="h-5 w-5 text-gray-400" /><span className="flex-1">{label}</span>
                {badge > 0 && <span className="rounded-full bg-nexo-blue px-2 text-xs font-medium">{badge}</span>}
              </button>
            </li>
          ))}
          
          {/* Added About Link */}
          <li>
            <Link href="/about" onClick={() => setPanel(null)} className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 text-left hover:bg-white/[0.06]">
              <Info className="h-5 w-5 text-gray-400" /><span className="flex-1">About NexoAi</span>
            </Link>
          </li>
        </ul>

        {/* Added Logout Button */}
        <div className="absolute bottom-8 left-0 w-full px-3">
          <button onClick={handleLogout} className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 text-left text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="flex-1 font-medium">Log out</span>
          </button>
        </div>
      </motion.nav>
    </motion.div>
  );
}
