import Link from "next/link";
import { HypeBadge } from "@/components/HypeBadge";

const badges = ["World Cup Data", "Injective x402", "USDC CCTP", "MCP Server", "Agent Skills"];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => <HypeBadge key={badge}>{badge}</HypeBadge>)}
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-cyan-200">The Injective Global Cup MVP</p>
            <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Turn Every Match Into a Hype Engine
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-slate-200">
              FanQuest Agent turns World Cup watch parties into live quests, real fan energy, reward reveals, and an Injective Testnet claim-receipt flow.
            </p>
            <p className="mt-4 text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-fuchsia-300">
              Predict. Compete. Reveal. Share.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="focus-ring pulse-glow rounded bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500 px-6 py-3 text-center font-black text-white hover:brightness-110"
              >
                Start Demo
              </Link>
              <Link
                href="/demo"
                className="focus-ring rounded border border-white/15 bg-white/10 px-6 py-3 text-center font-bold text-white hover:bg-white/15"
              >
                Watch showcase
              </Link>
            </div>
          </div>

          <div className="gradient-border relative rounded-lg bg-white/[0.07] p-5 shadow-[0_0_90px_rgba(34,211,238,0.16)] backdrop-blur-xl">
            <div className="rounded bg-slate-950/75 p-4 text-white ring-1 ring-white/10">
              <p className="text-sm font-black uppercase tracking-wide text-cyan-200">Live quest room</p>
              <h2 className="mt-2 text-3xl font-black">Japan vs Brazil</h2>
              <p className="mt-2 text-sm text-slate-300">The match is live. The quest is on.</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded bg-cyan-300/10 p-3 ring-1 ring-cyan-300/20">
                  <p className="text-xs text-cyan-100">Fans</p>
                  <p className="text-2xl font-black">128</p>
                </div>
                <div className="rounded bg-fuchsia-400/10 p-3 ring-1 ring-fuchsia-300/20">
                  <p className="text-xs text-fuchsia-100">Quests</p>
                  <p className="text-2xl font-black">5</p>
                </div>
                <div className="rounded bg-amber-300/10 p-3 ring-1 ring-amber-200/20">
                  <p className="text-xs text-amber-100">Pool</p>
                  <p className="text-2xl font-black">250</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {["Winner Pick Hit", "First Goal Bonus", "Underdog Alpha"].map((quest) => (
                  <div key={quest} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.04] px-3 py-2">
                    <span className="font-bold">{quest}</span>
                    <span className="text-sm font-black text-cyan-200">active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Live quests", "Hosts select a fixture and generate match-day prompts that feel natural in a watch party."],
            ["Reward reveals", "Fans submit free-to-play actions, score points, and open a glowing reward capsule."],
            ["Injective-ready", "x402, CCTP, MCP, and Agent Skills are mapped clearly without requiring real funds."]
          ].map(([title, body]) => (
            <article key={title} className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
