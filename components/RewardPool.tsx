import type { ScoredSubmission } from "@/lib/quests";

type RewardPoolProps = {
  entries: ScoredSubmission[];
  totalUsdc?: number;
};

export function RewardPool({ entries, totalUsdc = 250 }: RewardPoolProps) {
  const topEntries = [...entries].sort((a, b) => b.points - a.points).slice(0, 3);
  const splits = [0.5, 0.3, 0.2];

  return (
    <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
      <h2 className="text-xl font-black text-white">Reward Pool</h2>
      <div className="mt-4 rounded-lg bg-gradient-to-br from-cyan-300/15 to-fuchsia-500/15 p-4 ring-1 ring-white/10">
        <p className="text-sm font-bold text-cyan-100">Mock sponsor pool</p>
        <p className="mt-1 text-3xl font-black text-white">{totalUsdc} USDC</p>
        <p className="mt-2 text-sm text-slate-300">Free-to-play points only. No wagering or real-fund demo required.</p>
      </div>
      <div className="mt-4 space-y-2">
        {topEntries.length === 0 ? (
          <p className="rounded bg-black/25 p-3 text-sm text-slate-300">
            Reward distribution appears after fan submissions.
          </p>
        ) : (
          topEntries.map((entry, index) => (
            <div key={entry.id} className="flex items-center justify-between rounded border border-white/10 bg-black/20 px-3 py-2">
              <span className="font-bold text-white">{entry.displayName}</span>
              <span className="font-black text-cyan-200">{Math.round(totalUsdc * splits[index])} USDC</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
