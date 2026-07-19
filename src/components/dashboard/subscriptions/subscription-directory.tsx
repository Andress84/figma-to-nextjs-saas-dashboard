"use client";

import { Eye, MousePointer2 } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DataTable,
  DataTableContainer,
  DataTableFrameHeader,
  RowActions,
  RowsPerPageControl,
  TablePagination,
  TablePaginationFooter,
  TableSearch,
  type DataTableColumn,
  type DataTableRowAction,
} from "@/components/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { PLAN_DEFINITIONS, PLANS_BY_ID, resolvePlanBillingAmount } from "@/data/mock/plans";
import { SUBSCRIPTION_RECORD_TOTAL } from "@/data/mock/subscriptions";
import { formatCount, formatCurrency, formatTableDate } from "@/lib/formatters";
import type { PlanId, SubscriptionRecord, SubscriptionStatus } from "@/types/dashboard";
import {
  BILLING_CYCLE_LABELS,
  compareSubscriptionRecords,
  getSubscriptionAmountQualifier,
  getSubscriptionInitials,
  type SubscriptionColumnId,
  SUBSCRIPTION_STATUS_OPTIONS,
} from "./subscription-utils";
import { useSubscriptions } from "./subscriptions-context";

function SubscriptionIdentity({ subscription }: Readonly<{ subscription: SubscriptionRecord }>) {
  return (
    <span className="subscription-identity">
      <Avatar
        decorative
        initials={getSubscriptionInitials(subscription.customerName)}
        name={subscription.customerName}
        size="small"
      />
      <span>{subscription.customerName}</span>
    </span>
  );
}

function SubscriptionPlan({ subscription }: Readonly<{ subscription: SubscriptionRecord }>) {
  const plan = PLANS_BY_ID[subscription.planId];

  return (
    <span className="subscription-plan">
      <span className="subscription-plan-dot" data-plan-color={plan.colorKey} aria-hidden="true" />
      <span>{plan.name}</span>
    </span>
  );
}

function SubscriptionAmount({ subscription }: Readonly<{ subscription: SubscriptionRecord }>) {
  return (
    <span className="subscription-amount">
      <strong>
        {formatCurrency(resolvePlanBillingAmount(subscription.planId, subscription.billingCycle))}
      </strong>
      <span>{getSubscriptionAmountQualifier(subscription)}</span>
    </span>
  );
}

function SubscriptionTableControls() {
  const { planFilter, query, setPlanFilter, setQuery, setStatusFilter, statusFilter } =
    useSubscriptions();

  return (
    <div className="subscription-table-controls">
      <TableSearch
        className="subscription-table-search"
        label="Search subscriptions"
        placeholder="Search subscriptions"
        value={query}
        onInput={(event) => setQuery(event.currentTarget.value)}
      />
      <label className="subscription-table-filter">
        <span className="sr-only">Plan</span>
        <Select
          aria-label="Plan"
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
      <label className="subscription-table-filter">
        <span className="sr-only">Status</span>
        <Select
          aria-label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | SubscriptionStatus)}
        >
          <option value="all">All statuses</option>
          {SUBSCRIPTION_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

export function SubscriptionDirectory() {
  const {
    currentPage,
    filteredSubscriptions,
    isCanonicalView,
    pageRows,
    paginationTotal,
    planFilter,
    rowsPerPage,
    selectedRowIds,
    setAnnouncement,
    setCurrentPage,
    setRowSelected,
    setRowsPerPage,
    setSortState,
    sortState,
    statusFilter,
  } = useSubscriptions();
  const selectedIds = new Set(selectedRowIds);
  const rowActions = (
    subscription: SubscriptionRecord,
  ): readonly DataTableRowAction<SubscriptionRecord>[] => [
    {
      id: "view",
      label: "View subscription (demo)",
      icon: <Eye />,
      onSelect: (row) =>
        setAnnouncement(
          `Opened the demo action for ${row.customerName}. No subscription data was changed.`,
        ),
    },
    {
      id: "select",
      label: selectedIds.has(subscription.id) ? "Clear selection" : "Select row",
      icon: <MousePointer2 />,
      onSelect: (row) => setRowSelected(row.id, !selectedIds.has(row.id)),
    },
  ];
  const columns: readonly DataTableColumn<SubscriptionRecord, SubscriptionColumnId>[] = [
    {
      id: "customer",
      label: "Customer",
      rowHeader: true,
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "customer"),
      renderCell: (subscription) => <SubscriptionIdentity subscription={subscription} />,
    },
    {
      id: "plan",
      label: "Plan",
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "plan"),
      renderCell: (subscription) => <SubscriptionPlan subscription={subscription} />,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "status"),
      renderCell: (subscription) => <StatusBadge status={subscription.status} />,
    },
    {
      id: "billing-cycle",
      label: "Billing Cycle",
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "billing-cycle"),
      renderCell: (subscription) => (
        <Badge size="compact" variant="neutral">
          {BILLING_CYCLE_LABELS[subscription.billingCycle]}
        </Badge>
      ),
    },
    {
      id: "started",
      label: "Started",
      numeric: true,
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "started"),
      renderCell: (subscription) => formatTableDate(subscription.startedDate),
    },
    {
      id: "next-billing",
      label: "Next Billing",
      numeric: true,
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "next-billing"),
      renderCell: (subscription) =>
        subscription.nextBillingDate
          ? formatTableDate(subscription.nextBillingDate)
          : (subscription.nextBillingLabel ?? "—"),
    },
    {
      id: "amount",
      label: "Amount",
      align: "end",
      emphasized: true,
      numeric: true,
      sortable: true,
      compareRows: (left, right) => compareSubscriptionRecords(left, right, "amount"),
      renderCell: (subscription) => <SubscriptionAmount subscription={subscription} />,
    },
    {
      id: "actions",
      label: "Row Actions",
      align: "end",
      renderCell: (subscription) => (
        <span className="subscription-row-actions">
          {selectedIds.has(subscription.id) ? (
            <Badge className="subscription-selected-label" size="compact" variant="violet">
              Selected
            </Badge>
          ) : null}
          <RowActions
            row={subscription}
            rowLabel={`${subscription.customerName} subscription`}
            actions={rowActions(subscription)}
          />
        </span>
      ),
    },
  ];
  const firstVisibleIndex = pageRows.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const lastVisibleIndex = firstVisibleIndex + pageRows.length - 1;
  let summary: ReactNode;

  if (isCanonicalView && currentPage === 1) {
    summary = `Showing ${firstVisibleIndex}–${lastVisibleIndex} of ${formatCount(
      SUBSCRIPTION_RECORD_TOTAL,
    )} subscription records`;
  } else if (isCanonicalView) {
    summary = `Page ${currentPage} of ${Math.ceil(
      SUBSCRIPTION_RECORD_TOTAL / rowsPerPage,
    )} — additional records are not loaded in this static demo`;
  } else if (filteredSubscriptions.length > 0) {
    summary = `Showing ${firstVisibleIndex}–${lastVisibleIndex} of ${formatCount(
      filteredSubscriptions.length,
    )} loaded matches`;
  } else {
    summary = "No loaded subscriptions match the current filters";
  }

  return (
    <DataTableContainer
      className="subscription-table-container"
      viewportLabel="Scrollable subscriptions table"
      header={
        <DataTableFrameHeader
          title="All Subscriptions"
          description="Plan, billing cycle and subscription lifecycle status"
          actions={<SubscriptionTableControls />}
        />
      }
      footer={
        <TablePaginationFooter
          summary={summary}
          rowsPerPage={
            <RowsPerPageControl
              value={rowsPerPage}
              options={[8, 16, 24]}
              onChange={setRowsPerPage}
            />
          }
          pagination={
            <TablePagination
              ariaLabel="Subscriptions pagination"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={paginationTotal}
              onPageChange={setCurrentPage}
            />
          }
        />
      }
    >
      <DataTable
        className="subscription-table"
        caption="All subscriptions with plan, billing cycle, lifecycle status, dates, and amount"
        columns={columns}
        rows={pageRows}
        getRowId={(subscription) => subscription.id}
        emptyState={
          isCanonicalView && currentPage > 1
            ? {
                title: "Records not loaded in this static demo",
                description:
                  "Return to page 1 to view the approved deterministic subscription records.",
              }
            : {
                title: "No subscriptions found",
                description: "Try another search or clear one of the active filters.",
              }
        }
        selection={{
          showSelectionColumn: false,
          selectedRowIds,
          getSelectionLabel: (subscription) => `${subscription.customerName} subscription`,
          onRowSelectionChange: (_subscription, rowId, selected) =>
            setRowSelected(String(rowId), selected),
          onVisibleRowsSelectionChange: (rowIds, selected) => {
            for (const rowId of rowIds) {
              setRowSelected(String(rowId), selected);
            }
          },
        }}
        sort={{ state: sortState, onChange: setSortState }}
      />
      <span className="sr-only" aria-live="polite" role="status">
        {`${formatCount(filteredSubscriptions.length)} loaded ${
          filteredSubscriptions.length === 1 ? "subscription matches" : "subscriptions match"
        } search and filters. ${
          planFilter === "all" ? "All plans." : `${PLANS_BY_ID[planFilter].name} plan.`
        } ${
          statusFilter === "all"
            ? "All statuses."
            : `${SUBSCRIPTION_STATUS_OPTIONS.find((status) => status.value === statusFilter)?.label ?? "Selected"} status.`
        }`}
      </span>
    </DataTableContainer>
  );
}
