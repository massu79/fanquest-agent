import type { ScoredSubmission } from "@/lib/quests";

type LeaderboardProps = {
  entries: ScoredSubmission[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName));

  return (
    <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-white">Leaderboard</h2>
        <span className="rounded bg-cyan-300/10 px-2 py-1 text-sm font-bold text-cyan-100 ring-1 ring-cyan-300/20">
          {sorted.length} fans
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {sorted.length === 0 ? (
          <p className="rounded bg-black/25 p-3 text-sm text-slate-300">
            No submissions yet. The match is live. The quest is on.
          </p>
        ) : (
          sorted.map((entry, index) => (
            <div key={entry.id} className="rounded border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-gradient-to-br from-cyan-300 to-fuchsia-500 font-black text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-white">{entry.displayName}</p>
                    <p className="truncate text-xs text-slate-400">{entry.breakdown.join(" / ")}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-cyan-200">{entry.points}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
