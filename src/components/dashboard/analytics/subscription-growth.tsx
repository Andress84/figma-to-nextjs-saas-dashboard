import { GroupedBarChart } from "@/components/charts/grouped-bar-chart";
import type { ComparisonChartSeries } from "@/components/charts/chart-types";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import {
  ANALYTICS_SUBSCRIPTION_GROWTH,
  PREVIOUS_NET_SUBSCRIPTION_GROWTH,
} from "@/data/mock/analytics";
import { SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import { formatCount } from "@/lib/formatters";

type GrowthPoint = (typeof ANALYTICS_SUBSCRIPTION_GROWTH)[number];

const GROWTH_SERIES = [
  {
    color: "violet",
    dataKey: "newPaidSubscriptions",
    label: "New subscriptions",
    marker: "bar",
    valueFormat: "count",
  },
  {
    color: "danger",
    dataKey: "churnedSubscriptions",
    label: "Churned subscriptions",
    marker: "bar",
    valueFormat: "count",
  },
] as const satisfies ComparisonChartSeries<GrowthPoint>;

export function SubscriptionGrowth() {
  return (
    <GroupedBarChart
      className="analytics-subscription-growth-card"
      title="Subscription Growth"
      description="New and churned subscriptions by week"
      data={ANALYTICS_SUBSCRIPTION_GROWTH}
      labelKey="shortLabel"
      labelHeading="Week starting"
      series={GROWTH_SERIES}
      tooltipTrend={{
        dataKey: "netSubscriptions",
        label: "Net subscriptions",
        tone: "positive",
        valueFormat: "number",
      }}
      actions={
        <TrendBadge
          tone="positive"
          label={`+${formatCount(SUBSCRIPTION_FLOW.netGrowth)} net`}
          icon={null}
        />
      }
      footer={
        <p className="analytics-growth-comparison">
          Previous net growth <strong>+{formatCount(PREVIOUS_NET_SUBSCRIPTION_GROWTH)}</strong>
        </p>
      }
      metric={
        <dl className="analytics-growth-summary" aria-label="Subscription growth totals">
          <div>
            <dt>New</dt>
            <dd>{formatCount(SUBSCRIPTION_FLOW.newPaid)}</dd>
          </div>
          <div data-tone="danger">
            <dt>Churned</dt>
            <dd>{formatCount(SUBSCRIPTION_FLOW.churned)}</dd>
          </div>
          <div data-tone="positive">
            <dt>Net growth</dt>
            <dd>+{formatCount(SUBSCRIPTION_FLOW.netGrowth)}</dd>
          </div>
        </dl>
      }
      height="standard"
    />
  );
}
