import type { DataTableSortState } from "@/components/data-table";
import { PLANS_BY_ID, resolvePlanBillingAmount } from "@/data/mock/plans";
import type { PlanId, SubscriptionRecord, SubscriptionStatus } from "@/types/dashboard";

export type SubscriptionPlanFilter = "all" | PlanId;
export type SubscriptionStatusFilter = "all" | SubscriptionStatus;
export type SubscriptionColumnId =
  | "customer"
  | "plan"
  | "status"
  | "billing-cycle"
  | "started"
  | "next-billing"
  | "amount"
  | "actions";

export interface SubscriptionFilters {
  readonly plan: SubscriptionPlanFilter;
  readonly query: string;
  readonly status: SubscriptionStatusFilter;
}

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Trialing", value: "trialing" },
  { label: "Past due", value: "past-due" },
  { label: "Paused", value: "paused" },
  { label: "Canceled", value: "canceled" },
] as const satisfies readonly {
  readonly label: string;
  readonly value: SubscriptionStatus;
}[];

export const SUBSCRIPTION_STATUS_LABELS = {
  active: "Active",
  trialing: "Trialing",
  "past-due": "Past due",
  paused: "Paused",
  canceled: "Canceled",
} as const satisfies Record<SubscriptionStatus, string>;

export const BILLING_CYCLE_LABELS = {
  monthly: "Monthly",
  annual: "Annual",
} as const;

export function filterSubscriptionRecords(
  subscriptions: readonly SubscriptionRecord[],
  filters: SubscriptionFilters,
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("en-US");

  return subscriptions.filter((subscription) => {
    const plan = PLANS_BY_ID[subscription.planId];
    const matchesQuery =
      normalizedQuery.length === 0 ||
      subscription.customerName.toLocaleLowerCase("en-US").includes(normalizedQuery) ||
      plan.name.toLocaleLowerCase("en-US").includes(normalizedQuery);
    const matchesPlan = filters.plan === "all" || subscription.planId === filters.plan;
    const matchesStatus = filters.status === "all" || subscription.status === filters.status;

    return matchesQuery && matchesPlan && matchesStatus;
  });
}

export function compareSubscriptionRecords(
  left: SubscriptionRecord,
  right: SubscriptionRecord,
  columnId: SubscriptionColumnId,
) {
  if (columnId === "customer") {
    return left.customerName.localeCompare(right.customerName, "en-US");
  }

  if (columnId === "plan") {
    return PLANS_BY_ID[left.planId].name.localeCompare(PLANS_BY_ID[right.planId].name, "en-US");
  }

  if (columnId === "status") {
    return SUBSCRIPTION_STATUS_LABELS[left.status].localeCompare(
      SUBSCRIPTION_STATUS_LABELS[right.status],
      "en-US",
    );
  }

  if (columnId === "billing-cycle") {
    return left.billingCycle.localeCompare(right.billingCycle, "en-US");
  }

  if (columnId === "started") {
    return left.startedDate.localeCompare(right.startedDate);
  }

  if (columnId === "next-billing") {
    return (left.nextBillingDate ?? "9999-12-31").localeCompare(
      right.nextBillingDate ?? "9999-12-31",
    );
  }

  if (columnId === "amount") {
    return (
      resolvePlanBillingAmount(left.planId, left.billingCycle) -
      resolvePlanBillingAmount(right.planId, right.billingCycle)
    );
  }

  return 0;
}

export function sortSubscriptionRecords(
  subscriptions: readonly SubscriptionRecord[],
  sortState: DataTableSortState<SubscriptionColumnId> | null,
) {
  const copiedSubscriptions = subscriptions.map((subscription, originalIndex) => ({
    originalIndex,
    subscription,
  }));

  if (sortState === null || sortState.columnId === "actions") {
    return copiedSubscriptions.map(({ subscription }) => subscription);
  }

  const multiplier = sortState.direction === "ascending" ? 1 : -1;
  copiedSubscriptions.sort((left, right) => {
    const comparison =
      compareSubscriptionRecords(left.subscription, right.subscription, sortState.columnId) *
      multiplier;
    return comparison === 0 ? left.originalIndex - right.originalIndex : comparison;
  });

  return copiedSubscriptions.map(({ subscription }) => subscription);
}

export function getSubscriptionInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getSubscriptionAmountQualifier(subscription: SubscriptionRecord) {
  if (subscription.amountQualifier) {
    return subscription.amountQualifier;
  }

  return subscription.billingCycle === "annual" ? "per year" : "per month";
}
