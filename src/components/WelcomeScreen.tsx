'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';
import { SearchBox } from './SearchBox';
import { ChatResultBox } from './ChatResultBox';
import { useApp } from '@/store/app';

export function WelcomeScreen() {
  const { me } = useApp();
  const [modal, setModal] = useState<'create' | 'import' | null>(null);

  // ==========================================
  // 1. LOGGED IN VIEW (Dashboard)
  // ==========================================
  if (me) {
    return (
      <div className="relative flex h-[calc(100vh-60px)] w-full flex-col justify-between overflow-hidden">
        <ChatResultBox />
        <div className="w-full">
          <SearchBox />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. PRE-LOGIN VIEW (Landing Page with Wallet Buttons)
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
        
        <p className="mt-4 max-w-md text-balance text-lg text-gray-400 font-medium">
          The AI agent for DeFi trading.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1" onClick={() => setModal('create')}>Create wallet</button>
          <button className="btn-ghost flex-1" onClick={() => setModal('import')}>Import wallet</button>
        </div>

        {/* About Link Box (Simplified) */}
        <div className="mt-10 w-full max-w-sm">
          <Link 
            href="/about" 
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F1116]/80 p-5 transition-all hover:border-white/20 hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nexo-blue/10 text-nexo-blue">
                <Info className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">ABOUT</h3>
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
