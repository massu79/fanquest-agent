"use client";

import { RewardRevealBox } from "./RewardRevealBox";
import type { RewardIntensity } from "./RewardCard";

type CelebrationModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  points: number;
  badge: string;
  message: string;
  intensity: RewardIntensity;
};

export function CelebrationModal({ open, onClose, title, points, badge, message, intensity }: CelebrationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 backdrop-blur-md">
      <div className="gradient-border relative w-full max-w-lg rounded-lg bg-slate-950 p-4 shadow-[0_0_120px_rgba(34,211,238,0.25)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Claim your fan moment</p>
            <h2 className="text-2xl font-black text-white">Reward reveal</h2>
          </div>
          <button className="focus-ring rounded border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/10" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <RewardRevealBox title={title} points={points} badge={badge} message={message} intensity={intensity} />
      </div>
    </div>
  );
}
