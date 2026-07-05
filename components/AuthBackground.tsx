export default function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-base"
    >
      {/* Soft brand-colored glow blobs */}
      <div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--color-india)" }}
      />
      <div
        className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-forex)" }}
      />

      {/* Faint grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-text-primary)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Candlestick chart silhouette, fading toward the bottom edge */}
      <svg
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-64 w-full opacity-[0.12]"
      >
        <g stroke="var(--color-up)" strokeWidth="2">
          {[
            [20, 140, 170, 40],
            [60, 120, 190, 60, 1],
            [100, 90, 160, 90],
            [140, 130, 150, 55, 1],
            [180, 100, 170, 40],
            [220, 150, 150, 70, 1],
            [260, 95, 165, 35],
            [300, 110, 155, 100, 1],
            [340, 70, 175, 30],
            [380, 105, 145, 65, 1],
            [420, 80, 160, 45],
            [460, 60, 180, 25],
            [500, 95, 150, 80, 1],
            [540, 55, 170, 40],
            [580, 75, 160, 30, 1],
            [620, 40, 190, 20],
            [660, 65, 150, 55, 1],
            [700, 30, 175, 15],
            [740, 50, 160, 35, 1],
          ].map(([x, barTop, barHeight, wickExtra, down], i) => {
            const color = down ? "var(--color-down)" : "var(--color-up)";
            const cx = Number(x) + 6;
            return (
              <g key={i} stroke={color}>
                <line
                  x1={cx}
                  y1={220 - barTop - Number(wickExtra)}
                  x2={cx}
                  y2={220 - barTop + Number(barHeight) + Number(wickExtra)}
                />
                <rect
                  x={x}
                  y={220 - barTop - Number(barHeight)}
                  width="12"
                  height={barHeight}
                  fill={color}
                  stroke="none"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Fade the whole thing into the page background at the top so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-base) 0%, transparent 30%, transparent 70%, var(--color-base) 100%)",
        }}
      />
    </div>
  );
}
