"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DataTable,
  DataTableContainer,
  DataTableFrameHeader,
  type DataTableColumn,
} from "@/components/data-table";
import { PLANS_BY_ID } from "@/data/mock/plans";
import { formatDateTime, formatTransactionAmount } from "@/lib/formatters";
import type { TransactionRecord } from "@/types/dashboard";
import { useOverviewReport } from "./overview-report-context";

type TransactionColumnId = "customer" | "plan" | "date" | "payment" | "amount" | "status";

const TRANSACTION_COLUMNS = [
  {
    id: "customer",
    label: "Customer",
    rowHeader: true,
    renderCell: (transaction) => (
      <span className="overview-transaction-customer">
        <Avatar name={transaction.customerName} size="small" decorative />
        <strong>{transaction.customerName}</strong>
      </span>
    ),
  },
  {
    id: "plan",
    label: "Plan",
    renderCell: (transaction) => PLANS_BY_ID[transaction.planId].name,
  },
  {
    id: "date",
    label: "Date",
    renderCell: (transaction) => formatDateTime(transaction.timestamp),
  },
  {
    id: "payment",
    label: "Payment method",
    renderCell: (transaction) => transaction.paymentMethod,
  },
  {
    id: "amount",
    label: "Amount",
    align: "end",
    emphasized: true,
    numeric: true,
    renderCell: (transaction) => formatTransactionAmount(transaction.amount),
  },
  {
    id: "status",
    label: "Status",
    renderCell: (transaction) => <StatusBadge status={transaction.status} />,
  },
] as const satisfies readonly DataTableColumn<TransactionRecord, TransactionColumnId>[];

const VIEW_ALL_ACTION = (
  <Link className="overview-card-action" href="/customers">
    View all
  </Link>
);

export function RecentTransactions() {
  const { visibleTransactions } = useOverviewReport();

  return (
    <section className="overview-recent-transactions" aria-label="Recent Transactions">
      <div className="overview-transactions-desktop">
        <DataTableContainer
          viewportLabel="Scrollable recent transactions table"
          header={
            <DataTableFrameHeader
              title="Recent Transactions"
              description="Latest subscription payments"
              actions={VIEW_ALL_ACTION}
            />
          }
        >
          <DataTable
            className="overview-transactions-table"
            caption="Recent subscription transactions"
            columns={TRANSACTION_COLUMNS}
            rows={visibleTransactions}
            getRowId={(transaction) => transaction.id}
            emptyState={{
              title: "No matching transactions",
              description: "Clear or change the Overview filters to show transactions.",
            }}
          />
        </DataTableContainer>
      </div>

      <Card className="overview-transactions-mobile" padding="none">
        <DataTableFrameHeader
          title="Recent Transactions"
          description="Latest subscription payments"
          actions={VIEW_ALL_ACTION}
        />
        {visibleTransactions.length > 0 ? (
          <ul className="overview-mobile-transaction-list">
            {visibleTransactions.map((transaction) => {
              const plan = PLANS_BY_ID[transaction.planId];

              return (
                <li key={transaction.id} className="overview-mobile-transaction-row">
                  <Avatar name={transaction.customerName} size="small" decorative />
                  <div className="overview-mobile-transaction-copy">
                    <strong>{transaction.customerName}</strong>
                    <span>
                      {plan.name} · {formatDateTime(transaction.timestamp)}
                    </span>
                  </div>
                  <div className="overview-mobile-transaction-value">
                    <strong>{formatTransactionAmount(transaction.amount)}</strong>
                    <StatusBadge status={transaction.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="overview-mobile-transactions-empty" role="status">
            No matching transactions. Clear or change the Overview filters.
          </p>
        )}
      </Card>
    </section>
  );
}
