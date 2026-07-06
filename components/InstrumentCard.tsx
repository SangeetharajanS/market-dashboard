import type { Instrument } from "@/lib/mock-data";

export default function InstrumentCard({
  instrument,
  accent,
}: {
  instrument: Instrument;
  accent: "india" | "forex";
}) {
  const isUp = instrument.change >= 0;
  const decimals = instrument.ltp < 100 ? 4 : 2;
  const accentColor = accent === "india" ? "var(--color-india)" : "var(--color-forex)";

  return (
    <div className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className="font-display text-sm font-semibold tracking-wide"
              style={{ color: accentColor }}
            >
              {instrument.symbol}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                instrument.live ? "bg-up" : "bg-warn"
              }`}
              title={instrument.live ? "Live price" : "Sample price"}
            />
          </div>
          <div className="mt-0.5 text-xs text-text-muted">{instrument.name}</div>
        </div>
        <div
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            isUp ? "bg-up-soft text-up" : "bg-down-soft text-down"
          }`}
        >
          {isUp ? "+" : ""}
          {instrument.changePct.toFixed(2)}%
        </div>
      </div>

      <div className="mt-4 font-data text-2xl font-semibold text-text-primary">
        {instrument.ltp.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </div>
      <div
        className={`mt-1 font-data text-xs ${isUp ? "text-up" : "text-down"}`}
      >
        {isUp ? "+" : ""}
        {instrument.change.toFixed(decimals === 4 ? 4 : 2)} today
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-soft pt-3 text-xs">
        <div>
          <div className="text-text-muted">Support</div>
          <div className="mt-1 font-data text-up">
            {instrument.support[0].toLocaleString("en-IN", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </div>
          <div className="font-data text-up/70">
            {instrument.support[1].toLocaleString("en-IN", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </div>
        </div>
        <div>
          <div className="text-text-muted">Resistance</div>
          <div className="mt-1 font-data text-down">
            {instrument.resistance[0].toLocaleString("en-IN", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </div>
          <div className="font-data text-down/70">
            {instrument.resistance[1].toLocaleString("en-IN", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </div>
        </div>
      </div>
      {instrument.srMethod && (
        <div className="mt-2 text-[10px] text-text-muted">
          {instrument.srMethod === "oi"
            ? "Levels from live option OI"
            : instrument.srMethod === "structure"
              ? "Levels from pivot points, prior-day range & swing highs/lows"
              : "Levels from a simple % offset (limited history)"}
        </div>
      )}
    </div>
  );
}
