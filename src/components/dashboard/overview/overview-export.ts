import { PLANS_BY_ID } from "@/data/mock/plans";
import { rowsToCsv } from "@/lib/csv";
import { formatDateTime, formatTransactionAmount } from "@/lib/formatters";
import type { TransactionRecord } from "@/types/dashboard";

export const OVERVIEW_EXPORT_FILE_NAME = "subtera-overview-transactions-2026-07-14.csv";

const TRANSACTION_STATUS_LABELS = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
} as const satisfies Record<TransactionRecord["status"], string>;

export function buildOverviewTransactionsCsv(transactions: readonly TransactionRecord[]) {
  const rows = transactions.map((transaction) => [
    transaction.customerName,
    PLANS_BY_ID[transaction.planId].name,
    formatDateTime(transaction.timestamp),
    transaction.paymentMethod,
    formatTransactionAmount(transaction.amount),
    TRANSACTION_STATUS_LABELS[transaction.status],
  ]);

  return rowsToCsv([["Customer", "Plan", "Date", "Payment method", "Amount", "Status"], ...rows]);
}
