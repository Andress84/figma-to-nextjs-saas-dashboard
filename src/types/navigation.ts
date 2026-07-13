import type { Route } from "next";

export interface DashboardNavItem {
  href: Route;
  label: string;
  shortLabel: string;
}
