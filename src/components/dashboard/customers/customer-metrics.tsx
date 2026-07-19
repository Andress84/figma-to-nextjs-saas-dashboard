import { CalendarDays, Percent, RefreshCcw, UsersRound } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { CUSTOMER_METRIC_SPARKLINES, CUSTOMER_SUMMARY } from "@/data/mock/customers";
import { formatCount, formatSignedPercent } from "@/lib/formatters";

export function CustomerMetrics() {
  return (
    <section className="customer-metric-grid" aria-label="Customer metrics">
      <MetricCard
        label="Total Customers"
        value={formatCount(CUSTOMER_SUMMARY.totalCustomers)}
        icon={<UsersRound />}
        trend={<TrendBadge tone="positive" label={formatSignedPercent(9.8)} />}
        supportingText="+288 new accounts"
        sparkline={<Sparkline data={CUSTOMER_METRIC_SPARKLINES["total-customers"]} decorative />}
        highlighted
      />
      <MetricCard
        label="Active Subscribers"
        value={formatCount(CUSTOMER_SUMMARY.activeSubscribers)}
        icon={<RefreshCcw />}
        trend={<TrendBadge tone="positive" label={formatSignedPercent(5.2)} />}
        supportingText="88.6% of customer accounts"
        sparkline={
          <Sparkline
            data={CUSTOMER_METRIC_SPARKLINES["active-subscribers"]}
            tone="neutral"
            decorative
          />
        }
      />
      <MetricCard
        label="Trial Accounts"
        value={formatCount(CUSTOMER_SUMMARY.trialAccounts)}
        icon={<CalendarDays />}
        trend={<TrendBadge tone="information" label="86 ending" icon={null} />}
        supportingText="trials ending this week"
        sparkline={
          <Sparkline
            data={CUSTOMER_METRIC_SPARKLINES["trial-accounts"]}
            tone="warning"
            decorative
          />
        }
      />
      <MetricCard
        label="At-Risk Customers"
        value={formatCount(CUSTOMER_SUMMARY.atRiskCustomers)}
        icon={<Percent />}
        trend={<TrendBadge tone="improvement" label="12 fewer" icon={null} />}
        supportingText="payment or engagement risk"
        sparkline={
          <Sparkline
            data={CUSTOMER_METRIC_SPARKLINES["at-risk-customers"]}
            tone="success"
            decorative
          />
        }
      />
    </section>
  );
}
