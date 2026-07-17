import type { ScoredSubmission } from "@/lib/quests";

type XPostPreviewProps = {
  entries: ScoredSubmission[];
};

export function buildXPost(entries: ScoredSubmission[]) {
  const leader = [...entries].sort((a, b) => b.points - a.points)[0];
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://fanquest-agent.vercel.app/demo";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/massu79/fanquest-agent";

  return `FanQuest Agent makes World Cup fans play: predict, compete, reveal, rank & share.

Quest complete: ${leader?.points ?? 0} pts + reward revealed on Injective Testnet.

Demo: ${demoUrl}
Code: ${githubUrl}
@injective @NinjaLabsHQ @NinjaLabsCN
#InjectiveGlobalCupHackathon`;
}

export function XPostPreview({ entries }: XPostPreviewProps) {
  return (
    <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
      <h2 className="text-xl font-black text-white">X Post Preview</h2>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-black/40 p-4 text-sm leading-6 text-slate-100">
        {buildXPost(entries)}
      </pre>
    </section>
  );
}
