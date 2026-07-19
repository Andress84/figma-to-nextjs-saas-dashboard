"use client";

import { CalendarDays, ChevronDown, Download, ListFilter } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PLAN_DEFINITIONS } from "@/data/mock/plans";
import type { PlanId, TransactionStatus } from "@/types/dashboard";
import { buildOverviewTransactionsCsv, OVERVIEW_EXPORT_FILE_NAME } from "./overview-export";
import { useOverviewReport } from "./overview-report-context";

const TRANSACTION_STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Refunded", value: "refunded" },
  { label: "Failed", value: "failed" },
] as const satisfies readonly { readonly label: string; readonly value: TransactionStatus }[];

interface OverviewReportActionsProps {
  readonly reportingPeriod: string;
}

export function OverviewReportActions({ reportingPeriod }: Readonly<OverviewReportActionsProps>) {
  const {
    planFilter,
    setPlanFilter,
    setStatusFilter,
    statusFilter,
    totalTransactionCount,
    visibleTransactions,
  } = useOverviewReport();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const filterPopoverId = `${useId()}-overview-filters`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstFilterRef = useRef<HTMLSelectElement>(null);
  const activeFilterCount = Number(planFilter !== "all") + Number(statusFilter !== "all");

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    firstFilterRef.current?.focus();

    function closeAndRestoreFocus() {
      setIsFilterOpen(false);
      queueMicrotask(() => triggerRef.current?.focus());
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (popoverRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      closeAndRestoreFocus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen]);

  function closeFilterPopover() {
    setIsFilterOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }

  function handleTriggerPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  function exportVisibleTransactions() {
    const csv = buildOverviewTransactionsCsv(visibleTransactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = OVERVIEW_EXPORT_FILE_NAME;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setExportStatus(
      `Downloaded ${OVERVIEW_EXPORT_FILE_NAME} with ${visibleTransactions.length} ${
        visibleTransactions.length === 1 ? "transaction" : "transactions"
      }.`,
    );
  }

  return (
    <div className="overview-report-actions">
      <button
        className="overview-date-control"
        type="button"
        aria-label={`Reporting period: ${reportingPeriod}`}
      >
        <CalendarDays size={17} strokeWidth={1.8} aria-hidden="true" />
        <span>{reportingPeriod}</span>
        <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>

      <div className="overview-secondary-actions">
        <div className="overview-filter-control">
          <Button
            ref={triggerRef}
            variant="ghost"
            leadingIcon={<ListFilter aria-hidden="true" />}
            aria-controls={filterPopoverId}
            aria-expanded={isFilterOpen}
            aria-haspopup="dialog"
            onClick={() => setIsFilterOpen((current) => !current)}
            onPointerDown={handleTriggerPointerDown}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>

          {isFilterOpen ? (
            <div
              ref={popoverRef}
              className="overview-filter-popover"
              id={filterPopoverId}
              role="dialog"
              aria-label="Filter recent transactions"
            >
              <div className="overview-filter-popover-heading">
                <strong>Filter transactions</strong>
                <span>
                  {visibleTransactions.length} of {totalTransactionCount} shown
                </span>
              </div>
              <label className="overview-filter-field">
                <span>Plan</span>
                <Select
                  ref={firstFilterRef}
                  value={planFilter}
                  onChange={(event) => setPlanFilter(event.target.value as "all" | PlanId)}
                >
                  <option value="all">All plans</option>
                  {PLAN_DEFINITIONS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="overview-filter-field">
                <span>Status</span>
                <Select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | TransactionStatus)
                  }
                >
                  <option value="all">All statuses</option>
                  {TRANSACTION_STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="overview-filter-popover-actions">
                <Button
                  size="compact"
                  variant="ghost"
                  onClick={() => {
                    setPlanFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear
                </Button>
                <Button size="compact" variant="secondary" onClick={closeFilterPopover}>
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <Button
          variant="secondary"
          leadingIcon={<Download aria-hidden="true" />}
          onClick={exportVisibleTransactions}
        >
          Export
        </Button>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {exportStatus}
      </span>
    </div>
  );
}
