"use client";

import { AreaTrendChart } from "@/components/charts/area-trend-chart";
import type { NonEmptyChartSeries } from "@/components/charts/chart-types";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ANALYTICS_REVENUE_TRENDS, type AnalyticsRevenueView } from "@/data/mock/analytics";
import type { OverviewTrendPoint } from "@/data/mock/dashboard-overview";
import { GROSS_REVENUE, RECURRING_REVENUE } from "@/data/mock/reporting";
import { formatCurrency, formatSignedPercent } from "@/lib/formatters";
import { useAnalyticsReport } from "./analytics-report-context";

const VIEW_OPTIONS = [
  { label: "Revenue", value: "revenue" },
  { label: "MRR", value: "mrr" },
] as const;

const VIEW_CONFIG = {
  revenue: {
    currentSeriesLabel: "Current revenue",
    previousSeriesLabel: "Previous revenue",
  },
  mrr: {
    currentSeriesLabel: "Current MRR",
    previousSeriesLabel: "Previous MRR",
  },
} as const satisfies Record<
  AnalyticsRevenueView,
  { readonly currentSeriesLabel: string; readonly previousSeriesLabel: string }
>;

function RevenueSummaryMetric() {
  const { revenueView } = useAnalyticsReport();

  return (
    <dl className="analytics-revenue-summary" aria-label="Revenue and MRR totals">
      <div data-selected={revenueView === "revenue" || undefined}>
        <dt>
          <span>Gross revenue</span>
          <TrendBadge tone="positive" label={formatSignedPercent(9.6)} />
        </dt>
        <dd>
          <strong>{formatCurrency(GROSS_REVENUE.current)}</strong>
          <span>Previous {formatCurrency(GROSS_REVENUE.previous)}</span>
        </dd>
      </div>
      <div data-selected={revenueView === "mrr" || undefined}>
        <dt>
          <span>Monthly recurring revenue</span>
          <TrendBadge tone="positive" label={formatSignedPercent(8.4)} />
        </dt>
        <dd>
          <strong>{formatCurrency(RECURRING_REVENUE.currentMrr)}</strong>
          <span>Previous {formatCurrency(RECURRING_REVENUE.previousMrr)}</span>
        </dd>
      </div>
    </dl>
  );
}

export function RevenueMrrTrends() {
  const { compareToPrevious, revenueView, setRevenueView } = useAnalyticsReport();
  const config = VIEW_CONFIG[revenueView];
  const currentSeries = {
    color: "violet",
    dataKey: "current",
    label: config.currentSeriesLabel,
    marker: "line",
    valueFormat: "currency",
  } as const;
  const previousSeries = {
    color: "slate",
    dataKey: "previous",
    label: config.previousSeriesLabel,
    marker: "dashed-line",
    valueFormat: "currency",
  } as const;
  const series = (
    compareToPrevious ? [currentSeries, previousSeries] : [currentSeries]
  ) satisfies NonEmptyChartSeries<OverviewTrendPoint>;

  return (
    <AreaTrendChart
      className="analytics-revenue-card"
      title="Revenue and MRR Trends"
      description="Current performance compared with the previous period"
      data={ANALYTICS_REVENUE_TRENDS[revenueView]}
      labelKey="label"
      labelHeading="Period"
      series={series}
      tooltipTrend={{
        dataKey: "change",
        label: "Period difference",
        tone: "positive",
        valueFormat: "signed-percent",
      }}
      actions={
        <SegmentedControl
          label="Revenue metric"
          options={VIEW_OPTIONS}
          value={revenueView}
          onValueChange={(value) => setRevenueView(value as AnalyticsRevenueView)}
        />
      }
      metric={<RevenueSummaryMetric />}
      height="large"
    />
  );
}
