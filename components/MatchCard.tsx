import type { WorldCupMatch } from "@/lib/worldcup-data";

type MatchCardProps = {
  match: WorldCupMatch;
  selected?: boolean;
  onSelect?: (match: WorldCupMatch) => void;
};

const statusTone = {
  upcoming: "bg-sky-400/15 text-sky-100 ring-sky-300/30",
  live: "bg-rose-400/15 text-rose-100 ring-rose-300/30",
  halftime: "bg-amber-400/15 text-amber-100 ring-amber-300/30",
  finished: "bg-emerald-400/15 text-emerald-100 ring-emerald-300/30"
};

export function MatchCard({ match, selected = false, onSelect }: MatchCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(match)}
      className={`focus-ring gradient-border relative w-full rounded-lg p-4 text-left transition hover:-translate-y-0.5 ${
        selected ? "bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.22)]" : "bg-white/[0.06] hover:bg-white/[0.09]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-200">{match.round}</p>
          <h3 className="mt-1 text-lg font-black text-white">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ring-1 ${statusTone[match.status]}`}>
          {match.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <p className="truncate font-bold text-slate-100">{match.homeTeam}</p>
        <p className="rounded bg-black/35 px-3 py-1 text-lg font-black text-cyan-100 ring-1 ring-white/10">
          {match.score.home} - {match.score.away}
        </p>
        <p className="truncate text-right font-bold text-slate-100">{match.awayTeam}</p>
      </div>
      <p className="mt-4 text-sm text-slate-300">{new Date(match.kickoff).toLocaleString()}</p>
      <p className="mt-1 text-sm text-slate-400">{match.venue}</p>
      <p className="mt-3 rounded bg-black/25 p-2 text-sm text-cyan-50">{match.liveEvent}</p>
    </button>
  );
}
