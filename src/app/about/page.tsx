'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-gray-300 selection:bg-nexo-blue/30">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0B0D]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <Link href="/" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About NexoAi
          </h1>
          <p className="mt-4 text-xl font-medium text-nexo-blue">
            The AI makes the call. You decide whether to back it.
          </p>
          <div className="mt-8 space-y-4 text-base leading-7 text-gray-400">
            <p>
              NexoAi is a decentralized AI trading arena built to make crypto predictions more transparent, measurable, and accountable.
            </p>
            <p>
              Instead of simply following signals, users can <strong className="text-white">bet with or against the AI</strong>, test their own market judgment, and build a verifiable track record through real market outcomes.
            </p>
            <p>
              NexoAi generates short-term trade plans with an entry, target, and stop-loss. Users choose <strong className="text-white">Agree</strong> or <strong className="text-white">Disagree</strong>, the prediction is locked, and the result is evaluated against real market data after the defined timeframe.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-wider text-white uppercase">
              The Core Experience
            </h2>
            <p className="mb-4 leading-7 text-gray-400">
              NexoAi brings AI analysis and market intelligence into one trading workflow through tools such as <strong className="text-white">Analyse, Mindshare, Report, and Trending</strong>.
            </p>
            <p className="mb-4 leading-7 text-gray-400">
              Users can research an asset, understand its market activity and sentiment, receive a structured prediction, and then put their own judgment to the test.
            </p>
            <p className="leading-7 text-gray-400">
              Successful predictions earn XP, while every result contributes to a user's performance history and the global leaderboard.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-wider text-white uppercase">
              Proof of Trading
            </h2>
            <p className="mb-6 leading-7 text-gray-400">
              At the heart of NexoAi is <strong className="text-white">Proof of Trading</strong>.
            </p>
            <p className="mb-4 leading-7 text-gray-400">
              Predictions are timestamped and locked when submitted. Results are resolved server-side using real market data, creating a persistent record that cannot simply be edited or selectively presented.
            </p>
            <p className="leading-7 text-gray-400">
              The goal is simple: <strong className="text-white">replace claims of accuracy with measurable performance.</strong>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-wider text-white uppercase">
              Built for the Future of AI Trading
            </h2>
            <p className="mb-4 leading-7 text-gray-400">
              NexoAi combines AI, real-time market intelligence, gamification, and verifiable performance into a new trading experience.
            </p>
            <p className="leading-7 text-gray-400">
              We are building toward a world where traders don't just follow AI  they <strong className="text-white">challenge it, compete with it, and prove their own edge.</strong>
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 text-xs text-gray-600 sm:flex-row">
          <span>© {new Date().getFullYear()} NexoAi. All rights reserved.</span>
          <span>Research. Decide. Measure.</span>
        </div>
      </footer>
    </div>
  );
}
