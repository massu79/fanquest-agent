import type { ScoredSubmission } from "@/lib/quests";
import type { WorldCupMatch } from "@/lib/worldcup-data";

type XPostPreviewProps = {
  match: WorldCupMatch;
  entries: ScoredSubmission[];
};

export function buildXPost(match: WorldCupMatch, entries: ScoredSubmission[]) {
  const leader = [...entries].sort((a, b) => b.points - a.points)[0]?.displayName ?? "the community";
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://fanquest-agent.example/demo";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/massu79/fanquest-agent";

  return `Built FanQuest Agent for The Injective Global Cup: a World Cup fan engagement app that turns every match into a hype engine.

Predict. Compete. Reveal. Rank. Claim. Share.

It replaces watch-party chaos with live World Cup results, quests, points, reward reveals, and an Injective Testnet Claim receipt flow.

Demo: ${demoUrl}
Match: ${match.homeTeam} vs ${match.awayTeam}, current leader: ${leader}
GitHub: ${githubUrl}

@injective @NinjaLabsHQ @NinjaLabsCN
#InjectiveGlobalCupHackathon`;
}

export function XPostPreview({ match, entries }: XPostPreviewProps) {
  return (
    <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
      <h2 className="text-xl font-black text-white">X Post Preview</h2>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-black/40 p-4 text-sm leading-6 text-slate-100">
        {buildXPost(match, entries)}
      </pre>
    </section>
  );
}