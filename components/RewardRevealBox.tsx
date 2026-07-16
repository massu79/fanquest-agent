"use client";

import { useState } from "react";
import { ConfettiLayer } from "./ConfettiLayer";
import { GlowBurst } from "./GlowBurst";
import { GlowButton } from "./GlowButton";
import { RewardCard, type RewardIntensity } from "./RewardCard";

type RewardRevealBoxProps = {
  title: string;
  points: number;
  badge: string;
  message: string;
  intensity: RewardIntensity;
};

export function RewardRevealBox({ title, points, badge, message, intensity }: RewardRevealBoxProps) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative min-h-80 overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 p-5">
      {opened ? <ConfettiLayer /> : null}
      {opened ? <GlowBurst /> : null}
      <div className="relative z-10 grid min-h-72 place-items-center">
        {opened ? (
          <RewardCard title={title} points={points} badge={badge} message={message} intensity={intensity} />
        ) : (
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="focus-ring float-slow gradient-border relative grid h-52 w-52 place-items-center rounded-lg bg-gradient-to-br from-slate-900 via-cyan-950 to-fuchsia-950 text-center shadow-[0_0_100px_rgba(34,211,238,0.25)]"
          >
            <span className="absolute inset-5 rounded border border-cyan-300/25" />
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.25em] text-cyan-200">Reward Capsule</span>
              <span className="mt-3 block text-2xl font-black text-white">Reveal Reward</span>
              <span className="mt-2 block text-sm text-slate-300">Unlock the moment</span>
            </span>
          </button>
        )}
      </div>
      {opened ? (
        <div className="relative z-10 mt-4 flex justify-center">
          <GlowButton tone="secondary" type="button">Share to X</GlowButton>
        </div>
      ) : null}
    </div>
  );
}
