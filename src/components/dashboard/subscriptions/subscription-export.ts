import { PLANS_BY_ID, resolvePlanBillingAmount } from "@/data/mock/plans";
import { rowsToCsv } from "@/lib/csv";
import { formatCurrency, formatTableDate } from "@/lib/formatters";
import type { SubscriptionRecord } from "@/types/dashboard";
import {
  BILLING_CYCLE_LABELS,
  getSubscriptionAmountQualifier,
  SUBSCRIPTION_STATUS_LABELS,
} from "./subscription-utils";

export const SUBSCRIPTION_EXPORT_FILE_NAME = "subtera-subscriptions-2026-07-14.csv";

export function buildSubscriptionCsv(subscriptions: readonly SubscriptionRecord[]) {
  const rows = subscriptions.map((subscription) => [
    subscription.customerName,
    PLANS_BY_ID[subscription.planId].name,
    SUBSCRIPTION_STATUS_LABELS[subscription.status],
    BILLING_CYCLE_LABELS[subscription.billingCycle],
    formatTableDate(subscription.startedDate),
    subscription.nextBillingDate
      ? formatTableDate(subscription.nextBillingDate)
      : (subscription.nextBillingLabel ?? "—"),
    formatCurrency(resolvePlanBillingAmount(subscription.planId, subscription.billingCycle)),
    getSubscriptionAmountQualifier(subscription),
  ]);

  return rowsToCsv([
    [
      "Customer",
      "Plan",
      "Status",
      "Billing Cycle",
      "Started",
      "Next Billing",
      "Amount",
      "Amount Detail",
    ],
    ...rows,
  ]);
}
