interface ChamberDisplayProps {
  chambers: number;
  bullets: number;
  size?: number;
  spinning?: boolean;
}

export function ChamberDisplay({
  chambers,
  bullets,
  size = 150,
  spinning = false,
}: ChamberDisplayProps) {
  const danger = bullets / chambers;
  const dangerClass = danger >= 0.5 ? 'danger-high' : danger >= 0.33 ? 'danger-mid' : '';

  return (
    <div className={`chamber-wrap ${dangerClass}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`chamber-display ${spinning ? 'spinning' : ''}`}
      >
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#2a2a44" />
            <stop offset="100%" stopColor="#0c0c18" />
          </radialGradient>
          <radialGradient id="bulletGrad" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ff8a7a" />
            <stop offset="60%" stopColor="#e74c3c" />
            <stop offset="100%" stopColor="#8b1a10" />
          </radialGradient>
          <filter id="bulletGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="50" r="48" fill="url(#bodyGrad)" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(231,76,60,0.35)" strokeWidth="1" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(231,76,60,0.2)" strokeWidth="0.6" strokeDasharray="2 3" />

        <circle cx="50" cy="50" r="8.5" fill="#0c0c18" stroke="rgba(231,76,60,0.6)" strokeWidth="1" />
        <circle cx="50" cy="50" r="3.5" fill="var(--accent)" />

        {Array.from({ length: chambers }, (_, i) => {
          const angle = (i * 360) / chambers - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 30 * Math.cos(rad);
          const y = 50 + 30 * Math.sin(rad);
          const isLoaded = i < bullets;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="10"
                fill="#0c0c18"
                stroke="rgba(231,76,60,0.45)"
                strokeWidth="1.2"
              />
              {isLoaded && (
                <circle
                  cx={x}
                  cy={y}
                  r="6.5"
                  fill="url(#bulletGrad)"
                  filter="url(#bulletGlow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
