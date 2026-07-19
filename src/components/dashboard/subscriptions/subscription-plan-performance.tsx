import { ArrowUpRight } from "lucide-react";
import {
  DataTableCaption,
  DataTableCell,
  DataTableContainer,
  DataTableElement,
  DataTableFrameHeader,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  DataTableRowHeaderCell,
} from "@/components/data-table";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import { RECURRING_REVENUE, SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import { formatCount, formatCurrency, formatPercent, formatSignedPercent } from "@/lib/formatters";
import type { PlanPerformance } from "@/types/dashboard";
import { SubscriptionDemoAction } from "./subscription-demo-action";

function readTrendValue(performance: PlanPerformance) {
  return typeof performance.trend.value === "number" ? performance.trend.value : 0;
}

export function SubscriptionPlanPerformance() {
  return (
    <DataTableContainer
      className="subscription-plan-performance"
      viewportLabel="Scrollable subscription plan performance table"
      header={
        <DataTableFrameHeader
          title="Plan Performance"
          description={`${formatCount(SUBSCRIPTION_FLOW.endingActive)} active · ${formatCurrency(
            RECURRING_REVENUE.currentMrr,
          )} MRR · 100% subscriber share`}
          actions={
            <SubscriptionDemoAction message="Manage plans is a demo action. No plan configuration was changed.">
              Manage plans
            </SubscriptionDemoAction>
          }
        />
      }
    >
      <DataTableElement className="subscription-plan-table">
        <DataTableCaption>
          Plan performance by price, active subscriptions, subscriber share, monthly recurring
          revenue, churn, and trend
        </DataTableCaption>
        <DataTableHeader>
          <DataTableHeaderCell>Plan</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Price</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Active</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Share</DataTableHeaderCell>
          <DataTableHeaderCell numeric>MRR</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Churn</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Trend</DataTableHeaderCell>
        </DataTableHeader>
        <tbody>
          {PLAN_PERFORMANCE.map((performance) => (
            <DataTableRow key={performance.plan.id}>
              <DataTableRowHeaderCell>
                <span className="analytics-plan-name">
                  <span
                    className="analytics-plan-dot"
                    data-plan-color={performance.plan.colorKey}
                    aria-hidden="true"
                  />
                  {performance.plan.name}
                </span>
              </DataTableRowHeaderCell>
              <DataTableCell numeric>{formatCurrency(performance.plan.monthlyPrice)}</DataTableCell>
              <DataTableCell numeric>{formatCount(performance.activeSubscriptions)}</DataTableCell>
              <DataTableCell numeric>{formatPercent(performance.subscriberShare, 1)}</DataTableCell>
              <DataTableCell numeric emphasized>
                {formatCurrency(performance.monthlyRecurringRevenue)}
              </DataTableCell>
              <DataTableCell numeric>{formatPercent(performance.churnRate, 1)}</DataTableCell>
              <DataTableCell numeric>
                <span className="analytics-plan-trend">
                  <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
                  {formatSignedPercent(readTrendValue(performance), 1)}
                </span>
              </DataTableCell>
            </DataTableRow>
          ))}
        </tbody>
      </DataTableElement>
    </DataTableContainer>
  );
}
