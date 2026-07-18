import type { DashboardNavItem } from "@/types/navigation";

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
  brand: {
    name: "Subtera",
  },
  workspace: {
    name: "Acme Cloud",
    initials: "AC",
  },
  profile: {
    name: "Maya Chen",
    role: "Workspace Admin",
    initials: "MC",
  },
  navigation: [
    { href: "/", label: "Overview", iconKey: "overview" },
    { href: "/analytics", label: "Analytics", iconKey: "analytics" },
    { href: "/customers", label: "Customers", iconKey: "customers" },
    { href: "/subscriptions", label: "Subscriptions", iconKey: "subscriptions" },
    { href: "/settings", label: "Settings", iconKey: "settings" },
  ],
} as const satisfies AppShellConfig;
