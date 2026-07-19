"use client";

import { CalendarDays, ChevronDown, Download, ListFilter, Repeat2 } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { AnalyticsChurnFilter } from "@/data/mock/analytics";
import { PLAN_DEFINITIONS } from "@/data/mock/plans";
import type { PlanId } from "@/types/dashboard";
import { downloadCsv } from "@/lib/csv";
import { ANALYTICS_EXPORT_FILE_NAME, buildAnalyticsReportCsv } from "./analytics-export";
import { useAnalyticsReport } from "./analytics-report-context";

interface AnalyticsReportActionsProps {
  readonly reportingPeriod: string;
}

export function AnalyticsReportActions({ reportingPeriod }: Readonly<AnalyticsReportActionsProps>) {
  const {
    churnFilter,
    compareToPrevious,
    planFilter,
    revenueView,
    setChurnFilter,
    setCompareToPrevious,
    setPlanFilter,
    visiblePlans,
  } = useAnalyticsReport();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const filterPopoverId = `${useId()}-analytics-filters`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstFilterRef = useRef<HTMLSelectElement>(null);
  const activeFilterCount = Number(planFilter !== "all") + Number(churnFilter !== "all");

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

  function exportVisibleReport() {
    downloadCsv(
      buildAnalyticsReportCsv({
        compareToPrevious,
        planPerformance: visiblePlans,
        revenueView,
      }),
      ANALYTICS_EXPORT_FILE_NAME,
    );
    setExportStatus(
      `Downloaded ${ANALYTICS_EXPORT_FILE_NAME} with ${visiblePlans.length} visible ${
        visiblePlans.length === 1 ? "plan" : "plans"
      }.`,
    );
  }

  return (
    <div className="analytics-report-actions">
      <button
        className="analytics-date-control"
        type="button"
        aria-label={`Reporting period: ${reportingPeriod}`}
      >
        <CalendarDays size={17} strokeWidth={1.8} aria-hidden="true" />
        <span>{reportingPeriod}</span>
        <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>

      <Button
        className="analytics-compare-control"
        variant="ghost"
        leadingIcon={<Repeat2 aria-hidden="true" />}
        aria-pressed={compareToPrevious}
        onClick={() => setCompareToPrevious(!compareToPrevious)}
      >
        Compare to previous period
      </Button>

      <div className="analytics-filter-control">
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
            className="analytics-filter-popover"
            id={filterPopoverId}
            role="dialog"
            aria-label="Filter Analytics report"
          >
            <div className="analytics-filter-popover-heading">
              <strong>Filter plan performance</strong>
              <span>
                {visiblePlans.length} of {PLAN_DEFINITIONS.length} plans shown
              </span>
            </div>
            <label className="analytics-filter-field">
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
            <label className="analytics-filter-field">
              <span>Churn performance</span>
              <Select
                value={churnFilter}
                onChange={(event) => setChurnFilter(event.target.value as AnalyticsChurnFilter)}
              >
                <option value="all">All churn rates</option>
                <option value="low-churn">3.5% or lower</option>
                <option value="elevated-churn">Above 3.5%</option>
              </Select>
            </label>
            <div className="analytics-filter-popover-actions">
              <Button
                size="compact"
                variant="ghost"
                onClick={() => {
                  setPlanFilter("all");
                  setChurnFilter("all");
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
        onClick={exportVisibleReport}
      >
        Export report
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {exportStatus}
      </span>
    </div>
  );
}
