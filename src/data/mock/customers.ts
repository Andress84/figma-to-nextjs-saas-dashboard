import { CUSTOMER_ACCOUNT_TOTALS, SUBSCRIPTION_FLOW } from "@/data/mock/reporting";
import type { CustomerRecord } from "@/types/dashboard";

export const CUSTOMER_SUMMARY = {
  totalCustomers: CUSTOMER_ACCOUNT_TOTALS.current,
  activeSubscribers: SUBSCRIPTION_FLOW.endingActive,
  trialAccounts: 214,
  atRiskCustomers: 96,
  pastDue: 63,
  churnedThisPeriod: SUBSCRIPTION_FLOW.churned,
} as const;

export const CUSTOMER_RECORD_TOTAL = CUSTOMER_ACCOUNT_TOTALS.current;
export const CUSTOMER_ROWS_PER_PAGE = 8;

export const CUSTOMER_METRIC_SPARKLINES = {
  "total-customers": [2_926, 2_988, 3_041, 3_118, CUSTOMER_ACCOUNT_TOTALS.current],
  "active-subscribers": [2_705, 2_731, 2_768, 2_811, SUBSCRIPTION_FLOW.endingActive],
  "trial-accounts": [178, 189, 207, 201, 214],
  "at-risk-customers": [108, 106, 102, 99, 96],
} as const;

export const CUSTOMERS = [
  {
    id: "customer-olivia-chen",
    name: "Olivia Chen",
    company: "Northstar Studio",
    planId: "growth",
    status: "active",
    atRisk: false,
    lastActivityLabel: "12 min ago",
    lastActivityMinutesAgo: 12,
    joinedDate: "2026-05-18",
  },
  {
    id: "customer-noah-williams",
    name: "Noah Williams",
    company: "BrightLayer",
    planId: "teams",
    status: "active",
    atRisk: false,
    lastActivityLabel: "34 min ago",
    lastActivityMinutesAgo: 34,
    joinedDate: "2026-04-02",
  },
  {
    id: "customer-ava-thompson",
    name: "Ava Thompson",
    company: "Pixel Harbor",
    planId: "pro",
    status: "trial",
    atRisk: false,
    lastActivityLabel: "1 hr ago",
    lastActivityMinutesAgo: 60,
    joinedDate: "2026-07-08",
  },
  {
    id: "customer-marco-ruiz",
    name: "Marco Ruiz",
    company: "Verde Labs",
    planId: "starter",
    status: "active",
    atRisk: true,
    lastActivityLabel: "6 hrs ago",
    lastActivityMinutesAgo: 360,
    joinedDate: "2026-03-21",
  },
  {
    id: "customer-maya-patel",
    name: "Maya Patel",
    company: "Cloudnest",
    planId: "growth",
    status: "active",
    atRisk: false,
    lastActivityLabel: "Yesterday",
    lastActivityMinutesAgo: 1_440,
    joinedDate: "2026-02-14",
  },
  {
    id: "customer-ethan-brooks",
    name: "Ethan Brooks",
    company: "Fieldnote",
    planId: "pro",
    status: "past-due",
    atRisk: false,
    lastActivityLabel: "2 days ago",
    lastActivityMinutesAgo: 2_880,
    joinedDate: "2026-01-29",
  },
  {
    id: "customer-sophia-nguyen",
    name: "Sophia Nguyen",
    company: "Orbitstack",
    planId: "teams",
    status: "active",
    atRisk: false,
    lastActivityLabel: "3 days ago",
    lastActivityMinutesAgo: 4_320,
    joinedDate: "2025-12-11",
  },
  {
    id: "customer-liam-carter",
    name: "Liam Carter",
    company: "Linear Forge",
    planId: "starter",
    status: "churned",
    atRisk: false,
    lastActivityLabel: "8 days ago",
    lastActivityMinutesAgo: 11_520,
    joinedDate: "2025-11-06",
  },
] as const satisfies readonly CustomerRecord[];
