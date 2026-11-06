'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';
import { SearchBox } from './SearchBox';
import { useApp } from '@/store/app';
import { Zap } from 'lucide-react';

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
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome to NexoAi</h1>
          <p className="mt-2 text-lg text-gray-400">Your AI agent for DeFi trading.</p>

          <div className="mt-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm sm:p-8">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">Trade smarter with:</h2>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3"><span className="mt-0.5 text-nexo-blue">◆</span><span><strong className="text-gray-200">AI signals</strong> across timeframes (15-min entry, target, stop-loss).</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-nexo-blue">◆</span><span><strong className="text-gray-200">Real-time data</strong> (Open Interest, funding rates, sentiment flows).</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-nexo-blue">◆</span><span><strong className="text-gray-200">Rewards for accurate calls:</strong> Bet against the AI, win XP, and climb the global leaderboard.</span></li>
            </ul>
          </div>

          <div className="mt-10 w-full max-w-2xl">
            <SearchBox />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRE-LOGIN VIEW (Landing Page)
  // ==========================================
  return (
    <div className="relative flex min-h-full flex-col items-center justify-start overflow-y-auto p-6 py-12">
      
      {/* Background Grid & Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden>
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] animate-drift rounded-full bg-nexo-blue/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-purple-500/20 blur-3xl [animation-delay:-9s]" />
      </div>
      
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center pb-20 mt-8">
        
        {/* Pulsing Radar Logo */}
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexo-blue opacity-40"></span>
          <span className="animate-pulse absolute inline-flex h-24 w-24 rounded-full bg-nexo-blue/20 blur-md"></span>
          <div className="relative z-10"><Logo size="xl" /></div>
        </div>
        
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The AI makes the call. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexo-blue to-green-400">You make the bet.</span>
        </h1>
        
        <p className="mt-6 max-w-xl text-balance text-lg text-gray-400">
          NexoAi is a decentralized AI agent for DeFi. We don't just give you alpha—we let you test your read against the machine in real-time.
        </p>

        {/* Wallet Buttons */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1 py-4 text-base shadow-[0_0_20px_rgba(59,130,246,0.3)]" onClick={() => setModal('create')}>
            Create Wallet
          </button>
          <button className="btn-ghost flex-1 py-4 text-base" onClick={() => setModal('import')}>
            Import Wallet
          </button>
        </div>

        {/* ========================================== */}
        {/* THE SINGLE EXECUTION LAYER BOX */}
        {/* ========================================== */}
        <div className="w-full mt-24 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-[#0F1116] p-8 shadow-2xl text-center flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Zap className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">EXECUTION LAYER</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              NexoAi We gamified the trading experience. By allowing users to bet against the AI, we create a unique data edge a verifiable leaderboard that proves who is actually profitable.
            </p>
          </div>
        </div>

      </div>
      
      <AnimatePresence>
        {modal === 'create' && <CreateWalletModal onClose={() => setModal(null)} />}
        {modal === 'import' && <ImportWalletModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
