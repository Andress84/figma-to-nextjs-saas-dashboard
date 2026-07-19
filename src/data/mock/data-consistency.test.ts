import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appShellConfig } from "@/data/mock/app-shell";
import { CUSTOMERS } from "@/data/mock/customers";
import { PRODUCT_IDENTITY } from "@/data/mock/identity";
import {
  PLAN_DEFINITIONS,
  PLAN_PERFORMANCE,
  PLANS_BY_ID,
  resolvePlanBillingAmount,
} from "@/data/mock/plans";
import {
  AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT,
  CUSTOMER_ACCOUNT_TOTALS,
  GROSS_REVENUE,
  RECURRING_REVENUE,
  REPORTING_PERIOD,
  SUBSCRIPTION_FLOW,
} from "@/data/mock/reporting";
import { CUSTOMER_GROWTH_SERIES, REVENUE_SERIES } from "@/data/mock/revenue";
import { SETTINGS_DATA } from "@/data/mock/settings";
import {
  SUBSCRIPTION_RECORD_TOTAL,
  SUBSCRIPTIONS,
  SUBSCRIPTION_STATUS_SUMMARY,
} from "@/data/mock/subscriptions";
import { TRANSACTIONS } from "@/data/mock/transactions";

function total(values: readonly number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

function expectUniqueIds(records: readonly { readonly id: string }[]) {
  const ids = records.map((record) => record.id);
  expect(new Set(ids).size).toBe(ids.length);
}

describe("dashboard data consistency", () => {
  it("derives recurring revenue and active-subscription relationships", () => {
    expect(RECURRING_REVENUE.currentArr).toBe(RECURRING_REVENUE.currentMrr * 12);
    expect(RECURRING_REVENUE.previousArr).toBe(RECURRING_REVENUE.previousMrr * 12);
    expect(SUBSCRIPTION_FLOW.endingActive).toBe(
      SUBSCRIPTION_FLOW.previousActive + SUBSCRIPTION_FLOW.newPaid - SUBSCRIPTION_FLOW.churned,
    );
    expect(SUBSCRIPTION_FLOW.netGrowth).toBe(SUBSCRIPTION_FLOW.newPaid - SUBSCRIPTION_FLOW.churned);
    expect(AVERAGE_REVENUE_PER_ACTIVE_ACCOUNT).toBe(29.77);
    expect(CUSTOMER_ACCOUNT_TOTALS.newAccounts).toBe(288);
  });

  it("keeps every plan definition and performance value internally coherent", () => {
    expect(total(PLAN_PERFORMANCE.map((performance) => performance.activeSubscriptions))).toBe(
      2_846,
    );
    expect(total(PLAN_PERFORMANCE.map((performance) => performance.subscriberShare))).toBeCloseTo(
      100,
      10,
    );

    for (const performance of PLAN_PERFORMANCE) {
      expect(performance.monthlyRecurringRevenue).toBe(
        performance.activeSubscriptions * performance.plan.monthlyPrice,
      );
    }

    expect(total(PLAN_PERFORMANCE.map((performance) => performance.monthlyRecurringRevenue))).toBe(
      RECURRING_REVENUE.currentMrr,
    );

    for (const plan of PLAN_DEFINITIONS) {
      expect(plan.annualPrice).toBe(plan.monthlyPrice * 12);
    }
  });

  it("keeps approved revenue and weekly growth totals aligned with reporting summaries", () => {
    expect(total(REVENUE_SERIES.map((point) => point.currentRevenue))).toBe(GROSS_REVENUE.current);
    expect(total(REVENUE_SERIES.map((point) => point.previousRevenue))).toBe(
      GROSS_REVENUE.previous,
    );
    expect(total(CUSTOMER_GROWTH_SERIES.map((point) => point.newPaidSubscriptions))).toBe(
      SUBSCRIPTION_FLOW.newPaid,
    );
    expect(total(CUSTOMER_GROWTH_SERIES.map((point) => point.churnedSubscriptions))).toBe(
      SUBSCRIPTION_FLOW.churned,
    );
    expect(total(CUSTOMER_GROWTH_SERIES.map((point) => point.netSubscriptions))).toBe(
      SUBSCRIPTION_FLOW.netGrowth,
    );
    expect(total(CUSTOMER_GROWTH_SERIES.map((point) => point.newCustomerAccounts))).toBe(
      CUSTOMER_ACCOUNT_TOTALS.newAccounts,
    );
  });

  it("separates current subscription states from historical and table records", () => {
    const statusTotal = total(
      SUBSCRIPTION_STATUS_SUMMARY.currentStatuses.map((status) => status.count),
    );

    expect(statusTotal).toBe(3_164);
    expect(SUBSCRIPTION_STATUS_SUMMARY.currentTotal).toBe(statusTotal);
    expect(SUBSCRIPTION_STATUS_SUMMARY.historicalChurned).toBe(104);
    expect(
      SUBSCRIPTION_STATUS_SUMMARY.currentTotal + SUBSCRIPTION_STATUS_SUMMARY.historicalChurned,
    ).toBe(3_268);
    expect(SUBSCRIPTION_RECORD_TOTAL).toBe(3_268);
    expect(
      SUBSCRIPTION_STATUS_SUMMARY.currentStatuses.some(
        (status) => (status.status as string) === "canceled",
      ),
    ).toBe(false);
  });

  it("resolves transaction amounts from canonical monthly plan prices", () => {
    for (const transaction of TRANSACTIONS) {
      expect(transaction.amount).toBe(PLANS_BY_ID[transaction.planId].monthlyPrice);
    }
  });

  it("resolves subscription amounts from canonical plans and billing cycles", () => {
    for (const subscription of SUBSCRIPTIONS) {
      const amount = resolvePlanBillingAmount(subscription.planId, subscription.billingCycle);
      const plan = PLANS_BY_ID[subscription.planId];

      expect(amount).toBe(
        subscription.billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice,
      );
    }
  });

  it("keeps at-risk customer state independent from lifecycle status", () => {
    const marco = CUSTOMERS.find((customer) => customer.id === "customer-marco-ruiz");

    expect(marco).toMatchObject({ atRisk: true, status: "active" });
  });

  it("shares product, workspace, and profile identity without conflicting copies", () => {
    expect(appShellConfig.brand).toBe(PRODUCT_IDENTITY.brand);
    expect(appShellConfig.workspace).toBe(PRODUCT_IDENTITY.workspace);
    expect(appShellConfig.profile).toBe(PRODUCT_IDENTITY.profile);
    expect(SETTINGS_DATA.workspaceProfile.workspaceName).toBe(PRODUCT_IDENTITY.workspace.name);
    expect(SETTINGS_DATA.workspaceProfile.workspaceOwner).toBe(PRODUCT_IDENTITY.profile.name);
  });

  it("keeps reporting dates fixed in the approved 2026 period", () => {
    expect(REPORTING_PERIOD.startDate.startsWith("2026-")).toBe(true);
    expect(REPORTING_PERIOD.endDate.startsWith("2026-")).toBe(true);

    for (const point of [...REVENUE_SERIES, ...CUSTOMER_GROWTH_SERIES]) {
      expect(point.startDate.startsWith("2026-")).toBe(true);
      expect(point.endDate.startsWith("2026-")).toBe(true);
    }
  });

  it("does not use current-date or random data sources in mock modules", () => {
    const mockDirectory = join(process.cwd(), "src", "data", "mock");
    const mockFiles = readdirSync(mockDirectory).filter(
      (fileName) => fileName.endsWith(".ts") && !fileName.endsWith(".test.ts"),
    );

    for (const fileName of mockFiles) {
      const source = readFileSync(join(mockDirectory, fileName), "utf8");
      expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
    }
  });

  it("uses unique stable IDs within every record data set", () => {
    expectUniqueIds(PLAN_DEFINITIONS);
    expectUniqueIds(REVENUE_SERIES);
    expectUniqueIds(CUSTOMER_GROWTH_SERIES);
    expectUniqueIds(CUSTOMERS);
    expectUniqueIds(SUBSCRIPTIONS);
    expectUniqueIds(TRANSACTIONS);
  });
});
