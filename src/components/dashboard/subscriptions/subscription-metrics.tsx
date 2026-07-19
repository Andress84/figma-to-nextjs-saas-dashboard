import { CalendarDays, DollarSign, Percent, RefreshCcw } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { RETENTION_METRICS, RECURRING_REVENUE, SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import {
  SUBSCRIPTION_METRIC_SPARKLINES,
  SUBSCRIPTION_STATUS_SUMMARY,
} from "@/data/mock/subscriptions";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercentagePoints,
  formatSignedPercent,
} from "@/lib/formatters";

export function SubscriptionMetrics() {
  const trialing = SUBSCRIPTION_STATUS_SUMMARY.currentStatuses.find(
    (status) => status.status === "trialing",
  )?.count;

  return (
    <section className="subscription-metric-grid" aria-label="Subscription metrics">
      <MetricCard
        label="Active Subscriptions"
        value={formatCount(SUBSCRIPTION_FLOW.endingActive)}
        icon={<RefreshCcw />}
        trend={<TrendBadge tone="positive" label={formatSignedPercent(5.2)} />}
        supportingText={`+${formatCount(SUBSCRIPTION_FLOW.netGrowth)} net subscriptions`}
        sparkline={
          <Sparkline data={SUBSCRIPTION_METRIC_SPARKLINES["active-subscriptions"]} decorative />
        }
        highlighted
      />
      <MetricCard
        label="Monthly Recurring Revenue"
        value={formatCurrency(RECURRING_REVENUE.currentMrr)}
        icon={<DollarSign />}
        trend={<TrendBadge tone="positive" label={formatSignedPercent(8.4)} />}
        supportingText={`+${formatCurrency(
          RECURRING_REVENUE.currentMrr - RECURRING_REVENUE.previousMrr,
        )} net increase`}
        sparkline={
          <Sparkline
            data={SUBSCRIPTION_METRIC_SPARKLINES["monthly-recurring-revenue"]}
            tone="neutral"
            decorative
          />
        }
      />
      <MetricCard
        label="Trialing"
        value={formatCount(trialing ?? 0)}
        icon={<CalendarDays />}
        trend={<TrendBadge tone="information" label="86 ending" icon={null} />}
        supportingText="trials ending this week"
        sparkline={
          <Sparkline data={SUBSCRIPTION_METRIC_SPARKLINES.trialing} tone="warning" decorative />
        }
      />
      <MetricCard
        label="Churn Rate"
        value={formatChurnPercent(RETENTION_METRICS.currentChurnRate)}
        icon={<Percent />}
        trend={
          <TrendBadge
            tone="improvement"
            label={formatPercentagePoints(RETENTION_METRICS.churnRateChange)}
          />
        }
        supportingText={`${formatCount(SUBSCRIPTION_FLOW.churned)} churned subscriptions`}
        sparkline={
          <Sparkline
            data={SUBSCRIPTION_METRIC_SPARKLINES["churn-rate"]}
            tone="success"
            decorative
          />
        }
      />
    </section>
  );
}
