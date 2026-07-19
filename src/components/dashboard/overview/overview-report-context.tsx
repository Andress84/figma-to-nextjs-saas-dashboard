"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { PlanId, TransactionRecord, TransactionStatus } from "@/types/dashboard";

type PlanFilter = "all" | PlanId;
type StatusFilter = "all" | TransactionStatus;

interface OverviewReportContextValue {
  readonly planFilter: PlanFilter;
  readonly setPlanFilter: (value: PlanFilter) => void;
  readonly setStatusFilter: (value: StatusFilter) => void;
  readonly statusFilter: StatusFilter;
  readonly totalTransactionCount: number;
  readonly visibleTransactions: readonly TransactionRecord[];
}

const OverviewReportContext = createContext<OverviewReportContextValue | null>(null);

interface OverviewReportProviderProps {
  readonly children: ReactNode;
  readonly transactions: readonly TransactionRecord[];
}

export function OverviewReportProvider({
  children,
  transactions,
}: Readonly<OverviewReportProviderProps>) {
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const visibleTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          (planFilter === "all" || transaction.planId === planFilter) &&
          (statusFilter === "all" || transaction.status === statusFilter),
      ),
    [planFilter, statusFilter, transactions],
  );
  const value = useMemo<OverviewReportContextValue>(
    () => ({
      planFilter,
      setPlanFilter,
      setStatusFilter,
      statusFilter,
      totalTransactionCount: transactions.length,
      visibleTransactions,
    }),
    [planFilter, statusFilter, transactions.length, visibleTransactions],
  );

  return <OverviewReportContext.Provider value={value}>{children}</OverviewReportContext.Provider>;
}

export function useOverviewReport() {
  const value = useContext(OverviewReportContext);

  if (!value) {
    throw new Error("useOverviewReport must be used within OverviewReportProvider");
  }

  return value;
}
