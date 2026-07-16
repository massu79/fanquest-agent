import { HypeBadge } from "@/components/HypeBadge";
import { injectivePlan } from "@/lib/injective-plan";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        <HypeBadge>Architecture</HypeBadge>
        <HypeBadge>Injective Testnet</HypeBadge>
        <HypeBadge>Free-to-play</HypeBadge>
      </div>
      <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl">How FanQuest Agent works</h1>
      <p className="mt-4 leading-7 text-slate-300">
        FanQuest Agent is a World Cup fan engagement app for watch parties, Discord communities, and Web3 fan campaigns.
        It keeps the product simple: live quests, free-to-play predictions, points, reward reveals, and clear Injective technology status.
      </p>

      <div className="mt-8 grid gap-5">
        {[
          ["User flow", "The guided demo takes a fan from identity and wallet setup through a real World Cup result, predictions, reward reveal, leaderboard, Claim receipt, and X share copy."],
          ["World Cup data", "lib/worldcup-data.ts reads recent FIFA World Cup matches from the keyless ESPN public scoreboard, displays source and update time, and uses a clearly labeled deterministic fallback when needed."],
          ["Quest engine", "lib/quests.ts contains templates, match-specific generation, and deterministic point scoring with no gambling mechanics."],
          ["Reward reveal", "A completed prediction opens a glowing reward box with points, badge, confetti, leaderboard movement, and share copy."],
          ["Data model", "MetaMask connects to Injective EVM Testnet, reads INJ balance, submits a zero-value Claim memo, waits for its receipt, and opens Blockscout. Reward payout remains demo accounting until a funded contract is deployed."]
        ].map(([title, body]) => (
          <section key={title} className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{body}</p>
          </section>
        ))}
      </div>

      <section className="gradient-border relative mt-8 rounded-lg bg-white/[0.06] p-5 shadow-panel">
        <h2 className="text-xl font-black text-white">Injective technology status</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-white/10 bg-black/25 p-4">
            <h3 className="font-black text-cyan-100">x402</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{injectivePlan.x402.flow.join(" ")}</p>
          </div>
          <div className="rounded border border-white/10 bg-black/25 p-4">
            <h3 className="font-black text-fuchsia-100">USDC CCTP</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{injectivePlan.cctp.flow.join(" ")}</p>
          </div>
          <div className="rounded border border-white/10 bg-black/25 p-4">
            <h3 className="font-black text-cyan-100">MCP Server</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{injectivePlan.mcp.queryLog.join(" ")}</p>
          </div>
          <div className="rounded border border-white/10 bg-black/25 p-4">
            <h3 className="font-black text-fuchsia-100">Agent Skills</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{injectivePlan.agentSkills.workflow.join(" ")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
