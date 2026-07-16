export function GlowBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-lg">
      <div className="h-48 w-48 rounded-full bg-cyan-300/30 blur-2xl reward-pop" />
      <div className="absolute h-72 w-72 rounded-full border border-fuchsia-300/30 reward-pop" />
      <div className="absolute h-40 w-40 rounded-full border border-cyan-200/30 reward-pop [animation-delay:120ms]" />
    </div>
  );
}
