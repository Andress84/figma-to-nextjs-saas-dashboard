import { BadgeDollarSign, ChartNoAxesCombined, Percent, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { ANALYTICS_METRIC_SPARKLINES } from "@/data/mock/analytics";
import {
  AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT,
  RECURRING_REVENUE,
  RETENTION_METRICS,
  SUBSCRIPTION_FLOW,
} from "@/data/mock/reporting";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercentagePoints,
  formatSignedPercent,
  formatTransactionAmount,
} from "@/lib/formatters";

type AnalyticsMetricId = keyof typeof ANALYTICS_METRIC_SPARKLINES;

interface AnalyticsMetricDefinition {
  readonly highlighted?: boolean;
  readonly icon: ReactNode;
  readonly id: AnalyticsMetricId;
  readonly label: string;
  readonly sparklineTone?: "success" | "violet";
  readonly supportingText: string;
  readonly trend: ReactNode;
  readonly value: string;
}

const ANALYTICS_METRICS: readonly AnalyticsMetricDefinition[] = [
  {
    id: "mrr-growth",
    label: "MRR Growth",
    value: formatSignedPercent(8.4),
    supportingText: `+${formatCurrency(
      RECURRING_REVENUE.currentMrr - RECURRING_REVENUE.previousMrr,
    )} net MRR increase`,
    trend: <TrendBadge tone="positive" label="vs +6.1%" icon={null} />,
    icon: <ChartNoAxesCombined />,
    highlighted: true,
  },
  {
    id: "arpa",
    label: "Average Revenue per Account",
    value: formatTransactionAmount(AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT),
    supportingText: `${formatCurrency(RECURRING_REVENUE.currentMrr)} / ${formatCount(
      SUBSCRIPTION_FLOW.endingActive,
    )} active`,
    trend: <TrendBadge tone="positive" label={formatSignedPercent(2.1)} />,
    icon: <BadgeDollarSign />,
  },
  {
    id: "net-subscription-growth",
    label: "Net Subscription Growth",
    value: `+${formatCount(SUBSCRIPTION_FLOW.netGrowth)}`,
    supportingText: `${formatCount(SUBSCRIPTION_FLOW.churned)} churned subscriptions`,
    trend: (
      <TrendBadge
        tone="positive"
        label={`${formatCount(SUBSCRIPTION_FLOW.newPaid)} new`}
        icon={null}
      />
    ),
    icon: <RefreshCcw />,
  },
  {
    id: "churn-rate",
    label: "Churn Rate",
    value: formatChurnPercent(RETENTION_METRICS.currentChurnRate),
    supportingText: `Previous period ${formatChurnPercent(RETENTION_METRICS.previousChurnRate)}`,
    trend: (
      <TrendBadge
        tone="improvement"
        label={formatPercentagePoints(RETENTION_METRICS.churnRateChange)}
      />
    ),
    icon: <Percent />,
    sparklineTone: "success",
  },
];

export function AnalyticsMetrics() {
  return (
    <section className="analytics-metric-grid" aria-label="Analytics metrics">
      {ANALYTICS_METRICS.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          icon={metric.icon}
          trend={metric.trend}
          supportingText={metric.supportingText}
          sparkline={
            <Sparkline
              data={ANALYTICS_METRIC_SPARKLINES[metric.id]}
              size="compact"
              tone={metric.sparklineTone ?? "violet"}
              decorative
            />
          }
          highlighted={metric.highlighted}
        />
      ))}
    </section>
  );
}
