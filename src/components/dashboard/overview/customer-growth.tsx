import { LineTrendChart } from "@/components/charts/line-trend-chart";
import type { NonEmptyChartSeries } from "@/components/charts/chart-types";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { CUSTOMER_ACCOUNT_TOTALS, SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import { CUSTOMER_GROWTH_SERIES } from "@/data/mock/revenue";
import { formatCount, formatSignedPercent } from "@/lib/formatters";

const CUSTOMER_GROWTH_CHART_SERIES = [
  {
    color: "violet",
    dataKey: "newPaidSubscriptions",
    label: "New subscriptions",
    marker: "line",
    valueFormat: "count",
  },
  {
    color: "danger",
    dataKey: "churnedSubscriptions",
    label: "Churned",
    marker: "line",
    valueFormat: "count",
  },
] as const satisfies NonEmptyChartSeries<(typeof CUSTOMER_GROWTH_SERIES)[number]>;

export function CustomerGrowth() {
  return (
    <LineTrendChart
      className="overview-customer-growth-card"
      title="Customer Growth"
      description="New paid subscriptions and churn"
      data={CUSTOMER_GROWTH_SERIES}
      labelKey="label"
      labelHeading="Period"
      series={CUSTOMER_GROWTH_CHART_SERIES}
      tooltipTrend={{
        dataKey: "netSubscriptions",
        label: "Net subscriptions",
        tone: "positive",
        valueFormat: "number",
      }}
      actions={<TrendBadge tone="positive" label={formatSignedPercent(9.8)} />}
      metric={
        <div className="overview-customer-total">
          <strong>{formatCount(CUSTOMER_ACCOUNT_TOTALS.current)}</strong>
          <span>total customer accounts</span>
        </div>
      }
      footer={
        <dl className="overview-growth-summary" aria-label="Customer growth totals">
          <div>
            <dt>New</dt>
            <dd>{formatCount(SUBSCRIPTION_FLOW.newPaid)}</dd>
          </div>
          <div>
            <dt>Churned</dt>
            <dd>{formatCount(SUBSCRIPTION_FLOW.churned)}</dd>
          </div>
          <div data-tone="positive">
            <dt>Net growth</dt>
            <dd>+{formatCount(SUBSCRIPTION_FLOW.netGrowth)}</dd>
          </div>
        </dl>
      }
      height="compact"
    />
  );
}
