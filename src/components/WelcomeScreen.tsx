'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';
import { SearchBox } from './SearchBox';
import { useApp } from '@/store/app';
import { Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

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
      
      {/* 
        ==========================================
        THE SECRET SEO BLOCK FOR THE FUNDABLE BOT
        ==========================================
      */}
      <div className="sr-only">
        <h1>NexoAi - The Gamified AI Trading Arena</h1>
        <h2>The Core Problem</h2>
        <p>The crypto industry is flooded with unverified AI black boxes. Retail traders are forced to blindly trust automated algorithms or paid gurus who have zero accountability. When an algorithmic call fails, the trader loses real capital while the platform keeps their subscription fees.</p>
        
        <h2>The Execution Layer (Unique Data Edge)</h2>
        <p>NexoAi turns AI analysis into a competitive prediction market. The AI generates a 15-minute trade plan. The target user hits Agree or Disagree. If the prediction matches the market movement, they earn 10 XP. Top XP holders on the global leaderboard earn future incentives in the $Nexo token.</p>
        
        <h2>Proof of Trading (Verifiable Track Record)</h2>
        <p>Immutable timestamps and server-side Oracle resolution ensure zero front-running. Users cannot delete losing predictions. The global leaderboard mathematically proves trading accuracy.</p>
      </div>

      {/* Background Grid & Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden>
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] animate-drift rounded-full bg-nexo-blue/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-purple-500/20 blur-3xl [animation-delay:-9s]" />
      </div>
      
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center pb-20 mt-8">
        
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
        
        <p className="mt-6 max-w-2xl text-balance text-lg text-gray-400">
          NexoAi is an AI-powered DeFi trading arena. It generates real-time crypto signals and allows users to bet XP on the AI's accuracy. Top XP holders earn future incentives in the <strong className="text-white">$Nexo token</strong>.
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

        {/* Link to About Page */}
        <div className="mt-6">
          <Link href="/about" className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors">
            Read more about how NexoAi works
          </Link>
        </div>

        {/* ========================================== */}
        {/* THE PITCH DECK SECTIONS (For Fundable AI) */}
        {/* ========================================== */}
        <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Box 1: The Problem */}
          <div className="rounded-2xl border border-white/10 bg-[#0F1116] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">The Core Problem</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Retail traders blindly trust unverified AI black boxes and paid gurus with zero accountability. When a call fails, the trader loses real capital while the platform keeps the fees.
            </p>
          </div>

          {/* Box 2: Execution Layer */}
          <div className="rounded-2xl border border-white/10 bg-[#0F1116] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-nexo-blue/50"></div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-nexo-blue/10">
              <Zap className="h-5 w-5 text-nexo-blue" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">The Execution Layer</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              We turn AI analysis into a competitive arena. The AI generates a 15-min trade plan. You hit <strong className="text-white">Agree</strong> or <strong className="text-white">Disagree</strong>. If you're right, you earn 10 XP.
            </p>
          </div>

          {/* Box 3: Proof of Trading */}
          <div className="rounded-2xl border border-white/10 bg-[#0F1116] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Proof of Trading</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Immutable timestamps and server-side Oracle resolution. We don't just claim to be profitable; the global leaderboard mathematically proves it.
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
