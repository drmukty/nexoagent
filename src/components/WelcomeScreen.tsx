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

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome to NexoAi
          </h1>

          <p className="mt-2 text-lg text-gray-400">
            AI-powered crypto market intelligence.
          </p>

          <div className="mt-10 w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm sm:p-8">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Built for smarter decisions
            </h2>

            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span>
                  <strong className="text-gray-200">AI market analysis</strong>{' '}
                  for short-term crypto market conditions and predictions.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span>
                  <strong className="text-gray-200">Market intelligence</strong>{' '}
                  using relevant price, volume, derivatives, sentiment, and
                  market-flow data.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-nexo-blue">◆</span>
                <span>
                  <strong className="text-gray-200">Prediction tracking</strong>{' '}
                  that lets you evaluate decisions and build a measurable
                  performance record.
                </span>
              </li>
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
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center pb-20 pt-8 text-center">
        {/* Logo */}
        <div className="relative z-10">
          <Logo size="xl" />
        </div>

        {/* Hero */}
        <div className="mt-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            AI-Powered Crypto Intelligence
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn market data into
            <br />
            <span className="bg-gradient-to-r from-nexo-blue to-green-400 bg-clip-text text-transparent">
              measurable decisions.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-gray-400 sm:text-lg">
            NexoAi combines AI-driven market analysis with real-time crypto
            intelligence to help you understand market conditions, evaluate
            short-term predictions, and track your performance over time.
          </p>
        </div>

        {/* Wallet Buttons */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <button
            className="btn-primary flex-1 py-4 text-base"
            onClick={() => setModal('create')}
          >
            Create Wallet
          </button>

          <button
            className="btn-ghost flex-1 py-4 text-base"
            onClick={() => setModal('import')}
          >
            Import Wallet
          </button>
        </div>

        {/* Product Features */}
        <div className="mt-16 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0F1116]/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-nexo-blue">
              ◆
            </div>

            <h2 className="mb-2 font-semibold text-white">
              AI Analysis
            </h2>

            <p className="text-sm leading-6 text-gray-500">
              Get structured AI analysis of crypto market conditions and
              short-term opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F1116]/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-nexo-blue">
              ◆
            </div>

            <h2 className="mb-2 font-semibold text-white">
              Market Intelligence
            </h2>

            <p className="text-sm leading-6 text-gray-500">
              Bring price action, volume, derivatives, sentiment, and market
              flows into one research experience.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F1116]/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-nexo-blue">
              ◆
            </div>

            <h2 className="mb-2 font-semibold text-white">
              Track Performance
            </h2>

            <p className="text-sm leading-6 text-gray-500">
              Evaluate your decisions, earn XP, and build a measurable
              prediction track record.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 w-full max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexo-blue">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Research. Decide. Measure.
            </h2>
          </div>

          <div className="grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="text-sm font-semibold text-nexo-blue">
                01
              </span>

              <h3 className="mt-3 font-semibold text-white">
                Analyze
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Ask NexoAi to analyze a token and its current market
                conditions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="text-sm font-semibold text-nexo-blue">
                02
              </span>

              <h3 className="mt-3 font-semibold text-white">
                Decide
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Review the AI prediction and decide whether you agree or
                disagree with the call.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="text-sm font-semibold text-nexo-blue">
                03
              </span>

              <h3 className="mt-3 font-semibold text-white">
                Measure
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Track outcomes, earn XP, and build your performance history.
              </p>
            </div>
          </div>
        </div>

        {/* About Link */}
        <div className="mt-12">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-gray-500 underline underline-offset-4 transition-colors hover:text-white"
          >
            Learn more about NexoAi
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 max-w-2xl">
          <p className="text-xs leading-5 text-gray-600">
            NexoAi provides AI-generated market analysis and predictions for
            informational and educational purposes. Predictions are not
            guarantees of future performance and should not be considered
            financial advice. Always conduct your own research and manage risk
            appropriately.
          </p>
        </div>
      </div>

      {/* Wallet Modals */}
      <AnimatePresence>
        {modal === 'create' && (
          <CreateWalletModal onClose={() => setModal(null)} />
        )}

        {modal === 'import' && (
          <ImportWalletModal onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
