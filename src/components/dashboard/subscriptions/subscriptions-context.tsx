"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { clampPage, getPageCount, type DataTableSortState } from "@/components/data-table";
import {
  SUBSCRIPTION_RECORD_TOTAL,
  SUBSCRIPTION_ROWS_PER_PAGE,
  SUBSCRIPTIONS,
} from "@/data/mock/subscriptions";
import type { SubscriptionRecord } from "@/types/dashboard";
import {
  filterSubscriptionRecords,
  sortSubscriptionRecords,
  type SubscriptionColumnId,
  type SubscriptionPlanFilter,
  type SubscriptionStatusFilter,
} from "./subscription-utils";

interface SubscriptionsContextValue {
  readonly announcement: string;
  readonly currentPage: number;
  readonly filteredSubscriptions: readonly SubscriptionRecord[];
  readonly isCanonicalView: boolean;
  readonly pageRows: readonly SubscriptionRecord[];
  readonly paginationTotal: number;
  readonly planFilter: SubscriptionPlanFilter;
  readonly query: string;
  readonly rowsPerPage: number;
  readonly selectedRowIds: readonly string[];
  readonly setAnnouncement: (message: string) => void;
  readonly setCurrentPage: (page: number) => void;
  readonly setPlanFilter: (value: SubscriptionPlanFilter) => void;
  readonly setQuery: (value: string) => void;
  readonly setRowsPerPage: (value: number) => void;
  readonly setRowSelected: (rowId: string, selected: boolean) => void;
  readonly setSortState: (value: DataTableSortState<SubscriptionColumnId> | null) => void;
  readonly setStatusFilter: (value: SubscriptionStatusFilter) => void;
  readonly sortedPageRows: readonly SubscriptionRecord[];
  readonly sortState: DataTableSortState<SubscriptionColumnId> | null;
  readonly statusFilter: SubscriptionStatusFilter;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null);

export function SubscriptionsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [query, updateQuery] = useState("");
  const [planFilter, updatePlanFilter] = useState<SubscriptionPlanFilter>("all");
  const [statusFilter, updateStatusFilter] = useState<SubscriptionStatusFilter>("all");
  const [sortState, setSortState] = useState<DataTableSortState<SubscriptionColumnId> | null>(null);
  const [currentPage, updateCurrentPage] = useState(1);
  const [rowsPerPage, updateRowsPerPage] = useState(SUBSCRIPTION_ROWS_PER_PAGE);
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>([
    "subscription-sophia-nguyen",
  ]);
  const [announcement, setAnnouncement] = useState("");
  const filteredSubscriptions = useMemo(
    () =>
      filterSubscriptionRecords(SUBSCRIPTIONS, { plan: planFilter, query, status: statusFilter }),
    [planFilter, query, statusFilter],
  );
  const isCanonicalView =
    query.trim().length === 0 && planFilter === "all" && statusFilter === "all";
  const paginationTotal = isCanonicalView
    ? SUBSCRIPTION_RECORD_TOTAL
    : filteredSubscriptions.length;
  const safeCurrentPage = clampPage(currentPage, getPageCount(paginationTotal, rowsPerPage));
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const pageRows = useMemo(
    () =>
      isCanonicalView && safeCurrentPage > 1
        ? []
        : filteredSubscriptions.slice(startIndex, startIndex + rowsPerPage),
    [filteredSubscriptions, isCanonicalView, rowsPerPage, safeCurrentPage, startIndex],
  );
  const sortedPageRows = useMemo(
    () => sortSubscriptionRecords(pageRows, sortState),
    [pageRows, sortState],
  );

  const resetToFirstPage = useCallback(() => updateCurrentPage(1), []);
  const setQuery = useCallback(
    (value: string) => {
      updateQuery(value);
      resetToFirstPage();
    },
    [resetToFirstPage],
  );
  const setPlanFilter = useCallback(
    (value: SubscriptionPlanFilter) => {
      updatePlanFilter(value);
      resetToFirstPage();
    },
    [resetToFirstPage],
  );
  const setStatusFilter = useCallback(
    (value: SubscriptionStatusFilter) => {
      updateStatusFilter(value);
      resetToFirstPage();
    },
    [resetToFirstPage],
  );
  const setCurrentPage = useCallback(
    (page: number) => {
      updateCurrentPage(clampPage(page, getPageCount(paginationTotal, rowsPerPage)));
    },
    [paginationTotal, rowsPerPage],
  );
  const setRowsPerPage = useCallback((value: number) => {
    updateRowsPerPage(value);
    updateCurrentPage(1);
  }, []);
  const setRowSelected = useCallback((rowId: string, selected: boolean) => {
    setSelectedRowIds((current) => {
      if (!selected) {
        return current.filter((id) => id !== rowId);
      }

      return current.includes(rowId) ? current : [rowId];
    });
  }, []);
  const value = useMemo<SubscriptionsContextValue>(
    () => ({
      announcement,
      currentPage: safeCurrentPage,
      filteredSubscriptions,
      isCanonicalView,
      pageRows,
      paginationTotal,
      planFilter,
      query,
      rowsPerPage,
      selectedRowIds,
      setAnnouncement,
      setCurrentPage,
      setPlanFilter,
      setQuery,
      setRowsPerPage,
      setRowSelected,
      setSortState,
      setStatusFilter,
      sortedPageRows,
      sortState,
      statusFilter,
    }),
    [
      announcement,
      filteredSubscriptions,
      isCanonicalView,
      pageRows,
      paginationTotal,
      planFilter,
      query,
      rowsPerPage,
      safeCurrentPage,
      selectedRowIds,
      setCurrentPage,
      setPlanFilter,
      setQuery,
      setRowsPerPage,
      setRowSelected,
      setStatusFilter,
      sortedPageRows,
      sortState,
      statusFilter,
    ],
  );

  return <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>;
}

export function useSubscriptions() {
  const value = useContext(SubscriptionsContext);

  if (!value) {
    throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  }

  return value;
}
