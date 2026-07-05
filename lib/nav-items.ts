import {
  LayoutDashboard,
  TrendingUp,
  Coins,
  Ruler,
  Landmark,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  accent?: "india" | "forex";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/indices", label: "Indices", icon: TrendingUp, accent: "india" },
  { href: "/dashboard/forex", label: "Forex & Gold", icon: Coins, accent: "forex" },
  { href: "/dashboard/levels", label: "Levels", icon: Ruler },
  { href: "/dashboard/fii-dii", label: "FII / DII", icon: Landmark },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
];
