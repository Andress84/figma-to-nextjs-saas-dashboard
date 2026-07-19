import type { BillingCycle, PlanDefinition, PlanId, PlanPerformance } from "@/types/dashboard";

function createPlan(
  id: PlanId,
  name: string,
  monthlyPrice: number,
  colorKey: PlanDefinition["colorKey"],
): PlanDefinition {
  return {
    id,
    name,
    monthlyPrice,
    annualPrice: monthlyPrice * 12,
    colorKey,
  };
}

const starterPlan = createPlan("starter", "Starter", 15, "violet");
const growthPlan = createPlan("growth", "Growth", 29, "lavender");
const proPlan = createPlan("pro", "Pro", 49, "blue");
const teamsPlan = createPlan("teams", "Teams", 99, "slate");

export const PLAN_DEFINITIONS = [starterPlan, growthPlan, proPlan, teamsPlan] as const;

export const PLANS_BY_ID = {
  starter: starterPlan,
  growth: growthPlan,
  pro: proPlan,
  teams: teamsPlan,
} as const satisfies Record<PlanId, PlanDefinition>;

export function resolvePlanBillingAmount(planId: PlanId, billingCycle: BillingCycle) {
  const plan = PLANS_BY_ID[planId];
  return billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
}

function createPlanPerformance(
  plan: PlanDefinition,
  activeSubscriptions: number,
  subscriberShare: number,
  churnRate: number,
  trendValue: number,
): PlanPerformance {
  return {
    plan,
    activeSubscriptions,
    subscriberShare,
    monthlyRecurringRevenue: activeSubscriptions * plan.monthlyPrice,
    churnRate,
    trend: {
      format: "percent",
      fractionDigits: 1,
      tone: "positive",
      value: trendValue,
    },
  };
}

export const PLAN_PERFORMANCE = [
  createPlanPerformance(starterPlan, 1_326, 46.6, 4.5, 4),
  createPlanPerformance(growthPlan, 900, 31.6, 3.6, 7),
  createPlanPerformance(proPlan, 453, 15.9, 2.9, 11),
  createPlanPerformance(teamsPlan, 167, 5.9, 2.1, 12),
] as const satisfies readonly PlanPerformance[];
