"use client";

import { useMemo, useState } from "react";
import { AreaTrendChart } from "@/components/charts/area-trend-chart";
import type { ComparisonChartSeries } from "@/components/charts/chart-types";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  OVERVIEW_MRR_CHART_DATA,
  OVERVIEW_REVENUE_CHART_DATA,
  type OverviewRevenueView,
  type OverviewTrendPoint,
} from "@/data/mock/dashboard-overview";
import { GROSS_REVENUE, RECURRING_REVENUE } from "@/data/mock/reporting";
import { formatCurrency, formatSignedPercent } from "@/lib/formatters";

const VIEW_OPTIONS = [
  { label: "Revenue", value: "revenue" },
  { label: "MRR", value: "mrr" },
] as const;

function calculateChange(current: number, previous: number) {
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

const VIEW_CONFIG = {
  revenue: {
    current: GROSS_REVENUE.current,
    data: OVERVIEW_REVENUE_CHART_DATA,
    description: "Gross revenue for the selected period",
    currentSeriesLabel: "Current revenue",
    previous: GROSS_REVENUE.previous,
    previousSeriesLabel: "Previous revenue",
  },
  mrr: {
    current: RECURRING_REVENUE.currentMrr,
    data: OVERVIEW_MRR_CHART_DATA,
    description: "Monthly recurring revenue through the selected period",
    currentSeriesLabel: "Current MRR",
    previous: RECURRING_REVENUE.previousMrr,
    previousSeriesLabel: "Previous MRR",
  },
} as const satisfies Record<
  OverviewRevenueView,
  {
    readonly current: number;
    readonly currentSeriesLabel: string;
    readonly data: readonly OverviewTrendPoint[];
    readonly description: string;
    readonly previous: number;
    readonly previousSeriesLabel: string;
  }
>;

export function RevenueOverview() {
  const [view, setView] = useState<OverviewRevenueView>("revenue");
  const config = VIEW_CONFIG[view];
  const change = calculateChange(config.current, config.previous);
  const series = useMemo(
    () =>
      [
        {
          color: "violet",
          dataKey: "current",
          label: config.currentSeriesLabel,
          marker: "line",
          valueFormat: "currency",
        },
        {
          color: "slate",
          dataKey: "previous",
          label: config.previousSeriesLabel,
          marker: "dashed-line",
          valueFormat: "currency",
        },
      ] as const satisfies ComparisonChartSeries<OverviewTrendPoint>,
    [config.currentSeriesLabel, config.previousSeriesLabel],
  );

  return (
    <AreaTrendChart
      className="overview-revenue-card"
      title="Revenue Overview"
      description={config.description}
      data={config.data}
      labelKey="label"
      labelHeading="Period"
      series={series}
      tooltipTrend={{
        dataKey: "change",
        label: "Period change",
        tone: "positive",
        valueFormat: "signed-percent",
      }}
      actions={
        <SegmentedControl
          label="Revenue metric"
          options={VIEW_OPTIONS}
          value={view}
          onValueChange={(value) => setView(value as OverviewRevenueView)}
        />
      }
      metric={
        <div className="overview-chart-metric" aria-live="polite">
          <strong>{formatCurrency(config.current)}</strong>
          <TrendBadge tone="positive" label={formatSignedPercent(change)} />
          <span>vs {formatCurrency(config.previous)} previous period</span>
        </div>
      }
      height="large"
    />
  );
}
