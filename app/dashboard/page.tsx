import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIndianIndices, getForexInstruments } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";
import TickerStrip from "@/components/TickerStrip";
import MarketTabs from "@/components/MarketTabs";
import FiiDiiCard from "@/components/FiiDiiCard";
import { signOut } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetched once here and passed down, so the ticker and the tab cards show
  // the exact same numbers instead of racing separate fetches.
  const [indianIndices, forexInstruments] = await Promise.all([
    withLiveQuotes(getIndianIndices()),
    withLiveQuotes(getForexInstruments()),
  ]);

  return (
    <main className="min-h-screen bg-base">
      <TickerStrip instruments={[...indianIndices, ...forexInstruments]} />

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold text-text-primary">
              Zonely
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-forex" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-text-secondary sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-down/40 hover:text-down"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <MarketTabs
          indianIndices={indianIndices}
          forexInstruments={forexInstruments}
          fiiDiiCard={<FiiDiiCard />}
        />

        <p className="mt-10 border-t border-border-soft pt-4 text-xs text-text-muted">
          For informational and educational purposes only. Not investment
          advice. Support/resistance levels are calculated pivot points from
          the prior day's price action, not analyst calls.
        </p>
      </div>
    </main>
  );
}
