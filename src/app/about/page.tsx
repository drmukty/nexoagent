'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "Why we built NexoAi",
      content: (
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p className="text-lg font-medium text-white italic">
            The first AI trading arena where the AI makes the call, and you make the bet.
          </p>
          <p>
            Crypto signal space is a mess. Retail traders are constantly sold "alpha" by anonymous gurus or automated bots that have zero accountability. When a trade goes south, the trader loses their hard-earned money, but the guru just keeps their subscription fee.
          </p>
          <p>
            We built NexoAi because we were tired of the blind trust. We wanted to create a space where the AI has to put its money where its mouth is. If the AI makes a call, you should be able to test it, verify it, and prove whether it's actually profitable.
          </p>
        </div>
      )
    },
    {
      title: "How the Execution Layer works",
      content: (
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            NexoAi is not just a chatbot that spits out signals. We gamified the entire process.
          </p>
          <p>
            When you ask the AI for a 15-minute trade plan, you are given two options: <strong className="text-white">Agree</strong> or <strong className="text-white">Disagree</strong>.
          </p>
          <p>
            If you agree and the target is hit within 15 minutes, you earn <strong className="text-nexo-green">10 XP</strong>. If you disagree and the AI is wrong, you also earn <strong className="text-nexo-green">10 XP</strong>. But if you lose, you only get <strong className="text-gray-400">1 XP</strong>.
          </p>
          <p>
            This forces both the user and the AI to be accountable. There is no cherry-picking. Every call is locked in with an immutable timestamp.
          </p>
        </div>
      )
    },
    {
      title: "The $Nexo Token Incentive",
      content: (
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            We believe that real trading talent should be rewarded, not just the platform owners.
          </p>
          <p>
            The Global Leaderboard isn't just for bragging rights. It is the core of our community ecosystem.XP Holders will receive future incentives and airdrops in the <strong className="text-white">$Nexo token</strong>.
          </p>
          <p>
            We are shifting the power dynamic. Instead of paying monthly fees to a faceless signal group, you are proving your edge, climbing the ranks, and getting rewarded by the protocol itself.
          </p>
        </div>
      )
    },
    {
      title: "Non-Custodial & Verifiable",
      content: (
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            NexoAi is 100% non-custodial
          </p>
          <p>
            When you use our app, your EVM private key is generated or imported directly in your browser and <strong className="text-white">never touches our servers</strong>. We only store your public wallet address so you can access your dashboard and track your XP.
          </p>
          <p>
            let make AI Greater.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0B0D]/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About NexoAi
          </h1>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1116] shadow-xl transition-colors hover:border-white/20"
            >
              <button
                onClick={() => toggleSection(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="text-xl font-bold text-white">{section.title}</span>
                <motion.div
                  animate={{ rotate: openSection === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-5 w-5 text-nexo-blue" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {openSection === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="border-t border-white/5 px-6 pb-6 pt-4 text-sm sm:text-base">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-xl bg-nexo-blue px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            Launch NexoAi App
          </Link>
        </div>

      </main>
    </div>
  );
}
