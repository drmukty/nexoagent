'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowLeft, ChevronDown, ShieldCheck, Target, BarChart3, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: 'What is NexoAi?',
      icon: Target,
      content: (
        <p>
          NexoAi is an AI-powered crypto research and prediction platform designed
          to make short-term market analysis more structured, transparent, and
          measurable.
          <br /><br />
          Instead of relying on anonymous calls or unverified trading signals,
          NexoAi turns AI market analysis into a measurable prediction process.
          Each analysis provides a defined market direction and timeframe, allowing
          users to evaluate the outcome rather than simply taking someone’s word
          for it.
        </p>
      ),
    },
    {
      title: 'How the Prediction Arena Works',
      icon: BarChart3,
      content: (
        <p>
          NexoAi is built around a simple idea: predictions should be evaluated
          by their results.
          <br /><br />
          When the AI generates a short-term prediction, users can choose to
          <strong className="text-white"> Agree </strong>
          or
          <strong className="text-white"> Disagree </strong>
          with the call. The prediction is then evaluated against the defined
          market conditions and timeframe.
          <br /><br />
          Users earn XP based on the outcome of their decisions. This creates a
          performance-based environment where users can build a track record
          instead of simply following signals.
        </p>
      ),
    },
    {
      title: 'Performance & Leaderboard',
      icon: Trophy,
      content: (
        <p>
          NexoAi introduces a leaderboard designed to recognize consistent
          decision-making and prediction accuracy.
          <br /><br />
          Your performance is represented through XP and your position on the
          leaderboard. The goal is not simply to make one successful prediction,
          but to develop a consistent track record over time.
          <br /><br />
          Future ecosystem incentives may also be connected to leaderboard
          performance, including potential rewards associated with the
          <strong className="text-white"> $NEXO </strong>
          ecosystem.
        </p>
      ),
    },
    {
      title: 'Non-Custodial by Design',
      icon: ShieldCheck,
      content: (
        <p>
          Security and user ownership are fundamental to NexoAi.
          <br /><br />
          NexoAi is designed around a non-custodial architecture. Your private
          key is handled locally in your browser and is not intended to be
          transmitted to or stored on NexoAi servers.
          <br /><br />
          The platform only needs your public wallet address for account
          identification and dashboard functionality. This architecture is
          designed to keep control of user assets with the user rather than
          with the platform.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0B0D]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-20">
        {/* Hero */}
        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            About NexoAi
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turning AI market analysis into measurable decisions.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            NexoAi is an AI-powered crypto intelligence platform built to make
            short-term market predictions structured, measurable, and easier to
            evaluate.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-[#0F1116] p-7 shadow-2xl sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-nexo-blue">
            Our approach
          </p>

          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Less noise. More accountability.
          </h2>

          <p className="max-w-3xl text-base leading-7 text-gray-400">
            Crypto markets move quickly, and traders are exposed to an enormous
            amount of fragmented information. NexoAi was created to bring
            market data, AI analysis, and user decision-making into one
            structured environment.
          </p>

          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">
            Rather than presenting predictions as guaranteed outcomes, NexoAi
            treats them as testable market calls. The objective is to build a
            transparent environment where performance can be observed over time.
          </p>
        </section>

        {/* Accordion */}
        <section className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1116] shadow-xl transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={openSection === index}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-5 w-5 text-nexo-blue" />
                    </div>

                    <span className="text-lg font-semibold text-white sm:text-xl">
                      {section.title}
                    </span>
                  </div>

                  <motion.div
                    animate={{
                      rotate: openSection === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="border-t border-white/5 px-6 pb-7 pt-5">
                        <div className="text-sm leading-7 text-gray-400 sm:text-base">
                          {section.content}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </section>

        {/* Disclaimer */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-300">
            Important Notice
          </h3>

          <p className="text-xs leading-6 text-gray-500 sm:text-sm">
            NexoAi provides AI-generated market analysis and predictions for
            informational and educational purposes. Market predictions are not
            guarantees of future performance and should not be considered
            financial advice. Users are responsible for their own trading
            decisions and risk management.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold text-white">
            Put the predictions to the test.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
            Explore the market, evaluate AI predictions, and build your
            performance record.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-nexo-blue px-8 py-4 font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
          >
            Launch NexoAi
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-gray-600 sm:flex-row">
          <span>© {new Date().getFullYear()} NexoAi. All rights reserved.</span>

          <span>AI-powered crypto market intelligence.</span>
        </div>
      </footer>
    </div>
  );
}
