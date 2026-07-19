import { DonutChart } from "@/components/charts/donut-chart";
import type { ChartColorKey, DonutChartSegment } from "@/components/charts/chart-types";
import { SUBSCRIPTION_STATUS_SUMMARY } from "@/data/mock/subscriptions";
import { formatChurnPercent, formatCount } from "@/lib/formatters";
import type { CurrentSubscriptionStatus } from "@/types/dashboard";
import { SubscriptionDemoAction } from "./subscription-demo-action";

const statusPresentation = {
  active: { color: "violet", label: "Active" },
  trialing: { color: "lavender", label: "Trialing" },
  "past-due": { color: "danger", label: "Past due" },
  paused: { color: "slate", label: "Paused" },
} as const satisfies Record<
  CurrentSubscriptionStatus,
  { readonly color: ChartColorKey; readonly label: string }
>;

const statusSegments = SUBSCRIPTION_STATUS_SUMMARY.currentStatuses.map((status) => ({
  id: status.status,
  label: statusPresentation[status.status].label,
  value: status.count,
  color: statusPresentation[status.status].color,
})) satisfies readonly DonutChartSegment[];

export function SubscriptionStatus() {
  return (
    <DonutChart
      className="subscription-status-card"
      title="Subscription Status"
      description="Current state and period activity"
      data={statusSegments}
      height="compact"
      totalLabel="Current subscriptions"
      actions={
        <SubscriptionDemoAction message="Subscription status details are fully represented in this deterministic demo.">
          Details
        </SubscriptionDemoAction>
      }
      footer={
        <dl className="subscription-status-history">
          <div>
            <dt>Churned during selected period</dt>
            <dd>{formatCount(SUBSCRIPTION_STATUS_SUMMARY.historicalChurned)}</dd>
          </div>
          <div>
            <dt>Churn rate</dt>
            <dd>{formatChurnPercent(SUBSCRIPTION_STATUS_SUMMARY.historicalChurnRate)}</dd>
          </div>
        </dl>
      }
    />
  );
}
