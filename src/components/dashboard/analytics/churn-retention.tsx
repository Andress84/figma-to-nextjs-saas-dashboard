"use client";

import { LineTrendChart } from "@/components/charts/line-trend-chart";
import type { NonEmptyChartSeries } from "@/components/charts/chart-types";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { CHURN_TREND_SERIES } from "@/data/mock/analytics";
import { RETENTION_METRICS } from "@/data/mock/reporting";
import {
  formatChurnPercent,
  formatCount,
  formatPercentagePoints,
  formatPercent,
} from "@/lib/formatters";
import type { ChurnTrendDataPoint } from "@/types/dashboard";
import { useAnalyticsReport } from "./analytics-report-context";

export function ChurnRetention() {
  const { compareToPrevious } = useAnalyticsReport();
  const currentSeries = {
    color: "success",
    dataKey: "currentChurnRate",
    label: "Current churn rate",
    marker: "line",
    valueFormat: "churn-percent",
  } as const;
  const previousSeries = {
    color: "slate",
    dataKey: "previousChurnRate",
    label: "Previous churn rate",
    marker: "dashed-line",
    valueFormat: "churn-percent",
  } as const;
  const series = (
    compareToPrevious ? [currentSeries, previousSeries] : [currentSeries]
  ) satisfies NonEmptyChartSeries<ChurnTrendDataPoint>;

  return (
    <LineTrendChart
      className="analytics-churn-card"
      title="Churn and Retention"
      description="Subscription retention quality over time"
      data={CHURN_TREND_SERIES}
      labelKey="label"
      labelHeading="Period"
      series={series}
      showPoints={false}
      actions={
        <TrendBadge
          tone="improvement"
          label={formatPercentagePoints(RETENTION_METRICS.churnRateChange)}
        />
      }
      metric={
        <div className="analytics-retention-metric">
          <div>
            <span>Current churn rate</span>
            <strong>{formatChurnPercent(RETENTION_METRICS.currentChurnRate)}</strong>
          </div>
          <div>
            <span>Previous period</span>
            <strong>{formatChurnPercent(RETENTION_METRICS.previousChurnRate)}</strong>
          </div>
        </div>
      }
      footer={
        <div className="analytics-retention-footer">
          <dl className="analytics-retention-details">
            <div>
              <dt>Retained subscriptions</dt>
              <dd>{formatCount(RETENTION_METRICS.retainedSubscriptions)}</dd>
            </div>
            <div>
              <dt>Net revenue retention</dt>
              <dd>{formatPercent(RETENTION_METRICS.netRevenueRetention, 1)}</dd>
            </div>
          </dl>
          <p className="analytics-positive-note">
            Lower churn indicates improved retention for this period.
          </p>
        </div>
      }
      height="compact"
    />
  );
}
