import { BadgeDollarSign, Percent, RefreshCcw, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { OVERVIEW_METRIC_SPARKLINES } from "@/data/mock/dashboard-overview";
import { PRIMARY_METRICS } from "@/data/mock/reporting";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercentagePoints,
  formatSignedPercent,
} from "@/lib/formatters";
import type { PrimaryMetric, PrimaryMetricId } from "@/types/dashboard";

const ICONS = {
  "monthly-recurring-revenue": <BadgeDollarSign />,
  "annual-recurring-revenue": <RefreshCcw />,
  "active-subscriptions": <UsersRound />,
  "churn-rate": <Percent />,
} as const satisfies Record<PrimaryMetricId, ReactNode>;

function formatMetricValue(metric: PrimaryMetric) {
  switch (metric.valueFormat) {
    case "currency":
      return formatCurrency(metric.currentValue);
    case "count":
      return formatCount(metric.currentValue);
    case "churn-percent":
      return formatChurnPercent(metric.currentValue);
  }
}

function formatTrend(metric: PrimaryMetric) {
  switch (metric.trend.format) {
    case "percent":
      return formatSignedPercent(metric.trend.value, metric.trend.fractionDigits);
    case "percentage-points":
      return formatPercentagePoints(metric.trend.value);
    case "text":
      return metric.trend.value;
  }
}

function formatSupportingDetail(metric: PrimaryMetric) {
  const { format, sign, suffix, value } = metric.supportingDetail;
  const formattedValue = format === "currency" ? formatCurrency(value) : formatCount(value);
  return `${sign === "positive" ? "+" : ""}${formattedValue} ${suffix}`;
}

export function OverviewMetrics() {
  return (
    <section className="overview-metric-grid" aria-label="Overview metrics">
      {PRIMARY_METRICS.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={formatMetricValue(metric)}
          icon={ICONS[metric.id]}
          trend={<TrendBadge tone={metric.trend.tone} label={formatTrend(metric)} />}
          supportingText={formatSupportingDetail(metric)}
          sparkline={
            <Sparkline
              data={OVERVIEW_METRIC_SPARKLINES[metric.id]}
              size="compact"
              tone={metric.id === "churn-rate" ? "success" : "violet"}
              decorative
            />
          }
          highlighted={metric.id === "monthly-recurring-revenue"}
        />
      ))}
    </section>
  );
}
