'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
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
      
      {/* SECRET SEO BLOCK FOR THE FUNDABLE BOT (Invisible to users) */}
      <div className="sr-only">
        <h1>NexoAi - The Gamified AI Trading Arena</h1>
        <h2>The Core Problem</h2>
        <p>Retail traders blindly trust unverified AI black boxes and paid gurus with zero accountability. When a call fails, the trader loses real capital while the platform keeps the fees.</p>
        <h2>The Execution Layer (Unique Data Edge)</h2>
        <p>We turn AI analysis into a competitive arena. The AI generates a 15-min trade plan. You hit Agree or Disagree. If you're right, you earn 10 XP. Top XP holders earn future $Nexo token incentives.</p>
        <h2>Proof of Trading (Verifiable Track Record)</h2>
        <p>Immutable timestamps and server-side Oracle resolution. The global leaderboard mathematically proves trading accuracy.</p>
      </div>

      {/* Background Grid Only (No glowing orbs) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden>
      </div>
      
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center pb-20 mt-8">
        
        {/* Logo (No pulsing radar) */}
        <div className="relative z-10">
          <Logo size="xl" />
        </div>
        
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The AI makes the call. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexo-blue to-green-400">You make the bet.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-balance text-lg text-gray-400">
          NexoAi is an decentralized AI agent for DeFi trading. It generates real-time crypto signals and allows users to bet XP on the AI's accuracy <strong className="text-white">$Nexo token</strong>.
        </p>

        {/* Wallet Buttons (No glowing shadows) */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1 py-4 text-base" onClick={() => setModal('create')}>
            Create Wallet
          </button>
          <button className="btn-ghost flex-1 py-4 text-base" onClick={() => setModal('import')}>
            Import Wallet
          </button>
        </div>

        {/* Link to About Page */}
        <div className="mt-8">
          <Link href="/about" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors">
            Read more about how NexoAi works
          </Link>
        </div>

      </div>
      
      <AnimatePresence>
        {modal === 'create' && <CreateWalletModal onClose={() => setModal(null)} />}
        {modal === 'import' && <ImportWalletModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
