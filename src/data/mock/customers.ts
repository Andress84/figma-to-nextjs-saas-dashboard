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

export const CUSTOMERS = [
  {
    id: "customer-olivia-chen",
    name: "Olivia Chen",
    company: "Northstar Studio",
    planId: "growth",
    status: "active",
    atRisk: false,
    lastActivityLabel: "12 min ago",
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
    joinedDate: "2025-11-06",
  },
] as const satisfies readonly CustomerRecord[];
