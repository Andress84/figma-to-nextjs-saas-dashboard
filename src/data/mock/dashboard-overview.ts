import {
  GROSS_REVENUE,
  RECURRING_REVENUE,
  RETENTION_METRICS,
  SUBSCRIPTION_FLOW,
} from "@/data/mock/reporting";
import { REVENUE_SERIES } from "@/data/mock/revenue";
import type { PrimaryMetricId } from "@/types/dashboard";

export type OverviewRevenueView = "revenue" | "mrr";

export interface OverviewTrendPoint {
  readonly change: number;
  readonly current: number;
  readonly id: string;
  readonly label: string;
  readonly previous: number;
}

function getPercentChange(current: number, previous: number) {
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function createCumulativeRevenueSeries(): readonly OverviewTrendPoint[] {
  let current = 0;
  let previous = 0;

  return REVENUE_SERIES.map((point) => {
    current += point.currentRevenue;
    previous += point.previousRevenue;

    return {
      id: point.id,
      label: point.label,
      current,
      previous,
      change: getPercentChange(current, previous),
    };
  });
}

function createMrrTrendSeries(): readonly OverviewTrendPoint[] {
  const currentMrrIncrease = RECURRING_REVENUE.currentMrr - RECURRING_REVENUE.previousMrr;
  const previousMrrStart = RECURRING_REVENUE.previousMrr - currentMrrIncrease;
  let cumulativeCurrentRevenue = 0;
  let cumulativePreviousRevenue = 0;

  return REVENUE_SERIES.map((point) => {
    cumulativeCurrentRevenue += point.currentRevenue;
    cumulativePreviousRevenue += point.previousRevenue;

    const current = Math.round(
      RECURRING_REVENUE.previousMrr +
        currentMrrIncrease * (cumulativeCurrentRevenue / GROSS_REVENUE.current),
    );
    const previous = Math.round(
      previousMrrStart + currentMrrIncrease * (cumulativePreviousRevenue / GROSS_REVENUE.previous),
    );

    return {
      id: `mrr-${point.id}`,
      label: point.label,
      current,
      previous,
      change: getPercentChange(current, previous),
    };
  });
}

export const OVERVIEW_REVENUE_CHART_DATA = createCumulativeRevenueSeries();
export const OVERVIEW_MRR_CHART_DATA = createMrrTrendSeries();

export const OVERVIEW_METRIC_SPARKLINES = {
  "monthly-recurring-revenue": OVERVIEW_MRR_CHART_DATA.map((point) => point.current),
  "annual-recurring-revenue": OVERVIEW_MRR_CHART_DATA.map((point) => point.current * 12),
  "active-subscriptions": [
    SUBSCRIPTION_FLOW.previousActive,
    SUBSCRIPTION_FLOW.previousActive + 29,
    SUBSCRIPTION_FLOW.previousActive + 59,
    SUBSCRIPTION_FLOW.previousActive + 95,
    SUBSCRIPTION_FLOW.endingActive,
  ],
  "churn-rate": [
    RETENTION_METRICS.previousChurnRate,
    4.16,
    4.04,
    3.94,
    RETENTION_METRICS.currentChurnRate,
  ],
} as const satisfies Record<PrimaryMetricId, readonly number[]>;
