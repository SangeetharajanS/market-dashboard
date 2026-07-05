import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIndianIndices, getForexInstruments } from "@/lib/mock-data";
import { withLiveQuotes } from "@/lib/data/quotes";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import TickerStrip from "@/components/TickerStrip";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetched once here so the ticker always matches whatever the current
  // page shows, without every page re-fetching it separately.
  const [indianIndices, forexInstruments] = await Promise.all([
    withLiveQuotes(getIndianIndices()),
    withLiveQuotes(getForexInstruments()),
  ]);

  const updatedAt = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TickerStrip instruments={[...indianIndices, ...forexInstruments]} />
        <MobileNav />

        <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-1.5 sm:hidden">
            <span className="font-display text-lg font-bold text-text-primary">
              Zonely
            </span>
          </div>
          <span className="hidden text-xs text-text-muted sm:inline">
            Prices updated {updatedAt} IST
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>

        <p className="mx-auto w-full max-w-6xl border-t border-border-soft px-4 py-4 text-xs text-text-muted sm:px-6">
          For informational and educational purposes only. Not investment
          advice. Support/resistance levels are calculated pivot points from
          the prior day's price action, not analyst calls.
        </p>
      </div>
    </div>
  );
}
