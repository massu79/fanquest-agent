import { injectivePlan } from "@/lib/injective-plan";
import { GlowButton } from "./GlowButton";

type InjectiveTechPanelProps = {
  unlocked?: boolean;
  onUnlock?: () => void;
};

export function InjectiveTechPanel({ unlocked = false, onUnlock }: InjectiveTechPanelProps) {
  return (
    <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Injective mapping</p>
          <h2 className="mt-1 text-2xl font-black text-white">Unlock the moment</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">The guided demo uses live World Cup and Injective reads. x402, CCTP, and MCP remain clearly labeled prototypes.</p>
        </div>
        <GlowButton type="button" onClick={onUnlock} className="text-sm">
          {unlocked ? "Prototype Preview" : "Preview x402 flow"}
        </GlowButton>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-black/25 p-4">
          <h3 className="font-black text-white">{injectivePlan.x402.title}</h3>
          <p className="mt-1 text-sm text-slate-300">
            Status: <span className="font-bold text-cyan-200">{unlocked ? "prototype preview" : injectivePlan.x402.status}</span> / Amount: {injectivePlan.x402.amount}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {injectivePlan.x402.flow.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          {unlocked ? (
            <p className="mt-3 rounded bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100 ring-1 ring-cyan-300/20">
              Premium insight: crowd energy favors late-match quests and underdog bonus storytelling.
            </p>
          ) : null}
        </article>

        <article className="rounded-lg border border-white/10 bg-black/25 p-4">
          <h3 className="font-black text-white">USDC CCTP Reward Funding</h3>
          <p className="mt-1 text-sm text-slate-300">
            {injectivePlan.cctp.sourceChain} to {injectivePlan.cctp.destinationChain}
          </p>
          <p className="mt-1 text-sm font-bold text-fuchsia-100">
            {injectivePlan.cctp.amount} / {injectivePlan.cctp.status}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {injectivePlan.cctp.flow.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg border border-white/10 bg-black/25 p-4">
          <h3 className="font-black text-white">{injectivePlan.mcp.title}</h3>
          <div className="mt-3 space-y-2">
            {injectivePlan.mcp.queryLog.map((query) => (
              <code key={query} className="block rounded bg-black/40 p-2 text-xs text-cyan-100 ring-1 ring-white/10">
                {query}
              </code>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-black/25 p-4">
          <h3 className="font-black text-white">{injectivePlan.agentSkills.title}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {injectivePlan.agentSkills.workflow.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
