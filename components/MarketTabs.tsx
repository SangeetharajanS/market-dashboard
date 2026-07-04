"use client";

import { useState, type ReactNode } from "react";
import {
  getIndianIndices,
  getForexInstruments,
  getOiSnapshots,
} from "@/lib/mock-data";
import InstrumentCard from "./InstrumentCard";
import OiCard from "./OiCard";
import NewsList from "./NewsList";
import EconCalendar from "./EconCalendar";

type Tab = "india" | "forex";

// FiiDiiCard fetches live data server-side (async Server Component), so it
// can't be imported directly into this Client Component. Instead the parent
// Server Component (app/dashboard/page.tsx) renders it and passes it in here
// as a plain ReactNode slot.
export default function MarketTabs({ fiiDiiCard }: { fiiDiiCard: ReactNode }) {
  const [tab, setTab] = useState<Tab>("india");

  const indianIndices = getIndianIndices();
  const forexInstruments = getForexInstruments();
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
            <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
              Indices &amp; Levels
            </h2>
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
            <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
              Pairs &amp; Levels
            </h2>
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
