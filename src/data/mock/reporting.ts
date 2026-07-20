import { formatDateRange } from "@/lib/formatters";
import type { PrimaryMetric, ReportingPeriod } from "@/types/dashboard";

export const REPORTING_PERIOD = {
  startDate: "2026-06-15",
  endDate: "2026-07-14",
  displayLabel: formatDateRange("2026-06-15", "2026-07-14"),
} as const satisfies ReportingPeriod;

export const REPORTING_PERIOD_PRESET = "Last 30 days";

export const REPORTING_CALENDAR_MONTHS = [
  {
    id: "june-2026",
    label: "June 2026",
    monthName: "June",
    monthNumber: "06",
    daysInMonth: 30,
    leadingEmptyDays: 1,
  },
  {
    id: "july-2026",
    label: "July 2026",
    monthName: "July",
    monthNumber: "07",
    daysInMonth: 31,
    leadingEmptyDays: 3,
  },
] as const;

export const RECURRING_REVENUE = {
  currentMrr: 84_720,
  previousMrr: 78_140,
  currentArr: 84_720 * 12,
  previousArr: 78_140 * 12,
} as const;

export const GROSS_REVENUE = {
  current: 112_480,
  previous: 102_630,
} as const;

export const SUBSCRIPTION_FLOW = {
  previousActive: 2_705,
  newPaid: 245,
  churned: 104,
  netGrowth: 245 - 104,
  endingActive: 2_705 + 245 - 104,
} as const;

export const CUSTOMER_ACCOUNT_TOTALS = {
  current: 3_214,
  previous: 2_926,
  newAccounts: 3_214 - 2_926,
} as const;

export const RETENTION_METRICS = {
  currentChurnRate: 3.84,
  previousChurnRate: 4.27,
  churnRateChange: Number((3.84 - 4.27).toFixed(2)),
  retainedSubscriptions: 2_601,
  netRevenueRetention: 108.4,
} as const;

export const AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT = Number(
  (RECURRING_REVENUE.currentMrr / SUBSCRIPTION_FLOW.endingActive).toFixed(2),
);

export const PRIMARY_METRICS = [
  {
    id: "monthly-recurring-revenue",
    label: "Monthly Recurring Revenue",
    currentValue: RECURRING_REVENUE.currentMrr,
    previousValue: RECURRING_REVENUE.previousMrr,
    valueFormat: "currency",
    trend: { format: "percent", fractionDigits: 1, tone: "positive", value: 8.4 },
    supportingDetail: {
      format: "currency",
      sign: "positive",
      suffix: "net increase",
      value: RECURRING_REVENUE.currentMrr - RECURRING_REVENUE.previousMrr,
    },
  },
  {
    id: "annual-recurring-revenue",
    label: "Annual Recurring Revenue",
    currentValue: RECURRING_REVENUE.currentArr,
    previousValue: RECURRING_REVENUE.previousArr,
    valueFormat: "currency",
    trend: { format: "percent", fractionDigits: 1, tone: "positive", value: 8.4 },
    supportingDetail: {
      format: "currency",
      sign: "positive",
      suffix: "annualized",
      value: RECURRING_REVENUE.currentArr - RECURRING_REVENUE.previousArr,
    },
  },
  {
    id: "active-subscriptions",
    label: "Active Subscriptions",
    currentValue: SUBSCRIPTION_FLOW.endingActive,
    previousValue: SUBSCRIPTION_FLOW.previousActive,
    valueFormat: "count",
    trend: { format: "percent", fractionDigits: 1, tone: "positive", value: 5.2 },
    supportingDetail: {
      format: "count",
      sign: "positive",
      suffix: "net subscriptions",
      value: SUBSCRIPTION_FLOW.netGrowth,
    },
  },
  {
    id: "churn-rate",
    label: "Churn Rate",
    currentValue: RETENTION_METRICS.currentChurnRate,
    previousValue: RETENTION_METRICS.previousChurnRate,
    valueFormat: "churn-percent",
    trend: {
      format: "percentage-points",
      tone: "improvement",
      value: RETENTION_METRICS.churnRateChange,
    },
    supportingDetail: {
      format: "count",
      sign: "none",
      suffix: "subscriptions churned",
      value: SUBSCRIPTION_FLOW.churned,
    },
  },
] as const satisfies readonly PrimaryMetric[];
