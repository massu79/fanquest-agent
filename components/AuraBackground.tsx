export function AuraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_80%_8%,rgba(168,85,247,0.2),transparent_30%),radial-gradient(circle_at_55%_80%,rgba(236,72,153,0.14),transparent_32%)]" />
      <div className="aurora-orbit absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="aurora-orbit absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:1.2s]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] opacity-30" />
    </div>
  );
}
