import { PLANS_BY_ID } from "@/data/mock/plans";
import type { CustomerRecord, CustomerStatus, PlanId } from "@/types/dashboard";
import type { DataTableSortState } from "@/components/data-table";

export type CustomerLifecycleFilter = "all" | CustomerStatus;
export type CustomerPlanFilter = "all" | PlanId;
export type CustomerColumnId =
  | "customer"
  | "company"
  | "plan"
  | "monthly-value"
  | "status"
  | "last-activity"
  | "joined"
  | "actions";

export interface CustomerFilters {
  readonly atRiskOnly: boolean;
  readonly lifecycle: CustomerLifecycleFilter;
  readonly plan: CustomerPlanFilter;
  readonly query: string;
}

export const CUSTOMER_LIFECYCLE_TABS = [
  { label: "All", value: "all", controlsId: "customer-table-panel" },
  { label: "Active", value: "active", controlsId: "customer-table-panel" },
  { label: "Trial", value: "trial", controlsId: "customer-table-panel" },
  { label: "Past due", value: "past-due", controlsId: "customer-table-panel" },
  { label: "Churned", value: "churned", controlsId: "customer-table-panel" },
] as const satisfies readonly {
  readonly controlsId: string;
  readonly label: string;
  readonly value: CustomerLifecycleFilter;
}[];

export const CUSTOMER_STATUS_LABELS = {
  active: "Active",
  trial: "Trial",
  "past-due": "Past due",
  churned: "Churned",
} as const satisfies Record<CustomerStatus, string>;

export function filterCustomerRecords(
  customers: readonly CustomerRecord[],
  filters: CustomerFilters,
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("en-US");

  return customers.filter((customer) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      customer.name.toLocaleLowerCase("en-US").includes(normalizedQuery) ||
      customer.company.toLocaleLowerCase("en-US").includes(normalizedQuery);
    const matchesLifecycle = filters.lifecycle === "all" || customer.status === filters.lifecycle;
    const matchesRisk = !filters.atRiskOnly || customer.atRisk;
    const matchesPlan = filters.plan === "all" || customer.planId === filters.plan;

    return matchesQuery && matchesLifecycle && matchesRisk && matchesPlan;
  });
}

export function compareCustomerRecords(
  left: CustomerRecord,
  right: CustomerRecord,
  columnId: CustomerColumnId,
) {
  if (columnId === "customer") {
    return left.name.localeCompare(right.name, "en-US");
  }

  if (columnId === "company") {
    return left.company.localeCompare(right.company, "en-US");
  }

  if (columnId === "plan") {
    return PLANS_BY_ID[left.planId].name.localeCompare(PLANS_BY_ID[right.planId].name, "en-US");
  }

  if (columnId === "monthly-value") {
    return PLANS_BY_ID[left.planId].monthlyPrice - PLANS_BY_ID[right.planId].monthlyPrice;
  }

  if (columnId === "status") {
    return CUSTOMER_STATUS_LABELS[left.status].localeCompare(
      CUSTOMER_STATUS_LABELS[right.status],
      "en-US",
    );
  }

  if (columnId === "last-activity") {
    return left.lastActivityMinutesAgo - right.lastActivityMinutesAgo;
  }

  if (columnId === "joined") {
    return left.joinedDate.localeCompare(right.joinedDate);
  }

  return 0;
}

export function sortCustomerRecords(
  customers: readonly CustomerRecord[],
  sortState: DataTableSortState<CustomerColumnId> | null,
) {
  const copiedCustomers = customers.map((customer, originalIndex) => ({
    customer,
    originalIndex,
  }));

  if (sortState === null || sortState.columnId === "actions") {
    return copiedCustomers.map(({ customer }) => customer);
  }

  const multiplier = sortState.direction === "ascending" ? 1 : -1;
  copiedCustomers.sort((left, right) => {
    const comparison =
      compareCustomerRecords(left.customer, right.customer, sortState.columnId) * multiplier;
    return comparison === 0 ? left.originalIndex - right.originalIndex : comparison;
  });

  return copiedCustomers.map(({ customer }) => customer);
}

export function getCustomerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
