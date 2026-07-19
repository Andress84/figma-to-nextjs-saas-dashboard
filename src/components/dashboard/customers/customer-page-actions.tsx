"use client";

import { Download, ListFilter, Plus } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { TableSearch } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PLAN_DEFINITIONS } from "@/data/mock/plans";
import { downloadCsv } from "@/lib/csv";
import type { PlanId } from "@/types/dashboard";
import { buildCustomerCsv, CUSTOMER_EXPORT_FILE_NAME } from "./customer-export";
import { useCustomers } from "./customers-context";

export function CustomerPageActions() {
  const {
    announcement,
    planFilter,
    query,
    setAnnouncement,
    setPlanFilter,
    setQuery,
    sortedPageRows,
  } = useCustomers();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPopoverId = `${useId()}-customer-filters`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstFilterRef = useRef<HTMLSelectElement>(null);
  const activeFilterCount = Number(planFilter !== "all");

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

      if (
        target instanceof Node &&
        !popoverRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        event.preventDefault();
        closeAndRestoreFocus();
      }
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

  function exportCustomers() {
    downloadCsv(buildCustomerCsv(sortedPageRows), CUSTOMER_EXPORT_FILE_NAME);
    setAnnouncement(
      `Downloaded ${CUSTOMER_EXPORT_FILE_NAME} with ${sortedPageRows.length} ${
        sortedPageRows.length === 1 ? "customer" : "customers"
      }.`,
    );
  }

  return (
    <div className="customer-page-actions">
      <TableSearch
        className="customer-page-search"
        label="Search customers"
        placeholder="Search customers"
        value={query}
        onInput={(event) => setQuery(event.currentTarget.value)}
      />

      <div className="customer-filter-control">
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
            className="customer-filter-popover"
            id={filterPopoverId}
            role="dialog"
            aria-label="Filter customer accounts"
          >
            <div className="customer-filter-popover-heading">
              <strong>Filter customers</strong>
              <span>Use plan alongside search, lifecycle and risk filters.</span>
            </div>
            <label className="customer-filter-field">
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
            <div className="customer-filter-popover-actions">
              <Button size="compact" variant="ghost" onClick={() => setPlanFilter("all")}>
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
        onClick={exportCustomers}
      >
        Export CSV
      </Button>
      <Button
        className="customer-add-button"
        leadingIcon={<Plus aria-hidden="true" />}
        onClick={() =>
          setAnnouncement(
            "Add customer is a non-persistent demo action. No customer record was created.",
          )
        }
      >
        Add customer
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
