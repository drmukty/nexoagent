'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';
import { SearchBox } from './SearchBox';
import { useApp } from '@/store/app';

export function WelcomeScreen() {
  const { me } = useApp();
  const [modal, setModal] = useState<'create' | 'import' | null>(null);

  // ==========================================
  // LOGGED IN VIEW (Dashboard)
  // ==========================================
  if (me) {
    return (
      <div className="relative flex h-[calc(100vh-60px)] w-full flex-col justify-between overflow-hidden">
        <div className="flex flex-1 flex-col items-center px-4 pt-10 sm:pt-20">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Welcome to NexoAi
          </h1>
          <p className="mt-2 text-lg text-gray-400 text-center">
            Trade smarter with AI signals and win bets.
          </p>
        </div>
        
        {/* SearchBox docked at bottom */}
        <div className="w-full">
          <SearchBox />
        </div>
      </div>
    );
  }

  // ==========================================
  // PRE-LOGIN VIEW (Landing Page)
  // ==========================================
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] animate-drift rounded-full bg-nexo-blue/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-nexo-purple/20 blur-3xl [animation-delay:-9s]" />
      </div>
      
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <Logo size="xl" />
        
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Trade smarter with <br />
          <span className="text-nexo-blue">AI signals & win bets.</span>
        </h1>
        <p className="mt-4 max-w-md text-balance text-gray-400">
          Evaluate short-term predictions, agree or disagree with the AI, and track your performance on the leaderboard.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1" onClick={() => setModal('create')}>Create wallet</button>
          <button className="btn-ghost flex-1" onClick={() => setModal('import')}>Import wallet</button>
        </div>

        {/* About Link Box */}
        <div className="mt-10 w-full max-w-sm">
          <Link 
            href="/about" 
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F1116]/80 p-5 transition-all hover:border-white/20 hover:bg-white/5"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nexo-blue/10 text-nexo-blue">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">What is NexoAi?</h3>
                <p className="text-sm text-gray-500">Learn how the prediction arena works.</p>
              </div>
            </div>
            <span className="text-gray-500 group-hover:text-white">&rarr;</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {modal === 'create' && <CreateWalletModal onClose={() => setModal(null)} />}
        {modal === 'import' && <ImportWalletModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </main>
  );
}
