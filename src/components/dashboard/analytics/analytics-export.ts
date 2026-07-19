import {
  ANALYTICS_REVENUE_TRENDS,
  ANALYTICS_SUBSCRIPTION_GROWTH,
  CHURN_TREND_SERIES,
  type AnalyticsRevenueView,
} from "@/data/mock/analytics";
import {
  GROSS_REVENUE,
  RECURRING_REVENUE,
  REPORTING_PERIOD,
  RETENTION_METRICS,
  SUBSCRIPTION_FLOW,
} from "@/data/mock/reporting";
import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercent,
  formatSignedPercent,
} from "@/lib/formatters";
import type { PlanPerformance } from "@/types/dashboard";

export const ANALYTICS_EXPORT_FILE_NAME = "subtera-analytics-report-2026-07-14.csv";
export const PLAN_PERFORMANCE_EXPORT_FILE_NAME =
  "subtera-analytics-plan-performance-2026-07-14.csv";

function escapeCsvValue(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function rowsToCsv(rows: readonly (readonly string[])[]) {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

function getRevenueValues(view: AnalyticsRevenueView) {
  return view === "revenue"
    ? {
        current: GROSS_REVENUE.current,
        currentKey: "current" as const,
        label: "Gross revenue",
        previous: GROSS_REVENUE.previous,
        previousKey: "previous" as const,
      }
    : {
        current: RECURRING_REVENUE.currentMrr,
        currentKey: "current" as const,
        label: "Monthly recurring revenue",
        previous: RECURRING_REVENUE.previousMrr,
        previousKey: "previous" as const,
      };
}

export function getMrrContribution(performance: PlanPerformance) {
  return (performance.monthlyRecurringRevenue / RECURRING_REVENUE.currentMrr) * 100;
}

function readTrendValue(performance: PlanPerformance) {
  return typeof performance.trend.value === "number" ? performance.trend.value : 0;
}

export function buildPlanPerformanceCsv(planPerformance: readonly PlanPerformance[]) {
  const rows = planPerformance.map((performance) => [
    performance.plan.name,
    formatCurrency(performance.plan.monthlyPrice),
    formatCount(performance.activeSubscriptions),
    formatPercent(performance.subscriberShare, 1),
    formatCurrency(performance.monthlyRecurringRevenue),
    formatPercent(getMrrContribution(performance), 1),
    formatPercent(performance.churnRate, 1),
    formatSignedPercent(readTrendValue(performance), 1),
  ]);

  return rowsToCsv([
    ["Plan", "Price", "Active", "Share", "MRR", "MRR contribution", "Churn", "Trend"],
    ...rows,
  ]);
}

interface AnalyticsReportCsvOptions {
  readonly compareToPrevious: boolean;
  readonly planPerformance: readonly PlanPerformance[];
  readonly revenueView: AnalyticsRevenueView;
}

export function buildAnalyticsReportCsv({
  compareToPrevious,
  planPerformance,
  revenueView,
}: AnalyticsReportCsvOptions) {
  const revenueValues = getRevenueValues(revenueView);
  const revenueRows = ANALYTICS_REVENUE_TRENDS[revenueView].map((point) => [
    "Revenue and MRR Trends",
    revenueValues.label,
    point.label,
    formatCurrency(point.current),
    compareToPrevious ? formatCurrency(point.previous) : "",
    "Cumulative",
  ]);
  const growthRows = ANALYTICS_SUBSCRIPTION_GROWTH.map((point) => [
    "Subscription Growth",
    "Subscriptions",
    point.label,
    formatCount(point.newPaidSubscriptions),
    formatCount(point.churnedSubscriptions),
    `${formatCount(point.netSubscriptions)} net`,
  ]);
  const churnRows = CHURN_TREND_SERIES.map((point) => [
    "Churn and Retention",
    "Churn rate",
    point.label,
    formatChurnPercent(point.currentChurnRate),
    compareToPrevious ? formatChurnPercent(point.previousChurnRate) : "",
    "Lower is better",
  ]);
  const planRows = planPerformance.map((performance) => [
    "Plan Performance",
    performance.plan.name,
    "Selected period",
    formatCurrency(performance.monthlyRecurringRevenue),
    formatCount(performance.activeSubscriptions),
    `${formatPercent(performance.subscriberShare, 1)} share; ${formatPercent(
      getMrrContribution(performance),
      1,
    )} MRR contribution; ${formatPercent(performance.churnRate, 1)} churn`,
  ]);

  return rowsToCsv([
    ["Section", "Item", "Period", "Current", "Previous or comparison", "Detail"],
    ["Report", "Reporting period", REPORTING_PERIOD.displayLabel, "", "", "Fictional demo data"],
    [
      "Report",
      revenueValues.label,
      "Selected period total",
      formatCurrency(revenueValues.current),
      compareToPrevious ? formatCurrency(revenueValues.previous) : "",
      revenueView === "revenue" ? "+9.6%" : "+8.4%",
    ],
    ...revenueRows,
    ...growthRows,
    [
      "Subscription Growth",
      "Period totals",
      REPORTING_PERIOD.displayLabel,
      formatCount(SUBSCRIPTION_FLOW.newPaid),
      formatCount(SUBSCRIPTION_FLOW.churned),
      `+${formatCount(SUBSCRIPTION_FLOW.netGrowth)} net`,
    ],
    ...churnRows,
    [
      "Churn and Retention",
      "Retention totals",
      REPORTING_PERIOD.displayLabel,
      formatCount(RETENTION_METRICS.retainedSubscriptions),
      formatPercent(RETENTION_METRICS.netRevenueRetention, 1),
      "Retained subscriptions; net revenue retention",
    ],
    ...planRows,
  ]);
}

export function downloadCsv(csv: string, fileName: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
