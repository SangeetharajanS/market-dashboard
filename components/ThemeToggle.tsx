"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Read the theme actually applied by the anti-flash script in the root
  // layout, so the icon matches on first render instead of flashing.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("zonely-theme", next);
    } catch {
      // Private browsing or storage disabled — theme just won't persist.
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      className="rounded-md border border-border p-1.5 text-text-secondary transition-colors hover:text-text-primary"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
