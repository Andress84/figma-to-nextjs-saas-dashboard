import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import {
  SUBSCRIPTION_RECORD_TOTAL,
  SUBSCRIPTIONS,
  SUBSCRIPTION_STATUS_SUMMARY,
} from "@/data/mock/subscriptions";
import { buildSubscriptionCsv, SUBSCRIPTION_EXPORT_FILE_NAME } from "./subscription-export";
import { filterSubscriptionRecords, sortSubscriptionRecords } from "./subscription-utils";
import { SubscriptionsDashboard } from "./subscriptions-dashboard";

const APPROVED_SUBSCRIPTIONS = [
  ["Olivia Chen", "Growth", "Active", "Monthly", "May 18, 2026", "Jul 18, 2026", "$29"],
  ["Noah Williams", "Teams", "Active", "Annual", "Apr 02, 2026", "Apr 02, 2027", "$1,188"],
  ["Ava Thompson", "Pro", "Trialing", "Monthly", "Jul 08, 2026", "Jul 22, 2026", "$49"],
  ["Marco Ruiz", "Starter", "Past due", "Monthly", "Mar 21, 2026", "Jul 21, 2026", "$15"],
  ["Maya Patel", "Growth", "Active", "Annual", "Feb 14, 2026", "Feb 14, 2027", "$348"],
  ["Ethan Brooks", "Pro", "Paused", "Monthly", "Jan 29, 2026", "Paused", "$49"],
  ["Sophia Nguyen", "Teams", "Active", "Monthly", "Dec 11, 2025", "Aug 11, 2026", "$99"],
  ["Liam Carter", "Starter", "Canceled", "Monthly", "Nov 06, 2025", "—", "$15"],
] as const;

function getSubscriptionTable() {
  return screen.getByRole("table", {
    name: "All subscriptions with plan, billing cycle, lifecycle status, dates, and amount",
  });
}

describe("SubscriptionsDashboard", () => {
  it("renders approved KPIs, plan totals, current-state status total, and historical churn", () => {
    render(<SubscriptionsDashboard />);

    expect(screen.getByRole("heading", { level: 1, name: "Subscriptions" })).toBeVisible();
    expect(
      screen.getByText("Monitor active plans, billing status and recurring subscription value."),
    ).toBeVisible();
    const metrics = screen.getByRole("region", { name: "Subscription metrics" });
    expect(within(metrics).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(within(metrics).getByText("2,846")).toBeVisible();
    expect(within(metrics).getByText("$84,720")).toBeVisible();
    expect(within(metrics).getByText("214")).toBeVisible();
    expect(within(metrics).getByText("3.84%")).toBeVisible();
    expect(within(metrics).getByText("-0.43 pp")).toBeVisible();

    const planTable = screen.getByRole("table", {
      name: /Plan performance by price, active subscriptions/,
    });
    expect(within(planTable).getAllByRole("rowheader")).toHaveLength(4);
    expect(PLAN_PERFORMANCE.reduce((total, plan) => total + plan.activeSubscriptions, 0)).toBe(
      2_846,
    );
    expect(PLAN_PERFORMANCE.reduce((total, plan) => total + plan.monthlyRecurringRevenue, 0)).toBe(
      84_720,
    );
    for (const performance of PLAN_PERFORMANCE) {
      expect(
        within(planTable).getByRole("rowheader", { name: performance.plan.name }),
      ).toBeVisible();
      expect(performance.monthlyRecurringRevenue).toBe(
        performance.activeSubscriptions * performance.plan.monthlyPrice,
      );
    }

    const statusFigure = screen.getByRole("figure", { name: "Subscription Status" });
    expect(within(statusFigure).getByText("3,164")).toBeVisible();
    expect(within(statusFigure).getByText("Churned during selected period")).toBeVisible();
    expect(within(statusFigure).getByText("104")).toBeVisible();
    const statusSummary = within(statusFigure).getByRole("table", {
      name: /Subscription Status segment summary.*3,164 Current subscriptions total/,
    });
    expect(within(statusSummary).getAllByRole("rowheader")).toHaveLength(4);
    expect(within(statusSummary).queryByRole("rowheader", { name: /Churn/i })).toBeNull();
    expect(SUBSCRIPTION_STATUS_SUMMARY.currentTotal).toBe(3_164);
    expect(SUBSCRIPTION_STATUS_SUMMARY.historicalChurned).toBe(104);
  });

  it("renders the exact approved first-page subscription rows and record total", () => {
    render(<SubscriptionsDashboard />);

    const table = getSubscriptionTable();
    expect(table.querySelector("caption")).toHaveTextContent("All subscriptions");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(8);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(8);

    for (const approvedRow of APPROVED_SUBSCRIPTIONS) {
      const [customer, ...values] = approvedRow;
      const row = within(table).getByRole("row", { name: new RegExp(customer) });

      for (const value of values) {
        expect(within(row).getAllByText(value, { exact: true })[0]).toBeVisible();
      }
    }

    expect(screen.getByText("Showing 1–8 of 3,268 subscription records")).toBeVisible();
    expect(SUBSCRIPTION_RECORD_TOTAL).toBe(3_268);
    expect(within(table).getByRole("row", { name: /Sophia Nguyen/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("searches customer and plan names case-insensitively and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    const search = screen.getByRole("searchbox", { name: "Search subscriptions" });

    await user.type(search, "olivia");
    expect(
      within(getSubscriptionTable()).getByRole("rowheader", { name: /Olivia Chen/ }),
    ).toBeVisible();
    expect(within(getSubscriptionTable()).getAllByRole("rowheader")).toHaveLength(1);

    await user.clear(search);
    await user.type(search, "TEAMS");
    expect(within(getSubscriptionTable()).getAllByRole("rowheader")).toHaveLength(2);

    await user.clear(search);
    await user.type(search, "not a loaded subscription");
    expect(screen.getByText("No subscriptions found")).toBeVisible();
    expect(search).toHaveValue("not a loaded subscription");
  });

  it("composes plan and status filters without mutating canonical records", async () => {
    const originalOrder = SUBSCRIPTIONS.map((subscription) => subscription.id);
    const filtered = filterSubscriptionRecords(SUBSCRIPTIONS, {
      plan: "pro",
      query: "",
      status: "paused",
    });

    expect(filtered.map((subscription) => subscription.customerName)).toEqual(["Ethan Brooks"]);
    expect(SUBSCRIPTIONS.map((subscription) => subscription.id)).toEqual(originalOrder);

    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Plan" }), "pro");
    await user.selectOptions(screen.getByRole("combobox", { name: "Status" }), "paused");
    expect(within(getSubscriptionTable()).getAllByRole("rowheader")).toHaveLength(1);
    expect(
      within(getSubscriptionTable()).getByRole("rowheader", { name: /Ethan Brooks/ }),
    ).toBeVisible();
  });

  it("sorts deterministically and preserves selected rows by stable ID", async () => {
    const originalOrder = SUBSCRIPTIONS.map((subscription) => subscription.id);
    const sorted = sortSubscriptionRecords(SUBSCRIPTIONS, {
      columnId: "amount",
      direction: "descending",
    });

    expect(sorted.map((subscription) => subscription.customerName)).toEqual([
      "Noah Williams",
      "Maya Patel",
      "Sophia Nguyen",
      "Ava Thompson",
      "Ethan Brooks",
      "Olivia Chen",
      "Marco Ruiz",
      "Liam Carter",
    ]);
    expect(SUBSCRIPTIONS.map((subscription) => subscription.id)).toEqual(originalOrder);

    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    const table = getSubscriptionTable();
    await user.click(within(table).getByRole("button", { name: /Customer, not sorted/ }));
    expect(within(table).getAllByRole("rowheader")[0]).toHaveTextContent("Ava Thompson");
    expect(within(table).getByRole("row", { name: /Sophia Nguyen/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("changes selected-row state from the keyboard-accessible row menu and restores focus", async () => {
    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    const trigger = screen.getByRole("button", {
      name: "Actions for Sophia Nguyen subscription",
    });

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "View subscription (demo)" })).toHaveFocus();
    await user.click(screen.getByRole("menuitem", { name: "Clear selection" }));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole("row", { name: /Sophia Nguyen/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("keeps pagination boundaries honest for unloaded static records", async () => {
    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);

    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(screen.getByText("Records not loaded in this static demo")).toBeVisible();
    expect(screen.getByText(/Page 2 of 409/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeEnabled();

    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "16");
    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(getSubscriptionTable()).getAllByRole("rowheader")).toHaveLength(8);
  });

  it("builds and downloads deterministic CSV for visible filtered and ordered rows", async () => {
    const visibleRows = sortSubscriptionRecords(
      filterSubscriptionRecords(SUBSCRIPTIONS, { plan: "all", query: "", status: "active" }),
      { columnId: "amount", direction: "descending" },
    );
    const csv = buildSubscriptionCsv(visibleRows);

    expect(csv.split("\r\n")).toHaveLength(5);
    expect(csv).toContain(
      "Customer,Plan,Status,Billing Cycle,Started,Next Billing,Amount,Amount Detail",
    );
    expect(csv.split("\r\n")[1]).toContain("Noah Williams,Teams,Active,Annual");
    expect(csv).toContain(
      'Olivia Chen,Growth,Active,Monthly,"May 18, 2026","Jul 18, 2026",$29,per month',
    );

    const createObjectUrl = vi.fn(() => "blob:subtera-subscriptions");
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectUrl });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Status" }), "paused");
    await user.click(screen.getByRole("button", { name: "Export" }));

    expect(createObjectUrl).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:subtera-subscriptions");
    expect(
      screen.getByText(`Downloaded ${SUBSCRIPTION_EXPORT_FILE_NAME} with 1 subscription.`),
    ).toBeInTheDocument();
  });

  it("dismisses the filter popover with focus restoration and gives honest Add feedback", async () => {
    const user = userEvent.setup();
    render(<SubscriptionsDashboard />);
    const filterTrigger = screen.getByRole("button", { name: "Filters" });

    await user.click(filterTrigger);
    const dialog = screen.getByRole("dialog", { name: "Filter subscriptions" });
    await user.selectOptions(within(dialog).getByRole("combobox", { name: "Plan" }), "growth");
    expect(within(getSubscriptionTable()).getAllByRole("rowheader")).toHaveLength(2);
    await user.keyboard("{Escape}");
    expect(dialog).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters (1)" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Add subscription" }));
    expect(
      screen.getByText(
        "Add subscription is a non-persistent demo action. No subscription record was created.",
      ),
    ).toBeInTheDocument();
  });

  it("renders no literal null or undefined placeholders and uses fixed deterministic sources", () => {
    const { container } = render(<SubscriptionsDashboard />);
    const visibleText = container.textContent?.toLocaleLowerCase("en-US") ?? "";

    expect(visibleText).not.toContain("null");
    expect(visibleText).not.toContain("undefined");
    const subscriptionsDirectory = join(
      process.cwd(),
      "src",
      "components",
      "dashboard",
      "subscriptions",
    );
    const productionFiles = readdirSync(subscriptionsDirectory).filter(
      (fileName) => !fileName.endsWith(".test.tsx") && /\.(ts|tsx)$/.test(fileName),
    );

    for (const fileName of productionFiles) {
      const source = readFileSync(join(subscriptionsDirectory, fileName), "utf8");
      expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
    }
  });
});
