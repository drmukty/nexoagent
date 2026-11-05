'use client';
import { useEffect } from 'react';
import { useApp } from '@/store/app';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ToastProvider } from '@/components/ToastProvider';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export default function Home() {
  const { booted, me, refresh } = useApp();

  useEffect(() => { void refresh(); }, [refresh]);

  // Near-real-time: rank, XP, notifications and bet resolution all arrive through this poll.
  useEffect(() => {
    if (!me) return;
    const id = setInterval(() => { if (!document.hidden) void refresh(); }, 5000);
    return () => clearInterval(id);
  }, [me, refresh]);

  return (
    <>
      {!booted ? (
        <div className="flex min-h-screen items-center justify-center p-6"><LoadingSkeleton lines={3} className="w-72" /></div>
      ) : me ? (
        <DashboardLayout />
      ) : (
        <WelcomeScreen />
      )}
      <ToastProvider />
    </>
  );
}
