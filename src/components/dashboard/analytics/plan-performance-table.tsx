"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { useState } from "react";
import {
  DataTableCaption,
  DataTableCell,
  DataTableContainer,
  DataTableElement,
  DataTableFrameHeader,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  DataTableRowHeaderCell,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import { RETENTION_METRICS } from "@/data/mock/reporting";
import { downloadCsv } from "@/lib/csv";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercent,
  formatSignedPercent,
} from "@/lib/formatters";
import type { PlanPerformance } from "@/types/dashboard";
import {
  buildPlanPerformanceCsv,
  getMrrContribution,
  PLAN_PERFORMANCE_EXPORT_FILE_NAME,
} from "./analytics-export";
import { useAnalyticsReport } from "./analytics-report-context";

function total(values: readonly number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

function readTrendValue(performance: PlanPerformance) {
  return typeof performance.trend.value === "number" ? performance.trend.value : 0;
}

export function PlanPerformanceTable() {
  const { visiblePlans } = useAnalyticsReport();
  const [exportStatus, setExportStatus] = useState("");
  const activeTotal = total(visiblePlans.map((item) => item.activeSubscriptions));
  const shareTotal = total(visiblePlans.map((item) => item.subscriberShare));
  const mrrTotal = total(visiblePlans.map((item) => item.monthlyRecurringRevenue));
  const contributionTotal = total(visiblePlans.map(getMrrContribution));
  const totalPrecision = visiblePlans.length === PLAN_PERFORMANCE.length ? 0 : 1;
  const churnTotal =
    visiblePlans.length === PLAN_PERFORMANCE.length
      ? RETENTION_METRICS.currentChurnRate
      : activeTotal > 0
        ? total(visiblePlans.map((item) => item.churnRate * item.activeSubscriptions)) / activeTotal
        : 0;
  const trendTotal =
    visiblePlans.length === PLAN_PERFORMANCE.length
      ? 8.4
      : mrrTotal > 0
        ? total(visiblePlans.map((item) => readTrendValue(item) * item.monthlyRecurringRevenue)) /
          mrrTotal
        : 0;

  function exportVisiblePlans() {
    downloadCsv(buildPlanPerformanceCsv(visiblePlans), PLAN_PERFORMANCE_EXPORT_FILE_NAME);
    setExportStatus(
      `Downloaded ${PLAN_PERFORMANCE_EXPORT_FILE_NAME} with ${visiblePlans.length} ${
        visiblePlans.length === 1 ? "plan" : "plans"
      }.`,
    );
  }

  return (
    <DataTableContainer
      className="analytics-plan-performance"
      viewportLabel="Scrollable plan performance table"
      header={
        <DataTableFrameHeader
          title="Plan Performance"
          description="Subscriber mix, recurring revenue contribution and churn"
          actions={
            <Button
              size="compact"
              variant="ghost"
              leadingIcon={<Download aria-hidden="true" />}
              onClick={exportVisiblePlans}
            >
              Export data
            </Button>
          }
        />
      }
    >
      <DataTableElement className="analytics-plan-table">
        <DataTableCaption>
          Plan performance by subscriber mix, monthly recurring revenue contribution, churn, and
          trend
        </DataTableCaption>
        <DataTableHeader>
          <DataTableHeaderCell>Plan</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Price</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Active</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Share</DataTableHeaderCell>
          <DataTableHeaderCell numeric>MRR</DataTableHeaderCell>
          <DataTableHeaderCell>MRR contribution</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Churn</DataTableHeaderCell>
          <DataTableHeaderCell numeric>Trend</DataTableHeaderCell>
        </DataTableHeader>
        <tbody>
          {visiblePlans.length === 0 ? (
            <DataTableRow>
              <DataTableCell colSpan={8} className="analytics-plan-empty">
                No plans match the current filters.
              </DataTableCell>
            </DataTableRow>
          ) : null}
          {visiblePlans.map((performance) => {
            const contribution = getMrrContribution(performance);

            return (
              <DataTableRow key={performance.plan.id}>
                <DataTableRowHeaderCell>
                  <span className="analytics-plan-name">
                    <span
                      className="analytics-plan-dot"
                      data-plan-color={performance.plan.colorKey}
                      aria-hidden="true"
                    />
                    {performance.plan.name}
                  </span>
                </DataTableRowHeaderCell>
                <DataTableCell numeric>
                  {formatCurrency(performance.plan.monthlyPrice)}
                </DataTableCell>
                <DataTableCell numeric>
                  {formatCount(performance.activeSubscriptions)}
                </DataTableCell>
                <DataTableCell numeric>
                  {formatPercent(performance.subscriberShare, 1)}
                </DataTableCell>
                <DataTableCell numeric emphasized>
                  {formatCurrency(performance.monthlyRecurringRevenue)}
                </DataTableCell>
                <DataTableCell>
                  <span
                    className="analytics-contribution"
                    aria-label={`${formatPercent(contribution, 1)} of monthly recurring revenue`}
                  >
                    <span className="analytics-contribution-track" aria-hidden="true">
                      <span
                        className="analytics-contribution-fill"
                        style={{ width: `${contribution}%` }}
                      />
                    </span>
                    <span>{formatPercent(contribution, 1)}</span>
                  </span>
                </DataTableCell>
                <DataTableCell numeric>{formatPercent(performance.churnRate, 1)}</DataTableCell>
                <DataTableCell numeric>
                  <span className="analytics-plan-trend">
                    <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
                    {formatSignedPercent(readTrendValue(performance), 1)}
                  </span>
                </DataTableCell>
              </DataTableRow>
            );
          })}
          <DataTableRow className="analytics-plan-total-row">
            <DataTableRowHeaderCell>Total</DataTableRowHeaderCell>
            <DataTableCell numeric>–</DataTableCell>
            <DataTableCell numeric emphasized>
              {formatCount(activeTotal)}
            </DataTableCell>
            <DataTableCell numeric emphasized>
              {formatPercent(shareTotal, totalPrecision)}
            </DataTableCell>
            <DataTableCell numeric emphasized>
              {formatCurrency(mrrTotal)}
            </DataTableCell>
            <DataTableCell emphasized>
              {formatPercent(contributionTotal, totalPrecision)}
            </DataTableCell>
            <DataTableCell numeric emphasized>
              {formatChurnPercent(churnTotal)}
            </DataTableCell>
            <DataTableCell numeric emphasized>
              <span className="analytics-plan-trend">
                <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
                {formatSignedPercent(trendTotal, 1)}
              </span>
            </DataTableCell>
          </DataTableRow>
        </tbody>
      </DataTableElement>
      <span className="sr-only" role="status" aria-live="polite">
        {exportStatus}
      </span>
    </DataTableContainer>
  );
}
