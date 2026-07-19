import type { DashboardNavItem } from "@/types/navigation";
import { PRODUCT_IDENTITY } from "./identity";

interface BrandConfig {
  name: string;
}

interface WorkspaceConfig {
  name: string;
  initials: string;
}

interface ProfileConfig {
  name: string;
  role: string;
  initials: string;
}

interface AppShellConfig {
  brand: BrandConfig;
  workspace: WorkspaceConfig;
  profile: ProfileConfig;
  navigation: readonly DashboardNavItem[];
}

export const appShellConfig = {
  brand: PRODUCT_IDENTITY.brand,
  workspace: PRODUCT_IDENTITY.workspace,
  profile: PRODUCT_IDENTITY.profile,
  navigation: [
    { href: "/", label: "Overview", iconKey: "overview" },
    { href: "/analytics", label: "Analytics", iconKey: "analytics" },
    { href: "/customers", label: "Customers", iconKey: "customers" },
    { href: "/subscriptions", label: "Subscriptions", iconKey: "subscriptions" },
    { href: "/settings", label: "Settings", iconKey: "settings" },
  ],
} as const satisfies AppShellConfig;
