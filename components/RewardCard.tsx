export type RewardIntensity = "small" | "medium" | "legendary";

type RewardCardProps = {
  title: string;
  points: number;
  badge: string;
  message: string;
  intensity: RewardIntensity;
};

const intensityLabel: Record<RewardIntensity, string> = {
  small: "Quest Cleared",
  medium: "Fan MVP",
  legendary: "Community Legend"
};

export function RewardCard({ title, points, badge, message, intensity }: RewardCardProps) {
  return (
    <article className="reward-pop gradient-border relative rounded-lg bg-slate-950/80 p-5 text-center shadow-[0_0_90px_rgba(34,211,238,0.28)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">{intensityLabel[intensity]}</p>
      <h3 className="mt-3 text-3xl font-black text-white">{title}</h3>
      <p className="mt-3 bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-5xl font-black text-transparent">
        +{points}
      </p>
      <p className="mt-2 text-sm font-bold text-fuchsia-100">{badge}</p>
      <p className="mt-4 text-sm leading-6 text-slate-300">{message}</p>
    </article>
  );
}
