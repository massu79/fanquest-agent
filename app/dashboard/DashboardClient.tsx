"use client";

import { type FormEvent, useMemo, useState } from "react";
import { CelebrationModal } from "@/components/CelebrationModal";
import { GlowButton } from "@/components/GlowButton";
import { HypeBadge } from "@/components/HypeBadge";
import { InjectiveTechPanel } from "@/components/InjectiveTechPanel";
import { Leaderboard } from "@/components/Leaderboard";
import { MatchCard } from "@/components/MatchCard";
import { QuestCard } from "@/components/QuestCard";
import { RewardPool } from "@/components/RewardPool";
import { XShareCard } from "@/components/XShareCard";
import { calculatePoints, generateQuests, type ScoredSubmission } from "@/lib/quests";
import type { WorldCupMatch } from "@/lib/worldcup-data";
import type { RewardIntensity } from "@/components/RewardCard";

type DashboardClientProps = {
  matches: WorldCupMatch[];
};

function rewardFor(entry: ScoredSubmission): { title: string; badge: string; message: string; intensity: RewardIntensity } {
  if (entry.breakdown.some((item) => item.includes("underdog"))) {
    return { title: "Underdog Alpha", badge: "Legendary bonus hit", message: "You backed the bold pick and the room felt it.", intensity: "legendary" };
  }
  if (entry.breakdown.some((item) => item.includes("winner"))) {
    return { title: "Winner Pick Hit", badge: "Prediction streak live", message: "Your fandom, amplified. Claim your fan moment.", intensity: "medium" };
  }
  return { title: "Quest Cleared", badge: "Fan energy logged", message: "Live quests. Real fan energy. Keep climbing.", intensity: "small" };
}

export function DashboardClient({ matches }: DashboardClientProps) {
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [entries, setEntries] = useState<ScoredSubmission[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [latestReward, setLatestReward] = useState<ScoredSubmission | null>(null);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    winnerPrediction: selectedMatch.homeTeam,
    firstScoringTeam: selectedMatch.homeTeam,
    playerOfMatch: "",
    supportComment: "",
    checkedIn: true
  });

  const quests = useMemo(() => generateQuests(selectedMatch), [selectedMatch]);

  function handleMatchSelect(match: WorldCupMatch) {
    setSelectedMatch(match);
    setForm((current) => ({
      ...current,
      winnerPrediction: match.homeTeam,
      firstScoringTeam: match.homeTeam
    }));
  }

  function submitQuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.displayName.trim()) {
      return;
    }

    const scored = calculatePoints(selectedMatch, {
      ...form,
      displayName: form.displayName.trim()
    });
    setEntries((current) => [scored, ...current.filter((entry) => entry.id !== scored.id)]);
    setLatestReward(scored);
    setRewardOpen(true);
    setForm((current) => ({
      ...current,
      displayName: "",
      playerOfMatch: "",
      supportComment: ""
    }));
  }

  const teams = [selectedMatch.homeTeam, selectedMatch.awayTeam];
  const reward = latestReward ? rewardFor(latestReward) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {latestReward && reward ? (
        <CelebrationModal
          open={rewardOpen}
          onClose={() => setRewardOpen(false)}
          title={reward.title}
          points={latestReward.points}
          badge={reward.badge}
          message={reward.message}
          intensity={reward.intensity}
        />
      ) : null}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <HypeBadge>Predict</HypeBadge>
            <HypeBadge>Compete</HypeBadge>
            <HypeBadge>Reveal</HypeBadge>
            <HypeBadge>Share</HypeBadge>
          </div>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">The match is live. The quest is on.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Select a fixture, invite fans to join, collect free-to-play actions, and reveal a fan reward moment.
          </p>
        </div>
        <a href="/demo" className="focus-ring rounded bg-gradient-to-r from-cyan-300 via-blue-500 to-fuchsia-500 px-5 py-3 text-center font-black text-white hover:brightness-110">
          Open guided showcase
        </a>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-black text-white">Match selector</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} selected={match.id === selectedMatch.id} onSelect={handleMatchSelect} />
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-black text-white">Generated fan quests</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </section>

          <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
            <h2 className="text-xl font-black text-white">Join quest room</h2>
            <p className="mt-2 text-sm text-slate-300">Claim your fan moment with a prediction, a check-in, and a support signal.</p>
            <form onSubmit={submitQuest} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Display name
                <input className="focus-ring rounded border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-slate-500" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} placeholder="Fan name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Winner prediction
                <select className="focus-ring rounded border border-white/10 bg-black/30 px-3 py-2 text-white" value={form.winnerPrediction} onChange={(event) => setForm({ ...form, winnerPrediction: event.target.value })}>
                  {teams.map((team) => <option key={team}>{team}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                First scoring team
                <select className="focus-ring rounded border border-white/10 bg-black/30 px-3 py-2 text-white" value={form.firstScoringTeam} onChange={(event) => setForm({ ...form, firstScoringTeam: event.target.value })}>
                  {teams.map((team) => <option key={team}>{team}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Player of the match vote
                <input className="focus-ring rounded border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-slate-500" value={form.playerOfMatch} onChange={(event) => setForm({ ...form, playerOfMatch: event.target.value })} placeholder="Player name" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 md:col-span-2">
                Support comment
                <textarea className="focus-ring min-h-24 rounded border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-slate-500" value={form.supportComment} onChange={(event) => setForm({ ...form, supportComment: event.target.value })} placeholder="Live quests. Real fan energy." />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <input type="checkbox" checked={form.checkedIn} onChange={(event) => setForm({ ...form, checkedIn: event.target.checked })} />
                Watch party check-in
              </label>
              <GlowButton type="submit">Submit and reveal</GlowButton>
            </form>
          </section>

          <InjectiveTechPanel unlocked={unlocked} onUnlock={() => setUnlocked(true)} />
          <XShareCard match={selectedMatch} entries={entries} />
        </div>

        <aside className="space-y-6">
          {latestReward && reward ? (
            <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">Latest fan moment</p>
              <h2 className="mt-2 text-2xl font-black text-white">{reward.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{latestReward.displayName} earned {latestReward.points} points.</p>
              <button type="button" onClick={() => setRewardOpen(true)} className="focus-ring mt-4 w-full rounded bg-cyan-300/10 px-4 py-3 font-black text-cyan-100 ring-1 ring-cyan-300/25 hover:bg-cyan-300/15">
                Reveal Reward
              </button>
            </section>
          ) : null}
          <Leaderboard entries={entries} />
          <RewardPool entries={entries} />
        </aside>
      </div>
    </div>
  );
}
