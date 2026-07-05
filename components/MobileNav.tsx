"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

function accentColor(accent?: "india" | "forex") {
  if (accent === "india") return "var(--color-india)";
  if (accent === "forex") return "var(--color-forex)";
  return "var(--color-text-primary)";
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-3 py-2 sm:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-border-soft"
                : "text-text-secondary hover:text-text-primary"
            }`}
            style={active ? { color: accentColor(item.accent) } : undefined}
          >
            <Icon size={14} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
