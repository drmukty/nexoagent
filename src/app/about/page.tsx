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
          <strong className="text-white"> Agree </strong> or
          <strong className="text-white"> Disagree </strong> with the call. 
          Users earn XP based on the outcome of their decisions.
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
          leaderboard. Future ecosystem incentives may also be connected to leaderboard
          performance.
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
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0B0D]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <Link href="/" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to App
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20">
        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            About NexoAi
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turning AI market analysis into measurable decisions.
          </h1>
        </section>

        <section className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1116] shadow-xl transition-colors hover:border-white/20">
                <button onClick={() => toggleSection(index)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-lg font-semibold text-white sm:text-xl">{section.title}</span>
                  </div>
                  <motion.div animate={{ rotate: openSection === index ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openSection === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                      <div className="border-t border-white/5 px-6 pb-7 pt-5">
                        <div className="text-sm leading-7 text-gray-400 sm:text-base">{section.content}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </section>

        <div className="mt-14 text-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]">
            Launch NexoAi
          </Link>
        </div>
      </main>
    </div>
  );
}
