import { getIndianIndices, getForexInstruments } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";
import LiveLegend from "@/components/LiveLegend";

export default async function LevelsPage() {
  const [indianIndices, forexInstruments] = await Promise.all([
    withLiveQuotes(getIndianIndices()),
    withLiveQuotes(getForexInstruments()),
  ]);
  const all = [...indianIndices, ...forexInstruments];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            Levels
          </h1>
          <LiveLegend />
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Pivot-point support and resistance across every instrument, in one
          table.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft text-xs text-text-muted">
              <th className="px-4 py-3 font-normal">Symbol</th>
              <th className="px-4 py-3 font-normal">LTP</th>
              <th className="px-4 py-3 font-normal">Support 2</th>
              <th className="px-4 py-3 font-normal">Support 1</th>
              <th className="px-4 py-3 font-normal">Resistance 1</th>
              <th className="px-4 py-3 font-normal">Resistance 2</th>
            </tr>
          </thead>
          <tbody>
            {all.map((inst) => {
              const decimals = inst.ltp < 100 ? 4 : 2;
              const fmt = (n: number) =>
                n.toLocaleString("en-IN", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                });
              return (
                <tr key={inst.symbol} className="border-b border-border-soft last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-medium text-text-primary">
                        {inst.symbol}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inst.live ? "bg-up" : "bg-warn"
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-data text-text-primary">
                    {fmt(inst.ltp)}
                  </td>
                  <td className="px-4 py-3 font-data text-up/70">
                    {fmt(inst.support[1])}
                  </td>
                  <td className="px-4 py-3 font-data text-up">
                    {fmt(inst.support[0])}
                  </td>
                  <td className="px-4 py-3 font-data text-down">
                    {fmt(inst.resistance[0])}
                  </td>
                  <td className="px-4 py-3 font-data text-down/70">
                    {fmt(inst.resistance[1])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
