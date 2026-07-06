import { getIndianIndices } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";
import { getLiveOiSnapshots } from "@/lib/data/option-chain";
import { withOiLevels } from "@/lib/data/enrich-indices";
import InstrumentCard from "@/components/InstrumentCard";
import OiCard from "@/components/OiCard";
import LiveLegend from "@/components/LiveLegend";

export default async function IndicesPage() {
  const [indianIndices, { snapshots, live: oiLive }] = await Promise.all([
    withLiveQuotes(getIndianIndices()),
    getLiveOiSnapshots(),
  ]);

  const enrichedIndices = withOiLevels(indianIndices, snapshots, oiLive);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            Indices &amp; Levels
          </h1>
          <LiveLegend />
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          NIFTY 50, Bank Nifty, and Sensex — live price. NIFTY/BANKNIFTY
          support &amp; resistance come from option OI when available;
          Sensex combines pivot points, prior-day range, and swing
          highs/lows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrichedIndices.map((inst) => (
          <InstrumentCard key={inst.symbol} instrument={inst} accent="india" />
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
          Options — OI, PCR &amp; Max Pain
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {snapshots.map((snap) => (
            <OiCard key={snap.symbol} snapshot={snap} live={oiLive} />
          ))}
        </div>
      </div>
    </div>
  );
}
