import type { Instrument } from "@/lib/mock-data";

export default function TickerStrip({ instruments }: { instruments: Instrument[] }) {
  // Duplicate the list so the marquee loop has no visible seam.
  const doubled = [...instruments, ...instruments];

  return (
    <div className="overflow-hidden border-b border-border bg-surface">
      <div className="ticker-track flex w-max gap-8 py-2.5">
        {doubled.map((item, i) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={`${item.symbol}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap px-2 text-sm"
            >
              <span className="font-display font-medium text-text-secondary">
                {item.symbol}
              </span>
              <span className="font-data text-text-primary">
                {item.ltp.toLocaleString("en-IN", {
                  minimumFractionDigits: item.ltp < 100 ? 4 : 2,
                  maximumFractionDigits: item.ltp < 100 ? 4 : 2,
                })}
              </span>
              <span
                className={`font-data ${isUp ? "text-up" : "text-down"}`}
              >
                {isUp ? "▲" : "▼"} {Math.abs(item.changePct).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
