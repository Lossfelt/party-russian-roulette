interface ChamberDisplayProps {
  chambers: number;
  bullets: number;
  size?: number;
  spinning?: boolean;
}

export function ChamberDisplay({
  chambers,
  bullets,
  size = 120,
  spinning = false,
}: ChamberDisplayProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`chamber-display ${spinning ? 'spinning' : ''}`}
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        opacity="0.3"
      />
      <circle cx="50" cy="50" r="6" fill="var(--accent)" />
      {Array.from({ length: chambers }, (_, i) => {
        const angle = (i * 360) / chambers - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 30 * Math.cos(rad);
        const y = 50 + 30 * Math.sin(rad);
        const isLoaded = i < bullets;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="9"
            fill={isLoaded ? 'var(--accent)' : 'transparent'}
            stroke="var(--accent)"
            strokeWidth="2"
            opacity={isLoaded ? 1 : 0.25}
          />
        );
      })}
    </svg>
  );
}
