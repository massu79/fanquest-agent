import type { ReactNode } from "react";

export function HypeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.16)]">
      {children}
    </span>
  );
}
