import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  CustomerStatus,
  DashboardStatus,
  SubscriptionStatus,
  TransactionStatus,
} from "@/types/dashboard";
import { StatusBadge } from "./status-badge";

const customerStatuses = [
  ["active", "Active"],
  ["trial", "Trial"],
  ["past-due", "Past due"],
  ["churned", "Churned"],
] as const satisfies ReadonlyArray<readonly [CustomerStatus, string]>;

const subscriptionStatuses = [
  ["active", "Active"],
  ["trialing", "Trialing"],
  ["past-due", "Past due"],
  ["paused", "Paused"],
  ["canceled", "Canceled"],
] as const satisfies ReadonlyArray<readonly [SubscriptionStatus, string]>;

const transactionStatuses = [
  ["paid", "Paid"],
  ["pending", "Pending"],
  ["refunded", "Refunded"],
  ["failed", "Failed"],
] as const satisfies ReadonlyArray<readonly [TransactionStatus, string]>;

describe("StatusBadge", () => {
  it.each([
    ...customerStatuses,
    ...subscriptionStatuses,
    ...transactionStatuses,
  ] satisfies ReadonlyArray<
    readonly [DashboardStatus, string]
  >)("maps %s to the readable %s label", (status, label) => {
    const { unmount } = render(<StatusBadge status={status} />);
    const badge = screen.getByText(label).closest(".dashboard-status-badge");

    expect(badge).toBeVisible();
    expect(badge).not.toHaveAttribute("role", "button");
    expect(badge).not.toHaveAttribute("tabindex");
    unmount();
  });
});
