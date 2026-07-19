import { RETENTION_METRICS, SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import type {
  SubscriptionRecord,
  SubscriptionStatusCount,
  SubscriptionStatusSummary,
} from "@/types/dashboard";

const currentStatuses = [
  { status: "active", count: SUBSCRIPTION_FLOW.endingActive },
  { status: "trialing", count: 214 },
  { status: "past-due", count: 63 },
  { status: "paused", count: 41 },
] as const satisfies readonly SubscriptionStatusCount[];

export const SUBSCRIPTION_STATUS_SUMMARY = {
  currentStatuses,
  currentTotal: currentStatuses.reduce((total, status) => total + status.count, 0),
  historicalChurned: SUBSCRIPTION_FLOW.churned,
  historicalChurnRate: RETENTION_METRICS.currentChurnRate,
} as const satisfies SubscriptionStatusSummary;

export const SUBSCRIPTION_RECORD_TOTAL = 3_268;
export const SUBSCRIPTION_ROWS_PER_PAGE = 8;

export const SUBSCRIPTION_METRIC_SPARKLINES = {
  "active-subscriptions": [2_705, 2_741, 2_779, 2_817, SUBSCRIPTION_FLOW.endingActive],
  "monthly-recurring-revenue": [78_140, 79_420, 80_890, 82_360, 84_720],
  trialing: [178, 189, 207, 201, 214],
  "churn-rate": [4.27, 4.19, 4.08, 3.96, RETENTION_METRICS.currentChurnRate],
} as const;

export const SUBSCRIPTIONS = [
  {
    id: "subscription-olivia-chen",
    customerName: "Olivia Chen",
    planId: "growth",
    status: "active",
    billingCycle: "monthly",
    startedDate: "2026-05-18",
    nextBillingDate: "2026-07-18",
  },
  {
    id: "subscription-noah-williams",
    customerName: "Noah Williams",
    planId: "teams",
    status: "active",
    billingCycle: "annual",
    startedDate: "2026-04-02",
    nextBillingDate: "2027-04-02",
  },
  {
    id: "subscription-ava-thompson",
    customerName: "Ava Thompson",
    planId: "pro",
    status: "trialing",
    billingCycle: "monthly",
    startedDate: "2026-07-08",
    nextBillingDate: "2026-07-22",
    amountQualifier: "after trial",
  },
  {
    id: "subscription-marco-ruiz",
    customerName: "Marco Ruiz",
    planId: "starter",
    status: "past-due",
    billingCycle: "monthly",
    startedDate: "2026-03-21",
    nextBillingDate: "2026-07-21",
  },
  {
    id: "subscription-maya-patel",
    customerName: "Maya Patel",
    planId: "growth",
    status: "active",
    billingCycle: "annual",
    startedDate: "2026-02-14",
    nextBillingDate: "2027-02-14",
  },
  {
    id: "subscription-ethan-brooks",
    customerName: "Ethan Brooks",
    planId: "pro",
    status: "paused",
    billingCycle: "monthly",
    startedDate: "2026-01-29",
    nextBillingDate: null,
    nextBillingLabel: "Paused",
  },
  {
    id: "subscription-sophia-nguyen",
    customerName: "Sophia Nguyen",
    planId: "teams",
    status: "active",
    billingCycle: "monthly",
    startedDate: "2025-12-11",
    nextBillingDate: "2026-08-11",
  },
  {
    id: "subscription-liam-carter",
    customerName: "Liam Carter",
    planId: "starter",
    status: "canceled",
    billingCycle: "monthly",
    startedDate: "2025-11-06",
    nextBillingDate: null,
    amountQualifier: "former monthly",
  },
] as const satisfies readonly SubscriptionRecord[];
