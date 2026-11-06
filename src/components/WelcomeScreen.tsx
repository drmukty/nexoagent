'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';
import { SearchBox } from './SearchBox';
import { useApp } from '@/store/app';

export function WelcomeScreen() {
  const { me } = useApp();
  const [modal, setModal] = useState<'create' | 'import' | null>(null);

  // ==========================================
  // HOME DASHBOARD (Shown when logged in)
  // ==========================================
  if (me) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-6 pb-24 text-center">
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
          <Logo size="xl" />
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome to NexoAi
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Your AI agent for DeFi trading.
          </p>

          <div className="mt-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm sm:p-8">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Trade smarter with:
            </h2>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span><strong className="text-gray-200">AI signals</strong> across timeframes (15-min entry, target, stop-loss).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span><strong className="text-gray-200">Real-time data</strong> (Open Interest, funding rates, sentiment flows).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span><strong className="text-gray-200">Rewards for accurate calls:</strong> Bet against the AI, win XP, and climb the global leaderboard.</span>
              </li>
            </ul>
          </div>

          {/* Centered Search Box inside the Home Dashboard */}
          <div className="mt-10 w-full max-w-2xl">
            <SearchBox />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRE-LOGIN VIEW
  // ==========================================
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] animate-drift rounded-full bg-nexo-blue/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-nexo-purple/20 blur-3xl [animation-delay:-9s]" />
      </div>
      
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <Logo size="xl" />
        <p className="mt-4 max-w-sm text-balance text-gray-400">
          Short-term trade signals, social intelligence and full token reports. Test your read against the AI and climb the board.
        </p>
        
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1" onClick={() => setModal('create')}>Create wallet</button>
          <button className="btn-ghost flex-1" onClick={() => setModal('import')}>Import wallet</button>
        </div>
        
        <p className="mt-6 text-xs text-gray-600">Not financial advice. AI can make mistakes.</p>
      </div>
      
      <AnimatePresence>
        {modal === 'create' && <CreateWalletModal onClose={() => setModal(null)} />}
        {modal === 'import' && <ImportWalletModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
