"use client";

import { useState, type ReactNode } from "react";
import { getOiSnapshots, type Instrument } from "@/lib/mock-data";
import InstrumentCard from "./InstrumentCard";
import OiCard from "./OiCard";
import NewsList from "./NewsList";
import EconCalendar from "./EconCalendar";

type Tab = "india" | "forex";

// Some cards (FiiDiiCard) fetch live data server-side and are passed in as
// pre-rendered slots. Instrument lists are plain data fetched server-side in
// app/dashboard/page.tsx and passed down as props, since this component needs
// to stay a Client Component for the tab-switching state.
export default function MarketTabs({
  indianIndices,
  forexInstruments,
  fiiDiiCard,
}: {
  indianIndices: Instrument[];
  forexInstruments: Instrument[];
  fiiDiiCard: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("india");
  const oiSnapshots = getOiSnapshots();

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
        <button
          onClick={() => setTab("india")}
          className={`rounded-md px-4 py-2 font-display text-sm font-medium transition-colors ${
            tab === "india"
              ? "bg-india-soft text-india"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Indian Market
        </button>
        <button
          onClick={() => setTab("forex")}
          className={`rounded-md px-4 py-2 font-display text-sm font-medium transition-colors ${
            tab === "forex"
              ? "bg-forex-soft text-forex"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Forex &amp; Gold
        </button>
      </div>

      {tab === "india" ? (
        <div className="mt-6 space-y-6">
          <section>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
                Indices &amp; Levels
              </h2>
              <LiveLegend />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {indianIndices.map((inst) => (
                <InstrumentCard key={inst.symbol} instrument={inst} accent="india" />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {oiSnapshots.map((snap) => (
              <OiCard key={snap.symbol} snapshot={snap} />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {fiiDiiCard}
            <NewsList tag="india" />
          </section>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <section>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
                Pairs &amp; Levels
              </h2>
              <LiveLegend />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {forexInstruments.map((inst) => (
                <InstrumentCard key={inst.symbol} instrument={inst} accent="forex" />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EconCalendar />
            <NewsList tag="forex" />
          </section>
        </div>
      )}
    </div>
  );
}

function LiveLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-up" /> live
      </span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" /> sample
      </span>
    </div>
  );
}
