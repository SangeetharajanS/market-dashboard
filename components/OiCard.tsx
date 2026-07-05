import type { OiSnapshot } from "@/lib/mock-data";

export default function OiCard({
  snapshot,
  live,
}: {
  snapshot: OiSnapshot;
  live?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-semibold text-india">
            {snapshot.symbol} Options
          </h3>
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "bg-up" : "bg-warn"}`}
            title={live ? "Live · NSE" : "Sample data"}
          />
        </div>
        <div className="text-right text-xs">
          <div className="text-text-muted">Expiry</div>
          <div className="font-data text-text-primary">{snapshot.expiry}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-6 text-xs">
        <div>
          <div className="text-text-muted">Days to expiry</div>
          <div className="mt-1 font-data text-base text-warn">
            {snapshot.daysToExpiry}
          </div>
        </div>
        <div>
          <div className="text-text-muted">PCR</div>
          <div className="mt-1 font-data text-base text-text-primary">
            {snapshot.pcr.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-text-muted">Max Pain</div>
          <div className="mt-1 font-data text-base text-text-primary">
            {snapshot.maxPain.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border-soft pt-4 text-xs">
        <div>
          <div className="mb-2 text-text-muted">Top Call OI</div>
          <ul className="space-y-1.5">
            {snapshot.topCallOi.map((c) => (
              <li key={c.strike} className="flex justify-between font-data">
                <span className="text-text-secondary">{c.strike}</span>
                <span className="text-down">{c.oi}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-text-muted">Top Put OI</div>
          <ul className="space-y-1.5">
            {snapshot.topPutOi.map((p) => (
              <li key={p.strike} className="flex justify-between font-data">
                <span className="text-text-secondary">{p.strike}</span>
                <span className="text-up">{p.oi}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
