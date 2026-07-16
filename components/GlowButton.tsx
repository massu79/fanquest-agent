import type { ButtonHTMLAttributes, ReactNode } from "react";

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "primary" | "secondary";
};

export function GlowButton({ children, tone = "primary", className = "", ...props }: GlowButtonProps) {
  const toneClass =
    tone === "primary"
      ? "from-cyan-300 via-blue-500 to-fuchsia-500 text-white"
      : "from-white/15 via-cyan-400/15 to-fuchsia-500/20 text-cyan-50 ring-1 ring-white/15";

  return (
    <button
      {...props}
      className={`focus-ring pulse-glow rounded px-5 py-3 font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}
