"use client";

import { Download, ListFilter, Plus } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef, useState } from "react";
import { ReportingPeriodPopover } from "@/components/dashboard/reporting-period/reporting-period-popover";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PLAN_DEFINITIONS } from "@/data/mock/plans";
import { downloadCsv } from "@/lib/csv";
import type { PlanId, SubscriptionStatus } from "@/types/dashboard";
import { buildSubscriptionCsv, SUBSCRIPTION_EXPORT_FILE_NAME } from "./subscription-export";
import { SUBSCRIPTION_STATUS_OPTIONS } from "./subscription-utils";
import { useSubscriptions } from "./subscriptions-context";

export function SubscriptionPageActions() {
  const {
    planFilter,
    setAnnouncement,
    setPlanFilter,
    setStatusFilter,
    sortedPageRows,
    statusFilter,
  } = useSubscriptions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPopoverId = `${useId()}-subscription-filters`;
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

  function exportSubscriptions() {
    downloadCsv(buildSubscriptionCsv(sortedPageRows), SUBSCRIPTION_EXPORT_FILE_NAME);
    setAnnouncement(
      `Downloaded ${SUBSCRIPTION_EXPORT_FILE_NAME} with ${sortedPageRows.length} ${
        sortedPageRows.length === 1 ? "subscription" : "subscriptions"
      }.`,
    );
  }

  return (
    <div className="subscription-page-actions">
      <ReportingPeriodPopover />

      <div className="subscription-secondary-actions">
        <div className="subscription-filter-control">
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
              className="subscription-filter-popover"
              id={filterPopoverId}
              role="dialog"
              aria-label="Filter subscriptions"
            >
              <div className="subscription-filter-popover-heading">
                <strong>Filter subscriptions</strong>
                <span>Plan and lifecycle filters apply to the subscription table.</span>
              </div>
              <label className="subscription-filter-field">
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
              <label className="subscription-filter-field">
                <span>Status</span>
                <Select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | SubscriptionStatus)
                  }
                >
                  <option value="all">All statuses</option>
                  {SUBSCRIPTION_STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="subscription-filter-popover-actions">
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
          onClick={exportSubscriptions}
        >
          Export
        </Button>
        <Button
          className="subscription-add-button"
          leadingIcon={<Plus aria-hidden="true" />}
          onClick={() =>
            setAnnouncement(
              "Add subscription is a non-persistent demo action. No subscription record was created.",
            )
          }
        >
          Add subscription
        </Button>
      </div>
    </div>
  );
}
