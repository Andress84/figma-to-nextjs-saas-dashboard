import type { DashboardPageId, PageCopy } from "@/types/dashboard";

export const PAGE_COPY = {
  overview: {
    title: "Overview",
    description: "Monitor recurring revenue, subscriptions and customer activity.",
  },
  analytics: {
    title: "Analytics",
    description: "Explore revenue, subscription growth and customer retention trends.",
  },
  customers: {
    title: "Customers",
    description: "Manage customer accounts, subscription status and recurring value.",
  },
  subscriptions: {
    title: "Subscriptions",
    description: "Monitor active plans, billing status and recurring subscription value.",
  },
  settings: {
    title: "Settings",
    description: "Manage workspace preferences, reporting defaults and notifications.",
  },
} as const satisfies Record<DashboardPageId, PageCopy>;
