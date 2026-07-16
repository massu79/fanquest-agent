import type { QuestTemplate } from "@/lib/quests";

type QuestCardProps = {
  quest: QuestTemplate;
};

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <article className="gradient-border relative rounded-lg bg-white/[0.06] p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-200">{quest.type}</p>
          <h3 className="mt-1 font-black text-white">{quest.title}</h3>
        </div>
        <span className="rounded bg-fuchsia-400/15 px-2 py-1 text-sm font-black text-fuchsia-100 ring-1 ring-fuchsia-300/20">
          {quest.basePoints} pts
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{quest.description}</p>
    </article>
  );
}
