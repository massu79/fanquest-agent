import type { ScoredSubmission } from "@/lib/quests";
import { buildXPost } from "./XPostPreview";

type XShareCardProps = {
  entries: ScoredSubmission[];
};

export function XShareCard({ entries }: XShareCardProps) {
  return (
    <section className="gradient-border relative rounded-lg bg-slate-950/70 p-5 shadow-panel">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Share-ready X post</p>
      <h2 className="mt-2 text-2xl font-black text-white">Reveal. Share. Rally the timeline.</h2>
      <pre className="mt-4 whitespace-pre-wrap rounded bg-black/40 p-4 text-sm leading-6 text-slate-100">
        {buildXPost(entries)}
      </pre>
    </section>
  );
}
