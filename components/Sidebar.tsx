"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

function accentColor(accent?: "india" | "forex") {
  if (accent === "india") return "var(--color-india)";
  if (accent === "forex") return "var(--color-forex)";
  return "var(--color-text-primary)";
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface sm:flex">
      <div className="flex items-baseline gap-1.5 px-5 py-5">
        <span className="font-display text-xl font-bold text-text-primary">
          Zonely
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-forex" />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-border-soft"
                  : "text-text-secondary hover:bg-border-soft/60 hover:text-text-primary"
              }`}
              style={active ? { color: accentColor(item.accent) } : undefined}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
