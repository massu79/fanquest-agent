const pieces = Array.from({ length: 22 }, (_, index) => index);

export function ConfettiLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
      {pieces.map((piece) => (
        <span
          key={piece}
          className="absolute h-2 w-1 rounded bg-cyan-300 reward-pop"
          style={{
            left: `${8 + ((piece * 37) % 84)}%`,
            top: `${8 + ((piece * 23) % 62)}%`,
            rotate: `${(piece * 29) % 180}deg`,
            background: piece % 3 === 0 ? "#22d3ee" : piece % 3 === 1 ? "#d946ef" : "#facc15",
            animationDelay: `${piece * 24}ms`
          }}
        />
      ))}
    </div>
  );
}
