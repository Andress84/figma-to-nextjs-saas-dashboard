"use client";

import { Eye, MousePointer2, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DataTable,
  DataTableContainer,
  DataTableFrameHeader,
  RowActions,
  RowsPerPageControl,
  TablePagination,
  TablePaginationFooter,
  type DataTableColumn,
  type DataTableRowAction,
} from "@/components/data-table";
import { CUSTOMER_RECORD_TOTAL, CUSTOMER_SUMMARY } from "@/data/mock/customers";
import { PLANS_BY_ID } from "@/data/mock/plans";
import { formatCount, formatCurrency, formatTableDate } from "@/lib/formatters";
import type { CustomerRecord } from "@/types/dashboard";
import {
  compareCustomerRecords,
  type CustomerColumnId,
  CUSTOMER_LIFECYCLE_TABS,
  getCustomerInitials,
} from "./customer-utils";
import { useCustomers } from "./customers-context";

function CustomerIdentity({ customer }: Readonly<{ customer: CustomerRecord }>) {
  return (
    <span className="customer-identity">
      <Avatar
        decorative
        initials={getCustomerInitials(customer.name)}
        name={customer.name}
        size="small"
      />
      <span>{customer.name}</span>
    </span>
  );
}

function PlanIdentity({ customer }: Readonly<{ customer: CustomerRecord }>) {
  const plan = PLANS_BY_ID[customer.planId];

  return (
    <span className="customer-plan">
      <span className="customer-plan-dot" data-plan-color={plan.colorKey} aria-hidden="true" />
      <span>{plan.name}</span>
    </span>
  );
}

function CustomerFilterBar() {
  const { atRiskOnly, lifecycle, setAtRiskOnly, setLifecycle } = useCustomers();

  return (
    <Card className="customer-filter-bar" padding="none">
      <div className="customer-filter-primary">
        <div className="customer-tabs-viewport" role="region" aria-label="Customer lifecycle tabs">
          <Tabs
            className="customer-lifecycle-tabs"
            items={CUSTOMER_LIFECYCLE_TABS}
            label="Customer lifecycle"
            value={lifecycle}
            onValueChange={(value) => setLifecycle(value as typeof lifecycle)}
          />
        </div>
        <button
          className="customer-risk-filter"
          type="button"
          aria-pressed={atRiskOnly}
          onClick={() => setAtRiskOnly(!atRiskOnly)}
        >
          <span className="customer-risk-dot" aria-hidden="true" />
          <strong>At risk: {formatCount(CUSTOMER_SUMMARY.atRiskCustomers)}</strong>
          <span>may overlap statuses</span>
        </button>
      </div>

      <dl className="customer-filter-summary">
        <div>
          <dt>Active</dt>
          <dd>{formatCount(CUSTOMER_SUMMARY.activeSubscribers)}</dd>
        </div>
        <div>
          <dt>Trial</dt>
          <dd>{formatCount(CUSTOMER_SUMMARY.trialAccounts)}</dd>
        </div>
        <div data-tone="warning">
          <dt>Past due</dt>
          <dd>{formatCount(CUSTOMER_SUMMARY.pastDue)}</dd>
        </div>
        <div>
          <dt>Churned this period</dt>
          <dd>{formatCount(CUSTOMER_SUMMARY.churnedThisPeriod)}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function CustomerDirectory() {
  const {
    atRiskOnly,
    currentPage,
    filteredCustomers,
    isCanonicalView,
    lifecycle,
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
  } = useCustomers();
  const selectedIds = new Set(selectedRowIds);
  const rowActions = (customer: CustomerRecord): readonly DataTableRowAction<CustomerRecord>[] => [
    {
      id: "view",
      label: "View account (demo)",
      icon: <Eye />,
      onSelect: (row) =>
        setAnnouncement(`Opened the demo action for ${row.name}. No account data was changed.`),
    },
    {
      id: "select",
      label: selectedIds.has(customer.id) ? "Clear selection" : "Select row",
      icon: <MousePointer2 />,
      onSelect: (row) => setRowSelected(row.id, !selectedIds.has(row.id)),
    },
  ];
  const columns: readonly DataTableColumn<CustomerRecord, CustomerColumnId>[] = [
    {
      id: "customer",
      label: "Customer",
      rowHeader: true,
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "customer"),
      renderCell: (customer) => <CustomerIdentity customer={customer} />,
    },
    {
      id: "company",
      label: "Company",
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "company"),
      renderCell: (customer) => customer.company,
    },
    {
      id: "plan",
      label: "Plan",
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "plan"),
      renderCell: (customer) => <PlanIdentity customer={customer} />,
    },
    {
      id: "monthly-value",
      label: "Monthly Value",
      align: "end",
      emphasized: true,
      numeric: true,
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "monthly-value"),
      renderCell: (customer) => formatCurrency(PLANS_BY_ID[customer.planId].monthlyPrice),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "status"),
      renderCell: (customer) => <StatusBadge status={customer.status} />,
    },
    {
      id: "last-activity",
      label: "Last Activity",
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "last-activity"),
      renderCell: (customer) => customer.lastActivityLabel,
    },
    {
      id: "joined",
      label: "Joined",
      numeric: true,
      sortable: true,
      compareRows: (left, right) => compareCustomerRecords(left, right, "joined"),
      renderCell: (customer) => formatTableDate(customer.joinedDate),
    },
    {
      id: "actions",
      label: "Row Actions",
      align: "end",
      renderCell: (customer) => (
        <span className="customer-row-actions">
          {selectedIds.has(customer.id) ? (
            <Badge className="customer-selected-label" size="compact" variant="violet">
              Selected
            </Badge>
          ) : null}
          <RowActions
            row={customer}
            rowLabel={`${customer.name} account`}
            actions={rowActions(customer)}
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
      CUSTOMER_RECORD_TOTAL,
    )} customers`;
  } else if (isCanonicalView) {
    summary = `Page ${currentPage} of ${Math.ceil(CUSTOMER_RECORD_TOTAL / rowsPerPage)} — additional records are not loaded in this static demo`;
  } else if (filteredCustomers.length > 0) {
    summary = `Showing ${firstVisibleIndex}–${lastVisibleIndex} of ${formatCount(
      filteredCustomers.length,
    )} loaded matches`;
  } else {
    summary = "No loaded customers match the current filters";
  }

  return (
    <>
      <CustomerFilterBar />
      <section
        id="customer-table-panel"
        role="tabpanel"
        aria-label={`${CUSTOMER_LIFECYCLE_TABS.find((tab) => tab.value === lifecycle)?.label ?? "All"} customer accounts`}
      >
        <DataTableContainer
          className="customer-table-container"
          viewportLabel="Scrollable customer accounts table"
          header={
            <DataTableFrameHeader
              title="Customer accounts"
              description="Subscription status, recurring value and recent activity"
              actions={
                <div className="customer-table-refresh">
                  <span>Last updated 2 min ago</span>
                  <Button
                    size="compact"
                    variant="ghost"
                    leadingIcon={<RefreshCcw aria-hidden="true" />}
                    onClick={() =>
                      setAnnouncement(
                        "Customer records refreshed. Deterministic demo data is unchanged.",
                      )
                    }
                  >
                    Refresh
                  </Button>
                </div>
              }
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
                  ariaLabel="Customer accounts pagination"
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
            className="customer-table"
            caption="Customer accounts with subscription status, recurring value and recent activity"
            columns={columns}
            rows={pageRows}
            getRowId={(customer) => customer.id}
            emptyState={
              isCanonicalView && currentPage > 1
                ? {
                    title: "Records not loaded in this static demo",
                    description:
                      "Return to page 1 to view the approved deterministic customer records.",
                  }
                : {
                    title: "No customer accounts found",
                    description: "Try another search or clear one of the active filters.",
                  }
            }
            selection={{
              showSelectionColumn: false,
              selectedRowIds,
              getSelectionLabel: (customer) => `${customer.name} account`,
              onRowSelectionChange: (_customer, rowId, selected) =>
                setRowSelected(String(rowId), selected),
              onVisibleRowsSelectionChange: (rowIds, selected) => {
                for (const rowId of rowIds) {
                  setRowSelected(String(rowId), selected);
                }
              },
            }}
            sort={{ state: sortState, onChange: setSortState }}
          />
        </DataTableContainer>
      </section>
      <span className="sr-only" aria-live="polite" role="status">
        {`${formatCount(filteredCustomers.length)} loaded ${
          filteredCustomers.length === 1 ? "customer matches" : "customers match"
        } search and filters. ${atRiskOnly ? "At-risk filter on." : "At-risk filter off."} ${
          planFilter === "all" ? "All plans." : `${PLANS_BY_ID[planFilter].name} plan.`
        }`}
      </span>
    </>
  );
}
