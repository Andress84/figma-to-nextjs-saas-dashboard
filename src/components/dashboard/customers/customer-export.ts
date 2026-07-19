import { PLANS_BY_ID } from "@/data/mock/plans";
import { rowsToCsv } from "@/lib/csv";
import { formatCurrency, formatTableDate } from "@/lib/formatters";
import type { CustomerRecord } from "@/types/dashboard";
import { CUSTOMER_STATUS_LABELS } from "./customer-utils";

export const CUSTOMER_EXPORT_FILE_NAME = "subtera-customers-2026-07-14.csv";

export function buildCustomerCsv(customers: readonly CustomerRecord[]) {
  const rows = customers.map((customer) => [
    customer.name,
    customer.company,
    PLANS_BY_ID[customer.planId].name,
    formatCurrency(PLANS_BY_ID[customer.planId].monthlyPrice),
    CUSTOMER_STATUS_LABELS[customer.status],
    customer.atRisk ? "Yes" : "No",
    customer.lastActivityLabel,
    formatTableDate(customer.joinedDate),
  ]);

  return rowsToCsv([
    [
      "Customer",
      "Company",
      "Plan",
      "Monthly Value",
      "Status",
      "At Risk",
      "Last Activity",
      "Joined",
    ],
    ...rows,
  ]);
}
