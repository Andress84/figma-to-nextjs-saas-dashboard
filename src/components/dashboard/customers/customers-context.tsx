"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { DataTableSortState } from "@/components/data-table";
import { CUSTOMER_RECORD_TOTAL, CUSTOMER_ROWS_PER_PAGE, CUSTOMERS } from "@/data/mock/customers";
import { clampPage, getPageCount } from "@/components/data-table";
import type { CustomerRecord } from "@/types/dashboard";
import {
  type CustomerColumnId,
  type CustomerLifecycleFilter,
  type CustomerPlanFilter,
  filterCustomerRecords,
  sortCustomerRecords,
} from "./customer-utils";

interface CustomersContextValue {
  readonly announcement: string;
  readonly atRiskOnly: boolean;
  readonly currentPage: number;
  readonly filteredCustomers: readonly CustomerRecord[];
  readonly isCanonicalView: boolean;
  readonly lifecycle: CustomerLifecycleFilter;
  readonly pageRows: readonly CustomerRecord[];
  readonly paginationTotal: number;
  readonly planFilter: CustomerPlanFilter;
  readonly query: string;
  readonly rowsPerPage: number;
  readonly selectedRowIds: readonly string[];
  readonly setAnnouncement: (message: string) => void;
  readonly setAtRiskOnly: (value: boolean) => void;
  readonly setCurrentPage: (page: number) => void;
  readonly setLifecycle: (value: CustomerLifecycleFilter) => void;
  readonly setPlanFilter: (value: CustomerPlanFilter) => void;
  readonly setQuery: (value: string) => void;
  readonly setRowsPerPage: (value: number) => void;
  readonly setRowSelected: (rowId: string, selected: boolean) => void;
  readonly setSortState: (value: DataTableSortState<CustomerColumnId> | null) => void;
  readonly sortState: DataTableSortState<CustomerColumnId> | null;
  readonly sortedPageRows: readonly CustomerRecord[];
}

const CustomersContext = createContext<CustomersContextValue | null>(null);

export function CustomersProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [query, updateQuery] = useState("");
  const [lifecycle, updateLifecycle] = useState<CustomerLifecycleFilter>("all");
  const [atRiskOnly, updateAtRiskOnly] = useState(false);
  const [planFilter, updatePlanFilter] = useState<CustomerPlanFilter>("all");
  const [sortState, setSortState] = useState<DataTableSortState<CustomerColumnId> | null>(null);
  const [currentPage, updateCurrentPage] = useState(1);
  const [rowsPerPage, updateRowsPerPage] = useState(CUSTOMER_ROWS_PER_PAGE);
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>(["customer-marco-ruiz"]);
  const [announcement, setAnnouncement] = useState("");
  const filteredCustomers = useMemo(
    () =>
      filterCustomerRecords(CUSTOMERS, {
        atRiskOnly,
        lifecycle,
        plan: planFilter,
        query,
      }),
    [atRiskOnly, lifecycle, planFilter, query],
  );
  const isCanonicalView =
    query.trim().length === 0 && lifecycle === "all" && !atRiskOnly && planFilter === "all";
  const paginationTotal = isCanonicalView ? CUSTOMER_RECORD_TOTAL : filteredCustomers.length;
  const safeCurrentPage = clampPage(currentPage, getPageCount(paginationTotal, rowsPerPage));
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const pageRows = useMemo(
    () =>
      isCanonicalView && safeCurrentPage > 1
        ? []
        : filteredCustomers.slice(startIndex, startIndex + rowsPerPage),
    [filteredCustomers, isCanonicalView, rowsPerPage, safeCurrentPage, startIndex],
  );
  const sortedPageRows = useMemo(
    () => sortCustomerRecords(pageRows, sortState),
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
  const setLifecycle = useCallback(
    (value: CustomerLifecycleFilter) => {
      updateLifecycle(value);
      resetToFirstPage();
    },
    [resetToFirstPage],
  );
  const setAtRiskOnly = useCallback(
    (value: boolean) => {
      updateAtRiskOnly(value);
      resetToFirstPage();
    },
    [resetToFirstPage],
  );
  const setPlanFilter = useCallback(
    (value: CustomerPlanFilter) => {
      updatePlanFilter(value);
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
  const value = useMemo<CustomersContextValue>(
    () => ({
      announcement,
      atRiskOnly,
      currentPage: safeCurrentPage,
      filteredCustomers,
      isCanonicalView,
      lifecycle,
      pageRows,
      paginationTotal,
      planFilter,
      query,
      rowsPerPage,
      selectedRowIds,
      setAnnouncement,
      setAtRiskOnly,
      setCurrentPage,
      setLifecycle,
      setPlanFilter,
      setQuery,
      setRowsPerPage,
      setRowSelected,
      setSortState,
      sortState,
      sortedPageRows,
    }),
    [
      announcement,
      atRiskOnly,
      filteredCustomers,
      isCanonicalView,
      lifecycle,
      pageRows,
      paginationTotal,
      planFilter,
      query,
      rowsPerPage,
      safeCurrentPage,
      selectedRowIds,
      setAtRiskOnly,
      setCurrentPage,
      setLifecycle,
      setPlanFilter,
      setQuery,
      setRowSelected,
      setRowsPerPage,
      sortState,
      sortedPageRows,
    ],
  );

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>;
}

export function useCustomers() {
  const value = useContext(CustomersContext);

  if (!value) {
    throw new Error("useCustomers must be used within CustomersProvider");
  }

  return value;
}
