import Link from "next/link";
import { TrendingUp, Coins, Ruler, Landmark, Newspaper } from "lucide-react";
import FiiDiiCard from "@/components/FiiDiiCard";

const LINKS = [
  {
    href: "/dashboard/indices",
    label: "Indices",
    desc: "NIFTY, Bank Nifty, Sensex + Options OI",
    icon: TrendingUp,
    accent: "india" as const,
  },
  {
    href: "/dashboard/forex",
    label: "Forex & Gold",
    desc: "XAUUSD, GBPUSD, NZDUSD, USDJPY, EURUSD, BTCUSD",
    icon: Coins,
    accent: "forex" as const,
  },
  {
    href: "/dashboard/levels",
    label: "Levels",
    desc: "Support & resistance for everything, one table",
    icon: Ruler,
  },
  {
    href: "/dashboard/fii-dii",
    label: "FII / DII",
    desc: "Daily institutional flows",
    icon: Landmark,
  },
  {
    href: "/dashboard/news",
    label: "News",
    desc: "Indian and forex news, kept separate",
    icon: Newspaper,
  },
];

function accentColor(accent?: "india" | "forex") {
  if (accent === "india") return "var(--color-india)";
  if (accent === "forex") return "var(--color-forex)";
  return "var(--color-text-primary)";
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-text-primary">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Pick a section from the left, or jump in below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-soft"
            >
              <Icon size={18} style={{ color: accentColor(item.accent) }} />
              <div className="mt-3 font-display text-sm font-semibold text-text-primary">
                {item.label}
              </div>
              <div className="mt-1 text-xs text-text-secondary">{item.desc}</div>
            </Link>
          );
        })}
      </div>

      <div className="max-w-xl">
        <FiiDiiCard />
      </div>
    </div>
  );
}
