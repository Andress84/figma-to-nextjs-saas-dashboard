import { Card } from "@/components/ui/card";
import { formatCount, formatCurrency, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PlanPerformance } from "@/types/dashboard";

export interface PlanRowProps {
  readonly className?: string;
  readonly performance: PlanPerformance;
}

export function PlanRow({ className, performance }: PlanRowProps) {
  const { activeSubscriptions, monthlyRecurringRevenue, plan, subscriberShare } = performance;

  return (
    <Card
      className={cn("dashboard-plan-row", className)}
      padding="compact"
      role="group"
      aria-label={`${plan.name} plan performance`}
    >
      <div className="dashboard-plan-row-identity">
        <span
          className="dashboard-plan-row-indicator"
          data-plan-color={plan.colorKey}
          aria-hidden="true"
        />
        <div>
          <div className="dashboard-plan-row-name">
            <strong>{plan.name}</strong>
            <span>· {formatCurrency(plan.monthlyPrice)}</span>
          </div>
          <p>
            {formatCount(activeSubscriptions)} · {formatPercent(subscriberShare, 1)}
          </p>
        </div>
      </div>
      <div className="dashboard-plan-row-mrr">
        <strong>{formatCurrency(monthlyRecurringRevenue)}</strong>
        <span>MRR</span>
      </div>
    </Card>
  );
}
