'use client';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Logo } from './Logo';
import { CreateWalletModal } from './CreateWalletModal';
import { ImportWalletModal } from './ImportWalletModal';

export function WelcomeScreen() {
  const [modal, setModal] = useState<'create' | 'import' | null>(null);
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] animate-drift rounded-full bg-nexo-blue/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift rounded-full bg-nexo-purple/20 blur-3xl [animation-delay:-9s]" />
      </div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <Logo size="xl" />
        <p className="mt-4 max-w-sm text-balance text-gray-400">Short-term trade signals, social intelligence and full token reports. Test your read against the AI and climb the board.</p>
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
    </main>
  );
}
