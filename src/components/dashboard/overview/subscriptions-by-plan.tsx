import Link from "next/link";
import { DonutChart } from "@/components/charts/donut-chart";
import { PlanRow } from "@/components/dashboard/plan-row";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";

const PLAN_SEGMENTS = PLAN_PERFORMANCE.map((performance) => ({
  color: performance.plan.colorKey,
  id: performance.plan.id,
  label: performance.plan.name,
  value: performance.activeSubscriptions,
}));

export function SubscriptionsByPlan() {
  return (
    <DonutChart
      className="overview-plan-card"
      title="Subscriptions by Plan"
      description="Active subscriptions and monthly value"
      data={PLAN_SEGMENTS}
      height="compact"
      totalLabel="Active"
      actions={
        <Link className="overview-card-action" href="/subscriptions">
          View details
        </Link>
      }
      legend={
        <ul className="overview-plan-list" aria-label="Plan distribution legend">
          {PLAN_PERFORMANCE.map((performance) => (
            <li key={performance.plan.id}>
              <PlanRow className="overview-plan-row" performance={performance} />
            </li>
          ))}
        </ul>
      }
    />
  );
}
