import type { TransactionRecord } from "@/types/dashboard";

export const TRANSACTIONS = [
  {
    id: "transaction-2026-07-14-olivia-chen",
    customerName: "Olivia Chen",
    planId: "growth",
    timestamp: "2026-07-14T10:42:00Z",
    paymentMethod: "Visa •4242",
    amount: 29,
    status: "paid",
  },
  {
    id: "transaction-2026-07-14-northstar-labs",
    customerName: "Northstar Labs",
    planId: "teams",
    timestamp: "2026-07-14T09:18:00Z",
    paymentMethod: "Mastercard •1088",
    amount: 99,
    status: "paid",
  },
  {
    id: "transaction-2026-07-13-marco-ruiz",
    customerName: "Marco Ruiz",
    planId: "starter",
    timestamp: "2026-07-13T17:05:00Z",
    paymentMethod: "Visa •9031",
    amount: 15,
    status: "refunded",
  },
  {
    id: "transaction-2026-07-13-ava-thompson",
    customerName: "Ava Thompson",
    planId: "pro",
    timestamp: "2026-07-13T14:22:00Z",
    paymentMethod: "Amex •0005",
    amount: 49,
    status: "pending",
  },
  {
    id: "transaction-2026-07-12-koto-studio",
    customerName: "Koto Studio",
    planId: "teams",
    timestamp: "2026-07-12T16:41:00Z",
    paymentMethod: "Visa •3320",
    amount: 99,
    status: "failed",
  },
] as const satisfies readonly TransactionRecord[];
