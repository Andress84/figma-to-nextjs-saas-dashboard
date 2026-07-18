import type { Route } from "next";

export type DashboardNavIconKey =
  | "overview"
  | "analytics"
  | "customers"
  | "subscriptions"
  | "settings";

export interface DashboardNavItem {
  href: Route;
  label: string;
  iconKey: DashboardNavIconKey;
}
