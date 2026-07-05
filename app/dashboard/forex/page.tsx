import { getForexInstruments } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";
import InstrumentCard from "@/components/InstrumentCard";
import EconCalendar from "@/components/EconCalendar";
import NewsList from "@/components/NewsList";
import LiveLegend from "@/components/LiveLegend";

export default async function ForexPage() {
  const forexInstruments = await withLiveQuotes(getForexInstruments());

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            Forex &amp; Gold
          </h1>
          <LiveLegend />
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          XAUUSD, GBPUSD, NZDUSD, USDJPY, EURUSD, BTCUSD — live price with
          pivot-point support/resistance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {forexInstruments.map((inst) => (
          <InstrumentCard key={inst.symbol} instrument={inst} accent="forex" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EconCalendar />
        <NewsList tag="forex" />
      </div>
    </div>
  );
}
