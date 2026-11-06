import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowLeft, ShieldCheck, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'About NexoAi | The AI Trading Arena',
  description: 'Learn how NexoAi turns AI crypto analysis into a competitive prediction market. Verifiable proof of trading, non-custodial auth, and $Nexo token incentives.',
};

export default function AboutPage() {
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
      <main className="mx-auto max-w-4xl px-6 py-16">
        
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About NexoAi
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            NexoAi is a gamified AI trading arena. We generate real-time crypto signals and allow users to bet XP on the AI's accuracy. Top XP holders earn future incentives in the $Nexo token.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="rounded-2xl border border-red-500/20 bg-[#0F1116] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">The Core Problem</h2>
            <p className="text-base leading-relaxed text-gray-400">
              The crypto industry is flooded with unverified AI black boxes. Retail traders are forced to blindly trust automated algorithms or paid "gurus" who have zero accountability. When an algorithmic call fails, the trader loses real capital while the platform keeps their subscription fees. There is no proof of accuracy, and no skin in the game.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-white/10 bg-[#0F1116] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexo-blue to-green-400"></div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-nexo-blue/10">
              <Zap className="h-6 w-6 text-nexo-blue" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">The Execution Layer</h2>
            <p className="text-base leading-relaxed text-gray-400 mb-4">
              NexoAi solves this by turning AI analysis into a competitive arena. We don't just give you alpha—we let you test your read against the machine in real-time.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-nexo-blue">◆</span>
                <span>The AI generates a 15-minute trade plan (Entry, Target, Stop-Loss).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-nexo-blue">◆</span>
                <span>The user hits <strong>Agree</strong> or <strong>Disagree</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-nexo-blue">◆</span>
                <span>If the prediction matches the market movement in 15 minutes, the user earns <strong>10 XP</strong>. If incorrect, <strong>1 XP</strong>.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-green-500/20 bg-[#0F1116] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">Proof of Trading</h2>
            <p className="text-base leading-relaxed text-gray-400 mb-4">
              NexoAi is built on absolute transparency. We don't just claim to be profitable; the system mathematically proves it.
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-green-500">◆</span>
                <span><strong>Immutable Timestamps:</strong> Trade plans are locked into the database instantly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-green-500">◆</span>
                <span><strong>Zero Front-Running:</strong> Once a bet is placed, the entry, target, and stop-loss cannot be manipulated.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-green-500">◆</span>
                <span><strong>Oracle Resolution:</strong> At exactly 15 minutes, the server fetches real-time data to resolve the bet. The browser has zero influence.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-purple-500/20 bg-[#0F1116] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">$Nexo Token Incentives</h2>
            <p className="text-base leading-relaxed text-gray-400">
              The Global Leaderboard acts as a verifiable record of every trader's accuracy. It is not just a game—top-performing traders on the leaderboard earn future incentives and airdrops in the <strong>$Nexo token</strong>. We gamify trading accountability and reward the best players.
            </p>
          </section>
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
