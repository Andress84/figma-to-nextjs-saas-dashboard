import {
  OVERVIEW_METRIC_SPARKLINES,
  OVERVIEW_MRR_CHART_DATA,
  OVERVIEW_REVENUE_CHART_DATA,
} from "@/data/mock/dashboard-overview";
import {
  AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT,
  RETENTION_METRICS,
  SUBSCRIPTION_FLOW,
} from "@/data/mock/reporting";
import { CUSTOMER_GROWTH_SERIES } from "@/data/mock/revenue";
import type { ChurnTrendDataPoint } from "@/types/dashboard";

export type AnalyticsRevenueView = "revenue" | "mrr";
export type AnalyticsChurnFilter = "all" | "low-churn" | "elevated-churn";

export const ANALYTICS_METRIC_SPARKLINES = {
  "mrr-growth": OVERVIEW_MRR_CHART_DATA.map((point) => point.current),
  arpa: [29.15, 29.31, 29.28, 29.46, AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT],
  "net-subscription-growth": [
    CUSTOMER_GROWTH_SERIES[0].netSubscriptions,
    CUSTOMER_GROWTH_SERIES[0].netSubscriptions + CUSTOMER_GROWTH_SERIES[1].netSubscriptions,
    CUSTOMER_GROWTH_SERIES[0].netSubscriptions +
      CUSTOMER_GROWTH_SERIES[1].netSubscriptions +
      CUSTOMER_GROWTH_SERIES[2].netSubscriptions,
    SUBSCRIPTION_FLOW.netGrowth,
  ],
  "churn-rate": OVERVIEW_METRIC_SPARKLINES["churn-rate"],
} as const;

export const ANALYTICS_REVENUE_TRENDS = {
  revenue: OVERVIEW_REVENUE_CHART_DATA,
  mrr: OVERVIEW_MRR_CHART_DATA,
} as const satisfies Record<AnalyticsRevenueView, typeof OVERVIEW_REVENUE_CHART_DATA>;

export const ANALYTICS_SUBSCRIPTION_GROWTH = CUSTOMER_GROWTH_SERIES.map((point) => ({
  ...point,
  shortLabel: point.label.split("–")[0]?.trim() ?? point.label,
}));

export const PREVIOUS_NET_SUBSCRIPTION_GROWTH = 108;

export const CHURN_TREND_SERIES = [
  {
    id: "churn-2026-06-15",
    label: "Jun 15",
    currentChurnRate: 4.18,
    previousChurnRate: 4.54,
  },
  {
    id: "churn-2026-06-22",
    label: "Jun 22",
    currentChurnRate: 4.08,
    previousChurnRate: 4.46,
  },
  {
    id: "churn-2026-06-29",
    label: "Jun 29",
    currentChurnRate: 3.98,
    previousChurnRate: 4.38,
  },
  {
    id: "churn-2026-07-06",
    label: "Jul 6",
    currentChurnRate: 3.9,
    previousChurnRate: 4.31,
  },
  {
    id: "churn-2026-07-14",
    label: "Jul 14",
    currentChurnRate: RETENTION_METRICS.currentChurnRate,
    previousChurnRate: RETENTION_METRICS.previousChurnRate,
  },
] as const satisfies readonly ChurnTrendDataPoint[];
